// Track V — action href resolution. The 2026-07-03 tappability rule: every
// rendered action must be able to produce action_tap evidence. Resolution
// order: explicit url → (visit only) directions derived from the card's own
// address or coords → null. share/filterId actions return null here because
// the component handles them as buttons, not links. Derived directions use the
// documented Google Maps search URL — derived from card data, never invented.
const DIRECTIONS_BASE = "https://www.google.com/maps/search/?api=1&query=";

export function actionHref(action, card) {
  if (action.url) return action.url;
  if (action.filterId != null || action.type === "share") return null;
  if (action.type !== "visit") return null;
  const query = card.address ?? (card.lat != null && card.lng != null ? `${card.lat},${card.lng}` : null);
  return query ? DIRECTIONS_BASE + encodeURIComponent(query) : null;
}
