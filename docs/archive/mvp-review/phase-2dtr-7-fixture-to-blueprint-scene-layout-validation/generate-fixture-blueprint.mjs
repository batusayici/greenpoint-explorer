#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(packetDir, "../../..");
const outputDirArgIndex = process.argv.indexOf("--output-dir");
const outputDirArg = outputDirArgIndex >= 0 ? process.argv[outputDirArgIndex + 1] : null;
const inputFixturePath = path.join(
  repoRoot,
  "docs/mvp-review/phase-2dtr-5-exact-review-geometry-fixture-to-raster-prompt-adapter/generated/exact-review-geometry-fixture.json"
);
const canonicalGeneratedDir = path.join(packetDir, "generated");
const generatedDir = outputDirArg ? path.resolve(outputDirArg) : canonicalGeneratedDir;
const svgPath = path.join(generatedDir, "fixture-blueprint.svg");
const reportPath = path.join(generatedDir, "blueprint-validation-report.json");
const canonicalSvgPath = path.join(canonicalGeneratedDir, "fixture-blueprint.svg");

const fixture = JSON.parse(fs.readFileSync(inputFixturePath, "utf8"));
const width = fixture.coordinateSystem.pixelSize.width;
const height = fixture.coordinateSystem.pixelSize.height;

fs.mkdirSync(generatedDir, { recursive: true });

const storefrontRequired = [
  "buildingMassBounds",
  "frontageSegment",
  "storefrontBounds",
  "storefrontOrder",
  "signPanelBounds",
  "entranceBounds",
  "windowBounds",
  "addressAnchorPoint",
];
const transitRequired = [
  "cueCenter",
  "cueRadius",
  "entranceCueBounds",
  "addressAnchorPoint",
  "storefrontOrder",
  "facadeFrontageWindowEntrance",
];

function fieldValue(field) {
  return field && Object.prototype.hasOwnProperty.call(field, "value") ? field.value : field;
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function rectAttrs(rect) {
  return `x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}"`;
}

function inFramePoint(point) {
  return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
}

function inFrameRect(rect) {
  return rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= width && rect.y + rect.height <= height;
}

function pointInRect(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}

function lineInFrame(line) {
  return inFramePoint(line.from) && inFramePoint(line.to);
}

function targetLabel(target) {
  return target.targetId === "greenpoint-g-subway" ? "Greenpoint G station" : target.reviewLabel;
}

const targets = fixture.targets;
const buildingRects = targets
  .map((target) => fieldValue(target.geometry?.buildingMassBounds))
  .filter(Boolean);
const northBottom = Math.max(
  ...targets
    .filter((target) => target.cornerId === "corner-nw" || target.cornerId === "corner-ne")
    .map((target) => {
      const rect = fieldValue(target.geometry.buildingMassBounds);
      return rect.y + rect.height;
    })
);
const southTop = Math.min(
  ...targets
    .filter((target) => target.cornerId === "corner-sw" || target.cornerId === "corner-se")
    .map((target) => fieldValue(target.geometry.buildingMassBounds).y)
);
const westRight = Math.max(
  ...targets
    .filter((target) => target.cornerId === "corner-nw" || target.cornerId === "corner-sw")
    .map((target) => {
      const rect = fieldValue(target.geometry.buildingMassBounds);
      return rect.x + rect.width;
    })
);
const eastLeft = Math.min(
  ...targets
    .filter((target) => target.cornerId === "corner-ne" || target.cornerId === "corner-se")
    .map((target) => fieldValue(target.geometry.buildingMassBounds).x)
);

const greenpointRoad = { x: 0, y: northBottom, width, height: southTop - northBottom };
const manhattanRoad = { x: westRight, y: 0, width: eastLeft - westRight, height };
const cornerZones = [
  { id: "corner-nw", label: "NW", rect: { x: 0, y: 0, width: westRight, height: northBottom } },
  { id: "corner-ne", label: "NE", rect: { x: eastLeft, y: 0, width: width - eastLeft, height: northBottom } },
  { id: "corner-sw", label: "SW", rect: { x: 0, y: southTop, width: westRight, height: height - southTop } },
  { id: "corner-se", label: "SE", rect: { x: eastLeft, y: southTop, width: width - eastLeft, height: height - southTop } },
];

const reportTargets = [];
const coordinateIssues = [];

for (const target of targets) {
  const required = target.renderingKind === "symbolic_transit" ? transitRequired : storefrontRequired;
  const missingGeometryFields = required.filter((key) => !target.geometry || !target.geometry[key]);
  const renderedGeometryFields = required.filter((key) => target.geometry && target.geometry[key]);
  const issues = [];

  const geometry = target.geometry || {};
  const buildingMassBounds = fieldValue(geometry.buildingMassBounds);
  const storefrontBounds = fieldValue(geometry.storefrontBounds);
  const signPanelBounds = fieldValue(geometry.signPanelBounds);
  const entranceBounds = fieldValue(geometry.entranceBounds);
  const windowBounds = fieldValue(geometry.windowBounds);
  const frontageSegment = fieldValue(geometry.frontageSegment);
  const addressAnchorPoint = fieldValue(geometry.addressAnchorPoint);
  const cueCenter = fieldValue(geometry.cueCenter);
  const cueRadius = fieldValue(geometry.cueRadius);
  const entranceCueBounds = fieldValue(geometry.entranceCueBounds);

  for (const [name, rect] of [
    ["buildingMassBounds", buildingMassBounds],
    ["storefrontBounds", storefrontBounds],
    ["signPanelBounds", signPanelBounds],
    ["entranceBounds", entranceBounds],
    ["entranceCueBounds", entranceCueBounds],
  ]) {
    if (rect && !inFrameRect(rect)) issues.push(`${name} is outside the ${width}x${height} review frame.`);
  }

  if (Array.isArray(windowBounds)) {
    for (const [index, rect] of windowBounds.entries()) {
      if (!inFrameRect(rect)) issues.push(`windowBounds[${index}] is outside the ${width}x${height} review frame.`);
    }
  }

  if (frontageSegment && !lineInFrame(frontageSegment)) {
    issues.push("frontageSegment is outside the review frame.");
  }

  if (addressAnchorPoint && !inFramePoint(addressAnchorPoint)) {
    issues.push("addressAnchorPoint is outside the review frame.");
  }

  if (cueCenter && !inFramePoint(cueCenter)) {
    issues.push("cueCenter is outside the review frame.");
  }

  if (cueCenter && cueRadius && entranceCueBounds && !pointInRect(cueCenter, entranceCueBounds)) {
    issues.push("cueCenter is not inside entranceCueBounds.");
  }

  if (target.renderingKind === "storefront" && storefrontBounds && addressAnchorPoint && !pointInRect(addressAnchorPoint, storefrontBounds)) {
    issues.push("addressAnchorPoint is not inside storefrontBounds.");
  }

  if (issues.length) {
    coordinateIssues.push({ targetId: target.targetId, issues });
  }

  reportTargets.push({
    targetId: target.targetId,
    label: targetLabel(target),
    renderingKind: target.renderingKind,
    cornerId: target.cornerId,
    rendered: missingGeometryFields.length === 0,
    renderedGeometryFields,
    missingGeometryFields,
    unsupportedOrBlockedClaimsOmitted: target.unsupportedFields || [],
    coordinateIssues: issues,
  });
}

const targetOrder = targets.map((target) => ({
  targetId: target.targetId,
  label: targetLabel(target),
  drawOrder: target.drawOrder,
  cornerId: target.cornerId,
}));

const allLabels = targets.map(targetLabel);
const allRendered = reportTargets.every((target) => target.rendered);
const obviousLayoutInconsistencies = [
  ...coordinateIssues,
  {
    scope: "intersection-road-layout",
    issues: [
      "Road/intersection bands are derived deterministically from gaps between fixture buildingMassBounds, because the fixture does not yet include explicit road, curb, lane, or crosswalk geometry fields.",
    ],
  },
];

const report = {
  schemaVersion: "phase-2dtr-7-blueprint-validation-report.v0.1",
  artifactId: "phase-2dtr-7.fixture-to-blueprint-scene-layout-validation",
  status: "review-only-deterministic-blueprint",
  generatedOn: "2026-06-03",
  inputFixture: path.relative(repoRoot, inputFixturePath),
  generatedArtifacts: {
    svg: path.relative(repoRoot, canonicalSvgPath),
  },
  coordinateSystem: fixture.coordinateSystem,
  dirtyPreExistingFileState: {
    path: "docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png",
    status: "pre-existing dirty file intentionally left untouched; not part of DTR-7 commit scope",
  },
  targetSummary: {
    fixtureTargetCount: targets.length,
    renderedTargetCount: reportTargets.length,
    allFixtureTargetsRendered: allRendered,
    targetOrder,
  },
  renderedTargets: reportTargets,
  omittedUnsupportedOrBlockedClaims: reportTargets.flatMap((target) =>
    target.unsupportedOrBlockedClaimsOmitted.map((claim) => ({
      targetId: target.targetId,
      label: target.label,
      claim,
      treatment: "omitted from blueprint as unsupported/blocked; not drawn as a scene claim",
    }))
  ),
  derivedLayout: {
    greenpointAveRoadBand: greenpointRoad,
    manhattanAveRoadBand: manhattanRoad,
    cornerZones,
    derivation: "Road bands and corner zones are derived from fixture buildingMassBounds gaps only; they validate coordinate-space relationship but are not source-backed street geometry.",
  },
  obviousCoordinateOrLayoutInconsistencies: obviousLayoutInconsistencies,
  sufficiencyAssessment: {
    sufficientForDeterministicBlueprint: allRendered && coordinateIssues.length === 0,
    sufficientForNextStyledRaster: false,
    reasonsBlockingStyledRaster: [
      "Fixture lacks explicit road, curb, lane, crosswalk, sidewalk, and street-grid geometry fields.",
      "Fixture contains review-coordinate facade fields, but not deterministic facade-generation rules for styled raster rendering.",
      "Unsupported automatic photo parsing, frontage/order measurement, exact address projection, and exact station geometry remain omitted.",
    ],
    exactCorrectiveDeltasBeforeStyledRaster: [
      "Add explicit deterministic street/intersection primitives: road bands, curbs, sidewalks, crosswalks, and corner curb cuts.",
      "Add render-order and occlusion rules for building mass, storefront bounds, sign panels, entrances, windows, and subway cue overlays.",
      "Decide whether address labels render in-scene or only in QA annotations to avoid generated text errors like the DTR-6 Dunkin 993/893 mismatch.",
      "Keep a single Greenpoint G cue in the fixture or mark any extra cues as symbolic/non-primary before raster styling.",
      "Create a blueprint-to-styled-raster adapter that consumes geometry primitives directly instead of relying on prose prompt interpretation.",
    ],
  },
};

const svg = [];
svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Phase 2DTR-7 deterministic fixture blueprint">`);
svg.push(`<title>Phase 2DTR-7 Fixture-To-Blueprint Scene Layout Validation</title>`);
svg.push(`<desc>Black-and-white deterministic SVG generated from the Phase 2DTR-5 exact review geometry fixture. Review-only; not production or public exact geometry.</desc>`);
svg.push(`<defs>
  <pattern id="diagonal-hatch" width="12" height="12" patternUnits="userSpaceOnUse">
    <path d="M-2 12 L12 -2 M4 16 L16 4" stroke="#000" stroke-width="1"/>
  </pattern>
  <marker id="frontage-dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
    <circle cx="3" cy="3" r="2.5" fill="#000"/>
  </marker>
</defs>`);
svg.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>`);
svg.push(`<rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#000" stroke-width="2"/>`);

for (let x = 0; x <= width; x += 100) {
  svg.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#000" stroke-width="0.5" stroke-dasharray="2 8"/>`);
  svg.push(`<text x="${x + 4}" y="16" font-family="monospace" font-size="12" fill="#000">${x}</text>`);
}
for (let y = 0; y <= height; y += 100) {
  svg.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#000" stroke-width="0.5" stroke-dasharray="2 8"/>`);
  svg.push(`<text x="4" y="${y + 14}" font-family="monospace" font-size="12" fill="#000">${y}</text>`);
}

svg.push(`<rect ${rectAttrs(greenpointRoad)} fill="none" stroke="#000" stroke-width="4"/>`);
svg.push(`<rect ${rectAttrs(manhattanRoad)} fill="none" stroke="#000" stroke-width="4"/>`);
svg.push(`<text x="${width / 2 - 110}" y="${greenpointRoad.y + greenpointRoad.height / 2 + 8}" font-family="monospace" font-size="28" font-weight="700" fill="#000">GREENPOINT AVE</text>`);
svg.push(`<text x="${manhattanRoad.x + manhattanRoad.width / 2 - 10}" y="230" font-family="monospace" font-size="28" font-weight="700" fill="#000" transform="rotate(90 ${manhattanRoad.x + manhattanRoad.width / 2} 230)">MANHATTAN AVE</text>`);

for (const zone of cornerZones) {
  svg.push(`<rect ${rectAttrs(zone.rect)} fill="none" stroke="#000" stroke-width="2" stroke-dasharray="12 8"/>`);
  svg.push(`<text x="${zone.rect.x + 16}" y="${zone.rect.y + 34}" font-family="monospace" font-size="28" font-weight="700" fill="#000">${zone.label}</text>`);
}

svg.push(`<text x="32" y="${height - 76}" font-family="monospace" font-size="28" font-weight="700" fill="#000">PHASE 2DTR-7 FIXTURE BLUEPRINT</text>`);
svg.push(`<text x="32" y="${height - 44}" font-family="monospace" font-size="18" fill="#000">REVIEW ONLY - DETERMINISTIC SVG FROM DTR-5 JSON - NOT PRODUCTION OR PUBLIC EXACT GEOMETRY</text>`);
svg.push(`<text x="${width - 420}" y="${height - 44}" font-family="monospace" font-size="16" fill="#000">Coordinate frame: ${width} x ${height}</text>`);

for (const target of targets) {
  const geometry = target.geometry || {};
  const label = targetLabel(target);
  const buildingMassBounds = fieldValue(geometry.buildingMassBounds);
  const storefrontBounds = fieldValue(geometry.storefrontBounds);
  const signPanelBounds = fieldValue(geometry.signPanelBounds);
  const entranceBounds = fieldValue(geometry.entranceBounds);
  const windowBounds = fieldValue(geometry.windowBounds);
  const frontageSegment = fieldValue(geometry.frontageSegment);
  const addressAnchorPoint = fieldValue(geometry.addressAnchorPoint);
  const cueCenter = fieldValue(geometry.cueCenter);
  const cueRadius = fieldValue(geometry.cueRadius);
  const entranceCueBounds = fieldValue(geometry.entranceCueBounds);

  if (buildingMassBounds) {
    svg.push(`<rect ${rectAttrs(buildingMassBounds)} fill="url(#diagonal-hatch)" stroke="#000" stroke-width="3"/>`);
    svg.push(`<text x="${buildingMassBounds.x + 8}" y="${buildingMassBounds.y + 24}" font-family="monospace" font-size="18" font-weight="700" fill="#000">${esc(label)} buildingMass</text>`);
  }

  if (storefrontBounds) {
    svg.push(`<rect ${rectAttrs(storefrontBounds)} fill="#fff" stroke="#000" stroke-width="5"/>`);
    svg.push(`<text x="${storefrontBounds.x + 6}" y="${storefrontBounds.y - 10}" font-family="monospace" font-size="20" font-weight="700" fill="#000">${esc(label)}</text>`);
  }

  if (frontageSegment) {
    svg.push(`<line x1="${frontageSegment.from.x}" y1="${frontageSegment.from.y}" x2="${frontageSegment.to.x}" y2="${frontageSegment.to.y}" stroke="#000" stroke-width="8" marker-start="url(#frontage-dot)" marker-end="url(#frontage-dot)"/>`);
    svg.push(`<text x="${frontageSegment.from.x}" y="${frontageSegment.from.y - 8}" font-family="monospace" font-size="14" fill="#000">frontage</text>`);
  }

  if (signPanelBounds) {
    svg.push(`<rect ${rectAttrs(signPanelBounds)} fill="#fff" stroke="#000" stroke-width="3" stroke-dasharray="8 5"/>`);
    svg.push(`<text x="${signPanelBounds.x + 5}" y="${signPanelBounds.y + Math.min(20, signPanelBounds.height - 6)}" font-family="monospace" font-size="15" fill="#000">SIGN: ${esc(label)}</text>`);
  }

  if (entranceBounds) {
    svg.push(`<rect ${rectAttrs(entranceBounds)} fill="#000" stroke="#000" stroke-width="2"/>`);
    svg.push(`<text x="${entranceBounds.x - 14}" y="${entranceBounds.y + entranceBounds.height + 18}" font-family="monospace" font-size="14" fill="#000">entrance</text>`);
  }

  if (Array.isArray(windowBounds)) {
    for (const [index, rect] of windowBounds.entries()) {
      svg.push(`<rect ${rectAttrs(rect)} fill="#fff" stroke="#000" stroke-width="3"/>`);
      svg.push(`<line x1="${rect.x}" y1="${rect.y}" x2="${rect.x + rect.width}" y2="${rect.y + rect.height}" stroke="#000" stroke-width="1"/>`);
      svg.push(`<line x1="${rect.x + rect.width}" y1="${rect.y}" x2="${rect.x}" y2="${rect.y + rect.height}" stroke="#000" stroke-width="1"/>`);
      svg.push(`<text x="${rect.x}" y="${rect.y + rect.height + 14}" font-family="monospace" font-size="12" fill="#000">win ${index + 1}</text>`);
    }
  }

  if (cueCenter && cueRadius) {
    svg.push(`<circle cx="${cueCenter.x}" cy="${cueCenter.y}" r="${cueRadius}" fill="#fff" stroke="#000" stroke-width="5"/>`);
    svg.push(`<text x="${cueCenter.x - 14}" y="${cueCenter.y + 10}" font-family="monospace" font-size="32" font-weight="700" fill="#000">G</text>`);
  }

  if (entranceCueBounds) {
    svg.push(`<rect ${rectAttrs(entranceCueBounds)} fill="none" stroke="#000" stroke-width="4" stroke-dasharray="10 6"/>`);
    svg.push(`<text x="${entranceCueBounds.x + entranceCueBounds.width + 8}" y="${entranceCueBounds.y + 18}" font-family="monospace" font-size="18" font-weight="700" fill="#000">${esc(label)}</text>`);
    svg.push(`<text x="${entranceCueBounds.x + entranceCueBounds.width + 8}" y="${entranceCueBounds.y + 40}" font-family="monospace" font-size="14" fill="#000">entranceCueBounds</text>`);
  }

  if (addressAnchorPoint) {
    svg.push(`<line x1="${addressAnchorPoint.x - 12}" y1="${addressAnchorPoint.y}" x2="${addressAnchorPoint.x + 12}" y2="${addressAnchorPoint.y}" stroke="#000" stroke-width="3"/>`);
    svg.push(`<line x1="${addressAnchorPoint.x}" y1="${addressAnchorPoint.y - 12}" x2="${addressAnchorPoint.x}" y2="${addressAnchorPoint.y + 12}" stroke="#000" stroke-width="3"/>`);
    svg.push(`<circle cx="${addressAnchorPoint.x}" cy="${addressAnchorPoint.y}" r="15" fill="none" stroke="#000" stroke-width="2"/>`);
    svg.push(`<text x="${addressAnchorPoint.x + 18}" y="${addressAnchorPoint.y + 5}" font-family="monospace" font-size="14" fill="#000">address cue</text>`);
  }
}

svg.push(`<g transform="translate(${width - 470} 30)">
  <rect x="0" y="0" width="440" height="238" fill="#fff" stroke="#000" stroke-width="2"/>
  <text x="16" y="28" font-family="monospace" font-size="20" font-weight="700" fill="#000">Legend</text>
  <rect x="18" y="48" width="44" height="24" fill="url(#diagonal-hatch)" stroke="#000" stroke-width="2"/><text x="78" y="66" font-family="monospace" font-size="14" fill="#000">buildingMassBounds</text>
  <rect x="18" y="84" width="44" height="24" fill="#fff" stroke="#000" stroke-width="4"/><text x="78" y="102" font-family="monospace" font-size="14" fill="#000">storefrontBounds</text>
  <rect x="18" y="120" width="44" height="18" fill="#fff" stroke="#000" stroke-width="2" stroke-dasharray="7 4"/><text x="78" y="134" font-family="monospace" font-size="14" fill="#000">signPanelBounds</text>
  <rect x="18" y="154" width="44" height="24" fill="#000" stroke="#000" stroke-width="2"/><text x="78" y="172" font-family="monospace" font-size="14" fill="#000">entranceBounds</text>
  <line x1="18" y1="202" x2="62" y2="202" stroke="#000" stroke-width="8"/><text x="78" y="207" font-family="monospace" font-size="14" fill="#000">frontageSegment</text>
  <circle cx="40" cy="224" r="12" fill="#fff" stroke="#000" stroke-width="3"/><text x="78" y="229" font-family="monospace" font-size="14" fill="#000">address/subway cue</text>
</g>`);

svg.push(`</svg>`);

fs.writeFileSync(svgPath, svg.join("\n"));
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Wrote ${path.relative(process.cwd(), svgPath)}`);
console.log(`Wrote ${path.relative(process.cwd(), reportPath)}`);
