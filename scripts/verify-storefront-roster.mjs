import assert from "node:assert";
import { assignStorefronts } from "../src/storefrontRoster.js";

let passed = 0;
function check(name, fn) { fn(); passed++; console.log("ok -", name); }

// address-backed: ordered by house number to nearest frontage hint
check("address-ordered assignment", () => {
  const buildings = [
    { bin: "A", groundFloorUse: "commercial", frontage: { houseNumberHint: 100, scenePoint: { x: 0, z: 0 } } },
    { bin: "B", groundFloorUse: "commercial", frontage: { houseNumberHint: 110, scenePoint: { x: 2, z: 0 } } },
  ];
  const roster = [
    { name: "Deli", houseNumber: "108", confidence: "address-backed" },
    { name: "Cafe", houseNumber: "101", confidence: "address-backed" },
  ];
  const bays = assignStorefronts(buildings, roster, { axis: "x" });
  assert.equal(bays.find((b) => b.name === "Cafe").bin, "A");
  assert.equal(bays.find((b) => b.name === "Deli").bin, "B");
  assert.equal(bays.find((b) => b.name === "Cafe").confidence, "address-backed");
});

// point-only: assigned to nearest frontage scenePoint
check("point-only nearest assignment", () => {
  const buildings = [
    { bin: "A", groundFloorUse: "commercial", frontage: { houseNumberHint: 100, scenePoint: { x: 0, z: 0 } } },
    { bin: "B", groundFloorUse: "commercial", frontage: { houseNumberHint: 110, scenePoint: { x: 10, z: 0 } } },
  ];
  const roster = [{ name: "Ghost Kitchen", houseNumber: null, scenePoint: { x: 9, z: 1 }, confidence: "point-only" }];
  const bays = assignStorefronts(buildings, roster, { axis: "x" });
  assert.equal(bays.length, 1);
  assert.equal(bays[0].bin, "B");
  assert.equal(bays[0].confidence, "point-only");
});

// residential-only → nothing assigned
check("no commercial frontage", () => {
  const buildings = [{ bin: "R", groundFloorUse: "residential", frontage: { houseNumberHint: 5, scenePoint: { x: 0, z: 0 } } }];
  const roster = [{ name: "Nope", houseNumber: "5", confidence: "address-backed" }];
  assert.equal(assignStorefronts(buildings, roster, { axis: "x" }).length, 0);
});

// two tenants same building → distinct slots, second is overflow
check("multi-tenant slots", () => {
  const buildings = [{ bin: "A", groundFloorUse: "commercial", frontage: { houseNumberHint: 113, scenePoint: { x: 0, z: 0 } } }];
  const roster = [
    { name: "Madeline's", houseNumber: "113", confidence: "address-backed" },
    { name: "Threes", houseNumber: "113", confidence: "address-backed" },
  ];
  const bays = assignStorefronts(buildings, roster, { axis: "x" });
  assert.equal(bays.length, 2);
  assert.ok(bays.every((b) => b.bin === "A"));
  assert.deepEqual(bays.map((b) => b.slotIndex).sort(), [0, 1]);
  assert.equal(bays.find((b) => b.slotIndex === 1).confidence, "overflow");
});

// point-only with no scenePoint and no houseNumber → skipped
check("unplaceable skipped", () => {
  const buildings = [{ bin: "A", groundFloorUse: "commercial", frontage: { houseNumberHint: 100, scenePoint: { x: 0, z: 0 } } }];
  const roster = [{ name: "Mystery", houseNumber: null, scenePoint: null, confidence: "point-only" }];
  assert.equal(assignStorefronts(buildings, roster, { axis: "x" }).length, 0);
});

console.log(`\n${passed}/5 roster checks passed`);
