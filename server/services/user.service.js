// services/user.service.js
import User from "../models/User.model.js";
import ActivityLog from "../models/ActivityLog.model.js";
import AppError from "../utils/AppError.js";

/**
 * Get all users with pagination, search, filter
 */
export const getAllUsers = async ({ page = 1, limit = 10, search = "", role = "", isActive }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === "true";

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query)
      .populate("department", "name code")
      .populate("laboratory", "name code")
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return { users, total };
};

/**
 * Get single user by ID
 */
export const getUserById = async (id) => {
  const user = await User.findById(id)
    .populate("department", "name code")
    .populate("laboratory", "name code")
    .select("-password -refreshToken");

  if (!user) throw new AppError("User not found", 404);
  return user;
};

/**
 * Create new user (Admin only)
 */
export const createUser = async (userData, performedBy, req) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new AppError("Email already exists", 409);

  const user = await User.create(userData);

  await ActivityLog.log({
    action: "USER_CREATED",
    performedBy,
    description: `Created user: ${user.name} (${user.role})`,
    target: { model: "User", id: user._id, name: user.name },
    req,
  });

  return user;
};

/**
 * Update user
 */
export const updateUser = async (id, updateData, performedBy, req) => {
  // Check email uniqueness if changing email
  if (updateData.email) {
    const existing = await User.findOne({ email: updateData.email, _id: { $ne: id } });
    if (existing) throw new AppError("Email already in use", 409);
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  if (!user) throw new AppError("User not found", 404);

  await ActivityLog.log({
    action: "USER_UPDATED",
    performedBy,
    description: `Updated user: ${user.name}`,
    target: { model: "User", id: user._id, name: user.name },
    req,
  });

  return user;
};

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (id, performedBy, req) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  await ActivityLog.log({
    action: user.isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
    performedBy,
    description: `${user.isActive ? "Activated" : "Deactivated"} user: ${user.name}`,
    target: { model: "User", id: user._id, name: user.name },
    req,
  });

  return user;
};

/**
 * Delete user
 */
export const deleteUser = async (id, performedBy, req) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);

  // Prevent deleting yourself
  if (id.toString() === performedBy.toString()) {
    throw new AppError("You cannot delete your own account", 400);
  }

  await User.findByIdAndDelete(id);

  await ActivityLog.log({
    action: "USER_DELETED",
    performedBy,
    description: `Deleted user: ${user.name} (${user.email})`,
    target: { model: "User", id: user._id, name: user.name },
    req,
  });
};

/**
 * Get user stats
 */
export const getUserStats = async () => {
  const stats = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const total = await User.countDocuments();
  const active = await User.countDocuments({ isActive: true });
  return { total, active, inactive: total - active, byRole: stats };
};
