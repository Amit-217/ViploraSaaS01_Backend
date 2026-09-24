const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../users/user.model');
const Tenant = require('../tenant/tenant.model');
const { AppError } = require('../../../common/utils/errors');
const {
  normalizeEmail,
  comparePassword,
  hashPassword,
  generateOtp,
  signAccessToken,
  signRefreshToken,
} = require('../../../common/utils/helpers');
const { generateReadableId } = require('../../../common/utils/idGenerator');
const { sendEmailVerificationOTP, sendPasswordResetOTP } = require('./auth.util');
const { OTP_PURPOSES } = require('./auth.constant');

const OTP_TTL = Number(process.env.OTP_EXPIRY || 10) * 60 * 1000;

const clearOtpData = (record) => {
  record.otp = null;
  record.otpPurpose = null;
  record.otpExpiresAt = null;
  record.otpAttempts = 0;
};

const createOtpRecord = async (record, purpose, otp) => {
  record.otp = await bcrypt.hash(otp, 10);
  record.otpPurpose = purpose;
  record.otpExpiresAt = new Date(Date.now() + OTP_TTL);
  record.otpAttempts = 0;
  await record.save();
};

const verifyOtpForRecord = async (record, otp, purpose) => {
  if (!record || !record.otp || !record.otpExpiresAt) {
    throw new AppError(400, 'OTP is invalid or expired.');
  }

  if (record.otpPurpose !== purpose) {
    throw new AppError(400, 'OTP purpose mismatch.');
  }

  if (new Date(record.otpExpiresAt).getTime() < Date.now()) {
    clearOtpData(record);
    await record.save();
    throw new AppError(400, 'OTP has expired.');
  }

  const isValid = await bcrypt.compare(otp, record.otp);

  if (!isValid) {
    record.otpAttempts = Number(record.otpAttempts || 0) + 1;
    await record.save();
    throw new AppError(400, 'Invalid OTP.');
  }

  return true;
};

const registerTenant = async ({ name, email }) => {
  const tenantEmail = normalizeEmail(email);
  const normalizedName = String(name).trim();

  if (!normalizedName || normalizedName.length < 2) {
    throw new AppError(400, 'Company name is required.');
  }

  const existingTenant = await Tenant.findOne({ email: tenantEmail });
  if (existingTenant) {
    throw new AppError(409, 'A tenant with this email already exists.');
  }

  const tenantId = await generateReadableId('TEN');
  const otp = generateOtp(Number(process.env.OTP_LENGTH || 6));
  const tenant = await Tenant.create({
    tenantId,
    name: normalizedName,
    email: tenantEmail,
    emailVerified: false,
    status: 'pending',
  });

  await createOtpRecord(tenant, OTP_PURPOSES.COMPANY_EMAIL_VERIFICATION, otp);
  await sendEmailVerificationOTP({ email: tenantEmail, otp, purpose: 'company email verification' });

  return {
    tenantId: tenant.tenantId,
    email: tenant.email,
    message: 'Registration started. Please verify your company email.',
  };
};

const verifyTenantEmail = async ({ email, otp, purpose = OTP_PURPOSES.COMPANY_EMAIL_VERIFICATION }) => {
  const normalizedEmail = normalizeEmail(email);
  const tenant = await Tenant.findOne({ email: normalizedEmail });

  if (purpose === OTP_PURPOSES.COMPANY_EMAIL_VERIFICATION || purpose === OTP_PURPOSES.ADMIN_EMAIL_VERIFICATION) {
    if (!tenant) {
      throw new AppError(400, 'Invalid verification request.');
    }

    await verifyOtpForRecord(tenant, otp, purpose);

    if (purpose === OTP_PURPOSES.COMPANY_EMAIL_VERIFICATION) {
      tenant.emailVerified = true;
      tenant.status = 'active';
      await tenant.save();
    } else {
      tenant.adminEmail = normalizedEmail;
      tenant.adminEmailVerified = true;
      await tenant.save();
    }

    return {
      tenantId: tenant.tenantId,
      message: 'Email verified successfully.',
    };
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new AppError(400, 'Invalid verification request.');
  }

  await verifyOtpForRecord(user, otp, purpose);
  user.emailVerified = true;
  await user.save();

  return {
    userId: user.userId,
    message: 'Email verified successfully.',
  };
};

const sendAdminEmailOtp = async ({ companyEmail, email }) => {
  const normalizedCompanyEmail = normalizeEmail(companyEmail);
  const normalizedAdminEmail = normalizeEmail(email);
  const tenant = await Tenant.findOne({ email: normalizedCompanyEmail });

  if (!tenant) {
    throw new AppError(400, 'Tenant not found for admin verification.');
  }

  tenant.adminEmail = normalizedAdminEmail;
  tenant.adminEmailVerified = false;
  await tenant.save();

  const otp = generateOtp(Number(process.env.OTP_LENGTH || 6));
  await createOtpRecord(tenant, OTP_PURPOSES.ADMIN_EMAIL_VERIFICATION, otp);
  await sendEmailVerificationOTP({ email: normalizedAdminEmail, otp, purpose: 'admin email verification' });

  return {
    message: 'Admin email verification OTP sent.',
  };
};

const verifyAdminEmail = async ({ companyEmail, email, otp }) => {
  const normalizedCompanyEmail = normalizeEmail(companyEmail);
  const normalizedAdminEmail = normalizeEmail(email);
  const tenant = await Tenant.findOne({ email: normalizedCompanyEmail });

  if (!tenant) {
    throw new AppError(400, 'Tenant not found for admin verification.');
  }

  if (tenant.adminEmail && tenant.adminEmail !== normalizedAdminEmail) {
    tenant.adminEmail = normalizedAdminEmail;
  }

  await verifyOtpForRecord(tenant, otp, OTP_PURPOSES.ADMIN_EMAIL_VERIFICATION);
  tenant.adminEmail = normalizedAdminEmail;
  tenant.adminEmailVerified = true;
  await tenant.save();

  return {
    message: 'Admin email verified successfully.',
  };
};

const registerAdminAndTenant = async ({
  companyName,
  companyEmail,
  tenantEmail,
  firstName,
  lastName = '',
  adminEmail,
  email,
  password,
  confirmPassword,
}) => {
  const resolvedCompanyEmail = normalizeEmail(companyEmail || tenantEmail);
  const resolvedAdminEmail = normalizeEmail(adminEmail || email);
  const normalizedCompanyEmail = resolvedCompanyEmail;
  const normalizedAdminEmail = resolvedAdminEmail;
  const tenant = await Tenant.findOne({ email: normalizedCompanyEmail });

  if (!tenant) {
    throw new AppError(404, 'Tenant not found.');
  }

  if (!tenant.emailVerified) {
    throw new AppError(400, 'Company email must be verified before creating the admin account.');
  }

  if (!password || !confirmPassword || password !== confirmPassword) {
    throw new AppError(400, 'Password confirmation does not match.');
  }

  if (normalizedAdminEmail !== normalizedCompanyEmail && !tenant.adminEmailVerified) {
    throw new AppError(400, 'Admin email must be verified before completing registration.');
  }

  const userExists = await User.findOne({ email: normalizedAdminEmail });
  if (userExists) {
    throw new AppError(409, 'An account with this admin email already exists.');
  }

  const passwordHash = await hashPassword(password);
  const session = await mongoose.startSession();

  try {
    let tenantRecord = tenant;
    let createdUser = null;

    await session.withTransaction(async () => {
      tenantRecord.name = String(companyName).trim();
      tenantRecord.email = normalizedCompanyEmail;
      tenantRecord.emailVerified = true;
      tenantRecord.status = 'active';
      tenantRecord.adminEmail = normalizedAdminEmail;
      tenantRecord.adminEmailVerified = true;
      await tenantRecord.save({ session });

      const userId = await generateReadableId('USR');
      createdUser = await User.create([
        {
          userId,
          tenantId: tenantRecord.tenantId,
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          email: normalizedAdminEmail,
          password: passwordHash,
          role: 'admin',
          emailVerified: true,
          status: 'active',
        },
      ], { session });
    });

    return {
      tenantId: tenantRecord.tenantId,
      userId: createdUser?.[0]?.userId || null,
      message: 'Registration completed successfully.',
    };
  } finally {
    await session.endSession();
  }
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password.');
  }

  if (user.status !== 'active') {
    throw new AppError(403, 'Account is inactive.');
  }

  if (!user.emailVerified) {
    throw new AppError(403, 'Email is not verified.');
  }

  const accessToken = signAccessToken({
    userId: user.userId,
    tenantId: user.tenantId,
    role: user.role,
    email: user.email,
  });

  const refreshToken = signRefreshToken({
    userId: user.userId,
    tenantId: user.tenantId,
    role: user.role,
  });

  user.refreshTokenHash = await hashPassword(refreshToken);
  user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();

  return {
    user: {
      userId: user.userId,
      tenantId: user.tenantId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      status: user.status,
    },
    accessToken,
    refreshToken,
  };
};

const refreshUserToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new AppError(401, 'Refresh token is required.');
  }

  let matchedUser = null;
  const users = await User.find({ refreshTokenHash: { $ne: null } });

  for (const user of users) {
    if (await comparePassword(refreshToken, user.refreshTokenHash)) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) {
    throw new AppError(401, 'Invalid refresh token.');
  }

  if (new Date(matchedUser.refreshTokenExpiresAt).getTime() < Date.now()) {
    matchedUser.refreshTokenHash = null;
    matchedUser.refreshTokenExpiresAt = null;
    await matchedUser.save();
    throw new AppError(401, 'Refresh token expired.');
  }

  const newAccessToken = signAccessToken({
    userId: matchedUser.userId,
    tenantId: matchedUser.tenantId,
    role: matchedUser.role,
    email: matchedUser.email,
  });

  const newRefreshToken = signRefreshToken({
    userId: matchedUser.userId,
    tenantId: matchedUser.tenantId,
    role: matchedUser.role,
  });

  matchedUser.refreshTokenHash = await hashPassword(newRefreshToken);
  matchedUser.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await matchedUser.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (userId) => {
  const user = await User.findOne({ userId });
  if (!user) return { message: 'Logged out successfully.' };

  user.refreshTokenHash = null;
  user.refreshTokenExpiresAt = null;
  await user.save();

  return { message: 'Logged out successfully.' };
};

const forgotPassword = async ({ email }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return { message: 'If an account exists, a password reset OTP has been sent.' };
  }

  const otp = generateOtp(Number(process.env.OTP_LENGTH || 6));
  await createOtpRecord(user, OTP_PURPOSES.PASSWORD_RESET, otp);
  await sendPasswordResetOTP({ email: user.email, otp });

  return { message: 'If an account exists, a password reset OTP has been sent.' };
};

const verifyResetOtp = async ({ email, otp }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError(400, 'Invalid reset request.');
  }

  await verifyOtpForRecord(user, otp, OTP_PURPOSES.PASSWORD_RESET);

  return { message: 'OTP verified successfully.' };
};

const resetPassword = async ({ email, otp, newPassword, confirmPassword }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError(400, 'Invalid reset request.');
  }

  if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
    throw new AppError(400, 'Password confirmation does not match.');
  }

await verifyOtpForRecord(user, otp, OTP_PURPOSES.PASSWORD_RESET);

user.password = await hashPassword(newPassword);
user.refreshTokenHash = null;
user.refreshTokenExpiresAt = null;

clearOtpData(user);

await user.save();

  

  return { message: 'Password reset successfully.' };


};

const resendOtp = async ({ email, purpose }) => {
  const normalizedEmail = normalizeEmail(email);
  const tenant = await Tenant.findOne({ email: normalizedEmail });
  const user = await User.findOne({ email: normalizedEmail });

  const record = purpose === OTP_PURPOSES.COMPANY_EMAIL_VERIFICATION || purpose === OTP_PURPOSES.ADMIN_EMAIL_VERIFICATION
    ? tenant
    : user;

  if (!record) {
    return { message: 'If an account exists, a new OTP has been sent.' };
  }

  const otp = generateOtp(Number(process.env.OTP_LENGTH || 6));
  await createOtpRecord(record, purpose, otp);

  if (purpose === OTP_PURPOSES.PASSWORD_RESET) {
    await sendPasswordResetOTP({ email: normalizedEmail, otp });
  } else {
    await sendEmailVerificationOTP({ email: normalizedEmail, otp, purpose });
  }

  return { message: 'OTP resent successfully.' };
};

module.exports = {
  registerTenant,
  verifyTenantEmail,
  sendAdminEmailOtp,
  verifyAdminEmail,
  registerAdminAndTenant,
  loginUser,
  refreshUserToken,
  logoutUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  resendOtp,
};
