# MVP Execution Ledger

Status: Active task ledger
Created: 2026-05-29
Last reconciled: 2026-06-04

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

- Current phase: Phase 3 west-anchor spatial grounding review for the exploration slice from Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave.
- Current next pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next state: `docs/CURRENT_EXECUTION_BRIEF.md` records Phase 2DTR / MVP feedback demo as complete and locked for MVP-feedback purposes, the review-only Vercel Preview as deployed behind protected shareable-link access, `docs/phase-3-architecture-scaling-decision-surface.md` as reviewed/approved for the first Phase 3 scaffold direction only, the first review-only Phase 3 scaffold batch as complete, the west-anchor realness pass as complete, the mid-corridor candidate-layer pass as complete, the Franklin Ave endpoint status-layer pass as complete, the one-target evidence-deepening audit as complete, the Brouwerij Lane source-retrieval spike as complete, the Phase 3 POI/business source ADR as complete, the local-directory ADR amendment as complete, the Foursquare Brouwerij adapter contract as complete, the Foursquare credential/source blocker report as complete, the source-independent west-anchor QA/evidence overlay pass as structurally complete, and the west-anchor spatial grounding pass as complete pending Batu review. The completed grounding pass adds a review-only overlay with approximate Manhattan Ave / Greenpoint Ave street relationship, corner orientation, contextual building massing, active storefront cue placement, DTR-11 facade cues, and symbolic/blocked subway context. No further implementation task is authorized until Batu accepts, redirects, or replaces the next-task pointer. Foursquare is optional future enrichment only and remains blocked by missing credential and repo-recorded terms/cache/display approval. Brouwerij Lane and all other non-west target deepening remain blocked until deterministic source access/material or approved manual evidence exists and a later brief authorizes the one-target packet. Broad API integration, scraping, generalized ingestion, production/public claims, DTR-12, facade/raster correction loops beyond the completed spatial grounding pass, storefront outline rebuilds outside the west-anchor grounding scope, package/tooling changes, backend/CMS/persistence/analytics, broad coverage, full MVP-29G screenshot QA, and MVP-30 QA/demo freeze remain blocked unless a later brief explicitly opens them.
- Stable roadmap: `docs/PLAN.md`.
- Detailed MVP scope authority: `docs/MVP_SCOPE.md`.
- Legacy tracker: `docs/TASKS.md` is orientation only and must defer to the plan, scope, current brief, and this ledger.

## Entries

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
- `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
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
- `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required doc/source reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/DATA_SOURCES.md`, `docs/PROVENANCE_AND_QA.md`, `docs/SCENE_MANIFEST_SCHEMA.md`, `docs/DECISION_LOG.md`, and `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- External docs review only for source-policy orientation; no live APIs called and no scraping performed.
- Markdown/lint command search: no dedicated docs lint or markdown lint script is available in `package.json`.
- `npm run build` not run; docs are not imported into app behavior.
- `git diff --check`
- `git status --short`

Outcome:
- Added the Phase 3 POI/business source ADR under `docs/decisions/`.
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
- Source/path review: Phase 3 scaffold fixture, `docs/DATA_SOURCES.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/MVP_SCOPE.md`, `docs/DATA_FEASIBILITY.md`, MVP-02 place-truth packet, MVP-05 source-of-truth validation spike, source-evidence scripts, checked-in source-evidence fixtures, and local environment source/credential variable names.
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
- Source/evidence reread: Phase 3 scaffold fixture, linked Phase 3 decision surface, Phase 2AA fixture, Phase 2AB footprint sample, DTR-11 facade specs, MVP scope later-expansion notes, `docs/DATA_FEASIBILITY.md`, MVP-02 place-truth packet, MVP-03 static data contract notes, and decision/ledger history references for Karczma/Brouwerij.
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
- Topic/source reread: Phase 3 scaffold fixture, `docs/phase-3-architecture-scaling-decision-surface.md`, `docs/MVP_SCOPE.md`, and Phase 2AB official-footprint sample.
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
- Topic/source reread: `docs/phase-3-architecture-scaling-decision-surface.md`, Phase 3 scaffold fixture, Phase 2AA real-data fixture, DTR-11 facade extraction specs, MVP manifest, draft-scene fixture, and official-footprint sample.
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
- Topic-doc reread: `docs/phase-3-architecture-scaling-decision-surface.md`.
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
- Topic-doc reread: `docs/phase-3-architecture-scaling-decision-surface.md`.
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
- Topic-doc reread: `docs/phase-3-architecture-scaling-decision-surface.md`.
- `git diff --check`
- `git status --short`

Outcome:
- Marked `docs/phase-3-architecture-scaling-decision-surface.md` as reviewed/approved for the first scaffold implementation direction only.
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
- `docs/phase-3-architecture-scaling-decision-surface.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Topic-doc reread: `docs/MVP_SCOPE.md`, `docs/ARCHITECTURE.md`, `docs/PHASE_3_SCALE_TEST_PLAN.md`, and `docs/SCENE_MANIFEST_SCHEMA.md`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created `docs/phase-3-architecture-scaling-decision-surface.md` as a concise planning-only decision surface.
- Recommended, for Batu review only, a hybrid path using block/tile-scoped manifest planning, raster-first scene plates/layers, structured interaction/QA/provenance overlays, and reusable primitives for geometry, hotspots, masks, labels, cards, provenance, and review.
- Documented the minimum decisions needed to open the first scaffold proposal: slice bounds, block/tile/layer partition direction, coordinates/pan/zoom approach, raster placeholder/approved-surface choice, minimum QA/provenance overlay, browser assumptions, 10-block/50-block risks, and the proposed first implementation batch after approval.
- Preserved no Phase 3 implementation, no app/source edits, no new architecture boundary, no public-interface/schema approval, no visual asset generation, no source acquisition, no production/public claims, and no package/tooling changes.

Unresolved decisions:
- Batu owns whether to approve, revise, or reject the recommended hybrid direction.
- Batu owns the exact allowed files, public-interface/schema implications, source/reference lane, visual asset availability, and acceptance criteria for any later Phase 3 implementation batch.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of `docs/phase-3-architecture-scaling-decision-surface.md` before any Phase 3 implementation.

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
