#!/usr/bin/env node
// One command for every growth number.
//
//   npm run growth:pull                 # today, New York
//   npm run growth:pull -- --dry        # print, write nothing
//   npm run growth:pull -- --date=2026-09-12   # backfill one day
//
// Writes docs/growth/snapshots/YYYY-MM-DD.json and nothing else. The snapshot is
// never hand-edited: docs/launch/gtm-state.json says what we measure and why,
// the snapshot says what it was on a day, and build-cockpit.mjs joins the two.
//
// This file is deliberately thin. Every definition and every calculation lives
// under src/growth/, because `npm test` is `node --test "src/**/*.test.mjs"` and
// scripts/ is outside that glob — untested code is how the activation
// definition drifted from its own doc for two months.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { assertProxyAware } from "../src/demand-test/proxyDiagnosis.js";
import { METRIC_DEFS, QUERIES, bindQuery } from "../src/growth/metricDefs.js";
import { nyDayStart, nextDay, todayNY, windowStart, nyDay } from "../src/growth/days.js";
import { dailyCounts } from "../src/growth/compute.js";
import { ROOT, loadEnvLocal, STATUS, SourceError, EXIT } from "./growth/env.mjs";
import { pullPostHog, toSessions } from "./growth/sources/posthog.mjs";
import { pullTally } from "./growth/sources/tally.mjs";

// In the cloud sandbox a direct egress is intercepted rather than merely
// unproxied, so it returns mangled bodies instead of honest errors. That cost
// three weeks in August 2026. Never work around this by unsetting HTTPS_PROXY.
assertProxyAware();
loadEnvLocal();

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const dateArg = args.find((a) => a.startsWith("--date="))?.slice("--date=".length);
const day = dateArg ?? todayNY();

// Bounded at the END of the New York day, so a 9am run and a 6pm rerun of the
// same date cover exactly the same events. posthog-pull.sh queries all of time
// with no bound, which is why two runs of "today" disagree.
const upperBound = nyDayStart(nextDay(day))
  .toISOString()
  .replace("T", " ")
  .slice(0, 19);

const sources = {};
const metrics = {};
let counts = null;

function record(sourceName, status, extra = {}) {
  sources[sourceName] = { status, pulledAt: new Date().toISOString(), ...extra };
}

// A source that fails is present in the snapshot with its status, never omitted
// — otherwise a half-empty file quietly becomes the newest one and the cockpit
// renders it as the truth. No value is ever carried forward from an older day.
async function attempt(name, fn) {
  try {
    const out = await fn();
    record(name, out.status, out.failures?.length ? { failures: out.failures } : {});
    return out;
  } catch (error) {
    if (!(error instanceof SourceError)) throw error;
    record(name, error.status, { exitCode: error.exitCode, message: error.message });
    console.error(`SENSOR DOWN (${error.status}): ${error.message}`);
    return null;
  }
}

// --- PostHog ----------------------------------------------------------------

// A query that takes a lower bound gets it from the window of the metric that
// reads it, so a declared window is always the window actually queried.
const windowFor = (queryName) =>
  METRIC_DEFS.find((d) => d.query === queryName && d.windowDays)?.windowDays ?? null;

const boundedQueries = Object.fromEntries(
  Object.entries(QUERIES).map(([name, sql]) => {
    const days = windowFor(name);
    const lower = days
      ? nyDayStart(windowStart(day, days)).toISOString().replace("T", " ").slice(0, 19)
      : null;
    return [name, bindQuery(sql, upperBound, lower)];
  }),
);

const posthog = await attempt("posthog", () => pullPostHog(boundedQueries, { upperBound }));

const sessions = posthog?.rows?.sessions ? toSessions(posthog.rows.sessions) : null;
if (sessions) counts = dailyCounts(sessions);

// The non-production audit is printed, never stored as a metric. It is how we
// learned that other hosts were 34% of all events on 2026-07-28.
for (const row of posthog?.rows?.droppedHosts ?? []) {
  console.error(`  dropped (not production): ${row.host} — ${row.events} events`);
}

// --- Tally ------------------------------------------------------------------

const tally = await attempt("tally", () => pullTally({ upperBound }));

// --- Repo data --------------------------------------------------------------
// Always available, and the four metrics the cockpit is currently wrong about.

let cards = null;
try {
  const raw = JSON.parse(readFileSync(resolve(ROOT, "src/data/demand-test/cards.json"), "utf8"));
  cards = Array.isArray(raw) ? raw : (raw.cards ?? []);
  record("repo", STATUS.OK);
} catch (error) {
  record("repo", STATUS.API, { message: `cards.json unreadable: ${error.message}` });
}

// --- Compute ----------------------------------------------------------------

const INPUTS = {
  posthog: () => (sessions ? { rows: sessions, extra: posthog.rows } : null),
  tally: () => tally?.forms?.signup ?? null,
  repo: () => cards,
};

for (const def of METRIC_DEFS) {
  const source = sources[def.source];
  if (!source || (source.status !== STATUS.OK && source.status !== STATUS.PARTIAL)) {
    metrics[def.id] = { status: "sensor-down", since: day, source: def.source };
    continue;
  }
  try {
    let input =
      def.source === "posthog"
        ? def.query === "sessions"
          ? sessions
          : (posthog.rows[def.query] ?? [])
        : INPUTS[def.source]();
    if (input == null) throw new Error(`no rows for ${def.source}`);

    // Rates read a trailing window; counts are cumulative. An all-time rate is
    // dominated by however much history there is and stops responding to
    // anything — and an all-time count only ever rises, so every trend arrow on
    // it would point up forever regardless of what happened.
    let window = def.windowDays ? { from: windowStart(day, def.windowDays), to: day, days: def.windowDays } : null;
    if (def.windowDays && def.source === "posthog" && def.query === "sessions") {
      // The session roll-up is pulled whole and windowed here, because several
      // metrics read it over different spans from one query.
      input = input.filter((s) => nyDay(s.startedAt) >= window.from);
    }

    const { n, display } = def.compute(input, { now: nyDayStart(nextDay(day)) });
    metrics[def.id] = { n, display, status: "ok", defVersion: def.defVersion, window };
  } catch (error) {
    metrics[def.id] = { status: "sensor-down", since: day, why: error.message };
  }
}

// --- Write ------------------------------------------------------------------

const snapshot = {
  date: day,
  tz: "America/New_York",
  queryUpperBound: `${upperBound}Z`,
  generatedAt: new Date().toISOString(),
  backfilled: Boolean(dateArg),
  sources,
  metrics,
  counts,
};

const width = Math.max(...METRIC_DEFS.map((d) => d.id.length));
console.log(`\n${day} (New York), events before ${upperBound}Z\n`);
for (const def of METRIC_DEFS) {
  const m = metrics[def.id];
  console.log(`  ${def.id.padEnd(width)}  ${m.status === "ok" ? m.display : `— ${m.status}`}`);
}
for (const [name, s] of Object.entries(sources)) {
  if (s.status !== STATUS.OK) console.log(`\n  ${name}: ${s.status}${s.message ? ` — ${s.message}` : ""}`);
}

if (dry) {
  console.log("\n--dry: nothing written.");
} else {
  const dir = resolve(ROOT, "docs/growth/snapshots");
  mkdirSync(dir, { recursive: true });
  const path = resolve(dir, `${day}.json`);
  writeFileSync(path, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`\nwrote docs/growth/snapshots/${day}.json`);
}

// A run where every source failed is a failed run, and the exit code says which
// kind so the weekly routine's fallback language still applies.
const statuses = Object.values(sources).map((s) => s.status);
if (statuses.every((s) => s !== STATUS.OK && s !== STATUS.PARTIAL)) {
  const first = Object.values(sources).find((s) => s.exitCode);
  process.exit(first?.exitCode ?? EXIT.API);
}
