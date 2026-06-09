# Current Execution Brief - Phase 4M-R7 Franklin Hero Kit Extraction + Benchmark Render Proof Complete

Status: `Packet 4M-R7: Franklin Hero Kit Extraction + Benchmark Render Proof` is complete and verified.

Current executable batch: none.

Completed packet: `4M-R7 Franklin Hero Kit Extraction + Benchmark Render Proof`.

Opened from:

- R5 commit `e585ff8`
- R6 commit `9f9d55d`

Completed batches:

- `4M-R7A: Extraction architecture`
- `4M-R7B: Authoring path decision`
- `4M-R7C: Benchmark render spec`
- `4M-R7D: Minimal implementation`
- `4M-R7E: Review/report`

Pre-authorized queue: none.

Self-advance allowed: no.

Hard Batu gate: stop for Batu review of the R7 Franklin hero kit extraction, workflow decision, benchmark render spec, and screenshots.

## R7 Outcome

- R6 proved hybrid Franklin recognizability but not benchmark render fidelity.
- R7 opened and completed a Franklin-only hero kit extraction/render proof.
- Measured trace = alignment.
- Hero kit = visual fidelity.
- Runtime = assembly, QA gating, placement, camera review, and regression checks.
- `Phase4BRuntimePreview.jsx` is no longer the Franklin fidelity sculpting surface.

## Completed Output

- Added `src/components/hero/FranklinHeroCorner.jsx`.
- Updated `src/Phase4BRuntimePreview.jsx` so the runtime computes measured placement and calls the extracted Franklin hero kit only for the Franklin Visual POC path.
- Added `docs/reports/phase-4m-r7-franklin-hero-kit-extraction-workflow-decision.md`.
- Added `docs/reports/phase-4m-r7-franklin-benchmark-render-spec.md`.
- Added `docs/reports/phase-4m-r7-franklin-hero-kit-extraction-report.md`.
- Captured R7 review screenshots in `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/`.

## Review Artifacts

- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/franklin-benchmark-close-r7.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/franklin-side-return-corner-wrap-r7.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/franklin-street-level-lower-oblique-r7.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/corridor-oblique-ghosted-r7.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/manhattan-close-r7-shared-renderer-check.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/normal-mode-protection-smoke-r7.png`

## Boundaries Preserved

- No Manhattan expansion.
- No new source lane.
- No normal-mode Franklin hero exposure.
- No real logos, readable sign text, business identity, active-status, exact storefront/frontage/entrance/address claims, production assets, or public/product claims.
- No R8 opened.
- Older unrelated untracked 4M artifacts were not staged.

## Verification Completed

- `npm run build`
- Browser review/capture from `http://127.0.0.1:5176/`
- PNG/file-format check for R7 screenshots
- `git diff --check`
- Staging audit before commit

## Unresolved Decisions For Batu

- Whether the extracted Franklin hero-kit boundary is the right workflow direction.
- Whether the next fidelity batch should use a review-only GLB/GLTF asset path as recommended.
- Whether to open a later Franklin benchmark asset-placement batch. Manhattan remains closed.
