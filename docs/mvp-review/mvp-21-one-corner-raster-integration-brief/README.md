# MVP-21 One-Corner Raster Integration / Visual Pass Brief

Status: Complete for Batu review
Date: 2026-05-30
Artifact class: Level 0 docs-only implementation brief
Scope: Brief drafting only; no app/source edits, renderer work, raster integration, screenshots, generated art, new assets, scraping, live data, staging, or commit

## Executive Verdict

Verdict: `ready-to-open-mvp-21-implementation-pending-batu-approval`.

MVP-21 implementation is recommended only if Batu explicitly approves this brief, approves the selected label/sign treatment, and identifies or supplies the primary raster material for the world surface.

This packet does not open implementation by itself. It defines the narrow future implementation boundary for the first possible source/app pass after MVP-20.

## Purpose

MVP-21 should test whether the existing raster-first interaction shell can support one recognizable real-corner visual pass for the selected NW corner.

Selected slice:

- NW corner only.
- 903 Manhattan Ave / prior Greenpoint Deli candidate.
- Field-reference sign text: `GRILLPOINT DELI`.
- Minimal adjacent context only when needed for the corner to read correctly.

MVP-21 is not:

- A full rebuild.
- A four-corner implementation.
- A new renderer.
- A production asset or production data approval.
- Approval for exact facade, address placement, storefront frontage/order, station geometry, or final public card copy.

## Entry Criteria For Future Implementation

MVP-21 source/app implementation may open only when all are true:

- MVP-19 is accepted or revised enough to approve the owned/non-Google NW reference packet.
- MVP-20 is accepted with the `proceed-to-mvp-21` recommendation.
- The selected NW reference evidence is committed and provenance-labeled as review-only / non-production.
- Parked NE / SE / SW reference photos remain excluded from MVP-21.
- Batu explicitly approves opening MVP-21 implementation from this brief.
- Batu approves the visible/product label option for the NW deli target.
- Batu approves the primary raster material path or confirms the future task must stop until it exists.
- The future current brief repeats the exact allowed file list or narrows it further.

Photos alone do not satisfy the primary raster material requirement. Reference photos can guide a raster plate, layered raster export, or approved raster composition, but they are not themselves approval to extract textures, trace facades, reproduce signage exactly, or create production assets.

## Selected Target

Target:

- Corner: NW only.
- Address context: 903 Manhattan Ave, Brooklyn, NY 11222, review-only.
- Prior project label: Greenpoint Deli.
- Evidence/source label supported by field photos: `GRILLPOINT DELI`.
- Truth status: `manual-review-required` for final business identity and public-facing label.

Visible/product label options for Batu:

| Option | Allowed only if | Notes |
| --- | --- | --- |
| Exact source label: `GRILLPOINT DELI` | Batu approves exact review-only sign text and source/data label treatment. | Strongest local recognition; highest truth/trade-dress care. |
| Generalized deli label | Batu approves a non-exact deli treatment. | Safer default if exact sign text remains unresolved. |
| Fictional-safe label | Batu chooses taste/safety over real-name specificity. | Keeps corner mood without public identity claim. |
| Context-only label | Batu wants the facade recognizable but not card/name-forward. | Useful if business identity remains uncertain. |
| Omitted label | Batu blocks label use. | MVP-21 can still test shell integration only if raster material exists. |

Product-facing treatment must avoid unsupported exact claims. If Batu does not choose a label treatment before implementation, Codex must stop before source edits rather than silently choosing.

## Approved Visual / Reference Inputs

Allowed NW reference files for MVP-21 planning, pending Batu implementation approval:

- `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpeg`
- `docs/mvp-reference-images/northwest-subwayA.jpeg`

Allowed use:

- Review-only facade cues.
- Storefront/frontage/entrance relationship notes.
- Signage, awning, window-density, color, massing, and adjacent-context cues.
- Symbolic subway-context cue.

Blocked use:

- Texture extraction.
- Facade tracing.
- Exact sign/logo/trade-dress reproduction unless Batu explicitly approves exact review-only treatment.
- Production asset claims.
- Public-release factual card copy.
- Training input, generation input, or derived production material.

Parked NE / SE / SW photos are blocked for MVP-21 and must remain unused:

- NE McDonald's parked references.
- SE Citizens parked references.
- SW Dunkin / subway parked references.

## Primary Raster Material Requirement

MVP-21 must use a primary raster world surface. Codex must not invent primary world art through SVG, CSS, DOM drawing, canvas, primitive renderer geometry, icon assemblage, or code-native storefront/building/sign drawing.

Allowed primary material paths for future implementation:

1. Preferred: a new Batu-supplied one-corner raster plate or layered raster export for the NW corner, with a repo path named in the future current brief.
2. Allowed if explicitly approved: an approved raster sprite/asset-kit composition for the NW corner, with source files and placement rules named in the future current brief.
3. Limited fallback: keep the existing MVP-17 raster interaction baseline unchanged and adjust only approved overlays/targets/cards around it. This preserves interaction evidence but does not by itself satisfy a recognizable real-corner visual pass.

If no primary raster material exists at the approved path when future MVP-21 implementation begins, Codex must stop before app/source edits and report:

- Missing primary raster material.
- Expected path and file name.
- Required aspect ratio or dimensions if specified.
- How it would be integrated after Batu supplies it.

## Allowed Future Implementation Scope

If Batu opens MVP-21 implementation, it may:

- Preserve the existing shell: pan, zoom, target rail, place card, markers, tethers, selected outlines, and review-only status.
- Integrate only the NW corner visual pass if approved primary raster material is available.
- Adjust NW target/card/source-label behavior only when tied to the approved truth layer and Batu's label decision.
- Keep other corners unchanged, symbolic, fictional, parked, context-only, or out of scope.
- Preserve non-production / review-only labeling and disclaimers.
- Produce requested screenshots and a self-audit only if the implementation brief asks for them.

MVP-21 must not change public interfaces or module boundaries unless the future current brief explicitly approves the change and names the boundary.

## Allowed Files For Future MVP-21

Proposed narrow allowlist for the future implementation brief:

- `src/PlaceholderWorld.jsx` only for integrating the approved raster world surface and positioning existing overlays/hit regions around it.
- `src/mvpPlaceData.js` only for approved truth-layer label/source/status adjustments tied to the NW target.
- `src/App.jsx` only if the existing card/rail/selection shell needs minimal support for the approved NW target treatment.
- `src/styles.css` only for containment, label/card positioning, and existing-shell visual fit.
- A future review packet under `docs/mvp-review/mvp-21-one-corner-raster-integration/` for implementation notes and self-audit.
- A future screenshot folder under `docs/review-screenshots/mvp-21-one-corner-raster-integration/` only if screenshots are requested.

Stop before editing any other file. If future implementation needs a different file, Codex must report the need and wait for Batu approval or an updated current brief.

## Blocked Work

MVP-21 must not include:

- MVP-22.
- Four-corner visual integration.
- Production assets or production asset pipeline.
- Production real-place cards.
- Exact facade, exact frontage/order, exact address-placement, exact station-geometry, or final active-status claims.
- Google Maps, Google Street View, Google 3D Tiles, or derived stored imagery, tracing, texture extraction, training input, generation input, or facade-reference use.
- LiveXYZ-derived facade/art use.
- Broad data pipeline, scraping, live lookup, backend, CMS, persistence, analytics, CI, deployment, or public-release claims.
- New renderer, framework, package, build tooling, routing system, map system, or public module/interface unless Batu explicitly approves it in a later brief.

## Acceptance Criteria For Future MVP-21

MVP-21 implementation can be marked complete only if:

- Build passes.
- Existing pan/zoom/hover/click/tap/card/rail behavior is preserved or any change is explicitly approved.
- The NW corner is reviewable as the selected one-corner raster pass.
- Truth labels, review-only disclaimers, and unresolved-name/status handling remain visible enough for review.
- No code-native primary world art is introduced.
- Parked NE / SE / SW references are unused.
- Google/Street View/3D Tiles, LiveXYZ facade/art, copied web imagery, and blocked historical screenshots are unused.
- Screenshots are captured if the future brief requires them; if local preview blocks screenshots, the blocker is recorded.
- A self-audit records visual-reference use, truth claims, source-label treatment, blocked references, and remaining Batu decisions.

MVP-21 cannot be marked complete if it only changes labels/cards without approved primary raster material, unless Batu explicitly approves the limited fallback as an interaction-only alignment pass.

## Stop Conditions

Stop before implementation if:

- Primary raster material is missing or not approved.
- Allowed files are ambiguous.
- The task attempts to use parked NE / SE / SW photos.
- Exact `GRILLPOINT DELI` sign/facade treatment is attempted without explicit Batu approval.
- Greenpoint Deli / `GRILLPOINT DELI` naming claims remain unsupported for the chosen display treatment.
- MVP-20 and the implementation brief conflict.
- App/source edits would exceed the approved allowlist.
- The task would require Google/Street View/3D Tiles-derived or LiveXYZ-derived facade/art material.

## Remaining Batu Decisions

- Approve, revise, or reject this MVP-21 implementation brief.
- Choose the visible/product label treatment for the selected NW target.
- Decide whether exact `GRILLPOINT DELI` sign text may appear in review-only raster art.
- Decide whether `src/mvpPlaceData.js` may change from Greenpoint Deli to `GRILLPOINT DELI`, generalized deli, fictional-safe, context-only, or omitted treatment.
- Supply or approve the primary raster material and path for the future implementation pass.
- Confirm or narrow the allowed future file list.
- Decide whether screenshots are required for MVP-21 and which states must be captured.

## Source And Scope Notes

- Required docs read: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/MVP_SCOPE.md`, `docs/PLACE_SCHEMA.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/mvp-review/mvp-19-one-corner-field-photo-supply-gate/README.md`, `docs/mvp-review/mvp-20-real-corner-translation-boundary/README.md`, and `docs/mvp-review/parked-corner-reference-images/README.md`.
- No app/source files were edited.
- No renderer work, raster integration, visual generation, screenshots, scraping, live data pipeline, new assets, staging, or commit was performed.
- No Google/Street View/3D Tiles-derived imagery was stored, copied, transformed, traced, extracted, used as generation input, used as training input, or used as facade reference.
