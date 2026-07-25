#!/usr/bin/env node
// Track V — compact one-line-per-card index of the live feed, for the ingest
// orchestrator to dedupe against (~6k tokens) instead of holding the full
// 137KB cards JSON in context.
//
// Usage: node scripts/card-index.mjs [--json]
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CARDS_PATH = join(ROOT, "src/data/demand-test/july-2026-cards.json");
const seed = JSON.parse(readFileSync(CARDS_PATH, "utf8"));

const nyDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/New_York" }).slice(5) : null;

const host = (c) => {
  const url = (c.sourceLinks ?? []).find((s) => s.url)?.url;
  try { return url ? new URL(url).hostname.replace(/^www\./, "") : "-"; } catch { return "-"; }
};

const rows = seed.cards.map((c) => ({
  id: c.id,
  category: c.category,
  filters: c.filters,
  starts: nyDate(c.startsAt),
  ends: nyDate(c.endsAt),
  recurring: c.recurring === true || undefined,
  free: c.free === true || undefined,
  location: c.locationName,
  title: c.title,
  source: host(c),
  related: c.relatedCardIds?.length || undefined,
}));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ version: seed.version, count: rows.length, cards: rows }, null, 1));
} else {
  console.log(`# ${rows.length} live cards (version ${seed.version}) — id | category | filters | when | location | title | source`);
  for (const r of rows) {
    const when = r.starts || r.ends ? `${r.starts ?? "?"}→${r.ends ?? "?"}${r.recurring ? " R" : ""}` : "-";
    console.log(
      `${r.id} | ${r.category} | ${r.filters.join(",") || "-"} | ${when} | ${r.location} | ${r.title}${r.free ? " [free]" : ""} | ${r.source}`,
    );
  }
}
