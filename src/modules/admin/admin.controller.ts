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
  ListPaymentsQuery,
  PaymentIdParam,
  CreatePlanPricingInput,
  UpdatePlanPricingInput,
  PlanPricingIdParam,
  ListSubscriptionsQuery,
  SubscriptionIdParam,
  UpdateSubscriptionInput,
} from "./admin.validation";

export const AdminController = {
  // ========== SYSTEM CATEGORY ENDPOINTS ==========

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

  // ========== PAYMENT MANAGEMENT ENDPOINTS ==========

  getAllPayments: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<ListPaymentsQuery>(req);

    const result = await AdminService.getAllPayments(query);

    return sendApiResponse(
      res,
      200,
      "Payments fetched successfully",
      result.payments,
      result.meta
    );
  }),

  getPaymentById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = getValidatedParams<PaymentIdParam>(req);

    const payment = await AdminService.getPaymentById(id);

    return sendApiResponse(res, 200, "Payment fetched successfully", payment);
  }),

  getPaymentStats: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<StatsQuery>(req);

    const stats = await AdminService.getPaymentStats(query);

    return sendApiResponse(
      res,
      200,
      "Payment statistics fetched successfully",
      stats
    );
  }),

  // ========== PLAN PRICING ENDPOINTS ==========

  getAllPlanPricing: asyncHandler(async (_req: Request, res: Response) => {
    const pricing = await AdminService.getAllPlanPricing();

    return sendApiResponse(
      res,
      200,
      "Plan pricing fetched successfully",
      pricing
    );
  }),

  createPlanPricing: asyncHandler(async (req: Request, res: Response) => {
    const data = getValidatedBody<CreatePlanPricingInput>(req);

    const pricing = await AdminService.createPlanPricing(data);

    return sendApiResponse(
      res,
      201,
      "Plan pricing created successfully",
      pricing
    );
  }),

  updatePlanPricing: asyncHandler(async (req: Request, res: Response) => {
    const { id } = getValidatedParams<PlanPricingIdParam>(req);
    const data = getValidatedBody<UpdatePlanPricingInput>(req);

    const pricing = await AdminService.updatePlanPricing(id, data);

    return sendApiResponse(
      res,
      200,
      "Plan pricing updated successfully",
      pricing
    );
  }),

  deletePlanPricing: asyncHandler(async (req: Request, res: Response) => {
    const { id } = getValidatedParams<PlanPricingIdParam>(req);

    const result = await AdminService.deletePlanPricing(id);

    return sendApiResponse(res, 200, result.message, null);
  }),

  // ========== SUBSCRIPTION MANAGEMENT ENDPOINTS ==========

  getAllSubscriptions: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<ListSubscriptionsQuery>(req);

    const result = await AdminService.getAllSubscriptions(query);

    return sendApiResponse(
      res,
      200,
      "Subscriptions fetched successfully",
      result.subscriptions,
      result.meta
    );
  }),

  getSubscriptionById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = getValidatedParams<SubscriptionIdParam>(req);

    const subscription = await AdminService.getSubscriptionById(id);

    return sendApiResponse(
      res,
      200,
      "Subscription fetched successfully",
      subscription
    );
  }),

  updateSubscription: asyncHandler(async (req: Request, res: Response) => {
    const { id } = getValidatedParams<SubscriptionIdParam>(req);
    const data = getValidatedBody<UpdateSubscriptionInput>(req);

    const subscription = await AdminService.updateSubscription(id, data);

    return sendApiResponse(
      res,
      200,
      "Subscription updated successfully",
      subscription
    );
  }),

  getSubscriptionStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await AdminService.getSubscriptionStats();

    return sendApiResponse(
      res,
      200,
      "Subscription statistics fetched successfully",
      stats
    );
  }),

  // ========== FORCE LOGOUT ENDPOINT ==========

  forceLogoutUser: asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.userId as string;
    const { id } = getValidatedParams<UserIdParam>(req);

    const result = await AdminService.forceLogoutUser(id, adminId);

    return sendApiResponse(res, 200, result.message, {
      revokedCount: result.revokedCount,
    });
  }),
};
