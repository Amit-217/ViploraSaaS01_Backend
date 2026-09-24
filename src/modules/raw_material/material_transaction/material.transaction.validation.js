const { z } = require('zod');

const createMaterialTransactionValidation = z.object({
  rawMaterialId: z.string().min(1, 'Raw material is required.'),
  type: z.enum(['IN', 'CONSUMPTION', 'ADJUSTMENT']),
  direction: z.enum(['IN', 'OUT']),
  quantity: z.number().positive('Quantity must be greater than zero.'),
  rate: z.number().min(0, 'Rate cannot be negative.').optional(),
  vendorId: z.string().optional(),
  referenceType: z.enum(['PURCHASE', 'DIRECT_CONSUMPTION', 'PRODUCTION', 'ADJUSTMENT']),
  referenceId: z.string().optional(),
  reason: z.string().trim().max(250, 'Reason is too long.').optional(),
  date: z.union([z.string(), z.date()]).optional(),
  notes: z.string().trim().max(500, 'Notes are too long.').optional(),
});

const updateMaterialTransactionValidation = createMaterialTransactionValidation.partial();

module.exports = {
  createMaterialTransactionValidation,
  updateMaterialTransactionValidation,
};
