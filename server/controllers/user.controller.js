// controllers/user.controller.js
import * as userService from "../services/user.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { buildPaginationMeta } from "../utils/apiResponse.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", role = "", isActive } = req.query;
    const { users, total } = await userService.getAllUsers({
      page: +page, limit: +limit, search, role, isActive,
    });

    sendSuccess(res, {
      message: "Users fetched successfully",
      data: users,
      meta: buildPaginationMeta({ page: +page, limit: +limit, total }),
    });
  } catch (error) { next(error); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, { message: "User fetched", data: user });
  } catch (error) { next(error); }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user._id, req);
    sendSuccess(res, { statusCode: 201, message: "User created successfully", data: user });
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user._id, req);
    sendSuccess(res, { message: "User updated successfully", data: user });
  } catch (error) { next(error); }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id, req.user._id, req);
    sendSuccess(res, {
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user._id, req);
    sendSuccess(res, { message: "User deleted successfully" });
  } catch (error) { next(error); }
};

export const getUserStats = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats();
    sendSuccess(res, { message: "User stats fetched", data: stats });
  } catch (error) { next(error); }
};
