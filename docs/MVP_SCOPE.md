# Greenpoint Isometric Explorer - MVP Scope

Status: Detailed MVP scope authority
Last reconciled: 2026-06-03
Creative/product/scope owner: Batu
Execution owner inside approved boundaries: Codex

## Purpose

This document defines the detailed MVP scope boundary.

`docs/PLAN.md` controls roadmap, phase order, gates, and current state. `docs/MVP_SCOPE.md` controls detailed MVP scope, non-goals, must-have/should-have/cuttable items, and MVP acceptance boundaries. `docs/CURRENT_EXECUTION_BRIEF.md` can narrow scope for an active task, but it cannot expand MVP scope.

## MVP Objective

The MVP should prove one thing:

> Can a small isometric Greenpoint scene feel visually distinctive, locally specific, and worth clicking?

The current MVP proof must now also prove the real-data-to-isometric-raster-scene pipeline, not only screenshot appeal:

```text
source inputs
-> structured scene/facade/geometry fields
-> deterministic generated raster/spec artifact
-> review-only isometric scene output
-> QA/status comparison
```

The desired reaction is:

> I want to explore more of this.

The MVP also has a local-recognizability test: someone familiar with the intersection should be able to recognize the review/demo scene as meaningfully Greenpoint, without the project claiming GIS-perfect geometry, exact public factual representation, production art, or production data readiness.

The MVP remains one review-only, raster-first, interactive four-corner diorama of Manhattan Ave x Greenpoint Ave. It is not a full map product, game system, local guide platform, production content pipeline, production data pipeline, personalized-neighborhood generator, search/tour system, marketplace, broad coverage effort, or public-ready factual representation. The current manually composed MVP-29E raster is a strong baseline/reference, but it is not sufficient as the core proof unless the scene can be reproducibly reconstructed from structured real-world inputs into a true-to-life, review-only isometric raster scene.

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

- One compact isometric scene covering the full Manhattan Ave x Greenpoint Ave four-corner intersection.
- NW, NE, SW, and SE corner structure.
- Desktop/tablet-primary web prototype behavior.
- Basic mobile containment so the scene remains readable and cards remain usable on small screens.
- Approved Inked Indie / Compact Corner visual direction with fictional-safe storefront identity and integrated paper/card UI direction.
- Controlled, static, review/demo-safe raster assets when approved by the current brief.
- Controlled, static, review/demo-safe local data when approved by the current brief.
- A review/demo-only draft real-data scene lane that can render sourced, inferred, and manually authored prototype scene data before strict product-promotion readiness, when explicitly opened by the current brief.
- Bounded pan and zoom.
- Desktop hover and click.
- Keyboard focus where relevant for ordinary interactive controls.
- Touch tap highlight and card open.
- Selected marker, selected storefront/target treatment, tether/card attachment, compact place card, compact controls, and optional compact place index.
- Source-backed real named places only if spatially coherent and manually verified.
- Static local place data for approved real places.
- Compact place cards with neutral store information: name, category, source-backed address/context where available, and a tiny review-only disclaimer. Source URLs, last-verified dates, status records, and evidence detail may remain in source/status fixtures or review materials instead of the visible external-review card.
- 2-4 ambient visual-only loops if they support the scene without becoming product systems.
- Review-only labels, truth statuses, and QA affordances when they are visually secondary and separate from product-facing UI.
- One narrow source-of-truth validation spike for the same scene/block face, limited to 5-10 storefront candidates, if approved by the current brief.
- Review-only storefront evidence cards covering candidate address, building/tax-lot linkage, business match, visual-reference provenance, facade cues, confidence, and manual follow-up.
- Draft prototype scene records for current MVP places/cues, including real names, address text, category, approximate footprints, inferred storefront bays, sign text, facade style, door/window placement, and manual/inferred geometry, provided each major field carries a truth/evidence status.
- Evidence-backed exact MVP review fields for storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry when explicitly supported by structured source/reference evidence, provenance, and status labels.
- A focused data-to-raster proof track for Manhattan Ave x Greenpoint Ave, where source inputs become structured scene/facade/geometry fields, then deterministic raster/spec artifacts, then review-only isometric scene output and QA/status comparison.

## Demo-Safe Assets And Data

The MVP may use controlled, static, review/demo-safe assets and data without approving a production asset pipeline.

Allowed review/demo-safe material can include:

- Supplied or approved raster scene plates.
- Copied review-only local raster assets when explicitly allowed by the current brief.
- Fictional placeholder target labels and card copy.
- Static manually authored place data after Batu/ChatGPT approve the place-truth step, the MVP-03 static data contract proposal, and a specific implementation boundary.
- Owned or explicitly approved field-reference photos for review-only source-of-truth validation, with provenance metadata.
- Batu-supplied reference photos for MVP-only facade/source imagery, with provenance/status metadata and review-only labels.
- Batu's narrow MVP-only SW Dunkin visual-reference exception, limited to human-reviewed, stylized, truth-safe, non-production review/demo-scale approximation while scaffolding blocks usable current SW field photos.
- Static review-only storefront evidence cards generated from approved public/open data plus manual observations.
- Review screenshots and smoke-check evidence.

This does not approve:

- Production/public-release assets.
- A production asset direction.
- A production asset pipeline.
- Production generated storefront factories.
- Production automated extraction, sprite generation, or build-time asset systems.
- Automated source-of-truth pipelines, storefront-unit databases, live refresh, or broad data imports. A current brief may still approve a narrow local draft-scene fixture/model that manually combines sourced, inferred, and manual prototype data for the current MVP intersection only.
- Google/Street View/3D Tiles imagery as stored reference, training input, generation input, texture source, or extracted facade data, except for Batu's narrow MVP-only SW Dunkin visual-reference exception. The exception does not approve production use, texture extraction, tracing, stored facade asset reuse, training input, generation input, exact trade-dress reproduction, or a general source-policy change.
- Third-party image scraping, unsourced image collection, or Google/Street View/3D Tiles extraction for facade fields, visual generation, texture extraction, training, stored facade asset reuse, or production asset use.
- Public-release real-place data.
- Live data, scraping, automated refresh, or CMS-backed content.

Review-only raster assets must remain labeled non-production and must not be described as production assets, public-release factual Greenpoint representations, or approved production asset direction. Exact MVP review geometry may be represented only where the field is evidence-backed, provenance-labeled, and not promoted as public/product truth.

## Draft Real-Data Scene Lane

A current brief may open a review/demo-only draft scene lane to prove that real-world place data, approximate geometry, and visual storefront/facade representation can drive the MVP scene before product/public readiness.

The draft lane may combine:

- Sourced public facts, including real business names, address text, and categories.
- Inferred or manually authored approximate geometry, including building footprints, storefront bays, facade modules, sign panels, door/window placement, and scene anchors.
- Review/demo-safe visual treatment intended to feel locally specific and useful for proof-of-concept review, not GIS/survey-perfect.
- Existing strict source-evidence records and generated fixtures as one input, plus explicit draft scene overrides or draft scene fixtures where needed for visual completeness.

Every major draft field should carry a machine-readable status such as `verified`, `sourced`, `inferred`, `manual_draft`, `symbolic`, `unknown`, or `blocked`.

The draft lane is intentionally separate from the strict promotion/product-readiness lane. Draft records may render in the prototype even when `productCopyReady` is false, but they must not be represented as production-ready, exact, public-release approved, or suitable for product claims.

QA mode is the draft lane's experimental product lab. "Not product-ready" does not mean "do not render": approximate or manual draft scene data should render aggressively in QA mode when status labels are visible. Normal mode remains protected, and promotion-readiness gates remain unchanged.

The draft lane does not approve live data, scraping, backend services, CMS, automated refresh, commercial data licensing, production asset direction, production asset pipeline, broad neighborhood coverage, unsupported exact-geometry claims, public/product exact-geometry claims, or weakening existing promotion-readiness verifiers.

## Data-To-Raster MVP Proof Boundary

Phase 2DTR is the focused MVP proof path for the current Manhattan Ave x Greenpoint Ave four-corner scene.

It may use these review-only source categories:

- Business/source data for identity, category, address, and source-evidence status.
- NYC Open Data/building footprints for scaffold geometry context only. Footprints do not provide storefront, facade, tenant-frontage, entrance, sign, window, or active-business truth by themselves.
- Batu-supplied reference photos as MVP-only facade/source imagery for review-only scene generation and facade extraction.

Batu-supplied reference photos may be used, for the MVP only, to derive structured facade fields such as storefront layout, sign band, awning/canopy, entrance cue, window bays, material/color notes, visible props, and corner character.

This allowance does not approve production reuse, production assets, production asset direction, training use, texture extraction, exact trade-dress reproduction, third-party image scraping, Google/Street View/3D Tiles extraction, or a general production source policy.

Structured field statuses must distinguish at least:

- `verified`
- `sourced`
- `inferred`
- `manual_draft`
- `symbolic`
- `blocked`
- `unknown`

The MVP can be demoable while still not production-ready or public-ready. Review-only raster/spec artifacts may be evaluated for whether the pipeline works. Exact storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry may now be represented in MVP review artifacts when evidence-backed and status-labeled, but must not be presented as production assets, public factual claims, or product-ready claims.


## Real-Corner Gate Sequencing

Source-of-truth validation, owned/approved field-photo supply, four-corner translation boundary, and raster integration are distinct gates.

- Field photos or approved reference packets may support review-only validation and visual translation planning.
- Field photos or approved reference packets may support evidence-backed exact MVP review fields, but they do not by themselves approve product-facing real-corner art, production assets, production data, real cards, app implementation, or public-release claims.
- A real-corner translation boundary must reconcile evidence, visual-reference provenance, Place/Building/Storefront/MapAnchor relationships, allowed approximations, treatment recommendations, acceptance criteria, and stop conditions before any real-corner raster integration can be considered.
- Four-corner raster integration, if pursued, requires its own later current brief and approved implementation boundary.

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
- Automated storefront/business matching at scale, except for narrow local draft-scene experiments that remain manually reviewable and limited to the current MVP intersection.
- Google/Street View/3D Tiles-derived extraction, training, generation, or texture reuse, except for Batu's narrow MVP-only SW Dunkin visual-reference exception for stylized/non-production review/demo approximation.
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
- Unsupported exact real facades, storefront frontage/order, entrance/window geometry, exact Greenpoint Ave G station/entrance geometry, or exact address placement.
- Product/public exact-geometry claims without later production/public approval.
- Ratings, reviews, endorsements, partnership claims, or promotional claims.

## Must-Have / Should-Have / Cuttable

### Must-Have

- One contained authored isometric scene.
- Full Manhattan Ave x Greenpoint Ave four-corner structure with NW, NE, SW, and SE corner treatment.
- Approved Inked Indie / Compact Corner visual direction preserved in the primary world surface.
- Primary world art uses approved/supplied raster or reviewed reference assets when visual fidelity affects acceptance.
- The core MVP proof shows that the four-corner review raster/spec can be generated from structured source, facade, and geometry fields rather than only from hand-authored prose/manual composition.
- The scene carries enough local detail, browsing pleasure, density, and recognizable corner character to evaluate whether the experience is worth exploring, alongside source traceability.
- Bounded pan and zoom.
- Desktop hover/click and touch tap selection.
- Approved interaction targets by MVP completion only where they are spatially coherent and evidence-backed.
- Compact selected card behavior.
- Manually validated real-business cards for included real businesses.
- Source/status records, last-verified dates, and review-only disclaimers for each real place where the place is presented as factual card content; the external-review card may stay compact while source detail remains in fixtures or review materials.
- Greenpoint Ave G subway entrance/station-cue placement treated as verified, approximate, symbolic, context-only, manual_draft, or blocked depending on evidence; prototype rendering may use approximate symbolic placement when the status is explicit.
- Truth-safe handling of uncertainty, omissions, placeholders, fictionalization, inferred geometry, and manual draft visual treatment.
- Explicit `verified`, `sourced`, `inferred`, `manual_draft`, `approximate`, `symbolic`, `context-only`, `omitted`, or `blocked` statuses for uncertain real-world claims and draft scene fields.
- Clear separation between scaffold geometry, business/source evidence, facade/source imagery, inferred/manual draft fields, symbolic transit cues, blocked fields, and unknown fields.
- Recognizable and truth-safe review/demo-scale storefront, sign, and facade treatment from owned, approved, non-Google, explicitly exception-approved, or manually authored draft references; not GIS/survey-perfect representation.
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

> Manhattan Ave x Greenpoint Ave handheld diorama, using the full NW / NE / SW / SE four-corner intersection.

Required active candidate validation set:

- Grillpoint Deli as the active NW current-scene candidate requiring address, building/tax-lot, storefront, status, and visual-reference verification.
- McDonald's as a current-scene candidate requiring address, building/tax-lot, storefront, status, branded-treatment, and visual-reference verification.
- Dunkin' as a current-scene candidate requiring address, building/tax-lot, storefront, status, branded-treatment, and visual-reference verification. Batu approved a narrow MVP-only SW Dunkin visual-reference exception for stylized/non-production review/demo approximation while scaffolding blocks usable current field photos.
- Citizens Bank as a current-scene candidate requiring address, building/tax-lot, storefront, status, branded-treatment, and visual-reference verification.
- Greenpoint Ave G station / subway entrances as verified station cues only where supplied/approved reference photos clearly verify the cue's corner/orientation relationship; otherwise symbolic, context-only, omitted, or blocked. MTA text may support station context but must not be used alone to infer exact station geometry.

`Greenpoint Deli` is historical / archival / prior conflicting candidate language only. Do not treat `Greenpoint Deli` as the current active public label, and do not claim Greenpoint Deli and Grillpoint Deli are legally the same entity unless source evidence supports that specific claim.

User-provided LiveXYZ links for the four business candidates are useful for current-scene identity/presence review only. They do not by themselves approve exact addresses, active-status finality, facade/art reference use, storefront frontage, entrance geometry, production placement, public card copy, or four-corner placement.

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

- Grillpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

Possible later expansion:

- Radio Bakery / India St, only if the rendered scene expands north toward India St.
- Brouwerij Lane / Franklin-Greenpoint area, only if a later slice or expanded boundary is approved.

## Geographic Rule

The diorama may simplify or compress distances for readability, but it must not relocate businesses onto incorrect streets, imply false adjacency, or imply exact frontage, exact facade, exact address placement, or exact station geometry without supporting evidence and Batu approval.

The scene should feel like a recognizable authored miniature, not a precise GIS map.

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

- The full Manhattan Ave x Greenpoint Ave four-corner interactive diorama is reviewable as a contained experience.
- The real-data-to-isometric-raster-scene pipeline is reviewable from source inputs through structured scene/facade/geometry fields, deterministic generated raster/spec artifact, review-only output, and QA/status comparison.
- A reviewer familiar with the intersection can plausibly recognize the scene as meaningfully Greenpoint at review/demo scale, while all exactness, uncertainty, omissions, and approximations remain truth-safe and status-labeled.
- NW, NE, SW, and SE corner structure exists in the approved scene.
- Pan, zoom, hover, click, tap, selected state, card behavior, and basic mobile containment work within the approved scope.
- Any real place included in the MVP has manually approved static source-backed data and a truth status.
- Included real-business cards are manually validated.
- Greenpoint Ave G subway entrance/station cues are verified where placed, or explicitly downgraded to symbolic/context-only treatment.
- The visual presentation remains aligned with the approved Inked Indie / Compact Corner direction.
- Storefront/sign/facade treatment is recognizable and truth-safe at review/demo scale using owned, approved, or non-Google references; it is not represented as GIS/survey-perfect or production art.
- Demo-safe assets and data are not presented as production/public-release approval.
- Batu-supplied reference photos, if used, are labeled as MVP-only review/source facade imagery and not production assets or production policy.
- QA records accepted passes, misses, or explicit cuts.
- Any source-of-truth validation spike remains review-only evidence and does not approve a production data, imagery, or asset pipeline.
- The source-of-truth validation spike records a clear proceed, revise, or cut recommendation for real-place usage before final visual polish/demo freeze.
- Accepted four-corner evidence/reference verdicts and accepted four-corner translation/integration outcomes must exist before MVP QA/demo freeze.
- Post-MVP ideas remain parked unless Batu explicitly promotes them.
