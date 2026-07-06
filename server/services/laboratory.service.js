// services/laboratory.service.js
import Laboratory from "../models/Laboratory.model.js";
import ActivityLog from "../models/ActivityLog.model.js";
import AppError from "../utils/AppError.js";

export const getAllLabs = async ({ page = 1, limit = 10, search = "", department = "" }) => {
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (department) query.department = department;

  const skip = (page - 1) * limit;
  const [labs, total] = await Promise.all([
    Laboratory.find(query)
      .populate("department", "name code")
      .populate("labIncharge", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Laboratory.countDocuments(query),
  ]);

  return { labs, total };
};

export const getLabById = async (id) => {
  const lab = await Laboratory.findById(id)
    .populate("department", "name code")
    .populate("labIncharge", "name email role");
  if (!lab) throw new AppError("Laboratory not found", 404);
  return lab;
};

export const createLab = async (data, performedBy, req) => {
  const existing = await Laboratory.findOne({ code: data.code?.toUpperCase() });
  if (existing) throw new AppError("Lab code already exists", 409);

  const lab = await Laboratory.create(data);

  await ActivityLog.log({
    action: "LAB_CREATED",
    performedBy,
    description: `Created laboratory: ${lab.name}`,
    target: { model: "Laboratory", id: lab._id, name: lab.name },
    req,
  });

  return lab;
};

export const updateLab = async (id, data, performedBy, req) => {
  const lab = await Laboratory.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate("department", "name code")
    .populate("labIncharge", "name email");

  if (!lab) throw new AppError("Laboratory not found", 404);

  await ActivityLog.log({
    action: "LAB_UPDATED",
    performedBy,
    description: `Updated laboratory: ${lab.name}`,
    target: { model: "Laboratory", id: lab._id, name: lab.name },
    req,
  });

  return lab;
};

export const deleteLab = async (id, performedBy, req) => {
  const lab = await Laboratory.findById(id);
  if (!lab) throw new AppError("Laboratory not found", 404);

  await Laboratory.findByIdAndDelete(id);

  await ActivityLog.log({
    action: "LAB_DELETED",
    performedBy,
    description: `Deleted laboratory: ${lab.name}`,
    target: { model: "Laboratory", id: lab._id, name: lab.name },
    req,
  });
};
