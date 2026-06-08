# Phase 4J-3 Candidate Gap + Readiness Report

Status: 4J-3 candidate gap + readiness report complete.

## Summary

The QA-only storefront bay/frontage candidate layer is useful as a review scaffold for later evidence/business linkage planning, but it is not safe to promote. It provides visible generic frontage/bay guide structure across the existing 4O scaffold anchors without adding real storefront, facade, entrance, sign, address, tenant, business, height, roof, production, or public claims.

## Candidate Coverage

- Candidate records: 22 QA-only records.
- Existing 4O building anchors covered: 10 of 10.
- Normal-mode records: 0.
- Candidate types:
  - `frontage_band_candidate`: 10.
  - `bay_rhythm_candidate`: 4.
  - `corner_wrap_candidate`: 4.
  - `setback_depth_candidate`: 4.
- All records remain `not_verified`, QA-only, review-only, and non-promoted.

## Visible Usefulness

- The overlay makes it easier to inspect which 4O building anchors may later need frontage segmentation review.
- The frontage-band guides show a generic street-edge review lane for every 4O building anchor.
- The bay-rhythm guides are useful as a placeholder for later segmentation questions, but they do not establish actual bay count or bay order.
- The corner-wrap guides are useful at Manhattan and Franklin endpoint anchors, but they do not establish exact corner frontage, side returns, entrances, signs, or tenant placement.
- The setback/depth guides are useful for spotting where later evidence may need depth/setback review, but they do not establish exact depth, setback, height, roof, or facade geometry.

## Normal-Mode Isolation

- Normal mode remains protected.
- QA candidate overlays are gated by QA mode.
- Runtime readout remains `4J candidates: 22 visible / 22 QA / 0 normal` in QA mode and `QA off` in normal mode.
- No public interface, production surface, source promotion, or claim promotion was added.

## Blocked Fields

The following remain blocked for every 4J candidate:

- Business identity.
- Tenant identity.
- Exact storefront.
- Exact frontage.
- Facade.
- Sign.
- Entrance.
- Exact address.
- Exact height.
- Roof form.
- Production claim.
- Public/product claim.

## Gap Classification

| Gap category | Applies to | Review note |
| --- | --- | --- |
| `missing_facade_photo_evidence` | All 22 candidates | No approved facade photo evidence is linked to these candidates. |
| `missing_frontage_segmentation_evidence` | All 22 candidates | Candidate bands do not prove storefront divisions, frontage order, or exact bay count. |
| `missing_entrance_evidence` | All 22 candidates | No candidate identifies entrances or door placement. |
| `missing_sign_band_evidence` | All 22 candidates | No candidate identifies signs, sign bands, logos, or tenant text. |
| `missing_corner_wrap_evidence` | 4 corner-wrap candidates | Corner-wrap guides are generic and need evidence before any corner frontage/return claim. |
| `missing_depth_or_setback_evidence` | 4 setback/depth candidates | Depth/setback guides are generic and need evidence before any depth or setback claim. |
| `missing_business_source_linkage` | All 22 candidates | No business/source records are linked. |
| `insufficient_spatial_confidence` | All 22 candidates | Candidate placement is derived only from existing 4O review anchors, not source-backed frontage evidence. |

## Unsafe To Promote

- Exact storefronts.
- Exact frontage/order.
- Entrances.
- Facades.
- Signs or sign bands.
- Tenant or business linkage.
- Exact address placement.
- Exact height or roof form.
- Production/public claims.
- Normal-mode rendering.

## Proposal Only

Proposed next phase for Batu review: a later evidence/business linkage planning packet could define what evidence would be required to connect these QA-only candidates to facade photos, frontage segmentation, entrance evidence, sign-band evidence, and business source linkage.

This is only a proposal. 4J-3 does not start evidence linkage, source access, business/source linkage, facade evidence intake, normal-mode promotion, or claim promotion.

## Verification

- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `node scripts/verify-phase-4j-3-candidate-readiness-report.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `npm run build`
- `git diff --check`
- `git status --short`

## Review Gate

Stop here for Batu review.
