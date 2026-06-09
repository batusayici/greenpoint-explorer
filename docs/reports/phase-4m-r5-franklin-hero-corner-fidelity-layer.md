# Phase 4M-R5 Franklin Hero Corner Fidelity Layer

Status: complete and verified; pending Batu visual review.

## Scope

Batch 4M-R5 continued from the existing 4M-R4 runtime scene. It added a bounded Franklin QA-only low-poly fidelity layer on top of the measured R4 trace, without creating a new scaffold, renderer, source lane, dependency, external-source workflow, production asset path, or normal-mode exposure.

The supplied benchmark image was used only for lookdev density, material readability, and low-poly hero-corner fidelity. Repo-local Franklin evidence remains the source lane for measured-trace decisions.

## Review Artifacts

- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/franklin-benchmark-close-r5.png`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/franklin-side-return-corner-wrap-r5.png`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/franklin-street-level-lower-oblique-r5.png`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/corridor-oblique-ghosted-r5.png`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/manhattan-close-r5-shared-renderer-check.png`

## What Changed

- Added `endpointHeroFacadeOverrides.franklin.heroFidelityLayer` as a structured QA-only marker for the low-poly fidelity overlay.
- Added an opaque Franklin detail layer with brick panels, relief courses, upper-window modules, lintels, sills, AC boxes, cornice/parapet modules, roof inset, black awning, tan sign band, storefront glass/door/mullion modules, side-return panels, side bay, fire-escape cue, sidewalk slab, curb/crosswalk/tactile grounding, and pole/signal/context objects.
- Added a Franklin street-level review camera.
- Reduced the older measured backing opacity for Franklin in Visual POC mode so the detail layer reads first.
- Preserved Manhattan as a lighter measured trace and captured it only as a regression check.

## Evidence-To-Render Checklist

| Item | R5 render response | Confidence |
| --- | --- | --- |
| Facade width/order | R4 measured bay ratios preserved; R5 detail modules align to the same bay spans. | Medium |
| Storefront bay rhythm | Front and side-return modules now have distinct glass/door/mullion beats rather than color strips only. | Medium |
| Door/window positions | Upper rows and lower openings align to the measured facade floors; exact positions remain approximate. | Medium |
| Sign-band heights | Tan sign band and black awning depth are stronger and tied to storefront zone height. | Medium |
| Canopy/awning spans | Black canopy reads as a projecting low-poly volume with depth; exact real span remains approximate. | Medium |
| Upper-floor rows | Three stacked rows with frames, sills, lintels, and AC boxes now dominate the upper facade. | Medium-high |
| Cornice/parapet | Roofline, cornice bands, parapet cap, and roof inset are materially stronger than R4. | Medium-high |
| Side return | Side wall depth, storefront return, panel rhythm, side windows, bay projection, and fire-escape cue are visible. | Medium |
| Material family | Red brick, tan/stone cornice, black canopy, dark storefront, and glass family are closer to the benchmark target. | Medium |
| Street grounding | Sidewalk slab, curb, crosswalk, tactile pads, pole/signal cue, and generic context objects are visible. | Medium |

## Blunt Remaining Gaps

- R5 is still a code-native low-poly reconstruction, not the benchmark image and not production art.
- Some translucent QA scaffolding remains visible by design for review context, though it is no longer the primary Franklin read.
- Exact storefront frontage, tenant/business identity, sign text/logo, address, active status, exact material, and exact entrance claims remain blocked.
- The side-return depth and fire-escape/bay cues are approximate and need stronger source-measured extraction before any exact claim.
- Street corner radius, curb geometry, pole placement, sidewalk furniture, and crosswalk alignment remain simplified review approximations.
- Manhattan did not receive an equivalent R5 detail kit; it is only a shared-renderer regression capture.
- The next fidelity jump likely needs either a narrower Franklin extraction pass or an asset/art pass after Batu chooses that direction.

## Visual Self-Audit

- Artifact class: Level 4 prototype-review runtime screenshots.
- Required format: PNG.
- SVG allowed: no.
- Result: pass for the R5 review purpose. Franklin reads from stacked masonry/window/cornice/awning/storefront/side-return/street-grounding geometry more than from labels or decorative color patches. It still does not meet production asset, exact-source, or benchmark-match fidelity.

## Verification

- `npm run build`
- Browser review on `http://127.0.0.1:5174/`
- Captured five Visual POC review screenshots.
- Converted captured files to true PNG.
