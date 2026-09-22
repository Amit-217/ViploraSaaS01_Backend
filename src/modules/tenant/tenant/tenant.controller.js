const { createTenantRecord, getTenantByContext } = require('./tenant.service');
const { sendSuccess, sendError } = require('../../../common/utils/response');
const { asyncHandler } = require('../../../common/utils/errors');

const createTenant = asyncHandler(async (req, res) => {
  const tenant = await createTenantRecord(req.body);
  return sendSuccess(res, 201, 'Tenant created successfully.', tenant);
});

const getCurrentTenant = asyncHandler(async (req, res) => {
  const tenant = await getTenantByContext(req.user.tenantId);
  if (!tenant) {
    return sendError(res, 404, 'Tenant not found.');
  }

  return sendSuccess(res, 200, 'Tenant retrieved successfully.', tenant);
});

module.exports = {
  createTenant,
  getCurrentTenant,
};
