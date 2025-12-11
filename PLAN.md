# Budget Tracking SaaS - Project Plan

## 📋 Table of Contents

- [Authentication Flow](#authentication-flow)
- [Auth Endpoints](#auth-endpoints)
- [Project Structure](#project-structure)
- [Module Responsibilities](#module-responsibilities)
- [Best Practices](#best-practices)
- [Complete API Endpoints](#complete-api-endpoints)

---

## 🔐 Authentication Flow

```
POST /auth/start
        │
        ├── User exists → login flow → send OTP
        │
        └── User does not exist → create user → send OTP
                             │
                     POST /auth/verify
                             │
                     verify OTP success
                             │
               if new user → ask fullName → update user
                             │
                     login complete
```

---

## 📌 Auth Endpoints

### 1️⃣ `POST /auth/start`

Send OTP for both:

- New users
- Existing users

### 2️⃣ `POST /auth/verify`

Verify OTP and login.

### 3️⃣ `POST /auth/set-name`

_(Only required once for new users)_

**Request Body:**

```json
{
  "fullName": "Anurag Singh"
}
```

### 4️⃣ `GET /auth/me`

Get user profile.

### 5️⃣ Google Auth Endpoints _(Optional)_

- `GET /auth/google`
- `GET /auth/google/callback`

---

## 🗂️ Project Structure

```
src/
 ├── app.ts
 ├── server.ts
 ├── config/
 │     ├── env.ts
 │     ├── prisma.ts
 │     ├── redis.ts
 │     └── logger.ts
 │
 ├── validations/
 │      ├── common.schema.ts
 │      ├── pagination.schema.ts
 │      └── id.schema.ts
 │
 ├── modules/
 │     ├── auth/
 │     │     ├── auth.controller.ts
 │     │     ├── auth.service.ts
 │     │     ├── auth.routes.ts
 │     │     ├── auth.validation.ts
 │     │     └── auth.types.ts
 │     │
 │     ├── user/
 │     │     ├── user.controller.ts
 │     │     ├── user.service.ts
 │     │     └── user.routes.ts
 │     │
 │     ├── category/
 │     │     ├── category.controller.ts
 │     │     ├── category.service.ts
 │     │     ├── category.routes.ts
 │     │     └── category.validation.ts
 │     │
 │     ├── transaction/
 │     │     ├── transaction.controller.ts
 │     │     ├── transaction.service.ts
 │     │     ├── transaction.routes.ts
 │     │     └── transaction.validation.ts
 │     │
 │     ├── budget/
 │     │     ├── budget.controller.ts
 │     │     ├── budget.service.ts
 │     │     ├── budget.routes.ts
 │     │     └── budget.validation.ts
 │     │
 │     ├── analytics/
 │     │     ├── analytics.controller.ts
 │     │     ├── analytics.service.ts
 │     │     └── analytics.routes.ts
 │     │
 │     ├── subscription/
 │     │     ├── subscription.controller.ts
 │     │     ├── subscription.service.ts
 │     │     ├── subscription.routes.ts
 │     │     └── subscription.webhook.ts
 │     │
 │     ├── admin/
 │     │     ├── admin.controller.ts
 │     │     ├── admin.service.ts
 │     │     └── admin.routes.ts
 │     │
 │     └── health/          ← NEW
 │           ├── health.controller.ts
 │           ├── health.service.ts
 │           └── health.routes.ts
 │
 ├── middleware/
 │     ├── auth.middleware.ts
 │     ├── role.middleware.ts
 │     ├── error.middleware.ts
 │     └── validate.middleware.ts
 │
 ├── utils/
 │     ├── generateOtp.ts
 │     ├── token.ts
 │     ├── response.ts
 │     └── email.ts
 │
 ├── types/
 │     └── express.d.ts          (extend Request with user)
 │
 ├── workers/
 │     ├── email.worker.ts
 │     └── budgetAlert.worker.ts
 │
 ├── routes/
 │     └── index.ts              (combine all module routes)
 │
 ├── docs/
 │     └── swagger.ts
 │
 └── tests/
       ├── integration/
       └── unit/

package.json
tsconfig.json
.env
```

---

## 📦 Module Responsibilities

### 🔐 `auth/`

**Handles:**

- Email OTP login
- Email OTP verification
- Google OAuth
- Token generation

### 👤 `user/`

**Handles:**

- Get profile
- Update profile
- Change name

### 🏷️ `category/`

**Handles:**

- Create category
- List categories
- Update category
- Delete category

### 💰 `transaction/`

**Handles:**

- Add income/expense
- Update transaction
- Delete transaction
- List transactions
- Get by ID

### 📅 `budget/`

**Handles:**

- Create monthly budget
- Update budget
- List budgets
- CRUD BudgetAllocation

### 📊 `analytics/`

**Handles:**

- Monthly summary
- Yearly summary
- Category summary

### 💎 `subscription/`

**Handles:**

- Monthly/yearly PRO plan
- Stripe/Razorpay payment order
- Verification/endDate update
- Webhook processing

### 🛠️ `admin/`

**Handles:**

- List all users
- List subscriptions
- Manage roles (upgrade/downgrade PRO/FREE)

### 🔹 `middleware/`

- Authentication middleware
- Role middleware (ADMIN / PRO / FREE)
- Zod validation middleware
- Global error handler

### 🔹 `workers/`

**Used for background tasks:**

- Sending OTP emails
- Sending budget alerts
- Generating reports

**Uses:** BullMQ, BeeQueue, or RabbitMQ

### 🔹 `utils/`

Helper functions.

### 🔹 `docs/`

Swagger/OpenAPI documentation.

---

## 🚀 2025 Best Practices Summary

✔ Each resource gets its own module  
✔ Controllers are clean — only handle req/res  
✔ Services contain all business logic  
✔ Prisma queries ONLY inside services  
✔ Utils for reusable code  
✔ Workers for async tasks  
✔ Validations with Zod  
✔ Middleware for auth and roles  
✔ OpenAPI/Swagger for documentation

> **This is EXACTLY how modern Express backends are built.**

---

## 🎯 Complete API Endpoints

Below is a complete endpoint set for your Budget Tracking SaaS.

### 🔐 AUTH MODULE

**OTP + Google + Magic Login**

| Method | Endpoint                | Description                       |
| ------ | ----------------------- | --------------------------------- |
| POST   | `/auth/start`           | Send OTP (register/login unified) |
| POST   | `/auth/verify`          | Verify OTP                        |
| POST   | `/auth/set-name`        | Set fullName (new user only)      |
| GET    | `/auth/me`              | Get profile                       |
| GET    | `/auth/google`          | Redirect to Google                |
| GET    | `/auth/google/callback` | Login with Google                 |
| POST   | `/auth/logout`          | Logout                            |

---

### 👤 USER MODULE

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| GET    | `/users/me` | Get user profile    |
| PATCH  | `/users/me` | Update user profile |

---

### 🏷️ CATEGORY MODULE

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| POST   | `/categories`     | Create category |
| GET    | `/categories`     | List categories |
| PATCH  | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

---

### 💰 TRANSACTION MODULE

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/transactions`     | Create transaction |
| GET    | `/transactions`     | List transactions  |
| GET    | `/transactions/:id` | Get transaction    |
| PATCH  | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

**Filters on `GET /transactions`:**

```
?type=INCOME|EXPENSE
?categoryId=
?from=2025-01-01
?to=2025-02-01
?page=1&limit=20
```

---

### 📅 BUDGET MODULE

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| POST   | `/budgets`              | Create budget           |
| GET    | `/budgets?month=&year=` | List budgets (filtered) |
| GET    | `/budgets/:id`          | Get budget              |
| PATCH  | `/budgets/:id`          | Update budget           |
| DELETE | `/budgets/:id`          | Delete budget           |

**BudgetAllocation endpoints:**

| Method | Endpoint                             | Description       |
| ------ | ------------------------------------ | ----------------- |
| POST   | `/budgets/:budgetId/allocations`     | Create allocation |
| PATCH  | `/budgets/:budgetId/allocations/:id` | Update allocation |
| DELETE | `/budgets/:budgetId/allocations/:id` | Delete allocation |

---

### 📊 ANALYTICS MODULE

| Method | Endpoint                           | Description      |
| ------ | ---------------------------------- | ---------------- |
| GET    | `/analytics/monthly?month=&year=`  | Monthly summary  |
| GET    | `/analytics/yearly?year=`          | Yearly summary   |
| GET    | `/analytics/category?month=&year=` | Category summary |

---

### 💎 SUBSCRIPTION MODULE

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/subscription/create`  | Create Stripe/Razorpay order |
| POST   | `/subscription/verify`  | Verify payment               |
| POST   | `/subscription/webhook` | Webhook listener             |
| GET    | `/subscription/status`  | Get status (FREE / PRO)      |

---

### 🛠️ ADMIN MODULE

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/admin/users`          | List all users     |
| GET    | `/admin/subscriptions`  | List subscriptions |
| PATCH  | `/admin/users/:id/role` | Update user role   |

---

## 🚀 Implementation Examples

This section demonstrates how to implement complete endpoints using modern Express best practices with **asyncHandler**, **Zod validation**, **Controllers**, **Services**, **Routes**, and **Common validations**.

### 📝 Sample Endpoints

We'll implement two complete endpoints:

1. **⭐ Create Category** → `POST /categories`
2. **⭐ Create Transaction** → `POST /transactions`

**This will cover:**

- ✅ Validation with Zod
- ✅ Authentication usage
- ✅ Prisma database operations
- ✅ Error handling
- ✅ Async handler pattern
- ✅ Proper folder structure flow

---

## ⭐ Example 1: Create Category

### 📌 Step 1 — Validation

**File:** `modules/category/category.validation.ts`

```typescript
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 chars"),
  color: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
```

---

### 📌 Step 2 — Service

**File:** `modules/category/category.service.ts`

```typescript
import prisma from "../../config/prisma";
import { CreateCategoryInput } from "./category.validation";

export const CategoryService = {
  async create(userId: string, data: CreateCategoryInput) {
    const exists = await prisma.category.findFirst({
      where: { userId, name: data.name },
    });

    if (exists) throw new Error("Category already exists");

    return prisma.category.create({
      data: {
        userId,
        name: data.name,
        color: data.color || null,
      },
    });
  },
};
```

---

### 📌 Step 3 — Controller

**File:** `modules/category/category.controller.ts`

```typescript
import { Request, Response } from "express";
import { CategoryService } from "./category.service";

export const CategoryController = {
  async create(req: Request, res: Response) {
    const userId = req.user!.id;
    const category = await CategoryService.create(userId, req.body);

    res.status(201).json({
      message: "Category created",
      data: category,
    });
  },
};
```

---

### 📌 Step 4 — Route (with async handler)

**File:** `modules/category/category.routes.ts`

```typescript
import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validate } from "../../middleware/validate.middleware";
import { createCategorySchema } from "./category.validation";
import { auth } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post(
  "/",
  auth,
  validate(createCategorySchema),
  asyncHandler(CategoryController.create)
);

export default router;
```

---

## ⭐ Example 2: Create Transaction

> This endpoint is more advanced and includes category ownership validation.

### 📌 Step 1 — Validation

**File:** `modules/transaction/transaction.validation.ts`

```typescript
import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(), // ISO date string
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
```

---

### 📌 Step 2 — Service

**File:** `modules/transaction/transaction.service.ts`

```typescript
import prisma from "../../config/prisma";
import { CreateTransactionInput } from "./transaction.validation";

export const TransactionService = {
  async create(userId: string, data: CreateTransactionInput) {
    // Validate category ownership
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });

      if (!category) throw new Error("Invalid category");
    }

    return prisma.transaction.create({
      data: {
        userId,
        categoryId: data.categoryId || null,
        amount: data.amount,
        type: data.type,
        description: data.description || null,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
  },
};
```

---

### 📌 Step 3 — Controller

**File:** `modules/transaction/transaction.controller.ts`

```typescript
import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";

export const TransactionController = {
  async create(req: Request, res: Response) {
    const userId = req.user!.id;
    const transaction = await TransactionService.create(userId, req.body);

    res.status(201).json({
      message: "Transaction created",
      data: transaction,
    });
  },
};
```

---

### 📌 Step 4 — Route (with async handler)

**File:** `modules/transaction/transaction.routes.ts`

```typescript
import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validate } from "../../middleware/validate.middleware";
import { createTransactionSchema } from "./transaction.validation";
import { auth } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.post(
  "/",
  auth,
  validate(createTransactionSchema),
  asyncHandler(TransactionController.create)
);

export default router;
```

---

## 🎉 Request Flow Summary

**When a request comes to `/transactions`:**

```
1. auth middleware      → Adds req.user
2. validate middleware  → Ensures body shape
3. asyncHandler         → Catches errors
4. controller          → Extracts userId, calls service
5. service             → Business logic + Prisma operations
6. controller          → Returns JSON response
```

> **Result:** Clean. Scalable. Professional.

---

## 🔄 Common Validation Schemas

### Location

Place reusable schemas in:

- `src/validations/pagination.schema.ts`
- `src/validations/id.schema.ts`
- `src/validations/date.schema.ts`

### Example: ID Schema

```typescript
export const idSchema = z.object({
  id: z.string().min(1),
});
```

### Re-use in Multiple Endpoints

- `GET /transactions/:id`
- `PATCH /categories/:id`
- `DELETE /budgets/:id`

---

## 🛡️ AsyncHandler Pattern

### Usage

**asyncHandler** is used in **EVERY route handler**:

```typescript
asyncHandler(CategoryController.create);
```

### Benefits

✅ **No try/catch blocks in controllers**  
✅ Automatic error forwarding to error middleware  
✅ Clean, readable controller code  
✅ Centralized error handling

---

## 📊 Summary

✔ **Total Endpoints:** ~35

> You can easily reduce to 20–25 if you want.
