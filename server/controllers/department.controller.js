// controllers/department.controller.js
import * as deptService from "../services/department.service.js";
import { sendSuccess, buildPaginationMeta } from "../utils/apiResponse.js";

export const getAllDepartments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const { departments, total } = await deptService.getAllDepartments({ page: +page, limit: +limit, search });
    sendSuccess(res, {
      message: "Departments fetched",
      data: departments,
      meta: buildPaginationMeta({ page: +page, limit: +limit, total }),
    });
  } catch (error) { next(error); }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await deptService.getDepartmentById(req.params.id);
    sendSuccess(res, { message: "Department fetched", data: dept });
  } catch (error) { next(error); }
};

export const createDepartment = async (req, res, next) => {
  try {
    const dept = await deptService.createDepartment(req.body, req.user._id, req);
    sendSuccess(res, { statusCode: 201, message: "Department created", data: dept });
  } catch (error) { next(error); }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const dept = await deptService.updateDepartment(req.params.id, req.body, req.user._id, req);
    sendSuccess(res, { message: "Department updated", data: dept });
  } catch (error) { next(error); }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    await deptService.deleteDepartment(req.params.id, req.user._id, req);
    sendSuccess(res, { message: "Department deleted" });
  } catch (error) { next(error); }
};
