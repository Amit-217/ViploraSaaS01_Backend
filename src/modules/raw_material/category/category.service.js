const RawMaterialCategory = require('./category.model');
const { AppError } = require('../../../common/utils/errors');

const listCategories = async (tenantId) => {
  return RawMaterialCategory.find({ tenantId }).sort({ createdAt: -1 });
};

const createCategory = async ({ tenantId, name }) => {
  const categoryName = String(name || '').trim();

  if (!categoryName) {
    throw new AppError(400, 'Category name is required.');
  }

  const existingCategory = await RawMaterialCategory.findOne({
    tenantId,
    name: categoryName,
  });

  if (existingCategory) {
    throw new AppError(409, 'A category with this name already exists in this tenant.');
  }

  return RawMaterialCategory.create({
    tenantId,
    name: categoryName,
    isActive: true,
  });
};

const getCategoryById = async (id, tenantId) => {
  return RawMaterialCategory.findOne({ _id: id, tenantId });
};

const updateCategoryById = async (id, tenantId, payload) => {
  const category = await RawMaterialCategory.findOne({ _id: id, tenantId });

  if (!category) {
    return null;
  }

  if (payload.name !== undefined) {
    const nextName = String(payload.name || '').trim();

    if (!nextName) {
      throw new AppError(400, 'Category name is required.');
    }

    const duplicate = await RawMaterialCategory.findOne({
      tenantId,
      name: nextName,
      _id: { $ne: category._id },
    });

    if (duplicate) {
      throw new AppError(409, 'A category with this name already exists in this tenant.');
    }

    category.name = nextName;
  }

  if (payload.isActive !== undefined) {
    category.isActive = Boolean(payload.isActive);
  }

  await category.save();
  return category;
};

const deleteCategoryById = async (id, tenantId) => {
  const category = await RawMaterialCategory.findOne({ _id: id, tenantId });

  if (!category) {
    return null;
  }

  category.isActive = false;
  await category.save();
  return category;
};

module.exports = {
  listCategories,
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
