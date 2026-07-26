import test from "node:test";
import assert from "node:assert/strict";
import { FILTERS, matchesFilter, isActiveOn, sortTodayFirst, pinKind, isExpiredCard, groupByDay, liveFilterCounts, partitionFilters } from "./filterCards.js";
import { FILTER_IDS } from "./cardSchema.js";

test("FILTERS = 'all' + the IA re-cut's nine, in order, with display labels", () => {
  assert.equal(FILTERS[0].id, "all");
  assert.deepEqual(FILTERS.slice(1).map((f) => f.id), FILTER_IDS);
  // g_train filter removed 2026-07-23 (Batu: campaign-as-category was confusing)
  assert.equal(FILTERS.find((f) => f.id === "g_train"), undefined);
  // 2026-07-25 IA re-cut: events/services retired, deals+clubs merged, wellness+community in.
  assert.equal(FILTERS.find((f) => f.id === "events"), undefined);
  assert.equal(FILTERS.find((f) => f.id === "services"), undefined);
  // Third pass: new folded into news (one letter apart; data showed it was a
  // frozen launch-batch list, never a rotating "opened this week" lens).
  assert.equal(FILTERS.find((f) => f.id === "new"), undefined);
  assert.equal(FILTERS.find((f) => f.id === "food_drink").label, "Food & Drink");
  assert.equal(FILTERS.find((f) => f.id === "deals_memberships").label, "Deals & Memberships");
  assert.equal(FILTERS.find((f) => f.id === "wellness").label, "Wellness");
  assert.equal(FILTERS.find((f) => f.id === "community").label, "Community");
  assert.equal(FILTERS.find((f) => f.id === "news").label, "News");
  assert.equal(FILTERS.find((f) => f.id === "live_music").label, "Live Music");
});

test("matchesFilter: 'all' passes everything; others check authored membership", () => {
  const card = { filters: ["news", "food_drink"] };
  assert.ok(matchesFilter(card, "all"));
  assert.ok(matchesFilter(card, "news"));
  assert.ok(matchesFilter(card, "food_drink"));
  assert.ok(!matchesFilter(card, "deals_memberships"));
  // Lens-less one-offs (2026-07-25): visible under All, matched by no lens.
  assert.ok(matchesFilter({ filters: [] }, "all"));
  assert.ok(!matchesFilter({ filters: [] }, "wellness"));
});

test("isActiveOn: undated cards always pass; dated cards pass only inside their window", () => {
  const jul2 = new Date("2026-07-02T12:00:00-04:00");
  const jul8 = new Date("2026-07-08T12:00:00-04:00");
  const undated = {};
  const tasting = { startsAt: "2026-07-02T18:00:00-04:00", endsAt: "2026-07-02T20:00:00-04:00" };
  const openEnded = { endsAt: "2026-07-19T23:59:00-04:00" };
  assert.ok(isActiveOn(undated, jul2));
  assert.ok(isActiveOn(tasting, jul2), "same-day event active on its day (even before start time)");
  assert.ok(!isActiveOn(tasting, jul8), "past event inactive");
  assert.ok(isActiveOn(openEnded, jul8), "running series active before endsAt");
  assert.ok(!isActiveOn(openEnded, new Date("2026-07-25T12:00:00-04:00")), "series over");
});

test("FILTERS[0] label is All", () => {
  assert.deepEqual(FILTERS[0], { id: "all", label: "All" });
});

test("sortTodayFirst: today's time-specific events lead, then live windows, then the rest (stable)", () => {
  const jul2 = new Date("2026-07-02T12:00:00-04:00");
  const shopA = { id: "shop-a" };
  const shopB = { id: "shop-b" };
  const tasting = { id: "tasting", startsAt: "2026-07-02T18:00:00-04:00", endsAt: "2026-07-02T20:00:00-04:00" };
  const series = { id: "series", startsAt: "2026-06-11T00:00:00-04:00", endsAt: "2026-07-19T23:59:00-04:00" };
  const openEnded = { id: "open", endsAt: "2026-07-19T23:59:00-04:00" };
  const notYet = { id: "not-yet", startsAt: "2026-07-04T00:00:00-04:00", endsAt: "2026-07-12T23:59:00-04:00" };
  const sorted = sortTodayFirst([shopA, notYet, openEnded, series, tasting, shopB], jul2);
  // tasting (2h) < open-ended (~30d constant) < series (38d window); undated +
  // not-yet-started keep authored order at the back
  assert.deepEqual(sorted.map((c) => c.id), ["tasting", "open", "series", "shop-a", "not-yet", "shop-b"]);
});

test("pinKind maps categories to the six pin treatments", () => {
  assert.equal(pinKind({ category: "new_business" }), "business");
  assert.equal(pinKind({ category: "service" }), "business");
  assert.equal(pinKind({ category: "event" }), "event");
  assert.equal(pinKind({ category: "subscription" }), "club");
  assert.equal(pinKind({ category: "g_train_support" }), "gtrain");
  assert.equal(pinKind({ category: "civic_action" }), "gtrain");
  assert.equal(pinKind({ category: "support_local" }), "gtrain");
  assert.equal(pinKind({ category: "discount" }), "deal");
  assert.equal(pinKind({ category: "news" }), "news");
});

test("groupByDay: calendar scan — Today, Tomorrow, dated days, then Ongoing (2026-07-15 review)", () => {
  const wed = new Date("2026-07-15T12:00:00-04:00");
  const shop = { id: "shop" };
  const club = { id: "club", category: "discount", recurring: true, endsAt: "2026-07-22T23:59:00-04:00" };
  const runningSeries = { id: "series", startsAt: "2026-07-01T00:00:00-04:00", endsAt: "2026-07-19T23:59:00-04:00" };
  const thuLate = { id: "thu-late", startsAt: "2026-07-16T19:00:00-04:00", endsAt: "2026-07-16T23:59:00-04:00" };
  const thuEarly = { id: "thu-early", startsAt: "2026-07-16T17:30:00-04:00", endsAt: "2026-07-16T23:59:00-04:00" };
  const sat = { id: "sat", startsAt: "2026-07-18T00:00:00-04:00", endsAt: "2026-07-18T23:59:00-04:00" };
  const groups = groupByDay([shop, sat, thuLate, club, runningSeries, thuEarly], wed);
  assert.deepEqual(groups.map((g) => g.label), [
    "Today · Wed, Jul 15",
    "Tomorrow · Thu, Jul 16",
    "Sat, Jul 18",
    "Ongoing",
  ]);
  assert.deepEqual(groups[0].cards.map((c) => c.id), ["series"], "running window is live today");
  assert.deepEqual(groups[1].cards.map((c) => c.id), ["thu-early", "thu-late"], "within a day: earliest first");
  assert.deepEqual(groups[3].cards.map((c) => c.id), ["shop", "club"], "undated + recurring deals trail as Ongoing");
});

// 2026-07-25 user feedback: under the News lens, real news read below the
// folded-in business openings — a pure array-order accident, since both are
// undated and Ongoing otherwise keeps insertion order. news/g_train_support
// category cards now sort first within Ongoing, everything else keeps its
// relative order after (stable partition, not a full re-sort).
test("groupByDay: within Ongoing, news/g_train category cards sort before everything else", () => {
  const wed = new Date("2026-07-25T12:00:00-04:00");
  const opening1 = { id: "opening-1", category: "new_business" };
  const realNews = { id: "real-news", category: "news" };
  const opening2 = { id: "opening-2", category: "food_drink" };
  const gtrainHub = { id: "gtrain-hub", category: "g_train_support" };
  const groups = groupByDay([opening1, realNews, opening2, gtrainHub], wed);
  const ongoing = groups.find((g) => g.key === "ongoing");
  assert.deepEqual(ongoing.cards.map((c) => c.id), ["real-news", "gtrain-hub", "opening-1", "opening-2"]);
});

// 2026-07-22 UX eval (F4): the live Today group scanned 5 PM → 10 AM → 7 PM,
// because in-window series cards sort by their ORIGINAL startsAt date. Within
// Today, order must follow today's clock. 2026-07-24 user feedback: untimed
// cards (the 00:00 sentinel = "no stated clock") must TRAIL the timed
// schedule, not lead it — they're "often evening, or at least not morning",
// and sorting them first silently claims morning.
test("groupByDay: Today sorts by today's clock; untimed cards trail the timed schedule", () => {
  const wed = new Date("2026-07-22T08:00:00-04:00");
  const series5pm = { id: "series-5pm", startsAt: "2026-07-07T17:00:00-04:00", endsAt: "2026-08-31T23:59:00-04:00" };
  const today10am = { id: "today-10am", startsAt: "2026-07-22T10:00:00-04:00", endsAt: "2026-07-22T11:00:00-04:00" };
  const today7pm = { id: "today-7pm", startsAt: "2026-07-22T19:00:00-04:00", endsAt: "2026-07-22T22:00:00-04:00" };
  const allDay = { id: "all-day", startsAt: "2026-07-22T00:00:00-04:00", endsAt: "2026-07-22T23:59:00-04:00" };
  const groups = groupByDay([series5pm, today7pm, allDay, today10am], wed);
  assert.equal(groups[0].key, "today");
  assert.deepEqual(
    groups[0].cards.map((c) => c.id),
    ["today-10am", "series-5pm", "today-7pm", "all-day"],
    "10 AM, 5 PM (series), 7 PM, then the untimed card",
  );
});

test("groupByDay: untimed cards trail on future days too", () => {
  const wed = new Date("2026-07-22T08:00:00-04:00");
  const friUntimed = { id: "fri-untimed", startsAt: "2026-07-24T00:00:00-04:00", endsAt: "2026-07-24T23:59:00-04:00" };
  const friNoon = { id: "fri-noon", startsAt: "2026-07-24T12:00:00-04:00", endsAt: "2026-07-24T14:00:00-04:00" };
  const groups = groupByDay([friUntimed, friNoon], wed);
  assert.deepEqual(groups[0].cards.map((c) => c.id), ["fri-noon", "fri-untimed"]);
});

test("groupByDay: an all-undated layer is a single Ongoing group", () => {
  const groups = groupByDay([{ id: "a" }, { id: "b" }], new Date("2026-07-15T12:00:00-04:00"));
  assert.equal(groups.length, 1);
  assert.equal(groups[0].key, "ongoing");
});

// Community alert (DECISION_LOG 2026-07-26): while the campaign runs, its
// card leads the feed in its own group — ahead of Today.
test("groupByDay: pinnedId hoists the alert card into a leading 'Neighborhood needs you' group", () => {
  const cards = [{ id: "a" }, { id: "pin-me" }];
  const groups = groupByDay(cards, new Date("2026-07-26T12:00:00-04:00"), "pin-me");
  assert.equal(groups[0].key, "pinned");
  assert.equal(groups[0].label, "Neighborhood needs you");
  assert.deepEqual(groups[0].cards.map((c) => c.id), ["pin-me"]);
  assert.ok(!groups.some((g) => g.key !== "pinned" && g.cards.some((c) => c.id === "pin-me")));
});

test("groupByDay: no pinnedId, or an id not in the deck, changes nothing", () => {
  const cards = [{ id: "a" }];
  const now = new Date("2026-07-26T12:00:00-04:00");
  assert.deepEqual(groupByDay(cards, now), groupByDay(cards, now, "ghost"));
  assert.ok(!groupByDay(cards, now).some((g) => g.key === "pinned"));
});

// 2026-07-21 live-page regression: an event that ended Jul 20 survived to
// Jul 21 (ingest is weekly) and regrouped under its stale START day, sorting
// ABOVE Today. Any dated card with a passed window must vanish at render time.
test("isExpiredCard: any past-endsAt card expires; open windows and undated cards never do", () => {
  const jul15 = new Date("2026-07-15T12:00:00-04:00");
  const liveDeal = { category: "discount", endsAt: "2026-07-20T23:59:00-04:00" };
  const deadDeal = { category: "discount", endsAt: "2026-07-10T23:59:00-04:00" };
  const pastEvent = { category: "event", endsAt: "2026-07-10T23:59:00-04:00" };
  const liveEvent = { category: "event", startsAt: "2026-07-06T00:00:00-04:00", endsAt: "2026-07-20T23:59:00-04:00" };
  assert.ok(!isExpiredCard(liveDeal, jul15));
  assert.ok(isExpiredCard(deadDeal, jul15));
  assert.ok(isExpiredCard(pastEvent, jul15), "expired events must vanish, not wait for the weekly refresh");
  assert.ok(!isExpiredCard(liveEvent, jul15), "a window still open is live");
  assert.ok(!isExpiredCard({ category: "new_business" }, jul15), "undated cards never expire");
  assert.ok(!isExpiredCard({ category: "news", startsAt: "2026-07-01T00:00:00-04:00" }, jul15), "no endsAt → never expires");
});

// 2026-07-23 (UX eval F16, decision B): thin layers fold into a "More" chip
// until the weekly ingest stocks them — a 2-card Deals chip promising a full
// shelf reads as breakage.
test("liveFilterCounts counts only non-expired cards per authored filter", () => {
  const now = new Date("2026-07-23T12:00:00-04:00");
  const cards = [
    { filters: ["deals_memberships"], endsAt: "2026-07-25T23:59:00-04:00" },
    { filters: ["deals_memberships"], endsAt: "2026-07-10T23:59:00-04:00" }, // expired
    { filters: ["live_music", "deals_memberships"] },
    { filters: ["live_music"] },
  ];
  const counts = liveFilterCounts(cards, now);
  assert.equal(counts.deals_memberships, 2);
  assert.equal(counts.live_music, 2);
  assert.equal(counts.news, undefined);
});

test("partitionFilters: 'all' always shows; layers under the threshold fold", () => {
  const filters = [
    { id: "all", label: "All" },
    { id: "live_music", label: "Live Music" },
    { id: "deals_memberships", label: "Deals & Memberships" },
    { id: "wellness", label: "Wellness" },
  ];
  const { shown, folded } = partitionFilters(filters, { live_music: 27, deals_memberships: 2, wellness: 2 }, 5);
  assert.deepEqual(shown.map((f) => f.id), ["all", "live_music"]);
  assert.deepEqual(folded.map((f) => f.id), ["deals_memberships", "wellness"]);
});

// 2026-07-24 user feedback: "same day events that are past its start time
// should be removed." Cards whose endsAt is only the day-end sentinel (no
// sourced end time) used to linger until midnight; they now expire one hour
// after their stated start. A sourced real end keeps exact expiry; all-day
// cards (00:00 start sentinel) and multi-day windows are untouched.
test("isExpiredCard: a started sentinel-end event leaves the feed an hour past its start", () => {
  const show = { startsAt: "2026-07-24T19:00:00-04:00", endsAt: "2026-07-24T23:59:00-04:00" };
  assert.ok(!isExpiredCard(show, new Date("2026-07-24T18:00:00-04:00")), "before start: live");
  assert.ok(!isExpiredCard(show, new Date("2026-07-24T19:45:00-04:00")), "grace window: still joinable");
  assert.ok(isExpiredCard(show, new Date("2026-07-24T20:01:00-04:00")), "an hour past start: gone");
});

test("isExpiredCard: real end times, all-day cards, and multi-day windows keep their expiry", () => {
  const timedEnd = { startsAt: "2026-07-24T19:00:00-04:00", endsAt: "2026-07-24T22:00:00-04:00" };
  assert.ok(!isExpiredCard(timedEnd, new Date("2026-07-24T21:30:00-04:00")), "sourced end wins over grace");
  const allDay = { startsAt: "2026-07-24T00:00:00-04:00", endsAt: "2026-07-24T23:59:00-04:00" };
  assert.ok(!isExpiredCard(allDay, new Date("2026-07-24T21:00:00-04:00")), "no start claim, no start-based expiry");
  const series = { startsAt: "2026-07-20T19:00:00-04:00", endsAt: "2026-07-27T23:59:00-04:00" };
  assert.ok(!isExpiredCard(series, new Date("2026-07-24T21:00:00-04:00")), "multi-day sentinel window untouched");
  const recurring = { recurring: true, startsAt: "2026-07-24T19:00:00-04:00", endsAt: "2026-07-24T23:59:00-04:00" };
  assert.ok(!isExpiredCard(recurring, new Date("2026-07-24T21:00:00-04:00")), "recurring cards never start-expire");
});
