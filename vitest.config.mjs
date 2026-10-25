import { defineConfig } from "vitest/config";
import { css, esbuild, resolve } from "./vite.shared.mjs";

export default defineConfig( {
	resolve,
	esbuild,
	css,
	test: {
		environment: "jsdom",
		include: [ "spec/**/*.spec.js" ],
		setupFiles: [ "spec/setup.js" ],
		css: false,
	},
} );
