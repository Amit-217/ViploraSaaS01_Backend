module.exports = {
  tag: 'Auth',
  paths: {
    '/api/auth/register': 'Register a company and start verification',
    '/api/auth/verify-email': 'Verify a tenant or employee email OTP',
    '/api/auth/verify-admin-email': 'Verify the admin email OTP',
    '/api/auth/login': 'Login using a tenant user account',
    '/api/auth/refresh-token': 'Refresh an expired access token',
    '/api/auth/logout': 'Revoke the current refresh token',
    '/api/auth/forgot-password': 'Send a reset password OTP',
    '/api/auth/reset-password': 'Reset a password after OTP verification',
    '/api/auth/resend-otp': 'Resend the current OTP for a given purpose',
  },
};
