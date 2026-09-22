const Counter = require('../models/counterModel');

const generateReadableId = async (prefix) => {
  const sequence = await Counter.getNextSequence(prefix);
  return `${prefix}-${String(sequence).padStart(6, '0')}`;
};

module.exports = {
  generateReadableId,
};
