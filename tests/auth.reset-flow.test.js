const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const authService = require('../src/modules/tenant/auth/auth.service');
const User = require('../src/modules/tenant/users/user.model');

test('verify reset OTP keeps a reset verification state for the next reset-password step', async () => {
  const originalFindOne = User.findOne;
  const fakeUser = {
    email: 'admin@acme.com',
    otp: await bcrypt.hash('123456', 10),
    otpPurpose: 'password_reset',
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    otpAttempts: 0,
    passwordResetVerified: false,
    passwordResetVerifiedAt: null,
    async save() {
      return true;
    },
  };

  User.findOne = async () => fakeUser;

  try {
    const result = await authService.verifyResetOtp({ email: 'admin@acme.com', otp: '123456' });
    assert.equal(result.message.includes('OTP verified successfully'), true);
    assert.equal(fakeUser.passwordResetVerified, true);
    assert.ok(fakeUser.passwordResetVerifiedAt instanceof Date);
  } finally {
    User.findOne = originalFindOne;
  }
});
