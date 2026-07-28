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
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { assessFreshness } from "../src/demand-test/freshness.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data", "demand-test");
const ledger = JSON.parse(readFileSync(join(dataDir, "ingest-ledger.json"), "utf8"));
const seed = JSON.parse(readFileSync(join(dataDir, "cards.json"), "utf8"));

const stampMode = process.argv.includes("--stamp");
const a = assessFreshness({ lastRunAt: ledger.lastRunAt, now: new Date(), cards: seed.cards });

if (stampMode) {
  writeFileSync(
    join(dataDir, "freshness-stamp.json"),
    JSON.stringify({ description: "Build-time ingest freshness stamp (L11). Written by check-freshness.mjs --stamp; safe for the client bundle.", lastRunAt: ledger.lastRunAt ?? null }, null, 2) + "\n",
  );
}

console.log(
  `[freshness] lastRunAt=${ledger.lastRunAt} datedUpcoming7d=${a.datedUpcoming} ` +
    `staleIngest=${a.staleIngest} thinFeed=${a.thinFeed} → ${a.fresh ? "FRESH" : "NOT FRESH"}${stampMode ? " (stamp written)" : ""}`,
);

if (!a.fresh && !stampMode) {
  console.error(
    `[freshness] ALARM: ${a.staleIngest ? "ingest stale (>48h since lastRunAt) " : ""}${a.thinFeed ? `feed thin (${a.datedUpcoming} dated upcoming < 10)` : ""}` +
      ` — check the cloud routine's last run and the environment's network preset (DECISION_LOG 2026-07-28).`,
  );
  process.exit(1);
}
