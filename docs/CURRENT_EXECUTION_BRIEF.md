# Current Execution Brief - Post-R9 Franklin Hero Asset Sequence Pending

Status: R8/R9 are complete, verified, and committed as `feb533f`. Post-R9 planning is reconciled; no implementation batch is open.

Current executable batch: none.

Completed milestone: `4M-R9 Franklin High-Recognition Detail Modules`.

Post-R9 candidate sequence:

1. `4M-R10 Franklin Hero Asset Ingestion Spike`
2. `4M-R11 R9 vs R10 Visual/Technical Comparison`
3. `4M-R12 Hero-Kit Standardization Decision`

Pre-authorized queue: none.

Self-advance allowed: no.

Hard Batu gate: stop for Batu review before opening R10. R10 may open only if Batu explicitly approves a controlled QA-only Franklin hero asset ingestion spike.

## Current State

- R8 proved the QA-only Franklin facade record can drive native Franklin hero geometry from structured data.
- R9 extended that record-driven scaffold with code-native high-recognition detail modules: candidate side projection, fire escape cue, AC/window utilities, irregular facade rhythm, material/weathering bands, and street/sidewalk grounding.
- R9 remains a visual review milestone: the code-native Franklin detail modules improved the scaffold, but recognizable stylized fidelity under close isometric orthographic review still needs a controlled asset-ingestion test before any broader asset pipeline is considered.
- The procedural scaffold remains the base; QA-only hero inserts are exceptions for high-recognition architectural features.

## Candidate R10 Scope

`4M-R10 Franklin Hero Asset Ingestion Spike` is a future candidate only, not open in this brief.

Objective:

- Prove that one QA-only authored GLB hero insert can be loaded, anchored, toggled, and visually compared against the procedural R9 scaffold without contaminating normal mode or the wider runtime architecture.

Allowed only if Batu opens R10:

- One GLB module only.
- Preferred first candidate: Franklin side bay/window projection or similarly high-recognition architectural insert.
- Preserve the R9 procedural scaffold as fallback.
- Position/scale the asset through the Franklin facade record or an adjacent QA-only hero asset binding record.
- Keep asset loading out of `src/Phase4BRuntimePreview.jsx` where possible, using a hero asset registry/loader boundary under `src/components/hero/` or equivalent.
- Runtime remains responsible for assembly, gating, and placement; the Franklin hero module owns visual fidelity choices.

Blocked unless later explicitly approved:

- Full Franklin building replacement.
- Manhattan implementation.
- PBR registry, corridor UV mapping, Cesium, 3D Tiles, full asset streaming, raster texture atlas, custom shader pipeline, production assets, production claims, normal-mode exposure, exact storefront/frontage/signage/entrance/address/tenant/material/active-status claims, source expansion, package/tooling changes beyond an approved R10 boundary, or public/product claims.

## Candidate R10 Success Criteria

- One QA-only GLB asset loads in Franklin hero review mode.
- Asset can be disabled to show the procedural fallback.
- Asset is anchored from structured record data.
- Screenshots show whether the insert materially improves recognition.
- Verifiers, `npm run build`, and `git diff --check` pass.
- Stop at Batu visual review gate.

## R11/R12 Planning Horizon

- `4M-R11` compares R9 procedural output against R10 GLB insert output and recommends primitive modules, GLB inserts, or a mixed hero-kit strategy.
- `4M-R12` codifies the accepted Franklin hero-kit pattern before any Manhattan, landmark, or broader corridor expansion.

## Verification Completed For This Reconciliation

- Planning/control docs reconciled only.
- No implementation files edited.
- No R10 implementation started.
