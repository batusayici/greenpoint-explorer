// Track V — pin stacking (UX eval F1, decision A). Venues with event series
// share exact coordinates (same geocode-cache entry), so one marker per card
// stacked 8 deep and only the top pin was tappable. Cards group by location;
// a multi-card location renders one badged pin that fans out on tap.

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

// Pixel offsets for n satellites on a circle, first at 12 o'clock. Used as
// MapLibre marker offsets — MapLibre owns the transform, so the satellites
// stay geo-anchored (the .ii-pin CSS trap does not apply).
export function fanOffsets(n, radius = 44) {
  const offs = [];
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    offs.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }
  return offs;
}
