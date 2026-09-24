const { asyncHandler } = require('../../../common/utils/errors');
const { sendSuccess, sendError } = require('../../../common/utils/response');
const {
  listMaterialTransactions,
  createMaterialTransaction,
  getMaterialTransactionById,
  deleteMaterialTransactionById,
} = require('./material.transaction.service');

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await createMaterialTransaction({
    tenantId: req.user.tenantId,
    createdBy: req.user.userId,
    ...req.body,
  });

  return sendSuccess(res, 201, 'Material transaction created successfully.', transaction);
});

const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await listMaterialTransactions(req.user.tenantId, req.query);
  return sendSuccess(res, 200, 'Material transactions retrieved successfully.', transactions);
});

const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await getMaterialTransactionById(req.params.id, req.user.tenantId);

  if (!transaction) {
    return sendError(res, 404, 'Transaction not found.');
  }

  return sendSuccess(res, 200, 'Material transaction retrieved successfully.', transaction);
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await deleteMaterialTransactionById(req.params.id, req.user.tenantId);

  if (!transaction) {
    return sendError(res, 404, 'Transaction not found.');
  }

  return sendSuccess(res, 200, 'Material transaction deleted successfully.', transaction);
});

module.exports = {
  createTransaction,
  listTransactions,
  getTransaction,
  deleteTransaction,
};
