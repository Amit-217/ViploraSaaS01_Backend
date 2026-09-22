const { asyncHandler } = require('../../../common/utils/errors');
const { sendSuccess, sendError } = require('../../../common/utils/response');
const { createEmployee, listUsersForTenant, getUserByIdForTenant, updateUserByIdForTenant, deleteUserByIdForTenant } = require('./user.service');
const { sanitizeUser } = require('./user.util');

const createUser = asyncHandler(async (req, res) => {
  const payload = await createEmployee({
    ...req.body,
    tenantId: req.user.tenantId,
  });

  return sendSuccess(res, 201, payload.message, payload);
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await listUsersForTenant(req.user.tenantId);
  return sendSuccess(res, 200, 'Users retrieved successfully.', users.map(sanitizeUser));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdForTenant(req.params.id, req.user.tenantId);
  if (!user) {
    return sendError(res, 404, 'User not found.');
  }

  return sendSuccess(res, 200, 'User retrieved successfully.', sanitizeUser(user));
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserByIdForTenant(req.params.id, req.user.tenantId, req.body);
  if (!user) {
    return sendError(res, 404, 'User not found.');
  }

  return sendSuccess(res, 200, 'User updated successfully.', sanitizeUser(user));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await deleteUserByIdForTenant(req.params.id, req.user.tenantId);
  if (!user) {
    return sendError(res, 404, 'User not found.');
  }

  return sendSuccess(res, 200, 'User deactivated successfully.', sanitizeUser(user));
});

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
