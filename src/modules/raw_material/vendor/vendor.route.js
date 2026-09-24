const express = require('express');
const authenticate = require('../../../common/middlewares/authenticate');
const {
  createVendor,
  listVendor,
  getVendor,
  updateVendor,
  deleteVendor,
} = require('./vendor.controller');
const {
  createVendorValidation,
  updateVendorValidation,
} = require('./vendor.validation');

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
router.get('/', listVendor);
router.post('/', validate(createVendorValidation), createVendor);
router.get('/:id', getVendor);
router.patch('/:id', validate(updateVendorValidation), updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
