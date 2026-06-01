# MVP-29D Four-Corner Translation / Composition Brief

Status: Complete for Batu review  
Date: 2026-05-31  
Scope: Docs-only translation and composition brief  
Exit verdict: `proceed-to-mvp-29e-with-limits`

## Decision Summary

Batu accepted MVP-29C as `proceed-to-mvp-29d-with-limits`, opening this docs-only translation/composition brief.

MVP-29D translates the accepted-with-limits MVP-29C reference verdict into a four-corner scene proposal and a later raster-first production boundary. It does not render, regenerate raster art, change app source, touch `src/`, add targets, change app card copy, add screenshots, stage, commit, open implementation, or open MVP-29E.

MVP-22/MVP-22C remains accepted proof evidence only. It should inform interaction lessons, truth-safe card attachment, and raster-first recovery discipline, but it is not final MVP art and does not complete the revised four-corner MVP.

## Inputs Reviewed

- `docs/mvp-review/mvp-29a-four-corner-mvp-scope-reset/README.md`
- `docs/mvp-review/mvp-29b-four-corner-evidence-business-validation-packet/README.md`
- `docs/mvp-review/mvp-29c-four-corner-visual-reference-completeness-gate/README.md`
- `docs/MVP_SCOPE.md`
- `docs/ART_DIRECTION.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/PLACE_SOURCE_POLICY.md`
- `docs/PLACE_SCHEMA.md`

## Artifact Class

- Intended artifact class: Level 0 text brief, with Level 1 composition instructions expressed in prose and tables.
- Decision supported: whether Batu can approve the four-corner composition and authorize MVP-29E to define a raster-first production/integration boundary.
- Required output format: Markdown.
- SVG status: SVG is not needed for this docs-only boundary. Future composition diagrams may use SVG only as Level 1 blockouts, not as final visual direction, final raster proof, or primary world art.

## Four-Corner Composition

The later scene should be a single authored isometric diorama of Manhattan Ave x Greenpoint Ave. The composition should read as a compact intersection, not a broad map, with four legible corner zones around a clear crosswalk/street structure.

| Corner / zone | Primary candidate | Composition role | Required visual read |
| --- | --- | --- | --- |
| NW | Grillpoint Deli | Proof-evidence corner and small-business anchor. | A compact deli storefront zone at the NW corner, with a simplified sign band and corner-facing storefront rhythm. It may carry the strongest continuity from MVP-22, but it must not remain the only developed corner. |
| NE | McDonald's | Large branded commercial mass and high-recognition NE anchor. | A broad fast-food corner mass with simplified facade panels, sign/arches cues, and the larger Vibe/mural context treated as background massing, not as a new active candidate. |
| SW | Dunkin' | Exception-governed SW corner anchor. | A recognizable but highly stylized coffee/donut storefront cue, using only broad massing, sign-color/category cues, and corner relationship allowed by Batu's narrow MVP-only exception. |
| SE | Citizens Bank | Civic/commercial corner and station-cue anchor. | A bank/branch storefront zone with simplified green sign cue, older building massing, corner entry rhythm, and the SE Greenpoint G station cue where photo evidence supports it. |
| Station context | Greenpoint G subway | Transit anchor and local specificity cue. | The SE station stair/rail cue may be placed as an exact review/demo-scale cue if carried from MVP-29C evidence. NW/SW cues must be symbolic, context-only, omitted, or blocked unless later verified. |

Street and corner orientation:

- Manhattan Ave should read as the main north-south axis.
- Greenpoint Ave should read as the cross-street east-west axis.
- The four corners must be visually distinct and mapped as NW / NE / SW / SE.
- Crosswalks, curb corners, sidewalk bands, street signs, pedestrian poles, and curb cuts should clarify orientation without implying survey-perfect geometry.
- Distances may be compressed for readability, but businesses must not be moved to the wrong street or wrong side of the intersection.

Approximate camera/framing:

- Use the approved Inked Indie / Compact Corner isometric/diorama language.
- Frame the first screenshot wide enough to show all four corners, the intersection crossing structure, and at least one visible station cue.
- Keep storefronts and click zones readable at default desktop review size before any zoom.
- Favor a three-quarter isometric view with the intersection center visible and enough sidewalk depth for cards/markers to attach without covering storefront identities.

What should be visible in the first screenshot:

- All four corner masses: NW Grillpoint Deli, NE McDonald's, SW Dunkin', SE Citizens Bank.
- Clear Manhattan Ave and Greenpoint Ave orientation cues.
- Crosswalk/corner geometry sufficient to understand NW / NE / SW / SE relationships.
- A visible Greenpoint G station cue at SE if MVP-29E carries forward the MVP-29C evidence.
- Review/demo-scale storefront/sign cues for all four candidates, with simplified brand treatment.
- Product-facing UI should remain secondary: markers/cards can be shown only if later screenshot requirements ask for them.

## Truth-Status Map

| Candidate / cue | Status for MVP-29D composition | What the status allows | What remains blocked |
| --- | --- | --- | --- |
| Grillpoint Deli | `approximate` | Use as the NW real-business anchor with review/demo-scale sign/storefront treatment based on readable closeup and accepted MVP-22 proof evidence. | Exact facade geometry, exact frontage/order, exact address placement, active-status finality, legal sameness with Greenpoint Deli, direct `in front of Grillpoint` subway placement. |
| McDonald's | `approximate` | Use as the NE real-business anchor with recognizable simplified massing, sign zone, facade rhythm, and corner relationship. | Exact logo/trade-dress reproduction, exact facade geometry, exact storefront frontage/order, exact address placement, endorsement/partnership, `open now`, ratings, reviews. |
| Dunkin' | `approximate` under MVP-only exception | Use as the SW real-business anchor only as a human-reviewed, stylized, truth-safe, non-production review/demo-scale approximation. | Production use, tracing, texture extraction, training input, exact trade-dress reproduction, general Google-derived policy change, exact facade/frontage/address placement, exact station geometry. |
| Citizens Bank | `approximate` | Use as the SE real-business anchor with simplified bank sign/entry/facade cues and older building massing. | Exact logo/trade-dress reproduction, ATM/service claims, exact branch entrance placement, exact facade geometry, exact frontage/order, exact address placement, endorsement/partnership. |
| Greenpoint G SE cue | `verified` for review/demo-scale corner/orientation cue placement; `approximate` for authored geometry | Plan the visible SE stair/rail/station cue adjacent to the Citizens corner context if MVP-29E uses the approved reference paths. | Exact station geometry, exact entrance coordinates, production transit claims, any claim inferred from MTA text alone. |
| Greenpoint G NW cue | `context-only` / `blocked` for exact placement | May use a light symbolic/contextual subway presence only if it does not imply direct frontage or exact geometry. | Exact NW cue placement, direct `in front of Grillpoint` claim, reliance on unreadable HEIF-wrapped `northwest-subwayA.jpeg`. |
| Greenpoint G SW cue | `context-only` / `blocked` for exact placement | May use a light symbolic/contextual subway presence only if it does not imply exact geometry. | Exact SW station geometry; SW Google-derived files do not clear exact station placement. |
| Vibe / mural / neighboring background | `context-only` | May appear as simplified background massing/context where visible in references. | Active place card, real label, exact facade claim, new target. |
| Church / neighboring buildings / street furniture | `context-only` / `symbolic` | May support orientation and Greenpoint texture. | Active place card, exact facade/address claims, new targets. |

## Visual Treatment Rules

| Candidate | Real label in card? | Real label in raster? | Exact sign text allowed? | Stylized/simplified cue only? | Brand/trade-dress limits | Facade/frontage limits | Must not imply |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Grillpoint Deli | Yes for review planning, pending later card/copy boundary. | Allowed as stylized review/demo sign text if MVP-29E approves it. | Potentially, but only simplified and non-extractive. | Not required, but simplification is preferred. | No logo tracing, no texture extraction, no production asset claim. | Exact facade/frontage/order remains blocked. | Legal sameness with Greenpoint Deli, exact active status, exact address placement, direct subway-front adjacency. |
| McDonald's | Yes for review planning, pending later card/copy boundary. | Use cautious stylized cue; real raster label requires MVP-29E/Batu approval. | Avoid exact sign/logo reproduction. | Yes. | Restrained arches/color/category cues only; no exact logo/trade-dress reproduction. | Exact facade/frontage/order remains blocked. | Partnership, endorsement, official collaboration, exact facade/address placement, `open now`, ratings, reviews. |
| Dunkin' | Yes for review planning, pending later card/copy boundary. | Use only if MVP-29E carries Batu's narrow exception forward. | Avoid exact sign/logo reproduction. | Yes, mandatory. | MVP-only, non-production, stylized, human-reviewed approximation; no general Google-derived policy change. | Exact facade/frontage/order remains blocked. | Production clearance, exact trade dress, exact station geometry, exact address placement. |
| Citizens Bank | Yes for review planning, pending later card/copy boundary. | Simplified `Citizens`/bank sign cue may be proposed for MVP-29E approval. | Avoid exact logo reproduction. | Yes. | Simplified green sign/branch cue only; no exact logo/trade-dress/service claims. | Exact facade/frontage/order and branch/ATM placement remain blocked. | Official partnership, service availability, ATM location, exact address placement. |
| Greenpoint G subway | Card/label only if later boundary opens transit cue labeling. | Station cue/signage may be simplified at SE where photo-supported. | Exact station signage text only if visible in approved reference and carried forward. | Yes except the SE cue placement relationship. | No exact MTA geometry, no production transit claim. | NW/SW exact placement blocked. | Exact station geometry from MTA text alone; direct business-front adjacency where unverified. |

## Subway Cue Rule

- SE Greenpoint G cue may be planned as exact review/demo-scale cue placement because MVP-29C found supplied/approved photos sufficient for corner/orientation relationship.
- The SE cue should still be treated as authored approximate geometry, not survey-accurate station geometry.
- NW and SW cues remain symbolic, context-only, omitted, or blocked unless later approved inspectable photos verify those specific cue placements.
- MTA text may support station-area context, but it must not be used alone to infer exact station geometry.
- Any direct `in front of Grillpoint` subway claim remains blocked.

## Dunkin Exception Handling

Batu approved a narrow MVP-only SW Dunkin Google-derived reference exception because scaffolding blocks usable current field photos.

Allowed:

- Human-reviewed, stylized, truth-safe, non-production review/demo-scale SW Dunkin visual approximation.
- Broad corner massing, sign-zone, and category cues sufficient for MVP review.
- Use only for the SW Dunkin reference gap and only if MVP-29E carries the exception forward explicitly.

Blocked:

- Production use.
- Tracing.
- Texture extraction.
- Stored facade asset reuse.
- Training input.
- Generation input.
- Exact trade-dress reproduction.
- Exact facade/frontage/address placement.
- Exact subway/station geometry.
- Any general Google/Street View/3D Tiles source-policy change.

## Raster-Production Requirements For Later MVP-29E

MVP-29E must be opened separately by Batu before any raster production, asset generation, app integration, or implementation.

Before any visual production, MVP-29E must name or decide:

- Exact raster output path for the review artifact. Proposed planning target: `docs/visual-artifacts/mvp-29e-four-corner-raster-scene/generated/four-corner-manhattan-greenpoint-review.png`.
- Whether a later app-integration copy is allowed, and if so the exact future review-only asset path. Proposed future integration target for MVP-29F only: `src/assets/review-only/mvp-29-four-corner-manhattan-greenpoint.png`.
- Approved input reference paths from `docs/mvp-reference-images/`, including which NW HEIF-wrapped files are excluded unless re-exported.
- Allowed candidates and cues: Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, Greenpoint G SE cue, and only symbolic/contextual NW/SW subway cues unless later verified.
- Raster label/sign treatment for each candidate, including whether each real label appears in raster art, card UI, both, or neither.
- Brand/trade-dress constraints for McDonald's, Dunkin', Citizens Bank, and Grillpoint Deli.
- Card, marker, tether, hotspot, and selected-state expectations, including which MVP-22 interaction lessons should carry forward.
- Blocked claims and exactness limits.
- Screenshot requirements for MVP-29G/MVP-30, including default overview, selected card, hover/focus, QA outline/hotspot, mobile containment, and pan/zoom stress.
- File allowlist for MVP-29E. It should include only the MVP-29E packet and approved review-output artifact paths unless Batu explicitly opens broader files.
- Whether the scene must be a single unified raster plate or whether layered export/sprite composition is allowed.
- If layered export/sprite composition is allowed, the exact layer/sprite naming, ownership/provenance notes, and integration boundary.
- How MVP-22 lessons are preserved without treating MVP-22 as final art: raster-first normal world surface, source-backed card discipline, limited truth claims, selected-card attachment, mobile containment goals, and QA evidence expectations.

Recommended MVP-29E production shape:

- Prefer one unified raster scene plate for the first four-corner recovery artifact unless Batu explicitly wants a layered/sprite plan.
- Allow companion crop/contact-sheet evidence only as review support, not as app assets.
- Keep all output labeled non-production and review/demo-scale.
- Do not use code-native buildings, storefronts, sidewalks, roads, props, textures, or signs as the primary world art.

## MVP-29D Acceptance Criteria

This brief passes only if Batu can judge:

- What the four-corner scene should contain.
- Which candidate belongs to NW, NE, SW, and SE.
- What each business can visually claim.
- What each card/cue can say later, subject to the next card/copy boundary.
- Which exact claims are still blocked.
- Which subway cue may be exact at review/demo scale and which cues remain symbolic/context-only/blocked.
- How Dunkin's narrow MVP-only exception is contained.
- What MVP-29E would be allowed to produce, and what it must still ask Batu to approve.

## Blocked Work

- Rendering, regenerating raster art, or creating/modifying visual assets.
- App source edits, `src/` changes, target additions, card-copy changes, hotspot changes, styling changes, package/tooling changes, screenshots, staging, or commit.
- Opening MVP-29E without Batu accepting or revising this brief.
- Production/public-release claims.
- Production assets, production asset direction, or production asset pipeline.
- Exact facade, exact frontage/order, exact address placement, exact branch/ATM placement, exact station geometry, ratings, reviews, `open now`, endorsement, partnership, or official collaboration claims.
- Using Google/Street View/3D Tiles-derived sources beyond Batu's narrow SW Dunkin MVP exception.
- Treating MVP-22/MVP-22C as final MVP art or final MVP completion.

## Exit Verdict

Verdict: `proceed-to-mvp-29e-with-limits`

Reason:

- MVP-29C's accepted reference state can support a later MVP-29E raster-first production/integration boundary.
- The four-corner composition is now defined at planning level.
- All four active business candidates can be included as `ready-with-limits` visual-planning subjects.
- The SE Greenpoint G cue can be planned as exact review/demo-scale cue placement, while NW/SW cues remain symbolic/context-only or blocked.
- Dunkin remains viable only under Batu's narrow MVP-only, non-production, stylized exception.

This verdict does not open MVP-29E, visual production, source edits, app integration, screenshots, staging, or commit. Batu must accept or revise MVP-29D before MVP-29E opens.

## Recommended Next Task

After Batu accepts or revises this brief:

`MVP-29E Four-Corner Raster Scene Production / Integration Boundary`
