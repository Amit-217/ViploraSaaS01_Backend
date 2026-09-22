const User = require('./user.model');
const { AppError } = require('../../../common/utils/errors');
const { normalizeEmail, hashPassword, comparePassword } = require('../../../common/utils/helpers');
const { generateReadableId } = require('../../../common/utils/idGenerator');
const { sendEmailVerificationOTP } = require('../auth/auth.util');
const { generateOtp } = require('../../../common/utils/helpers');

const createEmployee = async ({ firstName, lastName, email, password, confirmPassword, tenantId }) => {
  const normalizedEmail = normalizeEmail(email);
  const name = String(firstName).trim();
  const last = String(lastName || '').trim();

  if (!name || name.length < 2) {
    throw new AppError(400, 'First name is required.');
  }

  if (!password || !confirmPassword || password !== confirmPassword) {
    throw new AppError(400, 'Password confirmation does not match.');
  }

  const existingUser = await User.findOne({ email: normalizedEmail, tenantId });
  if (existingUser) {
    throw new AppError(409, 'A user with this email already exists in this tenant.');
  }

  const userId = await generateReadableId('USR');
  const hashedPassword = await hashPassword(password);
  const otp = generateOtp(Number(process.env.OTP_LENGTH || 6));
  const user = await User.create({
    userId,
    tenantId,
    firstName: name,
    lastName: last,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'employee',
    emailVerified: false,
    status: 'active',
    otp: await require('bcryptjs').hash(otp, 10),
    otpPurpose: 'employee_email_verification',
    otpExpiresAt: new Date(Date.now() + (Number(process.env.OTP_EXPIRY || 10) * 60 * 1000)),
  });

  await sendEmailVerificationOTP({ email: normalizedEmail, otp, purpose: 'employee email verification' });

  return {
    userId: user.userId,
    email: user.email,
    message: 'Employee created. Please verify the employee email.',
  };
};

const listUsersForTenant = async (tenantId) => User.find({ tenantId }).sort({ createdAt: -1 });

const getUserByIdForTenant = async (id, tenantId) => {
  const user = await User.findById(id);
  if (!user || user.tenantId !== tenantId) {
    return null;
  }
  return user;
};

const updateUserByIdForTenant = async (id, tenantId, payload) => {
  const user = await User.findById(id);
  if (!user || user.tenantId !== tenantId) {
    return null;
  }

  const allowedUpdates = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email ? normalizeEmail(payload.email) : undefined,
    status: payload.status,
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] !== undefined) {
      user[key] = allowedUpdates[key];
    }
  });

  if (payload.password) {
    if (!payload.confirmPassword || payload.password !== payload.confirmPassword) {
      throw new AppError(400, 'Password confirmation does not match.');
    }
    user.password = await hashPassword(payload.password);
  }

  if (payload.email) {
    const duplicate = await User.findOne({ email: normalizeEmail(payload.email), tenantId, _id: { $ne: user._id } });
    if (duplicate) {
      throw new AppError(409, 'A user with this email already exists in this tenant.');
    }
    user.emailVerified = false;
  }

  await user.save();
  return user;
};

const deleteUserByIdForTenant = async (id, tenantId) => {
  const user = await User.findById(id);
  if (!user || user.tenantId !== tenantId) {
    return null;
  }

  user.status = 'inactive';
  await user.save();
  return user;
};

module.exports = {
  createEmployee,
  listUsersForTenant,
  getUserByIdForTenant,
  updateUserByIdForTenant,
  deleteUserByIdForTenant,
};
