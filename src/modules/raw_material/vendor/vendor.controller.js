const { asyncHandler } = require('../../../common/utils/errors');
const { sendSuccess, sendError } = require('../../../common/utils/response');
const {
  listVendors: listVendorsService,
  createVendor: createVendorService,
  getVendorById,
  updateVendorById,
  deleteVendorById,
} = require('./vendor.service');

const createVendorHandler = asyncHandler(async (req, res) => {
  const vendor = await createVendorService({
    tenantId: req.user.tenantId,
    ...req.body,
  });

  return sendSuccess(res, 201, 'Vendor created successfully.', vendor);
});

const listVendor = asyncHandler(async (req, res) => {
  const vendors = await listVendorsService(req.user.tenantId);
  return sendSuccess(res, 200, 'Vendors retrieved successfully.', vendors);
});

const getVendor = asyncHandler(async (req, res) => {
  const vendor = await getVendorById(req.params.id, req.user.tenantId);

  if (!vendor) {
    return sendError(res, 404, 'Vendor not found.');
  }

  return sendSuccess(res, 200, 'Vendor retrieved successfully.', vendor);
});

const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await updateVendorById(req.params.id, req.user.tenantId, req.body);

  if (!vendor) {
    return sendError(res, 404, 'Vendor not found.');
  }

  return sendSuccess(res, 200, 'Vendor updated successfully.', vendor);
});

const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await deleteVendorById(req.params.id, req.user.tenantId);

  if (!vendor) {
    return sendError(res, 404, 'Vendor not found.');
  }

  return sendSuccess(res, 200, 'Vendor deactivated successfully.', vendor);
});

module.exports = {
  createVendor: createVendorHandler,
  listVendor,
  getVendor,
  updateVendor,
  deleteVendor,
};
