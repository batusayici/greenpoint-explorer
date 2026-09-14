// What we measure, why, and the exact words in growth-engine.md that define it.
//
// One file, so "activation" means one thing in the cockpit, the readout, the
// learning log and any session that asks. Before this existed the definition
// lived in the doc's prose, in the last query of posthog-pull.sh, and in
// whatever HogQL each session typed — and the three had already drifted apart:
// the doc says activation is a first-session measure and the script computed it
// lifetime, for two months, under the doc's label.
//
// `docRef` is a phrase quoted from growth-engine.md, not a line number: the doc
// is 727 lines and edited most weeks, so a line number rots within days. A test
// asserts each phrase still appears in the doc — that is what catches a silent
// redefinition on either side.
//
// `defVersion` is a hash of the query plus the compute function, written by
// hand and checked by a test. Editing either without bumping it fails `npm
// test`. It exists so a trend is never computed across a definition change: the
// activation switch alone moves the number from 50/634 to 44/641, which would
// otherwise render as a 12% fall on the day the meaning changed.

import { createHash } from "node:crypto";

import * as compute from "./compute.js";

// ---------------------------------------------------------------------------
// Filters carried over verbatim from posthog-pull.sh. Each encodes an incident;
// none is cosmetic.
// ---------------------------------------------------------------------------

// Our own transport checks.
export const TEST_SRC_TAGS = ["verify", "test", "test31", "posthog-verify"];

// All five hosts stay. greenpoint.life and the vercel.app origin still serve
// already-sent invite links, and dropping them silently deflates every readout.
// The inverse mistake is on record too: on 2026-07-28 non-production hosts were
// 34% of all events and had been inflating readouts unnoticed.
export const PROD_HOSTS = [
  "stoopwise.com",
  "www.stoopwise.com",
  "greenpoint-explorer.vercel.app",
  "greenpoint.life",
  "www.greenpoint.life",
];

const quoted = (values) => values.map((v) => `'${v}'`).join(",");

const SRC_EXCL = `coalesce(JSONExtractString(properties,'src'),'(none)') NOT IN (${quoted(
  TEST_SRC_TAGS,
)})`;
const PROD_ONLY = `JSONExtractString(properties,'$host') IN (${quoted(PROD_HOSTS)})`;

// Every query is bounded above at the snapshot day's New York midnight, passed
// in as a UTC instant. Unbounded all-time queries — what posthog-pull.sh does
// today — return different numbers for the same calendar date depending on the
// hour they ran, so a rerun disagrees with the run it was meant to reproduce.
const BOUND = `timestamp < toDateTime('{{upperBound}}')`;

// Queries whose metric declares a window carry a lower bound too. A metric that
// says it reads 7 days and quietly reads all of time is the same class of
// mistake as activation's: a label that does not describe the number under it.
const WINDOW = `timestamp >= toDateTime('{{lowerBound}}')`;

const WHERE = `${SRC_EXCL} AND ${PROD_ONLY} AND ${BOUND}`;
const WHERE_WINDOWED = `${WHERE} AND ${WINDOW}`;

// HogQL applies its own LIMIT when a query omits one, and the default is 100
// rows. Measured 2026-09-13: the session roll-up returned 95 rows unlimited and
// 1,418 with a limit set, so every rate computed off it would have been a rate
// over the most recent hundred sessions while reading like a rate over all of
// them. A truncated result looks exactly like a small one — nothing in the
// response says it was cut — so the limit is explicit here and the client
// treats a full page as a failure rather than an answer.
export const ROW_LIMIT = 200000;
const LIMIT = `LIMIT ${ROW_LIMIT}`;

// ---------------------------------------------------------------------------
// Queries. Several metrics share one, deliberately: the session roll-up below
// feeds activation, card-open rate, qualified-action rate, organic share, reach,
// the daily counts and the Safari split, so those six cannot disagree about
// which sessions exist.
//
// No date arithmetic happens in SQL. HogQL's toDate() resolves in the PostHog
// project's timezone (UTC here), which put the product's busiest hours on the
// wrong day; day bucketing lives in days.js where a test can reach it.
// ---------------------------------------------------------------------------

export const QUERIES = {
  sessions: `
    SELECT
      distinct_id AS personId,
      JSONExtractString(properties,'$session_id') AS sessionId,
      min(timestamp) AS startedAt,
      argMin(JSONExtractString(properties,'src'), timestamp) AS src,
      argMin(JSONExtractString(properties,'$referring_domain'), timestamp) AS referrer,
      argMin(JSONExtractString(properties,'$geoip_subdivision_1_name'), timestamp) AS region,
      argMin(JSONExtractString(properties,'$geoip_city_name'), timestamp) AS city,
      argMin(JSONExtractString(properties,'$browser'), timestamp) AS browser,
      argMin(JSONExtractString(properties,'$device_type'), timestamp) AS device,
      countIf(event='$pageview') AS pageviews,
      countIf(event='card_open') AS cardOpens,
      countIf(event='action_tap') AS actionTaps,
      countIf(event='cta_tap') AS ctaTaps,
      countIf(event='today_toggle') AS todayToggles,
      countIf(event='filter_tap') AS filterTaps,
      countIf(event='pin_tap') AS pinTaps,
      countIf(event='$exception') AS exceptions
    FROM events
    WHERE ${WHERE}
    GROUP BY personId, sessionId
    ${LIMIT}`,

  filterTaps: `
    SELECT
      coalesce(nullIf(JSONExtractString(properties,'filter'),''),
               nullIf(JSONExtractString(properties,'filterId'),''), '?') AS lens,
      count() AS taps,
      count(DISTINCT distinct_id) AS people
    FROM events
    WHERE event='filter_tap' AND ${WHERE_WINDOWED}
    GROUP BY lens
    ORDER BY people DESC
    ${LIMIT}`,

  // The audit that must stay visible. Non-production traffic is never a metric,
  // but it is never silently discarded either — that is how it reached 34%.
  droppedHosts: `
    SELECT
      JSONExtractString(properties,'$host') AS host,
      count() AS events,
      count(DISTINCT distinct_id) AS people
    FROM events
    WHERE ${SRC_EXCL} AND NOT (${PROD_ONLY}) AND ${BOUND}
    GROUP BY host
    ORDER BY events DESC
    ${LIMIT}`,
};

export function bindQuery(sql, upperBound, lowerBound = null) {
  if (!sql.includes("{{upperBound}}")) throw new Error("query has no upper bound");
  if (sql.includes("{{lowerBound}}")) {
    if (!lowerBound) throw new Error("query needs a lower bound and none was given");
    sql = sql.replaceAll("{{lowerBound}}", lowerBound);
  }
  return sql.replaceAll("{{upperBound}}", upperBound);
}

// Which query a metric reads, and over what window. Exported so the puller
// never has to guess and the test can check the two agree.
export function queryWindow(def) {
  const sql = def.query ? QUERIES[def.query] : null;
  return { needsLowerBound: Boolean(sql?.includes("{{lowerBound}}")), windowDays: def.windowDays ?? null };
}

// ---------------------------------------------------------------------------
// The definitions.
// ---------------------------------------------------------------------------

export const METRIC_DEFS = [
  {
    id: "reach",
    windowDays: null,
    label: "People reached",
    source: "posthog",
    query: "sessions",
    compute: compute.reach,
    role: "cumulative reach",
    docRef: null, // a count, not a defined metric
    defVersion: "014ba3b6",
  },
  {
    id: "activation",
    windowDays: 7,
    label: "Activation rate",
    source: "posthog",
    query: "sessions",
    compute: compute.activationRate,
    role: "aha proxy",
    docRef: "≥2 `card_open` + 1 high-intent act, first session",
    caveat:
      "First-session, per growth-engine §3. Readings before 2026-09-13 were computed lifetime under this label and are not comparable.",
    defVersion: "68bb5397",
  },
  {
    id: "cardopen",
    windowDays: 7,
    label: "Card-open conversion",
    source: "posthog",
    query: "sessions",
    compute: compute.cardOpenRate,
    role: "funnel read (A1)",
    docRef: "visit → pin_tap/card_open → action_tap/",
    defVersion: "5898885f",
  },
  {
    id: "qar",
    windowDays: 7,
    label: "Qualified-action rate",
    source: "posthog",
    query: "sessions",
    compute: compute.qualifiedActionRate,
    role: "the action lens",
    docRef: "share of sessions taking ≥1 high-intent act",
    caveat: "Supporting line, never the gate.",
    defVersion: "43e56d0d",
  },
  {
    id: "organic",
    windowDays: 7,
    label: "Organic share",
    source: "posthog",
    query: "sessions",
    compute: compute.organicShare,
    role: "Loop C compounding metric",
    docRef: "share of new sessions with no `?src=` plus search/AI referrers",
    caveat:
      "Unreadable for 4 weeks after any broadcast seed (2026-08-15 label). Rana's posts on 2026-09-11 started that clock — not readable until ~2026-10-09.",
    defVersion: "13942cae",
  },
  {
    id: "safaribias",
    windowDays: 28,
    label: "Return rate by browser family",
    source: "posthog",
    query: "sessions",
    compute: compute.returnRateByBrowser,
    role: "sizes the Safari eviction undercount",
    docRef: null, // defined in the growth-weekly skill, not growth-engine.md
    defVersion: "8efe88d8",
  },
  {
    id: "lenspull",
    windowDays: 7,
    label: "Strongest lens by reach",
    source: "posthog",
    query: "filterTaps",
    compute: compute.lensPull,
    role: "which lens people actually pull",
    docRef: null,
    defVersion: "0cdc7f21",
  },
  {
    id: "digestreaders",
    windowDays: 7,
    label: "Digest readers by edition",
    source: "posthog",
    query: "sessions",
    compute: compute.digestReaders,
    role: "R1 numerator — segmented vs broadcast",
    docRef: "a reader is an arrival that produced at least one event beyond a pageview",
    caveat: "Recipients per edition come from `npm run digest:recipients`, not PostHog; the readout divides.",
    defVersion: "7ec63352",
  },
  {
    id: "signups",
    windowDays: null,
    label: "Signup list",
    source: "tally",
    query: null,
    compute: compute.signups,
    role: "R1 denominator",
    docRef: null,
    defVersion: "2810cd97",
  },
  {
    id: "feed",
    windowDays: null,
    label: "Dated items, next 7 days",
    source: "repo",
    query: null,
    compute: compute.feedDensity,
    role: "supply-side leading indicator",
    docRef: "verified, dated, still-upcoming items in the next 7 days",
    defVersion: "19191ac3",
  },
  {
    id: "reservoir",
    windowDays: null,
    label: "Reservoir, 7–14 days out",
    source: "repo",
    query: null,
    compute: compute.reservoirDepth,
    role: "says whether the peak survives",
    docRef: null,
    defVersion: "0e1cb9bc",
  },
  {
    id: "cards",
    windowDays: null,
    label: "Cards on the map",
    source: "repo",
    query: null,
    compute: compute.cardCount,
    role: "coverage",
    docRef: null,
    defVersion: "4a445aa9",
  },
  {
    id: "unique",
    windowDays: null,
    label: "Unique coverage",
    source: "repo",
    query: null,
    compute: compute.uniqueCoverageShare,
    role: "the differentiation proof",
    docRef: "a card whose only roster source is the venue/org itself counts",
    defVersion: "8afe7f07",
  },
];

// A definition's identity is its query plus its compute function. Change either
// and the hash moves, the test fails, and the bump has to be deliberate.
export function hashDef(def) {
  const sql = def.query ? QUERIES[def.query] : "";
  return createHash("sha256")
    .update(`${sql}\n${def.windowDays ?? "all"}\n${def.compute.toString()}`)
    .digest("hex")
    .slice(0, 8);
}

export const byId = (id) => METRIC_DEFS.find((d) => d.id === id);
