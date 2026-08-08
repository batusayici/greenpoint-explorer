// "Checked <date>" on the card source line (2026-08-08 external-audit item 1):
// the one trust claim the source line was missing. The date is derived, never
// asserted: the newest of (a) the ingest ledger's sourcePulse sweep dates for
// this card's publishers, shipped to the client via freshness-stamp.json, and
// (b) the card's own updatedAt (the last time a run or a human touched the
// card, which is itself a check). Matching is exact-or-prefix on slugs only —
// a fuzzy match would print a check that never happened, so a near-miss
// (go-green-bk vs "Go Green Brooklyn") deliberately falls back to updatedAt.

const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^the-/, "");

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

export function sourceCheckedDate(card, sourcePulse) {
  const dates = [];
  if (typeof card.updatedAt === "string" && ISO_DAY.test(card.updatedAt)) dates.push(card.updatedAt);
  if (sourcePulse && typeof sourcePulse === "object") {
    for (const link of card.sourceLinks ?? []) {
      const name = link.publisher || link.title;
      if (!name) continue;
      const s = slug(name);
      if (!s) continue;
      for (const [key, date] of Object.entries(sourcePulse)) {
        const k = slug(key);
        // exact, or one extends the other at a word boundary (hana-makgeolli
        // matches hana-makgeolli-events; go-green-bk does NOT match
        // go-green-brooklyn).
        const hit = k === s || k.startsWith(`${s}-`) || s.startsWith(`${k}-`);
        if (hit && typeof date === "string" && ISO_DAY.test(date)) dates.push(date);
      }
    }
  }
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
