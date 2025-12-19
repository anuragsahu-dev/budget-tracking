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

router.get("/profile", verifyJWT, UserController.getProfile);

router.patch(
  "/profile",
  verifyJWT,
  validate({ body: updateProfileSchema }),
  UserController.updateProfile
);

// Avatar routes
// Get pre-signed URL for avatar upload (requires auth)
router.get(
  "/avatar/upload-url",
  verifyJWT,
  avatarUploadLimiter,
  validate({ query: getAvatarUploadUrlSchema }),
  UserController.getAvatarUploadUrl
);

// Confirm avatar upload after client uploads to S3
router.patch(
  "/avatar",
  verifyJWT,
  validate({ body: confirmAvatarUploadSchema }),
  UserController.confirmAvatarUpload
);

// Delete avatar
router.delete("/avatar", verifyJWT, UserController.deleteAvatar);

export default router;
