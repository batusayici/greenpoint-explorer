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

// Resolve the text shown on a bay's sign: real brand only when claimed AND a
// brandName is present; otherwise the generic category label. Never the raw
// roster name for an unclaimed bay.
export function resolveSignLabel(bay) {
  if (bay && bay.claimed && bay.brandName) return bay.brandName;
  return categoryLabel(bay && bay.category);
}

// "Loud trades" earn a projecting blade sign — the idiom that actually beats
// iso occlusion (perpendicular to the wall, so a face catches every angle).
// Category-gated to ~1-in-4 shops so the block reads varied, not cluttered.
const LOUD_TRADES = new Set(["bar", "pub", "hairdresser", "barber"]);

// Plan all sign placements for the bays of a single building.
// Returns face-local placement descriptors; the renderer maps them to world
// geometry. `bays` are the storefront bays assigned to one building (sharing a
// bin); `storeys` is that building's floor count.
export function planStorefrontSigns({ bays, storeys }) {
  const baysPerBin = Math.max(1, bays.length);
  const gy = 1 / Math.max(1, storeys); // one storey as a fraction of total height
  const placements = [];

  for (const bay of bays) {
    const cx = (bay.slotIndex + 0.5) / baysPerBin;
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

    if (LOUD_TRADES.has(bay.category)) {
      placements.push({
        kind: "blade",
        bayName: bay.name,
        label,
        claimed,
        cx,
        mountY: gy * 0.78,        // high on the ground storey
        panelHeightFrac: gy * 0.34,
        projectMeters: 1.1,       // real-world blade reach; renderer * scale
        off: 0.02,
      });
    }
  }

  return placements;
}
