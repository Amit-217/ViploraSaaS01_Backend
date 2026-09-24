const express = require('express');
const authenticate = require('../../../common/middlewares/authenticate');
const {
  createMaterial,
  listMaterials,
  getMaterial,
  updateMaterial,
  deleteMaterial,
} = require('./raw.material.controller');
const {
  createRawMaterialValidation,
  updateRawMaterialValidation,
} = require('./raw.material.validation');

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
router.get('/', listMaterials);
router.post('/', validate(createRawMaterialValidation), createMaterial);
router.get('/:id', getMaterial);
router.patch('/:id', validate(updateRawMaterialValidation), updateMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router;
