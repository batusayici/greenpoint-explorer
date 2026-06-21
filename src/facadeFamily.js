// Phase 8.1 — resolve a building's kit material family (the truth layer).
// Precedence: curated override family (evidence-bound) > dev pilot map > heuristic
// bridge over classifyBuilding. Only the curated path truthfully asserts
// clapboard/brownstone/modern-flat; the heuristic only ever yields brick /
// painted-masonry / warehouse. Pure + Node-testable.
import { classifyBuilding } from "./buildingTypology.js";
import { familyList } from "./materialFamilies.js";

// classifyBuilding.materialFamily (use-vocab) -> kit family. commercial-storefront
// is a USE not a cladding; its cladding-above-storefront defaults to brick.
const HEURISTIC_FAMILY = {
  "brick-prewar": "brick",
  "commercial-storefront": "brick",
  "painted-masonry": "painted-masonry",
  warehouse: "warehouse",
};

export function resolveFacadeFamily(building, { overrides = {}, pilotBins = {} } = {}) {
  const bin = building?.bin;
  const ov = bin != null ? overrides[bin] : undefined;
  if (ov?.family) return { family: ov.family, evidenceTier: "curated" };
  if (bin != null && pilotBins[bin]) return { family: pilotBins[bin], evidenceTier: "pilot-unverified" };
  const t = classifyBuilding({ sourceProperties: building?.sourceProperties ?? {} });
  return { family: HEURISTIC_FAMILY[t.materialFamily] ?? "brick", evidenceTier: "inferred-unverified" };
}

const isPosInt = (v) => Number.isInteger(v) && v > 0;
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

export function isValidFacadeOverride(obj) {
  if (!obj || typeof obj !== "object") return false;
  if ("family" in obj && !familyList().includes(obj.family)) return false;
  if ("tint" in obj && !(typeof obj.tint === "string" && /^0x[0-9a-fA-F]{6}$/.test(obj.tint))) return false;
  if ("storeys" in obj && !isPosInt(obj.storeys)) return false;
  if ("bays" in obj && !isPosInt(obj.bays)) return false;
  if ("weathering" in obj && !(isNum(obj.weathering) && obj.weathering >= 0 && obj.weathering <= 1)) return false;
  if ("corniceFrac" in obj && !(isNum(obj.corniceFrac) && obj.corniceFrac > 0 && obj.corniceFrac < 0.3)) return false;
  if ("corniceProj" in obj && !(isNum(obj.corniceProj) && obj.corniceProj >= 0)) return false;
  if ("windowRecess" in obj && !(isNum(obj.windowRecess) && obj.windowRecess >= 0)) return false;
  if ("components" in obj && (!obj.components || typeof obj.components !== "object")) return false;
  return true;
}
