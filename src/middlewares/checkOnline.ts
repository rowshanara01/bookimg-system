import { StatusCodes } from "http-status-codes";
import AppError from "../helpers/AppError";
import { Driver } from "../modules/driver/driver.model";
import { DriverAvailability } from "../modules/driver/driver.type";
import { NextFunction, Request, Response } from "express";

export const checkDriverOnline = async (req: Request, res: Response, next: NextFunction) => {
  const driver = await Driver.findOne({ userId: req.id }).populate("userId").exec();
  if (driver?.availability !== DriverAvailability.Online) {
    throw new AppError(StatusCodes.FORBIDDEN, "Driver must be " + DriverAvailability.Online);
  }

  next();
};
