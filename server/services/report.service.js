// services/report.service.js
import Asset from "../models/Asset.model.js";
import AssetRequest from "../models/AssetRequest.model.js";
import IssuedAsset from "../models/IssuedAsset.model.js";
import User from "../models/User.model.js";
import Department from "../models/Department.model.js";

/**
 * Build CSV string from headers + rows
 */
const buildCSV = (headers, rows) => {
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
};

/**
 * Asset Report
 */
export const generateAssetReport = async ({ status, category, department, startDate, endDate }) => {
  const query = { isActive: true };
  if (status) query.status = status;
  if (category) query.category = category;
  if (department) query.department = department;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const assets = await Asset.find(query)
    .populate("category", "name")
    .populate("department", "name")
    .populate("laboratory", "name")
    .sort({ createdAt: -1 });

  const headers = [
    "Asset ID", "Name", "Category", "Brand", "Model",
    "Serial Number", "Status", "Condition", "Total Qty",
    "Available Qty", "Issued Qty", "Department", "Laboratory",
    "Location", "Purchase Date", "Purchase Price (₹)", "Warranty Expiry", "Added On",
  ];

  const rows = assets.map((a) => [
    a.assetId, a.name, a.category?.name || "", a.brand || "",
    a.model || "", a.serialNumber || "", a.status, a.condition,
    a.quantity, a.availableQuantity, a.issuedQuantity,
    a.department?.name || "", a.laboratory?.name || "",
    a.location || "",
    a.purchaseDate ? new Date(a.purchaseDate).toLocaleDateString("en-IN") : "",
    a.purchasePrice || 0,
    a.warrantyExpiry ? new Date(a.warrantyExpiry).toLocaleDateString("en-IN") : "",
    new Date(a.createdAt).toLocaleDateString("en-IN"),
  ]);

  return {
    csv: buildCSV(headers, rows),
    count: assets.length,
    filename: `asset-report-${Date.now()}.csv`,
  };
};

/**
 * Request Report
 */
export const generateRequestReport = async ({ status, startDate, endDate }) => {
  const query = {};
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const requests = await AssetRequest.find(query)
    .populate("asset", "name assetId")
    .populate("requestedBy", "name email role")
    .populate("department", "name")
    .populate("hodAction.actionBy", "name")
    .sort({ createdAt: -1 });

  const headers = [
    "Request ID", "Asset Name", "Asset ID", "Requested By",
    "Role", "Department", "Qty Requested", "Purpose",
    "Status", "HOD Action By", "HOD Remarks",
    "Required From", "Required Until", "Submitted On",
  ];

  const rows = requests.map((r) => [
    r.requestId, r.asset?.name || "", r.asset?.assetId || "",
    r.requestedBy?.name || "", r.requestedBy?.role || "",
    r.department?.name || "", r.quantityRequested, r.purpose,
    r.status, r.hodAction?.actionBy?.name || "",
    r.hodAction?.remarks || "",
    r.requiredFrom ? new Date(r.requiredFrom).toLocaleDateString("en-IN") : "",
    r.requiredUntil ? new Date(r.requiredUntil).toLocaleDateString("en-IN") : "",
    new Date(r.createdAt).toLocaleDateString("en-IN"),
  ]);

  return {
    csv: buildCSV(headers, rows),
    count: requests.length,
    filename: `request-report-${Date.now()}.csv`,
  };
};

/**
 * Issue / Return Report
 */
export const generateIssueReport = async ({ isReturned, startDate, endDate }) => {
  const query = {};
  if (isReturned !== undefined) query.isReturned = isReturned === "true";
  if (startDate || endDate) {
    query.issueDate = {};
    if (startDate) query.issueDate.$gte = new Date(startDate);
    if (endDate) query.issueDate.$lte = new Date(endDate);
  }

  const issued = await IssuedAsset.find(query)
    .populate("asset", "name assetId")
    .populate("issuedTo", "name email")
    .populate("issuedBy", "name")
    .populate("department", "name")
    .sort({ issueDate: -1 });

  const headers = [
    "Issue ID", "Asset Name", "Asset ID", "Issued To",
    "Issued To Email", "Issued By", "Department",
    "Qty Issued", "Issue Date", "Expected Return",
    "Actual Return", "Status", "Return Condition",
    "Fine (₹)", "Damage Notes",
  ];

  const rows = issued.map((i) => [
    i.issueId, i.asset?.name || "", i.asset?.assetId || "",
    i.issuedTo?.name || "", i.issuedTo?.email || "",
    i.issuedBy?.name || "", i.department?.name || "",
    i.quantityIssued,
    new Date(i.issueDate).toLocaleDateString("en-IN"),
    i.expectedReturnDate ? new Date(i.expectedReturnDate).toLocaleDateString("en-IN") : "",
    i.actualReturnDate ? new Date(i.actualReturnDate).toLocaleDateString("en-IN") : "",
    i.isReturned ? "Returned" : "Active",
    i.condition || "", i.fine || 0, i.damageNotes || "",
  ]);

  return {
    csv: buildCSV(headers, rows),
    count: issued.length,
    filename: `issue-report-${Date.now()}.csv`,
  };
};

/**
 * Department Summary Report
 */
export const generateDepartmentReport = async () => {
  const departments = await Department.find({ isActive: true });

  const rows = await Promise.all(
    departments.map(async (dept) => {
      const [totalAssets, totalUsers, pendingRequests, activeIssued] = await Promise.all([
        Asset.countDocuments({ department: dept._id, isActive: true }),
        User.countDocuments({ department: dept._id, isActive: true }),
        AssetRequest.countDocuments({ department: dept._id, status: "Pending" }),
        IssuedAsset.countDocuments({ department: dept._id, isReturned: false }),
      ]);
      return [dept.name, dept.code, totalAssets, totalUsers, pendingRequests, activeIssued];
    })
  );

  const headers = [
    "Department", "Code", "Total Assets",
    "Total Users", "Pending Requests", "Active Issues",
  ];

  return {
    csv: buildCSV(headers, rows),
    count: departments.length,
    filename: `department-report-${Date.now()}.csv`,
  };
};

/**
 * Dashboard summary stats for reports page
 */
export const getReportSummary = async () => {
  const [
    totalAssets, availableAssets, issuedAssets, damagedAssets,
    totalRequests, pendingRequests, totalUsers, totalDepts,
    recentRequests, assetsByCategory, monthlyTrend,
  ] = await Promise.all([
    Asset.countDocuments({ isActive: true }),
    Asset.countDocuments({ isActive: true, status: "Available" }),
    IssuedAsset.countDocuments({ isReturned: false }),
    Asset.countDocuments({ isActive: true, status: "Damaged" }),
    AssetRequest.countDocuments(),
    AssetRequest.countDocuments({ status: "Pending" }),
    User.countDocuments({ isActive: true }),
    Department.countDocuments({ isActive: true }),
    AssetRequest.find().sort({ createdAt: -1 }).limit(5)
      .populate("asset", "name").populate("requestedBy", "name"),
    Asset.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: "$quantity" } } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
      { $unwind: "$cat" },
      { $project: { name: "$cat.name", count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    AssetRequest.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          requests: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]),
  ]);

  return {
    assets: { total: totalAssets, available: availableAssets, issued: issuedAssets, damaged: damagedAssets },
    requests: { total: totalRequests, pending: pendingRequests },
    users: totalUsers,
    departments: totalDepts,
    recentRequests,
    assetsByCategory,
    monthlyTrend: monthlyTrend.map((m) => ({
      month: new Date(m._id.year, m._id.month - 1).toLocaleString("default", { month: "short" }),
      requests: m.requests,
    })),
  };
};
