"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProvider = exports.PaymentStatus = exports.SubscriptionStatus = exports.SubscriptionPlan = exports.TransactionType = exports.UserStatus = exports.UserRole = void 0;
exports.UserRole = {
    USER: 'USER',
    ADMIN: 'ADMIN'
};
exports.UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    DELETED: 'DELETED'
};
exports.TransactionType = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE'
};
exports.SubscriptionPlan = {
    PRO_MONTHLY: 'PRO_MONTHLY',
    PRO_YEARLY: 'PRO_YEARLY'
};
exports.SubscriptionStatus = {
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    PENDING: 'PENDING',
    CANCELLED: 'CANCELLED'
};
exports.PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};
exports.PaymentProvider = {
    RAZORPAY: 'RAZORPAY',
    STRIPE: 'STRIPE'
};
