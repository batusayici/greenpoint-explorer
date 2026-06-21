// Pure geometry for a front fire escape. No Three.js; Node-runnable.
// Face-local meters like stoopGeometry. One balcony per upper-storey floor line
// + a ladder connecting them. Geometry-only (no texture asset) — dark iron is a
// family-palette tint applied by the renderer. `variant` lets the 8.0.3 gate
// compare a cheap relief read against a dense lattice.
export function buildFireEscapeGeometry({
  frontM,
  heightM,
  storeys,
  centerM = frontM / 2,
  widthM = 2.4,
  projectionM = 0.9,
  railHeightM = 1.0,
  variant = "relief",
}) {
  const quads = [];
  const balconies = [];
  const storeyHm = heightM / storeys;
  const uL = centerM - widthM / 2;
  const uR = centerM + widthM / 2;
  const w = projectionM;
  for (let k = 1; k < storeys; k++) {
    const v = k * storeyHm; // floor line of storey k (skip ground k=0, skip roof k=storeys)
    balconies.push(v);
    quads.push({ role: "deck", corners: [
      [uL, v, w], [uR, v, w], [uR, v, 0], [uL, v, 0],
    ]});
    quads.push({ role: "rail", corners: [ // front guard
      [uL, v, w], [uR, v, w], [uR, v + railHeightM, w], [uL, v + railHeightM, w],
    ]});
    quads.push({ role: "rail", corners: [ // left side
      [uL, v, 0], [uL, v, w], [uL, v + railHeightM, w], [uL, v + railHeightM, 0],
    ]});
    quads.push({ role: "rail", corners: [ // right side
      [uR, v, w], [uR, v, 0], [uR, v + railHeightM, 0], [uR, v + railHeightM, w],
    ]});
    if (variant === "lattice") {
      const n = Math.max(2, Math.round(widthM / 0.18));
      for (let i = 1; i < n; i++) {
        const u = uL + (widthM * i) / n;
        const t = 0.02;
        quads.push({ role: "baluster", corners: [
          [u - t, v, w], [u + t, v, w], [u + t, v + railHeightM, w], [u - t, v + railHeightM, w],
        ]});
      }
    }
  }
  const lu = uR - 0.5; // ladder hugs the right end
  for (let j = 0; j < balconies.length - 1; j++) {
    quads.push({ role: "ladder", corners: [
      [lu, balconies[j], w], [lu + 0.4, balconies[j], w],
      [lu + 0.4, balconies[j + 1], w], [lu, balconies[j + 1], w],
    ]});
  }
  return { quads, balconies };
}
