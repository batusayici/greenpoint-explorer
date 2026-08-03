// L11 (DECISION_LOG 2026-07-28, pressure-test fatal #2): a silently-failing
// ingest is indistinguishable from a quiet week — expiry keeps deleting while
// sources go unreachable, so the feed can empty itself with nothing
// complaining (it happened 2026-07-27/28). Two independent trips:
//
//   staleIngest — the ledger's lastRunAt is older than maxAgeHours (48h
//     spans a missed daily run plus slack; a missed Monday full run also
//     lands here by Wednesday).
//   thinFeed — dated, still-upcoming items in the next 7 days fall below
//     minDatedUpcoming (floor 10: baseline is 38 in-window (Jul 2026), a
//     January trough runs ~12–18, so 10 separates "winter" from "broken").
//
// L11b (2026-08-03 supply analysis) adds two more, fed by the optional
// fetch-sources report. thinFeed measures the deck *after* a run; these
// measure the run itself, and they trip a week earlier — the 8/3 Monday run
// could not reach 22 of 48 sources, shipped 3 cards, and was reported FRESH
// because the deck had not drained yet. It drained: 95 -> 75 over two weeks.
//
//   sourcesUnreachable — errored sources exceed maxErrorRate of those
//     attempted. A dead source or two is normal; a sixth of the roster is a
//     broken fetch layer wearing a quiet week's clothes.
//   browserFetchDown — at least one source needed headless Chromium and not
//     one browser fetch succeeded. That exact signature is a missing browser
//     or a blocked egress in the run's environment, never a quiet week.
//
// Consumed two ways: scripts/check-freshness.mjs (ops alarm, exits non-zero)
// and the banner slot ("verified through <date>" — honest degradation in the
// product instead of a feed that quietly lies about being current).

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function upcomingWithin7Days(card, now) {
  const start = card.startsAt ? new Date(card.startsAt) : null;
  const end = card.endsAt ? new Date(card.endsAt) : null;
  if (!start && !end) return false; // undated place/news cards aren't "upcoming"
  const horizon = new Date(now.getTime() + WEEK_MS);
  if (start && start >= now && start <= horizon) return true; // starts this week
  if (start && end && start <= now && end >= now) return true; // ongoing span
  if (!start && end && end >= now && end <= horizon) return true; // end-only (deal closing)
  return false;
}

// Reachability of the last fetch run, from .ingest-cache/changes.json. Returns
// null when no report is available, so callers that have no run to judge keep
// their previous behaviour rather than tripping on absent evidence.
export function assessReach(fetchReport, { maxErrorRate = 0.15 } = {}) {
  if (!fetchReport || !Array.isArray(fetchReport.sources)) return null;
  // Monthly sources are skipped by design on weekly runs — never attempted,
  // so counting them would dilute the rate and hide a real outage.
  const attemptedList = fetchReport.sources.filter((s) => s.status !== "skipped_monthly");
  const attempted = attemptedList.length;
  const errored = attemptedList.filter((s) => s.status === "error").length;
  const browserOk = attemptedList.some((s) => s.method === "browser");
  return {
    attempted,
    errored,
    errorRate: attempted === 0 ? 0 : errored / attempted,
    maxErrorRate,
    browserRequired: !!fetchReport.browserRequired,
    browserOk,
    generatedAt: fetchReport.generatedAt ?? null,
  };
}

export function assessFreshness({
  lastRunAt,
  now,
  cards,
  maxAgeHours = 48,
  minDatedUpcoming = 10,
  fetchReport = null,
  maxErrorRate = 0.15,
}) {
  const runDate = lastRunAt ? new Date(lastRunAt) : null;
  const staleIngest =
    !runDate || Number.isNaN(runDate.getTime()) || now.getTime() - runDate.getTime() > maxAgeHours * 3600 * 1000;
  const datedUpcoming = cards.filter((c) => upcomingWithin7Days(c, now)).length;
  const thinFeed = datedUpcoming < minDatedUpcoming;

  const reach = assessReach(fetchReport, { maxErrorRate });
  const sourcesUnreachable = !!reach && reach.attempted > 0 && reach.errorRate > reach.maxErrorRate;
  const browserFetchDown = !!reach && reach.browserRequired && !reach.browserOk;

  return {
    fresh: !staleIngest && !thinFeed && !sourcesUnreachable && !browserFetchDown,
    staleIngest,
    thinFeed,
    sourcesUnreachable,
    browserFetchDown,
    datedUpcoming,
    reach,
    verifiedThrough: lastRunAt ?? null,
  };
}
