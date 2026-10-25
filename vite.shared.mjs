// Vite settings shared by the test suite (vitest.config.mjs) and the playground,
// so both run src/ directly, the way Babel builds it.
import { fileURLToPath } from "node:url";

const src = fileURLToPath( new URL( "./src", import.meta.url ) );

export const resolve = {
	alias: [
		{ find: /^@seo-analyzer\//, replacement: `${ src }/` },
		{ find: /^yoastseo$/, replacement: `${ src }/index.js` },
	],
};

// Source files use JSX in .js files.
export const esbuild = { loader: "jsx", include: /(src|spec|playground)\/.*\.jsx?$/, exclude: [], jsx: "automatic" };

export const css = { preprocessorOptions: { scss: { api: "modern-compiler" } } };
