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
