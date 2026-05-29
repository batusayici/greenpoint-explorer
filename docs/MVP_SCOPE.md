# Greenpoint Isometric Explorer - MVP Scope

Status: Detailed MVP scope authority
Last reconciled: 2026-05-29
Creative/product/scope owner: Batu
Execution owner inside approved boundaries: Codex

## Purpose

This document defines the detailed MVP scope boundary.

`docs/PLAN.md` controls roadmap, phase order, gates, and current state. `docs/MVP_SCOPE.md` controls detailed MVP scope, non-goals, must-have/should-have/cuttable items, and MVP acceptance boundaries. `docs/CURRENT_EXECUTION_BRIEF.md` can narrow scope for an active task, but it cannot expand MVP scope.

## MVP Objective

The MVP should prove one thing:

> Can a small isometric Greenpoint scene feel visually distinctive, locally specific, and worth clicking?

The desired reaction is:

> I want to explore more of this.

The MVP is a polished, authored, interactive diorama. It is not a full map product, game system, local guide platform, or production content pipeline.

## Core Experience

The MVP is one authored scene, not a general world system.

Core loop:

1. Pan or zoom around a small Greenpoint-inspired isometric scene.
2. Notice a storefront, transit anchor, sign, or local detail.
3. Get pointer, focus, hover, or tap feedback.
4. Click or tap to open a place card.
5. Learn one small source-backed factual thing when real-place data is approved.
6. Keep looking around.

## Detailed MVP Included Scope

The MVP may include:

- One compact isometric scene around Manhattan Ave / Greenpoint Ave.
- Desktop/tablet-primary web prototype behavior.
- Basic mobile containment so the scene remains readable and cards remain usable on small screens.
- Approved Inked Indie / Compact Corner visual direction with fictional-safe storefront identity and integrated paper/card UI direction.
- Controlled, static, review/demo-safe raster assets when approved by the current brief.
- Controlled, static, review/demo-safe local data when approved by the current brief.
- Bounded pan and zoom.
- Desktop hover and click.
- Keyboard focus where relevant for ordinary interactive controls.
- Touch tap highlight and card open.
- Selected marker, selected storefront/target treatment, tether/card attachment, compact place card, compact controls, and optional compact place index.
- 4-6 source-backed real named places only if spatially coherent and manually verified.
- Static local place data for approved real places.
- Place cards with neutral factual copy, source URL, last verified date, and unofficial-map disclaimer.
- 2-4 ambient visual-only loops if they support the scene without becoming product systems.
- Review-only labels and QA affordances when they are visually secondary and separate from product-facing UI.
- One narrow source-of-truth validation spike for the same scene/block face, limited to 5-10 storefront candidates, if approved by the current brief.
- Review-only storefront evidence cards covering candidate address, building/tax-lot linkage, business match, visual-reference provenance, facade cues, confidence, and manual follow-up.

## Demo-Safe Assets And Data

The MVP may use controlled, static, review/demo-safe assets and data without approving a production asset pipeline.

Allowed review/demo-safe material can include:

- Supplied or approved raster scene plates.
- Copied review-only local raster assets when explicitly allowed by the current brief.
- Fictional placeholder target labels and card copy.
- Static manually authored place data after Batu/ChatGPT approve the place-truth step, the MVP-03 static data contract proposal, and a specific implementation boundary.
- Owned or explicitly approved field-reference photos for review-only source-of-truth validation, with provenance metadata.
- Static review-only storefront evidence cards generated from approved public/open data plus manual observations.
- Review screenshots and smoke-check evidence.

This does not approve:

- Production/public-release assets.
- A production asset direction.
- A production asset pipeline.
- Generated storefront factories.
- Automated extraction, sprite generation, or build-time asset systems.
- Automated source-of-truth pipelines, storefront-unit databases, live refresh, or broad data imports.
- Google/Street View/3D Tiles imagery as stored reference, training input, generation input, texture source, or extracted facade data.
- Public-release real-place data.
- Live data, scraping, automated refresh, or CMS-backed content.

Review-only raster assets must remain labeled non-production and must not be described as production assets, factual Greenpoint representations, exact facades, exact addresses, exact station geometry, or approved production asset direction.

## MVP-Adjacent Source-Of-Truth Validation Spike

A current brief may approve one narrow validation spike to test whether the recommended hybrid source-of-truth approach works before further polish. This is evidence for decision-making, not a production system.

The spike may produce only:

- 5-10 review-only storefront evidence cards for the current scene/block face.
- Candidate address, BBL/BIN or tax-lot/building linkage, and source notes.
- Candidate business match, status, category, confidence, and unresolved conflicts.
- Owned/approved visual-reference notes and a facade cue checklist.
- A short scale-readiness note: what automated cleanly, what required manual review, and what blocks corridor/neighborhood expansion.

The spike must not produce live data, scraping, backend services, public-release cards, broad coverage, Google/Street View-derived assets, AI training data, or production storefront-unit claims.

The exit question is: can this block face reach enough confidence to support MVP real-place cards and future scaling, or should the MVP stay more fictional/place-light until the source-of-truth approach is stronger?

## Detailed MVP Out Of Scope / Non-Goals

The following remain out of scope unless Batu later approves them in a new brief:

- Production/public-release assets.
- Production asset pipeline.
- Production asset direction.
- Broad map coverage.
- Automated storefront/business matching at scale.
- Google/Street View/3D Tiles-derived extraction, training, generation, or texture reuse.
- Backend services.
- CMS.
- Live data.
- Scraping.
- Analytics.
- CI.
- Deployment.
- Accounts.
- Persistence.
- Routing.
- Real map navigation.
- Pathfinding.
- Avatar movement.
- NPCs.
- Interiors.
- Quests.
- Hidden objects.
- Notebook or discovery log.
- Events systems.
- Flyer systems.
- Stoop sale systems.
- User submissions.
- Business opt-in flows.
- Broad game systems.
- Phone-first optimization.
- Exact real facades.
- Exact storefront frontage/order claims.
- Exact Greenpoint Ave G station geometry.
- Exact addresses in visual placement unless manually verified and approved.
- Ratings, reviews, endorsements, partnership claims, or promotional claims.

## Must-Have / Should-Have / Cuttable

### Must-Have

- One contained authored isometric scene.
- Approved Inked Indie / Compact Corner visual direction preserved in the primary world surface.
- Primary world art uses approved/supplied raster or reviewed reference assets when visual fidelity affects acceptance.
- Bounded pan and zoom.
- Desktop hover/click and touch tap selection.
- 4-6 approved interaction targets by MVP completion.
- Compact selected card behavior.
- Source-backed factual place cards if real places are included.
- Source URL, last verified date, and unofficial-map disclaimer for each real place.
- Truth-safe handling of uncertainty, omissions, placeholders, and fictionalization.
- Desktop/tablet readability and basic mobile containment.
- QA or review evidence sufficient for Batu/ChatGPT review.

### Should-Have

- Optional compact place index.
- Keyboard focus states for visible controls and targets where practical.
- 2-4 ambient visual-only loops.
- Small product-facing details that reinforce the paper/card UI direction.
- Review screenshots for default, hover/focus, selected, mobile containment, and pan/zoom stress states.
- A concise manual QA checklist for MVP demo freeze.
- A review-only source-of-truth validation packet for the same scene/block face before final visual polish, if approved.

### Cuttable

- Ambient loops if they threaten clarity, performance, scope, or schedule.
- Optional place index if it crowds the scene or complicates mobile containment.
- Extra placeholder targets beyond the minimum needed to test interaction.
- Secondary decorative props that do not affect visual appeal, local specificity, or first-click interest.
- Nonessential polish that would delay place truth, card behavior, or QA.

## Geography

First scene:

> Manhattan Ave / Greenpoint Ave handheld diorama, using one compact intersection or adjacent storefront row.

Current candidate anchors, pending Batu/ChatGPT review of the corrected `docs/mvp-review/mvp-05-source-of-truth-validation-spike/README.md` and later static data approval:

- Greenpoint Deli as a current-scene candidate requiring address, building/tax-lot, storefront, status, and visual-reference verification.
- McDonald's as a current-scene candidate requiring address, building/tax-lot, storefront, status, branded-treatment, and visual-reference verification.
- Dunkin' as a current-scene candidate requiring address, building/tax-lot, storefront, status, branded-treatment, and visual-reference verification.
- Citizens Bank as a current-scene candidate requiring address, building/tax-lot, storefront, status, branded-treatment, and visual-reference verification.
- Greenpoint Ave G station / subway entrance as a symbolic transit anchor only until exact access-point geometry is manually verified.

User-provided LiveXYZ links for the four business candidates are useful for current-scene identity/presence review only. They do not by themselves approve exact addresses, active-status finality, facade/art reference use, storefront frontage, entrance geometry, production placement, or public card copy.

Previous-scene candidates now parked outside the current MVP-05 validation set:

- Peter Pan Donut & Pastry Shop.
- Sweetgreen Greenpoint.
- Former Meserole Theater / 723-725 Manhattan Ave.
- Captured Record Shop.
- Polka Dot / 726 Manhattan Ave.
- Karczma.

## Active Scene Confirmation Guardrail

Before any future source validation, scene translation, visual polish, data alignment, or real-place implementation work, Codex must:

1. Confirm the active scene/place set from current app/data files.
2. List that active set in its task output.
3. Treat previous-scene entities as archival/reference-only unless the current brief explicitly reactivates them.
4. Stop and report if control docs, review artifacts, and app/data files disagree about the active scene, unless the current brief explicitly identifies that disagreement and authorizes correcting it.

Current durable active scene/place set:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

Possible later expansion:

- Radio Bakery / India St, only if the rendered scene expands north toward India St.
- Brouwerij Lane / Franklin-Greenpoint area, only if a later slice or expanded boundary is approved.

## Geographic Rule

The diorama may simplify or compress distances for readability, but it must not relocate businesses onto incorrect streets or imply false adjacency.

The scene should feel like an authored miniature, not a precise GIS map.

The corrected MVP-05 packet supersedes previous-scene candidate handling for current-scene review. If Batu wants density where evidence is incomplete, use clearly fictional placeholders or context-only treatment until current-scene verification clears real-place use.

## Business Representation Policy

Use public factual information only.

Every real place must include:

- Name.
- Category.
- Address.
- Source URL.
- Last verified date.
- Neutral description.
- Unofficial-map disclaimer.

Do not include:

- Ratings.
- Reviews.
- Endorsement claims.
- Fictional stories attached to real businesses.
- Claims of partnership or participation.

Default removal/editing policy:

> If a business objects to inclusion or factual presentation, remove or edit it on request.

## MVP Acceptance Boundary

The MVP can be considered complete only when:

- The one-scene interactive diorama is reviewable as a contained experience.
- Pan, zoom, hover, click, tap, selected state, card behavior, and basic mobile containment work within the approved scope.
- Any real place included in the MVP has approved static source-backed data.
- The visual presentation remains aligned with the approved Inked Indie / Compact Corner direction.
- Demo-safe assets and data are not presented as production/public-release approval.
- QA records accepted passes, misses, or explicit cuts.
- Any source-of-truth validation spike remains review-only evidence and does not approve a production data, imagery, or asset pipeline.
- The source-of-truth validation spike records a clear proceed, revise, or cut recommendation for real-place usage before final visual polish/demo freeze.
- Post-MVP ideas remain parked unless Batu explicitly promotes them.
