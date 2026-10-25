// Fails when an import under src/ (relative, or via the @seo-analyzer / yoastseo
// aliases) does not resolve to a file. Babel does not check this, and upstream
// syncs can bring in files that import helpers this fork removed.
const fs = require("fs");
const path = require("path");
const root = process.argv[2] || process.cwd();
const src = path.join(root, "src");
const aliases = { "@seo-analyzer": src, yoastseo: src };
const exts = ["", ".js", ".jsx", ".json", "/index.js"];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(d, e.name)) : /\.jsx?$/.test(e.name) ? [path.join(d, e.name)] : []);
const re = /(?:import\s[^'"]*?from\s*|import\s*\(\s*|require\(\s*|export\s[^'"]*?from\s*)["']([^"']+)["']/g;
let bad = 0;
for (const file of walk(src)) {
  const code = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, spec] of code.matchAll(re)) {
    let base;
    if (spec.startsWith(".")) base = path.resolve(path.dirname(file), spec);
    else {
      const a = Object.keys(aliases).find(k => spec === k || spec.startsWith(k + "/"));
      if (!a) continue;
      base = spec === a ? path.join(aliases[a], "index.js") : path.join(aliases[a], spec.slice(a.length + 1));
    }
    if (!exts.some(x => fs.existsSync(base + x) && fs.statSync(base + x).isFile())) {
      bad++;
      console.log(`${path.relative(root, file)} -> ${spec}`);
    }
  }
}
console.log(`unresolved: ${bad}`);
process.exit(bad ? 1 : 0);
