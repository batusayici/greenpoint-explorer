# MVP-20 Real-Corner Translation Boundary

Status: Complete for Batu review
Date: 2026-05-30
Artifact class: Level 0 docs-only translation-boundary packet
Scope: Evidence-to-scene translation planning only; no implementation, renderer work, raster integration, screenshots, generated art, new assets, scraping, live data, staging, or commit

## Executive Verdict

Verdict: `proceed-to-mvp-21`.

Recommendation: open a later, tightly scoped `MVP-21 One-Corner Raster Integration / Visual Pass` only if Batu accepts this boundary and explicitly approves the implementation brief.

Reason: MVP-19 supplied owned/non-Google northwest corner references for 903 Manhattan Ave. The references are strong enough to plan a recognizable one-corner translation, but they also reveal a required truth correction: visible storefront signage reads `GRILLPOINT DELI`, while current app/data and prior docs refer to Greenpoint Deli.

MVP-20 does not approve app/source edits, raster integration, screenshots, production assets, real-place production cards, final public card copy, exact facade claims, exact storefront frontage/order claims, exact address placement claims, or exact station geometry.

## Scope Check

MVP-20 is consistent with `docs/MVP_SCOPE.md`, `docs/PLAN.md`, and `docs/CURRENT_EXECUTION_BRIEF.md` because it is a docs-only translation boundary between field/reference evidence and any later visual implementation.

This packet may:

- Reconcile selected-corner evidence.
- Define Place / Building / Storefront / MapAnchor relationships at conceptual review level.
- Identify allowed and blocked visual references.
- Define truth constraints, allowed stylization, and stop conditions.
- Recommend a downstream MVP-21 implementation boundary for Batu review.

This packet may not:

- Modify app/source files.
- Generate or edit art.
- Integrate raster material.
- Create screenshots.
- Create production assets.
- Approve final factual card copy or public-release claims.
- Open MVP-21 by itself.

## Active Scene Confirmation

Current durable active scene/place set:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

Source confirmation:

- `src/mvpPlaceData.js` still contains `greenpoint-deli`, `mcdonalds`, `dunkin`, `citizens-bank`, and `greenpoint-g`.
- `src/mvpPlaceData.js` still displays the selected target as `Greenpoint Deli`.
- MVP-19 supplied field references show visible `GRILLPOINT DELI` signage at `903`, creating a naming conflict for the next implementation boundary.

## Selected Corner Confirmation

Selected corner:

- NW corner / west side of Manhattan Ave north of Greenpoint Ave.
- Candidate address: `903 Manhattan Ave, Brooklyn, NY 11222`.
- Prior official lot/building evidence from MVP-18: BBL `3025580051`, BIN `3064720`, block `2558`, lot `51`.
- Selected storefront identity for translation planning: `GRILLPOINT DELI` visible in supplied field reference, mapped from prior Greenpoint Deli candidate until Batu approves a source/data label correction.

Boundary:

- Translate one corner first: the 903 Manhattan Ave storefront and immediate corner context.
- Include enough adjacent context to avoid false isolation: neighboring cleaner/storefront, building mass, corner traffic/street-sign context, and Greenpoint Av subway entrance context.
- Do not translate the full four-corner intersection in MVP-21 unless Batu explicitly expands scope.

## Evidence-To-Scene Matrix

| Element | Evidence | Confidence | Translation status | MVP-21 treatment |
| --- | --- | --- | --- | --- |
| Business / place label | App/data says Greenpoint Deli; supplied photos show `GRILLPOINT DELI` signage at `903`. | Medium-high for visible sign; medium-low for official public business identity. | `manual-review-required` | Use `GRILLPOINT DELI` only if Batu approves the correction. Otherwise use a fictional-safe deli sign or generic `Deli` treatment. |
| Address / lot | MVP-18 official city evidence for `903 Manhattan Ave`, BBL `3025580051`, BIN `3064720`. | Medium-high for review planning. | `partial` | May anchor selected corner as 903 Manhattan Ave in internal review notes; avoid exact public placement claims. |
| Building massing | MVP-18 MapPLUTO facts plus supplied photos showing a salmon/pink multi-story corner building. | Medium. | `partial` | Stylize as a compact 3-4 story corner mass; no exact dimensions or floor-by-floor claim. |
| Storefront frontage | Supplied northwest field photos show storefront wraps/meets the corner with adjacent storefront context. | Medium-high. | `partial` | Represent as corner-facing deli frontage with approximate width/order. Do not claim survey-accurate storefront width. |
| Entrance position | Supplied photo shows entrance zone near/under `903` and signage. | Medium. | `partial` | Use approximate entrance cue near the corner storefront. Keep exact doorway placement manual-review-required. |
| Signage / awning | Supplied photo shows `GRILLPOINT DELI`, green circular `G` marks, dark sign band/awning area, dense window/menu treatment. | Medium-high. | `manual-review-required` | Batu must decide exact sign text vs stylized/generic treatment. Exact logo-like reproduction is not automatically approved. |
| Facade cues | Supplied photo shows salmon/pink facade, black window trim, upper-floor windows, ground-floor storefront clutter, adjacent green awning/cleaner. | Medium-high. | `partial` | Use recognizable cues: warm facade color, dark trim, compact deli clutter, sign band, neighboring storefront rhythm. Avoid exact texture tracing. |
| Subway / transit anchor | Supplied photo shows subway entrance context; MVP-18 MTA evidence supports Greenpoint Av station context. | Medium for symbolic context. | `partial` | Include symbolic Greenpoint G entrance cue near the corner. Do not claim exact stair/elevator/station geometry. |
| Adjacent storefronts | Supplied photos show immediate neighbors, including cleaner/storefront context. | Medium. | `context-only` | Use simplified adjacent storefront masses to support corner recognition; avoid real-card claims. |
| Card copy | Photo supports current-condition visual context; official business source still unresolved. | Low-medium. | `manual-review-required` | Keep public factual copy blocked. A review-only card may say name/status under review. |
| Isometric placement | MVP-18 boundary + supplied photos support NW quadrant relationship. | Medium. | `manual-review-required` | Use authored compressed placement that preserves side-of-street/corner truth; no exact map geometry claim. |

## Conceptual Place / Building / Storefront / MapAnchor Boundary

These records are planning concepts only. They do not create runtime schemas, source modules, public interfaces, or production data contracts.

### Place

- Proposed review id: `grillpoint-deli-candidate`.
- Current source id conflict: `greenpoint-deli`.
- Display name status: `manual-review-required`.
- Recommended display name for MVP-21 review: `GRILLPOINT DELI` if Batu approves photo-derived naming; otherwise `Deli` or fictional-safe variant.
- Category: deli / food retail.
- Address: `903 Manhattan Ave`, review-only, not final public claim.
- Status: field-observed current-condition evidence from 2026-05-30 photo; final active status still not public-copy-ready.
- Verification status: `partial`.
- Approval status: `proposed`.

### Building

- Proposed review id: `building-903-manhattan-ave`.
- Address container: `903 Manhattan Ave`.
- Lot evidence: BBL `3025580051`, BIN `3064720`.
- Building treatment: compact salmon/pink corner mass with dark-trim windows, stylized and compressed.
- Verification status: `partial`.

### Storefront

- Proposed review id: `storefront-903-manhattan-ave-corner-deli`.
- Parent building: `building-903-manhattan-ave`.
- Place link: `grillpoint-deli-candidate` / current `greenpoint-deli` candidate.
- Frontage notes: corner deli storefront with visible sign band, dense window/menu treatment, entrance zone near the corner, adjacent cleaner/storefront context.
- Placement confidence: `medium`.
- Manual override required: yes.

### MapAnchor

- Proposed review id: `map-anchor-nw-903-deli`.
- Approximation type: `compressed`.
- Truth constraints:
  - Must remain NW / west side of Manhattan Ave north of Greenpoint Ave.
  - Must not move to a different street or quadrant.
  - Must not imply the adjacent cleaner/storefront is the same place.
  - Must not imply exact station geometry.
- Allowed approximation:
  - Compress sidewalk, street width, and storefront depth.
  - Simplify facade and sign proportions.
  - Use symbolic subway cue.
  - Preserve corner-facing deli identity and immediate adjacency logic.

## Approved / Blocked References

Allowed for MVP-20 review and proposed MVP-21 planning, pending Batu approval:

- `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg`
- `docs/mvp-reference-images/northwest-subwayA.jpg`

Use limits:

- Review-only visual translation planning.
- Non-production.
- No texture extraction, tracing, exact facade copy, training input, or production asset claim.
- No public-release real-place card claims.
- No exact station geometry claims.

Blocked:

- Deleted historical `docs/mvp-reference-images/source-01-northwest-corner.png`, `source-03-northeast-corner.png`, `source-04-southwest-corner.png`, and `source-05-southeast-corner.png`.
- Google Maps, Google Street View, Google 3D Tiles, and derivatives.
- LiveXYZ-derived facade/art use.
- Copied web imagery, business promotional images, downloaded logos, or brand assets.
- MVP-17 raster plate as factual Greenpoint facade evidence.

## Recognizable Translation Rules

MVP-21 may represent recognizably:

- A salmon/pink multi-story corner building mass.
- A corner deli storefront at 903 Manhattan Ave.
- A dark storefront sign/awning band.
- A `GRILLPOINT DELI` sign only if Batu approves photo-derived sign text for review use.
- Green circular sign accents or generalized green deli markers.
- Dense deli window/menu/merchandise texture as hand-painted shorthand.
- Approximate entrance zone near the corner.
- Adjacent cleaner/storefront context as non-clickable/context-only.
- Symbolic Greenpoint G subway entrance context.

MVP-21 must generalize or stylize:

- Facade proportions, window count, brick/stucco texture, storefront clutter, sign scale, and awning geometry.
- Subway entrance railings/signage and exact street furniture.
- Adjacent storefront signage unless separately approved.

MVP-21 must fictionalize, omit, or defer:

- Exact facade reproduction.
- Exact storefront width/frontage/order claims.
- Exact door placement.
- Exact station access geometry.
- Final public active-status claims.
- Final factual card description.
- Any unapproved brand/logo/trade-dress reproduction.

## Treatment Recommendation By Active Place

| Active place | MVP-20 treatment | Rationale |
| --- | --- | --- |
| Greenpoint Deli / `GRILLPOINT DELI` | First real-corner translation target, name manual-review-required. | Supplied references support recognizable storefront translation; naming conflict must be resolved before public card/source data changes. |
| McDonald's | Context-only or deferred. | Not needed for the first one-corner raster pass; exact brand/facade treatment still needs separate reference and approval. |
| Dunkin' | Deferred. | Outside the one-corner MVP-21 slice unless Batu expands scope. |
| Citizens Bank | Deferred / fallback only. | Stronger official identity evidence but not the selected first local storefront target. |
| Greenpoint G subway | Symbolic context anchor. | Helps local recognition; exact geometry remains blocked. |

## Proposed MVP-21 Implementation Boundary

MVP-21 should be a tightly scoped one-corner raster integration / visual pass only after Batu approves a new current brief.

Allowed proposal:

- Use supplied northwest corner field references as review-only source material for a new one-corner raster plate, layered raster export, or approved raster sprite/asset-kit composition.
- Preserve the existing interaction shell/card/target behavior in principle, but update only if a later current brief explicitly lists allowed source files.
- Represent only the NW selected corner plus minimal adjacent context.
- Keep all real-place copy review-only and truth-safe.
- Label the output non-production / review-only.

Required preflight for MVP-21:

- State public interfaces/module boundaries before source edits.
- List exact files allowed for editing.
- Identify the primary raster source path or supplied raster asset path before implementation starts.
- Confirm whether `GRILLPOINT DELI` exact sign text is approved, generalized, or fictionalized.
- Confirm whether any source data label may change from Greenpoint Deli to Grillpoint Deli.
- Define screenshot/self-audit requirements if screenshots are requested.

Blocked in MVP-21 unless a later brief explicitly opens it:

- Full four-corner implementation.
- Renderer replacement.
- New framework/package/config/tooling.
- Production asset pipeline.
- Live data or scraping.
- Public release card copy.
- Exact facade, address, frontage/order, or station geometry claims.
- Google/Street View/3D Tiles-derived imagery or extraction.

## Acceptance Criteria For MVP-21

If opened, MVP-21 should pass only if:

- The normal-mode world surface is raster-first, not code-native buildings/storefronts/signs.
- The NW corner reads as locally specific and tied to the supplied field references.
- The treatment preserves truth constraints: no wrong street, wrong quadrant, false adjacency, exact geometry claim, or unsupported active-status claim.
- Cards/labels disclose review-only status and unresolved naming/source state.
- Existing interaction behavior is preserved or explicitly scoped for change.
- Verification requested by the future current brief is completed.

## Stop Conditions

Stop before or during MVP-21 if:

- Batu does not approve the MVP-20 boundary.
- Batu does not approve how to handle Greenpoint Deli vs `GRILLPOINT DELI`.
- A primary raster source for the one-corner visual pass is not supplied or approved.
- The implementation would need to trace, copy, extract, or texture from Google/Street View/3D Tiles, LiveXYZ, copied web imagery, or blocked historical screenshots.
- The visual pass would require source edits beyond an approved file list.
- The result would imply exact public facts that remain manual-review-required.

## Unresolved Decisions For Batu

- Accept, revise, or reject this `proceed-to-mvp-21` recommendation.
- Decide whether the active place label changes from Greenpoint Deli to `GRILLPOINT DELI`, remains Greenpoint Deli for now, or becomes fictional-safe.
- Decide whether exact `GRILLPOINT DELI` sign text may appear in a review-only raster pass.
- Decide whether public card copy remains blocked, becomes review-only, or is fictionalized.
- Decide whether MVP-21 should use a supplied raster plate, a layered raster export, or an approved raster sprite/asset-kit composition.
- Open or reject the future MVP-21 implementation boundary.

## Source And Scope Notes

- Required docs read: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/MVP_SCOPE.md`, `docs/PLACE_SCHEMA.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md`, and `docs/mvp-review/mvp-19-one-corner-field-photo-supply-gate/README.md`.
- Active source data was inspected for the current place set and the existing `greenpoint-deli` label.
- No app/source files were edited.
- No renderer work, visual generation, raster integration, screenshots, scraping, live data pipeline, new assets, staging, or commit was performed.
- No Google/Street View/3D Tiles-derived imagery was stored, copied, transformed, traced, extracted, used as generation input, used as training input, or used as facade reference.
