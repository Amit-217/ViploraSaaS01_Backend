const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '').trim() : null;

    if (!token) {
      return sendError(res, 401, 'Authentication token is required.');
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'development-access-secret');

    req.user = {
      userId: payload.userId,
      tenantId: payload.tenantId,
      role: payload.role,
      email: payload.email,
    };

    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token.');
  }
};

module.exports = authenticate;
