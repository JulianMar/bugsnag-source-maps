import {defineConfig, globalIgnores } from "eslint/config";

import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    languageOptions: {
      parser: tsParser,
    },
    extends: compat.extends("eslint:recommended"),
  },
  {
    files: ["**/*.ts"],
    extends: compat.extends("plugin:@typescript-eslint/recommended"),

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    rules: {
      "@typescript-eslint/no-empty-function": ["off"],
      "@typescript-eslint/no-explicit-any": ["warn"],
    },
  },
  globalIgnores([
    "**/node_modules",
    "**/dist",
    "**/coverage",
    "**/fixtures",
    "**/features",
  ]),
]);
