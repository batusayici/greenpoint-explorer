/**
 * storefrontRoster.js
 * Pure assignment module — no Three.js / React / DOM dependencies.
 *
 * assignStorefronts(buildings, roster, { axis }) -> bays[]
 *
 * Assignment rules:
 *  1. Only commercial buildings with a frontage are eligible.
 *  2. Address-backed storefronts (numeric houseNumber) assigned first,
 *     sorted ascending by house number; nearest building by |houseNumberHint - n|.
 *  3. Point-only storefronts (no numeric houseNumber, but has scenePoint)
 *     assigned by Euclidean distance to frontage.scenePoint.
 *  4. Unplaceable (no houseNumber AND no scenePoint) → skipped.
 *  5. slotIndex: 0-based per building; confidence "overflow" for slots > 0.
 */

/** @param {string|number|null|undefined} h */
function num(h) {
  const n = parseInt(h, 10);
  return Number.isFinite(n) ? n : null;
}

/** Euclidean distance between two {x,z} points */
function dist2(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * @param {Array<{bin:string, groundFloorUse:string, frontage:{houseNumberHint?:number, scenePoint?:{x:number,z:number}}}>} buildings
 * @param {Array<{name:string, category?:string, houseNumber?:string|null, scenePoint?:{x:number,z:number}|null, sourceId?:string|null, confidence?:string, activeStatus?:string}>} roster
 * @param {{ axis: string }} _opts
 * @returns {Array<{bin:string, name:string, category:string, slotIndex:number, sourceId:string|null, confidence:string, activeStatus:string}>}
 */
export function assignStorefronts(buildings, roster, _opts) {
  // Step 1: filter to commercial buildings with a frontage
  const commercial = buildings.filter(
    (b) => b.groundFloorUse === "commercial" && b.frontage != null
  );
  if (commercial.length === 0) return [];

  // Track per-building slot counts
  const slotMap = new Map(); // bin -> nextSlotIndex

  function allocateSlot(bin, ownConfidence) {
    const idx = slotMap.get(bin) ?? 0;
    slotMap.set(bin, idx + 1);
    return { slotIndex: idx, confidence: idx === 0 ? ownConfidence : "overflow" };
  }

  const bays = [];

  // Step 2: partition roster
  const addressBacked = roster
    .filter((s) => num(s.houseNumber) !== null)
    .sort((a, b) => num(a.houseNumber) - num(b.houseNumber));

  const pointOnly = roster.filter((s) => num(s.houseNumber) === null);

  // Assign address-backed storefronts
  for (const storefront of addressBacked) {
    const n = num(storefront.houseNumber);
    // nearest by |houseNumberHint - n|
    let best = null;
    let bestDiff = Infinity;
    for (const bldg of commercial) {
      const diff = Math.abs((bldg.frontage.houseNumberHint ?? 0) - n);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = bldg;
      }
    }
    if (!best) continue;

    const { slotIndex, confidence } = allocateSlot(best.bin, storefront.confidence ?? "address-backed");
    bays.push({
      bin: best.bin,
      name: storefront.name,
      category: storefront.category ?? "unknown",
      slotIndex,
      sourceId: storefront.sourceId ?? null,
      confidence,
      activeStatus: storefront.activeStatus ?? "unverified",
    });
  }

  // Assign point-only storefronts
  for (const storefront of pointOnly) {
    // Skip if unplaceable
    if (!storefront.scenePoint) continue;

    // Nearest by Euclidean distance to frontage.scenePoint
    let best = null;
    let bestDist = Infinity;
    for (const bldg of commercial) {
      if (!bldg.frontage.scenePoint) continue;
      const d = dist2(storefront.scenePoint, bldg.frontage.scenePoint);
      if (d < bestDist) {
        bestDist = d;
        best = bldg;
      }
    }
    if (!best) continue;

    const { slotIndex, confidence } = allocateSlot(best.bin, storefront.confidence ?? "point-only");
    bays.push({
      bin: best.bin,
      name: storefront.name,
      category: storefront.category ?? "unknown",
      slotIndex,
      sourceId: storefront.sourceId ?? null,
      confidence,
      activeStatus: storefront.activeStatus ?? "unverified",
    });
  }

  return bays;
}
