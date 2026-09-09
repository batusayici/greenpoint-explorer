#!/bin/bash
# The home Mac's copy of the ingest fetch (2026-09-08): same script as the
# GitHub runner, from a residential address that the Cloudflare/Imperva-fronted
# sources accept. Runs from its own clone so it never touches Batu's working
# tree. Installed by scripts/home-fetch.plist; secrets in
# ~/.config/stoopwise/fetch.env (TROOST_CALENDAR_API_KEY, SNAPSHOTS_DEPLOY_KEY_PATH).
set -euo pipefail
WORK="${STOOPWISE_FETCH_HOME:-$HOME/.stoopwise-fetch}"
PRODUCT="$WORK/greenpoint-explorer"
SNAPS="$WORK/stoopwise-snapshots"
LOG="$WORK/home-fetch.log"
mkdir -p "$WORK"
exec >>"$LOG" 2>&1
echo "=== home-fetch $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
# shellcheck disable=SC1090
# set -a exports everything the env file defines; sourced alone, the
# variables stay shell-local and the fetch never sees the Troost key
# (2026-09-09, first home run).
set -a
[ -f "$HOME/.config/stoopwise/fetch.env" ] && . "$HOME/.config/stoopwise/fetch.env"
set +a
export GIT_SSH_COMMAND="ssh -i ${SNAPSHOTS_DEPLOY_KEY_PATH:-$HOME/.ssh/stoopwise-snapshots} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

if [ ! -d "$PRODUCT/.git" ]; then git clone --quiet https://github.com/batusayici/greenpoint-explorer.git "$PRODUCT"; fi
git -C "$PRODUCT" fetch --quiet origin main
git -C "$PRODUCT" reset --quiet --hard origin/main
(
  cd "$PRODUCT"
  npm ci --silent
  npx playwright install chromium firefox >/dev/null
)
# Fetch from a cold cache, the way the GitHub runner always does: it is a fresh
# checkout, so it never carries forward `## [` evidence blocks or a previous
# report, and a warm cache here would make the two fetchers publish different
# text for the same page — and let a crashed run's report ship as today's. The
# tracked *.ingested.txt baselines stay; they are the diff's other side.
if [ -d "$PRODUCT/.ingest-cache" ]; then
  find "$PRODUCT/.ingest-cache" -mindepth 1 -maxdepth 1 ! -name '*.ingested.txt' -exec rm -rf {} +
fi
set +e
(cd "$PRODUCT" && npm run -s ingest:fetch -- --include-monthly)
FETCH_EXIT=$?
set -e
if [ "$FETCH_EXIT" -ne 0 ]; then
  echo "ingest:fetch exited $FETCH_EXIT — over the 15% ceiling, or the run crashed; publishing whatever report exists so the routine halts on the same evidence"
fi

if [ ! -d "$SNAPS/.git" ]; then git clone --quiet git@github.com:batusayici/stoopwise-snapshots.git "$SNAPS"; fi
git -C "$SNAPS" fetch --quiet origin
git -C "$SNAPS" reset --quiet --hard origin/HEAD
(
  cd "$PRODUCT"
  npm run -s ingest:publish -- --to "$SNAPS" --fetcher home
)
cd "$SNAPS"
git add -A
if git diff --cached --quiet; then
  echo "nothing changed since the last fetch"
else
  git -c user.name=home-fetch -c user.email=home-fetch@users.noreply.github.com commit --quiet -m "fetch $(date -u +%Y-%m-%dT%H:%M:%SZ) from home"
  git push --quiet origin HEAD
fi
echo "done $(date -u +%Y-%m-%dT%H:%M:%SZ)"
