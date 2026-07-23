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
import { isExpiredCard } from "./filterCards.js";

export function resolveDeepLink(pathname, cardsById, now) {
  const slug = cardIdFromPath(pathname);
  if (slug == null) return { id: null, dead: false };
  const card = cardsById.get(slug);
  if (card && !isExpiredCard(card, now)) return { id: card.id, dead: false };
  return { id: null, dead: true };
}
