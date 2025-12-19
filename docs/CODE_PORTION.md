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
