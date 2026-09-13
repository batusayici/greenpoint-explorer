import test from "node:test";
import assert from "node:assert/strict";

import { nyDay, nyDayStart, nextDay, sameWeekdayBefore } from "./days.js";
import {
  activationRate,
  lifetimeActivationRate,
  cardOpenRate,
  qualifiedActionRate,
  organicShare,
  reach,
  dailyCounts,
  returnRateByBrowser,
  lensPull,
  signups,
  firstSessions,
  isLocal,
} from "./compute.js";

const session = (over = {}) => ({
  personId: "p1",
  sessionId: "s1",
  startedAt: "2026-09-11T18:00:00Z",
  src: null,
  referrer: null,
  region: "New York",
  city: "Brooklyn",
  browser: "Chrome",
  pageviews: 1,
  cardOpens: 0,
  actionTaps: 0,
  ctaTaps: 0,
  todayToggles: 0,
  ...over,
});

test("New York day boundary: an evening-ET event belongs to that evening", () => {
  // 03:30 UTC on the 12th is 23:30 on the 11th in New York. This is the exact
  // shape of the bug: PostHog's own toDate() called this Sep 12, which moved 54
  // people off Friday and 46 off Saturday in the 2026-09-13 pull.
  assert.equal(nyDay("2026-09-12T03:30:00Z"), "2026-09-11");
  assert.equal(nyDay("2026-09-12T04:30:00Z"), "2026-09-12");
});

test("nyDayStart lands on midnight New York, in both DST halves", () => {
  assert.equal(nyDayStart("2026-09-12").toISOString(), "2026-09-12T04:00:00.000Z"); // EDT
  assert.equal(nyDayStart("2026-01-15").toISOString(), "2026-01-15T05:00:00.000Z"); // EST
  for (const day of ["2026-09-12", "2026-01-15", "2026-03-08", "2026-11-01"]) {
    assert.equal(nyDay(nyDayStart(day)), day, `${day} starts on its own day`);
    assert.notEqual(nyDay(new Date(nyDayStart(day).getTime() - 1)), day);
  }
});

test("nextDay and sameWeekdayBefore cross a DST change without slipping", () => {
  assert.equal(nextDay("2026-03-07"), "2026-03-08");
  assert.equal(nextDay("2026-12-31"), "2027-01-01");
  assert.equal(sameWeekdayBefore("2026-09-12"), "2026-09-05");
  assert.equal(sameWeekdayBefore("2026-03-14"), "2026-03-07"); // spans the spring change
  assert.equal(sameWeekdayBefore("2026-09-12", 2), "2026-08-29");
});

test("activation counts the first session only, and differs from lifetime", () => {
  // The person who splits the behaviour across two sessions is the whole point:
  // 2 opens on Friday, an action tap on Saturday. Lifetime says activated; the
  // doc's first-session definition says no.
  const split = [
    session({ personId: "split", sessionId: "a", startedAt: "2026-09-11T18:00:00Z", cardOpens: 2 }),
    session({ personId: "split", sessionId: "b", startedAt: "2026-09-12T18:00:00Z", actionTaps: 1 }),
  ];
  // The person who does it all in one sitting activates under both.
  const single = [
    session({ personId: "single", sessionId: "c", cardOpens: 2, todayToggles: 1 }),
  ];
  const sessions = [...split, ...single];

  assert.equal(activationRate(sessions).n, 0.5, "1 of 2 people on first session");
  assert.equal(activationRate(sessions).display, "50.0% (1 of 2)");
  assert.equal(lifetimeActivationRate(sessions).n, 1, "2 of 2 people lifetime");
});

test("activation needs two opens, not one", () => {
  const sessions = [session({ cardOpens: 1, actionTaps: 5 })];
  assert.equal(activationRate(sessions).n, 0);
});

test("activation needs a high-intent act, and any of the three counts", () => {
  assert.equal(activationRate([session({ cardOpens: 9 })]).n, 0, "opens alone is not activation");
  for (const act of ["actionTaps", "ctaTaps", "todayToggles"]) {
    assert.equal(
      activationRate([session({ cardOpens: 2, [act]: 1 })]).n,
      1,
      `${act} is a high-intent act`,
    );
  }
  // pin_tap and filter_tap are deliberately NOT in the set.
  assert.equal(activationRate([session({ cardOpens: 2, pinTaps: 4, filterTaps: 4 })]).n, 0);
});

test("firstSessions breaks ties on session id so reruns agree", () => {
  const tied = [
    session({ personId: "p", sessionId: "zzz", startedAt: "2026-09-11T18:00:00Z" }),
    session({ personId: "p", sessionId: "aaa", startedAt: "2026-09-11T18:00:00Z" }),
  ];
  assert.equal(firstSessions(tied)[0].sessionId, "aaa");
  assert.equal(firstSessions([...tied].reverse())[0].sessionId, "aaa");
});

test("card-open rate is per person, qualified-action rate is per session", () => {
  const sessions = [
    session({ personId: "a", sessionId: "1", cardOpens: 3, actionTaps: 1 }),
    session({ personId: "a", sessionId: "2", cardOpens: 0 }),
    session({ personId: "b", sessionId: "3", cardOpens: 0 }),
  ];
  assert.equal(cardOpenRate(sessions).display, "50.0% (1 of 2)", "1 of 2 people opened a card");
  assert.equal(
    qualifiedActionRate(sessions).display,
    "33.3% (1 of 3)",
    "1 of 3 sessions had a high-intent act",
  );
});

test("empty input never renders NaN", () => {
  for (const fn of [activationRate, cardOpenRate, qualifiedActionRate, organicShare]) {
    const out = fn([]);
    assert.equal(out.n, 0, `${fn.name} n`);
    assert.ok(!out.display.includes("NaN"), `${fn.name} display: ${out.display}`);
    assert.match(out.display, /^no .+ yet$/, `${fn.name} says why it is empty`);
  }
  assert.equal(lensPull([]).display, "no filter taps yet");
});

test("organic excludes both tagged links and social referrers", () => {
  const sessions = [
    session({ personId: "tagged", src: "parents" }),
    session({ personId: "fb", referrer: "l.facebook.com" }),
    session({ personId: "ig", referrer: "l.instagram.com" }),
    session({ personId: "search", referrer: "www.google.com" }),
    session({ personId: "typed", referrer: null }),
  ];
  // Search and direct are organic; the group post and its echo are not.
  assert.equal(organicShare(sessions).display, "40.0% (2 of 5)");
});

test("locals are NY/NJ/CT, which is also what keeps data centres out", () => {
  assert.ok(isLocal(session({ region: "New York" })));
  assert.ok(isLocal(session({ region: "New Jersey" })));
  // Boardman OR and Clonee, Leinster are AWS regions — ~50 of the 638 in the
  // Sep 11-13 wave. They are not readers and must not reach a denominator.
  assert.ok(!isLocal(session({ region: "Oregon" })));
  assert.ok(!isLocal(session({ region: "Leinster" })));
  assert.ok(!isLocal(session({ region: null })));
});

test("reach reports people and the local subset", () => {
  const sessions = [
    session({ personId: "a", region: "New York" }),
    session({ personId: "a", sessionId: "2", region: "New York" }),
    session({ personId: "b", region: "Oregon" }),
  ];
  assert.equal(reach(sessions).n, 2);
  assert.equal(reach(sessions).display, "2 people · 1 in NY/NJ/CT");
});

test("daily counts bucket by New York day, not UTC", () => {
  const sessions = [
    session({ personId: "a", sessionId: "1", startedAt: "2026-09-12T03:30:00Z", cardOpens: 2 }),
    session({ personId: "b", sessionId: "2", startedAt: "2026-09-12T18:00:00Z" }),
  ];
  const days = dailyCounts(sessions);
  assert.deepEqual(
    days.map((d) => d.day),
    ["2026-09-11", "2026-09-12"],
    "the 03:30Z session is Thursday night in New York",
  );
  assert.equal(days[0].cardOpens, 2);
});

test("return rate splits Safari from the rest", () => {
  const sessions = [
    session({ personId: "s", sessionId: "1", browser: "Mobile Safari", startedAt: "2026-09-11T18:00:00Z" }),
    session({ personId: "c", sessionId: "2", browser: "Chrome", startedAt: "2026-09-11T18:00:00Z" }),
    session({ personId: "c", sessionId: "3", browser: "Chrome", startedAt: "2026-09-12T18:00:00Z" }),
  ];
  const out = returnRateByBrowser(sessions);
  assert.equal(out.display, "Safari 0 of 1 (0%) · other 1 of 1 (100%)");
  assert.ok(out.n < 0, "a negative gap means Safari under-reports, which is the point");
});

test("signups count people, not submissions, and note who chose a lens", () => {
  const out = signups([
    { email: "a@example.com", follow: "lens:family_kids" },
    { email: "a@example.com", follow: "all" }, // the 2026-09-11 duplicate
    { email: "b@example.com", follow: "lens:family_kids" },
  ]);
  assert.equal(out.n, 2, "two people, three submissions");
  assert.equal(out.display, "2 people · 2 chose a lens");
});
