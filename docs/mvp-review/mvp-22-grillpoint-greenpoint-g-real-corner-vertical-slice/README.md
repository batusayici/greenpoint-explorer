# MVP-22 Grillpoint / Greenpoint Ave G Real Corner Vertical Slice

Status: Stage A approved-with-constraint; Stage B brief prepared, app integration not started
Date: 2026-05-30
Artifact class: Evidence packet, source/reference inventory, and proposed composition decision
Scope: NW Grillpoint / Greenpoint Ave G real-corner vertical slice planning only; no app integration, renderer work, generated art, production assets, scraping, live data, backend, CMS, analytics, staging, or broad map systems

## Executive Verdict

Verdict: `approved-with-constraint-for-stage-b-planning`.

Batu approves MVP-22 Stage A with constraints:

- Grillpoint identity, address, and visible sign evidence are supportable for Stage B planning.
- Greenpoint Ave G may be used as nearby/adjacent transit context.
- Do not claim the subway entrance is directly in front of Grillpoint unless stronger field/photo evidence supports that exact spatial relationship.
- Stage B may open as a raster-first real-corner vertical slice.
- Stage B must remain one corner only and must not begin app integration until the current execution brief explicitly opens implementation.

MVP-22 moves beyond the MVP-21 generalized fallback only as a controlled, evidence-aware vertical slice. This packet remains a two-stage gate:

1. Stage A: verify Grillpoint identity/address/sign evidence, Greenpoint Ave G context, visual-reference eligibility, and a truthful diorama composition.
2. Stage B: after Stage A acceptance and a precise Stage B brief, produce or integrate one raster-first art-directed scene and factual card treatment using the real Grillpoint label only within the approved evidence and sign-label constraints.

No app/source implementation is performed by this packet. Stop before implementation if evidence does not support the real Grillpoint + station relationship needed for the selected composition.

Stage B implementation brief:

- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/STAGE_B_IMPLEMENTATION_BRIEF.md`

## Purpose

MVP-22 tests whether the project can move from a generalized fallback card to one real-place, art-directed vertical slice:

- One corner only.
- Grillpoint / 903 Manhattan Ave as the candidate real place.
- Greenpoint Ave G station entrance as nearby transit context only when evidence supports the spatial relationship being shown.
- Raster-first art direction only; no code-native storefront, sign, facade, building, road, prop, or texture art as the primary world surface.

## Current Evidence Summary

| Claim | Evidence | Confidence | MVP-22 treatment |
| --- | --- | --- | --- |
| Business identity | Supplied NW field photo shows visible `GRILLPOINT DELI` signage; Restaurantji lists `Grillpoint Deli` at 903 Manhattan Ave; OpengovNY search result lists `Grillpoint Deli Corp` at 903 Manhattan Ave with 2025-02-10 liquor-license issue-date context. | Medium-high for display/sign identity; medium for current operating status. | Real label may be proposed for Stage B only if Batu accepts the evidence packet and exact review-only sign/card treatment. |
| Address | Restaurantji and StreetEasy list 903 Manhattan Ave / 903 Manhattan Avenue, Brooklyn, NY 11222; prior MVP-18/19/20 records BBL `3025580051`, BIN `3064720`, block `2558`, lot `51`. | Medium-high for review planning. | Card copy may use `903 Manhattan Ave, Brooklyn, NY 11222` after Stage A acceptance; visual placement must not claim survey-accurate address placement. |
| Visible sign | Supplied NW closeup field photo shows `GRILLPOINT DELI` sign band and `903`. | High for field-observed sign at capture date. | Exact sign text in raster art remains a Batu approval decision; no logo/trade-dress tracing or texture extraction. |
| Category | Restaurantji categorizes Grillpoint Deli as a deli; field photo shows deli/juice/food retail storefront cues. | Medium-high. | Factual card category can be `Deli / food retail` if Stage A is accepted. |
| Current status | Field photo dated 2026-05-30 shows storefront present/apparently operating; Restaurantji was crawled recently and lists hours/contact. | Medium, not final. | Card can use `lastVerified: 2026-05-30`; avoid stronger active-status claims such as `open now` unless separately verified and approved. |
| Greenpoint Ave G context | MTA sources support Greenpoint Av as a G station and accessibility/elevator context on Manhattan Ave; supplied field photo shows subway entrance/railing/signage in the Grillpoint corner context. | Medium for adjacent/nearby transit context; low for exact station geometry. | Show as adjacent/nearby symbolic transit context. Do not state or imply exact “in front” placement unless Batu accepts that specific field-photo interpretation. |
| Station relationship to Grillpoint | Supplied field photo visually shows a station entrance/railing/sign in the foreground near the Grillpoint storefront. Public web sources found during this pass support that the G station is very near 903 Manhattan Ave, but the official MTA text reviewed does not by itself prove the exact “in front of Grillpoint” relationship. | Medium from field photo; unresolved as a public exact-geometry claim. | Proposed composition: place a Greenpoint Ave G entrance as adjacent foreground/context near the corner, not as a precise in-front claim. |

## Source / Reference Inventory

| Source or reference | Type | Supports | Limits |
| --- | --- | --- | --- |
| `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg` | Batu-supplied owned/non-Google field reference, Apple iPhone 15 Pro EXIF, 2026-05-30 16:43:29. | Visible `GRILLPOINT DELI` sign, `903`, storefront/facade cues, entrance zone, neighboring cleaner context, subway entrance/railing/signage in foreground context. | Review-only, non-production. Do not trace, extract texture, reproduce trade dress exactly, or make exact facade/address/station-geometry claims. |
| `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpeg` | Batu-supplied owned/non-Google field reference, HEIF content with `.jpeg` extension, EXIF recorded in MVP-19. | Wider NW corner context, building massing, storefront relation, station context. | Review-only; local direct visual decode remains limited in this environment. Use only if the Stage B raster workflow can inspect it safely. |
| `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpeg` | Batu-supplied owned/non-Google field reference, HEIF content with `.jpeg` extension, EXIF recorded in MVP-19. | Facade-focused NW view. | Review-only; local direct visual decode remains limited in this environment. |
| `docs/mvp-reference-images/northwest-subwayA.jpeg` | Batu-supplied owned/non-Google field reference, HEIF content with `.jpeg` extension, EXIF recorded in MVP-19. | NW subway/street context. | Review-only; exact station geometry remains unresolved. |
| Restaurantji Grillpoint Deli page | Public directory / secondary business source. | `Grillpoint Deli`, deli category, 903 Manhattan Ave, Brooklyn, NY 11222, phone/hours listing. | Secondary source; ratings/reviews/promotional claims must not be used in card copy. Not enough alone for active-status certainty. |
| OpengovNY search result for `Grillpoint Deli Corp` | Public-license aggregator / secondary official-derived source. | Corporate/business-license naming and 903 Manhattan Ave address context, with 2025-02-10 license issue-date context in search result. | Aggregator, not the primary agency record. Use as corroboration only. |
| StreetEasy 903 Manhattan Avenue building page | Public real-estate source. | Building/address context and G at Greenpoint Av listed under 500 feet. | Third-party real-estate source; do not use listing copy as public card copy except address/proximity context with caution. |
| MTA Greenpoint Av accessibility press release | Official transit source. | Greenpoint Av G station accessibility and a street-level elevator on east side of Manhattan Ave between Greenpoint Ave and Kent St. | Supports station context, not exact Grillpoint-frontage relationship. |
| MTA accessible stations page | Official transit source. | Greenpoint Av station and elevator on east side of Manhattan Ave between Greenpoint Ave and Kent St. | Supports accessible station context, not all stair locations or exact NW entrance geometry. |
| Prior MVP-18 / MVP-19 / MVP-20 packets | Internal review evidence. | BBL/BIN notes, selected NW target, field-photo provenance notes, blocked-reference policy, truth constraints. | Planning evidence only; does not approve app integration or exact claims by itself. |

## Proposed Factual Card Copy

This copy is proposed for Stage B only if Stage A is accepted and source/status concerns remain unchanged:

- Card title: `Grillpoint Deli`
- Category: `Deli / food retail`
- Address: `903 Manhattan Ave, Brooklyn, NY 11222`
- Description: `Deli at the northwest Manhattan Ave / Greenpoint Ave corner.`
- Source URL: `https://www.restaurantji.com/ny/brooklyn/grillpoint-deli-/`
- Supporting source labels: `Restaurantji`, `Batu-supplied NW field photo`, `MTA Greenpoint Av station context`
- Last verified: `2026-05-30`
- Disclaimer: `Unofficial authored prototype. This card is not an official map, directory, real-time business listing, or exact facade/address/station-geometry claim.`

Copy limits:

- Do not say `open now`.
- Do not use reviews, ratings, popularity, quality, ownership, delivery claims, hours, or promotional language.
- Do not describe the subway entrance as `in front of Grillpoint` unless Batu explicitly approves that exact spatial reading from the field references.

## Proposed Composition Decision

Recommended composition: `adjacent-corner-transit-context`.

Show:

- A compact salmon/pink corner building mass.
- A raster-first Grillpoint Deli storefront at the NW corner, with a review-approved real label only if Batu accepts exact sign text for Stage B.
- A dark sign/awning band and dense deli-window texture as art-directed shorthand.
- Greenpoint Ave G station entrance/railing/signage as adjacent foreground/context near the corner.
- One factual place card attached to Grillpoint Deli.

Do not show:

- NE / SE / SW real corners.
- Exact station geometry.
- A public claim that the subway entrance is directly `in front` of Grillpoint unless source/reference review clears that exact relation.
- Code-native storefront/sign/facade art.
- Exact facade tracing, texture reuse, logo extraction, or production asset treatment.

If the exact station relationship remains uncertain, the truthful diorama composition should compress the corner while labeling the G entrance as `nearby / adjacent transit context`, not as exact placement.

## Stage B Implementation Gate

App integration may open only from the Stage B implementation brief and only after Batu explicitly opens implementation.

Before Stage B source edits, the current brief and/or Stage B brief must name:

- The exact raster-first art asset path to integrate.
- Whether the raster asset is supplied by Batu or generated in an approved raster workflow.
- Whether exact `GRILLPOINT DELI` sign text is approved for review-only art.
- The approved factual card copy and source URL.
- The allowed app/source file list.
- Screenshot requirements.

Stop before implementation if:

- Grillpoint identity/address/sign evidence is rejected or conflicts.
- The station relationship required by the proposed composition is unsupported.
- The task needs parked NE / SE / SW references.
- The task would use Google/Street View/3D Tiles-derived extraction, texture reuse, tracing, training input, generation input, or facade-reference use.
- The task would use LiveXYZ-derived facade/art use.
- The primary world surface would be code-native storefront/sign/facade art.

## Stage B Brief Summary

The Stage B implementation brief names:

- Raster output/generation path: `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/generated/mvp-22-grillpoint-real-corner-slice.png`.
- Future app asset path, only after approved raster exists: `src/assets/review-only/mvp-22-grillpoint-real-corner-slice.png`.
- Approved input/reference paths: NW Grillpoint field photos only, `northwest-subwayA.jpeg`, and II-A / II-B raster direction references.
- Public sign-label treatment: `Grillpoint Deli` may be used for factual card/title treatment; review-only raster sign text may use stylized `GRILLPOINT DELI` only within the Stage B brief's no-tracing/no-exact-facade constraints and Batu's approval.
- Card copy: neutral factual Grillpoint card copy with Restaurantji, MTA, and Batu-supplied field-reference support, `lastVerified: 2026-05-30`, and unofficial-map disclaimer.
- Allowed files: limited to MVP-22 review packet docs/assets, the approved review-only raster asset path, `src/mvpPlaceData.js`, `src/PlaceholderWorld.jsx`, `src/App.jsx` only if selected-card/rail support requires it, and `src/styles.css` only for containment/card fit.
- Screenshot QA: desktop overview, selected Grillpoint card, hover/focus, QA outline/hotspot state, mobile containment, and pan/zoom stress; blockers must be recorded.

## Blocked Work

- Generic QA/demo freeze for this task.
- NE / SE / SW corner additions.
- Four-corner integration.
- Live data, scraping, backend, CMS, analytics, deployment, CI, or broad map systems.
- Code-native storefront/sign/facade/building/road/prop/texture art as primary world surface.
- Production assets, production asset pipeline, production place cards, exact facade claims, exact address-placement claims, exact storefront frontage/order claims, exact station-geometry claims, ratings/reviews/promotional copy, or public-release claims.

## Sources Reviewed

- Restaurantji: `https://www.restaurantji.com/ny/brooklyn/grillpoint-deli-/`
- MTA Greenpoint Av accessibility press release: `https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible`
- MTA Accessible Stations: `https://www.mta.info/accessibility/stations`
- StreetEasy 903 Manhattan Avenue building page: `https://streeteasy.com/building/903-manhattan-avenue-brooklyn`
- Prior packets: `docs/mvp-review/mvp-19-one-corner-field-photo-supply-gate/README.md`, `docs/mvp-review/mvp-20-real-corner-translation-boundary/README.md`, `docs/mvp-review/mvp-21-one-corner-raster-integration/README.md`
