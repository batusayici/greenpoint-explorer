#!/usr/bin/env node
/**
 * pull-footprints.mjs
 * Usage: node scripts/pull-footprints.mjs <descriptor.json>
 *
 * Pulls NYC Building Footprints + PLUTO for a block's bbox and writes a
 * committed extract in the shape the existing runtime expects.
 *
 * Schema reference: docs/superpowers/plans/recon-schemas.md
 * Footprints resource: 5zhs-2jue (mappluto_bbl, bin, base_bbl, height_roof, construction_year, the_geom)
 * PLUTO resource:      64uk-42ks (bbl, numfloors, yearbuilt, bldgclass, landuse, comarea, resarea)
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

const FOOTPRINTS_URL = "https://data.cityofnewyork.us/resource/5zhs-2jue.json";
const PLUTO_URL = "https://data.cityofnewyork.us/resource/64uk-42ks.json";
const PLUTO_CHUNK_SIZE = 50;

// ── helpers ──────────────────────────────────────────────────────────────────

/** Normalize a raw BBL value (any of: number, "3025660036", "3025660036.00000000") to a plain integer string */
function normalizeBbl(raw) {
  if (raw == null) return null;
  const i = parseInt(String(raw), 10);
  return Number.isFinite(i) ? String(i) : null;
}

async function fetchJson(url, label) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Fetch failed [${label}] HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

/** Chunk an array into slices of at most `size` items */
function chunks(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const descriptorPath = process.argv[2];
  if (!descriptorPath) {
    console.error("Usage: node scripts/pull-footprints.mjs <descriptor.json>");
    process.exit(1);
  }

  const descriptor = JSON.parse(readFileSync(resolve(descriptorPath), "utf8"));
  const { id, label, bbox } = descriptor;
  const { minLon, minLat, maxLon, maxLat } = bbox;

  console.log(`\nPulling footprints for block "${id}" …`);
  console.log(`  bbox: lon [${minLon}, ${maxLon}]  lat [${minLat}, ${maxLat}]`);

  // ── 1. Fetch Building Footprints ───────────────────────────────────────────
  // Socrata within_box(col, maxLat, minLon, minLat, maxLon) — NW corner first
  const whereClause = `within_box(the_geom,${maxLat},${minLon},${minLat},${maxLon})`;
  const footprintsUrl =
    `${FOOTPRINTS_URL}?$where=${encodeURIComponent(whereClause)}&$limit=2000`;

  console.log(`\nFetching footprints …`);
  const rawFootprints = await fetchJson(footprintsUrl, "footprints");
  console.log(`  → ${rawFootprints.length} raw footprint records returned`);

  // ── 2. Collect unique integer BBLs for PLUTO join ─────────────────────────
  const bblSet = new Set();
  for (const fp of rawFootprints) {
    const normalized = normalizeBbl(fp.mappluto_bbl);
    if (normalized) bblSet.add(normalized);
  }
  const bbls = [...bblSet];
  console.log(`  → ${bbls.length} unique BBLs to join against PLUTO`);

  // ── 3. Fetch PLUTO in chunks ───────────────────────────────────────────────
  const plutoMap = new Map(); // normalizedBbl → pluto row
  if (bbls.length > 0) {
    console.log(`\nFetching PLUTO in ${Math.ceil(bbls.length / PLUTO_CHUNK_SIZE)} chunk(s) …`);
    for (const chunk of chunks(bbls, PLUTO_CHUNK_SIZE)) {
      // PLUTO bbl is numeric — query without quotes
      const inClause = chunk.join(",");
      const plutoUrl = `${PLUTO_URL}?$where=${encodeURIComponent(`bbl in (${inClause})`)}&$limit=${PLUTO_CHUNK_SIZE + 10}`;
      const rows = await fetchJson(plutoUrl, `pluto-chunk(${chunk[0]}…)`);
      for (const row of rows) {
        const key = normalizeBbl(row.bbl);
        if (key) plutoMap.set(key, row);
      }
    }
    console.log(`  → ${plutoMap.size} PLUTO rows fetched`);
  }

  // ── 4. Build output records ────────────────────────────────────────────────
  const seenBins = new Set();
  const footprintRecords = [];

  for (const fp of rawFootprints) {
    // Must have geometry
    if (!fp.the_geom || !fp.the_geom.coordinates) continue;
    // Must have BIN
    const bin = fp.bin ? String(fp.bin) : null;
    if (!bin) continue;
    // Dedupe by BIN within this pull
    if (seenBins.has(bin)) continue;
    seenBins.add(bin);

    // Extract outer ring from MultiPolygon: coordinates[0][0]
    const ring = fp.the_geom.coordinates?.[0]?.[0];
    if (!ring || ring.length === 0) continue;

    // Convert [lon, lat] tuples → {lon, lat} objects
    const wgs84Polygon = ring.map((c) => ({ lon: c[0], lat: c[1] }));

    // PLUTO join
    const bblKey = normalizeBbl(fp.mappluto_bbl);
    const pluto = bblKey ? (plutoMap.get(bblKey) ?? {}) : {};

    const record = {
      id: bin,
      source: "nyc-open-5zhs-2jue+pluto-64uk-42ks",
      sourceProperties: {
        bin,
        baseBbl: fp.base_bbl ? String(fp.base_bbl) : null,
        mapplutoBbl: bblKey,
        heightRoof: fp.height_roof != null ? String(fp.height_roof) : "",
        constructionYear:
          fp.construction_year != null ? String(fp.construction_year) : null,
        numFloors: pluto.numfloors != null ? Number(pluto.numfloors) : null,
        yearBuilt: pluto.yearbuilt != null ? Number(pluto.yearbuilt) : null,
        bldgClass: pluto.bldgclass ?? null,
        landUse: pluto.landuse ?? null,
        comArea: pluto.comarea != null ? Number(pluto.comarea) : null,
        resArea: pluto.resarea != null ? Number(pluto.resarea) : null,
      },
      wgs84Polygon,
    };

    footprintRecords.push(record);
  }

  // ── 5. Stats ───────────────────────────────────────────────────────────────
  const withFloors = footprintRecords.filter(
    (r) => r.sourceProperties.numFloors != null
  ).length;
  const hitRate =
    footprintRecords.length > 0
      ? ((withFloors / footprintRecords.length) * 100).toFixed(1)
      : "N/A";

  console.log(`\nRecords after filtering/dedup: ${footprintRecords.length}`);
  console.log(`PLUTO numFloors hit-rate: ${withFloors}/${footprintRecords.length} (${hitRate}%)`);

  // ── 6. Write output file ───────────────────────────────────────────────────
  const outDir = join(PROJECT_ROOT, "src/data/geometry-source");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `block-${id}.nyc-open-geometry.v0.1.json`);

  const output = {
    schemaVersion: "block-geometry-source.v0.1",
    blockId: id,
    bbox,
    source: {
      footprints: FOOTPRINTS_URL,
      pluto: PLUTO_URL,
      pulledFor: label,
    },
    recordCount: footprintRecords.length,
    footprintRecords,
  };

  // Validate as JSON before writing
  const jsonStr = JSON.stringify(output, null, 2);
  JSON.parse(jsonStr); // throws if invalid

  writeFileSync(outPath, jsonStr, "utf8");
  console.log(`\nWrote ${outPath}`);
  console.log(`Done. ${footprintRecords.length} records, PLUTO hit-rate ${hitRate}%`);
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
