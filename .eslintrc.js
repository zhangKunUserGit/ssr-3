module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true
  },
  extends: [
    "react-app",
    "standard",
    "plugin:prettier/recommended"
  ],
  plugins: [
    "prettier",
  ],
  "parserOptions": {
    ecmaFeatures: {
      jsx: true,
      modules: true,
      legacyDecorators: true,
      experimentalObjectRestSpread: true,
    }
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        "printWidth": 100,
        "singleQuote": true
      }
    ],
    'no-useless-escape': 0,
    'prefer-promise-reject-errors': 0,
    'generator-star-spacing': 'off',
    'no-debugger': 0,
    'promise/param-names': 0,
    'no-eval': 0
  }
};
