// Per-card deep links as real paths: /e/<slug>, where slug = card id.
// Crawlable URLs are the point (2026-07-21 answer-engine decision) — the
// query string rides along untouched so ?src= channel tags survive shares.

export function cardIdFromPath(pathname) {
  const m = /^\/e\/([^/]+)\/?$/.exec(pathname);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

export function deepLinkUrl(cardId, search) {
  return (cardId ? `/e/${encodeURIComponent(cardId)}` : "/") + search;
}

// A dead /e/ link (unknown slug, or a card whose window has closed) must be
// distinguishable from a plain visit: the feed greets that visitor with
// "that one's wrapped" instead of failing silently (UX eval F6 / Q1-A).
import { isExpiredCard, FILTERS } from "./filterCards.js";

// Lens deep link (?lens=<filter id>, 2026-08-15): an outbound channel link
// that promises a view ("every kids thing, on one map" → family_kids) must
// land on that view, not on the general feed with the chip left as an
// exercise. Unknown values return null — the caller keeps "all", so a stale
// or mistyped link can never narrow the page to nothing.
export function lensFromSearch(search) {
  const lens = new URLSearchParams(search).get("lens");
  return FILTERS.some((f) => f.id === lens) ? lens : null;
}

export function resolveDeepLink(pathname, cardsById, now) {
  const slug = cardIdFromPath(pathname);
  if (slug == null) return { id: null, dead: false };
  const card = cardsById.get(slug);
  if (card && !isExpiredCard(card, now)) return { id: card.id, dead: false };
  return { id: null, dead: true };
}
