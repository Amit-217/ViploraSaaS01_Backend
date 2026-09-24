const { z } = require('zod');

const allowedUnits = ['kg', 'g', 'ltr', 'ml', 'pcs', 'box', 'meter', 'cm', 'feet', 'inch', 'dozen', 'pack'];

const createRawMaterialValidation = z.object({
  code: z.string().trim().min(2, 'Material code is required.').max(50, 'Material code is too long.').transform((value) => value.toUpperCase()),
  name: z.string().trim().min(2, 'Material name is required.').max(120, 'Material name is too long.'),
  categoryId: z.string().min(1, 'Category is required.'),
  unit: z.enum(allowedUnits),
  minimumStock: z.number().min(0, 'Minimum stock cannot be negative.').default(0),
});

const updateRawMaterialValidation = z.object({
  code: z.string().trim().min(2, 'Material code is required.').max(50, 'Material code is too long.').transform((value) => value.toUpperCase()).optional(),
  name: z.string().trim().min(2, 'Material name is required.').max(120, 'Material name is too long.').optional(),
  categoryId: z.string().min(1, 'Category is required.').optional(),
  unit: z.enum(allowedUnits).optional(),
  minimumStock: z.number().min(0, 'Minimum stock cannot be negative.').optional(),
  isActive: z.boolean().optional(),
});

module.exports = {
  createRawMaterialValidation,
  updateRawMaterialValidation,
};
