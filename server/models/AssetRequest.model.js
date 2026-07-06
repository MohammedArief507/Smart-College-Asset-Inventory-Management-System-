// models/AssetRequest.model.js
import mongoose from "mongoose";
import { REQUEST_STATUS } from "../constants/status.js";

const assetRequestSchema = new mongoose.Schema(
  {
    // ── Auto-generated Request ID ─────────────
    requestId: {
      type: String,
      unique: true,
      // e.g. REQ-2024-00001
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: [true, "Asset is required"],
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requester is required"],
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    quantityRequested: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },

    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true,
      maxlength: [500, "Purpose cannot exceed 500 characters"],
    },

    requiredFrom: {
      type: Date,
      default: null,
    },

    requiredUntil: {
      type: Date,
      default: null,
    },

    // ── Workflow Status ───────────────────────
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING,
    },

    // ── HOD Approval ──────────────────────────
    hodAction: {
      actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      actionAt: { type: Date, default: null },
      remarks: { type: String, default: null },
    },

    // ── Admin Manager Verification ────────────
    adminManagerAction: {
      actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      actionAt: { type: Date, default: null },
      remarks: { type: String, default: null },
    },

    // ── Issue Details ─────────────────────────
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    issuedAt: {
      type: Date,
      default: null,
    },

    returnDate: {
      type: Date,
      default: null,
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
assetRequestSchema.index({ requestedBy: 1 });
assetRequestSchema.index({ status: 1 });
assetRequestSchema.index({ asset: 1 });
assetRequestSchema.index({ department: 1 });
assetRequestSchema.index({ createdAt: -1 });

// ── Pre-save — auto generate Request ID ───────
assetRequestSchema.pre("save", async function (next) {
  if (this.requestId) return next();
  const year = new Date().getFullYear();
  const count = await mongoose.model("AssetRequest").countDocuments();
  const padded = String(count + 1).padStart(5, "0");
  this.requestId = `REQ-${year}-${padded}`;
  next();
});

const AssetRequest = mongoose.model("AssetRequest", assetRequestSchema);
export default AssetRequest;
