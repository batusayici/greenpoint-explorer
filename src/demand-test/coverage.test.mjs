import test from "node:test";
import assert from "node:assert/strict";
import { extractDates, buildHostMap, coveredDays, reconcile, nyDay, updatePulse, resolveCardChecked, isFlagged, isUnexplained } from "./coverage.js";

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

// ---- per-source pulse: lastCardedAt survives card expiry (2026-08-08) ----
// ingest:expire DELETES expired cards, so "when did this source last card" is
// not derivable from cards.json — a source whose last card aged out looked
// identical to one that never carded. The pulse persists it monotonically.

test("updatePulse: seeds from current cards' createdAt on an empty pulse", () => {
  const cards = [card({ url: "https://troostny.com/events", createdAt: "2026-08-05T09:00:00-04:00" })];
  assert.deepEqual(updatePulse({ sources: SRC, cards }), { troost: "2026-08-05" });
});

test("updatePulse: monotone — a deleted expired card never lowers lastCardedAt", () => {
  // The deck's freshest surviving troost card is OLDER than the stored pulse
  // (the newer card expired and was deleted). The pulse must not move backward.
  const cards = [card({ url: "https://troostny.com/events", createdAt: "2026-07-20T09:00:00-04:00" })];
  const next = updatePulse({ sources: SRC, cards, pulse: { troost: "2026-08-05" } });
  assert.equal(next.troost, "2026-08-05", "expiry deleting a card must never erase pulse history");
});

test("updatePulse: attributes through citeHost and shared hosts exactly like coverage", () => {
  const cards = [card({ url: "https://www.nycgovparks.org/parks/x/events", createdAt: "2026-08-06T09:00:00-04:00" })];
  const next = updatePulse({ sources: SRC, cards });
  assert.equal(next["nycparks-mcgolrick"], "2026-08-06");
  assert.equal(next["nycparks-mccarren"], "2026-08-06", "shared-host siblings both credited, same as coverage");
});

// ---- per-card "checked" resolution (2026-08-08) — the reader-facing join ----
// The 2026-08-07 pulse additions ("greenpoint-ymca", "driftaway-subscriptions")
// don't slug-match their cards' publisher names, which is exactly why this
// reuses cardSourceIds (URL-host based) instead of a second guess.

test("resolveCardChecked: joins by URL host, not by publisher name", () => {
  const cards = [
    card({ id: "ymca-fall-1", url: "https://www.ymcanyc.org/greenpoint/fall1", sourceLinks: [{ url: "https://www.ymcanyc.org/greenpoint/fall1", publisher: "YMCA of Greater New York" }] }),
  ];
  const sources = [{ id: "greenpoint-ymca", url: "https://www.ymcanyc.org/greenpoint" }];
  const out = resolveCardChecked({ sources, cards, pulse: { "greenpoint-ymca": "2026-08-07" } });
  assert.equal(out["ymca-fall-1"], "2026-08-07");
});

test("resolveCardChecked: multiple credited sources take the max date", () => {
  const cards = [card({ id: "shared", url: "https://www.nycgovparks.org/parks/x/events" })];
  const out = resolveCardChecked({
    sources: SRC,
    cards,
    pulse: { "nycparks-mcgolrick": "2026-08-01", "nycparks-mccarren": "2026-08-06" },
  });
  assert.equal(out.shared, "2026-08-06");
});

test("resolveCardChecked: no roster-source hit resolves to null (caller falls back to updatedAt)", () => {
  const cards = [card({ id: "orphan", url: "https://unlisted-domain.example/x" })];
  const out = resolveCardChecked({ sources: SRC, cards, pulse: { troost: "2026-08-07" } });
  assert.equal(out.orphan, null);
});

test("silence: a weekly source 22 days past its last card is SILENT; 21 is not", () => {
  const snapshots = new Map([["troost", "Opening hours: noon till late."]]);
  const at = (day) =>
    reconcile({ sources: SRC, cards: [], now: NOW, snapshots, pulse: { troost: day } })
      .find((r) => r.id === "troost");
  assert.equal(at("2026-07-16").state, "SILENT", "22 days > 3 weekly cycles");
  assert.equal(at("2026-07-17").state, "quiet", "21 days is exactly the threshold, not past it");
  assert.equal(at("2026-07-16").lastCardedAt, "2026-07-16", "the report needs the date to print");
});

test("silence: a monthly source is measured against monthly cycles, not weekly", () => {
  // Monthly sources are fetched only on first-Monday runs (skipped_monthly
  // otherwise) — a weekly threshold would flag every one of them permanently.
  const sources = [{ id: "greenpoint-ymca", url: "https://ymcanyc.org/greenpoint", cadence: "monthly" }];
  const snapshots = new Map([["greenpoint-ymca", "Opening hours: 6am."]]);
  const at = (day) =>
    reconcile({ sources, cards: [], now: NOW, snapshots, pulse: { "greenpoint-ymca": day } })[0];
  assert.equal(at("2026-06-08").state, "quiet", "60 days silent is fine for a monthly source");
  assert.equal(at("2026-05-01").state, "SILENT", "98 days > 3 monthly cycles");
});

test("silence: no pulse entry is never-carded info, not a flag", () => {
  // 8 roster sources are cited through hosts the roster doesn't declare yet;
  // a permanent false SILENT for each is the cry-wolf failure. They surface
  // via lastCardedAt: null, and never trip the gate.
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW,
    snapshots: new Map([["troost", "Opening hours: noon till late."]]),
  });
  const r = rows.find((x) => x.id === "troost");
  assert.equal(r.state, "quiet");
  assert.equal(r.lastCardedAt, null);
  assert.ok(!isFlagged(r) && !isUnexplained(r), "never-carded must not disqualify auto-ship");
});

test("silence: an existing flagged state is not renamed by a stale pulse", () => {
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW,
    snapshots: new Map([["black-rabbit", "Every Tuesday at 8pm Nerd Alert! TRIVIA"]]),
    pulse: { "black-rabbit": "2026-06-01" },
  });
  assert.equal(rows.find((r) => r.id === "black-rabbit").state, "STANDING DARK",
    "STANDING DARK is the more actionable diagnosis and must win over SILENT");
});

test("silence: current deck coverage beats a stale pulse", () => {
  // A live card credits the source NOW; calling that silence would be a
  // contradiction no matter what the pulse says.
  const cards = [card({
    url: "https://troostny.com/events",
    startsAt: "2026-08-12T20:00:00-04:00", endsAt: "2026-08-12T22:00:00-04:00",
  })];
  const rows = reconcile({
    sources: SRC, cards, now: NOW,
    snapshots: new Map([["troost", "start.date: 2026-08-12\n"]]),
    pulse: { troost: "2026-06-01" },
  });
  assert.equal(rows.find((r) => r.id === "troost").state, "ok");
});

// ---- coverage explanations: structured, expiring, annotate-never-suppress ----

const EXPLAIN = { sourceId: "troost", gapKey: "GAP", reason: "five-night run = one card", addedAt: "2026-08-06", expiresAt: "2026-08-13" };
const GAP_SNAP = new Map([["troost", "start.date: 2026-08-20\nstart.date: 2026-08-21\n"]]);

test("explanations: a live entry matching sourceId+state marks the row explained", () => {
  const rows = reconcile({ sources: SRC, cards: [], now: NOW, snapshots: GAP_SNAP, explanations: [EXPLAIN] });
  const r = rows.find((x) => x.id === "troost");
  assert.equal(r.state, "GAP", "explanations annotate — the state still reports");
  assert.ok(r.explained && isFlagged(r) && !isUnexplained(r));
  assert.equal(r.explanation.reason, "five-night run = one card", "the report prints the reason");
});

test("explanations: an expired entry no longer explains", () => {
  // Expiry is the anti-rubber-stamp: an explanation must be re-earned, so a
  // gap can never stay permanently excused on last month's reasoning.
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW, snapshots: GAP_SNAP,
    explanations: [{ ...EXPLAIN, expiresAt: "2026-08-06" }],
  });
  const r = rows.find((x) => x.id === "troost");
  assert.ok(!r.explained && isUnexplained(r));
});

test("explanations: gapKey must match the state — a GAP note does not excuse STANDING DARK", () => {
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW,
    snapshots: new Map([["black-rabbit", "Every Tuesday at 8pm Nerd Alert! TRIVIA"]]),
    explanations: [{ sourceId: "black-rabbit", gapKey: "GAP", reason: "x", addedAt: "2026-08-06", expiresAt: "2026-08-13" }],
  });
  assert.ok(isUnexplained(rows.find((r) => r.id === "black-rabbit")),
    "an excuse written for one failure must not cover a different one");
});

test("explanations: SILENT is explainable like any other flagged state", () => {
  const rows = reconcile({
    sources: SRC, cards: [], now: NOW,
    snapshots: new Map([["troost", "Opening hours: noon till late."]]),
    pulse: { troost: "2026-07-01" },
    explanations: [{ sourceId: "troost", gapKey: "SILENT", reason: "closed for August reno per their IG", addedAt: "2026-08-06", expiresAt: "2026-08-20" }],
  });
  const r = rows.find((x) => x.id === "troost");
  assert.equal(r.state, "SILENT");
  assert.ok(r.explained && !isUnexplained(r));
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
