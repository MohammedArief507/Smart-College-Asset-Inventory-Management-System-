// models/ActivityLog.model.js
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGOUT",
        "USER_CREATED",
        "USER_UPDATED",
        "USER_DELETED",
        "USER_ACTIVATED",
        "USER_DEACTIVATED",
        "ASSET_CREATED",
        "ASSET_UPDATED",
        "ASSET_DELETED",
        "ASSET_IMPORTED",
        "REQUEST_SUBMITTED",
        "REQUEST_APPROVED",
        "REQUEST_REJECTED",
        "REQUEST_CANCELLED",
        "ASSET_ISSUED",
        "ASSET_RETURNED",
        "ASSET_DAMAGED",
        "DEPARTMENT_CREATED",
        "DEPARTMENT_UPDATED",
        "DEPARTMENT_DELETED",
        "LAB_CREATED",
        "LAB_UPDATED",
        "LAB_DELETED",
        "CATEGORY_CREATED",
        "CATEGORY_DELETED",
        "PASSWORD_CHANGED",
        "PROFILE_UPDATED",
      ],
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // The document that was affected
    target: {
      model: {
        type: String,
        enum: ["User", "Asset", "AssetRequest", "IssuedAsset", "Department", "Laboratory", "Category"],
        default: null,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      name: {
        type: String,
        default: null,
      },
    },

    // Request metadata
    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────
activityLogSchema.index({ performedBy: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ "target.model": 1, "target.id": 1 });

// ── Static — log action helper ────────────────
activityLogSchema.statics.log = async function ({
  action,
  performedBy,
  description,
  target = {},
  req = null,
}) {
  return await this.create({
    action,
    performedBy,
    description,
    target,
    ipAddress: req?.ip || null,
    userAgent: req?.headers?.["user-agent"] || null,
  });
};

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
