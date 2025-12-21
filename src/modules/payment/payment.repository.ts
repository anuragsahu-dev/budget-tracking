import prisma from "../../config/prisma";
import { Prisma, Payment, PaymentStatus } from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  notFoundError,
  unknownError,
} from "../../utils/repository.utils";

export class PaymentRepository {
  /**
   * Create a new payment record
   */
  static async createPayment(
    data: Prisma.PaymentUncheckedCreateInput
  ): Promise<RepositoryResult<Payment>> {
    try {
      const payment = await prisma.payment.create({ data });
      return { success: true, data: payment };
    } catch (error) {
      return unknownError("Failed to create payment", error);
    }
  }

  /**
   * Find payment by provider order ID (Razorpay order_id)
   */
  static async findByProviderOrderId(
    providerOrderId: string
  ): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { providerOrderId },
    });
  }

  /**
   * Find payment by provider payment ID
   */
  static async findByProviderPaymentId(
    providerPaymentId: string
  ): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { providerPaymentId },
    });
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    data?: {
      paidAt?: Date;
      failureReason?: string;
      subscriptionId?: string;
    }
  ): Promise<RepositoryResult<Payment>> {
    try {
      const payment = await prisma.payment.update({
        where: { id },
        data: {
          status,
          ...data,
        },
      });
      return { success: true, data: payment };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Payment not found");
      }
      return unknownError("Failed to update payment", error);
    }
  }

  /**
   * Get payments by user ID
   */
  static async findByUserId(userId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Update payment by provider order ID
   * Since providerOrderId is @unique, we can use update directly
   */
  static async updateByProviderOrderId(
    providerOrderId: string,
    data: {
      status?: PaymentStatus;
      providerPaymentId?: string;
      paidAt?: Date;
      failureReason?: string;
      subscriptionId?: string;
    }
  ): Promise<RepositoryResult<Payment>> {
    try {
      const payment = await prisma.payment.update({
        where: { providerOrderId },
        data,
      });

      return { success: true, data: payment };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Payment not found");
      }
      return unknownError("Failed to update payment", error);
    }
  }
}
