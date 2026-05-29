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

## Demo-Safe Assets And Data

The MVP may use controlled, static, review/demo-safe assets and data without approving a production asset pipeline.

Allowed review/demo-safe material can include:

- Supplied or approved raster scene plates.
- Copied review-only local raster assets when explicitly allowed by the current brief.
- Fictional placeholder target labels and card copy.
- Static manually authored place data after Batu/ChatGPT approve the place-truth step.
- Review screenshots and smoke-check evidence.

This does not approve:

- Production/public-release assets.
- A production asset direction.
- A production asset pipeline.
- Generated storefront factories.
- Automated extraction, sprite generation, or build-time asset systems.
- Public-release real-place data.
- Live data, scraping, automated refresh, or CMS-backed content.

Review-only raster assets must remain labeled non-production and must not be described as production assets, factual Greenpoint representations, exact facades, exact addresses, exact station geometry, or approved production asset direction.

## Detailed MVP Out Of Scope / Non-Goals

The following remain out of scope unless Batu later approves them in a new brief:

- Production/public-release assets.
- Production asset pipeline.
- Production asset direction.
- Broad map coverage.
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

### Cuttable

- Ambient loops if they threaten clarity, performance, scope, or schedule.
- Optional place index if it crowds the scene or complicates mobile containment.
- Extra placeholder targets beyond the minimum needed to test interaction.
- Secondary decorative props that do not affect visual appeal, local specificity, or first-click interest.
- Nonessential polish that would delay place truth, card behavior, or QA.

## Geography

First scene:

> Manhattan Ave / Greenpoint Ave handheld diorama, using one compact intersection or adjacent storefront row.

Candidate anchors, pending source/placement approval:

- Peter Pan Donuts - 727 Manhattan Ave.
- Karczma - 136 Greenpoint Ave.
- Greenpoint Ave G station / subway entrance.
- 1-3 nearby storefronts only if spatially coherent.

Possible later expansion:

- Radio Bakery / India St, only if the rendered scene expands north toward India St.

## Geographic Rule

The diorama may simplify or compress distances for readability, but it must not relocate businesses onto incorrect streets or imply false adjacency.

The scene should feel like an authored miniature, not a precise GIS map.

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
- Post-MVP ideas remain parked unless Batu explicitly promotes them.
