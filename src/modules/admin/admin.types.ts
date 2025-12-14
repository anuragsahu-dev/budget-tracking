import { UserRole, UserStatus } from "../../generated/prisma/client";

export type SafeUser = {
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
};

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}
