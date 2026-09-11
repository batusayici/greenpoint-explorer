import test from "node:test";
import assert from "node:assert/strict";
import { locationLine, DEFAULT_LOCATION_NOTE } from "./locationLine.js";

test("a card with an address prints the street, without the city boilerplate", () => {
  assert.equal(locationLine({ title: "Trivia night", address: "117 Franklin St, Brooklyn, NY 11222" }), "117 Franklin St");
});

test("a venue already named in the title is not repeated", () => {
  assert.equal(locationLine({ title: "Sticker Buffet at Yoseka Land", locationName: "Yoseka Land" }), null);
  assert.equal(locationLine({ title: "Sticker Buffet", locationName: "Yoseka Land" }), "Yoseka Land");
});

// Light & Sound Design, shipped 2026-09-10. Its posters say "RSVP FOR LOCATION",
// so this is the venue's own language and must not change.
test("a no-pin card still defaults to the RSVP wording", () => {
  assert.equal(
    locationLine({ title: "Quadraphonics at Light & Sound Design", locationName: "Light & Sound Design", locationPrivate: true }),
    DEFAULT_LOCATION_NOTE,
    "the venue is in the title, so only the note prints",
  );
  assert.equal(
    locationLine({ title: "Quadraphonics", locationName: "Light & Sound Design", locationPrivate: true }),
    "Light & Sound Design, address with RSVP",
  );
});

// Greenpoint Trash Club. It does not withhold an address and has never
// mentioned an RSVP — it announces the week's meeting point on Instagram that
// morning. The default phrase would be a sentence the source never wrote.
test("a card can say in its own words why it has no pin", () => {
  assert.equal(
    locationLine({
      title: "Greenpoint Trash Club",
      locationPrivate: true,
      locationNote: "meeting point posted on Instagram that morning",
    }),
    "meeting point posted on Instagram that morning",
  );
});

test("a note joins a venue name the title does not already carry", () => {
  assert.equal(
    locationLine({ title: "Weekly litter pick-up", locationName: "Greenpoint Trash Club", locationPrivate: true, locationNote: "meeting point posted on Instagram that morning" }),
    "Greenpoint Trash Club, meeting point posted on Instagram that morning",
  );
});
