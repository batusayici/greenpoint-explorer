// Phase 7.1 — pure loader for the canonical material taxonomy + valid-cell matrix.
// Node-importable, zero-dependency. DATA ONLY: this does not classify buildings
// (that is buildingTypology.js, rewired in Phase 8); it only answers what the
// kit may legally draw.
import data from "./data/materials/material-families.v0.1.json" with { type: "json" };

export function loadMaterialFamilies() {
  return { families: data.families, components: data.components, cells: data.cells };
}
export function familyList() {
  return [...data.families];
}
export function componentList() {
  return [...data.components];
}
export function isValidCell(family, component) {
  return Boolean(data.cells[family]?.includes(component));
}
export function validCells() {
  return data.families.flatMap((family) =>
    (data.cells[family] ?? []).map((component) => ({ family, component })),
  );
}
