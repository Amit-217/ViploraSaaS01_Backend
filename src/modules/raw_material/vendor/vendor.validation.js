const { z } = require('zod');

const createVendorValidation = z.object({
  name: z.string().trim().min(2, 'Vendor name is required.').max(120, 'Vendor name is too long.'),
  phone: z.string().trim().max(30, 'Phone number is too long.').optional(),
  email: z.string().trim().email('Please provide a valid email address.').optional().or(z.literal('')),
  address: z.string().trim().max(250, 'Address is too long.').optional(),
  gstin: z.string().trim().max(30, 'GSTIN is too long.').optional(),
});

const updateVendorValidation = createVendorValidation.partial();

module.exports = {
  createVendorValidation,
  updateVendorValidation,
};
