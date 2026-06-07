# Current Execution Brief - Post-4D-5 Corner Anchor Candidate Review

Status: Batu approved `Batch 4D-4: Batu-supplied facade evidence packet`. `Batch 4D-5: Corner evidence-to-geometry anchor candidates` is complete pending Batu review. The project now has a corrected corner-scoped 4D-4 evidence packet, a deterministic QA-only 4D-5 corner anchor-candidate fixture, verifier coverage, and QA inspector visibility without creating authoritative storefront anchors, tenant frontage assignments, business identity, active-status, signage, entrance ownership, frontage width/order, material/color, exact facade truth, production cards, normal runtime rendering, new imagery, source expansion, or visual-system work.

Current executable batch: none.

Proposed next authorization: none. Batu review is required before any later anchor, evidence, facade, storefront, visual, or source work.

Pre-authorized queue: none.

Hard Batu review gate: stop here for Batu review of 4D-5. Do not self-open any later 4D batch.

Self-advance allowed: no.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, usage-rights acceptance, production/public claims, visual acceptance, geometry-confidence acceptance, evidence-to-container association acceptance, facade imagery approval, exact geometry/frontage/entrance approval, business verification approval, evidence-approved facade cue approval, art-direction approval, and any later MVP gates.

## Operating Model

Approval governs boundaries, not every action.

Batu approval should define the active work packet, allowed scope, hard stop conditions, truth gates, verification expectations, commit behavior, and final review gate. Codex executes inside those boundaries and stops when a boundary, truth gate, verification failure, dirty-tree issue, or unresolved ambiguity is hit.

Truth gates remain strict: no real business/storefront/tenant/facade/frontage/entrance/signage claims without approved evidence, no source expansion without approval, and no claim-level escalation without approval.

QA mode remains the experimental product lab: it may contain draft, non-factual, status-labeled approximations, while normal mode remains protected.

## 4D Outputs

4D-1 completed a deterministic review-only geometry validation/gap report and QA-only inspector confidence visibility for 142 rendered buildings: 126 `safe`, 14 `uncertain`, and 2 `blocked`.

4D-2 completed `docs/phase-4d-claim-ladder-matching-contract.md`, defining claim states and nine claim levels from geometry container through landmark/special-treatment.

4D-3 completed a synthetic/manual placeholder candidate POI fixture and QA-only runtime marker/inspector layer. It did not add real POIs, businesses, active-status truth, storefront assignments, facade imagery, source expansion, or production cards.

4D-4 completed a review-only facade evidence packet and verifier. 4D-5 corrected the packet so every evidence record is explicitly corner-scoped and not corridor-wide.

4D-5 completed:

- Updated `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json`.
- Updated `scripts/verify-phase-4d-facade-evidence.mjs`.
- Added `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json`.
- Added `scripts/verify-phase-4d-corner-anchor-candidates.mjs`.
- Added `docs/phase-4d-corner-anchor-candidates.md`.
- Added QA-only inspector visibility for corner anchor candidates in `src/Phase4BRuntimePreview.jsx`.
- Identified deterministic geometry containers for both corners.
- Kept all evidence-to-specific-geometry associations unresolved rather than forcing a match.
- Kept Franklin blocked because no eligible repo-local Franklin facade evidence record is present in the 4D-4 packet.
- Preserved mid-corridor facade evidence as absent and `blocked_insufficient_evidence`.

4D-5 result:

- Evidence records by corner scope: `manhattan_greenpoint`: 11, `franklin_greenpoint`: 0, `unresolved_unknown`: 0.
- Anchor candidates: 11 QA-only unresolved candidates.
- Linked candidates: 0.
- Blocked corner scopes: 1, Franklin blocked for missing eligible evidence.
- Mid-corridor anchor candidates: 0.

Verification completed:

- `node scripts/verify-phase-4d-facade-evidence.mjs`
- `node scripts/verify-phase-4d-corner-anchor-candidates.mjs`
- `node scripts/verify-phase-4d-candidate-pois.mjs`
- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `npm run build`
- `git diff --check`

`npm run build` passed with the existing large-bundle warning only.

## Hard Stops

Stop and report before:

- Opening any later 4D batch.
- Linking unresolved candidates to specific geometry containers.
- Creating authoritative storefront anchors.
- Assigning tenants to storefronts/frontages.
- Inferring business identity, active status, signage, entrance ownership, frontage width, storefront order, material, color, or exact facade truth.
- Generating, cropping, transforming, stylizing, or ingesting new imagery.
- Using restricted or terms-uncertain sources, scraping, live APIs, or source expansion.
- Modifying normal runtime rendering.
- Creating production cards, visual-system work, production assets, or production/public claims.

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
- `docs/phase-4d-corner-anchor-candidates.md`
- `docs/phase-4c-recognizable-facade-cue-plan.md`

No further 4D implementation work is open or queued.
