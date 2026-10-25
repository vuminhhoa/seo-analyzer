# Notice

seo-analyzer
Copyright (C) 2025-2026 Vu Minh Hoa

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. See [LICENSE](LICENSE).

## Upstream

This project is a modified version of [`yoastseo`](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo) (YoastSEO.js), Copyright (C) Team Yoast, licensed under the GNU General Public License.

Main changes from upstream:

- A new assessment set and scoring model (`SeoAssessor`, `ContentAssessor`, `CombinedAssessor`), with weighted, priority-based scores.
- React result bodies built on Shopify Polaris, and i18n hooks.
- New assessments (related keywords, schema, number in title and duplicate title), plus reworked thresholds and messages in the existing ones.
- The Web Worker API and the WordPress-specific parts of upstream were removed.

## Third-party code

These bundled files keep their original copyright and license headers:

| Path | Origin | License |
| --- | --- | --- |
| `src/vendor/turkishStemmer.js` | Snowball JavaScript (Oleg Mazko) | BSD-3-Clause |
| `src/languageProcessing/languages/*/helpers/internal/stem.js` | Language-specific stemmers (Snowball / Porter and others, see each file's header) | BSD / MIT, per file |
| `src/languageProcessing/languages/hu/config/internal/*` | Word lists derived from a Common Crawl corpus | CC BY-SA 4.0 |
