import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma";
import { config } from "../config/config";
import { ApiError } from "../middlewares/error.middleware";
import logger from "../config/logger";

interface GenerateToken {
  accessToken: string;
  refreshToken: string;
}

const cookieOptions = {
  httpOnly: true,
  secure: config.server.nodeEnv === "production",
};

const generateAccessRefreshToken = async (
  id: string
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

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    const accessToken = jwt.sign(
      {
        id,
        role: user.role,
      },
      config.auth.accessTokenSecret,
      { expiresIn: config.auth.accessTokenExpiry }
    );

    return { refreshToken, accessToken };
  } catch (error) {
    logger.error("Error occured while generating access and refresh token", {
      error,
    });
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

export { cookieOptions, generateAccessRefreshToken };
