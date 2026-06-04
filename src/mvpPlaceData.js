// Review/demo-safe Phase 3 scaffold data. The placeholder surface is approved
// for scaffold mechanics only; it is not visual-quality or factual evidence.
import phase3PlaceholderRasterSrc from "./assets/review-only/phase-6-1-ui-integrated-recombination-review-only.png";
import phase3ScaffoldFixture from "./data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json";
import { loadPhase3ScaffoldSceneFromFixture } from "./sceneManifest.js";

export const mvpScene = loadPhase3ScaffoldSceneFromFixture(
  phase3ScaffoldFixture,
  {
    "asset-phase-3-placeholder-raster": phase3PlaceholderRasterSrc,
  },
);
