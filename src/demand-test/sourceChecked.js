// "Checked <date>" on the card source line (2026-08-08 external-audit item 1).
// The date is derived, never asserted: the newer of (a) this card's entry in
// `cardChecked` — resolved at BUILD TIME by coverage.js's resolveCardChecked,
// which joins card -> roster source via URL host, the one join this codebase
// already trusts (coverage + updatePulse both key off it) — and (b) the
// card's own updatedAt (the last time a run or a human touched the card,
// which is itself a check).
//
// This used to guess client-side by slugifying card.sourceLinks[].publisher
// and fuzzy-matching it against the pulse's keys. That broke silently: pulse
// keys are roster source IDs ("greenpoint-ymca", "driftaway-subscriptions"),
// not publisher-name slugs, and two of the eight entries added 2026-08-07
// didn't share so much as a prefix with their card's publisher string. Rather
// than widen the guess, the resolution moved to build time where the real
// join (URL host -> roster source id) is available — see coverage.js.

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

export function sourceCheckedDate(card, cardChecked) {
  const dates = [];
  if (typeof card.updatedAt === "string" && ISO_DAY.test(card.updatedAt)) dates.push(card.updatedAt);
  const resolved = cardChecked?.[card.id];
  if (typeof resolved === "string" && ISO_DAY.test(resolved)) dates.push(resolved);
  if (dates.length === 0) return null;
  return dates.reduce((a, b) => (b > a ? b : a)); // ISO dates order lexically
}

const MONTH_DAY = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatChecked(isoDate, now) {
  if (typeof isoDate !== "string" || !ISO_DAY.test(isoDate)) return null;
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  const label = MONTH_DAY.format(d);
  return d.getUTCFullYear() === now.getFullYear() ? label : `${label}, ${d.getUTCFullYear()}`;
}
