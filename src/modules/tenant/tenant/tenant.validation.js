const { z } = require('zod');

const registerTenantValidation = z.object({
  name: z.string().trim().min(2, 'Company name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid company email'),
});

const verifyTenantEmailValidation = z.object({
  email: z.string().trim().email('Enter a valid email'),
  otp: z.string().trim().regex(/^\d{6}$/, 'OTP must be a 6-digit number'),
});

module.exports = {
  registerTenantValidation,
  verifyTenantEmailValidation,
};
