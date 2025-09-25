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
  verifyEmail,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// not secured route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/renew-access-token", renewAccessToken);
router.post("/forget-password", forgetPasswordRequest);
router.post("/reset-password/:resetToken", resetForgetPassword);

// secured route
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.post("/resend-email-verification", verifyJWT, resendEmailVerification);

export default router;
