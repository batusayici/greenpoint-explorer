import test from "node:test";
import assert from "node:assert/strict";
import {
  SEND_TARGETS,
  countForVenue,
  countForLens,
  countForCards,
  assessSend,
} from "./sendPreflight.js";

const NOW = new Date("2026-08-13T12:00:00-04:00");

// Minimal card: only the fields a send count reads.
const card = (id, over = {}) => ({
  id,
  locationName: "Greenpoint Library",
  filters: [],
  ...over,
});

test("counts a venue's cards: total, dated, in-window, and how far out it runs", () => {
  const cards = [
    card("venue"), // undated place card — real, but not a dated program
    card("today", { startsAt: "2026-08-13T18:00:00-04:00" }),
    card("in6", { startsAt: "2026-08-19T18:00:00-04:00" }),
    card("far", { startsAt: "2026-08-26T18:00:00-04:00" }), // dated, outside 7d
    card("elsewhere", { locationName: "Film Noir Cinema", startsAt: "2026-08-14T18:00:00-04:00" }),
  ];
  const c = countForVenue(cards, "Greenpoint Library", NOW);
  assert.equal(c.total, 4);
  assert.equal(c.dated, 3);
  assert.equal(c.inWindow, 2);
  assert.equal(c.through, "2026-08-26");
  assert.deepEqual(c.inWindowIds, ["today", "in6"]);
});

// The hand-rolled version of this check matched ids with a regex. A regex over
// /craft/i would also claim a card at "Greenpoint Craft Bar" as Brooklyn Craft
// Company's — and an org note that overstates its own listings is exactly the
// kind of unverified claim the truth rules exist to stop.
test("venue match is exact, not fuzzy", () => {
  const cards = [
    card("real", { startsAt: "2026-08-14T18:00:00-04:00" }),
    card("near-miss", {
      locationName: "Greenpoint Library Annex",
      startsAt: "2026-08-14T18:00:00-04:00",
    }),
  ];
  const c = countForVenue(cards, "Greenpoint Library", NOW);
  assert.equal(c.total, 1);
  assert.deepEqual(c.inWindowIds, ["real"]);
});

test("counts a lens the same way", () => {
  const cards = [
    card("a", { filters: ["family_kids"], startsAt: "2026-08-14T18:00:00-04:00" }),
    card("b", { filters: ["family_kids", "food_drink"] }), // undated but on the lens
    card("c", { filters: ["food_drink"], startsAt: "2026-08-14T18:00:00-04:00" }),
  ];
  const c = countForLens(cards, "family_kids", NOW);
  assert.equal(c.total, 2);
  assert.equal(c.inWindow, 1);
});

// The reason this module exists rather than a one-off grep: the number in a
// draft is true on the morning it is generated and can be false the next day.
// Reporting tomorrow's count alongside today's turns "regenerate before you
// send" from a discipline into a fact the operator can read.
test("reports what drops out of the window if the send slips a day", () => {
  const cards = [
    card("tonight", { startsAt: "2026-08-13T18:00:00-04:00" }),
    card("later", { startsAt: "2026-08-19T18:00:00-04:00" }),
  ];
  const c = countForVenue(cards, "Greenpoint Library", NOW);
  assert.equal(c.inWindow, 2);
  assert.equal(c.inWindowTomorrow, 1);
  assert.deepEqual(c.droppingAfterToday, ["tonight"]);
});

test("an ongoing span counts while it runs", () => {
  const cards = [
    card("span", {
      startsAt: "2026-08-01T09:00:00-04:00",
      endsAt: "2026-08-30T17:00:00-04:00",
    }),
  ];
  const c = countForVenue(cards, "Greenpoint Library", NOW);
  assert.equal(c.inWindow, 1);
  assert.equal(c.through, "2026-08-30");
});

test("assessSend covers every channel-links src that carries a count", () => {
  const report = assessSend([], { now: NOW });
  const srcs = report.targets.map((t) => t.src);
  for (const t of SEND_TARGETS) assert.ok(srcs.includes(t.src), `missing ${t.src}`);
  // An empty deck is a real state (a checkout before ingest) — report zeros
  // rather than crash, so the operator sees "0" and knows not to send.
  assert.equal(report.targets[0].total, 0);
  assert.equal(report.targets[0].through, null);
});

// 2026-08-15 (adversarial review, finding M5): an org whose cards span venues
// (Town Square BK produces at Transmitter Park) can't count by locationName —
// a venue match would inflate the count with unrelated cards at the same
// venue, the one direction an org note must never be wrong in. The `cards`
// kind counts an explicit id list instead, so card-level claims ("Friday's
// screening is on it") get the same machine preflight as counts.
test("counts an explicit card list, and an expired list reports zero in-window", () => {
  // Local clock: the send window under review (Mon 8/17 send, Fri 8/21 claim).
  const SEND_NOW = new Date("2026-08-17T10:00:00-04:00");
  const cards = [
    card("summerstarz", {
      locationName: "WNYC Transmitter Park",
      startsAt: "2026-08-21T20:00:00-04:00",
      endsAt: "2026-08-21T23:00:00-04:00",
    }),
    card("unrelated-at-same-venue", {
      locationName: "WNYC Transmitter Park",
      startsAt: "2026-08-18T18:00:00-04:00",
    }),
  ];
  const c = countForCards(cards, ["summerstarz"], SEND_NOW);
  assert.equal(c.total, 1);
  assert.equal(c.inWindow, 1);
  assert.equal(c.through, "2026-08-21");
  // After the claim's card leaves the deck, the count is loudly zero —
  // the script's total===0 failure blocks the send.
  const gone = countForCards([], ["summerstarz"], SEND_NOW);
  assert.equal(gone.total, 0);
});

test("assessSend dispatches the cards kind", () => {
  const deck = [
    card("summerstarz-zootopia-0821", {
      locationName: "WNYC Transmitter Park",
      startsAt: "2026-08-21T20:00:00-04:00",
    }),
  ];
  const report = assessSend(deck, { now: new Date("2026-08-17T10:00:00-04:00") });
  const tsbk = report.targets.find((t) => t.src === "org-town-square");
  assert.ok(tsbk, "org-town-square must be a preflight target");
  assert.equal(tsbk.total, 1);
  assert.equal(tsbk.inWindow, 1);
});

// 2026-08-19 (Finding 1, cycle-5 readout): the sitemap drift check compared
// prod's sitemap (which renders only liveCards) against deckSize (every card,
// including news past its 30-day shelf life that we deliberately never
// delete). A news-heavy deck therefore drifts the check into a false
// do-not-send on every send, worst on the morning of the send itself.
// liveDeckSize is the number the sitemap check must compare against instead.
test("liveDeckSize excludes news cards past their 30-day shelf life; deckSize does not", () => {
  const NOW = new Date("2026-08-19T12:00:00-04:00");
  const deck = [
    card("fresh-news", { category: "news", createdAt: "2026-08-10T00:00:00-04:00" }),
    card("stale-news", { category: "news", createdAt: "2026-07-01T00:00:00-04:00" }),
    card("undated-event", {}),
  ];
  const report = assessSend(deck, { now: NOW });
  assert.equal(report.deckSize, 3);
  assert.equal(report.liveDeckSize, 2);
});
