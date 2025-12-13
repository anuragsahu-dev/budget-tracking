// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript strict + stylistic rules
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // TypeScript-specific configuration
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Allow classes with only static members (common pattern for services/repositories)
      "@typescript-eslint/no-extraneous-class": "off",

      // Unused variables config - allow underscore-prefixed to be ignored
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // Allow non-null assertions in specific cases
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Prefer nullish coalescing
      "@typescript-eslint/prefer-nullish-coalescing": "off",
    },
  },

  // Global ignores
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/generated/**",
      "**/*.js",
      "**/*.mjs",
    ],
  },
];
