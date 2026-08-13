// Track V — filter-bar model, Today lens, pin classification. Filter membership
// is AUTHORED on each card (card.filters), not inferred: deterministic, testable,
// and editable without touching logic.
import { FILTER_IDS, FOLDED_FILTER_IDS } from "./cardSchema.js";
import { occursOn, nextOccurrence } from "./eventWindow.js";

const LABELS = {
  food_drink: "Food & Drink",
  arts_culture: "Arts & Culture",
  family_kids: "Family & Kids",
  live_music: "Live Music",
  wellness: "Wellness",
  // "Civic", not "Community" (Batu, 2026-08-02): the lens is civic action and
  // mutual aid, and "Community" invited exactly the social gatherings the
  // 2026-07-30 rule had to evict. The id was renamed to match the same day —
  // one word for one lens, in the UI, the card data and the ingest rules.
  civic: "Civic",
  // "Shopping", not "Markets" (Batu, 2026-08-13). The deck's two farmers'
  // markets are food_drink, and in Greenpoint "market" means the greenmarket —
  // a Markets chip would promise McCarren on Saturday and deliver an archival
  // fashion sale. `shopping` is the word the ruling used and the word the schema
  // already uses as a category, so no synonym is invented for it.
  shopping: "Shopping",
  deals_memberships: "Deals & Memberships",
  news: "News",
  games: "Games",
};

export const FILTERS = [
  { id: "all", label: "All" },
  ...FILTER_IDS.map((id) => ({ id, label: LABELS[id] })),
];

export const matchesFilter = (card, filterId) =>
  filterId === "all" || (card.filters ?? []).includes(filterId);

// Today lens (hidden-engagement addendum): a dated card is active on `date` if
// its window touches that calendar day. Undated cards (shops, advocacy) always
// pass — the lens narrows events, it doesn't empty the map.
// 2026-08-08: delegates to occursOn, which adds one thing — a card stating
// `recurrence.days` is active only on those days, not on every day its span
// happens to cover. Everything else keeps the old span-containment meaning.
export const isActiveOn = (card, date) => occursOn(card, date);

// Feed priority: what's live TODAY leads the feed, most time-specific first —
// a 6–8 PM tasting outranks a weeks-long series, which outranks undated cards.
// Undated and not-active-today cards keep their authored order (stable sort).
const OPEN_ENDED_SPAN = 30 * 86400000; // open-ended window ~ a month, still beats undated
export function sortTodayFirst(cards, date) {
  const score = (c) => {
    const dated = c.startsAt != null || c.endsAt != null;
    if (!dated || !isActiveOn(c, date)) return Number.POSITIVE_INFINITY;
    if (c.startsAt == null || c.endsAt == null) return OPEN_ENDED_SPAN;
    return Date.parse(c.endsAt) - Date.parse(c.startsAt);
  };
  return [...cards].sort((a, b) => score(a) - score(b));
}

// Day-grouped feed (2026-07-15 review: events & live music must be scannable
// by date). Dated cards bucket under the calendar day they happen — a window
// covering today reads "Today"; future starts read their start day. Undated
// cards and recurring deals (standing offers) trail on the kind-named shelf
// below the calendar (SHELF_SECTIONS). Group order: Today, then future days
// ascending, then the shelf sections in rank order. Within a day: the timed
// schedule first by clock, authored order as tiebreak — and Today uses
// today's CLOCK, not absolute startsAt, so an in-window series anchored weeks
// ago can't outrank this morning's event (2026-07-22 UX eval, F4). Untimed
// cards (the 00:00 sentinel = "no stated clock") TRAIL their day: they're
// often evening, and sorting an unknown time first silently claims morning
// (2026-07-24 user feedback).
const DAY_LABEL = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const NY_CLOCK = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/New_York",
});
const NY_DAY = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "America/New_York",
});

function minutesOfDayNY(iso) {
  const parts = NY_CLOCK.formatToParts(new Date(iso));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return (get("hour") % 24) * 60 + get("minute");
}

// The undated shelf — the cards with no calendar to order them. Until
// 2026-07-30 the rule was a single news-first partition, which solved its own
// bug (2026-07-25: reporting must outrank business openings) and left
// everything below it in raw ingest-insertion order: a service card between
// two food_drink cards, three dance signups adrift from a fourth, standing
// deals scattered across rows 39/45/47. So the shelf is ranked by KIND —
// descending by how fast the row decays and how directly it can be acted on —
// and freshest-first inside each kind, which self-maintains as each ingest
// appends.
const ONGOING_RANK = {
  // 0 — asks: the neighborhood needs something from you, and the window closes.
  civic_action: 0,
  support_local: 0,
  // 1 — what changed. Keeps the 2026-07-25 fix: news above the openings.
  news: 1,
  g_train_support: 1,
  // 3 — standing offers you can use today.
  discount: 3,
  // 4 — memberships and signups: a decision, not a walk-in.
  subscription: 4,
};
// 2 — recurring programming (a thing you can actually go do this week) sits
// between the news and the offers; it is a flag, not a category.
const RANK_RECURRING = 2;
// 5 — places: the map's evergreen geography. Never stale, never urgent.
const RANK_PLACE = 5;

export function ongoingRank(card) {
  if (card.recurring && card.category === "event") return RANK_RECURRING;
  return ONGOING_RANK[card.category] ?? RANK_PLACE;
}

// Each rank RENDERS as its own titled section (2026-08-02). Until now the six
// ranks were sorted into one block labelled "Ongoing" — 55 of 80 live cards,
// 69% of the page and 4.6 screens at 375px, under a header that names recency
// instead of subject and starts 2.1 screens down. All 23 news-lens cards are
// undated, so *none* of them can ever reach a day group: news wasn't below the
// fold, it was unreachable by the feed's only axis. Naming the kinds costs no
// new component and makes the scroll self-describing — you pass "What changed"
// on the way to "Places" instead of one anonymous run of rows.
//
// Indexed BY RANK, so the ranking above is the section order — there is no
// second list to drift out of sync. `groupByDay: every rank has a section`
// fails if a rank is ever added without one.
// Labels are the product's OWN words, not friendlier synonyms (Batu,
// 2026-08-02): each section is exactly the undated cards of a lens's core
// category — "News" ⊂ the News lens (14 of 23; the other 9 are openings that
// belong under Places), "Civic" ⊂ the Civic lens (3 of 5; the other 2 are
// dated and sit in day groups). Calling them "What changed" and "How to help"
// invented a second vocabulary for concepts the chip bar, the schema and the
// AEO surface already name — the same drift the Community→Civic rename fixed.
const SHELF_SECTIONS = [
  { key: "shelf-asks", label: "Civic" },
  { key: "shelf-changed", label: "News" },
  { key: "shelf-weekly", label: "Every week" },
  { key: "shelf-deals", label: "Deals" },
  { key: "shelf-memberships", label: "Memberships" },
  { key: "shelf-places", label: "Places" },
];
export const shelfSection = (card) => SHELF_SECTIONS[ongoingRank(card)];

// Freshest first inside a kind — an undated card's createdAt is the only
// recency signal it has, and it makes each refresh's additions surface. The
// kind itself is now carried by the section, not by the comparator.
const created = (c) => Date.parse(c.createdAt ?? "") || 0;
const byFreshest = (a, b) => created(b) - created(a);

export function groupByDay(cards, date) {
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const groups = new Map(); // key -> { key, order, label, shelf, cards }
  const put = (key, order, label, card, shelf = false) => {
    if (!groups.has(key)) groups.set(key, { key, order, label, shelf, cards: [] });
    groups.get(key).cards.push(card);
  };
  // (The community-alert pinned group was removed 2026-07-29, punch list P2
  // #13: the banner already carries the campaign to the same card.)
  for (const card of cards) {
    const dated = card.startsAt != null || card.endsAt != null;
    // A weekly card that states its days gets placed on the NEXT day it
    // actually happens — that is the whole point of recurrence.days, and it is
    // what puts the Saturday bird walk in Saturday's group instead of on a
    // shelf below the calendar. Only its next occurrence is listed: a card that
    // repeats for six weeks would otherwise appear six times and bury the
    // one-offs it sits among. Recurring cards with NO stated day (standing
    // offers) and exhausted spans still fall through to the shelf, unchanged.
    // `date`, not `dayStart`: nextOccurrence needs the CLOCK to know whether
    // today's sitting is still on. Passing local midnight is what kept this
    // morning's greenmarket under "Today" all evening (2026-08-08).
    // THE CLOCK IS NOT A WEEKLY-CARD PRIVILEGE (2026-08-13). This gate used to
    // read `card.recurring && recurrence.days` — the occurrence clock ran for
    // weekly cards and nothing else, because the three cards that prompted it
    // on 2026-08-08 happened to be weekly. Every MULTI-DAY ONE-OFF fell through
    // to isActiveOn, which compares calendar days and never asks the clock, so
    // it sat in Today at its span-start time on every day of its span: a 9am
    // two-day camp led the 6:13pm feed, and a three-night film run led at 7pm
    // all day on nights two and three. The sitting model in occurrenceEndMinutes
    // was always general — time-of-day of startsAt…endsAt, applied to the day it
    // lands on — so the fix is to stop withholding it.
    //
    // A standing offer (recurring with NO stated day) still belongs on the
    // shelf, not on a calendar day, so it is the one dated shape held back.
    // Placement only ever moves a card FORWARD to a day it genuinely occurs on:
    // when nextOccurrence finds nothing it returns null and the old branches
    // below run unchanged, so nothing can be hidden by this.
    const standing = card.recurring && !(card.recurrence?.days?.length > 0);
    const occurrence = dated && !standing ? nextOccurrence(card, date) : null;
    if (occurrence != null) {
      // Local midnight, matching dayStart — the offset below is a whole-day
      // count, and a noon anchor would round a same-day occurrence up to 1.
      const day = new Date(`${occurrence}T00:00:00`);
      const offset = Math.round((day - dayStart) / 86400000);
      const label =
        offset === 0 ? `Today · ${DAY_LABEL.format(day)}`
        : offset === 1 ? `Tomorrow · ${DAY_LABEL.format(day)}`
        : DAY_LABEL.format(day);
      put(offset === 0 ? "today" : `d${offset}`, offset, label, card);
    } else if (!dated || card.recurring) {
      const rank = ongoingRank(card);
      const section = SHELF_SECTIONS[rank];
      put(section.key, rank, section.label, card, true);
    } else if (isActiveOn(card, date)) {
      put("today", 0, `Today · ${DAY_LABEL.format(date)}`, card);
    } else {
      const start = new Date(card.startsAt ?? card.endsAt);
      const day = new Date(start); day.setHours(0, 0, 0, 0);
      const offset = Math.round((day - dayStart) / 86400000);
      const label = offset === 1 ? `Tomorrow · ${DAY_LABEL.format(day)}` : DAY_LABEL.format(day);
      put(`d${offset}`, offset, label, card);
    }
  }
  // One comparator for every day group: cards in a group share a calendar
  // day, so clock-of-day ordering equals absolute ordering — and it's the
  // right key for Today's in-window series regardless of their anchor date.
  // No stated clock (missing startsAt, or the 00:00 sentinel) sorts last.
  const byClock = (a, b) => {
    const t = (c) => {
      if (c.startsAt == null) return Number.POSITIVE_INFINITY;
      const m = minutesOfDayNY(c.startsAt);
      return m === 0 ? Number.POSITIVE_INFINITY : m;
    };
    return t(a) - t(b);
  };
  // Calendar before shelf is its own sort key. The single "Ongoing" group used
  // to trail via Number.POSITIVE_INFINITY, which no day offset could reach;
  // the sections carry small ranks (0–5) that a day offset WOULD outrank, so a
  // card a year out has to be kept above the shelf explicitly.
  return [...groups.values()]
    .sort((a, b) => (a.shelf === b.shelf ? a.order - b.order : a.shelf ? 1 : -1))
    .map((g) => ({ ...g, cards: [...g.cards].sort(g.shelf ? byFreshest : byClock) }));
}

// The Today-gap notice (2026-08-08 mobile audit, #3): under a lens, groupByDay
// can produce no Today group at all — the feed then leads with "Tomorrow" and
// nothing says why. When the lens's feed skips today but still has dated days
// ahead, name the gap ("No Food & Drink today"); an all-shelf feed stays
// silent because its section headers already say what the reader is looking at.
export function noTodayNotice(groups, filterId) {
  if (!filterId || filterId === "all") return null;
  if (groups.some((g) => g.key === "today")) return null;
  if (!groups.some((g) => !g.shelf)) return null;
  return FILTERS.find((f) => f.id === filterId)?.label ?? null;
}

// A dated card is dead the moment its window closes — expiry can't wait for
// the weekly refresh: a card ending mid-week would linger up to six days
// (someone walks in waving a lapsed deal, or shows up to a finished event)
// and, worse, groupByDay would regroup it under its stale start day ABOVE
// Today (the 2026-07-21 live-page bug). Undated cards never expire.
//
// 2026-07-24 user feedback: "same day events that are past its start time
// should be removed." A same-day event whose endsAt is only the day-end
// sentinel (23:59 = no sourced end time) used to linger until midnight; it
// now expires one hour past its stated start — long enough to still catch a
// show you're running late to, short enough that the evening feed isn't a
// list of things already underway. A sourced real end keeps exact expiry;
// all-day cards (00:00 start sentinel), multi-day windows, and recurring
// cards are untouched.
const STARTED_GRACE_MS = 60 * 60000;

export function isExpiredCard(card, date) {
  if (card.endsAt == null) return false;
  if (Date.parse(card.endsAt) < date.getTime()) return true;
  if (card.recurring || card.startsAt == null) return false;
  const startClock = minutesOfDayNY(card.startsAt);
  const endIsSentinel = minutesOfDayNY(card.endsAt) === 23 * 60 + 59;
  const sameDay = NY_DAY.format(new Date(card.startsAt)) === NY_DAY.format(new Date(card.endsAt));
  if (startClock === 0 || !endIsSentinel || !sameDay) return false;
  return date.getTime() > Date.parse(card.startsAt) + STARTED_GRACE_MS;
}

// What the clock actually decides for the feed: which cards survive expiry,
// which day each lands on, and what those days are called. Two instants with
// the same signature render the same page.
//
// This exists so the 30-minute tick in JulyApp can hold still (2026-08-08).
// The tick is what makes a long-lived tab honest — every dated surface reads
// `new Date()` during render, and nothing re-renders a page nobody is
// touching, so a tab open since morning kept serving the morning's feed. But
// advancing the clock hands MapView a new cards array, and MapView tears down
// and rebuilds every marker on identity change and re-flies to the selected
// card. Repainting the map every half hour to change nothing would trade one
// visible bug for another; comparing signatures means the clock only moves
// when the page has something new to say.
export function feedSignature(cards, date) {
  const live = cards.filter((c) => !isExpiredCard(c, date));
  return groupByDay(live, date)
    .map((g) => `${g.label}:${g.cards.map((c) => c.id).join(",")}`)
    .join("|");
}

// ONE related card, not a shelf (Batu, 2026-07-30). The place graph is
// reciprocal, so a venue card accumulates every event it has ever hosted —
// Film Noir carried 7 links, the Library 6 — and a row of near-identical pills
// is a menu, not a pointer. 26 of the 34 linked cards already had exactly one
// live neighbour, so this only changes the venue hubs, which are precisely the
// cards where the shelf was noise.
//
// "Most relevant" has to be derived, because `relatedCardIds` is INSERTION
// ordered, not ranked — Film Noir's list opened with a Jul 27 show. The rule:
//
//   1. drop anything expired — this was already leaking. cardsById is built
//      from the unfiltered deck, so a venue card could point at a show that
//      had already happened. Harmless when it was one pill among seven; fatal
//      when it is the only pill.
//   2. soonest upcoming dated card — "what's on there next" is the useful
//      pointer from a venue, and a card already underway sorts first.
//   3. otherwise the freshest evergreen, by createdAt — for undated clusters
//      like the G-train story, that surfaces the latest development.
export function pickRelated(card, cardsById, date) {
  const live = (card.relatedCardIds ?? [])
    .map((id) => cardsById.get(id))
    .filter(Boolean)
    .filter((c) => !isExpiredCard(c, date));
  if (live.length === 0) return null;
  const dated = live
    .filter((c) => c.startsAt != null)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  if (dated.length > 0) return dated[0];
  const created = (c) => (c.createdAt ? Date.parse(c.createdAt) : 0);
  return live.slice().sort((a, b) => created(b) - created(a))[0];
}

// Thin-layer folding (UX eval F16, decision B): a 2-card Deals chip promising
// a full shelf reads as breakage, so layers under the threshold fold into a
// "More" chip until the weekly ingest stocks them.
export function liveFilterCounts(cards, date) {
  const counts = {};
  for (const card of cards) {
    if (isExpiredCard(card, date)) continue;
    for (const id of card.filters ?? []) counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

// Two ways into "More": the thin-layer fold above (a volume symptom that heals
// when the ingest stocks the layer) and the AUTHORED fold — lenses that belong
// inside More by decision, whatever their count (2026-08-02, `games`). The
// authored fold wins: a good games week must not silently promote the chip.
export function partitionFilters(filters, counts, threshold) {
  const shown = [];
  const folded = [];
  for (const f of filters) {
    if (FOLDED_FILTER_IDS.includes(f.id)) folded.push(f);
    else if (f.id === "all" || (counts[f.id] ?? 0) >= threshold) shown.push(f);
    else folded.push(f);
  }
  return { shown, folded };
}

const GTRAIN_CATEGORIES = new Set(["g_train_support", "civic_action", "support_local"]);

export function pinKind(card) {
  if (GTRAIN_CATEGORIES.has(card.category)) return "gtrain";
  if (card.category === "event") return "event";
  if (card.category === "subscription") return "club";
  if (card.category === "discount") return "deal";
  if (card.category === "news") return "news";
  return "business";
}
