import {
  UserRole,
  UserStatus,
  PaymentStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  Payment,
  Subscription,
} from "../../generated/prisma/client";

// Summary for list view (minimal data)
export interface UserSummary {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string;
  status: UserStatus;
  createdAt: Date;
}

// Full details for single user view
export interface SafeUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string;
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

// ========== PLATFORM STATS TYPES ==========

export interface PlatformStatsOverview {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalTransactions: number;
  totalBudgets: number;
  totalSystemCategories: number;
}

export interface PlatformStatsPeriod {
  from: Date | null;
  to: Date | null;
  newUsers: number;
  newTransactions: number;
  newBudgets: number;
}

export interface PlatformStats {
  overview: PlatformStatsOverview;
  period: PlatformStatsPeriod;
}
