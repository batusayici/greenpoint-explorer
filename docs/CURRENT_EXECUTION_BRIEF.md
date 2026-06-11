# Current Execution Brief - 4M-R10G Franklin Corner Frontage Wrap Fix

Status: `4M-R10G Franklin Corner Frontage Wrap Fix` is implemented with saved review screenshots and stopped for Batu visual review. R10G is not approved for GLB assessment.

Current executable batch: none. Next implementation is pending Batu review of R10G corner-wrap visual correctness.

Completed/latest milestone: `4M-R10G Franklin Corner Frontage Wrap Fix`.

Pre-authorized queue: none.

Self-advance allowed: no.

Hard Batu gate: stopped after R10G edge-level frontage wrap implementation. Do not self-open GLB assessment, GLB tuning, new GLB ingestion, hero-kit tuning, R11, R12, Manhattan work, production mode, facade polish, materials, asset fidelity, or production visual-system work.

## Completed Outcome

R10G preserves the R10B/R10F target mapping and corrected R10E Franklin-local scene frame:

- `Sereneco` -> BIN `3337033`.
- `Premier Organic / Franklin Organic` -> BIN `3322608`.
- `Sonny's Corner` -> BIN `3064811`.
- Source-footprint-based placement remains the correction basis.
- Normal mode remains protected.
- The R10 GLB binding remains blocked from assessment.

R10G changes the rendered Franklin QA proof from building-level single-front facade assignment to edge-level frontage segments:

- Added QA-only `Franklin Wrap` / `franklin_rendered_wrap_truth` mode.
- Added Greenpoint frontage, Franklin frontage, corner-wrap, and side-return records per target.
- Rendered active facade modules on both Greenpoint and Franklin source-footprint edges.
- Added physical corner-wrap modules at the shared Greenpoint/Franklin corner condition.
- Added compact frontage highlights for Greenpoint, Franklin, and corner wrap segments.
- Kept corridor clutter and old stylized target bodies suppressed in this focus view.
- Recorded Sereneco's larger source footprint as muted context so the active low-rise corner frontage remains visually distinct.

The QA business labels used during this reconciliation are placement/frontage-review labels only. They are not normal-mode, production, exact tenant, storefront, frontage, entrance, signage, address, material, active-status, or public/product claims.

## Objective

Make Premier / Franklin Organic, Sonny's Corner, and Sereneco read as corner buildings with evidence-traceable active frontage on both Greenpoint Ave and Franklin Ave where supported, before any GLB comparison, fidelity assessment, R11/R12 work, Manhattan work, production mode, facade polish, materials, or asset-fidelity work resumes.

## Allowed Scope

- Franklin / Greenpoint Ave QA-only corner frontage wrap correctness only.
- Existing source-backed footprint/manifest/cue records only.
- Existing R10E Franklin-local scene frame.
- Existing R10F rendered-truth facade cue profiles.
- Edge-level frontage fixture and verifier coverage.
- `Franklin Wrap` QA mode showing actual rendered buildings, footprint outlines, frontage segment highlights, Greenpoint/Franklin street slabs, and compact labels.
- Required execution-control docs and one narrow report.

## Blocked Scope

- Target BIN remapping or intersection placement changes unless new evidence proves the current mapping wrong.
- GLB assessment, GLB tuning, new GLB ingestion, or GLB fidelity judgment.
- R11 comparison, R12 standardization, hero-kit tuning, Manhattan implementation, production mode, facade polish, material polish, asset fidelity, or broader visual-system work.
- PBR registry, texture atlas, UV mapping, Cesium, 3D Tiles, source expansion, new dependencies, production assets, normal-mode exposure, public UI, public/product claims, business/storefront linkage, exact storefront/frontage/entrance/signage/address/tenant/material/active-status claims, or broader renderer architecture changes.

## Success Criteria

- Premier, Sonny's, and Sereneco remain correctly placed at Franklin x Greenpoint.
- Each target shows active frontage on both Greenpoint and Franklin where supported by evidence.
- Facades visibly wrap corners instead of stopping at one face.
- Franklin-facing sides are no longer blank.
- Sereneco remains distinct from the larger context building.
- The scene reads correctly with labels minimized.
- Batu can identify the corner conditions from screenshots or live browser review without opening Google Maps.
- Verifier fails if a corner target lacks active Greenpoint frontage, active Franklin frontage, a corner-wrap segment, preserved placement, or the Sereneco context-mass distinction.

## Verification Completed For R10G

- `node scripts/verify-phase-4m-r10g-franklin-corner-frontage-wrap.mjs`
- `node scripts/verify-phase-4m-r10g-visual-approval-readiness.mjs`
- `npm run build`

Review artifacts:

- `src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10g-corner-frontage-wrap.v0.1.json`
- `scripts/verify-phase-4m-r10g-franklin-corner-frontage-wrap.mjs`
- `scripts/verify-phase-4m-r10g-visual-approval-readiness.mjs`
- `vite.config.js` dev-only `/__r10g-capture` screenshot endpoint
- `docs/reports/phase-4m-r10g-franklin-corner-frontage-wrap.md`

Screenshot capture status: captured. Local Playwright/Chrome, localhost shell access, and desktop capture are blocked by sandbox/display permissions in this thread, so the saved R10G screenshots were generated through the browser-side `r10gCapture=1` path and copied into `docs/review-screenshots/phase-4m-r10g-franklin-corner-frontage-wrap/`. Do not treat R10G as visually approved until Batu reviews the saved screenshots or live browser.

Build note: Vite continues to report the expected large chunk/asset warning from directly importing the approximately 46 MB QA GLB. This remains non-blocking for the R10 QA spike and should be considered during any later R11/R12 asset strategy review.
