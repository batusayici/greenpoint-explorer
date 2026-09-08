#!/usr/bin/env node
// Copy the result of a fetch-sources.mjs run into a bundle directory (a
// checkout of the snapshots repo). Runs on the GitHub Actions runner after
// `npm run ingest:fetch`; the workflow commits and pushes what this writes.
//
// Usage: node scripts/publish-snapshots.mjs --to <dir>
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
const toValue = toIdx === -1 ? undefined : args[toIdx + 1];
if (toIdx === -1 || !toValue || toValue.startsWith("--")) {
  console.error("usage: publish-snapshots.mjs --to <dir>");
  process.exit(2);
}
const TO = toValue;

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

const includeMonthly = !(report.sources ?? []).some((s) => s.status === "skipped_monthly");
const manifest = buildManifest({
  includeMonthly,
  rosterHash: rosterHash(sources),
  productCommit,
  report,
});
writeFileSync(join(TO, "fetch-report.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(join(TO, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `published ${copied} snapshot(s) to ${TO} (${removed} stale file(s) removed); ` +
    `${manifest.errorCount} of ${manifest.sourceCount} sources errored; roster ${manifest.rosterHash}; product ${manifest.productCommit}, ${missing} missing`,
);
