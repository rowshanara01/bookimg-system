/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { driverService } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DriverAvailability, DriverStatus } from "./driver.type";

export const driverController = {
  addDriverInfo: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.id;
    const result = await driverService.addDriverInfo(req.body, userId);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Driver information added",
      data: result,
    });
  }),
  approveDriver: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await driverService.approveDriver(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: DriverStatus.Approved,
      data: result,
    });
  }),
  getCompletedRides: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.id;
    const result = await driverService.getCompletedRides(driverId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Completed Rides History Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }),
  updateAvailabilityToOnline: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const driverId = req.id;
      const result = await driverService.updateAvailabilityToOnline(driverId);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.ACCEPTED,
        message: "Availability updated to " + DriverAvailability.Online,
        data: result,
      });
    },
  ),
  updateAvailabilityToOffline: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const driverId = req.id;
      const result = await driverService.updateAvailabilityToOffline(driverId);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.ACCEPTED,
        message: "Availability updated to " + DriverAvailability.Offline,
        data: result,
      });
    },
  ),
  suspendDriver: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await driverService.suspendDriver(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: DriverStatus.Suspended,
      data: result,
    });
  }),
  getEarnings: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.id;
    const result = await driverService.getEarnings(driverId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Total Earning",
      data: result,
    });
  }),
  getAllDrivers: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await driverService.getAllDrivers();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Drivers Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }),
};
