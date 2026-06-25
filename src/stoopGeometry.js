// Pure geometry for a raised entry stoop. No Three.js; Node-runnable.
// Face-local meters: u = along the wall edge from its left end, v = height above
// the sidewalk, w = projection out from the wall plane (0 = flush). Each quad is
// 4 [u,v,w] corners + a role the renderer tints/textures. Renderer maps [u,v,w]
// -> point(u/frontM, v/heightM, w*upm).
//
// Reads as a real stoop (not a box): the side walls are RAKED — full height at the
// house, low at the sidewalk — so the steps stay visible above them, and a NEWEL
// post anchors each front corner. Roles: tread | riser | platform | cheek (raked
// side wall) | coping (sloped wall top) | newel (corner post).
export function buildStoopGeometry({
  frontM,
  doorCenterM,
  widthM = 1.3,
  projectionM = 1.4,
  parlorHeightM = 1.3,
  stepCount = 7,
  cheekThickM = 0.18,
  cheekFrontHeightM = 0.55, // side-wall height at the sidewalk end (rakes down to this)
  newelHeightM = 0.72,      // corner post height (covers the cheek's front end)
  newelDepthM = 0.26,       // post footprint depth (out from the front step)
  groundReliefM = 0,        // 8.5 areaway hook: extra base raise; stoop top rises with it
}) {
  const topV = parlorHeightM + groundReliefM;
  const uL = doorCenterM - widthM / 2;
  const uR = doorCenterM + widthM / 2;
  // Side-wall heights: full at the house (back, w=0), low at the sidewalk (front,
  // w=projectionM). Clamp so the rake always slopes DOWN toward the street.
  const cheekBackV = topV;
  const cheekFrontV = Math.min(cheekFrontHeightM, topV - 0.05);
  const newelV = Math.max(newelHeightM, cheekFrontV + 0.08); // post tops the cheek front
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
    // Raked outer face of the side wall: high at the house, low at the sidewalk.
    quads.push({ role: "cheek", corners: [
      [uOut, 0, 0], [uOut, 0, projectionM], [uOut, cheekFrontV, projectionM], [uOut, cheekBackV, 0],
    ]});
    // Sloped top (coping) of the side wall, cheekThick wide, following the rake.
    quads.push({ role: "coping", corners: [
      [uIn, cheekBackV, 0], [uOut, cheekBackV, 0], [uOut, cheekFrontV, projectionM], [uIn, cheekFrontV, projectionM],
    ]});
    // Newel post at the sidewalk corner — a short box closing the cheek's front end.
    const wBackN = projectionM - newelDepthM;
    quads.push({ role: "newel", corners: [ // front (+w)
      [uIn, 0, projectionM], [uOut, 0, projectionM], [uOut, newelV, projectionM], [uIn, newelV, projectionM],
    ]});
    quads.push({ role: "newel", corners: [ // outer side
      [uOut, 0, wBackN], [uOut, 0, projectionM], [uOut, newelV, projectionM], [uOut, newelV, wBackN],
    ]});
    quads.push({ role: "newel", corners: [ // inner side
      [uIn, 0, projectionM], [uIn, 0, wBackN], [uIn, newelV, wBackN], [uIn, newelV, projectionM],
    ]});
    quads.push({ role: "newel", corners: [ // top cap
      [uIn, newelV, wBackN], [uOut, newelV, wBackN], [uOut, newelV, projectionM], [uIn, newelV, projectionM],
    ]});
  }
  // Landing at the door: from the top step back to the wall plane.
  quads.push({ role: "platform", corners: [
    [uL, topV, projectionM / stepCount], [uR, topV, projectionM / stepCount], [uR, topV, 0], [uL, topV, 0],
  ]});
  return { quads, topV, uL, uR };
}
