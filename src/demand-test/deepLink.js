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

// `base` is where "no card selected" goes back to. It defaults to the root, and
// is a lens page for a reader who arrived on one (2026-09-10) — without it the
// history effect rewrote /kids to / on first render, before the reader had
// touched anything, and closing a card stranded them on the general feed with
// the wrong URL to copy.
export function deepLinkUrl(cardId, search, base = "/") {
  return (cardId ? `/e/${encodeURIComponent(cardId)}` : base) + search;
}

// The page a pathname belongs to: its own lens page, or the root. A card path
// resolves to the root because a card page is not a place to go back to — the
// reader who opened /e/<slug> directly never chose a lens.
export function lensPagePath(pathname) {
  const m = /^\/([^/]+)\/?$/.exec(pathname ?? "");
  return m && LENS_PAGES[m[1]] ? `/${m[1]}` : "/";
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

// Lens landing pages as real paths (2026-09-10). `?lens=` cannot carry its own
// share preview: Facebook resolves a link to the `og:url` in its head and keys
// the preview on that object, so every `?lens=` variant collapses back to the
// root. That was proved from the other direction the same day — a query string
// Facebook had never seen previewed correctly on its first post, because the
// root had already been scraped. A different preview needs a different URL.
//
// The paths are DELIBERATELY not the lens ids. `/kids` and `/civic` are what a
// person says out loud and types; `family_kids` is a schema key. And because
// the map is explicit, adding a lens to FILTER_IDS never silently opens a URL
// with no prerendered page behind it.
//
// Only two, on purpose: these are the lenses Rana posts, and both carry enough
// live cards to be worth reading. A thin page tells a crawler the site has
// little to say — see LENS_PAGE_FLOOR in aeo.js.
export const LENS_PAGES = Object.freeze({
  kids: "family_kids",
  civic: "civic",
});

export function lensFromPath(pathname) {
  const m = /^\/([^/]+)\/?$/.exec(pathname ?? "");
  if (!m) return null;
  return LENS_PAGES[m[1]] ?? null;
}

export function resolveDeepLink(pathname, cardsById, now) {
  const slug = cardIdFromPath(pathname);
  if (slug == null) return { id: null, dead: false };
  const card = cardsById.get(slug);
  if (card && !isExpiredCard(card, now)) return { id: card.id, dead: false };
  return { id: null, dead: true };
}
