#!/usr/bin/env node
// L12 coverage reconciliation — the I/O half. All logic lives in
// src/demand-test/coverage.js so `npm test` (which only runs
// src/**/*.test.mjs) can regression-test it; this file just reads the
// snapshots off disk and prints the report.
//
// The first version of this WAS the logic, as a script with no tests, and six
// bugs were found in it by hand in one afternoon — including a UTC day-rollover
// that made six well-carded evenings read as gaps. Closing those "gaps" would
// have shipped six duplicate cards. That is why the logic moved.
//
// Usage: node scripts/check-coverage.mjs [--window 14] [--all]
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { reconcile, isFlagged } from "../src/demand-test/coverage.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data", "demand-test");
const cacheDir = join(root, ".ingest-cache");

const args = process.argv.slice(2);
const wIdx = args.indexOf("--window");
const windowDays = wIdx !== -1 ? Number(args[wIdx + 1]) : 14;
const SHOW_ALL = args.includes("--all");

const raw = JSON.parse(readFileSync(join(dataDir, "ingest-sources.json"), "utf8"));
const sources = Array.isArray(raw) ? raw : raw.sources;
const { cards } = JSON.parse(readFileSync(join(dataDir, "cards.json"), "utf8"));

const snapshots = new Map();
for (const s of sources) {
  const p = join(cacheDir, `${s.id}.txt`);
  snapshots.set(s.id, existsSync(p) ? readFileSync(p, "utf8") : null);
}

const now = new Date();
const rows = reconcile({ sources, cards, snapshots, now, windowDays });
const flagged = rows.filter(isFlagged).sort((a, b) => (b.missing?.length ?? 99) - (a.missing?.length ?? 99));

const nyDayOf = (d) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

console.log(
  `[coverage] window ${nyDayOf(now)} → ${nyDayOf(new Date(now.getTime() + windowDays * 864e5))} ` +
    `(${windowDays}d) · ${sources.length} sources · ${flagged.length} flagged\n`,
);

if (flagged.length === 0) console.log("  nothing flagged — every source's dated items are represented in the deck");

for (const r of flagged) {
  if (r.state === "NO SNAPSHOT") { console.log(`  NO SNAPSHOT   ${r.id} — never fetched, or the id changed`); continue; }
  if (r.state === "STANDING DARK") {
    console.log(`  STANDING DARK ${r.id} — marked \`standing: true\`, page states recurring programming, deck carries NOTHING`);
    continue;
  }
  if (r.state === "UNMARKED STANDING?") {
    console.log(
      `  UNMARKED STANDING?  ${r.id} — page states recurring programming, publishes no dated items,\n` +
        "       and the deck carries nothing for it. Either mark it `standing: true` and card the\n" +
        "       night, or note why the recurring phrase is incidental (bin-bin-sake's is a SHIPPING line).",
    );
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
  for (const r of rows) console.log(`  ${r.state.padEnd(19)} ${r.id.padEnd(28)} src ${r.srcCount ?? "-"} / deck ${r.coveredCount ?? "-"}`);
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
