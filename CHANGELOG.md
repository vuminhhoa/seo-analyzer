# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed: SEO checklist review (October 2026)
Every check was reviewed against current Google Search Central guidance, with the current Yoast SEO defaults used where Google sets no number. The rationale and sources are in [docs/checklist.md](docs/checklist.md). **Scores change for most pages.**

- `keyphraseDensity`: 1–1.5% → **0.5–3%**. Under 0.5% is now `improve`, and over 3% (keyword stuffing) is `bad`. Priority high → medium.
- `metaDescriptionLength`: 150–160 → **120–160** characters.
- `textLength`: "600 words and 2,500 characters" → **300 words** (`improve` from 200). Priority high → medium. Google has no preferred word count.
- `titleWidth`: 50–70 characters → **400–600 px** when `titleWidth` is given, otherwise 40–60 characters. Too short is now `improve`.
- `singleH1`: a missing H1 or several H1s is now `improve`, not `bad`. Google says multiple H1s are fine. Priority high → medium.
- `externalLinks`: no external link is now `improve`. `nofollow` links count. Priority high → low. Outbound links are not a ranking factor.
- `numberTitle`: a title without a number is now `improve` (a suggestion), not `bad`. Priority high → low.
- `slugKeyword` (medium → low) and `urlLength` (high → low): Google says keywords in URLs have "hardly any effect".
- `metaDescriptionKeyword`, `images`, `textParagraphTooLong`, `textSentenceLength`, `relatedKeywords`: priority high → medium.
- `textParagraphTooLong`: added the `improve` band (151–200 words). It was unreachable before.
- `textSentenceLength`: now grades the **share** of long sentences (`improve` over 25%, `bad` over 30%) instead of comparing that share to the 20-word limit. Custom `content` messages are no longer overwritten.
- Most thresholds are now configurable through each assessment's `parameters`.

### Fixed
- `textLength` counted the gaps between words instead of the words ("one two three" counted as 2). It now uses the `wordCountInText` research, which also counts Japanese correctly.
- `schema` never set its score, and gave an empty status (`NaN` score) on pages that are not products, collections or blog posts. It now applies only to those pages.
- `urlLength` gave full points to pages without a URL. It now applies only when there is a slug.
- `textParagraphTooLong` threw on a text without paragraphs.
- `SubheadingsKeyword` always failed because it read a property that does not exist (`match`).
- The overall score was `NaN` when `h1Count` was not passed. The H1 check now counts `h1Count` (H1s rendered outside the text, default 0) plus the `<h1>` tags in the text.
- `UrlLength` never set its score, so a short URL counted as 0 points. Overall scores go up for every page.
- The internal and external link checks were silently dropped in browser bundles without Node polyfills (Vite, for example). `url` and `events` are now dependencies.

### Changed
- Connected the repository to upstream `yoastseo` history (fork point `d30b500`) and added a monthly upstream sync workflow.
- Restored 87 upstream files that differed only in formatting to their original form, and added a `yoastseo` import alias so they need no changes.
- Synced with upstream `yoastseo` up to `afe80002` (2026-10-13). Researches now work on the parsed HTML tree, and the stemmers and function word lists are updated. Farsi multi-word function words are now split.
- The `ParagraphTooLong`, `KeyphraseDensity` and `SubheadingsKeyword` assessments read the new research result shapes.

### Added
- `getResearcher( languageOrLocale )` in `languageProcessing/getResearcher`.
- `Paper#getProvidedImages()` and `Paper#hasProvidedImages()`. With the `providedImages` attribute, the image researches assess only the images you pass in.
- `yarn check:imports`, run as part of `yarn lint`, fails on imports that do not resolve.

### Removed
- Unused, WordPress-only code that imported the undeclared `@wordpress/i18n`: `parsedPaper/assess/`, `scoring/renderers/AssessorPresenter.js` and `config/presenter.js`.

### Development
- Added a playground (`yarn dev`): a Vite + Polaris app that runs the analysis from `src/` with hot reload and shows the raw research output.
- Added `.nvmrc`.
- Added a Vitest suite (`yarn test`) with regression snapshots, and run it in CI.
- `yarn check:imports` now also fails on undeclared packages and on Node built-ins without a browser polyfill.

## [0.1.0]

The first public release as `@vuminhhoa/seo-analyzer`.

### Changed
- Published as `@vuminhhoa/seo-analyzer`, with the internal import alias `@seo-analyzer`.
- `CombinedAssessor` runs the SEO and content assessors together.
- Translation keys use the `SeoAnalyzer.*` prefix.
- Renamed the related-keywords CSS classes to `SeoAnalyzer-RelatedKeywords__*`.
- The related-keywords research also reads `data.after_content`.
- The "Learn more" links point to [docs/checklist.md](docs/checklist.md).
- `react`, `react-dom` and `@shopify/polaris*` are now peer dependencies.

### Removed
- The unused `loglevel` dependency and the Grunt and legacy ESLint tooling.

### Fixed
- A broken import path in `parsedPaper/build/tree/metadata/buildTree.js`.
