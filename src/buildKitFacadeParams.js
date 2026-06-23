// Phase 8.1 — synthesize the params object decorateInkedWall expects for a
// kit-routed (non-hand-authored) building. Family defaults from classifyBuilding +
// the family palette; the per-BIN override then wins field-by-field. `family` is
// always set, which is the renderer's signal to activate the kit layers
// (weathering, door-stoop, family textures, windowRecess) — INKED_FACADE_REAL
// params have no family and stay byte-stable. Pure + Node-testable.
import { classifyBuilding } from "./buildingTypology.js";
import { MATERIAL_WALL_TONES } from "./visualSystem/palette.js";
import { nearestPaletteToken, nearestTrimToken } from "./visualSystem/colorBinding.js";

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

  // Dual-material (e.g. brownstone ground floor under brick above): groundFamily
  // overrides the GROUND-floor material (band / stoop / door); family stays the
  // wall. Both default to the single wall family, so single-material buildings
  // are unchanged. groundTint defaults to the ground family's first tone.
  const groundFamily = ov.groundFamily ?? family;
  const groundTones = MATERIAL_WALL_TONES[groundFamily];
  if (!groundTones) throw new Error(`unknown groundFamily: ${groundFamily}`);
  const wallTint = ov.tint != null ? nearestPaletteToken(Number(ov.tint), family) : tones[0];

  const params = {
    family,
    groundFamily,
    tint: wallTint,
    groundTint: ov.groundTint != null
      ? nearestPaletteToken(Number(ov.groundTint), groundFamily)
      : (groundFamily === family ? wallTint : groundTones[0]),
    storeys: ov.storeys ?? Math.max(2, t.storeyCount),
    // Commercial ground floors carry a storefront (drawn by the storefront-sign
    // system), so they must NOT also get a residential 3D stoop. Gates the stoop
    // in decorateInkedWall.
    commercialGround: t.groundFloorUse === "commercial",
    weathering: ov.weathering ?? KIT_DEFAULT_WEATHERING,
    components: ov.components ?? {},
    windowRecess: ov.windowRecess ?? KIT_DEFAULT_WINDOW_RECESS,
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
  // Explicit per-building trim color (window frame/sash, door leaf), snapped to a
  // sanctioned TRIM_TONES token. Independent of wall tint. Absent => undefined, so
  // the renderer falls back to today's wall-derived darkening (byte-stable).
  if (ov.windowTint != null) params.windowTint = nearestTrimToken(Number(ov.windowTint));
  if (ov.doorTint != null) params.doorTint = nearestTrimToken(Number(ov.doorTint));
  // Cornice molding color (decorateInkedWall reads params.corniceColor; falls back
  // to a darkened wall tone when absent). Snapped to the trim set like window/door.
  if (ov.corniceTint != null) params.corniceColor = nearestTrimToken(Number(ov.corniceTint));
  // Structural per-BIN toggles (Phase 8 facade-truth). Each is absent-means-
  // fall-through: undefined leaves today's heuristic/allowlist default intact.
  // booleans/enums — NOT colors — so no token snapping.
  if (ov.hasCornice != null) params.hasCornice = ov.hasCornice;
  if (ov.doorAwning != null) params.doorAwning = ov.doorAwning;
  if (ov.doorAlign != null) params.doorAlign = ov.doorAlign;
  // storefrontAwning: false=suppress, true=default fabric, hex number=color.
  if (ov.storefrontAwning != null) {
    params.storefrontAwning = typeof ov.storefrontAwning === "string"
      ? Number(ov.storefrontAwning)        // "0xRRGGBB" → number
      : ov.storefrontAwning;               // boolean or number, verbatim
  }
  // fireEscape: false=off, "standard"|"lattice"=on+variant, true=on(default).
  if (ov.fireEscape != null) params.fireEscape = ov.fireEscape;
  return params;
}
