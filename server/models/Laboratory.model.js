// models/Laboratory.model.js
import mongoose from "mongoose";

const laboratorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Laboratory name is required"],
      trim: true,
      maxlength: [100, "Lab name cannot exceed 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Lab code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [10, "Code cannot exceed 10 characters"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    labIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: null,
    },
    capacity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────
laboratorySchema.index({ department: 1 });
laboratorySchema.index({ code: 1 });
laboratorySchema.index({ isActive: 1 });

const Laboratory = mongoose.model("Laboratory", laboratorySchema);
export default Laboratory;
