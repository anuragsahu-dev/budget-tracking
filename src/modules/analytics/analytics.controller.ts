import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";
import { sendApiResponse } from "../../utils/apiResponse";
import { getValidatedQuery } from "../../types/express";
import type {
  MonthlySummaryQuery,
  YearlySummaryQuery,
  CategorySummaryQuery,
  TrendsQuery,
} from "./analytics.validation";

export const AnalyticsController = {
  /**
   * Get monthly summary
   * FREE: Current month only
   * PRO: Any month/year
   */
  getMonthlySummary: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const query = getValidatedQuery<MonthlySummaryQuery>(req);

    const summary = await AnalyticsService.getMonthlySummary(userId, query);

    return sendApiResponse(
      res,
      200,
      "Monthly summary fetched successfully",
      summary
    );
  }),

  /**
   * Get yearly summary (PRO only)
   */
  getYearlySummary: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const query = getValidatedQuery<YearlySummaryQuery>(req);

    const summary = await AnalyticsService.getYearlySummary(userId, query);

    return sendApiResponse(
      res,
      200,
      "Yearly summary fetched successfully",
      summary
    );
  }),

  /**
   * Get category breakdown
   * FREE: Current month only, top 5 categories
   * PRO: Any month/year, all categories
   */
  getCategorySummary: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const query = getValidatedQuery<CategorySummaryQuery>(req);

    const summary = await AnalyticsService.getCategorySummary(userId, query);

    return sendApiResponse(
      res,
      200,
      "Category summary fetched successfully",
      summary
    );
  }),

  /**
   * Get spending trends (PRO only)
   */
  getTrends: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const query = getValidatedQuery<TrendsQuery>(req);

    const trends = await AnalyticsService.getTrends(userId, query);

    return sendApiResponse(res, 200, "Trends fetched successfully", trends);
  }),

  /**
   * Get budget vs actual comparison (PRO only)
   */
  getBudgetComparison: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const query = getValidatedQuery<MonthlySummaryQuery>(req);
 
    const comparison = await AnalyticsService.getBudgetComparison(
      userId,
      query.month,
      query.year
    );

    return sendApiResponse(
      res,
      200,
      "Budget comparison fetched successfully",
      comparison
    );
  }),

  /**
   * Get dashboard overview
   * Combines multiple analytics for dashboard display
   */
  getDashboardOverview: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const overview = await AnalyticsService.getDashboardOverview(userId);

    return sendApiResponse(
      res,
      200,
      "Dashboard overview fetched successfully",
      overview
    );
  }),
};
