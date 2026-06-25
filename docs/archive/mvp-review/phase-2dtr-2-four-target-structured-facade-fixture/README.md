# Phase 2DTR-2 - Four-Target Structured Facade Fixture

Status: Complete for Batu review  
Date: 2026-06-03  
Scope: Review-only multi-target structured facade/source fixture

## Purpose

This packet extends the accepted Phase 2DTR-1 Grillpoint/NW source-to-raster-spec model across the current Manhattan Ave x Greenpoint Ave MVP target set:

- NW: Grillpoint Deli.
- NE: McDonald's.
- SW: Dunkin'.
- SE: Citizens Bank.
- Transit context: Greenpoint G subway, treated separately as symbolic/context-only rather than storefront frontage.

This is a review-only data-to-raster proof artifact. It does not edit app source, existing source fixtures, scripts, package files, package tooling, production assets, public interfaces, normal-mode behavior, or promotion gates.

## Outputs

- Structured multi-target fixture: `four-target-structured-facade-fixture.json`
- Deterministic raster/spec index: `generated/raster-spec-index.json`
- Visual-instruction provenance/status map: `generated/visual-instruction-provenance.json`
- Visible comparison board: `generated/four-target-structured-facade-fixture-board.png`
- MVP-29E comparison crops:
  - `generated/mvp-29e-nw-crop.png`
  - `generated/mvp-29e-ne-crop.png`
  - `generated/mvp-29e-sw-crop.png`
  - `generated/mvp-29e-se-crop.png`
- Supplied-reference previews:
  - `generated/ref-nw-grillpoint.png`
  - `generated/ref-ne-mcdonalds.png`
  - `generated/ref-sw-dunkin.png`
  - `generated/ref-se-citizens.png`
  - `generated/ref-transit-context.png`
- Self-audit: `SELF_AUDIT.md`

## Artifact Class

- Intended artifact class: Level 1/Level 2 review evidence for the data-to-raster pipeline.
- Decision supported: whether the four-target fixture taxonomy is strong enough to proceed to Phase 2DTR-3, a four-corner regenerated raster/spec attempt.
- Required output format: JSON for deterministic source/spec/provenance artifacts; PNG for visible comparison and status evidence.
- SVG status: SVG is disallowed for primary world art. This packet uses existing raster/photo inputs and does not create SVG/canvas/CSS/DOM primary world art.

## Source Discipline

Used existing local sources only:

- `src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json`
- `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `docs/mvp-reference-images/`
- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`

No live scraping, live API calls, external browser sourcing, Google/Street View/3D Tiles extraction, texture extraction, tracing, new package tooling, app source edits, data fixture edits, or script edits were introduced.

## Review Read

The key review question is whether the target set now has enough structured, status-labeled facade/source coverage to support a later generated four-corner raster/spec attempt.

The board and JSON artifacts make these separations explicit:

- Business identity and address context are `sourced`.
- Scene envelope, facade style, storefront bay, sign placement, and door/window cues are usually `manual_draft` or `inferred`.
- Greenpoint G is `symbolic` context, not storefront frontage.
- Exact facade, frontage/order, entrance/window geometry, address placement, station geometry, active-status finality, trade-dress clearance, production asset approval, and public factual readiness remain blocked.

## Outcome

This packet completes Phase 2DTR-2 for review:

- The four-target structured facade fixture exists.
- The deterministic raster/spec index exists.
- The provenance/status map exists.
- The comparison board shows each target's MVP-29E baseline crop, supplied reference preview, status tags, and blocked claims.

## Unresolved Decisions

Batu still owns:

- Whether to accept, revise, or reject this four-target fixture structure.
- Whether Greenpoint G should stay as a separate symbolic record or be represented through multiple station-cue records later.
- Whether Phase 2DTR-3 should open as a four-corner regenerated raster/spec attempt.
- Any approval of public schemas, app/source fixture implementation, public interfaces, exact facade/frontage/address/station claims, production visual assets, or production/public readiness.
