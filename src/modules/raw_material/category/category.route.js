const express = require('express');
const authenticate = require('../../../common/middlewares/authenticate');
const {
  createCategory,
  listCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('./category.controller');
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require('./category.validation');

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Validation failed';
    return res.status(400).json({
      success: false,
      message,
    });
  }

  req.body = result.data;
  return next();
};

router.use(authenticate);
router.get('/', listCategory);
router.post('/', validate(createCategoryValidation), createCategory);
router.get('/:id', getCategory);
router.patch('/:id', validate(updateCategoryValidation), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
