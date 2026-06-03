# MVP Execution Ledger

Status: Active task ledger
Created: 2026-05-29
Last reconciled: 2026-06-03

## Purpose

This ledger records MVP execution batches and keeps `docs/PLAN.md` and `docs/CURRENT_EXECUTION_BRIEF.md` from drifting.

It is not a roadmap and does not authorize work by itself:

- `docs/PLAN.md` defines current phase and remaining MVP phases.
- `docs/CURRENT_EXECUTION_BRIEF.md` defines the next executable or proposed Codex task.
- This ledger records what happened, what changed, what was verified, and what pointer should be used next.

## Mandatory Reconciliation Rule

After every successful Codex batch, Codex must update all three documents before final response:

- `docs/PLAN.md`: update current phase, phase status, blockers, pending decisions, and next-task pointer only. Do not turn it into batch history.
- `docs/CURRENT_EXECUTION_BRIEF.md`: replace the completed task with the next approved/proposed executable task, or explicitly mark that the next task is pending Batu/ChatGPT approval.
- `docs/MVP_EXECUTION_LEDGER.md`: append one new entry with outcome, files changed, verification, unresolved decisions, and next pointer.

If these documents cannot be reconciled, Codex must stop and report the conflict instead of leaving stale instructions.

## Ledger Entry Template

Use this structure for future entries:

```markdown
### YYYY-MM-DD - Short Task Name

Status:
- Complete / Partial / Blocked / Proposed

Scope:
- Brief summary of authorized scope.

Files changed:
- `path`

Verification:
- Command or review performed.

Outcome:
- What changed and what did not change.

Unresolved decisions:
- Decision owner and pending decision.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to ...
```

## Current Control State

- Current phase: Phase 2DTR - Data-to-Raster MVP Proof is the active Phase 2 sub-track. DTR-11 is now the active review-only interactive demo raster in the app; MVP-29E remains the manually composed four-corner raster baseline/reference.
- Current next pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next state: `docs/CURRENT_EXECUTION_BRIEF.md` records the DTR-11 interactive demo integration, Strategic Signal Doc Reconciliation, and targeted MVP card/hover correction as complete for Batu review. Vercel Preview publication is the selected share route but is blocked in Codex by local Vercel CLI auth/write access. Phase 2DTR is complete for MVP-feedback purposes; do not open DTR-12 or another facade/raster correction loop unless external feedback shows facade fidelity is a decisive blocker. Batu has unblocked evidence-backed exact MVP review work for storefront/facade/frontage/order/entrance/window geometry, exact address placement, and Greenpoint G station/entrance geometry. Future batches should build visible MVP proof first and preserve gates as constraints. Product-copy readiness, promotion weakening, unsupported exact geometry claims, production/public exact-geometry claims, production raster asset edits, normal-mode code-native primary world art, broader app refactor, scraping, external app-code API calls, package/tooling changes, package-script/CI additions, source-vendor decisions, Phase 3 implementation, full MVP-29G screenshot QA, and MVP-30 QA/demo freeze remain blocked unless a later brief explicitly opens them.
- Stable roadmap: `docs/PLAN.md`.
- Detailed MVP scope authority: `docs/MVP_SCOPE.md`.
- Legacy tracker: `docs/TASKS.md` is orientation only and must defer to the plan, scope, current brief, and this ledger.

## Entries

### 2026-06-03 - DTR-11 Footer And Art-Direction Follow-Up

Status:
- Complete for Batu review.

Scope:
- Correct the visible issues Batu flagged in the deployed/local review scene: remove the redundant grey raster footer from the interactive viewport, replace closed polygon target outlines with shorter art-directed edge accents, and tighten card styling toward the reference paper/ink direction.

Files changed:
- `src/PlaceholderWorld.jsx`
- `src/sceneManifest.js`
- `src/styles.css`
- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Scene manifest JSON parse.
- `npm run build`
- `git diff --check`
- Runtime page text loaded in the in-app browser; screenshot capture was blocked by the browser wrapper timing out.

Outcome:
- Added manifest-driven `visibleBounds` for the DTR-11 primary plate so the interactive viewport crops out the redundant grey footer without editing the raster asset.
- Changed target display contours to open edge-accent paths that trace storefront/transit edges instead of closed polygon hulls.
- Tightened selected-card styling toward the approved paper/ink reference language while keeping card content compact and truth-safe.
- Preserved no DTR-12, no new raster, no new source data, no production/public claims, and true-rotation deferral.

Unresolved decisions:
- Batu owns acceptance/revision of the corrected hover/selected and card visual treatment.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the corrected DTR-11 demo and Vercel Preview publication for external feedback.

### 2026-06-03 - DTR-11 MVP Card And Hover Correction

Status:
- Complete for Batu review; Vercel Preview publication blocked by local CLI auth/write access.

Scope:
- Implement Batu-approved targeted corrections before MVP lock: simplified store-info cards, art-directed hover/selected outlines from the attached Batch 13 references, review-only Vercel Preview share route, and explicit true-rotation deferral.

Files changed:
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-feedback-demo-package/README.md`
- `docs/mvp-review/mvp-feedback-demo-package/feedback-script-checklist.md`

Verification:
- Scene manifest JSON parse.
- `npm run build`
- Browser screenshot captured for default state; selected-card state captured during tuning; mobile screenshot capture was limited by the in-app browser wrapper.
- Vercel CLI available, but `vercel whoami` failed because the sandbox could not write `/Users/batusayici/Library/Application Support/com.vercel.cli/auth.json`; `VERCEL_TOKEN` was not set.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Visible cards now show only name, category, source-backed address/context, and a tiny review-only footer.
- Removed the obsolete selected-card QA/source/evidence helper path from `src/App.jsx`.
- Added separate `displayOutlinePaths` for active targets so click/tap hit areas remain practical while visible hover/selected contours can follow the art direction.
- Updated the Pixi target presentation with warm ink/paper contour strokes and map-pin markers; outlines remain review-demo presentation cues, not exact geometry claims.
- Preserved DTR-11 raster-first status, MVP-29E baseline/reference status, no DTR-12, no new raster, no new data sources, no scraping, and no production/public claims.
- True rotation remains deferred as technically dishonest for a single raster scene without layered depth or true 3D geometry.

Unresolved decisions:
- Batu owns acceptance/revision of the corrected card and hover treatment.
- Batu or local environment owner must complete Vercel auth/deploy, or provide an equivalent approved review-only remote link path.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the corrected DTR-11 demo and Vercel Preview publication once CLI auth/write access is available.

### 2026-06-03 - Strategic Signal Doc Reconciliation

Status:
- Complete for Batu review.

Scope:
- Reconcile the durable Digital Neighborhoods Signal Log into execution-control docs without changing code, app/source files, generated artifacts, raster images, package files, tests, build tooling, source policy, public-readiness claims, Phase 3 implementation, DTR-12, or production scope.

Files changed:
- `AGENTS.md`
- `docs/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/ARCHITECTURE.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Read required governance, roadmap, scope, architecture, current brief, ledger, and signal-log docs before editing.
- Moved the signal log to the `AGENTS.md` pointer path.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Resolved the signal-log path mismatch by moving the log to `docs/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`.
- Added compact strategic roadmap language preserving Greenpoint as the narrow proof slice for future neighborhood-generation logic without opening MVP scope.
- Added local-recognizability acceptance language to `docs/MVP_SCOPE.md`.
- Added a planning-only Editorial / Local Knowledge Layer and visual-consistency risk note to `docs/ARCHITECTURE.md`.
- Preserved review-only status, blocked-source policy, no DTR-12, no app/source edits, no generated/raster/package changes, no Phase 3 implementation, and no production/public-readiness changes.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the DTR-11 interactive demo as ready for external sessions.
- Batu still owns whether the next step is external feedback sessions, a bounded MVP acceptance/audit pass, or a targeted interaction/card/hotspot revision.
- Batu still owns whether to open a later dedicated Phase 3 tile-based scale-validation planning update.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points back to Batu review of the DTR-11 interactive demo; the proposed next step remains external feedback sessions, bounded MVP acceptance audit, or targeted interaction/card/hotspot revision.

### 2026-06-03 - DTR-11 Interactive Demo Integration

Status:
- Complete for Batu review.

Scope:
- Integrate the DTR-11 corrected raster into the interactive MVP demo for external review.
- Preserve DTR-11 review-only status, MVP-29E baseline/reference status, no DTR-12, no new styled raster, no live/new data sources, no production/public claims, and no true-3D/rotation claim.

Files changed:
- `src/App.jsx`
- `src/mvpPlaceData.js`
- `src/styles.css`
- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- `src/assets/review-only/dtr-11-reference-facade-fidelity-interactive-demo-review-only.png`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-feedback-demo-package/README.md`
- `docs/mvp-review/mvp-feedback-demo-package/feedback-script-checklist.md`

Verification:
- Confirmed current active scene image, active target set, card data, and existing pan/zoom/hover/click/mobile behavior before editing.
- DTR-11 app asset exists and dimensions are 1672 x 941.
- Scene manifest JSON parse.
- Primary manifest asset is `asset-dtr-11-interactive-demo-raster`; MVP-29E remains `baseline-raster-reference`.
- `npm run build`
- Browser screenshots captured for default, selected, and mobile containment states.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Copied the DTR-11 corrected raster into `src/assets/review-only/` and made it the primary review-demo raster plate.
- Preserved MVP-29E as a baseline/reference asset rather than deleting it.
- Aligned active hotspots and selected outlines for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and one symbolic/context Greenpoint G cue.
- Kept business cards truth-safe with name, category, source-backed address where available, source/status rows, source links, and review-only disclaimers.
- Added a fixed-view-angle affordance and explicitly deferred true rotation because the scene is raster-first, not true 3D.
- Updated the feedback package direction so reviewers start with the interactive demo.
- Carried forward unrelated dirty state: `AGENTS.md` modified and `research/` untracked.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the DTR-11 interactive demo as ready for external sessions.
- Batu still owns whether the next step is external feedback sessions, a bounded MVP acceptance/audit pass, or a targeted interaction/card/hotspot revision.
- True rotation remains deferred unless a later architecture/asset path creates an honest rotatable scene.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the DTR-11 interactive demo; the proposed next step is external feedback sessions, bounded MVP acceptance audit, or targeted interaction/card/hotspot revision.

### 2026-06-03 - MVP Feedback Demo Package

Status:
- Complete for Batu review.

Scope:
- Package the DTR-11 hero raster, DTR-11 facade before/after board, compact pipeline board, reviewer README, feedback checklist, and manifest for external MVP feedback.
- Mark Phase 2DTR complete for MVP-feedback purposes.
- Preserve review-only status and avoid DTR-12, new styled raster generation, geometry/readiness phases, app/source edits, package/tooling changes, production assets, and production/public claims.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-feedback-demo-package/`

Verification:
- Confirmed referenced source/package artifacts exist.
- Hero raster PNG exists and dimensions are 1672 x 941.
- Facade before/after board PNG exists and dimensions are 2400 x 2500.
- Compact pipeline board PNG exists and dimensions are 2400 x 1400.
- JSON parse for `generated/demo-package-manifest.json`.
- Deterministic regeneration check for `generate-feedback-demo-package.py`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added the MVP feedback demo package.
- Added a reviewer-facing README and one-page feedback checklist.
- Added a compact pipeline board explaining source/reference data to structured fixture to blueprint/geometry adapter to styled scene to QA.
- Copied the DTR-11 hero raster and DTR-11 before/after board into the package.
- Explicitly carried forward unrelated dirty state: `AGENTS.md` modified and `research/` untracked.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the MVP feedback demo package as ready for external sessions.
- Batu still owns whether the next step is interactive demo/MVP acceptance audit or external feedback sessions.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the MVP feedback demo package; the proposed next step is interactive demo/MVP acceptance audit or external feedback sessions.

### 2026-06-03 - Phase 2DTR-11 Reference-Image Facade Fidelity Pass

Status:
- Complete for Batu review.

Scope:
- Freeze the DTR-10 scene geometry and perform a narrow reference-image-constrained facade/sign/window/entrance pass.
- Create per-storefront facade extraction/spec records, reference crops, DTR-10/DTR-11 crop comparisons, a corrected raster, boards, and QA report.
- Preserve review-only status and avoid geometry adapter changes, new data sources, live scraping, Google/Street View/3D Tiles extraction, third-party image scraping, app/source edits, package/tooling changes, normal-mode replacement, production assets, and production/public exact-geometry claims.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/`

Verification:
- Confirmed all referenced source images exist.
- Corrected facade raster PNG exists and dimensions are 1672 x 941.
- Facade fidelity board PNG exists and dimensions are 2400 x 2200.
- Before/after QA board PNG exists and dimensions are 2400 x 2500.
- JSON parse for `generated/facade-extraction-specs.json` and `generated/reference-facade-fidelity-qa-report.json`.
- Basic hash comparison versus DTR-10.
- Deterministic regeneration check for `generate-dtr11-facade-qa.py`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a reference-image-constrained DTR-11 facade raster.
- Added four storefront facade extraction/spec records with source image paths, crop coordinates, DTR-8 scene bounds, sign/entrance/window/awning/material/prop cues, preservation requirements, and unsupported omissions.
- Added a facade fidelity board and before/after QA board with close-up crop comparisons.
- Added a QA report that marks supplied-reference-image-to-facade-scene improvement as material but partial, not full-fidelity deterministic reproduction.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-11 facade fidelity pass as ready for external MVP feedback.
- Batu still owns whether to open MVP feedback demo packaging, or one ultra-narrow storefront-specific correction if a DTR-11 crop is rejected.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-11 output; MVP feedback demo packaging is proposed as the next direct step after Batu approval or revision direction.

### 2026-06-03 - Phase 2DTR-10 Narrow Corrective Styled Raster Pass

Status:
- Complete for Batu review.

Scope:
- Perform one narrow corrective visual pass on the Phase 2DTR-9 styled raster.
- Focus only on facade/window/entrance alignment, storefront/sign panel cleanup, microtext cleanup, one primary Greenpoint G cue, and DTR-8/DTR-9 geometry preservation.
- Preserve review-only status and avoid geometry adapter changes, new data sources, live scraping, Google/Street View/3D Tiles extraction, app/source edits, package/tooling changes, normal-mode replacement, production assets, and production/public exact-geometry claims.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-10-narrow-corrective-styled-raster-pass/`

Verification:
- Corrected styled raster PNG exists and dimensions are 1672 x 941.
- Before/after QA board PNG exists and dimensions are 2400 x 1600.
- JSON parse for `generated/corrected-styled-raster-qa-report.json`.
- Deterministic regeneration check for `generate-dtr10-qa.py`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a corrected review-only styled raster from DTR-9.
- Added a before/after QA board comparing DTR-9 and DTR-10.
- Added a QA report that records exact fixes, remaining issues, unchanged geometry adapter state, no new data sources, and readiness to package for external MVP feedback.
- DTR-10 does not claim deterministic pixel-perfect rendering, production/public exact geometry, or final facade accuracy.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-10 corrected styled raster as ready for external MVP feedback.
- Batu still owns whether to open MVP feedback demo packaging.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-10 output; MVP feedback demo packaging is proposed as the next direct step after Batu approval or revision direction.

### 2026-06-03 - Phase 2DTR-9 Controlled Styled Raster From Geometry-First Adapter

Status:
- Complete for Batu review.

Scope:
- Produce one controlled review-only styled raster from the Phase 2DTR-8 JSON geometry adapter, plus a visual QA board and machine-readable QA report.
- Resolve the pre-existing dirty MVP-29E raster state before starting.
- Preserve review-only status and avoid live scraping, Google/Street View/3D Tiles extraction, app/source edits, package/tooling changes, normal-mode replacement, production assets, and production/public exact-geometry claims.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/`

Verification:
- Generated styled raster PNG exists and dimensions are 1672 x 941.
- QA board PNG exists and dimensions are 2400 x 1600.
- JSON parse for `generated/controlled-styled-raster-qa-report.json`.
- DTR-9 raster compared against DTR-6 at file/hash level.
- Deterministic regeneration check for `generate-dtr9-qa.py`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Restored `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png` to repository state before DTR-9 artifact work began.
- Added a meaningfully new review-only styled raster from the DTR-8 geometry-first adapter.
- Added a QA comparison board showing DTR-8 fixture intent, DTR-9 raster output, key fixture constraints, mismatch callouts, scores, and DTR-10 correction target.
- Added a QA report that marks DTR-9 useful for MVP feedback while partial on reference-photo fidelity and facade/entrance/window precision.
- DTR-9 does not claim deterministic pixel-perfect rendering, production/public exact geometry, or final facade accuracy.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-9 controlled styled raster and MVP feedback verdict.
- Batu still owns whether Phase 2DTR-10 should open as one narrow corrective visual pass from the DTR-8 blueprint/adapter overlay mask.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-9 output; Phase 2DTR-10 is proposed as the next direct step after Batu approval or revision direction.

### 2026-06-03 - Phase 2DTR-8 Fixture Geometry Primitive Completion For Styled Raster Readiness

Status:
- Complete for Batu review.

Scope:
- Complete the hard layout primitives exposed as missing by Phase 2DTR-7 before any further styled raster work.
- Add review-only road, pedestrian/corner, storefront/building, address-label, Greenpoint G subway cue, render-order, occlusion, blueprint, validation, and JSON-first adapter artifacts.
- Preserve review-only status and avoid polished raster generation, AI image generation, app/source edits, package/tooling changes, live scraping, Google/Street View/3D Tiles extraction, normal-mode replacement, production assets, and production/public exact-geometry claims.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/DECISION_LOG.md`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/`

Verification:
- JSON parse for `generated/geometry-primitive-fixture.json`, `generated/styled-raster-ready-geometry-adapter.json`, and `generated/geometry-primitive-validation-report.json`.
- SVG label check for road, sidewalk, crosswalk, storefront, entrance, sign, address-policy, and subway-cue labels.
- Deterministic regeneration check for `generate-geometry-primitives.mjs`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a packet-local deterministic generator and generated geometry primitive fixture.
- Added a JSON-first styled-raster-ready geometry adapter and secondary prompt text.
- Added a black-and-white primitive blueprint SVG and validation report.
- Validation status is `review-only-ready-for-dtr9`: all required primitives exist, one primary Greenpoint G cue is defined, address labels are QA-only, render order/occlusion rules exist, and no polished raster was generated.
- The pre-existing dirty MVP-29E raster file was intentionally left untouched and documented because it is unrelated to DTR-8.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-8 geometry primitive completion packet and DTR-9 readiness verdict.
- Batu still owns whether Phase 2DTR-9 should open as controlled styled raster generation from the JSON-first adapter output.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-8 output; Phase 2DTR-9 is proposed as the next direct step after Batu approval or revision direction.

### 2026-06-03 - Phase 2DTR-7 Fixture-To-Blueprint Scene Layout Validation

Status:
- Complete for Batu review.

Scope:
- Create a deterministic black-and-white SVG blueprint from the Phase 2DTR-5 exact review geometry fixture.
- Validate target rendering, storefront order, coordinate mapping, frontage bounds, sign panels, entrances, windows, address anchors, and Greenpoint G subway cue placement before any further styled raster work.
- Preserve review-only status and avoid polished raster generation, AI image generation, app/source edits, package/tooling changes, live scraping, Google/Street View/3D Tiles extraction, normal-mode replacement, production assets, and production/public exact-geometry claims.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-7-fixture-to-blueprint-scene-layout-validation/`

Verification:
- JSON parse for `generated/blueprint-validation-report.json`.
- SVG label check for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, Greenpoint G station, Manhattan Ave, Greenpoint Ave, and review-only status.
- Deterministic regeneration check for `generate-fixture-blueprint.mjs`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a packet-local deterministic generator, black-and-white SVG blueprint, and machine-readable validation report.
- The blueprint renders all five Phase 2DTR-5 fixture targets into the 1672 x 941 review-coordinate frame.
- The validation report confirms the fixture is sufficient for deterministic target blueprint rendering, but not sufficient for another styled raster attempt because explicit road, curb, sidewalk, crosswalk, curb-cut, render-order, occlusion, address-label, and primary subway cue rules are still missing.
- The pre-existing dirty MVP-29E raster file was intentionally left untouched and documented because it is unrelated to DTR-7.

Unresolved decisions:
- Batu later opened Phase 2DTR-8 as fixture geometry primitive completion before another styled raster attempt.

Next pointer:
- Superseded by the 2026-06-03 Phase 2DTR-8 ledger entry above.

### 2026-06-03 - Phase 2DTR-6 Exact Review Geometry Raster Artifact Generation

Status:
- Complete as a first review-only regenerated raster attempt; partial for exact coordinate/facade fidelity.

Scope:
- Use the Phase 2DTR-5 exact review geometry fixture, raster prompt adapter spec, raster prompt, and supplied MVP reference photos to produce a visual review-only raster scene artifact for Manhattan Ave / Greenpoint Ave.
- Produce a visual QA/contact-sheet board comparing fixture intent, generated raster output, visible unresolved gaps, scores, and DTR-7 corrective deltas.
- Preserve review-only status and avoid app/source edits, package/tooling changes, live scraping, Google/Street View/3D Tiles extraction, normal-mode replacement, production assets, and production/public exact-geometry claims.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-6-exact-review-geometry-raster-artifact-generation/`

Verification:
- PNG dimension inspection for `generated/exact-review-geometry-raster-attempt.png` showed 1672 x 941.
- PNG dimension inspection for `generated/exact-review-geometry-raster-qa-board.png` showed 2200 x 1600.
- PNG validity inspection for both DTR-6 generated PNG artifacts.
- Visual inspection of the DTR-6 raster and QA board.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added the first review-only true-to-life regenerated raster attempt for the Manhattan Ave / Greenpoint Ave MVP scene.
- Added a QA/contact-sheet board with DTR-5 fixture intent, generated output, visible comparison notes, scores, and DTR-7 deltas.
- The raster visibly follows the approved isometric art direction, real storefront order, and named anchors well enough to prove pipeline direction, but it remains partial for reference-photo fidelity, exact entrance/window/facade placement, generated micro-text, SW Dunkin address correctness, and Greenpoint G cue ambiguity.

Unresolved decisions:
- Batu later clarified that Phase 2DTR-6 should not be treated as proof of source-data-driven rendering.
- Batu later opened Phase 2DTR-7 as a deterministic fixture-to-blueprint validation step instead of a corrective polished-raster pass.

Next pointer:
- Superseded by the 2026-06-03 Phase 2DTR-7 ledger entry above.

### 2026-06-03 - Phase 2DTR-5 Exact Review Geometry Fixture To Raster Prompt Adapter

Status:
- Complete for Batu review.

Scope:
- Convert the committed Phase 2DTR-4 exact geometry source map and target scene spec into a structured review-only fixture and deterministic raster prompt adapter output.
- Cover Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G station/entrance cues with field-level provenance and review-coordinate geometry.
- Preserve review-only status and avoid live data, scraping, Google/Street View/3D Tiles extraction, app/source edits, package/tooling changes, normal-mode raster replacement, and production/public exact-geometry claims.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `scripts/generate-phase-2dtr-5-exact-review-raster-prompt.mjs`
- `docs/mvp-review/phase-2dtr-5-exact-review-geometry-fixture-to-raster-prompt-adapter/`

Verification:
- JSON parse for `generated/exact-review-geometry-fixture.json`, `generated/raster-prompt-adapter-spec.json`, and `generated/adapter-provenance-map.json`.
- Determinism check for `scripts/generate-phase-2dtr-5-exact-review-raster-prompt.mjs` against a temporary output directory.
- `node scripts/verify-real-data-scene-adapter.mjs`
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a structured exact review geometry fixture with target identity, address/context cues, storefront order, facade/frontage/window/entrance geometry, station cue geometry, source categories, source IDs, source paths, and unsupported fields.
- Added deterministic raster prompt adapter output and a human-readable prompt that can drive the next true regenerated review-only raster attempt.
- Added a field-level adapter provenance map so visible scene elements remain tied to NYC/open data, existing source evidence, supplied reference photos, manual review interpretation, or unsupported status.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-5 fixture and adapter output.
- Batu still owns whether Phase 2DTR-6 should produce a true regenerated raster image from the adapter output.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-5 output; Phase 2DTR-6 is proposed only after Batu approval or revision direction.

### 2026-06-03 - Phase 2DTR-4 Exact Geometry Source Map + Target Scene Spec

Status:
- Complete for Batu review.

Scope:
- Create a review-only exact geometry source map and target scene spec after Batu unblocked exact MVP review geometry.
- Map visible scene elements to NYC/open data, existing source evidence, supplied reference photos, manual review-coordinate interpretation, and unsupported gaps without app/source edits, package/tooling changes, live data, scraping, production assets, normal-mode raster replacement, or production/public-readiness changes.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-4-exact-geometry-source-map-target-scene-spec/`

Verification:
- JSON parse for `generated/exact-geometry-source-map.json`, `generated/target-scene-spec.json`, and `generated/reproducibility-gap-list.json`.
- Raster file/dimension inspection for `generated/exact-geometry-source-map-board.png`.
- Visual inspection of `generated/exact-geometry-source-map-board.png`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a concrete source-to-visible-scene mapping packet for Grillpoint, McDonald's, Dunkin', Citizens Bank, and Greenpoint G.
- Added exact MVP review-coordinate placement requirements for storefront bounds, frontage lines, address anchors, entrance/cue bounds, and station cue placement.
- Added a reproducibility gap list identifying what is automatic now and what still needs a structured adapter or stronger evidence.
- Preserved review-only status and left app source, existing data fixtures, scripts, package tooling, normal-mode behavior, and production/public-readiness gates unchanged.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-4 source map and whether Phase 2DTR-5 should open.
- Batu still owns whether a true generated raster image pass should happen before or after the exact review geometry fixture-to-raster adapter.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-4 output; Phase 2DTR-5 is proposed only after Batu approval or revision direction.

### 2026-06-03 - Exact MVP Geometry Review Gate Unblock

Status:
- Complete.

Scope:
- Record Batu's explicit unblock for exact MVP review work covering storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry.
- Preserve source/provenance requirements and production/public-readiness gates.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/MVP_SCOPE.md`
- `docs/DECISION_LOG.md`

Verification:
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Exact MVP geometry review work is no longer categorically blocked.
- Exact geometry fields may now be pursued and represented in review-only artifacts when backed by structured source/reference evidence, provenance, and explicit status labels.
- Unsupported exact claims, product/public exact-geometry claims, production assets, production asset pipeline, live data, scraping, package/tooling changes, normal-mode replacement, and public readiness remain blocked.

Unresolved decisions:
- Batu still owns which exact-geometry artifact or implementation brief opens next.
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-3 raster/spec attempt and whether Phase 2DTR-4 or a true generated raster image pass should open next.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to Batu review of Phase 2DTR-3 output; Phase 2DTR-4 is proposed only after Batu approval or revision direction, now with the exact MVP geometry review lane unblocked.

### 2026-06-03 - Phase 2DTR-3 Four-Corner Regenerated Raster Attempt

Status:
- Complete for Batu review.

Scope:
- Proceed from Batu acceptance of Phase 2DTR-2 into a review-only deterministic four-corner regenerated raster/spec attempt.
- Assemble the accepted four-target fixture into a scene-level raster instruction packet and visible comparison/spec board without app source edits, fixture edits, script edits, package/tooling changes, live source acquisition, production assets, public interfaces, true regenerated production scene output, or production/public-readiness changes.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/`

Verification:
- JSON parse for `generated/four-corner-regenerated-raster-attempt.json`, `generated/visual-instruction-provenance.json`, and `generated/regeneration-gap-report.json`.
- Raster file/dimension inspection for `generated/four-corner-regenerated-raster-attempt-board.png`.
- Visual inspection of `generated/four-corner-regenerated-raster-attempt-board.png`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a deterministic four-corner raster/spec attempt assembled from the Phase 2DTR-2 fixture.
- Added visual-instruction provenance and a regeneration gap report.
- Added a visible PNG board comparing MVP-29E baseline/corner evidence against the regenerated instruction/status surface.
- Preserved all production/public-readiness gates and left app source, existing data fixtures, scripts, package tooling, and normal-mode behavior unchanged.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-3 raster/spec attempt and whether Phase 2DTR-4 or a true generated raster image pass should open next.
- Exact MVP geometry review work was later unblocked by Batu when backed by source/reference evidence, provenance, and explicit status labels. Public schema/interface, production asset, unsupported exact-geometry, product/public exact-geometry, and production/public-readiness decisions remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-3 output; Phase 2DTR-4 is proposed only after Batu approval or revision direction.

### 2026-06-03 - Phase 2DTR-2 Four-Target Structured Facade Fixture

Status:
- Complete for Batu review.

Scope:
- Proceed from Batu approval of Phase 2DTR-1 into a review-only four-target structured facade/source fixture.
- Extend the DTR source/spec model to Grillpoint, McDonald's, Dunkin', Citizens, and Greenpoint G symbolic context without app source edits, fixture edits, script edits, package/tooling changes, live source acquisition, production assets, public interfaces, or production/public-readiness changes.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-2-four-target-structured-facade-fixture/`

Verification:
- JSON parse for `four-target-structured-facade-fixture.json`, `generated/raster-spec-index.json`, and `generated/visual-instruction-provenance.json`.
- Raster file/dimension inspection for `generated/four-target-structured-facade-fixture-board.png` and generated preview crops.
- Visual inspection of `generated/four-target-structured-facade-fixture-board.png`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a structured fixture covering NW Grillpoint, NE McDonald's, SW Dunkin', SE Citizens Bank, and Greenpoint G symbolic transit context.
- Added a deterministic raster/spec index and visual-instruction provenance/status map.
- Added a visible comparison board showing MVP-29E baseline crops, supplied reference previews, target statuses, and blocked claims.
- Preserved all production/public-readiness gates and left app source, existing data fixtures, scripts, package tooling, and normal-mode behavior unchanged.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-2 fixture structure and whether Phase 2DTR-3 should open.
- Exact facade, frontage/order, entrance/window geometry, address placement, station geometry, public schema/interface, production asset, and production/public-readiness decisions remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-2 output; Phase 2DTR-3 is proposed only after Batu approval or revision direction.

### 2026-06-03 - Phase 2DTR-1 One-Corner Source-To-Raster Spec

Status:
- Complete for Batu review.

Scope:
- Start Phase 2DTR-1 with a review-only Grillpoint/NW source-to-raster-spec packet.
- Produce visible pipeline evidence without app source edits, fixture edits, script edits, package/tooling changes, live source acquisition, production assets, public interfaces, or production/public-readiness changes.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-1-one-corner-real-data-to-raster-reproduction-slice/`

Verification:
- JSON parse for `structured-source-object.json`, `generated/raster-spec.json`, and `generated/visual-instruction-provenance.json`.
- Raster file/dimension inspection for `generated/grillpoint-nw-dtr-comparison-board.png` and generated preview crops.
- Visual inspection of `generated/grillpoint-nw-dtr-comparison-board.png`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a structured one-corner source object for Grillpoint/NW.
- Added a deterministic generated raster/spec artifact and visual-instruction provenance/status map.
- Added a visible comparison board against the MVP-29E NW crop using existing review-only raster/photo inputs.
- Preserved all production/public-readiness gates and left app source, data fixtures, scripts, package tooling, and normal-mode behavior unchanged.

Unresolved decisions:
- Batu still owns whether to accept, revise, or reject the Phase 2DTR-1 source/spec structure and whether Phase 2DTR-2 should open.
- Exact facade, frontage/order, entrance/window geometry, address placement, station geometry, public schema/interface, production asset, and production/public-readiness decisions remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of Phase 2DTR-1 output; Phase 2DTR-2 is proposed only after Batu approval or revision direction.

### 2026-06-03 - QA Layer Controls Source Commit

Status:
- Complete.

Scope:
- Commit the existing uncommitted Phase 2AC-style QA readability/source-comparison edits as their own continuity batch before Phase 2DTR-1 starts.

Files changed:
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- `git diff --check`
- `git status --short`

Outcome:
- QA mode now has layer controls for real-data, official-footprint, draft, and label overlays.
- Selected cards can show a compact official-footprint candidate summary while preserving the warning that footprints are not tenant frontage or exact storefront proof.
- Normal-mode raster-first scene meaning, product-copy readiness, production/public-readiness gates, package tooling, assets, fixtures, and scripts were not changed.

Unresolved decisions:
- Batu still owns visual acceptance, exact geometry claims, production/public-readiness gates, and whether later DTR outputs are accepted or revised.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

### 2026-06-03 - Plan Scope Summary Tightening

Status:
- Complete.

Scope:
- Docs-only pass requested by Batu to simplify `docs/PLAN.md`, remove duplicated MVP scope detail from the roadmap, and reduce the plan's length before implementation.

Files changed:
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- Lightweight Markdown link check
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/PLAN.md` now keeps a short MVP scope pointer instead of repeating detailed MVP boundaries already owned by `docs/MVP_SCOPE.md`.
- The old detailed phase table was replaced with a compact roadmap summary and focused Phase 2DTR outcome plan.
- Phase 2DTR-1 remains the next executable task, Phase 3 remains future Neighborhood Scale Validation, and production/public-readiness gates remain unchanged.

Unresolved decisions:
- Batu still owns acceptance of this simplified roadmap and any later scope, phase, visual, production, or public-readiness changes.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

### 2026-06-03 - Pre-Implementation Docs Cleanup

Status:
- Complete.

Scope:
- Docs-only cleanup requested by Batu after reviewing whether the project docs were clean enough before implementation.
- Simplify active control docs, retire stale auto-advance language, fix stale visual-reference pointers, and archive old ledger history without changing source/app behavior.

Files changed:
- `docs/AGENT_HANDOFF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PHASE_2_PLAN.md`
- `docs/ART_DIRECTION.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/approved-reference-corpus/ASSET_CORPUS_SCAN.md`
- `docs/DECISION_LOG.md`
- `docs/ARCHITECTURE.md`
- `docs/SCENE_MANIFEST_SCHEMA.md`
- `docs/DATA_SOURCES.md`
- `docs/PROVENANCE_AND_QA.md`

Verification:
- `git diff --check`
- Lightweight Markdown link check
- `git status --short`
- `git diff --stat`

Outcome:
- Active planning authority remains concentrated in `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_SCOPE.md`, and the slim active ledger.
- `docs/AGENT_HANDOFF.md` is now a historical stub and no longer authorizes auto-advance.
- Older ledger entries are preserved in `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md` so the active ledger stays readable before Phase 2DTR-1 implementation.
- Stale Phase 2AD-style/overlay-polish and pre-DTR current-gate language was replaced with Phase 2DTR orientation.
- No app source, data fixtures, assets, screenshots, package files, package tooling, scripts, public interfaces, production gates, or Phase 2DTR scope were changed.

Unresolved decisions:
- Batu still owns any later deletion of historical docs, production/public-readiness gates, public interfaces, architecture boundaries, visual direction, and Phase 2DTR acceptance.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

### 2026-06-03 - Phase 2 Plan Authority Simplification

Status:
- Complete.

Scope:
- Docs-only simplification requested by Batu to reduce future planning confusion.
- Convert `docs/PHASE_2_PLAN.md` from an active plan into a historical stub and make `docs/PLAN.md` the single active roadmap.

Files changed:
- `docs/PHASE_2_PLAN.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/PHASE_2_PLAN.md` is now retained only to avoid dangling references.
- `docs/PLAN.md` remains the active roadmap, phase-control document, and next-task pointer source.
- `docs/CURRENT_EXECUTION_BRIEF.md` remains the active task handoff and still points to Phase 2DTR-1.
- `docs/MVP_SCOPE.md` remains the durable MVP scope authority.
- `docs/MVP_EXECUTION_LEDGER.md` remains the batch-history and reconciliation record.
- No app source, data fixtures, assets, screenshots, package files, package tooling, scripts, public interfaces, production gates, or Phase 2DTR scope were changed.

Unresolved decisions:
- Batu still owns acceptance of this simplified doc model and any later archival/deletion decisions for obsolete docs.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

### 2026-06-03 - Phase 2DTR Scope / Plan Realignment

Status:
- Complete.

Scope:
- Docs-only planning/scope update to realign the MVP around a focused data-to-raster proof track inside Phase 2.
- No app source, data fixtures, assets, screenshots, package files, or scripts were edited.

Files changed:
- `docs/MVP_SCOPE.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/PHASE_2_PLAN.md`

Verification:
- `git diff --check`
- Lightweight docs validation search: no dedicated docs validator was present.
- `git status --short`

Outcome:
- Created Phase 2DTR - Data-to-Raster MVP Proof as the focused Phase 2 sub-track.
- Recorded the MVP proof path as source inputs to structured scene/facade/geometry fields to deterministic generated raster/spec artifact to review-only isometric scene output to QA/status comparison.
- Summarized Phase 2A through Phase 2AC as completed exploratory/source/QA groundwork.
- Confirmed MVP-29E remains the current manually composed raster baseline/reference, not the final proof of the pipeline.
- Recorded Batu-supplied reference photos as approved for MVP-only review/source facade imagery and facade-field extraction.
- Preserved strict promotion/public-readiness gates, no scraping/live API calls, no Google/Street View/3D Tiles extraction, no production asset approval, and no production schema/interface approval.
- Confirmed Phase 3 remains reserved for Neighborhood Scale Validation.

Unresolved decisions:
- Batu still owns visual acceptance, product/public readiness, exact facade/frontage/address/station claims, production source policy, production assets, architecture/public-interface approval, and whether later Phase 2DTR outputs are accepted or revised.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

## Archived History

Older entries before 2026-06-03 are preserved at `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`. Use that archive for batch archaeology only; current execution authority remains the source-of-truth order in `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_SCOPE.md`, and this active ledger.
