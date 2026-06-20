// Gate B support — pure mapping from a material family to the inked component
// PNG filenames the in-scene proof should load. Excludes `ground` (drawn as a
// bottom band by the renderer, not a wall layer). Pure + Node-testable; the
// THREE harness (src/dev/AssetKitProof.js) consumes this.
import { validCells, familyList } from "./materialFamilies.js";

export function assetKitComponentFiles(family) {
  if (!familyList().includes(family)) throw new Error(`unknown family: ${family}`);
  return validCells()
    .filter((c) => c.family === family && c.component !== "ground")
    .map((c) => `${family}-${c.component}.v1.png`)
    .sort();
}
