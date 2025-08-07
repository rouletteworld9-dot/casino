import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 🌐 Frontend (React, Browser)
  {
    files: ["frontend/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      sourceType: "module",
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
    },
  },

  // ⚙️ Backend (Node, CommonJS)
  {
    files: ["backend/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "script", // CommonJS
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
]);
