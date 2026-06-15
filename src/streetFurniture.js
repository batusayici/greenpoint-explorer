// src/streetFurniture.js
// Pure geometry for corner street furniture — typological NYC signals at the
// four curb-return corners of the intersection. No Three.js; Node-runnable,
// same discipline as groundLayer.js. Placement is NYC-standard (typological),
// not evidence-exact; exact positions are deferred to the pre-publish truth
// pass. Origin (0,0) is the intersection.

export const SIGNAL_CORNER_INSET = 0.12; // units onto the corner sidewalk from the curb meet

// streets: groundLayer's two streets (greenpoint-ave, franklin-st), each with
// { axis, perp, halfWidth }. Corners are where the Franklin curb (g = ±frHalf)
// meets the Greenpoint curb (f = ±gpHalf), nudged onto the sidewalk by the inset.
export function buildStreetFurniture({ streets, greenpointAxis, franklinAxis }) {
  const gp = streets.find((s) => s.id === "greenpoint-ave");
  const fr = streets.find((s) => s.id === "franklin-st");
  if (!gp || !fr) return { signals: [] };

  const signals = [];
  for (const signG of [1, -1]) {
    for (const signF of [1, -1]) {
      const g = signG * (fr.halfWidth + SIGNAL_CORNER_INSET);
      const f = signF * (gp.halfWidth + SIGNAL_CORNER_INSET);
      const position = {
        x: greenpointAxis.x * g + franklinAxis.x * f,
        z: greenpointAxis.z * g + franklinAxis.z * f,
      };
      const len = Math.hypot(position.x, position.z) || 1;
      const mastArmDir = { x: -position.x / len, z: -position.z / len };
      signals.push({
        id: `signal-${signG > 0 ? "gp+" : "gp-"}-${signF > 0 ? "fr+" : "fr-"}`,
        corner: { signG, signF },
        position,
        mastArmDir,
        typological: true,
      });
    }
  }
  return { signals };
}
