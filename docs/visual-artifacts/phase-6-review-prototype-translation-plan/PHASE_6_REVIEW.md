# Phase 6 Review

Status: Critical review for prototype translation  
Date: 2026-05-28

## Review Basis

This review uses the approved reference corpus and the active Phase 6 proof package:

- `docs/approved-reference-corpus/`
- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/`

It does not use `docs/archive/` as execution authority.

## Repeatability

Verdict: promising at proof scale, not proven as production repeatability.

What works:

- The Phase 6 system map identifies plausible reusable families: facade archetypes, sign bands, awnings, entries, windows, roll gates, sidewalk modules, props, glyphs, marker states, card states, compact controls, and place-index patterns.
- The asset kit covers the right breadth for a first reusable system: 3 facade archetypes, 3 awnings, 3 sign bands, 3 entry types, 3 display types, 6 street props, 5 marker states, 3 card variants, compact controls, index pattern, and QA separation.
- The recombination rules correctly emphasize varying multiple dimensions together: shell, sign, awning, openings, props, and glyph identity.

Critical limits:

- Most kit items are not separately exported. They are visible inside composed PNG proofs, not available as actual reusable implementation parts.
- There are no masks, sprite sheets, transparent layers, hotspot coordinates, anchor points, or z-order rules.
- Repeatability is visual and conceptual, not yet mechanical.
- Sign bands and prop clusters still risk repetition if implemented literally.

## Visual Fidelity

Verdict: fidelity remains anchored to the approved raster direction, but the implementation path must not flatten it.

What works:

- The rules preserve Inked Indie hand-inked linework, controlled hatching, warm muted palette, brick/sidewalk texture, storefront specificity, and compact isometric map-mode composition.
- The proof stays aligned with corpus entries for storefront modules, recombination, street-slice scale, and UI/card/marker behavior.

Critical limits:

- The proof-board framing used for some outputs is appropriate for review but should not be translated into product UI.
- Generated micro-text, numeric-looking marks, and glyphs remain non-product placeholders.
- A future source/app implementation could easily lose fidelity if it rebuilds storefronts with CSS, SVG, DOM nodes, or canvas primitives.

## Reuse Potential

Verdict: strong enough to guide a constrained prototype, not strong enough to define a production pipeline.

Safe reuse potential:

- Reuse the Phase 6 families as visual rules for overlays and target placement.
- Use a Phase 6 raster output as the primary world plate for the next prototype pass.
- Translate marker, selected outline, tether, compact card, compact controls, and place-index patterns into HTML/CSS overlay behavior if anchored to a raster world.

Not yet safe:

- Treating the asset kit as a public module taxonomy.
- Building a generated storefront factory.
- Extracting exact production parts without a later raster separation pass.
- Using generated labels as place data or product copy.

## Prototype-Readiness

Verdict: ready for one narrow review-only integration pass.

The next prototype batch can test whether the approved raster visual direction survives inside the interactive shell while preserving existing interactions. It should not attempt broad coverage, production data, route systems, or production-grade assetization.

The right prototype test is:

- one raster scene plate
- 3-5 fictional-safe interactive targets
- existing pan/zoom and pointer/tap behavior preserved
- selected marker, selected outline, tether, card, compact controls, and optional compact index styled from Phase 6 rules
- review screenshots for desktop overview, hover/focus, selected state, mobile containment, and pan/zoom stress

## Risk Of Reverting To SVG / Code-Drawn Generic Work

Verdict: high unless explicitly blocked.

Why the risk is high:

- The Phase 6 package is a system proof, and system proofs can tempt implementation into redrawing storefront parts as simplified code shapes.
- The kit is not separated into production-ready raster layers, so a future implementer may reach for CSS/SVG primitives to fill gaps.
- Existing UI overlay work can drift toward beige QA panels if product-facing and review-only UI are not separated.

Required guardrail:

The next implementation batch must use approved raster/reference assets or copied review-only Phase 6 raster output as the primary visual world surface. Code may place interaction overlays, cards, tethers, controls, markers, and hit regions. Code must not draw the storefront world.

## Bottom Line

Phase 6 is good enough to justify a constrained prototype integration pass.

It is not good enough to justify production-pipeline planning, broad map coverage, real-place cards, production asset extraction, or public module/interface approval.
