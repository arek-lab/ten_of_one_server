const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
  register,
  login,
  logout,
  verifyEmail,
  resetPassword,
  forgotPassword,
  refreshToken,
} = require('../controllers/authController');
const { auth } = require('../utils/nodemailerConfig');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);
// router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/refresh-token', refreshToken);

module.exports = router;
