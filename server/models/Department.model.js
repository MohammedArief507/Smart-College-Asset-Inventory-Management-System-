// models/Department.model.js
import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Department name cannot exceed 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [10, "Code cannot exceed 10 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
departmentSchema.index({ name: 1 });
departmentSchema.index({ code: 1 });
departmentSchema.index({ isActive: 1 });

// ── Virtual — count of labs (populated later) ─
departmentSchema.virtual("laboratories", {
  ref: "Laboratory",
  localField: "_id",
  foreignField: "department",
  count: true,
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
