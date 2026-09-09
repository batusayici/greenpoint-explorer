#!/usr/bin/env node
// Copy the result of a fetch-sources.mjs run into a bundle directory (a
// checkout of the snapshots repo). Runs on the GitHub Actions runner after
// `npm run ingest:fetch`; the workflow commits and pushes what this writes.
//
// Usage: node scripts/publish-snapshots.mjs --to <dir> --fetcher <github|home> [--yield-hours <n>]
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
import { rosterHash, buildManifest, shouldYield } from "../src/demand-test/snapshotBundle.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = join(ROOT, ".ingest-cache");
const args = process.argv.slice(2);
const USAGE = "usage: publish-snapshots.mjs --to <dir> --fetcher <github|home> [--yield-hours <n>]";
function flag(name) {
  const i = args.indexOf(name);
  const v = i === -1 ? undefined : args[i + 1];
  if (i === -1 || !v || v.startsWith("--")) return undefined;
  return v;
}
const TO = flag("--to");
const FETCHER = flag("--fetcher");
if (!TO || !FETCHER) {
  console.error(USAGE);
  process.exit(2);
}
let YIELD_HOURS;
if (args.includes("--yield-hours")) {
  YIELD_HOURS = Number(flag("--yield-hours"));
  if (!(YIELD_HOURS > 0)) {
    console.error(USAGE);
    process.exit(2);
  }
}

// Two fetchers write this bundle (see shouldYield): don't clobber a fresher
// read from the other one.
const existingManifestPath = join(TO, "manifest.json");
if (existsSync(existingManifestPath)) {
  let existing = null;
  try {
    existing = JSON.parse(readFileSync(existingManifestPath, "utf8"));
  } catch {
    existing = null;
  }
  const verdict = shouldYield({ existing, fetcher: FETCHER, yieldHours: YIELD_HOURS });
  if (verdict.yield) {
    console.log(`yielding: ${verdict.reason} — not publishing`);
    process.exit(0);
  }
}

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

// Publishing from a warm local .ingest-cache ships `## [` blocks carried
// forward from a previous working snapshot (R1 PERSISTED / IMAGE READ, see
// persistedBlocks.js) — evidence a fresh runner never had, because it never
// fetched a prior snapshot to carry anything forward from. A local replay
// that means to compare hashes against a clean runner-equivalent read must
// publish from a cold cache (`rm -rf .ingest-cache` first), or the diff is
// comparing the runner's fetch against something richer than it could ever
// produce.
const owned = new Set();
let copied = 0;
let missing = 0;
for (const entry of report.sources ?? []) {
  if (!entry.textPath) continue;
  const from = join(ROOT, entry.textPath);
  if (!existsSync(from)) {
    console.error(`  missing snapshot for ${entry.id} (${entry.textPath})`);
    missing++;
    continue;
  }
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
  rosterHash: rosterHash(sources),
  productCommit,
  report,
  fetcher: FETCHER,
});
writeFileSync(join(TO, "fetch-report.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(join(TO, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `published ${copied} snapshot(s) to ${TO} by ${FETCHER} (${removed} stale file(s) removed); ` +
    `${manifest.errorCount} of ${manifest.sourceCount} sources errored; roster ${manifest.rosterHash}; product ${manifest.productCommit}, ${missing} missing`,
);
