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

// V1-A (first-visit test, 2026-07-24): share renders on every expanded card —
// the group-chat forward is the organic growth loop, and it must not depend on
// per-card JSON. Cards that author their own share action keep their wording.
export function withShareAction(actions) {
  if (actions.some((a) => a.type === "share")) return actions;
  return [...actions, { type: "share", label: "Share" }];
}

// The payload is the card, not the site: "title — Sat 10 AM · Greenpoint Life"
// plus the /e/ deep link retagged src=share, so a recipient's visit is
// attributed to the share loop rather than the sharer's own channel.
const SHARE_DAY = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "America/New_York",
});
const SHARE_DATE = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
});
const SHARE_TIME = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});
const SHARE_CLOCK = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/New_York",
});

function shareWhen(card) {
  if (card.startsAt == null || card.recurring) return null;
  const d = new Date(card.startsAt);
  if (SHARE_CLOCK.format(d) === "00:00") return SHARE_DATE.format(d).replace(",", ""); // all-day sentinel
  return `${SHARE_DAY.format(d)} ${SHARE_TIME.format(d).replace(":00", "")}`;
}

export function sharePayload(card, { origin = "", search = "", channel = "share" } = {}) {
  const when = shareWhen(card);
  const params = new URLSearchParams(search);
  params.set("src", channel);
  return {
    title: when ? `${card.title} — ${when} · Greenpoint Life` : `${card.title} · Greenpoint Life`,
    url: `${origin}/e/${encodeURIComponent(card.id)}?${params.toString()}`,
  };
}

// L10 (DECISION_LOG 2026-07-28): per-card correction entry point. Batu's
// email stays private (2026-07-15), so disputes route through the feedback
// form — prefilled with the card id (Tally reads matching query params into
// hidden fields) so a report arrives targeted instead of as free text.
export function correctionHref(formUrl, cardId) {
  const sep = formUrl.includes("?") ? "&" : "?";
  return `${formUrl}${sep}card=${encodeURIComponent(cardId)}`;
}
