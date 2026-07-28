// One banner at a time (Batu, 2026-07-26): the slot under the header shows
// only the MOST CONSEQUENTIAL message — stacking banners spends the slot's
// credibility twice. Precedence: imminent/live G closure (near/active — it
// changes your day) > community alert (existential, but the ask keeps) >
// stale-data status (L11, 2026-07-28 — "verified" must degrade honestly, so
// a stale feed says so instead of quietly lying about being current; appears
// ONLY when freshness fails, keeping silence the default) > distant-closure
// FYI chip > empty. The feed pin for a community alert's card is independent
// of this slot: the campaign stays elevated in the feed even while a closure
// weekend holds the banner.
export function bannerSlot(gtrainPhase, communityAlert, freshness) {
  if (gtrainPhase === "near" || gtrainPhase === "active") {
    return { kind: "gtrain", phase: gtrainPhase };
  }
  if (communityAlert) return { kind: "community", alert: communityAlert };
  if (freshness && !freshness.fresh) {
    return { kind: "freshness", verifiedThrough: freshness.verifiedThrough };
  }
  return gtrainPhase ? { kind: "gtrain", phase: gtrainPhase } : null;
}
