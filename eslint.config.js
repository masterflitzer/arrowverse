// @ts-check

import js from "@eslint/js";
import ts from "typescript-eslint";

/** @type {import("typescript-eslint").Config} */
export default [js.configs.all, ...ts.configs.all];
