# Payment & Webhook System Documentation

This document explains the complete payment flow and webhook handling for the FinFlow application's subscription payment system using Razorpay.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Payment Flow](#payment-flow)
3. [Webhook System](#webhook-system)
4. [API Endpoints](#api-endpoints)
5. [Error Handling & Recovery](#error-handling--recovery)
6. [Testing Webhooks Locally](#testing-webhooks-locally)
7. [Production Considerations](#production-considerations)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PAYMENT FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Frontend │───▶│  /plans  │───▶│  Show    │───▶│  Select  │              │
│  │          │    │  (GET)   │    │  Pricing │    │  Plan    │              │
│  └──────────┘    └──────────┘    └──────────┘    └────┬─────┘              │
│                                                        │                    │
│                                                        ▼                    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     /create-order (POST)                              │  │
│  │  1. Get pricing from database (PlanPricing table)                     │  │
│  │  2. Create Razorpay order via API                                     │  │
│  │  3. Save Payment record (status: PENDING)                             │  │
│  │  4. Return order details to frontend                                  │  │
│  └───────────────────────────────────┬──────────────────────────────────┘  │
│                                       │                                    │
│                                       ▼                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     RAZORPAY CHECKOUT                                 │  │
│  │  User completes payment in Razorpay popup                            │  │
│  │  Razorpay returns: order_id, payment_id, signature                   │  │
│  └───────────────────────────────────┬──────────────────────────────────┘  │
│                                       │                                    │
│              ┌────────────────────────┴────────────────────────┐           │
│              │                                                  │           │
│              ▼                                                  ▼           │
│  ┌────────────────────┐                         ┌────────────────────────┐ │
│  │  /verify (POST)    │                         │  Razorpay Webhook      │ │
│  │  PRIMARY PATH      │                         │  BACKUP PATH           │ │
│  │                    │                         │                        │ │
│  │  1. Verify sig     │                         │  1. Verify sig         │ │
│  │  2. Mark COMPLETED │                         │  2. Check if pending   │ │
│  │  3. Activate sub   │                         │  3. Mark COMPLETED     │ │
│  │  4. Return success │                         │  4. Activate sub       │ │
│  └────────────────────┘                         └────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component                | Location                                                    | Purpose                     |
| ------------------------ | ----------------------------------------------------------- | --------------------------- |
| `PaymentService`         | `src/modules/payment/payment.service.ts`                    | Core payment business logic |
| `PaymentController`      | `src/modules/payment/payment.controller.ts`                 | HTTP request handlers       |
| `PaymentRepository`      | `src/modules/payment/payment.repository.ts`                 | Database operations         |
| `RazorpayProvider`       | `src/infrastructure/payment/providers/razorpay.provider.ts` | Razorpay API integration    |
| `PlanPricingRepository`  | `src/modules/admin/planPricing.repository.ts`               | Dynamic pricing from DB     |
| `SubscriptionRepository` | `src/modules/subscription/subscription.repository.ts`       | Subscription management     |

---

## Payment Flow

### Step 1: User Views Available Plans

```http
GET /api/v1/payments/plans?currency=INR
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "plan": "PRO_MONTHLY",
      "name": "PRO Monthly",
      "description": "Access all features for 30 days",
      "amount": 49900,
      "currency": "INR",
      "durationDays": 30,
      "displayPrice": "₹499.00"
    },
    {
      "plan": "PRO_YEARLY",
      "name": "PRO Yearly",
      "description": "Access all features for 1 year",
      "amount": 499900,
      "currency": "INR",
      "durationDays": 365,
      "displayPrice": "₹4999.00"
    }
  ]
}
```

### Step 2: Create Payment Order

```http
POST /api/v1/payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "PRO_MONTHLY",
  "currency": "INR"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "orderId": "order_NxXxXxXxXxXxXx",
    "amount": 49900,
    "currency": "INR",
    "plan": "PRO_MONTHLY",
    "providerData": {
      "keyId": "rzp_test_xxxx",
      "orderId": "order_NxXxXxXxXxXxXx",
      "amount": 49900,
      "currency": "INR"
    }
  }
}
```

### Step 3: Frontend Opens Razorpay Checkout

```javascript
const options = {
  key: response.providerData.keyId,
  amount: response.providerData.amount,
  currency: response.providerData.currency,
  order_id: response.providerData.orderId,
  handler: function (response) {
    // User completed payment - verify it
    verifyPayment(response);
  },
  prefill: {
    email: user.email,
    name: user.name,
  },
};

const razorpay = new Razorpay(options);
razorpay.open();
```

### Step 4: Verify Payment

```http
POST /api/v1/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpayOrderId": "order_NxXxXxXxXxXxXx",
  "razorpayPaymentId": "pay_NxXxXxXxXxXxXx",
  "razorpaySignature": "xxxxx"
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "success": true,
    "subscription": {
      "id": "01HXXXXXX",
      "plan": "PRO_MONTHLY",
      "status": "ACTIVE",
      "expiresAt": "2025-01-16T00:00:00.000Z"
    }
  }
}
```

**Pending Response (if subscription activation failed):**

```json
{
  "success": true,
  "data": {
    "success": true,
    "pending": true,
    "message": "Payment received successfully. Your subscription is being activated...",
    "paymentId": "pay_NxXxXxXxXxXxXx"
  }
}
```

---

## Webhook System

### What is a Webhook?

A webhook is an HTTP callback that Razorpay sends to your server when payment events occur. Unlike the `/verify` endpoint (which your frontend calls), webhooks are sent directly from Razorpay's servers.

### Why Do We Need Webhooks?

1. **Backup Mechanism**: If `/verify` fails (network error, server down), webhook still activates subscription
2. **Reliability**: Razorpay retries webhooks for up to 24 hours
3. **Additional Events**: Handle refunds, disputes, etc.
4. **Server-to-Server**: No dependency on frontend behavior

### Webhook Events We Handle

| Event              | When It Occurs     | Our Action                                  |
| ------------------ | ------------------ | ------------------------------------------- |
| `payment.captured` | Payment successful | Activate subscription (if not already done) |
| `payment.failed`   | Payment failed     | Mark payment as FAILED                      |
| `refund.created`   | Refund by admin    | **Log only** - admin handles manually       |

> **Note on Refunds:** Refund webhooks are triggered when YOU (admin) issue a refund from Razorpay Dashboard. We just log it. Subscription cancellation is done manually.

### Webhook Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Razorpay  │         │ Our Server  │         │  Database   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │  POST /webhook        │                       │
       │  (with signature)     │                       │
       │──────────────────────▶│                       │
       │                       │                       │
       │                       │  Verify signature     │
       │                       │──────────────────────▶│
       │                       │                       │
       │                       │  Check payment status │
       │                       │──────────────────────▶│
       │                       │                       │
       │                       │  If PENDING:          │
       │                       │  - Mark COMPLETED     │
       │                       │  - Activate sub       │
       │                       │──────────────────────▶│
       │                       │                       │
       │     200 OK            │                       │
       │◀──────────────────────│                       │
       │                       │                       │
       │  (Razorpay stops      │                       │
       │   retrying)           │                       │
```

### Idempotency

Webhooks may be received multiple times (retries, network issues). Our system handles this:

```typescript
// In handlePaymentCaptured:
if (payment.status === PaymentStatus.COMPLETED) {
  logger.info("Payment already completed, nothing to do");
  return { processed: true, reason: "Already completed" };
}
```

### Signature Verification

Every webhook request includes a signature header (`x-razorpay-signature`) that we verify:

```typescript
const expectedSignature = crypto
  .createHmac("sha256", webhookSecret)
  .update(rawBody)
  .digest("hex");

const isValid = crypto.timingSafeEqual(
  Buffer.from(expectedSignature),
  Buffer.from(signature)
);
```

---

## API Endpoints

| Method | Endpoint                 | Auth      | Description                 |
| ------ | ------------------------ | --------- | --------------------------- |
| GET    | `/payments/plans`        | No        | Get available pricing plans |
| POST   | `/payments/create-order` | Yes       | Create Razorpay order       |
| POST   | `/payments/verify`       | Yes       | Verify and complete payment |
| GET    | `/payments/history`      | Yes       | Get user's payment history  |
| POST   | `/payments/webhook`      | Signature | Handle Razorpay webhooks    |

### Admin Endpoints

| Method | Endpoint                | Auth  | Description         |
| ------ | ----------------------- | ----- | ------------------- |
| GET    | `/admin/pricing`        | Admin | List all pricing    |
| POST   | `/admin/pricing`        | Admin | Create pricing      |
| PATCH  | `/admin/pricing/:id`    | Admin | Update pricing      |
| DELETE | `/admin/pricing/:id`    | Admin | Delete pricing      |
| GET    | `/admin/payments`       | Admin | List all payments   |
| GET    | `/admin/payments/:id`   | Admin | Get payment details |
| GET    | `/admin/payments/stats` | Admin | Payment statistics  |

---

## Error Handling & Recovery

### Critical Errors (Need Admin Intervention)

These are logged with `severity: "CRITICAL"`:

1. **Payment completed but subscription activation failed**

   - User paid money but doesn't have access
   - Resolution: Manually activate subscription OR refund

2. **Failed to mark payment as completed**
   - Database error during critical operation
   - Resolution: Check payment status in Razorpay dashboard

### Logging Format for Critical Errors

```typescript
logger.error("CRITICAL: Subscription activation failed after payment", {
  severity: "CRITICAL",
  userId,
  paymentId,
  orderId: razorpayOrderId,
  razorpayPaymentId,
  plan,
  amount,
  error: subscriptionResult.message,
  action: "REQUIRES_MANUAL_INTERVENTION",
  resolution: "Manually activate subscription OR process refund",
});
```

### Recovery Strategies

| Failure Point                       | Recovery Mechanism                             |
| ----------------------------------- | ---------------------------------------------- |
| `/verify` endpoint fails            | Webhook will activate subscription             |
| Database temporarily down           | Webhook retries for 24 hours                   |
| Subscription activation fails       | Logged as CRITICAL, manual intervention        |
| Payment marked complete, sub failed | User gets "pending" message, webhook may retry |

---

## Testing Webhooks Locally

### Option 1: Using ngrok (Recommended)

1. **Install ngrok:**

   ```bash
   npm install -g ngrok
   # or download from https://ngrok.com
   ```

2. **Start your local server:**

   ```bash
   npm run dev
   ```

3. **Expose your server:**

   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL:**

   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```

5. **Configure in Razorpay Dashboard:**
   - Go to Settings → Webhooks
   - Add new webhook
   - URL: `https://abc123.ngrok.io/api/v1/payments/webhook`
   - Select events: `payment.captured`, `payment.failed`, `refund.created`
   - Copy the webhook secret to your `.env`

### Option 2: Razorpay Webhook Simulator

1. Go to Razorpay Dashboard → Webhooks → Test
2. Select an event type
3. Send test webhook
4. Check your server logs

### Option 3: Manual Testing with curl

```bash
curl -X POST http://localhost:3000/api/v1/payments/webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: <generate_signature>" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_test123",
          "order_id": "order_test123",
          "status": "captured"
        }
      }
    }
  }'
```

To generate a valid signature for testing:

```javascript
const crypto = require("crypto");
const body = JSON.stringify(payload);
const signature = crypto
  .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(body)
  .digest("hex");
```

---

## Production Considerations

### 1. Webhook URL Configuration

In Razorpay Dashboard, set webhook URL to:

```
https://your-domain.com/api/v1/payments/webhook
```

### 2. HTTPS Only

Razorpay requires HTTPS for production webhooks.

### 3. IP Whitelisting (Optional)

Consider whitelisting Razorpay's IP addresses for webhook endpoint.

### 4. Monitoring & Alerts

Set up alerts for:

- CRITICAL log entries
- Webhook failures (check Razorpay Dashboard)
- Payment success rate drops

### 5. Backup Plan for Webhook Delivery

If webhooks fail repeatedly:

- Check server logs for errors
- Verify webhook secret is correct
- Check Razorpay Dashboard for delivery status
- Manual intervention may be needed

### 6. Subscription Expiry

The background scheduler job automatically marks expired subscriptions daily.

---

## Summary

| Scenario             | Flow                                                            |
| -------------------- | --------------------------------------------------------------- |
| Happy path           | User pays → /verify → Subscription active                       |
| /verify fails        | User pays → /verify fails → Webhook activates sub               |
| Sub activation fails | User pays → Verified → Sub fails → CRITICAL log → Manual fix    |
| Payment fails        | User sees error → /verify returns error OR webhook marks FAILED |
| Double processing    | Idempotent - subscription not duplicated                        |

The system is designed for **reliability over speed**:

- Multiple pathways to activate subscription
- Idempotent operations
- Detailed logging for debugging
- Graceful failure messages to users
