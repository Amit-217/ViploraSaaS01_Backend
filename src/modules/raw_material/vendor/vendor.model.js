const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    gstin: {
      type: String,
      trim: true,
      uppercase: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Vendor name must be unique within a tenant
vendorSchema.index(
  { tenantId: 1, name: 1 },
  { unique: true }
);

const Vendor = mongoose.model(
  "Vendor",
  vendorSchema
);

module.exports = Vendor;