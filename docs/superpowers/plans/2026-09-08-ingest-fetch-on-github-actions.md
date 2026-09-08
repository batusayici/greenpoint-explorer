# Ingest Fetch on GitHub Actions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The roster is fetched daily by a GitHub Actions workflow on a plain Ubuntu runner and published to a small public snapshots repo; the Claude routine pulls that bundle and runs the existing fetch script offline, so the sandbox proxy is no longer in the fetch path.

**Architecture:** One shared script, `scripts/fetch-sources.mjs`, gains an `--offline` mode that reads a pulled bundle instead of the network and leaves every downstream step (hash, diff, carry-forward, ceiling, exit code) untouched. Two small scripts move files in and out of the bundle: `publish-snapshots.mjs` (runner side) and `pull-snapshots.mjs` (routine side). The pure decisions — roster hash, manifest, staleness, per-source offline resolution — live in `src/demand-test/snapshotBundle.js` with a sibling test, because `scripts/` is outside the test glob (the 2026-08-10 lesson).

**Tech Stack:** Node 24 (runner) / Node 25 (local), `node --test`, GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`), Playwright 1.56.0 (Chromium + Firefox), git over SSH with a deploy key.

Spec: `docs/superpowers/specs/2026-09-08-ingest-fetch-on-github-actions-design.md`.

## Global Constraints

- The runner holds **no credential that can write this repo**: workflow `permissions: contents: read`; the only secret is `SNAPSHOTS_DEPLOY_KEY`, a deploy key on the snapshots repo.
- Snapshots repo: `batusayici/stoopwise-snapshots`, public. Bundle layout: `manifest.json`, `fetch-report.json`, `snapshots/<id>.txt`.
- Stale limit: a bundle whose `fetchedAt` is older than **6 hours** halts the routine (exit 1). `--allow-stale` overrides and stays visible in the command.
- Workflow schedule: `30 11 * * *` UTC (7:30am New York). The runner always passes `--include-monthly`; the routine selects.
- Halting is always the fallback. No change to the 15% ceiling, no exemption for unreadable sources.
- Every commit ends with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- `npm test` must stay green (739 passing today). Run `git status --short` before editing; report unrelated dirty files.
- Never push `main`. Work on branch `feat/ingest-fetch-on-actions`; branch pushes are fine (Vercel preview only).
- Plain language in every commit message, PR body and log entry (CLAUDE.md communication rule).

---

### Task 0: Branch

**Files:** none.

- [ ] **Step 1: Create the branch from current main**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git status --short && git checkout -b feat/ingest-fetch-on-actions main
```

Expected: clean status (the spec commit `28d5684` is already on main locally), new branch checked out.

---

### Task 1: Pure bundle logic

**Files:**
- Create: `src/demand-test/snapshotBundle.js`
- Test: `src/demand-test/snapshotBundle.test.mjs`

**Interfaces:**
- Produces:
  - `rosterHash(sources: Array<{id,url,fetch?}>) → string` (16 hex chars; ignores notes and other fields, so a note edit does not warn)
  - `buildManifest({ now?: Date, includeMonthly: boolean, rosterHash: string, productCommit: string|null, report: {sources: Array} }) → { fetchedAt, includeMonthly, rosterHash, productCommit, sourceCount, errorCount }`
  - `assessBundle({ manifest, rosterHash, now?: Date, maxAgeHours?: number }) → { ok, stale, ageHours, rosterMismatch, reasons: string[] }` — `ok` is false only for stale/missing `fetchedAt`; a roster mismatch is a warning, not a halt.
  - `resolveOfflineSource(src, reportEntry, hasSnapshot) → { kind: "text", method } | { kind: "error", message }`

- [ ] **Step 1: Write the failing tests**

```js
// src/demand-test/snapshotBundle.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { rosterHash, buildManifest, assessBundle, resolveOfflineSource } from "./snapshotBundle.js";

// The fetch moved off the sandbox proxy on 2026-09-08 (spec in docs/superpowers/specs).
// These are the decisions the pull and offline paths make; the scripts only move files.

const SOURCES = [
  { id: "b", url: "https://b.example/", fetch: "browser", notes: "x" },
  { id: "a", url: "https://a.example/feed/", fetch: "feed" },
];

test("rosterHash ignores notes and order, changes on id/url/fetch", () => {
  const h = rosterHash(SOURCES);
  assert.equal(h.length, 16);
  assert.equal(rosterHash([...SOURCES].reverse()), h);
  assert.equal(rosterHash(SOURCES.map((s) => ({ ...s, notes: "different" }))), h);
  assert.notEqual(rosterHash([...SOURCES, { id: "c", url: "https://c.example/" }]), h);
  assert.notEqual(rosterHash(SOURCES.map((s) => (s.id === "a" ? { ...s, fetch: "json" } : s))), h);
});

test("buildManifest counts sources and errors from the runner report", () => {
  const now = new Date("2026-09-09T11:40:00Z");
  const m = buildManifest({
    now,
    includeMonthly: true,
    rosterHash: "abc",
    productCommit: "d431329",
    report: { sources: [{ status: "changed" }, { status: "error" }, { status: "unchanged" }] },
  });
  assert.deepEqual(m, {
    fetchedAt: "2026-09-09T11:40:00.000Z",
    includeMonthly: true,
    rosterHash: "abc",
    productCommit: "d431329",
    sourceCount: 3,
    errorCount: 1,
  });
});

test("assessBundle: fresh and matching is ok", () => {
  const a = assessBundle({
    manifest: { fetchedAt: "2026-09-09T11:40:00Z", rosterHash: "abc" },
    rosterHash: "abc",
    now: new Date("2026-09-09T13:00:00Z"),
  });
  assert.equal(a.ok, true);
  assert.equal(a.stale, false);
  assert.equal(a.rosterMismatch, false);
  assert.deepEqual(a.reasons, []);
});

test("assessBundle: older than the limit halts, with the age in the reason", () => {
  const a = assessBundle({
    manifest: { fetchedAt: "2026-09-08T11:40:00Z", rosterHash: "abc" },
    rosterHash: "abc",
    now: new Date("2026-09-09T13:00:00Z"),
  });
  assert.equal(a.ok, false);
  assert.equal(a.stale, true);
  assert.match(a.reasons[0], /25\.3h old \(limit 6h\)/);
});

test("assessBundle: missing fetchedAt halts", () => {
  const a = assessBundle({ manifest: {}, rosterHash: "abc", now: new Date() });
  assert.equal(a.ok, false);
  assert.match(a.reasons[0], /fetchedAt/);
});

test("assessBundle: a roster mismatch is a warning, not a halt", () => {
  const a = assessBundle({
    manifest: { fetchedAt: "2026-09-09T11:40:00Z", rosterHash: "old" },
    rosterHash: "new",
    now: new Date("2026-09-09T12:00:00Z"),
  });
  assert.equal(a.ok, true);
  assert.equal(a.rosterMismatch, true);
});

test("resolveOfflineSource: a read source with a snapshot yields its method", () => {
  const r = resolveOfflineSource({ id: "a" }, { id: "a", status: "changed", method: "feed" }, true);
  assert.deepEqual(r, { kind: "text", method: "feed" });
});

test("resolveOfflineSource: a runner error is surfaced verbatim, prefixed", () => {
  const r = resolveOfflineSource({ id: "a" }, { id: "a", status: "error", error: "HTTP 403" }, false);
  assert.equal(r.kind, "error");
  assert.equal(r.message, "runner: HTTP 403");
});

test("resolveOfflineSource: absent from the report means the roster moved after the fetch", () => {
  const r = resolveOfflineSource({ id: "zzz" }, undefined, false);
  assert.equal(r.kind, "error");
  assert.match(r.message, /not in the runner's fetch report/);
  assert.match(r.message, /re-dispatch/);
});

test("resolveOfflineSource: a read without a snapshot file is an error", () => {
  const r = resolveOfflineSource({ id: "a" }, { id: "a", status: "unchanged", method: "plain" }, false);
  assert.equal(r.kind, "error");
  assert.match(r.message, /no snapshot/);
});

test("resolveOfflineSource: a runner-skipped monthly source is an error naming the fix", () => {
  const r = resolveOfflineSource({ id: "a" }, { id: "a", status: "skipped_monthly" }, false);
  assert.equal(r.kind, "error");
  assert.match(r.message, /include_monthly/);
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && TZ=America/New_York node --test src/demand-test/snapshotBundle.test.mjs 2>&1 | tail -5
```

Expected: fails with `Cannot find module './snapshotBundle.js'`.

- [ ] **Step 3: Write the module**

```js
// src/demand-test/snapshotBundle.js
// The ingest's fetch runs on a GitHub Actions runner since 2026-09-08 and hands
// the routine a bundle: manifest.json, fetch-report.json, snapshots/<id>.txt.
// Everything that decides whether a bundle is usable lives here, tested, so the
// two scripts that move files (publish-snapshots.mjs, pull-snapshots.mjs) and
// the --offline mode of fetch-sources.mjs carry no judgment of their own.
import { createHash } from "node:crypto";

// Identity of the roster as the runner saw it: id, url and fetch strategy per
// source, order-free. Notes and per-source config are deliberately excluded —
// editing a note must not make the routine think the runner read a different
// roster.
export function rosterHash(sources) {
  const lines = sources.map((s) => `${s.id}\t${s.url}\t${s.fetch ?? "auto"}`).sort();
  return createHash("sha256").update(lines.join("\n")).digest("hex").slice(0, 16);
}

export function buildManifest({ now = new Date(), includeMonthly, rosterHash, productCommit, report }) {
  const sources = Array.isArray(report?.sources) ? report.sources : [];
  return {
    fetchedAt: now.toISOString(),
    includeMonthly: !!includeMonthly,
    rosterHash,
    productCommit: productCommit ?? null,
    sourceCount: sources.length,
    errorCount: sources.filter((s) => s.status === "error").length,
  };
}

// Stale halts (exit 1 upstream, the same roster-unreadable contract as the 15%
// ceiling). A roster mismatch only warns: the sources added since the fetch
// surface as errors one by one through resolveOfflineSource, which is the
// honest count, and the fix is to dispatch the workflow again.
export function assessBundle({ manifest, rosterHash, now = new Date(), maxAgeHours = 6 }) {
  const reasons = [];
  const fetchedAt = manifest?.fetchedAt ? new Date(manifest.fetchedAt) : null;
  const ageHours = fetchedAt && !Number.isNaN(fetchedAt.getTime()) ? (now - fetchedAt) / 36e5 : Infinity;
  if (ageHours === Infinity) reasons.push("manifest has no usable fetchedAt");
  const stale = ageHours > maxAgeHours;
  if (stale && ageHours !== Infinity) reasons.push(`snapshots are ${ageHours.toFixed(1)}h old (limit ${maxAgeHours}h)`);
  const rosterMismatch = !!rosterHash && manifest?.rosterHash !== rosterHash;
  return { ok: reasons.length === 0, stale, ageHours, rosterMismatch, reasons };
}

// What --offline does for one roster source, given the runner's report entry
// for it and whether its snapshot file arrived in the bundle.
export function resolveOfflineSource(src, reportEntry, hasSnapshot) {
  if (!reportEntry) {
    return {
      kind: "error",
      message: `not in the runner's fetch report — added to the roster after the fetch? re-dispatch ingest-fetch`,
    };
  }
  if (reportEntry.status === "error") return { kind: "error", message: `runner: ${reportEntry.error}` };
  if (reportEntry.status === "skipped_monthly") {
    return { kind: "error", message: "runner skipped this monthly source — dispatch ingest-fetch with include_monthly" };
  }
  if (!hasSnapshot) return { kind: "error", message: "runner reported a read but the bundle has no snapshot for it" };
  return { kind: "text", method: reportEntry.method };
}
```

- [ ] **Step 4: Run to verify it passes, then the whole suite**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && TZ=America/New_York node --test src/demand-test/snapshotBundle.test.mjs 2>&1 | tail -4 && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'
```

Expected: 11 pass, 0 fail; suite reports `tests 750`, `fail 0`.

- [ ] **Step 5: Commit**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git add src/demand-test/snapshotBundle.js src/demand-test/snapshotBundle.test.mjs && git commit -q -m "ingest: the decisions a fetched-elsewhere bundle needs, tested

Roster identity, manifest shape, the six-hour stale rule and what --offline does
per source. Scripts only move files; this is the part that can be wrong.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

---

### Task 2: Publish script (runner side)

**Files:**
- Create: `scripts/publish-snapshots.mjs`
- Modify: `package.json` (scripts)

**Interfaces:**
- Consumes: `rosterHash`, `buildManifest` from Task 1; `.ingest-cache/changes.json` and `.ingest-cache/<id>.txt` as written by `fetch-sources.mjs`.
- Produces: a bundle directory `<to>/manifest.json`, `<to>/fetch-report.json`, `<to>/snapshots/<id>.txt` (one file per source whose report entry carries `textPath`). Removes snapshot files in `<to>/snapshots/` that no current source owns, so a retired source does not linger.

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
// Copy the result of a fetch-sources.mjs run into a bundle directory (a
// checkout of the snapshots repo). Runs on the GitHub Actions runner after
// `npm run ingest:fetch`; the workflow commits and pushes what this writes.
//
// Usage: node scripts/publish-snapshots.mjs --to <dir> [--include-monthly]
//
// Writes:  <dir>/manifest.json      fetchedAt, roster hash, product commit, counts
//          <dir>/fetch-report.json  changes.json as the runner produced it
//          <dir>/snapshots/<id>.txt one per source the runner read
// The routine re-derives statuses and diffs against its own baselines
// (fetch-sources.mjs --offline), so the report's statuses are informational
// and the snapshot text is what matters.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { rosterHash, buildManifest } from "../src/demand-test/snapshotBundle.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = join(ROOT, ".ingest-cache");
const args = process.argv.slice(2);
const toIdx = args.indexOf("--to");
if (toIdx === -1 || !args[toIdx + 1]) {
  console.error("usage: publish-snapshots.mjs --to <dir> [--include-monthly]");
  process.exit(2);
}
const TO = args[toIdx + 1];
const INCLUDE_MONTHLY = args.includes("--include-monthly");

const reportPath = join(CACHE_DIR, "changes.json");
if (!existsSync(reportPath)) {
  console.error(`no ${reportPath} — run npm run ingest:fetch first`);
  process.exit(1);
}
const report = JSON.parse(readFileSync(reportPath, "utf8"));
const { sources } = JSON.parse(readFileSync(join(ROOT, "src/data/demand-test/ingest-sources.json"), "utf8"));

let productCommit = process.env.GITHUB_SHA ?? null;
if (!productCommit) {
  try {
    productCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    productCommit = null;
  }
}

const snapDir = join(TO, "snapshots");
mkdirSync(snapDir, { recursive: true });

const owned = new Set();
let copied = 0;
for (const entry of report.sources ?? []) {
  if (!entry.textPath) continue;
  const from = join(ROOT, entry.textPath);
  if (!existsSync(from)) continue;
  copyFileSync(from, join(snapDir, `${entry.id}.txt`));
  owned.add(`${entry.id}.txt`);
  copied++;
}
let removed = 0;
for (const f of readdirSync(snapDir)) {
  if (f.endsWith(".txt") && !owned.has(f)) {
    unlinkSync(join(snapDir, f));
    removed++;
  }
}

const manifest = buildManifest({
  includeMonthly: INCLUDE_MONTHLY,
  rosterHash: rosterHash(sources),
  productCommit,
  report,
});
writeFileSync(join(TO, "fetch-report.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(join(TO, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `published ${copied} snapshot(s) to ${TO} (${removed} stale file(s) removed); ` +
    `${manifest.errorCount} of ${manifest.sourceCount} sources errored; roster ${manifest.rosterHash}; product ${manifest.productCommit}`,
);
```

- [ ] **Step 2: Add the npm script**

In `package.json` `scripts`, after `"ingest:fetch"`, add:

```json
"ingest:publish": "node scripts/publish-snapshots.mjs",
```

- [ ] **Step 3: Verify against the local cache**

The local `.ingest-cache/` holds today's snapshots and `changes.json`, so this runs without a fetch:

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && rm -rf /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/bundle && npm run -s ingest:publish -- --to /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/bundle && ls /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/bundle && cat /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/bundle/manifest.json
```

Expected: `published N snapshot(s)…`, the three entries `fetch-report.json manifest.json snapshots`, and a manifest with `fetchedAt`, a 16-char `rosterHash`, the local HEAD as `productCommit`.

- [ ] **Step 4: Commit**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git add scripts/publish-snapshots.mjs package.json && git commit -q -m "ingest: publish a fetch run as a bundle the routine can pull

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

---

### Task 3: The workflow

**Files:**
- Create: `.github/workflows/ingest-fetch.yml`

**Interfaces:**
- Consumes: `npm run ingest:fetch`, `npm run ingest:publish` (Task 2).
- Produces: a workflow named `ingest-fetch` with a `workflow_dispatch` trigger; always uploads `.ingest-cache/changes.json` as artifact `fetch-report`; pushes a bundle to the snapshots repo when the secret `SNAPSHOTS_DEPLOY_KEY` exists; the job is red when the fetch tripped the ceiling, but only after publishing.

- [ ] **Step 1: Write the workflow**

```yaml
# Fetch every ingest source on a plain runner and publish the snapshots, so the
# Claude routine never fetches through the cloud sandbox's proxy again
# (spec: docs/superpowers/specs/2026-09-08-ingest-fetch-on-github-actions-design.md).
#
# This job reads untrusted web pages. It must never hold a credential that can
# write this repo: contents is read-only, and the only secret is a deploy key
# scoped to the snapshots repo. The repo's Actions default is read-only too.
name: ingest-fetch

on:
  schedule:
    - cron: "30 11 * * *" # 7:30am New York, an hour before the daily routine
  workflow_dispatch: {}

permissions:
  contents: read

concurrency:
  group: ingest-fetch
  cancel-in-progress: false

jobs:
  fetch:
    runs-on: ubuntu-latest
    timeout-minutes: 40
    env:
      # A secret cannot be tested in a step `if:` directly; surface its presence here.
      HAS_KEY: ${{ secrets.SNAPSHOTS_DEPLOY_KEY != '' }}
      SNAPSHOTS_REPO: git@github.com:batusayici/stoopwise-snapshots.git
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - run: npm ci

      - run: npx playwright install --with-deps chromium firefox

      # Exit 1 here means the roster was not readable (>15% errored). The
      # report still has to be published so the routine halts on the same
      # evidence, so do not fail the job yet.
      - id: fetch
        run: npm run ingest:fetch -- --include-monthly
        continue-on-error: true

      # Always available, key or no key — this is what the dry run compares.
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: fetch-report
          path: .ingest-cache/changes.json
          retention-days: 14

      - name: Publish the bundle to the snapshots repo
        if: env.HAS_KEY == 'true'
        env:
          DEPLOY_KEY: ${{ secrets.SNAPSHOTS_DEPLOY_KEY }}
        run: |
          set -euo pipefail
          mkdir -p ~/.ssh
          printf '%s\n' "$DEPLOY_KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts
          git clone --depth 1 "$SNAPSHOTS_REPO" "$RUNNER_TEMP/snapshots"
          npm run -s ingest:publish -- --to "$RUNNER_TEMP/snapshots" --include-monthly
          cd "$RUNNER_TEMP/snapshots"
          git config user.name "ingest-fetch"
          git config user.email "ingest-fetch@users.noreply.github.com"
          git add -A
          git commit -m "fetch $(date -u +%Y-%m-%dT%H:%M:%SZ) from ${GITHUB_SHA::7}" || echo "nothing changed since the last fetch"
          git push origin HEAD

      - name: Report the roster as unreadable
        if: steps.fetch.outcome == 'failure'
        run: |
          echo "::error::ingest:fetch exited non-zero — the roster was not readable (over the 15% ceiling). The report was still published."
          exit 1
```

- [ ] **Step 2: Lint the YAML locally**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && node -e "const y=require('yaml');y.parse(require('fs').readFileSync('.github/workflows/ingest-fetch.yml','utf8'));console.log('yaml ok')" 2>/dev/null || python3 -c "import yaml,sys;yaml.safe_load(open('.github/workflows/ingest-fetch.yml'));print('yaml ok')"
```

Expected: `yaml ok`. (If neither parser is installed, `npx --yes yaml@2 --help` is not needed; use `python3 -c "import json;..."`-free check: `gh workflow view` after push in Task 4 validates it.)

- [ ] **Step 3: Commit**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git add .github/workflows/ingest-fetch.yml && git commit -q -m "ingest: fetch the roster on GitHub Actions, off the sandbox proxy

Daily at 7:30am New York and on demand. Reads with contents:read only; the one
secret is a deploy key to the snapshots repo. A run over the 15% ceiling still
publishes its report, then goes red.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

---

### Task 4: Measure the runner before switching

This is the spec's rule: switch only if the runner's errors are a subset of the same day's local run, or every extra one is moved to a feed/JSON endpoint in its own roster PR.

**Files:** none in the repo (scratchpad only).

- [ ] **Step 1: Push the branch and dispatch the workflow**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git push -u origin feat/ingest-fetch-on-actions && gh workflow run ingest-fetch.yml --ref feat/ingest-fetch-on-actions && sleep 20 && gh run list --workflow ingest-fetch.yml --limit 1 --json databaseId,status,url --jq '.[0]'
```

Expected: a run id, `status: queued` or `in_progress`, a URL. No deploy key exists yet, so the publish step is skipped; the artifact is what we want.

- [ ] **Step 2: Wait for it and fetch the artifact**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && RUN=$(gh run list --workflow ingest-fetch.yml --limit 1 --json databaseId --jq '.[0].databaseId') && gh run watch "$RUN" --exit-status; echo "exit=$?"; rm -rf /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/runner && gh run download "$RUN" -n fetch-report -D /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/runner && ls /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/runner
```

Expected: the run finishes (green, or red only via the final "unreadable" step), and `changes.json` lands in the scratchpad.

- [ ] **Step 3: Run the same fetch locally for a same-day comparison**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && npm run -s ingest:fetch -- --include-monthly > /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/local-fetch.log 2>&1; echo "exit=$?"; tail -3 /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/local-fetch.log
```

Expected: `reach: N/N sources read (…)`. (The local run has no proxy; it is the reference for "this source is readable from a normal network today".)

- [ ] **Step 4: Compare error sets**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && python3 - <<'EOF'
import json
S='/tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad'
runner=json.load(open(f'{S}/runner/changes.json'))['sources']
local=json.load(open('.ingest-cache/changes.json'))['sources']
re={s['id']:s.get('error') for s in runner if s['status']=='error'}
le={s['id']:s.get('error') for s in local if s['status']=='error'}
print('runner errors',len(re),'| local errors',len(le))
print('runner-only:'); [print(' ',k,'|',v) for k,v in re.items() if k not in le]
print('local-only:'); [print(' ',k,'|',v) for k,v in le.items() if k not in re]
print('methods on runner:', {m:sum(1 for s in runner if s.get('method')==m) for m in ['plain','browser','feed','json','ics','embedded']})
EOF
```

Expected: `runner-only:` is empty, and at least one source shows `method: browser` (proof the browser path works on the runner). If `runner-only` is non-empty, stop and report each one: a source that only fails on the runner needs its feed/JSON endpoint found (SKILL.md step 1 "check the site's own nav" rule) in a separate roster PR before switching, or is accepted as a known loss with Batu's say-so. Do not proceed to Task 8's switch-over until that list is empty or ruled on.

- [ ] **Step 5: Record the measurement**

Append the numbers to the PR body draft in the scratchpad (used in Task 8):

```bash
cat >> /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/pr-body.md <<'EOF'
## Runner measurement (Task 4)

<paste: runner errors N | local errors M; runner-only list or "none"; browser method count>
EOF
```

Fill in the placeholders from Step 4's output before the PR is opened.

---

### Task 5: Pull script (routine side)

**Files:**
- Create: `scripts/pull-snapshots.mjs`
- Modify: `package.json` (scripts)

**Interfaces:**
- Consumes: `rosterHash`, `assessBundle` from Task 1; a bundle as Task 2 writes it.
- Produces: `.ingest-cache/bundle/{manifest.json,fetch-report.json,snapshots/<id>.txt}` — the directory Task 6's `--offline` reads. Exit 0 = usable; exit 1 = stale or unreachable (`--allow-stale` downgrades stale to a warning). `--from <dir>` reads a local bundle directory instead of cloning (test seam, and how a local run can replay a runner bundle). `GL_SNAPSHOTS_REPO` overrides the clone URL.

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
// Bring the runner's fetch bundle into .ingest-cache/bundle/ so
// `fetch-sources.mjs --offline` can diff it. The routine runs this instead of
// fetching (2026-09-08); local interactive runs keep fetching live.
//
// Usage: node scripts/pull-snapshots.mjs [--allow-stale] [--from <dir>]
//   default source: git clone --depth 1 $GL_SNAPSHOTS_REPO
//   --from <dir>  : copy a local bundle instead of cloning (replay / tests)
//
// Exit 1 = the bundle is not usable (stale beyond 6h, unreachable, malformed).
// That composes with the roster-unreadable contract in SKILL.md §0.2: the
// routine stops, expiry has already run, nothing thin ships as a quiet week.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { rosterHash, assessBundle } from "../src/demand-test/snapshotBundle.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = join(ROOT, ".ingest-cache");
const BUNDLE_DIR = join(CACHE_DIR, "bundle");
const REPO = process.env.GL_SNAPSHOTS_REPO || "https://github.com/batusayici/stoopwise-snapshots.git";

const args = process.argv.slice(2);
const ALLOW_STALE = args.includes("--allow-stale");
const fromIdx = args.indexOf("--from");
const FROM = fromIdx !== -1 ? args[fromIdx + 1] : null;

const { sources } = JSON.parse(readFileSync(join(ROOT, "src/data/demand-test/ingest-sources.json"), "utf8"));

rmSync(BUNDLE_DIR, { recursive: true, force: true });
mkdirSync(CACHE_DIR, { recursive: true });

if (FROM) {
  cpSync(FROM, BUNDLE_DIR, { recursive: true });
  console.log(`bundle copied from ${FROM}`);
} else {
  try {
    execFileSync("git", ["clone", "--quiet", "--depth", "1", REPO, BUNDLE_DIR], { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
  } catch (e) {
    console.error(`\n=== SNAPSHOTS UNREACHABLE — could not clone ${REPO} ===`);
    console.error(`  ${String(e.stderr || e.message).trim().split("\n")[0]}`);
    console.error("  The routine cannot read the roster without the runner's bundle. Check the ingest-fetch");
    console.error("  workflow at github.com/batusayici/greenpoint-explorer/actions and that github.com is reachable.");
    process.exit(1);
  }
  const head = execFileSync("git", ["-C", BUNDLE_DIR, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
  console.log(`bundle cloned from ${REPO} @ ${head}`);
}

const manifestPath = join(BUNDLE_DIR, "manifest.json");
if (!existsSync(manifestPath) || !existsSync(join(BUNDLE_DIR, "fetch-report.json"))) {
  console.error("\n=== SNAPSHOTS MALFORMED — no manifest.json / fetch-report.json in the bundle ===");
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const verdict = assessBundle({ manifest, rosterHash: rosterHash(sources) });

console.log(
  `bundle: fetched ${manifest.fetchedAt} (${verdict.ageHours.toFixed(1)}h ago), ` +
    `${manifest.sourceCount} sources, ${manifest.errorCount} errored, product ${String(manifest.productCommit ?? "?").slice(0, 7)}`,
);
if (verdict.rosterMismatch) {
  const inBundle = new Set((JSON.parse(readFileSync(join(BUNDLE_DIR, "fetch-report.json"), "utf8")).sources ?? []).map((s) => s.id));
  const missing = sources.filter((s) => !inBundle.has(s.id)).map((s) => s.id);
  console.warn("\n=== ROSTER CHANGED SINCE THE FETCH ===");
  console.warn(`  The runner read a different roster (${manifest.rosterHash} vs ${rosterHash(sources)} now).`);
  console.warn(`  ${missing.length} source(s) not in the bundle will count as errors: ${missing.join(", ") || "(none — a url or fetch strategy changed)"}`);
  console.warn("  Fix: gh workflow run ingest-fetch.yml, then pull again.\n");
}
if (!verdict.ok) {
  console.error(`\n=== SNAPSHOTS STALE — ${verdict.reasons.join("; ")} ===`);
  if (ALLOW_STALE) {
    console.error("  --allow-stale given: continuing knowingly. Say so in the PR body.\n");
  } else {
    console.error("  Do not ingest from this bundle: the runner did not fetch this morning, so a diff");
    console.error("  against it would read yesterday's roster as today's. Check the ingest-fetch workflow,");
    console.error("  dispatch it (gh workflow run ingest-fetch.yml), and pull again — or pass --allow-stale");
    console.error("  to proceed knowingly.\n");
    process.exit(1);
  }
}
// A marker the --offline mode reads to know the pull was completed, not
// interrupted between clone and verdict.
writeFileSync(join(BUNDLE_DIR, ".pulled"), new Date().toISOString() + "\n");
process.exit(0);
```

- [ ] **Step 2: Add the npm script**

In `package.json` `scripts`, after `"ingest:publish"`, add:

```json
"ingest:pull": "node scripts/pull-snapshots.mjs",
```

- [ ] **Step 3: Verify with a fresh local bundle, then a stale one**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && S=/tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad && rm -rf $S/bundle && npm run -s ingest:publish -- --to $S/bundle --include-monthly >/dev/null && npm run -s ingest:pull -- --from $S/bundle; echo "fresh exit=$?"; ls .ingest-cache/bundle | head; python3 -c "
import json;p='$S/bundle/manifest.json';m=json.load(open(p));m['fetchedAt']='2026-09-01T11:40:00Z';json.dump(m,open(p,'w'))" && npm run -s ingest:pull -- --from $S/bundle; echo "stale exit=$?"; npm run -s ingest:pull -- --from $S/bundle --allow-stale; echo "allow-stale exit=$?"
```

Expected: `fresh exit=0` with a `bundle:` line and `.pulled` present; `stale exit=1` with the `SNAPSHOTS STALE` block; `allow-stale exit=0`.

- [ ] **Step 4: Commit**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git add scripts/pull-snapshots.mjs package.json && git commit -q -m "ingest: pull the runner's bundle, and refuse one older than six hours

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

---

### Task 6: `--offline` in the fetch script

**Files:**
- Modify: `scripts/fetch-sources.mjs` — header usage comment (lines 7–9), flag block (lines 63–75), browser preflight guard (line 723), the per-source loop (lines 750–762), the denial probe (line 826), and the `changes.json` write (lines 843–855).

**Interfaces:**
- Consumes: `.ingest-cache/bundle/` as Task 5 leaves it; `resolveOfflineSource` from Task 1.
- Produces: identical `state.json`, `changes.json`, `<id>.txt`, `<id>.diff.txt` and exit behaviour to the online path, plus `changes.json.offline = { fetchedAt, productCommit, pulledAt }`.

- [ ] **Step 1: Usage comment and flag**

Replace lines 7–9:

```js
// Usage: node scripts/fetch-sources.mjs [--only id,id] [--include-monthly] [--force]
//                                       [--no-browser] [--allow-degraded]
//        node scripts/fetch-sources.mjs --offline [--only id,id] [--include-monthly] [--force] [--allow-degraded]
//        node scripts/fetch-sources.mjs --mark-ingested [--only id,id]
//
// --offline (2026-09-08): read .ingest-cache/bundle/ — the runner's fetch,
// brought in by `npm run ingest:pull` — instead of the network. The cloud
// routine runs this way because the sandbox proxy refuses browser tunnels and
// has broken the fetch three separate ways since July. Everything after the
// read is shared with the online path: hashing, diff against the tracked
// baselines, carry-forward, the 15% ceiling and the exit code.
```

After `const ALLOW_DEGRADED = args.includes("--allow-degraded");` add:

```js
const OFFLINE = args.includes("--offline");
const BUNDLE_DIR = join(CACHE_DIR, "bundle");
```

Add to the imports at the top (after the `persistedBlocks.js` import):

```js
import { resolveOfflineSource } from "../src/demand-test/snapshotBundle.js";
```

- [ ] **Step 2: Load the bundle when offline**

Directly after the `const { sources } = JSON.parse(readFileSync(SOURCES_PATH, "utf8"));` line, add:

```js
// --offline: the bundle must be a completed pull (the .pulled marker is the
// last thing pull-snapshots.mjs writes). Statuses in the runner's report are
// informational; this run re-derives them against its own baselines.
let bundle = null;
if (OFFLINE) {
  if (!existsSync(join(BUNDLE_DIR, ".pulled"))) {
    console.error("--offline: no completed bundle in .ingest-cache/bundle — run `npm run ingest:pull` first");
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(join(BUNDLE_DIR, "manifest.json"), "utf8"));
  const report = JSON.parse(readFileSync(join(BUNDLE_DIR, "fetch-report.json"), "utf8"));
  bundle = {
    manifest,
    reportById: new Map((report.sources ?? []).map((s) => [s.id, s])),
    pulledAt: readFileSync(join(BUNDLE_DIR, ".pulled"), "utf8").trim(),
  };
  console.log(`offline: reading the runner's bundle fetched ${manifest.fetchedAt} (product ${String(manifest.productCommit ?? "?").slice(0, 7)})`);
}

// One source, from the bundle. Detail pages are already inside the runner's
// snapshot text, so there is no second read here.
function offlineSource(src) {
  const entry = bundle.reportById.get(src.id);
  const snapPath = join(BUNDLE_DIR, "snapshots", `${src.id}.txt`);
  const r = resolveOfflineSource(src, entry, existsSync(snapPath));
  if (r.kind === "error") throw new Error(r.message);
  return { text: readFileSync(snapPath, "utf8").replace(/\n$/, ""), method: r.method, detail: entry.detail };
}
```

- [ ] **Step 3: Skip the browser preflight and the network reads when offline**

Change line 723 from:

```js
if (browserRequired && !NO_BROWSER) {
```

to:

```js
if (OFFLINE) {
  browserPreflight = { ok: true, skipped: true, offline: true };
} else if (browserRequired && !NO_BROWSER) {
```

In the per-source loop, replace:

```js
    const { text: listingText, method } = await fetchSource(src);
    // Detail pages are part of the snapshot, not a side file: they must be
    // hashed, diffed and re-checkable exactly like the listing they came from.
    const detail = await detailText(src, listingText);
    const text = listingText + detail.block;
    if (src.detail) {
      entry.detail = { fetched: detail.fetched, ...(detail.failed.length ? { failed: detail.failed } : {}) };
      const note = detail.failed.length ? `, ${detail.failed.length} failed` : "";
      console.log(`  detail: ${detail.fetched} page(s) persisted for ${src.id}${note}`);
    }
```

with:

```js
    let text;
    let method;
    if (OFFLINE) {
      const got = offlineSource(src);
      text = got.text;
      method = got.method;
      // The runner already followed detail pages into this text; carry its
      // count so the PR body reads the same either way.
      if (got.detail) entry.detail = got.detail;
    } else {
      const got = await fetchSource(src);
      method = got.method;
      // Detail pages are part of the snapshot, not a side file: they must be
      // hashed, diffed and re-checkable exactly like the listing they came from.
      const detail = await detailText(src, got.text);
      text = got.text + detail.block;
      if (src.detail) {
        entry.detail = { fetched: detail.fetched, ...(detail.failed.length ? { failed: detail.failed } : {}) };
        const note = detail.failed.length ? `, ${detail.failed.length} failed` : "";
        console.log(`  detail: ${detail.fetched} page(s) persisted for ${src.id}${note}`);
      }
    }
```

The denial probe (line 826) must not run from the sandbox against a runner-reported error. Change:

```js
    if (!denied && PROXY && /browser unavailable/.test(entry.error)) {
```

to:

```js
    if (!denied && !OFFLINE && PROXY && /browser unavailable/.test(entry.error)) {
```

- [ ] **Step 4: Record the bundle in the report**

In the `changes.json` write, after `browserPreflight,` add:

```js
      ...(OFFLINE
        ? { offline: { fetchedAt: bundle.manifest.fetchedAt, productCommit: bundle.manifest.productCommit, pulledAt: bundle.pulledAt } }
        : {}),
```

- [ ] **Step 5: Prove offline equals online on the same text**

The local cache holds this morning's live fetch from Task 4 Step 3. Publish it as a bundle, pull it, run offline, and diff the two reports ignoring the fields that legitimately differ:

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && S=/tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad && cp .ingest-cache/changes.json $S/online-changes.json && cp .ingest-cache/state.json $S/online-state.json && rm -rf $S/bundle && npm run -s ingest:publish -- --to $S/bundle --include-monthly >/dev/null && npm run -s ingest:pull -- --from $S/bundle >/dev/null && npm run -s ingest:fetch -- --offline --include-monthly > $S/offline.log 2>&1; echo "offline exit=$?"; tail -2 $S/offline.log; python3 - <<'EOF'
import json
S='/tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad'
a=json.load(open(f'{S}/online-changes.json')); b=json.load(open('.ingest-cache/changes.json'))
assert b.get('offline') and b['offline']['fetchedAt'], 'offline block missing'
strip=lambda s:{k:v for k,v in s.items() if k not in ('error',)}
A={s['id']:strip(s) for s in a['sources']}; B={s['id']:strip(s) for s in b['sources']}
diff=[k for k in A if A[k]!=B.get(k)]
print('sources compared',len(A),'| differing',len(diff))
for k in diff[:10]: print(' ',k,'\n   online ',A[k],'\n   offline',B[k])
errs=[(s['id'],s['error']) for s in b['sources'] if s['status']=='error']
print('offline errors (all should start with "runner:"):',all(e.startswith('runner:') for _,e in errs), len(errs))
EOF
```

Expected: `offline exit=0`, `differing 0`, and every offline error prefixed `runner:`. If a source differs only in `status` (`changed` vs `unchanged`), check whether `--mark-ingested` ran between the two runs; it must not have.

- [ ] **Step 6: Full test suite**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'
```

Expected: `fail 0`.

- [ ] **Step 7: Commit**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git add scripts/fetch-sources.mjs && git commit -q -m "ingest: --offline diffs the runner's bundle with the same rules as a live fetch

The read is the only thing that changes. Hash, diff against the tracked
baselines, carry-forward, the 15% ceiling and the exit code are shared, so a
runner error halts the routine exactly as the same error would have locally.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

---

### Task 7: Docs — skill step, commands, decision log, spec status

**Files:**
- Modify: `.claude/skills/ingest-newsletters/SKILL.md:42` (step 0.2) and `:26–27` (scripts list)
- Modify: `CLAUDE.md` (Commands block and the "Always invoke the ingest scripts through npm run" constraint)
- Modify: `docs/DECISION_LOG.md` (new entry at the top, newest first)
- Modify: `docs/superpowers/specs/2026-09-08-ingest-fetch-on-github-actions-design.md` (status line)

- [ ] **Step 1: SKILL.md step 0.2**

Replace the line beginning `2. \`npm run ingest:fetch\` — snapshots every roster source` with:

```markdown
2. **In the cloud routine (2026-09-08):** `npm run ingest:pull && npm run ingest:fetch -- --offline`. The fetch itself runs on GitHub Actions at 7:30am New York (`ingest-fetch` workflow) and lands in `batusayici/stoopwise-snapshots`; the pull brings that bundle into `.ingest-cache/bundle/` and the fetch script diffs it against the baselines in this checkout. **The sandbox no longer fetches any roster source and no longer launches a browser** — the proxy that refused browser tunnels since 08-05 is out of the path. First Monday of the month: add `--include-monthly` to the fetch command (the runner always fetches monthly sources; the flag decides which are in play). **Local interactive runs keep fetching live:** `npm run ingest:fetch` as before.

   Two new halts, both exit 1 under the same contract as the ceiling: **`SNAPSHOTS STALE`** (the bundle is older than six hours — the workflow did not run this morning; dispatch it with `gh workflow run ingest-fetch.yml`, wait, pull again; `--allow-stale` proceeds knowingly and must be named in the PR body) and **`SNAPSHOTS UNREACHABLE`** (could not clone the bundle). A **`ROSTER CHANGED SINCE THE FETCH`** warning is not a halt: the named sources count as errors this run, and the fix is to dispatch the workflow again. An offline error reads `runner: <message>` — it is the runner's diagnosis, and the `EGRESS DENIED` / `BROWSER PREFLIGHT` blocks no longer apply to it. In the PR body, name the bundle: `changes.json.offline.fetchedAt` and `productCommit`.
```

In the scripts list (line 26), after `` `npm run ingest:fetch` (snapshot + diff roster → `.ingest-cache/changes.json`) `` insert:

```markdown
`npm run ingest:pull` (bring the runner's bundle into `.ingest-cache/bundle/`; refuses one older than 6h), `npm run ingest:fetch -- --offline` (diff that bundle instead of fetching — the cloud routine's path since 2026-09-08), `npm run ingest:publish` (runner side only),
```

- [ ] **Step 2: CLAUDE.md**

In the Commands block, after the `npm run ingest:geocode` line, add:

```bash
npm run ingest:pull      # cloud routine only: bring the GitHub Actions fetch bundle into .ingest-cache/bundle/ (halts if >6h old)
npm run ingest:fetch -- --offline   # cloud routine only: diff that bundle instead of fetching (2026-09-08)
```

Append to the "Always invoke the ingest scripts through `npm run` (2026-08-10)" constraint paragraph:

```markdown
**Since 2026-09-08 the cloud routine does not fetch roster sources at all:** the `ingest-fetch` GitHub Actions workflow fetches daily at 7:30am New York and publishes to `batusayici/stoopwise-snapshots`; the routine runs `ingest:pull` then `ingest:fetch -- --offline`. The sandbox allowlist therefore only needs github.com, Nominatim and one-off lookup hosts. If every source errors in a cloud run, look at the workflow run first, not the sandbox.
```

- [ ] **Step 3: DECISION_LOG entry (insert at the top, after the file's heading)**

```markdown
## 2026-09-08 — the ingest fetch leaves the sandbox: GitHub Actions reads the roster, the routine diffs what it read

**Batu, after the daily run halted for the third distinct sandbox-network reason since July.**
The proxy in the claude.ai cloud sandbox refuses the tunnel headless Chromium and Firefox open,
while plain fetch and curl through the same proxy work (08-05, unanswered by Anthropic). It had
already reverted its network preset (07-27) and shipped a Chromium older than Playwright's (07-28).
Last night's family/kids push added eight browser sources, so today 14 of 78 sources came back
empty, 18% against the 15% ceiling, and the run expired three cards and added none. That is the
daily shape for as long as the fetch stays inside a sandbox we do not control.

**The decision.** A GitHub Actions workflow (`ingest-fetch`, 7:30am New York daily and on demand)
fetches the whole roster on a plain Ubuntu runner and pushes the snapshots to a small public repo,
`batusayici/stoopwise-snapshots`. The routine pulls that bundle (`npm run ingest:pull`), refuses
one older than six hours, and runs the existing fetch script in `--offline` mode, which changes only
the read: hashing, the diff against the tracked baselines, carry-forward, the 15% ceiling and the
exit code are the same code as a live fetch. Local interactive runs still fetch live.

**Why this shape.** The runner reads untrusted pages, so it holds nothing that can write this repo:
workflow permissions are read-only and its one secret is a deploy key to the snapshots repo. A
branch in this repo would have given it write access to a repo whose `main` is production with no
branch protection; workflow artifacts download from changing Azure hosts the sandbox allowlist would
have to admit, and they expire. The separate repo needs no new allowlisted host (the routine already
talks to github.com), and its history is a record of what every source said on every day.

**What it retires.** The per-host allowlist step at claude.ai for roster sources (the roster PR is
now the only gate — the thing the deferred 2026-08-30 fetch-relay decision asked for, so that entry
is satisfied by this one). The Playwright pin to the sandbox's stale Chromium can go once nothing in
the sandbox launches a browser. Two options were considered and not taken: bridging the tunnel inside
the sandbox with a local Node proxy (an hour's probe, but it stays inside the dependency that keeps
failing), and a hosted rendering service (a paid dependency for a problem the runner removes).

**Rules that did not move.** No stopgap to the ceiling: excluding browser errors from it would
reopen the second gate removed on 2026-08-05, and shielding cards whose source was unreadable would
contradict the 2026-08-30 rule that they delete on the second flagged run. Halting stays the
fallback: stale bundle, unreachable bundle, ceiling tripped on the runner — every one stops the run
before anything thin ships.

**Measured before switching:** the runner's error set on <date> was compared with a same-day local
run — <N> runner errors, <M> local, runner-only: <none | list>. Spec:
`docs/superpowers/specs/2026-09-08-ingest-fetch-on-github-actions-design.md`.
```

Fill the `<…>` placeholders from Task 4 Step 4 before committing.

- [ ] **Step 4: Spec status**

In the spec, change `Status: draft for review.` to `Status: approved 2026-09-08; implemented on branch feat/ingest-fetch-on-actions.`

- [ ] **Step 5: Commit**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git add .claude/skills/ingest-newsletters/SKILL.md CLAUDE.md docs/DECISION_LOG.md docs/superpowers/specs/2026-09-08-ingest-fetch-on-github-actions-design.md && git commit -q -m "docs: the routine pulls the runner's bundle; decision logged

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

---

### Task 8: Batu's two manual steps, the first real run, and the PR

**Files:** none in the repo.

The deploy key and the snapshots repo are outward-facing account changes. They are Batu's to make; everything below is written so he can paste it.

- [ ] **Step 1: Batu creates the snapshots repo and the key** (paste-ready)

```bash
gh repo create batusayici/stoopwise-snapshots --public --description "Daily fetch snapshots for the Stoopwise Greenpoint ingest (written by the ingest-fetch workflow)" --add-readme
ssh-keygen -t ed25519 -N "" -C "ingest-fetch deploy key" -f /tmp/stoopwise-snapshots-key
gh repo deploy-key add /tmp/stoopwise-snapshots-key.pub --repo batusayici/stoopwise-snapshots --title "ingest-fetch (write)" --allow-write
gh secret set SNAPSHOTS_DEPLOY_KEY --repo batusayici/greenpoint-explorer < /tmp/stoopwise-snapshots-key
rm /tmp/stoopwise-snapshots-key /tmp/stoopwise-snapshots-key.pub
```

- [ ] **Step 2: Dispatch the workflow from the branch and confirm the bundle landed**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && gh workflow run ingest-fetch.yml --ref feat/ingest-fetch-on-actions && sleep 15 && RUN=$(gh run list --workflow ingest-fetch.yml --limit 1 --json databaseId --jq '.[0].databaseId') && gh run watch "$RUN" --exit-status; echo "exit=$?"; gh api repos/batusayici/stoopwise-snapshots/commits --jq '.[0] | "\(.commit.message) \(.sha[0:7])"'; gh api repos/batusayici/stoopwise-snapshots/contents/manifest.json --jq '.content' | base64 -d
```

Expected: the run is green (or red only via the final "unreadable" step, in which case read the artifact's errors before going on), the snapshots repo has a `fetch <timestamp>` commit, and the manifest shows today's `fetchedAt`.

- [ ] **Step 3: Pull and diff offline from a real clone, locally**

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && npm run -s ingest:pull && npm run -s ingest:fetch -- --offline 2>&1 | tail -4; echo "exit=$?"
```

Expected: `bundle cloned from … @ <sha>`, a `bundle:` line under 6h, a `reach:` line, exit 0.

- [ ] **Step 4: Open the PR**

Write the body from the scratchpad draft (Task 4 Step 5) plus what changed, in plain words, then:

```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer" && git push && gh pr create --base main --head feat/ingest-fetch-on-actions --title "ingest: the roster is fetched on GitHub Actions, off the sandbox proxy" --body-file /tmp/claude-501/-Users-batusayici-Projects-Greenpoint-Explorer/d34aa112-df25-4109-8493-09679b8e2eeb/scratchpad/pr-body.md
```

The body must name: what happened (three sandbox network failures since July, today's halt), what the routine does differently from the next run, the runner measurement numbers, the two halts and how to clear them, and that the cron and the routine's 8:30am start leave an hour's buffer. End with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

- [ ] **Step 5: Batu merges.** Merge = production deploy (code only; no card change in this PR). The next daily routine runs the new path. Its PR body should carry `changes.json.offline.fetchedAt`; if it instead reports `SNAPSHOTS STALE`, the cron did not fire, and the fix is `gh workflow run ingest-fetch.yml`.

---

## Self-review

**Spec coverage.** Workflow (Task 3), snapshots repo and deploy key (Tasks 3, 8), pull with stale/unreachable/roster-mismatch behaviour (Task 5), `--offline` sharing every downstream step (Task 6), runner-IP measurement with the decision rule (Task 4), tests for the pure decisions and the offline-equals-online check (Tasks 1, 6), docs and decision log (Task 7), no stopgap (Task 7's entry says so). The spec's optional "routine dispatches the workflow itself" is not built; the SKILL text tells the run how to dispatch by hand when stale, which is the same outcome with no token-scope question.

**Placeholders.** Task 4 Step 5 and Task 7 Step 3 carry `<…>` placeholders on purpose — measurement numbers that do not exist until Task 4 runs — and both say to fill them before committing.

**Type consistency.** `resolveOfflineSource(src, reportEntry, hasSnapshot)` returns `{kind:"text",method}` or `{kind:"error",message}` in Task 1 and is consumed exactly so in Task 6. `assessBundle` returns `{ok, stale, ageHours, rosterMismatch, reasons}` in Task 1 and Task 5 reads those five fields. Bundle layout (`manifest.json`, `fetch-report.json`, `snapshots/<id>.txt`, `.pulled`) is the same in Tasks 2, 5, 6.
