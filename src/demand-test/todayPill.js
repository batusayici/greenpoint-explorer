// V3-B (first-visit test, 2026-07-24): chips preserve scroll position, so a
// mid-scroll filter tap can open the new lens at an arbitrary day with today's
// rows hidden above the viewport — the parent persona read that as "nothing
// today". A lens change keeps your place, and this rule decides when the
// "Today ↑" pill must offer the way back.
//
// Desktop: the list is its own scroller — any meaningful scroll offset hides
// the feed top. Mobile page flow: the list scrolls with the page under the
// anchored map + chip chrome, so the feed top is hidden once it sits above the
// chrome's bottom edge.
const DESKTOP_SCROLL_THRESHOLD = 120;
const CHROME_SLACK = 8; // "just at the line" is still visible — no pill

export function todayPillNeeded({ ownScroller, scrollTop = 0, listTop = 0, chromeBottom = 0 }) {
  if (ownScroller) return scrollTop > DESKTOP_SCROLL_THRESHOLD;
  return listTop < chromeBottom - CHROME_SLACK;
}

// Batu's phone test (2026-07-25): a viewport-fixed pill parked at the feed end
// collides with in-flow bottom content (the signup prompt). Scrolling
// meaningfully past where the pill appeared — either direction — is the
// reader's answer, so the pill withdraws instead of following them around.
const SCROLL_AWAY_DISTANCE = 220;

export function scrolledAwayFromPill(originScroll, currentScroll) {
  return Math.abs(currentScroll - originScroll) > SCROLL_AWAY_DISTANCE;
}
