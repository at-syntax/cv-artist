module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:storybook/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: process.cwd(),
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "array",
      },
    ],
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "no-shadow": "off",
    "no-undef": "off",
    "react-native/no-inline-styles": "off",
    "no-console": "warn",
    "dot-notation": "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "import/extensions": [
      "error",
      "never",
      {
        json: "always",
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: ["packages/*/*"],
        // Use @cv-artist/xyz instead of packages/xyz/abc
      },
    ],
    "func-names": ["error", "as-needed"],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      }, // Ref: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#importorder-enforce-a-convention-in-module-import-order
    ],
  },
};
