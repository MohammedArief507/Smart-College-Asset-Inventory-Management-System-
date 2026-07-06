// models/IssuedAsset.model.js
import mongoose from "mongoose";

const issuedAssetSchema = new mongoose.Schema(
  {
    issueId: {
      type: String,
      unique: true,
      // e.g. ISS-2024-00001
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: [true, "Asset is required"],
    },

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetRequest",
      default: null,
    },

    issuedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Issued to user is required"],
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Issued by user is required"],
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    quantityIssued: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    expectedReturnDate: {
      type: Date,
      default: null,
    },

    actualReturnDate: {
      type: Date,
      default: null,
    },

    returnedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isReturned: {
      type: Boolean,
      default: false,
    },

    // ── Damage / Fine ─────────────────────────
    damageNotes: {
      type: String,
      trim: true,
      default: null,
    },

    fine: {
      type: Number,
      default: 0,
      min: [0, "Fine cannot be negative"],
    },

    condition: {
      type: String,
      enum: ["Good", "Damaged", "Lost"],
      default: "Good",
    },

    remarks: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────
issuedAssetSchema.index({ asset: 1 });
issuedAssetSchema.index({ issuedTo: 1 });
issuedAssetSchema.index({ isReturned: 1 });
issuedAssetSchema.index({ issueDate: -1 });

// ── Pre-save — auto generate Issue ID ─────────
issuedAssetSchema.pre("save", async function (next) {
  if (this.issueId) return next();
  const year = new Date().getFullYear();
  const count = await mongoose.model("IssuedAsset").countDocuments();
  const padded = String(count + 1).padStart(5, "0");
  this.issueId = `ISS-${year}-${padded}`;
  next();
});

// ── Virtual — overdue check ───────────────────
issuedAssetSchema.virtual("isOverdue").get(function () {
  if (this.isReturned || !this.expectedReturnDate) return false;
  return new Date() > this.expectedReturnDate;
});

const IssuedAsset = mongoose.model("IssuedAsset", issuedAssetSchema);
export default IssuedAsset;
