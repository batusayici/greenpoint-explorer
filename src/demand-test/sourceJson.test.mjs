import test from "node:test";
import assert from "node:assert/strict";
import { getPath, coerceDate, jsonToText, embeddedToText, expandUrlTemplate } from "./sourceJson.js";
import { htmlToText } from "./sourceText.js";

test("getPath walks nested keys and survives gaps", () => {
  const o = { data: { results: [1, 2] }, a: { b: { c: "deep" } } };
  assert.deepEqual(getPath(o, "data.results"), [1, 2]);
  assert.equal(getPath(o, "a.b.c"), "deep");
  assert.equal(getPath(o, "a.missing.c"), undefined);
  assert.equal(getPath(o, ""), o, "empty path is the root");
});

test("jsonToText selects the named fields, in order", () => {
  const data = { items: [{ title: "Malifaux Monthly", extra: "ignored", venue: "Carcosa" }] };
  assert.equal(jsonToText(data, { path: "items", fields: ["title", "venue"] }), "title: Malifaux Monthly\nvenue: Carcosa");
});

test("jsonToText reads nested field paths and a root-level array", () => {
  // Google Calendar puts the date under start.date; feather returns a bare array.
  const gcal = { items: [{ summary: "DERVISI", start: { date: "2026-08-05" } }] };
  assert.equal(jsonToText(gcal, { path: "items", fields: ["summary", "start.date"] }), "summary: DERVISI\nstart.date: 2026-08-05");
  const feather = [{ name: "Dance Trapeze", start_at: "2026-08-05T21:00:00.000Z" }];
  assert.equal(jsonToText(feather, { fields: ["name", "start_at"] }), "name: Dance Trapeze\nstart_at: 2026-08-05T21:00:00.000Z");
});

test("epoch dates become ISO so an extraction pass can read them", () => {
  // Squarespace returns epoch milliseconds; the library's Solr index, seconds.
  // Derive both from the ISO instant so the fixture can't drift from the claim.
  const iso = "2026-08-05T00:00:00.000Z";
  const ms = Date.parse(iso);
  assert.equal(coerceDate("startDate", ms), iso);
  assert.equal(coerceDate("start_at", ms), iso);
  assert.equal(coerceDate("is_event_start_date", ms / 1000), iso);
});

test("only date-shaped keys in a plausible epoch range are coerced", () => {
  assert.equal(coerceDate("price_in_cents", 1785931200000), null, "a price is not a date");
  assert.equal(coerceDate("collectionId", 1785931200000), null, "an id is not a date");
  assert.equal(coerceDate("startDate", 42), null, "42 is not an epoch");
  assert.equal(coerceDate("startDate", "2026-08-05"), null, "strings pass through untouched");
  // Regression guard: a real price must survive into the snapshot as itself.
  const out = jsonToText([{ name: "Kids Aerial", price_in_cents: 4500 }], { fields: ["name", "price_in_cents"] });
  assert.equal(out, "name: Kids Aerial\nprice_in_cents: 4500");
});

test("HTML inside a value is flattened to one line", () => {
  const data = { docs: [{ ts_title: "Toddler Time", ts_body: "<p>Songs &amp; stories.</p><p>All welcome.</p>" }] };
  assert.equal(
    jsonToText(data, { path: "docs", fields: ["ts_title", "ts_body"] }),
    "ts_title: Toddler Time\nts_body: Songs & stories. All welcome.",
    "a multi-paragraph body must not break the one-field-per-line contract",
  );
});

test("empty and missing fields are skipped, items separated by a blank line", () => {
  const data = { items: [{ title: "A", note: null, tags: [] }, { title: "B", note: "kept" }] };
  assert.equal(jsonToText(data, { path: "items", fields: ["title", "note", "tags"] }), "title: A\n\ntitle: B\nnote: kept");
});

// Opt-in item filter, the `json` twin of `feed: { include: [...] }` (which the
// feed code already called "the same shape as the json block"). Added
// 2026-08-13 for the MTA citywide subway-alerts feed: 197 alerts, of which only
// the ones touching a Greenpoint station matter, and ~43 are realtime churn
// that would diff the snapshot on every run. Matching is a substring test
// against the RAW item JSON — the same choice feedToText makes against raw item
// XML — so a filter can key on a field the rendered output does not carry.
test("json include filters items by raw-payload substring, before rendering", () => {
  const data = {
    entity: [
      { id: "a", alert: { stops: ["G26", "G28"], header: { text: "No G between Court Sq and Bedford-Nostrand" } } },
      { id: "b", alert: { stops: ["G33", "G34"], header: { text: "No G between Hoyt-Schermerhorn and Church Av" } } },
    ],
  };
  const out = jsonToText(data, {
    path: "entity",
    include: ['"G26"'],
    fields: ["alert.header.text"],
  });
  assert.equal(
    out,
    "alert.header.text: No G between Court Sq and Bedford-Nostrand",
    "the Greenpoint-closing alert is kept and the Bedford-Nostrand-south one dropped, on a field the output never renders",
  );
});

test("json include is OR across terms, and no include keeps everything", () => {
  const data = { entity: [{ n: "G26 only" }, { n: "G28 only" }, { n: "G33 only" }] };
  assert.equal(jsonToText(data, { path: "entity", include: ["G26", "G28"], fields: ["n"] }), "n: G26 only\n\nn: G28 only");
  assert.equal(jsonToText(data, { path: "entity", fields: ["n"] }).split("\n\n").length, 3);
  assert.equal(jsonToText(data, { path: "entity", include: [], fields: ["n"] }).split("\n\n").length, 3, "an empty list is not a filter");
});

// Zero matches is a legitimate quiet week (no planned work at a Greenpoint
// stop), not a dead source — the same call feedToText makes.
test("json include matching nothing yields empty, not an error", () => {
  const data = { entity: [{ n: "G33 only" }] };
  assert.equal(jsonToText(data, { path: "entity", include: ["G26"], fields: ["n"] }), "");
});

test("an empty array is a real state, not a failure", () => {
  // A Squarespace calendar month with no events must snapshot as empty rather
  // than error — reporting it as an unreachable source would be a lie that
  // also trips the degraded-run gate.
  assert.equal(jsonToText({ items: [] }, { path: "items" }), "");
});

test("a path that is not an array throws — the API shape moved", () => {
  assert.throws(() => jsonToText({ items: { nope: 1 } }, { path: "items" }), /not an array/);
  assert.throws(() => jsonToText({}, { path: "response.docs" }), /not an array/);
});

test("embeddedToText recovers a schedule that tag-stripping would discard", () => {
  // Shaped like the real Podia markup: JSON in an attribute, HTML inside the
  // JSON, with < and > carried as \u escapes the way Podia emits them. The
  // page's own markup holds no readable text at all — that is what made a live
  // source look dead until 2026-08-05.
  const payload = JSON.stringify({ blocks: [{ text: "<p><strong>Adult Ballet</strong> Mondays 6:45-8pm</p>" }] })
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/"/g, "&quot;");
  const html = `<div data-props="${payload}"></div><body></body>`;
  assert.equal(htmlToText(html), "", "precondition: the page renders no text of its own");
  assert.equal(embeddedToText(html, { attr: "data-props" }), "Adult Ballet Mondays 6:45-8pm");
});

test("embeddedToText keeps a non-JSON payload rather than dropping it", () => {
  const html = `<div data-props="just text, not json"></div>`;
  assert.equal(embeddedToText(html, { attr: "data-props" }), "just text, not json");
});

test("embeddedToText fails loudly when the payload is gone", () => {
  // Silence here would snapshot an empty page as a real "the schedule is empty"
  // state — the failure mode this whole strategy exists to prevent.
  assert.throws(() => embeddedToText("<div>no payload here</div>", { attr: "data-props" }), /markup changed/);
  assert.throws(() => embeddedToText("<div data-props=\"x\"></div>", {}), /needs an `attr`/);
});

test("expandUrlTemplate fills the runtime values the APIs demand", () => {
  const now = new Date("2026-08-05T14:47:18.123Z");
  assert.equal(expandUrlTemplate("q={{now:epoch}}", now), "q=1785941238");
  assert.equal(expandUrlTemplate("timeMin={{now:iso}}", now), "timeMin=2026-08-05T14:47:18Z");
  assert.equal(expandUrlTemplate("?month={{month:+0}}", now), "?month=08-2026");
  assert.equal(expandUrlTemplate("?month={{month:+1}}", now), "?month=09-2026");
  assert.equal(expandUrlTemplate("untouched", now), "untouched");
});

test("month offsets roll over the year, and unknown templates fail loudly", () => {
  const dec = new Date("2026-12-15T00:00:00.000Z");
  assert.equal(expandUrlTemplate("?month={{month:+1}}", dec), "?month=01-2027");
  assert.throws(() => expandUrlTemplate("{{bogus:x}}", dec), /unknown URL template/);
});

test("env template pulls from process.env and fails loudly when unset", () => {
  const now = new Date("2026-08-05T14:47:18.123Z");
  process.env.TEST_TEMPLATE_VAR = "shh";
  assert.equal(expandUrlTemplate("key={{env:TEST_TEMPLATE_VAR}}", now), "key=shh");
  delete process.env.TEST_TEMPLATE_VAR;
  assert.throws(() => expandUrlTemplate("key={{env:TEST_TEMPLATE_VAR}}", now), /missing env var TEST_TEMPLATE_VAR/);
});
