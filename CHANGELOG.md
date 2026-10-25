# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

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
