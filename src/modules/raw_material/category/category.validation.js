const { z } = require('zod');

const createCategoryValidation = z.object({
  name: z.string().trim().min(2, 'Category name must be at least 2 characters long.').max(100, 'Category name is too long.'),
});

const updateCategoryValidation = createCategoryValidation.partial();

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};
