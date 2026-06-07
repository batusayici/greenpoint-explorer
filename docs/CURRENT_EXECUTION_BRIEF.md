# Current Execution Brief - Post-4D-4 Facade Evidence Packet Review

Status: Batu approved `Batch 4D-3: Candidate POI QA fixture and overlay`. `Batch 4D-4: Batu-supplied facade evidence packet` is complete pending Batu review. The project now has a deterministic review-only facade evidence packet shape, repo-local Batu-supplied/project-owned evidence index, verifier, and usage/claim boundaries without adding storefront anchors, tenant frontage assignments, facade imagery generation, normal runtime rendering, production assets, exact facade/signage/entrance/material/color claims, active-status claims, source expansion, scraping, live APIs, or restricted-source imagery.

Current executable batch: none.

Proposed next authorization: `Batch 4D-5: Evidence-backed facade/storefront anchors`, only after Batu reviews and accepts the 4D-4 evidence packet or gives alternate direction.

Pre-authorized queue: none.

Hard Batu review gate: stop here for Batu review of 4D-4. Do not self-open 4D-5 or any later 4D batch.

Self-advance allowed: no.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, usage-rights acceptance, production/public claims, visual acceptance, geometry-confidence acceptance, facade imagery approval, exact geometry/frontage/entrance approval, business verification approval, evidence-approved facade cue approval, art-direction approval, and any later MVP gates.

## Operating Model

Approval governs boundaries, not every action.

Batu approval should define the active work packet, allowed scope, hard stop conditions, truth gates, verification expectations, commit behavior, and final review gate. Codex executes inside those boundaries and stops when a boundary, truth gate, verification failure, dirty-tree issue, or unresolved ambiguity is hit.

Truth gates remain strict: no real business/storefront/tenant/facade/frontage/entrance/signage claims without approved evidence, no source expansion without approval, and no claim-level escalation without approval.

Commit behavior is packet-scoped. Codex may commit after each successful batch only when the packet explicitly allows commit-after-batch behavior, only allowed files changed, verification passes, final status is clean except intended changes, and the commit message clearly names the batch.

QA mode remains the experimental product lab: it may contain draft, non-factual, status-labeled approximations, while normal mode remains protected.

## 4D-1 Output

4D-1 completed:

- Generated `src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json`.
- Added `scripts/verify-phase-4d-geometry-validation.mjs`.
- Added QA-only runtime confidence visibility in the existing inspector and QA panel.
- Classified 142 rendered buildings: 126 `safe`, 14 `uncertain`, and 2 `blocked`.
- Preserved normal-mode protection: 4D confidence labels are hidden until QA is enabled.

## 4D-2 Output

4D-2 completed:

- Added `docs/phase-4d-claim-ladder-matching-contract.md`.
- Defined claim states and nine claim levels from geometry container through landmark/special-treatment.
- Preserved no POIs, no businesses, no facade imagery, no storefront anchors, no tenant frontage matches, no runtime visual changes, no source expansion, and no production claims.

## 4D-3 Output

4D-3 completed:

- Added `src/data/candidate-pois/greenpoint-ave-manhattan-to-franklin.phase-4d-candidate-pois.v0.1.json`.
- Added `scripts/verify-phase-4d-candidate-pois.mjs`.
- Added `docs/phase-4d-candidate-poi-qa-fixture.md`.
- Added six deterministic synthetic/manual placeholder candidate records and QA-only runtime candidate markers.
- Preserved no real POIs, businesses, active-status truth, storefront assignments, facade imagery, source expansion, or production cards.

## 4D-4 Output

4D-4 completed:

- Added `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json`.
- Added `scripts/verify-phase-4d-facade-evidence.mjs`.
- Added `docs/phase-4d-batu-supplied-facade-evidence-packet.md`.
- Defined the facade evidence packet shape: stable evidence ID, source owner/supplier, file path/reference, capture/provenance notes, allowed/disallowed use, usage-rights status, associated corridor side or geometry container, confidence/review status, supported and blocked 4D-2 claim levels, and manual review notes.
- Indexed 11 eligible repo-local Batu-supplied/project-owned field-photo references as review-only evidence records.
- Excluded known restricted or exception-only material from the 4D-4 fixture.
- Preserved the hard boundary: evidence records do not create storefront anchors, tenant frontage assignments, geometry-container associations, exact facade/signage/entrance/material/color claims, active-status claims, normal runtime rendering, production assets, asset-generation input, source expansion, scraping, live APIs, or visual-system work.

Verification completed:

- `node scripts/verify-phase-4d-facade-evidence.mjs`
- `node scripts/verify-phase-4d-candidate-pois.mjs`
- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `git diff --check`

`npm run build` was not run because no runtime or implementation files were touched.

## Proposed Phase 4D Sequence

1. `Batch 4D-1: Geometry validation and gap audit`
2. `Batch 4D-2: Claim ladder / matching contract`
3. `Batch 4D-3: Candidate POI QA fixture and overlay`
4. `Batch 4D-4: Batu-supplied facade evidence packet`
5. `Batch 4D-5: Evidence-backed facade/storefront anchors`
6. Asset registry / visual system work only after evidence and anchor models are defined.

## Proposed Batch: 4D-5

`Batch 4D-5: Evidence-backed facade/storefront anchors` is proposed only. It is not executable until Batu explicitly authorizes it.

Expected outputs if later authorized:

- A narrow review-only anchor fixture for records Batu accepts from the 4D-4 evidence packet.
- Explicit links between accepted evidence, safe or explicitly reviewed geometry containers, and blocked claim states.
- Verifier coverage that prevents tenant frontage, exact entrance, exact facade/signage, active-status, production-asset, or normal-runtime promotion unless a later brief explicitly opens that claim.

4D-5 must not include:

- Source expansion, restricted-source imagery, scraping, live APIs, generated facade imagery, production assets, asset registry, visual-system work, real business verification, exact active-status claims, or normal runtime visual claims unless a later brief explicitly opens them.

## Hard Stops

Stop and report before:

- Implementing 4D-5.
- Opening another generic fictional-facade tuning batch.
- Source acquisition, real-source POI work, business verification, or live-data work.
- Facade imagery generation, asset registry, visual-system work, art-direction pass, production visual assets, or package/dependency additions.
- Storefront-anchor implementation, tenant-frontage assignment, evidence-approved facade cues, exact facade/frontage/entrance/signage/window/door/awning/material/color/address/active-business, or public/product-ready claims.
- Any change that would require broad architecture, product, art-direction, public-interface, or source-policy decisions.

## Current State

Docs authority routing:

- `docs/DOCS_INDEX.md`
- `docs/phase-4-execution-roadmap.md`

Phase 4 primary operational roadmap:

- `docs/phase-4-execution-roadmap.md`

Supporting detail docs:

- `docs/phase-4d-claim-ladder-matching-contract.md`
- `docs/phase-4d-candidate-poi-qa-fixture.md`
- `docs/phase-4d-batu-supplied-facade-evidence-packet.md`
- `docs/phase-4c-recognizable-facade-cue-plan.md`
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/phase-3-closeout.md`

The Phase 4B/4C runtime, fixtures, verifiers, QA facade slice, 4D-1 geometry validation report, 4D-2 claim ladder contract, 4D-3 synthetic candidate POI QA fixture, and 4D-4 review-only facade evidence packet remain preserved. No further 4D implementation work is open or queued.
