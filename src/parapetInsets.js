// src/parapetInsets.js
// Pure layout of evenly spaced parapet ornament insets (e.g. Elder Greene's
// stone diamonds) along a street frontage. Returns center fractions (u in 0..1)
// along the edge; the renderer draws a diamond at each, just below the cornice.
// No Three.js; Node-runnable.

export function planParapetInsets({
  edgeLengthM,
  spacingM = 2.4,   // diamond-to-diamond spacing
  marginM = 1.0,    // keep clear of the corners
} = {}) {
  if (!(edgeLengthM > 0) || edgeLengthM <= 2 * marginM + 0.2) return { insets: [] };
  const usable = edgeLengthM - 2 * marginM;
  const n = Math.max(1, Math.floor(usable / spacingM) + 1);
  const insets = [];
  for (let i = 0; i < n; i += 1) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    insets.push({ u: (marginM + usable * t) / edgeLengthM });
  }
  return { insets };
}
