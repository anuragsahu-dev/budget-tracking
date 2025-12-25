import express from "express";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import passport from "passport";
import swaggerUi from "swagger-ui-express";

import { globalErrorHandler, ApiError } from "./middlewares/error.middleware";
import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/user/user.route";
import categoryRouter from "./modules/category/category.route";
import transactionRouter from "./modules/transaction/transaction.route";
import budgetRouter from "./modules/budget/budget.route";
import adminRouter from "./modules/admin/admin.route";
import analyticsRouter from "./modules/analytics/analytics.route";
import paymentRouter from "./modules/payment/payment.route";
import subscriptionRouter from "./modules/subscription/subscription.route";
import healthRouter from "./modules/health/health.route";

import "./config/passport";
import { swaggerSpec } from "./config/swagger";

import { globalLimiter } from "./middlewares/rateLimit.middleware";

const app = express();

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "FinFlow API Docs",
  })
);

// Security Middleware
app.use(helmet());
app.use(hpp());

// Health Check Routes (before rate limiter - always accessible)
app.use("/health", healthRouter);

// Rate Limiter
app.use("/api", globalLimiter);

// Webhook Raw Body Parsing (must be BEFORE express.json())
app.use(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, _res, next) => {
    if (Buffer.isBuffer(req.body)) {
      req.rawBody = req.body.toString("utf8");
      try {
        req.body = JSON.parse(req.rawBody);
      } catch {
        // If parsing fails, keep body as-is
      }
    }
    next();
  }
);

// Body Parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

// Passport Initialization
app.use(passport.initialize());

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/budgets", budgetRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

// 404 Handler
app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
