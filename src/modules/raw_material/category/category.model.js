const mongoose = require("mongoose");

const rawMaterialCategorySchema = new mongoose.Schema(
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Category name must be unique within a tenant
rawMaterialCategorySchema.index(
  { tenantId: 1, name: 1 },
  { unique: true }
);

const RawMaterialCategory = mongoose.model(
  "RawMaterialCategory",
  rawMaterialCategorySchema
);

module.exports = RawMaterialCategory;