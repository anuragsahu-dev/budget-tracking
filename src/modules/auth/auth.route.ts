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

/**
 * @swagger
 * /auth/start:
 *   post:
 *     summary: Start authentication (send OTP)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Invalid request body
 *       429:
 *         description: Too many requests
 */
router.post(
  "/start",
  startLimiter,
  validate({ body: emailSchemaOnly }),
  AuthController.start
);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify OTP and login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid OTP or request body
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many requests
 */
router.post(
  "/verify",
  verifyLimiter,
  validate({ body: verifySchema }),
  AuthController.verify
);

/**
 * @swagger
 * /auth/setname:
 *   patch:
 *     summary: Set user's full name
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Name updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.patch(
  "/setname",
  verifyJWT,
  validate({ body: fullNameSchemaOnly }),
  AuthController.setName
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user details
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data fetched successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get("/me", verifyJWT, AuthController.me);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google login
 *       429:
 *         description: Too many requests
 */
router.get(
  "/google",
  oauthLimiter,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User verified successfully
 *       401:
 *         description: Authentication failed
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.googleCallback
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current session
 *     tags: [Auth]
 *     description: No authentication required - allows logout even with expired tokens
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", AuthController.logout);

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices
 *       401:
 *         description: Authentication required
 */
router.post("/logout-all", verifyJWT, AuthController.logoutAll);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Use refresh token to get new access token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 *       403:
 *         description: Account not active
 *       429:
 *         description: Too many requests
 */
router.post("/refresh-token", refreshLimiter, AuthController.refreshToken);

export default router;
