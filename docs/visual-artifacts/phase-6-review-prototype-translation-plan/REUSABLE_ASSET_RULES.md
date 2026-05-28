# Reusable Asset Rules

Status: Rules for the next constrained prototype batch  
Scope: Review-only prototype guidance, not production pipeline approval

## What Can Be Extracted Conceptually

The following Phase 6 families can guide implementation:

- Facade archetypes: narrow service bay, two-bay retail pair, compact corner/kiosk edge.
- Sign-band placements: painted lintel, blade sign, awning-integrated sign.
- Awning families: striped cloth, short canopy, compact edge canopy.
- Entry/display rhythms: single service entry, paired retail entries, roll gate, display window, corner hatch.
- Street-prop clusters: planter, bike/bike rack, trash can, mailbox/utility box, sandwich board, lamp/pole/bollard.
- Texture systems: posters, stickers, wall glyphs, awning marks, surface wear.
- Marker/card/UI systems: default marker, hover marker, selected marker, selected outline, tether endpoint, compact selected card, hover card, compact controls, compact place index.

## What Can Be Recombined

For review-only prototype behavior, recombination can happen at the level of target identity and overlay treatment:

- Assign different marker states to different fictional storefront targets.
- Use the selected outline to hug one storefront/module area at a time.
- Attach a compact card to the selected target with a slim tether.
- Use compact controls and an optional place index as product-facing UI, not QA UI.
- Use fictional-safe labels only.

For visual world art, recombination should remain reference-driven:

- Use an approved raster/reference image or Phase 6 raster output as the primary world plate.
- Do not synthesize new storefronts in code.
- Do not convert the kit into CSS/SVG scene parts.

## What Must Remain Raster / Reference Driven

These must not be approximated with code-drawn shapes in the next prototype batch:

- storefront facades
- awnings
- sign bands
- display windows
- roll gates
- brick texture
- sidewalk/curb texture
- posters/stickers/glyph surface texture
- street props as primary visual evidence
- full street-slice world art

The prototype may use HTML/CSS/SVG only for overlay roles:

- invisible hit regions
- marker icons
- selected outline masks or borders
- tethers
- place cards
- compact controls
- place-index UI
- review-only screenshot labels if explicitly allowed

## What Must Not Be Approximated In Code / SVG

Do not code-draw:

- generic storefronts
- generic isometric building blocks
- facade shells
- new shop rows
- prop clusters as primary art
- fake modular assets that are lower fidelity than the approved corpus
- beige QA panels as normal product UI

Do not use SVG/code drawing as a substitute for missing raster/reference evidence.

## What Requires User Review Before Implementation

Before any future implementation batch goes beyond the narrow next prototype pass, Batu/ChatGPT review is required for:

- separated raster asset extraction
- production asset naming
- production asset storage
- public module/interface boundaries
- hotspot coordinate data model
- place-card data model
- real business/place copy
- exact addresses
- exact facade or station geometry
- routing, live data, backend, CMS, persistence, analytics, deployment, or CI
- any new renderer or map system
- any new visual language, palette, marker family, card family, or UI metaphor

## Safe Rule For The Next Batch

Use Phase 6 as a visual and behavioral constraint set. Do not treat it as an asset library.

One copied review-only raster plate plus carefully aligned product-facing overlays is the right next step.
