// controllers/laboratory.controller.js
import * as labService from "../services/laboratory.service.js";
import { sendSuccess, buildPaginationMeta } from "../utils/apiResponse.js";

export const getAllLabs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", department = "" } = req.query;
    const { labs, total } = await labService.getAllLabs({ page: +page, limit: +limit, search, department });
    sendSuccess(res, {
      message: "Laboratories fetched",
      data: labs,
      meta: buildPaginationMeta({ page: +page, limit: +limit, total }),
    });
  } catch (error) { next(error); }
};

export const getLabById = async (req, res, next) => {
  try {
    const lab = await labService.getLabById(req.params.id);
    sendSuccess(res, { message: "Laboratory fetched", data: lab });
  } catch (error) { next(error); }
};

export const createLab = async (req, res, next) => {
  try {
    const lab = await labService.createLab(req.body, req.user._id, req);
    sendSuccess(res, { statusCode: 201, message: "Laboratory created", data: lab });
  } catch (error) { next(error); }
};

export const updateLab = async (req, res, next) => {
  try {
    const lab = await labService.updateLab(req.params.id, req.body, req.user._id, req);
    sendSuccess(res, { message: "Laboratory updated", data: lab });
  } catch (error) { next(error); }
};

export const deleteLab = async (req, res, next) => {
  try {
    await labService.deleteLab(req.params.id, req.user._id, req);
    sendSuccess(res, { message: "Laboratory deleted" });
  } catch (error) { next(error); }
};
