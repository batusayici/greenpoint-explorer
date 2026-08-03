#!/usr/bin/env node
// L11 freshness alarm (DECISION_LOG 2026-07-28, pressure-test fatal #2).
//
// Two modes:
//   node scripts/check-freshness.mjs          → ops check: prints the report,
//     exits 1 when stale/thin so a scheduled runner (cloud routine step,
//     growth-weekly Monday pull) surfaces it loudly. The 2026-07-27/28 outage
//     ran two days invisible; this trips inside one.
//   node scripts/check-freshness.mjs --stamp  → build step: writes the tiny
//     freshness stamp the client banner reads (just lastRunAt — the 44KB
//     ledger holds the sender registry and must never reach the public
//     bundle). NEVER exits non-zero: a corrective deploy during an outage
//     must not be blocked by the outage it is fixing — the banner's
//     "verified through" line is the honest degradation in that state.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { assessFreshness } from "../src/demand-test/freshness.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data", "demand-test");
const ledger = JSON.parse(readFileSync(join(dataDir, "ingest-ledger.json"), "utf8"));
const seed = JSON.parse(readFileSync(join(dataDir, "cards.json"), "utf8"));

const stampMode = process.argv.includes("--stamp");
const now = new Date();

// L11b: fold in the last fetch run's reachability when there is one. The
// report is gitignored and absent on fresh checkouts and at build time — no
// report means judge the feed alone, exactly as before. A report older than
// the staleIngest window is ignored too: a week-old outage must not keep
// alarming after the run that fixed it.
const REPORT_MAX_AGE_H = 48;
let fetchReport = null;
const reportPath = join(root, ".ingest-cache", "changes.json");
if (!stampMode && existsSync(reportPath)) {
  try {
    const r = JSON.parse(readFileSync(reportPath, "utf8"));
    const age = (now.getTime() - new Date(r.generatedAt).getTime()) / 3600e3;
    if (Number.isFinite(age) && age <= REPORT_MAX_AGE_H) fetchReport = r;
  } catch {
    /* unreadable report — judge the feed alone rather than crash the alarm */
  }
}

const a = assessFreshness({ lastRunAt: ledger.lastRunAt, now, cards: seed.cards, fetchReport });

if (stampMode) {
  writeFileSync(
    join(dataDir, "freshness-stamp.json"),
    JSON.stringify({ description: "Build-time ingest freshness stamp (L11). Written by check-freshness.mjs --stamp; safe for the client bundle.", lastRunAt: ledger.lastRunAt ?? null }, null, 2) + "\n",
  );
}

const reachBit = a.reach
  ? ` reach=${a.reach.attempted - a.reach.errored}/${a.reach.attempted}` +
    ` sourcesUnreachable=${a.sourcesUnreachable} browserFetchDown=${a.browserFetchDown}`
  : " reach=no-report";
console.log(
  `[freshness] lastRunAt=${ledger.lastRunAt} datedUpcoming7d=${a.datedUpcoming} ` +
    `staleIngest=${a.staleIngest} thinFeed=${a.thinFeed}${stampMode ? "" : reachBit} → ${a.fresh ? "FRESH" : "NOT FRESH"}${stampMode ? " (stamp written)" : ""}`,
);

if (!a.fresh && !stampMode) {
  const why = [
    a.staleIngest && "ingest stale (>48h since lastRunAt)",
    a.thinFeed && `feed thin (${a.datedUpcoming} dated upcoming < 10)`,
    a.sourcesUnreachable &&
      `sources unreachable (${a.reach.errored} of ${a.reach.attempted} errored, ` +
        `${(a.reach.errorRate * 100).toFixed(0)}% > ${(a.reach.maxErrorRate * 100).toFixed(0)}% ceiling)`,
    a.browserFetchDown &&
      "browser fetch down (sources need headless Chromium and not one browser fetch succeeded)",
  ].filter(Boolean);
  console.error(`[freshness] ALARM: ${why.join("; ")}`);
  if (a.sourcesUnreachable || a.browserFetchDown) {
    console.error(
      "[freshness]   This is a fetch-layer failure, not a quiet week. Do NOT ship a thin run as normal:\n" +
        "[freshness]   run `node scripts/fetch-sources.mjs` and read its BROWSER PREFLIGHT block for the exact cause.",
    );
  }
  if (a.staleIngest || a.thinFeed) {
    console.error(
      "[freshness]   Check the cloud routine's last run and the environment's network preset (DECISION_LOG 2026-07-28).",
    );
  }
  process.exit(1);
}
