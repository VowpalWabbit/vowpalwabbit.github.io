#!/bin/bash

set -e

shopt -s extglob

TEMP_DIR="$HOME/vw_website_tmp"

if [ ! -z "$(git status --porcelain)" ]; then
  echo "Working directory is not clean"
  git status --porcelain
  exit 1
fi

mkdir -p ${TEMP_DIR}
if [ ! -z "$(ls -A ${TEMP_DIR})" ]; then
  echo "${TEMP_DIR} is not empty"
  exit 1
fi

bundle exec jekyll build
cp -r _site/* ${TEMP_DIR}

SOURCE_COMMIT=$(git rev-parse HEAD)
git checkout master
rm -vr !(".nojekyll"|".pipelines"|"CNAME"|"LICENSE")
cp -r ${TEMP_DIR}/* .
rm -vr .sass-cache
git add --all
git commit -m "Deploy commit ${SOURCE_COMMIT}"
DEPLOY_COMMIT=$(git rev-parse HEAD)
git checkout "source"

echo "Deploy commit created: ${DEPLOY_COMMIT}"
git show ${DEPLOY_COMMIT} --stat
echo "To push changes run: git push origin master"
echo "To view changes run: git checkout master && python -m http.server"