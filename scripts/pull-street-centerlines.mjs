#!/usr/bin/env node
/**
 * pull-street-centerlines.mjs
 * Usage: node scripts/pull-street-centerlines.mjs <descriptor.json>
 *
 * Pulls NYC LION Street Centerline (inkn-q76z) for a bbox and writes a packet
 * in the streetCenterlineRecords shape the ground layer reads.
 * Columns: physicalid, full_stree, st_width, the_geom (MultiLineString [lon,lat]).
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const LION_URL = "https://data.cityofnewyork.us/resource/inkn-q76z.json";

async function fetchJson(url, label) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Fetch failed [${label}] HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function main() {
  const descriptorPath = process.argv[2];
  if (!descriptorPath) {
    console.error("Usage: node scripts/pull-street-centerlines.mjs <descriptor.json>");
    process.exit(1);
  }
  const descriptor = JSON.parse(readFileSync(resolve(descriptorPath), "utf8"));
  const { id, label, bbox } = descriptor;
  const { minLon, minLat, maxLon, maxLat } = bbox;

  console.log(`\nPulling LION centerlines for "${id}" …`);
  const whereClause = `within_box(the_geom,${maxLat},${minLon},${minLat},${maxLon})`;
  const url = `${LION_URL}?$where=${encodeURIComponent(whereClause)}&$limit=5000`;
  const raw = await fetchJson(url, "lion");
  console.log(`  → ${raw.length} raw centerline segments returned`);

  const records = [];
  for (const r of raw) {
    const geom = r.the_geom;
    if (!geom || !geom.coordinates) continue;
    // LION v2 columns: full_street_name (not full_stree), streetwidth (not st_width)
    const name = (r.full_street_name ?? r.full_stree ?? "").trim().toUpperCase();
    if (!name) continue;
    // MultiLineString → flatten to a single ordered polyline (one segment per LION row)
    const lines = geom.type === "MultiLineString" ? geom.coordinates : [geom.coordinates];
    for (const line of lines) {
      const wgs84Line = line.map((c) => ({ lon: c[0], lat: c[1] }));
      if (wgs84Line.length < 2) continue;
      records.push({
        id: `nyc-centerline-physicalid-${r.physicalid ?? "unknown"}-${records.length}`,
        source: "nyc-open-data-street-centerline-inkn-q76z",
        physicalid: r.physicalid != null ? String(r.physicalid) : null,
        fullStreetName: name,
        streetWidth: (r.streetwidth ?? r.st_width) != null ? String(r.streetwidth ?? r.st_width) : null,
        wgs84Line,
      });
    }
  }

  const namesSeen = [...new Set(records.map((r) => r.fullStreetName))].sort();
  console.log(`  → ${records.length} centerline records across ${namesSeen.length} streets:`);
  console.log("   ", namesSeen.join(", "));

  const outDir = join(PROJECT_ROOT, "src/data/geometry-source");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `block-${id}.street-centerlines.v0.1.json`);
  const output = {
    schemaVersion: "block-street-centerlines.v0.1",
    blockId: id,
    bbox,
    source: { lion: LION_URL, pulledFor: label },
    recordCount: records.length,
    streetCenterlineRecords: records,
  };
  const jsonStr = JSON.stringify(output, null, 2);
  JSON.parse(jsonStr);
  writeFileSync(outPath, jsonStr, "utf8");
  console.log(`\nWrote ${outPath} (${records.length} records)`);
}

main().catch((err) => { console.error("\nFATAL:", err.message); process.exit(1); });
