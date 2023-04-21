module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:github/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "github"],
  rules: {
    "no-console": "off",
    'camelcase': "off",
    "no-then" : "off",
    "i18n-text/no-en" : "off",
    "filenames/match-regex" : "off",
    "prettier/prettier": "off",
    "import/no-unresolved": "off"
  },
  ignorePatterns: ["**/node_modules/**/*", "./node_modules/big.js"],
};
