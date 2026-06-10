# Phase 4M-R10 Franklin Hero Asset Ingestion Spike

Status: Complete for Batu visual review  
Date: 2026-06-10  
Scope: Franklin hero only, QA-only, one GLB insert

## Summary

R10 ingests the supplied repo-local GLB at `assets/windows/Bay_Window_10K_texture.glb` as one QA-only Franklin side-bay/window candidate. The insert is anchored from the Franklin facade record, can be toggled off with `r10HeroAsset=0`, and falls back to the procedural R9 bay-window module.

Normal mode remains protected. The insert is review-only and does not make production, exact facade, exact frontage, sign, entrance, address, tenant, material, active-status, or public/product claims.

## Asset

- Path: `assets/windows/Bay_Window_10K_texture.glb`
- Format: binary glTF 2.0 (`glTF` magic, version `2`)
- Size: approximately 46 MB
- Binding: `franklin-side-bay-window-candidate`
- Target module: `bayWindowProjection`
- Fallback module: `bayWindowProjection`
- Runtime toggle: `r10HeroAsset`

## Implementation Notes

- Added a Franklin hero asset loader boundary in `src/components/hero/FranklinHeroAssetLoader.js`.
- Kept `GLTFLoader` and the GLB URL import out of `src/Phase4BRuntimePreview.jsx`.
- Added a QA-only structured binding under `detailModules.heroAssetBindings` in the Franklin facade record.
- Threaded the R10 toggle through the existing visual POC runtime assembly path.
- Preserved the procedural R9 bay-window module as the fallback when the GLB is disabled.
- Did not add PBR registry, texture atlas work, Cesium, 3D Tiles, dependency changes, full building replacement, normal-mode exposure, or production asset direction.

## Review Screenshots

- GLB on: `docs/review-screenshots/phase-4m-r10-franklin-hero-asset-ingestion-spike/franklin-side-return-glb-on-r10.png`
- Procedural fallback: `docs/review-screenshots/phase-4m-r10-franklin-hero-asset-ingestion-spike/franklin-side-return-r9-fallback-r10.png`

Both screenshots use the Franklin side-return review camera at 1280x720. The GLB-on and fallback screenshots have distinct hashes:

- GLB on: `4a2d334cc8bc8f65b99e9ac86553b44ce747f22132931ef6dd8ffebb3a8c8de1`
- Fallback: `6b482e488f90a2c16285b104c2c0ad09e28cb4b04d6405db7f8c302a77c015f2`

## Verification

- `node scripts/verify-phase-4m-r10-franklin-hero-asset-ingestion-spike.mjs`
- `node scripts/verify-phase-4m-r8-franklin-facade-record-assembly.mjs`
- `node scripts/verify-phase-4m-r9-franklin-high-recognition-detail-modules.mjs`
- `npm run build`
- `git diff --check`
- PNG file-format check for the two review screenshots

Build note: Vite reports the expected large chunk/asset warning because the supplied GLB is approximately 46 MB and is currently imported directly for this QA spike. This is non-blocking for R10, but it is an R11/R12 asset-management concern before any broader strategy.

## Review Gate

Stop here for Batu visual review. R11/R12 remain future candidates only and are not self-opened by this batch.
