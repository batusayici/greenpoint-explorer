# Phase 4M-R10F Franklin Rendered Building + Facade/Frontage Truth Pass

Status: In progress for Batu visual review after solid-render correction  
Date: 2026-06-10

## Scope

R10F is a QA-only rendered-building/frontage truth pass. It stops R11 comparison, R12 standardization, GLB assessment, new GLB ingestion, asset polish, Manhattan work, and production mode until Batu reviews the corrected rendered Franklin scene.

## Root-Cause Update

| Symptom | Likely root cause | Responsible file / function / record | Fix | Proof |
| --- | --- | --- | --- | --- |
| R10E showed correct source-projected bodies/frontage ribbons, but not rendered facade modules in that frame. | R10E intentionally solved scene geometry before facade/frontage rendering. | `src/Phase4BRuntimePreview.jsx:addFranklinSceneTruthOverlay` | Added `Franklin Rendered` QA mode that keeps the R10E Franklin-local frame and attaches rendered facade modules to source frontage edges. | R10F verifier and top-down/oblique screenshots. |
| Premier had the strongest R8/R9/R10 hero/facade path, while Sereneco and Sonny's cue modules did not read in the corrected scene frame. | Existing evidence-informed cue profiles were authored for the older runtime slot layout. | `src/data/facade-cues/...phase-4e-evidence-informed-qa-facade-cues.v0.1.json` | Re-render all three cue profiles from source footprints in the R10E projection basis. | R10F frontage screenshots and cue-record checks. |
| First R10F rendered-truth pass still read as ghosted boxes. | The runtime state updater was treating `franklinRenderedTruthBuilding` and `franklinRenderedTruthFacade` as transparent QA overlay roles. | `src/Phase4BRuntimePreview.jsx:updateObjectStates` | Split rendered building/facade roles from overlay roles, force solid materials/depth write, and render segmented storefront modules from the existing evidence cue profiles. | Build passes; verifier now checks the solid-material branch. |

## Evidence Mapping

| Target | BIN / object ID | Expected map position | Expected frontage | Evidence images | Rendered module | Validation |
| --- | --- | --- | --- | --- | --- | --- |
| Sereneco | `3337033` / `p4b-object-nyc-footprint-bin-3337033` | Northwest/across Franklin; north of Greenpoint | Greenpoint Ave, south-facing edge | `franklin-northwest1.jpeg`, `franklin-northwest2.jpeg` | `p4e1-franklin-weathered-brick-glass-base` | Low weathered brick, wide glass/wood base, cafe frontage cues render on the north-side source footprint facing south toward Greenpoint. |
| Premier Organic / Franklin Organic | `3322608` / `p4b-object-nyc-footprint-bin-3322608` | Southwest/across Franklin; south of Greenpoint | Greenpoint Ave, north-facing edge | `franklin-southwest-wide.jpeg`, `franklin-southwest-zoom.jpeg` | `p4e1-franklin-red-brick-cornice-corner` | Red brick, cornice, grocery sign band, dark canopy, and storefront rhythm render on the southwest source footprint facing north toward Greenpoint. |
| Sonny's Corner | `3064811` / `p4b-object-nyc-footprint-bin-3064811` | Southeast/corridor side; south of Greenpoint | Greenpoint Ave, north-facing edge | `franklin-southeast-wide.jpeg`, `franklin-southeast-zoom.jpeg` | `p4e1-franklin-dark-brick-awned-base` | Dark brick, black awning/base, row-window rhythm, and corner frontage cues render on the southeast source footprint facing north toward Greenpoint. |

## Rendered Placement / Frontage Validation

- The R10B/R10E target BIN mapping is preserved.
- The R10E Franklin-local WGS84 projection is preserved.
- Each rendered building uses its source footprint as the placement base; no lateral visual offset is used.
- Each facade plane is attached to the nearest Greenpoint-facing source footprint edge.
- Greenpoint Ave and the bounded review-only Franklin Ave slab remain visible as control geometry.
- Footprint outlines and yellow frontage highlights remain visible over the rendered modules.
- Labels are secondary and lowered; they are not the proof mechanism.

## Match Statement

The rendered modules match the map screenshots at the review-truth level: Sereneco is northwest/across Franklin and north of Greenpoint, Premier/Franklin Organic is southwest/across Franklin and south of Greenpoint, and Sonny's is southeast/corridor-side and south of Greenpoint.

The facade treatments are traceable to supplied reference images and existing Phase 4E cue records. They are evidence-informed QA modules, not exact facade reproductions, production assets, exact storefront/frontage claims, exact signage claims, entrance claims, active-status claims, or normal-mode renderings.

## Remaining Gaps Before GLB Assessment

- Batu must visually approve that the rendered bodies/frontage faces now read as the correct Franklin x Greenpoint businesses before GLB assessment can open.
- Franklin Ave remains a bounded review-only derived street slab because the current source packet lacks a Franklin Ave centerline.
- Exact storefront order, entrance location, sign text, facade material, active business status, and production asset direction remain blocked.

## Artifacts

- Top-down rendered truth view: `docs/review-screenshots/phase-4m-r10f-franklin-rendered-building-frontage-truth/franklin-rendered-truth-top-down-r10f.png`
- Oblique rendered truth view: `docs/review-screenshots/phase-4m-r10f-franklin-rendered-building-frontage-truth/franklin-rendered-truth-oblique-r10f.png`
- Sereneco/Premier frontage-facing view: `docs/review-screenshots/phase-4m-r10f-franklin-rendered-building-frontage-truth/franklin-rendered-truth-frontage-across-r10f.png`
- Sonny southeast/corridor-side view: `docs/review-screenshots/phase-4m-r10f-franklin-rendered-building-frontage-truth/franklin-rendered-truth-sonny-r10f.png`

## Verification

- `node scripts/verify-phase-4m-r10f-franklin-rendered-building-frontage-truth.mjs`
- `node scripts/verify-phase-4m-r10e-franklin-scene-geometry-root-cause.mjs`
- `node scripts/verify-phase-4m-r10c-r10d-franklin-map-truth.mjs`
- `node scripts/verify-phase-4m-r10b-franklin-spatial-reconciliation.mjs`
- `node scripts/verify-phase-4m-r10a-franklin-placement-fix.mjs`
- `node scripts/verify-phase-4m-r10-franklin-hero-asset-ingestion-spike.mjs`
- `node scripts/verify-phase-4m-r9-franklin-high-recognition-detail-modules.mjs`
- `node scripts/verify-phase-4m-r8-franklin-facade-record-assembly.mjs`
- `npm run build`
- `git diff --check`

## Review Gate

Stop for Batu visual review before R11, R12, GLB assessment, GLB tuning, asset polish, Manhattan work, production mode, facade polish, materials, or public/product claims.
