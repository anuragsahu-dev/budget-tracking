import express from "express";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import passport from "passport";

// import { redisRateLimiter } from "./config/redis";
import { globalErrorHandler, ApiError } from "./middlewares/error.middleware";

import "./config/passport";

import healthRouter from "./routes/healthCheck.route";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";

const app = express();

// security middleware
app.use(helmet());
app.use(hpp());

// --- Rate Limiter ---
// Global limiter for all /api routes
// app.use(
//   "/api",

// );

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
app.use("/healthCheck", healthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

// 404 handler
app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

// global error handler
app.use(globalErrorHandler);

export default app;
