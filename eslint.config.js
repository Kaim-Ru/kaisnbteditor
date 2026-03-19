import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default ts.config(
  // 1. 基本となる推奨設定の適用
  js.configs.recommended,
  ...ts.configs.recommended,

  // 2. 各種プラグインの設定
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json", // standard-with-typescript相当の動作に必要
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // 各プラグインの推奨ルールを手動でマージ（Flat Configでの標準的な手法）
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // ここに独自のルールを追加
    },
  },
  // 3. 無視するファイルの設定（旧 .eslintignore の役割）
  {
    ignores: ["dist", "node_modules", "build"],
  },
);
