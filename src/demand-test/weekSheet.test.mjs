import test from "node:test";
import assert from "node:assert/strict";

// The printed/screenshotted week (D5, 2026-08-17). One build-time page that
// serves three channels at once — a sheet handed person-to-person at the
// markets, a screenshot for group chats, and the source image for the IG
// carousel. It exists because the physical channel (D4) is otherwise an hour
// of layout every Monday, and because a link cannot travel into a group chat
// as an image while a screenshot can.
//
// Attribution note that shapes the whole design: a printed sheet's URL gets
// TYPED, and a typed URL loses its ?src=. So the sheet leads with a short
// vanity path (stoopwise.com/market) that redirects to the tagged link — the
// only way hand-to-hand distribution stays measurable.

const day = (iso) => new Date(iso);

const cards = [
  {
    id: "a-today-morning",
    title: "Preschool Story Time",
    locationName: "Greenpoint Library",
    startsAt: "2026-08-18T10:00:00-04:00",
    endsAt: "2026-08-18T11:00:00-04:00",
    filters: ["family_kids"],
    free: true,
  },
  {
    id: "b-today-evening",
    title: "Sunset Yoga",
    locationName: "Transmitter Park",
    startsAt: "2026-08-18T17:00:00-04:00",
    endsAt: "2026-08-18T18:00:00-04:00",
    filters: ["wellness"],
  },
  {
    id: "c-friday",
    title: "SummerStarz: Zootopia 2",
    locationName: "WNYC Transmitter Park",
    startsAt: "2026-08-21T20:00:00-04:00",
    endsAt: "2026-08-21T22:00:00-04:00",
    filters: ["family_kids"],
    free: true,
  },
  {
    id: "d-far-future",
    title: "CBGB Festival",
    locationName: "Under the K Bridge",
    startsAt: "2026-09-26T14:00:00-04:00",
    filters: ["live_music"],
  },
  {
    id: "e-undated",
    title: "Some shop that is always open",
    locationName: "Manhattan Ave",
    filters: ["shopping"],
  },
];

test("the sheet carries this week's dated events, in day order, and nothing else", async () => {
  const { weekSheetGroups } = await import("./weekSheet.js");
  const groups = weekSheetGroups(cards, day("2026-08-18T09:00:00-04:00"));
  const ids = groups.flatMap((g) => g.cards.map((c) => c.id));

  // Undated cards are the shelf, not the week — a printed sheet is a schedule.
  assert.ok(!ids.includes("e-undated"), "undated card must not reach the sheet");
  // Beyond the 7-day horizon is next month's problem; the sheet is this week.
  assert.ok(!ids.includes("d-far-future"), "out-of-window card must not reach the sheet");
  assert.deepEqual(ids, ["a-today-morning", "b-today-evening", "c-friday"]);

  // Within a day, earlier sittings first — a sheet is read top to bottom.
  assert.equal(groups[0].cards[0].id, "a-today-morning");
  assert.ok(groups[0].label.length > 0);
});

// REGRESSION (caught on this sheet's first real render, 2026-08-17). The rows
// originally called formatWindow, which states a whole span — so under the
// heading "Tue, Aug 18" a weekly yoga card printed "Aug 4, 7:00 AM → Aug 25".
// That is the 2026-08-13 drift class returning through a new surface: a day
// header carries the date, a row carries the clock, and re-deriving that per
// caller is what made two surfaces tell different stories about one window.
// The sheet now shares `rowTime` with the app's feed.
test("a row under a day heading prints a clock, never a span", async () => {
  const { weekSheetHtml } = await import("./weekSheet.js");
  const spanning = [
    {
      id: "weekly-yoga",
      title: "Morning yoga",
      locationName: "Transmitter Park",
      startsAt: "2026-08-18T07:00:00-04:00",
      endsAt: "2026-08-25T08:00:00-04:00",
      filters: ["wellness"],
    },
  ];
  const html = weekSheetHtml(spanning, "https://stoopwise.com", day("2026-08-18T06:00:00-04:00"));
  assert.ok(html.includes("7 AM"), "the sitting clock must print");
  assert.ok(!html.includes("→"), "no span arrow under a day heading");
  assert.ok(!/Aug\s*25/.test(html), "the span's far end must not appear in a row");
});

// An all-day card (00:00 sentinel) states no clock. It must print no time at
// all rather than a fabricated "12 AM" — the same rule the feed rows follow.
test("an all-day card prints no fake clock", async () => {
  const { weekSheetHtml } = await import("./weekSheet.js");
  const allDay = [
    {
      id: "all-day",
      title: "Open Studios",
      locationName: "Greenpoint",
      startsAt: "2026-08-18T00:00:00-04:00",
      endsAt: "2026-08-18T23:59:00-04:00",
      filters: ["arts_culture"],
    },
  ];
  const html = weekSheetHtml(allDay, "https://stoopwise.com", day("2026-08-18T06:00:00-04:00"));
  assert.ok(html.includes("Open Studios"), "the card still prints");
  assert.ok(!/12\s*AM/.test(html), "no fabricated midnight clock");
});

test("an empty week yields no groups rather than an empty scaffold", async () => {
  const { weekSheetGroups } = await import("./weekSheet.js");
  // The density floor (D2) says a thin week is skipped, never dressed up.
  // The builder must make that state legible instead of printing a headed
  // sheet with nothing under the headings.
  assert.deepEqual(weekSheetGroups([], day("2026-08-18T09:00:00-04:00")), []);
  assert.deepEqual(
    weekSheetGroups([cards[4]], day("2026-08-18T09:00:00-04:00")),
    [],
  );
});

test("the sheet HTML is self-contained, printable, and carries the typeable URL", async () => {
  const { weekSheetHtml } = await import("./weekSheet.js");
  const html = weekSheetHtml(cards, "https://stoopwise.com", day("2026-08-18T09:00:00-04:00"), {
    vanityPath: "/market",
  });

  // Self-contained: a printed page and a CSP-restricted context both forbid
  // external fetches, so styles ride inline and no script is needed at all.
  assert.ok(html.includes("<style>"), "styles must be inline");
  assert.ok(!/<script/i.test(html), "the sheet must need no JS to render");
  assert.ok(!/https?:\/\/(?!stoopwise\.com)/.test(html.replace(/stoopwise\.com/g, "stoopwise.com")),
    "no external asset hosts");

  // The typeable URL is the attribution path for hand-to-hand distribution.
  assert.ok(html.includes("stoopwise.com/market"), "vanity URL must be printed");

  // Print rules: the sheet must not waste a page on chrome.
  assert.ok(html.includes("@media print"), "must carry print styles");

  // Content actually made it in.
  assert.ok(html.includes("Preschool Story Time"));
  assert.ok(html.includes("Greenpoint Library"));
  assert.ok(html.includes("SummerStarz"));
  assert.ok(!html.includes("CBGB"), "out-of-window content must not print");

  // Escaping: a title with markup must not become markup.
  const nasty = [{ ...cards[0], title: 'Story <script>alert("x")</script> Time' }];
  const escaped = weekSheetHtml(nasty, "https://stoopwise.com", day("2026-08-18T09:00:00-04:00"));
  assert.ok(!/<script/i.test(escaped), "card text must be escaped");
});
