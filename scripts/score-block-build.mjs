import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { classifyBuilding } from "../src/buildingTypology.js";

const [blockId, sinceRef] = process.argv.slice(2);
if (!blockId || !sinceRef) throw new Error("Usage: node scripts/score-block-build.mjs <blockId> <sinceRef>");

const geo = JSON.parse(await readFile(`src/data/geometry-source/block-${blockId}.nyc-open-geometry.v0.1.json`, "utf8"));
let sourceBacked = 0;
const fam = {}, use = {};
for (const r of geo.footprintRecords) {
  const t = classifyBuilding(r);
  if (t.confidence.storeyCount === "source-backed") sourceBacked++;
  fam[t.materialFamily] = (fam[t.materialFamily] ?? 0) + 1;
  use[t.groundFloorUse] = (use[t.groundFloorUse] ?? 0) + 1;
}

let stores = { recordCount: 0, addressBacked: 0 };
try {
  const s = JSON.parse(await readFile(`src/data/places/block-${blockId}-storefronts.v0.1.json`, "utf8"));
  stores = { recordCount: s.recordCount, addressBacked: s.storefronts.filter((x) => x.confidence === "address-backed").length };
} catch { /* no roster */ }

const filesChanged = execSync(`git diff --name-only ${sinceRef} HEAD`).toString().trim().split("\n").filter(Boolean);
const codeFiles = filesChanged.filter((f) => f.startsWith("src/") && (f.endsWith(".js") || f.endsWith(".jsx")));
const diffStat = execSync(`git diff --shortstat ${sinceRef} HEAD`).toString().trim();

console.log(`## Block: ${blockId}  (delta since ${sinceRef})\n`);
console.log(`- Buildings: ${geo.recordCount} (storey source-backed: ${sourceBacked}/${geo.recordCount}, ${Math.round(100*sourceBacked/Math.max(1,geo.recordCount))}%)`);
console.log(`- materialFamily: ${JSON.stringify(fam)}`);
console.log(`- groundFloorUse: ${JSON.stringify(use)}`);
console.log(`- Storefronts (OSM): ${stores.recordCount} (address-backed: ${stores.addressBacked})`);
console.log(`- src code files changed: ${codeFiles.length} -> ${codeFiles.join(", ") || "none"}`);
console.log(`- diff: ${diffStat}`);
