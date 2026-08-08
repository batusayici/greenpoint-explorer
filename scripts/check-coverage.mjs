#!/usr/bin/env node
// L12 coverage reconciliation (Batu, 2026-08-07).
//
// WHY THIS EXISTS. Every other supply guard reads `cards.json`: thinFeed,
// reservoir7-14d, the trend alarm, the concentration guard. Not one of them
// reads the SNAPSHOTS. So the failure "the source published it and we did not
// card it" is invisible to all of them by construction — and on 2026-08-06/07
// that single failure wore four different costumes:
//
//   * the 14-day window's back edge was empty while troost.txt held 38
//     uncarded nights (reservoir bug);
//   * a per-venue cap suppressed 5 of Troost's 7 nights;
//   * four venues publishing STATIC weekly schedules went dark for a week,
//     because a page that never changes is `unchanged` forever;
//   * Brew Inn was held as "no address in the source" when the address was in
//     the snapshot, emitted street-name-before-number by the site's microdata.
//
// Every one of those was found by a human eyeballing a venue calendar next to
// the app. This script does that reconciliation mechanically: for each source,
// which dates does the SNAPSHOT carry that the DECK has nothing for.
//
// It REPORTS and never gates (exit 0 always). Gaps are frequently legitimate —
// a film's five-night run is one card, a recurring showcase is covered by one
// recurring card, Williamsburg items are deliberately skipped. The point is not
// that a gap is wrong; it is that a gap is never again SILENT.
//
// Usage: node scripts/check-coverage.mjs [--window 14] [--all]
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data", "demand-test");
const cacheDir = join(root, ".ingest-cache");

const args = process.argv.slice(2);
const wIdx = args.indexOf("--window");
const WINDOW_DAYS = wIdx !== -1 ? Number(args[wIdx + 1]) : 14;
const SHOW_ALL = args.includes("--all");

const sourcesRaw = JSON.parse(readFileSync(join(dataDir, "ingest-sources.json"), "utf8"));
const sources = Array.isArray(sourcesRaw) ? sourcesRaw : sourcesRaw.sources;
const seed = JSON.parse(readFileSync(join(dataDir, "cards.json"), "utf8"));

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const pad = (n) => String(n).padStart(2, "0");
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

// EVERY day key here is America/New_York, never UTC. toISOString() rolls an
// 8pm EDT event onto the NEXT day, so the first version of this script credited
// every evening card to the wrong date and reported six well-carded evenings as
// gaps. Closing those "gaps" would have shipped six duplicate cards — the one
// failure mode that makes a coverage checker actively harmful.
const NY_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
});
const nyDay = (d) => NY_DAY.format(d);

const today = new Date();
const todayISO = nyDay(today);
const horizon = nyDay(new Date(today.getTime() + WINDOW_DAYS * 864e5));
const inWindow = (s) => s >= todayISO && s <= horizon;

// Year inference for formats that omit it ("Saturday, Aug 1", "Fri. 8/14").
// Pick the year that puts the date nearest to today — a bare "Jan 3" in
// December means next year, not eleven months ago.
function inferYear(month, day) {
  const y = Number(nyDay(today).slice(0, 4));
  const cands = [y - 1, y, y + 1].map((yy) => ({ yy, d: Math.abs(Date.parse(iso(yy, month, day) + 'T12:00:00-04:00') - today.getTime()) }));
  return cands.reduce((a, b) => (b.d < a.d ? b : a)).yy;
}

// Deliberately several patterns: the roster spans ISO APIs, Squarespace JSON,
// Google Calendar, WordPress directories and hand-written HTML. A format we
// cannot parse shows up as `dates: 0`, which reads as "no signal", never as
// "no supply" — see the UNPARSED note in the report.
// Lines keyed as an END field are dropped before parsing. A Google Calendar
// all-day event stores an EXCLUSIVE end date, so Troost's 8/11 gig carries
// `end.date: 2026-08-12` and a naive scan invents a phantom 8/12 gap — the
// exact trap the extraction prompt warns subagents about, walked into here on
// the first run. A start date identifies an event; an end date never does.
const END_LINE_RE = /^\s*(?:"?)(end[._-]?date|end_?at|ds_event_end_date|endDate|until)(?:"?)\s*[:=]/i;
const stripEndLines = (text) => text.split("\n").filter((l) => !END_LINE_RE.test(l)).join("\n");

function extractDates(raw) {
  const text = stripEndLines(raw);
  const out = new Set();
  for (const m of text.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)) out.add(iso(+m[1], +m[2], +m[3]));
  // "Aug 6, 2026" / "August 6, 2026"
  for (const m of text.matchAll(/\b([A-Z][a-z]{2})[a-z]*\.?\s+(\d{1,2}),?\s+(20\d{2})\b/g)) {
    const mo = MONTHS[m[1].toLowerCase()];
    if (mo) out.add(iso(+m[3], mo, +m[2]));
  }
  // "Saturday, Aug 1" / "Friday, August 7" (no year)
  for (const m of text.matchAll(/\b(?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day,?\s+([A-Z][a-z]{2})[a-z]*\.?\s+(\d{1,2})\b/g)) {
    const mo = MONTHS[m[1].toLowerCase()];
    if (mo) out.add(iso(inferYear(mo, +m[2]), mo, +m[2]));
  }
  // "Fri. 8/14" / "8/14" — require a slash date with a plausible month
  for (const m of text.matchAll(/\b(\d{1,2})\/(\d{1,2})\b(?!\/)/g)) {
    const mo = +m[1], da = +m[2];
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) out.add(iso(inferYear(mo, da), mo, da));
  }
  return [...out].filter(inWindow).sort();
}

const RECURRING_RE =
  /\b(every\s+(?:mon|tues|wednes|thurs|fri|satur|sun)day|weekly|(?:mon|tues|wednes|thurs|fri|satur|sun)days)\b/i;

// ---- deck side: which dates does each source already cover ----
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } };

// A source's cards cite the venue, not the endpoint we fetch. Troost is
// fetched from googleapis.com and cited to troostny.com; the library from
// discover.bklynlibrary.org and cited to bklynlibrary.org. `citeHost` in the
// roster carries that mapping where the two differ.
// host -> SET of source ids, never one. Four NYC Parks pages share
// nycgovparks.org, both Hana pages share hanamakgeolli.com, both Yaro pages
// share yarostudios.com; a Map<host,id> silently kept the last one and
// reported "deck covers 0" for real, well-covered sources on the first run.
// Cost of the set: a McGolrick card also counts as coverage for McCarren,
// because a host is all a card's URL gives us. Over-crediting a sibling page
// is the right way to be wrong here — a false GAP burns a reviewer's trust,
// and this check is worth nothing once it cries wolf.
const hostToSource = new Map();
const mapHost = (h, id) => {
  const k = h.replace(/^www\./, "");
  if (!hostToSource.has(k)) hostToSource.set(k, new Set());
  hostToSource.get(k).add(id);
};
for (const s of sources) {
  for (const u of [s.url, ...(s.urls ?? [])]) { const h = hostOf(u); if (h) mapHost(h, s.id); }
  for (const h of [].concat(s.citeHost ?? [])) mapHost(h, s.id);
}

const coveredBySource = new Map(); // id -> Set<iso date>
for (const c of seed.cards) {
  const hosts = new Set();
  for (const l of c.sourceLinks ?? []) { const h = hostOf(l.url); if (h) hosts.add(h); }
  for (const a of c.actions ?? []) { const h = hostOf(a.url); if (h) hosts.add(h); }
  const ids = new Set([...hosts].flatMap((h) => [...(hostToSource.get(h) ?? [])]));
  if (ids.size === 0) continue;
  // Expand each card across every day it covers, so a recurring weekly card or
  // a multi-day run is not reported as a gap on the days it already speaks for.
  const days = new Set();
  let s = c.startsAt ? new Date(c.startsAt) : null;
  const e = c.endsAt ? new Date(c.endsAt) : s;
  // An END-ONLY card is a standing offer ("bottomless makgeolli Thursdays and
  // Sundays, verified through …") — no start, because it has been running for
  // months. It speaks for every day from today to its verified-through date.
  // Without this, `hana-bottomless-makgeolli` covered nothing and the checker
  // demanded a fresh card for every Thursday it already accounts for.
  if (!s && e) s = today < e ? today : e;
  if (s && e) for (let t = new Date(s); t <= e; t = new Date(t.getTime() + 864e5)) days.add(nyDay(t));
  if (c.recurring && s && e) {
    // a weekly card speaks for its weekday across the whole span
    for (let t = new Date(s); t <= e; t = new Date(t.getTime() + 7 * 864e5)) days.add(nyDay(t));
  }
  for (const id of ids) {
    if (!coveredBySource.has(id)) coveredBySource.set(id, new Set());
    for (const d of days) coveredBySource.get(id).add(d);
  }
}

// ---- reconcile ----
const rows = [];
for (const s of sources) {
  const p = join(cacheDir, `${s.id}.txt`);
  if (!existsSync(p)) { rows.push({ id: s.id, state: "NO SNAPSHOT" }); continue; }
  const text = readFileSync(p, "utf8");
  const srcDates = extractDates(text);
  const covered = coveredBySource.get(s.id) ?? new Set();
  const missing = srcDates.filter((d) => !covered.has(d));
  const standing = !!s.standing;
  const standingDark = standing && covered.size === 0 && RECURRING_RE.test(text);

  let state = "ok";
  if (standingDark) state = "STANDING DARK";
  else if (missing.length) state = "GAP";
  else if (srcDates.length === 0 && covered.size === 0) state = "quiet";

  rows.push({ id: s.id, state, srcCount: srcDates.length, coveredCount: covered.size, missing, standing });
}

const flagged = rows.filter((r) => r.state === "GAP" || r.state === "STANDING DARK" || r.state === "NO SNAPSHOT");
flagged.sort((a, b) => (b.missing?.length ?? 99) - (a.missing?.length ?? 99));

console.log(`[coverage] window ${todayISO} → ${horizon} (${WINDOW_DAYS}d) · ${sources.length} sources · ${flagged.length} flagged\n`);

if (flagged.length === 0) console.log("  nothing flagged — every source's dated items are represented in the deck");

for (const r of flagged) {
  if (r.state === "NO SNAPSHOT") { console.log(`  NO SNAPSHOT   ${r.id} — never fetched, or the id changed`); continue; }
  if (r.state === "STANDING DARK") {
    console.log(`  STANDING DARK ${r.id} — marked \`standing: true\`, page states recurring programming, deck carries NOTHING`);
    continue;
  }
  const show = r.missing.slice(0, 8).join(" ");
  console.log(
    `  GAP  ${String(r.missing.length).padStart(2)} of ${String(r.srcCount).padStart(2)}  ${r.id.padEnd(26)} ` +
      `deck covers ${r.coveredCount}\n       missing: ${show}${r.missing.length > 8 ? ` … +${r.missing.length - 8}` : ""}`,
  );
}

if (SHOW_ALL) {
  console.log("\n[coverage] all sources:");
  for (const r of rows) console.log(`  ${r.state.padEnd(14)} ${r.id.padEnd(28)} src ${r.srcCount ?? "-"} / deck ${r.coveredCount ?? "-"}`);
}

console.log(
  "\n[coverage] A GAP is not automatically wrong — a film's five-night run is one card, a\n" +
    "[coverage] recurring showcase is one recurring card, Williamsburg items are skipped on purpose,\n" +
    "[coverage] and a source whose format this script cannot parse reports 0 dates (no signal, NOT\n" +
    "[coverage] no supply). The point is that a gap is never SILENT. Explain each one or close it.",
);

// Never gates. Reporting is the whole job; a run halted by a legitimate
// editorial gap would be worse than the blindness this replaces.
process.exit(0);
