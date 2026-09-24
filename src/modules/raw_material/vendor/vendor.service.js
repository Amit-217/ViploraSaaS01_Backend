const Vendor = require('./vendor.model');
const { AppError } = require('../../../common/utils/errors');

const listVendors = async (tenantId) => {
  return Vendor.find({ tenantId }).sort({ createdAt: -1 });
};

const createVendor = async ({ tenantId, name, phone, email, address, gstin }) => {
  const vendorName = String(name || '').trim();

  if (!vendorName) {
    throw new AppError(400, 'Vendor name is required.');
  }

  const normalizedEmail = email ? String(email).trim().toLowerCase() : undefined;

  const duplicateName = await Vendor.findOne({ tenantId, name: vendorName });
  if (duplicateName) {
    throw new AppError(409, 'A vendor with this name already exists in this tenant.');
  }

  if (normalizedEmail) {
    const duplicateEmail = await Vendor.findOne({ tenantId, email: normalizedEmail });
    if (duplicateEmail) {
      throw new AppError(409, 'A vendor with this email already exists in this tenant.');
    }
  }

  return Vendor.create({
    tenantId,
    name: vendorName,
    phone: phone ? String(phone).trim() : undefined,
    email: normalizedEmail,
    address: address ? String(address).trim() : undefined,
    gstin: gstin ? String(gstin).trim().toUpperCase() : undefined,
    isActive: true,
  });
};

const getVendorById = async (id, tenantId) => {
  return Vendor.findOne({ _id: id, tenantId });
};

const updateVendorById = async (id, tenantId, payload) => {
  const vendor = await Vendor.findOne({ _id: id, tenantId });

  if (!vendor) {
    return null;
  }

  if (payload.name !== undefined) {
    const name = String(payload.name).trim();
    if (!name) throw new AppError(400, 'Vendor name is required.');

    const duplicate = await Vendor.findOne({ tenantId, name, _id: { $ne: vendor._id } });
    if (duplicate) throw new AppError(409, 'A vendor with this name already exists in this tenant.');
    vendor.name = name;
  }

  if (payload.phone !== undefined) vendor.phone = payload.phone ? String(payload.phone).trim() : undefined;
  if (payload.email !== undefined) {
    const email = payload.email ? String(payload.email).trim().toLowerCase() : undefined;
    const duplicateEmail = await Vendor.findOne({ tenantId, email, _id: { $ne: vendor._id } });
    if (duplicateEmail) throw new AppError(409, 'A vendor with this email already exists in this tenant.');
    vendor.email = email;
  }
  if (payload.address !== undefined) vendor.address = payload.address ? String(payload.address).trim() : undefined;
  if (payload.gstin !== undefined) vendor.gstin = payload.gstin ? String(payload.gstin).trim().toUpperCase() : undefined;
  if (payload.isActive !== undefined) vendor.isActive = Boolean(payload.isActive);

  await vendor.save();
  return vendor;
};

const deleteVendorById = async (id, tenantId) => {
  const vendor = await Vendor.findOne({ _id: id, tenantId });

  if (!vendor) {
    return null;
  }

  vendor.isActive = false;
  await vendor.save();
  return vendor;
};

module.exports = {
  listVendors,
  createVendor,
  getVendorById,
  updateVendorById,
  deleteVendorById,
};
