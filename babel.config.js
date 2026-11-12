module.exports = {
	presets: [ "@babel/preset-env", "@babel/preset-react" ],
	plugins: [
		[
			"module-resolver",
			// No `root` option: the plugin globs it with glob 9's default export, and
			// package.json resolves its glob to 14 (security fix), which has none.
			{
				"alias": {
					"@seo-analyzer": "./src",
					// Upstream Yoast files import the package by name; keep them byte-identical.
					"yoastseo": "./src"
				}
			}
		]
	]
};
