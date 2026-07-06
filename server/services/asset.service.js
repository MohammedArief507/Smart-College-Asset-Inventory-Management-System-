// services/asset.service.js
import Asset from "../models/Asset.model.js";
import Category from "../models/Category.model.js";
import ActivityLog from "../models/ActivityLog.model.js";
import AppError from "../utils/AppError.js";

/**
 * Get all assets with pagination, search, filter, sort
 */
export const getAllAssets = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  status = "",
  department = "",
  laboratory = "",
  condition = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const query = { isActive: true };

  // Full text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
      { assetId: { $regex: search, $options: "i" } },
      { serialNumber: { $regex: search, $options: "i" } },
    ];
  }

  if (category) query.category = category;
  if (status) query.status = status;
  if (department) query.department = department;
  if (laboratory) query.laboratory = laboratory;
  if (condition) query.condition = condition;

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [assets, total] = await Promise.all([
    Asset.find(query)
      .populate("category", "name icon")
      .populate("department", "name code")
      .populate("laboratory", "name code")
      .populate("addedBy", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Asset.countDocuments(query),
  ]);

  return { assets, total };
};

/**
 * Get single asset
 */
export const getAssetById = async (id) => {
  const asset = await Asset.findById(id)
    .populate("category", "name icon")
    .populate("department", "name code")
    .populate("laboratory", "name code")
    .populate("addedBy", "name email");

  if (!asset) throw new AppError("Asset not found", 404);
  return asset;
};

/**
 * Create asset
 */
export const createAsset = async (data, performedBy, req) => {
  // Validate category exists
  const category = await Category.findById(data.category);
  if (!category) throw new AppError("Category not found", 404);

  const asset = await Asset.create({ ...data, addedBy: performedBy });

  await ActivityLog.log({
    action: "ASSET_CREATED",
    performedBy,
    description: `Added asset: ${asset.name} (${asset.assetId})`,
    target: { model: "Asset", id: asset._id, name: asset.name },
    req,
  });

  return asset;
};

/**
 * Update asset
 */
export const updateAsset = async (id, data, performedBy, req) => {
  // If quantity changes, recalculate availableQuantity
  const existing = await Asset.findById(id);
  if (!existing) throw new AppError("Asset not found", 404);

  if (data.quantity !== undefined) {
    const diff = data.quantity - existing.quantity;
    data.availableQuantity = Math.max(0, existing.availableQuantity + diff);
  }

  const asset = await Asset.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("category", "name")
    .populate("department", "name")
    .populate("laboratory", "name");

  await ActivityLog.log({
    action: "ASSET_UPDATED",
    performedBy,
    description: `Updated asset: ${asset.name} (${asset.assetId})`,
    target: { model: "Asset", id: asset._id, name: asset.name },
    req,
  });

  return asset;
};

/**
 * Delete asset (soft delete)
 */
export const deleteAsset = async (id, performedBy, req) => {
  const asset = await Asset.findById(id);
  if (!asset) throw new AppError("Asset not found", 404);

  if (asset.issuedQuantity > 0) {
    throw new AppError("Cannot delete asset that is currently issued", 400);
  }

  asset.isActive = false;
  await asset.save({ validateBeforeSave: false });

  await ActivityLog.log({
    action: "ASSET_DELETED",
    performedBy,
    description: `Deleted asset: ${asset.name} (${asset.assetId})`,
    target: { model: "Asset", id: asset._id, name: asset.name },
    req,
  });
};

/**
 * Get asset statistics
 */
export const getAssetStats = async () => {
  const [total, available, issued, damaged, byCategory, byStatus] = await Promise.all([
    Asset.countDocuments({ isActive: true }),
    Asset.countDocuments({ isActive: true, status: "Available" }),
    Asset.countDocuments({ isActive: true, status: "Issued" }),
    Asset.countDocuments({ isActive: true, status: "Damaged" }),
    Asset.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 }, total: { $sum: "$quantity" } } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $project: { name: "$category.name", count: 1, total: 1 } },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]),
    Asset.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  return { total, available, issued, damaged, byCategory, byStatus };
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  return await Category.find({ isActive: true }).sort({ name: 1 });
};

/**
 * Export assets as CSV data
 */
export const exportAssets = async (filters = {}) => {
  const query = { isActive: true, ...filters };
  const assets = await Asset.find(query)
    .populate("category", "name")
    .populate("department", "name")
    .populate("laboratory", "name")
    .sort({ createdAt: -1 });

  return assets;
};
