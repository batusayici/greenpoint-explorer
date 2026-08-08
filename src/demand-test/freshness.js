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

// L11c (Batu, 2026-08-06, cycle-3 readout proposal 3): thinFeed is an absolute
// floor, so it cannot see a slide. The deck went 38 -> 27 dated-upcoming over
// two weeks and every check reported FRESH, because 27 > 10; it would keep
// saying FRESH down to 11. This compares like weekday with like weekday — the
// feed sawtooths by design (weekends are thin, 27 -> 38 -> 27 is normal), so a
// run-to-run comparison would fire on every ordinary trough. Returns null when
// there is no comparable prior run: absent evidence is not evidence of decline.
export function assessTrend(history, { now, current, minDropRatio = 0.2 } = {}) {
  if (!Array.isArray(history) || history.length === 0) return null;
  const byDate = new Map(history.filter((h) => h && h.date).map((h) => [h.date, h.datedUpcoming]));
  const dayMs = 24 * 3600 * 1000;
  // BOTH windows, not the first that matches. The decline this check exists to
  // catch was 38 -> 33 -> 27: roughly 15-18% per week, so a 20% week-over-week
  // bar would have missed it every single week while the feed lost a third of
  // its in-window items. Gradual decay IS the failure mode. The 14-day window
  // sees 38 -> 27 (29%) and fires. Same weekday either way — never an
  // arbitrary last run, because the feed sawtooths by design.
  // 7/14/21 and not a tolerance band: every span is a multiple of a week, so
  // the comparison stays same-weekday-to-same-weekday. A +/- 2 day tolerance
  // would fix the same blindness by comparing a Monday to a Saturday, which
  // is the false alarm this check was built to avoid. 21 buys two missed
  // record days before the alarm goes blind (2026-08-06: the 8/5 run shipped
  // 10 cards and recorded nothing, so the gap is not hypothetical).
  const windows = [];
  for (const spanDays of [7, 14, 21]) {
    const then = new Date(now.getTime() - spanDays * dayMs).toISOString().slice(0, 10);
    if (!byDate.has(then)) continue;
    const prior = byDate.get(then);
    if (!Number.isFinite(prior) || prior <= 0) continue;
    windows.push({ prior, priorDate: then, current, spanDays, dropRatio: (prior - current) / prior });
  }
  if (windows.length === 0) return null;
  // Report the window that fires; when none does, report the steepest so the
  // readout can see the direction of travel before it crosses.
  const firing = windows.filter((w) => w.dropRatio >= minDropRatio);
  const chosen = (firing.length ? firing : windows).reduce((a, b) => (b.dropRatio > a.dropRatio ? b : a));
  return { ...chosen, minDropRatio, decliningFeed: firing.length > 0 };
}

// L11d (2026-08-06 supply investigation): thinFeed and the trend both measure
// the window we are standing in. Neither can see that there is nothing behind
// it. On 2026-08-06 the feed held 27 dated-upcoming (floor 10, so FRESH) and
// exactly 2 cards dated past the horizon — 8/13 and 8/14 read zero — while
// `.ingest-cache/troost.txt` held 38 uncarded nights of an already-fetched
// Google Calendar. Every gate was green and the decline was already locked in:
// projected with zero adds, 27 -> 9 by 8/10.
//
// The reservoir IS next week's window, so it answers to the same floor. That
// makes a thin feed knowable a week before thinFeed can trip, and it is the
// signal the ratified 14-day fill rule is meant to keep above water.
export function assessReservoir(cards, { now, minReservoir = 10 } = {}) {
  const start = new Date(now.getTime() + WEEK_MS);
  const end = new Date(now.getTime() + 2 * WEEK_MS);
  const datedReservoir = cards.filter((c) => {
    const s = c.startsAt ? new Date(c.startsAt) : null;
    if (!s) return false; // an end-only deal is not forward event supply
    return s >= start && s <= end;
  }).length;
  return { datedReservoir, hollowReservoir: datedReservoir < minReservoir, minReservoir };
}

// L11e (Batu, 2026-08-07): replaces the per-venue count cap the 14-day fill
// rule shipped with. That cap was sized on a 26% estimate computed against the
// BROKEN 27-card window — the baseline the fill rule existed to repair — so it
// suppressed 5 of Troost's 7 nights to prevent a concentration the Library was
// already exceeding at 14%, uncapped, because grouped day-cards never counted.
//
// A share ceiling cannot be mis-sized by a bad baseline: it scales with the
// window. It also measures the thing anyone actually cares about — "is one
// venue swamping the feed" — rather than proxying it with a per-venue count
// that has to be re-tuned every time the window changes size.
export function assessConcentration(cards, { now, maxShare = 0.25 } = {}) {
  const win = cards.filter((c) => upcomingWithin7Days(c, now));
  if (win.length === 0) return null;
  const byVenue = new Map();
  for (const c of win) {
    const k = c.locationName || "(unknown)";
    byVenue.set(k, (byVenue.get(k) ?? 0) + 1);
  }
  const [topVenue, topCount] = [...byVenue.entries()].reduce((a, b) => (b[1] > a[1] ? b : a));
  const topShare = topCount / win.length;
  return { topVenue, topCount, windowSize: win.length, topShare, maxShare, over: topShare > maxShare };
}

export function assessFreshness({
  lastRunAt,
  now,
  cards,
  maxAgeHours = 48,
  minDatedUpcoming = 10,
  fetchReport = null,
  maxErrorRate = 0.15,
  history = null,
  minDropRatio = 0.2,
  minReservoir = 10,
  maxVenueShare = 0.25,
  datedUpcomingOverride = null,
}) {
  const runDate = lastRunAt ? new Date(lastRunAt) : null;
  const staleIngest =
    !runDate || Number.isNaN(runDate.getTime()) || now.getTime() - runDate.getTime() > maxAgeHours * 3600 * 1000;
  // datedUpcomingOverride exists for tests that need a specific deck size
  // without hand-building that many cards; production never passes it.
  const datedUpcoming =
    datedUpcomingOverride ?? cards.filter((c) => upcomingWithin7Days(c, now)).length;
  const thinFeed = datedUpcoming < minDatedUpcoming;
  const trend = assessTrend(history, { now, current: datedUpcoming, minDropRatio });
  const { datedReservoir, hollowReservoir } = assessReservoir(cards, { now, minReservoir });
  const concentration = assessConcentration(cards, { now, maxShare: maxVenueShare });

  const reach = assessReach(fetchReport, { maxErrorRate });
  const sourcesUnreachable = !!reach && reach.attempted > 0 && reach.errorRate > reach.maxErrorRate;
  const browserFetchDown = !!reach && reach.browserRequired && !reach.browserOk;

  // browserFetchDown is REPORTED but no longer decides freshness on its own
  // (2026-08-05). It earned that veto on 2026-08-03, when 22 of 48 sources were
  // browser-only and losing the browser meant losing ~46% of the roster. After
  // the feed/json migrations only a handful still need it, so the same signal
  // would now mark a run stale that read 42 of 48 sources. `sourcesUnreachable`
  // measures coverage directly — a failed browser source counts as an error
  // like any other — so it is the honest gate, and the fetch script's exit code
  // uses exactly the same rule.
  // decliningFeed is REPORTED and never gates `fresh` — the same call
  // browserFetchDown got above, for a stronger reason: JulyApp.jsx consumes
  // this for the CLIENT BANNER, so letting a supply trend gate `fresh` would
  // change what residents are told about the feed's honesty. A thinning roster
  // is an ops problem; the cards on the map are still true. It is also why
  // check-freshness.mjs warns on this without exiting non-zero.
  return {
    fresh: !staleIngest && !thinFeed && !sourcesUnreachable,
    staleIngest,
    thinFeed,
    sourcesUnreachable,
    browserFetchDown,
    decliningFeed: !!trend?.decliningFeed,
    trend,
    // hollowReservoir is REPORTED and never gates `fresh`, for the same reason
    // decliningFeed does not: JulyApp.jsx reads this for the client banner, and
    // an empty reservoir says nothing about whether the cards on the map are
    // true. It is an ops alarm for the ingest run, and check-freshness.mjs
    // warns on it without exiting non-zero.
    hollowReservoir,
    datedReservoir,
    // Same treatment again: reported, warned on, never gates `fresh`. A feed
    // leaning on one venue is an editorial problem; the cards on it are still
    // true, and `fresh` is what the client banner reads.
    concentration,
    overConcentrated: !!concentration?.over,
    datedUpcoming,
    reach,
    verifiedThrough: lastRunAt ?? null,
  };
}
