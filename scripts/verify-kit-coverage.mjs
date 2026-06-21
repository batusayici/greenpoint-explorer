// Verify the kit-coverage manifest matches assets/inked/ exactly for the known
// (family x component) grid. Fails if the manifest claims a missing PNG, or if a
// real <family>-<component>.v1.png is not listed. familyList/componentList
// disambiguate the hyphenated parse (both family and component contain hyphens).
import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { familyList, componentList } from "../src/materialFamilies.js";
import data from "../src/data/materials/kit-coverage.v0.1.json" with { type: "json" };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INKED = join(ROOT, "assets", "inked");
const errors = [];

// 1. Every coverage entry has a file on disk.
for (const [family, comps] of Object.entries(data.coverage)) {
  for (const comp of comps) {
    if (!existsSync(join(INKED, `${family}-${comp}.v1.png`))) {
      errors.push(`coverage claims missing asset: ${family}-${comp}.v1.png`);
    }
  }
}

// 2. Every canonical <family>-<component>.v1.png on disk is listed in coverage.
const onDisk = new Set(readdirSync(INKED).filter((f) => f.endsWith(".v1.png")));
for (const family of familyList()) {
  for (const comp of componentList()) {
    const file = `${family}-${comp}.v1.png`;
    if (onDisk.has(file) && !(data.coverage[family] ?? []).includes(comp)) {
      errors.push(`asset not in coverage manifest: ${file}`);
    }
  }
}

if (errors.length) {
  console.error("kit-coverage verify FAILED:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log("kit-coverage OK");
