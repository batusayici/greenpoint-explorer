// Community alert (2026-07-26) — the banner slot's rare "neighborhood needs
// you" tier. Charter (DECISION_LOG 2026-07-26): existential stakes publicly
// declared by the business itself, time-bound, ONE at a time, and the banner
// deep-opens the sourced card — it never carries the ask alone.
//
// Sourced 2026-07-16 from filmnoircinema.com ("Keep Us Alive" site banner);
// card film-noir-support holds the GoFundMe action. expiresAt is a re-verify
// deadline, not a campaign end: the weekly ingest re-checks the source and
// renews it, or the alert hides itself (the gtrainBanner staleness lesson).
export const COMMUNITY_ALERT = Object.freeze({
  cardId: "film-noir-support",
  headline: "Keep Film Noir Cinema alive",
  detail: "The indie cinema is asking the neighborhood for help",
  cta: "See how",
  sourcedAt: "2026-07-26T00:00:00-04:00",
  expiresAt: "2026-08-24T00:00:00-04:00",
});

// Slot tenure cap (banner charter, DECISION_LOG 2026-08-02): an alert may
// hold the banner slot at most 21 days from sourcedAt before banner
// blindness sets in — after that the card still lives in the feed, but the
// slot frees up. A NEW sourced development (not a mere re-verify) resets the
// clock by resetting sourcedAt.
const SLOT_TENURE_MS = 21 * 86400000;

export function activeCommunityAlert(now, cardsById, alert = COMMUNITY_ALERT) {
  const t = now.getTime();
  if (t >= Date.parse(alert.expiresAt)) return null;
  if (t >= Date.parse(alert.sourcedAt) + SLOT_TENURE_MS) return null;
  if (!cardsById.has(alert.cardId)) return null;
  return alert;
}
