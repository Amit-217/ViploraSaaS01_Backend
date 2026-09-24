const { asyncHandler } = require('../../../common/utils/errors');
const { sendSuccess, sendError } = require('../../../common/utils/response');
const {
  listCategories: listCategoriesService,
  createCategory: createCategoryService,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require('./category.service');

const createCategoryHandler = asyncHandler(async (req, res) => {
  const category = await createCategoryService({
    tenantId: req.user.tenantId,
    name: req.body.name,
  });

  return sendSuccess(res, 201, 'Category created successfully.', category);
});

const listCategory = asyncHandler(async (req, res) => {
  const categories = await listCategoriesService(req.user.tenantId);
  return sendSuccess(res, 200, 'Categories retrieved successfully.', categories);
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await getCategoryById(req.params.id, req.user.tenantId);

  if (!category) {
    return sendError(res, 404, 'Category not found.');
  }

  return sendSuccess(res, 200, 'Category retrieved successfully.', category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await updateCategoryById(req.params.id, req.user.tenantId, req.body);

  if (!category) {
    return sendError(res, 404, 'Category not found.');
  }

  return sendSuccess(res, 200, 'Category updated successfully.', category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await deleteCategoryById(req.params.id, req.user.tenantId);

  if (!category) {
    return sendError(res, 404, 'Category not found.');
  }

  return sendSuccess(res, 200, 'Category deactivated successfully.', category);
});

module.exports = {
  createCategory: createCategoryHandler,
  listCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
