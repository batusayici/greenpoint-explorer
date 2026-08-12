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
// Since 2026-08-08 this is also the writer of the per-source pulse
// (`sourcePulse` in the ledger): the monotone lastCardedAt map that lets a
// SILENT source be told apart from a quiet one after expiry has deleted its
// cards. The write is idempotent and never lowers a date, so running it twice
// per run (post-fetch and pre-ship) is harmless — and the pre-ship invocation
// is what captures cards authored this run before the ledger commits.
//
// Usage: node scripts/check-coverage.mjs [--window 14] [--all] [--gate] [--only id,id]
//
// `--only` takes the SAME value the run passed to fetch-sources.mjs, and scopes
// the GATE to those sources (the report still shows everything). Without it a
// scoped run gates on the whole roster, which is what made every Wednesday pull
// exit 1 — see `inScope` in coverage.js for the full reasoning.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { reconcile, updatePulse, isFlagged, isUnexplained, inScope } from "../src/demand-test/coverage.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data", "demand-test");
const cacheDir = join(root, ".ingest-cache");

const args = process.argv.slice(2);
const wIdx = args.indexOf("--window");
const windowDays = wIdx !== -1 ? Number(args[wIdx + 1]) : 14;
const SHOW_ALL = args.includes("--all");
const GATE_MODE = args.includes("--gate");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx !== -1 ? new Set(args[onlyIdx + 1].split(",")) : null;

const raw = JSON.parse(readFileSync(join(dataDir, "ingest-sources.json"), "utf8"));
const sources = Array.isArray(raw) ? raw : raw.sources;
const { cards } = JSON.parse(readFileSync(join(dataDir, "cards.json"), "utf8"));
const ledgerPath = join(dataDir, "ingest-ledger.json");
const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));

const snapshots = new Map();
for (const s of sources) {
  const p = join(cacheDir, `${s.id}.txt`);
  snapshots.set(s.id, existsSync(p) ? readFileSync(p, "utf8") : null);
}

// Update the pulse BEFORE reconciling, so cards authored moments ago count.
const pulse = updatePulse({ sources, cards, pulse: ledger.sourcePulse ?? {} });
if (JSON.stringify(pulse) !== JSON.stringify(ledger.sourcePulse ?? {})) {
  ledger.sourcePulse = pulse;
  writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
}

const now = new Date();
const rows = reconcile({
  sources, cards, snapshots, now, windowDays,
  pulse, explanations: ledger.coverageExplanations ?? [],
});
const flagged = rows.filter(isFlagged).sort((a, b) => (b.missing?.length ?? 99) - (a.missing?.length ?? 99));
const unexplained = rows.filter(isUnexplained);
// Scoping the gate is only safe if the scope is real. A typo'd `--only` would
// match nothing, leave the gating set empty, and turn the gate into a rubber
// stamp that always passes — the exact failure this change exists to avoid,
// inverted. So an id that names no roster source is a hard error, not a warning.
if (ONLY) {
  const unknown = [...ONLY].filter((id) => !sources.some((s) => s.id === id));
  if (unknown.length) {
    console.error(`[coverage] --only names ${unknown.length} unknown source id(s): ${unknown.join(", ")}`);
    console.error("[coverage] refusing to run — a scope that matches nothing would silently pass the gate.");
    process.exit(2);
  }
}
const gating = unexplained.filter((r) => inScope(r, ONLY));
const neverCarded = rows.filter((r) => !r.lastCardedAt);

const nyDayOf = (d) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

console.log(
  `[coverage] window ${nyDayOf(now)} → ${nyDayOf(new Date(now.getTime() + windowDays * 864e5))} ` +
    `(${windowDays}d) · ${sources.length} sources · ${flagged.length} flagged (${unexplained.length} unexplained` +
    (ONLY ? `, ${gating.length} in --only scope` : "") + ")\n",
);
if (ONLY) {
  console.log(
    `  scope: --only ${[...ONLY].join(",")} — the gate judges these ${ONLY.size} source(s) only.\n` +
      `  Everything else is still reported below, marked \`off-scope\`, because a run that\n` +
      "  did not read a source has learned nothing about it either way.\n",
  );
}

if (flagged.length === 0) console.log("  nothing flagged — every source's dated items are represented in the deck");

const explainedSuffix = (r) =>
  (inScope(r, ONLY) ? "" : "  [off-scope]") +
  (r.explained ? `\n       explained: ${r.explanation.reason} (until ${r.explanation.expiresAt})` : "");

for (const r of flagged) {
  if (r.state === "NO SNAPSHOT") { console.log(`  NO SNAPSHOT   ${r.id} — never fetched, or the id changed${explainedSuffix(r)}`); continue; }
  if (r.state === "STANDING DARK") {
    console.log(`  STANDING DARK ${r.id} — marked \`standing: true\`, page states recurring programming, deck carries NOTHING${explainedSuffix(r)}`);
    continue;
  }
  if (r.state === "UNMARKED STANDING?") {
    console.log(
      `  UNMARKED STANDING?  ${r.id} — page states recurring programming, publishes no dated items,\n` +
        "       and the deck carries nothing for it. Either mark it `standing: true` and card the\n" +
        "       night, or note why the recurring phrase is incidental (bin-bin-sake's is a SHIPPING line)." +
        explainedSuffix(r),
    );
    continue;
  }
  if (r.state === "SILENT") {
    console.log(`  SILENT        ${r.id} — last shipped card ${r.lastCardedAt}, past 3× its cadence; fetches clean but yields nothing${explainedSuffix(r)}`);
    continue;
  }
  const show = r.missing.slice(0, 8).join(" ");
  console.log(
    `  GAP  ${String(r.missing.length).padStart(2)} of ${String(r.srcCount).padStart(2)}  ${r.id.padEnd(26)} ` +
      `deck covers ${r.coveredCount}\n       missing: ${show}${r.missing.length > 8 ? ` … +${r.missing.length - 8}` : ""}` +
      explainedSuffix(r),
  );
}

// Info, never flagged: a source with no pulse entry has never had a card
// attributed through its hosts. Usually an attribution hole (missing citeHost),
// not silence — fixing the roster converges these lines to SILENT/ok.
if (neverCarded.length) {
  console.log(`\n  never carded (info): ${neverCarded.map((r) => r.id).join(", ")}`);
}

if (SHOW_ALL) {
  console.log("\n[coverage] all sources:");
  for (const r of rows)
    console.log(`  ${r.state.padEnd(19)} ${r.id.padEnd(28)} src ${r.srcCount ?? "-"} / deck ${r.coveredCount ?? "-"} / carded ${r.lastCardedAt ?? "never"}`);
}

console.log(
  "\n[coverage] A GAP is not automatically wrong — a film's five-night run is one card, a\n" +
    "[coverage] recurring showcase is one recurring card, Williamsburg items are skipped on purpose,\n" +
    "[coverage] and a source whose format this script cannot parse reports 0 dates (no signal, NOT\n" +
    "[coverage] no supply). Explain each flagged line as a `coverageExplanations` ledger entry\n" +
    "[coverage] (sourceId + gapKey + reason + expiresAt) or close it — with --gate, an unexplained\n" +
    "[coverage] flagged line disqualifies auto-ship.",
);

// Reporting mode never gates (2026-08-07 decision stands): a run halted by a
// legitimate editorial gap would be worse than the blindness this replaces.
// --gate (2026-08-08) is the SHIP-DECISION check: exit 1 means "auto-ship
// disqualified, take the review-PR path" — never "halt the run".
if (GATE_MODE && gating.length) {
  console.error(
    `\n[coverage] GATE: ${gating.length} unexplained flagged line(s)` +
      (ONLY ? ` inside --only ${[...ONLY].join(",")}` : "") +
      " — auto-ship disqualified, open a review PR.",
  );
  process.exit(1);
}
// Said out loud rather than left to inference: a scoped run that passes has
// passed a NARROWER check, and the reader should know how much narrower.
if (GATE_MODE && ONLY && unexplained.length > gating.length) {
  console.log(
    `\n[coverage] GATE passed on ${ONLY.size} scoped source(s). ${unexplained.length - gating.length} unexplained\n` +
      "[coverage] flagged line(s) are off-scope and were NOT judged — Monday's full run judges them.",
  );
}
process.exit(0);
