// Pure geometry for a raised entry stoop. No Three.js; Node-runnable.
// Face-local meters: u = along the wall edge from its left end, v = height above
// the sidewalk, w = projection out from the wall plane (0 = flush). Each quad is
// 4 [u,v,w] corners + a role the renderer tints. Renderer maps [u,v,w] ->
// point(u/frontM, v/heightM, w*upm).
export function buildStoopGeometry({
  frontM,
  doorCenterM,
  widthM = 1.3,
  projectionM = 1.4,
  parlorHeightM = 1.3,
  stepCount = 7,
  cheekThickM = 0.18,
  groundReliefM = 0, // 8.5 areaway hook: extra base raise; stoop top rises with it
}) {
  const topV = parlorHeightM + groundReliefM;
  const uL = doorCenterM - widthM / 2;
  const uR = doorCenterM + widthM / 2;
  const quads = [];
  const stepRise = topV / stepCount;
  const stepRun = projectionM / stepCount;
  for (let i = 0; i < stepCount; i++) {
    const v0 = i * stepRise;
    const v1 = (i + 1) * stepRise;
    const wFront = projectionM - i * stepRun;       // outer edge of this tread
    const wBack = projectionM - (i + 1) * stepRun;  // where it meets the next riser
    quads.push({ role: "tread", corners: [
      [uL, v1, wFront], [uR, v1, wFront], [uR, v1, wBack], [uL, v1, wBack],
    ]});
    quads.push({ role: "riser", corners: [
      [uL, v0, wFront], [uR, v0, wFront], [uR, v1, wFront], [uL, v1, wFront],
    ]});
  }
  for (const side of [-1, 1]) {
    const uOut = side < 0 ? uL - cheekThickM : uR + cheekThickM;
    const uIn = side < 0 ? uL : uR;
    // Outer vertical face of the cheek wall (parapet flanking the steps).
    quads.push({ role: "cheek", corners: [
      [uOut, 0, projectionM], [uOut, 0, 0], [uOut, topV, 0], [uOut, topV, projectionM],
    ]});
    // Top cap of the cheek wall.
    quads.push({ role: "cheek", corners: [
      [uIn, topV, projectionM], [uOut, topV, projectionM], [uOut, topV, 0], [uIn, topV, 0],
    ]});
  }
  // Landing at the door: from the top step back to the wall plane.
  quads.push({ role: "platform", corners: [
    [uL, topV, projectionM / stepCount], [uR, topV, projectionM / stepCount], [uR, topV, 0], [uL, topV, 0],
  ]});
  return { quads, topV, uL, uR };
}
