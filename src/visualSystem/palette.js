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
// Element [0] is the family DEFAULT (used when no tint override is set) and is
// pinned by buildKitFacadeParams tests — keep it first. Appended tones widen the
// authoring/snapping gamut; every added value is already a sanctioned token
// elsewhere in this module (BRICK_TONES / heroes / TYPOLOGY_PALETTE / II_PALETTE.
// context / MASSING), so the per-family set stays no-miss and material-plausible.
export const MATERIAL_WALL_TONES = {
  brick: [
    0xb5664a, 0x9c5a3c, 0x7d5a44, 0x6f4a39, // original spread
    0xa8704f, 0xc07a55, // BRICK_TONES — lighter terracotta + bright warm brick
    0xa04432, 0xa85a3c, // heroes premier-franklin / 144-franklin red-brick + terracotta
    0x4a4039, // heroes sonnys-corner — dark brick
    0x9a7e58, // heroes sereneco — weathered buff brick
    0xb89a7e, // TYPOLOGY_PALETTE typological.brick — light buff
  ],
  // clapboard / painted-masonry / modern-flat carry LIGHT painted-facade tones
  // (Greenpoint has many pale-painted rowhouses) alongside the darker stains —
  // muted, paper-adjacent II-C values so a light building stays in-palette.
  clapboard: [
    0xe2dcc9, 0xd6dccf, 0xc7cfd2, 0xd8c8a4, 0xc8c2b2, 0x9a9c86, 0x6f7a6a, 0x4a4f44, // original spread
    0xd9cdb4, 0xcfc0a6, // II_PALETTE.context — warm pale paint
    0xc7b896, // MASSING.parapet — warm cream
  ],
  brownstone: [
    0x8a5a3c, 0x6f4632, 0x5a3a28, // original spread
    0x7d5a44, // brick/brown crossover — mid chocolate
    0x6b5e52, // MASSING.partyWallBlend — warm brown-grey
    0x4a3a2c, // FACADE_RELIEF.joineryCheek — deep brown
  ],
  "painted-masonry": [
    0xe6dfce, 0xd8d2c0, 0xc8c2b2, 0xa8a090, 0x7c766a, 0x46443f, // original spread
    0xb4a890, // TYPOLOGY_PALETTE typological.commercial — greige
    0xd9cdb4, // II_PALETTE.context — warm pale
    0xc7b896, // MASSING.parapet — warm cream
  ],
  "modern-flat": [
    0xdad3c4, 0xcabfa7, 0x968b78, 0x46443f, 0x1d201e, // original spread
    0xb8ae99, // II_PALETTE.concrete — pale concrete
    0x6f6a60, // II_PALETTE.asphalt — neutral mid-grey
  ],
  warehouse: [
    0x968b78, 0x7d5a44, 0x5a564c, 0x2a241c, // original spread
    0x6b5e52, // MASSING.partyWallBlend — warm brown-grey
    0x5a3a28, // dark brown — stained timber/industrial brick
  ],
};

// Per-building TRIM tones (window frame/sash + door leaf) for frontage facade
// truth. Independent of wall tone: a maroon-brick building can carry black trim.
// All are inked II-C values (never pure #000/#fff). The truth editor snaps a
// sampled pixel to the nearest of these; genuinely-new trims are appended here
// as a deliberate commit, keeping the no-miss rule intact.
export const TRIM_TONES = [
  0x1d1a16, // near-black inked (dark painted trim — the "black" frame/door)
  0xe2dcc9, // off-white (white-painted sash/cornice; lighter than the cream below)
  0xcdbfa6, // warm cream (light painted trim; == MASSING.transomBand)
  0x2e3b32, // forest green (== bar awning tint)
  0x6b2f28, // oxblood / barn red
  0x3f4650, // slate blue-grey
  0x8a8270, // warm mid-grey (greige painted trim)
  0x4a3a2c, // dark stained wood (== FACADE_RELIEF.joineryCheek family)
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
