// Dev-only per-BIN facade-truth registry. The scene builder registers each
// kit-routed building's resolved family + current tints here so the truth editor
// (?facadeedit=1) can seed its controls without re-deriving. Cleared per rebuild.
const truth = new Map();
const listeners = new Set();

export function resetBuildingTruth() {
  truth.clear();
  listeners.forEach((fn) => fn());
}

export function registerBuildingTruth(bin, entry) {
  if (bin == null) return;
  truth.set(String(bin), entry);
  listeners.forEach((fn) => fn());
}

export function getBuildingTruth(bin) {
  return bin == null ? null : truth.get(String(bin)) ?? null;
}

export function buildingTruthBins() {
  return [...truth.keys()];
}

export function subscribeBuildingTruth(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
