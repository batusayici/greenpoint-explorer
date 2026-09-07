import test from "node:test";
import assert from "node:assert/strict";
import { unfoldIcs, parseIcsDate, expandRecurrence, icsToText } from "./sourceIcs.js";

// A minimal wrapper so a fixture reads as the calendar it is imitating.
const cal = (...events) => ["BEGIN:VCALENDAR", "VERSION:2.0", ...events, "END:VCALENDAR"].join("\r\n");
const vevent = (...lines) => ["BEGIN:VEVENT", ...lines, "END:VEVENT"].join("\r\n");
// Every fixture below is dated around this instant so the window is explicit
// and the tests do not drift with the wall clock.
const NOW = new Date("2026-09-07T12:00:00Z");

test("unfolding rejoins the continuation lines RFC 5545 wraps at 75 octets", () => {
  // Google splits long SUMMARY/DESCRIPTION values across lines with a leading
  // space or tab. Read literally, a title arrives cut in half and the quote a
  // card rests on can never match the source.
  const raw = "SUMMARY:Back to School BBQ for\r\n  families and staff\r\nLOCATION:12 Newell St";
  assert.deepEqual(unfoldIcs(raw), ["SUMMARY:Back to School BBQ for families and staff", "LOCATION:12 Newell St"]);
  // Exactly ONE whitespace character is the fold marker and is consumed; the
  // second space above is real content. So a tab-folded line rejoins with no
  // space at all, and asserting otherwise would be asserting a bug.
  assert.deepEqual(unfoldIcs("A:one\r\n\tstill one\r\nB:two"), ["A:onestill one", "B:two"], "the tab is the marker, not content");
});

test("parseIcsDate reads the three shapes these calendars actually emit", () => {
  assert.equal(parseIcsDate("DTSTART", "20260913T140000Z").toISOString(), "2026-09-13T14:00:00.000Z");
  // A DATE value is all-day and has no clock. It must not silently become
  // midnight UTC, which in New York is the evening of the day before.
  const allDay = parseIcsDate("DTSTART;VALUE=DATE", "20260913");
  assert.equal(allDay.dateOnly, true, "a VALUE=DATE is flagged, not given a clock");
  assert.equal(allDay.toISOString().slice(0, 10), "2026-09-13");
  // A floating local time carries a TZID and no Z.
  assert.equal(parseIcsDate("DTSTART;TZID=America/New_York", "20260913T100000").toISOString(), "2026-09-13T14:00:00.000Z");
});

test("only events inside the forward window survive", () => {
  // This is the whole point of the reader. St. Stanislaus Kostka Academy's
  // calendar carries 3,281 events going back to 2016; without a window the
  // snapshot is a decade of dismissal times and no run could read it.
  const ics = cal(
    vevent("UID:old@x", "SUMMARY:Dismissal PK3 & K", "DTSTART:20160914T170000Z", "DTEND:20160916T170000Z"),
    vevent("UID:soon@x", "SUMMARY:Parish Picnic", "DTSTART:20260913T160000Z", "DTEND:20260913T200000Z"),
    vevent("UID:far@x", "SUMMARY:Christmas Concert", "DTSTART:20261220T160000Z"),
  );
  const out = icsToText(ics, { windowDays: 14 }, NOW);
  assert.match(out, /SUMMARY: Parish Picnic/);
  assert.doesNotMatch(out, /Dismissal/, "a 2016 event is not supply");
  assert.doesNotMatch(out, /Christmas Concert/, "beyond the window is not this run's business");
});

test("include and exclude filter on the summary, like feed and json already do", () => {
  const ics = cal(
    vevent("UID:a@x", "SUMMARY:Parish Picnic", "DTSTART:20260913T160000Z"),
    vevent("UID:b@x", "SUMMARY:i-Ready Assessment Window", "DTSTART:20260914T130000Z"),
    vevent("UID:c@x", "SUMMARY:Dress Down Day", "DTSTART:20260915T130000Z"),
  );
  const excluded = icsToText(ics, { windowDays: 14, exclude: ["i-Ready", "Dress Down"] }, NOW);
  assert.match(excluded, /Parish Picnic/);
  assert.doesNotMatch(excluded, /i-Ready/);
  assert.doesNotMatch(excluded, /Dress Down/);

  const included = icsToText(ics, { windowDays: 14, include: ["Picnic"] }, NOW);
  assert.match(included, /Parish Picnic/);
  assert.doesNotMatch(included, /Dress Down/, "include is a whitelist, not a hint");
});

test("a cancelled event is KEPT and marked, never silently dropped", () => {
  // The Wriggle advertised a Greenpoint Library storytime on 2026-09-12 that
  // the library's own calendar had flagged cancelled. Dropping cancellations
  // here would recreate that failure from the other side: the run would see no
  // event and leave a stale card up. Emit the status and let the run decide.
  const ics = cal(vevent("UID:x@x", "SUMMARY:Family StoryTime", "DTSTART:20260912T143000Z", "STATUS:CANCELLED"));
  const out = icsToText(ics, { windowDays: 14 }, NOW);
  assert.match(out, /SUMMARY: Family StoryTime/);
  assert.match(out, /STATUS: CANCELLED/);
});

test("escaped commas, semicolons and newlines are unescaped", () => {
  const ics = cal(
    vevent("UID:x@x", "SUMMARY:Bake sale\\, coffee\\; and cake", "DESCRIPTION:Line one\\nLine two", "DTSTART:20260913T160000Z"),
  );
  const out = icsToText(ics, { windowDays: 14 }, NOW);
  assert.match(out, /SUMMARY: Bake sale, coffee; and cake/);
  assert.match(out, /Line one Line two/, "an escaped newline flattens, keeping one field per line");
});

test("a weekly series is expanded to its occurrences inside the window only", () => {
  // Greenpoint Reformed Church's calendar carries 237 RRULEs. Left unexpanded a
  // weekly programme shows one date from years ago and reads as finished.
  const ics = cal(
    vevent("UID:w@x", "SUMMARY:Sunday School", "DTSTART:20240107T140000Z", "DTEND:20240107T150000Z", "RRULE:FREQ=WEEKLY;BYDAY=SU"),
  );
  const out = icsToText(ics, { windowDays: 14 }, NOW);
  const starts = [...out.matchAll(/DTSTART: (\S+)/g)].map((m) => m[1]);
  assert.deepEqual(
    starts,
    ["2026-09-13T14:00:00.000Z", "2026-09-20T14:00:00.000Z"],
    "the two Sundays in the next 14 days, not the 2024 seed and not every Sunday since",
  );
});

test("EXDATE removes a cancelled occurrence from an expanded series", () => {
  const ics = cal(
    vevent(
      "UID:w@x",
      "SUMMARY:Sunday School",
      "DTSTART:20240107T140000Z",
      "RRULE:FREQ=WEEKLY;BYDAY=SU",
      "EXDATE:20260913T140000Z",
    ),
  );
  const out = icsToText(ics, { windowDays: 14 }, NOW);
  assert.doesNotMatch(out, /2026-09-13/, "the church said this one is off");
  assert.match(out, /2026-09-20/);
});

test("UNTIL and COUNT stop a series that has already finished", () => {
  const ended = cal(
    vevent("UID:u@x", "SUMMARY:Summer Series", "DTSTART:20260602T140000Z", "RRULE:FREQ=WEEKLY;UNTIL=20260825T140000Z"),
  );
  assert.equal(icsToText(ended, { windowDays: 14 }, NOW).trim(), "", "a series past its UNTIL yields nothing");
  const counted = cal(vevent("UID:c@x", "SUMMARY:Three Weeks", "DTSTART:20260602T140000Z", "RRULE:FREQ=WEEKLY;COUNT=3"));
  assert.equal(icsToText(counted, { windowDays: 14 }, NOW).trim(), "", "COUNT is honoured, so it ended in June");
});

test("expandRecurrence is bounded even when a rule never ends", () => {
  // A malformed or endless rule must not spin. The window is the bound.
  const from = new Date("2026-09-07T00:00:00Z");
  const to = new Date("2026-09-21T00:00:00Z");
  const occ = expandRecurrence(new Date("2020-01-01T14:00:00Z"), "FREQ=DAILY", [], from, to);
  assert.equal(occ.length, 14, "one per day in the window, not six years of them");
});

test("an all-day event renders as a bare DATE, never a midnight instant", () => {
  // Caught running this against St. Stanislaus Kostka Academy's real calendar.
  // Its school-day entries are VALUE=DATE, and rendering one as
  // "2026-09-08T00:00:00.000Z" invites the next reader to convert it to
  // America/New_York and land on the EVENING OF 2026-09-07 — a whole day early.
  // There is no clock in the source, so the snapshot must not imply one. Same
  // reasoning as the card model's allDay flag.
  const ics = cal(vevent("UID:x@x", "SUMMARY:No School", "DTSTART;VALUE=DATE:20260908", "DTEND;VALUE=DATE:20260909"));
  const out = icsToText(ics, { windowDays: 14 }, NOW);
  assert.match(out, /DTSTART: 2026-09-08$/m);
  assert.doesNotMatch(out, /T00:00:00/, "no invented midnight");
});

test("an HTML description is flattened, like every other source's values", () => {
  // Greenpoint Reformed Church wraps descriptions in <html-blob> and uses
  // entities. Left raw the snapshot carries markup a quote would have to match.
  const ics = cal(
    vevent(
      "UID:x@x",
      "SUMMARY:Community Meal",
      "DTSTART:20260908T220000Z",
      "DESCRIPTION:<html-blob>Volunteers cook a meal.&nbsp;All are welcome!</html-blob>",
    ),
  );
  const out = icsToText(ics, { windowDays: 14 }, NOW);
  assert.match(out, /DESCRIPTION: Volunteers cook a meal. All are welcome!/);
  assert.doesNotMatch(out, /html-blob|&nbsp;/);
});

test("the rendered block is one field per line, so the diff stays readable", () => {
  const ics = cal(
    vevent("UID:x@x", "SUMMARY:Parish Picnic", "DTSTART:20260913T160000Z", "DTEND:20260913T200000Z", "LOCATION:12 Newell St"),
  );
  assert.equal(
    icsToText(ics, { windowDays: 14 }, NOW).trim(),
    ["SUMMARY: Parish Picnic", "DTSTART: 2026-09-13T16:00:00.000Z", "DTEND: 2026-09-13T20:00:00.000Z", "LOCATION: 12 Newell St"].join("\n"),
  );
});

test("events come out in date order regardless of the file's order", () => {
  // Google exports in creation order, not date order. An unsorted snapshot
  // reorders itself on every export and every run reads as `changed`.
  const ics = cal(
    vevent("UID:b@x", "SUMMARY:Second", "DTSTART:20260915T160000Z"),
    vevent("UID:a@x", "SUMMARY:First", "DTSTART:20260913T160000Z"),
  );
  const out = icsToText(ics, { windowDays: 14 }, NOW);
  assert.ok(out.indexOf("First") < out.indexOf("Second"));
});
