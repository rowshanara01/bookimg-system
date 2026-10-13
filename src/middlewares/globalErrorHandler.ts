/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { envVars } from "../config/env";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }
  if (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!!";

    res.status(statusCode).json({
      message: message,
      success: false,
      errors: err,
    });
  }
};
