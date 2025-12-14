import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { AnalyticsController } from "./analytics.controller";
import {
  monthlySummaryQuerySchema,
  yearlySummaryQuerySchema,
  categorySummaryQuerySchema,
  trendsQuerySchema,
} from "./analytics.validation";

const router = Router();

// All analytics routes require authentication
router.use(verifyJWT);

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard overview (combined analytics)
 * @access  Private (FREE + PRO with different data)
 */
router.get("/dashboard", AnalyticsController.getDashboardOverview);

/**
 * @route   GET /api/v1/analytics/monthly
 * @desc    Get monthly income/expense summary
 * @access  Private
 *          FREE: Current month only
 *          PRO: Any month/year
 * @query   month - 1-12 (optional, PRO only)
 * @query   year - 2000-2100 (optional, PRO only)
 */
router.get(
  "/monthly",
  validate({ query: monthlySummaryQuerySchema }),
  AnalyticsController.getMonthlySummary
);

/**
 * @route   GET /api/v1/analytics/yearly
 * @desc    Get yearly summary with monthly breakdown
 * @access  Private (PRO ONLY)
 * @query   year - 2000-2100 (optional, defaults to current year)
 */
router.get(
  "/yearly",
  validate({ query: yearlySummaryQuerySchema }),
  AnalyticsController.getYearlySummary
);

/**
 * @route   GET /api/v1/analytics/categories
 * @desc    Get spending/income by category
 * @access  Private
 *          FREE: Current month, top 5 categories
 *          PRO: Any month/year, all categories
 * @query   month - 1-12 (optional, PRO only)
 * @query   year - 2000-2100 (optional, PRO only)
 * @query   type - "INCOME" | "EXPENSE" (optional)
 */
router.get(
  "/categories",
  validate({ query: categorySummaryQuerySchema }),
  AnalyticsController.getCategorySummary
);

/**
 * @route   GET /api/v1/analytics/trends
 * @desc    Get spending trends over multiple months
 * @access  Private (PRO ONLY)
 * @query   months - 3-12 (default: 6)
 */
router.get(
  "/trends",
  validate({ query: trendsQuerySchema }),
  AnalyticsController.getTrends
);

/**
 * @route   GET /api/v1/analytics/budget-comparison
 * @desc    Get budget vs actual spending comparison
 * @access  Private (PRO ONLY)
 * @query   month - 1-12 (optional, defaults to current month)
 * @query   year - 2000-2100 (optional, defaults to current year)
 */
router.get(
  "/budget-comparison",
  validate({ query: monthlySummaryQuerySchema }),
  AnalyticsController.getBudgetComparison
);

export default router;
