# Phase 4E Evidence-Informed QA Facade Scene Proof

Status: Batch 4E-5 review artifact; stop at Batu visual review
Date: 2026-06-07
Scope: Manhattan Ave x Greenpoint Ave and Franklin Ave x Greenpoint Ave endpoint evidence only

## Purpose

This batch proves that Batu-supplied endpoint-corner evidence can be manually translated into structured QA-only facade cue records that alter the Three.js runtime render from data.

Success is not exact place recognition, business recognition, exact frontage, or production readiness. Success is that both endpoint corners visibly shift from plain graybox toward evidence-informed QA facade geometry while normal mode remains unchanged and factual/business claims stay blocked.

## Outputs

- Fixture: `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- Verifier: `scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- Runtime consumer: `src/Phase4BRuntimePreview.jsx`
- Review screenshots: `docs/review-screenshots/phase-4e-1-evidence-informed-qa-facade-scene-proof/`
- 4E-2 legibility screenshots: `docs/review-screenshots/phase-4e-2-qa-facade-legibility-pass/`
- 4E-3 composition screenshots: `docs/review-screenshots/phase-4e-3-endpoint-corner-facade-composition-pass/`
- 4E-4 depth/separation screenshots: `docs/review-screenshots/phase-4e-4-endpoint-facade-record-separation-depth-correction/`
- 4E-5 opaque volumetric screenshots: `docs/review-screenshots/phase-4e-5-opaque-volumetric-legibility-pass/`

## Method

The fixture uses manual coarse cue extraction only from existing repo-local Batu-supplied endpoint-corner image evidence. It records generic cue types:

- `facade-rhythm`
- `sign-band-zone`
- `awning-canopy`
- `window-glass-rhythm`
- `corner-emphasis`
- `street-transit-detail-cue`
- `palette-family`
- `blocked-claim-readout`

Palette families are semantic approximations only. They are not sampled palettes from photos.

The renderer consumes generic cue records keyed to existing stable scene object IDs. It does not branch by Manhattan/Franklin endpoint, image filename, business name, or exact corner identity.

## Current Result

- Rendered QA evidence-facade records: 6.
- Blocked/unrendered evidence-facade records: 0.
- Manhattan endpoint target records: 3.
- Franklin endpoint target records: 3.
- Normal-mode records: 0.
- Business identity connections: 0.
- Exact frontage claims: 0.
- Production claims: 0.

## 4E-2 Legibility Pass

Batch 4E-2 revised the existing QA-only renderer treatment so the proof reads as simplified endpoint architecture instead of a dense debug/cue overlay.

What changed:

- Added Manhattan and Franklin facade review camera presets with tighter endpoint framing.
- Made ordinary QA massing recede to low-opacity gray context while preserving normal-mode graybox behavior.
- Kept the six evidence-informed facade records as the primary visible QA facade articulation.
- De-emphasized generic geometry-only cue planes and candidate POI labels by default.
- Collapsed QA provenance/readout chrome so "Business evidence not connected" and blocked-claim status remain visible but secondary.
- Captured required normal, QA overview, Manhattan review, Franklin review, and mobile QA containment screenshots under `docs/review-screenshots/phase-4e-2-qa-facade-legibility-pass/`.

The 4E-2 screenshots show both endpoint areas visibly altered from plain graybox using only fixture-driven cue records. They do not claim exact place recognition, business recognition, exact frontage, exact signage, exact facade truth, active status, address placement, production readiness, or public/product validity.

## 4E-3 Endpoint Corner Facade Composition Pass

Batch 4E-3 revised the same QA-only evidence-informed facade lane so the endpoint records read as layered corner architecture rather than flat billboard panels or debug overlays.

What changed:

- Added QA-only composition metadata to the existing facade cue fixture, including evidence-facade role, synthetic-context role, lateral separation, width/depth profile, base/upper plane ratios, recess/projection depth, side-return/corner-wrap flags, and generic grounding flags.
- Added verifier coverage that keeps evidence-informed facade geometry distinct from non-evidence placeholder context and prevents synthetic context or benchmark images from becoming evidence.
- Reworked the runtime facade render into layered geometry: storefront/base plane, upper facade plane, sign-band projection, grouped window/glass rhythm, parapet/roofline, side-return/corner wrap where cue-supported, and simple QA sidewalk/curb/crosswalk grounding.
- Further de-emphasized mid-corridor context in QA so Manhattan and Franklin endpoint records carry the visual read while normal mode remains protected.
- Captured required normal, QA overview, Manhattan endpoint, Franklin endpoint, and mobile QA containment screenshots under `docs/review-screenshots/phase-4e-3-endpoint-corner-facade-composition-pass/`.

The 4E-3 screenshots support Batu review of whether the source-to-structured-cues-to-render pipeline can produce visually recognizable endpoint corner facade composition. They do not claim exact place recognition, business recognition, exact frontage, exact signage, exact facade truth, active status, address placement, production readiness, or public/product validity.

## 4E-4 Endpoint Facade Record Separation + Architectural Depth Correction

Batch 4E-4 revised the same QA-only evidence-informed facade lane so the six endpoint records read as separate grounded volumetric building blocks rather than clustered facade cards.

What changed:

- Added QA-only slot/depth metadata to each rendered facade cue record: streetwall slot, slot gap, footprint depth, facade thickness, corner return depth, storefront setback, sign-band depth, window relief depth, parapet/cornice projection, street-edge alignment, ground-plane extent, and context visibility policy.
- Added verifier coverage that requires six unique visual slots, minimum separation/depth values, real side returns, non-promotable synthetic context, QA-only status, and blocked factual/business claims.
- Reworked the runtime render into volumetric endpoint blocks with body depth, front wall thickness, return walls, setback storefront/base treatment, projected sign bands, raised window relief, parapet/cornice relief, contact shadow, and sidewalk/curb/street slabs.
- De-emphasized mid-corridor graybox context so the endpoint clusters carry the QA review read.
- Hid the large semantic inspector in QA screenshot mode while preserving compact QA truth/status labels.
- Captured required normal, QA overview, Manhattan endpoint, Franklin endpoint, and mobile QA containment screenshots under `docs/review-screenshots/phase-4e-4-endpoint-facade-record-separation-depth-correction/`.

The 4E-4 screenshots show three separate QA evidence-informed endpoint blocks at Manhattan and three separate QA evidence-informed endpoint blocks at Franklin. They do not claim exact place recognition, business recognition, exact frontage, exact signage, exact facade truth, active status, address placement, production readiness, or public/product validity.

## 4E-5 Opaque Volumetric Legibility Pass

Batch 4E-5 revised the same QA-only evidence-informed facade lane after Batu's conditional 4E-4 pass so the endpoint records read more as opaque grounded architectural volumes and less as ghosted facade panels.

What changed:

- Added a 4E-5 render-legibility contract to the fixture with opacity minimums, computed rendered-gap policy, ground-contact requirements, and required silhouette hierarchy.
- Added verifier checks for computed rendered extents, minimum gaps, opaque mass/front/return/base/ground values, required side returns, curb/sidewalk contact, QA-only status, blocked claims, and synthetic-context non-promotion.
- Reworked the runtime so evidence facade geometry is opaque/depth-writing, evidence-target graybox underlays are hidden in QA, context lines are lower contrast, and secondary cue detail is suppressed where it competed with the volumetric read.
- Captured required normal, QA overview, Manhattan endpoint, Franklin endpoint, and mobile QA containment screenshots under `docs/review-screenshots/phase-4e-5-opaque-volumetric-legibility-pass/`.

The 4E-5 screenshots support Batu visual review of the endpoint facade proof only. They do not claim exact place recognition, business recognition, exact frontage, exact signage, exact facade truth, active status, address placement, production readiness, or public/product validity.

## Blocked Claims

This batch preserves blocked status for:

- Business identity.
- Active status.
- Storefront anchors.
- Tenant frontage.
- Exact frontage and frontage order.
- Exact address placement.
- Exact entrance location.
- Exact facade appearance.
- Exact signage reproduction.
- Facade material and color truth.
- Production asset readiness.
- Normal runtime rendering.
- Public/product claims.

## Review Boundary

This packet can support Batu visual review of whether the source-to-structured-cues-to-render pipeline works for endpoint facades.

Still requires Batu decision before any later batch can:

- Connect business evidence.
- Select, link, or approve exact evidence-to-geometry associations.
- Create storefront anchors.
- Claim exact frontage, entrance, facade, signage, material, color, active status, or address placement.
- Expose the layer in normal/product mode.
- Create production assets or public/product claims.
