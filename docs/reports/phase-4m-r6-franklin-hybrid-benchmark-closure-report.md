# Phase 4M-R6 Franklin Hybrid Benchmark-Closure Report

Status: complete and verified; pending Batu visual review.

## Review Artifacts

- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/franklin-benchmark-close-r6.png`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/franklin-side-return-corner-wrap-r6.png`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/franklin-street-level-lower-oblique-r6.png`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/corridor-oblique-ghosted-r6.png`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/manhattan-close-r6-shared-renderer-check.png`

## What Changed Vs R5

- Added `endpointHeroFacadeOverrides.franklin.hybridHeroLayer` with reusable grammar family names.
- Added a Franklin-specific hybrid overlay above the R5 measured trace.
- Made the hero overlay visually dominant in Visual POC by rendering the R6 shell below higher-order final-look detail modules.
- Rebuilt the Franklin read around a fused brick mass, heavier roof/cornice/parapet, darker/taller windows, stronger AC/lintel/sill rhythm, wrapped storefront, black awning, tan sign band, broader sidewalk/curb/crosswalk grounding, and contact-shadow strips.
- Manhattan was not redesigned; it was captured only as a shared-renderer regression check.

## Visual Gap Closure Vs Benchmark

- Massing: materially improved. Franklin reads less like a narrow translucent facade panel and more like a broad, fused hero corner. Still simplified and more tower-like than the benchmark.
- Roof/cornice: materially improved. The roof box and cream cornice now create a strong silhouette. Still lacks benchmark-level ornament and weathering.
- Facade rhythm: improved. Windows are darker, heavier, and less UI-tile-like. Still too regular and too simplified compared with true brick/window cadence.
- Storefront: strongest R6 improvement. The black awning, tan band, darker glass, denser mullions, and recessed door feel now create a recognizable storefront silhouette without using real sign text.
- Side return: improved but still behind the front facade. The side wall, side windows, ACs, side storefront return, and bay/fire-escape grammar exist, but the fire escape/bay read is still too symbolic from the close cameras.
- Street grounding: improved. Broader sidewalk slab, curb/crosswalk pieces, tactile pads, pole/signal blocks, generic objects, and contact shadows now help scale the corner. The actual curb radius and street material remain simplified.
- Rendering density: improved over R5. Opaque final-look modules dominate the Franklin hero read. It remains low-poly/code-native, not benchmark-rendered art.

## Remaining Gaps

- R6 is benchmark-closer but not benchmark-level. It is still an authored primitive-mesh approximation.
- Brick texture is still represented by bands and panels, not a dense masonry material.
- Storefront lacks believable sticker/signage density and interior clutter because exact sign/logo/business claims remain blocked.
- Side fire escape and projecting bay need stronger camera-visible geometry if Franklin receives another pass.
- Sidewalk/street geometry still lacks a real curved curb return and asphalt/crosswalk texture.
- Camera/UI crop still frames the proof as a runtime review surface rather than an immersive benchmark render.

## Reusable Module Inventory

- `corner_storefront_wrap_type_a`
  - Black base, darker recessed panes, mullion grid, door-depth cue, contact shadow.
- `black_awning_canopy_type_a`
  - Thick wrapped black canopy with lower lip and side return.
- `tan_sign_band_type_a`
  - Tan/wood continuous band with small non-claim green accent block.
- `brick_window_stack_type_a`
  - Three-row dark inset window stack with lintels, sills, AC boxes, and row bands.
- `cornice_parapet_family_a`
  - Cream/stone stacked cornice, dentil ticks, roof box, and side cornice return.
- `side_return_bay_fire_escape_type_a`
  - Side brick wall, side window rhythm, AC hierarchy, projecting bay, rail/platform fire-escape cue.
- `street_grounding_kit_a`
  - Broad sidewalk slab, curb strip, crosswalk bars, tactile pads, pole/signal stack, generic boxes/bikes, and contact shadows.

## Franklin-Specific Pieces

- Franklin massing proportions and side-return placement.
- Tan/green/black grocery-corner color family.
- Current side bay/fire-escape placement.
- Current camera presets and Franklin-centered review composition.

## Recommendation

- Do not iterate Franklin again immediately unless Batu wants to chase benchmark ornament/detail inside the runtime.
- Best next move: apply the same hybrid lane to Manhattan after Batu reviews R6, using the R6 grammar as a constraint and adding only Manhattan-specific storefront/transit modules.
- Begin extracting a formal facade kit/data schema only after one more corner proves the grammar is reusable beyond Franklin.

## Verification

- `npm run build`
- Browser review and capture from `http://127.0.0.1:5174/`
- PNG/file-format check for all five R6 screenshots
- `git diff --check`
