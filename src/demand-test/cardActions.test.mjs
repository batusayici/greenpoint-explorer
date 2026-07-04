import test from "node:test";
import assert from "node:assert/strict";
import { actionHref } from "./cardActions.js";

// 2026-07-03 tappability rule: every rendered action must produce evidence
// (action_tap). A `visit` without a URL resolves to directions derived from the
// card's own address/coords — derived, not invented, so the truth rules hold.

const shop = { address: "817 Manhattan Ave, Brooklyn, NY 11222", lat: 40.728265, lng: -73.953488 };

test("an explicit url always wins", () => {
  assert.equal(
    actionHref({ type: "visit", url: "https://example.com" }, shop),
    "https://example.com",
  );
});

test("a url-less visit resolves to directions for the card's address", () => {
  assert.equal(
    actionHref({ type: "visit" }, shop),
    "https://www.google.com/maps/search/?api=1&query=817%20Manhattan%20Ave%2C%20Brooklyn%2C%20NY%2011222",
  );
});

test("with no address, a visit falls back to the card's coordinates", () => {
  assert.equal(
    actionHref({ type: "visit" }, { address: null, lat: 40.7301, lng: -73.9584 }),
    "https://www.google.com/maps/search/?api=1&query=40.7301%2C-73.9584",
  );
});

test("a visit with neither address nor coords has no href", () => {
  assert.equal(actionHref({ type: "visit" }, { address: null, lat: null, lng: null }), null);
});

test("directions are only derived for visits — a url-less rsvp stays href-less", () => {
  assert.equal(actionHref({ type: "rsvp" }, shop), null);
});

test("share and internal filter actions carry no href (component-handled)", () => {
  assert.equal(actionHref({ type: "share" }, shop), null);
  assert.equal(actionHref({ type: "visit", filterId: "g_train" }, shop), null);
});
