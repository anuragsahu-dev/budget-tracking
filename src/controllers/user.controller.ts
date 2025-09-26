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
import {
  emailVerificationMailgenContent,
  forgetPasswordMailgenContent,
  sendEmail,
} from "../utils/mail";
import { createHash, verifyHash } from "../utils/password";
import { generateTemporaryToken } from "../utils/token";
import { Prisma } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

// logging done
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username, fullName } = req.body;

  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existedUser) {
    logger.warn(
      "Duplicate registration attempt with existed email or username",
      {
        email,
        username,
        ip: req.ip,
      }
    );
    throw new ApiError(400, "User with this email or username already exists");
  }

  const hashedPassword = await createHash(password);

  const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken();

  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      fullName,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
    },
  });

  const baseUrl = config.url.email_verification;
  const verificationLink = `${baseUrl}/api/v1/users/verify-email/${unHashedToken}`;

  await sendEmail({
    email: newUser.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      newUser.fullName,
      verificationLink
    ),
  });

  logger.info("User registered successfully", {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    ip: req.ip,
  });

  return sendApiResponse(
    res,
    201,
    "User registered successfully and verification email has been sent on your email"
  );
});

// logging done
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    logger.warn("Login failed because of invalid email", { email, ip: req.ip });
    throw new ApiError(401, "Invalid email or password"); // 🔹 401 Unauthorized
  }

  if (!user.password) {
    logger.warn(
      "Login attempted by Google account and does not have password",
      { email, ip: req.ip }
    );
    throw new ApiError(
      400,
      "This account is registered with Google. Please log in using Google."
    );
  }

  const isPasswordValid = await verifyHash(password, user.password);
  if (!isPasswordValid) {
    logger.warn("Login failed: incorrect password", { email, ip: req.ip });
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    logger.warn("Login attempt with unverified email", { email, ip: req.ip });
    throw new ApiError(403, "Email not verified, first verify your email");
  }
  // 403 Forbidden
  // Means: The user is authenticated but not authorized.

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user.id
  );

  res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ms(config.auth.accessTokenExpiry),
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: ms(config.auth.refreshTokenExpiry),
    });

  logger.info("User logged in successfully", {
    id: user.id,
    email,
    ip: req.ip,
  });

  return sendApiResponse(res, 200, "User Logged In successfully", {
    accessToken,
    refreshToken,
  });
});

// logging done
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
        logger.warn("Logout failed: user not found", { userId, ip: req.ip });
        throw new ApiError(404, "User not found");
      }
    }

    logger.error("Unexpected DB error during logout", {
      userId,
      ip: req.ip,
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    throw new ApiError(500, "Internal server error");
  }

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions);

  logger.info("User logged out successfully", { userId, ip: req.ip });

  return sendApiResponse(res, 200, "User logged out successfully");
});

// logging done
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
      fullName: true,
    },
  });

  if (!user) {
    logger.warn("Tried to fetch current user, but user not exist", {
      userId,
      ip: req.ip,
    });
    throw new ApiError(404, "User not found");
  }

  logger.info("Fetched current user data successfully", { userId, ip: req.ip });

  return sendApiResponse(res, 200, "User data fetched successfully", user);
});

const regex = /^[a-f0-9]{64}$/i;

// logging done
const verifyEmail = asyncHandler(async (req, res) => {
  const verificationToken = req.params.verificationToken?.trim();

  if (!verificationToken || !regex.test(verificationToken)) {
    logger.warn("Email verification attempt with invalid token", {
      ip: req.ip,
    });
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
      fullName: true,
    },
  });

  if (!user) {
    logger.warn("Email verification failed: token invalid or expired", {
      ip: req.ip,
      hashedToken,
    });
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

  logger.info("Email verification done", {
    userId: user.id,
    email: user.email,
    ip: req.ip,
  });

  const responseData = {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    isEmailVerified: true,
  };

  return sendApiResponse(res, 200, "Email is verified", responseData);
});

// logging done
const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.isEmailVerified) {
    logger.warn(
      "Resend email verification failed: user not found or already verified",
      {
        email,
        isEmailVerified: user?.isEmailVerified,
        ip: req.ip,
      }
    );
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
      user.fullName,
      verificationLink
    ),
  });

  logger.info("Verification email resent successfully", {
    userId: user.id,
    email: user.email,
    ip: req.ip,
  });

  return sendApiResponse(res, 200, "Mail has been sent to your email id");
});

interface RefreshTokenPayload extends JwtPayload {
  id: string;
}

// logging done
const renewAccessToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const userToken = req.cookies.refreshToken || token;

  if (!userToken) {
    logger.warn("Refresh token not present", { ip: req.ip });
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decoded = jwt.verify(
      userToken,
      config.auth.refreshTokenSecret
    ) as RefreshTokenPayload;

    if (!decoded.id) {
      logger.warn("Refresh token decoded but payload invalid", {
        ip: req.ip,
      });
      throw new ApiError(401, "Invalid token payload");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      decoded.id
    );

    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: ms(config.auth.accessTokenExpiry),
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: ms(config.auth.refreshTokenExpiry),
      });

    logger.info("Access Token renewed successfully", {
      userId: decoded.id,
      ip: req.ip,
    });

    return sendApiResponse(res, 200, "Token renewed successfully", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Token renewal failed", {
      ip: req.ip,
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    throw new ApiError(401, "Invalid or expired token");
  }
});

// logging done
const forgetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken();

  let user;
  try {
    user = await prisma.user.update({
      where: { email },
      data: {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: tokenExpiry,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025" // User not found
    ) {
      logger.warn("Password reset requested for non-existing email", {
        email,
        ip: req.ip,
      });
      return sendApiResponse(
        res,
        200,
        "If this email exists in our system, a reset link has been sent."
      );
    }

    logger.error("Database error while handling password reset request", {
      email,
      ip: req.ip,
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    throw new ApiError(500, "Something went wrong. Please try again later.");
  }

  await sendEmail({
    email,
    subject: "Password reset request",
    mailgenContent: forgetPasswordMailgenContent(
      user.fullName,
      `${config.url.forget_password}/${unHashedToken}`
    ),
  });

  logger.info("Email is send for forget password request", {
    userId: user.id,
    ip: req.ip,
  });

  return sendApiResponse(
    res,
    200,
    "Password reset mail has been sent on your mail id"
  );
});

// logging done
const resetForgetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;

  if (!regex.test(resetToken)) {
    logger.warn("Token send for reset forget password is invalid", {
      ip: req.ip,
    });
    throw new ApiError(400, "Invalid reset token format");
  }

  const { newPassword } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const hashedPassword = await createHash(newPassword);

  const result = await prisma.user.updateMany({
    where: {
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { gt: new Date() },
    },
    data: {
      forgotPasswordExpiry: null,
      forgotPasswordToken: null,
      password: hashedPassword,
      refreshToken: null,
    },
  });

  if (result.count === 0) {
    logger.warn("Password reset failed - invalid or expired token", {
      ip: req.ip,
    });
    throw new ApiError(400, "Invalid or expired password reset link");
  }

  logger.info("Password reset successful", {
    ip: req.ip,
  });

  return sendApiResponse(res, 200, "Password reset successfully");
});

// logging done
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    logger.warn(
      "Old password is equal to new password, changing current password",
      { userId, ip: req.ip }
    );
    throw new ApiError(
      400,
      "New password must not be the same as the old password"
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    logger.warn("User not found, trying to change current password", {
      userId,
      ip: req.ip,
    });
    throw new ApiError(404, "User not found");
  }

  if (!user.password) {
    logger.warn(
      "Trying to change google logged in account and password is not set",
      { userId, ip: req.ip }
    );
    throw new ApiError(
      400,
      "This account was created with Google login. You cannot change password here."
    );
  }

  const isPasswordValid = await verifyHash(oldPassword, user.password);

  if (!isPasswordValid) {
    logger.warn("Old password is invalid, changing current user password", {
      userId,
      ip: req.ip,
    });
    throw new ApiError(401, "Invalid old password");
  }

  const hashedPassword = await createHash(newPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
      refreshToken: null,
    },
  });

  logger.info("User password updated successfully", { userId, ip: req.ip });

  return sendApiResponse(res, 200, "Password updated successfully");
});

// logging done
const setPassword = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    logger.warn("Password set failed - user not found", { userId, ip: req.ip });
    throw new ApiError(404, "User not found");
  }

  if (!user.googleId || user.password) {
    logger.warn("Password set not allowed", { userId, ip: req.ip });
    throw new ApiError(403, "Not allowed to set password");
  }

  const hashedPassword = await createHash(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      refreshToken: null,
    },
  });

  logger.info("Password set successfully", { userId, ip: req.ip });

  return sendApiResponse(res, 200, "Password set successfully");
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  renewAccessToken,
  forgetPasswordRequest,
  resetForgetPassword,
  changeCurrentPassword,
  setPassword,
};

/*
updateProfileController → general fields
updateUsernameController → unique username
updateEmailController → with verification flow
*/
