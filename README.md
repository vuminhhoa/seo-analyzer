# seo-analyzer

[![CI](https://github.com/vuminhhoa/seo-analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/vuminhhoa/seo-analyzer/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@vuminhhoa/seo-analyzer.svg)](https://www.npmjs.com/package/@vuminhhoa/seo-analyzer)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

SEO and readability content analysis for JavaScript. Give it a page (HTML body, meta title, meta description, URL slug and a focus keyword) and it returns a scored checklist of SEO and readability checks, with result messages rendered as React components built on [Shopify Polaris](https://polaris.shopify.com/).

This project is a fork of [`yoastseo`](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo) by Team Yoast. It reuses Yoast's language processing (stemming, sentence tokenization, transition words, passive voice and more for 20+ languages) and adds an opinionated assessment set aimed at e-commerce pages. See [NOTICE.md](NOTICE.md) for attribution.

## Features

- **25 assessments** in two groups, technical SEO and content. Thresholds are checked against Google Search Central guidance (last reviewed October 2026); see the [checklist](docs/checklist.md) for each rule and its source.
- **Weighted 0-100 score** based on each assessment's priority.
- **Results grouped** by category or by status (`good` / `improve` / `bad`).
- **i18n hooks** for every title, message and button label.
- **Per-page overrides** to skip or ignore individual assessments.

## Installation

```bash
npm install @vuminhhoa/seo-analyzer
# or
yarn add @vuminhhoa/seo-analyzer
```

Peer dependencies: `react@^18`, `react-dom@^18`, `@shopify/polaris@^13` and `@shopify/polaris-icons@^9`. Note that Shopify has deprecated Polaris React in favour of Polaris web components; see [Roadmap](#roadmap).

The package ships Babel-compiled CommonJS in `build/` and imports one `.scss` file, so your bundler needs a Sass loader (webpack `sass-loader`, or Vite's built-in Sass support with `sass` installed). It runs in the browser and uses `DOMParser`.

## Usage

```js
import { Paper, CombinedAssessor } from "@vuminhhoa/seo-analyzer";
import Researcher from "@vuminhhoa/seo-analyzer/build/languageProcessing/languages/en/Researcher";

const paper = new Paper( "<h1>Healthy breakfast ideas</h1><p>A healthy breakfast gives you energy…</p>", {
	keyword: "healthy breakfast",
	title: "10 healthy breakfast ideas for busy mornings",
	description: "Quick and healthy breakfast ideas you can make in 5 minutes.",
	slug: "healthy-breakfast",
	locale: "en_US",
} );

const assessor = new CombinedAssessor( new Researcher( paper ) );
assessor.assess( paper );

const { score, assessments } = assessor.getResult( "status" );
// score       -> 0-100
// assessments -> { good: [...], improve: [...], bad: [...] }
```

Each assessment result has `id`, `title`, `status`, `score`, `priority` and a `body` (a React node you can render directly).

If your page template renders H1s outside the analyzed text (for example a theme that prints the product title as `<h1>`), pass their number as `h1Count`. The H1 check adds them to the H1s in the text and expects exactly one in total.

For an exact title check, pass the title's pixel width as `titleWidth`. In the browser, `helpers.measureTextWidth( title )` measures it in the font Google uses for titles. Otherwise the check estimates from the number of characters.

- `getResult( "category" )` groups results into technical SEO and content SEO.
- `getResult( groupBy, false )` leaves out the score.
- `SeoAssessor` and `ContentAssessor` can be used on their own if you only need one group.

### Languages

Use `getResearcher` to pick the researcher for a language code or locale. Unknown languages fall back to the default researcher:

```js
import getResearcher from "@vuminhhoa/seo-analyzer/build/languageProcessing/getResearcher";

const Researcher = getResearcher( "en_US" ); // also accepts "en" or "en-US"
const assessor = new CombinedAssessor( new Researcher( paper ) );
```

You can also import a researcher directly from `build/languageProcessing/languages/<code>/Researcher`. Available codes:

`ar` `ca` `cs` `de` `el` `en` `es` `fa` `fr` `he` `hu` `id` `it` `ja` `nb` `nl` `pl` `pt` `ru` `sk` `sv` `tr`

Use `_default` for any other language. Morphology and readability support differs per language and follows the upstream [yoastseo language support table](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo#supported-languages).

### Translations

`assess( paper, i18n )` accepts an optional object with a `translate( key )` method. These keys are looked up:

| Key | Used for |
| --- | --- |
| `SeoAnalyzer.<assessmentId>.title` | Assessment title |
| `SeoAnalyzer.<assessmentId>.good` / `.improve` / `.bad` | Result message per status |
| `SeoAnalyzer.Button.learnMore` | "Learn more" link |
| `SeoAnalyzer.Button.viewMore` / `.viewLess` | Related keywords toggle |

Without `i18n` the built-in English texts are used.

### Customizing assessments

Every assessment takes a config object that is deep-merged over its defaults, so you can change texts, priority or `docUrl`:

```js
import { assessments } from "@vuminhhoa/seo-analyzer";

const density = new assessments.seo.KeyphraseDensityAssessment( {
	docUrl: "https://example.com/help/keyword-density",
} );
```

Pass `ignoredAssessments` or `skippedAssessments` (arrays of assessment ids) as `Paper` attributes to drop checks, or to force a `good` result for them, on a single page.

## Development

```bash
yarn install
yarn dev      # playground with hot reload: http://localhost:5173
yarn lint     # ESLint + import check (unresolved files, undeclared packages, Node built-ins)
yarn test     # Vitest: unit tests + regression snapshots (yarn test -u to accept intended changes)
yarn build    # Babel -> build/, TypeScript declarations -> types/
```

To try local changes in another project, run `yarn link` here, then `yarn link @vuminhhoa/seo-analyzer` in that project.

## Roadmap

- **UI-agnostic results.** Shopify has [deprecated Polaris React](https://www.npmjs.com/package/@shopify/polaris) in favour of Polaris web components. The plan is to return plain data (status, message, link) from assessments and move the Polaris rendering into an optional layer.
- **Smaller bundles.** The CommonJS build pulls in every language (about 1 MB gzipped). An ES module build with per-language entry points would let bundlers drop the languages you don't use.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first. Security issues: see [SECURITY.md](SECURITY.md).

## License

[GPL-3.0-or-later](LICENSE). This is a derivative work of `yoastseo` © Team Yoast, which is also licensed under the GPL. Bundled third-party stemmers keep their own licenses, as listed in [NOTICE.md](NOTICE.md).
