const { asyncHandler } = require('../../../common/utils/errors');
const { sendSuccess, sendError } = require('../../../common/utils/response');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerTenant(req.body);
  return sendSuccess(res, 201, result.message, result);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyTenantEmail(req.body);
  return sendSuccess(res, 200, result.message, result);
});

const sendAdminEmailVerification = asyncHandler(async (req, res) => {
  const result = await authService.sendAdminEmailOtp(req.body);
  return sendSuccess(res, 200, result.message, result);
});

const verifyAdminEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyAdminEmail(req.body);
  return sendSuccess(res, 200, result.message, result);
});

const registerAdmin = asyncHandler(async (req, res) => {
  const result = await authService.registerAdminAndTenant(req.body);
  return sendSuccess(res, 201, result.message, result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  return sendSuccess(res, 200, 'Login successful.', result);
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshUserToken(req.body);
  return sendSuccess(res, 200, 'Token refreshed successfully.', result);
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logoutUser(req.user.userId);
  return sendSuccess(res, 200, result.message, result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  return sendSuccess(res, 200, result.message, result);
});

const verifyResetOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyResetOtp(req.body);
  return sendSuccess(res, 200, result.message, result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  return sendSuccess(res, 200, result.message, result);
});

const resendOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendOtp(req.body);
  return sendSuccess(res, 200, result.message, result);
});

module.exports = {
  register,
  verifyEmail,
  sendAdminEmailVerification,
  verifyAdminEmail,
  registerAdmin,
  login,
  refreshToken,
  logout,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  resendOtp,
};
