const sanitizeTenant = (tenant) => {
  if (!tenant) return null;

  return {
    tenantId: tenant.tenantId,
    name: tenant.name,
    email: tenant.email,
    emailVerified: tenant.emailVerified,
    status: tenant.status,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
  };
};

module.exports = {
  sanitizeTenant,
};
