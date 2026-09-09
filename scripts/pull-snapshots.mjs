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

const USAGE = "usage: pull-snapshots.mjs [--allow-stale] [--from <dir>]";
const args = process.argv.slice(2);
const ALLOW_STALE = args.includes("--allow-stale");
const fromIdx = args.indexOf("--from");
let FROM = null;
if (fromIdx !== -1) {
  const v = args[fromIdx + 1];
  if (!v || v.startsWith("--")) {
    console.error(USAGE);
    process.exit(2);
  }
  FROM = v;
}

const { sources } = JSON.parse(readFileSync(join(ROOT, "src/data/demand-test/ingest-sources.json"), "utf8"));

rmSync(BUNDLE_DIR, { recursive: true, force: true });
mkdirSync(CACHE_DIR, { recursive: true });

if (FROM) {
  cpSync(FROM, BUNDLE_DIR, { recursive: true });
  // A replayed bundle can carry a stale .pulled marker from whatever produced
  // it (a previous pull, a scratch fixture); a fresh pull must always re-earn
  // that marker by running the verdict below, not inherit someone else's.
  rmSync(join(BUNDLE_DIR, ".pulled"), { force: true });
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
  // A clone of a repo with no commits succeeds and then has no HEAD: that is a
  // snapshots repo nobody has published to yet, not a crash.
  let head;
  try {
    head = execFileSync("git", ["-C", BUNDLE_DIR, "rev-parse", "--short", "HEAD"], {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    }).trim();
  } catch {
    console.error("\n=== SNAPSHOTS MALFORMED — the snapshots repo has no commits yet ===");
    console.error("  Nothing has been published to it. Dispatch the fetch (gh workflow run ingest-fetch.yml),");
    console.error("  wait for it to finish, and pull again.\n");
    process.exit(1);
  }
  console.log(`bundle cloned from ${REPO} @ ${head}`);
}

// A bundle whose JSON cannot even parse is malformed the same way a missing
// file is — never handed to assessBundle to guess at.
function readBundleJson(path, label) {
  const raw = readFileSync(path, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    console.error(`\n=== SNAPSHOTS MALFORMED — ${label} is not valid JSON ===`);
    process.exit(1);
  }
}

const manifestPath = join(BUNDLE_DIR, "manifest.json");
if (!existsSync(manifestPath) || !existsSync(join(BUNDLE_DIR, "fetch-report.json"))) {
  console.error("\n=== SNAPSHOTS MALFORMED — no manifest.json / fetch-report.json in the bundle ===");
  process.exit(1);
}
const manifest = readBundleJson(manifestPath, "manifest.json");
// Parsed here, not only where the roster-mismatch warning needs it: a report
// that cannot be read at all is a malformed bundle, and the pull is where the
// routine should learn that, not the offline run twenty minutes later.
const report = readBundleJson(join(BUNDLE_DIR, "fetch-report.json"), "fetch-report.json");
const verdict = assessBundle({ manifest, rosterHash: rosterHash(sources) });

// An unusable fetchedAt is malformed, not stale, and --allow-stale is not a
// license to guess an age: halt regardless of the flag, before the log line
// below would otherwise have to print a null/Infinity age.
if (verdict.ageHours === null) {
  console.error("\n=== SNAPSHOTS MALFORMED — manifest has no usable fetchedAt ===");
  process.exit(1);
}

console.log(
  `bundle: fetched ${manifest.fetchedAt} (${verdict.ageHours.toFixed(1)}h ago), ` +
    `${manifest.sourceCount} sources, ${manifest.errorCount} errored, product ${String(manifest.productCommit ?? "?").slice(0, 7)} by ${manifest.fetcher ?? "unknown"}`,
);
if (verdict.rosterMismatch) {
  const inBundle = new Set((report.sources ?? []).map((s) => s.id));
  const missing = sources.filter((s) => !inBundle.has(s.id)).map((s) => s.id);
  console.warn("\n=== ROSTER CHANGED SINCE THE FETCH ===");
  console.warn(`  The runner read a different roster (${manifest.rosterHash} vs ${rosterHash(sources)} now).`);
  console.warn(`  ${missing.length} source(s) not in the bundle will count as errors: ${missing.join(", ") || "(none missing — a source's config changed; the run will name it)"}`);
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
