import test from "node:test";
import assert from "node:assert/strict";
import { extractDates, buildHostMap, coveredDays, reconcile, nyDay } from "./coverage.js";

// L12 coverage reconciliation. The first version of this shipped as a script
// with NO tests, and six bugs were found in it by hand in one afternoon. Each
// one is a case below, because the dangerous failure here is not a crash — it
// is a checker that quietly demands cards the deck already has, which is how a
// coverage report turns into duplicate cards on the live map.

const NOW = new Date("2026-08-07T12:00:00-04:00");
const SRC = [
  { id: "troost", url: "https://www.googleapis.com/calendar/v3/x", citeHost: "troostny.com" },
  { id: "nycparks-mcgolrick", url: "https://www.nycgovparks.org/parks/msgr-mcgolrick-park/events" },
  { id: "nycparks-mccarren", url: "https://www.nycgovparks.org/parks/mccarren-park/events" },
  { id: "black-rabbit", url: "https://blackrabbitbar.com", standing: true },
  { id: "bin-bin-sake", url: "https://binbinsake.com" },
];
const card = (o) => ({ sourceLinks: [{ url: o.url }], ...o });

// ---- BUG 1: Map<host, id> kept only the LAST source for a shared host ----
test("host map: sources sharing a host all resolve, not just the last one", () => {
  const m = buildHostMap(SRC);
  assert.deepEqual([...m.get("nycgovparks.org")].sort(), ["nycparks-mccarren", "nycparks-mcgolrick"]);
  assert.deepEqual([...m.get("troostny.com")], ["troost"], "citeHost maps the cited host to the fetched source");
});

test("host map: a card on a shared host credits every source on that host", () => {
  const cards = [card({
    url: "https://www.nycgovparks.org/parks/msgr-mcgolrick-park/events",
    startsAt: "2026-08-19T20:00:00-04:00", endsAt: "2026-08-19T22:00:00-04:00",
  })];
  const cov = coveredDays(cards, buildHostMap(SRC), { now: NOW });
  assert.ok(cov.get("nycparks-mcgolrick").has("2026-08-19"));
  assert.ok(cov.get("nycparks-mccarren").has("2026-08-19"), "over-crediting a sibling beats a false GAP");
});

// ---- BUG 2: end.date is EXCLUSIVE on Google Calendar all-day events ----
test("extractDates: an end-keyed line never invents a date", () => {
  const gcal = "summary: Stan Zenkov\nstart.date: 2026-08-11\nend.date: 2026-08-12\n";
  assert.deepEqual(extractDates(gcal, { now: NOW }), ["2026-08-11"], "8/12 is the exclusive end, not a gig");
});

test("extractDates: the BPL end field is dropped too, not just Google's", () => {
  const bpl = "ts_title: Babies & Books\nds_event_start_date: 2026-08-13\nds_event_end_date: 2026-08-14\n";
  assert.deepEqual(extractDates(bpl, { now: NOW }), ["2026-08-13"]);
});

// ---- BUG 3: toISOString() rolled an evening event onto the next UTC day ----
test("nyDay: an 8pm EDT event belongs to that evening, not the next UTC day", () => {
  assert.equal(nyDay(new Date("2026-08-19T20:00:00-04:00")), "2026-08-19");
  assert.equal(new Date("2026-08-19T20:00:00-04:00").toISOString().slice(0, 10), "2026-08-20",
    "the trap this guards: UTC says the 20th");
});

test("coverage: an evening card covers its own evening — closing this 'gap' would duplicate it", () => {
  const cards = [card({
    url: "https://www.nycgovparks.org/parks/msgr-mcgolrick-park/events",
    startsAt: "2026-08-19T20:00:00-04:00", endsAt: "2026-08-19T22:00:00-04:00",
  })];
  const rows = reconcile({
    sources: SRC, cards, now: NOW,
    snapshots: new Map([["nycparks-mcgolrick", "Movies Under the Stars 2026-08-19"]]),
  });
  const r = rows.find((x) => x.id === "nycparks-mcgolrick");
  assert.deepEqual(r.missing, [], "the deck already speaks for 8/19");
  assert.equal(r.state, "ok");
});

// ---- BUG 4: an end-only standing offer covered nothing ----
test("coverage: an end-only standing card speaks for every day through its verified-through", () => {
  const cards = [card({
    url: "https://hanamakgeolli.com/events", recurring: true, endsAt: "2026-08-22T23:59:00-04:00",
  })];
  const sources = [{ id: "hana", url: "https://hanamakgeolli.com/events" }];
  const cov = coveredDays(cards, buildHostMap(sources), { now: NOW });
  const days = cov.get("hana");
  assert.ok(days.has("2026-08-13"), "a Thursday inside the span");
  assert.ok(days.has("2026-08-16"), "and the Sunday");
});

// ---- BUG 5: an UNMARKED static-schedule source was classified `quiet` ----
test("unmarked standing: a static weekly schedule with no cards is FLAGGED, not filed quiet", () => {
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW,
    snapshots: new Map([["bin-bin-sake", "Trivia every Tuesday at 8pm"]]),
  });
  assert.equal(rows.find((r) => r.id === "bin-bin-sake").state, "UNMARKED STANDING?",
    "the pre-fix Black Rabbit shape must never be silent again");
});

test("standing: a marked source with recurring text and no cards is STANDING DARK", () => {
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW,
    snapshots: new Map([["black-rabbit", "Every Tuesday at 8pm Nerd Alert! TRIVIA"]]),
  });
  assert.equal(rows.find((r) => r.id === "black-rabbit").state, "STANDING DARK");
});

test("standing: a marked source that HAS its recurring card is quiet, not dark", () => {
  const cards = [card({
    url: "https://blackrabbitbar.com", recurring: true,
    startsAt: "2026-08-11T20:00:00-04:00", endsAt: "2026-08-21T23:59:00-04:00",
  })];
  const rows = reconcile({
    sources: SRC, cards, now: NOW,
    snapshots: new Map([["black-rabbit", "Every Tuesday at 8pm Nerd Alert! TRIVIA"]]),
  });
  assert.equal(rows.find((r) => r.id === "black-rabbit").state, "ok");
});

// ---- the core job ----
test("gap: dates the snapshot carries and the deck does not are reported, with the dates", () => {
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW,
    snapshots: new Map([["troost", "start.date: 2026-08-20\nstart.date: 2026-08-21\n"]]),
  });
  const r = rows.find((x) => x.id === "troost");
  assert.equal(r.state, "GAP");
  assert.deepEqual(r.missing, ["2026-08-20", "2026-08-21"]);
});

// The horizon is inclusive of now+windowDays: from 8/7 that is 8/21, so 8/22 is
// NOT yet a gap. Written the other way round first, and this test caught it.
test("window: dates beyond the horizon are not gaps yet", () => {
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW, windowDays: 14,
    snapshots: new Map([["troost", "start.date: 2026-09-18\n"]]),
  });
  assert.equal(rows.find((x) => x.id === "troost").state, "quiet", "9/18 is real supply, just not yet due");
});

test("an unparseable snapshot reads as no signal, never as no supply", () => {
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW,
    snapshots: new Map([["troost", "Opening hours: noon till late. Follow us for lineups."]]),
  });
  assert.equal(rows.find((x) => x.id === "troost").state, "quiet");
});

test("a source never fetched is NO SNAPSHOT, distinct from having nothing on", () => {
  const rows = reconcile({ sources: SRC, cards: [], now: NOW, snapshots: new Map() });
  assert.equal(rows.find((x) => x.id === "troost").state, "NO SNAPSHOT");
});

// ---- BUG 7: an undated `subscription` card covered nothing ----
test("coverage: an undated subscription card represents standing programming", () => {
  const sources = [{ id: "last-place", url: "https://lastplacebk.com" }];
  const cards = [{ category: "subscription", sourceLinks: [{ url: "https://lastplacebk.com" }] }];
  const rows = reconcile({
    sources, cards, now: NOW,
    snapshots: new Map([["last-place", "Chess & Chill Every Tuesday"]]),
  });
  assert.equal(rows[0].state, "ok", "chess every Tuesday IS carded — as a membership, which has no dates");
});

test("coverage: an undated PLACE card must not mask a venue going dark", () => {
  const sources = [{ id: "black-rabbit", url: "https://blackrabbitbar.com", standing: true }];
  const cards = [{ category: "food_drink", sourceLinks: [{ url: "https://blackrabbitbar.com" }] }];
  const rows = reconcile({
    sources, cards, now: NOW,
    snapshots: new Map([["black-rabbit", "Every Tuesday at 8pm Nerd Alert! TRIVIA"]]),
  });
  assert.equal(rows[0].state, "STANDING DARK", "a venue card is not a programme card");
});

// ---- three-state `standing`, so the signal converges instead of nagging ----
test("standing: false means reviewed-and-incidental, and stays quiet", () => {
  const sources = [{ id: "bin-bin-sake", url: "https://binbinsake.com", standing: false }];
  const rows = reconcile({
    sources, cards: [], now: NOW,
    snapshots: new Map([["bin-bin-sake", "shipments go out every Thursday"]]),
  });
  assert.equal(rows[0].state, "ok", "a shipping line is not programming, and saying so once must stick");
});
