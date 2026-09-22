const express = require('express');
const authController = require('./auth.controller');
const authenticate = require('../../../common/middlewares/authenticate');
const { registerValidation, verifyEmailValidation, adminEmailValidation, loginValidation, refreshTokenValidation, forgotPasswordValidation, resetPasswordValidation, resendOtpValidation } = require('./auth.validation');

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Validation failed';
    return res.status(400).json({
      success: false,
      message,
    });
  }

  req.body = result.data;
  return next();
};

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a tenant with a company email
 *     responses:
 *       201:
 *         description: Registration started
 */
router.post('/register', validate(registerValidation), authController.register);
router.post('/verify-email', validate(verifyEmailValidation), authController.verifyEmail);
router.post('/verify-admin-email', validate(adminEmailValidation), authController.verifyAdminEmail);
router.post('/register-admin', validate(adminEmailValidation), authController.registerAdmin);
router.post('/finalize-registration', validate(adminEmailValidation), authController.registerAdmin);
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh-token', validate(refreshTokenValidation), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', validate(forgotPasswordValidation), authController.forgotPassword);
router.post('/verify-reset-otp', validate(verifyEmailValidation), authController.verifyResetOtp);
router.post('/reset-password', validate(resetPasswordValidation), authController.resetPassword);
router.post('/resend-otp', validate(resendOtpValidation), authController.resendOtp);

module.exports = router;
