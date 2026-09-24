const mongoose = require("mongoose");

const materialTransactionSchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: true,
      index: true,
    },

    rawMaterialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
      required: true,
      index: true,
    },

    // Type of transaction
    type: {
      type: String,
      enum: [
        "IN",
        "CONSUMPTION",
        "ADJUSTMENT",
      ],
      required: true,
    },

    // Whether stock increases or decreases
    direction: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.0001,
    },

    // Purchase rate
    // Used only when type = IN
    rate: {
      type: Number,
      min: 0,
    },

    // Used when material is purchased
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    // What caused this transaction
    referenceType: {
      type: String,
      enum: [
        "PURCHASE",
        "DIRECT_CONSUMPTION",
        "PRODUCTION",
        "ADJUSTMENT",
      ],
      required: true,
    },

    // Reference to another document when required
    // Example: future Production document
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    reason: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Material-specific transaction history
materialTransactionSchema.index({
  tenantId: 1,
  rawMaterialId: 1,
  date: -1,
});

// Tenant-wide transaction history
materialTransactionSchema.index({
  tenantId: 1,
  date: -1,
});

const MaterialTransaction = mongoose.model(
  "MaterialTransaction",
  materialTransactionSchema
);

module.exports = MaterialTransaction;