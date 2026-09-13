// Pure metric functions. No network, no clock, no file reads — every one takes
// rows and returns { n, display }.
//
// They live here rather than in scripts/ because `npm test` is
// `TZ=America/New_York node --test "src/**/*.test.mjs"`, so scripts/ is
// untested. The whole point of this module is that a definition cannot drift
// without a test failing, which only holds where the test runner can see it.
//
// The definitions themselves are quoted from docs/growth/growth-engine.md in
// metricDefs.js. Change one here and the test that checks the quoted phrase
// against the doc is what catches it.

import { nyDay } from "./days.js";
import { upcomingWithin7Days, assessReservoir } from "../demand-test/freshness.js";
import { uniqueCoverage } from "../demand-test/coverage.js";

// The aha-proxy act set, growth-engine.md §3: "action_tap, cta_tap,
// today_toggle; calendar adds ride action_tap".
export const HIGH_INTENT = ["actionTaps", "ctaTaps", "todayToggles"];

// Batu, 2026-09-13: it does not matter whether a reader is local, only whether
// they are a real person. Counting NY/NJ/CT was the wrong cut — locals engage at
// 45% and everyone else at 11%, but the five people in Istanbul engage at 80%
// and are obviously real.
//
// Geography was doing one useful job though: keeping machines out. So this list
// replaces it, and it names TOWNS THAT ARE ESSENTIALLY DATA CENTRES rather than
// anywhere far away. Boardman, Oregon has a population around 3,500 and sent 51
// "people" who have never tapped anything; Council Bluffs is Google, Clonee and
// Luleå and Forest City are Facebook, Falkenstein is Hetzner.
//
// Real cities stay in even when they look quiet — Paris sent 27 people at 0%
// and Ashburn sent 7 at 43%, and excluding a real place to tidy up a rate would
// be a worse error than counting a few machines. The bias is deliberate: keep a
// bot rather than drop a person.
//
// The pull prints how many people this removes each day, so the list going
// stale is visible rather than silent.
export const DATA_CENTRE_CITIES = new Set([
  "Boardman", // AWS us-west-2
  "Prineville", // Facebook / Apple
  "Eatonton", // AWS
  "Council Bluffs", // Google
  "Forest City", // Facebook
  "Clonee", // Facebook, Ireland
  "Luleå", // Facebook, Sweden
  "Falkenstein", // Hetzner
]);

const acts = (s) => HIGH_INTENT.reduce((t, k) => t + (s[k] ?? 0), 0);

export const isMachine = (s) => DATA_CENTRE_CITIES.has(s.city);

// Drop machines before anything is counted. Never filter on whether someone
// interacted: card-open rate and activation are measures OF interaction, so a
// denominator defined by interacting would make them true by construction.
export function realPeople(sessions) {
  return sessions.filter((s) => !isMachine(s));
}

const pct = (num, den) => (den ? num / den : 0);

// "44 of 641 (6.9%)" — den 0 renders as "no sessions yet", never NaN%.
function rate(num, den, noun) {
  if (!den) return { n: 0, display: `no ${noun} yet` };
  return {
    n: num / den,
    display: `${(100 * (num / den)).toFixed(1)}% (${num} of ${den})`,
  };
}

// One row per person: their earliest session, by start time. Ties break on
// session id so the result is stable across runs.
export function firstSessions(sessions) {
  const byPerson = new Map();
  for (const s of sessions) {
    const held = byPerson.get(s.personId);
    if (
      !held ||
      s.startedAt < held.startedAt ||
      (s.startedAt === held.startedAt && s.sessionId < held.sessionId)
    ) {
      byPerson.set(s.personId, s);
    }
  }
  return [...byPerson.values()];
}

// growth-engine.md §3: "≥2 card_open + 1 high-intent act, FIRST SESSION".
//
// posthog-pull.sh has always computed this lifetime per person with no session
// bound, so every activation number reported before 2026-09-13 is a lifetime
// rate wearing this label. Batu ruled on 2026-09-13 that the doc's definition
// is the real one. Measured that day: first-session 44 of 641, lifetime 50 of
// 634 — the gap widens as people accumulate repeat visits, so the two are not
// interchangeable even approximately.
export function activationRate(sessions) {
  const first = firstSessions(sessions);
  const activated = first.filter((s) => (s.cardOpens ?? 0) >= 2 && acts(s) >= 1);
  return rate(activated.length, first.length, "first sessions");
}

// Kept only so a readout can state both while the change is fresh, and so the
// test can prove the two differ on the fixture. Never label this "activation".
export function lifetimeActivationRate(sessions) {
  const byPerson = new Map();
  for (const s of sessions) {
    const t = byPerson.get(s.personId) ?? { opens: 0, acts: 0 };
    t.opens += s.cardOpens ?? 0;
    t.acts += acts(s);
    byPerson.set(s.personId, t);
  }
  const people = [...byPerson.values()];
  return rate(people.filter((p) => p.opens >= 2 && p.acts >= 1).length, people.length, "people");
}

// Share of people who opened at least one card. The funnel read (A1).
export function cardOpenRate(sessions) {
  const byPerson = new Map();
  for (const s of sessions) {
    byPerson.set(s.personId, (byPerson.get(s.personId) ?? 0) + (s.cardOpens ?? 0));
  }
  const opens = [...byPerson.values()];
  return rate(opens.filter((n) => n >= 1).length, opens.length, "people");
}

// growth-engine.md: "share of SESSIONS taking ≥1 high-intent act". Per session,
// not per person — and the doc is explicit that this is "never the gate".
export function qualifiedActionRate(sessions) {
  return rate(sessions.filter((s) => acts(s) >= 1).length, sessions.length, "sessions");
}

// growth-engine.md: "share of new sessions with no ?src= plus search/AI
// referrers, read monthly". A lens, not a bar — and unreadable for 4 weeks
// after any broadcast post (the 2026-08-15 contamination label). Rana's posts
// on 2026-09-11 started that clock, so this is not readable until ~2026-10-09.
const SEEDED_REFERRERS = /facebook|instagram|linkedin|t\.co|twitter|reddit/i;

export function organicShare(sessions) {
  const first = firstSessions(sessions);
  const organic = first.filter(
    (s) => !s.src && !(s.referrer && SEEDED_REFERRERS.test(s.referrer)),
  );
  return rate(organic.length, first.length, "new sessions");
}

// Unique people. Machines are already gone by the time this runs; where someone
// is does not change whether they count.
export function reach(sessions) {
  const people = new Set(sessions.map((s) => s.personId));
  return { n: people.size, display: `${people.size} people` };
}

// People and card opens per New York day. Feeds the `counts` block in the
// snapshot, which exists so a question like "what happened Friday" is a file
// read rather than another one-off query.
export function dailyCounts(sessions) {
  const byDay = new Map();
  for (const s of sessions) {
    const day = nyDay(s.startedAt);
    const t = byDay.get(day) ?? { people: new Set(), sessions: 0, cardOpens: 0, acts: 0 };
    t.people.add(s.personId);
    t.sessions += 1;
    t.cardOpens += s.cardOpens ?? 0;
    t.acts += acts(s);
    byDay.set(day, t);
  }
  return [...byDay.entries()]
    .map(([day, t]) => ({
      day,
      people: t.people.size,
      sessions: t.sessions,
      cardOpens: t.cardOpens,
      acts: t.acts,
    }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

// Return rate split by browser family. Safari evicts the retention sensor's
// storage at roughly our own cadence, so this sizes an undercount we chose to
// measure rather than paper over with a cookie. It can only depress a demand
// read, never flatter it.
export function returnRateByBrowser(sessions) {
  const byPerson = new Map();
  for (const s of sessions) {
    const t = byPerson.get(s.personId) ?? { browser: s.browser, days: new Set() };
    t.days.add(nyDay(s.startedAt));
    byPerson.set(s.personId, t);
  }
  let safari = { returned: 0, total: 0 };
  let other = { returned: 0, total: 0 };
  for (const p of byPerson.values()) {
    const bucket = /safari/i.test(p.browser ?? "") ? safari : other;
    bucket.total += 1;
    if (p.days.size > 1) bucket.returned += 1;
  }
  const s = pct(safari.returned, safari.total);
  const o = pct(other.returned, other.total);
  return {
    n: s - o,
    display:
      `Safari ${safari.returned} of ${safari.total} (${(100 * s).toFixed(0)}%) · ` +
      `other ${other.returned} of ${other.total} (${(100 * o).toFixed(0)}%)`,
  };
}

// Which lens people actually pull, by distinct people rather than taps.
export function lensPull(filterRows) {
  const sorted = [...filterRows].sort((a, b) => b.people - a.people);
  if (sorted.length === 0) return { n: 0, display: "no filter taps yet" };
  return {
    n: sorted[0].people,
    display: sorted
      .slice(0, 3)
      .map((r) => `${r.lens} ${r.people}`)
      .join(" · "),
  };
}

// --- supply side -----------------------------------------------------------
//
// These four are the ones the cockpit is currently wrong about: it reads 198
// cards against a deck of 252, because they were last typed in on 9/8 and the
// deck has been rebuilt since. They are cheap to compute and were only ever
// stale because nothing computed them.

// growth-engine.md: "verified, dated, still-upcoming items in the next 7 days".
export function feedDensity(cards, { now }) {
  const dated = cards.filter((c) => upcomingWithin7Days(c, now)).length;
  return { n: dated, display: `${dated} dated in the next 7 days` };
}

export function reservoirDepth(cards, { now }) {
  const { datedReservoir } = assessReservoir(cards, { now });
  return { n: datedReservoir, display: `${datedReservoir} dated 7–14 days out` };
}

export function cardCount(cards) {
  return { n: cards.length, display: `${cards.length} cards` };
}

// growth-engine.md: items carried by at least one non-aggregator source — the
// measurable form of "we index what the newsletters miss". Computed by
// importing uniqueCoverage() rather than shelling out to check-coverage.mjs,
// which rewrites ingest-ledger.json as a side effect of reporting.
export function uniqueCoverageShare(cards) {
  const { unique, total, share } = uniqueCoverage(cards);
  return { n: share, display: `${unique} of ${total} (${(100 * share).toFixed(0)}%)` };
}

// Tally signups. The only return path that exists: 19 people took it in the
// three days after Rana's posts, against 5 in the two months before.
export function signups(submissions) {
  const emails = new Set(submissions.map((s) => s.email).filter(Boolean));
  const segmented = submissions.filter((s) => s.follow && s.follow !== "all").length;
  return {
    n: emails.size,
    display: `${emails.size} people · ${segmented} chose a lens`,
  };
}
