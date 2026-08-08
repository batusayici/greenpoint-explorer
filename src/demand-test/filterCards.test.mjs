import test from "node:test";
import assert from "node:assert/strict";
import { FILTERS, matchesFilter, isActiveOn, sortTodayFirst, pinKind, isExpiredCard, groupByDay, liveFilterCounts, partitionFilters, pickRelated, noTodayNotice, feedSignature } from "./filterCards.js";
import { FILTER_IDS } from "./cardSchema.js";

test("FILTERS = 'all' + the IA re-cut's nine, in order, with display labels", () => {
  assert.equal(FILTERS[0].id, "all");
  assert.deepEqual(FILTERS.slice(1).map((f) => f.id), FILTER_IDS);
  // g_train filter removed 2026-07-23 (Batu: campaign-as-category was confusing)
  assert.equal(FILTERS.find((f) => f.id === "g_train"), undefined);
  // 2026-07-25 IA re-cut: events/services retired, deals+clubs merged, wellness+civic in.
  assert.equal(FILTERS.find((f) => f.id === "events"), undefined);
  assert.equal(FILTERS.find((f) => f.id === "services"), undefined);
  // Third pass: new folded into news (one letter apart; data showed it was a
  // frozen launch-batch list, never a rotating "opened this week" lens).
  assert.equal(FILTERS.find((f) => f.id === "new"), undefined);
  assert.equal(FILTERS.find((f) => f.id === "food_drink").label, "Food & Drink");
  assert.equal(FILTERS.find((f) => f.id === "deals_memberships").label, "Deals & Memberships");
  assert.equal(FILTERS.find((f) => f.id === "wellness").label, "Wellness");
  assert.equal(FILTERS.find((f) => f.id === "news").label, "News");
  assert.equal(FILTERS.find((f) => f.id === "live_music").label, "Live Music");
  // 2026-08-02 launch IA: `games` in; `community` renamed to `civic` — first
  // the chip label, then the id itself the same day, so the UI, the card data
  // and the ingest rules all use one word.
  assert.equal(FILTERS.find((f) => f.id === "games").label, "Games");
  assert.equal(FILTERS.find((f) => f.id === "civic").label, "Civic");
  assert.equal(FILTERS.find((f) => f.id === "community"), undefined, "the old id is gone");
  assert.equal(FILTERS.find((f) => f.label === "Community"), undefined);
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
    "Deals",
    "Places",
  ]);
  assert.deepEqual(groups[0].cards.map((c) => c.id), ["series"], "running window is live today");
  assert.deepEqual(groups[1].cards.map((c) => c.id), ["thu-early", "thu-late"], "within a day: earliest first");
  // Both trail the calendar; the 2026-07-30 kind ranking that used to order one
  // anonymous "Ongoing" block now names each kind as its own section, so the
  // standing deal (rank 3) and the category-less place card (rank 5) separate.
  assert.deepEqual(groups[3].cards.map((c) => c.id), ["club"], "recurring deal → Deals");
  assert.deepEqual(groups[4].cards.map((c) => c.id), ["shop"], "category-less card → Places");
});

// 2026-08-02: the undated shelf was ONE group labelled "Ongoing" — 55 of 80
// live cards (69% of the page, 4.6 screens at 375px) under a header that names
// recency instead of subject, beginning 2.1 screens down. Every kind was
// already ranked (2026-07-30) and none of that ranking was legible. The shelf
// now renders as its six ranked kinds, each with its own header.
test("groupByDay: the undated shelf is six named sections in decay order, after every dated day", () => {
  const wed = new Date("2026-07-30T12:00:00-04:00");
  const cards = [
    { id: "place", category: "food_drink" },
    { id: "signup", category: "subscription" },
    { id: "news", category: "news" },
    { id: "ask", category: "civic_action" },
    { id: "offer", category: "discount" },
    { id: "programme", category: "event", recurring: true },
    { id: "dated", startsAt: "2026-07-31T19:00:00-04:00", endsAt: "2026-07-31T22:00:00-04:00" },
  ];
  const groups = groupByDay(cards, wed);
  assert.deepEqual(groups.map((g) => g.label), [
    "Tomorrow · Fri, Jul 31",
    "Civic",
    "News",
    "Every week",
    "Deals",
    "Memberships",
    "Places",
  ]);
  assert.deepEqual(groups.map((g) => g.key), [
    "d1",
    "shelf-asks", "shelf-changed", "shelf-weekly",
    "shelf-deals", "shelf-memberships", "shelf-places",
  ]);
  assert.deepEqual(
    groups.map((g) => g.shelf === true),
    [false, true, true, true, true, true, true],
    "the shelf flag is what suppresses a lone section's header in CardPanel",
  );
});

// Guards the ordering rewrite: "Ongoing" used to sort last via
// Number.POSITIVE_INFINITY, which a day offset could never reach. The shelf now
// carries small rank numbers, so day-vs-shelf must be its own sort key — a card
// a year out still belongs on the calendar, above the shelf.
test("groupByDay: a far-future day still precedes the shelf", () => {
  const wed = new Date("2026-07-30T12:00:00-04:00");
  const groups = groupByDay([
    { id: "place", category: "food_drink" },
    { id: "far", startsAt: "2027-09-01T19:00:00-04:00", endsAt: "2027-09-01T22:00:00-04:00" },
  ], wed);
  assert.deepEqual(groups.map((g) => g.key), ["d398", "shelf-places"]);
});

// SHELF_SECTIONS is indexed by ongoingRank. Adding a rank without a section
// would put `undefined.key` on the hot path and white-screen the feed, so the
// pairing is asserted rather than defended at runtime.
test("groupByDay: every rank has a section", async () => {
  const { ongoingRank, shelfSection } = await import("./filterCards.js");
  const cards = [
    { category: "civic_action" }, { category: "support_local" },
    { category: "news" }, { category: "g_train_support" },
    { category: "event", recurring: true }, { category: "discount" },
    { category: "subscription" }, { category: "new_business" },
    { category: "food_drink" }, { category: "service" },
    { category: "shopping" }, { category: "arts_culture" },
  ];
  const seen = new Set();
  for (const card of cards) {
    const section = shelfSection(card);
    assert.ok(section?.key && section?.label, `rank ${ongoingRank(card)} (${card.category}) has no section`);
    seen.add(ongoingRank(card));
  }
  assert.deepEqual([...seen].sort(), [0, 1, 2, 3, 4, 5], "every rank is exercised");
});

test("groupByDay: kinds with no cards produce no section", () => {
  const groups = groupByDay([{ id: "n", category: "news" }], new Date("2026-07-30T12:00:00-04:00"));
  assert.deepEqual(groups.map((g) => g.label), ["News"]);
});

// 2026-07-25 user feedback: under the News lens, real news read below the
// folded-in business openings — a pure array-order accident, since both are
// undated and Ongoing otherwise kept insertion order. That fix survives inside
// the 2026-07-30 kind ranking (Batu: "review & improve the default sorting rule
// for Ongoing"), which orders the whole undated shelf instead of just hoisting
// news out of it: asks → news → recurring programming → offers → signups →
// places, freshest first inside each kind.
test("groupByDay: news/g_train category cards section above places", () => {
  const wed = new Date("2026-07-25T12:00:00-04:00");
  const opening1 = { id: "opening-1", category: "new_business" };
  const realNews = { id: "real-news", category: "news" };
  const opening2 = { id: "opening-2", category: "food_drink" };
  const gtrainHub = { id: "gtrain-hub", category: "g_train_support" };
  const groups = groupByDay([opening1, realNews, opening2, gtrainHub], wed);
  assert.deepEqual(groups.map((g) => g.key), ["shelf-changed", "shelf-places"]);
  assert.deepEqual(groups[0].cards.map((c) => c.id), ["real-news", "gtrain-hub"]);
  assert.deepEqual(groups[1].cards.map((c) => c.id), ["opening-1", "opening-2"]);
});

test("ongoingRank: kinds rank by decay + actionability, recurring events by flag not category", async () => {
  const { ongoingRank } = await import("./filterCards.js");
  assert.equal(ongoingRank({ category: "civic_action" }), 0);
  assert.equal(ongoingRank({ category: "support_local" }), 0);
  assert.equal(ongoingRank({ category: "news" }), 1);
  assert.equal(ongoingRank({ category: "g_train_support" }), 1);
  assert.equal(ongoingRank({ category: "event", recurring: true }), 2, "recurring programming");
  assert.equal(ongoingRank({ category: "discount" }), 3);
  assert.equal(ongoingRank({ category: "subscription" }), 4);
  for (const category of ["new_business", "food_drink", "service", "shopping", "arts_culture"]) {
    assert.equal(ongoingRank({ category }), 5, category);
  }
  // a recurring DEAL is still an offer — the flag only promotes events
  assert.equal(ongoingRank({ category: "discount", recurring: true }), 3);
});

test("groupByDay: the shelf orders every kind, freshest first inside a kind", () => {
  const wed = new Date("2026-07-30T12:00:00-04:00");
  const cards = [
    { id: "place-old", category: "food_drink", createdAt: "2026-07-02" },
    { id: "signup", category: "subscription", createdAt: "2026-07-25" },
    { id: "news-old", category: "news", createdAt: "2026-07-15" },
    { id: "place-new", category: "food_drink", createdAt: "2026-07-25" },
    { id: "ask", category: "civic_action", createdAt: "2026-07-02" },
    { id: "offer", category: "discount", createdAt: "2026-07-25", recurring: true },
    { id: "news-new", category: "news", createdAt: "2026-07-27" },
    { id: "programme", category: "event", createdAt: "2026-07-08", recurring: true },
  ];
  const groups = groupByDay(cards, wed);
  assert.deepEqual(groups.flatMap((g) => g.cards.map((c) => c.id)), [
    "ask",
    "news-new", "news-old",
    "programme",
    "offer",
    "signup",
    "place-new", "place-old",
  ], "reading order is unchanged — the sections only name the kinds it already had");
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

test("groupByDay: an all-undated layer of one kind is a single shelf section", () => {
  const groups = groupByDay([{ id: "a" }, { id: "b" }], new Date("2026-07-15T12:00:00-04:00"));
  assert.equal(groups.length, 1);
  assert.equal(groups[0].key, "shelf-places");
  assert.equal(groups[0].shelf, true, "a lone shelf section renders headerless");
});

// The community-alert pinned group was removed 2026-07-29 (punch list P2 #13):
// the banner already deep-opens the same card, and the duplicate row + header
// cost 87px of first-screen feed. The alert card rides its natural group.
test("groupByDay: no pinned group — every card lands in a calendar group", () => {
  const cards = [{ id: "a" }, { id: "film-noir-support" }];
  const groups = groupByDay(cards, new Date("2026-07-26T12:00:00-04:00"));
  assert.ok(!groups.some((g) => g.key === "pinned"));
  assert.deepEqual(groups[0].cards.map((c) => c.id), ["a", "film-noir-support"]);
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

// 2026-08-02: the authored fold is a standing decision, not a volume symptom —
// a good games week must NOT promote the chip onto the primary bar.
test("partitionFilters: an authored-folded lens stays in More however well stocked", () => {
  const filters = [
    { id: "all", label: "All" },
    { id: "games", label: "Games" },
    { id: "live_music", label: "Live Music" },
  ];
  const { shown, folded } = partitionFilters(filters, { games: 40, live_music: 27 }, 5);
  assert.deepEqual(shown.map((f) => f.id), ["all", "live_music"]);
  assert.deepEqual(folded.map((f) => f.id), ["games"]);
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

// pickRelated (2026-07-30): one pointer, not a shelf. The venue hubs in the
// live deck carried up to 7 reciprocal links, and `relatedCardIds` is
// insertion ordered rather than ranked, so relevance has to be derived.
const NOW = new Date("2026-07-30T12:00:00-04:00");
const asMap = (cards) => new Map(cards.map((c) => [c.id, c]));

test("pickRelated: a venue hub points at its soonest upcoming show", () => {
  const shows = [
    { id: "fri", title: "Friday", startsAt: "2026-07-31T20:00:00-04:00", endsAt: "2026-07-31T23:59:00-04:00" },
    { id: "thu", title: "Thursday", startsAt: "2026-07-30T20:00:00-04:00", endsAt: "2026-07-30T23:59:00-04:00" },
    { id: "sat", title: "Saturday", startsAt: "2026-08-01T20:00:00-04:00", endsAt: "2026-08-01T23:59:00-04:00" },
  ];
  const venue = { id: "club", relatedCardIds: ["fri", "thu", "sat"] };
  assert.equal(pickRelated(venue, asMap(shows), NOW).id, "thu", "soonest wins over stored order");
});

// This was leaking before the constraint: cardsById is built from the
// UNFILTERED deck, so a venue could point at a show that already happened.
// Tolerable as one pill among seven, fatal as the only pill.
test("pickRelated: never returns an expired card", () => {
  const cards = [
    { id: "gone", title: "Last night", startsAt: "2026-07-27T20:00:00-04:00", endsAt: "2026-07-27T23:59:00-04:00" },
    { id: "soon", title: "Tomorrow", startsAt: "2026-07-31T20:00:00-04:00", endsAt: "2026-07-31T23:59:00-04:00" },
  ];
  const venue = { id: "club", relatedCardIds: ["gone", "soon"] };
  assert.equal(pickRelated(venue, asMap(cards), NOW).id, "soon");
  // and when every neighbour has expired, the row disappears entirely
  const onlyDead = { id: "club2", relatedCardIds: ["gone"] };
  assert.equal(pickRelated(onlyDead, asMap(cards), NOW), null);
});

test("pickRelated: an undated cluster falls back to the freshest", () => {
  const cards = [
    { id: "old", title: "Older", createdAt: "2026-07-02" },
    { id: "new", title: "Newest", createdAt: "2026-07-25" },
    { id: "mid", title: "Middle", createdAt: "2026-07-16" },
  ];
  const hub = { id: "gtrain", relatedCardIds: ["old", "new", "mid"] };
  assert.equal(pickRelated(hub, asMap(cards), NOW).id, "new");
});

test("pickRelated: a dated neighbour outranks an evergreen one", () => {
  const cards = [
    { id: "evergreen", title: "Support the venue", createdAt: "2026-07-28" },
    { id: "show", title: "Tonight", startsAt: "2026-07-30T21:00:00-04:00", endsAt: "2026-07-30T23:59:00-04:00" },
  ];
  const venue = { id: "cinema", relatedCardIds: ["evergreen", "show"] };
  assert.equal(pickRelated(venue, asMap(cards), NOW).id, "show", "what's on next beats a standing ask");
});

test("pickRelated: missing, empty, and dangling link sets yield null", () => {
  assert.equal(pickRelated({ id: "a" }, asMap([]), NOW), null, "no relatedCardIds field");
  assert.equal(pickRelated({ id: "a", relatedCardIds: [] }, asMap([]), NOW), null, "empty");
  assert.equal(pickRelated({ id: "a", relatedCardIds: ["ghost"] }, asMap([]), NOW), null, "dangling id");
});

// 2026-08-08 mobile audit #3: a lens with nothing on today opened on
// "Tomorrow" with no explanation — the feed must say the Today gap out loud.
test("noTodayNotice: fires only for a lens whose feed skips today into dated days", () => {
  const dated = (key, offset) => ({ key, order: offset, label: key, shelf: false, cards: [] });
  const shelf = (key) => ({ key, order: 5, label: key, shelf: true, cards: [] });
  // Lens feed jumps straight to tomorrow → notice, with the lens's display label.
  assert.equal(noTodayNotice([dated("d1", 1), shelf("shelf-places")], "food_drink"), "Food & Drink");
  // The All feed never explains itself — nothing is being filtered out.
  assert.equal(noTodayNotice([dated("d1", 1)], "all"), null);
  // A today group means no gap.
  assert.equal(noTodayNotice([dated("today", 0), dated("d1", 1)], "food_drink"), null);
  // All-shelf feeds (undated lenses like News) self-describe via section headers.
  assert.equal(noTodayNotice([shelf("shelf-changed")], "news"), null);
  // Empty feed is the empty state's job, not the notice's.
  assert.equal(noTodayNotice([], "food_drink"), null);
  // Unknown filter id degrades to silence.
  assert.equal(noTodayNotice([dated("d1", 1)], "bogus"), null);
});

// ── Recurrence in the feed (2026-08-08) ───────────────────────────────────
// Batu, on a Saturday: "no family and kids or food & drink event on a saturday
// (top 2 categories) is concerning and most likely not true." It wasn't true.
// groupByDay shelved EVERY `recurring` card, so the free Saturday bird walk
// and the Saturday kids' sewing camp — both live that morning — never reached
// the Today group, and noTodayNotice correctly reported the emptiness the
// grouping had manufactured. With `recurrence.days` the weekly card lands on
// the day it actually happens.
// 9:30am — DURING the bird club below, not after it. The clock is load-bearing
// since 2026-08-08 (see the finished-occurrence test at the end of this
// block): a noon anchor would put a 9–10am weekly card on NEXT Saturday, which
// is correct behaviour but tests something else.
const SAT = new Date("2026-08-08T09:30:00-04:00");
const birdClub = {
  id: "bird", category: "event", recurring: true, recurrence: { days: ["sat"] },
  startsAt: "2026-08-08T09:00:00-04:00", endsAt: "2026-08-29T10:00:00-04:00",
};
const tueYoga = {
  id: "yoga", category: "event", recurring: true, recurrence: { days: ["tue"] },
  startsAt: "2026-08-04T07:00:00-04:00", endsAt: "2026-08-25T23:59:00-04:00",
};

test("groupByDay: a weekly card lands on its own day, not the shelf", () => {
  const groups = groupByDay([birdClub], SAT);
  assert.deepEqual(groups.map((g) => g.label), ["Today · Sat, Aug 8"]);
  assert.equal(groups[0].shelf, false);
});

test("groupByDay: a weekly card on another day sits under that day, never Today", () => {
  // The mirror bug: a Tuesday card must not read as today's just because its
  // multi-week span happens to cover today.
  const groups = groupByDay([tueYoga], SAT);
  assert.deepEqual(groups.map((g) => g.label), ["Tue, Aug 11"]);
});

test("groupByDay: a weekly card shows its NEXT occurrence only, not every one", () => {
  // birdClub runs four Saturdays; a feed that listed all of them would bury
  // the one-offs it sits among.
  const groups = groupByDay([birdClub], new Date("2026-08-10T12:00:00-04:00"));
  assert.deepEqual(groups.map((g) => g.label), ["Sat, Aug 15"]);
});

test("groupByDay: a standing offer with no stated day stays on its shelf", () => {
  // Pooch's intro groom repeats on no day at all — it must not be invented one.
  const standing = { id: "groom", category: "discount", recurring: true, endsAt: "2026-08-22T23:59:00-04:00" };
  const groups = groupByDay([standing], SAT);
  assert.deepEqual(groups.map((g) => g.label), ["Deals"]);
  assert.equal(groups[0].shelf, true);
});

test("groupByDay: a recurring event whose span is exhausted falls back to the shelf", () => {
  const stale = { ...birdClub, endsAt: "2026-08-08T10:00:00-04:00" };
  const groups = groupByDay([stale], new Date("2026-08-09T12:00:00-04:00"));
  assert.deepEqual(groups.map((g) => g.label), ["Every week"]);
});

test("noTodayNotice: a lens with a weekly card live today is NOT empty", () => {
  // The regression guard for the actual report.
  const groups = groupByDay([birdClub], SAT);
  assert.equal(noTodayNotice(groups, "family_kids"), null);
});

test("groupByDay: a weekly card leaves Today once its sitting is over", () => {
  // Batu on stoopwise.com, 2026-08-08 7:37pm: the Today group led with three
  // weekly cards that had all finished that morning. The span's endsAt (Aug
  // 29) can't retire one sitting — the sitting's own 9–10am window does.
  const groups = groupByDay([birdClub], new Date("2026-08-08T19:37:00-04:00"));
  assert.deepEqual(groups.map((g) => g.label), ["Sat, Aug 15"]);
});

// ── The feed clock (2026-08-08) ───────────────────────────────────────────
// Every dated surface called `new Date()` during render, which is only ever
// as fresh as the last render — nothing re-renders a page nobody is touching,
// so a tab left open since morning kept serving the morning's feed. The tick
// that fixes that must not repaint the map for nothing: MapView rebuilds every
// marker when the cards array identity changes, and re-flies to the selected
// card. feedSignature is what lets the clock hold still — two instants that
// render the same feed produce the same string.
const deck = [birdClub, tueYoga, { id: "oneoff", category: "event", startsAt: "2026-08-08T19:00:00-04:00", endsAt: "2026-08-08T20:00:00-04:00" }];

test("feedSignature is stable across instants that render the same feed", () => {
  assert.equal(
    feedSignature(deck, new Date("2026-08-08T09:30:00-04:00")),
    feedSignature(deck, new Date("2026-08-08T09:50:00-04:00")),
  );
});

test("feedSignature changes when a card's window closes", () => {
  // The one-off's 7–8pm slot ends: it leaves the feed.
  assert.notEqual(
    feedSignature(deck, new Date("2026-08-08T19:30:00-04:00")),
    feedSignature(deck, new Date("2026-08-08T20:30:00-04:00")),
  );
});

test("feedSignature changes when a weekly sitting ends", () => {
  // birdClub 9–10am rolls from Today to next Saturday.
  assert.notEqual(
    feedSignature(deck, new Date("2026-08-08T09:30:00-04:00")),
    feedSignature(deck, new Date("2026-08-08T10:30:00-04:00")),
  );
});

test("feedSignature changes across the day boundary", () => {
  // Nothing expires between these two, but every day label shifts — the
  // overnight tab is the whole reason the clock exists.
  assert.notEqual(
    feedSignature(deck, new Date("2026-08-10T23:50:00-04:00")),
    feedSignature(deck, new Date("2026-08-11T00:10:00-04:00")),
  );
});
