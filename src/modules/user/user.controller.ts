/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

export const userController = {
  getAllUsers: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsers();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }),
  updateUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await userService.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User Updated Successfully",
      data: user,
    });
  }),
  blockUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.blockUser(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User is blocked",
      data: result,
    });
  }),
  unblockUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.unblockUser(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User is unblocked",
      data: result,
    });
  }),
};
