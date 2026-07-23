// Track V — filter-bar model, Today lens, pin classification. Filter membership
// is AUTHORED on each card (card.filters), not inferred: deterministic, testable,
// and editable without touching logic.
import { FILTER_IDS } from "./cardSchema.js";

const LABELS = {
  new: "New",
  food_drink: "Food & Drink",
  shopping: "Shopping",
  services: "Services",
  arts_culture: "Arts & Culture",
  family_kids: "Family & Kids",
  events: "Events",
  live_music: "Live Music",
  clubs_signups: "Memberships", // was "Clubs & Signups" — read as nightclubs

  deals: "Deals",
  news: "News",
  g_train: "G-Train Support",
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
export function isActiveOn(card, date) {
  if (card.startsAt == null && card.endsAt == null) return true;
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);
  if (card.startsAt != null && Date.parse(card.startsAt) > dayEnd.getTime()) return false;
  if (card.endsAt != null && Date.parse(card.endsAt) < dayStart.getTime()) return false;
  return true;
}

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
// cards and recurring deals (standing offers) trail in "Ongoing". Group order:
// Today, then future days ascending, then Ongoing. Within a day: earliest
// start first (all-day sentinels lead), authored order as tiebreak. Today
// sorts by today's CLOCK, not absolute startsAt — an in-window series anchored
// weeks ago must not outrank this morning's event (2026-07-22 UX eval, F4).
const DAY_LABEL = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const NY_CLOCK = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/New_York",
});

function minutesOfDayNY(iso) {
  const parts = NY_CLOCK.formatToParts(new Date(iso));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return (get("hour") % 24) * 60 + get("minute");
}

export function groupByDay(cards, date) {
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const groups = new Map(); // key -> { key, order, label, cards }
  const put = (key, order, label, card) => {
    if (!groups.has(key)) groups.set(key, { key, order, label, cards: [] });
    groups.get(key).cards.push(card);
  };
  for (const card of cards) {
    const dated = card.startsAt != null || card.endsAt != null;
    if (!dated || card.recurring) {
      put("ongoing", Number.POSITIVE_INFINITY, "Ongoing", card);
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
  const byStart = (a, b) => {
    const t = (c) => (c.startsAt != null ? Date.parse(c.startsAt) : 0);
    return t(a) - t(b);
  };
  const byClock = (a, b) => {
    const t = (c) => (c.startsAt != null ? minutesOfDayNY(c.startsAt) : 0);
    return t(a) - t(b);
  };
  return [...groups.values()]
    .sort((a, b) => a.order - b.order)
    .map((g) => {
      if (g.key === "ongoing") return g;
      return { ...g, cards: [...g.cards].sort(g.key === "today" ? byClock : byStart) };
    });
}

// A dated card is dead the moment its window closes — expiry can't wait for
// the weekly refresh: a card ending mid-week would linger up to six days
// (someone walks in waving a lapsed deal, or shows up to a finished event)
// and, worse, groupByDay would regroup it under its stale start day ABOVE
// Today (the 2026-07-21 live-page bug). Undated cards never expire.
export function isExpiredCard(card, date) {
  if (card.endsAt == null) return false;
  return Date.parse(card.endsAt) < date.getTime();
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

export function partitionFilters(filters, counts, threshold) {
  const shown = [];
  const folded = [];
  for (const f of filters) {
    if (f.id === "all" || (counts[f.id] ?? 0) >= threshold) shown.push(f);
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
