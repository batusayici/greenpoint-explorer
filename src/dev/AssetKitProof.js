// Gate B (isolation) — dev-only. When ?assetkit=<family> is set, SceneView skips
// the city build and calls this: renders the family's composed+tinted kit facade
// beside a shipped hero composite (tone reference) on a neutral ground, framed by
// the iso camera. Legible + identical every run. Receives THREE + the scene + the
// existing inkedTexture loader so it needs no scene-frame helpers.
import { composeInkedFacade } from "../inkedFacadeCompose.js";
import { MATERIAL_WALL_TONES } from "../visualSystem/palette.js";
import { assetKitComponentFiles } from "../assetKitProof.js";

const ISO_AZIMUTH = Math.PI * 0.75;

export function mountAssetKitProofIsolation(THREE, three, family, inkedTexture, heroTexture) {
  const want = new Set(assetKitComponentFiles(family)); // wall/cornice/window/door-stoop/weathering
  const tint = MATERIAL_WALL_TONES[family]?.[0] ?? 0xffffff;

  // Camera-facing basis at iso step 0.
  const n = new THREE.Vector3(Math.sin(ISO_AZIMUTH), 0, Math.cos(ISO_AZIMUTH)).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(n, up).normalize();
  const anchor = new THREE.Vector3(0, 0, 0);

  // Neutral ground.
  {
    const g = new THREE.PlaneGeometry(14, 14);
    g.rotateX(-Math.PI / 2);
    g.translate(anchor.x, -0.02, anchor.z);
    three.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xd8d2bc, side: THREE.DoubleSide })));
  }

  // A flat facade panel centered at `c`, width Wf x height Hf, base at y=0.
  const panel = (c, Wf, Hf, draw) => {
    const pt = (x, y, off) => new THREE.Vector3().copy(c)
      .addScaledVector(right, (x - 0.5) * Wf).addScaledVector(up, y * Hf).addScaledVector(n, off);
    const quad = (r, off, tex, { transparent = false, useTint = false } = {}) => {
      const p0 = pt(r.x0, r.y0, off), p1 = pt(r.x1, r.y0, off), p2 = pt(r.x1, r.y1, off), p3 = pt(r.x0, r.y1, off);
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([...p0.toArray(), ...p1.toArray(), ...p2.toArray(), ...p3.toArray()]), 3));
      g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([1, 0, 0, 0, 0, 1, 1, 1]), 2));
      g.setIndex([0, 1, 2, 0, 2, 3]);
      const m = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent });
      if (tex) m.map = tex;
      if (useTint) m.color.setHex(tint);
      const mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; three.add(mesh);
    };
    draw(quad);
  };

  // Test facade (left of anchor).
  const f = composeInkedFacade({ storeys: 3, bays: 2 });
  const tex = (comp) => (want.has(`${family}-${comp}.v1.png`) ? inkedTexture(`${family}-${comp}.v1.png`) : null);
  const cTest = new THREE.Vector3().copy(anchor).addScaledVector(right, -1.1);
  panel(cTest, 1.6, 2.2, (quad) => {
    if (tex("wall")) quad(f.wall, 0.0, tex("wall"), { useTint: true });
    if (tex("weathering")) quad(f.wall, 0.02, tex("weathering"), { transparent: true });
    if (tex("cornice")) quad(f.cornice, 0.03, tex("cornice"), { transparent: true, useTint: true });
    if (tex("window")) for (const w of f.windows) quad(w, 0.04, tex("window"), { transparent: true });
    if (tex("door-stoop")) quad({ x0: 0.4, x1: 0.6, y0: 0, y1: f.ground.y1 }, 0.04, tex("door-stoop"), { transparent: true });
  });

  // Hero reference (right of anchor) — flat textured quad, sized to the hero's wide aspect.
  if (heroTexture) {
    const cHero = new THREE.Vector3().copy(anchor).addScaledVector(right, 1.3);
    panel(cHero, 2.6, 1.2, (quad) => quad({ x0: 0, x1: 1, y0: 0, y1: 1 }, 0.0, heroTexture, { transparent: false }));
  }
}
