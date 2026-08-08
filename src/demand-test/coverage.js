// L12 coverage reconciliation (Batu, 2026-08-07) — the pure half.
//
// WHY THIS EXISTS. Every other supply guard reads `cards.json`: thinFeed,
// reservoir7-14d, the trend alarm, the concentration guard. Not one reads the
// SNAPSHOTS. So "the source published it and we did not card it" is invisible
// to all of them by construction — and on 2026-08-06/07 that one failure wore
// four costumes: an empty back-of-window while troost.txt held 38 uncarded
// nights; a venue cap suppressing 5 of Troost's 7 nights; four static-schedule
// venues dark for a week; and Brew Inn held for an address that was in the
// snapshot all along. Every one was caught by a human eyeballing a venue
// calendar next to the app.
//
// It lives HERE, not in scripts/, because `npm test` only runs
// `src/**/*.test.mjs`. The first version of this shipped as a script with zero
// tests — and six bugs were found in it by hand in a single afternoon, one of
// which (UTC day rollover) would have caused six DUPLICATE cards rather than
// failing loudly. A checker nobody can regression-test is a liability, so every
// one of those six is a test case in coverage.test.mjs.

// EVERY day key is America/New_York, never UTC. toISOString() rolls an 8pm EDT
// event onto the NEXT day. BUG 3 of 6.
const NY_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
});
export const nyDay = (d) => NY_DAY.format(d instanceof Date ? d : new Date(d));

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const pad = (n) => String(n).padStart(2, "0");
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

// Lines keyed as an END field are dropped before parsing. A Google Calendar
// all-day event stores an EXCLUSIVE end date, so Troost's 8/11 gig carries
// `end.date: 2026-08-12` and a naive scan invents a phantom 8/12 gap — the
// exact trap the extraction prompt warns subagents about. BUG 2 of 6.
// A start date identifies an event; an end date never does.
const END_LINE_RE = /^\s*(?:"?)(end[._-]?date|end_?at|ds_event_end_date|endDate|until)(?:"?)\s*[:=]/i;
const stripEndLines = (text) => text.split("\n").filter((l) => !END_LINE_RE.test(l)).join("\n");

export const RECURRING_RE =
  /\b(every\s+(?:mon|tues|wednes|thurs|fri|satur|sun)day|weekly|(?:mon|tues|wednes|thurs|fri|satur|sun)days)\b/i;

// Year inference for formats that omit it ("Saturday, Aug 1", "Fri. 8/14"):
// pick the year putting the date nearest today, so a bare "Jan 3" in December
// means next year rather than eleven months ago.
function inferYear(month, day, now) {
  const y = Number(nyDay(now).slice(0, 4));
  return [y - 1, y, y + 1]
    .map((yy) => ({ yy, d: Math.abs(Date.parse(`${iso(yy, month, day)}T12:00:00-04:00`) - now.getTime()) }))
    .reduce((a, b) => (b.d < a.d ? b : a)).yy;
}

// Deliberately several patterns: the roster spans ISO APIs, Squarespace JSON,
// Google Calendar, WordPress directories and hand-written HTML. A format we
// cannot parse yields 0 dates, which the report must read as "no signal",
// NEVER as "no supply".
export function extractDates(raw, { now, windowDays = 14 } = {}) {
  const text = stripEndLines(raw);
  const from = nyDay(now);
  const to = nyDay(new Date(now.getTime() + windowDays * 864e5));
  const out = new Set();

  for (const m of text.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)) out.add(iso(+m[1], +m[2], +m[3]));
  for (const m of text.matchAll(/\b([A-Z][a-z]{2})[a-z]*\.?\s+(\d{1,2}),?\s+(20\d{2})\b/g)) {
    const mo = MONTHS[m[1].toLowerCase()];
    if (mo) out.add(iso(+m[3], mo, +m[2]));
  }
  for (const m of text.matchAll(/\b(?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day,?\s+([A-Z][a-z]{2})[a-z]*\.?\s+(\d{1,2})\b/g)) {
    const mo = MONTHS[m[1].toLowerCase()];
    if (mo) out.add(iso(inferYear(mo, +m[2], now), mo, +m[2]));
  }
  for (const m of text.matchAll(/\b(\d{1,2})\/(\d{1,2})\b(?!\/)/g)) {
    const mo = +m[1], da = +m[2];
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) out.add(iso(inferYear(mo, da, now), mo, da));
  }
  return [...out].filter((d) => d >= from && d <= to).sort();
}

const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } };

// host -> SET of source ids, never one. Four NYC Parks pages share
// nycgovparks.org and both Hana pages share hanamakgeolli.com; a
// Map<host,id> silently kept the LAST and reported "deck covers 0" for real,
// well-covered sources. BUG 1 of 6. The set over-credits a sibling page, which
// is the right way to be wrong: a false GAP burns the reviewer's trust, and
// this check is worth nothing once it cries wolf.
export function buildHostMap(sources) {
  const m = new Map();
  const put = (h, id) => {
    const k = h.replace(/^www\./, "");
    if (!m.has(k)) m.set(k, new Set());
    m.get(k).add(id);
  };
  for (const s of sources) {
    for (const u of [s.url, ...(s.urls ?? [])]) { const h = hostOf(u); if (h) put(h, s.id); }
    for (const h of [].concat(s.citeHost ?? [])) put(h, s.id);
  }
  return m;
}

// Which roster sources does this card credit? Shared by coverage and the pulse
// below — they MUST attribute identically, or a card that clears a GAP could
// still leave its source SILENT. Inherits the deliberate over-crediting of
// shared-host siblings: a false SILENT burns trust exactly like a false GAP.
export function cardSourceIds(card, hostMap) {
  const hosts = new Set();
  for (const l of card.sourceLinks ?? []) { const h = hostOf(l.url); if (h) hosts.add(h); }
  for (const a of card.actions ?? []) { const h = hostOf(a.url); if (h) hosts.add(h); }
  return new Set([...hosts].flatMap((h) => [...(hostMap.get(h) ?? [])]));
}

export function coveredDays(cards, hostMap, { now }) {
  const out = new Map();
  for (const c of cards) {
    const ids = cardSourceIds(c, hostMap);
    if (ids.size === 0) continue;

    const days = new Set();
    let s = c.startsAt ? new Date(c.startsAt) : null;
    const e = c.endsAt ? new Date(c.endsAt) : s;

    // An UNDATED `subscription` card is how this project models a standing
    // relationship — "recurring clubs/memberships -> subscription" is the
    // skill's own rule, and `last-place-chess-chill` (chess every Tuesday) or
    // `yaro-kids-clay-lab` (Wednesdays 3-5pm) are the shape. It has no dates
    // BECAUSE it is open-ended, so it speaks for the whole window. Skipping
    // undated cards made three correctly-represented sources look dark on the
    // first run of the UNMARKED STANDING signal. BUG 7 of 7.
    //
    // Deliberately NOT extended to undated place/venue cards: `black-rabbit`
    // has one, and it must never mask that venue's weekly trivia going dark.
    if (!s && !e && c.category === "subscription") {
      for (let i = 0; i <= 14; i++) days.add(nyDay(new Date(now.getTime() + i * 864e5)));
      for (const id of ids) {
        if (!out.has(id)) out.set(id, new Set());
        for (const d of days) out.get(id).add(d);
      }
      continue;
    }
    // An END-ONLY card is a standing offer ("verified through …") with no start
    // because it has run for months. It speaks for every day from now to its
    // verified-through date. Without this the checker demanded a fresh card for
    // every Thursday hana-bottomless-makgeolli already accounts for. BUG 4 of 6.
    if (!s && e) s = now < e ? now : e;
    if (s && e) for (let t = new Date(s); t <= e; t = new Date(t.getTime() + 864e5)) days.add(nyDay(t));
    if (c.recurring && s && e) {
      for (let t = new Date(s); t <= e; t = new Date(t.getTime() + 7 * 864e5)) days.add(nyDay(t));
    }
    for (const id of ids) {
      if (!out.has(id)) out.set(id, new Set());
      for (const d of days) out.get(id).add(d);
    }
  }
  return out;
}

// Per-source pulse (2026-08-08) — lastCardedAt, persisted in the ledger.
// `cards.json` alone cannot answer "when did this source last yield a card":
// ingest:expire DELETES expired cards, so a source whose last card aged out
// looks never-carded. The pulse is therefore MONOTONE — max(stored, observed),
// never lowered, never deleted — and seeding is free: the first run against an
// empty pulse backfills from the current deck's createdAt.
export function updatePulse({ sources, cards, pulse = {} }) {
  const hostMap = buildHostMap(sources);
  const next = { ...pulse };
  for (const c of cards) {
    const day = c.createdAt ? nyDay(c.createdAt) : null;
    if (!day) continue;
    for (const id of cardSourceIds(c, hostMap)) {
      if (!next[id] || next[id] < day) next[id] = day;
    }
  }
  return next;
}

// Silence threshold: three missed cycles. Weekly → 21d (tolerates one quiet
// week plus one thin run); monthly → 90d, which also absorbs monthly sources
// being fetched only on first-Monday runs (skipped_monthly otherwise).
export const CADENCE_DAYS = { weekly: 7, monthly: 30 };
export const SILENCE_MULTIPLIER = 3;

const daysBetween = (fromDay, toDay) =>
  Math.round((Date.parse(`${toDay}T12:00:00-04:00`) - Date.parse(`${fromDay}T12:00:00-04:00`)) / 864e5);

// snapshots: Map<sourceId, text|null>. null = no snapshot on disk.
// pulse: srcId -> "YYYY-MM-DD" lastCardedAt (see updatePulse).
// explanations: [{sourceId, gapKey, reason, addedAt, expiresAt}] — a live entry
// whose gapKey matches the row's state marks it `explained`. Explanations
// ANNOTATE, never suppress: explained rows still report, so a rubber-stamp is
// at least visible in every run. gapKey is the state string, not a dates hash —
// dates roll daily and a hash would void every explanation every run; the
// coarser match is bounded by expiresAt (SKILL rule: default ≤ 14 days).
export function reconcile({ sources, cards, snapshots, now, windowDays = 14, pulse = {}, explanations = [] }) {
  const hostMap = buildHostMap(sources);
  const covered = coveredDays(cards, hostMap, { now });
  const today = nyDay(now);
  const live = explanations.filter((e) => e.expiresAt && today <= e.expiresAt);
  const rows = [];

  const finish = (row) => {
    const match = live.find((e) => e.sourceId === row.id && e.gapKey === row.state);
    rows.push({ ...row, explained: !!match, ...(match ? { explanation: match } : {}) });
  };

  for (const s of sources) {
    const lastCardedAt = pulse[s.id] ?? null;
    const text = snapshots.get(s.id);
    if (text == null) { finish({ id: s.id, state: "NO SNAPSHOT", lastCardedAt }); continue; }

    const srcDates = extractDates(text, { now, windowDays });
    const mine = covered.get(s.id) ?? new Set();
    const missing = srcDates.filter((d) => !mine.has(d));
    const recurringText = RECURRING_RE.test(text);
    const dark = mine.size === 0 && recurringText && srcDates.length === 0;

    // `standing` is deliberately THREE-state, so this signal converges to zero
    // instead of becoming permanent noise:
    //   true      — standing programming; a missing card is STANDING DARK
    //   false     — reviewed, the recurring phrase is incidental (bin-bin-sake's
    //               "shipments go out every Thursday" is a SHIPPING line)
    //   undefined — never reviewed, so ask: UNMARKED STANDING?
    let state = "ok";
    if (dark && s.standing === false) state = "ok";
    else if (dark && s.standing) state = "STANDING DARK";
    // A source nobody marked `standing` that states recurring programming,
    // publishes no dated items and has no cards is the EXACT pre-fix shape of
    // Black Rabbit, Brew Inn, Hide & Seek and Scrappleland — which went dark
    // for a week classified as "quiet". Gating the signal on the flag left that
    // bug re-armed for every source added in future, so it is reported without
    // the flag too, one tier softer because incidental "every Thursday" prose
    // (bin-bin-sake's SHIPPING line, BUG 6 of 6) lands here as well.
    else if (dark) state = "UNMARKED STANDING?";
    else if (missing.length) state = "GAP";
    else if (srcDates.length === 0 && mine.size === 0) state = "quiet";

    // SILENT: the source HAS carded before, then stopped for > 3 cycles. Checked
    // only where the row would otherwise pass (an existing flagged state is
    // already actionable and must not be renamed) AND the deck currently carries
    // nothing for it — if mine.size > 0 a live card speaks for the source right
    // now, and calling that silence would be a contradiction.
    //
    // A source with NO pulse entry is never SILENT — it is "never carded",
    // reported as an info line off `lastCardedAt: null`, not a state: 8 roster
    // sources are cited through hosts the roster doesn't declare yet (citeHost
    // fixes are a separate roster PR), and a permanent false SILENT for each
    // would be the cry-wolf failure this whole file guards against. The line
    // converges on its own the day attribution lands.
    if ((state === "ok" || state === "quiet") && mine.size === 0 && lastCardedAt) {
      const threshold = SILENCE_MULTIPLIER * (CADENCE_DAYS[s.cadence] ?? CADENCE_DAYS.weekly);
      if (daysBetween(lastCardedAt, today) > threshold) state = "SILENT";
    }

    finish({
      id: s.id, state, srcCount: srcDates.length, coveredCount: mine.size, missing,
      standing: !!s.standing, lastCardedAt,
    });
  }
  return rows;
}

export const FLAGGED_STATES = ["GAP", "STANDING DARK", "UNMARKED STANDING?", "NO SNAPSHOT", "SILENT"];
export const isFlagged = (r) => FLAGGED_STATES.includes(r.state);
// The ship-decision predicate (--gate in check-coverage.mjs): a flagged row
// with no live matching explanation disqualifies auto-ship. NEVER CARDED is
// not flagged, so it can never trip this.
export const isUnexplained = (r) => isFlagged(r) && !r.explained;
