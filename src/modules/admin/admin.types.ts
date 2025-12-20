import {
  UserRole,
  UserStatus,
  PaymentStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  Payment,
  Subscription,
} from "../../generated/prisma/client";

export interface SafeUser {
  id: string;
  email: string;
  fullName: string | null;
  isEmailVerified: boolean;
  googleId: string | null;
  currency: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFilters {
  status?: UserStatus;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// ========== PAYMENT TYPES ==========

export interface PaymentFilters {
  userId?: string;
  status?: PaymentStatus;
  plan?: SubscriptionPlan;
  from?: Date;
  to?: Date;
}

export type PaymentWithUser = Payment & {
  user: {
    id: string;
    email: string;
    fullName: string | null;
  };
};

// ========== SUBSCRIPTION TYPES ==========

export interface SubscriptionFilters {
  status?: SubscriptionStatus;
  plan?: SubscriptionPlan;
  expiringWithinDays?: number;
}

export type SubscriptionWithUser = Subscription & {
  user: {
    id: string;
    email: string;
    fullName: string | null;
  };
};
