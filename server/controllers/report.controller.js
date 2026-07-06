// controllers/report.controller.js
import * as reportService from "../services/report.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

const sendCSV = (res, { csv, filename }) => {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
};

export const getSummary = async (req, res, next) => {
  try {
    const summary = await reportService.getReportSummary();
    sendSuccess(res, { message: "Summary fetched", data: summary });
  } catch (error) { next(error); }
};

export const assetReport = async (req, res, next) => {
  try {
    const result = await reportService.generateAssetReport(req.query);
    sendCSV(res, result);
  } catch (error) { next(error); }
};

export const requestReport = async (req, res, next) => {
  try {
    const result = await reportService.generateRequestReport(req.query);
    sendCSV(res, result);
  } catch (error) { next(error); }
};

export const issueReport = async (req, res, next) => {
  try {
    const result = await reportService.generateIssueReport(req.query);
    sendCSV(res, result);
  } catch (error) { next(error); }
};

export const departmentReport = async (req, res, next) => {
  try {
    const result = await reportService.generateDepartmentReport();
    sendCSV(res, result);
  } catch (error) { next(error); }
};
