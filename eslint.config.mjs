import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: [ "build/", "types/", "src/vendor/" ] },
	{ linterOptions: { reportUnusedDisableDirectives: "off" } },
	js.configs.recommended,
	react.configs.flat.recommended,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: { ...globals.browser },
		},
		settings: { react: { version: "18" } },
		rules: {
			"react/prop-types": "off",
			"no-unused-vars": [ "error", { args: "none", caughtErrors: "none" } ],
			"no-prototype-builtins": "warn",
			"no-useless-backreference": "warn",
		},
	},
	{
		files: [ "src/helpers/shortlinker/singleton.js" ],
		languageOptions: { globals: { ...globals.node } },
	},
	{
		files: [ "babel.config.js", "eslint.config.mjs", "scripts/**" ],
		languageOptions: { globals: { ...globals.node } },
	},
];
