const sanitizeUser = (user) => {
  if (!user) return null;

  return {
    userId: user.userId,
    tenantId: user.tenantId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    status: user.status,
    createdAt: user.createdAt,
  };
};

module.exports = {
  sanitizeUser,
};
