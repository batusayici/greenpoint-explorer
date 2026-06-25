# MVP-21 One-Corner Raster Integration / Visual Pass Brief

Status: Complete for Batu review
Date: 2026-05-30
Artifact class: Level 0 docs-only implementation brief
Scope: Brief drafting only; no app/source edits, renderer work, raster integration, screenshots, generated art, new assets, scraping, live data, staging, or commit

## Executive Verdict

Verdict: `ready-to-open-mvp-21-implementation-pending-batu-approval`.

MVP-21 implementation is recommended only after this docs packet is committed and Batu explicitly opens implementation. Batu has named the approved review-only raster references for the future implementation brief, but this packet still does not open source edits.

This packet does not open implementation by itself. It defines the narrow future implementation boundary for the first possible source/app pass after MVP-20.

## Purpose

MVP-21 should test whether the existing raster-first interaction shell can support one recognizable real-corner visual pass for the selected NW corner.

Selected slice:

- NW corner only.
- 903 Manhattan Ave / prior Greenpoint Deli candidate.
- Internal/source evidence label: `GRILLPOINT DELI`.
- Preferred product-facing treatment: generalized/fictional-safe deli cue, such as a non-readable deli sign or `Corner Deli`.
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
- Batu keeps `GRILLPOINT DELI` as internal/source evidence only unless explicitly approved later.
- Product-facing treatment avoids unsupported exact claims and uses generalized/fictional-safe deli treatment by default.
- Exact `GRILLPOINT DELI` sign reproduction remains blocked unless explicitly approved later.
- The future current brief repeats the approved raster reference roles and any implementation-specific asset path rules.
- The future current brief repeats the exact allowed file list or narrows it further.

Photos alone do not satisfy the primary raster material requirement. Reference photos can guide a raster plate, layered raster export, or approved raster composition, but they are not themselves approval to extract textures, trace facades, reproduce signage exactly, or create production assets.

## Selected Target

Target:

- Corner: NW only.
- Address context: 903 Manhattan Ave, Brooklyn, NY 11222, review-only.
- Prior project label: Greenpoint Deli.
- Evidence/source label supported by field photos: `GRILLPOINT DELI`.
- Truth status: `manual-review-required` for final business identity and public-facing label.
- Batu decision recorded for MVP-21: `GRILLPOINT DELI` may be used as an internal/source evidence label only.
- Preferred product-facing treatment: generalized/fictional-safe deli cue, such as non-readable deli sign treatment or `Corner Deli`.
- Exact `GRILLPOINT DELI` sign reproduction is not approved unless explicitly approved later.

Visible/product label options for Batu:

| Option | Allowed only if | Notes |
| --- | --- | --- |
| Exact source label: `GRILLPOINT DELI` | Batu approves exact review-only sign text and source/data label treatment. | Strongest local recognition; highest truth/trade-dress care. |
| Generalized deli label | Approved as the preferred MVP-21 product-facing direction. | Safer default; example: `Corner Deli`. |
| Fictional-safe label | Approved as an acceptable product-facing direction. | Keeps corner mood without public identity claim. |
| Context-only label | Batu wants the facade recognizable but not card/name-forward. | Useful if business identity remains uncertain. |
| Omitted label | Batu blocks label use. | MVP-21 can still test shell integration only if raster material exists. |

Product-facing treatment must avoid unsupported exact claims. If a future task attempts exact `GRILLPOINT DELI` sign reproduction without explicit later approval, Codex must stop before source edits.

## Approved Visual / Reference Inputs

Allowed NW reference files for MVP-21 planning, pending Batu implementation approval:

- `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpg`
- `docs/mvp-reference-images/northwest-subwayA.jpg`

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

## Approved Raster References

Batu-approved review-only raster references for MVP-21:

| Reference | Role | Approved use | Limits |
| --- | --- | --- | --- |
| `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-A-ui-world-integration.png` | Primary raster/world integration reference. | Guide the future NW-corner raster-first world-surface integration, composition feel, and relationship between world art and UI shell. | Review-only / non-production. Does not approve exact facade, exact sign, exact address-placement, exact storefront frontage/order, exact station-geometry, production assets, or code-native primary world art. |
| `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-B-place-card-marker-hover-state.png` | UI/card/marker/hover-state reference. | Guide future card, marker, hover, selection, and tether treatment around the existing interaction shell. | Review-only / non-production. Does not approve production UI, real-place production cards, exact factual copy, exact sign/facade claims, or broad UI redesign. |

These references name the approved raster direction for the future implementation pass. They do not create new assets, approve production asset direction, or allow Codex to create primary world art through SVG, CSS, DOM drawing, canvas, primitive geometry, or other code-native scene art.

## Primary Raster Material Requirement

MVP-21 must use a raster-first world surface guided by the approved primary raster/world integration reference. Codex must not invent primary world art through SVG, CSS, DOM drawing, canvas, primitive renderer geometry, icon assemblage, or code-native storefront/building/sign drawing.

Approved raster reference paths for future implementation planning:

1. Primary raster/world integration reference: `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-A-ui-world-integration.png`.
2. UI/card/marker/hover-state reference: `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-B-place-card-marker-hover-state.png`.
3. Any implementation-specific exported plate, cropped plate, or layered raster file must be named by the future current brief before source edits.
4. Limited fallback: keep the existing MVP-17 raster interaction baseline unchanged and adjust only approved overlays/targets/cards around it. This preserves interaction evidence but does not by itself satisfy a recognizable real-corner visual pass.

If the future implementation brief does not name the actual raster file path to be integrated into the app, Codex must stop before app/source edits and report:

- Missing implementation raster material.
- Expected path and file name.
- Required aspect ratio or dimensions if specified.
- How it would be integrated after Batu supplies it.

## Allowed Future Implementation Scope

If Batu opens MVP-21 implementation, it may:

- Preserve the existing shell: pan, zoom, target rail, place card, markers, tethers, selected outlines, and review-only status.
- Integrate only the NW corner visual pass if the future current brief names the implementation raster material path.
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
- `II-A-ui-world-integration.png` and `II-B-place-card-marker-hover-state.png` are used only in their approved review-only reference roles.
- Parked NE / SE / SW references are unused.
- Google/Street View/3D Tiles, LiveXYZ facade/art, copied web imagery, and blocked historical screenshots are unused.
- Screenshots are captured if the future brief requires them; if local preview blocks screenshots, the blocker is recorded.
- A self-audit records visual-reference use, truth claims, source-label treatment, blocked references, and remaining Batu decisions.

MVP-21 cannot be marked complete if it only changes labels/cards without approved primary raster material, unless Batu explicitly approves the limited fallback as an interaction-only alignment pass.

## Stop Conditions

Stop before implementation if:

- Implementation raster material path is missing or not approved in the future current brief.
- Allowed files are ambiguous.
- The task attempts to use parked NE / SE / SW photos.
- Exact `GRILLPOINT DELI` sign/facade treatment is attempted without explicit later Batu approval.
- Greenpoint Deli / `GRILLPOINT DELI` naming claims remain unsupported for the chosen display treatment.
- MVP-20 and the implementation brief conflict.
- App/source edits would exceed the approved allowlist.
- The task would require Google/Street View/3D Tiles-derived or LiveXYZ-derived facade/art material.

## Remaining Batu Decisions

- Approve, revise, or reject this MVP-21 implementation brief.
- Decide whether to open MVP-21 implementation.
- Decide whether `src/mvpPlaceData.js` may keep Greenpoint Deli, use `GRILLPOINT DELI` internally only, or use generalized/fictional-safe/context-only/omitted treatment.
- Name the implementation raster material path if it differs from the approved raster references.
- Confirm or narrow the allowed future file list.
- Decide whether screenshots are required for MVP-21 and which states must be captured.

## Source And Scope Notes

- Required docs read: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/MVP_SCOPE.md`, `docs/reference/PLACE_SCHEMA.md`, `docs/reference/PLACE_SOURCE_POLICY.md`, `docs/mvp-review/mvp-19-one-corner-field-photo-supply-gate/README.md`, `docs/mvp-review/mvp-20-real-corner-translation-boundary/README.md`, and `docs/mvp-review/parked-corner-reference-images/README.md`.
- No app/source files were edited.
- No renderer work, raster integration, visual generation, screenshots, scraping, live data pipeline, new assets, staging, or commit was performed.
- No Google/Street View/3D Tiles-derived imagery was stored, copied, transformed, traced, extracted, used as generation input, used as training input, or used as facade reference.
