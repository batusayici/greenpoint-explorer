// scripts/verify-place-data.mjs
// Durable truth-gate check for hero place data (PLACE_SOURCE_POLICY.md).
// Run: node scripts/verify-place-data.mjs
import fs from "node:fs";

const records = JSON.parse(fs.readFileSync("src/data/places/franklin-greenpoint-heroes.v0.1.json", "utf8"));
const HERO_IDS = ["premier-franklin-organic", "sonnys-corner", "sereneco", "azure-gourmet"];
const failures = [];
const assert = (c, m) => { if (!c) failures.push(m); };

assert(records.length === 4, "Expected exactly 4 hero records.");
assert(HERO_IDS.every((id) => records.some((r) => r.placeId === id)), "All four hero placeIds present.");

for (const r of records) {
  assert(r.name && r.category && r.address, `${r.placeId}: name/category/address required.`);
  assert(Array.isArray(r.sources) && r.sources.length > 0, `${r.placeId}: must cite at least one source.`);
  for (const s of r.sources || []) assert(s.label && s.url, `${r.placeId}: each source needs label + url.`);
  assert(typeof r.lastVerified === "string" && r.lastVerified.length >= 8, `${r.placeId}: lastVerified date required.`);
  assert(["active", "unknown", "closed", "placeholder"].includes(r.status), `${r.placeId}: status must be a known value.`);
  assert(["verified", "partial", "unresolved"].includes(r.verificationStatus), `${r.placeId}: verificationStatus must be known.`);
  assert(["proposed", "approved"].includes(r.approvalStatus), `${r.placeId}: approvalStatus must be proposed|approved.`);
  assert(!("hours" in r), `${r.placeId}: no hours field in v0.`);
}

if (failures.length) {
  console.error("FAIL place-data verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log(`PASS place-data verifier: ${records.length} sourced hero records. Approval states: ${records.map((r) => `${r.placeId}=${r.approvalStatus}`).join(", ")}`);
