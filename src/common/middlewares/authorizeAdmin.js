const { sendError } = require('../utils/response');

const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 403, 'Access denied. Admin role required.');
  }

  return next();
};

module.exports = authorizeAdmin;
