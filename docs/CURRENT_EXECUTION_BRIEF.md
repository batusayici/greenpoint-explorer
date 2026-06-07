# Current Execution Brief - Post-4D-7 Manual Corner Association Review

Status: Batu approved `Batch 4D-6: Corner evidence folder reconciliation + Franklin evidence intake`. `Batch 4D-7: Manual corner evidence-to-geometry association review` is complete pending Batu review. The project now has a QA-only manual review packet that lists possible deterministic corner geometry containers for each Manhattan and Franklin evidence record without selecting, approving, or linking any evidence-to-geometry association.

Current executable batch: none.

Proposed next authorization: none. Batu review is required before any later geometry selection/linking, anchor, evidence, facade, storefront, visual, or source work.

Pre-authorized queue: none.

Hard Batu review gate: stop here for Batu review of 4D-7. Do not self-open any later 4D batch.

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

4D-6 reconciled moved evidence folders and added Batu-supplied Franklin evidence. The packet has 11 `manhattan_greenpoint` records, 11 `franklin_greenpoint` records, zero stale flat evidence paths, 22 QA-only unresolved corner anchor candidates, and no evidence-to-geometry links.

4D-7 completed:

- Added a QA-only manual association review fixture.
- Added a deterministic verifier for the association review fixture.
- Added a 4D-7 review doc.
- Listed 8 possible deterministic corner geometry containers for each Manhattan evidence record.
- Listed 8 possible deterministic corner geometry containers for each Franklin evidence record.
- Kept every review record provisional, unresolved, review-only, QA-only, and not rendered in normal mode.
- Preserved 0 selected associations, 0 approved associations, 0 linked associations, 0 authoritative anchors, 0 storefront anchors, 0 tenant frontage assignments, 0 promoted claims, and 0 mid-corridor candidates.
- Preserved mid-corridor evidence as `blocked_insufficient_evidence`.

Verification completed:

- `node scripts/verify-phase-4d-manual-corner-associations.mjs`
- `node scripts/verify-phase-4d-facade-evidence.mjs`
- `node scripts/verify-phase-4d-corner-anchor-candidates.mjs`
- `node scripts/verify-phase-4d-corner-evidence-paths.mjs`
- `node scripts/verify-phase-4d-candidate-pois.mjs`
- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `git diff --check`

`npm run build` was not run because no runtime files were touched.

## Hard Stops

Stop and report before:

- Opening any later 4D batch.
- Selecting, approving, or linking an evidence record to a specific geometry container.
- Creating authoritative storefront anchors.
- Assigning tenants to storefronts/frontages.
- Inferring business identity, active status, signage, entrance ownership, frontage width, storefront order, material, color, exact address placement, or exact facade truth.
- Generating, cropping, transforming, stylizing, or ingesting new imagery.
- Using restricted or terms-uncertain sources, scraping, live APIs, or source expansion.
- Treating Franklin evidence as corridor-wide evidence.
- Creating mid-corridor candidates.
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
- `docs/phase-4d-corner-evidence-folder-reconciliation.md`
- `docs/phase-4d-manual-corner-association-review.md`
- `docs/phase-4c-recognizable-facade-cue-plan.md`

No further 4D implementation work is open or queued.
