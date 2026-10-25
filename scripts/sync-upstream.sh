#!/usr/bin/env bash
# Rebuilds the `upstream` branch from Yoast/wordpress-seo: only the history of
# packages/yoastseo/src, rewritten to live under src/ like in this repository.
# git-filter-repo is deterministic, so re-running it yields the same commit ids
# and the branch only ever moves forward.
#
# Usage: scripts/sync-upstream.sh [upstream-ref]   (default: trunk)
# Then:  git checkout -b chore/sync-upstream main && git merge upstream
set -euo pipefail

REF="${1:-trunk}"
REPO_URL="https://github.com/Yoast/wordpress-seo.git"
ROOT="$(git rev-parse --show-toplevel)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

command -v git-filter-repo >/dev/null || { echo "git-filter-repo is required (brew/pip install git-filter-repo)" >&2; exit 1; }

echo "Cloning $REPO_URL ($REF)..."
git clone --quiet --single-branch --branch "$REF" --no-tags "$REPO_URL" "$WORK/yoast"

echo "Filtering packages/yoastseo/src -> src/..."
git -C "$WORK/yoast" filter-repo --force --quiet \
	--path packages/yoastseo/src/ \
	--path-rename packages/yoastseo/src/:src/

NEW="$(git -C "$WORK/yoast" rev-parse HEAD)"
git -C "$ROOT" fetch --quiet --no-tags "$WORK/yoast" "$NEW"

if git -C "$ROOT" rev-parse --verify --quiet upstream >/dev/null; then
	if ! git -C "$ROOT" merge-base --is-ancestor upstream "$NEW"; then
		echo "Refusing to update: $NEW does not descend from the current upstream branch." >&2
		exit 1
	fi
fi

git -C "$ROOT" branch --force upstream "$NEW"
echo "upstream -> $(git -C "$ROOT" log -1 --format='%h %ad %s' --date=short upstream)"
