// controllers/request.controller.js
import * as requestService from "../services/request.service.js";
import { sendSuccess, buildPaginationMeta } from "../utils/apiResponse.js";

export const getAllRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "", search = "" } = req.query;
    const { requests, total } = await requestService.getAllRequests({
      page: +page, limit: +limit, status, search,
      userId: req.user._id,
      role: req.user.role,
      department: req.user.department,
    });
    sendSuccess(res, {
      message: "Requests fetched",
      data: requests,
      meta: buildPaginationMeta({ page: +page, limit: +limit, total }),
    });
  } catch (error) { next(error); }
};

export const getRequestById = async (req, res, next) => {
  try {
    const request = await requestService.getRequestById(req.params.id);
    sendSuccess(res, { message: "Request fetched", data: request });
  } catch (error) { next(error); }
};

export const createRequest = async (req, res, next) => {
  try {
    const request = await requestService.createRequest(req.body, req.user, req);
    sendSuccess(res, { statusCode: 201, message: "Request submitted successfully", data: request });
  } catch (error) { next(error); }
};

export const hodAction = async (req, res, next) => {
  try {
    const request = await requestService.hodAction(req.params.id, req.body, req.user, req);
    sendSuccess(res, { message: `Request ${req.body.action}d successfully`, data: request });
  } catch (error) { next(error); }
};

export const issueAsset = async (req, res, next) => {
  try {
    const issued = await requestService.issueAsset(req.params.id, req.body, req.user, req);
    sendSuccess(res, { message: "Asset issued successfully", data: issued });
  } catch (error) { next(error); }
};

export const returnAsset = async (req, res, next) => {
  try {
    const issued = await requestService.returnAsset(req.params.id, req.body, req.user, req);
    sendSuccess(res, { message: "Asset returned successfully", data: issued });
  } catch (error) { next(error); }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const request = await requestService.cancelRequest(req.params.id, req.user._id, req);
    sendSuccess(res, { message: "Request cancelled", data: request });
  } catch (error) { next(error); }
};

export const getIssuedAssets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isReturned } = req.query;
    const { issued, total } = await requestService.getIssuedAssets({
      page: +page, limit: +limit, isReturned,
      userId: req.user._id, role: req.user.role,
    });
    sendSuccess(res, {
      message: "Issued assets fetched",
      data: issued,
      meta: buildPaginationMeta({ page: +page, limit: +limit, total }),
    });
  } catch (error) { next(error); }
};

export const getRequestStats = async (req, res, next) => {
  try {
    const stats = await requestService.getRequestStats();
    sendSuccess(res, { message: "Stats fetched", data: stats });
  } catch (error) { next(error); }
};
