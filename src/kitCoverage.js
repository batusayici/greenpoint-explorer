// Phase 8.1 — pure accessors over the kit-coverage manifest. Single source for
// "what can the kit legally draw for this family today". A family is kit-eligible
// iff it has a `wall`; kitFile returns null for any missing cell so callers SKIP
// that layer (honest degradation — never substitute another material).
import data from "./data/materials/kit-coverage.v0.1.json" with { type: "json" };

export function kitHas(family, component) {
  return Boolean(data.coverage[family]?.includes(component));
}
export function familyHasKit(family) {
  return kitHas(family, "wall");
}
export function kitFile(family, component) {
  return kitHas(family, component) ? `${family}-${component}.v1.png` : null;
}
