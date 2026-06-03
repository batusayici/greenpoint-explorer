# Phase 2DTR-7 - Fixture-To-Blueprint Scene Layout Validation

Status: Complete for Batu review
Date: 2026-06-03
Scope: Review-only deterministic layout blueprint, not polished raster art or production/public exact geometry

## Purpose

Phase 2DTR-6 showed that a polished isometric raster can look strong, but it did not prove that the Phase 2DTR-5 structured fixture controls the scene. This packet creates the missing bridge:

```text
DTR-5 structured fixture -> DTR-7 deterministic blueprint -> later styled raster
```

No AI image generation, polished raster generation, texture, lighting, color styling, source scraping, Google/Street View/3D Tiles extraction, app source edits, package/tooling changes, or production/public exact-geometry claims were used.

## Dirty State Reconciliation

Before this batch, the repository already had one dirty visual artifact:

- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`

It is not part of DTR-7 and was intentionally left untouched rather than restored or committed. The validation report records this as a pre-existing dirty file so the state is explicit.

## Deliverables

- `generate-fixture-blueprint.mjs` - Packet-local deterministic generator.
- `generated/fixture-blueprint.svg` - Black-and-white layout blueprint generated from the Phase 2DTR-5 fixture.
- `generated/blueprint-validation-report.json` - Machine-readable validation report.

No PNG was generated. The SVG is the primary artifact because it preserves exact fixture coordinates and is inspectable as deterministic layout output.

## What The Blueprint Proves

- The Phase 2DTR-5 fixture can render all five targets into one shared 1672 x 941 review-coordinate frame.
- Storefront order is explicit and matches the fixture: NW Grillpoint Deli, NE McDonald's, SW Dunkin', SE Citizens Bank, and Greenpoint G station.
- Storefront bounds, building mass bounds, frontage segments, sign panels, entrance bounds, window bounds, address cue anchors, and the subway cue center/radius are all drawn from fixture fields.
- Unsupported or blocked claims are omitted from the blueprint and listed in the validation report.
- The subway cue is represented as one fixture-controlled cue, avoiding the DTR-6 problem of multiple ambiguous G markers.
- Address cues are rendered as anchor crosses, not as generated text, avoiding the DTR-6 Dunkin 993/893 text error.

## What The Blueprint Does Not Prove

- It does not prove a polished or art-directed final raster.
- It does not prove exact public/product geometry, exact station geometry, or exact address projection.
- It does not prove source-backed road, curb, sidewalk, crosswalk, lane, or curb-cut geometry.
- It does not prove automatic facade parsing from reference photos.
- It does not prove deterministic styled facade rendering rules.

## Sufficiency Verdict

The fixture is sufficient to drive this deterministic target blueprint.

The fixture is not yet sufficient to drive the next styled raster attempt without another structured corrective batch. The biggest gap is that road/intersection layout is currently derived from gaps between building masses, because the fixture does not contain explicit street, curb, sidewalk, crosswalk, lane, or curb-cut primitives.

## Exact Corrective Deltas Before Another Styled Raster

Phase 2DTR-8 should be: Fixture Geometry Primitive Completion For Styled Raster Readiness.

Required deltas:

- Add explicit deterministic street/intersection primitives: Manhattan Ave road band, Greenpoint Ave road band, curbs, sidewalks, crosswalks, and corner curb cuts.
- Add render-order and occlusion rules for building mass, storefront bounds, sign panels, entrances, windows, address anchors, and the subway cue.
- Decide whether address labels render inside the styled raster or only in QA annotations.
- Keep one primary Greenpoint G cue in the fixture, or mark any additional cues as symbolic/non-primary before styling.
- Add a blueprint-to-styled-raster adapter that consumes geometry primitives directly instead of relying on prose prompt interpretation.

## Self-Audit

- Intended decision: Batu can judge whether the DTR-5 fixture controls layout before another styled raster attempt.
- Fidelity level: Level 1 diagram/blockout.
- Required output format: SVG.
- SVG status: Allowed because this is a deterministic layout QA blueprint, not a high-fidelity art-direction raster.
- Visual evidence: The SVG shows coordinate axes, road bands, corner zones, target labels, storefront/building/sign/entrance/window/frontage/address/subway geometry, and review-only status.
- Truth handling: Unsupported claims are omitted from the drawing and listed in the validation report.
- Missing fidelity: No art direction, facade material, lighting, texture, or reference-photo styling is tested here.
- Pass/fail: Pass for layout validation; blocked for styled raster until DTR-8 fills explicit street/intersection primitives and render rules.
