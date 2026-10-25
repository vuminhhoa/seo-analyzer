module.exports = {
	presets: [ "@babel/preset-env", "@babel/preset-react" ],
	plugins: [
		[
			"module-resolver",
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
