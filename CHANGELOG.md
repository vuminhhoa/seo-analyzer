# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- Connected the repository to upstream `yoastseo` history (fork point `d30b500`) and added a monthly upstream sync workflow.
- Restored 87 upstream files that differed only in formatting to their original form, and added a `yoastseo` import alias so they need no changes.
- Synced with upstream `yoastseo` up to `afe80002` (2026-10-13). Researches now work on the parsed HTML tree, and the stemmers and function word lists are updated. Farsi multi-word function words are now split.
- The `ParagraphTooLong`, `KeyphraseDensity` and `SubheadingsKeyword` assessments read the new research result shapes.

### Added
- `getResearcher( languageOrLocale )` in `languageProcessing/getResearcher`.
- `Paper#getProvidedImages()` and `Paper#hasProvidedImages()`. With the `providedImages` attribute, the image researches assess only the images you pass in.
- `yarn check:imports`, run as part of `yarn lint`, fails on imports that do not resolve.

### Fixed
- `SubheadingsKeyword` always failed because it read a property that does not exist (`match`).
- The overall score was `NaN` when `h1Count` was not passed. The H1 check now adds `h1Count` (H1s rendered outside the text, default 0) to the `<h1>` tags in the text, and expects exactly one in total. **Behaviour change:** `h1Count: 0` with no H1 in the text is now `bad` (it was `good`), and `h1Count: 1` together with an H1 in the text is now `improve` (it was `good`).
- `UrlLength` never set its score, so a short URL counted as 0 points. Overall scores go up for every page.
- The internal and external link checks were silently dropped in browser bundles without Node polyfills (Vite, for example). `url` and `events` are now dependencies.

### Changed
- `@shopify/polaris-icons` peer range is now `^9.3.1`, the version `@shopify/polaris` 13.9.5 itself depends on.

### Removed
- Unused, WordPress-only code that imported the undeclared `@wordpress/i18n`: `parsedPaper/assess/`, `scoring/renderers/AssessorPresenter.js` and `config/presenter.js`.

### Development
- Added a Vitest suite (`yarn test`) with regression snapshots, and run it in CI.
- `yarn check:imports` now also fails on undeclared packages and on Node built-ins without a browser polyfill.

## [0.1.0]

The first public release as `@vuminhhoa/seo-analyzer`.

### Changed
- Renamed the package from `axyseo` to `@vuminhhoa/seo-analyzer`, and the internal import alias from `@axyseo` to `@seo-analyzer`.
- Renamed `AvadaAssessor` to `CombinedAssessor`.
- Renamed translation keys from `Axyseo.*` to `SeoAnalyzer.*`.
- Renamed the related-keywords CSS classes to `SeoAnalyzer-RelatedKeywords__*`.
- The related-keywords research reads `data.after_content` (was `data.metafields_avadaSEO_after_content`).
- The "Learn more" links point to [docs/checklist.md](docs/checklist.md).
- `react`, `react-dom` and `@shopify/polaris*` are now peer dependencies.

### Removed
- The unused `loglevel` dependency and the Grunt and legacy ESLint tooling.

### Fixed
- A broken import path in `parsedPaper/build/tree/metadata/buildTree.js`.
