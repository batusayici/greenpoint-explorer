// scripts/probe-b1-ground-geometry.mjs
// Measurement-first: project the street centerlines, the real sidewalkLineRecords,
// and the hero footprints into the R10E scene frame and print them, so
// groundLayer.js is built against measured truth (project rule: register to the
// render, don't author coords from a contract).
// Run: node scripts/probe-b1-ground-geometry.mjs
import fs from "node:fs";
import { createProjection } from "../src/sceneFrame.js";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const geometry = read("src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json");
const fixture = read("src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json");

const basis = fixture.sceneTruthModel.projectionBasis;
const projection = createProjection(basis);
const axis = (a) => {
  const w = projection.project(a.westPointWgs84);
  const e = projection.project(a.eastPointWgs84);
  const v = { x: e.x - w.x, z: e.z - w.z };
  const len = Math.hypot(v.x, v.z) || 1;
  return { x: v.x / len, z: v.z / len };
};
const gp = axis(basis.greenpointAxisWgs84);
const fr = { x: -gp.z, z: gp.x };
const round = (p) => ({ x: +p.x.toFixed(3), z: +p.z.toFixed(3) });
const offsetAlong = (p, unit) => +(p.x * unit.x + p.z * unit.z).toFixed(3);

console.log("greenpointAxis", round(gp), "franklinAxis", round(fr));

console.log("\n== streetCenterlineRecords ==");
for (const r of geometry.streetCenterlineRecords ?? []) {
  const line = r.wgs84Line.map((pt) => projection.project(pt));
  console.log(r.fullStreetName, "width(ft)=" + r.streetWidth, "ends", round(line[0]), "→", round(line.at(-1)));
}

console.log("\n== sidewalkLineRecords (real curb truth) ==");
for (const r of geometry.sidewalkLineRecords ?? []) {
  const line = r.wgs84Line.map((pt) => projection.project(pt));
  const mid = { x: (line[0].x + line.at(-1).x) / 2, z: (line[0].z + line.at(-1).z) / 2 };
  // perpendicular offset from each street's centerline tells us which curb side this is
  const perpForGp = fr; // Greenpoint roadbed is bounded along the Franklin axis
  const perpForFr = gp; // Franklin roadbed is bounded along the Greenpoint axis
  console.log(
    r.fullStreetName,
    "ends", round(line[0]), "→", round(line.at(-1)),
    "| offset·franklinAxis=", offsetAlong(mid, perpForGp),
    "offset·greenpointAxis=", offsetAlong(mid, perpForFr),
    "| status", r.geometryStatus,
  );
}
