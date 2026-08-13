import test from "node:test";
import assert from "node:assert/strict";
import {
  SEND_TARGETS,
  countForVenue,
  countForLens,
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
