#!/usr/bin/env node
/**
 * pull-storefronts.mjs
 * Usage: node scripts/pull-storefronts.mjs <descriptor.json>
 *
 * Pulls OSM storefront data for the bbox in the descriptor,
 * writes src/data/places/block-<id>-storefronts.v0.1.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ----- Endpoints ---------------------------------------------------------
const PRIMARY_ENDPOINT =
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter";
const FALLBACK_ENDPOINT = "https://overpass-api.de/api/interpreter";

// ----- CLI ---------------------------------------------------------------
const descriptorArg = process.argv[2];
if (!descriptorArg) {
  console.error("Usage: node scripts/pull-storefronts.mjs <descriptor.json>");
  process.exit(1);
}

const descriptorPath = path.resolve(process.cwd(), descriptorArg);
if (!fs.existsSync(descriptorPath)) {
  console.error(`Descriptor not found: ${descriptorPath}`);
  process.exit(1);
}

const descriptor = JSON.parse(fs.readFileSync(descriptorPath, "utf8"));
const { id, bbox } = descriptor;

if (!id || !bbox) {
  console.error('Descriptor must have "id" and "bbox" fields.');
  process.exit(1);
}

const { minLon, minLat, maxLon, maxLat } = bbox;
// Overpass bbox order: (south, west, north, east) = (minLat, minLon, maxLat, maxLon)
const bb = `${minLat},${minLon},${maxLat},${maxLon}`;

// ----- Build query -------------------------------------------------------
const query = `[out:json][timeout:30];(node["shop"](${bb});way["shop"](${bb});node["amenity"~"cafe|restaurant|bar|pub|fast_food|pharmacy|bank|deli"](${bb});way["amenity"~"cafe|restaurant|bar|pub|fast_food|pharmacy|bank|deli"](${bb}););out center tags;`;

// ----- Fetch helper ------------------------------------------------------
async function fetchOverpass(endpoint) {
  const body = `data=${encodeURIComponent(query)}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${endpoint}`);
  }
  const json = await res.json();
  if (!json.elements) {
    throw new Error(`No .elements in response from ${endpoint}`);
  }
  return json;
}

// ----- Main --------------------------------------------------------------
(async () => {
  let result = null;
  let usedEndpoint = null;

  // Try primary
  try {
    console.log(`Querying primary endpoint: ${PRIMARY_ENDPOINT}`);
    result = await fetchOverpass(PRIMARY_ENDPOINT);
    usedEndpoint = PRIMARY_ENDPOINT;
    console.log("Primary endpoint succeeded.");
  } catch (primaryErr) {
    console.warn(`Primary endpoint failed: ${primaryErr.message}`);
    console.log(`Retrying on fallback endpoint: ${FALLBACK_ENDPOINT}`);
    try {
      result = await fetchOverpass(FALLBACK_ENDPOINT);
      usedEndpoint = FALLBACK_ENDPOINT;
      console.log("Fallback endpoint succeeded.");
    } catch (fallbackErr) {
      console.error(`Both endpoints failed.`);
      console.error(`  Primary:  ${primaryErr.message}`);
      console.error(`  Fallback: ${fallbackErr.message}`);
      process.exit(1);
    }
  }

  // ----- Map elements ----------------------------------------------------
  const storefronts = [];
  for (const el of result.elements) {
    const tags = el.tags || {};
    if (!tags.name) continue; // skip unnamed

    let lat = null;
    let lon = null;
    if (el.lat != null) {
      lat = el.lat;
      lon = el.lon;
    } else if (el.center) {
      lat = el.center.lat;
      lon = el.center.lon;
    }

    storefronts.push({
      name: tags.name,
      category: tags.shop ?? tags.amenity ?? "unknown",
      houseNumber: tags["addr:housenumber"] ?? null,
      addrStreet: tags["addr:street"] ?? null,
      point: lat != null ? { lon, lat } : null,
      sourceId: `osm:${el.type}/${el.id}`,
      confidence: tags["addr:housenumber"] ? "address-backed" : "point-only",
      activeStatus: "unverified",
    });
  }

  const addressBacked = storefronts.filter(
    (s) => s.confidence === "address-backed"
  ).length;

  // ----- Write output ----------------------------------------------------
  const outDir = path.join(ROOT, "src/data/places");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `block-${id}-storefronts.v0.1.json`);

  const output = {
    schemaVersion: "block-storefront-roster.v0.1",
    blockId: id,
    source: {
      provider: "OSM Overpass",
      endpoint: usedEndpoint,
      query: query,
    },
    recordCount: storefronts.length,
    storefronts,
  };

  fs.writeFileSync(outFile, JSON.stringify(output, null, 2), "utf8");

  console.log(`\nWrote: ${outFile}`);
  console.log(`Storefronts: ${storefronts.length}`);
  console.log(`Address-backed: ${addressBacked}`);
  console.log(`Endpoint used: ${usedEndpoint}`);
})();
