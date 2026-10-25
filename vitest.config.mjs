import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = fileURLToPath( new URL( "./src", import.meta.url ) );

export default defineConfig( {
	resolve: {
		alias: [
			{ find: /^@seo-analyzer\//, replacement: `${ src }/` },
			{ find: /^yoastseo$/, replacement: `${ src }/index.js` },
		],
	},
	css: { preprocessorOptions: { scss: { api: "modern-compiler" } } },
	// Source files use JSX in .js files.
	esbuild: { loader: "jsx", include: /src\/.*\.jsx?$|spec\/.*\.jsx?$/, exclude: [], jsx: "automatic" },
	test: {
		environment: "jsdom",
		include: [ "spec/**/*.spec.js" ],
		setupFiles: [ "spec/setup.js" ],
		css: false,
	},
} );
