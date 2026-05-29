# MVP Execution Ledger

Status: Active task ledger
Created: 2026-05-29
Last reconciled: 2026-05-29

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

- Current phase: MVP-06 Corrective Scene Translation And Data Realignment brief prepared; pending Batu/ChatGPT acceptance before implementation.
- Current next pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next recommended task: accept or revise the proposed MVP-06 implementation brief in `docs/CURRENT_EXECUTION_BRIEF.md`.
- Stable roadmap: `docs/PLAN.md`.
- Detailed MVP scope authority: `docs/MVP_SCOPE.md`.
- Legacy tracker: `docs/TASKS.md` is orientation only and must defer to the plan, scope, current brief, and this ledger.

## Entries

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
