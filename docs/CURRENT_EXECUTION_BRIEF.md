# Current Execution Brief - 4M-R10 Franklin Hero Asset Ingestion Spike Open

Status: Batu opened `4M-R10 Franklin Hero Asset Ingestion Spike` after the completed R8/R9 Franklin hero sequence. R8/R9 remain complete, verified, and committed as `feb533f`; post-R9 loose report/screenshot artifacts have been archived.

Current executable batch: `4M-R10 Franklin Hero Asset Ingestion Spike`.

Completed milestone: `4M-R9 Franklin High-Recognition Detail Modules`.

Pre-authorized queue: none.

Self-advance allowed: no.

Hard Batu gate: stop after R10 implementation and screenshot comparison for Batu visual review. Do not self-open R11 or R12.

## Objective

Prove that one QA-only authored GLB hero insert can be loaded, anchored, toggled, and visually compared against the procedural R9 scaffold without contaminating normal mode or the wider runtime architecture.

## Allowed Scope

- One GLB module only.
- Preferred first candidate: Franklin side bay/window projection or similarly high-recognition architectural insert.
- Preserve the R9 procedural scaffold as fallback.
- Position/scale the asset through the Franklin facade record or an adjacent QA-only hero asset binding record.
- Keep asset loading out of `src/Phase4BRuntimePreview.jsx` where possible, using a hero asset registry/loader boundary under `src/components/hero/` or equivalent.
- Runtime remains responsible for assembly, gating, and placement; the Franklin hero module owns visual fidelity choices.
- Add the smallest verifier needed to prove QA-only gating, structured anchoring, fallback behavior, and blocked claims.
- Capture R10 screenshots showing GLB-on and fallback/off comparison.
- Update only the R10 report, screenshots, verifier, and required execution-control docs after implementation.

## Blocked Scope

- Full Franklin building replacement.
- Manhattan implementation except a narrow shared-renderer regression capture if R10 changes shared runtime behavior.
- PBR registry, corridor UV mapping, Cesium, 3D Tiles, full asset streaming, raster texture atlas, custom shader pipeline, production assets, production claims, normal-mode exposure, exact storefront/frontage/signage/entrance/address/tenant/material/active-status claims, source expansion, package/tooling changes beyond the approved R10 boundary, or public/product claims.
- R11 comparison work or R12 standardization work before Batu reviews R10.

## Required Pre-Implementation Check

Before source/runtime edits, confirm the GLB asset exists at the chosen repo-local path and report:

- Expected path and filename.
- Whether it is review-only / QA-only.
- How it will be anchored from structured record data.

If no suitable GLB exists, stop before implementation and report the missing asset rather than replacing it with SVG, canvas, CSS, DOM-drawn scene art, or a code-generated primary visual surface.

## Success Criteria

- One QA-only GLB asset loads in Franklin hero review mode.
- Asset can be disabled to show the procedural fallback.
- Asset is anchored from structured record data.
- Screenshots show whether the insert materially improves recognition.
- Verifiers, `npm run build`, and `git diff --check` pass, or any non-blocking verification limitation is documented.
- Stop at Batu visual review gate.

## R11/R12 Planning Horizon

- `4M-R11` compares R9 procedural output against R10 GLB insert output and recommends primitive modules, GLB inserts, or a mixed hero-kit strategy.
- `4M-R12` codifies the accepted Franklin hero-kit pattern before any Manhattan, landmark, or broader corridor expansion.

## Verification Completed For This Opening

- `git status --short`
- Archived old untracked 4M report/screenshot artifacts under `docs/archive/`.
- Control-doc reconciliation only.
- No source/runtime implementation files edited.
