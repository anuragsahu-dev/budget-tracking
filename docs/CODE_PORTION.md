# TypeScript Prisma Error Type Guard Explained

This function is a **TypeScript type guard** used to safely identify Prisma-style errors when the caught error is of type `unknown`.

```ts
export function isPrismaError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}
```

---

## Why `error` is Typed as `unknown`

In modern TypeScript, the value caught in a `catch` block is typed as `unknown` because an error can be anything:

- A JavaScript `Error`
- A Prisma client error
- A string or number
- `null` or `undefined`

Using `unknown` forces us to validate the shape of the error before accessing its properties, **preventing runtime crashes**.

---

## What This Function Does (High Level)

This function:

1. Performs **runtime checks** to verify the error's structure
2. Acts as a **type guard** to narrow the type at compile time
3. Allows **safe access** to `error.code` and `error.message` after validation

If the function returns `true`, TypeScript understands that:

```ts
error.code; // string
error.message; // string
```

---

## Understanding the Return Type

```ts
error is { code: string; message: string }
```

This is called a **type predicate**.

It tells TypeScript:

> _"If this function returns `true`, treat `error` as an object with `code` and `message` properties."_

Without this, `error` would remain `unknown`.

---

## Line-by-Line Explanation

### 1. Ensure the Error is an Object

```ts
typeof error === "object";
```

Prisma errors are objects. This check filters out primitive values like strings or numbers.

### 2. Exclude `null`

```ts
error !== null;
```

JavaScript treats `null` as an object:

```ts
typeof null === "object"; // true
```

This check prevents invalid access.

### 3. Check for a `code` Property

```ts
"code" in error;
```

Prisma errors (e.g., `P2002`, `P2025`) include a `code` property. This ensures the property exists.

### 4. Ensure `code` is a String

```ts
typeof (error as { code: unknown }).code === "string";
```

TypeScript still considers `error` as `unknown`, so we:

- Temporarily cast it
- Verify that `code` is actually a string

This makes the guard **safe and reliable**.

---

## Why This Approach is Recommended

### ❌ Unsafe (Can Crash)

```ts
if (error.code === "P2002") {
}
```

Fails if `error` is not an object.

### ❌ Using `any` (Bad Practice)

```ts
const e = error as any;
if (e.code === "P2002") {
}
```

Removes all type safety and IntelliSense.

### ✅ Correct and Safe Approach

```ts
if (isPrismaError(error)) {
  if (error.code === "P2002") {
    // Safe, typed, and predictable
  }
}
```

---

## Real-World Prisma Usage Example

```ts
try {
  await prisma.user.create({ data });
} catch (error) {
  if (isPrismaError(error)) {
    switch (error.code) {
      case "P2002":
        throw new ApiError(409, "Unique constraint violation");
      case "P2025":
        throw new ApiError(404, "Record not found");
    }
  }

  // Unknown error → rethrow
  throw error;
}
```

---

## Key Takeaways

| Concept         | Benefit                                                     |
| --------------- | ----------------------------------------------------------- |
| `unknown` type  | Enforces safer error handling                               |
| Type guards     | Combine runtime validation with compile-time type narrowing |
| Avoiding `any`  | Prevents runtime crashes and maintains IntelliSense         |
| Type predicates | Allow TypeScript to understand validated types              |

> ✅ This pattern is **well-suited for production-grade Prisma + TypeScript applications**.

---

# Type Predicate in Array Filter Explained

This pattern is used to filter out `null` values from an array while also telling TypeScript that the resulting array contains only non-null values.

```ts
const categoryIds = categoryData
  .map((c) => c.categoryId)
  .filter((id): id is string => id !== null);
```

---

## Step-by-Step Breakdown

Let's say `categoryData` from Prisma's `groupBy` looks like this:

```ts
const categoryData = [
  { categoryId: "cat_001", _sum: { amount: 5000 }, _count: 10 },
  { categoryId: "cat_002", _sum: { amount: 3000 }, _count: 5 },
  { categoryId: null, _sum: { amount: 1200 }, _count: 3 }, // Uncategorized transactions
  { categoryId: "cat_003", _sum: { amount: 800 }, _count: 2 },
];
```

---

### Step 1: `.map((c) => c.categoryId)`

Extracts just the `categoryId` values:

```ts
// Result after map:
["cat_001", "cat_002", null, "cat_003"];

// TypeScript type: (string | null)[]
```

---

### Step 2: `.filter((id): id is string => id !== null)`

This has two parts:

#### Part A: `id !== null`

The **runtime check** — filters out `null` values:

```ts
// Result after filter:
["cat_001", "cat_002", "cat_003"];
```

#### Part B: `id is string` (Type Predicate)

The **compile-time type narrowing** — tells TypeScript:

> "After this filter, all remaining elements are guaranteed to be `string`, not `string | null`"

---

## Why `id is string` is Needed

### Without Type Predicate:

```ts
const categoryIds = categoryData
  .map((c) => c.categoryId)
  .filter((id) => id !== null);

// TypeScript type: (string | null)[]  ← Still includes null! TypeScript doesn't trust us
```

### With Type Predicate:

```ts
const categoryIds = categoryData
  .map((c) => c.categoryId)
  .filter((id): id is string => id !== null);

// TypeScript type: string[]  ← Correctly narrowed!
```

---

## Visual Example

```
categoryData:
┌─────────────┬─────────┬────────┐
│ categoryId  │ _sum    │ _count │
├─────────────┼─────────┼────────┤
│ "cat_001"   │ 5000    │ 10     │
│ "cat_002"   │ 3000    │ 5      │
│ null        │ 1200    │ 3      │  ← Uncategorized
│ "cat_003"   │ 800     │ 2      │
└─────────────┴─────────┴────────┘

        ↓ .map((c) => c.categoryId)

["cat_001", "cat_002", null, "cat_003"]
   Type: (string | null)[]

        ↓ .filter((id): id is string => id !== null)

["cat_001", "cat_002", "cat_003"]
   Type: string[]  ← null removed, TypeScript knows it!
```

---

## The Syntax Explained

```ts
.filter((id): id is string => id !== null)
       │      │             │
       │      │             └── Runtime check (actual filtering)
       │      └── Type predicate (tells TypeScript the return type)
       └── Parameter
```

**`id is string`** is a **type predicate**. It's a special return type that says:

> "If this function returns `true`, then `id` is definitely a `string`"

---

## Alternative (Less Clean)

You could also use type casting:

```ts
const categoryIds = categoryData
  .map((c) => c.categoryId)
  .filter((id) => id !== null) as string[];
```

But the type predicate approach is cleaner and doesn't require a cast!

---

## Key Takeaways

| Concept        | Benefit                                                |
| -------------- | ------------------------------------------------------ |
| Type predicate | Combines runtime filtering with compile-time narrowing |
| `id is string` | Tells TypeScript the filtered result excludes nulls    |
| Avoids casting | No need for `as string[]` which can be error-prone     |
| Type safety    | Prevents accidental null access after filtering        |

> ✅ This pattern is **essential when filtering nullable values from arrays in TypeScript**.

---

# Creating a Lookup Map from an Array

This pattern converts an array into a `Map` for **O(1) lookup** instead of repeatedly searching through the array.

```ts
const categoryMap = new Map(categories.map((c) => [c.id, c]));
```

---

## The Problem It Solves

Let's say you have two data sources:

1. **Transaction data** (grouped by `categoryId`) from Prisma's `groupBy`:

```ts
const categoryData = [
  { categoryId: "cat_001", _sum: { amount: 5000 } },
  { categoryId: "cat_002", _sum: { amount: 3000 } },
  { categoryId: "cat_003", _sum: { amount: 800 } },
];
```

2. **Category details** (name, color) from a separate query:

```ts
const categories = [
  { id: "cat_001", name: "Food", color: "#FF5733" },
  { id: "cat_002", name: "Transport", color: "#33FF57" },
  { id: "cat_003", name: "Entertainment", color: "#3357FF" },
];
```

You need to **combine** them — for each transaction, get the category name and color.

---

## The Naive Approach ❌ (O(n²))

```ts
categoryData.map((item) => {
  // This searches the entire array for EACH item!
  const category = categories.find((c) => c.id === item.categoryId);
  return {
    ...item,
    categoryName: category?.name,
  };
});
```

**Problem:** If you have 100 categories and 100 transactions, this does **100 × 100 = 10,000 comparisons**.

---

## The Optimized Approach ✅ (O(n))

### Step 1: Create a Map

```ts
const categoryMap = new Map(categories.map((c) => [c.id, c]));
```

This transforms the array:

```ts
// Input array:
[
  { id: "cat_001", name: "Food", color: "#FF5733" },
  { id: "cat_002", name: "Transport", color: "#33FF57" },
]

// After .map((c) => [c.id, c]):
[
  ["cat_001", { id: "cat_001", name: "Food", color: "#FF5733" }],
  ["cat_002", { id: "cat_002", name: "Transport", color: "#33FF57" }],
]

// After new Map(...):
Map {
  "cat_001" => { id: "cat_001", name: "Food", color: "#FF5733" },
  "cat_002" => { id: "cat_002", name: "Transport", color: "#33FF57" },
}
```

### Step 2: Use Map for O(1) Lookup

```ts
categoryData.map((item) => {
  // O(1) lookup - instant!
  const category = categoryMap.get(item.categoryId);
  return {
    ...item,
    categoryName: category?.name ?? "Uncategorized",
  };
});
```

---

## Visual Comparison

```
❌ Array.find() - O(n) per lookup
┌─────────────────────────────────────┐
│ Looking for "cat_003"...            │
│   Check cat_001? No                 │
│   Check cat_002? No                 │
│   Check cat_003? Yes! Found it      │
│                                     │
│ Time: 3 comparisons                 │
└─────────────────────────────────────┘

✅ Map.get() - O(1) per lookup
┌─────────────────────────────────────┐
│ Looking for "cat_003"...            │
│   Hash "cat_003" → Found instantly! │
│                                     │
│ Time: 1 operation                   │
└─────────────────────────────────────┘
```

---

## The Pattern Explained

```ts
new Map(categories.map((c) => [c.id, c]))
        │              │       │     │
        │              │       │     └── The value (full object)
        │              │       └── The key (what you'll lookup by)
        │              └── Transform each item into [key, value] pair
        └── Array of categories
```

---

## When to Use This Pattern

| Scenario                               | Use Map?                      |
| -------------------------------------- | ----------------------------- |
| Joining two datasets by ID             | ✅ Yes                        |
| Looking up item details multiple times | ✅ Yes                        |
| Single lookup (only once)              | ❌ No (use `.find()`)         |
| Very small arrays (< 10 items)         | ❌ No (overhead not worth it) |

---

## Real-World Example

```ts
// 1. Fetch category IDs from transactions
const categoryIds = transactions.map((t) => t.categoryId).filter(Boolean);

// 2. Fetch category details from database
const categories = await prisma.category.findMany({
  where: { id: { in: categoryIds } },
  select: { id: true, name: true, color: true },
});

// 3. Create lookup map (O(n))
const categoryMap = new Map(categories.map((c) => [c.id, c]));

// 4. Enrich transactions (O(n) total, not O(n²))
const enriched = transactions.map((t) => ({
  ...t,
  categoryName: categoryMap.get(t.categoryId)?.name ?? "Uncategorized",
  categoryColor: categoryMap.get(t.categoryId)?.color ?? null,
}));
```

---

## Key Takeaways

| Concept                | Benefit                                            |
| ---------------------- | -------------------------------------------------- |
| `new Map([...])`       | Creates a hash map for fast lookups                |
| `.map(c => [c.id, c])` | Transforms array to `[key, value]` pairs           |
| `O(1)` lookup          | Constant time regardless of size                   |
| Avoids O(n²)           | Massive performance improvement for large datasets |

> ✅ This pattern is **essential when enriching data from multiple sources in TypeScript**.

---

# JavaScript Date Month Overflow/Underflow

JavaScript's `Date` constructor automatically handles month values outside the 0-11 range by adjusting the year accordingly.

```ts
// Negative months wrap to previous year
new Date(2025, -1, 1); // December 2024
new Date(2025, -6, 1); // June 2024

// Overflow months wrap to next year
new Date(2025, 12, 1); // January 2026
new Date(2025, 13, 1); // February 2026
```

---

## Why This Matters

When calculating date ranges (e.g., "last 12 months"), you don't need to manually handle year boundaries:

```ts
const now = new Date(); // June 2025

// Going back 12 months from June 2025
for (let i = 11; i >= 0; i--) {
  const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
  // i=11: new Date(2025, 5-11, 1) = new Date(2025, -6, 1) = July 2024 ✅
  // i=0:  new Date(2025, 5-0, 1)  = new Date(2025, 5, 1)  = June 2025 ✅
}
```

---

## Visual Example

```
Current: June 2025 (month index 5)
Requesting: Last 12 months

Calculation: new Date(2025, 5 - i, 1)

i=11: new Date(2025, -6, 1) → July 2024
i=10: new Date(2025, -5, 1) → August 2024
i=9:  new Date(2025, -4, 1) → September 2024
i=8:  new Date(2025, -3, 1) → October 2024
i=7:  new Date(2025, -2, 1) → November 2024
i=6:  new Date(2025, -1, 1) → December 2024
i=5:  new Date(2025, 0, 1)  → January 2025
i=4:  new Date(2025, 1, 1)  → February 2025
i=3:  new Date(2025, 2, 1)  → March 2025
i=2:  new Date(2025, 3, 1)  → April 2025
i=1:  new Date(2025, 4, 1)  → May 2025
i=0:  new Date(2025, 5, 1)  → June 2025

Result: 12 months from July 2024 to June 2025 ✅
```

---

## The Math Behind It

```
new Date(year, month, day)

If month < 0:
  year = year - Math.ceil(Math.abs(month) / 12)
  month = 12 + (month % 12)

If month > 11:
  year = year + Math.floor(month / 12)
  month = month % 12
```

---

## Key Takeaways

| Value                    | Result           |
| ------------------------ | ---------------- |
| `new Date(2025, -1, 1)`  | December 1, 2024 |
| `new Date(2025, -6, 1)`  | June 1, 2024     |
| `new Date(2025, -12, 1)` | January 1, 2024  |
| `new Date(2025, 12, 1)`  | January 1, 2026  |
| `new Date(2025, 13, 1)`  | February 1, 2026 |
| `new Date(2025, 24, 1)`  | January 1, 2027  |

> ✅ This is a **built-in feature** of JavaScript that makes date range calculations much simpler!
