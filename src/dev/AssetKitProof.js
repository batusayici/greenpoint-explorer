// Gate B — dev-only composed-in-scene proof. Renders one material family's
// inked components, composed (composeInkedFacade) and tinted (MATERIAL_WALL_TONES),
// onto a single test quad so a component can be judged as it READS in-scene, not
// as a flat PNG. Mounted ONLY under ?assetkit=<family> (see SceneView). This does
// NOT touch production building selection — it is an additive review surface.
import { composeInkedFacade } from "../inkedFacadeCompose.js";
import { MATERIAL_WALL_TONES } from "../visualSystem/palette.js";
import { assetKitComponentFiles } from "../assetKitProof.js";

// `inkedTexture(file, repeat?)` is the existing memoized loader passed in from
// SceneView so this module stays free of asset-URL plumbing.
export function mountAssetKitProof(THREE, scene, family, inkedTexture) {
  const files = new Set(assetKitComponentFiles(family));
  const tint = MATERIAL_WALL_TONES[family]?.[0] ?? 0xffffff;
  const group = new THREE.Group();
  const W = 6, H = 8;

  const quad = (rect, z, file, { transparent = false, useTint = false } = {}) => {
    const g = new THREE.PlaneGeometry((rect.x1 - rect.x0) * W, (rect.y1 - rect.y0) * H);
    g.translate(((rect.x0 + rect.x1) / 2 - 0.5) * W, ((rect.y0 + rect.y1) / 2) * H, z);
    const m = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent });
    const tex = file && files.has(file) ? inkedTexture(file) : null;
    if (tex) m.map = tex;
    if (useTint) m.color.setHex(tint);
    group.add(new THREE.Mesh(g, m));
  };

  const f = composeInkedFacade({ storeys: 3, bays: 2 });
  quad(f.wall, 0.0, `${family}-wall.v1.png`, { useTint: true });
  quad(f.cornice, 0.02, `${family}-cornice.v1.png`, { transparent: true, useTint: true });
  for (const w of f.windows) quad(w, 0.03, `${family}-window.v1.png`, { transparent: true });
  // door-stoop centered on the ground band; weathering washes the whole wall.
  quad({ x0: 0.4, x1: 0.6, y0: 0, y1: f.ground.y1 }, 0.03, `${family}-door-stoop.v1.png`, { transparent: true });
  quad(f.wall, 0.05, `${family}-weathering.v1.png`, { transparent: true });

  scene.add(group);
  return group;
}
