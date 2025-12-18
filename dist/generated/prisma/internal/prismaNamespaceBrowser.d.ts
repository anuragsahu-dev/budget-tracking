import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Category: "Category";
    readonly Transaction: "Transaction";
    readonly Budget: "Budget";
    readonly BudgetAllocation: "BudgetAllocation";
    readonly Otp: "Otp";
    readonly Session: "Session";
    readonly Subscription: "Subscription";
    readonly Payment: "Payment";
    readonly PlanPricing: "PlanPricing";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly fullName: "fullName";
    readonly password: "password";
    readonly isEmailVerified: "isEmailVerified";
    readonly googleId: "googleId";
    readonly currency: "currency";
    readonly role: "role";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly name: "name";
    readonly slug: "slug";
    readonly color: "color";
    readonly createdAt: "createdAt";
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const TransactionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly categoryId: "categoryId";
    readonly amount: "amount";
    readonly type: "type";
    readonly description: "description";
    readonly date: "date";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum];
export declare const BudgetScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly month: "month";
    readonly year: "year";
    readonly totalLimit: "totalLimit";
    readonly note: "note";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BudgetScalarFieldEnum = (typeof BudgetScalarFieldEnum)[keyof typeof BudgetScalarFieldEnum];
export declare const BudgetAllocationScalarFieldEnum: {
    readonly id: "id";
    readonly budgetId: "budgetId";
    readonly categoryId: "categoryId";
    readonly amount: "amount";
};
export type BudgetAllocationScalarFieldEnum = (typeof BudgetAllocationScalarFieldEnum)[keyof typeof BudgetAllocationScalarFieldEnum];
export declare const OtpScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly email: "email";
    readonly otpHash: "otpHash";
    readonly expiresAt: "expiresAt";
    readonly verified: "verified";
    readonly createdAt: "createdAt";
};
export type OtpScalarFieldEnum = (typeof OtpScalarFieldEnum)[keyof typeof OtpScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly refreshTokenHash: "refreshTokenHash";
    readonly isRevoked: "isRevoked";
    readonly expireAt: "expireAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const SubscriptionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly plan: "plan";
    readonly status: "status";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly subscriptionId: "subscriptionId";
    readonly userId: "userId";
    readonly plan: "plan";
    readonly provider: "provider";
    readonly amount: "amount";
    readonly currency: "currency";
    readonly providerPaymentId: "providerPaymentId";
    readonly providerOrderId: "providerOrderId";
    readonly status: "status";
    readonly failureReason: "failureReason";
    readonly paidAt: "paidAt";
    readonly createdAt: "createdAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const PlanPricingScalarFieldEnum: {
    readonly id: "id";
    readonly plan: "plan";
    readonly currency: "currency";
    readonly amount: "amount";
    readonly durationDays: "durationDays";
    readonly isActive: "isActive";
    readonly name: "name";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PlanPricingScalarFieldEnum = (typeof PlanPricingScalarFieldEnum)[keyof typeof PlanPricingScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
