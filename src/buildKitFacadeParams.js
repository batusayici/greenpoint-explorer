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
  // Fire escape painted iron tint (SceneView.jsx lines 2633-2634 read params.fireEscapeColor;
  // falls back to the neutral palette constants when absent). Snapped to the trim set.
  if (ov.fireEscapeColor != null) params.fireEscapeColor = nearestTrimToken(Number(ov.fireEscapeColor));
  // Structural per-BIN toggles (Phase 8 facade-truth). Each is absent-means-
  // fall-through: undefined leaves today's heuristic/allowlist default intact.
  // booleans/enums — NOT colors — so no token snapping.
  if (ov.hasCornice != null) params.hasCornice = ov.hasCornice;
  if (ov.doorAwning != null) params.doorAwning = ov.doorAwning;
  if (ov.doorAlign != null) params.doorAlign = ov.doorAlign;
  if (ov.hasStoop != null) params.hasStoop = ov.hasStoop;
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

// Merge a per-BIN facade-truth override onto a HAND-AUTHORED INKED_FACADE_REAL
// params object (the corner/hero-adjacent run that has no `family` and renders on
// the manual decorateInkedWall path). Mirrors the override conversions in
// buildKitFacadeParams so the editor's saves take effect on these BINs too —
// previously the manual table was consumed verbatim and FACADE_OVERRIDES was
// never applied to them. Returns a new object; `base` is left untouched.
// decorateInkedWall reads windowTint/doorTint/corniceColor/fireEscapeColor/
// hasCornice/fireEscape/hasStoop/doorAwning/doorAlign directly (not gated on
// family), so merged fields render without flipping these onto the kit path.
export function applyInkedOverride(base, override = undefined) {
  if (!override || typeof override !== "object") return base;
  const ov = override;
  const out = { ...base };
  // family/material is the kit-layer signal; only set it if the override does,
  // otherwise the byte-stable manual entry keeps family: undefined.
  if (ov.family != null) out.family = ov.family;
  const palFamily = out.family ?? base.family ?? "brick";
  if (ov.tint != null) out.tint = nearestPaletteToken(Number(ov.tint), palFamily);
  if (ov.storeys != null) out.storeys = ov.storeys;
  if (ov.bays != null) out.bays = ov.bays;
  if (ov.windowTint != null) out.windowTint = nearestTrimToken(Number(ov.windowTint));
  if (ov.doorTint != null) out.doorTint = nearestTrimToken(Number(ov.doorTint));
  if (ov.corniceTint != null) out.corniceColor = nearestTrimToken(Number(ov.corniceTint));
  if (ov.fireEscapeColor != null) out.fireEscapeColor = nearestTrimToken(Number(ov.fireEscapeColor));
  if (ov.hasCornice != null) out.hasCornice = ov.hasCornice;
  if (ov.doorAwning != null) out.doorAwning = ov.doorAwning;
  if (ov.doorAlign != null) out.doorAlign = ov.doorAlign;
  if (ov.hasStoop != null) out.hasStoop = ov.hasStoop;
  if (ov.storefrontAwning != null) {
    out.storefrontAwning = typeof ov.storefrontAwning === "string"
      ? Number(ov.storefrontAwning)
      : ov.storefrontAwning;
  }
  if (ov.fireEscape != null) out.fireEscape = ov.fireEscape;
  return out;
}
