const { z } = require('zod');

const otpSchema = z.string().trim().regex(/^\d{6}$/, 'OTP must be a 6-digit number');

const passwordConfirmation = (passwordField, confirmField) =>
  z.object({
    [passwordField]: z.string().min(8, 'Password must be at least 8 characters'),
    [confirmField]: z.string().min(8, 'Confirmation must be at least 8 characters'),
  }).superRefine((data, ctx) => {
    if (data[passwordField] && data[confirmField] && data[passwordField] !== data[confirmField]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [confirmField],
        message: 'Password confirmation does not match.',
      });
    }
  });

const registerValidation = z.object({
  name: z.string().trim().min(2, 'Company name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid company email'),
});

const verifyEmailValidation = z.object({
  email: z.string().trim().email('Enter a valid email'),
  otp: otpSchema,
  purpose: z.string().optional(),
});

const adminEmailValidation = z.object({
  email: z.string().trim().email('Enter a valid email').optional(),
  adminEmail: z.string().trim().email('Enter a valid admin email').optional(),
  otp: otpSchema.optional(),
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().trim().optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmPassword: z.string().min(8, 'Confirmation must be at least 8 characters').optional(),
  companyEmail: z.string().trim().email('Enter a valid company email').optional(),
}).superRefine((data, ctx) => {
  if (!data.email && !data.adminEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['email'],
      message: 'An email or adminEmail field is required.',
    });
  }

  if ((data.password || data.confirmPassword) && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Password confirmation does not match.',
    });
  }
});

const loginValidation = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const refreshTokenValidation = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const forgotPasswordValidation = z.object({
  email: z.string().trim().email('Enter a valid email'),
});

const resetPasswordValidation = passwordConfirmation('newPassword', 'confirmPassword').extend({
  email: z.string().trim().email('Enter a valid email'),
  otp: otpSchema,
});

const resendOtpValidation = z.object({
  email: z.string().trim().email('Enter a valid email'),
  purpose: z.enum([
    'company_email_verification',
    'admin_email_verification',
    'employee_email_verification',
    'password_reset',
  ]),
});

module.exports = {
  registerValidation,
  verifyEmailValidation,
  adminEmailValidation,
  loginValidation,
  refreshTokenValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  resendOtpValidation,
};
