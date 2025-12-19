import type { IPaymentProvider, CreateOrderInput, CreateOrderResult, VerifyPaymentInput, VerifyPaymentResult, WebhookPayload, WebhookResult } from "../payment.interface";
export declare class RazorpayProvider implements IPaymentProvider {
    private razorpay;
    constructor();
    createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
    verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
    handleWebhook(payload: WebhookPayload): Promise<WebhookResult>;
}
