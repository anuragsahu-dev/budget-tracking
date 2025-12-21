import prisma from "../src/config/prisma";
import argon2 from "argon2";
import {
  SubscriptionPlan,
  SubscriptionStatus,
  PaymentStatus,
  PaymentProvider,
  TransactionType,
  UserRole,
  UserStatus,
} from "../src/generated/prisma/client";

// ============================================================
// CONFIGURATION
// ============================================================
const DEFAULT_PASSWORD = "Test@123"; // Default password for all test users

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTransactionDescription(
  type: TransactionType,
  categorySlug: string
): string {
  const descriptions: Record<string, string[]> = {
    "food-drinks": [
      "Lunch at restaurant",
      "Grocery shopping",
      "Coffee at Starbucks",
      "Dinner with friends",
      "Weekend brunch",
      "Snacks & beverages",
    ],
    transportation: [
      "Uber ride to office",
      "Metro card recharge",
      "Fuel for car",
      "Ola cab",
      "Bus ticket",
      "Parking fees",
    ],
    entertainment: [
      "Netflix subscription",
      "Movie tickets",
      "Concert tickets",
      "Gaming purchase",
      "Spotify premium",
      "YouTube Premium",
    ],
    shopping: [
      "Amazon purchase",
      "Clothing shopping",
      "Electronics",
      "Home decor",
      "Flipkart order",
      "Myntra shopping",
    ],
    "bills-utilities": [
      "Electricity bill",
      "Mobile recharge",
      "Internet bill",
      "Water bill",
      "Gas bill",
      "DTH recharge",
    ],
    health: [
      "Doctor consultation",
      "Medicine purchase",
      "Gym membership",
      "Health checkup",
      "Pharmacy",
      "Supplements",
    ],
    salary: [
      "Monthly salary",
      "Bonus received",
      "Freelance payment",
      "Project payment",
      "Overtime pay",
    ],
    investment: [
      "Mutual fund SIP",
      "Fixed deposit interest",
      "Dividend received",
      "Stock sale profit",
      "PPF contribution",
    ],
    gifts: [
      "Birthday gift received",
      "Wedding gift",
      "Festival bonus",
      "Cash gift from family",
    ],
    other: [
      "Miscellaneous expense",
      "Cash withdrawal",
      "ATM transaction",
      "Unknown",
    ],
  };

  const categoryDescriptions =
    descriptions[categorySlug] || descriptions["other"];
  return randomElement(categoryDescriptions);
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function main() {
  console.log("🌱 Starting comprehensive database seed...\n");
  console.log("━".repeat(60));

  // ============================================================
  // 1. SEED SYSTEM CATEGORIES
  // ============================================================
  const systemCategories = [
    { name: "Food & Drinks", slug: "food-drinks", color: "#FF6B6B" },
    { name: "Transportation", slug: "transportation", color: "#4ECDC4" },
    { name: "Entertainment", slug: "entertainment", color: "#45B7D1" },
    { name: "Shopping", slug: "shopping", color: "#96CEB4" },
    { name: "Bills & Utilities", slug: "bills-utilities", color: "#FFEAA7" },
    { name: "Health", slug: "health", color: "#DDA0DD" },
    { name: "Salary", slug: "salary", color: "#98D8C8" },
    { name: "Investment", slug: "investment", color: "#F7DC6F" },
    { name: "Gifts", slug: "gifts", color: "#BB8FCE" },
    { name: "Other", slug: "other", color: "#B0B0B0" },
  ];

  console.log("📁 Seeding system categories...");
  for (const cat of systemCategories) {
    const existing = await prisma.category.findFirst({
      where: { userId: null, slug: cat.slug },
    });

    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { name: cat.name, color: cat.color },
      });
    } else {
      await prisma.category.create({
        data: { ...cat, userId: null },
      });
    }
  }
  console.log(
    `   ✅ ${systemCategories.length} system categories created/updated\n`
  );

  // ============================================================
  // 2. SEED PLAN PRICING
  // ============================================================
  const pricingData = [
    {
      plan: SubscriptionPlan.PRO_MONTHLY,
      currency: "INR",
      amount: 49900,
      durationDays: 30,
      name: "PRO Monthly",
      description: "Full access to all premium features for 30 days",
      isActive: true,
    },
    {
      plan: SubscriptionPlan.PRO_YEARLY,
      currency: "INR",
      amount: 499900,
      durationDays: 365,
      name: "PRO Yearly",
      description: "Full access to all premium features for 1 year - Save 17%!",
      isActive: true,
    },
    {
      plan: SubscriptionPlan.PRO_MONTHLY,
      currency: "USD",
      amount: 999,
      durationDays: 30,
      name: "PRO Monthly",
      description: "Full access to all premium features for 30 days",
      isActive: true,
    },
    {
      plan: SubscriptionPlan.PRO_YEARLY,
      currency: "USD",
      amount: 9999,
      durationDays: 365,
      name: "PRO Yearly",
      description: "Full access to all premium features for 1 year - Save 17%!",
      isActive: true,
    },
  ];

  console.log("💰 Seeding plan pricing...");
  for (const pricing of pricingData) {
    await prisma.planPricing.upsert({
      where: {
        plan_currency: { plan: pricing.plan, currency: pricing.currency },
      },
      update: {
        amount: pricing.amount,
        durationDays: pricing.durationDays,
        name: pricing.name,
        description: pricing.description,
        isActive: pricing.isActive,
      },
      create: pricing,
    });
  }
  console.log(`   ✅ ${pricingData.length} pricing plans created/updated\n`);

  // ============================================================
  // 3. SEED ADMIN USER
  // ============================================================
  console.log("👑 Seeding admin user...");
  const hashedPassword = await argon2.hash(DEFAULT_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: "admin@budgetapp.com" },
    update: {},
    create: {
      email: "admin@budgetapp.com",
      fullName: "Admin User",
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      currency: "INR",
    },
  });
  console.log(`   ✅ Admin user created: ${admin.email}\n`);

  // ============================================================
  // 4. SEED TEST USERS WITH VARIOUS STATES
  // ============================================================
  console.log("👥 Seeding test users...");

  const testUsers = [
    {
      email: "john@example.com",
      fullName: "John Doe",
      status: UserStatus.ACTIVE,
      currency: "INR",
      hasSubscription: true,
      subscriptionPlan: SubscriptionPlan.PRO_YEARLY,
    },
    {
      email: "jane@example.com",
      fullName: "Jane Smith",
      status: UserStatus.ACTIVE,
      currency: "INR",
      hasSubscription: true,
      subscriptionPlan: SubscriptionPlan.PRO_MONTHLY,
    },
    {
      email: "bob@example.com",
      fullName: "Bob Wilson",
      status: UserStatus.ACTIVE,
      currency: "USD",
      hasSubscription: false,
    },
    {
      email: "alice@example.com",
      fullName: "Alice Johnson",
      status: UserStatus.ACTIVE,
      currency: "INR",
      hasSubscription: false,
    },
    {
      email: "charlie@example.com",
      fullName: "Charlie Brown",
      status: UserStatus.INACTIVE,
      currency: "INR",
      hasSubscription: false,
    },
    {
      email: "suspended@example.com",
      fullName: "Suspended User",
      status: UserStatus.SUSPENDED,
      currency: "INR",
      hasSubscription: false,
    },
  ];

  const createdUsers: Array<{
    id: string;
    email: string;
    hasSubscription: boolean;
    subscriptionPlan?: SubscriptionPlan;
    currency: string;
  }> = [];

  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        fullName: userData.fullName,
        password: hashedPassword,
        role: UserRole.USER,
        status: userData.status,
        isEmailVerified: true,
        currency: userData.currency,
      },
    });

    createdUsers.push({
      id: user.id,
      email: user.email,
      hasSubscription: userData.hasSubscription,
      subscriptionPlan: userData.subscriptionPlan,
      currency: userData.currency,
    });
  }
  console.log(`   ✅ ${testUsers.length} test users created\n`);

  // ============================================================
  // 5. SEED SUBSCRIPTIONS & PAYMENTS FOR PRO USERS
  // ============================================================
  console.log("💳 Seeding subscriptions and payments...");

  const proUsers = createdUsers.filter((u) => u.hasSubscription);
  for (const proUser of proUsers) {
    const plan = proUser.subscriptionPlan!;
    const isYearly = plan === SubscriptionPlan.PRO_YEARLY;
    const durationDays = isYearly ? 365 : 30;
    const amount =
      proUser.currency === "INR"
        ? isYearly
          ? 4999
          : 499
        : isYearly
        ? 99.99
        : 9.99;

    // Check if subscription exists
    const existingSub = await prisma.subscription.findUnique({
      where: { userId: proUser.id },
    });

    if (!existingSub) {
      // Create subscription
      const subscription = await prisma.subscription.create({
        data: {
          userId: proUser.id,
          plan,
          status: SubscriptionStatus.ACTIVE,
          expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
        },
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          userId: proUser.id,
          subscriptionId: subscription.id,
          plan,
          provider: PaymentProvider.RAZORPAY,
          amount: amount,
          currency: proUser.currency,
          status: PaymentStatus.COMPLETED,
          providerOrderId: `order_test_${proUser.id.slice(0, 8)}`,
          providerPaymentId: `pay_test_${proUser.id.slice(0, 8)}`,
          paidAt: new Date(),
        },
      });
    }
  }
  console.log(`   ✅ ${proUsers.length} subscriptions with payments created\n`);

  // ============================================================
  // 6. SEED TRANSACTIONS FOR ACTIVE USERS
  // ============================================================
  console.log("📊 Seeding transactions...");

  // Get all system categories
  const categories = await prisma.category.findMany({
    where: { userId: null },
  });

  const incomeCategories = categories.filter((c) =>
    ["salary", "investment", "gifts"].includes(c.slug)
  );
  const expenseCategories = categories.filter(
    (c) => !["salary", "investment", "gifts"].includes(c.slug)
  );

  const activeUsers = createdUsers.filter(
    (u) => !["suspended@example.com", "charlie@example.com"].includes(u.email)
  );

  let totalTransactions = 0;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  for (const user of activeUsers) {
    // Check existing transactions
    const existingCount = await prisma.transaction.count({
      where: { userId: user.id },
    });

    if (existingCount > 0) continue; // Skip if user already has transactions

    // Create 30-50 transactions per user
    const transactionCount = Math.floor(Math.random() * 20) + 30;

    for (let i = 0; i < transactionCount; i++) {
      // 70% expense, 30% income
      const isExpense = Math.random() < 0.7;
      const type = isExpense ? TransactionType.EXPENSE : TransactionType.INCOME;
      const category = randomElement(
        isExpense ? expenseCategories : incomeCategories
      );

      const amount = isExpense
        ? randomAmount(50, 5000) // Expenses: ₹50 - ₹5000
        : randomAmount(10000, 100000); // Income: ₹10000 - ₹100000

      await prisma.transaction.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          type,
          amount,
          description: generateTransactionDescription(type, category.slug),
          date: randomDate(threeMonthsAgo, new Date()),
        },
      });
      totalTransactions++;
    }
  }
  console.log(`   ✅ ${totalTransactions} transactions created\n`);

  // ============================================================
  // 7. SEED BUDGETS FOR ACTIVE USERS
  // ============================================================
  console.log("📈 Seeding budgets...");

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  let totalBudgets = 0;

  for (const user of activeUsers) {
    // Check existing budget
    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
        },
      },
    });

    if (existingBudget) continue;

    // Create budget for current month
    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
        totalLimit: randomAmount(30000, 100000),
        note: "Monthly budget",
      },
    });

    // Create 3-5 allocations per budget
    const selectedCategories = expenseCategories
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 3);

    for (const category of selectedCategories) {
      await prisma.budgetAllocation.create({
        data: {
          budgetId: budget.id,
          categoryId: category.id,
          amount: randomAmount(2000, 15000),
        },
      });
    }
    totalBudgets++;
  }
  console.log(`   ✅ ${totalBudgets} budgets with allocations created\n`);

  // ============================================================
  // 8. SEED CUSTOM CATEGORIES FOR SOME USERS
  // ============================================================
  console.log("🏷️  Seeding custom categories...");

  const customCategoryData = [
    { name: "Pet Expenses", slug: "pet-expenses", color: "#FFB347" },
    { name: "Education", slug: "education", color: "#87CEEB" },
    { name: "Subscriptions", slug: "subscriptions", color: "#DDA0DD" },
    { name: "Travel", slug: "travel", color: "#98FB98" },
  ];

  let totalCustomCategories = 0;
  for (const user of activeUsers.slice(0, 2)) {
    for (const cat of customCategoryData) {
      const existing = await prisma.category.findFirst({
        where: { userId: user.id, slug: cat.slug },
      });

      if (!existing) {
        await prisma.category.create({
          data: { ...cat, userId: user.id },
        });
        totalCustomCategories++;
      }
    }
  }
  console.log(`   ✅ ${totalCustomCategories} custom categories created\n`);

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("━".repeat(60));
  console.log("🎉 Database seeded successfully!");
  console.log("━".repeat(60));

  const counts = {
    systemCategories: await prisma.category.count({ where: { userId: null } }),
    customCategories: await prisma.category.count({
      where: { userId: { not: null } },
    }),
    users: await prisma.user.count(),
    admins: await prisma.user.count({ where: { role: UserRole.ADMIN } }),
    subscriptions: await prisma.subscription.count(),
    payments: await prisma.payment.count(),
    transactions: await prisma.transaction.count(),
    budgets: await prisma.budget.count(),
    allocations: await prisma.budgetAllocation.count(),
    pricingPlans: await prisma.planPricing.count(),
  };

  console.log("\n📊 Database Summary:");
  console.log("─".repeat(40));
  console.log(`   👥 Users:              ${counts.users}`);
  console.log(`   👑 Admins:             ${counts.admins}`);
  console.log(`   📁 System Categories:  ${counts.systemCategories}`);
  console.log(`   🏷️  Custom Categories:  ${counts.customCategories}`);
  console.log(`   💳 Subscriptions:      ${counts.subscriptions}`);
  console.log(`   💰 Payments:           ${counts.payments}`);
  console.log(`   📊 Transactions:       ${counts.transactions}`);
  console.log(`   📈 Budgets:            ${counts.budgets}`);
  console.log(`   📋 Allocations:        ${counts.allocations}`);
  console.log(`   💵 Pricing Plans:      ${counts.pricingPlans}`);
  console.log("─".repeat(40));

  console.log("\n🔐 Test Credentials:");
  console.log("─".repeat(40));
  console.log(`   Admin:    admin@budgetapp.com / ${DEFAULT_PASSWORD}`);
  console.log(`   User 1:   john@example.com / ${DEFAULT_PASSWORD}`);
  console.log(`   User 2:   jane@example.com / ${DEFAULT_PASSWORD}`);
  console.log(`   User 3:   bob@example.com / ${DEFAULT_PASSWORD}`);
  console.log(`   User 4:   alice@example.com / ${DEFAULT_PASSWORD}`);
  console.log("─".repeat(40));
  console.log("\n✨ Seed completed! Happy testing!\n");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
