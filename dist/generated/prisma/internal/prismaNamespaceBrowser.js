"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.PlanPricingScalarFieldEnum = exports.PaymentScalarFieldEnum = exports.SubscriptionScalarFieldEnum = exports.SessionScalarFieldEnum = exports.OtpScalarFieldEnum = exports.BudgetAllocationScalarFieldEnum = exports.BudgetScalarFieldEnum = exports.TransactionScalarFieldEnum = exports.CategoryScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    Category: 'Category',
    Transaction: 'Transaction',
    Budget: 'Budget',
    BudgetAllocation: 'BudgetAllocation',
    Otp: 'Otp',
    Session: 'Session',
    Subscription: 'Subscription',
    Payment: 'Payment',
    PlanPricing: 'PlanPricing'
};
exports.TransactionIsolationLevel = {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    fullName: 'fullName',
    password: 'password',
    isEmailVerified: 'isEmailVerified',
    googleId: 'googleId',
    currency: 'currency',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CategoryScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    name: 'name',
    slug: 'slug',
    color: 'color',
    createdAt: 'createdAt'
};
exports.TransactionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    categoryId: 'categoryId',
    amount: 'amount',
    type: 'type',
    description: 'description',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BudgetScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    month: 'month',
    year: 'year',
    totalLimit: 'totalLimit',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BudgetAllocationScalarFieldEnum = {
    id: 'id',
    budgetId: 'budgetId',
    categoryId: 'categoryId',
    amount: 'amount'
};
exports.OtpScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    email: 'email',
    otpHash: 'otpHash',
    expiresAt: 'expiresAt',
    verified: 'verified',
    createdAt: 'createdAt'
};
exports.SessionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    refreshTokenHash: 'refreshTokenHash',
    isRevoked: 'isRevoked',
    expireAt: 'expireAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SubscriptionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    plan: 'plan',
    status: 'status',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PaymentScalarFieldEnum = {
    id: 'id',
    subscriptionId: 'subscriptionId',
    userId: 'userId',
    plan: 'plan',
    provider: 'provider',
    amount: 'amount',
    currency: 'currency',
    providerPaymentId: 'providerPaymentId',
    providerOrderId: 'providerOrderId',
    status: 'status',
    failureReason: 'failureReason',
    paidAt: 'paidAt',
    createdAt: 'createdAt'
};
exports.PlanPricingScalarFieldEnum = {
    id: 'id',
    plan: 'plan',
    currency: 'currency',
    amount: 'amount',
    durationDays: 'durationDays',
    isActive: 'isActive',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
