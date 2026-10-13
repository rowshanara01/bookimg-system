import { StatusCodes } from "http-status-codes";
import AppError from "../helpers/AppError";
import { Driver } from "../modules/driver/driver.model";
import { DriverStatus } from "../modules/driver/driver.type";
import { NextFunction, Request, Response } from "express";

export const checkDriverApprove = async (req: Request, res: Response, next: NextFunction) => {
  const driver = await Driver.findOne({ userId: req.id });
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver must be add driving information");
  }
  if (driver?.status == DriverStatus.Pending || driver?.status == DriverStatus.Suspended) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Driver account is now ${DriverStatus?.Pending ? DriverStatus?.Pending : DriverStatus?.Suspended}`,
    );
  }
  next();
};
