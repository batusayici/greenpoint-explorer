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
  clubs_signups: "Memberships", // was "Clubs & Signups" — read as nightclubs

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

const GTRAIN_CATEGORIES = new Set(["g_train_support", "civic_action", "support_local"]);

export function pinKind(card) {
  if (GTRAIN_CATEGORIES.has(card.category)) return "gtrain";
  if (card.category === "event") return "event";
  if (card.category === "subscription") return "club";
  return "business";
}
