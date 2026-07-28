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

export function assessFreshness({ lastRunAt, now, cards, maxAgeHours = 48, minDatedUpcoming = 10 }) {
  const runDate = lastRunAt ? new Date(lastRunAt) : null;
  const staleIngest =
    !runDate || Number.isNaN(runDate.getTime()) || now.getTime() - runDate.getTime() > maxAgeHours * 3600 * 1000;
  const datedUpcoming = cards.filter((c) => upcomingWithin7Days(c, now)).length;
  const thinFeed = datedUpcoming < minDatedUpcoming;
  return {
    fresh: !staleIngest && !thinFeed,
    staleIngest,
    thinFeed,
    datedUpcoming,
    verifiedThrough: lastRunAt ?? null,
  };
}
