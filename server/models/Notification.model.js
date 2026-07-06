// models/Notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },

    type: {
      type: String,
      enum: [
        "request_submitted",
        "request_approved",
        "request_rejected",
        "asset_issued",
        "asset_returned",
        "asset_due",
        "asset_overdue",
        "user_created",
        "general",
      ],
      default: "general",
    },

    // Link to related document
    reference: {
      model: {
        type: String,
        enum: ["AssetRequest", "IssuedAsset", "Asset", "User"],
        default: null,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// ── Static — create notification helper ───────
notificationSchema.statics.notify = async function (recipientId, { title, message, type = "general", reference = {} }) {
  return await this.create({
    recipient: recipientId,
    title,
    message,
    type,
    reference,
  });
};

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
