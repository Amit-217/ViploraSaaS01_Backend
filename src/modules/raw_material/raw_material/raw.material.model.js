const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },

    // Human-readable material code
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterialCategory",
      required: true,
    },

    unit: {
      type: String,
      required: true,
      enum: [
        "kg",
        "g",
        "ltr",
        "ml",
        "pcs",
        "box",
        "meter",
        "cm",
        "feet",
        "inch",
        "dozen",
        "pack",
      ],
    },

    minimumStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentStock: {
      type: Number,
      default: 0,
      min: 0,
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

// Code must be unique within a tenant
rawMaterialSchema.index(
  { tenantId: 1, code: 1 },
  { unique: true }
);

// Material name lookup within tenant
rawMaterialSchema.index({
  tenantId: 1,
  name: 1,
});

const RawMaterial = mongoose.model(
  "RawMaterial",
  rawMaterialSchema
);

module.exports = RawMaterial;