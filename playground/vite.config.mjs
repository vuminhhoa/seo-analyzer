import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { css, esbuild, resolve } from "../vite.shared.mjs";

export default defineConfig( {
	root: fileURLToPath( new URL( ".", import.meta.url ) ),
	plugins: [ react( { include: /\.jsx?$/ } ) ],
	resolve,
	esbuild,
	css,
	optimizeDeps: { esbuildOptions: { loader: { ".js": "jsx" } } },
	server: { port: 5173, open: true },
} );
