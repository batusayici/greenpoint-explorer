# Ingest fetch moves to GitHub Actions

Date: 2026-09-08. Owner: Batu. Status: approved 2026-09-08 and implemented on branch feat/ingest-fetch-on-actions; amended the same day after the runner measurement — see "Amendment" at the end.

## The problem

The daily ingest runs inside a claude.ai cloud sandbox whose outbound proxy has now broken the
fetch three separate ways since July: the network preset silently reverted to Trusted (07-27),
the sandbox image shipped a Chromium older than Playwright's (07-28), and since 08-05 the proxy
refuses the tunnel that headless Chromium and Firefox open while plain fetch and curl through the
same proxy work fine. Anthropic has not answered the third one. Last night's push added eight
sources that need a browser, and today 14 of 78 sources came back empty (18%, ceiling 15%), so
the run halted after expiry and added nothing. It will do that every day until something changes.

Every fix that stays inside the sandbox stays hostage to the next change to it.

## The goal

Every roster source is read every day, on infrastructure we control, with no per-host allowlist
step at claude.ai. The Claude routine keeps doing the judgment work (diffing, extraction, triage,
PRs, shipping). It stops doing the fetching.

Not in scope: fixing the sandbox proxy itself, the one-hour tunnel probe (worth doing only to
sharpen the bug report), Gmail, geocoding, one-off lookups the routine makes while resolving a
held card (those are plain fetches and still work).

## The design

Three parts. The fetch script is shared by all of them; nothing forks.

### 1. A scheduled workflow fetches the roster

`.github/workflows/ingest-fetch.yml`, in this repo:

- Runs daily at 11:30 UTC (7:30am New York), an hour before the daily routine, and on manual
  dispatch. Cron on GitHub can slip by up to an hour at busy times; the buffer plus the stale
  check below cover that.
- Ubuntu runner, Node 24, `npm ci`, `npx playwright install --with-deps chromium firefox`, then
  `npm run ingest:fetch -- --include-monthly`. No proxy exists on the runner, so the proxy
  guard and the tunnel diagnosis are inert, and plain fetch, Chromium and Firefox all reach the
  open internet. Monthly sources are fetched every day because a free runner has no reason to
  skip them; the routine still decides which sources are in play (see part 3).
- Whatever the exit code, a final step publishes the result (part 2). A run that tripped the
  15% ceiling publishes its report too, so the routine halts on the same evidence it would have
  produced itself.
- Workflow permissions: `contents: read` on this repo. The repo's Actions default is already
  read-only. The runner reads untrusted pages, so it must never hold anything that can reach
  `main`, which deploys production.

### 2. Snapshots land in a small public repo

`batusayici/stoopwise-snapshots` (name open), public, one commit per run:

```
manifest.json        fetchedAt, includeMonthly, roster hash, product commit, error count
fetch-report.json    the runner's changes.json: per-source status, method, error text
snapshots/<id>.txt   the fetched text of every source that was read
```

The runner pushes with a deploy key that has write access to that repo and nothing else. The
private half lives as an Actions secret on this repo; the public half is the deploy key on the
snapshots repo. Two manual steps for Batu: create the repo, add the key.

Why a separate repo and not artifacts or a branch here: workflow artifacts download from Azure
blob hosts with changing names, which the sandbox's allowlist would have to admit, and they
expire. A branch in this repo would hand the runner write access to a repo whose `main` is
production, with no branch protection in place today. A separate public repo needs no new
allowlisted host (the routine already talks to github.com to push), gives a full history of what
every source said on every day, and keeps the runner's only credential away from the product.
The content is text of public pages this repo already commits as ingested baselines.

### 3. The routine pulls snapshots and diffs offline

Two commands replace step 2 of the ingest skill:

```
npm run ingest:pull                      # scripts/pull-snapshots.mjs
npm run ingest:fetch -- --offline        # existing script, new mode
```

`ingest:pull` clones the snapshots repo shallowly, then refuses to continue (exit 1, the same
roster-unreadable contract as the ceiling) if `fetchedAt` is older than six hours. `--allow-stale`
overrides that and stays visible in the command, like `--allow-degraded` does today. It copies
`snapshots/<id>.txt` and `fetch-report.json` into `.ingest-cache/`. If the roster hash in the
manifest differs from the current `ingest-sources.json`, it says so: sources added since the
fetch will count as errors this run, and the fix is to dispatch the workflow again.

`--offline` makes the fetch script skip the network entirely. For each selected source it reads
`.ingest-cache/<id>.txt` where the runner wrote one, and where the runner recorded an error it
throws that same error text. Everything downstream is unchanged and shared: hashing, the diff
against the tracked `*.ingested.txt` baselines, carry-forward of persisted evidence blocks,
`state.json`, `changes.json`, the reach ceiling and the exit code. `--include-monthly`, `--only`
and `--mark-ingested` keep their meaning. Diffing on the routine's side rather than the runner's
is deliberate: the baselines can move between the two runs (a PR merged mid-morning), and the
routine's checkout is the truth the diff must be against.

Local interactive runs keep fetching live with `npm run ingest:fetch` exactly as today.

Optional upgrade, not required for the switch: the routine dispatches the workflow itself
(`gh workflow run` then `gh run watch`) so there is no schedule to drift. It depends on the
routine's GitHub token having Actions write scope, which the first cloud run will tell us.

## Failure modes

| What breaks | What the routine sees | Outcome |
|---|---|---|
| Workflow didn't run or ran late | `fetchedAt` older than 6h | halt, nothing ingested, expiry still ran |
| Runner tripped the 15% ceiling | same errors in `fetch-report.json` | halt on the same rule as today |
| Snapshots repo unreachable from the sandbox | `ingest:pull` exits 1 | halt |
| Roster changed after the fetch | warning naming the new sources | they count as errors; re-dispatch |
| Deploy key revoked | workflow fails at publish | stale on the next pull; halt |

Halting is always the fallback, never a thin run that looks quiet.

## The runner IP risk, measured before switching

GitHub-hosted runners come from Azure ranges that bot filters treat harshly. Before the routine
switches over, the workflow runs once by hand from the feature branch and its error set is
compared with the same day's local run. Rule: switch only if the runner's errors are a subset of
the local run's, or every extra one has been moved to its feed or JSON endpoint. A source that
only fails on the runner is a roster change for its own PR, not a reason to keep fetching in the
sandbox.

## Tests

- `pull-snapshots`: stale manifest halts; `--allow-stale` proceeds; roster hash mismatch warns
  and lists the missing sources; a source missing from the bundle becomes an error entry.
- `--offline`: with the same snapshot text, `changes.json` is byte-identical to what the online
  path writes; a runner-recorded error surfaces as `status: error` with the runner's message;
  the reach ceiling and exit code behave as online.
- Workflow: one manual dispatch from the branch, report published, error set compared.
- End to end: one cloud routine run on the new path, PR body naming the snapshot commit it read.

## What this retires

- The claude.ai per-host allowlist step for roster sources. The environment still needs
  github.com, Nominatim, and whatever one-off lookups touch.
- The exact Playwright pin to the sandbox's stale Chromium, once the sandbox no longer launches a
  browser for the ingest.
- The deferred fetch-relay decision (DECISION_LOG 2026-08-30): the runner is the relay, and the
  roster PR is the single gate it asked for.

## Interim

No stopgap change to the ceiling. Excluding browser errors from it would reopen the second gate
the 2026-08-05 decision removed, and protecting cards whose source was unreadable would contradict
Batu's 2026-08-30 rule that an unreadable source deletes on the second flagged run. If tomorrow's
run arrives before this ships, it halts as today did, which is the safe outcome; `--allow-degraded`
remains the knowing override.

## Amendment (2026-09-08, after the runner measurement)

The dry run read 80 of 91 sources from a GitHub-hosted runner; eight fail only there because
Cloudflare and Imperva challenge GitHub's Azure addresses (hisawyer ×2, union.fit, Sunshine
Laundromat, GrowNYC, Leaves, Happy Medium, NYC Parks). The switch-over rule in "The runner IP risk"
was therefore not met as written, and Batu approved this shape instead: GitHub stays the daily fetcher
at 6:30am New York; a launchd job on Batu's Mac (`scripts/home-fetch.sh`, `scripts/home-fetch.plist`)
fetches the whole roster again at 7:15 from home and publishes over it; the manifest records
`fetcher`, and GitHub yields to a home bundle younger than three hours. The routine pulls whichever
landed. Follow-ups agreed: probe the JSON endpoints behind the three portal schedule pages in the next
roster PR; an always-on home box replaces the laptop for whatever remains. Decision log entry of the
same date has the reasoning.
