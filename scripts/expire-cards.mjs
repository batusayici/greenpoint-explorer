#!/usr/bin/env node
// Track V — run expiry hygiene on the live cards JSON (skill step 3: auto-
// delete, no approval needed). Deterministic work moved out of the ingest
// agent run — this used to cost model tokens every Monday.
//
// Usage: node scripts/expire-cards.mjs [--dry-run] [--today YYYY-MM-DD]
//
// The julyCards.test.mjs contract counts are hand-authored and NOT touched
// here — the report below prints the new totals so the ingest run (or you)
// can update them in the same commit.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { expireCards, nyToday } from "../src/demand-test/ingestExpiry.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CARDS_PATH = join(ROOT, "src/data/demand-test/july-2026-cards.json");

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const todayIdx = args.indexOf("--today");
const today = todayIdx !== -1 ? args[todayIdx + 1] : nyToday();
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
  console.error(`bad --today "${today}" (want YYYY-MM-DD)`);
  process.exit(1);
}

const seed = JSON.parse(readFileSync(CARDS_PATH, "utf8"));
const { kept, deleted, flagged, pruned } = expireCards(seed.cards, today);

console.log(`expiry hygiene @ ${today}${DRY ? " (dry run)" : ""}`);
console.log(`  cards: ${seed.cards.length} → ${kept.length}`);
for (const d of deleted) console.log(`  delete ${d.id} (${d.category}, ended ${d.endsAt}${d.free ? ", was in free list" : ""})`);
for (const f of flagged) console.log(`  FLAG   ${f.id} — recurring deal past verified-through ${f.endsAt}; re-verify or drop`);
for (const p of pruned) console.log(`  prune  ${p.id} — dropped related: ${p.removed.join(", ")}`);
if (deleted.length + flagged.length + pruned.length === 0) console.log("  nothing to do");

if (deleted.length > 0) {
  const count = (pred) => kept.filter(pred).length;
  console.log("\nnew contract counts for julyCards.test.mjs:");
  console.log(`  total=${kept.length} event=${count((c) => c.category === "event")} discount=${count((c) => c.category === "discount")} news=${count((c) => c.category === "news")} subscription=${count((c) => c.category === "subscription")}`);
  console.log(`  live_music=${count((c) => c.filters.includes("live_music"))} news_filter=${count((c) => c.filters.includes("news"))} free=${count((c) => c.free === true)}`);
  const freeDeleted = deleted.filter((d) => d.free).map((d) => d.id);
  if (freeDeleted.length) console.log(`  remove from the free-list assertion: ${freeDeleted.join(", ")}`);
  console.log(`  also bump the refresh-discipline date to ${today} and describe the refresh in the count-test comment`);
}

if (!DRY && (deleted.length > 0 || pruned.length > 0)) {
  writeFileSync(CARDS_PATH, JSON.stringify({ ...seed, cards: kept }, null, 2) + "\n");
  console.log(`\nwrote ${CARDS_PATH}`);
} else if (DRY) {
  console.log("\ndry run — nothing written");
}
