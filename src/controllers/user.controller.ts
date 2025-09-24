import ms from "ms";
import crypto from "node:crypto";
import logger from "../config/logger";
import { config } from "../config/config";
import prisma from "../database/prisma";
import { ApiError, asyncHandler } from "../middlewares/error.middleware";
import {
  cookieOptions,
  generateAccessRefreshToken,
} from "../utils/accessRefreshToken";
import { sendApiResponse } from "../utils/apiResponse";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail";
import { createHash, verifyHash } from "../utils/password";
import { generateTemporaryToken } from "../utils/token";
import { Prisma } from "@prisma/client";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existedUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const hashedPassword = await createHash(password);

  const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken();

  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  const baseUrl = config.url.email_verification;
  const verificationLink = `${baseUrl}/api/v1/users/verify-email/${unHashedToken}`;

  await sendEmail({
    email: newUser.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      newUser.username,
      verificationLink
    ),
  });

  return sendApiResponse(
    res,
    201,
    "User registered successfully and verification email has been sent on your email",
    newUser
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await verifyHash(password, user.password))) {
    throw new ApiError(401, "Invalid email or password"); // 🔹 401 Unauthorized
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Email not verified, first verify your email");
  }
  // 403 Forbidden
  // Means: The user is authenticated but not authorized.

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user.id
  );

  const responseData = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    accessToken,
    refreshToken,
  };

  res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ms(config.auth.accessTokenExpiry),
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: ms(config.auth.refreshTokenExpiry),
    });

  return sendApiResponse(res, 200, "User Logged In successfully", responseData);
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.userId;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // P2025 = Record not found
        throw new ApiError(404, "User not found");
      }
    }

    logger.error("Unexpected DB error during logout", { error });
    throw new ApiError(500, "Internal server error");
  }

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions);

  return sendApiResponse(res, 200, "User logged out successfully");
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sendApiResponse(res, 200, "User data fetched successfully", user);
});

const regex = /^[a-f0-9]{64}$/i;

const verifyEmail = asyncHandler(async (req, res) => {
  const verificationToken = req.params.verificationToken?.trim();

  if (!verificationToken || !regex.test(verificationToken)) {
    throw new ApiError(400, "Email verification token is missing or invalid");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  if (!user) {
    throw new ApiError(400, "Token is invalid or expired");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: null,
      emailVerificationExpiry: null,
      isEmailVerified: true,
    },
  });

  const responseData = {
    id: user.id,
    email: user.email,
    username: user.username,
    isEmailVerified: true,
  };

  return sendApiResponse(res, 200, "Email is verified", responseData);
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.isEmailVerified) {
    return sendApiResponse(
      res,
      200,
      "If your account is eligible, a verification email has been sent"
    );
  }

  const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken();

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
    },
  });

  const baseUrl = config.url.email_verification;
  const verificationLink = `${baseUrl}/api/v1/users/verify-email/${unHashedToken}`;

  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      verificationLink
    ),
  });

  return sendApiResponse(res, 200, "Mail has been sent to your email id");
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
};
