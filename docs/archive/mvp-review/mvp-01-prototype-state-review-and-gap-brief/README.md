# MVP-01 Prototype State Review And Gap Brief

Status: Complete for Batu/ChatGPT review
Date: 2026-05-29
Scope: Docs-only prototype evidence review and MVP gap brief

## Purpose

This packet reviews the current repository evidence and identifies the gap between the current review-only prototype and MVP completion.

It does not approve production assets, production asset direction, production asset pipeline work, real-place cards, public interfaces, architecture, deployment, CI, analytics, backend, CMS, persistence, live data, broad map coverage, or source/app implementation.

## Evidence Reviewed

Current source evidence:

- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/placeholderScene.js`
- `src/styles.css`
- `src/assets/review-only/phase-6-1-ui-integrated-recombination-review-only.png`

Review/history evidence:

- `docs/archive/review-screenshots/phase-6-1-constrained-raster-prototype-integration/`
- `docs/archive/review-screenshots/phase-6-2-product-facing-prototype-polish/`
- `docs/visual-artifacts/phase-6-review-prototype-translation-plan/`
- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/`

Important evidence limit:

- Phase 6.1 and Phase 6.2 screenshots are archived. They can support review history, but they are not current executable authority unless Batu/ChatGPT explicitly promote them.
- The active `docs/review-screenshots/` folder does not currently contain Phase 6.1 or Phase 6.2 review screenshot files.

## Current Prototype Behavior Evidenced

From source inspection, the current review-only prototype appears to implement:

- A React/Vite app shell with a Pixi-rendered world surface.
- One copied review-only Phase 6 raster plate as the primary world surface.
- Five fictional-safe targets: Dawn Loaf, Mica Repair, Lark Goods, Static Cycle, and Paper Vale.
- Fictional placeholder card content only.
- Pointer hover and click/tap target selection.
- Pan by drag and pan buttons.
- Wheel zoom and zoom buttons.
- Reset view.
- Bounded camera/clamping behavior.
- Selected marker, selected outline/trace, tether/card attachment, compact selected card, compact controls, and compact place index.
- QA/review hotspot mode separated behind a `QA` toggle.
- Basic mobile containment rules for controls, place index, and selected card.
- Review-only and non-production labeling in UI copy and scene data.

From archived screenshot evidence, prior review passes appear to have captured:

- desktop default overview
- desktop hover/focus state
- desktop selected card state
- mobile selected-state containment
- pan/zoom stress view

Because those screenshots are archived, the current review packet treats them as historical evidence rather than active approval.

## What This Evidence Proves

The current prototype is sufficient to show that a constrained review-only raster prototype path exists:

- The approved raster direction can be loaded as the primary world surface.
- Interaction overlays can be aligned to a raster without drawing storefronts as SVG/CSS/DOM/canvas world art.
- Fictional target selection and compact card behavior can be demonstrated.
- Existing interaction categories are plausible: pan, zoom, hover, click, tap, selected card, and mobile containment.

## What This Evidence Does Not Prove

The current prototype does not prove or approve:

- MVP completion.
- Real-place data readiness.
- Real-place card copy.
- Spatially coherent placement of 4-6 real named places.
- Exact addresses, exact facades, storefront frontage/order, or exact station geometry.
- Production assets.
- Production asset direction.
- Production asset pipeline.
- Production buildability or scalability.
- Public module/interface boundaries.
- Final app architecture.
- Live data, backend, CMS, persistence, analytics, CI, deployment, routing, accounts, or broad map coverage.
- Final mobile UX beyond basic containment.
- Accessibility completeness beyond basic visible controls/focus affordances.
- Active current screenshot evidence, because the Phase 6.1/6.2 screenshot sets are archived.

## MVP Requirements Still Missing Or Blocked

Missing or blocked before MVP completion:

- Batu/ChatGPT acceptance of the current review-only prototype evidence.
- A Place Truth Packet selecting which real places are approved, deferred, omitted, fictionalized, or manually verified.
- Static MVP data contract or approved source-file boundary for real-place data.
- Source-backed place card copy for any real place included in MVP.
- Source URLs and last-verified dates for each approved real place.
- Unofficial-map disclaimer integrated with real-place card behavior.
- Approved spatial boundary for the compact Manhattan Ave / Greenpoint Ave scene.
- Decision on whether Karczma fits the compact slice, requires expanded boundary, or is deferred.
- Decision on how to represent the Greenpoint Ave G station without exact geometry claims.
- Active review screenshots or demo-freeze evidence after any future approved MVP interaction/data integration.
- Final QA checklist and accepted exceptions for demo freeze.

## Blocker Classification

Product / scope decisions:

- Which MVP targets are Must-Have versus cuttable after review.
- Whether optional compact place index and ambient loops remain in scope.
- Whether the current review-only prototype evidence is accepted as enough to move into real-place truth work.

Truth / source decisions:

- Which 4-6 real named places are spatially coherent and manually verifiable.
- Whether Peter Pan, Karczma, Greenpoint Ave G station, and nearby storefronts can fit the same truth-safe scene.
- Which candidates are omitted, treated symbolically, fictionalized, or deferred.

Visual decisions:

- Whether the review-only raster integration and product-facing UI treatment are acceptable enough to guide MVP implementation.
- Whether any archived screenshots should be promoted as review evidence or replaced with fresh active screenshots in a later implementation/QA batch.

Architecture / public-interface decisions:

- Static data boundary and public/private module shape for place data.
- Any approved public interface for target coordinates, place cards, source metadata, and disclaimers.
- Whether the existing Pixi/React structure is acceptable for MVP continuation, still without treating it as final production architecture.

Ordinary implementation tasks after approval:

- Integrate approved static place data.
- Replace fictional placeholder card content with approved neutral factual copy.
- Confirm selected markers/cards/disclaimers remain usable on desktop, tablet, and basic mobile.
- Capture active review screenshots for future implementation and QA batches.
- Run the fastest available app check for approved implementation batches.

## Stale Or Superseded Pointers

No active control doc should continue pointing to Phase 6.1 as the next task after this batch.

`docs/CURRENT_EXECUTION_BRIEF.md` should be advanced from MVP-01 to the next proposed task after this review.

Archived Phase 6.1/6.2 screenshot folders remain review history only unless Batu/ChatGPT promote them.

## Smallest Recommended Next Batch

Recommended next task:

> MVP-02 Place Truth Packet

Purpose:

Produce a docs-only place-truth packet that identifies the candidate real places for the MVP scene, their source evidence, spatial coherence risks, copy constraints, and approve/defer/omit/fictionalize recommendations for Batu/ChatGPT review.

Why this is next:

- The prototype can already demonstrate fictional-safe interaction behavior at review-only level.
- The biggest remaining MVP blocker is not another visual proof; it is the truth-safe transition from fictional placeholders to 4-6 source-backed real named places.
- The next task should avoid source/app changes until the place truth boundary and static data contract are reviewed.

## Recommended MVP Path After MVP-02

1. MVP-02 Place Truth Packet.
2. MVP-03 Static MVP Data Contract.
3. MVP-04 MVP Interaction Integration.
4. MVP-05 Visual Polish / Optional Ambient.
5. MVP-06 MVP QA And Demo Freeze.
6. MVP-07 MVP Completion / Post-MVP Parking.

## Acceptance Status

MVP-01 is complete as a review/gap artifact.

It does not by itself approve the current prototype, real-place representation, public interfaces, architecture, production assets, production asset pipeline, or MVP completion.
