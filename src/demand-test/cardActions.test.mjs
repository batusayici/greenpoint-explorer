import test from "node:test";
import assert from "node:assert/strict";
import { actionHref, withShareAction, sharePayload } from "./cardActions.js";

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
  assert.equal(actionHref({ type: "visit", filterId: "deals" }, shop), null);
});

// V1-A (first-visit test, 2026-07-24): the group-chat forward is the growth
// loop — share renders on EVERY expanded card, and the payload is the card,
// not the generic site.

test("cards without a share action get one appended", () => {
  const acts = withShareAction([{ type: "visit", label: "Visit" }]);
  assert.equal(acts.length, 2);
  assert.deepEqual(acts[1], { type: "share", label: "Share" });
});

test("a card that declares its own share action keeps it untouched", () => {
  const own = [{ type: "share", label: "Share this campaign" }];
  assert.equal(withShareAction(own), own);
});

test("share payload carries the card title, weekday + time, and the brand", () => {
  const card = {
    id: "city-of-water-day",
    title: "City of Water Day at Transmitter Park",
    startsAt: "2026-07-25T10:00:00-04:00",
  };
  const { title, url } = sharePayload(card, { origin: "https://greenpoint.life", search: "" });
  assert.equal(title, "City of Water Day at Transmitter Park — Sat 10 AM · Greenpoint Life");
  assert.equal(url, "https://greenpoint.life/e/city-of-water-day?src=share");
});

test("a 10:30 start keeps its minutes; an all-day sentinel shows the date instead", () => {
  const base = { id: "x", title: "T" };
  assert.match(
    sharePayload({ ...base, startsAt: "2026-07-25T10:30:00-04:00" }, {}).title,
    /— Sat 10:30 AM · Greenpoint Life$/,
  );
  assert.match(
    sharePayload({ ...base, startsAt: "2026-07-25T00:00:00-04:00" }, {}).title,
    /— Sat Jul 25 · Greenpoint Life$/,
  );
});

test("undated and recurring cards share title-only", () => {
  assert.equal(sharePayload({ id: "x", title: "Falu House Tinned Fish Club" }, {}).title, "Falu House Tinned Fish Club · Greenpoint Life");
  assert.equal(
    sharePayload({ id: "x", title: "Weekend DJs", recurring: true, startsAt: "2026-07-25T20:00:00-04:00" }, {}).title,
    "Weekend DJs · Greenpoint Life",
  );
});

test("the share link retags the channel: src becomes share, other params survive", () => {
  const card = { id: "a b", title: "T" };
  const { url } = sharePayload(card, { origin: "https://greenpoint.life", search: "?src=wave1&x=1" });
  assert.equal(url, "https://greenpoint.life/e/a%20b?src=share&x=1");
});

test("the calendar variant tags src=calendar so saved-event returns are attributable", () => {
  const { url } = sharePayload({ id: "x", title: "T" }, { origin: "https://greenpoint.life", channel: "calendar" });
  assert.equal(url, "https://greenpoint.life/e/x?src=calendar");
});

// L10 (DECISION_LOG 2026-07-28): the correction entry point. A business
// disputing a "verified" card needs a route in that isn't Batu's inbox
// (which stays private) — the feedback form, prefilled with the card id so
// the report arrives targeted.
test("correctionHref prefills the feedback form with the card id", async () => {
  const { correctionHref } = await import("./cardActions.js");
  assert.equal(correctionHref("https://tally.so/r/LZqEj1", "film-noir-support"), "https://tally.so/r/LZqEj1?card=film-noir-support");
});

test("correctionHref encodes ids and appends to existing query strings", async () => {
  const { correctionHref } = await import("./cardActions.js");
  assert.equal(correctionHref("https://tally.so/r/LZqEj1?ref=app", "a b&c"), "https://tally.so/r/LZqEj1?ref=app&card=a%20b%26c");
});

// submitHref added 2026-07-28 (L5): the business submission link carries a
// ?ref= provenance tag (list vs empty placement) so the Tally submission
// itself records where it came from — tag-every-outbound-link rule.
test("submitHref prefills the submission form with the entry placement", async () => {
  const { submitHref } = await import("./cardActions.js");
  assert.equal(submitHref("https://tally.so/r/abc123", "list"), "https://tally.so/r/abc123?ref=list");
});

test("submitHref encodes refs and appends to existing query strings", async () => {
  const { submitHref } = await import("./cardActions.js");
  assert.equal(submitHref("https://tally.so/r/abc123?x=1", "empty state"), "https://tally.so/r/abc123?x=1&ref=empty%20state");
});

// followHref (2026-07-28): the Follow ask carries its object into the Tally
// form as a hidden field, so a segment is captured without a backend.
test("followHref prefills the form with the follow target", async () => {
  const { followHref } = await import("./cardActions.js");
  assert.equal(followHref("https://tally.so/r/abc123", "lens:family_kids"), "https://tally.so/r/abc123?follow=lens%3Afamily_kids");
});

test("followHref appends to an existing query string", async () => {
  const { followHref } = await import("./cardActions.js");
  assert.equal(followHref("https://tally.so/r/abc123?x=1", "all"), "https://tally.so/r/abc123?x=1&follow=all");
});
