import { z } from "zod";
export declare const currencySchema: z.ZodEnum<{
    INR: "INR";
    USD: "USD";
}>;
export type CurrencyInput = z.infer<typeof currencySchema>;
export declare const createOrderSchema: z.ZodObject<{
    plan: z.ZodEnum<{
        PRO_MONTHLY: "PRO_MONTHLY";
        PRO_YEARLY: "PRO_YEARLY";
    }>;
    currency: z.ZodDefault<z.ZodEnum<{
        INR: "INR";
        USD: "USD";
    }>>;
}, z.core.$strip>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export declare const verifyPaymentSchema: z.ZodObject<{
    razorpayOrderId: z.ZodString;
    razorpayPaymentId: z.ZodString;
    razorpaySignature: z.ZodString;
}, z.core.$strip>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
