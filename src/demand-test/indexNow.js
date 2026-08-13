// Which URLs an IndexNow ping should announce (2026-08-13).
//
// Lives here rather than in scripts/ping-indexnow.mjs for the reason the
// coverage reconciliation moved into coverage.js (DECISION_LOG 2026-08-12):
// logic in a script is logic `npm test` cannot see, and this particular logic
// has already been wrong once in production.
//
// WHAT WENT WRONG, both halves worth keeping:
//
// 1. The first version used a WALL-CLOCK window — cards updated in the last two
//    days. Content changes come from ingest runs, not from deploys, so every
//    deploy inside that window re-announced the same set. Five deploys on
//    2026-08-13 sent the identical 53 URLs; the second one came back
//    403 Forbidden, and a script designed never to fail the build swallowed it.
//
// 2. The obvious fix — compare `updatedAt` against the ledger's `lastRunAt` —
//    is broken in a way that LOOKS right. `updatedAt` is DATE-ONLY
//    ("2026-08-13"); `Date.parse` reads that as UTC midnight, while lastRunAt
//    is a real instant (09:30 NY = 13:30 UTC). Same-day updates therefore sort
//    BEFORE the run that produced them. Measured before shipping: 0 of 159
//    cards matched. It would have announced nothing, forever, silently.
//
// So the comparison is by DAY, as strings. ISO date strings sort
// lexicographically, which is the same trick eventWindow.js uses for its day
// keys and is immune to both timezone drift and midnight-boundary parsing.
const NY_DAY = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "America/New_York",
});

// "2026-08-13" for an instant, in the zone the cards are authored in.
export const nyDayKey = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : NY_DAY.format(d);
};

// Cards whose day-stamp is on or after the last ingest run. A code-only deploy
// — no ingest since the last one — yields an EMPTY list, which is the point:
// nothing changed, so there is nothing to announce.
//
// `fallbackDays` covers a ledger with no lastRunAt (first run, or a hand-built
// tree); it is a floor, never the primary signal.
export function cardsToAnnounce(cards, { lastRunAt, now = new Date(), fallbackDays = 1 } = {}) {
  const runDay = lastRunAt ? nyDayKey(lastRunAt) : null;
  const cutoffDay =
    runDay ?? nyDayKey(new Date(now.getTime() - fallbackDays * 86400000));
  if (!cutoffDay) return [];
  return cards.filter((c) => {
    // Date-only in the data; tolerate a full timestamp by taking its day.
    const day = String(c.updatedAt ?? c.createdAt ?? "").slice(0, 10);
    return day !== "" && day >= cutoffDay;
  });
}
