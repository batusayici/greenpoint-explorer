# MVP Execution Ledger

Status: Active task ledger
Created: 2026-05-29
Last reconciled: 2026-05-30

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

- Current phase: MVP-18 Real Corner Evidence Recovery is complete for Batu review with a `revise` verdict; MVP-17 remains accepted only as the product-facing raster interaction polish baseline, with the missing mobile selected-state containment screenshot recorded as an accepted evidence gap.
- Current next pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next recommended task: `MVP-19 One-Corner Field Photo Supply Gate`, pending Batu approval; MVP-19 is now a reference + repeatability/scalability gate, and MVP-20 Real-Corner Translation Boundary and MVP-21 One-Corner Raster Integration / Visual Pass must follow before QA/demo freeze if the real-corner path continues; no implementation phase is approved.
- Stable roadmap: `docs/PLAN.md`.
- Detailed MVP scope authority: `docs/MVP_SCOPE.md`.
- Legacy tracker: `docs/TASKS.md` is orientation only and must defer to the plan, scope, current brief, and this ledger.

## Entries

### 2026-05-30 - MVP-19 Scalability Assessment Brief Patch

Status:
- Complete.

Scope:
- Patch the proposed MVP-19 brief so the next task requires a repeatability/scalability assessment, not only one-off photo/reference supply.
- Reconcile the roadmap and ledger pointer without opening MVP-19, MVP-20, implementation, visuals, assets, screenshots, scraping, live data, staging, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, and ledger docs read.
- Checked that the brief includes the required scalability categories, evidence rows, 20/100/500 storefront scale readout, and stop conditions.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` keeps `MVP-19 One-Corner Field Photo Supply Gate` as the proposed next task pending Batu approval.
- MVP-19 is now explicitly a reference + scalability gate and cannot complete from photos alone.
- MVP-20 remains blocked until MVP-19 provides both a selected-corner reference packet and the repeatability/scalability readout, then Batu approves the translation boundary.
- No implementation, source, app, asset, visual generation, renderer, screenshot, scraping, live data, staging, commit, or production-claim work was performed.

Unresolved decisions:
- Batu must decide whether to open MVP-19.
- Batu must accept, revise, or reject the MVP-19 reference packet and scalability readout before MVP-20 can open.
- Batu must approve any later real-corner translation boundary before implementation can be considered.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to `MVP-19 One-Corner Field Photo Supply Gate` as a proposed docs/evidence reference + scalability gate pending Batu approval. No implementation task is approved.

### 2026-05-30 - MVP-19/20/21 Real-Corner Translation Sequencing Reconciliation

Status:
- Complete.

Scope:
- Reconcile the roadmap and governance docs so MVP-19 remains a supply/reference gate only.
- Insert MVP-20 Real-Corner Translation Boundary and MVP-21 One-Corner Raster Integration / Visual Pass before MVP QA/demo freeze.
- Keep the batch docs-only with no app/source implementation, visual assets, generated art, renderer work, screenshots, packages, config, backend, scraping, live data, staging, or commit.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/MVP_SCOPE.md`
- `docs/ARCHITECTURE.md`
- `docs/PLACE_SCHEMA.md`
- `docs/PLACE_SOURCE_POLICY.md`

Verification:
- Required governance, roadmap, scope, architecture, place schema, and source policy docs read.
- Grep checks for `MVP QA And Demo Freeze`, `MVP-20`, `MVP-21`, and `MVP-19 One-Corner Field Photo Supply Gate`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/PLAN.md` no longer jumps directly from MVP-19 to MVP QA/demo freeze.
- MVP-20 is documented as the docs-only real-corner translation boundary.
- MVP-21 is documented as the first possible one-corner raster integration / visual pass, still blocked until MVP-20 acceptance and a future current brief.
- `docs/CURRENT_EXECUTION_BRIEF.md` keeps MVP-19 as the proposed next task pending Batu approval and adds a later sequencing note for MVP-20 and MVP-21.
- Supporting governance docs now clarify that field photos/manual observations, MapAnchor/place/storefront linkage, translation boundaries, and raster integration remain distinct gates and do not approve implementation or production claims by themselves.
- No implementation, source, app, asset, package/config, renderer, screenshot, staging, or commit work was performed.

Unresolved decisions:
- Batu must decide whether to open MVP-19.
- Batu must accept, revise, or reject MVP-20 after MVP-19 if the real-corner path continues.
- Batu must decide which real-corner treatment is allowed for each active place: real card, context-only, fictionalized, omitted, blocked, or unresolved.
- Batu must decide whether to open MVP-21 after MVP-20 and which approved/supplied raster material, if any, is allowed.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to `MVP-19 One-Corner Field Photo Supply Gate` as a proposed docs/evidence supply gate pending Batu approval. MVP-20 and MVP-21 are later gates before QA/demo freeze. No implementation task is approved.

### 2026-05-30 - MVP-18 Real Corner Evidence Recovery

Status:
- Complete for Batu review.

Scope:
- Produce a docs-only evidence recovery packet for the active Greenpoint Ave x Manhattan Ave scene/place set.
- Confirm current brief authorization and active source/data place set.
- Use allowed public/open/manual sources and existing repo evidence only.
- Avoid app/source implementation, visuals, generated art, screenshots, new assets, scraping, live data pipelines, Google/Street View/3D Tiles-derived stored imagery or extraction, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, scope, source-policy, schema, data-feasibility, visual-artifact, approved-reference-corpus, prior review, and active app/data files read.
- Manual public-source checks for candidate addresses, BBL/BIN/tax-lot evidence, and business identity/status.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md`.
- MVP-18 verdict is `revise`.
- The packet recommends a compact four-corner evidence boundary around Greenpoint Ave x Manhattan Ave:
  - NW Greenpoint Deli / 903 Manhattan Ave.
  - NE McDonald's / 904 Manhattan Ave within 900/902/904 Manhattan Ave lot/building.
  - SW Dunkin' / 893 Manhattan Ave within 893/895/897 Manhattan Ave lot/building.
  - SE Citizens Bank / 896 Manhattan Ave within 894/896/898 Manhattan Ave lot/building.
  - Greenpoint G subway as symbolic transit context only.
- The packet recommends northwest Greenpoint Deli / 903 Manhattan Ave as the first field-photo target because it best supports local specificity and first-click value, but it is not ready for immediate real-facade art translation.
- Real-corner art translation remains blocked by missing approved owned/non-Google facade references, unresolved storefront/frontage evidence, and pending Batu approval.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-19 One-Corner Field Photo Supply Gate` as the proposed next task only, pending Batu approval.
- No implementation, visuals, screenshots, new assets, scraping, live data pipeline, staging, or commit were performed.

Unresolved decisions:
- Batu must accept, revise, or reject the MVP-18 `revise` verdict.
- Batu must approve, revise, or reject the four-corner evidence boundary.
- Batu must approve northwest Greenpoint Deli / 903 Manhattan Ave as the first field-photo target, choose a fallback, or defer real-corner representation.
- Batu must decide whether to open `MVP-19 One-Corner Field Photo Supply Gate`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-19 One-Corner Field Photo Supply Gate` as a proposed docs/evidence supply gate pending Batu approval. No implementation task is approved.

### 2026-05-30 - MVP-18 Real Corner Evidence Recovery Brief

Status:
- Complete.

Scope:
- Create the next current brief for evidence recovery only.
- Confirm the task is consistent with MVP scope and roadmap because `docs/MVP_SCOPE.md` allows one compact Manhattan Ave / Greenpoint Ave authored diorama, review-only source-of-truth validation packets, storefront evidence cards, and proceed/revise/cut recommendations before real-place usage.
- Keep the batch docs-only with no app/source implementation, visuals, screenshots, new assets, scraping, live data pipeline, renderer work, package/config/tooling changes, staging, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, scope, source-policy, schema, data-feasibility, visual-artifact, plan, current-brief, and ledger docs read.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-18 Real Corner Evidence Recovery` as the approved next Codex task.
- The future MVP-18 task must produce `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md` as a Level 0 text review packet.
- MVP-18 must answer the exact boundary, buildings/lots/storefronts, candidate addresses, business status, BBL/BIN/tax-lot evidence, storefront/frontage evidence, allowed/blocked facade references, recognizable representation plan, fictionalize/generalize/omit/defer plan, first-corner spike recommendation, and proceed/revise/cut verdict.
- MVP-17 remains accepted only as a raster-first interaction prototype baseline and is not accepted as a truthful or recognizable Greenpoint Ave x Manhattan Ave scene.
- No implementation, visuals, screenshots, assets, scraping, live data pipeline, renderer work, staging, or commit were performed.

Unresolved decisions:
- Batu must approve, revise, or reject the future MVP-18 evidence recovery verdict.
- Batu retains final approval over the exact intersection boundary, real-place representation, first-corner visual spike, and any later visual or implementation work.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-18 Real Corner Evidence Recovery` as the approved next docs-only task. No implementation task is approved.

### 2026-05-30 - MVP-17 Reconciliation Commit Scope Authorization

Status:
- Complete.

Scope:
- Authorize a future one-time `MVP-17 Hold-State Reconciliation Commit`.
- Keep the batch docs-only.
- Do not stage, commit, edit source, create screenshots, create or modify assets, run QA recovery, or open a new MVP batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now authorizes one future commit-only reconciliation task.
- The future task may stage and commit only already-existing accepted MVP workstream paths needed to preserve the MVP-17 accepted raster interaction prototype and its historical review/evidence trail.
- The ambiguous paths from the hold-state audit are explicitly resolved:
  - `docs/VISUAL_INTEGRATION_PROTOTYPE_PLANNING_BRIEF.md` is included as historical planning context only if it already exists in the dirty tree at commit time.
  - `docs/mvp-reference-images/` is included as historical/source-reference evidence only, not as approved production assets or facade/art sources.
  - Older `docs/mvp-review/mvp-08-place-evidence-packet-current-scene/` through `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/` folders are included as the documented review trail.
  - Older `docs/review-screenshots/mvp-04-interaction-integration/`, `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/`, and `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/` folders are included as relevant review evidence.
  - Approved-reference-corpus docs are included as part of the visual-governance/reconciliation trail.
  - `docs/VISUAL_ARTIFACT_STANDARDS.md` is included as part of the raster-first/visual-evidence governance trail.
- No implementation, screenshots, asset work, package/config/tooling/CI/deployment changes, staging, or commit were performed in this authorization batch.

Unresolved decisions:
- Batu must explicitly ask Codex to run the future reconciliation commit task before staging or committing.
- After that future commit, the repo remains in the MVP-17 hold state until Batu opens a later implementation, QA, documentation, production asset, public-interface, architecture, deployment, or next-phase brief.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-17 Hold-State Reconciliation Commit` as the only approved next task. No implementation task or new MVP batch is approved.

### 2026-05-30 - MVP-17 Acceptance Recording

Status:
- Complete.

Scope:
- Record Batu acceptance of MVP-17 Product-Facing Raster Interaction Polish.
- Record that Batu accepted the missing mobile selected-state containment screenshot as an evidence gap.
- Reconcile the MVP-17 review packet and control docs.
- Avoid app/source changes, new implementation, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- MVP-17 is recorded as accepted by Batu as the product-facing raster interaction polish baseline.
- The supplied four desktop screenshots remain the recorded visual evidence.
- The missing mobile selected-state containment screenshot is recorded as an accepted evidence gap.
- No app/source files, package/config/tooling files, primary world art, generated assets, staging, or commits were changed by this batch.

Unresolved decisions:
- Batu must open any next MVP QA, demo-freeze, optional ambient, production asset direction, real-place treatment, public-interface, architecture, or next-phase work in a later current brief.
- Production asset direction, production assets, exact real facades, exact addresses, exact station geometry, live data, CI/deployment, and broad map/data work remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now states that no next implementation task is approved and the next task is pending Batu approval or a later brief update.

### 2026-05-30 - MVP-17 Supplied Screenshot Evidence Recording

Status:
- Partial / mobile containment screenshot missing.

Scope:
- Verify supplied MVP-17 screenshot files under `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/`.
- Update the MVP-17 review packet and control docs with screenshot paths and QA notes.
- Avoid app/source changes, new implementation, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed four supplied PNG files exist:
  - `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-default-overview.png`
  - `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-hover-focus-state.png`
  - `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-store-card.png`
  - `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-zoom-view.png`
- Confirmed the required mobile selected-state containment screenshot is not present in the supplied folder.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Recorded desktop overview, hover/focus, selected-card, and pan/zoom screenshot evidence in the MVP-17 review packet.
- Kept MVP-17 out of final ready-for-visual-verdict status because mobile selected-state containment evidence is missing.
- No app/source files, package/config/tooling files, primary world art, generated assets, staging, or commits were changed by this batch.

Unresolved decisions:
- Batu must decide whether to supply the missing mobile containment screenshot or accept visual review from the partial evidence set.
- Batu must decide whether MVP-17 is accepted, revised, or rejected after reviewing the available evidence.
- Any further implementation, optional ambient, production asset direction, real-place treatment, public-interface, architecture, or next-phase decision remains blocked until Batu opens it.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-17 mobile selected-state screenshot evidence completion, or Batu review only if Batu explicitly accepts the partial evidence gap. No new implementation phase is approved.

### 2026-05-29 - MVP-17 Product-Facing Raster Interaction Polish

Status:
- Partial / screenshot QA blocked.

Scope:
- Polish the accepted MVP-16B raster-first prototype so it feels less like an internal review board and more like a product-facing exploratory prototype.
- Preserve the approved raster as the primary world surface.
- Preserve existing pan/zoom, hover/select, target rail, cards, transparent hit regions, marker/tether/outline overlay model, and mobile containment.
- Avoid code-drawn scene art, new generated assets, package/config/tooling changes, staging, and commit.

Files changed:
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`
- `src/styles.css`
- `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Active source scan for prior code-drawn scene renderer names.
- Browser screenshot QA attempted but blocked:
  - local Vite server cannot bind to localhost in the current sandbox (`EPERM` on `127.0.0.1:5173` and `::1:5173`);
  - in-app browser blocks direct `file://` preview of the built app by browser policy.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Reduced the weight of default review chrome, top copy, scene note, target rail, controls, markers, tethers, outlines, and selected card treatment.
- The raster plate remains imported as-is and remains the primary world surface.
- No code-drawn storefronts, buildings, roads, sidewalks, props, textures, or signs were added.
- No new art, replacement raster, package/config/tooling changes, staging, or commit were performed.
- Required screenshot evidence is missing, so MVP-17 is not ready for visual verdict.

Unresolved decisions:
- Batu must review MVP-17 only after required screenshot evidence is captured.
- Batu must decide whether this product-facing polish is accepted, revised, or rejected.
- Any optional ambient, additional polish, production asset direction, real-place treatment, public-interface, architecture, or next-phase decision remains blocked until Batu opens it.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-17 screenshot QA completion only. No new implementation phase is approved.

### 2026-05-29 - MVP-16B Raster-First Prototype Recovery

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Replace the active code-drawn world art with the approved review-only raster plate.
- Preserve the existing interaction shell, cards, target rail, hover/select behavior, pan/zoom behavior, and responsive containment as much as possible.
- Add only transparent hit regions, markers, tethers, selected outlines, and UI overlays.
- Avoid production art claims, broad data/system scaling, package/config/tooling changes, staging, and commit.

Files changed:
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`
- `docs/mvp-review/mvp-16b-raster-first-prototype-recovery/README.md`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-default-overview.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-hover-focus-state.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-selected-card-state.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/mobile-selected-state-containment.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/pan-zoom-stress-view.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Browser render/screenshot QA against the local prototype.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The approved raster plate at `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png` is now the active primary world surface.
- The previous code-drawn perspective street/building/storefront renderer was removed from the active world component.
- Five transparent hit regions are mapped onto the raster and attached to the existing target rail/card flow.
- Markers, tethers, hover outlines, selected outlines, and QA hotspot labels are overlay-only treatments.
- Real business identity remains in structured data, cards, rail labels, source links, and UI copy only.
- No package/config/tooling changes, staging, or commit were performed.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-16B as the raster-first recovery baseline.
- Batu/ChatGPT must decide whether a later brief opens raster-anchor revision, a replacement raster plate, visual polish, optional ambient, or another next phase.
- Production asset direction, production assets, exact real facades, exact addresses, exact station geometry, live data, CI/deployment, and broad map/data work remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to post-MVP-16B review. No next implementation task is approved.

### 2026-05-29 - MVP-16A Raster Plate Selection / Supply Gate

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Evaluate existing approved/review-only raster candidates for MVP-16B.
- Select a raster-first primary world plate or block future implementation with minimum supply requirements.
- Keep the batch docs-only with no app/source edits, no new art generation, no build, no staging, and no commit.

Files changed:
- `docs/mvp-review/mvp-16a-raster-plate-selection-supply-gate/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed candidate raster paths exist on disk.
- Confirmed current-scene source screenshots exist and are blocked as primary world art.
- `git diff --check`
- `git status --short`

Outcome:
- Selected `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png` as the recommended review-only MVP-16B primary world plate.
- Recorded non-selected alternatives: ARC-023, ARC-028, Phase 6 UI-integrated recombination, Phase 5.1 raster scene plate, and current-scene source screenshots.
- MVP-16B remains unrun and unapproved until Batu/ChatGPT accepts the selected plate or supplies/approves a replacement.
- No app/source files were modified by this batch.

Unresolved decisions:
- Batu/ChatGPT must approve or reject the selected Phase 6 street-slice recombination plate.
- Batu/ChatGPT must approve or revise MVP-16B Raster-First Prototype Recovery before implementation.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-16B Raster-First Prototype Recovery as a proposed next task only, pending Batu/ChatGPT approval of the selected raster plate or an approved replacement.

### 2026-05-29 - MVP-15C Visual Failure Freeze And Raster-First Gate

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Freeze MVP-15B as visually rejected product-facing primary world art.
- Copy the supplied MVP-15B browser screenshot as rejected evidence without modifying pixels.
- Patch the primary-world-art loophole so future visual compliance requires raster-first material use, not only reference inspection.
- Prepare MVP-16 Raster-First Prototype Recovery as a proposed next task only.
- Avoid app/source implementation, MVP-16 execution, new generated art, package/config changes, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15c-visual-failure-freeze-raster-first-gate/README.md`
- `docs/mvp-review/mvp-15c-visual-failure-freeze-raster-first-gate/rejected-evidence/mvp-15b-rejected-diagrammatic-perspective.png`
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/mvp-review/mvp-15b-perspective-scene-renderer-replacement/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/approved-reference-corpus/USAGE_RULES.md`

Verification:
- Confirmed supplied MVP-15B screenshot was accessible.
- Copied screenshot verbatim and confirmed matching SHA-256 hash.
- Inspected required governance, corpus, MVP-15A, MVP-15B, and reusable asset rules docs.
- `git diff --check`

Outcome:
- MVP-15B is now recorded as visually rejected as product-facing primary world art.
- MVP-15B remains salvageable only for interaction shell/data/card/target-rail behavior.
- Code-native Pixi/SVG/CSS/DOM/canvas storefronts, buildings, sidewalks, roads, props, textures, or signs are blocked as primary world art for any prototype evaluated against the approved visual direction.
- Future visual compliance now requires material use of an approved raster/reference plate or approved raster sprite/asset-kit composition.
- MVP-16 is proposed only and was not run.
- No app/source files were modified.

Unresolved decisions:
- Batu/ChatGPT must approve or revise MVP-16 Raster-First Prototype Recovery before implementation.
- Batu/ChatGPT must identify or approve the raster plate or raster sprite/asset-kit composition for the next normal-mode primary world surface.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-16 Raster-First Prototype Recovery as a proposed next task only, pending Batu/ChatGPT approval and suitable raster-first primary world material.

### 2026-05-29 - MVP Execution-Control Reconciliation

Status:
- Complete.

Scope:
- Update `docs/PLAN.md` into a stable roadmap through MVP completion and testing.
- Create this MVP execution ledger.
- Replace the stale Phase 6.1 implementation brief with the next recommended MVP task.
- Add mandatory plan/brief/ledger reconciliation rules to `AGENTS.md`.
- Avoid app/source/asset changes, visual artifact generation, staging, and commits.

Files changed:
- `AGENTS.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Documentation search for stale Phase 6.1 active-task pointers.
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/PLAN.md` is now phase-oriented rather than batch-history-oriented.
- `docs/MVP_EXECUTION_LEDGER.md` now records batch outcomes and reconciliation rules.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to a proposed MVP-01 docs-only prototype state review and gap brief instead of stale Phase 6.1 implementation.
- `AGENTS.md` now requires plan/brief/ledger reconciliation after every successful Codex batch.
- `docs/TASKS.md` is converted to legacy orientation so it does not contradict the current brief.

Unresolved decisions:
- Batu/ChatGPT must approve or revise the proposed MVP-01 task before Codex executes it.
- Batu/ChatGPT must review existing Phase 6.1/Phase 6.2 prototype evidence before it can unlock broader MVP implementation.
- Real-place cards, production assets, architecture/public interfaces, and production pipeline remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - MVP Scope And Roadmap Role Reconciliation

Status:
- Complete.

Scope:
- Make `docs/MVP_SCOPE.md` the detailed MVP scope authority.
- Reduce `docs/PLAN.md` scope content to a concise summary and pointer.
- Tighten remaining MVP phase sequencing while preserving the pre-MVP review gate and proposed MVP-01 next task.
- Keep the cleanup docs-only with no app/source/asset edits, visual generation, staging, or commit.

Files changed:
- `AGENTS.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/PLAN.md` now points to `docs/MVP_SCOPE.md` for detailed scope and focuses on roadmap, phase order, gates, blockers, and current state.
- `docs/MVP_SCOPE.md` now defines included scope, non-goals, demo-safe assets/data rules, Must-Have / Should-Have / Cuttable items, and MVP acceptance boundaries.
- At that time, remaining MVP phases were sequenced as MVP Gap Review, Place Truth Packet, Static MVP Data Contract, MVP Interaction Integration, Visual Polish / Optional Ambient, MVP QA And Demo Freeze, and MVP Completion / Post-MVP Parking. This sequencing was later superseded by the MVP-04 review sequence correction.
- Demo/static assets and data are explicitly allowed only as controlled review/demo-safe material, not as production/public-release asset or pipeline approval.
- `docs/CURRENT_EXECUTION_BRIEF.md` remains reconciled and still points to proposed MVP-01.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-01 before Codex executes it.
- Batu/ChatGPT must decide which Should-Have and Cuttable scope items survive after MVP Gap Review.
- Production/public-release assets, production asset pipeline, real-place production cards, public interfaces, architecture, deployment, and broad implementation remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - Archive Phase 5.1 Review-Only App Assets

Status:
- Complete.

Scope:
- Move lingering untracked Phase 5.1 review-only asset files out of `src/assets/review-only/` and into `docs/archive/` for historical preservation.
- Add archive README constraints.
- Avoid app/source code changes, visual generation, staging, and commits.

Files moved:
- `src/assets/review-only/ASSET_MANIFEST.md` to `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/ASSET_MANIFEST.md`
- `src/assets/review-only/phase-5-1-raster-scene-plate-review-only.png` to `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/phase-5-1-raster-scene-plate-review-only.png`

Files changed:
- `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/README.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`
- `find src/assets/review-only -maxdepth 2 -type f 2>/dev/null || true`
- `find docs/archive -path '*phase-5-1-raster-scene-plate*' -maxdepth 5 -type f`

Outcome:
- The two Phase 5.1 review-only files are no longer under `src/assets/review-only/`.
- The files are preserved under `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/`.
- The archive README identifies them as historical review-only assets, not active app assets, production assets, production asset direction, or production asset pipeline approval.
- No app/source code changed.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-01 before Codex executes it.
- Any future active prototype assets still require authorization through `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` remains the current next pointer and still points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - MVP-01 Prototype State Review And Gap Brief

Status:
- Complete.

Scope:
- Review the current repository state and existing review-only prototype evidence.
- Produce a concise docs-only MVP gap brief.
- Reconcile the plan, current brief, ledger, and legacy task tracker.
- Avoid app/source/asset edits, visual generation, staging, and commits.

Files changed:
- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Source and archived screenshot inventory review.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-01 review packet records current prototype evidence, proof limits, missing MVP requirements, blocker classification, stale pointer review, and recommended next batch.
- Current prototype evidence is treated as review-only: one Phase 6 raster, fictional targets, placeholder cards, pan/zoom, hover/click/tap selection, selected card, controls, and basic mobile containment.
- Archived Phase 6.1/6.2 screenshots are treated as review history, not active execution authority.
- Remaining MVP gap is now centered on truth-safe real-place selection, static data boundaries, and later approved MVP interaction integration.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-02 Place Truth Packet.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-02 before Codex executes it.
- Batu/ChatGPT must decide whether the current review-only prototype evidence is sufficient to proceed into place-truth review.
- Real-place representation, static data contract, public interfaces, production assets, architecture, deployment, and MVP completion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-02 Place Truth Packet as a proposed next task pending approval.

### 2026-05-29 - MVP-02 Place Truth Packet

Status:
- Complete.

Scope:
- Produce a docs-only place-truth packet for the compact Manhattan Ave / Greenpoint Ave MVP scene.
- Identify candidate real places, source evidence, spatial coherence risks, copy/disclaimer constraints, and approve/defer/omit/fictionalize recommendations for Batu/ChatGPT review.
- Reconcile the plan, MVP scope, current brief, ledger, and legacy task tracker.
- Avoid app/source/asset edits, visual generation, staging, and commits.

Files changed:
- `docs/mvp-review/mvp-02-place-truth-packet/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Existing repo docs and source-policy evidence reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-02 truth packet records the candidate review set, spatial coherence read, manual-verification requirements, and recommended symbolic/defer/omit/fictionalize treatment for Greenpoint Av G station, Peter Pan, Sweetgreen, former Meserole Theater, Captured Record Shop, Polka Dot, Karczma, and Brouwerij Lane.
- Copy constraints, unofficial-map disclaimer requirements, source metadata requirements, and conceptual static field recommendations are ready for Batu/ChatGPT review.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-03 Static MVP Data Contract.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-02 candidate recommendations.
- Batu must decide which candidates receive manual verification, which are omitted or fictionalized, and whether Karczma requires westward scene expansion.
- Batu/ChatGPT must approve or revise proposed MVP-03 before Codex executes it.
- Real-place representation, static data implementation, public interfaces, production assets, architecture, deployment, and MVP completion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-03 Static MVP Data Contract as a proposed next task pending approval.

### 2026-05-29 - MVP-03 Static MVP Data Contract

Status:
- Complete.

Scope:
- Produce a docs-only static MVP data contract proposal grounded in `docs/PLACE_SCHEMA.md`, `docs/PLACE_SOURCE_POLICY.md`, and the MVP-02 truth packet.
- Define required conceptual fields for real places, symbolic anchors, context buildings, placeholders, omitted/deferred candidates, source references, card data, status vocabulary, and shared disclaimer handling.
- Reconcile the plan, MVP scope, current brief, and ledger.
- Avoid app/source/asset edits, visual generation, staging, and commits.

Files changed:
- `docs/mvp-review/mvp-03-static-mvp-data-contract/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Existing repo docs and source-policy evidence reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-03 static data contract packet defines the docs-only static MVP data shape needed to preserve source metadata, verification status, placement uncertainty, manual-review flags, approval state, candidate outcomes, card constraints, and disclaimer requirements.
- The packet separates `Place`, `Building`, `Storefront`, and `MapAnchor` concepts so future integration does not flatten multi-tenant or uncertain storefront relationships into misleading public claims.
- The packet proposes a future static source-file boundary only as a review item, not as an approved app/source interface or implementation path.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-04 MVP Interaction Integration.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must approve, revise, or reject the MVP-03 contract proposal before implementation.
- Batu/ChatGPT must approve the static MVP place-data implementation boundary and allowed app/source files before MVP-04 can execute.
- Batu must decide which candidates receive cards, symbolic treatment, placeholders, omission, deferral, manual verification, or public copy.
- Public interfaces, production assets, production data contracts, architecture, deployment, and MVP completion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-04 MVP Interaction Integration as a proposed next task pending Batu/ChatGPT approval of the MVP-03 contract proposal and implementation boundary.

### 2026-05-29 - MVP-04 MVP Interaction Integration

Status:
- Complete.

Scope:
- Execute the approved MVP-04 brief by integrating static local MVP data and final MVP interaction behavior into the review-only prototype.
- Use user-provided Manhattan Ave / Greenpoint Ave street-reference imagery as the primary review surface for the busy intersection stress test.
- Preserve fictional-safe, bounded, review/demo-safe treatment; avoid live data, production data contracts, broad map expansion, production assets, staging, and commits.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/review-screenshots/mvp-04-interaction-integration/desktop-default.png`
- `docs/review-screenshots/mvp-04-interaction-integration/desktop-selected-peter-pan.png`
- `docs/review-screenshots/mvp-04-interaction-integration/desktop-qa-hotspots.png`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Browser smoke check at `http://127.0.0.1:5173/`
- Browser click check for selected Peter Pan card.
- Browser control smoke check for zoom in, pan right, and reset.
- Browser QA hotspot screenshot check.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- The prototype now reads from a static local MVP data module with real candidates, symbolic/context treatment, a fictional density placeholder, deferred candidate records, source references, `lastVerified`, status notes, manual-review flags, and shared disclaimer text.
- The app now uses the supplied Manhattan Ave / Greenpoint Ave street-reference raster as the primary review surface for the MVP-04 stress-test scene.
- The place index, selected card, source links, disclaimer behavior, marker states, QA hotspot overlay, pan/zoom controls, and reset control remain functional in the browser smoke check.
- Review screenshots were captured under `docs/review-screenshots/mvp-04-interaction-integration/`.
- No production assets, production data contract, live data, broad map system, package/config/build/CI/deployment changes, staging, or commit were introduced.
- Later Batu/ChatGPT review found this output useful as a technical interaction baseline but not accepted as final visual/source-frame integration.

Unresolved decisions:
- Batu/ChatGPT must approve the MVP-05 Source-Of-Truth Validation Spike boundary.
- MVP-05 must determine which current Manhattan Ave / Greenpoint Ave storefronts/places can be used as real cards, context only, fictionalized, omitted, or blocked.
- The next implementation task after MVP-05 should be a corrective scene translation and data realignment pass, not Visual Polish / Optional Ambient.
- Visual Polish / Optional Ambient remains blocked until validation returns a proceed/revise/cut verdict and corrected scene/data implementation is reviewed.
- Final public-facing place copy, exact geometry, exact facades, exact storefront frontage/order, exact station geometry, production assets, production data contracts, architecture, deployment, and broad map expansion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-05 Source-Of-Truth Validation Spike as a proposed next task pending Batu/ChatGPT approval of the validation-spike boundary.

### 2026-05-29 - MVP-04 Review Sequence Correction

Status:
- Complete.

Scope:
- Update control docs only to reflect Batu/ChatGPT review of MVP-04.
- Record that MVP-04 is useful as a technical interaction baseline but failed final visual/source-frame integration and requires place/data realignment.
- Redirect the next recommended task from Visual Polish / Optional Ambient to MVP-05 Source-Of-Truth Validation Spike.
- Keep app/source/assets, visuals, package/config/build/CI/deployment files, staging, and commits untouched.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-05 Source-Of-Truth Validation Spike as proposed/pending.
- `docs/PLAN.md` now sequences MVP-05 validation before corrective scene translation and data realignment.
- Visual Polish / Optional Ambient is blocked until MVP-05 returns a proceed/revise/cut verdict and the corrected scene/data implementation is reviewed.
- The docs now record that street/reference raster use as the visible world surface is not accepted as final translation into the approved Inked Indie / Compact Corner isometric direction.

Unresolved decisions:
- Batu/ChatGPT must approve or revise the MVP-05 validation-spike boundary before Codex executes it.
- MVP-05 must determine real card, context-only, fictionalized, omitted, or blocked treatment for current Manhattan Ave / Greenpoint Ave storefront/place candidates.
- Batu/ChatGPT must approve a later corrective scene translation and data realignment implementation boundary.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-05 Source-Of-Truth Validation Spike as a proposed next task pending Batu/ChatGPT approval.

### 2026-05-29 - MVP-05 Source-Of-Truth Validation Spike

Status:
- Complete.

Scope:
- Execute the approved MVP-05 docs/data-only validation spike for the current Manhattan Ave / Greenpoint Ave scene boundary.
- Produce one review artifact with 5-10 storefront evidence cards, confidence notes, provenance notes, manual-review flags, and a proceed/revise/cut verdict.
- Reconcile `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, and this ledger.
- Avoid app/source edits, visual asset edits or generation, screenshots, package/config/build/CI/deployment changes, live data, scraping, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-05-source-of-truth-validation-spike/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Existing repo docs and project evidence reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-05 review packet records eight candidate evidence cards: Greenpoint Av G station, Peter Pan Donut & Pastry Shop, Sweetgreen Greenpoint, former Meserole Theater / 723-725 Manhattan Ave, Captured Record Shop, Polka Dot / 726 Manhattan Ave, Karczma, and Brouwerij Lane.
- The packet carries building/tax-lot linkage only where already present in project evidence and marks missing/blocked items explicitly.
- The packet marks current Google Maps / Google Street View-style scene images as blocked visual-reference evidence under the current brief and does not use them for facade claims.
- The packet verdict is `revise`: address/source data is useful, but owned/approved storefront-specific visual references and manual verification are insufficient for confident real-place usage before Visual Polish / Optional Ambient.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records no active Codex execution task and points to Batu/ChatGPT review of MVP-05.
- `docs/MVP_SCOPE.md` was not changed because MVP boundaries did not change.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-05 `revise` verdict.
- Batu/ChatGPT must approve or revise any MVP-06 Corrective Scene Translation And Data Realignment Brief before Codex executes further work.
- Batu must decide candidate treatments, approved non-Google visual references, and any manual public-representation overrides.
- Visual Polish / Optional Ambient remains blocked until MVP-05 is reviewed and any corrective scene/data realignment is approved and reviewed.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now states that there is no active Codex execution task and recommends Batu/ChatGPT review of MVP-05 before any proposed MVP-06 corrective scene/data task.

### 2026-05-29 - MVP-05 Current-Scene Correction

Status:
- Complete.

Scope:
- Correct the MVP-05 review artifact and control docs so they refer to the actual current scene rather than stale previous-scene businesses.
- Replace the stale previous-scene set with Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Treat user-provided LiveXYZ links as identity/presence evidence only, not approved facade/art references.
- Avoid app/source edits, visual asset edits or generation, screenshots, package/config/build/CI/deployment changes, live data, scraping, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-05-source-of-truth-validation-spike/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/MVP_SCOPE.md`

Verification:
- Existing artifact, control docs, MVP scope, and `src/mvpPlaceData.js` inspected.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- Corrected MVP-05 now records five current-scene evidence cards: Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Sweetgreen, Captured, Karczma, Polka Dot, Peter Pan, and former Meserole Theater are explicitly marked as previous-scene/stale references, not current pending-review businesses.
- LiveXYZ links are documented as useful identity/presence evidence only; they were not fetched, scraped, or treated as approved facade/art references.
- The final MVP-05 verdict remains `revise`, now grounded in the corrected current scene.
- `docs/MVP_SCOPE.md` now records the current candidate set and parks the previous-scene candidates outside the current MVP-05 validation set.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the corrected MVP-05 `revise` verdict.
- Batu/ChatGPT must decide current candidate treatments for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Batu/ChatGPT must approve any MVP-06 corrective scene/data implementation boundary, including allowed files and approved non-Google visual references.
- Visual Polish / Optional Ambient remains blocked until corrected MVP-05 is reviewed and any corrective scene/data realignment is approved and reviewed.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still states that there is no active Codex execution task and recommends Batu/ChatGPT review of corrected MVP-05 before any proposed MVP-06 corrective scene/data task.

### 2026-05-29 - MVP-06 Corrective Scene Translation Brief

Status:
- Complete as brief-writing batch.

Scope:
- Create a concise MVP-06 implementation brief after acceptance of the corrected MVP-05 `revise` verdict.
- Authorize only the minimum app/source/data changes needed to align the prototype with the corrected current scene boundary after the brief is accepted.
- Preserve Visual Polish / Optional Ambient as blocked.
- Avoid app/source/assets, screenshots, package/config/tooling/CI/deployment changes, staging, and commit in this brief-writing batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Requested MVP-05, control docs, MVP scope, and source files reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now contains the proposed MVP-06 Corrective Scene Translation And Data Realignment implementation brief.
- The brief limits implementation to `src/mvpPlaceData.js`, `src/App.jsx`, `src/PlaceholderWorld.jsx`, `src/styles.css`, MVP-06 review screenshots, MVP-06 self-audit, and required control-doc reconciliation.
- The brief requires current-scene data/UI for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway, removal of stale previous-scene active data/UI, review screenshots, and a self-audit mapping each visible place/card to MVP-05 evidence status.
- The brief keeps LiveXYZ as identity/presence evidence only and blocks Google/Street View-style imagery as facade evidence.
- `docs/PLAN.md` now points to MVP-06 as the proposed next implementation task and keeps Visual Polish / Optional Ambient blocked behind MVP-06.
- `docs/MVP_SCOPE.md` was not changed because the durable scope boundary already reflected the corrected current-scene set.
- No app/source/assets were modified.
- No visuals or screenshots were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept or revise the proposed MVP-06 implementation brief before Codex executes implementation.
- Batu still owns candidate treatment decisions, branded-chain treatment decisions, public representation, exact geometry, and visual-reference approval.
- Visual Polish / Optional Ambient remains blocked until MVP-06 is implemented, reviewed, and accepted.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-06 Corrective Scene Translation And Data Realignment as the next implementation task pending acceptance.

### 2026-05-29 - Active Scene Confirmation Guardrail

Status:
- Complete.

Scope:
- Add a control-doc guardrail after the MVP-05 scene identity drift correction.
- Require future source validation, scene translation, visual polish, data alignment, and real-place implementation work to confirm the active scene/place set from current app/data files before making decisions.
- Keep the change docs-only with no app/source/assets, screenshots, package/config/tooling/CI/deployment changes, staging, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/MVP_SCOPE.md` now contains the durable Active Scene Confirmation Guardrail and records the current durable active scene/place set: Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- `docs/PLAN.md` now carries a tight roadmap-level pointer to the guardrail.
- `docs/CURRENT_EXECUTION_BRIEF.md` now requires MVP-06 implementation to confirm and list the active app/data scene set before implementation and notes that this brief explicitly authorizes correcting the known stale app/data disagreement.
- Previous-scene entities remain archival/reference-only unless explicitly reactivated.

Unresolved decisions:
- Batu/ChatGPT must still accept or revise the proposed MVP-06 implementation brief before Codex executes implementation.
- Visual Polish / Optional Ambient remains blocked until MVP-06 is implemented, reviewed, and accepted.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to proposed MVP-06 Corrective Scene Translation And Data Realignment as the next implementation task pending acceptance.

### 2026-05-29 - MVP-06 Corrective Scene Translation And Data Realignment

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Replace stale active app/data places with the corrected MVP-05 current scene set.
- Preserve MVP-04 interaction behavior.
- Keep LiveXYZ as identity/presence evidence only.
- Prevent the UI from implying approved facade/art accuracy, exact storefronts, exact addresses, exact station geometry, or production placement.
- Produce MVP-06 review screenshots and a self-audit.
- Reconcile control docs without staging or commit.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/mvp-review/mvp-06-corrective-scene-translation-and-data-realignment/README.md`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/01-overview-corrected-active-scene.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/02-greenpoint-deli-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/03-mcdonalds-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/04-dunkin-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/05-citizens-bank-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/06-greenpoint-g-subway-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/07-qa-hotspots-corrected-set.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/08-mobile-greenpoint-deli-card.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Active-scene confirmation completed. Known stale app/data mismatch was the authorized correction target; no second mismatch was found.
- `npm run build`
- Browser smoke check of corrected target rail.
- Browser selected-card checks for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- QA hotspot outline screenshot.
- Mobile selected-card containment screenshot.
- Source scan confirmed stale previous-scene business names are absent from active app data/UI files.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- Active prototype now displays Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Peter Pan Donut & Pastry Shop, Sweetgreen Greenpoint, Former Meserole Theater Context, Captured Record Shop, Polka Dot, Karczma, Brouwerij Lane, and Corner Infill Placeholder were removed from active current-scene target/card/source data.
- Visible cards distinguish identity/presence evidence from facade/art-reference insufficiency.
- The existing raster is dimmed at runtime and labeled scaffold-only; no visual assets were modified or generated.
- MVP-04 interaction behavior remains intact.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-06 review state with no active Codex implementation task.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-06 output.
- Candidate treatment decisions remain reserved for Batu/ChatGPT, including whether any current business becomes a real card, context-only card, fictionalized card, omitted item, or blocked item.
- Approved non-Google storefront-specific visual references are still missing.
- Visual Polish / Optional Ambient remains blocked until MVP-06 is reviewed and accepted and a later brief opens that scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-06 output. No next implementation task is approved.

### 2026-05-29 - MVP-07 Reusable Place Evidence Pipeline Spike

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a concise docs-only MVP-07 review artifact proposing a reusable source/evidence pipeline for Greenpoint addresses, businesses, interactive scene data, and approved art-reference inputs.
- Test the pipeline against the current active scene: Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source/assets, screenshots, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-07-reusable-place-evidence-pipeline/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs and `src/mvpPlaceData.js` reviewed.
- Active scene confirmed from `src/mvpPlaceData.js`.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-07 proposes a recommended source hierarchy, evidence status taxonomy, conceptual place record schema, facade/art-reference eligibility rules, manual vs automated steps, scaling risks, and recommended next task.
- The current scene pipeline test classifies all five active places as still requiring revision before real-inspired facade/art treatment or Visual Polish / Optional Ambient.
- The final verdict is `revise`: the workflow is viable as a repeatable review pipeline, but the current scene still lacks approved address/parcel/storefront and facade/art-reference evidence.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-07 review state and proposes MVP-08 Place Evidence Packet For Current Scene as the next docs-only task pending approval.
- `docs/MVP_SCOPE.md` was not changed because MVP-07 is a review proposal, not yet a durable approved scope rule.
- No app/source/assets were modified.
- No screenshots or visuals were created.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-07 pipeline and `revise` verdict.
- Batu/ChatGPT must decide whether to authorize MVP-08 Place Evidence Packet For Current Scene.
- Batu must decide treatment for each current place, including real card, context-only, fictional-safe, omitted, or blocked.
- Approved non-Google storefront-specific visual references remain missing.
- Visual Polish / Optional Ambient remains blocked until place-evidence review is accepted and a later brief opens that scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-07 and a proposed MVP-08 docs-only current-scene evidence packet. No implementation task is approved.

### 2026-05-29 - MVP-08 Place Evidence Packet For Current Scene

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a docs-only evidence packet for the current active scene.
- Classify Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway using the MVP-07 taxonomy.
- Determine eligibility for real-inspired art translation, generic placeholder, fictional-safe treatment, or blocked status.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source/assets, screenshots, live scraping, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-08-place-evidence-packet-current-scene/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs and `src/mvpPlaceData.js` reviewed.
- Active scene confirmed from `src/mvpPlaceData.js`.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-08 records one evidence packet per current active place.
- Greenpoint Deli, McDonald's, Dunkin', and Citizens Bank are identity/presence candidates only; address, parcel/building, storefront/frontage, and approved facade/art-reference evidence remain missing.
- Greenpoint G subway is supported as symbolic transit context only; exact access-point and station geometry remain unresolved.
- Final verdict is `revise`.
- No current business is eligible for real-inspired art translation yet.
- Greenpoint G subway is eligible only for symbolic transit cue treatment, not exact real-inspired station geometry.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-08 review state and proposes MVP-09 Current Scene Treatment Decision Brief as the next docs-only task pending approval.
- `docs/MVP_SCOPE.md` was not changed because MVP-08 did not add or correct a durable scope rule.
- No app/source/assets were modified.
- No screenshots or visuals were created.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-08 evidence packet and `revise` verdict.
- Batu/ChatGPT must decide whether to authorize MVP-09 Current Scene Treatment Decision Brief.
- Batu must choose whether the current scene pursues evidence acquisition, fictional-safe translation, or cut/omit treatment before art translation or polish.
- Approved non-Google storefront-specific visual references remain missing.
- Visual Polish / Optional Ambient remains blocked until treatment decisions are accepted and a later brief opens that scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-08 and a proposed MVP-09 docs-only treatment decision brief. No implementation task is approved.

### 2026-05-29 - MVP-09 Current Scene Treatment Decision Brief

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a docs-only treatment decision brief for the current active scene.
- Evaluate evidence acquisition first, fictional-safe/generic translation now, cut/omit real businesses, and mixed treatment.
- Choose the fastest honest path toward an interactable Greenpoint Ave / Manhattan Ave scene while preserving truth-safety.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source/assets, screenshots, exact real-inspired facade authorization, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-09-current-scene-treatment-decision/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs and `src/mvpPlaceData.js` reviewed.
- Active scene confirmed from `src/mvpPlaceData.js`.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-09 chooses mixed treatment with verdict `proceed`.
- The chosen path preserves current business identity/cards as identity/presence-only review data.
- Business visuals should use fictional-safe or generic storefront treatments.
- Greenpoint G subway should use symbolic transit cue treatment only.
- Exact real-inspired facade art, exact station geometry, Google/Street View-style facade evidence, and LiveXYZ-derived facade/art use remain blocked.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-09 review state and proposes MVP-10 Fictional-Safe Current Scene Art Translation Brief / Implementation Boundary as the next task pending approval.
- `docs/MVP_SCOPE.md` was not changed because MVP-09 did not add or correct a durable scope rule.
- No app/source/assets were modified.
- No screenshots or visuals were created.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-09 mixed treatment path and `proceed` verdict.
- Batu/ChatGPT must decide whether to authorize MVP-10 Fictional-Safe Current Scene Art Translation Brief / Implementation Boundary.
- Batu must decide whether MVP-10 opens implementation or remains a boundary-only brief.
- Exact real-inspired facade and station-geometry upgrades remain blocked until approved evidence exists.
- Visual Polish / Optional Ambient remains blocked until fictional-safe translation is reviewed and a later brief opens polish scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-09 and a proposed MVP-10 fictional-safe current scene art translation brief / implementation boundary. No implementation task is approved.

### 2026-05-29 - MVP-10 Fictional-Safe Current Scene Art Translation Brief

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a docs-only implementation boundary brief translating MVP-09 mixed treatment into a precise MVP-11 boundary.
- Define what MVP-11 may implement, what remains blocked, eligible scene elements, symbolic subway constraints, data/card copy constraints, acceptance criteria, stop conditions, and recommended next task.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source files, visual assets, screenshots, package/config files, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-10-fictional-safe-current-scene-art-translation-brief/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-10 defines the chosen MVP-09 mixed-treatment boundary for the next implementation pass.
- The proposed MVP-11 pass may keep the five current targets, preserve existing interaction behavior, use fictional-safe/generic visuals for the four businesses, use symbolic subway cue treatment only, and preserve truth-safety constraints.
- Exact real-inspired facades, exact station geometry, blocked source use, new visual assets, screenshots, and app/source changes remain unperformed in this MVP-10 docs-only batch.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-10 review state and proposes MVP-11 Current Scene Fictional-Safe Translation Pass as the next task pending explicit approval.
- `docs/MVP_SCOPE.md` was not changed because MVP-10 did not add or correct a durable scope rule.
- No app/source/assets/screenshots/package/config files were modified.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-10 implementation boundary.
- Batu/ChatGPT must explicitly open MVP-11 before implementation.
- Batu must decide whether the proposed MVP-11 file scope and acceptance criteria are sufficient.
- Visual Polish / Optional Ambient remains blocked until fictional-safe translation is reviewed and a later brief opens polish scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-10 and a proposed MVP-11 Current Scene Fictional-Safe Translation Pass. No implementation task is approved.

### 2026-05-29 - MVP-11 Current Scene Fictional-Safe Translation Pass

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Implement the MVP-10 fictional-safe translation boundary in the current review-only prototype.
- Add 3-5 fictional-safe storefront/building treatments and one symbolic subway cue using the current in-code art system.
- Preserve existing hover, select, card, pan/zoom, target rail, QA hotspot, and responsive behavior.
- Produce a self-audit and reconcile control docs.
- Avoid exact real-inspired facades, exact subway geometry, blocked source imagery, scraping, new real-place evidence, image generation, production asset pipeline, package/config changes, staging, and commit.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `docs/mvp-review/mvp-11-current-scene-fictional-safe-translation-pass/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- `git diff --check`
- Browser/screenshot attempt blocked by environment: Vite server listening failed with `EPERM` on `127.0.0.1`, `::1`, and `0.0.0.0`; in-app browser `file://` preview was blocked by browser policy.

Outcome:
- Active scene remains Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Added code-native fictional-safe treatment metadata for current targets.
- Added a Pixi-drawn fictional-safe scene layer beneath existing markers.
- Four business targets now have generic category visual cues: deli/corner-store, quick-service, coffee/quick-service, and service/bank.
- Greenpoint G subway now has a symbolic G transit cue only.
- Card/source constraints remain identity/presence-only and facade/art-insufficient.
- Existing app interaction paths were preserved in source and build verification passed.
- No screenshots were created because local browser verification was blocked in this environment.
- No package/config files were modified.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-11 fictional-safe translation.
- Screenshot/QA review should be retried in an environment where the local app can open before any visual polish decision.
- Exact real-inspired facade and station-geometry upgrades remain blocked until approved evidence exists.
- Visual Polish / Optional Ambient remains blocked until fictional-safe translation is reviewed and a later brief opens polish scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-11 and recommends screenshot/QA recovery review. No next implementation task is approved.

### 2026-05-29 - MVP-12 Screenshot / Visual QA Recovery Review

Status:
- Blocked for browser QA.

Scope:
- Attempt to recover browser-based visual QA for MVP-11.
- Try to render the local prototype and capture the required review screenshots.
- Avoid new art direction, additional storefronts, visual polish, image generation, exact real-inspired facades, exact subway geometry, data acquisition/scraping, package/config changes, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-12-screenshot-visual-qa-recovery-review/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- `git diff --check`
- Attempted `npm run dev -- --port 5173`
- Attempted in-app browser `data:` preview probe
- Attempted elevated local server execution

Outcome:
- Build and diff checks passed.
- Local Vite server startup failed with `listen EPERM` on `127.0.0.1:5173`.
- Browser `data:` preview was blocked by Browser URL policy.
- Elevated local server execution was rejected by the session approval policy.
- No screenshots were captured.
- No app/source/assets/package/config files were modified during MVP-12.
- Visual QA verdict is `revise`, meaning browser QA remains unresolved rather than MVP-11 being visually rejected.
- Visual Polish / Optional Ambient remains blocked.

Unresolved decisions:
- Batu/ChatGPT must decide whether to retry browser QA in another environment or provide an approved preview URL.
- Batu/ChatGPT should not accept MVP-11 visually until screenshots/interaction QA can be reviewed, unless they explicitly accept the limitation.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to environment resolution for screenshot/interaction QA. No next implementation task is approved.

### 2026-05-29 - MVP-13 Four-Corner Scene Structure Repair

Status:
- Implemented in source; screenshot QA blocked.

Scope:
- Repair the failed MVP-11 single-screenshot/overlay approach.
- Replace the current scene with a simplified four-corner intersection structure.
- Anchor Greenpoint Deli to NW, McDonald's to NE, Dunkin' to SW, and Citizens Bank to SE.
- Preserve Greenpoint G subway as a symbolic intersection/transit cue only.
- Preserve existing hover, select, card, target rail, QA outline, pan/zoom, and responsive behavior.
- Avoid exact real-inspired facades, exact subway geometry, scraped/blocked imagery, image generation, broad visual polish, data pipeline work, package/config changes, staging, and commit.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `docs/mvp-review/mvp-13-four-corner-scene-structure-repair/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed the four supplied corner reference screenshots exist in `docs/mvp-reference-images/`.
- `npm run build`
- `npm run dev -- --port 5173` attempted for screenshot QA and failed with `listen EPERM` on `127.0.0.1:5173`.
- `git diff --check`

Outcome:
- The active scene no longer imports or renders one corner screenshot as the primary scene surface.
- The scene now renders a code-native four-corner review composition with integrated storefront/building zones.
- Greenpoint Deli is anchored to NW, McDonald's to NE, Dunkin' to SW, and Citizens Bank to SE.
- In-scene storefront text is generic category language: `DELI`, `BITES`, `COFFEE`, and `SERVICE`.
- Real business identity remains limited to labels, cards, target rail, and source metadata.
- Greenpoint G subway remains a generic symbolic transit cue, not exact station geometry.
- Build verification passed.
- Diff whitespace verification passed.
- No screenshots were captured because the local server/browser environment is still blocked.
- No package/config files were modified.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-13 after visual screenshots are available.
- Screenshot/browser QA should be retried in an environment where the local app can bind to localhost, or via an approved preview URL.
- Visual Polish / Optional Ambient remains blocked until MVP-13 is visually reviewed.
- Exact real-inspired facade and station-geometry upgrades remain blocked until approved evidence exists.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-14 Four-Corner Browser Screenshot QA as the recommended next step, pending Batu/ChatGPT review and environment resolution. No next implementation task is approved.

### 2026-05-29 - MVP-15 Perspective Scene Translation Repair

Status:
- Implemented in source; browser QA blocked.

Scope:
- Repair the MVP-13 flat diagram / board-game visual failure.
- Preserve four-corner logic while shifting the scene toward a stylized perspective street composition.
- Use four supplied corner screenshots only for broad corner identity, massing, street orientation, and urban-feel reference.
- Preserve Greenpoint Deli to NW, McDonald's to NE, Dunkin' to SW, and Citizens Bank to SE.
- Preserve Greenpoint G subway as a symbolic street-scene cue only.
- Preserve existing hover, select, card, target rail, QA outline, pan/zoom, and responsive behavior.
- Avoid exact real-inspired facades, exact subway geometry, scraped/blocked imagery, image generation, broad visual polish, data pipeline work, package/config changes, staging, and commit.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `docs/mvp-review/mvp-15-perspective-scene-translation-repair/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed the four supplied corner reference screenshots exist in `docs/mvp-reference-images/`.
- Visually reviewed the four supplied corner reference screenshots for broad orientation/massing only.
- `npm run build`
- `npm run dev -- --port 5173` attempted for browser QA and failed with `listen EPERM` on `127.0.0.1:5173`.
- `git diff --check`

Outcome:
- The scene remains code-native and does not import/render the four screenshots as scene surfaces.
- The MVP-13 top-down/schematic intersection was replaced with receding road geometry, perspective sidewalks, crosswalk rhythm, background massing, and foreground/back-corner scale differences.
- The four business corners now use distinct scene-native building/storefront treatments rather than one repeated rectangular window/awning template.
- Greenpoint Deli is anchored to NW, McDonald's to NE, Dunkin' to SW, and Citizens Bank to SE.
- In-scene storefront text remains generic category language: `DELI`, `BITES`, `COFFEE`, and `SERVICE`.
- Real business identity remains limited to labels, cards, target rail, and source metadata.
- Greenpoint G subway remains a generic symbolic transit cue, not exact station geometry.
- Build verification passed.
- Diff whitespace verification passed.
- Browser QA is `qa-blocked` because the local server/browser environment is still blocked.
- No package/config files were modified.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15 after visual screenshots are available.
- Browser QA should be retried in an environment where the local app can bind to localhost, or via an approved preview URL.
- Visual Polish / Optional Ambient remains blocked until MVP-15 is visually reviewed.
- Exact real-inspired facade and station-geometry upgrades remain blocked until approved evidence exists.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-16 Perspective Scene Browser QA as the recommended next step, pending Batu/ChatGPT review and environment resolution. No next implementation task is approved.

### 2026-05-29 - MVP-15A Visual Acceptance Contract / Failure Guardrails

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a docs-only mandatory visual contract before the next implementation pass.
- Diagnose MVP-11 screenshot-overlay failure and MVP-13 top-down board-game/storefront-tile failure.
- Define banned visual patterns, required visual patterns, pre-code visual extraction requirements, renderer separation, QA screenshot rules, and next recommended task.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source files, visual assets, scraping, image generation, browser screenshots, package/config files, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required review docs read.
- Checked for local MVP-13 rejected screenshots.
- Confirmed the four source corner screenshots exist in `docs/mvp-reference-images/`.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-15A explicitly blocks top-down maps, board-game/grid diagrams, floating storefront tiles, repeated rectangle/window/awning templates, label-led category reads, UI-card buildings, overlay-layer storefronts, collapsed screenshot references, and screenshot backgrounds.
- MVP-15A requires oblique/isometric street-scene language, volumetric buildings, embedded storefronts, distinct corner massing, road/sidewalk/crosswalk/curb perspective, symbolic scene-native subway cue, and the correct NW/NE/SW/SE assignments.
- MVP-15A requires corner-by-corner visual extraction from the four source screenshots before any next implementation pass.
- MVP-15A requires browser screenshots before any visual verdict.
- Rejected MVP-13 browser screenshots were not found in the repository; the contract records the user-supplied rejected evidence description instead.
- No app/source files changed.
- No visuals, assets, screenshots, package/config files, staging, or commits were introduced.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-15A visual contract.
- Batu/ChatGPT must decide whether to approve MVP-15B Perspective Scene Renderer Replacement.
- Batu/ChatGPT must decide whether any pre-existing MVP-15 source changes are retained, revised, superseded, or reviewed against MVP-15A.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-15B Perspective Scene Renderer Replacement as the recommended next task, pending Batu/ChatGPT approval in a later current brief. No next implementation task is approved.

### 2026-05-29 - MVP-15 Perspective Repair Control Reconciliation

Status:
- Complete.

Scope:
- Reconcile control docs after the MVP-15 source implementation while preserving the MVP-15A guardrail artifact as supporting review context.
- Keep Visual Polish / Optional Ambient blocked.
- Avoid further app/source, package/config, visual asset, screenshot, staging, or commit work.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-15 source state.
- MVP-15 source status is `pending visual QA`.
- Browser QA status remains `qa-blocked`.
- MVP-15A remains documented as supporting guardrails, not as a visual acceptance decision for MVP-15.
- No next implementation task is approved.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15 after browser screenshots are available.
- Batu/ChatGPT must decide whether MVP-15A should become a mandatory checklist for future visual implementation passes.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-16 Perspective Scene Browser QA as the recommended next task in a browser-capable environment. No next implementation task is approved.

### 2026-05-29 - MVP-15A Approved Corpus Compliance Gate Patch

Status:
- Complete.

Scope:
- Patch MVP-15A so future visual implementation cannot pass merely by avoiding prior failure modes.
- Add mandatory approved-reference-corpus citation and inspection requirements before code changes.
- Add rejected screenshot evidence handling.
- Reconcile the current brief, plan, and ledger without modifying app/source files.
- Avoid new art, assets, scraping, image generation, package/config changes, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs reviewed.
- Checked the MVP-15A folder for local rejected screenshots.
- Checked repository image paths for rejected MVP-13 evidence.
- `git diff --check`

Outcome:
- MVP-15A now requires future visual implementation passes to cite exact ARC IDs and paths before code changes.
- MVP-15A now requires ARC-023, ARC-028, ARC-016 or ARC-026, ARC-024, ARC-029, ARC-015, and ARC-031 to be inspected for the appropriate scene, storefront, UI, and cautionary roles.
- MVP-15A now requires a pre-code visual target table with reference used, visible traits to preserve, implementation implication, and risks/drift to avoid.
- MVP-15A now requires explicit comparison against ARC-015 and ARC-031 cautionary references.
- MVP-15A now states build success is not visual acceptance and keeps source implementation status separate from visual QA status.
- Rejected MVP-13 screenshots remain missing evidence; MVP-15A recommends adding them under `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/`.
- No app/source files changed.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15 after browser screenshots are available.
- Batu/ChatGPT must decide how the MVP-15A corpus gate should be applied to any review or revision of pre-existing MVP-15 source work.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to MVP-16 Perspective Scene Browser QA as the recommended next task in a browser-capable environment. No next implementation task is approved.

### 2026-05-29 - MVP-15B Perspective Scene Renderer Replacement

Status:
- Complete pending browser visual QA.

Scope:
- Complete the MVP-15A Approved Corpus Compliance Gate before source edits.
- Inspect required approved corpus references, rejected MVP-11/MVP-13 evidence, and four source corner screenshots.
- Create the MVP-15B pre-code packet.
- Replace the current diagrammatic scene renderer with a scene-native perspective renderer.
- Preserve cards, target rail, hover/select behavior, QA outlines, pan/zoom paths, and truth-safety copy.
- Avoid package/config changes, image generation, production asset pipeline, real-place data acquisition, deployment, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15b-perspective-scene-renderer-replacement/README.md`
- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Completed MVP-15A compliance gate before app/source edits.
- Confirmed required approved corpus references were inspectable.
- Confirmed rejected MVP-11/MVP-13 evidence screenshots were inspectable.
- Confirmed four source corner screenshots in `docs/mvp-reference-images/` were inspectable.
- `npm run build`
- `git diff --check`

Outcome:
- MVP-15B README records the compliance table, rejected evidence table, four-corner source extraction, and renderer plan.
- Active scene source now identifies MVP-15B as the perspective scene renderer replacement.
- Renderer uses oblique road/sidewalk/crosswalk geometry, four distinct corner building masses, embedded storefronts, roof/parapet cues, side planes, facade texture, props, smaller secondary signs, and a symbolic scene-native G subway cue.
- Existing interaction/card behavior and truth-safety copy were preserved.
- Browser screenshots were not captured because local rendering is blocked.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15B after browser screenshots are available.
- No visual verdict is assigned without screenshots.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records MVP-15B source status as `complete pending visual QA` and recommends browser screenshot capture plus interaction smoke QA in a browser-capable environment, pending Batu/ChatGPT approval.

### 2026-05-29 - MVP-15A.1 Approved Corpus Path Reconciliation

Status:
- Complete.

Scope:
- Fix approved reference corpus path integrity so the MVP-15A visual compliance gate can inspect required references.
- Locate current filesystem paths for required ARC references.
- Update approved corpus docs to point at existing archived paths.
- Clarify that archived storage does not reduce canonical status.
- Update MVP-15A to cite current manifest paths rather than hardcoded stale paths.
- Reconcile control docs.
- Avoid app/source files, image duplication, package/config changes, app build, staging, and commit.

Files changed:
- `docs/approved-reference-corpus/MANIFEST.md`
- `docs/approved-reference-corpus/README.md`
- `docs/approved-reference-corpus/REFERENCE_INDEX.md`
- `docs/approved-reference-corpus/USAGE_RULES.md`
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Located required ARC files under `docs/archive/visual-artifacts/`.
- Visually inspected required raster references for ARC-023, ARC-028, ARC-016, ARC-026, ARC-024, ARC-029, and ARC-015.
- Confirmed ARC-031 SVG cautionary artifacts are readable.
- Confirmed every manifest ARC path now resolves on disk, including the ARC-031 wildcard.
- `git diff --check`

Outcome:
- Required MVP-15A ARC references now point to inspectable archived paths in `docs/approved-reference-corpus/MANIFEST.md`.
- `README.md`, `REFERENCE_INDEX.md`, and `USAGE_RULES.md` now state that archive storage can be canonical preservation and future visual gates must use current manifest paths.
- MVP-15A now requires current manifest paths rather than hardcoded old `docs/visual-artifacts/` paths.
- No image files were duplicated or copied.
- No app/source files changed.
- App build was not run because source files did not change.
- MVP-15B is unblocked at the approved-corpus path level, but it must still complete the full MVP-15A gate before source edits.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the next MVP-15B implementation output after browser screenshots are available.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-15B Perspective Scene Renderer Replacement as the recommended next task. The MVP-15A gate remains mandatory before source edits.

### 2026-05-29 - MVP-15A Rejected Screenshot Evidence Reconciliation

Status:
- Complete.

Scope:
- Confirm rejected screenshot evidence now exists under the MVP-15A packet.
- Update MVP-15A so rejected screenshots are no longer marked as missing evidence.
- Record each screenshot path and the failure modes it documents.
- Reconcile control docs only as needed.
- Avoid app/source files, package/config changes, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed rejected evidence files in `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/`.
- Visually inspected the rejected evidence screenshots.
- `git diff --check`

Outcome:
- MVP-15A now lists `mvp-11-rejected-overlays.png` as evidence of screenshot-background composition with floating SVG-like storefront overlays.
- MVP-15A now lists `mvp-13-rejected-flat-storefronts.png` and `mvp-13-rejected-selected-card-flat-storefronts.png` as evidence of top-down board-game/grid intersection, flat generic storefront modules, label-driven category tiles, insufficient scene-native perspective, and correct quadrant anchoring with failed art direction.
- The Approved Corpus Compliance Gate remains intact.
- No app/source files changed.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15 after browser screenshots are available.
- Batu/ChatGPT must decide how the MVP-15A corpus gate and rejected screenshot anti-references should be applied to any review or revision of pre-existing MVP-15 source work.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to MVP-16 Perspective Scene Browser QA as the recommended next task in a browser-capable environment. No next implementation task is approved.
