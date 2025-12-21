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

router.use(verifyJWT);

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard overview
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: Combined analytics for dashboard. FREE users get limited data.
 *     responses:
 *       200:
 *         description: Dashboard data fetched
 *       401:
 *         description: Authentication required
 */
router.get("/dashboard", AnalyticsController.getDashboardOverview);

/**
 * @swagger
 * /analytics/monthly:
 *   get:
 *     summary: Get monthly summary
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: FREE users get current month only. PRO can query any month.
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: PRO only
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: PRO only
 *     responses:
 *       200:
 *         description: Monthly summary fetched
 *       401:
 *         description: Authentication required
 */
router.get(
  "/monthly",
  validate({ query: monthlySummaryQuerySchema }),
  AnalyticsController.getMonthlySummary
);

/**
 * @swagger
 * /analytics/yearly:
 *   get:
 *     summary: Get yearly summary
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: PRO users only
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Yearly summary with monthly breakdown
 *       401:
 *         description: Authentication required
 *       403:
 *         description: PRO subscription required
 */
router.get(
  "/yearly",
  validate({ query: yearlySummaryQuerySchema }),
  AnalyticsController.getYearlySummary
);

/**
 * @swagger
 * /analytics/categories:
 *   get:
 *     summary: Get spending by category
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: FREE users get top 5 categories. PRO gets all.
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *     responses:
 *       200:
 *         description: Category summary fetched
 *       401:
 *         description: Authentication required
 */
router.get(
  "/categories",
  validate({ query: categorySummaryQuerySchema }),
  AnalyticsController.getCategorySummary
);

/**
 * @swagger
 * /analytics/trends:
 *   get:
 *     summary: Get spending trends
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: PRO users only
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           minimum: 3
 *           maximum: 12
 *           default: 6
 *     responses:
 *       200:
 *         description: Trends data fetched
 *       401:
 *         description: Authentication required
 *       403:
 *         description: PRO subscription required
 */
router.get(
  "/trends",
  validate({ query: trendsQuerySchema }),
  AnalyticsController.getTrends
);

/**
 * @swagger
 * /analytics/budget-comparison:
 *   get:
 *     summary: Get budget vs actual comparison
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: PRO users only
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Budget comparison fetched
 *       401:
 *         description: Authentication required
 *       403:
 *         description: PRO subscription required
 */
router.get(
  "/budget-comparison",
  validate({ query: monthlySummaryQuerySchema }),
  AnalyticsController.getBudgetComparison
);

export default router;
