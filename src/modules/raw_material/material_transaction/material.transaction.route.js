const express = require('express');
const authenticate = require('../../../common/middlewares/authenticate');
const {
  createTransaction,
  listTransactions,
  getTransaction,
  deleteTransaction,
} = require('./material.transaction.controller');
const {
  createMaterialTransactionValidation,
  updateMaterialTransactionValidation,
} = require('./material.transaction.validation');

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Validation failed';
    return res.status(400).json({ success: false, message });
  }

  req.body = result.data;
  return next();
};

router.use(authenticate);
router.get('/', listTransactions);
router.post('/', validate(createMaterialTransactionValidation), createTransaction);
router.get('/:id', getTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
