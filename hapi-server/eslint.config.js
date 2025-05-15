// import hapiPlugin from "@hapi/eslint-plugin"; // hapiPlugin could not be made to work

export default [
  {
    ignores: ["dist"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
