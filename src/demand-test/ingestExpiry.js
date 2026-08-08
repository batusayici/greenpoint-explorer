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
    if (c.category === "event" && endedBeforeToday(c)) {
      if (c.recurring === true) {
        // Standing programming, same rule as a recurring deal (2026-08-08):
        // endsAt is a verified-through date, not the night the weekly quiz
        // stops happening. Deleting on it is why venue sources went dark for
        // a week at a time — see the roster notes on Black Rabbit et al.
        flagged.push({ id: c.id, endsAt: c.endsAt });
        return true;
      }
      deleted.push({ id: c.id, category: c.category, endsAt: c.endsAt, free: c.free === true });
      return false;
    }
    if (c.category === "discount" && endedBeforeToday(c)) {
      if (c.recurring === true) {
        // Verified-through date passed — needs re-verification, not deletion.
        flagged.push({ id: c.id, endsAt: c.endsAt });
        return true;
      }
      deleted.push({ id: c.id, category: c.category, endsAt: c.endsAt, free: c.free === true });
      return false;
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
