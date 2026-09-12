// Track V — read a calendar whose facts live in HTML data attributes, not in
// the rendered text, and not in an array the JSON strategy can walk.
//
// Added 2026-09-12 for TALEA (theshopcalendar.com, the same widget vendor as
// Threes Brewing). Threes publishes a clean `/<calendar-uuid>/events.json`
// array, so `fetch: "json"` reads it. TALEA has no such endpoint — its public
// route is the theme extension's widget call, which answers with a SINGLE
// object whose one `html` key holds ~206KB of rendered markup. Reading that
// markup as text is useless: the month grid prints event names and days and
// drops every start time. The times, the end times, the per-taproom address
// and the recurrence are all in `data-*` attributes on each event's modal
// trigger, which `htmlToText` throws away and `jsonToText` refuses (it
// requires an array and this payload is an object).
//
// So this strategy exists to pull named attributes out of marked elements and
// emit the same line-oriented blocks as every other source. Three things it
// has to get right, each learned by getting it wrong first:
//
// 1. DO NOT try to match the element. An event's `data-event-description`
//    carries real markup, so `<[^>]*>` stops at the first `>` INSIDE an
//    attribute value and every attribute after it reads as missing. That looked
//    exactly like a widget serving 20 of 31 events with no date — a false
//    negative that would have retired a healthy source. Scan a bounded window
//    after each marker instead, and take the first hit per key.
// 2. DEDUPE. The widget renders a desktop copy and a mobile copy of every
//    event, so the raw markup holds 103 triggers for 52 events. Left in, a
//    snapshot doubles and every diff churns against itself.
// 3. SORT. Records are emitted in DOM order, which the vendor is free to
//    change; a stable order keeps the snapshot hash from flapping on a
//    re-render that changed nothing a reader would notice.
import { decode } from "./sourceText.js";

// Wide enough to clear a long description plus the attributes that follow it,
// bounded so a malformed page cannot make one record swallow the next.
const WINDOW = 8000;

const flatten = (v) => decode(String(v)).replace(/\s+/g, " ").trim();

/**
 * @param html     markup holding one marked element per record
 * @param marker   substring identifying a record's element (e.g. a class name)
 * @param keys     attribute names to emit per record, in order
 * @param include  keep only records whose rendered text contains one of these
 *
 * `include` is the same contract as `feed: { include: [...] }` and
 * `json: { include: [...] }` — scope a multi-location endpoint down to the
 * neighborhood so the daily diff tracks Greenpoint instead of churning with
 * the rest of the city. For TALEA that filter is "Richardson Street", the
 * Williamsburg taproom's own street, and NOT the word "Williamsburg": their
 * address strings are inconsistent across taprooms and one variant names no
 * neighborhood at all ("TALEA Beer Co., Bergen Street" is Cobble Hill), so a
 * neighborhood-word filter is unsafe in both directions.
 *
 * An empty result is NOT an error — a calendar with nothing on this month is a
 * real state, and the caller's own substance check is what catches a page that
 * never rendered.
 */
export function attrRecordsToText(html, { marker = "", keys = [], include = null } = {}) {
  if (!marker) throw new Error("attrs: `marker` is required — without it every element matches");
  if (!Array.isArray(keys) || keys.length === 0) throw new Error("attrs: `keys` is required");
  const source = typeof html === "string" ? html : "";

  const records = [];
  let at = source.indexOf(marker);
  while (at !== -1) {
    const window = source.slice(at, at + WINDOW);
    const lines = [];
    for (const key of keys) {
      const hit = new RegExp(`${key}="(.*?)"`, "s").exec(window);
      const value = hit ? flatten(hit[1]) : "";
      if (value) lines.push(`${key}: ${value}`);
    }
    if (lines.length) records.push(lines.join("\n"));
    at = source.indexOf(marker, at + marker.length);
  }

  let blocks = [...new Set(records)];
  if (Array.isArray(include) && include.length) {
    blocks = blocks.filter((b) => include.some((s) => b.includes(s)));
  }
  return blocks.sort().join("\n\n");
}

/**
 * Pull the markup out of the response before extracting from it.
 *
 * @param body   raw response text
 * @param field  dot path to the string holding the markup; "" = the body IS
 *               the markup (a plain HTML page rather than a JSON wrapper)
 */
export function markupFrom(body, field = "") {
  if (!field) return body;
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`attrs: response was not JSON (${body.length} bytes) but field "${field}" was asked for`);
  }
  const markup = field.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), data);
  if (typeof markup !== "string") {
    throw new Error(`attrs: field "${field}" is ${markup === undefined ? "missing" : typeof markup}, not a string — API shape changed?`);
  }
  return markup;
}
