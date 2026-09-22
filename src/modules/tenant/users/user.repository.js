const User = require('./user.model');

const createUser = async (payload) => User.create(payload);

const findUserById = async (id) => User.findById(id);

const findUserByEmail = async (email) => User.findOne({ email: String(email).trim().toLowerCase() });

const findUsersByTenant = async (tenantId) => User.find({ tenantId }).sort({ createdAt: -1 });

const updateUser = async (id, payload) =>
  User.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

const updateUserByUserId = async (userId, payload) =>
  User.findOneAndUpdate({ userId }, payload, { new: true, runValidators: true });

const findUserByUserId = async (userId) => User.findOne({ userId });

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findUsersByTenant,
  updateUser,
  updateUserByUserId,
  findUserByUserId,
};
