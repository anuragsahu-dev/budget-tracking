import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendApiResponse } from "../../utils/apiResponse";
import { SessionService, cookieOptions } from "../session/session.service";
import ms from "ms";
import { config } from "../../config/config";
import { EmailInput, VerifyInput, FullNameInput } from "./auth.validation";
import { getValidatedBody } from "../../types/express";
import { User } from "../../generated/prisma/client";
import { ApiError } from "../../middlewares/error.middleware";

function getRefreshToken(req: Request): string | undefined {
  if (req.cookies?.refreshToken) {
    return req.cookies.refreshToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const [scheme, token] = authHeader.split(" ");
    if ((scheme === "Bearer" || scheme === "Refresh") && token) {
      return token;
    }
  }

  // For mobile apps that can't use cookies
  const refreshHeader = req.headers["x-refresh-token"];
  if (typeof refreshHeader === "string") {
    return refreshHeader;
  }

  return undefined;
}

export const AuthController = {
  start: asyncHandler(async (req: Request, res: Response) => {
    const startData = getValidatedBody<EmailInput>(req);
    const otp = await AuthService.start(startData);
    return sendApiResponse(res, 200, "OTP sent successfully", otp);
  }),

  verify: asyncHandler(async (req: Request, res: Response) => {
    const verifyData = getValidatedBody<VerifyInput>(req);
    const data = await AuthService.verify(verifyData);

    const { accessToken, refreshToken } = await SessionService.generateTokens(
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
    const userId = req.userId as string;
    const setData = getValidatedBody<FullNameInput>(req);
    const result = await AuthService.setName(setData, userId);
    return sendApiResponse(res, 200, "User's name set successfully", result);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const user = await AuthService.me(userId);
    return sendApiResponse(res, 200, "User fetched successfully", user);
  }),

  googleCallback: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as User;
    if (!user) {
      throw new ApiError(401, "Authentication failed. Please log in.");
    }

    const { accessToken, refreshToken } = await SessionService.generateTokens(
      user.id,
      user.role
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
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  }),

  /**
   * Logout current session.
   * No authentication required - allows logout even with expired access token.
   * Uses refresh token to identify and revoke the session in DB.
   */
  logout: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = getRefreshToken(req);

    let sessionRevoked = false;

    // Try to revoke session if refresh token is provided
    if (refreshToken) {
      const result = await SessionService.logout(refreshToken);
      sessionRevoked = result.revoked;
    }

    // Always clear cookies - this is the primary logout action
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return sendApiResponse(res, 200, "Logged out successfully", {
      sessionRevoked,
    });
  }),

  logoutAll: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const result = await SessionService.logoutAll(userId);

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return sendApiResponse(res, 200, "Logged out from all devices", {
      sessionsRevoked: result.count,
    });
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token not provided");
    }

    const { accessToken } = await SessionService.refreshAccessToken(
      refreshToken
    );

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ms(config.auth.accessTokenExpiry),
    });

    return sendApiResponse(res, 200, "Token refreshed successfully", {
      accessToken,
    });
  }),
};
