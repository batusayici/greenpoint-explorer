import assert from "node:assert";
import { classifyBuilding } from "../src/buildingTypology.js";

let passed = 0;
function check(name, fn) { fn(); passed++; console.log("ok -", name); }

// 1-story commercial taxpayer with PLUTO commercial area → commercial-storefront + commercial ground floor
check("taxpayer commercial", () => {
  const t = classifyBuilding({ sourceProperties: { heightRoof: "18", numFloors: 1, yearBuilt: 1955, bldgClass: "K1", landUse: "05", comArea: 4000, resArea: 0 } });
  assert.equal(t.massingClass, "taxpayer");
  assert.equal(t.materialFamily, "commercial-storefront");
  assert.equal(t.groundFloorUse, "commercial");
  assert.equal(t.storeyCount, 1);
  assert.equal(t.confidence.storeyCount, "source-backed");
});

// Pre-war 3-story residential rowhouse → brick-prewar, residential ground floor
check("prewar rowhouse", () => {
  const t = classifyBuilding({ sourceProperties: { heightRoof: "34", numFloors: 3, yearBuilt: 1910, bldgClass: "C0", landUse: "01", comArea: 0, resArea: 3000 } });
  assert.equal(t.massingClass, "rowhouse");
  assert.equal(t.materialFamily, "brick-prewar");
  assert.equal(t.groundFloorUse, "residential");
});

// 5-story mixed-use walkup, ground commercial (landUse "04") → walkup + commercial ground floor
check("mixed-use walkup", () => {
  const t = classifyBuilding({ sourceProperties: { heightRoof: "52", numFloors: 5, yearBuilt: 1925, bldgClass: "S5", landUse: "04", comArea: 1200, resArea: 5000 } });
  assert.equal(t.massingClass, "walkup");
  assert.equal(t.groundFloorUse, "commercial");
});

// landUse without leading zero ("5") still reads commercial
check("landUse no leading zero", () => {
  const t = classifyBuilding({ sourceProperties: { heightRoof: "20", numFloors: 1, yearBuilt: 1960, bldgClass: "K2", landUse: "5", comArea: 0, resArea: 0 } });
  assert.equal(t.groundFloorUse, "commercial");
});

// Vacant land (landUse "11") is NOT commercial
check("vacant not commercial", () => {
  const t = classifyBuilding({ sourceProperties: { heightRoof: "0", numFloors: null, yearBuilt: null, bldgClass: null, landUse: "11", comArea: 0, resArea: 0 } });
  assert.equal(t.groundFloorUse, "residential");
});

// No PLUTO floors → estimate from heightRoof, mark estimated
check("height fallback", () => {
  const t = classifyBuilding({ sourceProperties: { heightRoof: "40", numFloors: null, yearBuilt: null, bldgClass: null, landUse: null, comArea: null, resArea: null } });
  assert.equal(t.storeyCount, 4); // round(40/10)
  assert.equal(t.confidence.storeyCount, "estimated");
  assert.equal(t.confidence.materialFamily, "fallback");
});

// No height at all → fallback storeyCount 2
check("total fallback", () => {
  const t = classifyBuilding({ sourceProperties: {} });
  assert.equal(t.storeyCount, 2);
  assert.equal(t.confidence.storeyCount, "fallback");
});

console.log(`\n${passed}/7 typology checks passed`);
