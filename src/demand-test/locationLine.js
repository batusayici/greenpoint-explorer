// What a card's row says about WHERE, when it has no pin (2026-09-11).
//
// This was three lines inside CardPanel's `cardSubline` and it hardcoded one
// venue's words. `locationPrivate` shipped 2026-09-10 for Light & Sound Design
// Studios, which says "RSVP FOR LOCATION" on its own posters, so the row read
// "L&SD, address with RSVP" — the venue's language, correctly.
//
// Then Greenpoint Trash Club arrived and the phrase was a lie. The club runs
// every Wednesday at 7:30 and announces WHERE on Instagram that morning; Batu
// confirmed it on 2026-09-11. It does not withhold an address and it has never
// mentioned an RSVP. Shipping it under that label would have put a sentence on
// the card the source never wrote, which is the same defect as a fabricated
// quote wearing different clothes.
//
// So the line moves onto the CARD. `locationNote` is the row's own words;
// "address with RSVP" stays the default, so every card written before today
// reads exactly as it did. It lives here rather than in the component because
// `npm test` covers src/**/*.test.mjs and the DOM runner is reserved for
// invariants that genuinely need a DOM.

// A venue already named in the title ("Sticker Buffet at Yoseka Land") is not
// repeated in the row.
const namedInTitle = (card, s) => !!s && card.title.toLowerCase().includes(s.toLowerCase());

export const DEFAULT_LOCATION_NOTE = "address with RSVP";

export function locationLine(card) {
  if (card.locationPrivate) {
    const note = card.locationNote || DEFAULT_LOCATION_NOTE;
    return namedInTitle(card, card.locationName) || !card.locationName ? note : `${card.locationName}, ${note}`;
  }
  if (card.address) return card.address.replace(/,\s*Brooklyn.*$/i, "");
  return namedInTitle(card, card.locationName) ? null : card.locationName ?? null;
}
