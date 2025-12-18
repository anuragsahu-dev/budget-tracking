/**
 * Unit Tests - Slug Utility
 */

import { describe, it, expect } from "vitest";
import { generateSlug } from "../../src/utils/slug";

describe("generateSlug", () => {
  it("converts text to lowercase", () => {
    expect(generateSlug("HELLO WORLD")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateSlug("food and drinks")).toBe("food-and-drinks");
  });

  it("removes special characters", () => {
    expect(generateSlug("Food & Dining")).toBe("food-dining");
  });

  it("handles accented characters", () => {
    expect(generateSlug("Café Résumé")).toBe("cafe-resume");
  });

  it("trims whitespace", () => {
    expect(generateSlug("  hello  ")).toBe("hello");
  });

  it("removes multiple hyphens", () => {
    expect(generateSlug("a---b")).toBe("a-b");
  });
});
