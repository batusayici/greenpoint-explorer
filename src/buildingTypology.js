// Pure, Node-runnable. footprint record → typology descriptor.
// Truth rule: every field is a typological INFERENCE carrying a confidence level.
const FEET_PER_STOREY = 10;

export function classifyBuilding(record) {
  const p = record?.sourceProperties ?? {};
  const confidence = {};

  // storeyCount
  let storeyCount;
  if (Number.isFinite(p.numFloors) && p.numFloors > 0) {
    storeyCount = Math.round(p.numFloors);
    confidence.storeyCount = "source-backed";
  } else {
    const h = Number.parseFloat(p.heightRoof);
    if (Number.isFinite(h) && h > 0) {
      storeyCount = Math.max(1, Math.round(h / FEET_PER_STOREY));
      confidence.storeyCount = "estimated";
    } else {
      storeyCount = 2;
      confidence.storeyCount = "fallback";
    }
  }

  // groundFloorUse — PLUTO landUse 04 (mixed res/commercial) or 05 (commercial/office).
  // landUse may arrive with or without a leading zero ("04" or "4"); normalize numerically.
  const landUseNum = Number.parseInt(p.landUse, 10);
  const commercialLandUse = Number.isFinite(landUseNum) && (landUseNum === 4 || landUseNum === 5);
  const hasComArea = Number.isFinite(p.comArea) && p.comArea > 0;
  const groundFloorUse = (commercialLandUse || hasComArea) ? "commercial" : "residential";
  confidence.groundFloorUse = (Number.isFinite(landUseNum) || hasComArea) ? "source-backed" : "fallback";

  // materialFamily
  let materialFamily;
  const cls = p.bldgClass ? String(p.bldgClass)[0].toUpperCase() : null;
  if (cls === "E" || cls === "F" || cls === "G") {
    materialFamily = "warehouse"; // warehouse / factory / garage families
    confidence.materialFamily = "source-backed";
  } else if (storeyCount === 1 && groundFloorUse === "commercial") {
    materialFamily = "commercial-storefront";
    confidence.materialFamily = "source-backed";
  } else if (Number.isFinite(p.yearBuilt) && p.yearBuilt > 0 && p.yearBuilt < 1945) {
    materialFamily = "brick-prewar";
    confidence.materialFamily = "source-backed";
  } else if (Number.isFinite(p.yearBuilt) && p.yearBuilt >= 1945) {
    materialFamily = "painted-masonry";
    confidence.materialFamily = "estimated";
  } else {
    materialFamily = "brick-prewar"; // safest Greenpoint default
    confidence.materialFamily = "fallback";
  }

  // massingClass
  let massingClass;
  if (storeyCount <= 1) massingClass = "taxpayer";
  else if (storeyCount <= 4) massingClass = "rowhouse";
  else if (storeyCount <= 6) massingClass = "walkup";
  else massingClass = "midrise";

  return { storeyCount, massingClass, materialFamily, groundFloorUse, palette: paletteFor(materialFamily), confidence };
}

// II-C palette keys per material family; the renderer resolves these to actual tones.
export function paletteFor(materialFamily) {
  switch (materialFamily) {
    case "warehouse": return "typological.warehouse";
    case "commercial-storefront": return "typological.commercial";
    case "painted-masonry": return "typological.painted";
    case "brick-prewar":
    default: return "typological.brick";
  }
}
