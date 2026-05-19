// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    jsdoc.configs["flat/recommended-typescript"],
    {
        rules: {
            // TypeScript specific rules
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-inferrable-types": "off",

            // JSDoc rules
            "jsdoc/no-undefined-types": "warn",
            "jsdoc/require-hyphen-before-param-description": "warn",

            // General code style rules
            "prefer-const": "error",
            "indent": ["error", 4],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
            "no-trailing-spaces": "error",
            "no-multiple-empty-lines": ["error", {max: 1}],
            "eol-last": "error",
            "object-curly-spacing": ["error", "never"],
            "array-bracket-spacing": ["error", "never"],
            "space-before-blocks": "error",
            "keyword-spacing": "error",
            "space-infix-ops": "error",
            "linebreak-style": "warn",

            // Import/export rules
            "no-duplicate-imports": "error",
            "sort-imports": ["error", {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
            }],
        },
    },
    {
        files: ["**/*.js"],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        files: ["test/**/*.ts"],
        rules: {
            "max-len": "off",
        },
    },
    {
        files: ["src/models/**/*.ts"],
        rules: {
            "new-cap": "off",
        },
    },
    {
        files: ["**/*.cjs", "eslint.config.js"],
        languageOptions: {
            globals: {
                module: "readonly",
                exports: "readonly",
                process: "readonly",
            },
        },
    },
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
            "coverage/**",
            "*.min.js",
        ],
    },
);
