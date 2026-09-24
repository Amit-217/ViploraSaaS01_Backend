const MaterialTransaction = require('./material.transaction.model');
const RawMaterial = require('../raw_material/raw.material.model');
const Vendor = require('../vendor/vendor.model');
const { AppError } = require('../../../common/utils/errors');

const normalizeDirection = (type, direction) => {
  if (type === 'IN' && direction === 'IN') return 'IN';
  if (type === 'CONSUMPTION' && direction === 'OUT') return 'OUT';
  if (type === 'ADJUSTMENT' && ['IN', 'OUT'].includes(direction)) return direction;
  return null;
};

const listMaterialTransactions = async (tenantId, filters = {}) => {
  const query = { tenantId };

  if (filters.rawMaterialId) {
    query.rawMaterialId = filters.rawMaterialId;
  }

  return MaterialTransaction.find(query)
    .populate('rawMaterialId', 'code name currentStock')
    .populate('vendorId', 'name')
    .sort({ date: -1, createdAt: -1 });
};

const createMaterialTransaction = async ({
  tenantId,
  rawMaterialId,
  type,
  direction,
  quantity,
  rate,
  vendorId,
  referenceType,
  referenceId,
  reason,
  date,
  notes,
  createdBy,
}) => {
  const material = await RawMaterial.findOne({ _id: rawMaterialId, tenantId });
  if (!material) {
    throw new AppError(404, 'Raw material not found.');
  }

  const normalizedDirection = normalizeDirection(type, direction);
  if (!normalizedDirection) {
    throw new AppError(400, 'Invalid direction for this transaction type.');
  }

  if (vendorId) {
    const vendor = await Vendor.findOne({ _id: vendorId, tenantId });
    if (!vendor) {
      throw new AppError(404, 'Vendor not found.');
    }
  }

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new AppError(400, 'Quantity must be a positive number.');
  }

  const nextStock = normalizedDirection === 'IN' ? material.currentStock + qty : material.currentStock - qty;
  if (nextStock < 0) {
    throw new AppError(400, 'Insufficient stock for this transaction.');
  }

  material.currentStock = nextStock;
  await material.save();

  const transaction = await MaterialTransaction.create({
    tenantId,
    rawMaterialId,
    type,
    direction: normalizedDirection,
    quantity: qty,
    rate: rate !== undefined ? Number(rate) : undefined,
    vendorId: vendorId || undefined,
    referenceType,
    referenceId: referenceId || undefined,
    reason: reason ? String(reason).trim() : undefined,
    date: date ? new Date(date) : new Date(),
    notes: notes ? String(notes).trim() : undefined,
    createdBy: createdBy || 'system',
  });

  return transaction;
};

const getMaterialTransactionById = async (id, tenantId) => {
  return MaterialTransaction.findOne({ _id: id, tenantId })
    .populate('rawMaterialId', 'code name currentStock')
    .populate('vendorId', 'name');
};

const deleteMaterialTransactionById = async (id, tenantId) => {
  const transaction = await MaterialTransaction.findOne({ _id: id, tenantId });

  if (!transaction) {
    return null;
  }

  const material = await RawMaterial.findOne({ _id: transaction.rawMaterialId, tenantId });
  if (material) {
    const adjustment = transaction.direction === 'IN' ? -transaction.quantity : transaction.quantity;
    const stockAfterReversal = material.currentStock + adjustment;
    if (stockAfterReversal < 0) {
      throw new AppError(400, 'Cannot delete this transaction because it would produce a negative stock balance.');
    }
    material.currentStock = stockAfterReversal;
    await material.save();
  }

  await transaction.deleteOne();
  return transaction;
};

module.exports = {
  listMaterialTransactions,
  createMaterialTransaction,
  getMaterialTransactionById,
  deleteMaterialTransactionById,
};
