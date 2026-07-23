// Track V — pin stacking (UX eval F1). Venues with event series share exact
// coordinates (same geocode-cache entry), so one marker per card stacked 8
// deep and only the top pin was tappable. Cards group by location; a
// multi-card location renders one badged pin whose tap focuses the feed on
// that location (2026-07-23 — the earlier fan-out cluttered the mobile map).

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
