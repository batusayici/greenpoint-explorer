// Send pre-flight (2026-08-13) — the counts that go into outbound copy.
//
// Why this is a module and not a grep. Org notes and the parents post carry
// numbers ("your programs are on it", "twenty-seven on it right now"), and a
// number in outbound copy is a truth-rule claim like any other: it has to be
// true at the moment it is sent, not at the moment it was drafted. The
// 2026-08-11 readout carried that as a ⚠ on every draft ("regenerate on the
// morning you send") with a hand-rolled grep as the method, and the 2026-08-06
// standing instruction ratified it as a rule. It held: between the drafts and
// the 8/13 pre-flight, Greenpoint Library went 7 → 11 and Film Noir Cinema
// went 8 → 6. One of those directions would have made a sent note false.
//
// Two design notes worth keeping:
//   - Venues match on EXACT `locationName`, never a regex over ids. A fuzzy
//     match inflates a count in the org's own favour, which is the one
//     direction an org note must never be wrong in.
//   - Every count is reported for today AND for tomorrow. "Regenerate before
//     you send" is a discipline nobody can verify they followed; a printed
//     `droppingAfterToday` is a fact the sender reads before deciding.
//
// Consumed by scripts/send-preflight.mjs (which adds the network checks —
// links resolve, `src` survives, prod is serving the current deck).
import { upcomingWithin7Days } from "./freshness.js";
import { isExpiredCard } from "./filterCards.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// One row per `src` in docs/launch/channel-links.md whose copy carries a count.
// Adding an org to a seeding wave means adding it here in the same change —
// otherwise the note gets a hand-counted number and the rule quietly lapses.
export const SEND_TARGETS = [
  {
    src: "org-gp-library",
    label: "Greenpoint Library",
    kind: "venue",
    locationName: "Greenpoint Library",
  },
  {
    src: "org-film-noir",
    label: "Film Noir Cinema",
    kind: "venue",
    locationName: "Film Noir Cinema",
  },
  {
    src: "org-brooklyn-craft",
    label: "Brooklyn Craft Company",
    kind: "venue",
    locationName: "Brooklyn Craft Company",
  },
  {
    src: "parents",
    label: "Family & Kids lens (Q2 parents post)",
    kind: "lens",
    lens: "family_kids",
  },
  // Town Square BK produces at other orgs' venues (SummerStarz runs at
  // Transmitter Park), so a locationName match would count unrelated cards
  // at the same venue — the `cards` kind counts the note's own claims by id.
  // When every listed card leaves the deck, total goes to 0 and the script's
  // do-not-send failure blocks the send: the note's claim has expired.
  {
    src: "org-town-square",
    label: "Town Square BK",
    kind: "cards",
    cardIds: ["summerstarz-zootopia-0821"],
  },
];

const isDated = (c) => Boolean(c.startsAt || c.endsAt);

// Latest day the set runs to — the "through <date>" an org note can honestly
// claim. Reads endsAt in preference to startsAt so a span reports its end.
function lastDay(cards) {
  const days = cards
    .map((c) => c.endsAt || c.startsAt)
    .filter(Boolean)
    .map((d) => String(d).slice(0, 10))
    .sort();
  return days.length ? days[days.length - 1] : null;
}

function summarise(matched, now) {
  const tomorrow = new Date(now.getTime() + DAY_MS);
  const inWindowIds = matched.filter((c) => upcomingWithin7Days(c, now)).map((c) => c.id);
  const tomorrowIds = matched
    .filter((c) => upcomingWithin7Days(c, tomorrow))
    .map((c) => c.id);
  return {
    total: matched.length,
    dated: matched.filter(isDated).length,
    inWindow: inWindowIds.length,
    inWindowIds,
    inWindowTomorrow: tomorrowIds.length,
    droppingAfterToday: inWindowIds.filter((id) => !tomorrowIds.includes(id)),
    through: lastDay(matched),
    ids: matched.map((c) => c.id),
  };
}

export function countForVenue(cards, locationName, now) {
  return summarise(
    cards.filter((c) => c.locationName === locationName),
    now,
  );
}

export function countForLens(cards, lens, now) {
  return summarise(
    cards.filter((c) => (c.filters ?? []).includes(lens)),
    now,
  );
}

export function countForCards(cards, cardIds, now) {
  return summarise(
    cards.filter((c) => cardIds.includes(c.id)),
    now,
  );
}

// Every target counted against one deck at one instant, so a readout or a
// send can quote a single generatedAt rather than a spread of grep timestamps.
export function assessSend(cards, { now = new Date() } = {}) {
  return {
    generatedAt: now.toISOString(),
    deckSize: cards.length,
    // What the sitemap actually renders (liveCards, aeo.js) plus its fixed
    // urls — never deckSize. Expired-but-retained news cards (we don't delete
    // what we can't judge, filterCards.js) stay in cards.json past their
    // 30-day shelf life, so deckSize drifts from the sitemap on every send
    // from the day the first one ages out (2026-08-19, Finding 1).
    liveDeckSize: cards.filter((c) => !isExpiredCard(c, now)).length,
    targets: SEND_TARGETS.map((t) => ({
      ...t,
      ...(t.kind === "venue"
        ? countForVenue(cards, t.locationName, now)
        : t.kind === "cards"
          ? countForCards(cards, t.cardIds, now)
          : countForLens(cards, t.lens, now)),
    })),
  };
}
