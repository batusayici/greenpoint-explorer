// Pure predicates: which families/heights get a 3D stoop or front fire escape.
// No Three.js; Node-runnable. Thresholds are the tunable taste decision — change
// here, nowhere else.
const STOOP_FAMILIES = new Set(["brick", "clapboard", "brownstone"]);
const FIRE_ESCAPE_FAMILIES = new Set(["brick", "brownstone"]);
const FIRE_ESCAPE_MIN_STOREYS = 4;

export function wantsStoop(family) {
  return STOOP_FAMILIES.has(family);
}

export function wantsFireEscape(family, storeys) {
  return FIRE_ESCAPE_FAMILIES.has(family) && storeys >= FIRE_ESCAPE_MIN_STOREYS;
}
