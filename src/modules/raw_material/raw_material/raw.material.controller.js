const { asyncHandler } = require('../../../common/utils/errors');
const { sendSuccess, sendError } = require('../../../common/utils/response');
const {
  listRawMaterials,
  createRawMaterial,
  getRawMaterialById,
  updateRawMaterialById,
  deleteRawMaterialById,
} = require('./raw.material.service');

const createMaterial = asyncHandler(async (req, res) => {
  const material = await createRawMaterial({
    tenantId: req.user.tenantId,
    ...req.body,
  });

  return sendSuccess(res, 201, 'Raw material created successfully.', material);
});

const listMaterials = asyncHandler(async (req, res) => {
  const materials = await listRawMaterials(req.user.tenantId);
  return sendSuccess(res, 200, 'Raw materials retrieved successfully.', materials);
});

const getMaterial = asyncHandler(async (req, res) => {
  const material = await getRawMaterialById(req.params.id, req.user.tenantId);

  if (!material) {
    return sendError(res, 404, 'Raw material not found.');
  }

  return sendSuccess(res, 200, 'Raw material retrieved successfully.', material);
});

const updateMaterial = asyncHandler(async (req, res) => {
  const material = await updateRawMaterialById(req.params.id, req.user.tenantId, req.body);

  if (!material) {
    return sendError(res, 404, 'Raw material not found.');
  }

  return sendSuccess(res, 200, 'Raw material updated successfully.', material);
});

const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await deleteRawMaterialById(req.params.id, req.user.tenantId);

  if (!material) {
    return sendError(res, 404, 'Raw material not found.');
  }

  return sendSuccess(res, 200, 'Raw material deactivated successfully.', material);
});

module.exports = {
  createMaterial,
  listMaterials,
  getMaterial,
  updateMaterial,
  deleteMaterial,
};
