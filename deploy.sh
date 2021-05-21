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

git fetch origin
commits_local_but_not_remote_master=$(git log master..origin/master --oneline)
commits_remote_but_not_local_master=$(git log origin/master..master --oneline)
commits_local_but_not_remote_source=$(git log source..origin/source --oneline)
commits_remote_but_not_local_source=$(git log origin/source..source --oneline)

if [[ "${commits_local_but_not_remote_master}" != "" ]] ; then
  echo "commits_local_but_not_remote_master"
  exit 1
fi
if [[ "${commits_remote_but_not_local_master}" != "" ]] ; then
  echo "commits_remote_but_not_local_master"
  exit 1
fi
if [[ "${commits_local_but_not_remote_source}" != "" ]] ; then
  echo "commits_local_but_not_remote_source"
  exit 1
fi
if [[ "${commits_remote_but_not_local_source}" != "" ]] ; then
  echo "commits_remote_but_not_local_source"
  exit 1
fi

git checkout "source"
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