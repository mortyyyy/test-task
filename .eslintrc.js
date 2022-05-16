module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    sourceType: "module",
  },
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};
