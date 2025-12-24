import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { UserController } from "./user.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { avatarUploadLimiter } from "../../middlewares/rateLimit.middleware";
import {
  updateProfileSchema,
  getAvatarUploadUrlSchema,
  confirmAvatarUploadSchema,
} from "./user.validation";

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get("/profile", verifyJWT, UserController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               currency:
 *                 type: string
 *                 enum: [INR, USD]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.patch(
  "/profile",
  verifyJWT,
  validate({ body: updateProfileSchema }),
  UserController.updateProfile
);

/**
 * @swagger
 * /users/avatar/upload-url:
 *   get:
 *     summary: Get pre-signed URL for avatar upload
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mimeType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [image/jpeg, image/jpg, image/png, image/webp]
 *         description: MIME type of the image
 *     responses:
 *       200:
 *         description: Upload URL generated
 *       400:
 *         description: Invalid file type
 *       401:
 *         description: Authentication required
 *       429:
 *         description: Too many requests
 */
router.get(
  "/avatar/upload-url",
  verifyJWT,
  avatarUploadLimiter,
  validate({ query: getAvatarUploadUrlSchema }),
  UserController.getAvatarUploadUrl
);

/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Confirm avatar upload
 *     tags: [Users]
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
 *               - avatarId
 *             properties:
 *               avatarId:
 *                 type: string
 *                 description: The avatar ID from upload URL response
 *     responses:
 *       200:
 *         description: Avatar confirmed
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.patch(
  "/avatar",
  verifyJWT,
  validate({ body: confirmAvatarUploadSchema }),
  UserController.confirmAvatarUpload
);

/**
 * @swagger
 * /users/avatar:
 *   delete:
 *     summary: Delete user avatar
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar reset to default
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.delete("/avatar", verifyJWT, UserController.deleteAvatar);

/**
 * @swagger
 * /users/deactivate:
 *   post:
 *     summary: Deactivate user account
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: User can deactivate their own account. Contact support to reactivate.
 *     responses:
 *       200:
 *         description: Account deactivated
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.post("/deactivate", verifyJWT, UserController.deactivateAccount);

export default router;
