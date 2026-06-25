// Pure geometry for a front fire escape. No Three.js; Node-runnable.
// Face-local meters like stoopGeometry. One balcony per upper-storey floor line,
// connected by DIAGONAL stairs (not a vertical ladder) — the iconic Brooklyn
// look: each flight is an OPEN stair (two slender stringers + stepped treads,
// gaps showing the brick behind) slashing from one end of the upper balcony down
// to the lower one, with a handrail running parallel above the outer stringer. A
// rungs drop-ladder hangs off the lowest balcony toward the sidewalk. Everything
// is geometry-only (no texture asset); the renderer tints it dark iron — neutral
// near-black, NOT a brick tint, or it reads as wood. `variant` lets the 8.0.3
// gate compare a cheap relief read against a dense lattice.
export function buildFireEscapeGeometry({
  frontM,
  heightM,
  storeys,
  centerM = frontM / 2,
  widthM = 2.4,
  projectionM = 0.9,
  railHeightM = 1.0,
  variant = "relief",
  stairBandM = 0.6,    // horizontal length of a tread (the open stair's width)
  stairInsetM = 0.25,  // how far the stair ends sit inboard of each balcony end
  treadRiseM = 0.3,    // vertical spacing between treads
  memberM = 0.05,      // thickness of slender iron members (stringers, rails, rungs)
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
  // Diagonal stairs built as REAL 3D flights, seen from the side like the
  // reference: horizontal treads that have DEPTH (they span the stair's width in w,
  // so the iso camera reads their step faces) marching down between two diagonal
  // side stringers. Consistent straight-run lean — the top of each flight hugs uL,
  // the foot hugs uR, so the flights stack into one continuous descent.
  const wIn = Math.min(0.15, w * 0.25);   // inner depth of the stair band
  const wOut = w * 0.85;                  // outer depth (just inside the front rail)
  const uTop = uL + stairInsetM;          // top of a flight (at the upper balcony)
  const uBot = uR - stairInsetM - 0.4;    // foot of a flight (at the lower balcony)
  for (let j = 0; j < balconies.length - 1; j++) {
    const vLo = balconies[j];          // lower balcony floor line
    const vHi = balconies[j + 1];      // upper balcony floor line
    const drop = vHi - vLo;
    const M = Math.max(3, Math.round(drop / treadRiseM));
    const going = (uBot - uTop) / M;   // horizontal advance per step
    const rise = drop / M;             // vertical drop per step
    // Two diagonal side stringers, at the inner & outer depth of the stair — they
    // read as the staircase's side rails seen edge-on.
    for (const wS of [wIn, wOut]) {
      quads.push({ role: "stringer", corners: [
        [uTop, vHi, wS], [uTop + memberM, vHi, wS], [uBot + memberM, vLo, wS], [uBot, vLo, wS],
      ]});
    }
    // Horizontal treads (flat, with depth) stepping down & along — open risers
    // between them, so the brick shows through and it reads as iron stairs.
    for (let i = 0; i < M; i++) {
      const y = vHi - rise * (i + 1);
      const u = uTop + going * i;
      quads.push({ role: "tread", corners: [
        [u, y, wOut], [u + going + memberM, y, wOut], [u + going + memberM, y, wIn], [u, y, wIn],
      ]});
    }
    // Handrail: a diagonal beam following the OUTER stringer, railHeight up.
    const rt = vHi + railHeightM, rb = vLo + railHeightM;
    quads.push({ role: "handrail", corners: [
      [uTop, rt, wOut], [uTop + memberM, rt, wOut], [uBot + memberM, rb, wOut], [uBot, rb, wOut],
    ]});
  }
  // Drop-ladder: two vertical side rails + rungs, hanging off the lowest balcony
  // and running ALL the way down to the sidewalk (the counterweighted last flight),
  // so it never terminates partway up on the stoop steps. It hugs the balcony's
  // OUTER (right) end so it clears a centred stoop and lands on open sidewalk
  // beside it, continuing the stairs' rightward descent in one line.
  if (balconies.length > 0) {
    const v0 = balconies[0];
    // Half-length: the counterweighted ladder hangs partway down, well above the
    // sidewalk (and clear of the stoop), not all the way to the ground.
    const yBot = v0 - (v0 - 0.12) * 0.5;
    const lW = 0.36;
    const lL = uR - lW;         // right edge of the balcony — clears a centred stoop
    for (const x of [lL, lL + lW - memberM]) {
      quads.push({ role: "ladderRail", corners: [
        [x, v0, w], [x + memberM, v0, w], [x + memberM, yBot, w], [x, yBot, w],
      ]});
    }
    const rungN = Math.max(5, Math.round((v0 - yBot) / 0.34));
    for (let i = 1; i < rungN; i++) {
      const y = v0 - (v0 - yBot) * (i / rungN);
      quads.push({ role: "rung", corners: [
        [lL, y, w], [lL + lW, y, w], [lL + lW, y - 0.04, w], [lL, y - 0.04, w],
      ]});
    }
  }
  return { quads, balconies };
}
