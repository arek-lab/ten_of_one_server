const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = token => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const shortExp = 1000 * 60 * 5;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: new Date(Date.now() + shortExp),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    maxAge: new Date(Date.now() + longerExp),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
