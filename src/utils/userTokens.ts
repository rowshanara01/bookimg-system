import { StatusCodes } from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../helpers/AppError";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../modules/user/user.type";

export const createUsersToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    email: user?.email,
    userId: user._id,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
  const isUserExist = await User.findOne({
    email: verifiedRefreshToken.email,
  });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  }

  if (isUserExist?.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExist?.isBlocked && "Blocked"}`);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  return accessToken;
};
