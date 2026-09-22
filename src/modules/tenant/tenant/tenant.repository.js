const Tenant = require('./tenant.model');

const createTenant = async (payload) => Tenant.create(payload);

const findTenantById = async (id) => Tenant.findById(id);

const findTenantByEmail = async (email) => Tenant.findOne({ email: String(email).trim().toLowerCase() });

const findTenantByTenantId = async (tenantId) => Tenant.findOne({ tenantId });

const updateTenant = async (tenantId, payload) =>
  Tenant.findOneAndUpdate({ tenantId }, payload, { new: true, runValidators: true });

module.exports = {
  createTenant,
  findTenantById,
  findTenantByEmail,
  findTenantByTenantId,
  updateTenant,
};
