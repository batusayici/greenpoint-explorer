// Review/demo-safe MVP scene data now loads through the Phase 2B manifest path.
import rasterPlateSrc from "./assets/review-only/mvp-29e-four-corner-manhattan-greenpoint-review.png";
import draftSceneFixture from "./data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json";
import realDataFixture from "./data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json";
import sceneManifest from "./data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json";
import sourceEvidenceFixture from "./data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json";
import { loadMvpSceneFromManifest } from "./sceneManifest.js";

export const mvpScene = loadMvpSceneFromManifest(
  sceneManifest,
  {
    "asset-mvp-29e-raster": rasterPlateSrc,
  },
  sourceEvidenceFixture,
  draftSceneFixture,
  realDataFixture,
);
