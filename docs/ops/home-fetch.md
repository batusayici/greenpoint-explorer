# Installing the home fetch

The daily ingest no longer fetches from inside the claude.ai sandbox. Two machines read the
source roster every morning and publish what they read to a small public repo,
`batusayici/stoopwise-snapshots`; the routine pulls that bundle at 8:30 and diffs it.

- **GitHub Actions** (`.github/workflows/ingest-fetch.yml`) runs at **6:30 local** and reads most
  of the roster.
- **This job on Batu's Mac** (`scripts/home-fetch.sh`, installed by `scripts/home-fetch.plist`)
  runs at **7:15 local** — after GitHub, before the routine — and publishes over GitHub's bundle.
  It exists because Cloudflare and Imperva challenge GitHub's datacenter addresses on eight
  sources that a residential address reads fine (measured 2026-09-08, see `docs/DECISION_LOG.md`).

It only runs while Batu is logged in to the Mac, which is the whole weakness: a laptop that is
asleep or shut publishes nothing. A small always-on box at home is the intended replacement.

Everything below is paste-ready, in order. Steps (a)–(c) are one-time account setup; (d)–(f)
install the job; (g) proves it works.

## (a) Create the snapshots repo

```bash
gh repo create batusayici/stoopwise-snapshots --public --add-readme \
  --description "Daily fetch snapshots for the Stoopwise Greenpoint ingest"
```

Public on purpose: it holds fetched public pages, nothing private, and a public repo needs no
token to clone from the sandbox.

## (b) Two deploy keys — one per fetcher

Each fetcher gets its own write key to the snapshots repo, so either can be revoked alone.
Neither key can write the product repo.

GitHub Actions' key:

```bash
ssh-keygen -t ed25519 -N "" -C "ingest-fetch (actions)" -f /tmp/snapshots-actions
gh repo deploy-key add /tmp/snapshots-actions.pub --repo batusayici/stoopwise-snapshots \
  --title "ingest-fetch (write)" --allow-write
gh secret set SNAPSHOTS_DEPLOY_KEY --repo batusayici/greenpoint-explorer < /tmp/snapshots-actions
rm -f /tmp/snapshots-actions /tmp/snapshots-actions.pub
```

The Mac's key — this one stays on disk, because the launchd job reads it every morning:

```bash
ssh-keygen -t ed25519 -N "" -C "home-fetch (mac)" -f ~/.ssh/stoopwise-snapshots
chmod 600 ~/.ssh/stoopwise-snapshots
gh repo deploy-key add ~/.ssh/stoopwise-snapshots.pub --repo batusayici/stoopwise-snapshots \
  --title "home-fetch (write)" --allow-write
```

## (c) The one API key the fetch needs

Troost's calendar needs a key; every other source is an open page. Paste the value from the
existing routine's environment when prompted:

```bash
gh secret set TROOST_CALENDAR_API_KEY --repo batusayici/greenpoint-explorer
```

## (d) The Mac's environment file

The launchd job starts with no shell profile, so its secrets live in a file it reads itself.
Replace `…` with the same Troost key:

```bash
mkdir -p ~/.config/stoopwise && \
printf 'TROOST_CALENDAR_API_KEY=…\nSNAPSHOTS_DEPLOY_KEY_PATH=%s/.ssh/stoopwise-snapshots\n' "$HOME" \
  > ~/.config/stoopwise/fetch.env && \
chmod 600 ~/.config/stoopwise/fetch.env
```

## (e) The job's own clone

The job never touches Batu's working tree — it fetches from its own checkout, which it keeps on
`main` itself after this first clone:

```bash
mkdir -p ~/.stoopwise-fetch && \
git clone https://github.com/batusayici/greenpoint-explorer.git ~/.stoopwise-fetch/greenpoint-explorer
```

## (f) Install the launchd job

```bash
cp ~/.stoopwise-fetch/greenpoint-explorer/scripts/home-fetch.plist \
  ~/Library/LaunchAgents/com.stoopwise.home-fetch.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.stoopwise.home-fetch.plist
```

## (g) Run it once by hand

The first run installs npm packages and Playwright browsers, so give it a few minutes:

```bash
launchctl kickstart -k gui/$(id -u)/com.stoopwise.home-fetch
tail -20 ~/.stoopwise-fetch/home-fetch.log
gh api repos/batusayici/stoopwise-snapshots/commits --jq '.[0].commit.message'
```

The last command should print a `fetch … from home` commit. If it prints a `from <sha>` commit
instead, GitHub's run is still the newest one and the home run did not publish — the log says
why.

## Stopping it, and what a missed morning looks like

```bash
launchctl bootout gui/$(id -u)/com.stoopwise.home-fetch
```

If the Mac was asleep at 7:15, launchd fires the run once at wake; if it never woke before 8:30,
the routine simply uses GitHub's bundle. That reads as: the routine's bundle line says
`by github`, and the eight residential-only sources come through as `runner:` errors (about 9%
of the roster, under the 15% ceiling). That is the known floor, not a new failure — the fix is
to dispatch `ingest-fetch` again only if those sources matter that day.
