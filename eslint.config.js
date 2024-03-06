// @ts-check

import js from "@eslint/js";
import ts from "typescript-eslint";

/** @type {import("typescript-eslint").Config} */
export default [
    js.configs.recommended,
    ...ts.configs.strictTypeChecked,
    {
        languageOptions: {
            ecmaVersion: "latest",
            parserOptions: {
                ecmaVersion: "latest",
                jsDocParsingMode: "all",
                project: true,
            },
            sourceType: "module",
        },
        linterOptions: {
            noInlineConfig: true,
            reportUnusedDisableDirectives: true,
        },
    },
];
