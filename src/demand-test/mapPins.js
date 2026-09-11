// Track V — pin stacking (UX eval F1). Venues with event series share exact
// coordinates (same geocode-cache entry), so one marker per card stacked 8
// deep and only the top pin was tappable. Cards group by location; a
// multi-card location renders one badged pin whose tap focuses the feed on
// that location (2026-07-23 — the earlier fan-out cluttered the mobile map).

import { isActiveOn } from "./filterCards.js";

// One group per exact coordinate, first-seen order, cards in authored order.
// Cards without coordinates are the caller's problem (listed, not mapped).
export function groupByLocation(cards) {
  const groups = new Map(); // "lat,lng" -> { key, lat, lng, cards }
  for (const card of cards) {
    if (card.lat == null || card.lng == null) continue;
    const key = `${card.lat},${card.lng}`;
    if (!groups.has(key)) groups.set(key, { key, lat: card.lat, lng: card.lng, cards: [] });
    groups.get(key).cards.push(card);
  }
  return [...groups.values()];
}

// Which cards get a pin while the map is in its compact peek (2026-09-11).
//
// The filter is a crit decision (round 2, #7): the 203px peek rendered every
// pin at a size where the colour key cannot be read, so it keeps what is on
// TODAY, what recurs, and undated venues — the map's stable geography — and
// drops dated cards for other days. Expanding the map, or any desktop
// viewport, shows everything.
//
// `selectedId` is the part that was missing. A card the reader has opened is
// not density; it is the one pin they asked for. Without it, opening any card
// dated for a future day moved nothing on the map and looked like the place
// was not mapped at all — which is how it reads on the family feed, where
// almost everything is dated for a day that is not today (Batu, 2026-09-11:
// "most of them do not show a mapped pin", 20 pins against 51 cards).
//
// Order is preserved, so the re-added card sits where the feed put it rather
// than jumping to the end.
export function peekMapCards(cards, selectedId, now) {
  return cards.filter(
    (c) =>
      c.id === selectedId ||
      (c.startsAt == null && c.endsAt == null) ||
      c.recurring ||
      isActiveOn(c, now),
  );
}
