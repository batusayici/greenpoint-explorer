// src/placeData.js
// Static local place data for the hero business cards. No scraping, no APIs,
// no live status — per docs/reference/PLACE_SOURCE_POLICY.md. Public factual
// info only; every record cites sources and carries lastVerified. Real-place
// public representation is Batu-gated (approvalStatus).

// Native JSON import with an import attribute. This is the one form that works
// in BOTH targets: Node 25's ESM loader (which requires `with { type: "json" }`)
// and the Vite browser bundle (esbuild honors the attribute). A node:fs read
// would pass `node --test` but break in the browser, where fs does not exist.
import records from "./data/places/franklin-greenpoint-heroes.v0.1.json" with { type: "json" };

export const PLACE_DISCLAIMER =
  "Unofficial prototype — not an official map or business directory. Details are under review; corrections welcome.";

const byPlaceId = new Map(records.map((r) => [r.placeId, r]));

export function getPlaceByPlaceId(placeId) {
  return byPlaceId.get(placeId) ?? null;
}

export function allPlaces() {
  return records;
}
