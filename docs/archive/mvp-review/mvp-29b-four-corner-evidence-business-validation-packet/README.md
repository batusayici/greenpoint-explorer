# MVP-29B Four-Corner Evidence + Business Validation Packet

Status: Complete for Batu review  
Date: 2026-05-31  
Scope: Docs-only evidence and validation packet  
Verdict: `proceed-to-mvp-29c`

## Decision Summary

MVP-29B validates the active candidate set for the revised four-corner MVP target before any visual-reference completeness gate, composition brief, raster work, app integration, QA freeze, or implementation.

Active candidate set:

- Grillpoint Deli
- McDonald's
- Dunkin'
- Citizens Bank
- Greenpoint G subway

Naming resolution after Batu review: the active NW candidate label going forward is `Grillpoint Deli`. `Greenpoint Deli` is historical / archival / prior conflicting candidate language only. Do not treat `Greenpoint Deli` as the current active public label, and do not claim Greenpoint Deli and Grillpoint Deli are legally the same entity unless source evidence supports that specific claim.

Post-MVP-29C Batu decisions now supersede the original visual-readiness caveats:

- SW Dunkin visual treatment is not blocked solely because current SW references appear Google-derived. Batu approved a narrow MVP-only exception for the SW Dunkin reference gap, limited to stylized, truth-safe, non-production review/demo-scale visual approximation.
- The exception does not approve a general Google/Street View/3D Tiles policy change, production use, texture extraction, tracing, stored facade asset reuse, training input, generation input, or exact trade-dress reproduction.
- Greenpoint G subway exact cue placement may be allowed where supplied/approved reference photos clearly verify the cue's corner/orientation relationship; otherwise the cue remains symbolic, context-only, omitted, or blocked.

This packet does not approve production representation, implementation, rendering, screenshots, source edits, target additions, card-copy changes, exact geometry, or public-release claims.

The candidate set can be mapped to the four-corner scene at review-planning level, but several exact claims remain blocked. The next recommended task is `MVP-29C Four-Corner Visual Reference Completeness Gate`.

## Scope Controls

Allowed in MVP-29B:

- Validate the active four-corner candidate set from existing project evidence and source URLs.
- Record corner, address, source, confidence, treatment, and unresolved questions.
- Record visual-reference readiness using owned/approved/non-Google field-photo inventory already present in the repo.
- Reconcile `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, and `docs/MVP_EXECUTION_LEDGER.md`.

Blocked in MVP-29B:

- Rendering or regenerating raster art.
- Changing app source, touching `src/`, adding targets, or changing card copy.
- Adding screenshots.
- Opening app integration, visual production, QA/demo freeze, deployment, CI, backend, CMS, analytics, scraping, live data, or production claims.
- Using Google/Street View/3D Tiles-derived stored imagery, extraction, tracing, texture reuse, training input, or generation input.
- Using LiveXYZ-derived facade or art input.
- Making exact frontage, exact facade, exact address placement, exact station geometry, or exact entrance-placement claims without source support and Batu approval.

## Source Hierarchy

Use this order for candidate validation:

1. Official MTA sources for subway station, accessibility, entrance, and station-cue facts.
2. NYC property, tax-lot, building, GeoSearch, PAD, and MapPLUTO-style sources for address and building checks.
3. Official or high-confidence business/location/license sources where available.
4. User-owned field photos for visual-reference support when provenance is recorded.
5. Public directories only as corroboration, not as the sole source for exact placement or active-status finality.

Public directory imagery, ratings, reviews, and promotional claims are not approved for app claims or art extraction.

## Evidence Source URLs

Primary and corroborating source URLs reviewed or carried forward:

- NYC GeoSearch API documentation: https://geosearch.planninglabs.nyc/docs/
- NYC Open Data MapPLUTO API resource: https://data.cityofnewyork.us/resource/64uk-42ks.json
- McDonald's official location page, 904 Manhattan Ave: https://www.mcdonalds.com/us/en-us/location/ny/brooklyn/904-manhattan-ave/2678.html
- Dunkin' official location page, 893 Manhattan Ave: https://locations.dunkindonuts.com/en/ny/brooklyn/893-manhattan-ave/355867
- Citizens official branch page, 896 Manhattan Avenue: https://locations.citizensbank.com/ny/brooklyn/896-manhattan-avenue.html
- Restaurantji Grillpoint Deli page, 903 Manhattan Ave: https://www.restaurantji.com/ny/brooklyn/grillpoint-deli-/
- MenuWithPrice Greenpoint Deli page, 903 Manhattan Ave: https://www.menuwithprice.com/menu/greenpoint-deli/new-york/brooklyn/520383/
- MTA Greenpoint Av accessibility notice: https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible
- MTA G line text map: https://www.mta.info/maps/subway-line-maps/g-line

## Four-Corner Map / Candidate Matrix

| Corner | Candidate business or subway cue | Likely address | Likely corner/building relationship | Status | Confidence | Unresolved questions |
| --- | --- | --- | --- | --- | --- | --- |
| NW | Grillpoint Deli | 903 Manhattan Ave, Brooklyn, NY 11222 | NW corner candidate on the west side of Manhattan Ave at Greenpoint Ave; prior MVP-18 parcel/building evidence associates 903 Manhattan Ave with BBL `3025580051` and BIN `3064720`. | `needs-review` | Medium-high for address/corner candidate; medium for active-status finality. | Batu resolved the active public label as Grillpoint Deli. Greenpoint Deli remains a historical/prior conflicting label only. Exact active-status finality, storefront frontage/order, address placement, and facade geometry remain blocked. |
| NE | McDonald's | 904 Manhattan Ave, Brooklyn, NY 11222 | NE corner candidate within the 900/902/904 Manhattan Ave building/tax-lot relationship recorded in MVP-18, likely at or near the NE corner. | `needs-review` | High for business/address from official page; medium for exact building frontage/corner relationship. | Official source supports address, but exact storefront frontage, facade geometry, and relation to adjacent addresses require visual-reference review and Batu approval. |
| SW | Dunkin' | 893 Manhattan Ave, Brooklyn, NY 11222 | SW corner candidate within the 893/895/897 Manhattan Ave building/tax-lot relationship recorded in MVP-18, likely at or near the SW corner. | `needs-review` | High for business/address from official page; medium for exact building frontage/corner relationship. | Exact storefront frontage/order, sign placement, facade geometry, and relationship to subway cues require MVP-29C review. |
| SE | Citizens Bank | 896 Manhattan Ave, Brooklyn, NY 11222 | SE corner candidate within the 894/896/898 Manhattan Ave building/tax-lot relationship recorded in MVP-18, likely at or near the SE corner. | `needs-review` | High for business/address from official page; medium for exact building frontage/corner relationship. | Exact storefront frontage/order, branch entrance, ATM cue, facade geometry, and corner massing require MVP-29C review. |
| Intersection / station context | Greenpoint Av G subway | Greenpoint Av station, G line | MTA confirms Greenpoint Av station entrance/exit locations include Manhattan Ave and Greenpoint Ave, but this does not verify exact stair/elevator geometry or exact corner placement for the authored scene. | `context-only` | High for station context; low for exact entrance geometry. | Which exact station cues belong to NW/NE/SW/SE positions must be verified from official entrance data and/or approved field photos before any exact placement. Otherwise cues must remain symbolic or context-only. |

## Per-Candidate Evidence Cards

### Grillpoint Deli

- Business name: Grillpoint Deli.
- Naming note: `Greenpoint Deli` is historical / archival / prior conflicting candidate language only, not the current active public label.
- Category: Deli / food retail.
- Candidate address: 903 Manhattan Ave, Brooklyn, NY 11222.
- Source URLs:
  - https://www.restaurantji.com/ny/brooklyn/grillpoint-deli-/
  - https://www.menuwithprice.com/menu/greenpoint-deli/new-york/brooklyn/520383/
  - https://geosearch.planninglabs.nyc/docs/
  - https://data.cityofnewyork.us/resource/64uk-42ks.json
- Source type and reliability:
  - NYC address/building evidence carried forward from MVP-18: high for address/building planning context.
  - Restaurantji: public directory, medium corroboration for Grillpoint Deli identity/address, not sufficient alone for production active-status finality.
  - MenuWithPrice: public directory, low-to-medium corroboration for historical Greenpoint Deli naming at 903 Manhattan Ave.
  - User-supplied field photos from MVP-19/MVP-22: high for review-only sign/facade visual-reference support if provenance remains accepted.
- Last reviewed date: 2026-05-31.
- Current-status confidence: Medium.
- Address/building confidence: Medium-high.
- Storefront/frontage confidence: Medium-high for review-only NW corner candidate; exact frontage/order remains blocked.
- Sign/facade visual-reference availability: Available in `docs/mvp-reference-images/` for NW Grillpoint/903 Manhattan Ave context.
- Eligible for real label: Yes for review planning as `Grillpoint Deli`, with production/public finality still blocked.
- Eligible for real card: `needs-review`; review-only eligibility is supported by MVP-22, but production/public finality remains blocked.
- Eligible for true-to-life visual treatment: `needs-review`; likely eligible at review/demo scale from owned/approved refs after MVP-29C confirms reference completeness.
- Exact claims that remain blocked:
  - Claim that Greenpoint Deli and Grillpoint Deli are legally the same entity.
  - Exact active-status finality.
  - Exact facade geometry.
  - Exact storefront frontage/order.
  - Exact address placement in the authored scene.
  - Any claim that a subway entrance is directly in front of the business.

### McDonald's

- Business name: McDonald's.
- Category: Fast food / restaurant.
- Candidate address: 904 Manhattan Ave, Brooklyn, NY 11222.
- Source URLs:
  - https://www.mcdonalds.com/us/en-us/location/ny/brooklyn/904-manhattan-ave/2678.html
  - https://geosearch.planninglabs.nyc/docs/
  - https://data.cityofnewyork.us/resource/64uk-42ks.json
- Source type and reliability:
  - Official business location page: high for business name and address.
  - NYC address/building evidence carried forward from MVP-18: high for planning context, medium for exact storefront unit placement.
  - User-supplied field photos in `docs/mvp-reference-images/`: potentially high for visual reference after MVP-29C provenance/completeness review.
- Last reviewed date: 2026-05-31.
- Current-status confidence: High for official location presence, but do not make `open now` or hours claims.
- Address/building confidence: Medium-high.
- Storefront/frontage confidence: Medium until MVP-29C confirms sign/facade/order coverage.
- Sign/facade visual-reference availability: Available candidate files in `docs/mvp-reference-images/`:
  - `northeast-mcdonalds-closeup.jpeg`
  - `northeast-mcdonalds-facadeA.jpg`
  - `northeast-mcdonalds-wide.jpg`
- Eligible for real label: Yes for review planning, pending Batu approval of branded-label handling.
- Eligible for real card: `needs-review`; official source supports identity/address, but card copy and public claim level are not opened.
- Eligible for true-to-life visual treatment: `needs-review`; requires MVP-29C reference completeness and Batu approval for brand/trade-dress treatment.
- Exact claims that remain blocked:
  - Exact facade geometry.
  - Exact storefront frontage/order.
  - Exact relation to 900/902/904 building units.
  - `Open now`, ratings, reviews, endorsement, partnership, or official collaboration.
  - Exact address placement in the authored scene.

### Dunkin'

- Business name: Dunkin'.
- Category: Coffee / donuts / quick-service food.
- Candidate address: 893 Manhattan Ave, Brooklyn, NY 11222.
- Source URLs:
  - https://locations.dunkindonuts.com/en/ny/brooklyn/893-manhattan-ave/355867
  - https://geosearch.planninglabs.nyc/docs/
  - https://data.cityofnewyork.us/resource/64uk-42ks.json
- Source type and reliability:
  - Official business location page: high for business name and address.
  - NYC address/building evidence carried forward from MVP-18: high for planning context, medium for exact storefront unit placement.
  - User-supplied field photos in `docs/mvp-reference-images/`: potentially high for visual reference after MVP-29C provenance/completeness review.
- Last reviewed date: 2026-05-31.
- Current-status confidence: High for official location presence, but do not make `open now` or hours claims.
- Address/building confidence: Medium-high.
- Storefront/frontage confidence: Medium-low until MVP-29C confirms whether the current photo set is sufficient beyond sign/facade.
- Sign/facade visual-reference availability: Available candidate file in `docs/mvp-reference-images/`:
  - `southwest-dunkin-facadeA.jpeg`
- MVP-29C revision note: because scaffolding blocks usable current SW field photos, Batu approved a narrow MVP-only exception for Google-derived SW Dunkin reference use, limited to stylized, truth-safe, non-production review/demo-scale approximation.
- Eligible for real label: Yes for review planning, pending Batu approval of branded-label handling.
- Eligible for real card: `needs-review`; official source supports identity/address, but card copy and public claim level are not opened.
- Eligible for true-to-life visual treatment: `needs-review`; currently weaker than NW/NE/SE unless MVP-29C accepts the available field photo or requests more.
- Exact claims that remain blocked:
  - Exact facade geometry.
  - Exact storefront frontage/order.
  - Exact relation to 893/895/897 building units.
  - `Open now`, ratings, reviews, endorsement, partnership, or official collaboration.
  - Exact address placement in the authored scene.

### Citizens Bank

- Business name: Citizens Bank / Citizens.
- Category: Bank branch / ATM.
- Candidate address: 896 Manhattan Avenue, Brooklyn, NY 11222.
- Source URLs:
  - https://locations.citizensbank.com/ny/brooklyn/896-manhattan-avenue.html
  - https://locations.citizensbank.com/ny/brooklyn.html
  - https://geosearch.planninglabs.nyc/docs/
  - https://data.cityofnewyork.us/resource/64uk-42ks.json
- Source type and reliability:
  - Official branch page and official Brooklyn branch directory: high for business name and address.
  - NYC address/building evidence carried forward from MVP-18: high for planning context, medium for exact storefront unit placement.
  - User-supplied field photos in `docs/mvp-reference-images/`: potentially high for visual reference after MVP-29C provenance/completeness review.
- Last reviewed date: 2026-05-31.
- Current-status confidence: High for official branch presence, but do not make `open now`, hours, ATM availability, endorsement, or partnership claims in app copy.
- Address/building confidence: Medium-high.
- Storefront/frontage confidence: Medium until MVP-29C confirms facade/order/entrance coverage.
- Sign/facade visual-reference availability: Available candidate files in `docs/mvp-reference-images/`:
  - `southeast-citizens-facadeA.jpeg`
  - `southeast-citizens-facadeB.jpg`
  - `southeast-citizens-wide.jpg`
- Eligible for real label: Yes for review planning, pending Batu approval of branded-label handling.
- Eligible for real card: `needs-review`; official source supports identity/address, but card copy and public claim level are not opened.
- Eligible for true-to-life visual treatment: `needs-review`; requires MVP-29C reference completeness and Batu approval for bank-brand treatment.
- Exact claims that remain blocked:
  - Exact facade geometry.
  - Exact storefront frontage/order.
  - Exact branch entrance/ATM placement.
  - Exact relation to 894/896/898 building units.
  - `Open now`, ratings, reviews, endorsement, partnership, or official collaboration.
  - Exact address placement in the authored scene.

## Subway Evidence Card

### Greenpoint Av G Subway

- Subway cue: Greenpoint Av station on the G line.
- Official station/source evidence:
  - MTA accessibility notice: https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible
  - MTA G line text map: https://www.mta.info/maps/subway-line-maps/g-line
- Candidate entrance/cue locations around Manhattan Ave x Greenpoint Ave:
  - MTA G line text map lists Greenpoint Av station entrance/exit locations as Manhattan Ave and India St, and Manhattan Ave and Greenpoint Ave.
  - Existing field-photo candidates include `northwest-subwayA.jpg`, `southeast-subwayB.jpg`, `southwest-subway-wide.jpeg`, and `southwest-subwayC.jpeg`.
- Verified, approximate, symbolic, context-only, omitted, or blocked:
  - Station context at Manhattan Ave and Greenpoint Ave: `verified` at station-area level from MTA text map.
  - Exact stair/elevator/entrance placement by corner: `blocked` until official entrance data and/or approved field-photo mapping supports it.
  - Generic G subway cue in the four-corner scene: `context-only` or `symbolic`, provided it does not imply exact station geometry or a false business-front adjacency.
  - Any direct `in front of Grillpoint` subway placement: `blocked`.
- Missing source evidence for exact placement:
  - Official entrance-level coordinates or clear official entrance descriptions tied to each corner.
  - Approved field-photo provenance and mapping notes that locate each visible stair/elevator/cue relative to NW/NE/SW/SE corners.
  - Batu approval of which cue treatment is visually and truthfully acceptable.
- Inclusion without false exact geometry:
  - A symbolic or context-only G cue can be included after MVP-29C/MVP-29D if labeled and composed as station context, not exact geometry.
  - Exact station cue placement remains blocked.

## Visual-Reference Readiness

| Candidate | Owned/approved/non-Google reference available? | Sufficient for sign? | Sufficient for facade? | Sufficient for storefront order/frontage? | Sufficient for corner massing? | Missing before MVP-29C |
| --- | --- | --- | --- | --- | --- | --- |
| Grillpoint Deli | Yes: NW field photos in `docs/mvp-reference-images/` and prior MVP-22 accepted evidence. | Likely yes for review scale. | Likely yes for review scale. | Partial; exact order/frontage remains blocked. | Partial. | Provenance confirmation, exact claims list, and production/public-use limits. Greenpoint Deli remains archival/conflicting prior language only. |
| McDonald's | Yes: NE field-photo candidates. | Likely yes. | Likely yes. | Partial until MVP-29C visual inspection. | Partial until MVP-29C visual inspection. | Confirm provenance, completeness, and brand/trade-dress treatment limits. |
| Dunkin' | Yes: SW Dunkin field-photo candidate. | Likely yes. | Partial. | Likely insufficient without broader frontage/wide reference review. | Partial/unknown. | Determine whether more SW business-wide photos are needed before true-to-life treatment. |
| Citizens Bank | Yes: SE Citizens field-photo candidates. | Likely yes. | Likely yes. | Partial until MVP-29C visual inspection. | Partial until MVP-29C visual inspection. | Confirm provenance, entrance/ATM cues, and brand/trade-dress treatment limits. |
| Greenpoint G subway | Yes: station-cue field-photo candidates exist, with JPG re-exports expected for MVP-29C review. | Not applicable. | Not applicable. | Exact station cue placement allowed only where supplied/approved reference photos clearly verify the cue's corner/orientation relationship. | Partial as context. | Review supplied/approved JPG references; unverified cues remain symbolic, context-only, omitted, or blocked. |

## Treatment Recommendations

| Candidate | Recommended treatment | Rationale |
| --- | --- | --- |
| Grillpoint Deli | `real card + real label + visual treatment` pending MVP-29C reference completeness and later implementation-boundary approval. | MVP-22 accepted a review-only Grillpoint card and owned-field-photo visual basis. Batu has resolved the active NW label in favor of Grillpoint Deli. |
| McDonald's | `real label only` pending MVP-29C and Batu branded-treatment approval. | Official source supports identity/address, and field-photo candidates exist, but exact facade/frontage/order and branded true-to-life treatment are not yet cleared. |
| Dunkin' | `MVP-exception-allowed pending stylized/non-production handling` after MVP-29C revision. | Official source supports identity/address. Batu approved a narrow MVP-only exception for the SW Dunkin visual-reference gap because scaffolding blocks usable current field photos. |
| Citizens Bank | `real label only` pending MVP-29C and Batu branded-treatment approval. | Official source supports identity/address, and field-photo candidates exist, but exact entrance/frontage/facade treatment is not yet cleared. |
| Greenpoint G subway | `exact cue where reference-verified; otherwise symbolic/context-only or blocked`. | MTA supports Greenpoint Av station context at Manhattan Ave and Greenpoint Ave, but exact cue placement must come from supplied/approved reference photos and Batu acceptance, not MTA text alone. |

## Truth / Fidelity Standard

The MVP target is recognizable and truth-safe at review/demo scale, not GIS-perfect, survey-perfect, or production-factual.

Allowed after later approval:

- Clear four-corner authored structure.
- Source-backed real labels and cards.
- Review/demo-scale storefront, sign, and facade treatment from owned/approved/non-Google references, plus Batu's narrow MVP-only SW Dunkin exception where applicable.
- Exact subway cues only where supplied/approved reference photos clearly verify corner/orientation; symbolic or context-only subway cues when exact entrance placement is not verified.

Still blocked:

- Exact frontage, facade, address placement, storefront order, entrance location, station geometry, or direct adjacency claims unless evidence supports the claim and Batu approves it.
- Ratings, reviews, `open now`, partnership, endorsement, official collaboration, production-readiness, or public-release claims.
- Google/Street View/3D Tiles-derived stored imagery, tracing, extraction, texture reuse, generation input, training input, production use, or exact trade-dress reproduction, except for Batu's narrow MVP-only SW Dunkin visual-reference exception for human-reviewed stylized approximation.
- LiveXYZ-derived facade/art input.

## Exit Verdict

Verdict: `proceed-to-mvp-29c`

Reason:

- The active candidate set can be mapped to NW/NE/SW/SE plus station context at review-planning level.
- Official or high-confidence sources support McDonald's, Dunkin', and Citizens identity/address candidates.
- NW Grillpoint Deli remains viable as the active NW candidate; Greenpoint Deli is archival/prior conflicting language only.
- Subway context is supportable, and exact cue placement is allowed only where supplied/approved reference photos clearly verify the cue's corner/orientation relationship; otherwise cues must be downgraded to symbolic/context-only, omitted, or blocked.
- The next risk is visual-reference completeness, not app implementation.

## Stop Conditions Before Any Implementation

Stop before implementation if:

- Batu has not accepted or revised MVP-29B.
- MVP-29C has not confirmed which owned/approved/non-Google references are sufficient.
- Any claim that Greenpoint Deli and Grillpoint Deli are legally the same entity is proposed without source evidence.
- Any candidate is treated as a real card without source-backed validation.
- Any subway cue implies exact geometry or false business-front adjacency without supplied/approved photo verification and Batu approval.
- Any exact facade, frontage, address placement, or station-geometry claim is proposed without evidence and Batu approval.
- The task requires `src/` edits, target additions, card-copy changes, rendering, raster production, screenshots, package/tooling changes, staging, or commit before a later brief explicitly opens that scope.

## Next Phase Sequence

1. `MVP-29C Four-Corner Visual Reference Completeness Gate`
2. `MVP-29D Four-Corner Translation / Composition Brief`
3. `MVP-29E Four-Corner Raster Scene Production / Integration Boundary`
4. `MVP-29F Four-Corner App Integration + Interaction Alignment`
5. `MVP-29G Four-Corner Screenshot QA Recovery`
6. `MVP-30 MVP QA / Demo Freeze`
7. `MVP-31 MVP Completion / Post-MVP Parking`
