// services/department.service.js
import Department from "../models/Department.model.js";
import ActivityLog from "../models/ActivityLog.model.js";
import AppError from "../utils/AppError.js";

export const getAllDepartments = async ({ page = 1, limit = 10, search = "" }) => {
  const query = search ? { name: { $regex: search, $options: "i" } } : {};
  const skip = (page - 1) * limit;

  const [departments, total] = await Promise.all([
    Department.find(query)
      .populate("hod", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Department.countDocuments(query),
  ]);

  return { departments, total };
};

export const getDepartmentById = async (id) => {
  const dept = await Department.findById(id).populate("hod", "name email role");
  if (!dept) throw new AppError("Department not found", 404);
  return dept;
};

export const createDepartment = async (data, performedBy, req) => {
  const existing = await Department.findOne({
    $or: [{ name: data.name }, { code: data.code.toUpperCase() }],
  });
  if (existing) throw new AppError("Department name or code already exists", 409);

  const dept = await Department.create(data);

  await ActivityLog.log({
    action: "DEPARTMENT_CREATED",
    performedBy,
    description: `Created department: ${dept.name}`,
    target: { model: "Department", id: dept._id, name: dept.name },
    req,
  });

  return dept;
};

export const updateDepartment = async (id, data, performedBy, req) => {
  const dept = await Department.findByIdAndUpdate(id, data, {
    new: true, runValidators: true,
  }).populate("hod", "name email");

  if (!dept) throw new AppError("Department not found", 404);

  await ActivityLog.log({
    action: "DEPARTMENT_UPDATED",
    performedBy,
    description: `Updated department: ${dept.name}`,
    target: { model: "Department", id: dept._id, name: dept.name },
    req,
  });

  return dept;
};

export const deleteDepartment = async (id, performedBy, req) => {
  const dept = await Department.findById(id);
  if (!dept) throw new AppError("Department not found", 404);

  await Department.findByIdAndDelete(id);

  await ActivityLog.log({
    action: "DEPARTMENT_DELETED",
    performedBy,
    description: `Deleted department: ${dept.name}`,
    target: { model: "Department", id: dept._id, name: dept.name },
    req,
  });
};
