#!/usr/bin/env bash

set -e

rm -rf .temp
rm -rf editor

git clone ssh://git@github.com/roadmapsh/web-draw.git .temp/web-draw --depth 1

cd .temp/web-draw
pnpm install
npm run build -- --filter=@roadmapsh/dummy-editor


# Copy new editor
cp -rf packages/dummy-editor ../../editor

# Remove temp directory
rm -rf .temp

# Reinstall so that the editor which was setup gets used
rm -rf node_modules
pnpm install