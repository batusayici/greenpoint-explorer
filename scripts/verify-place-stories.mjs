// scripts/verify-place-stories.mjs
// Truth gate for the PlaceStory content layer (Phase 8.2). Editorial lore is
// gated like business facts: every story cites a source, enums are known, an
// approved story must also be verified (no approved-but-unverified lore), and
// every story's placeId resolves to a known place. Off-spine landmark heroes
// are validated to the same record shape as franklin heroes.
// Run: node scripts/verify-place-stories.mjs
import fs from "node:fs";
import { getPlaceByPlaceId } from "../src/placeData.js";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const stories = read("src/data/stories/place-stories.v0.1.json");
const landmarks = read("src/data/places/landmark-heroes.v0.1.json");

const VERIF = ["verified", "partial", "unresolved"];
const APPROVAL = ["proposed", "approved"];
const STATUS = ["active", "unknown", "closed", "placeholder"];
const STORY_TYPES = [
  "history", "lost_business", "local_memory", "industrial_history",
  "polish_greenpoint", "environmental_history", "hidden_greenpoint",
  "then_now", "event_or_ritual", "business_owner_story",
];

const failures = [];
const assert = (c, m) => { if (!c) failures.push(m); };

for (const r of landmarks) {
  assert(r.id && r.placeId && r.name && r.category && r.address, `${r.placeId}: id/placeId/name/category/address required.`);
  assert(Array.isArray(r.sources) && r.sources.length > 0, `${r.placeId}: must cite at least one source.`);
  for (const s of r.sources || []) assert(s.label && s.url, `${r.placeId}: each source needs label + url.`);
  assert(STATUS.includes(r.status), `${r.placeId}: status must be known.`);
  assert(VERIF.includes(r.verificationStatus), `${r.placeId}: verificationStatus must be known.`);
  assert(APPROVAL.includes(r.approvalStatus), `${r.placeId}: approvalStatus must be proposed|approved.`);
}

for (const s of stories) {
  assert(s.id && s.placeId && s.title && s.summary, `${s.id}: id/placeId/title/summary required.`);
  assert(STORY_TYPES.includes(s.storyType), `${s.id}: storyType must be a known value.`);
  assert(Array.isArray(s.sources) && s.sources.length > 0, `${s.id}: must cite at least one source.`);
  for (const src of s.sources || []) assert(src.label && src.url, `${s.id}: each source needs label + url.`);
  assert(VERIF.includes(s.verificationStatus), `${s.id}: verificationStatus must be known.`);
  assert(APPROVAL.includes(s.approvalStatus), `${s.id}: approvalStatus must be proposed|approved.`);
  assert(!(s.approvalStatus === "approved" && s.verificationStatus !== "verified"),
    `${s.id}: an approved story must also be verified (no approved-but-unverified lore).`);
  assert(getPlaceByPlaceId(s.placeId) !== null, `${s.id}: placeId "${s.placeId}" does not resolve to a known place.`);
}

if (failures.length) {
  console.error("FAIL place-stories verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log(`PASS place-stories verifier: ${stories.length} story(ies), ${landmarks.length} landmark hero(es). States: ${stories.map((s) => `${s.id}=${s.verificationStatus}/${s.approvalStatus}`).join(", ")}`);
