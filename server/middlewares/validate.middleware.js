// middlewares/validate.middleware.js
import { validationResult } from "express-validator";

/**
 * Runs after express-validator checks.
 * If errors exist, returns 400 with all error messages.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      message: messages[0], // first error
      errors: messages,     // all errors
    });
  }

  next();
};
