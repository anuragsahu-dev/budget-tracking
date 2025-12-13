import express from "express";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import passport from "passport";

import { globalErrorHandler, ApiError } from "./middlewares/error.middleware";
import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/user/user.route";
import categoryRouter from "./modules/category/category.route";

import "./config/passport";

import { globalLimiter } from "./middlewares/rateLimit.middleware";

const app = express();

// security middleware
app.use(helmet());
app.use(hpp());

// --- Rate Limiter ---
// Global limiter for all /api routes
app.use("/api", globalLimiter);

// body parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// cor configuration
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

app.use(passport.initialize());

// api routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);

// 404 handler
app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

// global error handler
app.use(globalErrorHandler);

export default app;
