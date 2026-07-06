// models/Category.model.js
import mongoose from "mongoose";
import { DEFAULT_CATEGORIES } from "../constants/status.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    icon: {
      type: String,
      default: "Package", // Lucide icon name
    },
    isDefault: {
      type: Boolean,
      default: false, // true = system category, false = custom
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
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
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });

// ── Virtual — asset count ─────────────────────
categorySchema.virtual("assetCount", {
  ref: "Asset",
  localField: "_id",
  foreignField: "category",
  count: true,
});

// ── Static method — seed default categories ───
categorySchema.statics.seedDefaults = async function () {
  const existing = await this.countDocuments({ isDefault: true });
  if (existing > 0) return;

  const defaults = DEFAULT_CATEGORIES.map((name) => ({
    name,
    isDefault: true,
  }));

  await this.insertMany(defaults);
  console.log("✅ Default categories seeded");
};

const Category = mongoose.model("Category", categorySchema);
export default Category;
