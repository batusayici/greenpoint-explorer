// Phase 8.1 — synthesize the params object decorateInkedWall expects for a
// kit-routed (non-hand-authored) building. Family defaults from classifyBuilding +
// the family palette; the per-BIN override then wins field-by-field. `family` is
// always set, which is the renderer's signal to activate the kit layers
// (weathering, door-stoop, family textures, windowRecess) — INKED_FACADE_REAL
// params have no family and stay byte-stable. Pure + Node-testable.
import { classifyBuilding } from "./buildingTypology.js";
import { MATERIAL_WALL_TONES } from "./visualSystem/palette.js";
import { nearestPaletteToken } from "./visualSystem/colorBinding.js";

const KIT_DEFAULT_WEATHERING = 0.35;
// Kit windows recess into the wall by default so glass reads with depth + a
// projecting sill (≈0.12 m reveal ≈ "thick lit ledge" per GENERATION_KIT). An
// override still wins; INKED_FACADE_REAL params have no family and are untouched.
const KIT_DEFAULT_WINDOW_RECESS = 0.12;

export function buildKitFacadeParams(building, family, override = undefined) {
  const tones = MATERIAL_WALL_TONES[family];
  if (!tones) throw new Error(`unknown family: ${family}`);
  const ov = override ?? {};
  const t = classifyBuilding({ sourceProperties: building?.sourceProperties ?? {} });

  const params = {
    family,
    tint: ov.tint != null ? nearestPaletteToken(Number(ov.tint), family) : tones[0],
    storeys: ov.storeys ?? Math.max(2, t.storeyCount),
    weathering: ov.weathering ?? KIT_DEFAULT_WEATHERING,
    components: ov.components ?? {},
    // Modern/flat buildings have flush windows (no masonry reveal or stone sill);
    // the recess + sill geometry suits prewar masonry + clapboard only.
    windowRecess: ov.windowRecess ?? (family === "modern-flat" ? 0 : KIT_DEFAULT_WINDOW_RECESS),
    // Commercial ground floors are dressed by the storefront-sign system, not the
    // kit; kit-routed buildings use the stoop/ground-band path. Corner wrap on
    // kit buildings is out of scope (geometric), so single street face.
    storefront: null,
    corner: false,
  };
  if (ov.bays != null) params.bays = ov.bays;
  if (ov.corniceFrac != null) params.corniceFrac = ov.corniceFrac;
  if (ov.corniceProj != null) params.corniceProj = ov.corniceProj;
  if (ov.fireEscapeVariant != null) params.fireEscapeVariant = ov.fireEscapeVariant;
  return params;
}
