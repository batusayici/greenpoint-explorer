// Phase 6.2.1 — Scene color token module (single source of truth).
//
// Every 3D scene color lives here as a named token. Nothing in the render path
// may use a raw 0x/hex literal; it must resolve to a token below. The
// conformance gate (6.2.3) enforces this against `src`.
//
// This module is Node-importable and zero-dependency so verifiers and the kit
// can read the same tokens the renderer does. UI/DOM chrome uses a parallel
// CSS-variable registry (see src/styles.css), not this module.
//
// All values are sourced from the II-C palette tile (docs/ART_DIRECTION.md).
// "palette is a no-miss": out-of-token color is a hard miss.

export const II_PALETTE = {
  paper: 0xeae1ce,
  street: 0xcabfa7,
  streetDerived: 0xc4b9a2,
  asphalt: 0x6f6a60,
  asphaltDerived: 0x6a655c,
  concrete: 0xb8ae99,
  concreteDerived: 0xb2a994,
  crosswalkPaint: 0xe7dcc2,
  curbStone: 0xcabfa7,
  scoreLine: 0x9b9079,
  signalPole: 0x2a241c,
  signalHead: 0x1d201e,
  signalRed: 0xb24a3a,
  signalAmber: 0xcc9a3b,
  signalGreen: 0x4f7d52,
  pedSignal: 0x26211a,
  ink: 0x2a241c,
  // Fire-escape ironwork (Phase 8.0). Neutral warm-charcoal near-black so the
  // members read as iron, not painted wood; deck a hair lifted so its edge reads.
  fireEscapeIron: 0x161413,
  fireEscapeIronDeck: 0x201c1a,
  context: [0xd9cdb4, 0xcfc0a6, 0xd4c5ad, 0xc8bba4],
  heroes: {
    "premier-franklin-organic": 0xa04432, // red brick grocery corner
    "sonnys-corner": 0x4a4039, // dark brick / awned base
    sereneco: 0x9a7e58, // weathered brick, low restaurant corner
    "144-franklin": 0xa85a3c, // 1895 Romanesque Revival, terracotta/red brick
  },
};

// Material-family wall tones for data-differentiated typological infill (II-C muted).
export const TYPOLOGY_PALETTE = {
  "typological.brick": 0xb89a7e,
  "typological.painted": 0xc8c2b2,
  "typological.commercial": 0xb4a890,
  "typological.warehouse": 0x968b78,
};

// Phase 7.4 — color-binding candidate sets. Per material family, the in-palette
// wall tones a building's TRUE color may snap to. nearestPaletteToken (colorBinding.js)
// picks the closest of these; every entry is already a no-miss palette tone, so
// snapping can never leave the palette. Spec-only: NOT applied by the renderer (Phase 8).
// Tonal-ramp helpers — broaden the authoring gamut with lighter + darker shades
// while staying inside the II-C warm range: lighter shades lerp toward PAPER,
// darker toward INK (never pure #fff/#000). Generated shades are palette tokens
// by construction (defined in this module), so the truth-editor pickers stay
// no-miss. Pure + deterministic; computed once at module load.
const TONE_PAPER = 0xece3cf; // II-C lightest (warm paper)
const TONE_INK = 0x1d1a16; // II-C darkest (warm near-black)
const _ch = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255];
const _mix = (a, b, t) => {
  const [ar, ag, ab] = _ch(a);
  const [br, bg, bb] = _ch(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
};
// Per hue anchor → [+2 lighter, anchor, +2 darker]. Two lift/shade steps each so
// every material spans a broad, evenly-stepped light→dark range.
const _shades = (anchor) => [
  _mix(anchor, TONE_PAPER, 0.42),
  _mix(anchor, TONE_PAPER, 0.21),
  anchor,
  _mix(anchor, TONE_INK, 0.3),
  _mix(anchor, TONE_INK, 0.58),
];
// Build a family ramp from hue anchors. anchors[0]'s true value is pushed first
// so element [0] stays the family DEFAULT (buildKitFacadeParams uses tones[0]);
// remaining slots are each anchor's light→dark shades, exact-deduped.
const _ramp = (anchors) => {
  const out = [];
  const seen = new Set();
  const push = (v) => { if (!seen.has(v)) { seen.add(v); out.push(v); } };
  push(anchors[0]);
  for (const a of anchors) for (const s of _shades(a)) push(s);
  return out;
};

// Phase 7.4 / Phase 8 — per-family wall-tone gamut. Each family is a broad
// light→dark ramp generated from real II-C material hue anchors; nearestPaletteToken
// snaps a building's true color to the closest, and the ?facadeedit=1 facade picker
// shows the same set. anchors[0] is the family default (== element [0]).
export const MATERIAL_WALL_TONES = {
  // warm red → terracotta → brown, each lifted toward paper and shaded toward ink
  brick: _ramp([0xb5664a, 0xa85a3c, 0x7d5a44]),
  // pale painted facades (cream, sage) through to a dark muted green stain
  clapboard: _ramp([0xe2dcc9, 0x9a9c86, 0x6f7a6a]),
  // chocolate brownstone range
  brownstone: _ramp([0x8a5a3c, 0x6f4632]),
  // painted masonry: cream → greige → taupe
  "painted-masonry": _ramp([0xe6dfce, 0xa8a090, 0x7c766a]),
  // neutral modern: light warm-grey → mid grey → charcoal
  "modern-flat": _ramp([0xdad3c4, 0x968b78, 0x46443f]),
  // industrial: warm grey, brick-brown, charcoal
  warehouse: _ramp([0x968b78, 0x7d5a44, 0x5a564c]),
};

// Per-building TRIM tones (window frame/sash + door leaf + cornice) for frontage
// facade truth. Independent of wall tone: a maroon-brick building can carry black
// trim. All are inked II-C values (never pure #000/#fff). A neutral warm spine
// (off-white → near-black) plus four accent hues, each with light / mid / dark
// shades, gives the ?facadeedit=1 window/door/cornice pickers a broad selection.
// Invariant: 0x1d1a16 is the single darkest token (lowest luminance) so a near-
// black sample resolves there; keep any new accent dark lighter than it.
export const TRIM_TONES = [
  // neutral warm spine — off-white → near-black
  0xe2dcc9, // off-white (white-painted sash/cornice)
  0xcdbfa6, // warm cream (== MASSING.transomBand)
  0x8a8270, // warm mid-grey (greige painted trim)
  0x57504a, // deep warm taupe
  0x2a241c, // near-black brown (== MASSING.awningDefault family)
  0x1d1a16, // near-black inked — DARKEST (the "black" frame/door)
  // forest green — light / mid / dark
  0x6f7a6a, 0x4f5b48, 0x2e3b32,
  // oxblood / barn red — light / mid / dark
  0x9a6258, 0x6b2f28, 0x4a2622,
  // slate blue-grey — light / mid / dark
  0x6b7480, 0x3f4650, 0x2a313a,
  // stained wood — light / mid / dark (mid == FACADE_RELIEF.joineryCheek)
  0x8a6f54, 0x4a3a2c, 0x352c22,
];

// Phase 7.3 — typological roof TONE per family (flat + quiet, multi-angle-safe).
// NOT detailed roofs — a tone the four-angle camera can show without noise.
// Darker/cooler than walls; sits in the MASSING.roofCap family.
export const ROOF_TONES = {
  brick: 0x46443f,
  clapboard: 0x4a4f44,
  brownstone: 0x3f3a33,
  "painted-masonry": 0x4a473f,
  "modern-flat": 0x3a3a36,
  warehouse: 0x3c3a34,
};

// Bridge the buildingTypology.classifyBuilding vocabulary (brick-prewar,
// commercial-storefront, …) onto the canonical ROOF_TONES family keys.
const ROOF_FAMILY_ALIAS = {
  "brick-prewar": "brick",
  "commercial-storefront": "brick", // 1-storey taxpayers: quiet dark tar roof
  painted: "painted-masonry",
};

// Resolve a flat, quiet roof tone for any material family — accepts both the
// canonical ROOF_TONES keys and the classifyBuilding vocabulary. Safe default:
// brick (the Greenpoint massing default, == MASSING.roofCap), so an unknown or
// missing family never produces a bright slab.
export function roofToneFor(family) {
  const key = ROOF_FAMILY_ALIAS[family] ?? family;
  return ROOF_TONES[key] ?? ROOF_TONES.brick;
}

export function resolveTypologyColor(typology) {
  return TYPOLOGY_PALETTE[typology?.palette] ?? II_PALETTE.context[0];
}

// Structured-relief tones (facadeAssembly): drawn-shadow language for recessed
// reveals and proud joinery. Dark lintel, mid jambs, lit sill; dark returns
// under awnings and at the crown lip. Never bright white.
export const FACADE_RELIEF = {
  lintelShadow: 0x352c22, // shadow under the lintel / bay roof
  jamb: 0x5d4c3e, // window/door jamb (side reveal)
  sillLit: 0xa6987c, // recess bottom / proud top — lit stone
  soffit: 0x2f2820, // underside of storefront/awning/cornice returns
  joineryCheek: 0x4a3a2c, // dark wood bay cheeks
  darkReturn: 0x241f18, // awning underside / near-black painted crown lip
};

// Scene lighting tints (warm paper-lit key + ambient fill).
export const LIGHTING = {
  ambient: 0xfff6e8,
  sun: 0xffeed8,
};

// Category fabric tints for awnings (muted II-C tones). Shared by the flat
// strip and the projecting canopy/valance.
export const TRADE_AWNING_TINT = {
  restaurant: 0x6b3a2a,
  cafe: 0x4a3825,
  bar: 0x2e3b32,
  pub: 0x2e3b32,
  clothes: 0x3b4a5c,
  hairdresser: 0x3d4030,
  convenience: 0x4a4030,
  deli: 0x5c4030,
  interior_decoration: 0x4a3b4a,
};

// Massing/shading tones used by the typological wall + roof pass.
export const MASSING = {
  partyWallBlend: 0x6b5e52, // lerp target for composite party-wall faces
  roofCap: 0x46443f, // neutral dark inked roof cap
  parapet: 0xc7b896, // parapet lip
  transomBand: 0xcdbfa6, // light storefront transom band
  signBoardDefault: 0x2c3530, // default storefront sign board
  awningDefault: 0x2a2622, // fallback awning fabric
};

// Brick-tone spread for the inked typological cluster (warm/oxblood family).
export const BRICK_TONES = [0xb5664a, 0x7d5a44, 0x9c5a3c, 0xa8704f, 0x6f4a39, 0xc07a55];

// Dev-only debug overlays (not part of the Scene product look).
export const DEBUG_PALETTE = {
  rectOutline: 0x00ff44, // bright green facade-rect debug outline
};
