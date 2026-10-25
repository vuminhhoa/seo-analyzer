# Contributing

Thanks for taking the time to contribute!

## Getting started

```bash
git clone https://github.com/vuminhhoa/seo-analyzer.git
cd seo-analyzer
yarn install
yarn lint
yarn build
```

Requires Node.js 20.10 or newer, and Yarn 1.

## Pull requests

1. Fork the repo and create a branch from `main`.
2. Keep each change focused, with one topic per PR.
3. Make sure `yarn lint` and `yarn build` pass.
4. If you add or change an assessment, update [docs/checklist.md](docs/checklist.md) and give the assessment a `docUrl` pointing to its section there.
5. Describe *what* changed and *why* in the PR description.

## Upstream files

Most of `src/` comes from Yoast's [`yoastseo`](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo) package. To keep syncs cheap:

- Don't reformat files that come from upstream. Only change them when the logic needs to change.
- Upstream files import the package as `"yoastseo"`. The Babel and TypeScript alias resolves that to `src/`, so leave those imports as they are.
- Put new code in new files where you can, rather than editing upstream files.

## Syncing with upstream

The `upstream` branch holds the history of `packages/yoastseo/src`, rewritten to `src/`. Each month, the [Upstream sync](.github/workflows/upstream-sync.yml) workflow refreshes it and opens a PR. To sync by hand (requires [git-filter-repo](https://github.com/newren/git-filter-repo)):

```bash
git fetch origin upstream:upstream
scripts/sync-upstream.sh
git checkout -b chore/sync-upstream origin/main
git merge upstream          # resolve conflicts, then yarn lint && yarn build
git push -u origin chore/sync-upstream
```

Always merge sync PRs with a **merge commit**, never squash or rebase. A squash would cut the link to upstream, and the next sync would conflict all over again.

## Reporting bugs

Open an issue with:

- a minimal `Paper` (text plus attributes) that reproduces the problem,
- the locale and Researcher you used,
- the result you expected and the result you got.

## License

By contributing, you agree that your contributions are licensed under the [GPL-3.0-or-later](LICENSE) license, the same as the rest of the project.
