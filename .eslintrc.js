module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    "expo",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react", "react-native", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": 0,
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        endOfLine: "auto",
        semi: true
      }
    ]
  }
};
