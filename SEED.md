# 🌱 Database Seeding Guide

This guide explains how to seed the database with test data for development and testing.

## Overview

The seed script creates comprehensive test data including:

- System categories (10 default categories)
- Subscription pricing plans (INR & USD)
- Admin and test users
- Subscriptions and payment records
- Transactions (30-50 per active user)
- Budgets with allocations
- Custom categories

---

## Prerequisites

1. **Database running** - PostgreSQL must be accessible
2. **Migrations applied** - Run migrations before seeding:
   ```bash
   npx prisma migrate dev
   ```
3. **Prisma client generated** - Should be auto-generated, but if not:
   ```bash
   npx prisma generate
   ```

---

## Running the Seed

### Option 1: Using Prisma (Recommended)

Make sure `package.json` has the seed configuration:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Then run:

```bash
npx prisma db seed
```

### Option 2: Direct execution

```bash
npx ts-node prisma/seed.ts
```

### Option 3: Inside Docker

```bash
docker compose -f compose.dev.yaml exec server npx prisma db seed
```

Or:

```bash
docker compose -f compose.dev.yaml exec server npx ts-node prisma/seed.ts
```

---

## Test Credentials

### Admin User

| Email                 | Password   | Role  |
| --------------------- | ---------- | ----- |
| `admin@budgetapp.com` | `Test@123` | ADMIN |

### Regular Users

| Email                   | Password   | Status    | Subscription |
| ----------------------- | ---------- | --------- | ------------ |
| `john@example.com`      | `Test@123` | ACTIVE    | PRO Yearly   |
| `jane@example.com`      | `Test@123` | ACTIVE    | PRO Monthly  |
| `bob@example.com`       | `Test@123` | ACTIVE    | Free         |
| `alice@example.com`     | `Test@123` | ACTIVE    | Free         |
| `charlie@example.com`   | `Test@123` | INACTIVE  | -            |
| `suspended@example.com` | `Test@123` | SUSPENDED | -            |

---

## Data Created

### 📁 System Categories (10)

| Category          | Slug              | Color   | Type    |
| ----------------- | ----------------- | ------- | ------- |
| Food & Drinks     | `food-drinks`     | #FF6B6B | Expense |
| Transportation    | `transportation`  | #4ECDC4 | Expense |
| Entertainment     | `entertainment`   | #45B7D1 | Expense |
| Shopping          | `shopping`        | #96CEB4 | Expense |
| Bills & Utilities | `bills-utilities` | #FFEAA7 | Expense |
| Health            | `health`          | #DDA0DD | Expense |
| Salary            | `salary`          | #98D8C8 | Income  |
| Investment        | `investment`      | #F7DC6F | Income  |
| Gifts             | `gifts`           | #BB8FCE | Income  |
| Other             | `other`           | #B0B0B0 | Expense |

### 💰 Plan Pricing (4)

| Plan        | Currency | Amount | Duration |
| ----------- | -------- | ------ | -------- |
| PRO Monthly | INR      | ₹499   | 30 days  |
| PRO Yearly  | INR      | ₹4,999 | 365 days |
| PRO Monthly | USD      | $9.99  | 30 days  |
| PRO Yearly  | USD      | $99.99 | 365 days |

### 📊 Transactions

- **Per User**: 30-50 random transactions
- **Date Range**: Last 3 months
- **Split**: ~70% expenses, ~30% income
- **Amount Range**:
  - Expenses: ₹50 - ₹5,000
  - Income: ₹10,000 - ₹1,00,000

### 📈 Budgets

- **Per User**: 1 budget for current month
- **Allocations**: 3-5 category allocations per budget
- **Amount Range**: ₹2,000 - ₹15,000 per allocation

### 🏷️ Custom Categories (8 total)

Created for `john@example.com` and `jane@example.com`:

- Pet Expenses
- Education
- Subscriptions
- Travel

---

## Resetting the Database

To start fresh (delete all data and re-seed):

```bash
# Reset database (drops all tables)
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run the seed script
```

---

## Troubleshooting

### Error: "Column does not exist"

Run migrations first:

```bash
npx prisma migrate dev
```

### Error: "Unique constraint failed"

The seed script uses `upsert` for most data, so re-running is safe. If you still get errors:

```bash
npx prisma migrate reset
```

### Error: "Cannot find module"

Regenerate Prisma client:

```bash
npx prisma generate
```

### Docker: Permission denied

Make sure you're running as the correct user or use:

```bash
docker compose -f compose.dev.yaml exec -u node server npx prisma db seed
```

---

## Important Notes

1. **Idempotent**: The seed script can be run multiple times safely. Existing data won't be duplicated (uses `upsert`).

2. **Transactions**: Transaction data is only seeded if a user has 0 transactions. To regenerate transactions, delete them first.

3. **Passwords**: All test accounts use `Test@123` (hashed with argon2).

4. **Production**: Never run seed on production! The script is for development only.

---

## Quick Reference

```bash
# Seed the database
npx prisma db seed

# Reset and re-seed
npx prisma migrate reset

# Check database contents
npx prisma studio
```
