import { StatusCodes } from "http-status-codes";
import AppError from "../../helpers/AppError";
import { User } from "../user/user.model";
import { IUser } from "../user/user.type";
import { createNewAccessTokenWithRefreshToken, createUsersToken } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";
import { Response } from "express";

export const authService = {
  registerUser: async (payload: IUser) => {
    const { email } = payload;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");
    }

    const user = User.create(payload);
    return user;
  },
  getNewAccessToken: async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
    return {
      accessToken: newAccessToken,
    };
  },
  login: async (res: Response, payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Email does not exist");
    }
    const isPasswordMatch = await isUserExist.comparePassword(password as string);
    if (!isPasswordMatch) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Password");
    }

    const { accessToken, refreshToken } = createUsersToken(isUserExist);
    setAuthCookie(res, {
      accessToken,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
      user: isUserExist,
    };
  },
};
