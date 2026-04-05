import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
  {
    ignores: [
      "dist/**",
      "android/**",
      "node_modules/**",
      "coverage/**",
      "docs/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^(_|_error|error)$",
        },
      ],
      "no-console": "off",
    },
  },
  {
    files: ["**/*.vue"],
    plugins: {
      vue: pluginVue,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...pluginVue.configs["flat/recommended"].rules,
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^(_|_error|error)$",
        },
      ],
      "vue/multi-word-component-names": "off",
      "no-console": "off",
    },
  },
  {
    files: ["**/*.test.js", "**/*.smoke.test.js"],
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    files: ["src/views/HomeView.vue"],
    rules: {
      "no-unused-vars": "off",
    },
  },
];
