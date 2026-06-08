# Current Execution Brief - Phase 4I Packet Complete At Batu Review Gate

Status: `4I-1`, `4I-2`, and `4I-3` are complete and verified inside Batu's bounded Phase 4I corridor facade cue expansion packet.

Current executable batch: none. Pending Batu visual/review gate and later approval or updated current brief.

Pre-authorized queue: none.

Self-advance allowed: no.

Hard Batu gate: stop. Do not proceed to 4J storefront bay/frontage candidates, 4K business/source linkage, 4L evidence-backed QA corridor render, 4M visual-system/art-direction work, 4N normal-mode promotion, source promotion, real imagery intake, source access/download/cache/ingestion/render/extraction/training/use, business linkage, exact storefront/frontage/entrance/address/signage/tenant/material/active-status claims, normal-mode exposure, production use, new dependencies, credentials, paid APIs, renderer changes, architecture changes, or public/product claims without later Batu approval and an updated current brief or explicit pre-authorized queue.

Owner boundary: Batu owns packet acceptance, visual/legibility review, source approval, usage-rights acceptance, source promotion, claim-level promotion, production/public claims, facade/storefront/frontage/entrance evidence acceptance, exact business/storefront/frontage/entrance/address/signage/tenant/material/active-status claims, credential/API approval, architecture-boundary approval, visual-system/art-direction work, and any later MVP gates.

## Completed Packet Result

### 4I-1 Corridor Facade Cue Expansion Plan

What changed:

- Added `docs/phase-4i-1-corridor-facade-cue-expansion-plan.md`.
- Added `scripts/verify-phase-4i-1-corridor-facade-cue-expansion-plan.mjs`.
- Defined 4I expansion boundaries that distinguish endpoint evidence-backed records, mid-corridor insufficient-evidence records, and blocked/no-evidence gaps.
- Defined exact 4I-2 fixture/verifier boundaries and 4I-3 QA-runtime legibility boundaries.

### 4I-2 Corridor Facade Cue Fixture Expansion

What changed:

- Added `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json`.
- Added `scripts/verify-phase-4i-corridor-facade-cues.mjs`.
- Added `docs/phase-4i-corridor-facade-cue-expansion.md`.
- Created 142 deterministic QA-only corridor facade cue records:
  - 6 endpoint evidence-backed records preserving existing 4E/4F repo-local Batu-supplied evidence references.
  - 36 mid-corridor insufficient-evidence/manual-draft placeholder records.
  - 100 blocked/no-evidence gap records.
- Preserved stable 4B scene IDs and 4C geometry cue references.

### 4I-3 QA Corridor Facade Render Legibility Pass

What changed:

- Updated `src/Phase4BRuntimePreview.jsx` to import and consume the 4I corridor cue fixture in QA mode only.
- Added subdued QA-only mid-corridor placeholder facade bands for `mid_corridor_insufficient_evidence` records.
- Kept existing 4E/4F endpoint evidence-backed facade volumes visually primary.
- Kept blocked/no-evidence records visible in QA summaries/inspector readouts instead of creating facade geometry.
- Added QA panel, review count, legend, and inspector readouts for 4I lane/status/provenance.
- Added `scripts/verify-phase-4i-qa-runtime-legibility.mjs`.
- Updated `src/styles.css` with the 4I corridor cue legend swatch only.

## Preserved Boundaries

- No external source access, download, cache, ingestion, rendering, extraction, or training.
- No source promotion.
- No business linkage.
- No authoritative storefront anchors.
- No exact frontage, entrance, address, sign, tenant, material, active-status, or business claims.
- No normal-mode facade cue exposure.
- No production assets.
- No new dependencies, credentials, paid APIs, renderer replacement, architecture changes, Google Street View / Google 3D Tiles use, Qwen/Oxen work, 4J, 4K, or 4M work.

## Verification Completed

- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `node scripts/verify-phase-4i-corridor-facade-cues.mjs`
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4f-facade-cue-model.mjs`
- `node scripts/verify-phase-4h-1-facade-evidence-intake-workflow.mjs`
- `node scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`
- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `npm run build`
- `git diff --check`

Browser QA note: local dev server startup was blocked by sandbox network binding permissions (`listen EPERM` on `127.0.0.1:5173`), and in-app browser navigation to the built `file://` artifact was blocked by browser URL policy. Visual browser smoke QA remains pending outside this restricted environment.

Commit note: batch commits were attempted but blocked by local `.git` metadata write permissions (`.git/index.lock` operation not permitted). The working tree contains intended packet files only.

## Unresolved Decisions For Batu

- Whether to accept the completed 4I packet.
- Whether the QA runtime legibility pass is visually sufficient.
- Whether to open a narrow 4I corrective pass, 4J storefront bay/frontage candidates, or another later packet.
- Whether any source promotion, claim promotion, source access/storage/display, normal/product exposure, production use, business linkage, exact claim work, visual-system/art-direction work, dependency/API/credential work, renderer change, or architecture change may open.
