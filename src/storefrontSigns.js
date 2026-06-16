// src/storefrontSigns.js
// Pure, Node-runnable sign-planning module (no Three.js). Decides which sign
// idioms each storefront bay gets and their face-local parameters. See
// docs/superpowers/specs/2026-06-16-storefront-sign-system-design.md.

// OSM category tag -> default sign label for UNCLAIMED storefronts. Signs never
// show a real business name unless that business is claimed (the monetization
// mechanic): unclaimed = generic, truthful-by-construction, and the product hook.
const CATEGORY_LABELS = {
  bar: "Bar",
  pub: "Bar",
  hairdresser: "Barbershop",
  barber: "Barbershop",
  cafe: "Café",
  deli: "Deli",
  restaurant: "Restaurant",
  convenience: "Corner Store",
  clothes: "Clothing",
  interior_decoration: "Home & Decor",
};

export function categoryLabel(category) {
  return CATEGORY_LABELS[category] ?? "Shop";
}

// Food/drink trades that conventionally carry a projecting fabric awning. These
// bays get the awning-valance idiom: a name on the vertical valance skirt, which
// faces the street and so reads front-on at the fixed iso angles (where the
// coplanar wall band foreshortens to an edge). Other trades keep the flat strip.
const FOOD_TRADES = new Set(["cafe", "deli", "restaurant", "convenience"]);

export function isFoodTrade(category) {
  return FOOD_TRADES.has(category);
}

// Resolve the text shown on a bay's sign: real brand only when claimed AND a
// brandName is present; otherwise the generic category label. Never the raw
// roster name for an unclaimed bay.
export function resolveSignLabel(bay) {
  if (bay && bay.claimed && bay.brandName) return bay.brandName;
  return categoryLabel(bay && bay.category);
}

// Plan all sign placements for the bays of a single building.
// Returns face-local placement descriptors; the renderer maps them to world
// geometry. `bays` are the storefront bays assigned to one building (sharing a
// bin); `storeys` is that building's floor count.
export function planStorefrontSigns({ bays, storeys }) {
  const baysPerBin = Math.max(1, bays.length);
  const gy = 1 / Math.max(1, storeys); // one storey as a fraction of total height
  const placements = [];

  for (const bay of bays) {
    const cx = ((bay.slotIndex ?? 0) + 0.5) / baysPerBin;
    const width = Math.min(0.4, 0.9 / baysPerBin);
    const label = resolveSignLabel(bay);
    const claimed = Boolean(bay.claimed && bay.brandName);

    // Baseline: a raised band on the upper portion of the ground storey.
    placements.push({
      kind: "band",
      bayName: bay.name,
      label,
      claimed,
      cx,
      width,
      y0: gy * 0.55,
      y1: gy * 0.90,
      off: 0.02,
    });

    if (isFoodTrade(bay.category)) {
      // Projecting canopy with a vertical valance carrying the name. The valance
      // is perpendicular to the wall band, so whichever iso angle flattens the
      // band shows the valance front-on (the legibility win). yWall > yDrop >
      // yValance: the canopy slopes from the wall down to a front lip, then the
      // valance hangs below it.
      placements.push({
        kind: "awning",
        variant: "canopy",
        bayName: bay.name,
        label,
        claimed,
        category: bay.category,
        cx,
        width,
        yWall: gy * 0.50,
        yDrop: gy * 0.42,
        yValance: gy * 0.30,
        projectionM: 0.9,
      });
    } else {
      // Non-food: the legacy flat coplanar tint strip just below the band.
      placements.push({
        kind: "awning",
        variant: "flat",
        bayName: bay.name,
        category: bay.category,
        cx,
        width,
        y0: gy * 0.42,
        y1: gy * 0.50,
        off: 0.025,
      });
    }
  }

  return placements;
}
