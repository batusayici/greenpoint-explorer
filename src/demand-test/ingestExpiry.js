// Track V — deterministic expiry hygiene (skill step 3, "auto-delete — no
// approval needed", Batu 2026-07-16). Extracted from the ingest agent run so a
// script (scripts/expire-cards.mjs) can do it for free instead of a model:
//  - delete `event` cards whose endsAt is before today (NY calendar day);
//  - delete dated `discount` cards past endsAt;
//  - KEEP recurring `discount` cards past their verified-through endsAt but
//    flag them — re-verification against the source is judgment, not logic;
//  - prune relatedCardIds pointing at deleted cards (drop the key when it
//    empties — schema rejects []).
// Date comparison is done on New-York calendar dates (string compare of
// YYYY-MM-DD), so DST offsets can't shift a card across midnight.

const NY_TZ = "America/New_York";

// ISO datetime → the New-York calendar date it falls on, as "YYYY-MM-DD".
export const nyDateOf = (iso) =>
  new Date(iso).toLocaleDateString("en-CA", { timeZone: NY_TZ });

export const nyToday = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: NY_TZ });

// cards: the seed's cards array. today: "YYYY-MM-DD" (NY). Pure — returns new
// state + a report; does not mutate the input cards (pruning copies the card).
export function expireCards(cards, today) {
  const endedBeforeToday = (c) => c.endsAt != null && nyDateOf(c.endsAt) < today;

  const deleted = [];
  const flagged = [];
  let kept = cards.filter((c) => {
    if (endedBeforeToday(c)) {
      if (c.recurring === true) {
        // Standing programming and standing offers alike: endsAt is a
        // VERIFIED-THROUGH date, not the night the weekly quiz stops
        // happening. Re-verification is judgment, not logic — so flag, never
        // delete. Deleting on it is why venue sources went dark for a week at
        // a time (roster notes: Black Rabbit, Scrappleland, Hide & Seek).
        flagged.push({ id: c.id, endsAt: c.endsAt });
        return true;
      }
      // Auto-delete is pre-approved for PAST EVENTS AND DATED DEALS only
      // (Batu, 2026-07-16) — that scope is deliberate and stays.
      if (c.category === "event" || c.category === "discount") {
        deleted.push({ id: c.id, category: c.category, endsAt: c.endsAt, free: c.free === true });
        return false;
      }
      // Any other dated category past its end date (2026-08-08): FLAG it.
      // These used to be ignored entirely, so they sat in cards.json forever —
      // hidden from readers by isExpiredCard, but still counted in the deck
      // size the trend gate reads, and never surfaced to anyone for a
      // decision. A stale civic_action and a stale subscription were doing
      // exactly that. Deleting them is a judgment call the run should make,
      // not a rule this script may apply on its own.
      flagged.push({ id: c.id, endsAt: c.endsAt });
      return true;
    }
    return true;
  });

  const deletedIds = new Set(deleted.map((d) => d.id));
  const pruned = [];
  kept = kept.map((c) => {
    if (!Array.isArray(c.relatedCardIds)) return c;
    const next = c.relatedCardIds.filter((id) => !deletedIds.has(id));
    if (next.length === c.relatedCardIds.length) return c;
    pruned.push({ id: c.id, removed: c.relatedCardIds.filter((id) => deletedIds.has(id)) });
    const copy = { ...c };
    if (next.length === 0) delete copy.relatedCardIds;
    else copy.relatedCardIds = next;
    return copy;
  });

  return { kept, deleted, flagged, pruned };
}
