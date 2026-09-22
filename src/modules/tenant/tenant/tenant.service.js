const Tenant = require('./tenant.model');
const { AppError } = require('../../../common/utils/errors');
const { normalizeEmail } = require('../../../common/utils/helpers');

const createTenantRecord = async ({ name, email }) => {
  const normalizedEmail = normalizeEmail(email);
  const tenant = await Tenant.findOne({ email: normalizedEmail });

  if (tenant) {
    throw new AppError(409, 'Tenant already exists.');
  }

  return Tenant.create({
    name: String(name).trim(),
    email: normalizedEmail,
    status: 'pending',
    emailVerified: false,
  });
};

const getTenantByContext = async (tenantId) => Tenant.findOne({ tenantId });

module.exports = {
  createTenantRecord,
  getTenantByContext,
};
