// Review/demo-safe Phase 3 reset data. The accepted DTR-11 raster is the
// west-anchor visual baseline only; the rest of the corridor stays intake/blocked.
import dtr11WestAnchorRasterSrc from "./assets/review-only/dtr-11-reference-facade-fidelity-interactive-demo-review-only.png";
import phase3ScaffoldFixture from "./data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json";
import { loadPhase3ScaffoldSceneFromFixture } from "./sceneManifest.js";

export const mvpScene = loadPhase3ScaffoldSceneFromFixture(
  phase3ScaffoldFixture,
  {
    "asset-phase-3-dtr-11-west-anchor-raster": dtr11WestAnchorRasterSrc,
  },
);
