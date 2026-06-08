# Current Execution Brief - Batch 4G External Source Policy And Coverage Audit Contract Accepted

Status: Batu accepted `Batch 4G: External Source Policy And Coverage Audit Contract` as complete.

Current executable batch: none. Pending later Batu approval or updated current brief.

Pre-authorized queue: none.

Self-advance allowed: no.

Hard Batu gate: stop. Do not proceed to 4G-A, 4G-B, 4H, NYC 3D / CityGML / 3DCityDB source access or audit, Mapillary/KartaView access or audit, Google 3D Tiles/Street View benchmark work, Qwen/Oxen visual-system work, source expansion, storefront/frontage/entrance claims, business linkage, production exposure, normal-mode exposure, asset registry, visual-system work, art-direction translation, or public/product claims without later Batu approval and an updated current brief or explicit pre-authorized queue.

Owner boundary: Batu owns visual acceptance, product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, usage-rights acceptance, production/public claims, geometry-confidence acceptance, evidence-to-container association acceptance, exact geometry/frontage/entrance approval, business verification approval, facade cue promotion approval, art-direction approval, and any later MVP gates.

## Completed 4G Result

Batch 4G created a Phase 4-specific external source policy and coverage audit contract without accessing, downloading, caching, ingesting, extracting, rendering, benchmarking, or using any external source material.

What changed:

- Added `docs/phase-4g-external-source-policy-coverage-audit-contract.md`.
- Added `scripts/verify-phase-4g-source-policy-contract.mjs`.
- Defined separate future lanes for `4G-A: Geometry Source Audit` and `4G-B: Facade Evidence Source Audit`.
- Formalized NYC 3D / CityGML / 3DCityDB as future geometry-confidence candidates only.
- Formalized Mapillary/KartaView as future facade/storefront evidence candidates only.
- Preserved Google 3D Tiles / Street View as benchmark-only or narrow-exception material unless separately cleared.
- Preserved Qwen/Oxen as deferred 4M visual-system acceleration, not evidence.
- Defined allowed/prohibited use categories and review-only audit fields for future coverage-audit records.
- Added a verifier that checks required lane separation, use boundaries, audit fields, blocked claims, and non-authorization wording.

Preserved boundaries:

- No NYC 3D / CityGML / 3DCityDB access, download, cache, ingestion, conversion, audit execution, or render use.
- No Mapillary/KartaView access, download, cache, ingestion, extraction, audit execution, imagery use, or render use.
- No Google 3D Tiles/Street View benchmark execution, imagery storage, geometry extraction, texture use, training use, generation use, or production visual pipeline.
- No Qwen/Oxen work.
- No source expansion.
- No business linkage.
- No exact storefront/frontage/entrance claims.
- No production assets.
- No normal-mode exposure.
- No art-direction translation.

Verification completed:

- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

## Batch 4G Objective

Create the source-policy and coverage-audit contract for future external source work, while keeping geometry confidence separate from facade evidence and preserving all evidence, source-access, production, and claim-promotion gates.

Allowed work:

- Define source-lane roles and boundaries for `4G-A: Geometry Source Audit` and `4G-B: Facade Evidence Source Audit`.
- Formalize NYC 3D / CityGML / 3DCityDB as future geometry-confidence candidates only.
- Formalize Mapillary/KartaView as future facade/storefront evidence candidates only.
- Preserve Google 3D Tiles/Street View as benchmark-only or narrow-exception material unless separately cleared.
- Preserve Qwen/Oxen as deferred 4M visual-system acceleration, not evidence.
- Specify allowed/prohibited uses for access, attribution, storage/cache, derivative use, extraction, benchmark use, render use, training use, and production use.
- Define review-only coverage-audit contract fields and acceptance criteria without performing source access or ingestion.
- Reconcile control docs and ledger to mark 4G accepted by Batu.

Blocked:

- No NYC 3D / CityGML / 3DCityDB access, download, cache, ingestion, conversion, audit execution, or render use.
- No Mapillary/KartaView access, download, cache, ingestion, extraction, audit execution, imagery use, or render use.
- No Google 3D Tiles/Street View benchmark execution, imagery storage, geometry extraction, texture use, training use, or production visual pipeline.
- No Qwen/Oxen work.
- No source expansion beyond contract definition.
- No business linkage.
- No exact storefront/frontage/entrance claims.
- No production assets.
- No normal-mode exposure.
- No full corridor expansion.
- No art-direction translation.

## Completed 4F-1 Result

Batch 4F-1 hardened the QA-only facade cue model so future endpoint and corridor evidence can attach to stable facade plane, streetwall slot, side-return, depth/setback, ground-contact, and placeholder bay structures without creating storefront, entrance, business, production, or normal-mode claims. Batu approved 4F-1 and opened 4G.

What changed:

- Added a top-level `facadeCueModelPolicy` to the 4E fixture for the QA-only 4F-1 model contract.
- Added per-record `qaFacadeModel` blocks with stable unique `facadePlaneId` values.
- Added streetwall slot/layout contracts with slot extents, slot order, slot count, street-edge alignment, and minimum rendered gaps.
- Formalized side-return/corner-wrap fields and depth/setback/ground-contact fields without promoting entrance, frontage, storefront, material, or exact facade claims.
- Added storefront bay placeholders only as `qa_non_claim_storefront_bay_placeholder` records.
- Added status/confidence states and blocked-promotion fields that keep business linkage, storefront anchors, exact frontage, exact entrance, normal-mode rendering, production assets, and public/product claims blocked.
- Added a dedicated 4F verifier for facade plane IDs, slot extents, rendered gaps, QA-only exposure, required source/evidence references, placeholder bay boundaries, and forbidden raw claim fields.

Preserved boundaries:

- No Mapillary/KartaView ingestion or coverage audit.
- No business linkage.
- No exact storefront/frontage/entrance claims.
- No production assets.
- No normal-mode exposure.
- No full corridor expansion.
- No art-direction translation.

## 4F-1 Review Packet

- Fixture/model: `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- 4F verifier: `scripts/verify-phase-4f-facade-cue-model.mjs`
- Review note: `docs/phase-4f-facade-cue-model-hardening.md`
- Existing runtime consumer preserved: `src/Phase4BRuntimePreview.jsx`

## 4F-1 Verification Completed

- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4f-facade-cue-model.mjs`
- Full existing 4D/4C/4B verifier chain.
- `npm run build`
- `git diff --check`

## Completed 4E-5 Result

Batch 4E-5 corrected the endpoint facade proof so Manhattan and Franklin endpoint facade records read more clearly as grounded architectural QA volumes rather than ghosted translucent panels. The pass remains QA-only, evidence-informed, non-factual, and normal-mode protected.

What changed:

- Updated the 4E fixture to phase `4E-5` with a QA-only render-legibility contract, opacity minimums, required silhouette hierarchy, computed-render-gap policy, and wider Franklin rendered slot offsets.
- Extended the 4E verifier to compute rendered facade extents from the geometry cue plus QA composition, enforce minimum gaps, require opaque mass/face/return/base/ground-contact values, require side returns and curb/sidewalk grounding, and preserve blocked claims.
- Reworked the QA renderer so evidence facade boxes are born opaque/depth-writing, the canvas clears as a non-alpha renderer, evidence-target graybox underlays are hidden in QA, synthetic context remains translucent, and secondary detail layers no longer dominate the endpoint silhouette.
- Recaptured normal, QA overview, Manhattan endpoint, Franklin endpoint, and mobile containment screenshots under `docs/review-screenshots/phase-4e-5-opaque-volumetric-legibility-pass/`.

Blocked:

- No Mapillary/KartaView work.
- No source expansion.
- No facade model hardening beyond checks needed for this rendering correction.
- No storefront/frontage/entrance claims.
- No business linkage.
- No production assets.
- No normal-mode exposure.
- No corridor-wide expansion.
- No 4F work.

## Updated Roadmap Posture

This brief records completed and Batu-accepted 4G source-policy and coverage-audit contract work and holds at the post-4G stop gate. It does not open 4G-A, 4G-B, source expansion, NYC 3D / CityGML / 3DCityDB access or audit, Mapillary/KartaView access or audit, source ingestion, Google 3D Tiles/Street View benchmark work, Qwen/Oxen visual-system work, corridor expansion, business linkage, exact storefront/frontage/entrance claims, production assets, normal-mode exposure, or art-direction translation.

Current state:

- Existing scene state: source-backed graybox Greenpoint Ave corridor plus QA-only endpoint facade experiments.
- 4E-4 received a conditional pass.
- 4E-5 passed Batu visual review.
- 4F-1 is approved by Batu.
- 4G is accepted by Batu as complete.
- No authoritative business linkage, exact storefront/frontage/entrance claims, production assets, normal-mode exposure, or full art-directed corridor exists yet.

Planned gate sequence after Batu review, subject to later explicit current briefs:

1. 4E gate: endpoint facade visual review.
2. 4F: facade cue model hardening.
3. 4G: external source policy and coverage audit contract.
4. 4G-A: geometry source audit for NYC 3D / CityGML / 3DCityDB.
5. 4G-B: facade evidence source audit for Mapillary/KartaView.
6. 4H: facade evidence intake workflow.
7. 4I: corridor facade cue expansion.
8. 4J: storefront bay/frontage candidate layer.
9. 4K: business/source linkage.
10. 4L: evidence-backed QA corridor render.
11. 4M: asset registry / visual system / art-direction translation.
12. 4N: normal-mode promotion + recognition QA.

4G must keep geometry confidence separate from facade evidence. NYC 3D / CityGML / 3DCityDB is a future geometry-confidence candidate only: it may help evaluate building heights, massing, roof volumes, block gaps, and better review-only geometry containers, but it must not prove storefront frontage, entrances, tenants, signage, facade appearance, or business assignment. Mapillary/KartaView are preferred external candidate imagery lanes for facade/storefront evidence pending explicit source-policy approval, not approved primary production sources. Batu-supplied imagery remains the controlled fallback and adjudication source for gaps, ambiguity, or unsupported claims. Google 3D Tiles/Street View remains benchmark-only or narrow-exception material unless separately cleared, and must not become source-of-truth, stored facade reference, extracted geometry, texture source, training input, or production visual pipeline. Qwen/Oxen is deferred to 4M as a possible visual-system accelerator trained only from owned/approved references, deterministic cue blueprints, and Batu-approved style targets.

## Completed 4E-4 Result

Batch 4E-4 corrected the six QA-only evidence-informed endpoint facade records so they render as visibly separate, grounded, volumetric endpoint corner building blocks instead of clustered flat facade props.

What changed:

- Added QA-only slot/depth metadata to the 4E fixture: streetwall slots, slot gaps, footprint depth, facade thickness, corner return depth, storefront setback, sign-band depth, window relief depth, parapet/cornice projection, street-edge alignment, ground-plane extent, and synthetic-context visibility policy.
- Extended the 4E verifier to require exactly six rendered QA records, six unique visual slots, minimum depth/separation values, real side returns, QA-only status, blocked claims, and non-promotable synthetic context.
- Reworked the existing Three.js QA runtime so evidence facades render as volumetric blocks with body depth, front facade thickness, return walls, storefront setback, projected sign bands, window relief, parapet/cornice relief, contact shadow, sidewalk/curb/street slabs, and very low-contrast synthetic context.
- Tuned Manhattan and Franklin endpoint review cameras and QA UI so the required screenshots frame grounded endpoint architecture without the large semantic panel covering the scene.
- Captured normal, QA overview, Manhattan endpoint, Franklin endpoint, and mobile containment screenshots under `docs/review-screenshots/phase-4e-4-endpoint-facade-record-separation-depth-correction/`.

Preserved boundaries:

- QA-only evidence-informed facade records.
- Normal mode remains protected.
- Business evidence remains not connected.
- Synthetic context remains labeled as non-evidence placeholder and cannot promote to evidence.
- No real business identity, signage text/logos, exact storefront frontage, exact address, active-status claim, production asset, normal-mode exposure, public/product claim, source expansion, new renderer, or new package.
- No 4F work.

## Completed 4E Review Packet

- Fixture: `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- Verifier: `scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- Runtime consumer: `src/Phase4BRuntimePreview.jsx`
- Styles: `src/styles.css`
- Review note: `docs/phase-4e-evidence-informed-qa-facade-scene-proof.md`
- Screenshots: `docs/review-screenshots/phase-4e-4-endpoint-facade-record-separation-depth-correction/`

## Verification Completed

- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- Full existing 4D/4C/4B verifier chain.
- `npm run build`
- `git diff --check`
- Browser QA smoke at `http://127.0.0.1:5180/`:
  - normal mode hides QA facades and reports evidence facades as QA off;
  - QA mode shows 6 evidence-informed facades and 6 unique visual slots;
  - Manhattan and Franklin endpoint screenshots show three separated volumetric facade/building blocks per endpoint;
  - business evidence remains not connected;
  - synthetic context remains labeled non-evidence;
  - large semantic panel is hidden during QA screenshot review;
  - raw prohibited fields are absent from visible UI.

## Stop Conditions

Stop and report before:

- Opening any later batch without Batu approval.
- Proceeding to 4G-A, 4G-B, 4H, or any later batch.
- Connecting business evidence.
- Selecting, approving, or linking an evidence record to a specific geometry container as authoritative.
- Creating storefront anchors.
- Assigning tenants to storefronts/frontages.
- Claiming business identity, active status, signage, entrance ownership, frontage width/order, material/color, exact address placement, or exact facade truth.
- Generating, cropping, transforming, stylizing, tracing, texturing, or ingesting new imagery.
- Using restricted or terms-uncertain sources, scraping, live APIs, or source expansion.
- Treating endpoint evidence as corridor-wide evidence.
- Creating mid-corridor facade candidates.
- Modifying normal runtime rendering.
- Creating production cards, visual-system work, production assets, or production/public claims.

## Current State

Docs authority routing:

- `docs/DOCS_INDEX.md`
- `docs/phase-4-execution-roadmap.md`

Phase 4 primary operational roadmap:

- `docs/phase-4-execution-roadmap.md`

Supporting detail docs:

- `docs/phase-4e-evidence-informed-qa-facade-scene-proof.md`
- `docs/phase-4g-external-source-policy-coverage-audit-contract.md`
- `docs/phase-4f-facade-cue-model-hardening.md`
- `docs/phase-4d-claim-ladder-matching-contract.md`
- `docs/phase-4d-candidate-poi-qa-fixture.md`
- `docs/phase-4d-batu-supplied-facade-evidence-packet.md`
- `docs/phase-4d-corner-anchor-candidates.md`
- `docs/phase-4d-corner-evidence-folder-reconciliation.md`
- `docs/phase-4d-manual-corner-association-review.md`
- `docs/phase-4d-provisional-corner-association-shortlist.md`
- `docs/phase-4c-recognizable-facade-cue-plan.md`
