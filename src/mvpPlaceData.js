// Review/demo-safe MVP scene data now loads through the Phase 2B manifest path.
import dtr11RasterPlateSrc from "./assets/review-only/dtr-11-reference-facade-fidelity-interactive-demo-review-only.png";
import mvp29eRasterPlateSrc from "./assets/review-only/mvp-29e-four-corner-manhattan-greenpoint-review.png";
import draftSceneFixture from "./data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json";
import geometrySourceFixture from "./data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json";
import realDataFixture from "./data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json";
import sceneManifest from "./data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json";
import sourceEvidenceFixture from "./data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json";
import { loadMvpSceneFromManifest } from "./sceneManifest.js";

export const mvpScene = loadMvpSceneFromManifest(
  sceneManifest,
  {
    "asset-dtr-11-interactive-demo-raster": dtr11RasterPlateSrc,
    "asset-mvp-29e-raster": mvp29eRasterPlateSrc,
  },
  sourceEvidenceFixture,
  draftSceneFixture,
  realDataFixture,
  geometrySourceFixture,
);
