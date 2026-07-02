#!/usr/bin/env node
// Track V — derive card coordinates from Nominatim (truth rule: coordinates
// are derived from a source, never invented). Fills lat/lng on the seed JSON
// in place; caches raw responses to geocode-cache.json as evidence.
//
// Usage: node scripts/geocode-demand-cards.mjs [--force]
//   --force  re-query entries that already have coords
//
// Respects the Nominatim usage policy: 1 req/s, identifying User-Agent,
// one-shot batch (~25 queries). Results outside the Greenpoint bbox are
// treated as misses (Nominatim sometimes lands in the wrong borough).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CARDS_PATH = join(ROOT, "src/data/demand-test/july-2026-cards.json");
const CACHE_PATH = join(ROOT, "src/data/demand-test/geocode-cache.json");
const UA = "greenpoint-explorer-track-v/0.1 (contact: bsayici@gmail.com)";
const FORCE = process.argv.includes("--force");

// Keep in sync with cardSchema.GREENPOINT_BBOX (script must stay runnable
// standalone, so the bbox is duplicated here deliberately).
const BBOX = { latMin: 40.712, latMax: 40.744, lngMin: -73.975, lngMax: -73.93 };
const inBbox = (lat, lng) =>
  lat >= BBOX.latMin && lat <= BBOX.latMax && lng >= BBOX.lngMin && lng <= BBOX.lngMax;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, "utf8")) : {};

async function geocode(query) {
  if (cache[query] && !FORCE) return cache[query];
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1" +
    "&viewbox=-73.975,40.744,-73.93,40.712&bounded=1" +
    `&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`nominatim ${res.status} for "${query}"`);
  const hits = await res.json();
  cache[query] = { query, fetchedAt: new Date().toISOString(), hit: hits[0] ?? null };
  await sleep(1100);
  return cache[query];
}

const queryFor = (entry) =>
  entry.geocodeQuery ?? entry.address ?? `${entry.name ?? entry.locationName}, Greenpoint, Brooklyn, NY`;

async function fill(entry, label) {
  if (entry.lat != null && !FORCE) return true;
  const { hit } = await geocode(queryFor(entry));
  if (hit && inBbox(+hit.lat, +hit.lon)) {
    entry.lat = Math.round(+hit.lat * 1e6) / 1e6;
    entry.lng = Math.round(+hit.lon * 1e6) / 1e6;
    console.log(`  ok   ${label} → ${entry.lat}, ${entry.lng}`);
    return true;
  }
  console.warn(`  MISS ${label} (query: "${queryFor(entry)}")`);
  return false;
}

const seed = JSON.parse(readFileSync(CARDS_PATH, "utf8"));
const misses = [];

for (const card of seed.cards) {
  const venues = card.venues ?? [];
  if (venues.length > 0) {
    for (const v of venues) if (!(await fill(v, `${card.id} / ${v.name}`))) misses.push(`${card.id}/${v.name}`);
    const ok = venues.filter((v) => v.lat != null);
    if (ok.length > 0) {
      // Cluster card anchors at the centroid of its resolved venues.
      card.lat = Math.round((ok.reduce((s, v) => s + v.lat, 0) / ok.length) * 1e6) / 1e6;
      card.lng = Math.round((ok.reduce((s, v) => s + v.lng, 0) / ok.length) * 1e6) / 1e6;
    }
    // Unresolved venues stay in the data with null coords (rendered nowhere,
    // listed on the card) — they are follow-ups, not silent drops.
  } else if (Array.isArray(card.anchorBetween)) {
    // Derived anchor: midpoint of two already-geocoded cards (e.g. the corridor
    // card sits between the two closed G stations). Still derivation, not invention.
    const pts = card.anchorBetween.map((id) => seed.cards.find((c) => c.id === id));
    if (pts.every((p) => p?.lat != null)) {
      card.lat = Math.round(((pts[0].lat + pts[1].lat) / 2) * 1e6) / 1e6;
      card.lng = Math.round(((pts[0].lng + pts[1].lng) / 2) * 1e6) / 1e6;
      console.log(`  ok   ${card.id} → midpoint of ${card.anchorBetween.join(" + ")}`);
    } else {
      console.warn(`  MISS ${card.id} (anchorBetween targets not geocoded)`);
      misses.push(card.id);
    }
  } else if (!(await fill(card, card.id))) {
    misses.push(card.id);
  }
}

writeFileSync(CARDS_PATH, JSON.stringify(seed, null, 2) + "\n");
writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
console.log(misses.length ? `\n${misses.length} unresolved: ${misses.join(", ")}` : "\nall entries geocoded");
process.exit(misses.length > 4 ? 1 : 0); // tolerate a few name-only bar misses; card-level misses get fixed by hand
