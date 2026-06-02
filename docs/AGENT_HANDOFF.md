# Greenpoint Explorer Agent Handoff

## Current Goal
Continue Phase 2 data-driven scene work without requiring Batu unless a gated decision is reached.

## Current Approved Direction
- Source-of-truth is repo docs and committed state.
- Do not return to docs-only busywork unless implementation is blocked.
- Keep work data-driven and evidence-aware.
- Do not invent exact storefront/frontage/address-placement claims without source support.
- Prefer small, committable batches.
- Preserve build/test hygiene.

## Overnight Task Queue
1. Read AGENTS.md, docs/PLAN.md, docs/CURRENT_EXECUTION_BRIEF.md, docs/MVP_EXECUTION_LEDGER.md, and latest git log.
2. Identify the next unblocked Phase 2 implementation task.
3. Execute only one bounded batch at a time.
4. Run verification.
5. Commit if verification passes.
6. Append a concise batch report to this file.
7. Continue to the next unblocked batch.
8. Stop if approval, source judgment, visual judgment, partnership decision, destructive change, or scope expansion is required.

## Overnight Review-Hold Rule
If the repo is in a review hold but the previous committed batch completed cleanly and the next step is a narrow continuation of the already-approved Phase 2 direction, Codex may open the next implementation brief itself.

## Hard Stop Conditions
Stop and write NEEDS_BATU if:
- Visual direction requires taste judgment.
- A real-world factual claim lacks evidence.
- The next step requires buying/API access/partner outreach.
- A large architectural pivot is needed.
- Build/test failures cannot be resolved locally.
- The task would delete or rewrite meaningful prior work.
- You are unsure whether the result still matches Greenpoint Explorer’s MVP intent.

## Required Batch Report Format

### Batch YYYY-MM-DD HH:MM
Status: complete | blocked | needs_batu
Commit: <hash or none>
Files changed:
- ...
Verification:
- ...
What changed:
- ...
Remaining:
- ...
Next recommended batch:
- ...

### Batch 2026-06-01 20:31
Status: needs_batu
Commit: none
Files changed:
- `docs/AGENT_HANDOFF.md`
Verification:
- Read `AGENTS.md`, `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/AGENT_HANDOFF.md`, latest git log, and current git status.
- Confirmed latest commit is `633d0ed feat: add source evidence drift guard`.
- Confirmed current git status before this handoff note had `docs/AGENT_HANDOFF.md` untracked.
What changed:
- NEEDS_BATU: No implementation batch was started because `docs/CURRENT_EXECUTION_BRIEF.md` is a Phase 2I review hold and does not open a next Phase 2 implementation task.
Remaining:
- Batu must accept, revise, or reject the Phase 2I source-evidence drift guard before another bounded Phase 2 implementation batch can proceed.
- Current brief blocks package scripts, CI, expanded ingestion/parity coverage, scraping/API calls, raster/visual changes, production data, production assets, full MVP-29G screenshot QA, and broader Greenpoint coverage.
Next recommended batch:
- After Batu accepts or revises Phase 2I, open a new bounded brief for one specific Phase 2 task, such as generated fixture metadata refinement, package-script/CI discussion, generated-output inspection artifacts, raw-input expansion, fixture regression checks, or a deliberately scoped source-evidence merge/review workflow.

### Batch 2026-06-02 20:41
Status: complete
Commit: a752706
Files changed:
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`
Verification:
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 2 --expect-targets-without-evidence 3`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output /tmp/source-evidence.coverage.phase-2j.verify.json --expect-targets-with-evidence 2 --expect-targets-without-evidence 3`
- Phase 2I drift guard against the Phase 2H runtime fixture and Phase 2D reviewed reference.
- Expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, which still fails on the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`
What changed:
- Accepted the Phase 2I review hold for continuation and opened/completed Phase 2J Source Evidence Coverage Inspector.
- Added a local review-only inspector that joins the current scene manifest with the Phase 2H generated runtime source-evidence fixture.
- Generated a deterministic coverage report showing 2 of 5 current targets with linked generated evidence and 3 manifest-source-only targets remaining as raw-input expansion candidates.
- Preserved the Phase 2D reviewed parity fixture and Phase 2H generated runtime fixture unchanged.
Remaining:
- Batu must accept, revise, or reject the Phase 2J coverage inspector and report.
- Production schemas/APIs, package scripts/CI, scraping/API calls, raster or visual work, exact storefront/frontage/address/station geometry claims, and broad coverage remain blocked.
Next recommended batch:
- If Phase 2J is accepted, open one bounded local raw-input expansion for a single manifest-source-only target, with parity and coverage updated afterward.

### Batch 2026-06-02 20:58
Status: complete
Commit: 04d201e
Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/data/source-evidence/raw/official-locations.phase-2k.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`
Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0`
- Expanded Phase 2I drift guard with all three raw inputs, five expected evidence IDs, Phase 2H runtime fixture, and Phase 2D reviewed reference.
- Temp-output coverage verification with 5 expected targets with generated evidence and 0 expected targets without generated evidence.
- Expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, which still fails on the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`
What changed:
- Accepted Phase 2J for continuation and opened/completed Phase 2K Raw Input Expansion + First Evidence Ingestion Slice.
- Added a review-only official-location raw fixture for McDonald's, Dunkin', and Citizens Bank using source context already recorded in the scene manifest.
- Regenerated the generated runtime source-evidence fixture to five records and regenerated the coverage report to 5/5 current targets with generated evidence.
- Preserved the Phase 2D reviewed parity fixture unchanged and kept additive parity guarding the reviewed reference records.
Remaining:
- Batu must accept, revise, or reject the Phase 2K raw-input expansion, additive parity behavior, expanded generated runtime fixture, and regenerated coverage report.
- Production schemas/APIs, package scripts/CI, scraping/API calls, raster or visual work, exact storefront/frontage/address/station geometry claims, source-authority decisions, and broad coverage remain blocked.
Next recommended batch:
- If Phase 2K is accepted, open one bounded follow-up for fixture metadata refinement, generated-output inspection ergonomics, app QA inspector surfacing of expanded evidence, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow.

### Batch 2026-06-02 21:03
Status: complete
Commit: 0d6a782
Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/sceneManifest.js`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json`
- `src/data/source-evidence/raw/official-locations.phase-2k.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`
Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0`
- Expanded drift guard with all three raw inputs, five expected evidence IDs, Phase 2H runtime fixture, and Phase 2D reviewed reference.
- Negative readiness check asserting 5 product-copy-ready targets; it failed as intended.
- Expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, which still fails on the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`
What changed:
- Accepted Phase 2K for continuation and opened/completed Phase 2L Source Evidence Confidence/Quality Tiering.
- Added `evidenceStrength` and `claimReadiness` to raw/generated source-evidence records and validated those fields in the app-loaded fixture path.
- Updated the coverage report so 5/5 generated coverage is reported separately from readiness: 0 product-copy-ready targets, 5 review-only targets, 0 blocked targets.
- Preserved Phase 2D reviewed parity behavior and did not change visual rendering.
Remaining:
- Batu must accept, revise, or reject the Phase 2L quality tiers, readiness thresholds, generated runtime fixture, and regenerated coverage report.
- Product-copy readiness, production schemas/APIs, package scripts/CI, scraping/API calls, raster or visual work, exact storefront/frontage/address/station geometry claims, source-authority decisions, and broad coverage remain blocked.
Next recommended batch:
- If Phase 2L is accepted, open one bounded follow-up for app QA inspector surfacing of quality/readiness fields, fixture metadata refinement, generated-output inspection ergonomics, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow.

### Batch 2026-06-02 21:22
Status: complete
Commit: 8cc8cce
Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/sceneManifest.js`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json`
- `src/data/source-evidence/raw/official-locations.phase-2k.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`
Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0 --expect-identity-name-allowed-targets 5 --expect-category-business-type-allowed-targets 0 --expect-address-location-allowed-targets 4 --expect-storefront-facade-blocked-targets 5 --expect-entrance-frontage-geometry-blocked-targets 5`
- Expanded drift guard with all three raw inputs, five expected evidence IDs, Phase 2H runtime fixture, and Phase 2D reviewed reference.
- False-promotion expected-fail check changing one generated record to `product_copy_ready`; it failed as intended because promotion gates remained review-only/blocked.
- Expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, which still fails on the omitted preserved uncertainty/gap field.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`
What changed:
- Accepted Phase 2L for continuation and opened/completed Phase 2M Evidence Promotion Gates.
- Added required claim-level `promotionGates` for identity/name, category/business-type, address/location, storefront/facade, and entrance/frontage/geometry.
- Enforced that `product_copy_ready` requires all promotion gates to be `allowed`.
- Updated the coverage report to show generated coverage separately from product readiness and claim-level promotion blockers.
- Preserved Phase 2D reviewed parity behavior and did not change visual rendering.
Remaining:
- Batu must accept, revise, or reject the Phase 2M promotion gates, product-copy promotion rule, generated runtime fixture, and regenerated coverage report.
- Product-copy readiness, production schemas/APIs, package scripts/CI, scraping/API calls, raster or visual work, exact storefront/frontage/address/station geometry claims, source-authority decisions, and broad coverage remain blocked.
Next recommended batch:
- If Phase 2M is accepted, open one bounded follow-up for app QA inspector surfacing of promotion blockers, fixture metadata refinement, generated-output inspection ergonomics, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow.

### Batch 2026-06-02 21:47
Status: complete
Commit: 286f31d
Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`
Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0 --expect-identity-name-allowed-targets 5 --expect-category-business-type-allowed-targets 1 --expect-address-location-allowed-targets 4 --expect-storefront-facade-blocked-targets 5 --expect-entrance-frontage-geometry-blocked-targets 5`
- Grillpoint Phase 2N missing-evidence report contract check.
- Grillpoint-only category promotion check.
- Expanded drift guard with all three raw inputs, five expected evidence IDs, Phase 2H runtime fixture, and Phase 2D reviewed reference.
- False-promotion expected-fail check changing one generated record to `product_copy_ready`; it failed as intended because facade and geometry gates remained blocked.
- Expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, which still fails on the omitted preserved uncertainty/gap field.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`
What changed:
- Accepted Phase 2M for continuation and opened/completed Phase 2N Single-Place Evidence Promotion Spike for Grillpoint.
- Added an explicit Grillpoint category-context raw claim and promoted only Grillpoint's category/business-type gate to `allowed`.
- Added a machine-readable Grillpoint missing-evidence contract for storefront/facade and entrance/frontage/geometry raw inputs.
- Preserved Phase 2D reviewed parity behavior through additive claim-mapping parity and did not change visual rendering.
Remaining:
- Auto-advance may continue only if the next batch remains narrow, verified, source-evidence focused, and within the approved Phase 2 direction.
- Product-copy readiness, production schemas/APIs, package scripts/CI, scraping/API calls, raster or visual work, exact storefront/frontage/address/station geometry claims, source-authority decisions, and broad coverage remain blocked.
Next recommended batch:
- A bounded follow-up for approved facade/reference raw-input provenance, app QA inspector surfacing of promotion blockers, fixture metadata refinement, generated-output inspection ergonomics, or a deliberately scoped source-evidence merge/review workflow.
