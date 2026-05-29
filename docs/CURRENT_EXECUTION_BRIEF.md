# Current Execution Brief — MVP-05 Source-Of-Truth Validation Spike

Status: Proposed next Codex task; requires Batu/ChatGPT approval before execution.
Owner boundary: Codex may execute only inside this brief.

## Purpose

Test whether the recommended source-of-truth approach can support the current MVP block face before more visual polish.

The approach under test is: public/open address-building data + owned/approved visual references + human QA. This is a review-only spike, not a production pipeline.

## Task

Create one review artifact:

`docs/mvp-review/mvp-05-source-of-truth-validation-spike/README.md`

Use the current Manhattan Ave / Greenpoint Ave scene boundary and existing project docs/artifacts. Do not widen the scene.

## Required Output

Produce 5-10 storefront evidence cards. Each card should include:

- Candidate storefront/place name or placeholder label.
- Candidate address.
- Building/tax-lot linkage if already available in project evidence; otherwise mark `missing`.
- Candidate business/status/category.
- Source/provenance notes.
- Visual-reference provenance: owned, approved, project-supplied, missing, or blocked.
- Facade cues useful for stylization: sign type, awning, color/material, entrance/window rhythm, distinctive details.
- Confidence: high, medium, low, or blocked.
- Manual-review flags.
- Recommended treatment: use as real card, use as context only, fictionalize, omit, or needs Batu decision.

Then add a short scale-readiness verdict:

- What automated cleanly.
- What required manual review.
- What blocked confidence.
- Whether the approach should proceed, revise, or cut real-place usage before Visual Polish / Optional Ambient.

## Constraints

Do not add app features, backend services, live data, scraping, broad imports, production assets, production data architecture, CI, deployment, analytics, or public-release claims.

Do not use Google Street View, Google Maps, or Google 3D Tiles as stored visual references, extraction inputs, generation inputs, training inputs, texture sources, or facade data.

Do not claim exact facades, exact storefront widths, exact frontage/order, exact station geometry, or production placement unless existing project evidence explicitly supports it.

If evidence is missing, say `missing` or `blocked`; do not fill gaps with guesses.

## Acceptance Criteria

- One concise review artifact exists at the path above.
- 5-10 storefront evidence cards are present or explicitly blocked by missing evidence.
- Each card has confidence and recommended treatment.
- The final verdict clearly says `proceed`, `revise`, or `cut` for real-place usage before visual polish.
- `docs/PLAN.md`, `docs/MVP_SCOPE.md`, and `docs/MVP_EXECUTION_LEDGER.md` reconciliation notes are prepared if the repo requires them.
