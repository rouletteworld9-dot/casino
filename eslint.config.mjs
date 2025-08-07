import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 🌐 Frontend (React + TypeScript)
  {
    files: ["frontend/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: true,
        tsconfigRootDir: "./frontend", // Adjust if tsconfig.json is elsewhere
      },
      globals: {
        ...globals.browser,
      },
      sourceType: "module",
    },
    plugins: {
      react: pluginReact,
      "@typescript-eslint": pluginTs,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginTs.configs.recommended.rules,
    },
  },

  // ⚙️ Backend (Node, CommonJS, JavaScript only)
  {
    files: ["backend/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "script",
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
]);
