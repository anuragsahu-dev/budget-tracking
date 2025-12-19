import prisma from "../src/config/prisma";
import { SubscriptionPlan } from "../src/generated/prisma/client";

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ============================================================
  // 1. SEED SYSTEM CATEGORIES (userId = null means system-wide)
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
    // Check if system category exists (userId is null)
    const existing = await prisma.category.findFirst({
      where: { userId: null, slug: cat.slug },
    });

    if (existing) {
      // Update existing
      await prisma.category.update({
        where: { id: existing.id },
        data: { name: cat.name, color: cat.color },
      });
    } else {
      // Create new
      await prisma.category.create({
        data: { ...cat, userId: null },
      });
    }
  }
  console.log(
    `   ✅ ${systemCategories.length} system categories created/updated\n`
  );

  // ============================================================
  // 2. SEED PLAN PRICING (Subscription plans with prices)
  // ============================================================
  const pricingData = [
    {
      plan: SubscriptionPlan.PRO_MONTHLY,
      currency: "INR",
      amount: 49900, // ₹499 in paise
      durationDays: 30,
      name: "PRO Monthly",
      description: "Full access to all premium features for 30 days",
      isActive: true,
    },
    {
      plan: SubscriptionPlan.PRO_YEARLY,
      currency: "INR",
      amount: 499900, // ₹4999 in paise (save ~17%)
      durationDays: 365,
      name: "PRO Yearly",
      description: "Full access to all premium features for 1 year - Save 17%!",
      isActive: true,
    },
    // USD pricing (for future international support)
    {
      plan: SubscriptionPlan.PRO_MONTHLY,
      currency: "USD",
      amount: 999, // $9.99 in cents
      durationDays: 30,
      name: "PRO Monthly",
      description: "Full access to all premium features for 30 days",
      isActive: true,
    },
    {
      plan: SubscriptionPlan.PRO_YEARLY,
      currency: "USD",
      amount: 9999, // $99.99 in cents
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
  // SUMMARY
  // ============================================================
  console.log("━".repeat(50));
  console.log("🎉 Database seeded successfully!");
  console.log("━".repeat(50));

  const categoryCount = await prisma.category.count({
    where: { userId: null },
  });
  const pricingCount = await prisma.planPricing.count();

  console.log(`\n📊 Summary:`);
  console.log(`   • System Categories: ${categoryCount}`);
  console.log(`   • Pricing Plans: ${pricingCount}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
