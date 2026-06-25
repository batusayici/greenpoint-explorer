// src/storefrontSeating.js
// Pure layout of small bistro tables along a storefront frontage (R2 signature
// seating, e.g. Elder Greene's sage chairs). Returns table centers as along-edge
// fractions (u in 0..1) plus a fixed outward offset in meters; the renderer maps
// them to world via the face frame. No Three.js; Node-runnable.

export function planStorefrontSeating({
  edgeLengthM,
  offsetM = 1.25,   // out from the wall onto the sidewalk
  spacingM = 2.6,   // table-to-table spacing
  marginM = 1.5,    // keep clear of the corner/door ends
} = {}) {
  if (!(edgeLengthM > 0) || edgeLengthM <= 2 * marginM + 0.2) return { tables: [], offsetM };
  const usable = edgeLengthM - 2 * marginM;
  const n = Math.max(1, Math.floor(usable / spacingM) + 1);
  const tables = [];
  for (let i = 0; i < n; i += 1) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const distM = marginM + usable * t;
    tables.push({ u: distM / edgeLengthM, offsetM });
  }
  return { tables, offsetM };
}
