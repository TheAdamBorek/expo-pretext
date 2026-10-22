#!/usr/bin/env bash
# Builds the checked-out commit S and pushes a tag build/<first 12 chars of S>
# pointing at a commit whose only parent is S and whose only change is adding
# build/. Git consumers pin these tags, so installing needs no build step.
#
# Usage: scripts/tag-build.sh [remote]   (remote defaults to origin)
#
# Run it from a clean checkout of the commit to build. If the tag already
# exists on the remote it does nothing. It never moves or overwrites a tag,
# never pushes a branch and never changes HEAD.
set -euo pipefail

remote="${1:-origin}"

cd "$(git rev-parse --show-toplevel)"

source_sha="$(git rev-parse --verify 'HEAD^{commit}')"
tag="build/${source_sha:0:12}"

if [ -n "$(git ls-remote --tags "$remote" "refs/tags/$tag")" ]; then
  echo "$tag already exists on $remote, nothing to do."
  exit 0
fi

if [ -n "$(git status --porcelain --untracked-files=all)" ]; then
  echo "error: the working tree must be clean so build/ matches $source_sha." >&2
  git status --short >&2
  exit 1
fi

echo "Building $source_sha"
npm ci --no-audit --no-fund --ignore-scripts
rm -rf build
npm run build

for f in build/index.js build/index.d.ts; do
  if [ ! -f "$f" ]; then
    echo "error: $f is missing after the build." >&2
    exit 1
  fi
done

# Assemble the tree in a throwaway index: S's tree plus build/, nothing else.
index_file="$(mktemp)"
trap 'rm -f "$index_file"' EXIT
GIT_INDEX_FILE="$index_file" git read-tree "$source_sha"
GIT_INDEX_FILE="$index_file" git add -f build
tree="$(GIT_INDEX_FILE="$index_file" git write-tree)"

export GIT_AUTHOR_NAME="github-actions[bot]"
export GIT_AUTHOR_EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"

build_commit="$(git commit-tree "$tree" -p "$source_sha" -m "Build of $source_sha" \
  -m "Adds the compiled build/ directory on top of source commit $source_sha.")"

unexpected="$(git diff --name-only "$source_sha" "$build_commit" | grep -v '^build/' || true)"
if [ -n "$unexpected" ]; then
  echo "error: the build commit changes files outside build/:" >&2
  echo "$unexpected" >&2
  exit 1
fi

# A local tag left over from a run whose push failed was never published.
if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
  git tag -d "$tag"
fi
git tag -a "$tag" "$build_commit" -m "Build of $source_sha"

git push "$remote" "refs/tags/$tag"
echo "Pushed $tag -> $build_commit (parent $source_sha)"
