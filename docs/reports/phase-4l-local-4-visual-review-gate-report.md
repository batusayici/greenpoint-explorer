# Phase 4L-Local-4 Visual Review Gate Report

Status: 4L-Local-4 visual review gate complete.

## Decision

The repo-local evidence pipeline is useful enough to justify a later Mapillary/KartaView scaling proposal, but not direct external evidence intake.

Recommended next packet: a Mapillary/KartaView source-use gate that decides terms, attribution, metadata, link-out, cache/display, and allowed-use boundaries before any external source access.

## What Improved

- The runtime now has a visible 4L local-evidence QA layer for six endpoint corner cue records.
- All 22 existing repo-local Batu-supplied evidence IDs are represented through QA-only enriched cue records.
- Manhattan/Greenpoint and Franklin/Greenpoint endpoint corners now read with stronger palette-family, facade-rhythm, bay-rhythm, sign-band-zone, window/glass rhythm, corner-wrap, depth/setback, and sidewalk-grounding cues.
- QA readouts now distinguish local evidence-backed cue status from generic 4K recognizability cues and 4J frontage candidates.

## More Recognizable Corners

- Manhattan/Greenpoint: stronger warm-brick, bright-panel, pale-stone, sign-band-zone, window-rhythm, corner-wrap, and subway-context review cues.
- Franklin/Greenpoint: stronger weathered-brick/glass-base, dark-brick/awned-base, red-brick/cornice, corner-return, bay-rhythm, and sidewalk-edge review cues.

## Worked Best

- `color_material_family`: broad palette families are visually useful without exact material/color claims.
- `facade_rhythm`: coarse upper-window and facade rhythm improves endpoint identity.
- `storefront_bay_rhythm`: generic bay ticks improve street-level cadence without exact frontage/order claims.
- `awning_canopy_sign_band_zone`: zones help recognition while avoiding text, logo, or trade-dress claims.
- `corner_wrap_side_return`: endpoint corners benefit most from local evidence.

## Still Weak

- Mid-corridor remains generic because no repo-local mid-corridor facade evidence is indexed.
- Subway/entrance cues remain context markers only; exact entrance claims stay blocked.
- Material and color remain broad families, not exact truth.
- Storefront order, tenant frontage, exact frontage width, sign text, logos, active status, and business identity remain blocked.
- Distinct evidence records per facade/cue target are still needed before scaling beyond endpoints.

## Remaining Evidence Gaps

- Mid-corridor facade references for both sides.
- Side-return/corner-wrap references for more transition anchors.
- Depth/setback references for streetwall variation beyond endpoints.
- Street-furniture and sidewalk-grounding evidence for non-corner areas.
- Subway/entrance-specific evidence if those cues should remain visible beyond generic context.
- Distinct records per facade/cue target so one image is not overextended.

## Mapillary/KartaView Need

External street-level imagery would need to provide:

- mid-corridor facade visibility;
- repeated bay/rhythm visibility;
- corner-wrap and side-return angles;
- material/color-family support;
- sidewalk/street-furniture context;
- entrance/subway context where relevant;
- occlusion, blur, angle, and recency review fields;
- attribution, license, link-out, cache/display, and allowed-use rules accepted before access.

## Batu-Supplied Photo Need

If external source work stays deferred, Batu would need to supply:

- mid-corridor photos on both corridor sides;
- wider side-return/corner-wrap photos;
- sidewalk/street furniture context photos;
- dedicated subway/entrance context photos if those cues should be retained;
- one review record per intended facade/cue target.

## Blocked Scope Avoided

- No Mapillary/KartaView work was opened.
- No external source was accessed.
- No downloads, cache, ingestion, or conversion occurred.
- No new evidence files were added.
- No business, tenant, sign text, logo, POI, active-status, source-record, or exact frontage linkage was introduced.
- No QA cue was promoted to a factual, production, public, or normal-mode claim.

Stop here for Batu review.
