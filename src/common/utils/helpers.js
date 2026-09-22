const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const generateOtp = (length = 6) => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i += 1) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
};

const hashPassword = async (password) => bcrypt.hash(password, 10);

const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'development-access-secret', {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  });

const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'development-refresh-secret', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  });

module.exports = {
  normalizeEmail,
  generateOtp,
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
};
