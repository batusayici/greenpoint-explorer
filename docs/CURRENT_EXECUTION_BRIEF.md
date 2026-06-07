# Current Execution Brief - Post-4D-6 Corner Evidence Reconciliation Review

Status: Batu approved `Batch 4D-5: Corner evidence-to-geometry anchor candidates`. `Batch 4D-6: Corner evidence folder reconciliation + Franklin evidence intake` is complete pending Batu review. The project now has reconciled corner evidence folders, 11 Manhattan evidence records, 11 Franklin evidence records, zero stale flat evidence paths, and 22 QA-only unresolved corner anchor candidates without evidence-to-geometry links.

Current executable batch: none.

Proposed next authorization: none. Batu review is required before any later geometry linking, anchor, evidence, facade, storefront, visual, or source work.

Pre-authorized queue: none.

Hard Batu review gate: stop here for Batu review of 4D-6. Do not self-open any later 4D batch.

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

4D-6 completed:

- Reconciled Manhattan evidence paths to `docs/mvp-reference-images/greenpoint manhattan corner/`.
- Added Batu-supplied Franklin evidence from `docs/mvp-reference-images/greenpoint franklin  corner/`.
- Updated the 4D-4 evidence packet to 22 review-only records: 11 `manhattan_greenpoint`, 11 `franklin_greenpoint`, 0 `unresolved_unknown`.
- Added path/provenance verifier coverage so missing or stale repo-local evidence paths fail verification.
- Reconciled legacy review-scene reference path strings that pointed at moved Manhattan evidence files.
- Updated the 4D-5 anchor-candidate fixture to 22 QA-only unresolved candidates: 11 Manhattan and 11 Franklin.
- Preserved 0 linked candidates, 0 storefront anchors, 0 tenant assignments, 0 normal-mode candidates, and 0 mid-corridor candidates.
- Preserved mid-corridor evidence as `blocked_insufficient_evidence`.
- Did not link any evidence record to a specific geometry container.

Verification completed:

- `node scripts/verify-phase-4d-facade-evidence.mjs`
- `node scripts/verify-phase-4d-corner-anchor-candidates.mjs`
- `node scripts/verify-phase-4d-corner-evidence-paths.mjs`
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
- Treating Franklin evidence as corridor-wide evidence.
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
- `docs/phase-4c-recognizable-facade-cue-plan.md`

No further 4D implementation work is open or queued.
