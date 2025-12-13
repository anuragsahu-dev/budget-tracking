import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { UserController } from "./user.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { updateProfileSchema } from "./user.validation";

const router = Router();

router.get("/profile", verifyJWT, UserController.getProfile);

router.patch(
  "/profile",
  verifyJWT,
  validate({ body: updateProfileSchema }),
  UserController.updateProfile
);

export default router;
