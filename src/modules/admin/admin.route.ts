import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import { AdminController } from "./admin.controller";
import {
  createSystemCategorySchema,
  updateSystemCategorySchema,
  systemCategoryIdParamSchema,
  userIdParamSchema,
  updateUserStatusSchema,
  listUsersQuerySchema,
  statsQuerySchema,
} from "./admin.validation";

const router = Router();

router.use(verifyJWT, requireAdmin);


router.get("/categories", AdminController.getAllSystemCategories);


router.post(
  "/categories",
  validate({ body: createSystemCategorySchema }),
  AdminController.createSystemCategory
);


router.patch(
  "/categories/:id",
  validate({
    params: systemCategoryIdParamSchema,
    body: updateSystemCategorySchema,
  }),
  AdminController.updateSystemCategory
);


router.delete(
  "/categories/:id",
  validate({ params: systemCategoryIdParamSchema }),
  AdminController.deleteSystemCategory
);

router.get(
  "/users",
  validate({ query: listUsersQuerySchema }),
  AdminController.getAllUsers
);


router.get(
  "/users/:id",
  validate({ params: userIdParamSchema }),
  AdminController.getUserById
);


router.patch(
  "/users/:id/status",
  validate({ params: userIdParamSchema, body: updateUserStatusSchema }),
  AdminController.updateUserStatus
);


router.get(
  "/stats",
  validate({ query: statsQuerySchema }),
  AdminController.getStats
);

export default router;
