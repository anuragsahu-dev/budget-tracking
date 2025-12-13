import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { config } from "../config/config";
import { ApiError } from "../middlewares/error.middleware";
import logger from "../config/logger";
import type { CookieOptions } from "express";
import { UserRole } from "../generated/prisma/client";

interface GenerateToken {
  accessToken: string;
  refreshToken: string;
}

const isProd = config.server.nodeEnv === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
} as const;

const generateAccessRefreshToken = async (
  id: string,
  role: UserRole
): Promise<GenerateToken> => {
  try {
    const refreshToken = jwt.sign(
      {
        id,
      },
      config.auth.refreshTokenSecret,
      { expiresIn: config.auth.refreshTokenExpiry }
    );

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await prisma.session.create({
      data: {
        refreshToken: hashedRefreshToken,
        userId: id,
      },
    });

    const accessToken = jwt.sign(
      {
        id,
        role: role, // it's neccessary for RBAC
      },
      config.auth.accessTokenSecret,
      { expiresIn: config.auth.accessTokenExpiry }
    );

    return { refreshToken, accessToken };
  } catch (error) {
    logger.error("Error occured while generating access and refresh token", {
      userId: id,
      error:
        error instanceof Error
          ? { mesage: error.message, stack: error.stack }
          : error,
    });
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

export { cookieOptions, generateAccessRefreshToken };
