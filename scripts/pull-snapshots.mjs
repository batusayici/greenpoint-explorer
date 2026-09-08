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
