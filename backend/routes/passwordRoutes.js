const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require('../controllers/passwordResetController');

// @desc    Send password reset email
// @route   POST /api/users/forgot-password
// @access  Public
router.post('/forgot-password', forgotPassword);

// @desc    Reset password with token
// @route   PUT /api/users/reset-password/:token
// @access  Public
router.put('/reset-password/:token', resetPassword);

// @desc    Verify reset token
// @route   GET /api/users/verify-reset-token/:token
// @access  Public
router.get('/verify-reset-token/:token', verifyResetToken);

module.exports = router;