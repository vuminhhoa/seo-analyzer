// Fails when an import under src/ cannot be satisfied for consumers:
// - a relative or aliased (@seo-analyzer / yoastseo) import that does not resolve to a file.
//   Babel does not check this, and upstream syncs can bring in files that import helpers
//   this fork removed;
// - a package import that is not declared in dependencies or peerDependencies;
// - a Node built-in (e.g. "url") without a same-named browser polyfill in dependencies.
//   Bundlers like Vite do not polyfill Node built-ins, so the code would break in the browser.
const fs = require("fs");
const path = require("path");
const { builtinModules } = require("module");

const root = process.argv[2] || process.cwd();
const src = path.join(root, "src");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const declared = new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]);
const aliases = { "@seo-analyzer": src, yoastseo: src };
const exts = ["", ".js", ".jsx", ".json", "/index.js"];

const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(d, e.name)) : /\.jsx?$/.test(e.name) ? [path.join(d, e.name)] : []);
const re = /(?:import\s[^'"]*?from\s*|import\s*\(\s*|require\(\s*|export\s[^'"]*?from\s*)["']([^"']+)["']/g;
const packageName = spec => (spec.startsWith("@") ? spec.split("/").slice(0, 2) : spec.split("/").slice(0, 1)).join("/");

const problems = [];
for (const file of walk(src)) {
  const code = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const where = path.relative(root, file);
  for (const [, spec] of code.matchAll(re)) {
    const alias = Object.keys(aliases).find(k => spec === k || spec.startsWith(k + "/"));
    if (spec.startsWith(".") || alias) {
      const base = spec.startsWith(".")
        ? path.resolve(path.dirname(file), spec)
        : spec === alias ? path.join(aliases[alias], "index.js") : path.join(aliases[alias], spec.slice(alias.length + 1));
      if (!exts.some(x => fs.existsSync(base + x) && fs.statSync(base + x).isFile())) {
        problems.push(`${where} -> ${spec} (file not found)`);
      }
      continue;
    }
    const name = packageName(spec.replace(/^node:/, ""));
    if (builtinModules.includes(name) && !declared.has(name)) {
      problems.push(`${where} -> ${spec} (Node built-in: add the "${name}" browser polyfill to dependencies)`);
    } else if (!builtinModules.includes(name) && !declared.has(name)) {
      problems.push(`${where} -> ${spec} (package not in dependencies/peerDependencies)`);
    }
  }
}

problems.forEach(problem => console.log(problem));
console.log(`import problems: ${problems.length}`);
process.exit(problems.length ? 1 : 0);
