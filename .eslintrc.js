/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
      },
    ],
    "no-console": ["warn", { allow: ["error", "warn"] }],
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "coverage/",
    "scripts/",
    "jest.config.js",
  ],
};
