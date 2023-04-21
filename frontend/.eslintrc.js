module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:github/recommended",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "github"],
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
