import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { emailSchemaOnly, verifySchema } from "./auth.validation";
import { AuthController } from "./auth.controller";
import { startLimiter } from "../../middlewares/rateLimit.middleware";

const router = Router();

router.post(
  "/start",
  startLimiter,
  validate({ body: emailSchemaOnly }),
  AuthController.start
);

router.post("/verify", validate({ body: verifySchema }), AuthController.verify);

export default router;
