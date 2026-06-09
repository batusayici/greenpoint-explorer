# Phase 4M-R7 Franklin Hero Kit Extraction Workflow Decision

Status: R7 decision-support artifact for Batu review
Date: 2026-06-09
Scope: Franklin-only QA Visual POC hero corner

## Decision Need

R6 proved hybrid Franklin recognizability but not benchmark render fidelity. The remaining blocker is authoring workflow and surface quality, not corridor data or Three.js placement. R7 therefore separates responsibilities:

- Measured trace = alignment.
- Hero kit = visual fidelity.
- Runtime = assembly, QA gating, placement, camera review, and regression checks.

## Option 1 - Dedicated Three.js Component Authoring

Description: Continue authoring Franklin hero detail directly as Three.js primitives, but inside a dedicated QA-only Franklin module rather than inside `Phase4BRuntimePreview.jsx`.

Strengths:

- Keeps the existing React/Vite/Three.js runtime simple.
- Preserves deterministic placement and easy QA gating.
- Avoids new dependencies and asset loading risk in R7.
- Makes measured trace alignment easy to inspect because coordinates stay explicit.

Weaknesses:

- Primitive tuning has plateaued visually.
- Fine material detail, beveling, contact shadows, and tactile facade relief remain slow and code-heavy.
- Fidelity work stays expensive to iterate because every visual decision becomes JSX/geometry code.
- The output still reads code-native unless many more custom primitives are added.

Best use:

- Runtime placement.
- QA gates.
- Alignment overlays.
- Simple fallback hero modules.
- Thin procedural helpers around a higher-fidelity asset.

## Option 2 - Blender/DCC-Authored GLB/GLTF Loaded Into Three.js

Description: Author the Franklin hero corner as a review-only GLB/GLTF asset in Blender or another DCC, then load/place it in the existing Three.js Visual POC lane against the measured trace.

Strengths:

- Best fit for benchmark-level visual fidelity.
- Supports bevels, chamfers, material slots, AO/contact-shadow baking, facade relief, non-readable decals, interior silhouettes, glass depth, sidewalk clutter, and authored roof/side-return detail.
- Keeps visual iteration in an art/modeling tool instead of turning `Phase4BRuntimePreview.jsx` into a sculpting surface.
- Can preserve deterministic runtime placement if the asset origin, scale, and anchor contract are fixed.

Weaknesses:

- Requires a later approved asset path and loader boundary.
- Requires asset-origin/scale/version discipline.
- Needs a review-only asset policy so the GLB is not mistaken for production art or factual facade proof.
- May require a loader implementation decision if no existing GLTF loader path is approved.

Best use:

- Franklin benchmark fidelity asset authoring.
- Material/lighting proof.
- Reusable facade/street module extraction after one high-fidelity corner proves the target.

## Recommendation

Recommend GLB/GLTF for the next benchmark-fidelity implementation batch, with the dedicated Three.js Franklin module retained as the QA placement, fallback, and trace-alignment lane.

R7 should not attempt full benchmark closure without an approved asset path. The clean next step is to author or receive a review-only Franklin GLB/GLTF hero corner and load it behind the same Visual POC gate.

## Proposed Asset Location

- `src/assets/review-only/phase-4m-r8-franklin-hero-corner-review-only.glb`

Use `review-only` naming and metadata because the asset would be non-production, non-factual, and not approved production visual direction by default.

## Proposed Loader / Placement Method

- Add a narrow GLB loader utility only if Batu opens the next batch.
- Place the asset from the same measured trace values already computed in `addMeasuredHeroFacade`.
- Use a fixed origin contract:
  - origin at Franklin corner ground contact
  - +X along Greenpoint Ave frontage
  - +Y up
  - +Z into/fronting the review camera convention used by the runtime
- Runtime responsibility remains:
  - load asset
  - apply position/scale/rotation from measured trace
  - gate to QA Visual POC only
  - optionally show measured trace ghosted behind or around the asset
  - keep Manhattan as a regression check only

## QA Gating

- Visual POC only.
- Normal mode protected.
- Review-only status label required.
- No real logo, readable sign text, business identity, active-status, exact storefront/frontage/entrance/address, or production claim.
- Asset must be inspectable against the measured trace with Franklin close, side-return, street-level, corridor ghosted, and Manhattan regression captures.

## Next Implementation Batch Proposal

Proposed but not opened: `4M-R8 Franklin Review-Only GLB Hero Asset Placement`.

Acceptance target:

- Load one Franklin review-only GLB/GLTF asset in Visual POC.
- Preserve R7/R6 measured trace alignment.
- Capture the same five review views.
- Stop at Batu review.

Manhattan remains closed unless Batu explicitly opens it.
