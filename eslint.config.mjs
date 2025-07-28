import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
})

const eslintConfig = [
  ...compat.config({
    extends: [
      "next",
      "next/typescript",
      "plugin:react/recommended",
      "standard-with-typescript",
      "next/core-web-vitals",
      "plugin:prettier/recommended"
    ],
    parserOptions: {
      project: "./tsconfig.json"
    },
    plugins: ["react", "prettier"],
    ignorePatterns: ["tsconfig.json"],
    rules: {
      "no-console": "error",
      "no-await-in-loop": "error",
      "no-duplicate-imports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ],
      "prettier/prettier": "warn",
      "multiline-ternary": "off",
      "@typescript-eslint/indent": "off",
      "space-before-function-paren": "off",
      "@typescript-eslint/space-before-function-paren": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/quotes": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            attributes: false
          }
        }
      ]
    }
  })
]

export default eslintConfig
