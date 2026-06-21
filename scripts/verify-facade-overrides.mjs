// Verify the per-BIN facade-overrides file: each record is shape-valid; any record
// with a `family` names a family WITH kit assets (never curate onto a family that
// can't render); any `components` keys are valid cells for that family. Ships green
// against the empty file.
import { isValidFacadeOverride } from "../src/facadeFamily.js";
import { familyHasKit, kitHas } from "../src/kitCoverage.js";
import { isValidCell } from "../src/materialFamilies.js";
import data from "../src/data/facade-overrides/greenpoint-corridor.v0.1.json" with { type: "json" };

const errors = [];
for (const [bin, rec] of Object.entries(data.overrides ?? {})) {
  if (!isValidFacadeOverride(rec)) { errors.push(`${bin}: invalid override shape`); continue; }
  if (rec.family) {
    if (!familyHasKit(rec.family)) errors.push(`${bin}: family "${rec.family}" has no kit assets`);
    for (const cell of Object.keys(rec.components ?? {})) {
      if (!isValidCell(rec.family, cell) && !kitHas(rec.family, cell)) {
        errors.push(`${bin}: components key "${cell}" is not a valid ${rec.family} cell`);
      }
    }
  }
}
if (errors.length) {
  console.error("facade-overrides verify FAILED:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log("facade-overrides OK");
