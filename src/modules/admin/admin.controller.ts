import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { sendApiResponse } from "../../utils/apiResponse";
import {
  getValidatedBody,  
  getValidatedParams,
  getValidatedQuery,
} from "../../types/express";
import type {
  CreateSystemCategoryInput,  
  UpdateSystemCategoryInput,
  SystemCategoryIdParam,
  UserIdParam,
  UpdateUserStatusInput,
  ListUsersQuery,
  StatsQuery,
} from "./admin.validation";

export const AdminController = {


  getAllSystemCategories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await AdminService.getAllSystemCategories();

    return sendApiResponse(
      res,
      200,
      "System categories fetched successfully",
      categories
    );
  }),

  createSystemCategory: asyncHandler(async (req: Request, res: Response) => {
    const data = getValidatedBody<CreateSystemCategoryInput>(req);

    const category = await AdminService.createSystemCategory(data);

    return sendApiResponse(
      res,
      201,
      "System category created successfully",
      category
    );
  }),

  updateSystemCategory: asyncHandler(async (req: Request, res: Response) => {
    const { id } = getValidatedParams<SystemCategoryIdParam>(req);
    const data = getValidatedBody<UpdateSystemCategoryInput>(req);

    const category = await AdminService.updateSystemCategory(id, data);

    return sendApiResponse(
      res,
      200,
      "System category updated successfully",
      category
    );
  }),

  deleteSystemCategory: asyncHandler(async (req: Request, res: Response) => {
    const { id } = getValidatedParams<SystemCategoryIdParam>(req);

    const result = await AdminService.deleteSystemCategory(id);

    return sendApiResponse(res, 200, result.message, null);
  }),

  // ========== USER MANAGEMENT ENDPOINTS ==========

  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<ListUsersQuery>(req);

    const result = await AdminService.getAllUsers(query);

    return sendApiResponse(
      res,
      200,
      "Users fetched successfully",
      result.users,
      result.meta
    );
  }),

  getUserById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = getValidatedParams<UserIdParam>(req);

    const user = await AdminService.getUserById(id);

    return sendApiResponse(res, 200, "User fetched successfully", user);
  }),

  updateUserStatus: asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.userId as string;
    const { id } = getValidatedParams<UserIdParam>(req);
    const data = getValidatedBody<UpdateUserStatusInput>(req);

    const user = await AdminService.updateUserStatus(id, adminId, data);

    return sendApiResponse(res, 200, "User status updated successfully", user);
  }),

  // ========== STATISTICS ENDPOINTS ==========

  getStats: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<StatsQuery>(req);

    const stats = await AdminService.getStats(query);

    return sendApiResponse(res, 200, "Statistics fetched successfully", stats);
  }),
};
