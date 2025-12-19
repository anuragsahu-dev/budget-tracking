"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const category_route_1 = __importDefault(require("./modules/category/category.route"));
const transaction_route_1 = __importDefault(require("./modules/transaction/transaction.route"));
const budget_route_1 = __importDefault(require("./modules/budget/budget.route"));
const admin_route_1 = __importDefault(require("./modules/admin/admin.route"));
const analytics_route_1 = __importDefault(require("./modules/analytics/analytics.route"));
const payment_route_1 = __importDefault(require("./modules/payment/payment.route"));
const subscription_route_1 = __importDefault(require("./modules/subscription/subscription.route"));
const health_route_1 = __importDefault(require("./modules/health/health.route"));
require("./config/passport");
const rateLimit_middleware_1 = require("./middlewares/rateLimit.middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, hpp_1.default)());
app.use("/health", health_route_1.default);
app.use("/api", rateLimit_middleware_1.globalLimiter);
app.use("/api/v1/payments/webhook", express_1.default.raw({ type: "application/json" }), (req, _res, next) => {
    if (Buffer.isBuffer(req.body)) {
        req.rawBody = req.body.toString("utf8");
        try {
            req.body = JSON.parse(req.rawBody);
        }
        catch {
        }
    }
    next();
});
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
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
}));
app.use(passport_1.default.initialize());
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/categories", category_route_1.default);
app.use("/api/v1/transactions", transaction_route_1.default);
app.use("/api/v1/budgets", budget_route_1.default);
app.use("/api/v1/admin", admin_route_1.default);
app.use("/api/v1/analytics", analytics_route_1.default);
app.use("/api/v1/payments", payment_route_1.default);
app.use("/api/v1/subscriptions", subscription_route_1.default);
app.use((_req, _res, next) => {
    next(new error_middleware_1.ApiError(404, "Route not found"));
});
app.use(error_middleware_1.globalErrorHandler);
exports.default = app;
