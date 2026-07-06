// services/request.service.js
import AssetRequest from "../models/AssetRequest.model.js";
import IssuedAsset from "../models/IssuedAsset.model.js";
import Asset from "../models/Asset.model.js";
import Notification from "../models/Notification.model.js";
import ActivityLog from "../models/ActivityLog.model.js";
import AppError from "../utils/AppError.js";
import { ROLES } from "../constants/roles.js";

/**
 * Get all requests with filters
 */
export const getAllRequests = async ({
  page = 1, limit = 10, status = "", search = "",
  department = "", userId = null, role = "",
}) => {
  const query = {};

  // Role-based filtering
  if (role === ROLES.STAFF) {
    query.requestedBy = userId; // Staff sees only their own
  } else if (role === ROLES.HOD) {
    query.department = department; // HOD sees their department
  }

  if (status) query.status = status;
  if (search) {
    query.$or = [
      { requestId: { $regex: search, $options: "i" } },
      { purpose: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    AssetRequest.find(query)
      .populate("asset", "name assetId category")
      .populate("requestedBy", "name email role")
      .populate("department", "name")
      .populate("issuedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AssetRequest.countDocuments(query),
  ]);

  return { requests, total };
};

/**
 * Get single request
 */
export const getRequestById = async (id) => {
  const request = await AssetRequest.findById(id)
    .populate("asset", "name assetId category availableQuantity")
    .populate("requestedBy", "name email role department")
    .populate("department", "name code")
    .populate("issuedBy", "name")
    .populate("hodAction.actionBy", "name")
    .populate("adminManagerAction.actionBy", "name");

  if (!request) throw new AppError("Request not found", 404);
  return request;
};

/**
 * Create request — Staff
 */
export const createRequest = async (data, user, req) => {
  const asset = await Asset.findById(data.asset);
  if (!asset) throw new AppError("Asset not found", 404);
  if (asset.availableQuantity < data.quantityRequested) {
    throw new AppError(`Only ${asset.availableQuantity} units available`, 400);
  }

  const request = await AssetRequest.create({
    ...data,
    requestedBy: user._id,
    department: user.department,
    status: "Pending",
  });

  // Notify HOD
  if (user.department) {
    const { default: User } = await import("../models/User.model.js");
    const hod = await User.findOne({ role: ROLES.HOD, department: user.department });
    if (hod) {
      await Notification.notify(hod._id, {
        title: "New Asset Request",
        message: `${user.name} requested ${data.quantityRequested}x ${asset.name}`,
        type: "request_submitted",
        reference: { model: "AssetRequest", id: request._id },
      });
    }
  }

  await ActivityLog.log({
    action: "REQUEST_SUBMITTED",
    performedBy: user._id,
    description: `${user.name} submitted request for ${asset.name} (${request.requestId})`,
    target: { model: "AssetRequest", id: request._id, name: request.requestId },
    req,
  });

  return request;
};

/**
 * HOD Action — Approve or Reject
 */
export const hodAction = async (requestId, { action, remarks }, hod, req) => {
  const request = await AssetRequest.findById(requestId)
    .populate("asset", "name")
    .populate("requestedBy", "name _id");

  if (!request) throw new AppError("Request not found", 404);
  if (request.status !== "Pending") {
    throw new AppError(`Request is already ${request.status}`, 400);
  }

  const newStatus = action === "approve" ? "Approved" : "Rejected";

  request.status = newStatus;
  request.hodAction = {
    actionBy: hod._id,
    actionAt: new Date(),
    remarks: remarks || null,
  };
  await request.save();

  // Notify requester
  await Notification.notify(request.requestedBy._id, {
    title: `Request ${newStatus}`,
    message: `Your request for ${request.asset.name} has been ${newStatus.toLowerCase()} by HOD`,
    type: action === "approve" ? "request_approved" : "request_rejected",
    reference: { model: "AssetRequest", id: request._id },
  });

  // If approved, notify Admin Manager
  if (action === "approve") {
    const { default: User } = await import("../models/User.model.js");
    const managers = await User.find({ role: ROLES.ADMIN_MANAGER });
    for (const manager of managers) {
      await Notification.notify(manager._id, {
        title: "Request Approved — Issue Asset",
        message: `HOD approved request ${request.requestId}. Please issue the asset.`,
        type: "request_approved",
        reference: { model: "AssetRequest", id: request._id },
      });
    }
  }

  await ActivityLog.log({
    action: action === "approve" ? "REQUEST_APPROVED" : "REQUEST_REJECTED",
    performedBy: hod._id,
    description: `HOD ${action}d request ${request.requestId}`,
    target: { model: "AssetRequest", id: request._id, name: request.requestId },
    req,
  });

  return request;
};

/**
 * Issue Asset — Admin Manager
 */
export const issueAsset = async (requestId, { expectedReturnDate, remarks }, manager, req) => {
  const request = await AssetRequest.findById(requestId)
    .populate("asset")
    .populate("requestedBy", "name _id");

  if (!request) throw new AppError("Request not found", 404);
  if (request.status !== "Approved") {
    throw new AppError("Request must be approved before issuing", 400);
  }

  const asset = request.asset;
  if (asset.availableQuantity < request.quantityRequested) {
    throw new AppError("Insufficient stock to issue", 400);
  }

  // Create issued asset record
  const issued = await IssuedAsset.create({
    asset: asset._id,
    request: request._id,
    issuedTo: request.requestedBy._id,
    issuedBy: manager._id,
    department: request.department,
    quantityIssued: request.quantityRequested,
    issueDate: new Date(),
    expectedReturnDate: expectedReturnDate || null,
    remarks: remarks || null,
  });

  // Update asset quantities
  asset.availableQuantity -= request.quantityRequested;
  asset.issuedQuantity += request.quantityRequested;
  if (asset.availableQuantity === 0) asset.status = "Issued";
  await asset.save({ validateBeforeSave: false });

  // Update request status
  request.status = "Issued";
  request.issuedBy = manager._id;
  request.issuedAt = new Date();
  request.adminManagerAction = {
    actionBy: manager._id,
    actionAt: new Date(),
    remarks: remarks || null,
  };
  await request.save();

  // Notify requester
  await Notification.notify(request.requestedBy._id, {
    title: "Asset Issued!",
    message: `${asset.name} has been issued to you. Please collect it.`,
    type: "asset_issued",
    reference: { model: "IssuedAsset", id: issued._id },
  });

  await ActivityLog.log({
    action: "ASSET_ISSUED",
    performedBy: manager._id,
    description: `Issued ${asset.name} to ${request.requestedBy.name} (${issued.issueId})`,
    target: { model: "IssuedAsset", id: issued._id, name: issued.issueId },
    req,
  });

  return issued;
};

/**
 * Return Asset
 */
export const returnAsset = async (issuedId, { condition, damageNotes, fine, remarks }, manager, req) => {
  const issued = await IssuedAsset.findById(issuedId)
    .populate("asset")
    .populate("issuedTo", "name _id");

  if (!issued) throw new AppError("Issue record not found", 404);
  if (issued.isReturned) throw new AppError("Asset already returned", 400);

  // Update issued record
  issued.isReturned = true;
  issued.actualReturnDate = new Date();
  issued.returnedTo = manager._id;
  issued.condition = condition;
  issued.damageNotes = damageNotes || null;
  issued.fine = fine || 0;
  issued.remarks = remarks || null;
  await issued.save();

  // Update asset quantities
  const asset = issued.asset;
  asset.availableQuantity += issued.quantityIssued;
  asset.issuedQuantity -= issued.quantityIssued;
  if (asset.availableQuantity > 0) asset.status = "Available";
  if (condition === "Damaged") asset.condition = "Damaged";
  await asset.save({ validateBeforeSave: false });

  // Update linked request
  await AssetRequest.findOneAndUpdate(
    { _id: issued.request },
    { status: "Returned", returnDate: new Date() }
  );

  // Notify user
  await Notification.notify(issued.issuedTo._id, {
    title: "Asset Returned",
    message: `${asset.name} has been successfully returned`,
    type: "asset_returned",
    reference: { model: "IssuedAsset", id: issued._id },
  });

  await ActivityLog.log({
    action: "ASSET_RETURNED",
    performedBy: manager._id,
    description: `${issued.issuedTo.name} returned ${asset.name}`,
    target: { model: "IssuedAsset", id: issued._id, name: issued.issueId },
    req,
  });

  return issued;
};

/**
 * Cancel request — by requester
 */
export const cancelRequest = async (requestId, userId, req) => {
  const request = await AssetRequest.findById(requestId);
  if (!request) throw new AppError("Request not found", 404);

  if (request.requestedBy.toString() !== userId.toString()) {
    throw new AppError("You can only cancel your own requests", 403);
  }

  if (!["Pending"].includes(request.status)) {
    throw new AppError("Only pending requests can be cancelled", 400);
  }

  request.status = "Cancelled";
  await request.save();

  await ActivityLog.log({
    action: "REQUEST_CANCELLED",
    performedBy: userId,
    description: `Cancelled request ${request.requestId}`,
    target: { model: "AssetRequest", id: request._id, name: request.requestId },
    req,
  });

  return request;
};

/**
 * Get issued assets list
 */
export const getIssuedAssets = async ({ page = 1, limit = 10, isReturned, userId, role }) => {
  const query = {};
  if (isReturned !== undefined) query.isReturned = isReturned === "true";
  if (role === ROLES.STAFF) query.issuedTo = userId;

  const skip = (page - 1) * limit;
  const [issued, total] = await Promise.all([
    IssuedAsset.find(query)
      .populate("asset", "name assetId")
      .populate("issuedTo", "name email")
      .populate("issuedBy", "name")
      .populate("department", "name")
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(limit),
    IssuedAsset.countDocuments(query),
  ]);

  return { issued, total };
};

/**
 * Request stats
 */
export const getRequestStats = async () => {
  const stats = await AssetRequest.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const total = await AssetRequest.countDocuments();
  const pending = await AssetRequest.countDocuments({ status: "Pending" });
  const issued = await IssuedAsset.countDocuments({ isReturned: false });

  return { total, pending, issued, byStatus: stats };
};
