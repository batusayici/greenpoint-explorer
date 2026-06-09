# MVP Execution Ledger

Status: Active task ledger
Created: 2026-05-29
Last reconciled: 2026-06-09

## Purpose

This ledger records MVP execution batches and keeps `docs/PLAN.md` and `docs/CURRENT_EXECUTION_BRIEF.md` from drifting.

It is not a roadmap and does not authorize work by itself:

- `docs/PLAN.md` defines current phase and remaining MVP phases.
- `docs/CURRENT_EXECUTION_BRIEF.md` defines the next executable or proposed Codex task.
- This ledger records what happened, what changed, what was verified, and what pointer should be used next.

## Mandatory Reconciliation Rule

After every successful Codex batch, Codex must update all three documents before final response:

- `docs/PLAN.md`: update current phase, phase status, blockers, pending decisions, and next-task pointer only. Do not turn it into batch history.
- `docs/CURRENT_EXECUTION_BRIEF.md`: replace the completed task with the next approved/proposed executable task, list any pre-authorized queued batches, identify the next hard Batu review gate, or explicitly mark that the next task is pending Batu/ChatGPT approval.
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

- Current phase: `Packet 4M-R6: Franklin Hybrid Benchmark-Closure Packet` is complete and verified at the Batu review gate.
- Current next pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next state: `docs/CURRENT_EXECUTION_BRIEF.md` holds at the completed 4M-R6 Batu visual review gate with no executable batch and no pre-authorized queue.
- Updated roadmap posture: Batu accepted the 4G-A/4G-B/4H-1 packet and opened a bounded Phase 4I packet. 4I-1 through 4I-4 are complete and verified. The roadmap is now reframed around spatial truth first, facade recognizability second, and art direction third. 4O-1 through 4O-20 completed the truth-first QA scaffold path. 4J-1 through 4J-3 added and reviewed QA-only frontage/bay candidates. 4K-1 through 4K-3 added, rendered, and reviewed QA-only recognizable anchor cues. 4L-Prep and 4L-Local-1 through 4L-Local-5 are complete and verified. 4M-R5 proved measured/procedural Franklin rendering can reach directional recognizability. 4M-R6 tested the hybrid hero-corner lane: Franklin-specific opaque final-look modules over the measured trace, with reusable facade/street grammar extracted for later scaling. Real source data download, cache, ingestion, conversion, render use, extraction, training, source promotion, business linkage, exact claims, production assets, normal-mode exposure, public/product claims, Qwen/Oxen, Google Street View / Google 3D Tiles use beyond benchmark-only discussion, new credentials, paid APIs, dependencies, renderer replacement, public interfaces, module boundaries, architecture changes, 4L external render implementation, production 4M work, and 4P remain blocked unless a later Batu gate explicitly approves them.
- Stable roadmap: `docs/PLAN.md`.
- Detailed MVP scope authority: `docs/MVP_SCOPE.md`.
- Legacy tracker: `docs/archive/governance/TASKS.md` is orientation only and must defer to the plan, scope, current brief, and this ledger.

## Entries

### 2026-06-09 - Packet 4M-R6 Franklin Hybrid Benchmark-Closure

Status:
- Complete and verified; pending Batu visual review.

Scope:
- Open and execute a bounded Franklin hybrid benchmark-closure packet: R6A grammar spec, R6B QA-only hybrid overlay implementation, and R6C review capture/reusable kit report. Preserve the existing runtime scene and R5 measured trace; do not add new source lanes, normal-mode exposure, exact claims, production assets, or a new scaffold.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/reports/phase-4m-r6a-franklin-hero-decomposition-grammar-spec.md`
- `docs/reports/phase-4m-r6-franklin-hybrid-benchmark-closure-report.md`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/franklin-benchmark-close-r6.png`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/franklin-side-return-corner-wrap-r6.png`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/franklin-street-level-lower-oblique-r6.png`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/corridor-oblique-ghosted-r6.png`
- `docs/review-screenshots/phase-4m-r6-franklin-hybrid-benchmark-closure/manhattan-close-r6-shared-renderer-check.png`

Verification:
- `npm run build`
- Browser Visual POC capture from the existing runtime scene on `http://127.0.0.1:5174/`.
- Visual inspection of Franklin benchmark close, Franklin side-return/corner-wrap, Franklin street-level/lower oblique, corridor oblique, and Manhattan regression screenshots.
- Screenshot format check and conversion to true PNG files.
- `git diff --check`

Outcome:
- Added a practical R6A Franklin hero decomposition and reusable grammar spec.
- Added `endpointHeroFacadeOverrides.franklin.hybridHeroLayer`.
- Added Franklin-specific hybrid modules for fused massing, cornice/parapet, dark window stack, wrapped storefront, black awning, tan sign band, side-return bay/fire-escape grammar, and street grounding.
- Captured R6 review artifacts and recorded reusable module candidates.

Unresolved decisions:
- Batu owns whether R6 is close enough for Franklin benchmark closure.
- Batu owns whether to iterate Franklin, apply the hybrid lane to Manhattan, or begin formal facade/street kit schema extraction after another corner proves reuse.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4M-R6 Batu visual review gate with no executable batch and no pre-authorized queue.

### 2026-06-09 - Batch 4M-R5 Franklin Hero Corner Fidelity Layer

Status:
- Complete and verified; pending Batu visual review.

Scope:
- Continue from 4M-R4 in the existing runtime scene and add a bounded Franklin QA-only low-poly fidelity layer so the hero corner reads less like translucent code-native boxes, without creating a new scaffold, renderer architecture, data lane, dependency, source integration, production asset, normal-mode exposure, exact claim, or commit.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/reports/phase-4m-r5-franklin-hero-corner-fidelity-layer.md`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/franklin-benchmark-close-r5.png`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/franklin-side-return-corner-wrap-r5.png`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/franklin-street-level-lower-oblique-r5.png`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/corridor-oblique-ghosted-r5.png`
- `docs/review-screenshots/phase-4m-r5-franklin-hero-corner-fidelity-layer/manhattan-close-r5-shared-renderer-check.png`

Verification:
- `npm run build`
- Browser Visual POC capture from the existing runtime scene on `http://127.0.0.1:5174/`.
- Visual inspection of Franklin benchmark close, Franklin side-return/corner-wrap, Franklin street-level/lower oblique, corridor oblique, and Manhattan close regression screenshots.
- Screenshot format check and conversion to true PNG files.

Outcome:
- Added `endpointHeroFacadeOverrides.franklin.heroFidelityLayer`.
- Added a bounded Franklin opaque low-poly detail layer for masonry, windows, AC boxes, cornice/parapet, roof inset, sign/awning/storefront glass, side-return rhythm, side bay, fire-escape cue, and street grounding.
- Added a Franklin street-level QA review camera.
- Reduced older translucent measured backing dominance in Visual POC mode so the R5 geometry/detail layer reads first.
- Manhattan was preserved and recaptured because shared renderer behavior changed.

Unresolved decisions:
- Batu owns whether Franklin is now close enough for the measured-runtime/benchmark-fidelity proof.
- Remaining gaps: code-native low-poly fidelity, exact storefront/frontage measurements, exact side-return/corner-depth geometry, exact curb/intersection geometry, raster/art-directed detail, and all production/signage/business/address/material claims remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4M-R5 Batu visual review gate with no executable batch and no pre-authorized queue.

### 2026-06-09 - Batch 4M-R4 Franklin Benchmark Fidelity Convergence Pass

Status:
- Complete and verified; pending Batu visual review.

Scope:
- Continue from 4M-R3 in the existing runtime scene and converge Franklin toward the supplied same-corner benchmark fidelity target and repo-local truth photos, without creating a new scaffold, renderer architecture, data lane, dependency, source integration, production asset, normal-mode exposure, exact claim, or commit.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/reports/phase-4m-r4-franklin-benchmark-fidelity-convergence-pass.md`
- `docs/review-screenshots/phase-4m-r4-franklin-benchmark-fidelity-convergence-pass/franklin-benchmark-close-r4.png`
- `docs/review-screenshots/phase-4m-r4-franklin-benchmark-fidelity-convergence-pass/franklin-side-return-corner-wrap-r4.png`
- `docs/review-screenshots/phase-4m-r4-franklin-benchmark-fidelity-convergence-pass/manhattan-close-r4-shared-renderer-check.png`
- `docs/review-screenshots/phase-4m-r4-franklin-benchmark-fidelity-convergence-pass/corridor-oblique-ghosted-r4.png`

Verification:
- `npm run build`
- Browser Visual POC capture from the existing runtime scene on `http://127.0.0.1:5174/`.
- Visual inspection of Franklin benchmark, Franklin side-return/corner-wrap, Manhattan close regression, and corridor oblique screenshots.
- Screenshot format check and conversion to true PNG files.

Outcome:
- Strengthened `endpointHeroFacadeOverrides.franklin` with roof inset, side-return depth/rhythm, side bay, fire-escape cue, AC slots, tactile paving, sidewalk seams, and generic sidewalk-object context.
- Improved the measured renderer with lower-dominance backing mass, draw-prioritized relief, roof/parapet wrap, denser upper-window/lintel/sill rhythm, deeper storefront sign/awning/glass relief, side-return storefront/window/bay/fire-escape/AC cues, and richer street grounding.
- Added Franklin benchmark and Franklin side-return QA camera presets.
- Manhattan was preserved and recaptured because shared measured-renderer draw behavior changed.

Unresolved decisions:
- Batu owns whether Franklin is now close enough for the measured-runtime proof.
- Remaining gaps: code-native box fidelity, exact storefront/frontage measurements, exact side-return/corner-depth geometry, exact curb/intersection geometry, raster/art-directed detail, and all production/signage/business/address/material claims remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4M-R4 Batu visual review gate with no executable batch and no pre-authorized queue.

### 2026-06-09 - Batch 4M-R3 Measured Hero-Corner Reconstruction Pass

Status:
- Complete and verified; pending Batu visual review.

Scope:
- Continue the current 4M evidence-derived runtime scene and convert endpoint symbolic profiles into structured measured 2.5D hero-corner reconstructions for Franklin first, Manhattan second, without a new scaffold, renderer, framework, package dependency, source lane, or production claim.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/reports/phase-4m-r3-measured-hero-corner-reconstruction-pass.md`
- `docs/review-screenshots/phase-4m-r3-measured-hero-corner-reconstruction-pass/franklin-close-measured-poc.png`
- `docs/review-screenshots/phase-4m-r3-measured-hero-corner-reconstruction-pass/manhattan-close-measured-poc.png`
- `docs/review-screenshots/phase-4m-r3-measured-hero-corner-reconstruction-pass/corridor-oblique-measured-poc.png`

Verification:
- `npm run build`
- Browser Visual POC capture from the existing runtime scene on `http://127.0.0.1:5189/`.
- Visual inspection of Franklin close, Manhattan close, and corridor oblique screenshots.
- Screenshot format check and conversion to true PNG files.

Outcome:
- Added `endpointHeroFacadeOverrides.franklin` and `.manhattan` with structured `massing`, `frontFacade`, `sideReturn`, `storefrontBays`, `upperWindows`, `cornice`, `canopies`, `materialZones`, `streetGrounding`, and `evidenceRefs`.
- Added a measured 2.5D hero facade renderer for thin relief planes, inset glass, mullions, door frames, canopy depth, cornice bands, window rows, side-return panels, and corner grounding.
- Franklin now reads from measured frontage rhythm, tan/green sign banding, black canopy span, corner wrap, side-return/cornice massing, and curb/crosswalk grounding more than from labels or decorative patches.
- Manhattan was traced secondarily with deli/transit base rhythm, black/green sign band, glass/door spacing, and supporting-corner distinction.
- Preserved normal-mode protection and did not add external sources, exact claims, production assets, new dependencies, new schemas, or renderer replacement.

Unresolved decisions:
- Batu owns whether Franklin is close enough to the supplied evidence for this measured-runtime proof.
- Remaining gaps: chunky side-mass read, upper-window relief strength, exact storefront/frontage measurements, exact side-return/corner-depth geometry, exact curb/intersection geometry, and all production/signage/business/address/material claims remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4M-R3 Batu visual review gate with no executable batch and no pre-authorized queue.

### 2026-06-09 - Batch 4M-POC-R2 Existing Runtime Evidence-Derived Benchmark Pass

Status:
- Complete and verified; pending Batu visual review.

Scope:
- Continue the current uncommitted Phase 4M runtime patch and convert renderer-local recognizability profiles into a stricter evidence-derived two-corner benchmark pass, prioritizing Franklin, without creating a new scene, renderer, scaffold, source lane, dependency, or public claim.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/reports/phase-4m-evidence-derived-benchmark-pass.md`
- `docs/review-screenshots/phase-4m-evidence-derived-benchmark-pass/corridor-oblique-benchmark-poc.png`
- `docs/review-screenshots/phase-4m-evidence-derived-benchmark-pass/manhattan-endpoint-benchmark-poc.png`
- `docs/review-screenshots/phase-4m-evidence-derived-benchmark-pass/franklin-endpoint-benchmark-poc.png`

Verification:
- `npm run build`
- Browser Visual POC capture from the existing runtime scene on `http://127.0.0.1:5189/`.
- Visual inspection of Franklin endpoint, Manhattan endpoint, and corridor oblique screenshots.
- One correction loop tightened endpoint camera distance/zoom and strengthened street grounding after the first benchmark capture was still too distant and quiet.

Outcome:
- Added explicit evidence observations and frontage segment arrays to the existing renderer-local place profiles.
- Added a structured frontage renderer for per-segment backplates, sign bands, green accents, canopies, lower panels, glass beats, door beats, separators, side-return cues, and street-grounding strips.
- Franklin now reads less like a generic stylized storefront cluster: the red-brick grocery corner, tan/green/black sign/canopy banding, storefront order, dark southeast support corner, and curb/sidewalk grounding are more traceable to repo-local photos.
- Manhattan was tightened secondarily while preserving deli/transit and modern color-panel cues.
- Preserved normal-mode protection and did not add external sources, exact claims, production assets, new schemas, new dependencies, or renderer replacement.

Unresolved decisions:
- Batu owns whether this is close enough to prove the benchmark pipeline direction. It is not exact storefront/frontage reconstruction yet.
- Remaining gaps: exact storefront count/order/measurements, exact side-return/corner-depth geometry, precise street/curb/intersection geometry, and any production/signage/business/address/material claims remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4M-POC-R2 Batu visual review gate with no executable batch and no pre-authorized queue.

### 2026-06-09 - Batch 4M-POC-R Existing Runtime Recognizable-Place Fidelity Refinement

Status:
- Complete and verified; pending Batu visual review.

Scope:
- Refine the existing Phase 4 runtime endpoint visuals so Manhattan and Franklin read more like recognizable Greenpoint places, using existing scene objects, current 4J/4K/4L records, and repo-local reference photos only.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/reports/phase-4m-recognizable-place-fidelity-patch.md`
- `docs/review-screenshots/phase-4m-recognizable-place-fidelity-patch/corridor-oblique-recognizable-poc.png`
- `docs/review-screenshots/phase-4m-recognizable-place-fidelity-patch/manhattan-endpoint-recognizable-poc.png`
- `docs/review-screenshots/phase-4m-recognizable-place-fidelity-patch/franklin-endpoint-recognizable-poc.png`

Verification:
- `npm run build`
- Browser Visual POC capture from the existing runtime scene.
- Visual review against the selected primary Manhattan and Franklin repo-local reference photos.

Outcome:
- Added renderer-local recognizability profiles keyed to the existing endpoint evidence cue IDs.
- Strengthened Manhattan/Franklin place-recognition cues: larger black/green deli and grocery bands, vivid panel blocks, heavier cornice/awning cues, traffic/signal/transit-like corner cues, and foreground QA landmark shapes.
- Preserved normal-mode protection and did not add external sources, exact claims, production assets, new schemas, new dependencies, or renderer replacement.

Unresolved decisions:
- Batu owns whether the output is recognizable enough for proof-of-pipeline purposes. The pass improves place-specific read but still does not meet exact storefront/frontage reconstruction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4M-POC-R Batu visual review gate with no executable batch and no pre-authorized queue.

### 2026-06-09 - Batch 4M-POC Existing Runtime Endpoint Fidelity Patch

Status:
- Complete and verified; pending Batu visual review.

Scope:
- Improve the existing Phase 4 runtime scene's Manhattan and Franklin endpoint visual fidelity directly, using the current endpoint geometry, 4J frontage candidates, 4K recognizable cues, 4L local evidence records, and repo-local evidence only.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/review-screenshots/phase-4m-poc-endpoint-fidelity-patch/corridor-oblique-visual-poc.png`
- `docs/review-screenshots/phase-4m-poc-endpoint-fidelity-patch/manhattan-endpoint-visual-poc.png`
- `docs/review-screenshots/phase-4m-poc-endpoint-fidelity-patch/franklin-endpoint-visual-poc.png`

Verification:
- `npm run build`
- Browser runtime review using the existing Phase 4 scene.
- Captured Manhattan endpoint, Franklin endpoint, and corridor oblique Visual POC screenshots.
- One correction loop lowered muted context scaffold opacity after visual review so endpoint frontage detail remained readable.

Outcome:
- Added a QA-only `Visual POC` focus mode that hides cluttering QA chrome and uses the existing scene objects.
- Improved endpoint facade rendering with storefront rhythm, glass/door/sign-band/grounding detail, material/color-family cues, side-return/depth hints, and muted scaffold context.
- Preserved normal-mode protection and did not add external sources, new schemas, new renderer, new dependencies, backend services, or public/product truth claims.

Unresolved decisions:
- Batu owns whether the endpoint fidelity is close enough to the benchmark direction for proof-of-pipeline purposes and whether another bounded endpoint pass, exact storefront/frontage pass, art-directed scene pass, or source expansion gate opens.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4M-POC Batu visual review gate with no executable batch and no pre-authorized queue.

### 2026-06-09 - Batch 4L-Local-5 QA Layer Focus + Label-Density Legibility Pass

Status:
- Complete and verified; pending Batu review.

Scope:
- Add QA-only controls/readability behavior so Batu can isolate 4L local evidence cues from competing 4O/4J/4K QA labels.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/reports/phase-4l-local-5-qa-layer-focus-legibility.md`
- `scripts/verify-phase-4l-local-5-qa-layer-focus-legibility.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4l-local-5-qa-layer-focus-legibility.mjs`
- New and relevant prior 4L verifiers
- Relevant 4K / 4J / 4O / 4I verifier chain
- `npm run build`
- Browser visual review
- `git diff --check`
- `git status --short`

Outcome:
- Added `All QA` / `4L Focus` controls in the existing QA runtime.
- `4L Focus` suppresses competing scaffold/candidate/cue QA layers while preserving the 4L local evidence cue layer and existing evidence facade context.
- Preserved all external source, new evidence intake, business/source linkage, normal-mode exposure, production/public, and claim-promotion blocks.

Unresolved decisions:
- Batu owns whether the focused 4L local evidence view is visually legible enough for the next decision.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4L-Local-5 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4L-Local-4 Visual Review Gate Report

Status:
- Complete and verified; pending Batu review.

Scope:
- Decide whether the repo-local evidence-backed QA pipeline improved the scene enough to justify Mapillary/KartaView as a later scaling lane proposal.

Files changed:
- `docs/reports/phase-4l-local-4-visual-review-gate-report.md`
- `scripts/verify-phase-4l-local-4-visual-review-gate.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4l-local-1-evidence-cue-eligibility.mjs`
- `node scripts/verify-phase-4l-local-2-qa-cue-enrichment.mjs`
- `node scripts/verify-phase-4l-local-3-runtime-evidence-overlay.mjs`
- `node scripts/verify-phase-4l-local-4-visual-review-gate.mjs`
- Relevant 4K / 4J / 4O / 4I verifier chain
- `npm run build`
- `git diff --check`
- `git status --short`

Outcome:
- Recorded that repo-local evidence materially improves endpoint recognizability in QA mode.
- Recommended Mapillary/KartaView only as a later source-use gate proposal, not direct evidence intake.
- Preserved all external source, new evidence intake, business/source linkage, normal-mode exposure, production/public, and claim-promotion blocks.

Unresolved decisions:
- Batu owns whether the 4L-Local visual result passes review and whether to open Mapillary/KartaView source-use planning or request more Batu-supplied mid-corridor evidence first.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the completed 4L-Local Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4L-Local-3 QA Runtime Evidence Overlay

Status:
- Complete and verified.

Scope:
- Render the enriched local evidence-backed cues in QA runtime only and add readouts for evidence-backed, unsupported, blocked, and normal-mode protected cues.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/reports/phase-4l-local-3-qa-runtime-evidence-overlay.md`
- `scripts/verify-phase-4l-local-3-runtime-evidence-overlay.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4l-local-1-evidence-cue-eligibility.mjs`
- `node scripts/verify-phase-4l-local-2-qa-cue-enrichment.mjs`
- `node scripts/verify-phase-4l-local-3-runtime-evidence-overlay.mjs`
- `npm run build`
- `git diff --check`
- `git status --short`

Outcome:
- Added a QA-only 4L local evidence overlay for the six enriched endpoint cue records.
- Added runtime/review/inspector readouts for local evidence cue counts, selected status, evidence-reference counts, and blocked claims.
- Did not add evidence files, access external sources, download/cache/ingest/convert data, link businesses/tenants/signs/logos/POIs/active status, expose normal mode, or promote claims.

Unresolved decisions:
- Batu owns whether the 4L-Local visual result is useful enough to justify Mapillary/KartaView scaling.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4L-Local-4: Visual Review Gate Report`, with no pre-authorized queue after it.

### 2026-06-08 - Batch 4L-Local-2 Evidence-Backed QA Cue Enrichment

Status:
- Complete and verified.

Scope:
- Turn eligible local evidence into QA-only enriched visual cue data for Manhattan/Greenpoint and Franklin/Greenpoint endpoint corners.

Files changed:
- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1.json`
- `docs/reports/phase-4l-local-2-evidence-backed-qa-cue-enrichment.md`
- `scripts/verify-phase-4l-local-2-qa-cue-enrichment.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4l-local-1-evidence-cue-eligibility.mjs`
- `node scripts/verify-phase-4l-local-2-qa-cue-enrichment.mjs`
- `git diff --check`
- `git status --short`

Outcome:
- Added 6 QA-only enriched endpoint cue records linked to existing 4E cue targets and existing 4K cue lineage.
- Cited all 22 existing repo-local 4D evidence IDs through 4L-Local-1 eligibility records.
- Enriched only non-factual visual cue fields and kept every blocked claim category present.
- Did not add evidence files, access external sources, download/cache/ingest/convert data, link businesses/tenants/signs/logos/POIs/active status, expose normal mode, or promote claims.

Unresolved decisions:
- Batu owns whether the later 4L-Local visual result is useful enough to justify Mapillary/KartaView scaling.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4L-Local-3: QA Runtime Evidence Overlay`, with 4L-Local-4 queued.

### 2026-06-08 - Batch 4L-Local-1 Local Evidence Inventory + Cue Eligibility

Status:
- Complete and verified.

Scope:
- Inventory existing repo-local Batu-supplied Manhattan/Greenpoint and Franklin/Greenpoint facade evidence records and map them to QA-only visual cue categories.

Files changed:
- `src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-local-1-repo-local-evidence-cue-eligibility.v0.1.json`
- `docs/reports/phase-4l-local-1-evidence-inventory-cue-eligibility.md`
- `scripts/verify-phase-4l-local-1-evidence-cue-eligibility.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4l-local-1-evidence-cue-eligibility.mjs`
- `git diff --check`
- `git status --short`

Outcome:
- Inventoried 22 existing repo-local Batu-supplied evidence records: 11 Manhattan/Greenpoint and 11 Franklin/Greenpoint.
- Mapped every record to one or more QA-only visual cue categories.
- Classified records as `eligible_qa_visual_reference` or `eligible_gap_fill`.
- Did not add evidence files, access external sources, download/cache/ingest/convert data, link businesses/tenants/signs/logos/POIs/active status, expose normal mode, or promote claims.

Unresolved decisions:
- Batu owns whether the later 4L-Local visual result is useful enough to justify Mapillary/KartaView scaling.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4L-Local-2: Evidence-Backed QA Cue Enrichment`, with 4L-Local-3 and 4L-Local-4 queued.

### 2026-06-08 - Batch 4L-Prep Evidence Gap To Cue Eligibility Plan

Status:
- Complete and verified; pending Batu review.

Scope:
- Planning, contract, and review-gate packet mapping current 4K recognizability gaps to evidence requirements before any evidence-backed 4L render work.

Files changed:
- `docs/phase-4l-prep-evidence-gap-to-cue-intake-plan.md`
- `docs/phase-4l-prep-qa-evidence-eligibility-contract.md`
- `docs/reports/phase-4l-prep-review-gate-report.md`
- `src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-prep-qa-evidence-eligibility-contract.v0.1.json`
- `scripts/verify-phase-4l-prep-evidence-eligibility.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4l-prep-evidence-eligibility.mjs`
- `node scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`
- `node scripts/verify-phase-4k-2-qa-recognizable-anchor-runtime-overlay.mjs`
- `node scripts/verify-phase-4k-3-local-recognizability-review-pack.mjs`
- `node scripts/verify-phase-4j-3-candidate-readiness-report.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4o-20-spatial-usefulness-review-pack.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `npm run build`
- `git diff --check`
- `git status --short`

Outcome:
- Added a concise evidence-gap-to-cue intake plan, QA evidence eligibility contract, structured contract fixture, and review-gate report.
- Defined eligible, insufficient, and blocked states for every current 4K cue category.
- Mapped every current 4K gap to one or more required evidence types.
- Recorded the review-gate decision: not ready for evidence-backed 4L QA corridor render.
- Did not ingest evidence files, access external sources, download/cache/ingest/convert data, link businesses/tenants/signs/POIs/source records, promote QA cues, expose normal mode, or start 4L render work, 4M, or 4P.

Unresolved decisions:
- Batu owns whether to supply or approve the missing evidence set and whether any later evidence-backed 4L QA corridor render packet, source access, evidence intake, linkage, normal-mode exposure, or claim promotion may open.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4L-Prep Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4K-3 Local Recognizability Review Pack

Status:
- Complete and verified; pending Batu review.

Scope:
- Assess whether the QA-only recognizable anchor cue layer helps someone familiar with Greenpoint begin to identify the corridor, without promoting any factual claim.

Files changed:
- `docs/reports/phase-4k-3-local-recognizability-review-pack.md`
- `scripts/verify-phase-4k-3-local-recognizability-review-pack.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`
- `node scripts/verify-phase-4k-2-qa-recognizable-anchor-runtime-overlay.mjs`
- `node scripts/verify-phase-4k-3-local-recognizability-review-pack.mjs`
- `node scripts/verify-phase-4j-3-candidate-readiness-report.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4o-20-spatial-usefulness-review-pack.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `npm run build`
- `git diff --check`
- `git status --short`

Outcome:
- Recorded a partial-yes QA-only recognizability review: 4K improves endpoint/corner and generic corridor identity compared with 4J, but remains unsafe to promote.
- Classified remaining recognizability gaps with only the approved bounded 4K categories.
- Recommended any later evidence-backed facade cue intake or source-backed geometry/evidence planning only as a proposal.
- Did not start evidence intake, source access, business/source linkage, 4L, 4P, normal-mode promotion, or claim promotion.

Unresolved decisions:
- Batu owns whether the QA-only recognizable anchor proof is useful enough and whether any later evidence-backed facade cue intake or source-backed geometry/evidence planning packet may open.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4K-3 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4K-2 QA Runtime Recognizable Anchor Overlay

Status:
- Complete and verified.

Scope:
- Render recognizable anchor cues in QA mode only, layered over existing 4O scaffold and 4J frontage/bay guides.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `scripts/verify-phase-4k-2-qa-recognizable-anchor-runtime-overlay.mjs`
- `docs/reports/phase-4k-2-qa-recognizable-anchor-runtime-overlay.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`
- `node scripts/verify-phase-4k-2-qa-recognizable-anchor-runtime-overlay.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `npm run build`
- `git diff --check`

Outcome:
- Rendered 18 QA-only recognizable anchor cue records as generic guide overlays behind QA mode.
- Added cue-category filters and readouts for cue category, linked 4O anchor, linked 4J candidate, QA-only status, and blocked claims.
- Normal mode remains protected with zero records, all cues remain non-promoted, and blocked claims remain blocked.

Unresolved decisions:
- Batu owns whether the visible cue layer improves local recognizability enough to guide the next phase.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4K-3: Local Recognizability Review Pack`, with no pre-authorized queue after 4K-3.

### 2026-06-08 - Batch 4K-1 Recognizable Anchor Cue Contract + Fixture

Status:
- Complete and verified.

Scope:
- Create a QA-only recognizable anchor cue fixture derived only from existing repo evidence/cue IDs and current 4O/4J anchors.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json`
- `scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`
- `docs/reports/phase-4k-1-recognizable-anchor-cue-contract-fixture.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `git diff --check`

Outcome:
- Added 18 QA-only recognizable anchor cue records across all 10 existing 4O building anchors.
- Linked each cue to existing 4J candidate lineage and used existing 4E cue ID references where available.
- Preserved normal mode with zero records and no source access, evidence intake, business/source linkage, claim promotion, production claim, or public claim.

Unresolved decisions:
- Batu owns whether the QA-only cue layer is useful enough for corridor recognizability and whether later evidence-backed facade cue intake or geometry/evidence planning may open.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4K-2: QA Runtime Recognizable Anchor Overlay`, with 4K-3 queued and a hard Batu review gate after 4K-3.

### 2026-06-08 - Batch 4J-3 Candidate Gap + Readiness Report

Status:
- Complete and verified; pending Batu review.

Scope:
- Assess the QA-only storefront bay/frontage candidate layer for coverage, visible usefulness, normal-mode isolation, blocked fields, missing evidence, and unsafe promotion areas.

Files changed:
- `docs/reports/phase-4j-3-candidate-gap-readiness-report.md`
- `scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `scripts/verify-phase-4j-3-candidate-readiness-report.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `node scripts/verify-phase-4j-3-candidate-readiness-report.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `npm run build`
- `git diff --check`
- `git status --short`

Outcome:
- Classified 4J gaps with only the approved bounded categories.
- Recorded that 22 QA-only candidates cover 10 existing 4O anchors, remain non-promoted, and remain isolated from normal mode.
- Recommended any later evidence/business linkage planning only as a proposal.
- Did not start evidence linkage, source access, business/source linkage, facade evidence intake, normal-mode promotion, or claim promotion.

Unresolved decisions:
- Batu owns whether the QA-only frontage/bay candidate layer is useful enough for later planning and whether any later evidence/business linkage packet may open.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4J-3 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4J-2 QA Runtime Frontage Candidate Overlay

Status:
- Complete and verified.

Scope:
- Render generic frontage/bay candidate guides in QA mode only, with candidate type filters/readouts and normal-mode protection.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `docs/reports/phase-4j-2-qa-frontage-runtime-overlay.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `npm run build`
- `git diff --check`

Outcome:
- Rendered 22 QA-only candidate records as generic guide overlays behind QA mode.
- Added candidate-type filters and readouts for linked 4O anchor, QA-only status, and blocked claims.
- Normal mode remains protected with zero records, all candidates remain non-promoted, and blocked claims remain blocked.

Unresolved decisions:
- Batu owns whether the candidate layer is visibly useful enough for evidence/business linkage planning after 4J-3.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4J-3: Candidate Gap + Readiness Report`, with no pre-authorized queue and a hard Batu review gate after 4J-3.

### 2026-06-08 - Batch 4J-1 Frontage Candidate Contract + Fixture

Status:
- Complete and verified.

Scope:
- Create a QA-only storefront bay/frontage candidate contract and fixture derived only from existing 4O scaffold building anchors.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4j-1-qa-frontage-candidates.v0.1.json`
- `scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `docs/reports/phase-4j-1-frontage-candidate-contract-fixture.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `git diff --check`

Outcome:
- Added 22 QA-only candidate records mapped to 10 existing 4O building anchors.
- Allowed candidate types are limited to `frontage_band_candidate`, `bay_rhythm_candidate`, `corner_wrap_candidate`, and `setback_depth_candidate`.
- Normal mode remains protected with zero records, all candidates are non-promoted, and blocked claims remain blocked.

Unresolved decisions:
- Batu owns whether the later rendered 4J candidate overlay is useful enough for evidence/business linkage planning after 4J-3.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4J-2: QA Runtime Frontage Candidate Overlay`, with `Batch 4J-3: Candidate Gap + Readiness Report` queued before a hard Batu review gate.

### 2026-06-08 - Batch 4O-18 To 4O-20 Corridor-Wide QA Scaffold Expansion And Spatial Review

Status:
- Complete and verified; pending Batu review.

Scope:
- Expand the existing QA scaffold preview into a more useful corridor-wide spatial scaffold review layer using existing local runtime anchors only, add QA-only family controls/readouts, and record a spatial-usefulness review pack.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1.json`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/reports/phase-4o-20-qa-scaffold-spatial-usefulness-review.md`
- `scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `scripts/verify-phase-4o-20-spatial-usefulness-review-pack.mjs`
- `scripts/verify-phase-4o-15-qa-scaffold-preview-runtime.mjs`
- `scripts/verify-phase-4o-17-qa-scaffold-preview-legibility.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- Browser inspection at `http://127.0.0.1:5181/` in QA mode and normal mode.
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `node scripts/verify-phase-4o-20-spatial-usefulness-review-pack.mjs`
- Relevant prior 4O verifiers.
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `npm run build`
- `git diff --check`

Outcome:
- Expanded QA scaffold preview coverage from 6 seed records to 26 derived QA-only records.
- Added 10 building/container placeholders, 6 grounding guide placeholders, and 10 height/massing cap placeholders.
- Added QA-only family filters for `container`, `grounding`, and `height`.
- Browser QA mode reported `26 visible / 26 QA placeholders / 0 normal`; turning `container` off reported `16 visible / 26 QA placeholders / 0 normal`.
- Normal mode remained protected: QA panel and family filters were absent, and scaffold readouts reported `QA off`.

Unresolved decisions:
- Batu owns whether the expanded QA scaffold is spatially useful enough, whether a corrective camera/framing/placement/color hierarchy pass is needed, and whether source-backed scaffold ingestion may open.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4O-20 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4O-17 QA Scaffold Preview Legibility Pass

Status:
- Complete and verified; pending Batu review.

Scope:
- Improve visual legibility of the existing QA scaffold preview only, without adding normal-mode exposure, public UI, source access, factual claims, business/storefront/facade/frontage/entrance claims, exact height/roof claims, dependencies, or new public module boundaries.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json`
- `docs/reports/phase-4o-17-qa-scaffold-preview-legibility-report.md`
- `scripts/verify-phase-4o-17-qa-scaffold-preview-legibility.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- Browser inspection at `http://127.0.0.1:5180/` in QA mode and normal mode.
- `node scripts/verify-phase-4o-17-qa-scaffold-preview-legibility.mjs`
- `node scripts/verify-phase-4o-16-qa-scaffold-preview-report.mjs`
- `node scripts/verify-phase-4o-15-qa-scaffold-preview-runtime.mjs`
- `node scripts/verify-phase-4o-14-qa-preview-scaffold-adapter.mjs`
- `node scripts/verify-phase-4o-13-render-compatibility-mapping.mjs`
- `node scripts/verify-phase-4o-12-reconnection-boundary.mjs`
- `node scripts/verify-phase-4o-11-scaffold-candidate-gap-report.mjs`
- `node scripts/verify-phase-4o-10-scaffold-candidates.mjs`
- `node scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`
- `node scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `npm run build`
- `git diff --check`

Outcome:
- Added QA-only scene labels for `4O container`, `4O ground`, and `4O height`.
- Added QA-only scaffold outline/tether roles and stronger opacity/contrast for the existing six records.
- Added QA family counts and a QA-only inspector section for selected scaffold traces.
- Added adapter legibility metadata while preserving all 4O-10 candidate traces and blocked claims.
- Confirmed normal mode remains protected: QA button off, `4O scaffold preview` readout says `QA off`, and 4O scaffold labels/tethers/outlines are not visible in normal mode.

Unresolved decisions:
- Batu owns visual acceptance of the stronger labels/outlines and whether the preview is legible enough for spatial usefulness review or needs camera/placement/color hierarchy correction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4O-17 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4O-13 -> 4O-16 QA Scaffold Preview Reconnection

Status:
- Complete and verified; pending Batu review.

Scope:
- Reconnect the 4O scaffold-candidate path to the existing QA corridor runtime by mapping candidates to existing render anchors, creating a QA-only adapter, rendering generic scaffold placeholders behind the existing QA toggle, and reporting readiness/gaps.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-13-existing-render-compatibility-mapping.v0.1.json`
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/reports/phase-4o-16-qa-scaffold-preview-report.md`
- `scripts/verify-phase-4o-13-render-compatibility-mapping.mjs`
- `scripts/verify-phase-4o-14-qa-preview-scaffold-adapter.mjs`
- `scripts/verify-phase-4o-15-qa-scaffold-preview-runtime.mjs`
- `scripts/verify-phase-4o-16-qa-scaffold-preview-report.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-16-qa-scaffold-preview-report.mjs`
- `node scripts/verify-phase-4o-15-qa-scaffold-preview-runtime.mjs`
- `node scripts/verify-phase-4o-14-qa-preview-scaffold-adapter.mjs`
- `node scripts/verify-phase-4o-13-render-compatibility-mapping.mjs`
- `node scripts/verify-phase-4o-12-reconnection-boundary.mjs`
- `node scripts/verify-phase-4o-11-scaffold-candidate-gap-report.mjs`
- `node scripts/verify-phase-4o-10-scaffold-candidates.mjs`
- `node scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`
- `node scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `npm run build`
- `git diff --check`

Outcome:
- Added a visible QA-only scaffold preview layer for all six 4O-10 candidates.
- Building/container candidates render as generic translucent container shells; grounding candidates render as low guide-alignment bands; height/massing candidates render as generic cap markers.
- Every rendered QA record traces back to a 4O-10 candidate and a 4O-13 existing-render mapping.
- Normal mode remains protected; the adapter reports zero normal-mode records.
- Did not fetch external data, add dependencies, add public UI, expose normal mode, link businesses, signs, entrances, exact facades, or tenant frontage, or promote claims.

Unresolved decisions:
- Batu owns packet acceptance, whether current scaffold placeholders meet the spatial-recognizability bar, whether to expand/correct the QA-only scaffold preview, and whether any later source access or source-backed scaffold fixture work may open.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4O-16 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4O-12 Existing QA Render Reconnection Boundary

Status:
- Complete and verified; pending Batu review.

Scope:
- Add a narrow reconnection boundary explaining how the 4O scaffold-candidate path will later compare against or feed the existing QA corridor render without adding runtime rendering.

Files changed:
- `docs/phase-4o-12-existing-qa-render-reconnection-boundary.md`
- `scripts/verify-phase-4o-12-reconnection-boundary.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-12-reconnection-boundary.mjs`
- `node scripts/verify-phase-4o-11-scaffold-candidate-gap-report.mjs`
- `node scripts/verify-phase-4o-10-scaffold-candidates.mjs`
- `node scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`
- `node scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added a QA-only non-rendering reconnection boundary for the 4O scaffold-candidate path.
- Defined future checks for coordinate/orientation compatibility, camera/preset compatibility, object ID mapping, grounding alignment, height/massing interpretation, blocked facade/business/frontage/sign/entrance claims, and normal-mode isolation.
- Explicitly blocked a parallel disconnected scaffold universe.
- Did not fetch external data, add dependencies, render runtime geometry, add public interfaces, connect businesses, signs, entrances, exact facades, or tenant frontage, or promote claims.

Unresolved decisions:
- Batu owns 4O-10 -> 4O-12 packet acceptance, future QA render integration approval, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4O-12 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4O-11 Scaffold Candidate QA Gap Report

Status:
- Complete and verified.

Scope:
- Add a QA-only scaffold candidate gap/coverage report with candidate counts by family, missing/blocked fields, claim statuses, source-lane/provenance coverage, and QA-only preview readiness.

Files changed:
- `docs/reports/phase-4o-11-scaffold-candidate-qa-gap-report.md`
- `scripts/verify-phase-4o-11-scaffold-candidate-gap-report.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-11-scaffold-candidate-gap-report.mjs`
- `node scripts/verify-phase-4o-10-scaffold-candidates.mjs`
- `node scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`
- `node scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added a QA-only non-rendering report for 4O-10 scaffold candidates.
- Reported candidate counts by family, missing/blocked fields, claim labels, source-lane/provenance coverage, and readiness.
- Marked the candidate set not ready for QA-only preview because geometry is symbolic, grounding alignment is blocked, height/massing interpretation is blocked, source records are not loaded, and runtime integration remains blocked.
- Did not fetch external data, add dependencies, render runtime geometry, add public interfaces, connect businesses, signs, entrances, exact facades, or tenant frontage, or promote claims.

Unresolved decisions:
- Batu owns 4O-10 -> 4O-12 packet acceptance, future QA render integration approval, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now names 4O-12 as current with no pre-authorized queue and a hard Batu review gate after 4O-12.

### 2026-06-08 - Batch 4O-10 Scaffold Candidate Generation

Status:
- Complete and verified.

Scope:
- Generate deterministic scaffold-candidate records from the 4O-8 scaffold-input fixture across building/container, grounding/street/sidewalk/curb, and height/massing families.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json`
- `scripts/verify-phase-4o-10-scaffold-candidates.mjs`
- `scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-10-scaffold-candidates.mjs`
- `node scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`
- `node scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added six deterministic scaffold-candidate records derived from 4O-8 with preserved derivation links through 4O-7 and 4O-6.
- Kept the candidate set offline/test-only, QA-only, not render-ready, not a scaffold manifest, not public, and disconnected from runtime and normal mode.
- Did not fetch external data, add dependencies, render runtime geometry, add public interfaces, connect businesses, signs, entrances, exact facades, or tenant frontage, or promote claims.

Unresolved decisions:
- Batu owns 4O-10 -> 4O-12 packet acceptance, future QA render integration approval, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now names 4O-11 as current and 4O-12 as the only pre-authorized queued batch.

### 2026-06-08 - Batch 4O-9 QA-Only Scaffold Input Inspector

Status:
- Complete and verified; pending Batu review.

Scope:
- Add a QA-only non-rendering inspector/report that makes 4O-8 scaffold-input records easy to evaluate without runtime scene integration, public UI, or normal-mode exposure.

Files changed:
- `docs/reports/phase-4o-9-qa-only-scaffold-input-inspector.md`
- `scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`
- `node scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added a Markdown inspector summarizing 4O-8 scaffold-input counts, source lanes, input families, target scaffold families, source statuses, claim-status labels, and blocked claims.
- Added verifier coverage to ensure the inspector matches 4O-8 records and preserves no-source, no-render, no-public-interface, no-normal-mode, no-business/sign/entrance/facade/tenant-frontage, and no-claim-promotion boundaries.
- Did not fetch external data, add dependencies, render runtime geometry, add public interfaces, connect businesses, signs, entrances, exact facades, or tenant frontage, or promote claims.

Unresolved decisions:
- Batu owns acceptance of the 4O-7 -> 4O-9 scaffold-input proof packet, whether to open first real source fixture ingestion or request another corrective offline pass, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4O-9 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4O-8 Deterministic Scaffold Input Fixture

Status:
- Complete and verified.

Scope:
- Add the smallest deterministic scaffold-input fixture derived from 4O-7, including building/container inputs, grounding inputs, and height/massing inputs.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-8-deterministic-scaffold-input-fixture.v0.1.json`
- `scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added six deterministic scaffold-input records derived from 4O-7 across building/container, grounding, and height/massing families.
- Kept the fixture separate from the 4O-4 placeholder scaffold manifest and explicitly test-only/offline-only.
- Added verifier coverage for deterministic IDs, derivation links, blocked claims, zero source access, zero runtime coupling, no public-interface coupling, and no claim promotion.
- Did not fetch external data, add dependencies, render runtime geometry, add public interfaces, connect businesses, signs, entrances, exact facades, or tenant frontage, or promote claims.

Unresolved decisions:
- Batu owns 4O-8 acceptance, 4O-9 packet-end acceptance, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now names 4O-9 as current with no pre-authorized queue.

### 2026-06-08 - Batch 4O-7 Offline Adapter Normalization

Status:
- Complete and verified.

Scope:
- Normalize 4O-6 offline adapter rows into a deterministic scaffold-input shape while preserving source-lane labels, claim-status labels, no-source-access status, derivation links, and blocked-claim fields.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-7-offline-adapter-normalization.v0.1.json`
- `scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added six deterministic normalized scaffold-input candidate records derived from the 4O-6 offline adapter rows.
- Preserved source-lane labels, claim-status labels, no-source-access status, derivation links, blocked-claim fields, test-only/offline-only status, and separation from the 4O-4 placeholder scaffold manifest.
- Did not fetch external data, add dependencies, render runtime geometry, add public interfaces, connect businesses, signs, entrances, exact facades, or tenant frontage, or promote claims.

Unresolved decisions:
- Batu owns 4O-7 acceptance, 4O-8/4O-9 packet-end acceptance, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now names 4O-8 as current and 4O-9 as the only pre-authorized queued batch.

### 2026-06-08 - Batch 4O-6 Offline Source Adapter Skeleton

Status:
- Complete, verified, and accepted by Batu for purposes of opening the 4O-7 -> 4O-9 packet.

Scope:
- Implement the first offline source-adapter skeleton for the truth-first corridor scaffold pipeline using local deterministic fixture records only.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-6-offline-source-adapter-fixture.v0.1.json`
- `scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added a six-record offline source-adapter fixture with building/container, street/sidewalk/curb/grounding, and height/massing source-row shapes.
- Marked the adapter records as local fixture/test-only, not source-accessed, not verified, not runtime-coupled, and separate from the 4O-4 placeholder scaffold manifest.
- Added verifier coverage for stable IDs, source-lane labels, claim-status labels, blocked claim promotion, deterministic order, manifest separation, summary counts, no tenant/business/sign/entrance/frontage promotion, and no runtime/public-interface coupling.
- Did not fetch external data, add dependencies, render runtime geometry, add public interfaces, connect businesses, signs, entrances, exact facades, or tenant frontage, or promote claims.

Unresolved decisions:
- Batu owns 4O-6 acceptance, whether to open first real source fixture ingestion or request another corrective offline-adapter pass, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4O-6 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4O-5 Source Adapter And Fixture Ingestion Boundary

Status:
- Complete and verified.

Scope:
- Define the narrow next truth-first source-adapter and fixture-ingestion boundary for future real corridor scaffold data without fetching live data, rendering runtime geometry, adding dependencies, or making exact facade/business/frontage claims.

Files changed:
- `docs/phase-4o-5-source-adapter-fixture-ingestion-boundary.md`
- `scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added a concise source-adapter / fixture-ingestion boundary for future real scaffold data.
- Defined building container, grounding, height/massing, facade-evidence, and manual override lanes.
- Preserved strict claim boundaries: building mass/container truth is not tenant truth, frontage/classification remains provisional unless evidence-backed, facade detail remains blocked until evidence/manual override records exist, and approximate grounding must be explicitly labeled.
- Preserved the truth-first order: spatial scaffold first, facade recognizability second, art direction third.
- Did not fetch live external sources, create source fixtures, add runtime rendering, add dependencies, add public UI, connect exact businesses/signs/entrances/tenant frontage, change public interfaces/module boundaries, or promote claims.

Unresolved decisions:
- Batu owns source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4O-5 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4O-4 Minimal Placeholder Scaffold Manifest

Status:
- Complete and verified.

Scope:
- Add the smallest deterministic placeholder scaffold manifest generated or derived from the 4O-2 stub, with verifier coverage for deterministic IDs, required scaffold families, blocked claims, and zero source access.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json`
- `scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added a deterministic placeholder scaffold manifest derived from the 4O-2 fixture stub.
- Included 15 placeholder scaffold records across five required families: building mass, grounding surface, height/massing output, frontage/classification output, and override-slot reference.
- Added verifier coverage for deterministic IDs, 4O-2 derivation links, required record families, cross-links, blocked claims, placeholder geometry without coordinates, null height/floor values, empty override slots, zero source access, no runtime consumer, and zero production/public claims.
- Did not download or ingest external data, change runtime rendering, render scaffold geometry, add package/tooling, create Blender/GLB assets, automate Mapillary, change public interfaces/module boundaries, or promote storefront, tenant, exact facade, frontage, entrance, signage, active-status, exact-address, exact-height, exact-roof, production, or public claims.

Unresolved decisions:
- Batu owns source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4O-4 Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4O-3 First Deterministic Scaffold Generation Contract

Status:
- Complete and verified.

Scope:
- Define the narrow internal scaffold-generation contract from the 4O-2 fixture stub without source access, runtime rendering, public-interface changes, or module-boundary changes.

Files changed:
- `docs/phase-4o-3-deterministic-scaffold-generation-contract.md`
- `scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Accepted 4O-2 per Batu instruction and opened/completed 4O-3.
- Added a contract for deriving future placeholder scaffold manifest records from the 4O-2 fixture stub.
- Defined allowed input collections, output record families, required fields, deterministic ID rules, and claim boundaries for building mass records, grounding surface records, height/massing outputs, frontage/classification outputs, and override-slot references.
- Did not generate a scaffold manifest, download or ingest external data, change runtime rendering, add package/tooling, create Blender/GLB assets, automate Mapillary, change public interfaces/module boundaries, or promote storefront, tenant, exact facade, frontage, entrance, signage, active-status, exact-address, production, or public claims.

Unresolved decisions:
- Batu owns 4O-3 acceptance, 4O-4 review after completion, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4O-4: Minimal Placeholder Scaffold Manifest` as the current executable batch and requires a Batu review gate after 4O-4.

### 2026-06-08 - Batch 4O-2 Truth-First Corridor Fixture Stub

Status:
- Complete, verified, and accepted by Batu.

Scope:
- Create the smallest repo-local fixture-ready stub for the Greenpoint Ave corridor scaffold from Manhattan Ave to Franklin Ave, using only planning-safe placeholder/source-reference records.

Files changed:
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-2-truth-first-corridor-fixture-stub.v0.1.json`
- `scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Accepted 4O-1 per Batu instruction and opened/completed the narrow 4O-2 fixture-stub batch.
- Added a planning-safe 4O-2 fixture stub with representative building footprint records, street/sidewalk/curb grounding records, height/massing fallback records, frontage/corner classification records, and empty manual override slots.
- Added a verifier that enforces placeholder/source-reference-only status, required record families, blocked claim boundaries, no source access/download/cache/ingestion/conversion/render use, no runtime consumer, no procedural scaffold generation, and no production/public claims.
- Updated the 4O-1 verifier so it remains valid after the current brief moved from 4O-1 pending review to 4O-1 accepted plus 4O-2 complete.
- Did not download or ingest external data, change runtime rendering, generate scaffold geometry, add package/tooling, create Blender/GLB assets, automate Mapillary, change public interfaces/module boundaries, or promote storefront, tenant, exact facade, frontage, entrance, signage, active-status, exact-address, production, or public claims.

Unresolved decisions:
- Batu owns source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- At 4O-2 completion, `docs/CURRENT_EXECUTION_BRIEF.md` held at that Batu review gate with no executable batch and no pre-authorized queue. Batu later accepted 4O-2 and opened the 4O-3 -> 4O-4 packet.

### 2026-06-08 - Batch 4O-1 Truth-First Corridor Data Contract

Status:
- Complete, verified, and accepted by Batu.

Scope:
- Define the first source-to-scaffold data contract for a truthful procedural Greenpoint Ave corridor scaffold from Manhattan Ave to Franklin Ave.

Files changed:
- `docs/phase-4o-1-truth-first-corridor-data-contract.md`
- `scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

Outcome:
- Added a narrow 4O-1 contract note and verifier.
- Defined planning-only / fixture-ready JSON record shapes for building footprints, street/sidewalk/curb grounding, height/massing fallbacks, frontage/corner classification, and manual override slots.
- Preserved strict claim boundaries for storefront, tenant, exact facade, entrance, signage, active status, exact address, production, and public claims.
- Kept Blender/GLB as an optional override hook only.
- Did not download data, create source fixtures, implement ingestion, alter runtime rendering, add Blender/GLB assets, add Mapillary automation, change package/tooling, or change public interfaces/module boundaries.

Unresolved decisions:
- Batu owns source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- At 4O-1 completion, `docs/CURRENT_EXECUTION_BRIEF.md` held at that Batu review gate with no executable batch and no pre-authorized queue. Batu later accepted 4O-1 and opened 4O-2.

### 2026-06-08 - Truth-First Hybrid Planning Reconciliation

Status:
- Complete; docs-only planning update.

Scope:
- Reframe the next planning direction around `Batch 4O: Truth-First Procedural Corridor Scaffold` without opening implementation.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/reference/DATA_SOURCES.md`

Verification:
- `git status --short` before edits: clean.
- `git diff --check`

Outcome:
- Proposed 4O as the next implementation candidate for Greenpoint Ave from Manhattan Ave to Franklin Ave.
- Reframed the roadmap around spatial truth first, facade recognizability second, and art direction third.
- Reclassified Blender/GLB assets as optional enhancement/override layers rather than the immediate primary production path.
- Added planning-only 4O source-lane documentation and a planning-only future building/override record shape.
- Did not change runtime code, source fixtures, package/tooling, ingestion scripts, data downloads, renderer, public interfaces, or module boundaries.

Unresolved decisions:
- Batu owns whether to open 4O implementation, source access/download/cache/conversion/render-use boundaries, spatial recognizability acceptance, and later facade/art/promotion gates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now proposes 4O as the next implementation candidate and keeps implementation blocked pending Batu approval.

### 2026-06-08 - Batch 4I-4 QA Corridor Cue Legibility Correction

Status:
- Complete and verified; pending Batu visual/review gate.

Scope:
- Correct the QA-only 4I corridor facade cue runtime view so it is easier to review before any 4J decision.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `scripts/verify-phase-4i-1-corridor-facade-cue-expansion-plan.mjs`
- `scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `docs/phase-4i-corridor-facade-cue-expansion.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4i-1-corridor-facade-cue-expansion-plan.mjs`
- `node scripts/verify-phase-4i-corridor-facade-cues.mjs`
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4f-facade-cue-model.mjs`
- `node scripts/verify-phase-4h-1-facade-evidence-intake-workflow.mjs`
- `node scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`
- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `npm run build`
- `git diff --check`

Outcome:
- Replaced stale 4E-5 runtime header copy with 4I-4 corridor cue review copy.
- Reduced mid-corridor insufficient-evidence placeholder opacity, width, detail density, and hover/selection emphasis.
- Preserved endpoint evidence-backed facade volumes as visually primary.
- Kept blocked/no-evidence records out of rendered facade geometry and kept normal mode protected.
- Did not start 4J, create storefront bay/frontage candidates, link businesses/POIs, add sources/dependencies/assets, or promote claims.

Unresolved decisions:
- Batu owns 4I-4 visual acceptance and whether to open 4J or any later/corrective packet.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the 4I-4 Batu visual/review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4I-3 QA Corridor Facade Render Legibility Pass

Status:
- Complete and verified; browser visual smoke pending outside this restricted environment.

Scope:
- Improve QA-only runtime legibility using the 4I-2 corridor facade cue fixture while preserving normal mode unchanged.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `docs/phase-4i-corridor-facade-cue-expansion.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
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

Outcome:
- Added an internal QA-only runtime consumer for the 4I corridor facade cue fixture.
- Rendered `mid_corridor_insufficient_evidence` records as subdued placeholder bands for streetwall rhythm, massing, depth/setback, and non-claim bay cadence.
- Kept existing endpoint evidence-backed 4E/4F facade volumes visually primary.
- Kept blocked/no-evidence records in QA summaries and inspector readouts instead of creating facade geometry.
- Added review-panel, QA-panel, legend, and inspector readouts for 4I lane/status/provenance.
- Did not expose normal mode, ingest external source data, promote sources or claims, link businesses, create storefront anchors, add dependencies, add credentials, replace renderer, create production assets, or open 4J/4K/4M.

Unresolved decisions:
- Batu owns packet acceptance, visual legibility review, whether to open a narrow 4I corrective pass or 4J, and any future source promotion, evidence approval, claim promotion, normal/product exposure, business/storefront/frontage/entrance/address/signage/tenant/material/active-status decisions, dependencies/APIs/credentials/architecture changes, visual-system/art-direction translation, and later work.

Notes:
- Browser QA could not run because local server startup was blocked by sandbox network binding permissions and in-app browser navigation to the built `file://` artifact was blocked by browser URL policy.
- Batch commits were attempted but blocked by local `.git` metadata write permissions.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the packet-end Batu visual/review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4I-2 Corridor Facade Cue Fixture Expansion

Status:
- Complete and verified.

Scope:
- Add a QA-only corridor facade cue fixture for eligible corridor geometry containers with deterministic IDs, provenance/status fields, endpoint evidence-backed lanes, mid-corridor insufficient-evidence lanes, blocked gaps, and verifier guardrails.

Files changed:
- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json`
- `scripts/verify-phase-4i-corridor-facade-cues.mjs`
- `docs/phase-4i-corridor-facade-cue-expansion.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4i-corridor-facade-cues.mjs`
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4f-facade-cue-model.mjs`
- `node scripts/verify-phase-4h-1-facade-evidence-intake-workflow.mjs`
- `node scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`
- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

Outcome:
- Added 142 deterministic QA-only corridor facade cue records: 6 endpoint evidence-backed records preserving existing 4E/4F repo-local Batu-supplied evidence references, 36 mid-corridor insufficient-evidence/manual-draft placeholder records, and 100 blocked/no-evidence gap records.
- Preserved stable 4B scene IDs, 4C geometry cue references, endpoint evidence separation, QA-only exposure, normal-mode protection, no source access, no source promotion, no business linkage, no exact claims, no production assets, and no 4J/4K/4M work.
- Did not change runtime/source app files; build was not required for 4I-2.

Unresolved decisions:
- Batu owns final 4I packet review, runtime legibility judgment after 4I-3, any source promotion, evidence approval, claim promotion, normal/product exposure, business/storefront/frontage/entrance/address/signage/tenant decisions, dependencies/APIs/credentials/architecture changes, visual-system/art-direction translation, and opening 4J or later work.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `4I-3: QA Corridor Facade Render Legibility Pass`; no further queue is open.

### 2026-06-08 - Batch 4I-1 Corridor Facade Cue Expansion Plan

Status:
- Complete pending commit verification.

Scope:
- Open Batu's bounded Phase 4I packet and define the implementation plan for corridor facade cue expansion.

Files changed:
- `docs/phase-4i-1-corridor-facade-cue-expansion-plan.md`
- `scripts/verify-phase-4i-1-corridor-facade-cue-expansion-plan.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4i-1-corridor-facade-cue-expansion-plan.mjs`
- `node scripts/verify-phase-4h-1-facade-evidence-intake-workflow.mjs`
- `node scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`
- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

Outcome:
- Distinguished endpoint evidence-backed records, mid-corridor insufficient-evidence/manual-draft records, and blocked/no-evidence gaps for the next fixture batch.
- Defined 4I-2 fixture/verifier boundaries and 4I-3 QA-only runtime legibility boundaries.
- Did not change runtime/source app files, ingest external source data, promote sources or claims, link businesses, create storefront anchors, expose normal mode, add dependencies, add credentials, create production assets, or open 4J/4K/4M.

Unresolved decisions:
- Batu owns final 4I packet review, any source promotion, evidence approval, claim promotion, normal/product exposure, business/storefront/frontage/entrance/address/signage/tenant decisions, dependencies/APIs/credentials/architecture changes, visual-system/art-direction translation, and opening 4J or later work.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `4I-2: Corridor Facade Cue Fixture Expansion` with 4I-3 pre-authorized.

### 2026-06-08 - Batch 4H-1 Facade Evidence Intake Workflow Contract

Status:
- Complete.

Scope:
- Define the source-safe facade evidence intake workflow: evidence record shape, provenance fields, allowed claim levels, review statuses, storage/cache/display rules, blocked-claim behavior, and verifier requirements.

Files changed:
- `docs/phase-4h-1-facade-evidence-intake-workflow-contract.md`
- `src/data/facade-evidence-intake/greenpoint-ave-manhattan-to-franklin.phase-4h-1-facade-evidence-intake-workflow-contract.v0.1.json`
- `scripts/verify-phase-4h-1-facade-evidence-intake-workflow.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4h-1-facade-evidence-intake-workflow.mjs`
- `node scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`
- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

Outcome:
- Defined future facade evidence record shape, required provenance fields, allowed review-only claim levels, review statuses, source policies, storage/cache/display rules, blocked-promotion triggers, and verifier requirements.
- Kept external candidate imagery defaults at no imagery storage, thumbnail storage, file URL storage, metadata storage, render use, texture use, training use, QA display, normal-mode display, or production use until later Batu gates.
- Kept `approved_evidence_backed` Batu-only.
- Did not ingest real imagery, promote sources, promote claims, create storefront anchors, link businesses, expose normal mode, change runtime/build files, add dependencies, credentials, paid APIs, architecture changes, production use, or exact claims.

Unresolved decisions:
- Batu owns packet acceptance, whether to open 4I, whether to open a corrective source-audit/intake-contract pass, source promotion, authenticated Mapillary terms review, KartaView full terms acceptance, source access/storage/display approval, claim promotion, production use, normal-mode/public use, and any later dependency/API/architecture work.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the packet-end Batu review gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Batch 4G-B Facade Evidence Source Audit

Status:
- Complete.

Scope:
- Audit public documentation, schemas, metadata fields, licensing/terms pages, attribution/display/cache constraints, and feasibility notes for Mapillary/KartaView as candidate facade/storefront evidence lanes only.

Files changed:
- `docs/phase-4g-b-facade-evidence-source-audit.md`
- `src/data/source-audits/greenpoint-ave-manhattan-to-franklin.phase-4g-b-facade-evidence-source-audit.v0.1.json`
- `scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`
- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

Outcome:
- Recorded Mapillary and KartaView as plausible future review-only facade evidence lane candidates for coverage availability, facade-plane visibility, storefront-bay visibility, entrance-cue visibility, sign-band visibility, window/door rhythm, corner-wrap visibility, occlusion, recency, and angle sufficiency.
- Recorded Mapillary API/terms as incomplete in this audit environment because developer/API terms were login-gated.
- Recorded CC BY-SA attribution/share-alike considerations for future Batu acceptance before any source use.
- Did not access imagery, call APIs, download, cache, ingest, extract, render, texture, train, runtime-use source material, add dependencies, credentials, paid APIs, architecture changes, normal-mode exposure, production use, business linkage, geometry-confidence promotion, source approval, or exact claims.

Unresolved decisions:
- Batu owns future authenticated Mapillary API/terms review, KartaView full terms acceptance, source access approval, imagery download/cache/ingestion/display approval, CC BY-SA share-alike acceptance, source promotion, claim promotion, production use, and normal-mode/public use.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `4H-1: Facade Evidence Intake Workflow Contract`.

### 2026-06-08 - Batch 4G-A Geometry Source Audit

Status:
- Complete.

Scope:
- Audit public documentation, schemas, file formats, metadata fields, licensing/terms pages, and feasibility notes for NYC 3D / CityGML / 3DCityDB as geometry-confidence candidates only.

Files changed:
- `docs/phase-4g-a-geometry-source-audit.md`
- `src/data/source-audits/greenpoint-ave-manhattan-to-franklin.phase-4g-a-geometry-source-audit.v0.1.json`
- `scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

Outcome:
- Recorded NYC 3D as a plausible future review-only geometry-confidence candidate for building heights, massing, roof volumes, block gaps, and geometry-container review.
- Recorded CityGML as a plausible standard/schema lane for interpreting future geometry records.
- Recorded 3DCityDB as a plausible future tooling path only, blocked behind later architecture/dependency approval.
- Did not download, cache, ingest, convert, extract, render, or runtime-use source data; did not add dependencies, credentials, paid APIs, architecture changes, normal-mode exposure, production use, business linkage, facade/storefront evidence, or exact claims.

Unresolved decisions:
- Batu owns future source access/download/cache/ingestion/conversion approval, terms acceptance, dependency/architecture approval, source promotion, geometry-confidence acceptance, production use, and normal-mode/public use.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `4G-B: Facade Evidence Source Audit for Mapillary/KartaView`.

### 2026-06-08 - Open Phase 4G Follow-On Source Audit Packet

Status:
- Complete as gate-opening control update.

Scope:
- Record Batu approval to open a bounded Phase 4G follow-on packet covering 4G-A, 4G-B, and 4H-1, with self-advance allowed only inside those named batches and stop conditions preserved.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- To be verified with the 4G-A batch after the first audit artifact/verifier is added: new 4G-A verifier, existing 4G verifier, and `git diff --check`.

Outcome:
- Opened `4G-A: Geometry Source Audit for NYC 3D / CityGML / 3DCityDB` as the current executable batch.
- Pre-authorized `4G-B: Facade Evidence Source Audit for Mapillary/KartaView`, then `4H-1: Facade Evidence Intake Workflow Contract`.
- Preserved review-only/non-production status, geometry/facade lane separation, no real source download/cache/ingestion, no business linkage, no exact storefront/frontage/entrance/address/signage/tenant claims, no normal-mode exposure, no production use, no Qwen/Oxen work, no new credentials/paid APIs/dependencies, and no architecture changes.

Unresolved decisions:
- Batu owns any source promotion, terms acceptance, real data access/download/cache/ingestion, claim promotion, credential/API/dependency/architecture approval, production use, and final packet review after 4H-1.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `4G-A: Geometry Source Audit for NYC 3D / CityGML / 3DCityDB`.

### 2026-06-08 - Batch 4G External Source Policy And Coverage Audit Contract

Status:
- Complete; accepted by Batu.

Scope:
- Create the source-policy and coverage-audit contract for future external source work while keeping geometry-confidence sources separate from facade-evidence sources and preserving all source-access, evidence, production, and claim-promotion gates.

Files changed:
- `docs/phase-4g-external-source-policy-coverage-audit-contract.md`
- `scripts/verify-phase-4g-source-policy-contract.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/DOCS_INDEX.md`

Verification:
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

Outcome:
- Added a review-only 4G source-policy contract that separates future 4G-A geometry-confidence auditing for NYC 3D / CityGML / 3DCityDB from future 4G-B facade-evidence auditing for Mapillary/KartaView.
- Defined allowed/prohibited use categories for access, attribution, storage/cache, derivative use, extraction, benchmark use, render use, training/generation use, and production use.
- Defined review-only coverage-audit record fields and future audit-opening acceptance criteria.
- Preserved Google 3D Tiles / Street View as benchmark-only or narrow-exception material unless separately cleared.
- Preserved Qwen/Oxen as deferred 4M visual-system acceleration, not evidence.
- Did not access sources, download/cache/ingest imagery or geometry, execute audits, run benchmarks, use Qwen/Oxen, change runtime behavior, connect business evidence, create exact storefront/frontage/entrance claims, expose normal mode, create production assets, stage files, or commit.

Unresolved decisions:
- Batu accepted the 4G contract and owns any later decision to open 4G-A, open 4G-B, request a narrow 4G correction, authorize source access/audit execution, allow benchmark work, or proceed toward evidence intake.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now holds at the post-4G stop gate with no executable batch and no pre-authorized queue.

### 2026-06-08 - Top-Level Docs Cleanup Batch A/B

Status:
- Complete as approved docs-organization cleanup.

Scope:
- Simplify top-level `docs/` by archiving stale governance/history files and moving stable reference material under `docs/reference/`, without starting 4G or moving review/evidence folders.

Files changed:
- `AGENTS.md`
- `docs/DOCS_INDEX.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/archive/governance/`
- `docs/archive/phase-2/`
- `docs/archive/phase-3/`
- `docs/reference/`
- Path references in docs/source metadata that pointed to moved docs.

Verification:
- `find docs -maxdepth 1 -mindepth 1 -print | sort`
- Stale moved-path search with `rg`
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- Archived retired top-level stubs and historical Phase 2/3 notes.
- Moved stable source/schema/provenance/reference docs and reference folders under `docs/reference/`.
- Updated path references to the new locations.
- Removed the empty `docs/phase-4d-candidate-poi-qa/` folder and moved top-level `docs/.DS_Store` out of the repo.
- Kept `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/DOCS_INDEX.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/MVP_SCOPE.md`, active Phase 4 support docs, and all review/evidence folders in place.
- Did not start 4G feature work, access sources, move evidence folders, stage files, or commit.

Unresolved decisions:
- Batu owns whether to run a later Phase 4 artifact move batch and whether/when to migrate review/evidence folders with fixture/verifier path updates.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` remains pointed at `Batch 4G: External Source Policy And Coverage Audit Contract`.

### 2026-06-07 - 4F/4G Review-Gate Reconciliation Cleanup

Status:
- Complete as docs/control cleanup.

Scope:
- Reconcile stale review-gate wording after Batu approved 4F-1 and 4G was opened, without beginning 4G feature work.

Files changed:
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4f-facade-cue-model-hardening.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short`
- `git diff --check`

Outcome:
- Updated the roadmap top summary so it no longer says the current state is a 4F-1 review gate with no later batch open.
- Updated the 4F review note so it records Batu approval of 4F-1 and the limited opening of 4G contract work.
- Did not start 4G feature work, access sources, run source audits, ingest data or imagery, change runtime behavior, stage files, or commit.

Unresolved decisions:
- Batu owns acceptance of the 4G contract output and any later decision to open 4G-A, 4G-B, source access/audit execution, benchmark work, or evidence intake.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` remains pointed at `Batch 4G: External Source Policy And Coverage Audit Contract`.

### 2026-06-07 - Open Batch 4G External Source Policy And Coverage Audit Contract

Status:
- Complete as gate-opening control update.

Scope:
- Record Batu approval of 4F-1 and open 4G as the current executable source-policy and coverage-audit contract batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `git diff --check`

Outcome:
- Marked 4F-1 approved by Batu.
- Opened `Batch 4G: External Source Policy And Coverage Audit Contract`.
- Preserved no pre-authorized queue and a hard Batu review gate after 4G.
- Limited 4G to contract definition that separates `4G-A: Geometry Source Audit` from `4G-B: Facade Evidence Source Audit`.
- Kept actual NYC 3D / CityGML / 3DCityDB source access/audit, Mapillary/KartaView access/audit, Google 3D Tiles/Street View benchmark work, Qwen/Oxen work, downloads, caches, ingestion, extraction, render use, source expansion, business linkage, exact storefront/frontage/entrance claims, production assets, normal-mode exposure, corridor expansion, and art-direction translation blocked.

Unresolved decisions:
- Batu owns acceptance of the 4G contract output and any later decision to open 4G-A, open 4G-B, authorize source access/audit execution, allow benchmark work, or proceed toward evidence intake.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now opens `Batch 4G: External Source Policy And Coverage Audit Contract` as the current executable batch.

### 2026-06-07 - 4G Source Audit Lane Separation Roadmap Update

Status:
- Complete as docs/control update.

Scope:
- Sharpen the post-4F roadmap so future 4G work separates geometry-source auditing from facade-evidence-source auditing without opening 4G or changing the completed 4F-1 packet.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `git diff --check`

Outcome:
- Renamed the future 4G direction to external source policy and coverage audit contract.
- Split future 4G into `4G-A: Geometry Source Audit` for NYC 3D / CityGML / 3DCityDB and `4G-B: Facade Evidence Source Audit` for Mapillary/KartaView.
- Recorded NYC 3D / CityGML / 3DCityDB as a future geometry-confidence candidate for heights, massing, roof volumes, block gaps, and review-only geometry containers only; it does not support storefront/frontage/entrance/tenant/signage/facade appearance/business claims.
- Preserved Mapillary/KartaView as preferred external candidate facade/storefront imagery lanes pending explicit source-policy approval, with Batu-supplied/project-owned imagery as fallback and adjudication.
- Recorded Google 3D Tiles/Street View as benchmark-only or narrow-exception material unless separately cleared, blocked from source-of-truth, stored facade reference, extracted geometry, texture source, training input, and production visual pipeline roles.
- Deferred Qwen/Oxen to 4M as a possible visual-system accelerator trained only from owned/approved references, deterministic cue blueprints, and Batu-approved style targets.
- Did not open 4G, access sources, ingest imagery/data, render external source material, or change runtime behavior.

Unresolved decisions:
- Batu owns 4F-1 review acceptance and any decision to open 4G or split it into separately executable 4G-A and 4G-B packets.
- Source-policy review must approve any later NYC 3D / CityGML / 3DCityDB, Mapillary/KartaView, Google 3D Tiles/Street View, or Qwen/Oxen use boundaries before access, ingestion, benchmark use, extraction, render use, training use, or production use.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still marks 4F-1 complete pending Batu review and opens no next batch.

### 2026-06-07 - Batch 4F-1 Facade Cue Model Hardening

Status:
- Complete pending Batu review.

Scope:
- Harden the QA-only facade cue model so future endpoint and corridor evidence can attach to stable facade plane, streetwall slot, side-return, depth/setback, ground-contact, and placeholder bay structures without creating storefront, entrance, business, production, or normal-mode claims.

Files changed:
- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- `scripts/verify-phase-4f-facade-cue-model.mjs`
- `docs/phase-4f-facade-cue-model-hardening.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4f-facade-cue-model.mjs`
- Full existing 4D/4C/4B verifier chain.
- `npm run build`
- `git diff --check`

Outcome:
- Added a 4F-1 QA-only model policy, stable unique facade plane IDs, streetwall slot/layout contracts, side-return/corner-wrap contracts, depth/setback/ground-contact contracts, non-claim storefront bay placeholders, and status/confidence states to the existing six endpoint QA facade records.
- Added verifier guardrails for unique facade plane IDs, computed slot extents, minimum rendered gaps, QA-only exposure, required evidence references, no business linkage, no exact frontage/entrance claims, non-claim placeholder bays, and forbidden raw claim fields.
- Preserved 0 business identity connections, 0 storefront anchors, 0 tenant frontage assignments, 0 exact frontage claims, 0 exact entrance claims, 0 exact facade/signage/entrance/material/color/address claims, 0 active-status claims, 0 production assets, 0 normal-mode records, 0 public/product claims, no Mapillary/KartaView work, and no art-direction translation.

Unresolved decisions:
- Batu owns acceptance of the hardened QA-only facade cue model and any decision to request a narrow 4F correction, open 4G source-policy/coverage-audit work, authorize source expansion, connect business evidence, approve exact associations, authorize storefront/frontage work, expose normal mode, or make production/public claims.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4F-1 complete pending Batu review and opens no next batch.

### 2026-06-07 - Batch 4E-5 Opaque Volumetric Legibility Pass

Status:
- Complete pending Batu visual review.

Scope:
- Correct the 4E endpoint facade proof so the six QA-only evidence-informed facade records read as more opaque, grounded, volumetric endpoint blocks while preserving normal-mode protection and all blocked claims.

Files changed:
- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- `scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `src/Phase4BRuntimePreview.jsx`
- `docs/phase-4e-evidence-informed-qa-facade-scene-proof.md`
- `docs/review-screenshots/phase-4e-5-opaque-volumetric-legibility-pass/`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- Full existing 4D/4C/4B verifier chain.
- `npm run build`
- Browser QA smoke at `http://127.0.0.1:5187/`.
- `git diff --check`

Outcome:
- Added a 4E-5 QA-only render-legibility contract with opacity minimums, computed rendered-gap checks, required ground contact, and per-record silhouette hierarchy.
- Made evidence facade geometry opaque/depth-writing in QA, hid evidence-target graybox underlays, further lowered synthetic/context line dominance, simplified secondary facade detail layers, and strengthened rendered separation/grounding.
- Captured normal, QA overview, Manhattan endpoint, Franklin endpoint, and mobile QA containment screenshots.
- Preserved 0 business identity connections, 0 storefront anchors, 0 tenant frontage assignments, 0 exact frontage claims, 0 exact facade/signage/entrance/material/color/address claims, 0 active-status claims, 0 production assets, 0 normal-mode records, 0 public/product claims, and no 4F work.

Unresolved decisions:
- Batu owns visual acceptance of the 4E-5 correction, any decision to request another narrow 4E correction, open 4F, connect business evidence, approve exact associations, authorize storefront/frontage work, expose normal mode, or make production/public claims.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4E-5 complete pending Batu visual review and opens no next batch.

### 2026-06-07 - Post-4E Roadmap And Candidate Imagery Lane Control Update

Status:
- Complete as docs/control update.

Scope:
- Record the refined high-level path from the current 4E-4 visual review gate toward a recognizable, source-backed Greenpoint Ave corridor, while keeping the current executable batch closed and preserving all 4E-4 stop conditions.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `git diff --check`

Outcome:
- Added the gated post-4E sequence: 4E visual review, 4F facade cue model hardening, 4G Mapillary/KartaView source policy + coverage audit contract, 4H facade evidence intake workflow, 4I corridor facade cue expansion, 4J storefront bay/frontage candidate layer, 4K business/source linkage, 4L evidence-backed QA corridor render, 4M asset registry / visual system / art-direction translation, and 4N normal-mode promotion + recognition QA.
- Recorded Mapillary/KartaView as preferred external candidate imagery lanes pending explicit source-policy approval, not approved primary production sources.
- Recorded Batu-supplied imagery as the controlled fallback and adjudication source for gaps, ambiguity, or unsupported claims.
- Preserved current state: 4E-4 complete pending Batu visual review, no open next batch, source-backed graybox corridor plus QA-only endpoint facade experiments, no authoritative business linkage, exact storefront/frontage/entrance claims, production assets, normal-mode exposure, or full art-directed corridor.
- Did not implement 4F-1 and did not ingest, download, cache, render, or extract from Mapillary/KartaView.

Unresolved decisions:
- Batu owns 4E-4 visual acceptance and any decision to open 4F-1, open a narrow 4E-5 corrective pass, or redesign the facade cue model.
- Batu/source-policy review must approve any later Mapillary/KartaView access, storage, attribution, derivative-use, extraction, render-use, or production-use boundary.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still marks 4E-4 complete pending Batu visual review and opens no next batch.

### 2026-06-07 - Batch 4E-4 Endpoint Facade Record Separation + Architectural Depth Correction

Status:
- Complete pending Batu visual review.

Scope:
- Turn the existing 6 QA evidence-informed endpoint facade records from clustered flat facade props into visibly separate, grounded, volumetric endpoint corner building blocks while preserving QA-only status, normal-mode protection, business disconnection, blocked claims, and synthetic-context separation.

Files changed:
- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- `scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/phase-4e-evidence-informed-qa-facade-scene-proof.md`
- `docs/review-screenshots/phase-4e-4-endpoint-facade-record-separation-depth-correction/`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4d-provisional-corner-association-shortlist.mjs`
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
- `npm run build`
- `git diff --check`
- Browser QA smoke at `http://127.0.0.1:5180/`: normal mode kept QA facades off; QA mode showed 6 evidence facades and 6 unique visual slots; Manhattan and Franklin endpoint cameras showed three separated volumetric blocks each; business evidence remained not connected; synthetic context remained labeled non-evidence; raw prohibited fields were absent from visible UI.

Outcome:
- Added QA-only slot/depth fields to each 4E record and verifier requirements for six unique visual slots, minimum depth/separation, real side returns, QA-only status, blocked claims, and non-promotable synthetic context.
- Reworked the existing QA renderer so evidence facades render as volumetric endpoint blocks with body depth, facade thickness, return walls, storefront setback, sign-band projection, window relief, parapet/cornice relief, contact shadow, and sidewalk/curb/street grounding.
- Tuned endpoint cameras/UI and captured required normal, QA overview, Manhattan endpoint, Franklin endpoint, and mobile containment screenshots.
- Preserved 0 business identity connections, 0 storefront anchors, 0 tenant frontage assignments, 0 exact frontage claims, 0 exact facade/signage/entrance/material/color/address claims, 0 active-status claims, 0 production assets, 0 normal-mode records, 0 public/product claims, and no 4F work.

Unresolved decisions:
- Batu owns visual acceptance of the 4E-4 depth/separation correction, any later 4F authorization, business-evidence connection, exact association approval, storefront-anchor authorization, normal-mode exposure, production exposure, and public/product claims.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4E-4 complete pending Batu visual review and opens no next batch.

### 2026-06-07 - Batch 4E-3 Endpoint Corner Facade Composition Pass

Status:
- Complete pending Batu visual review.

Scope:
- Convert the existing 4E QA facade records from flat/debug-like panels into layered endpoint corner compositions while preserving QA-only status, truth separation, normal-mode protection, and blocked factual/business claims.

Files changed:
- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- `scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `src/Phase4BRuntimePreview.jsx`
- `docs/phase-4e-evidence-informed-qa-facade-scene-proof.md`
- `docs/review-screenshots/phase-4e-3-endpoint-corner-facade-composition-pass/`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4d-provisional-corner-association-shortlist.mjs`
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
- Browser QA smoke at `http://127.0.0.1:5177/`: normal mode reported evidence facades as QA off and hid the QA facade status panel; QA mode showed 6 evidence-informed facades, `manual_draft / evidence_informed / qa_only / not_verified`, "Business evidence not connected", "Blocked claims remain blocked", and "Synthetic context: non-evidence placeholder"; business names were absent from visible UI.
- `git diff --check`
- `npm run build`

Outcome:
- Added QA-only composition policy and per-record composition fields to the existing 4E fixture, distinguishing evidence facades from synthetic context and blocking promotion of synthetic context into evidence.
- Extended the 4E verifier to enforce the new composition policy, target resolution, QA-only status, blocked claims, allowed cue vocabulary, evidence/synthetic-context role separation, and no factual/business escalation.
- Reworked the existing Three.js QA render so all 6 evidence-informed endpoint records use layered facade geometry: base/storefront plane, upper facade plane, sign-band projection, grouped window/glass rhythm, parapet/roofline, side-return/corner wrap where cue-supported, and simple QA street/sidewalk grounding.
- Captured required normal, QA overview, Manhattan endpoint, Franklin endpoint, and mobile screenshots in `docs/review-screenshots/phase-4e-3-endpoint-corner-facade-composition-pass/`.
- Preserved QA-only status, generic cue consumption, normal-mode protection, 0 business identity connections, 0 storefront anchors, 0 tenant frontage assignments, 0 exact frontage claims, 0 exact facade/signage/entrance/material/color/address claims, 0 active-status claims, 0 production assets, and 0 public/product claims.

Unresolved decisions:
- Batu owns visual acceptance of the 4E-3 endpoint corner facade composition pass, any further visual revision, business-evidence connection, exact association approval, storefront-anchor authorization, production exposure, and public/product claims.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4E-3 complete pending Batu visual review and opens no next batch.

### 2026-06-07 - Batch 4E-2 QA Facade Legibility Pass

Status:
- Complete pending Batu visual review.

Scope:
- Rework the existing 4E QA facade render treatment, review cameras, and review UI so Manhattan/Greenpoint and Franklin/Greenpoint endpoint evidence-informed records read as simplified architecture instead of dense debug/cue overlay.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/phase-4e-evidence-informed-qa-facade-scene-proof.md`
- `docs/review-screenshots/phase-4e-2-qa-facade-legibility-pass/`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4d-provisional-corner-association-shortlist.mjs`
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
- Browser QA smoke at `http://127.0.0.1:5176/`: normal mode protected; QA mode showed 6 evidence facades, "Business evidence not connected", and blocked-claim status; prohibited real-business/signage terms were absent from visible UI.
- `git diff --check`
- `npm run build`

Outcome:
- Added/tuned Manhattan and Franklin facade review camera presets.
- Reworked QA rendering so ordinary massing and geometry-only cues recede while the 6 fixture-driven evidence-informed facade records carry the visual read.
- Collapsed/de-emphasized review chrome, candidate labels, and broad debug readouts by default while keeping QA status and blocked claims visible.
- Captured required normal, QA overview, Manhattan review, Franklin review, and mobile QA containment screenshots in `docs/review-screenshots/phase-4e-2-qa-facade-legibility-pass/`.
- Preserved QA-only status, generic cue consumption, normal-mode protection, 0 business identity connections, 0 storefront anchors, 0 tenant frontage assignments, 0 exact frontage claims, 0 exact facade/signage/entrance/material/color/address claims, 0 active-status claims, 0 production assets, and 0 public/product claims.

Unresolved decisions:
- Batu owns visual acceptance of the 4E-2 legibility pass, any further visual revision, business-evidence connection, exact association approval, storefront-anchor authorization, production exposure, and public/product claims.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4E-2 complete pending Batu visual review and opens no next batch.

### 2026-06-07 - Batch 4E-1 Evidence-Informed QA Facade Scene Proof

Status:
- Complete pending Batu visual review.

Scope:
- Manually translate Batu-supplied Manhattan and Franklin endpoint-corner image evidence into structured QA-only facade cue records and render those records from data in the existing Three.js QA runtime.

Files changed:
- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- `scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/phase-4e-evidence-informed-qa-facade-scene-proof.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node --check scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4d-provisional-corner-association-shortlist.mjs`
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
- Browser QA smoke at `http://127.0.0.1:5173/`: normal mode kept 4E evidence facades off; QA mode showed 6 evidence facades and "Business evidence not connected"; desktop/mobile screenshots saved under `docs/review-screenshots/phase-4e-1-evidence-informed-qa-facade-scene-proof/`
- `git diff --check`
- `npm run build`

Outcome:
- Added a deterministic `phase-4e-evidence-informed-qa-facade-cues.v0.1` fixture with 6 QA-only rendered facade cue records.
- Records target existing stable scene object IDs only: 3 Manhattan endpoint targets and 3 Franklin endpoint targets.
- Added a verifier that enforces repo-local evidence paths, existing scene target IDs, existing geometry cue targets, allowed cue vocabulary, QA-only status, blocked claims, no photo textures, no automated image analysis, no tracing, no logos/exact sign text, no business names, no exact facade/frontage/address promotion, no storefront anchors, no tenant frontage assignment, no production assets, and no normal-mode use.
- Added generic Three.js QA rendering for evidence-informed cue types without endpoint-specific rendering branches or image filename conditionals.
- Preserved normal mode unchanged.
- Preserved 0 business identity connections, 0 storefront anchors, 0 tenant frontage assignments, 0 exact frontage claims, 0 exact facade/signage/entrance/material/color/address claims, 0 active-status claims, 0 production assets, and 0 public/product claims.

Unresolved decisions:
- Batu owns visual acceptance of the 4E-1 QA facade render proof, any follow-up revision, business-evidence connection, exact association approval, storefront-anchor authorization, production exposure, and public/product claims.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4E-1 complete pending Batu visual review and opens no next batch.

### 2026-06-07 - Batch 4D-8 Provisional Corner Geometry Association Shortlist

Status:
- Complete pending Batu review.

Scope:
- Create a QA-only provisional shortlist that maps each Manhattan and Franklin corner evidence record from 4D-7 to plausible deterministic geometry-container candidates.

Files changed:
- `scripts/verify-phase-4d-provisional-corner-association-shortlist.mjs`
- `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-provisional-corner-association-shortlist.v0.1.json`
- `docs/phase-4d-provisional-corner-association-shortlist.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4d-provisional-corner-association-shortlist.mjs`
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
- `npm run build` not run because no runtime files were touched.

Outcome:
- Added a deterministic `phase-4d-provisional-corner-association-shortlist.v0.1` fixture with 22 QA-only provisional shortlist records.
- Each record has 3 primary provisional endpoint geometry candidates and 5 deferred possible geometry containers.
- Used only existing 4D-7 review records, existing deterministic geometry containers, and existing evidence ID/path labels.
- Interpreted no image content and used no new external source, scraping, API, or rights-sensitive input.
- Preserved 0 selected associations, 0 approved associations, 0 authoritative associations, 0 authoritative anchors, 0 storefront anchors, 0 tenant frontage assignments, 0 promoted claims, 0 normal-mode records, and 0 mid-corridor candidates.
- Preserved Franklin as scoped only to `franklin_greenpoint`.
- Preserved mid-corridor evidence as `blocked_insufficient_evidence`.
- Preserved no business identity, active-status, signage, entrance, frontage, material, color, exact facade, exact address, production-card, runtime-rendering, visual facade generation, source-expansion, or visual-system claim.

Unresolved decisions:
- Batu owns review/acceptance of the 4D-8 provisional shortlist, whether any primary provisional candidate can be selected in a later batch, whether any evidence-to-geometry link can be approved, and whether any later visual/geometry validation step should change runtime/product visuals.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4D-8 complete pending Batu review and opens no next batch. The smallest next safe batch is a QA-only verifier/readout cleanup if a 4D-8 inconsistency is found, or a Batu-authorized visual/geometry validation batch if runtime/readout changes are desired.

### 2026-06-07 - Batch 4D-7 Manual Corner Evidence-To-Geometry Association Review

Status:
- Complete pending Batu review.

Scope:
- Prepare a QA-only manual review packet for Manhattan Ave x Greenpoint Ave and Franklin Ave x Greenpoint Ave evidence, using existing deterministic corner geometry coverage only.

Files changed:
- `scripts/verify-phase-4d-manual-corner-associations.mjs`
- `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-manual-corner-association-review.v0.1.json`
- `docs/phase-4d-manual-corner-association-review.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
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
- `npm run build` not run because no runtime files were touched.

Outcome:
- Added a deterministic `phase-4d-manual-corner-association-review.v0.1` fixture with 22 QA-only provisional review records.
- Each Manhattan evidence record lists 8 possible deterministic Manhattan corner geometry containers.
- Each Franklin evidence record lists 8 possible deterministic Franklin corner geometry containers.
- Possible containers are corner-scope review sets only, not evidence-specific links.
- Preserved 0 selected associations, 0 approved associations, 0 linked associations, 0 authoritative anchors, 0 storefront anchors, 0 tenant frontage assignments, 0 promoted claims, 0 normal-mode records, and 0 mid-corridor candidates.
- Preserved Franklin as scoped only to `franklin_greenpoint`.
- Preserved mid-corridor evidence as `blocked_insufficient_evidence`.
- Preserved no business identity, active-status, signage, entrance, frontage, material, color, exact facade, exact address, production-card, runtime-rendering, visual facade cue, source-expansion, or visual-system claim.

Unresolved decisions:
- Batu owns review/acceptance of the 4D-7 manual association review packet, whether any possible container can be selected in a later batch, whether any evidence-to-geometry link can be approved, and whether any later anchor/visual/facade batch should open.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4D-7 complete pending Batu review and opens no next batch.

### 2026-06-07 - Batch 4D-6 Corner Evidence Folder Reconciliation + Franklin Evidence Intake

Status:
- Complete pending Batu review.

Scope:
- Reconcile moved repo-local evidence folders and intake Batu-supplied Franklin corner evidence as review-only / QA-only material only.

Files changed:
- `scripts/verify-phase-4d-facade-evidence.mjs`
- `scripts/verify-phase-4d-corner-anchor-candidates.mjs`
- `scripts/verify-phase-4d-corner-evidence-paths.mjs`
- `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json`
- `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json`
- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- `docs/mvp-reference-images/greenpoint manhattan corner/`
- `docs/mvp-reference-images/greenpoint franklin  corner/`
- `docs/phase-4d-batu-supplied-facade-evidence-packet.md`
- `docs/phase-4d-corner-anchor-candidates.md`
- `docs/phase-4d-corner-evidence-folder-reconciliation.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
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

Outcome:
- Reconciled 11 Manhattan evidence records to `docs/mvp-reference-images/greenpoint manhattan corner/`.
- Added 11 Franklin evidence records from `docs/mvp-reference-images/greenpoint franklin  corner/`, scoped only to `franklin_greenpoint`.
- Added verifier coverage so every repo-local evidence path must exist and stale flat paths fail.
- Reconciled legacy review-scene reference path strings that pointed at moved Manhattan evidence files.
- Recorded stale flat paths as 11 before reconciliation and 0 after.
- Regenerated the QA-only corner anchor candidates to 22 unresolved records: 11 Manhattan and 11 Franklin.
- Preserved 0 linked candidates, 0 evidence-to-geometry links, 0 storefront anchors, 0 tenant assignments, 0 normal-mode candidates, and 0 mid-corridor candidates.
- Preserved mid-corridor evidence as `blocked_insufficient_evidence`.
- Preserved no exact facade, signage, entrance, material, color, active-status, production-card, runtime-rendering, visual facade cue, or source-expansion claim.

Unresolved decisions:
- Batu owns review/acceptance of the 4D-6 reconciliation, any future geometry-container linking, any future anchor authority, usage-rights promotion, visual facade work, source expansion, and any later batch authorization.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4D-6 complete pending Batu review and opens no next batch.

### 2026-06-07 - Batch 4D-5 Corner Evidence-To-Geometry Anchor Candidates

Status:
- Complete pending Batu review.

Scope:
- Create a narrow QA-only corner evidence-to-geometry anchor-candidate layer for Manhattan Ave x Greenpoint Ave and Franklin Ave x Greenpoint Ave only.

Files changed:
- `scripts/verify-phase-4d-facade-evidence.mjs`
- `scripts/verify-phase-4d-corner-anchor-candidates.mjs`
- `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json`
- `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json`
- `src/Phase4BRuntimePreview.jsx`
- `docs/phase-4d-batu-supplied-facade-evidence-packet.md`
- `docs/phase-4d-corner-anchor-candidates.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
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

Outcome:
- Corrected the 4D-4 evidence packet so every indexed evidence record is corner-scoped and explicitly not corridor-wide.
- Created a deterministic `phase-4d-corner-anchor-candidates.v0.1` fixture.
- Recorded Manhattan evidence records: 11; Franklin evidence records: 0; unresolved/unknown evidence records: 0.
- Recorded deterministic geometry coverage for both corners. Manhattan candidate containers are the high-axis endpoint containers; Franklin candidate containers are the 4D-1 `franklin-end-review-band` containers.
- Created 11 QA-only Manhattan corner anchor candidates, all unresolved and unlinked because the current evidence does not prove a specific evidence-to-geometry-container association.
- Kept Franklin blocked for missing eligible repo-local facade evidence in the 4D-4 packet at the time of 4D-5. Superseded by 4D-6, which intakes Batu-supplied Franklin evidence as unresolved QA-only candidates.
- Kept Manhattan-to-Franklin mid-corridor facade evidence absent and `blocked_insufficient_evidence`.
- Added QA-only inspector visibility. Normal mode hides anchor-candidate records.
- Preserved no authoritative storefront anchors, tenant frontage assignments, business identity, active-status, signage, entrance ownership, frontage width/order, material/color, exact facade truth, production cards, new imagery, source expansion, restricted-source use, normal runtime rendering, or visual-system work.

Unresolved decisions:
- Batu owns review/acceptance of the 4D-5 unresolved anchor-candidate layer, whether any evidence-to-geometry association is acceptable later, whether Franklin evidence should be supplied/identified, and whether any later batch should open.

Next pointer:
- Historical 4D-5 pointer: `docs/CURRENT_EXECUTION_BRIEF.md` marked 4D-5 complete pending Batu review and opened no next batch. Superseded by the 4D-6 ledger entry above.

### 2026-06-07 - Batch 4D-4 Batu-Supplied Facade Evidence Packet

Status:
- Complete pending Batu review.

Scope:
- Define and ingest a review-only Batu-supplied/project-owned facade evidence packet with provenance, usage boundaries, review status, and 4D-2 claim constraints for future facade/frontage work.

Files changed:
- `scripts/verify-phase-4d-facade-evidence.mjs`
- `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json`
- `docs/phase-4d-batu-supplied-facade-evidence-packet.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4d-facade-evidence.mjs`
- `node scripts/verify-phase-4d-candidate-pois.mjs`
- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `git diff --check`
- `npm run build` not run because no runtime or implementation files changed.

Outcome:
- Added a deterministic `phase-4d-batu-supplied-facade-evidence.v0.1` packet with 11 eligible repo-local Batu-supplied/project-owned field-photo reference records.
- Defined the evidence packet shape: stable evidence ID, source owner/supplier, file path/reference, capture/provenance notes, allowed/disallowed use, usage-rights status, associated corridor side or geometry container, confidence/review status, supported 4D-2 claim levels, blocked claim levels, and manual review notes.
- Added verifier coverage for provenance, allowed/disallowed use, restricted-source contamination, runtime/production promotion, storefront/frontage/tenant assignment, missing claim-state boundaries, file existence, and deterministic output.
- Preserved no restricted-source evidence indexing, storefront anchors, tenant frontage assignments, geometry-container associations, exact facade/signage/entrance/material/color claims, active-status claims, normal runtime rendering, production assets, asset-generation input, source expansion, scraping, live APIs, or visual-system work.

Unresolved decisions:
- Batu owns review/acceptance of the 4D-4 evidence packet, usage-rights sufficiency, which records may be used later, and whether to authorize 4D-5, revise the packet, or choose a different next batch.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4D-4 complete pending Batu review and proposes `Batch 4D-5: Evidence-backed facade/storefront anchors` only after review.

### 2026-06-06 - Batch 4D-3 Candidate POI QA Fixture and Overlay

Status:
- Complete pending Batu review.

Scope:
- Create a candidate-only POI/business review layer using synthetic/manual placeholder records, without promoting any business, tenant, storefront, frontage, facade, signage, entrance, active-status, production-card, or real-source claim.

Files changed:
- `scripts/verify-phase-4d-candidate-pois.mjs`
- `src/data/candidate-pois/greenpoint-ave-manhattan-to-franklin.phase-4d-candidate-pois.v0.1.json`
- `docs/phase-4d-candidate-poi-qa-fixture.md`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4d-candidate-pois.mjs`
- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `npm run build`
- Browser smoke on local preview: normal mode showed `Candidate POIs` as `QA off` and no candidate records; QA mode showed six candidates, `candidate_only`, `manual_review_required`, `blocked_insufficient_evidence`, `synthetic_manual_placeholder`, and `Not a storefront assignment.`
- `git diff --check`

Outcome:
- Added a deterministic `phase-4d-candidate-pois.v0.1` fixture with six synthetic/manual placeholder candidates generated from existing 4D-1 geometry-validation targets.
- The fixture shape records stable candidate ID, source type/provenance/access/cache-display permission, address string, optional coordinate, category, candidate confidence, 4D-2 claim state, blocked reasons, last-verified marker, notes, and QA-only review placement.
- Added verifier coverage for required schema fields, claim state, no promotion beyond `poi-candidate`, normal-mode hidden behavior, restricted-source contamination, and deterministic output.
- Added QA-only candidate markers and inspector labels. Normal mode remains protected and does not show candidate records or markers.
- Preserved no real POIs, businesses, facade imagery, storefront anchors, tenant frontage matches, active-status claims, source expansion, scraping, live API calls, Google/Street View/3D Tiles use, production cards, or production/public claims.

Unresolved decisions:
- Batu owns review/acceptance of the 4D-3 candidate POI QA layer and whether to authorize 4D-4, revise the fixture/overlay, or choose a different next batch.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4D-3 complete pending Batu review and proposes `Batch 4D-4: Batu-supplied facade evidence packet` only after review.

### 2026-06-06 - Batch 4D-2 Claim Ladder Matching Contract

Status:
- Complete pending Batu review.

Scope:
- Define evidence and claim rules for future POI, business, facade, storefront, entrance, signage, and landmark matching work, as a contract/spec/governance batch only.

Files changed:
- `docs/phase-4d-claim-ladder-matching-contract.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `git diff --check`
- `npm run build` not run because no implementation files changed.

Outcome:
- Added a dedicated 4D-2 claim ladder/matching contract.
- Defined claim states, blocked states, promotion gates, and nine claim levels: geometry container, address candidate, parcel/building association, POI candidate, tenant-at-address, storefront/frontage, entrance, facade/signage, and landmark/special-treatment.
- Defined future matching rules for building footprint to address, address to POI/business, POI/business to storefront/frontage, facade cue to rendered geometry, and landmark to special-treatment eligibility.
- Preserved that NYC/Open footprints can support contextual geometry/building/parcel review but cannot prove business, storefront, frontage, entrance, signage, facade, active status, exact address placement, or production/public claims.
- No POIs, businesses, facade imagery, storefront anchors, tenant frontage matches, runtime visual changes, source expansion, new dependencies, or production claims were added.

Unresolved decisions:
- Batu owns review/acceptance of the 4D-2 claim ladder and whether to authorize 4D-3 candidate POI overlay, revise the contract, or choose a different next batch.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4D-2 complete pending Batu review and proposes `Batch 4D-3: Candidate POI overlay` only after review.

### 2026-06-06 - Batch 4D-1 Geometry Validation and Gap Audit

Status:
- Complete pending Batu review.

Scope:
- Generate a deterministic validation/gap report from existing 4B/4C manifest, geometry fixture, runtime geometry, and QA inspection surfaces; add QA-only confidence visibility without source expansion, POI overlays, facade imagery, storefront anchors, new dependencies, or normal-mode claim promotion.

Files changed:
- `scripts/verify-phase-4d-geometry-validation.mjs`
- `src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `npm run build`
- Browser smoke on local preview: QA off showed `QA off`; QA on showed `126 / 14 / 2`; selecting blocked record `p4b-object-nyc-footprint-bin-3064901` showed `blocked`, blocker reasons, gap status, and `blocked_until_geometry_resolved`; no browser console errors were reported.
- `git diff --check`

Outcome:
- Added a review-only 4D geometry validation/gap report for all 142 rendered building masses.
- Classified the current rendered buildings as 126 `safe`, 14 `uncertain`, and 2 `blocked`.
- Added per-building fields for rendered/source IDs, corridor side and side order, source/review status, massing confidence, gap/block-break status, address/building ambiguity, and later POI/facade-evidence eligibility.
- Added QA-only runtime visibility for confidence counts and selected-building validation details.
- Preserved normal mode and did not add POIs, facade evidence, storefront anchors, source expansion, dependencies, production assets, or production/public claims.

Unresolved decisions:
- Batu owns review/acceptance of the 4D-1 geometry confidence labels and whether to authorize 4D-2, revise the confidence criteria, or choose a different next batch.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4D-1 complete pending Batu review and proposes `Batch 4D-2: Claim ladder / matching contract` only after review.

### 2026-06-06 - Bounded Packet Execution Model Governance

Status:
- Complete as explicitly requested docs-only governance update.

Scope:
- Clarify the operating model that approval governs boundaries, not every action, while preserving strict truth gates and the proposed-only 4D-1 next pointer.

Files changed:
- `AGENTS.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `git status --short` before edits.
- `git diff --check`.

Outcome:
- Added the bounded work packet model: Batu approves active packet, allowed scope, stop conditions, truth gates, verification expectations, commit behavior, and final review gate.
- Clarified that Codex may self-advance only through explicitly authorized steps inside an approved packet after clean verification, without asking for approval after every small valid step.
- Preserved strict truth gates for real business/storefront/tenant/facade/frontage/entrance/signage claims, source expansion, and claim-level escalation.
- Clarified packet-scoped commit-after-batch behavior, QA mode as a status-labeled lab, visible-progress expectations, concise docs updates, and dirty-tree stop behavior.
- Preserved `Batch 4D-1: Geometry validation and gap audit` as proposed only; no 4D-1 implementation was opened.
- No runtime, data, verifier, UI, build, source, package, or dependency changes occurred.

Unresolved decisions:
- Batu owns whether to authorize `Batch 4D-1: Geometry validation and gap audit` and what packet boundaries, commit behavior, and final review gate it should carry.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still proposes `Batch 4D-1: Geometry validation and gap audit` and keeps no current executable batch or pre-authorized queue.

### 2026-06-06 - Post-4C Geometry Confidence Direction Planning

Status:
- Complete as docs-only planning update.

Scope:
- Reconcile control docs after 4C-5 to stop the generic fictional-facade tuning lane and propose Phase 4D geometry confidence and claim discipline as the next direction.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `git status --short` before edits.
- `git diff --check`.

Outcome:
- Recorded that 4C-5 is complete and committed as `eaf3418`.
- Closed additional generic QA-fictional facade tuning as the next lane.
- Proposed `Batch 4D-1: Geometry validation and gap audit` as the next recommended authorization, with no current executable batch and no pre-authorized queue.
- Added the proposed 4D sequence: geometry audit, claim ladder / matching contract, candidate POI overlay, Batu-supplied facade evidence packet, evidence-backed facade/storefront anchors, and asset registry / visual system only after evidence and anchor models are defined.
- Reframed "correct geometry" as confidence-labeled review of stylized/normalized geometry, not survey-grade correctness.
- Preserved no runtime changes, verifier changes, data changes, UI changes, source changes, package changes, Foursquare/local-directory calls, POI overlay, facade imagery ingestion, asset registry work, visual-system work, dependencies, or implementation self-advance.

Unresolved decisions:
- Batu owns whether to authorize `Batch 4D-1: Geometry validation and gap audit` or a different next batch.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the post-4C docs-only planning state and proposes `Batch 4D-1: Geometry validation and gap audit` as the next authorization prompt.

### 2026-06-06 - Batch 4C-5 QA-Mode Street-Feel Facade Tuning Pass

Status:
- Complete and committed as `eaf3418`.

Scope:
- Tune the existing Franklin-end 8-building QA facade slice for street-block feel while keeping it QA-only, non-factual, draft-labeled, and placed from existing geometry only.

Files changed:
- `src/data/facade-cues/greenpoint-ave-franklin-end.phase-4c-qa-facade-slice.v0.1.json`
- `scripts/verify-phase-4c-qa-facade-slice.mjs`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `npm run build`
- Browser smoke on local preview: QA toggled on, Street camera clicked, canvas rendered, `QA street-feel slice: 8` and the `manual_draft / fictional_safe / not_verified` truth labels were visible, and no browser console errors were reported.
- `git diff --check`

Outcome:
- Kept the existing 8-building Franklin-end slice; no slice expansion occurred.
- Added denser storefront base cadence, varied placeholder sign-band widths, darker base bands, muted brick-like draft blocks, glass/entry placeholders, stoop/step hints, cellar-grate marks, poles/posts, curb rhythm ticks, crosswalk/curb-cut placeholders, wrapped sign-band placeholders, stronger generic corner anchor volumes, and a lower Street review camera preset.
- Preserved normal-mode protection and did not add real business names, tenant claims, exact storefront/facade/frontage/entrance/sign/address/material/window/door claims, source expansion, new dependencies, production art direction, business/storefront anchors, or later batch self-advance.

Unresolved decisions:
- Batu owns visual/product review of whether the rendered QA slice now starts to read more like a street block.
- Any evidence-approved facade cues, exact facade/frontage/entrance/sign/window/door/material/address claims, business/storefront overlays, source expansion, art direction, camera tuning beyond this approved Street preset, and later batches remain blocked.

Next pointer:
- Superseded by the post-4C docs-only planning state, which proposes `Batch 4D-1: Geometry validation and gap audit` and keeps no current executable batch or pre-authorized queue.

### 2026-06-06 - Batch 4C-4 QA-Mode Recognizable Facade Slice

Status:
- Complete pending Batu review.

Scope:
- Add a small QA-mode/manual-draft/non-factual facade rhythm layer for approximately 6-10 existing building masses, using existing building geometry only for placement.

Files changed:
- `src/data/facade-cues/greenpoint-ave-franklin-end.phase-4c-qa-facade-slice.v0.1.json`
- `scripts/verify-phase-4c-qa-facade-slice.mjs`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `npm run build`
- Browser smoke on local preview: QA toggled on, canvas rendered, `QA facade slice: 8` and the `manual_draft / fictional_safe / not_verified` truth labels were visible, the QA-mode layer rendered in the scene, and no browser console errors were reported.
- `git diff --check`

Outcome:
- Selected the Franklin-end eight-building cluster because it spans both corridor sides and mixes width, height, and depth tiers near a visible endpoint.
- Added generic QA-only facade modules: bay divisions, upper/lower splits, window-row placeholders, sign-band placeholders, awning-like placeholders, parapet/cornice tiers, and generic endpoint edge emphasis.
- Preserved normal-mode protection and did not add real business names, tenant claims, exact storefront/facade/frontage/entrance/sign/address/material/window/door claims, source expansion, new dependencies, production art direction, business/storefront anchors, or later batch self-advance.

Unresolved decisions:
- Batu owns visual/product review of whether the rendered QA slice starts to feel like a recognizable street.
- Any evidence-approved facade cues, exact facade/frontage/entrance/sign/window/door/material/address claims, business/storefront overlays, source expansion, art direction, camera tuning, and later batches remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4C-4 complete pending Batu review, with no current executable batch and no pre-authorized queue.

### 2026-06-06 - Batch 4C-2 Geometry-Only Facade Cue Fixture and QA Overlay

Status:
- Complete pending Batu review.

Scope:
- Implement the authorized geometry-only cue fixture, verifier, and QA-mode runtime overlay using only existing 4B manifest/runtime geometry.

Files changed:
- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json`
- `scripts/verify-phase-4c-geometry-cues.mjs`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `npm run build`
- Browser smoke on local preview: QA toggled on, canvas rendered, `Geometry-only facade cues: 142` was visible, and no browser console errors were reported.
- `git diff --check`

Outcome:
- Added 142 deterministic geometry-only cue records, one per existing 4B primitive building mass, regenerated by verifier from the existing manifest/runtime geometry.
- Added QA-mode review planes and cue tier/status inspection while keeping normal mode protected.
- Preserved source fixture, generated manifest, camera presets, package dependencies, business/storefront/facade blocked claims, and no-source-expansion boundaries.
- 4C-3 was not started because no required narrow geometry-only cue tuning need was identified after 4C-2 verification.

Unresolved decisions:
- Batu owns visual/product review of the 4C-2 cue overlay and whether any narrow 4C-3 readability tuning is needed.
- Evidence-approved facade cues, exact facade/frontage/entrance/sign/window/door/material/address claims, business/storefront overlays, source expansion, art direction, camera tuning, and later batches remained blocked at the 4C-2 review gate.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4C-2 complete pending Batu review, with no current executable batch. 4C-3 remains proposed only if Batu identifies a narrow geometry-only cue readability tuning need.

### 2026-06-06 - Phase 4C Geometry-Only Cue Work Packet Governance

Status:
- Complete as docs-only governance update.

Scope:
- Open a bounded Phase 4C work packet to reduce gate friction while preserving Batu review control.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4c-recognizable-facade-cue-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, and `docs/phase-4-execution-roadmap.md`.
- `git status --short` before edits.
- `git diff --check`.
- `git status --short` after edits.

Outcome:
- Opened `Phase 4C Geometry-Only Facade Cue Work Packet`.
- Set current executable batch to `Batch 4C-2: Geometry-only facade cue fixture and QA overlay`.
- Set the only pre-authorized queued batch to `Batch 4C-3: Narrow geometry-only cue tuning pass`.
- Allowed self-advance from 4C-2 to 4C-3 only if 4C-2 verification passes, no source/evidence uncertainty appears, no product/visual decision is needed from Batu, changes remain geometry-only and deterministic, docs are reconciled, and final 4C-3 scope stays limited to small cue readability tuning.
- Preserved hard stops before evidence-approved facade cues, exact facade claims, business/storefront overlays, source expansion beyond existing manifest/geometry support, art-direction pass, external APIs/scrapers, new dependencies without explicit approval, unrelated camera tuning, 4C-4, or any later batch.
- No runtime code, cue fixture, verifier, source fixture, generated manifest, package dependency, asset, API/scraper, camera tuning, staging, commit, or implementation work occurred.

Unresolved decisions:
- Batu owns review after 4C-3 or earlier if a visual/product decision, source/evidence uncertainty, verification failure, scope expansion, or implementation commit authorization need appears.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the bounded `Phase 4C Geometry-Only Facade Cue Work Packet`, with 4C-2 executable and 4C-3 conditionally pre-authorized.

### 2026-06-06 - Phase 4C Recognizable Facade Cue Planning

Status:
- Complete as docs-only planning; stop for Batu review.

Scope:
- Batch 4C-1: define the smallest truth-safe path from the committed deterministic Phase 4B graybox corridor toward recognizable Greenpoint Ave corridor identity.

Files changed:
- `docs/phase-4c-recognizable-facade-cue-plan.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, `docs/MVP_SCOPE.md`, `docs/ART_DIRECTION.md`, `docs/reference/PLACE_SOURCE_POLICY.md`, `docs/reference/PROVENANCE_AND_QA.md`, `docs/reference/SCENE_MANIFEST_SCHEMA.md`, `docs/phase-4b-data-to-scene-workflow.md`, `docs/phase-4b-implementation-plan.md`, and `docs/DOCS_INDEX.md`.
- `git status --short` before implementation.
- `git diff --check`.
- `git diff --no-index --check /dev/null docs/phase-4c-recognizable-facade-cue-plan.md` produced no whitespace-error output; nonzero exit is expected for a no-index comparison against a new file.
- `git diff --stat`.
- `git status --short` after implementation.

Outcome:
- Added a dedicated 4C cue plan that separates geometry-only cues from evidence-approved cues and forbidden claims.
- Defined allowed evidence inputs, blocked inputs, future cue/evidence fixture requirements, verifier duties, landmark/special-treatment handling, business/storefront anchor dependency order, manual review gates, deferred work, and acceptance criteria for a later implementation batch.
- Recommended `Batch 4C-2: Geometry-only facade cue fixture and QA overlay` as the smallest later implementation batch because it can improve recognizability using existing source-backed semantic building IDs without claiming facade, storefront, business, sign, entrance, material, or address truth.
- Preserved 4B runtime boundaries, source fixture, generated manifest, package dependencies, blocked claims, and the 4B-6R camera-tuning follow-up as deferred unless Batu opens it.
- No runtime code, camera tuning, source fixture expansion, generated manifest change, business/place overlay, storefront-anchor implementation, new dependency, generated asset, external API integration, scraper/capture workflow, staging, or commit occurred.

Unresolved decisions:
- Batu owns whether to accept, revise, or reject the proposed 4C-2 implementation batch, or to open a different next batch such as 4B-7 camera tuning.
- Batu owns any approval of evidence packets, facade imagery, landmark identity treatment, storefront/business anchors, public-interface boundaries, architecture boundaries, art direction, production/public claims, and source expansion.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks 4C-1 complete, proposes `Batch 4C-2: Geometry-only facade cue fixture and QA overlay` for Batu review, and keeps no current executable batch and no pre-authorized queue.

### 2026-06-06 - Proposed 4C-1 Recognizable Facade Cue Planning

Status:
- Proposed for Batu review; not executable.

Scope:
- Docs-only next-step proposal after the 4B-6R CONDITIONAL PASS.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Verification:
- `git diff --check`.

Outcome:
- Recommended `Batch 4C-1: Recognizable facade cue planning` as the next planning step because the largest remaining blocker is safe corridor recognizability beyond graybox massing, not business/storefront attachment or immediate camera tuning.
- Preserved the conditional 4B-6R follow-up that M-to-F and F-to-M cameras remain somewhat compressed and should be tuned in a later narrow batch only if Batu opens that scope.
- Kept `Batch 4C-1` proposed only; no current executable batch, pre-authorized queue, implementation, source expansion, manifest/schema change, visual art-direction pass, business overlay, dependency change, or commit was authorized.

Unresolved decisions:
- Batu owns whether to accept, revise, or reject the proposed 4C-1 planning batch, or to open a different next batch such as 4B-7 camera tuning.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now proposes `Batch 4C-1: Recognizable facade cue planning` for Batu review while keeping no current executable batch and no pre-authorized queue.

### 2026-06-06 - Phase 4B Corridor Frame And Endpoint Cue Correction

Status:
- Complete; Batu visual review result: CONDITIONAL PASS.

Scope:
- Batch 4B-6R: narrow runtime/docs correction to strengthen corridor path hierarchy, Manhattan/Franklin endpoint cues, building rhythm, camera preset framing, and selected-object inspector visibility using existing manifest/runtime data only.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/phase4bRuntimeScene.js`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- `node scripts/verify-phase-4b-source-fixture.mjs`.
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`.
- `npm run build` (passes with the expected large Three.js/runtime bundle-size warning).
- Browser smoke at `http://127.0.0.1:5175/`: app loads, counts remain 144 semantic objects, 142 primitive buildings, 140 source-backed buildings, and 63 / 77 side counts; M-to-F, F-to-M, overhead, and oblique presets click successfully; QA mode toggles; selected object summary stays visible at inspector top; no browser console errors.
- Screenshot/pixel sanity checks saved outside the repo at `/private/tmp/greenpoint-4b6r-final-desktop.png`, `/private/tmp/greenpoint-4b6r-final-mobile.png`, and `/private/tmp/greenpoint-4b6r-final-qa-selected.png`; all were nonblank with varied sampled colors.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.
- Batu visual review at `http://127.0.0.1:5175/`: CONDITIONAL PASS.

Outcome:
- Added a stronger normal-mode corridor path band, endpoint cross-lines, labeled Manhattan/Franklin in-scene endpoint cues, and deterministic street-edge rhythm ticks derived from existing source-backed building positions.
- Refined M-to-F, F-to-M, overhead, and oblique cameras so directional views are less compressed and easier to read as a two-sided corridor.
- Added a sticky selected-object summary with semantic ID, source record, side, role, and approximate dimensions at the top of the inspector.
- Preserved source fixture, generated manifest, package dependencies, counts, blocked storefront/business/facade/address claims, and the existing React + Vite + Three.js runtime boundary.
- Conditional follow-up: M-to-F and F-to-M cameras remain somewhat compressed and should be tuned in a later narrow batch only if Batu opens that scope.

Unresolved decisions:
- Batu owns any future decision to open a later batch or pre-authorized queue.
- No work beyond 4B-6R is executable until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records 4B-6R CONDITIONAL PASS, with no current executable batch and no pre-authorized queue.

### 2026-06-06 - Phase 4 Execution Queue Governance Update

Status:
- Complete.

Scope:
- Docs/governance update only: remove the manual authorization loop by allowing Codex to execute the current batch and any explicitly listed pre-authorized queued batches, while preserving hard Batu review gates.

Files changed:
- `AGENTS.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, and `docs/phase-4b-implementation-plan.md`.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- Defined three execution states: current executable batch, pre-authorized queue, and hard Batu review gate.
- Added the self-advance rule: Codex may move from a completed current batch into the next batch only when that batch is already named in the pre-authorized queue, the prior batch completed within scope, verification passed or non-blocking failures are documented, docs are reconciled, and no hard Batu review gate intervenes.
- Added the review-gate rule: Codex must stop when visual Batu review, product/strategy judgment, source expansion, business verification, first facade/storefront semantics, art direction, package/dependency addition, or an unqueued next step is required.
- Preserved Phase 4 constraints: no source expansion, scraping/APIs, business verification, facade/storefront semantics, art direction, package dependencies, broad map system, or commits unless explicitly authorized.
- Set current executable batch to `Batch 4B-6R: Corridor frame and endpoint cue correction`.
- Set pre-authorized queue to none.
- Set hard Batu review gate after 4B-6R visual review.
- No runtime code, source fixtures, generated manifests, compiler scripts, package files, staging, or commit changed in this governance update.

Unresolved decisions:
- Batu owns 4B-6R visual review and any future decision to open or queue work beyond 4B-6R.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4B-6R: Corridor frame and endpoint cue correction`, with no pre-authorized queue and a hard Batu review gate after 4B-6R visual review.

### 2026-06-06 - Phase 4B Corridor Frame Correction Control Handoff

Status:
- Complete.

Scope:
- Docs/control update only: record Batu's 4B-6 visual review result as Partial pass and open `Batch 4B-6R: Corridor frame and endpoint cue correction` as the current executable batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, and `docs/phase-4b-implementation-plan.md`.
- `git status --short` before and after.
- `git diff --stat`.
- `git diff --check`.

Outcome:
- Marked `Batch 4B-6: Graybox corridor recognizability QA` as Batu-reviewed with result: Partial pass.
- Opened `Batch 4B-6R: Corridor frame and endpoint cue correction` as the current executable batch.
- Authorized only a corrective runtime/docs pass to strengthen corridor path hierarchy, add lightweight Manhattan Ave / Franklin Ave endpoint cues, add block/building rhythm cues from existing manifest/runtime/source-backed object boundaries, refine M-to-F/F-to-M/overhead/oblique camera presets if needed, improve selected-object inspector visibility, and update docs to stop at the 4B-6R review gate.
- Preserved non-authorizations for new source data, scraping, APIs, business verification, facade/storefront/anchor semantics, art direction, new assets, broad map systems, package dependencies without explicit authorization, source expansion, Phase 4C, staging, commit, and self-advancing beyond 4B-6R.
- No runtime code, source fixtures, generated manifests, compiler scripts, package files, staging, or commit changed in this docs-only handoff.

Unresolved decisions:
- Batu owns review of the future 4B-6R output and any decision to accept the corrected corridor recognizability proof, request another narrow revision, pause, or open a later batch.
- Any work beyond 4B-6R remains closed until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4B-6R: Corridor frame and endpoint cue correction` as the current executable batch.

### 2026-06-06 - Phase 4B Graybox Corridor Recognizability QA

Status:
- Complete pending Batu review.

Scope:
- Batch 4B-6: add deterministic review/debug affordances to the existing 4B runtime so Batu can evaluate whether the source-backed graybox Greenpoint Ave corridor is spatially legible before storefront detail, facade semantics, business verification, or art direction.

Files changed:
- `src/Phase4BRuntimePreview.jsx`
- `src/phase4bRuntimeScene.js`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required doc/runtime reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, `docs/phase-4b-implementation-plan.md`, `src/Phase4BRuntimePreview.jsx`, `src/phase4bRuntimeScene.js`, and `src/styles.css`.
- `git status --short` before implementation.
- `node scripts/verify-phase-4b-source-fixture.mjs`.
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`.
- `npm run build` (passes with the expected Vite large-chunk warning from the Three.js/runtime bundle).
- Browser smoke at `http://127.0.0.1:5175/`: app loads, review panel reports 144 semantic objects, 142 primitive buildings, 140 source-backed context buildings, and 63 / 77 left-right counts; QA mode toggles on; Manhattan-to-Franklin, Franklin-to-Manhattan, overhead, and oblique camera presets respond; selecting `bin-3064709` exposes source record, side, role, approximate dimensions, QA/provenance, and blocked claims.
- Screenshot automation was not added; no repo screenshot automation command exists, so manual browser review steps were documented in `docs/CURRENT_EXECUTION_BRIEF.md`.
- `git diff --check`.
- `git diff --stat`.
- `git status --short` after implementation.

Outcome:
- Added a separable QA/debug mode that colors left/right building massing and emphasizes the corridor walk path while preserving the normal preview.
- Added camera presets for Manhattan-to-Franklin, Franklin-to-Manhattan, overhead, and street-level oblique corridor review.
- Replaced the coverage-only summary with a review panel reporting semantic object, primitive building, source-backed building, and left/right counts plus selected side and anchor status.
- Added selected-object role and approximate preview dimensions to the semantic inspector.
- Documented Batu review steps, pass/fail criteria, acceptable graybox limitations, and manual browser review path.
- No source fixture changes, generated manifest changes, compiler redesign, package/dependency changes, screenshot tooling, new source data, APIs, scraping, business verification, POI enrichment, storefront/facade semantics, assets, art-direction pass, broad map systems, staging, commit, or work beyond 4B-6 occurred.

Unresolved decisions:
- Batu owns review of the completed 4B-6 output and any decision to accept recognizability QA, request another narrow revision, pause, or open a later batch.
- No work beyond 4B-6 is executable until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks `Batch 4B-6: Graybox corridor recognizability QA` complete pending Batu review and opens no next implementation batch.

### 2026-06-06 - Phase 4B Graybox Recognizability QA Control Handoff

Status:
- Complete.

Scope:
- Docs/control update only: record Batu's 4B-5 review acceptance for purposes of opening the next narrow batch and open `Batch 4B-6: Graybox corridor recognizability QA` as the current executable batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, and `docs/phase-4b-implementation-plan.md`.
- Markdown/link sanity by inspection; package scripts expose no dedicated markdown/link checker.
- `git status --short` before and after.
- `git diff --stat`.
- `git diff --check`.

Outcome:
- Marked 4B-5 as Batu-reviewed and accepted for purposes of opening 4B-6.
- Opened 4B-6 as the current executable batch for deterministic graybox corridor recognizability QA affordances.
- Authorized 4B-6 to add separable QA/debug review affordances, camera presets, hover/click identity inspection, side labels/counts, key-anchor highlighting for already-present manifest anchors, and a compact review panel.
- Required 4B-6 docs/review output to state what Batu should inspect visually, pass/fail criteria, acceptable graybox limitations, and that the proof remains source-backed context rather than final architecture, art, storefront, facade, or business layer.
- Preserved non-authorizations for new source data, source fixture/generated manifest changes without a documented blocking defect, screenshot tooling dependencies, scraping, APIs, business verification, POI enrichment, assets, art direction, broad map systems, storefront/facade semantics, runtime/package edits in this docs batch, staging, commit, and self-advancing beyond 4B-6.

Unresolved decisions:
- Batu owns review of the future 4B-6 implementation output and any decision to accept recognizability QA affordances, request another revision, pause, or open a later batch.
- Any work beyond 4B-6 remains closed until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4B-6: Graybox corridor recognizability QA` as the current executable batch.

### 2026-06-06 - Phase 4B Context Building Coverage Expansion

Status:
- Complete; Batu-reviewed and accepted for purposes of opening 4B-6.

Scope:
- Batch 4B-5: expand the existing deterministic runtime from the 4B-4R two-building graybox proof into broader source-backed contextual corridor massing using approved fixture/geometry data and the existing React + Vite + Three.js runtime boundary.

Files changed:
- `scripts/compile-phase-4b-scene-manifest.mjs`
- `src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json`
- `src/phase4bRuntimeScene.js`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required doc/context reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, `docs/phase-4b-implementation-plan.md`, `docs/phase-4b-data-to-scene-workflow.md`, and the approved 4B-3 compiler output/contracts/tests.
- `git status --short` before implementation.
- `node scripts/verify-phase-4b-source-fixture.mjs`.
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`.
- `npm run build` (passes with the expected Vite large-chunk warning from the Three.js/runtime bundle).
- Browser smoke at `http://127.0.0.1:5174/`: app loads, expanded source-backed massing renders, coverage summary shows 142 rendered buildings, 140 source-backed context promotions, and left/right counts of 63 / 77; hover/click inspection resolves semantic IDs; camera controls work; QA/provenance, coverage status, corridor side, and blocked claims remain visible.
- `git diff --check`.
- `git diff --stat`.

Outcome:
- Updated the primitive compiler so the generated semantic manifest can promote eligible approved geometry fixture building footprints into source-backed contextual graybox massing without changing the source fixture or adding new source data.
- Regenerated the semantic scene manifest with 144 semantic objects, including 142 primitive building massing objects and 140 compiler-promoted contextual building records.
- Updated the runtime adapter and preview UI to render and inspect the expanded context, expose coverage summary/counts, show per-object coverage status and corridor side, and preserve semantic hover/click through invisible pick targets.
- Preserved storefront/business/facade/entrance/signage/address blocked-claim visibility and did not promote business or storefront claims.
- No package changes, new dependencies, new source fixtures, APIs, scraping, business verification, POI enrichment, assets, art-direction pass, GLB/glTF/raster/generated/stock/production assets, React Three Fiber, Drei, Cesium, Mapbox, deck.gl, backend/CMS/persistence/analytics/routing/deployment, broad map systems, random/procedural city generation, infinite wrapping, staging, commit, or work beyond 4B-5 occurred.

Unresolved decisions:
- Batu owns review of any future 4B-6 output and any later decision to accept recognizability QA affordances, request another narrow revision, pause, or open a later batch.
- No work beyond 4B-6 is executable until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- Superseded by the 4B-6 control handoff above; `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4B-6: Graybox corridor recognizability QA` as the current executable batch.

### 2026-06-06 - Phase 4B Context Building Coverage Control Handoff

Status:
- Complete.

Scope:
- Docs/control update only: record Batu's 4B-4R review finding and open `Batch 4B-5: Context building coverage expansion` as the current executable batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, `docs/phase-4b-implementation-plan.md`, and `docs/phase-4b-data-to-scene-workflow.md`.
- Markdown/link sanity by inspection; package scripts expose no dedicated markdown/link checker.
- `git status --short` before and after.
- `git diff --stat`.
- `git diff --check`.

Outcome:
- Recorded that Batu approves 4B-4R as complete pending final repo verification and accepts it as a useful technical/spatial runtime foundation.
- Recorded the remaining 4B-4R review finding: the scene lacks enough source-backed corridor massing to validate the full Greenpoint Ave corridor.
- Opened 4B-5 as the current executable batch for source-backed contextual building coverage expansion.
- Authorized 4B-5 to inspect existing geometry/source fixtures for eligible Greenpoint Ave building footprint records, promote only safe source-backed contextual massing, update the minimal source fixture/compiler/generated manifest only as needed through the approved path, render expanded graybox context in the existing React + Vite + Three.js runtime, preserve semantic inspection and QA/provenance behavior, and label coverage/gaps where useful.
- Preserved non-authorizations for business verification, POI enrichment, new APIs, scraping, LiveXYZ/Foursquare/local-directory calls, storefront segmentation, business cards, active-business claims, exact storefront/entrance/facade/signage/address claims, facade detail, art direction, GLB/glTF/raster/generated/stock/production assets, React Three Fiber, Drei, Cesium, Mapbox, deck.gl, backend/CMS/persistence/analytics/routing/deployment, broad map systems, generic procedural city generation, random generation, infinite wrapping, runtime/source/compiler/package edits in this docs batch, staging, commit, and self-advancing beyond 4B-5.

Unresolved decisions:
- Batu owns review of the future 4B-5 implementation output and any decision to approve expanded corridor coverage, request another revision, pause, or open a later batch.
- Any work beyond 4B-5 remains closed until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4B-5: Context building coverage expansion` as the current executable batch.

### 2026-06-06 - Phase 4B Runtime Preview Legibility Pass

Status:
- Complete pending Batu review.

Scope:
- Batch 4B-4R: narrow revision to the existing 4B-4 runtime to improve corridor legibility only, using the approved generated semantic scene manifest, referenced geometry fixture, and existing React + Vite + Three.js runtime boundary.

Files changed:
- `src/phase4bRuntimeScene.js`
- `src/Phase4BRuntimePreview.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required doc/runtime reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, `docs/phase-4b-implementation-plan.md`, `src/Phase4BRuntimePreview.jsx`, `src/phase4bRuntimeScene.js`, `src/styles.css`, and `src/App.jsx`.
- `git status --short` before implementation.
- `node scripts/verify-phase-4b-source-fixture.mjs`.
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`.
- `npm run build` (passes with the expected Vite large-chunk warning from Three.js).
- Browser smoke at `http://127.0.0.1:5173/`: initial framing shows the corridor guide and source-derived building massing; hover resolves a building semantic ID; click selects a building semantic ID; in-scene highlight/anchor feedback appears; rotate, zoom, and home controls respond; QA/provenance and blocked/no-candidate state remain visible.
- `git diff --check`.
- `git diff --stat`.

Outcome:
- Updated preview normalization so existing manifest/fixture objects share a more legible corridor frame while preserving deterministic scene-space transformation notes.
- Added a deterministic visual-QA street/corridor guide derived from existing centerline direction, street-width context, and manifest object extents, explicitly labeled as a QA guide rather than sourced/exact curb/frontage/sidewalk geometry.
- Reduced corridor/context line dominance and improved source-derived building footprint, base outline, extrusion, and blocked/no-candidate anchor marker visibility.
- Improved default camera framing for the corridor/building relationship.
- Added a compact legend for buildings, street QA guide, corridor line, selected/hovered state, and blocked/no-candidate state.
- Made the QA/provenance panel less visually dominant on the narrow in-app viewport while preserving semantic ID, source record, geometry reference, allowed claims, blocked claims, provenance, and object selection.
- Preserved semantic IDs as the interaction source of truth and invisible pick targets tied to semantic object IDs.
- No new source data, source fixtures, generated manifests, compiler redesign, package dependencies, external data calls, scraping, business verification, invented storefronts/entrances/facades/signage/active status/address placement, business cards, GLB/glTF/raster/generated/stock/production assets, React Three Fiber, Drei, Cesium, Mapbox, deck.gl, backend/CMS/persistence/analytics/routing/deployment, random generation, procedural city logic, infinite wrapping, staging, commit, or 4B-5 work occurred.

Unresolved decisions:
- Batu owns review of the completed 4B-4R output and any decision to approve it as useful for corridor validation, request another narrow revision, pause, or open a later batch.
- 4B-5 remains closed until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now marks `Batch 4B-4R: Runtime preview legibility pass` complete pending Batu review and opens no next implementation batch.

### 2026-06-06 - Phase 4B Runtime Legibility Control Handoff

Status:
- Complete.

Scope:
- Docs/control update only: record Batu's 4B-4 review finding and open `Batch 4B-4R: Runtime preview legibility pass` as the current executable revision batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, and `docs/phase-4b-implementation-plan.md`.
- Markdown/link sanity by inspection; package scripts expose no dedicated markdown/link checker.
- `git status --short` before and after.
- `git diff --stat`.
- `git diff --check`.

Outcome:
- Recorded that Batu approves 4B-4 as a technical runtime foundation but not yet as a useful corridor-validation scene.
- Opened 4B-4R as a narrow revision to the existing 4B-4 runtime.
- Authorized only legibility improvements using existing manifest/fixture data and the existing React + Vite + Three.js runtime boundary.
- Recorded the observed 4B-4 issues: sparse scene, dominant centerline, unclear building placement/orientation, weak street-edge hierarchy, subtle in-scene feedback, visually heavy QA/provenance UI, and insufficient default framing.
- Preserved requirements for deterministic rendering, semantic IDs as interaction truth, invisible pick targets tied to semantic IDs, QA/provenance visibility, and blocked-claim visibility.
- React Three Fiber, Drei, Cesium, Mapbox, deck.gl, GLB/glTF pipelines/assets, raster/generated/stock/production assets, backend/CMS/persistence/analytics, deployment/routing/broad map systems, business verification, new data sources, scraping, API calls, primitive compiler redesign, generic procedural city generation, random generation, infinite wrapping, runtime/package/data edits in this docs batch, staging, commit, and self-advancing to 4B-5 remain blocked.

Unresolved decisions:
- Batu owns review of the future 4B-4R implementation output and any decision to approve corridor-validation legibility, request another revision, pause, or open a later batch.
- 4B-5 remains closed until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4B-4R: Runtime preview legibility pass` as the current executable batch.

### 2026-06-06 - Phase 4B Runtime Manifest Preview

Status:
- Complete pending Batu review.

Scope:
- Batch 4B-4: implement the first deterministic interactive 3D graybox/isometric corridor runtime proof from the approved 4B-3 semantic scene manifest and referenced geometry fixture.

Files changed:
- `package.json`
- `package-lock.json`
- `src/App.jsx`
- `src/Phase4BRuntimePreview.jsx`
- `src/phase4bRuntimeScene.js`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git status --short` before implementation showed the existing 4B-3/control-doc work plus no 4B-4 runtime files.
- `node scripts/verify-phase-4b-source-fixture.mjs`.
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`.
- `npm run build` (passes; Vite reports the expected large-chunk warning after adding Three.js).
- Browser smoke at `http://127.0.0.1:5173/`: page loads, 3D scene appears, source-derived building massing and corridor/context line render, rotate/pan/zoom/home controls work, pointer drag/shift-drag/scroll gestures work, hover resolves to a semantic line ID, click selects a semantic building ID, and the QA/provenance panel updates with blocked/no-candidate storefront anchor status.
- `git diff --check`.
- `git diff --stat`.

Outcome:
- Added `three` as the only new runtime dependency and used it only as a renderer inside the existing React + Vite shell.
- Added an app-internal runtime adapter that turns the approved generated semantic manifest and referenced geometry fixture into deterministic preview-space building and line objects.
- Added a Three.js runtime preview that renders source-derived primitive building massing, corridor/context lines, a constrained isometric/editorial camera, reset/home controls, invisible pick targets tied to semantic object IDs, semantic hover/click inspection, QA/provenance/blocked-claim visibility, and visibly blocked storefront anchors.
- No source fixtures, generated manifests, compiler scripts, schemas, external data sources, scraping, API calls, business verification, production assets, GLB/glTF assets, React Three Fiber, Drei, Cesium, Mapbox, deck.gl, backend/CMS/persistence/analytics, deployment tooling, generic procedural city generation, infinite wrapping, staging, commit, or 4B-5 work occurred.

Unresolved decisions:
- Batu owns review of the completed 4B-4 runtime proof and any decision to approve as-is, request revisions, pause, or open a later batch.
- 4B-5 remains closed until Batu approval and an updated `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the completed 4B-4 gate; no next implementation batch is executable.

### 2026-06-05 - Phase 4B Runtime Manifest Preview Control Handoff

Status:
- Complete.

Scope:
- Docs/control update only: close `Batch 4B-3: Primitive compiler` as reviewed, approved, and closed; open `Batch 4B-4: Runtime manifest preview` as the current executable batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/phase-4-execution-roadmap.md`, and `docs/phase-4b-implementation-plan.md`.
- Markdown/link sanity by inspection.
- `git status --short` before and after.
- `git diff --stat`.
- `git diff --check`.

Outcome:
- 4B-3 is recorded as reviewed, approved, and closed.
- 4B-4 is now the current executable batch for the first deterministic interactive 3D graybox/isometric browser corridor runtime proof.
- The 4B-4 runtime boundary is recorded: consume the approved 4B-3 generated manifest and referenced geometry fixture, render source-derived primitive massing and corridor/context lines, support constrained pan/orbit/zoom/home controls, use invisible pick targets tied to semantic IDs for hover/click inspection, show QA/provenance/blocked-claim visibility, and keep storefront anchors visibly `blocked_no_candidates` where applicable.
- The package/runtime boundary is recorded: the existing React + Vite shell remains the app/build layer, and a minimal `three` dependency may be added if needed only as the renderer inside that shell.
- React Three Fiber, Drei, Cesium, Mapbox, deck.gl, GLB/glTF pipelines/assets, backend/CMS/persistence/analytics, deployment tooling, broad map systems, business verification, new data sources, scraping, API calls, storefront/business invention, compiler redesign, generic procedural city generation, infinite wrapping, public/deployment work, and self-advancing to 4B-5 remain blocked.
- No runtime code, app files, package files, compiler scripts, source fixtures, generated manifests, assets, staging, commit, or implementation work occurred.

Unresolved decisions:
- Batu owns review of the future 4B-4 implementation output and any scope expansion beyond the authorized 4B-4 boundary.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4B-4: Runtime manifest preview` as the current executable batch.

### 2026-06-05 - Phase 4B Primitive Compiler

Status:
- Reviewed, approved, and closed.

Scope:
- Batch 4B-3: create one compiler that reads the approved 4B-2 corridor source fixture and produces one deterministic semantic scene manifest.

Files changed:
- `scripts/compile-phase-4b-scene-manifest.mjs`
- `src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/phase-4-execution-roadmap.md`, `docs/phase-4b-implementation-plan.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Source fixture and verifier review: `src/data/source-fixtures/greenpoint-ave-manhattan-to-franklin.phase-4b-source-fixture.v0.1.json` and `scripts/verify-phase-4b-source-fixture.mjs`.
- `node scripts/compile-phase-4b-scene-manifest.mjs`.
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`.
- `node scripts/verify-phase-4b-source-fixture.mjs`.
- JSON parse inspection for the generated manifest.
- Syntax check for `scripts/compile-phase-4b-scene-manifest.mjs`.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- Added one deterministic primitive compiler for the approved 4B-2 source fixture.
- Added one generated semantic scene manifest with corridor metadata, source references, stable IDs, semantic geometry object references, QA/provenance flags, blocked/allowed claim states, empty blocked storefront anchors, and future renderer requirements.
- The manifest preserves source provenance, stable IDs, blocked claim status, manual assumptions, and hidden-inference guardrails.
- No runtime code, rendering code, Three.js, React Three Fiber, schemas, package script, assets, GLB/glTF generation, business enrichment, live API, scraping, facade generation, visual styling implementation, staging, commit, 4B-4 renderer work, visual proof work, or asset work occurred.

Unresolved decisions:
- None for 4B-3 closure. Future runtime scope and review now belong to the opened 4B-4 batch.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4B-4: Runtime manifest preview` as the current executable batch.

### 2026-06-05 - Phase 4B First Visual Proof Clarification

Status:
- Complete pending Batu review.

Scope:
- Narrow documentation clarification only; define the expected visual artifact path before any 4B-3 implementation approval.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/phase-4-execution-roadmap.md`, `docs/phase-4b-implementation-plan.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Markdown/link sanity by inspection.
- Package-script inspection for markdown/link validation.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- Phase 4B docs now require the first visual proof after an approved primitive compiler to be a deterministic interactive 3D graybox/isometric corridor scene.
- The clarified first visual fidelity bar is primitive massing/extruded footprints, simple materials, source-derived building massing, semantic-ID inspection, hover/click hooks through semantic IDs, camera pan/zoom/orbit, QA/provenance/blocked-claim visibility, and storefront-anchor placeholders only when evidence/status allows.
- Static images, 2D maps, raster compositions, manually arranged scenes, and manifest-only artifacts are explicitly unacceptable as the future 4B visual proof.
- No 4B-3 implementation, runtime code, compiler code, schema, generated manifest, fixture/verifier change, asset, package/tooling change, staging, or commit occurred.

Unresolved decisions:
- Batu owns approval of `Batch 4B-3: Primitive compiler`, revision of the 4B-2 fixture/verifier, or pause before implementation.
- Batu owns the later first 3D visual-proof batch boundary, renderer choice, public/runtime interface implications, semantic inspection UX, QA/provenance surfacing, and graybox acceptance criteria.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to the completed 4B-2 gate; 4B-3 is not executable until Batu approval and an updated current brief.

### 2026-06-05 - Phase 4B Minimal Source Fixture And Verifier

Status:
- Complete pending Batu review.

Scope:
- Batch 4B-2: create the smallest approved file-based corridor source fixture plus one targeted verifier enforcing the 4B-1 planning contracts.

Files changed:
- `src/data/source-fixtures/greenpoint-ave-manhattan-to-franklin.phase-4b-source-fixture.v0.1.json`
- `scripts/verify-phase-4b-source-fixture.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/phase-4-execution-roadmap.md`, `docs/phase-4b-implementation-plan.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, and `AGENTS.md`.
- Existing repo source/data pattern inspection for `src/data/geometry-source/`, `src/data/scenes/`, `src/sceneManifest.js`, and existing verifier scripts.
- `node scripts/verify-phase-4b-source-fixture.mjs`.
- JSON parse for `src/data/source-fixtures/greenpoint-ave-manhattan-to-franklin.phase-4b-source-fixture.v0.1.json`.
- Syntax check for `scripts/verify-phase-4b-source-fixture.mjs`.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- Added one review-only 4B-2 source fixture for Greenpoint Ave from Manhattan Ave to Franklin Ave.
- The fixture references existing repo-local Phase 3B NYC/Open geometry context, records source packet metadata, deterministic hash inputs, stable IDs, source records, geometry references, allowed contextual geometry claims, blocked storefront/facade/frontage/entrance/business claim classes, and explicit manual assumptions.
- Added one targeted verifier that checks required packet metadata, stable ID derivation, referenced file hashes, source and geometry reference resolution, geometry presence, provenance for allowed claims, blocked claim discipline, empty/blocked storefront anchors, absence of business links, explicit manual assumptions, and deterministic hash inputs.
- No compiler, runtime code, generated scene manifest, schema file, package script, live API call, scraping, business/place enrichment, asset pipeline, GLB/glTF/assets, visual styling implementation, staging, commit, or 4B-3 work occurred.

Unresolved decisions:
- Batu owns review of the completed 4B-2 fixture/verifier.
- Batu owns approval of `Batch 4B-3: Primitive compiler`, revision of the 4B-2 fixture/verifier, or pause before compiler implementation.
- Batu owns generated manifest ownership, schema ownership, compiler boundary, storefront-anchor candidate policy, manual override policy, public/runtime interface implications, and any future source/claim promotion.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the completed 4B-2 gate; 4B-3 is not executable until Batu approval and an updated current brief.

### 2026-06-05 - Phase 4B Contract Foundation

Status:
- Complete pending Batu review.

Scope:
- Docs-only Batch 4B-1 contract foundation for the one-corridor Phase 4B proof.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Phase 4 support-doc review: `docs/phase-4-execution-roadmap.md`, `docs/phase-4b-data-to-scene-workflow.md`, `docs/phase-4b-implementation-plan.md`, and `docs/DOCS_INDEX.md`.
- Scope-boundary review: `docs/MVP_SCOPE.md`.
- Package-script scan found no dedicated markdown validation script.
- Markdown/link sanity by inspection.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- `docs/phase-4b-implementation-plan.md` now records lean planning contracts for source fixture, scene manifest, storefront anchors, stable IDs, manual overrides, style recipe, and asset registry.
- The contracts define planning-only boundaries, verifier duties for 4B-2, and explicit non-authorizations for runtime code, compiler code, source fixture creation in 4B-1, schema files, generated manifests, package/tooling changes, and asset production.
- 4B-2 is prepared to create one approved file-based source fixture and one targeted verifier after Batu approval and an updated current brief.
- No source fixture, verifier, schema file, compiler script, generated manifest, runtime change, package/tooling change, asset production, staging, commit, or 4B-2 implementation occurred.

Unresolved decisions:
- Batu owns review of the completed 4B-1 contracts.
- Batu owns approval of `Batch 4B-2: Minimal source fixture + verifier`, revision of the 4B-1 contracts, or pause before implementation.
- Batu owns source fixture path/shape, allowed source classes, source storage/attribution/cache/display rules, schema-file ownership, verifier scope, public-interface implications, and any later compiler/runtime boundary.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the completed 4B-1 gate; 4B-2 is not executable until Batu approval and an updated current brief.

### 2026-06-05 - Phase 4A Decision Gate

Status:
- Complete pending Batu review.

Scope:
- Docs-only Batch 4A-5 decision gate: turn the 4A-2, 4A-3, and 4A-4 lane assessments into a Phase 4A recommendation and stop before Phase 4B.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/phase-4-execution-roadmap.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Phase 4A supporting-doc reconciliation: `docs/phase-4a-workflow-spike-plan.md` and `docs/phase-4a-workflow-spike-decision-matrix.md`.
- Markdown recommendation-shape sanity by inspection.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- Phase 4A now recommends deterministic compiler plus semantic manifest as the core lane.
- Controlled owned/approved references are recommended as the reference/QA lane for facade cue extraction, recognizability QA, and art-direction calibration.
- 3D map/export as core workflow is deferred; restricted capture outputs as canonical data, runtime surfaces, production assets, training input, or exact facade/frontage evidence remain blocked/deferred.
- The smallest Phase 4B proof is a file-based one-corridor source fixture plus verifier first, before compiler or runtime work.
- No Phase 4B implementation, source fixture, schema file, compiler script, generated manifest, runtime change, asset file, public interface, package/tooling change, staging, or commit occurred.

Unresolved decisions:
- Batu owns review of the completed 4A-5 decision.
- Batu owns approval of any Phase 4B next batch, including `Batch 4B-1: Contract foundation`.
- Batu owns Phase 4B architecture boundaries, public-interface implications, source fixture shape, source storage/attribution/cache/display rules, schema ownership, stable-ID contract, verifier scope, compiler boundary, storefront-anchor/manual override policy, style/asset contract boundaries, and approved reference/source classes.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the completed 4A-5 gate; Phase 4B is not executable until Batu approval and an updated current brief.

### 2026-06-05 - Phase 4A Reality Capture Reference Lane Assessment

Status:
- Complete pending Batu review.

Scope:
- Docs-only Batch 4A-4 assessment of whether reference photos, Google Photorealistic 3D Tiles, world-model outputs, splats, or photo-to-3D workflows can help the Greenpoint Ave Manhattan-to-Franklin corridor workflow.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/phase-4-execution-roadmap.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Source/reference policy review: `docs/MVP_SCOPE.md`, `docs/reference/DATA_SOURCES.md`, `docs/reference/PLACE_SOURCE_POLICY.md`, `docs/reference/approved-reference-corpus/USAGE_RULES.md`, and DTR-11 facade-fidelity evidence.
- Existing DTR-11 generated JSON parse for `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/generated/reference-facade-fidelity-qa-report.json` and `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/generated/facade-extraction-specs.json`.
- Markdown/link sanity by inspection.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` was updated to open 4A-4 after Batu approval, then reconciled to the completed 4A-4 stop/decision gate.
- `docs/phase-4a-workflow-spike-plan.md` now records the reality-capture/reference lane viability read, inspected evidence, required future inputs, inspection questions, outputs, validation gates, current repo support, gaps, and decision implications.
- `docs/phase-4a-workflow-spike-decision-matrix.md` now updates only the reality-capture/reference lane scores.
- Assessment result: reference/capture is viable only as a controlled reference and QA lane. Owned or explicitly approved references can support human review and recognizability QA; restricted capture outputs remain blocked or deferred for canonical data, production assets, training input, runtime surfaces, and exact facade/frontage evidence.
- No stored restricted imagery, texture extraction, tracing, canonical splats/world models, runtime capture path, source fixture, generated manifest, asset file, public interface, API call, scraping, staging, commit, 4A-5 work, or Phase 4B implementation occurred.

Unresolved decisions:
- Batu owns review of the completed 4A-4 assessment.
- Batu owns approval of `Batch 4A-5: Decision gate`, revision of the 4A-4 assessment, or pause of Phase 4A.
- Batu owns any later approval of reference/capture source classes, storage policy, usage rights, claim boundaries, and production/public readiness changes.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the completed 4A-4 gate; 4A-5 is pending Batu approval or an updated current brief.

### 2026-06-05 - Phase 4A 3D Map Export Shortcut Assessment

Status:
- Complete pending Batu review.

Scope:
- Docs-only Batch 4A-3 assessment of whether 3D map/export tools can serve as a shortcut or acceleration lane for the Greenpoint Ave Manhattan-to-Franklin corridor workflow.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/phase-4-execution-roadmap.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Phase 4A supporting-doc review.
- Repo scan for local 3D export samples: `.glb`, `.gltf`, `.obj`, `.fbx`, `.3dm`, and `.dae`.
- Package-script/dependency inspection for current runtime/tooling support.
- Markdown/link sanity by inspection.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` was updated to open 4A-3 after Batu approval, then reconciled to the completed 4A-3 stop/decision gate.
- `docs/phase-4a-workflow-spike-plan.md` now records the 3D map/export shortcut viability read, inspected evidence, required future inputs, inspection questions, outputs, validation gates, current repo support, gaps, and decision implications.
- `docs/phase-4a-workflow-spike-decision-matrix.md` now updates only the 3D map/export shortcut lane scores.
- Assessment result: the export shortcut lane is not viable as the core workflow under current repo conditions. It may be useful later as a reference/acceleration lane only after a specific tool, terms/export rights, storage/attribution policy, and sample export are approved.
- No canonical export adoption, GLB/glTF asset, runtime loader, package/tooling change, broad import, source fixture, generated manifest, public interface, API call, scraping, staging, commit, 4A-4 work, or Phase 4B implementation occurred.

Unresolved decisions:
- Batu owns review of the completed 4A-3 assessment.
- Batu owns approval of `Batch 4A-4: Reality-capture/reference lane assessment`, revision of the 4A-3 assessment, or pause of Phase 4A.
- Batu owns any later approval of export tool terms, export rights, sample storage, attribution, source provenance, runtime boundary, and canonical-use limits.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the completed 4A-3 gate; 4A-4 is pending Batu approval or an updated current brief.

### 2026-06-05 - Phase 4A Deterministic Compiler Lane Assessment

Status:
- Complete pending Batu review.

Scope:
- Docs-only Batch 4A-2 assessment of whether the deterministic compiler lane is viable for the Greenpoint Ave Manhattan-to-Franklin corridor workflow.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/phase-4-execution-roadmap.md`, `docs/phase-4a-workflow-spike-plan.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Existing source/sample JSON parse for `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json`, `src/data/geometry-source/raw/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry.phase-3b.raw.json`, `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`, and `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`.
- Markdown/link sanity by inspection.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` was updated to open 4A-2 after Batu approval, then reconciled to the completed 4A-2 stop/decision gate.
- `docs/phase-4a-workflow-spike-plan.md` now records the deterministic compiler lane viability read, inspected evidence, required future inputs, transforms, outputs, validation gates, current repo support, gaps, and decision implications.
- `docs/phase-4a-workflow-spike-decision-matrix.md` now updates only the deterministic compiler lane scores.
- Assessment result: the deterministic compiler lane is viable as the leading core-lane candidate for a future one-corridor Phase 4B proof, but not viable as an automatic source of storefront/frontage/entrance/facade/business truth without approved evidence and explicit manual-review gates.
- No source fixtures, schemas, compiler scripts, generated manifests, assets, runtime changes, package/tooling changes, public interfaces, API calls, scraping, staging, commit, 4A-3 work, or Phase 4B implementation occurred.

Unresolved decisions:
- Batu owns review of the completed 4A-2 assessment.
- Batu owns approval of `Batch 4A-3: 3D map/export shortcut assessment`, revision of the 4A-2 assessment, or pause of Phase 4A.
- Batu owns later approval of any Phase 4B fixture shape, schema ownership, stable-ID contract, compiler module boundary, source storage/attribution, and public-interface implications.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the completed 4A-2 gate; 4A-3 is pending Batu approval or an updated current brief.

### 2026-06-05 - Phase 4A Workflow Spike Setup

Status:
- Complete pending Batu review.

Scope:
- Docs-only Batch 4A-1 setup: make the Manhattan-to-Franklin Phase 4A workflow spike ready to run, with lane inputs, evaluation criteria, evidence outputs, and stop gates.

Files changed:
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Phase 4 roadmap and Phase 4A supporting-doc review.
- `git status --short` before editing.
- Markdown/link sanity by inspection.
- `git diff --stat`.
- `git diff --check`.
- `git status --short` after editing.

Outcome:
- `docs/phase-4a-workflow-spike-plan.md` now contains the Batch 4A-1 ready-to-run checklist.
- The checklist confirms the shared corridor target, three lane input checks, shared evaluation criteria, evidence output packet, decision-matrix update path, and stop gates.
- `docs/CURRENT_EXECUTION_BRIEF.md` now stops at the 4A-1 gate and records `Batch 4A-2: Deterministic compiler lane assessment` as pending Batu approval or updated brief, not executable.
- No source fixtures, schemas, compiler scripts, generated manifests, assets, runtime changes, package/tooling changes, public interfaces, API calls, scraping, staging, commit, or Phase 4B implementation occurred.

Unresolved decisions:
- Batu owns review of the completed Batch 4A-1 checklist.
- Batu owns approval of `Batch 4A-2: Deterministic compiler lane assessment`, revision of the checklist, or pause of Phase 4A.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the completed 4A-1 gate; no executable next batch is open until Batu approval or an updated current brief.

### 2026-06-05 - Phase 4 Batch-Gate Hardening

Status:
- Complete pending review.

Scope:
- Docs-only governance update: make the Phase 4 current-batch-only rule durable in the root contract, Phase 4 roadmap, and current brief.

Files changed:
- `AGENTS.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- `git status --short` before editing.
- Markdown/link sanity by inspection.
- `git diff --check`.
- `git status --short` after editing.

Outcome:
- Phase 4 agents are now explicitly constrained to execute only the current batch named in `docs/CURRENT_EXECUTION_BRIEF.md`.
- `docs/phase-4-execution-roadmap.md` is confirmed as the operating plan for that named batch.
- Agents must stop at each roadmap stop/decision gate and may not self-advance to the next Phase 4 batch without explicit Batu approval or an updated current brief.
- The current next task remains `Batch 4A-1: Workflow spike setup`.
- No Phase 4 code, runtime file, schema file, compiler script, source fixture, generated manifest, asset file, package/tooling change, file move, file deletion, staging, commit, API call, scraping, or frontend build occurred.

Unresolved decisions:
- Batu owns approval of Batch 4A-1 as the next executable workflow-spike setup if it is not already approved.
- Batu owns approval for every later Phase 4 batch transition.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to `Batch 4A-1: Workflow spike setup`, proposed unless repo docs already mark it approved.

### 2026-06-05 - Docs Authority Audit And Index

Status:
- Complete.

Scope:
- Docs-only authority audit before Phase 4A execution: classify the docs tree, add one operational docs index, neutralize stale Phase 2/3 task language, and point current control docs to the docs index and Phase 4 roadmap.

Files changed:
- `docs/DOCS_INDEX.md`
- `docs/archive/governance/AGENT_HANDOFF.md`
- `docs/archive/phase-2/PHASE_2_PLAN.md`
- `docs/archive/phase-2/PHASE_2_BACKLOG.md`
- `docs/archive/phase-3/PHASE_3_SCALE_TEST_PLAN.md`
- `docs/ART_DIRECTION.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/phase-4-execution-roadmap.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Requested docs audit by inspection, including Phase 2/3 docs, Phase 4A/4B docs, archive/research/decision/review folders, and approved reference corpus docs.
- `git status --short` before editing.
- Markdown/link sanity by inspection.
- `git diff --stat`.
- `git diff --check`.
- `git status --short` after editing.

Outcome:
- `docs/DOCS_INDEX.md` now defines the operational docs authority map and read-first path.
- Phase 4 remains controlled by `docs/phase-4-execution-roadmap.md`.
- Stale Phase 2/3 current-task wording was neutralized in historical stubs and current visual guidance.
- No Phase 4 code, runtime file, schema file, compiler script, source fixture, generated manifest, asset file, package/tooling change, file move, file deletion, staging, commit, API call, scraping, or frontend build occurred.

Unresolved decisions:
- Batu owns approval of Batch 4A-1 as the next executable workflow-spike setup if it is not already approved.
- Batu owns any future move/delete/consolidation cleanup of historical docs and review evidence.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to `Batch 4A-1: Workflow spike setup`, proposed unless repo docs already mark it approved.

### 2026-06-05 - Phase 4 Roadmap Consolidation

Status:
- Complete pending review.

Scope:
- Docs-only planning cleanup: add one primary Phase 4 execution roadmap, mark existing Phase 4A/4B docs as supporting detail, and reconcile current brief/plan/ledger around Batch 4A-1 as the proposed next task.

Files changed:
- `docs/phase-4-execution-roadmap.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Phase 4 supporting-doc review.
- `git status --short` before editing.
- Markdown heading/link inspection.
- `git diff --stat`.
- `git diff --check`.
- `git status --short` after editing.

Outcome:
- `docs/phase-4-execution-roadmap.md` is now the primary Phase 4 control surface.
- Existing Phase 4A/4B docs remain in place as supporting detail docs.
- Batch 4A-1 is recorded as the proposed next task unless repo docs already mark it approved.
- Phase 4B remains post-spike and non-implementation.
- No runtime code, schema file, compiler script, source fixture, generated manifest, asset file, package/tooling change, public interface, API call, scraping, production/public claim, commit, or deployment occurred.

Unresolved decisions:
- Batu owns approval of Batch 4A-1 as the next executable workflow-spike setup if it is not already approved.
- Batu owns Phase 4A lane decisions, Phase 4B architecture boundaries, public-interface implications, source/reference approvals, production asset direction, and any later implementation scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Batch 4A-1: Workflow spike setup`, proposed unless repo docs already mark it approved.

### 2026-06-05 - Phase 3 Closeout And Phase 4 Planning

Status:
- Complete.

Scope:
- Docs-only closeout and planning batch: close Phase 3 for planning purposes, preserve Phase 3D evidence, add Phase 4A workflow spike planning, and add Phase 4B non-implementation foundation planning.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/archive/phase-3/phase-3-closeout.md`
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- `git status --short` before editing.
- Markdown planning-doc inspection.
- `git diff --stat`.
- `git diff --check`.
- `git status --short` after editing.

Outcome:
- Phase 3 is closed for planning purposes with the core lesson recorded: real geometry and source evidence matter, but artifact-specific rendering is not a scalable production workflow.
- Phase 3D matte, screenshot evidence, reference inventory, self-audit, and evidence inventory remain preserved as review-only/non-production evidence.
- Phase 4A is recorded as the proposed next workflow spike unless repo docs already mark it approved.
- Phase 4B is documented as non-implementation planning only; schema/compiler/storefront/style/asset contracts remain planning docs, not files or scripts to create.
- No runtime code, schema file, compiler script, source fixture, generated manifest, asset-kit file, package/tooling change, API call, scraping, production/public claim, commit, or deployment occurred.

Unresolved decisions:
- Batu owns whether Phase 4A is approved as the next executable spike.
- Batu owns Phase 4A lane decisions, Phase 4B architecture boundaries, public-interface implications, source/reference approvals, production asset direction, and any later implementation scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `Phase 4A: Workflow Spike - Compiler vs Export vs Reality-Capture Reference` as the proposed next task unless repo docs already mark it approved; Phase 4B remains non-implementation planning only.

### 2026-06-05 - Phase 3D Corridor Style Matte

Status:
- Complete pending Batu review.

Scope:
- Implement the authorized narrow Phase 3D corridor style matte batch: review-only raster matte as the normal world surface, DTR-11 embedded as the east/right anchor, west/left reference-informed facade-neutral extension, sourced geometry retained as layout/provenance underlay, and truth-state overlays retained as QA only.

Files changed:
- `src/assets/review-only/phase-3d-greenpoint-westward-corridor-matte-review-only.png`
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/mvp-review/phase-3d-corridor-style-matte-review/README.md`
- `docs/mvp-review/phase-3d-corridor-style-matte-review/REFERENCE_INVENTORY.md`
- `docs/mvp-review/phase-3d-corridor-style-matte-review/SELF_AUDIT.md`
- `docs/mvp-review/phase-3d-corridor-style-matte-review/generated/phase-3d-corridor-style-matte-default.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- JSON parse for Phase 3B raw and normalized geometry packets.
- Structural truth-state check for matte reference, reference inventory existence, QA-only geometry overlays, and blocked Brouwerij/business/frontage/facade/entrance/signage/active-status/exact-storefront/exact-address claims.
- Visual inspection of the matte asset and deterministic screenshot artifact.
- `npm run build`.
- Browser smoke on local Vite dev server at `http://127.0.0.1:5175/`.
- `git diff --check`.
- `git diff --stat`.
- `git status --short`.

Outcome:
- Phase 3 now has a review-only raster corridor matte as the normal app surface.
- DTR-11 remains the east/right anchor, and the west/left corridor extension is generic/reference-informed and facade-neutral.
- Batu-supplied local reference images inform general visual character only.
- Sourced NYC/Open geometry remains provenance/layout underlay and truth-state overlays remain QA/provenance overlays.
- Brouwerij/business/frontage/facade/entrance/signage/active-status/exact-storefront/exact-address claims remain blocked.
- No Foursquare/API call, scraping, external fetch, third-party imagery collection, invented tenant/signage/frontage/facade/entrance, production/public claim, new framework, renderer, map system, package tooling, backend service, CMS, persistence, analytics, CI, deployment, or commit occurred.

Unresolved decisions:
- Batu owns whether the matte is coherent enough to close Phase 3.
- Batu owns any later matte refinement, exact facade/reference evidence, business/POI source approval, Brouwerij claim promotion, source join, Phase 4 workflow, production asset direction, and production/public readiness decision.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 3D matte, screenshot evidence, reference inventory, self-audit, and QA/provenance behavior; no further implementation batch is authorized until Batu approves the next step.

### 2026-06-05 - Phase 3 Westward Visual-Integration Pass

Status:
- Complete pending Batu review.

Scope:
- Reduce the remaining raster/vector seam in the westward corridor scene, make the sourced massing less generic, and diagnose the local browser-smoke path before commit.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `docs/mvp-review/phase-3-geometry-first-corridor-review/README.md`
- `docs/mvp-review/phase-3-geometry-first-corridor-review/generated/phase-3-westward-geometry-to-massing-corridor-default.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Minimal Node socket bind diagnosis: localhost bind failed before Vite with `listen EPERM: operation not permitted 127.0.0.1:5175`, indicating an environment/network-sandbox limitation rather than an app issue.
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- Phase 3 westward geometry structural check.
- Screenshot artifact check for `phase-3-westward-geometry-to-massing-corridor-default.png`.
- `npm run build`.
- `git diff --check`.
- `git status --short`.

Outcome:
- Further reduced label dominance and decorative background texture.
- Added a manual-draft seam apron, calmer street tone, subtler curb/slab cues, varied lot widths/heights, varied roof/parapet treatment, and facade-neutral base rhythm.
- Strengthened the Franklin corner massing/context moment while keeping Brouwerij blocked.
- No external fetch, Foursquare/API call, scraping, fictional business, tenant fill, facade inference, frontage inference, entrance inference, signage inference, production/public claim, package/tooling change, backend service, CMS, persistence, analytics, or deployment occurred.

Unresolved decisions:
- Batu owns whether the seam is now sufficiently integrated for Phase 3 review and whether any later raster/reference asset is needed before business/place overlays.
- Batu owns any later geometry/massing art refinement, Franklin Ave/St naming decision, business/POI source approval, Brouwerij claim promotion, facade/reference imagery, frontage/entrance/exact-address decisions, and corridor-specific raster direction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 3 westward visual-integration corridor surface and screenshot evidence; no further implementation batch is authorized until Batu approves the next refinement, business/source, facade/reference, join, or raster step.

### 2026-06-05 - Phase 3 Westward Geometry-To-Massing Correction

Status:
- Complete pending Batu review.

Scope:
- Correct the Phase 3 geometry-to-massing scene so the corridor expands west / left from the DTR-11 Manhattan Ave / Greenpoint Ave anchor, and refine the visual treatment toward a continuous paper/ink street scene before any business verification work.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/PlaceholderWorld.jsx`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/mvp-review/phase-3-geometry-first-corridor-review/README.md`
- `docs/mvp-review/phase-3-geometry-first-corridor-review/generated/phase-3-westward-geometry-to-massing-corridor-default.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc review: `docs/VISUAL_ARTIFACT_STANDARDS.md`, `docs/VISUAL_QA_CHECKLIST.md`, and `docs/phase-3-real-corridor-evidence-inventory.md`.
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- Visual self-audit against the requested seven-item acceptance test after generating `phase-3-westward-geometry-to-massing-corridor-default.png`.
- Phase 3 geometry structural check.
- Screenshot artifact check.
- `npm run build`.
- Browser smoke on local Vite dev server.
- `git diff --check`.
- `git status --short`.

Outcome:
- Moved the DTR-11 raster to the right-side baseline position and mirrored the sourced corridor geometry so the continuation expands west / left.
- Added warmer paper/ink massing treatment, roof/parapet hatching, generic facade-neutral base rhythm, softer shadows, curb/street texture, manual sidewalk slab cues, and reduced normal-mode label dominance.
- Kept sourced/manual/blocked truth-state separation visible without turning labels into the main proof.
- Brouwerij remains blocked for POI identity, address, category, coordinates, frontage, entrance, facade, signage, active status, exact storefront geometry, exact address placement, and raster readiness.
- No external fetch, Foursquare/API call, scraping, fictional business, tenant fill, facade inference, frontage inference, entrance inference, signage inference, production/public claim, package/tooling change, backend service, CMS, persistence, analytics, or deployment occurred.

Unresolved decisions:
- Batu owns whether the westward corridor now feels like one coherent DTR-11-derived street scene rather than a raster panel plus schematic extension.
- Batu owns any later geometry/massing art refinement, Franklin Ave/St naming decision, business/POI source approval, Brouwerij claim promotion, facade/reference imagery, frontage/entrance/exact-address decisions, and corridor-specific raster direction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 3 westward geometry-to-massing corridor surface and screenshot evidence; no further implementation batch is authorized until Batu approves the next refinement, business/source, facade/reference, join, or raster step.

### 2026-06-05 - Phase 3 Geometry-To-Massing Corridor Review

Status:
- Complete pending Batu review.

Scope:
- Convert the Phase 3B sourced NYC/Open corridor geometry from a GIS/debug-style overlay into an art-directed paper/ink isometric corridor scene with two recognizable corner moments, while preserving claim-level truth states and keeping business verification blocked.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/PlaceholderWorld.jsx`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/mvp-review/phase-3-geometry-first-corridor-review/README.md`
- `docs/mvp-review/phase-3-geometry-first-corridor-review/generated/phase-3-geometry-to-massing-corridor-default.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc review: `docs/VISUAL_ARTIFACT_STANDARDS.md`, `docs/VISUAL_QA_CHECKLIST.md`, and `docs/phase-3-real-corridor-evidence-inventory.md`.
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- Phase 3 geometry structural check: 12 sourced paper/ink massing blocks resolve to Phase 3B normalized geometry records, Franklin corner massing is present, and Brouwerij/frontage/facade/entrance/business fields remain blocked.
- Screenshot artifact check for `docs/mvp-review/phase-3-geometry-first-corridor-review/generated/phase-3-geometry-to-massing-corridor-default.png`.
- `npm run build`.
- Browser smoke on local Vite dev server at `http://127.0.0.1:5175/`: canvas present, DTR-11 context present, mid-corridor sourced geometry text present, Franklin corner text present, Brouwerij blocked text present, truth-state legend present, QA/review state visible, no horizontal overflow, and no forbidden fictional/placeholder/fake-business/tenant-fill terms.
- `git diff --check`.
- `git status --short`.

Outcome:
- Sourced NYC/Open building-footprint records now render as filled stylized roof/wall massing blocks instead of raw outline linework.
- The mid-corridor streetbed, sourced massing rhythm, and quiet manual sidewalk bands visually connect the DTR-11 Manhattan corner toward Franklin.
- The Franklin endpoint is now a sourced/contextual corner massing moment rather than a blocked-only marker.
- Brouwerij remains blocked for POI identity, address, category, coordinates, frontage, entrance, facade, signage, active status, exact storefront geometry, exact address placement, and raster readiness.
- No external fetch, Foursquare/API call, scraping, fictional business, tenant fill, facade inference, frontage inference, entrance inference, production/public claim, package/tooling change, backend service, CMS, persistence, analytics, or deployment occurred.

Unresolved decisions:
- Batu owns whether the geometry-to-massing scene now reads as Greenpoint Ave from Manhattan Ave toward Franklin Ave before business/place overlays.
- Batu owns any later geometry/massing art refinement, Franklin Ave/St naming decision, business/POI source approval, Brouwerij claim promotion, facade/reference imagery, frontage/entrance/exact-address decisions, and corridor-specific raster direction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 3 geometry-to-massing corridor surface and screenshot evidence; no further implementation batch is authorized until Batu approves the next refinement, business/source, facade/reference, join, or raster step.

### 2026-06-05 - Phase 3 Sourced Geometry Corridor Review

Status:
- Complete pending Batu review.

Scope:
- Ingest official NYC/Open geometry for the Manhattan-to-Franklin corridor, normalize it into repo-local evidence, promote only supported street/building geometry claims in the Phase 3 scene, keep Brouwerij/business/frontage/facade/entrance claims blocked, and produce screenshot evidence for review.

Files changed:
- `src/data/geometry-source/raw/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry.phase-3b.raw.json`
- `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json`
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/App.jsx`
- `src/styles.css`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/mvp-review/phase-3-geometry-first-corridor-review/README.md`
- `docs/mvp-review/phase-3-geometry-first-corridor-review/generated/phase-3-sourced-geometry-corridor-default.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc review: `docs/MVP_SCOPE.md`, `docs/reference/DATA_SOURCES.md`, `docs/reference/PLACE_SOURCE_POLICY.md`, `docs/reference/PROVENANCE_AND_QA.md`, and `docs/phase-3-real-corridor-evidence-inventory.md`.
- Official source retrieval from NYC Open Data Building Footprints, Centerline/CSCL, and Sidewalk Centerline/SIDEWALK_LINE line context.
- JSON parse for the Phase 3 scene fixture and Phase 3B raw/normalized official geometry packets.
- Structural source/evidence check: 291 footprint records, 2 selected Greenpoint Ave street-centerline records, 4 selected sidewalk-line/context records, with blocked claim classes preserved.
- Foursquare Brouwerij readiness check failed as expected due to missing credential/terms gates and made no live request.
- `npm run build`.
- Browser smoke on local Vite dev server: DTR-11 anchor, sourced mid-corridor, Franklin sourced context, Brouwerij blocked text, sourced/manual/blocked legend, canvas mount, no forbidden fictional-storefront terms, and no meaningful horizontal overflow after root clamp.
- Browser screenshot capture timed out and canvas export was unavailable; deterministic PNG evidence was generated from the checked-in scene fixture and DTR-11 raster, then visually inspected.
- `git diff --check`.
- `git status --short`.

Outcome:
- Added a raw official geometry packet and normalized official geometry packet for the corridor.
- Promoted mid-corridor and Franklin endpoint from blocked/manual-only geometry review to sourced/contextual street/building geometry where NYC/Open records support it.
- Preserved DTR-11 as the west-anchor visual baseline.
- Kept sidewalk surfaces and stylized scene projection manual_draft/contextual.
- Kept Brouwerij identity, address, category, coordinates, provenance, frontage, entrance, facade, signage, active status, exact storefront geometry, and raster readiness blocked because approved POI/API credentials/source packets are unavailable.
- No fictional businesses, tenant fill, frontage inference, entrance inference, facade inference, scraping, business live API call, production/public claim, package/tooling change, backend service, CMS, persistence, analytics, or deployment occurred.

Unresolved decisions:
- Batu owns whether the sourced-geometry two-corner corridor now reads spatially as Greenpoint Ave from Manhattan toward the Franklin endpoint.
- Batu owns any visual refinement, naming-text resolution for Franklin Ave/St, source authority decisions, Foursquare/API or local-directory access approval, Brouwerij claim promotion, facade/reference imagery, frontage/entrance/exact-address decisions, and later corridor-specific raster direction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 3 sourced-geometry corridor surface and screenshot evidence; no further implementation batch is authorized until Batu approves the next refinement, business/source, facade/reference, join, or raster step.

### 2026-06-05 - Phase 3 Geometry Screenshot Evidence

Status:
- Complete pending Batu review.

Scope:
- Diagnose the browser screenshot timeout, preserve the current truth-state contract, and produce deterministic screenshot evidence for the geometry-first corridor review surface before any business verification work.

Files changed:
- `docs/mvp-review/phase-3-geometry-first-corridor-review/generated/phase-3-geometry-first-corridor-default.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc review: `docs/MVP_SCOPE.md`, `docs/VISUAL_ARTIFACT_STANDARDS.md`, and `docs/VISUAL_QA_CHECKLIST.md`.
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- Browser smoke on local Vite preview at `http://127.0.0.1:5174/`: canvas mounted, DTR-11 context present, geometry legend present, segment rail present, mid-corridor and Franklin labels present, no horizontal overflow, and no visible fictional/placeholder storefront terms.
- Screenshot diagnosis: raw in-app browser tab screenshot capture completed quickly, but returning/writing those bytes from the browser sandbox timed out or was blocked. Full OS screen capture was rejected because it could include unrelated private content. Headless Chrome/Playwright launch was unavailable or blocked by the sandbox.
- Deterministic PNG artifact generated from the checked-in Phase 3 scene fixture and accepted DTR-11 raster, then visually inspected.
- `npm run build`.
- `git diff --check`.
- `git status --short`.

Outcome:
- Added screenshot evidence showing the DTR-11 west-anchor context, manual-draft mid-corridor street/massing continuation, Franklin/Brouwerij blocked markers, and sourced/manual-draft/blocked geometry legend.
- Preserved the truth-state separation: sourced/contextual west anchor, manual-draft/contextual mid-corridor geometry, blocked Franklin/Brouwerij/exact geometry/business/facade/frontage/entrance.
- No fictional businesses, tenant fill, frontage inference, entrance inference, facade inference, business verification, live retrieval, Foursquare use, package/tooling change, production/public claim, or Brouwerij promotion occurred.

Unresolved decisions:
- Batu owns whether the corridor reads spatially as Greenpoint Ave from Manhattan toward Franklin.
- Batu owns any refinement of manual-draft massing, supplied/approved missing geometry records, business/source evidence, facade/reference imagery, exact geometry/frontage/entrance decisions, corridor-specific raster direction, and future non-west target promotion.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the geometry-first corridor surface and screenshot evidence; no further implementation batch is authorized until Batu approves the next refinement, source, facade, or missing-geometry step.

### 2026-06-05 - Phase 3 Geometry-First Corridor Review

Status:
- Complete pending Batu review.

Scope:
- Make the Manhattan Ave to Franklin Ave corridor visually reviewable as architecture/street geometry first, without business verification or tenant overlays.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/PlaceholderWorld.jsx`
- `src/App.jsx`
- `src/styles.css`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc review: `docs/MVP_SCOPE.md`, `docs/ART_DIRECTION.md`, `docs/VISUAL_ARTIFACT_STANDARDS.md`, `docs/VISUAL_QA_CHECKLIST.md`, and `docs/phase-3-real-corridor-evidence-inventory.md`.
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- `npm run build`.
- Browser smoke on local Vite preview at `http://127.0.0.1:5174/`: default load, DTR-11 context present, geometry legend present, corridor segment rail present, canvas present after render, mid-corridor card geometry-first, Franklin card blocked-geometry first, QA controls open, no horizontal page overflow, and no visible fictional/placeholder storefront terms. Browser screenshot capture timed out and was not used as evidence.
- `git diff --check`.
- `git status --short`.

Outcome:
- Preserved the accepted DTR-11 Manhattan Ave / Greenpoint Ave raster as the sourced west-anchor baseline.
- Added status-labeled geometry-review records and renderer support for sourced/contextual west anchor, manual-draft/contextual mid-corridor streetbed/sidewalk/massing rhythm, and blocked/contextual Franklin/Brouwerij markers.
- Added a compact sourced/manual-draft/blocked geometry legend and changed the default rail/card hierarchy from place-first to segment/geometry-first.
- Moved evidence/business details behind QA so they remain secondary to geometry review.
- No fictional businesses, tenant fill, frontage inference, entrance inference, facade inference, live retrieval, Foursquare use, package/tooling change, production/public claim, or Brouwerij promotion occurred.

Unresolved decisions:
- Batu owns whether the corridor now reads as Greenpoint Ave from Manhattan toward Franklin.
- Batu owns any refinement of manual-draft massing, supplied/approved missing geometry records, business/source evidence, facade/reference imagery, exact geometry/frontage/entrance decisions, corridor-specific raster direction, and future non-west target promotion.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the geometry-first corridor surface; no further implementation batch is authorized until Batu approves the next refinement, source, facade, or missing-geometry step.

### 2026-06-04 - Phase 3 Corridor NYC/Open Geometry Intake

Status:
- Complete pending Batu review.

Scope:
- Create a deterministic repo-local NYC/Open geometry context packet for the Greenpoint Ave slice from Manhattan Ave to Franklin Ave, using repo-local inputs only and preserving the Phase 3 real corridor reset visual baseline.

Files changed:
- `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3a.json`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Existing geometry/source inspection: `src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json`, source/geometry scripts, scene schema background, and Phase 3 reset evidence inventory.
- JSON parse for `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3a.json`.
- JSON parse for `src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json`.
- Narrow structural check for the new geometry packet: no live retrieval, no scraping, no Foursquare, four carried west-anchor records with contextual geometry status, and blocked gap segments for mid-corridor, Franklin, and Brouwerij.
- Existing source-evidence verifiers were inspected but not run because they validate source-evidence fixtures, not standalone geometry-source fixtures.
- `npm run build` not run because no app/runtime files changed.
- `git diff --check`
- `git status --short`

Outcome:
- Added a Phase 3 geometry context packet defining the Manhattan-to-Franklin corridor scope, both requested street sides, Manhattan and Franklin intersection context, source/provenance, coverage summary, coverage segments, carried west-anchor footprint records, and blocked claims.
- Carried forward existing NYC/Open west-anchor footprint records for BINs `3064700`, `3064733`, `3064827`, and `3422353` as contextual geometry only.
- Marked mid-corridor, Franklin endpoint, and Brouwerij geometry coverage as missing/blocked because no repo-local NYC/Open source records cover those portions.
- Updated the real corridor evidence inventory to distinguish geometry context from business identity, tenant frontage, entrances, facade imagery, exact address placement, and raster readiness.
- No live API call, scraping, Foursquare use, visual-scene change, business deepening, tenant-frontage inference, entrance inference, facade inference, package/tooling change, or production/public claim occurred.

Unresolved decisions:
- Batu owns whether to approve/supply missing mid-corridor and Franklin geometry records, business/source records, facade/reference imagery, exact geometry/frontage/entrance decisions, corridor-specific raster direction, and any future non-west target promotion.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the geometry intake packet; no further implementation batch is authorized until Batu approves the next missing-geometry, source, or facade intake step.

### 2026-06-04 - Phase 3 Real Corridor Reset Implementation

Status:
- Complete pending Batu review.

Scope:
- Stop presenting fictional placeholder storefront art as the Phase 3 normal review surface, wire the accepted DTR-11 Manhattan Ave / Greenpoint Ave raster as the west-anchor visual baseline, and convert mid-corridor, Franklin, and Brouwerij into real-data intake/blocked states.

Files changed:
- `src/mvpPlaceData.js`
- `src/sceneManifest.js`
- `src/PlaceholderWorld.jsx`
- `src/App.jsx`
- `src/styles.css`
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Source/raster inspection: active Phase 3 data path, Phase 3 fixture, Phase 2/DTR-11 scene manifest asset wiring, active west-anchor real-data fixture, DTR-11 facade evidence paths, and Phase 6 placeholder references.
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- `npm run build`.
- Browser smoke after temporary local network permission: default load text/host label, no fictional storefront names in active DOM, selected intake card click, QA toggle after control/card stacking fix, renderer canvas mount, and desktop containment. Screenshot and canvas-pixel reads were unavailable in the in-app browser runtime; mobile viewport resizing was also unsupported.
- `git diff --check`
- `git status --short`

Outcome:
- `src/mvpPlaceData.js` now binds the Phase 3 fixture to `src/assets/review-only/dtr-11-reference-facade-fidelity-interactive-demo-review-only.png` instead of the Phase 6 placeholder raster.
- The Phase 3 fixture now treats the DTR-11 raster as a west-anchor review-only baseline with explicit render bounds, and keeps mid-corridor/Franklin/Brouwerij as blocked/intake lanes rather than fictional storefronts.
- Evidence lanes and cards remain available as support; the spatial-grounding packet is QA-only and no longer appears as the normal-mode visual proof.
- Added a real corridor evidence inventory separating known west-anchor evidence, repo-local candidate/blocked items, missing corridor inputs, and blocked claims.
- No live retrieval, source-vendor integration, broad ingestion, production/public claims, Brouwerij deepening, or new framework/tooling occurred.

Unresolved decisions:
- Batu owns reset acceptance, corridor facade imagery supply/approval, real source/access approval, exact-geometry/frontage/entrance decisions, corridor-specific raster direction, and any future non-west target promotion.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the reset; no further implementation batch is authorized until Batu approves the next source/facade intake step.

### 2026-06-04 - Phase 3 Real Corridor Direction Correction

Status:
- Complete; next implementation batch authorized by `docs/CURRENT_EXECUTION_BRIEF.md`.

Scope:
- Record Batu approval that Phase 3 should stop using arbitrary placeholder storefront art/SVG diagramming as the review surface and should redirect toward the real Greenpoint Ave corridor from Manhattan Ave to Franklin Ave.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/DECISION_LOG.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc review: `docs/MVP_SCOPE.md`, `docs/DECISION_LOG.md`, and `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md`.
- `git diff --check`
- `git status --short`

Outcome:
- Replaced the stale "Batu review pending" current brief with a real-corridor reset brief.
- Recorded that the Phase 6 fictional storefront raster is scaffold mechanics only and must not be the normal Phase 3 product review surface.
- Set the next authorized batch to re-anchor the app/review path on the accepted Phase 2/DTR-11 Manhattan Ave / Greenpoint Ave west-anchor raster where feasible and to represent mid-corridor/Franklin as real-data intake/blocked until sourced.
- Preserved review-only status, no live retrieval/scraping, no production/public claims, no package/tooling changes, and no invented storefront substitutions for missing data or facade imagery.

Unresolved decisions:
- Batu still owns facade imagery supply/approval for Greenpoint Ave between Manhattan Ave and Franklin Ave.
- Batu still owns any future source-access, non-west target promotion, corridor-specific raster, production/public, or exact-geometry approval.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now authorizes the Phase 3 real corridor reset and evidence-backed scene foundation.

### 2026-06-04 - Phase 3 West Anchor Spatial Grounding

Status:
- Complete pending Batu visual review.

Scope:
- Make the Manhattan Ave / Greenpoint Ave west anchor visually reviewable using repo-local reviewed MVP metadata, NYC/Open geometry context, DTR-11/reference-photo-derived facade cues, and the existing placeholder/scaffold renderer only.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc/source review: `docs/MVP_SCOPE.md`, `docs/ART_DIRECTION.md`, `docs/VISUAL_ARTIFACT_STANDARDS.md`, `docs/VISUAL_QA_CHECKLIST.md`, `src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json`, `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`, `src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json`, and `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/generated/facade-extraction-specs.json`.
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- `npm run build`.
- Browser smoke after temporary local network permission: default load, west-anchor visual recognition, selected-card click, and QA overlay visible.
- Mobile containment could not be viewport-smoked because the in-app browser surface did not expose viewport resizing and the repo does not include local Playwright.
- `git diff --check`.
- `git status --short`.

Outcome:
- Added a west-anchor `spatialGrounding` packet with manual-draft Manhattan Ave and Greenpoint Ave axes, crosswalk context, four approximate corner pads/masses, active storefront cue blocks for Grillpoint Deli, McDonald's, Dunkin', and Citizens Bank, and a symbolic Greenpoint Av G station-area cue.
- Added renderer support for the spatial grounding packet as a review-only scaffold overlay on default load, with QA/status labels preserved in review mode.
- Added a compact Spatial Grounding section to the selected west-anchor card.
- Preserved evidence lanes/card sections as supporting UI.
- Kept Brouwerij Lane, Franklin, and mid-corridor visibly candidate/blocked; no live retrieval, source-vendor integration, package/tooling change, production raster replacement, or broad corridor implementation occurred.

Unresolved decisions:
- Batu owns whether the spatial grounding is recognizable enough to support meaningful visual/product feedback.
- Batu owns whether the next brief refines this overlay, supplies/approves a corridor-specific raster/reference surface, adds a facade/frontage/entrance evidence path, deepens one non-west target after approved source material exists, or pauses Phase 3.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review / approval pending; no further implementation task is authorized until Batu accepts, redirects, or replaces the next-task pointer.

### 2026-06-04 - Phase 3 West Anchor QA/Evidence Overlay

Status:
- Structurally complete; visually not yet feedback-ready after Batu review.

Scope:
- Implement the smallest Phase 3 west-anchor QA/evidence overlay pass for Manhattan Ave / Greenpoint Ave only, using existing reviewed metadata, NYC/Open geometry context, DTR-11/reference-photo-derived facade evidence status, visible claim/status lanes, and interactive card behavior.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Source evidence review: `src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json` and `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/generated/facade-extraction-specs.json`.
- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- `npm run build`.
- Browser smoke unavailable in this sandbox: the dev server could not bind to localhost (`listen EPERM` on ports 5173 and 5174), and the in-app browser policy blocked direct `file://` loading of a temporary relative-path build.
- `git diff --check`.
- `git status --short`.

Outcome:
- The west-anchor fixture now surfaces separate business/place metadata, NYC/Open geometry context, DTR-11 facade/reference evidence, and raster/interaction status lanes.
- The interactive selected card now shows west-anchor metadata, geometry context, and facade evidence as separate sections.
- QA mode now surfaces a compact source/status lane strip and geometry-context cue for the west anchor.
- Batu review found the overlay structurally useful but not yet meaningful for visual/product feedback because the base corridor does not resemble Manhattan Ave / Greenpoint Ave closely enough.
- Gate correction: evidence overlays are downstream of spatial recognizability; the next proof must first let Batu identify the real intersection represented, even if still draft.
- Mid-corridor, Franklin, and Brouwerij remain candidate/blocked scaffolds; no Brouwerij deepening or live Foursquare retrieval occurred.
- The placeholder raster remains scaffold mechanics only, not factual corridor art or production visual evidence.

Unresolved decisions:
- Batu owns visual/product acceptance after the west-anchor spatial grounding pass.
- Batu owns any later evidence-lane refinement, source/access, manual evidence packet, facade/frontage/entrance, corridor raster, production/public, or target-promotion decision.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now authorizes the Phase 3 west-anchor spatial grounding pass.

### 2026-06-04 - Brouwerij Foursquare Credential Blocker

Status:
- Blocked; no live retrieval performed.

Scope:
- Attempt the next bounded Phase 3 Brouwerij Lane Foursquare POI evidence packet only if credentials, repo-recorded terms/cache/display approval, and contract field scope are present. Record a blocker report if gates are missing.

Files changed:
- `docs/phase-3-brouwerij-foursquare-credential-blocker.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Contract/stub review: `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md` and `scripts/prepare-foursquare-brouwerij-poi-evidence.mjs`.
- Foursquare readiness check: `node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --check-readiness` failed as expected because required credential and terms/cache/display approval env vars are missing.
- Repo approval search: no separate repo-recorded Foursquare terms/cache/display approval found.
- No live API call performed.
- Markdown/lint command search: no dedicated docs lint or markdown lint script is available in `package.json`.
- `npm run build` not run; docs are not imported into app behavior.
- `git diff --check`
- `git status --short`

Outcome:
- Created a review-only Foursquare credential/source blocker report for Brouwerij Lane.
- Confirmed the Foursquare contract permits the requested evidence fields, but retrieval is blocked because required credentials and terms/cache/display approval are missing.
- Did not create the raw Foursquare fixture or normalized POI evidence output.
- Did not deepen Brouwerij Lane in the scene fixture, call live APIs, scrape, change app/source behavior, or create production/public claims.

Unresolved decisions:
- Batu owns whether to provide/configure Foursquare credentials and record terms/cache/display approval.
- Batu owns whether to use a deterministic LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, other local-directory/community packet, or a Batu-approved manual evidence packet instead.
- Batu owns separate facade/frontage/entrance/raster evidence decisions.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` continues to point to the Phase 3 Brouwerij Lane deterministic POI evidence packet as pending Batu-approved source access/material.

### 2026-06-04 - Phase 3 Foursquare Brouwerij Adapter Contract

Status:
- Complete; no live retrieval performed and Brouwerij scene deepening remains blocked.

Scope:
- Prepare a bounded review-only Foursquare one-target POI evidence adapter contract for Brouwerij Lane, including local fixture paths, normalized output path, fail-fast credential/terms stub, allowed fields, cache/hash policy, and review-only documentation.

Files changed:
- `scripts/prepare-foursquare-brouwerij-poi-evidence.mjs`
- `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Existing source-evidence script/style review.
- Foursquare source-reference review: Places API docs/product page, Places OS schema orientation, Places overview, and categories documentation.
- `node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --print-contract`
- Expected fail-fast check for missing credentials/terms: `node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --check-readiness`
- Markdown/lint command search: no dedicated docs lint or markdown lint script is available in `package.json`.
- `npm run build` not run; docs/script are not imported into app behavior.
- `git diff --check`
- `git status --short`

Outcome:
- Defined raw fixture path `src/data/source-evidence/raw/foursquare/brouwerij-lane.phase-3.foursquare.raw.json`.
- Defined normalized evidence output path `src/data/source-evidence/phase-3/brouwerij-lane.foursquare.poi-evidence.v0.1.json`.
- Added a deterministic review-only script/stub that prints the contract, checks required Foursquare credential/terms/cache/review-only gates, and fails clearly when they are missing.
- Documented required env vars, allowed fields, blocked fields, cache/hash policy, and review-only status.
- Did not call Foursquare, scrape, create raw/normalized evidence fixtures, deepen Brouwerij Lane in the scene fixture, change app behavior, or create production/public interfaces.

Unresolved decisions:
- Batu owns whether to provide/configure Foursquare credentials and record terms/cache/display approval.
- Batu owns whether to prefer a deterministic local-directory/community source packet instead of Foursquare.
- Batu owns any separate facade/frontage/entrance/raster evidence for Brouwerij Lane.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` continues to point to the Phase 3 Brouwerij Lane deterministic POI evidence packet as pending Batu-approved source access/material.

### 2026-06-04 - Phase 3 Local Directory Source Lane ADR Amendment

Status:
- Complete; source retrieval remains blocked pending Batu-approved deterministic source access/material.

Scope:
- Amend the Phase 3 POI/business source ADR to explicitly incorporate North Brooklyn Chamber and Shop Small Greenpoint into the local-directory/community source strategy while preserving Foursquare as the practical near-term implementation lane when no deterministic local source is available.

Files changed:
- `docs/reference/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- ADR/source-reference review: North Brooklyn Chamber member directory/home, Shop Small Greenpoint directory/Instagram reference, and Foursquare Places API docs/product pages. No live APIs were called, no scraping was performed, and no directory entries were extracted.
- Markdown/lint command search: no dedicated docs lint or markdown lint script is available in `package.json`.
- `npm run build` not run; docs are not imported into app behavior.
- `git diff --check`
- `git status --short`

Outcome:
- Renamed/clarified the local-source lane as the strategic local-directory/community-validation lane.
- Explicitly included LiveXYZ, North Brooklyn Chamber member directory, Shop Small Greenpoint directory, and other Batu-approved local business lists.
- Preserved the rule that these sources become deterministic fixture inputs only with approved static export, approved API/access path, approved manually captured evidence packet, or stable local file with source/date/owner/usage/claim-support metadata and hash.
- Preserved Foursquare as the practical near-term POI implementation lane for the first one-target retrieval spike when no deterministic local-directory export/access exists.
- Preserved Google Places as restricted human review/cross-check only, OSM as open corroboration, NYC Open Data as geometry/context only, and manual evidence packets as required for facade/frontage/entrance/raster readiness.
- Did not implement API integration, scrape/extract directory pages, deepen Brouwerij Lane, change app/source files, or edit unrelated review-package/audit files.

Unresolved decisions:
- Batu owns whether to supply or approve a LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, other local-directory/community, Foursquare, or alternate deterministic source packet for Brouwerij Lane.
- Batu owns any partnership/outreach/source-owner permission decisions for local-directory use.
- Batu owns whether Brouwerij facade/frontage/entrance/raster fields remain blocked or receive separate approved evidence.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` continues to point to the Phase 3 Brouwerij Lane deterministic POI evidence packet as pending Batu-approved source access/material.

### 2026-06-04 - Phase 3 POI Business Source ADR

Status:
- Complete; Brouwerij source retrieval remains blocked pending Batu-approved source access/material.

Scope:
- Create a review-only Phase 3 POI/business source ADR and narrow Brouwerij Lane source-spike readout without live API calls, scraping, broad integration, app/source changes, or target deepening.

Files changed:
- `docs/reference/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required doc/source reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/reference/DATA_SOURCES.md`, `docs/reference/PROVENANCE_AND_QA.md`, `docs/reference/SCENE_MANIFEST_SCHEMA.md`, `docs/DECISION_LOG.md`, and `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- External docs review only for source-policy orientation; no live APIs called and no scraping performed.
- Markdown/lint command search: no dedicated docs lint or markdown lint script is available in `package.json`.
- `npm run build` not run; docs are not imported into app behavior.
- `git diff --check`
- `git status --short`

Outcome:
- Added the Phase 3 POI/business source ADR under `docs/reference/decisions/`.
- Recommended separate source lanes: LiveXYZ/local-directory static export/access as preferred POI lane if Batu approves terms and deterministic fixture storage, Foursquare as fallback POI lane after credential/terms approval, OSM as open cross-check, NYC Open Data/official records as geometry/context lane, and manual evidence packets as the only lane for facade/frontage/entrance/raster readiness.
- Defined a review-only normalized deterministic POI evidence record shape for later Phase 3 packets.
- Recorded credentials/access needs and the Brouwerij Lane readout: identity/address/category/coordinates/freshness/provenance can be retrieved only after approved source access/material exists; facade/frontage/entrance/raster readiness remain blocked by separate evidence needs.
- Did not modify app/source files, deepen Brouwerij Lane, create production/public interfaces, create broad API integration, call live APIs, scrape, or edit unrelated review-package/audit files.

Unresolved decisions:
- Batu owns approval or supply of LiveXYZ/local-directory access/export, Foursquare credentials/export path, or another deterministic Brouwerij POI source packet.
- Batu owns whether Brouwerij facade/frontage/entrance/raster fields remain blocked or receive separate approved evidence.
- Batu owns whether the next batch authorizes a one-target evidence packet after access/material is available, switches targets, or pauses Phase 3 source deepening.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the Phase 3 Brouwerij Lane deterministic POI evidence packet as pending Batu-approved source access/material.

### 2026-06-04 - Phase 3 Roadmap Source ADR Reconciliation

Status:
- Complete.

Scope:
- Execute a docs-only roadmap reconciliation batch to collapse `docs/PLAN.md` into a short Phase 3 completion roadmap and promote the Phase 3 POI/business source ADR + narrow source spike as the next required batch.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Markdown/lint command search: no dedicated docs lint or markdown lint script is available in `package.json`.
- `npm run build` not run; docs are not imported into app behavior.
- `git diff --check`
- `git status --short`

Outcome:
- Collapsed Phase 2/DTR detail in `docs/PLAN.md` into a locked/completed summary with pointers to the ledger, archived ledger history, and review packets.
- Rewrote Phase 3 as a completion roadmap with the required ten-step sequence from source ADR through Phase 3 exit read.
- Promoted the source/API decision from buried blocker to the next explicit batch.
- Updated `docs/CURRENT_EXECUTION_BRIEF.md` to authorize only Phase 3 POI/business source ADR + narrow source spike as the next Codex batch.
- Preserved review-only status, MVP locked/demo status, source-of-truth order, and production/public-readiness gates.
- Did not edit app/source files, package/tooling files, or unrelated review-package/audit files.

Unresolved decisions:
- Batu owns the eventual source-authority decision after the ADR/source spike.
- The next batch must recommend primary/fallback/cross-check source lanes, define credential/access needs, define deterministic evidence record shape, and block retrieval if no approved credential/source access exists.
- Brouwerij Lane and any other non-west target cannot be deepened until the ADR/source spike is complete.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Phase 3 POI/business source ADR + narrow source spike.

### 2026-06-04 - Phase 3 Brouwerij Lane Source Retrieval Spike

Status:
- Complete; source retrieval is blocked pending Batu-approved source material/access.

Scope:
- Execute one narrow Phase 3 source-retrieval spike for exactly one target, Brouwerij Lane, and preserve review-only status while avoiding unsupported facade/frontage/entrance/raster claims.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/data/source-candidates/brouwerij-lane.phase-3-source-retrieval-spike.v0.1.json`
- `docs/phase-3-brouwerij-source-retrieval-spike.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Source/path review: Phase 3 scaffold fixture, `docs/reference/DATA_SOURCES.md`, `docs/reference/PLACE_SOURCE_POLICY.md`, `docs/MVP_SCOPE.md`, `docs/reference/DATA_FEASIBILITY.md`, MVP-02 place-truth packet, MVP-05 source-of-truth validation spike, source-evidence scripts, checked-in source-evidence fixtures, and local environment source/credential variable names.
- Brouwerij source-candidate JSON parse.
- Phase 3 scaffold JSON parse.
- Phase 3 scaffold loader/status check.
- `npm run build`
- `git diff --check`
- `git status --short`

Outcome:
- Brouwerij Lane is now represented as a review-only source-retrieval-blocked candidate under the Franklin Ave endpoint.
- The new source-candidate record tracks identity, address, category/business type, coordinates, and source provenance as `blocked_source_retrieval`.
- Storefront/frontage/order, facade/source imagery, entrance, and raster readiness remain `blocked` because POI/address retrieval would not support those claims.
- Historical Brouwerij notes remain local context only; they explain why Brouwerij is a plausible spike target but are not promoted into sourced business data.
- No live retrieval, scraping, source acquisition pipeline, placeholder-raster replacement, production asset, public interface, production architecture, or production/public readiness change was introduced.

Unresolved decisions:
- Batu owns the approved source path for Brouwerij Lane, including whether to provide a static source response, approve a source adapter contract, or provide/configure a credential/API key.
- Batu owns whether Brouwerij facade/frontage/entrance/raster fields stay blocked or receive separate approved reference/source evidence.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu supply or approval of Brouwerij Lane source retrieval material/access.

### 2026-06-04 - Phase 3 Corridor Evidence Deepening Blocker

Status:
- Complete; no non-west target deepened because approved local evidence is insufficient.

Scope:
- Execute one bounded evidence audit to determine whether exactly one mid-corridor or Franklin-side target can be deepened beyond status scaffolding using existing approved/local repo evidence only.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Source/evidence reread: Phase 3 scaffold fixture, linked Phase 3 decision surface, Phase 2AA fixture, Phase 2AB footprint sample, DTR-11 facade specs, MVP scope later-expansion notes, `docs/reference/DATA_FEASIBILITY.md`, MVP-02 place-truth packet, MVP-03 static data contract notes, and decision/ledger history references for Karczma/Brouwerij.
- Phase 3 scaffold JSON parse.
- Phase 3 scaffold loader/status check.
- `npm run build`
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Selected target: none.
- Evidence blocker: no approved local evidence supports deepening a specific non-west Phase 3 corridor target without unsupported claims.
- The currently linked Phase 2AA, Phase 2AB, and DTR-11 artifacts remain scoped to Manhattan Ave / Greenpoint Ave and cannot support a new mid-corridor or Franklin-side business/facade/address/frontage/entrance/geometry/raster-ready target.
- Brouwerij Lane is the closest Franklin-side mention in older local docs, but it is labeled alternate-slice/parked/not ready, with official source not text-readable in the existing pass and manual/Batu reactivation required. It cannot be treated as an approved current Phase 3 target from existing evidence alone.
- Karczma is also deferred and requires boundary approval/manual verification before inclusion.
- Existing west/mid/Franklin status layers, placeholder raster, pan/zoom, QA overlay, source summary, and hover/click/card behavior were preserved.

Unresolved decisions:
- Batu owns the next target choice and source authority.
- Batu must supply or approve a local/static evidence packet for exactly one non-west target before Codex can deepen that target.
- Needed evidence includes target identity/address/context, allowed local source pointer, facade/reference imagery or explicit facade block, storefront/frontage/order and entrance evidence or explicit block, geometry/footprint/context evidence or explicit candidate/block, and an approved corridor raster/reference surface or approval to keep raster readiness blocked while data deepens.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu supply or approval of one non-west corridor target evidence packet.

### 2026-06-04 - Phase 3 Franklin Ave Endpoint Status Layer

Status:
- Complete for Batu review; further Phase 3 implementation remains blocked.

Scope:
- Execute one bounded corridor-status batch by upgrading the Franklin Ave scaffold target from generic blocked endpoint to a review-only status/evidence layer, using only existing approved/local repo evidence and explicit candidate/unknown/blocked records where evidence is insufficient.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic/source reread: Phase 3 scaffold fixture, `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md`, `docs/MVP_SCOPE.md`, and Phase 2AB official-footprint sample.
- Phase 3 scaffold JSON parse.
- Phase 3 scaffold loader/status check.
- `npm run build`.
- Browser smoke for default load, QA overlay, Franklin endpoint card/source-status summary, and preserved hover/click behavior.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Preserved the sourced Manhattan Ave / Greenpoint Ave west anchor and the mid-corridor candidate layer.
- Replaced the generic Franklin Ave blocked card with a status/evidence layer that explicitly labels identity, address, and source evidence as `unknown`; frontage/order, facade, entrance, and raster readiness as `blocked`; and scene-space geometry as candidate scaffold metadata only.
- Added local evidence pointers to the Phase 3 decision surface, MVP scope later-expansion note, Phase 2AA active-target fixture, and Phase 2AB official-footprint sample, with notes that these do not support exact Franklin business/facade/address/entrance/frontage/geometry claims.
- Preserved the placeholder raster as scaffold mechanics only; no live data, scraping, source acquisition, factual Franklin place claims, replacement raster, production assets, public schema/interface, production architecture, or production/public readiness was opened.

Unresolved decisions:
- Batu owns whether the completed corridor status map is sufficient to guide the next Phase 3 decision.
- Batu owns exact Franklin targets, source authority, reference/raster supply, and whether the next bounded batch should deepen one real target only after approved evidence exists, supply an extended corridor raster/reference surface, or compare current gaps against requirements for a real corridor MVP target.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the completed Phase 3 corridor status map.

### 2026-06-04 - Phase 3 Mid-Corridor Candidate Layer

Status:
- Complete for Batu review; further Phase 3 implementation remains blocked.

Scope:
- Execute one bounded corridor-realness batch by upgrading the mid-corridor scaffold target from generic placeholder to a review-only source-candidate/status layer, using only existing approved/local repo evidence and explicit candidate/unknown/blocked records where evidence is insufficient.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/App.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic/source reread: `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md`, Phase 3 scaffold fixture, Phase 2AA real-data fixture, DTR-11 facade extraction specs, MVP manifest, draft-scene fixture, and official-footprint sample.
- Phase 3 scaffold JSON parse.
- `npm run build`.
- Browser smoke for default load, QA overlay, mid-corridor card/source-status summary, and preserved hover/click behavior.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Preserved the sourced Manhattan Ave / Greenpoint Ave west anchor and blocked Franklin Ave anchor.
- Replaced the generic mid-block placeholder card with a source-candidate layer that explicitly labels identity, address, source evidence as `unknown`; frontage/order, facade, entrance, and raster readiness as `blocked`; and scene-space geometry as candidate scaffold metadata only.
- Added local evidence pointers to the Phase 3 decision surface, Phase 2AA active-target fixture, DTR-11 facade extraction specs, and Phase 2AB official-footprint sample, with notes that these do not support exact mid-corridor business/facade/address/entrance/frontage claims.
- Added a compact card/source-summary display for mid-corridor field statuses, candidate records, and local evidence pointers.
- Preserved the placeholder raster as scaffold mechanics only; no live data, scraping, source acquisition, factual mid-corridor place claims, replacement raster, production assets, public schema/interface, production architecture, or production/public readiness was opened.

Unresolved decisions:
- Batu owns whether the mid-corridor candidate layer is useful enough to continue this evidence-first corridor MVP path.
- Batu owns exact target businesses/landmarks, source authority, reference/raster supply, and whether the next bounded batch should add a Franklin-anchor evidence/status layer or wait for approved mid-corridor source/reference material.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the completed mid-corridor candidate-layer outcome.

### 2026-06-04 - Phase 3 West Anchor Realness Pass

Status:
- Complete for Batu review; further Phase 3 implementation remains blocked.

Scope:
- Execute one bounded corridor-realness batch by upgrading the Manhattan Ave / Greenpoint Ave west anchor from generic placeholder to existing sourced/draft MVP context, while preserving review-only status, manifest-driven bounds, QA/debug overlays, and placeholder labels for incomplete visual/data areas.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/App.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc reread: `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md`.
- Phase 3 scaffold JSON parse.
- `npm run build` passed with the existing large-chunk warning.
- Browser smoke passed for default load, Phase 3 corridor review label, canvas presence, QA overlay toggle, west-anchor card, real-place context list, pan/zoom controls, and desktop containment/no horizontal overflow.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Marked the west Manhattan Ave anchor tile as `sourced`, while keeping the mid-corridor tile `unknown` and Franklin Ave tile `blocked`.
- Added existing reviewed MVP context for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and the Greenpoint Av G station-area cue to the west-anchor card.
- Added local source/reference pointers to the existing MVP manifest, Phase 2AA real-data fixture, and DTR-11 facade extraction specs.
- Added a compact card section for existing MVP context plus a source-summary note.
- Preserved the placeholder raster as scaffold mechanics only; no factual corridor art, exact storefront/facade/frontage/order/entrance/window geometry, exact addresses, exact station geometry, public schema/interface, live data, scraping, source acquisition, production asset, or production/public readiness was opened.

Unresolved decisions:
- Batu owns whether the west anchor now feels sufficiently real for the corridor MVP direction.
- Batu owns whether to approve a later mid-corridor source-candidate fixture pass or first supply/approve an extended corridor raster/reference surface.
- Mid-corridor and Franklin Ave remain data/visual placeholders.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the completed west-anchor realness outcome.

### 2026-06-04 - Phase 3 First Scaffold Implementation

Status:
- Complete for Batu review; further Phase 3 implementation remains blocked.

Scope:
- Execute the single next authorized Phase 3 scaffold batch from `docs/CURRENT_EXECUTION_BRIEF.md`: add a review-only scene fixture for the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave slice, define block/tile/layer metadata and manifest-driven pan/zoom bounds, render minimum QA/debug overlay, carry forward minimal safe hover/click/card behavior, and use an approved placeholder raster surface for scaffold mechanics only.

Files changed:
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/mvpPlaceData.js`
- `src/sceneManifest.js`
- `src/PlaceholderWorld.jsx`
- `src/App.jsx`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc reread: `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md`.
- Phase 3 scaffold JSON parse.
- `npm run build` passed with the existing large-chunk warning.
- Browser smoke passed for default load, Phase 3 review label, canvas presence, QA overlay toggle, scaffold layer control, selected card, pan/zoom controls, and desktop containment/no horizontal overflow.
- Mobile viewport resizing was unavailable in the in-app browser surface, so mobile containment remains a verification gap.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a review-only Phase 3 scaffold fixture for the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave slice.
- Loaded the existing approved review-only Phase 6 raster as a placeholder surface for scaffold mechanics only; it is labeled non-production and not factual Greenpoint or visual-quality evidence.
- Added internal scaffold fixture loading for block/tile/layer metadata, manifest-driven pan/zoom bounds, QA warnings, and status-labeled scaffold targets without approving a public schema/interface.
- Rendered a minimum QA/debug scaffold overlay for block, tile, layer, target/status, and warning information.
- Carried forward minimal hover/click/card behavior and added compact status display in cards.
- Preserved no production/public readiness, no production visual assets, no source acquisition, no live data, no scraping, no Google/Street View/3D Tiles extraction, no full 3D, no broad coverage, no major animation/aliveness system, no package/tooling changes, and no broader Phase 3 implementation.

Unresolved decisions:
- Batu owns creative/product acceptance of the first scaffold and whether it proves enough of the hybrid architecture direction.
- Batu owns whether to approve a later implementation batch, request revision, supply or approve an extended raster plate, approve any public interface/schema, approve production architecture, or expand Phase 3 beyond this scaffold.
- Mobile containment should be verified in a resize-capable browser surface before treating the scaffold as mobile-reviewed.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the completed first review-only Phase 3 scaffold outcome.

### 2026-06-04 - Phase 3 First Scaffold Authorization

Status:
- Complete; first scaffold implementation direction authorized.

Scope:
- Update active control docs only enough to mark the Phase 3 architecture-scaling decision surface as reviewed/approved for the first scaffold direction and authorize the smallest review-only Phase 3 scaffold batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc reread: `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md`.
- `git diff --check`
- `git status --short`

Outcome:
- Marked `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md` as reviewed/approved for the first scaffold implementation direction only.
- Set the next authorized task to a review-only Phase 3 scaffold for the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave slice.
- Preserved the hybrid direction: block/tile-scoped manifest, raster-first plates/layers, structured interaction plus QA overlays, and reusable primitives for geometry, hotspots, masks, labels, provenance, and review.
- Preserved review-only status and blocked production/public-readiness changes, live data, scraping, Google/Street View/3D Tiles extraction, full 3D, broad coverage, major animation/aliveness systems, package/tooling changes, production architecture, public interfaces, DTR-12, and facade/raster correction loops.
- Did not touch app/source files.

Unresolved decisions:
- Batu owns exact creative/product acceptance of the first scaffold after implementation.
- Batu owns any later approval to expand Phase 3 beyond the first scaffold, approve public interfaces, approve production architecture, collect/source new reference material, or promote any production/public claims.
- The next implementation batch must confirm whether an extended review-only raster plate exists or whether the approved placeholder surface will be used for scaffold mechanics only.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the first review-only Phase 3 scaffold implementation batch.

### 2026-06-04 - Phase 3 Architecture Scaling Decision Surface

Status:
- Complete for Batu review; implementation remains blocked.

Scope:
- Produce a concise docs-only Phase 3 architecture-scaling decision surface for the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave exploration slice, then reconcile execution-control pointers.

Files changed:
- `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc reread: `docs/MVP_SCOPE.md`, `docs/reference/ARCHITECTURE.md`, `docs/archive/phase-3/PHASE_3_SCALE_TEST_PLAN.md`, and `docs/reference/SCENE_MANIFEST_SCHEMA.md`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md` as a concise planning-only decision surface.
- Recommended, for Batu review only, a hybrid path using block/tile-scoped manifest planning, raster-first scene plates/layers, structured interaction/QA/provenance overlays, and reusable primitives for geometry, hotspots, masks, labels, cards, provenance, and review.
- Documented the minimum decisions needed to open the first scaffold proposal: slice bounds, block/tile/layer partition direction, coordinates/pan/zoom approach, raster placeholder/approved-surface choice, minimum QA/provenance overlay, browser assumptions, 10-block/50-block risks, and the proposed first implementation batch after approval.
- Preserved no Phase 3 implementation, no app/source edits, no new architecture boundary, no public-interface/schema approval, no visual asset generation, no source acquisition, no production/public claims, and no package/tooling changes.

Unresolved decisions:
- Batu owns whether to approve, revise, or reject the recommended hybrid direction.
- Batu owns the exact allowed files, public-interface/schema implications, source/reference lane, visual asset availability, and acceptance criteria for any later Phase 3 implementation batch.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of `docs/archive/phase-3/phase-3-architecture-scaling-decision-surface.md` before any Phase 3 implementation.

### 2026-06-04 - Phase 3 Roadmap Control Reconciliation

Status:
- Complete; current-control text reconciled to Phase 3 opening/planning.

Scope:
- Reconcile only `docs/MVP_EXECUTION_LEDGER.md` with `docs/PLAN.md` and `docs/CURRENT_EXECUTION_BRIEF.md` after the Phase 3 roadmap/current-brief update.

Files changed:
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- `git diff --check`
- `git status --short`

Outcome:
- Marked Phase 2DTR / MVP feedback demo complete and locked for MVP-feedback purposes.
- Marked Phase 3 opening/planning as the current active phase.
- Pointed the next task to Phase 3 scoping/planning for the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave exploration slice and architecture-scaling decision surface.
- Preserved historical ledger entries without rewriting their prior next pointers.
- Did not edit the package README, acceptance audit, app/source files, generated artifacts, package/tooling files, or other docs.

Unresolved decisions:
- Batu owns Phase 3 scope approval, architecture-boundary approval, public-interface approval, target business/landmark selection, source/reference lane decisions, and any later implementation authorization.
- Historical review artifacts may still contain older external-feedback or remote-link wording; they remain historical unless a later reconciliation batch explicitly opens them.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Phase 3 scoping/planning and the architecture-scaling decision surface before any Phase 3 implementation.

### 2026-06-03 - DTR-11 Vercel Preview Publication

Status:
- Complete; review-only Vercel Preview published with protected shareable-link access.

Scope:
- Publish the locked DTR-11 interactive demo to Vercel Preview for review-only external feedback without changing app/source code, raster assets, public interfaces, module boundaries, source policy, package tooling, production/public-readiness gates, Phase 3 scope, DTR scope, or visual direction.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-feedback-demo-package/README.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Confirmed Vercel CLI auth with `vercel whoami`.
- `npm run build`
- `vercel --yes`
- `vercel inspect greenpoint-explorer-m21pixa86-batusayicis-projects.vercel.app`
- `curl` confirmed the base preview URL is protected by Vercel SSO.
- Created a 14-day Vercel shareable-link bypass for the deployment.
- `curl` with preserved shareable-link cookie returned the built app HTML.
- Browser smoke confirmed the shareable preview loads the review prototype text, DTR-11 review-only/non-production label, five target buttons, and canvas presence.

Outcome:
- Published preview deployment:
  - Deployment URL: `https://greenpoint-explorer-m21pixa86-batusayicis-projects.vercel.app`
  - Inspector URL: `https://vercel.com/batusayicis-projects/greenpoint-explorer/AQi3fxF1RNc96wTLP73Naf2NBXAn`
  - Deployment ID: `dpl_AQi3fxF1RNc96wTLP73Naf2NBXAn`
- Preserved Vercel SSO protection on the base preview URL and created a time-bounded shareable-link bypass expiring `2026-06-18T00:30:05Z`.
- Did not commit the shareable bypass token to repo docs.
- Preserved review-only status, no production/public factual release claim, no DTR-12, no new raster work, no source acquisition, no package/tooling changes, and no app/source edits.

Unresolved decisions:
- Batu owns whether to proceed into external feedback sessions with the published preview.
- Batu owns whether the 14-day shareable-link TTL is sufficient or should be refreshed/reissued later.
- Any later revision, storefront outline rebuild, DTR-12, production/public-readiness change, package/tooling change, public-interface change, or Phase 3 work requires a later explicit brief.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to external feedback sessions or Batu acceptance/revision direction using the published review-only Vercel Preview and feedback package.

### 2026-06-03 - Bounded MVP Acceptance Audit

Status:
- Complete; Codex audit recommends proceeding to review-only remote sharing and external feedback once a remote link exists.

Scope:
- Audit the locked DTR-11 interactive MVP demo and feedback package against the current MVP acceptance boundary without changing app/source code, raster assets, public interfaces, module boundaries, source policy, package tooling, production/public-readiness gates, Phase 3 scope, or visual direction.

Files changed:
- `docs/mvp-review/mvp-acceptance-audit-2026-06-03.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, and `docs/MVP_SCOPE.md`.
- JSON parse for scene manifest, feedback package manifest, DTR-8 geometry adapter, DTR-10 QA report, DTR-11 QA report, and DTR-11 facade extraction specs.
- PNG dimension checks for the DTR-11 app raster, feedback hero raster, facade before/after board, and compact pipeline board.
- `npm run build`
- `git diff --check`
- Local browser smoke: default render, Grillpoint selected card, QA toggle/layer warning, and 390 x 844 Greenpoint G selected-card containment.

Outcome:
- Found no local demo/package blocker that should prevent external MVP feedback after a review-only remote link is available.
- Confirmed active scene/place set remains Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Confirmed compact cards, review-only/non-production labels, fixed-view-angle treatment, no normal-mode storefront outline overlay, DTR-11 raster-first primary world art, and feedback package evidence remain aligned with the current brief.
- Recorded non-blocking caveats: full-fidelity deterministic facade reproduction remains unproven, build chunk-size warning is acceptable for review scope, and mobile containment is adequate for review but not phone-first polish.

Unresolved decisions:
- Batu owns final acceptance of the audit recommendation and whether to proceed into external feedback sessions.
- Batu or local environment owner must complete Vercel auth/deploy, provide `VERCEL_TOKEN`, or approve an equivalent review-only remote link.
- Any later revision, storefront outline rebuild, DTR-12, production/public-readiness change, package/tooling change, public-interface change, or Phase 3 work requires a later explicit brief.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Vercel Preview publication or equivalent review-only remote sharing, then external feedback sessions.

### 2026-06-03 - DTR-11 MVP Review Lock Without Storefront Outlines

Status:
- Complete; locked for external review preparation.

Scope:
- Remove the failed hover/selected storefront outline overlay from the MVP demo and lock the review scene without opening another visual polish batch.

Files changed:
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `src/App.jsx`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-feedback-demo-package/README.md`
- `docs/mvp-review/mvp-feedback-demo-package/feedback-script-checklist.md`

Verification:
- Confirmed no annotation/outline overlay references remain in app presentation code.
- `npm run build`
- `git diff --check`
- Browser smoke: DTR-11 raster visible, annotation overlay absent, selected-card state opens through the place rail, no browser console errors.

Outcome:
- Removed the SVG/Pixi storefront outline presentation system from the locked demo.
- Preserved DTR-11 raster-first scene, pan, zoom, hover/click/tap selection behavior, selected rail state, compact truth-safe cards, fixed-view-angle affordance, review-only labeling, and no production/public claims.
- Kept true rotation deferred and avoided DTR-12, new raster work, new data sources, scraping, or another facade/raster correction loop.

Unresolved decisions:
- Batu or local environment owner must complete Vercel auth/deploy, or provide an equivalent approved review-only remote link path.
- External feedback may later determine whether a future art-directed outline system is worth reopening under a new brief, but it is not part of the locked MVP.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Vercel Preview publication, then external feedback sessions or a bounded MVP acceptance audit.

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
- `docs/reference/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/reference/ARCHITECTURE.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Read required governance, roadmap, scope, architecture, current brief, ledger, and signal-log docs before editing.
- Moved the signal log to the `AGENTS.md` pointer path.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Resolved the signal-log path mismatch by moving the log to `docs/reference/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`.
- Added compact strategic roadmap language preserving Greenpoint as the narrow proof slice for future neighborhood-generation logic without opening MVP scope.
- Added local-recognizability acceptance language to `docs/MVP_SCOPE.md`.
- Added a planning-only Editorial / Local Knowledge Layer and visual-consistency risk note to `docs/reference/ARCHITECTURE.md`.
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
- `docs/archive/governance/AGENT_HANDOFF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/archive/phase-2/PHASE_2_PLAN.md`
- `docs/ART_DIRECTION.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/reference/approved-reference-corpus/ASSET_CORPUS_SCAN.md`
- `docs/DECISION_LOG.md`
- `docs/reference/ARCHITECTURE.md`
- `docs/reference/SCENE_MANIFEST_SCHEMA.md`
- `docs/reference/DATA_SOURCES.md`
- `docs/reference/PROVENANCE_AND_QA.md`

Verification:
- `git diff --check`
- Lightweight Markdown link check
- `git status --short`
- `git diff --stat`

Outcome:
- Active planning authority remains concentrated in `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_SCOPE.md`, and the slim active ledger.
- `docs/archive/governance/AGENT_HANDOFF.md` is now a historical stub and no longer authorizes auto-advance.
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
- Convert `docs/archive/phase-2/PHASE_2_PLAN.md` from an active plan into a historical stub and make `docs/PLAN.md` the single active roadmap.

Files changed:
- `docs/archive/phase-2/PHASE_2_PLAN.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/archive/phase-2/PHASE_2_PLAN.md` is now retained only to avoid dangling references.
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
- `docs/archive/phase-2/PHASE_2_PLAN.md`

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
