import { asyncHandler } from "../../utils/asyncHandler";

import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendApiResponse } from "../../utils/apiResponse";
import {
  generateAccessRefreshToken,
  cookieOptions,
} from "../../utils/accessRefreshToken";
import ms from "ms";
import { config } from "../../config/config";
import { EmailInput, VerifyInput } from "./auth.validation";
import { getValidatedBody } from "../../types/express";

export const AuthController = {
  start: asyncHandler(async (req: Request, res: Response) => {
    const startData = getValidatedBody<EmailInput>(req);
    const otp = await AuthService.start(startData);
    return sendApiResponse(res, 200, "OTP sent successfully", otp);
  }),

  verify: asyncHandler(async (req: Request, res: Response) => {
    const verifyData = getValidatedBody<VerifyInput>(req);
    const data = await AuthService.verify(verifyData);
    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      data.data.id,
      data.data.role
    );

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: ms(config.auth.refreshTokenExpiry),
    });
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ms(config.auth.accessTokenExpiry),
    });

    return sendApiResponse(res, 200, "User verified successfully", {
      accessToken,
      refreshToken,
      user: data.data,
    });
  }),

  setName: asyncHandler(async (req: Request, res: Response) => {
    const setData = getValidatedBody<SetInput>(req);
    const data = await AuthService.setName(setData);
    return sendApiResponse(res, 200, "User name set successfully", data);
  }),
};

/*

  setName: asyncHandler(async (req: Request, res: Response) => {}),

  me: asyncHandler(async (req: Request, res: Response) => {}),

  google: asyncHandler(async (req: Request, res: Response) => {}),

  googleCallback: asyncHandler(async (req: Request, res: Response) => {}),

  logout: asyncHandler(async (req: Request, res: Response) => {}),
*/
