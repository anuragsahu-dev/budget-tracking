import passport from "passport";
import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {
  emailSchemaOnly,
  fullNameSchemaOnly,
  verifySchema,
} from "./auth.validation";
import { AuthController } from "./auth.controller";
import {
  startLimiter,
  verifyLimiter,
  refreshLimiter,
  oauthLimiter,
} from "../../middlewares/rateLimit.middleware";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/start",
  startLimiter,
  validate({ body: emailSchemaOnly }),
  AuthController.start
);

router.post(
  "/verify",
  verifyLimiter,
  validate({ body: verifySchema }),
  AuthController.verify
);

router.patch(
  "/setname",
  verifyJWT,
  validate({ body: fullNameSchemaOnly }),
  AuthController.setName
);

router.get("/me", verifyJWT, AuthController.me);

router.get(
  "/google",
  oauthLimiter,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.googleCallback
);

// Logout current session (no auth required - allows logout with expired tokens)
router.post("/logout", AuthController.logout);

// Logout from all devices (requires authentication)
router.post("/logout-all", verifyJWT, AuthController.logoutAll);

// Refresh access token using refresh token
router.post("/refresh-token", refreshLimiter, AuthController.refreshToken);

export default router;
