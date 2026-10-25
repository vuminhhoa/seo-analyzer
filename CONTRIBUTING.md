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

## Reporting bugs

Open an issue with:

- a minimal `Paper` (text plus attributes) that reproduces the problem,
- the locale and Researcher you used,
- the result you expected and the result you got.

## License

By contributing, you agree that your contributions are licensed under the [GPL-3.0-or-later](LICENSE) license, the same as the rest of the project.
