import { Router } from "express";
import {
  changeCurrentPassword,
  forgetPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  renewAccessToken,
  resendEmailVerification,
  resetForgetPassword,
  setPassword,
  updateUsername,
  verifyEmail,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { redisRateLimiter } from "../database/redis";
import { validateData } from "../middlewares/validate.middleware";
import {
  changeCurrentPasswordSchema,
  emailSchema,
  loginUserSchema,
  registerUserSchema,
  resetForgetPasswordSchema,
  setPasswordSchema,
  updateUsernameSchema,
} from "../validators/userValidation";

const router = Router();

const registerLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: "Too many attempts, please try again later.",
  keyPrefix: "register:",
});

const loginLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: "Too many attempts, please try again later",
  keyPrefix: "login:",
});

const forgotPasswordLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many password reset requests, please try again later.",
  keyPrefix: "forgot-password:",
});

const resetPasswordLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many reset attempts, please try again later.",
  keyPrefix: "reset-password:",
});

const resendEmailLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many resend attempts, please try again later.",
  keyPrefix: "resend-email:",
});

const refreshTokenLimiter = redisRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: "Too many token renewal attempts. Please slow down.",
  keyPrefix: "refresh-token:",
});

const changePasswordLimiter = redisRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many password change attempts. Please try again later.",
  keyPrefix: "change-password:",
});

const setPasswordLimiter = redisRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many attempts to set password. Please try again later.",
  keyPrefix: "set-password:",
});

// not secured route
router.post(
  "/register",
  registerLimiter,
  validateData(registerUserSchema),
  registerUser
);
router.post("/login", loginLimiter, validateData(loginUserSchema), loginUser);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/renew-access-token", refreshTokenLimiter, renewAccessToken);
router.post(
  "/forget-password",
  forgotPasswordLimiter,
  validateData(emailSchema), 
  forgetPasswordRequest
);
router.post(
  "/reset-password/:resetToken",
  resetPasswordLimiter,
  validateData(resetForgetPasswordSchema),
  resetForgetPassword
);
router.post(
  "/resend-email-verification",
  resendEmailLimiter,
  validateData(emailSchema),
  resendEmailVerification
);

// secured route
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post(
  "/change-password",
  verifyJWT,
  changePasswordLimiter,
  validateData(changeCurrentPasswordSchema),
  changeCurrentPassword
);
router.post(
  "/set-password",
  verifyJWT,
  setPasswordLimiter,
  validateData(setPasswordSchema),
  setPassword
);
router.put(
  "/username",
  verifyJWT,
  validateData(updateUsernameSchema),
  updateUsername
);

export default router;
