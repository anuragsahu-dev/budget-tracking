import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    typecheck: { tsconfig: "./tsconfig.test.json" },
    include: ["test/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 120000,
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "test/**",
        "**/*.d.ts",
        "src/generated/**",
      ],
    },
  },
});
