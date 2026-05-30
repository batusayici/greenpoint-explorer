# Current Execution Brief - Pending MVP-18 Review

Status: MVP-18 Real Corner Evidence Recovery is complete for Batu review, and MVP-19/20/21 sequencing is reconciled. No next task is approved yet.

Owner boundary: Batu owns the MVP-18 verdict, final intersection boundary, first-corner selection, real-place representation decisions, field-reference approval, and any later visual or implementation approval. Codex must not proceed into field-photo intake, visual translation, source implementation, asset work, renderer work, screenshots, staging, or commit unless Batu opens a later current brief.

## Current Outcome

Completed task:

- `MVP-18 Real Corner Evidence Recovery`

Artifact:

- `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md`

Verdict:

- `revise`

Reason:

- The active place set now has a plausible four-corner address/lot structure around Greenpoint Ave x Manhattan Ave, but no active business has approved storefront/frontage evidence and no real-facade visual reference is currently allowed for art translation.

MVP-17 remains accepted only as the product-facing raster interaction polish baseline. It is not accepted as a truthful or recognizable Greenpoint Ave x Manhattan Ave scene.

## Recommended Next Task

Proposed next task, pending Batu approval:

- `MVP-19 One-Corner Field Photo Supply Gate`

Recommended task type:

- Docs/evidence supply gate only.
- No app/source implementation.
- No generated art.
- No visual polish.
- No renderer work.
- No screenshots.
- No scraping.
- No live data pipeline.
- No Google/Street View/3D Tiles-derived stored imagery or extraction.
- No production/public-release claims.
- No staging or commit.

Goal of the proposed next task:

- Obtain or explicitly approve owned/non-Google field-reference photos for the northwest Greenpoint Deli / 903 Manhattan Ave corner.
- Confirm current business status, storefront frontage, entrance position, and any signage/facade cues visible in owned/approved references.
- Distinguish which evidence steps are repeatable at Greenpoint scale versus which require fieldwork, manual desktop research, or Batu judgment.
- Decide whether a later task can open a one-corner real-facade art translation brief.

This recommended task is not approved until Batu explicitly opens it.

## MVP-19 Required Scalability Assessment

MVP-19 is not complete if it only supplies photos or visual references. It must include a concise repeatability/scalability readout that shows whether the one-corner evidence method can become a repeatable Greenpoint workflow.

Required classification categories:

1. `automated-public-data-repeatable`
2. `manual-desktop-research-repeatable`
3. `field-photo-required`
4. `Batu-judgment-required`
5. `blocked-or-not-scalable`

Required evidence rows:

- Building footprint / massing.
- Lot / parcel / BBL.
- Address confirmation.
- Business identity.
- Business active status.
- Storefront frontage.
- Storefront order / adjacency.
- Facade cues.
- Signage / awning / brand treatment.
- Subway entrance / transit anchor.
- Visual-reference eligibility.
- Card copy eligibility.
- Isometric placement confidence.

For each row, MVP-19 must record:

- Source path used or proposed.
- Classification category.
- Confidence.
- Manual effort required.
- Whether the source path plausibly scales to 20, 100, and 500 storefronts.
- Blocker, mitigation, or reason the item should remain manual.

Required exit outputs:

1. Selected-corner photo/reference packet, or an explicit blocked-corner verdict.
2. Provenance and visual-use status for every owned/approved reference.
3. Current-status, storefront/frontage, entrance-position, and facade-cue notes.
4. Repeatability/scalability readout using the rows and categories above.
5. Recommendation for MVP-20: proceed, revise, cut, or choose a different target.

Stop condition:

- If MVP-19 supplies photos but does not classify evidence repeatability, stop and revise the packet before opening MVP-20.
- If MVP-19 cannot establish whether the selected-corner workflow plausibly scales beyond one hand-authored corner, do not open MVP-20 as an implementation-adjacent translation boundary; return a `revise` verdict with the scalability blocker documented.

## Later Sequencing Note

- MVP-19 only supplies, approves, or blocks owned/non-Google field/reference evidence and records a repeatability/scalability readout for the one-corner evidence method.
- MVP-19 does not authorize real-corner art translation, raster integration, real-place cards, UI claims, renderer work, source edits, screenshots, demo freeze, or production claims.
- MVP-20 Real-Corner Translation Boundary must follow MVP-19 before any real-corner art translation or raster integration can be considered.
- MVP-20 is a docs-only translation boundary that reconciles evidence, Place/Building/Storefront/MapAnchor relationships, allowed and blocked visual references, truth constraints, treatment recommendations, and the proposed downstream implementation boundary.
- MVP-21 One-Corner Raster Integration / Visual Pass may only follow after MVP-20 is accepted by Batu and a new current brief explicitly opens the tightly scoped implementation boundary.
- MVP QA And Demo Freeze must not occur directly after MVP-19.

## Active Scene / Evidence State

Active scene/place set:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

MVP-18 recommended evidence boundary:

- Full compact four-corner evidence boundary around Greenpoint Ave x Manhattan Ave:
  - NW: Greenpoint Deli candidate at 903 Manhattan Ave.
  - NE: McDonald's candidate at 904 Manhattan Ave within the 900/902/904 Manhattan Ave tax lot/building.
  - SW: Dunkin' candidate at 893 Manhattan Ave within the 893/895/897 Manhattan Ave tax lot/building.
  - SE: Citizens Bank candidate at 896 Manhattan Ave within the 894/896/898 Manhattan Ave tax lot/building.
  - Transit context: Greenpoint Av G subway station area.

MVP-18 recommended first target:

- Northwest Greenpoint Deli / 903 Manhattan Ave, gated behind owned/non-Google field-reference evidence and current-status confirmation.

## Still Forbidden Unless A Later Brief Opens Scope

- Field-photo intake or reference approval work.
- Real-corner translation boundary work.
- App/source implementation.
- Visual asset generation.
- Visual polish.
- Renderer work.
- Screenshots.
- New assets.
- Scraping.
- Live data pipeline.
- Google/Street View/3D Tiles-derived stored imagery, extraction, tracing, texture reuse, training input, generation input, or facade-reference use.
- LiveXYZ-derived facade/art use.
- Production/public-release claims.
- Staging or commit.

## Decisions Reserved For Batu

- Accept, revise, or reject the MVP-18 `revise` verdict.
- Approve, revise, or reject the proposed four-corner evidence boundary.
- Approve, revise, or reject northwest Greenpoint Deli / 903 Manhattan Ave as the first field-photo target.
- Decide whether McDonald's, Dunkin', and Citizens Bank remain real card candidates, context-only anchors, fictionalized storefronts, or cut/deferred targets.
- Decide whether Greenpoint G subway remains symbolic only or later needs exact access-point verification.
- Approve or reject the proposed `MVP-19 One-Corner Field Photo Supply Gate`.
- Decide whether MVP-19 should use the required scalability assessment as a hard exit criterion before MVP-20 can open.
