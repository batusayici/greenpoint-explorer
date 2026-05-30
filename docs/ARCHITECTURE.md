# Architecture / Prototype Setup Planning

Status: Docs-only planning packet / not implementation approval  
Date: 2026-05-28  
Creative/product/public-interface approval owner: Batu  
Critique/decision-support/brief-authoring support: ChatGPT  
Planning owner inside current brief: Codex

## Purpose

This packet supports one decision:

> Is the project ready to authorize a later implementation setup gate for the first interactive Map Mode MVP slice?

This document proposes architecture and prototype boundaries for review only. It does not approve app implementation, package tooling, source folders, public interfaces, production assets, production asset pipeline, real-place cards, live data, CI, deployment, or final architecture.

## Current Inputs

- Final visual direction is approved: Inked Indie / Compact Corner with fictional-safe storefront identity and integrated paper/card UI direction.
- Phase 4 is complete.
- Phase 4.5 is supporting evidence that the direction appears promising as a reusable storefront system.
- Phase 4.5 does not approve production scalability, production buildability, production assets, production asset pipeline, implementation, architecture, public interfaces, real-place representation, or live data.
- Phase 2 truth policy remains active: hybrid real-plus-placeholder composition, with unresolved real-place details kept symbolic, fictionalized, placeholder, omitted, or manual-review-required.

## Proposed Prototype Scope

The first implementation setup gate should target one authored interactive Map Mode MVP slice around Manhattan Ave / Greenpoint Ave.

Included for the first prototype plan:

- One compact isometric scene.
- Desktop/tablet-primary layout with basic mobile containment.
- Bounded pan and zoom.
- Desktop hover and click.
- Touch tap highlight and card open.
- Static local data only.
- Fictional-safe storefronts and symbolic anchors where real representation is not verified.
- Future capacity for 4-6 source-backed real named places only if spatially coherent and separately approved.
- One selected-state card pattern based on the approved integrated paper/card UI direction.
- Small number of ambient visual-only loops later, after basic interaction works.

Out of scope for the first prototype plan:

- Broad map coverage.
- Real map navigation, routing, pathfinding, or GIS behavior.
- Live data, scraping, CMS, persistence, accounts, user submissions, or backend services.
- Avatars, NPCs, interiors, quests, hidden objects, notebook/discovery log, or simulation systems.
- Production visual assets or final asset pipeline.
- Real-place cards or factual copy before verification clears them.

## Conceptual Module Boundaries

These are proposed module boundaries for review only. They are not approved public interfaces, file names, or implementation modules.

| Boundary | Responsibility | Should Not Own |
| --- | --- | --- |
| App shell | Page frame, layout containment, high-level state wiring, viewport sizing, and accessibility hooks. | Rendering internals, place facts, art generation, or source verification. |
| Scene/viewport | Pan, zoom, coordinate transform, camera limits, scene dimensions, and hit-test coordinate mapping. | UI card content, place verification, or visual asset creation. |
| Rendering layer | Draw the approved isometric world, storefronts, symbolic anchors, props, markers, selected outlines, and ambient loops. | Source truth, factual copy, or business-status decisions. |
| Interaction layer | Pointer/touch hover, tap/click selection, active target state, keyboard escape/close behavior, and event normalization. | Rendering assets, factual content, or card layout styling decisions. |
| UI card/marker layer | Display selected-state marker, connector, card shell, card fields, disclaimers, and close behavior. | Inventing facts, deciding place inclusion, or owning scene geometry. |
| Static data/truth layer | Hold fictional-safe placeholders, symbolic anchors, future verified place records, source URLs, verification dates, and truth status. | Drawing, interaction behavior, or visual style. |
| Visual asset layer | Store future approved raster assets, sprite sheets, layered exports, and metadata about asset provenance. | Approval of production assets or factual place content. |
| QA/feedback loop | Visual smoke checks, interaction checks, mobile containment checks, and screenshot review checklist. | Product decisions or architecture approval. |

## Real-Corner Translation Boundary Note

MVP-20 Real-Corner Translation Boundary is the review point where static data/truth, Place/Building/Storefront/MapAnchor relationships, visual asset provenance, and UI/card treatment must be reconciled before any implementation is considered.

- The rendering layer must not own source truth, business status, factual copy, treatment approval, or public-representation decisions.
- The visual asset layer may store approved raster assets and provenance only after the relevant evidence/reference and translation gates clear.
- This note does not approve architecture, public interfaces, app implementation, package/config changes, renderer changes, production assets, or production data.

## Interface Concepts And Data Contracts

The following are proposed interface concepts and data contracts for later review, expressed only in prose/tables. These are not approved public interfaces and must not be implemented as code.

| Candidate concept | Purpose | Review notes |
| --- | --- | --- |
| Scene composition data | Describes the authored scene: scene bounds, camera defaults, visual layers, target ordering, and symbolic anchors. | Must stay small and authored; not a general map schema. |
| Fictional-safe storefront visual spec | Describes fictional storefront identity, abstract sign/glyph family, facade variant, clickable region, and visual asset references. | Must not contain real business names, exact addresses, or factual copy. |
| Symbolic anchor record | Describes non-factual or partially verified anchors such as a transit cue or landmark-like massing. | Must label symbolic status and unresolved truth risks. |
| Future verified place record | Describes a real place only after source review: name, category, address, source URL, last verified date, neutral description, disclaimer, placement confidence, and active-status confidence. | Must not be used for production until approved by Batu under the truth policy. |
| Interaction target definition | Describes hit area, target id, hover affordance, selection behavior, and relationship to a storefront or anchor. | Must avoid coupling interaction behavior to factual business data. |
| Card display data | Describes card title, category, neutral copy, source/disclaimer fields, and placeholder handling. | Real factual copy remains blocked until verification and approval. |
| Asset manifest concept | Describes raster asset id, file path, intended use, scale, provenance, and approval status. | Must distinguish review artifacts from production assets. |

## Data Boundaries

Fictional-safe storefronts:

- May use invented abstract identity, non-word glyphs, symbolic marks, color families, prop clusters, and review-only placeholder text blocks.
- Must not include real business names, addresses, factual claims, exact facades, exact station geometry, readable generated micro-copy, or active-business claims.
- Should carry an explicit fictional/placeholder truth status in any later data contract.

Symbolic anchors:

- May represent broad neighborhood cues such as transit presence, street-corner rhythm, or building massing.
- Must not imply exact stair placement, elevator footprint, facade width, storefront order, address, or active business status unless verified and approved.
- Should be visually useful while remaining truth-labeled in future data.

Future verified real-place cards:

- Require name, category, address, source URL, last verified date, neutral description, unofficial-map disclaimer, placement confidence, and active-status confidence.
- Must consume the same truth layer as the rendered scene and UI card.
- Must not be created in this planning batch.

## Rendering Approach Options

| Option | Pros | Risks / tradeoffs | Review read |
| --- | --- | --- | --- |
| React + Vite shell, PixiJS/canvas world renderer, DOM/React overlay | Strong fit for raster-heavy isometric scene, pan/zoom, sprite layering, pointer hit testing, and accessible UI cards. DOM overlay keeps paper/card UI easier to inspect and iterate. | Requires package setup later; coordinate sync between canvas and DOM overlay must be designed carefully. | Recommended for review, not implementation approval. |
| Pure Canvas/Pixi app | Keeps world and UI in one rendering stack and may simplify visual compositing. | UI cards, text, accessibility, responsive containment, and source/disclaimer display become harder than DOM. | Viable if visual unity matters more than UI ergonomics. |
| SVG-first scene | Inspectable and simple for small diagrams or blockouts. | Does not match the approved high-fidelity raster direction and risks repeating earlier SVG decision-grade failures. | Not recommended for the main prototype renderer. |
| DOM/CSS-only layered scene | Simple tooling and accessible UI by default. | Poor fit for dense isometric raster layering, pan/zoom, hit regions, and future ambient loops. | Useful for UI overlays, not the world renderer. |
| Three.js | Powerful for 3D scenes and camera work. | Unneeded complexity for an authored 2D/isometric raster diorama; risks drifting into 3D production problems. | Not recommended for MVP setup. |

Recommended planning path for later review:

> React + Vite app shell, PixiJS/canvas world renderer, and DOM/React overlay for cards and controls.

This is a recommendation only. It does not approve React, Vite, PixiJS, package files, source folders, implementation, or final architecture.

## Asset Pipeline Planning Options

| Option | Description | Strength | Unresolved risk |
| --- | --- | --- | --- |
| Authored raster boards / sprite sheets | Batu-approved art is exported into curated scene sheets or sprites. | Strong control over Inked Indie texture, silhouettes, and mood. | Production burden may be high; Phase 4.5 is not production scalability proof. |
| Layered raster exports | Storefronts, props, selected outlines, markers, and card pieces are exported as separate approved layers. | Supports reuse, hit targets, and selected states while preserving raster fidelity. | Needs naming, scale, and provenance discipline before production. |
| Hybrid hand-directed generation plus manual cleanup | AI-assisted or generated drafts are reviewed, cleaned, and assembled under strict fictional-safe rules. | Could help explore variants quickly. | Accidental text/brand marks, consistency, rights/provenance, and cleanup cost remain unresolved. |
| Placeholder-first implementation assets | Use rough non-production placeholders for first interaction proof, then replace after asset approval. | Lets interaction and performance be tested before production art exists. | Screenshot appeal may underrepresent the approved visual direction. |

Asset-planning rule:

- All existing Phase 4 and Phase 4.5 images are review evidence, not production assets.
- Any later production asset packet must be separately approved by Batu.
- Future asset metadata should distinguish review artifact, placeholder, approved prototype asset, and production asset.

## Feedback Loop For First Implementation Batch

A later implementation brief, if approved, should include the fastest useful feedback loop:

- Start a local dev server.
- Confirm the prototype loads with no console-blocking errors.
- Verify one authored scene appears within desktop/tablet viewport.
- Verify basic mobile containment: no unusable overflow, card remains reachable, and scene stays understandable.
- Verify bounded pan/zoom limits.
- Verify hover/click selection on desktop and tap selection on touch-sized viewport.
- Verify selected marker/card opens and closes.
- Capture desktop and mobile screenshots for Batu/ChatGPT review.
- Search the implementation diff to confirm no live data, broad map coverage, real-place cards, or production asset claims were introduced.

## Performance And Device Assumptions

- Desktop/tablet-primary prototype.
- Basic mobile containment, not phone-first optimization.
- One small authored scene, not a scalable city map.
- Static local data only.
- Bounded pan and zoom.
- Small number of interaction targets in the first implementation batch.
- Raster assets should be budgeted for quick initial load and stable interaction on modern consumer laptops/tablets.
- Ambient visual-only loops should be limited and deferred until static rendering plus interaction are stable.

## Likely Future Implementation Files

The following files are likely candidates for a later implementation batch. They are listed for planning only and must not be created or modified until a later approved implementation brief.

- `package.json`
- `package-lock.json` or another approved lockfile
- `vite.config.*`
- `index.html`
- `src/`
- `src/main.*`
- `src/App.*`
- `src/scene/`
- `src/rendering/`
- `src/interaction/`
- `src/ui/`
- `src/data/`
- `src/assets/`
- `src/styles/`
- `tests/` or an approved test/check location
- `README.md` or developer run instructions, if the implementation brief asks for them

## What Remains Blocked

- App implementation.
- Architecture approval.
- Public module/interface approval.
- Package files, source folders, build tooling, CI, deployment, and dev-server setup.
- React, Vite, PixiJS, Three.js, or any other implementation dependency installation.
- Production assets, production asset direction, and production asset pipeline.
- Real-place cards, factual card copy, exact real facades, exact addresses, exact station geometry, and active-business claims.
- Live data, scraping, CMS, persistence, accounts, user submissions, backend services, broad map coverage, routing, avatars, NPCs, interiors, quests, hidden objects, notebook/discovery log, or simulation systems.
- Production scalability and production buildability approval.

## Future Implementation Stop Conditions

Any future implementation brief should stop before:

- Creating real-place cards or factual copy without source verification and Batu approval.
- Treating review artifacts as production assets.
- Treating Phase 4.5 as production scalability/buildability approval.
- Expanding beyond one authored Manhattan Ave / Greenpoint Ave scene.
- Adding live data, scraping, CMS, persistence, accounts, broad map coverage, routing, avatars, NPCs, interiors, quests, or simulation systems.
- Implementing public interfaces or module boundaries that were not documented and reviewed.
- Changing approved visual direction, product scope, public representation policy, or architecture boundaries without Batu approval.

## Recommendation For Batu/ChatGPT Review

Approve a later implementation setup gate only if Batu/ChatGPT are comfortable with:

- Planning toward a React + Vite shell with PixiJS/canvas world renderer and DOM/React UI overlay.
- Keeping all initial data static and local.
- Building one compact authored scene first.
- Using fictional-safe storefronts and symbolic anchors until real-place truth is verified.
- Treating all proposed interface concepts and data contracts as review-only until separately approved.

If approved later, the first implementation brief should be narrow: initialize tooling, render a placeholder authored scene, prove pan/zoom and one selected card, and report screenshots and basic interaction checks. It should not introduce production assets or real-place cards.
