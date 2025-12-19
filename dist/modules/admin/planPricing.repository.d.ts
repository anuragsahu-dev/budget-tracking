import { PlanPricing, SubscriptionPlan, Prisma } from "../../generated/prisma/client";
import { RepositoryResult } from "../../utils/repository.utils";
export declare class PlanPricingRepository {
    static findByPlanAndCurrency(plan: SubscriptionPlan, currency: string): Promise<PlanPricing | null>;
    static findAllActive(): Promise<PlanPricing[]>;
    static findAll(): Promise<PlanPricing[]>;
    static findById(id: string): Promise<PlanPricing | null>;
    static create(data: Prisma.PlanPricingCreateInput): Promise<RepositoryResult<PlanPricing>>;
    static update(id: string, data: Prisma.PlanPricingUpdateInput): Promise<RepositoryResult<PlanPricing>>;
    static delete(id: string): Promise<RepositoryResult<PlanPricing>>;
}
