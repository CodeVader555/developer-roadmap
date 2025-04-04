#!/usr/bin/env bash

set -e

# Fetch the latest commit hash from the GitHub repo
LATEST_COMMIT_HASH=$(git ls-remote git@github.com:roadmapsh/web-draw.git refs/heads/main | awk '{print $1}')

echo "Latest commit hash: $LATEST_COMMIT_HASH"

# Install the package using the latest commit hash
pnpm add github:roadmapsh/web-draw#"$LATEST_COMMIT_HASH"\&path:packages/editor