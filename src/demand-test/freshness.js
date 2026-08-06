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
  const windows = [];
  for (const spanDays of [7, 14]) {
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
    datedUpcoming,
    reach,
    verifiedThrough: lastRunAt ?? null,
  };
}
