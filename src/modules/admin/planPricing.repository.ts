import prisma from "../../config/prisma";
import {
  PlanPricing,
  SubscriptionPlan,
  Prisma,
} from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  notFoundError,
  duplicateError,
  unknownError,
} from "../../utils/repository.utils";

export class PlanPricingRepository {
  /**
   * Find pricing for a specific plan and currency
   */
  static async findByPlanAndCurrency(
    plan: SubscriptionPlan,
    currency: string
  ): Promise<PlanPricing | null> {
    return prisma.planPricing.findUnique({
      where: { plan_currency: { plan, currency } },
    });
  }

  /**
   * Find all active plan pricing
   */
  static async findAllActive(): Promise<PlanPricing[]> {
    return prisma.planPricing.findMany({
      where: { isActive: true },
      orderBy: [{ plan: "asc" }, { currency: "asc" }],
    });
  }

  /**
   * Find all plan pricing (including inactive) - admin only
   */
  static async findAll(): Promise<PlanPricing[]> {
    return prisma.planPricing.findMany({
      orderBy: [{ plan: "asc" }, { currency: "asc" }],
    });
  }

  /**
   * Find plan pricing by ID
   */
  static async findById(id: string): Promise<PlanPricing | null> {
    return prisma.planPricing.findUnique({ where: { id } });
  }

  /**
   * Create new plan pricing
   */
  static async create(
    data: Prisma.PlanPricingCreateInput
  ): Promise<RepositoryResult<PlanPricing>> {
    try {
      const pricing = await prisma.planPricing.create({ data });
      return { success: true, data: pricing };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return duplicateError(
          "Pricing for this plan and currency already exists"
        );
      }
      return unknownError("Failed to create plan pricing", error);
    }
  }

  /**
   * Update plan pricing
   */
  static async update(
    id: string,
    data: Prisma.PlanPricingUpdateInput
  ): Promise<RepositoryResult<PlanPricing>> {
    try {
      const pricing = await prisma.planPricing.update({
        where: { id },
        data,
      });
      return { success: true, data: pricing };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return notFoundError("Plan pricing not found");
        }
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return duplicateError(
            "Pricing for this plan and currency already exists"
          );
        }
      }
      return unknownError("Failed to update plan pricing", error);
    }
  }

  /**
   * Delete plan pricing
   */
  static async delete(id: string): Promise<RepositoryResult<PlanPricing>> {
    try {
      const pricing = await prisma.planPricing.delete({ where: { id } });
      return { success: true, data: pricing };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Plan pricing not found");
      }
      return unknownError("Failed to delete plan pricing", error);
    }
  }
}
