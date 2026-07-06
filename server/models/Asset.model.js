// models/Asset.model.js
import mongoose from "mongoose";
import { ASSET_STATUS, ASSET_CONDITION } from "../constants/status.js";

const assetSchema = new mongoose.Schema(
  {
    // ── Auto-generated Asset ID ───────────────
    assetId: {
      type: String,
      unique: true,
      // e.g. AST-2024-00001
    },

    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    brand: {
      type: String,
      trim: true,
      default: null,
    },

    model: {
      type: String,
      trim: true,
      default: null,
    },

    serialNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows multiple null values
      default: null,
    },

    purchaseDate: {
      type: Date,
      default: null,
    },

    purchasePrice: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },

    warrantyExpiry: {
      type: Date,
      default: null,
    },

    supplier: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Location ──────────────────────────────
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    laboratory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laboratory",
      default: null,
    },

    location: {
      type: String,
      trim: true,
      default: null, // e.g. "Block A, Room 101"
    },

    // ── Status & Condition ────────────────────
    status: {
      type: String,
      enum: Object.values(ASSET_STATUS),
      default: ASSET_STATUS.AVAILABLE,
    },

    condition: {
      type: String,
      enum: Object.values(ASSET_CONDITION),
      default: ASSET_CONDITION.NEW,
    },

    // ── Quantity Tracking ─────────────────────
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },

    availableQuantity: {
      type: Number,
      default: 1,
      min: [0, "Available quantity cannot be negative"],
    },

    issuedQuantity: {
      type: Number,
      default: 0,
      min: [0, "Issued quantity cannot be negative"],
    },

    // ── Image ─────────────────────────────────
    image: {
      type: String,
      default: null,
    },

    // ── QR / Barcode ──────────────────────────
    qrCode: {
      type: String,
      default: null,
    },

    barcode: {
      type: String,
      default: null,
    },

    // ── Additional Info ───────────────────────
    remarks: {
      type: String,
      trim: true,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
assetSchema.index({ assetId: 1 });
assetSchema.index({ category: 1 });
assetSchema.index({ department: 1 });
assetSchema.index({ laboratory: 1 });
assetSchema.index({ status: 1 });
assetSchema.index({ isActive: 1 });
assetSchema.index({ name: "text", brand: "text", model: "text" }); // full text search

// ── Pre-save hook — auto generate Asset ID ────
assetSchema.pre("save", async function (next) {
  if (this.assetId) return next(); // already has ID

  const year = new Date().getFullYear();
  const count = await mongoose.model("Asset").countDocuments();
  const padded = String(count + 1).padStart(5, "0");
  this.assetId = `AST-${year}-${padded}`;

  // Sync availableQuantity with quantity on creation
  if (this.isNew) {
    this.availableQuantity = this.quantity;
  }

  next();
});

// ── Virtual — warranty status ─────────────────
assetSchema.virtual("warrantyStatus").get(function () {
  if (!this.warrantyExpiry) return "No Warranty";
  const now = new Date();
  const diff = this.warrantyExpiry - now;
  if (diff < 0) return "Expired";
  if (diff < 30 * 24 * 60 * 60 * 1000) return "Expiring Soon";
  return "Active";
});

const Asset = mongoose.model("Asset", assetSchema);
export default Asset;
