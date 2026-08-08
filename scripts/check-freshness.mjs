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
// --record appends today's datedUpcoming7d to the trend history. Explicit
// rather than automatic so an ad-hoc local check stays read-only and does not
// dirty the tree; the scheduled ingest routine is what should be recording.
const recordMode = process.argv.includes("--record");
const now = new Date();

const historyPath = join(dataDir, "freshness-history.json");
let history = [];
let historyDescription = null;
if (existsSync(historyPath)) {
  try {
    const h = JSON.parse(readFileSync(historyPath, "utf8"));
    history = h.runs ?? [];
    historyDescription = h.description ?? null; // preserve provenance notes across --record
  } catch {
    /* unreadable history — judge the feed without a trend rather than crash */
  }
}

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

const a = assessFreshness({ lastRunAt: ledger.lastRunAt, now, cards: seed.cards, fetchReport, history });

if (recordMode) {
  const today = now.toISOString().slice(0, 10);
  const runs = history.filter((r) => r.date !== today); // one record per day, last write wins
  runs.push({ date: today, datedUpcoming: a.datedUpcoming });
  runs.sort((x, y) => x.date.localeCompare(y.date));
  writeFileSync(
    historyPath,
    JSON.stringify(
      {
        description:
          historyDescription ??
          "L11c trend history — one datedUpcoming7d reading per day, written by check-freshness.mjs --record. Compared same-weekday-to-same-weekday; the feed sawtooths, so run-to-run would cry wolf every weekend.",
        runs: runs.slice(-90),
      },
      null,
      2,
    ) + "\n",
  );
}

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
const trendBit = a.trend
  ? ` trend=${a.trend.prior}→${a.trend.current} over ${a.trend.spanDays}d (${(a.trend.dropRatio * 100).toFixed(0)}%)`
  : " trend=no-baseline";
console.log(
  `[freshness] lastRunAt=${ledger.lastRunAt} datedUpcoming7d=${a.datedUpcoming} ` +
    `reservoir7-14d=${a.datedReservoir} ` +
    (a.concentration ? `topVenue=${a.concentration.topVenue}:${(a.concentration.topShare * 100).toFixed(0)}% ` : "") +
    `staleIngest=${a.staleIngest} thinFeed=${a.thinFeed}${stampMode ? "" : reachBit + trendBit} → ${a.fresh ? "FRESH" : "NOT FRESH"}${stampMode ? " (stamp written)" : ""}`,
);

// L11d: warn, never exit — same call as decliningFeed above. This is the one
// signal that fires BEFORE the feed thins rather than after, so it is the line
// an ingest run should act on: it names supply the roster already carries.
// L11e: the counterweight to the fill rule. Fill hard, then check nobody is
// swamping the feed — rather than capping venues up front, which is how the
// 2026-08-06 cap suppressed 5 of Troost's 7 nights against a mis-sized number.
if (!stampMode && a.overConcentrated) {
  const c = a.concentration;
  console.error(
    `[freshness] WARN: ${c.topVenue} is ${(c.topShare * 100).toFixed(0)}% of the live window ` +
      `(${c.topCount} of ${c.windowSize}, ceiling ${(c.maxShare * 100).toFixed(0)}%).\n` +
      "[freshness]   Thin the venue OR fill the rest of the window — the second is almost always\n" +
      "[freshness]   the right move, because a high share usually means the feed is thin, not that\n" +
      "[freshness]   the venue is loud.",
  );
}

if (!stampMode && a.hollowReservoir) {
  console.error(
    `[freshness] WARN: reservoir hollow — only ${a.datedReservoir} cards dated 7-14 days out ` +
      `(floor is ${10}). That reservoir IS next week's window, so the feed is already committed\n` +
      "[freshness]   to thinning no matter how many sources are reachable. Fill the back of the window:\n" +
      "[freshness]   card each source's calendar out to 14 days (max 2 per venue inside the live 7-day\n" +
      "[freshness]   window) — the deep calendars are usually already sitting in .ingest-cache/.",
  );
}

// Deliberately a WARN with no exit code. thinFeed catches a cliff and should
// break the run; a trend is a judgement call with known false-alarm risk (the
// kill criteria are two false alarms in four weeks), and a noisy alarm that
// halts the ingest is worse than no alarm at all. The growth readout reads
// this line — that is the consumer that matters.
if (!stampMode && a.decliningFeed) {
  console.error(
    `[freshness] WARN: feed declining — ${a.trend.prior} → ${a.trend.current} dated-upcoming ` +
      `over ${a.trend.spanDays} days (${(a.trend.dropRatio * 100).toFixed(0)}% drop, bar is ` +
      `${(a.trend.minDropRatio * 100).toFixed(0)}%). The floor of 10 will not catch this.\n` +
      "[freshness]   Supply decay, not a quiet week, unless the roster says otherwise. Check roster yield before seeding.",
  );
}

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
