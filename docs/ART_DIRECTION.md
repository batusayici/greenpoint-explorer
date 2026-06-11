# Art Direction — II-C Inked Indie Visual System

Status: Approved primary look
Date: 2026-06-11 (supersedes the 2026-05-28 version; full history in git)
Owner: Batu

## The Look

Hand-inked editorial illustration for an isometric storefront map: confident linework, controlled hatching, muted warm color, paper texture, local street specificity, and UI clarity.

The II-C system board defines:

1. **Palette** — primary (warm neutrals, brick red, teal, green, slate), accent/signal (coral, marigold, mint, rose), neutrals
2. **Line weights** — 4px heavy → 1px hairline + broken/dry
3. **Hatching density** — light/medium/dense + cross-hatch
4. **Paper & shadows** — paper grain, soft/hard edge, cast shadow, ambient occlusion as drawn shapes
5. **Building & storefront library** — brick facades, awnings, sign bands, doors/entries, roll gates, windows/glass
6. **Sidewalk & street props** — slabs, curbs, tree pits, planters, bike racks, benches, mailboxes, newspaper boxes
7. **Signage & local texture** — street signs, wheatpaste posters, stickers/decals
8. **Map marker states** — default/hover/selected/unavailable/unknown
9. **Place cards** — paper caption panels with tether connections
10. **Icons, type** — inked icon set; confident headline/subhead/body/label hierarchy
11. **Density & clarity rules** — clear zone (low density, reserved for UI/circulation), normal zone, high-texture zone (focal areas only)
12. **UI integration** — UI elements designed not pasted; cards/markers clearer than the world but sharing line/color logic; map readability preserved at small sizes

## Reference Corpus

Active references (style anchors for all generation and in-engine work):

- System board: II-C Inked Indie Visual System (supplied by Batu; keep a copy in `docs/reference/`)
- `docs/archive/visual-artifacts/batch-15-raster-production-proof/generated/II-assembled-mini-scene.png`
- `docs/archive/visual-artifacts/batch-15-raster-production-proof/generated/II-life-integration-crop.png`
- `docs/archive/visual-artifacts/phase-3-5-production-system-proof/generated/example-a-narrow-fictional-service-bay.png` (+ examples b, c)
- `docs/archive/visual-artifacts/phase-3-8-fidelity-recovery-multi-module-stress-test/generated/shared-layer-system-board.png` (+ derivative-comparison, constrained-recombination, multi-module-finished-reads boards)
- `docs/archive/visual-artifacts/phase-3-9-map-scale-integration-test/generated/map-scale-street-slice.png`, `hover-card-ui-pressure-test.png`, `zoom-readability-crop.png`
- `docs/archive/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/inked-indie-compact-corner-style-frame-revision-a.png`
- Approved reference corpus index: `docs/reference/approved-reference-corpus/`

## Fallback Look

The Premier Organic benchmark image (GPT-5.5 render from a reference photo) defines the fallback fidelity/look if II-C proves infeasible in-engine. The fallback decision happens at the Phase 2 gate (`docs/PLAN.md`) — not by drift.

## Standing Rules

- **Real-faithful supersedes fictional-safe** (2026-06-11): real business names, signage, and likenesses are the goal. Heroes exact, infill typological.
- Readability over decoration: entrances, markers, hover/selected states, and cards must stay legible at review size; texture frames click targets, never camouflages them.
- Exterior map mode only: facades, sidewalks, corners, signage, street furniture, markers, cards. No interiors or cutaways.
- Density zones are enforced: max detail only in focal areas; open surfaces stay quiet for UI and circulation.
- Environment carries the personality — storefront rhythm, street furniture, signage, surface texture, authored local detail.
- The modular kit strategy stands: repeatable authored parts carrying local specificity through combination, material rules, signage treatment, and chosen hero details — not bespoke modeling for every building.
