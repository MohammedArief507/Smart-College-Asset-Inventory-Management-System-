// controllers/asset.controller.js
import * as assetService from "../services/asset.service.js";
import { sendSuccess, buildPaginationMeta } from "../utils/apiResponse.js";

export const getAllAssets = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 10, search = "",
      category = "", status = "", department = "",
      laboratory = "", condition = "",
      sortBy = "createdAt", sortOrder = "desc",
    } = req.query;

    const { assets, total } = await assetService.getAllAssets({
      page: +page, limit: +limit, search,
      category, status, department, laboratory, condition,
      sortBy, sortOrder,
    });

    sendSuccess(res, {
      message: "Assets fetched successfully",
      data: assets,
      meta: buildPaginationMeta({ page: +page, limit: +limit, total }),
    });
  } catch (error) { next(error); }
};

export const getAssetById = async (req, res, next) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    sendSuccess(res, { message: "Asset fetched", data: asset });
  } catch (error) { next(error); }
};

export const createAsset = async (req, res, next) => {
  try {
    const asset = await assetService.createAsset(req.body, req.user._id, req);
    sendSuccess(res, { statusCode: 201, message: "Asset created successfully", data: asset });
  } catch (error) { next(error); }
};

export const updateAsset = async (req, res, next) => {
  try {
    const asset = await assetService.updateAsset(req.params.id, req.body, req.user._id, req);
    sendSuccess(res, { message: "Asset updated successfully", data: asset });
  } catch (error) { next(error); }
};

export const deleteAsset = async (req, res, next) => {
  try {
    await assetService.deleteAsset(req.params.id, req.user._id, req);
    sendSuccess(res, { message: "Asset deleted successfully" });
  } catch (error) { next(error); }
};

export const getAssetStats = async (req, res, next) => {
  try {
    const stats = await assetService.getAssetStats();
    sendSuccess(res, { message: "Asset stats fetched", data: stats });
  } catch (error) { next(error); }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await assetService.getCategories();
    sendSuccess(res, { message: "Categories fetched", data: categories });
  } catch (error) { next(error); }
};

export const exportAssets = async (req, res, next) => {
  try {
    const assets = await assetService.exportAssets(req.query);

    // Build CSV
    const headers = [
      "Asset ID", "Name", "Category", "Brand", "Model",
      "Serial Number", "Status", "Condition", "Quantity",
      "Available", "Issued", "Department", "Laboratory",
      "Location", "Purchase Date", "Purchase Price", "Warranty Expiry",
    ];

    const rows = assets.map((a) => [
      a.assetId, a.name, a.category?.name, a.brand || "",
      a.model || "", a.serialNumber || "", a.status, a.condition,
      a.quantity, a.availableQuantity, a.issuedQuantity,
      a.department?.name || "", a.laboratory?.name || "",
      a.location || "",
      a.purchaseDate ? new Date(a.purchaseDate).toLocaleDateString() : "",
      a.purchasePrice || 0,
      a.warrantyExpiry ? new Date(a.warrantyExpiry).toLocaleDateString() : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="assets-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) { next(error); }
};
