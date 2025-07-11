const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  isTokenValid,
} = require('../utils');
const crypto = require('crypto');

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }
  // first registered user is an admin why not ;)
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await User.create({
    email,
    password,
    role,
    verificationToken,
  });

  const origin = 'http://localhost:3000';

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: 'Z uwagi na charakter projektu, proces rejesrtacji jest limitowany. Na podany email otrzymasz informację zwrotną.',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError(
      'Email is not verify verified yet'
    );
  }
  const tokenUser = createTokenUser(user);

  let refreshToken = '';

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid)
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = {
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  };
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    throw new CustomError.UnauthenticatedError('Brak refresh tokena');
  }

  try {
    const payload = isTokenValid(refreshToken);
    console.log(payload);
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken.isValid) {
      throw new CustomError.UnauthenticatedError('Nieprawidłowy refresh token');
    }
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    res.status(200).json({ msg: 'Access token odświeżony' });
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Błąd autoryzacji');
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Please provide valid email');
  }
  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex');

    const origin = process.env.FRONTEND_ORIGIN;
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const expTime = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + expTime);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' });
};

const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  if (!token || !email || !password) {
    throw new CustomError.BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.status(StatusCodes.OK).json({
    msg: 'Password reset successful, you can now login with your new password.',
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError.UnauthenticatedError('Verification Failed');

  if (user.verificationToken !== verificationToken)
    throw new CustomError.UnauthenticatedError('Verification Failed');

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = '';
  await user.save();
  // res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
  res.redirect(`${process.env.FRONTEND_ORIGIN}/user/login`);
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
};
