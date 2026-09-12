import test from "node:test";
import assert from "node:assert/strict";
import { attrRecordsToText, markupFrom } from "./sourceAttrs.js";

const trigger = (attrs) =>
  `<a class="tsc--eventModalLink" ${Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")}>open</a>`;

const KEYS = ["data-event-title", "data-atc-event-start", "data-atc-event-end", "data-event-address"];
const opts = { marker: "tsc--eventModalLink", keys: KEYS };

test("emits one block per record, one field per line, in the declared key order", () => {
  const html = trigger({
    "data-event-title": "Trivia in Williamsburg",
    "data-atc-event-start": "2026-09-01 19:00",
    "data-atc-event-end": "2026-09-01 20:00",
    "data-event-address": "TALEA Beer Co - Williamsburg, Richardson Street, Brooklyn, NY, USA",
  });
  assert.equal(
    attrRecordsToText(html, opts),
    [
      "data-event-title: Trivia in Williamsburg",
      "data-atc-event-start: 2026-09-01 19:00",
      "data-atc-event-end: 2026-09-01 20:00",
      "data-event-address: TALEA Beer Co - Williamsburg, Richardson Street, Brooklyn, NY, USA",
    ].join("\n"),
  );
});

// The bug this module exists to survive: a description carrying real markup
// puts a `>` inside an attribute value, which truncates any element-shaped
// match and makes every later attribute read as missing.
test("reads attributes that follow a value containing markup", () => {
  const html = trigger({
    "data-event-title": "BYO Baby with CLIXO!",
    "data-event-description": "<p>Grab your crew &amp; play</p><br>Teams of up to 6",
    "data-atc-event-start": "2026-09-12 10:00",
    "data-atc-event-end": "2026-09-12 13:00",
    "data-event-address": "TALEA Beer Co - Williamsburg, Richardson Street, Brooklyn, NY, USA",
  });
  const out = attrRecordsToText(html, opts);
  assert.match(out, /data-atc-event-start: 2026-09-12 10:00/);
  assert.match(out, /data-atc-event-end: 2026-09-12 13:00/);
  assert.match(out, /Richardson Street/);
});

test("collapses the widget's duplicate desktop and mobile copies", () => {
  const one = trigger({
    "data-event-title": "Family Music Class with Jazz Baby",
    "data-atc-event-start": "2026-09-06 11:30",
    "data-atc-event-end": "2026-09-06 12:30",
    "data-event-address": "TALEA Beer Co - Williamsburg, Richardson Street, Brooklyn, NY, USA",
  });
  assert.equal(attrRecordsToText(one + one + one, opts).split("\n\n").length, 1);
});

test("include keeps only matching records, and keys on the street not the neighborhood", () => {
  const williamsburg = trigger({
    "data-event-title": "Trivia in Williamsburg",
    "data-atc-event-start": "2026-09-01 19:00",
    "data-atc-event-end": "2026-09-01 20:00",
    "data-event-address": "TALEA Beer Co - Williamsburg, Richardson Street, Brooklyn, NY, USA",
  });
  // Cobble Hill's address names no neighborhood at all, which is why a
  // "Williamsburg" filter is the wrong key in both directions.
  const cobbleHill = trigger({
    "data-event-title": "Trivia at Cobble Hill",
    "data-atc-event-start": "2026-09-02 19:00",
    "data-atc-event-end": "2026-09-02 20:00",
    "data-event-address": "TALEA Beer Co., Bergen Street, Brooklyn, NY, USA",
  });
  const out = attrRecordsToText(williamsburg + cobbleHill, { ...opts, include: ["Richardson Street"] });
  assert.match(out, /Trivia in Williamsburg/);
  assert.doesNotMatch(out, /Cobble Hill/);
  assert.equal(out.split("\n\n").length, 1);
});

test("output order is stable regardless of DOM order", () => {
  const a = trigger({ "data-event-title": "A", "data-atc-event-start": "2026-09-01 19:00" });
  const b = trigger({ "data-event-title": "B", "data-atc-event-start": "2026-09-02 19:00" });
  assert.equal(attrRecordsToText(a + b, opts), attrRecordsToText(b + a, opts));
});

test("decodes entities and flattens a value to one line", () => {
  const html = trigger({ "data-event-title": "Beers &amp; Braids,\n  by Freestyle", "data-atc-event-start": "2026-09-16 18:30" });
  assert.match(attrRecordsToText(html, opts), /data-event-title: Beers & Braids, by Freestyle\n/);
});

test("a month with no events is empty, not an error", () => {
  assert.equal(attrRecordsToText("<div>no events</div>", opts), "");
});

test("a record whose declared keys are all absent is skipped rather than emitted blank", () => {
  assert.equal(attrRecordsToText(`<a class="tsc--eventModalLink" data-other="x">open</a>`, opts), "");
});

test("a missing marker or empty keys is a configuration error", () => {
  assert.throws(() => attrRecordsToText("<a>x</a>", { keys: KEYS }), /marker/);
  assert.throws(() => attrRecordsToText("<a>x</a>", { marker: "m" }), /keys/);
});

test("markupFrom pulls the markup out of a JSON wrapper, or passes a page through", () => {
  assert.equal(markupFrom(JSON.stringify({ html: "<a>hi</a>" }), "html"), "<a>hi</a>");
  assert.equal(markupFrom(JSON.stringify({ a: { b: "<i>deep</i>" } }), "a.b"), "<i>deep</i>");
  assert.equal(markupFrom("<a>plain page</a>", ""), "<a>plain page</a>");
});

// A silent shape change is the failure mode this project keeps paying for, so
// both of these are loud.
test("markupFrom is loud when the shape moves", () => {
  assert.throws(() => markupFrom(JSON.stringify({ html: { nested: true } }), "html"), /not a string/);
  assert.throws(() => markupFrom(JSON.stringify({}), "html"), /missing/);
  assert.throws(() => markupFrom("<html>not json</html>", "html"), /was not JSON/);
});

// A record that simply lacks an attribute must NOT inherit the next record's
// value. This is how TALEA's Sep 12 CLIXO session came back carrying the
// Sunday music class's recurrence list — a wrong recurring date on a card,
// sourced from a neighbouring event.
test("a record does not inherit a following record's attributes", () => {
  const withoutRecurrence = trigger({
    "data-event-title": "BYO Baby with CLIXO!",
    "data-atc-event-start": "2026-09-12 10:00",
    "data-atc-event-end": "2026-09-12 13:00",
    "data-event-address": "TALEA Beer Co - Williamsburg, Richardson Street, Brooklyn, NY, USA",
  });
  const withRecurrence = trigger({
    "data-event-title": "Family Music Class with Jazz Baby",
    "data-atc-event-start": "2026-09-13 11:30",
    "data-atc-event-end": "2026-09-13 12:30",
    "data-event-address": "TALEA Beer Co - Williamsburg, Richardson Street, Brooklyn, NY, USA",
    "data-event-recurring-event-dates": "09/13/2026,09/20/2026,09/27/2026",
  });
  const keys = [...KEYS, "data-event-recurring-event-dates"];
  const blocks = attrRecordsToText(withoutRecurrence + withRecurrence, { ...opts, keys }).split("\n\n");
  const clixo = blocks.find((b) => b.includes("CLIXO"));
  assert.doesNotMatch(clixo, /recurring-event-dates/);
  assert.match(blocks.find((b) => b.includes("Jazz Baby")), /09\/13\/2026,09\/20\/2026,09\/27\/2026/);
});
