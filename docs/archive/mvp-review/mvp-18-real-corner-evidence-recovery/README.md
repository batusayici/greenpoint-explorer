# MVP-18 Real Corner Evidence Recovery

Status: Complete for Batu review
Date: 2026-05-30
Artifact class: Level 0 text review packet
Scope: Evidence recovery only; no implementation, visuals, screenshots, scraping, live pipeline, staging, or commit

## Executive Verdict

Verdict: `revise`.

Reason: the active place set now has a plausible four-corner address/lot structure around Greenpoint Ave x Manhattan Ave, but no active business has approved storefront/frontage evidence and no real-facade visual reference is currently allowed for art translation.

Ready for one-corner real-facade visual translation: No. The project is ready for one-corner field-photo / owned-reference acquisition, with the northwest Greenpoint Deli corner as the recommended first target.

## Scope Check

MVP-18 is consistent with `docs/MVP_SCOPE.md` and `docs/PLAN.md`.

- `docs/MVP_SCOPE.md` allows one compact authored scene around Manhattan Ave / Greenpoint Ave and review-only storefront evidence cards before real-place use.
- At batch start, `docs/PLAN.md` opened MVP-18 as docs-only evidence recovery.
- At batch start, `docs/CURRENT_EXECUTION_BRIEF.md` authorized `MVP-18 Real Corner Evidence Recovery` only.
- This packet does not approve real-place cards, exact facades, exact storefront order, exact station geometry, implementation, new assets, production data, or production/public-release claims.

## Active Scene Confirmation

Current app/data files confirm this active scene/place set:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

Source confirmation:

- `src/mvpPlaceData.js` contains exactly these five targets.
- `src/App.jsx` renders cards/rail/source links from `mvpScene.targets`.
- `src/PlaceholderWorld.jsx` renders the review-only raster plate and temporary hit regions.

Mismatch:

- No active place-set mismatch was found between the current brief, plan, scope, ledger, and source files.
- The source still marks all business addresses as not approved in the prototype UI. MVP-18 improves the evidence record but does not update source data.

Parked previous-scene places remain parked: Peter Pan, Sweetgreen, former Meserole Theater / 723-725 Manhattan Ave, Captured Record Shop, Polka Dot, and Karczma.

## Intersection Boundary Options

| Option | Boundary | Pros | Risks | Verdict |
| --- | --- | --- | --- | --- |
| Full four-corner intersection | Four nearest active-place parcels around Greenpoint Ave x Manhattan Ave: NW 903, NE 900-904, SW 893-897, SE 894-898 Manhattan Ave, plus symbolic G subway context. | Best match to current active set; creates a compact recognizable intersection. | Exact storefront positions and facade references remain unresolved. | Recommended as MVP evidence boundary. |
| One side only | West side of Manhattan Ave, using Greenpoint Deli and Dunkin'. | More local storefront feel; fewer chain/corporate facades. | Excludes McDonald's and Citizens, weakening the current active set. | Not recommended as MVP boundary. |
| One corner only | Single corner-first slice for the next visual spike. | Lowest art-translation risk. | Too narrow to settle the MVP intersection boundary by itself. | Recommended only as next spike method. |

## Recommended Boundary

Use one full compact intersection boundary for evidence, then translate one corner first.

Included MVP slice:

- Northwest: Greenpoint Deli candidate at 903 Manhattan Ave.
- Northeast: McDonald's candidate at 904 Manhattan Ave within the 900/902/904 Manhattan Ave tax lot/building.
- Southwest: Dunkin' candidate at 893 Manhattan Ave within the 893/895/897 Manhattan Ave tax lot/building.
- Southeast: Citizens Bank candidate at 896 Manhattan Ave within the 894/896/898 Manhattan Ave tax lot/building.
- Transit context: Greenpoint Av G subway station area at Manhattan Ave / Greenpoint Ave, with exact access geometry deferred.

Outside the slice:

- India St, Kent St, and the full Greenpoint Av station length beyond the immediate intersection context.
- 643 Manhattan Ave Dunkin' and other non-intersection Dunkin' locations.
- 888, 892, 905 Manhattan Ave and other adjacent buildings unless Batu later expands the boundary.
- Parked previous-scene places and any westward Greenpoint Ave expansion.

## Building / Lot / Storefront Evidence Table

Last checked: 2026-05-30.

| Place | Candidate address | Corner / quadrant | BBL / BIN / tax-lot evidence | Business status | Source IDs | Confidence | Unresolved questions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Greenpoint Deli | 903 Manhattan Ave, Brooklyn, NY 11222 | NW, west side of Manhattan Ave north of Greenpoint Ave | NYC GeoSearch/PAD: BBL `3025580051`, BIN `3064720`; MapPLUTO: block `2558`, lot `51`, 1 building, 4 floors, 1930, retail area `1176`. | `uncertain`: LiveXYZ and public menu/directory pages support identity/address candidate; no official business source found in this pass. | S1, S2, S3, L1 | Medium for address/lot; low for active status and storefront. | Confirm current status, official/business source, storefront entrance, frontage, signage, and allowed facade reference. |
| McDonald's | 904 Manhattan Ave, Brooklyn, NY 11222 | NE, east side of Manhattan Ave north of Greenpoint Ave | NYC GeoSearch/PAD: BBL `3025590001`, BIN `3064742`; MapPLUTO address `902 Manhattan Ave`, block `2559`, lot `1`, address range includes 900/902/904, 1 building, 1 floor, 1974, retail area `2844`. | `verified` for identity/address via McDonald's official location page; exact current storefront condition not verified. | S1, S2, S4, L2 | High for business/address/lot; medium-low for storefront/frontage. | Confirm exact frontage, entrance, visual facade, and acceptable brand/trade-dress treatment. |
| Dunkin' | 893 Manhattan Ave, Brooklyn, NY 11222 | SW, west side of Manhattan Ave south of Greenpoint Ave | NYC GeoSearch/PAD: BBL `3025630041`, BIN `3064832`; MapPLUTO address `897 Manhattan Ave`, block `2563`, lot `41`, address range includes 893/895/897, 1 building, 2 floors, 1874, retail area `3478`. | `verified` for identity/address via Dunkin official location page; exact storefront position within multi-address building unresolved. | S1, S2, S5, L3 | High for business/address/lot; medium-low for storefront/frontage. | Confirm which tenant bay is Dunkin, entrance, frontage/order, signage/facade cues, and real-brand treatment. |
| Citizens Bank | 896 Manhattan Ave, Brooklyn, NY 11222 | SE, east side of Manhattan Ave south of Greenpoint Ave | NYC GeoSearch/PAD: BBL `3025740001`, BIN `3065110`; MapPLUTO address `896 Manhattan Ave`, block `2574`, lot `1`, address range includes 894/896/898, 1 building, 3 floors, 1878, retail area `4096`. | `verified` for branch identity/address via Citizens official location page; exact storefront position within building unresolved. | S1, S2, S6, L4 | High for business/address/lot; medium-low for storefront/frontage. | Confirm tenant frontage, entrance, facade cues, and whether bank use is strong enough for MVP local specificity. |
| Greenpoint G subway | Greenpoint Av station area at Manhattan Ave / Greenpoint Ave | Intersection/transit context; elevator evidence south/east of intersection | No business BBL/BIN. MTA supports Greenpoint Av station context and describes a street-level elevator on the east side of Manhattan Ave between Greenpoint Ave and Kent St. | `context-only`: transit anchor verified; exact access geometry deferred. | S7, S8, L5 | High for transit context; low for exact access-point geometry. | Confirm exact stair locations, elevator footprint, entrance-side geometry, and whether the MVP needs exact station depiction or only symbolic G cue. |

## Business Identity And Status Table

| Place | Status classification | Basis | MVP treatment now |
| --- | --- | --- | --- |
| Greenpoint Deli | `uncertain` | Local/directory evidence and LiveXYZ candidate exist; no official business source found. | Use as the first evidence/photo target, not a verified facade/card yet. |
| McDonald's | `verified` for identity/address; `deferred` for visual treatment | Official McDonald's location page supports 904 Manhattan Ave. | May remain a real card candidate; visual treatment must avoid exact facade/brand claims until approved. |
| Dunkin' | `verified` for identity/address; `deferred` for storefront | Official Dunkin location page supports 893 Manhattan Ave. | May remain a real card candidate; exact storefront and brand treatment deferred. |
| Citizens Bank | `verified` for identity/address; `deferred` for storefront | Official Citizens location page supports 896 Manhattan Ave. | May remain a real card/context candidate; exact facade and corner treatment deferred. |
| Greenpoint G subway | `context-only` | MTA supports station/transit context; exact geometry unresolved. | Symbolic G transit anchor only. |

## Address / BBL / BIN / Tax-Lot Evidence

- `903 Manhattan Ave`: official NYC GeoSearch/PAD returns BBL `3025580051`, BIN `3064720`; MapPLUTO returns block `2558`, lot `51`.
- `904 Manhattan Ave`: official NYC GeoSearch/PAD returns BBL `3025590001`, BIN `3064742`; MapPLUTO primary address is `902 Manhattan Ave`, with 900/902/904 sharing the same lot/building.
- `893 Manhattan Ave`: official NYC GeoSearch/PAD returns BBL `3025630041`, BIN `3064832`; MapPLUTO primary address is `897 Manhattan Ave`, with 893/895/897 sharing the same lot/building.
- `896 Manhattan Ave`: official NYC GeoSearch/PAD returns BBL `3025740001`, BIN `3065110`; MapPLUTO primary address is `896 Manhattan Ave`, with 894/896/898 sharing the same lot/building.
- `Greenpoint G subway`: no business parcel should be inferred. Treat station-area evidence separately from storefront/building evidence.

## Storefront / Frontage Evidence

| Place | Storefront position verified? | Frontage/order verified? | Entrance geometry verified? | Signage/facade cues verified? | Exact visual placement |
| --- | --- | --- | --- | --- | --- |
| Greenpoint Deli | No. | No. | No. | No. | Blocked until field/owned reference and status verification exist. |
| McDonald's | Partial: address and lot are strong, but tenant frontage across 900/902/904 is not documented here. | No. | No. | No approved facade reference. | Deferred. |
| Dunkin' | Partial: address and lot are strong, but tenant bay in 893/895/897 cluster is not documented here. | No. | No. | No approved facade reference. | Deferred. |
| Citizens Bank | Partial: branch address is strong, but tenant frontage across 894/896/898 is not documented here. | No. | No. | No approved facade reference. | Deferred. |
| Greenpoint G subway | Not applicable as storefront. | Not applicable. | Partial for elevator side/block segment only; stairs unresolved. | Symbolic G cues only. | Exact station geometry blocked. |

## Visual-Reference Eligibility

| Place | Allowed references | Blocked references | Existing repo images usable? | Additional owned/field photos needed? | Google / Street View / 3D Tiles status |
| --- | --- | --- | --- | --- | --- |
| Greenpoint Deli | Text sources for identity/address candidate; approved corpus for style only. | LiveXYZ facade use; `docs/mvp-reference-images/`; copied web imagery. | No for facade/art. Local images may be listed only as blocked historical paths. | Yes, required before real-facade translation. | Blocked completely as stored imagery, extraction input, trace source, texture source, generation input, or facade data. |
| McDonald's | Official McDonald's page for identity/address; approved corpus for style only. | Exact logos/trade dress/facade from web, LiveXYZ, Google, Street View, 3D Tiles, or blocked repo images. | No for facade/art. | Yes, required if the real corner uses recognizable facade/signage cues. | Blocked completely. |
| Dunkin' | Official Dunkin page for identity/address; approved corpus for style only. | Exact logos/trade dress/facade from web, LiveXYZ, Google, Street View, 3D Tiles, or blocked repo images. | No for facade/art. | Yes, required if the real corner uses recognizable facade/signage cues. | Blocked completely. |
| Citizens Bank | Official Citizens page for identity/address; approved corpus for style only. | Exact logos/trade dress/facade from web, LiveXYZ, Google, Street View, 3D Tiles, or blocked repo images. | No for facade/art. | Yes, required if the bank corner becomes the translation target. | Blocked completely. |
| Greenpoint G subway | MTA text sources for transit context; approved corpus for symbolic transit style only. | Exact station geometry from Google/Street View/3D Tiles or blocked repo images. | No for exact geometry. | Yes, only if Batu wants exact station access depiction later. | Blocked completely. |

## Allowed Visual Reference Inventory

Allowed now:

- `docs/reference/approved-reference-corpus/` for Inked Indie / Compact Corner style language only.
- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/` for reusable-system logic only.
- Textual business/location pages for identity, address, and status evidence only.
- NYC GeoSearch/PAD and MapPLUTO for address, BBL/BIN, tax-lot, and building facts.
- Future Batu-supplied owned/field photos, if explicitly approved and documented with provenance, as real-facade reference inputs.

Not allowed as facade art by default:

- Generic business-page logos, brand images, or promotional images unless Batu separately approves their use.
- Any existing source screenshot unless provenance and use rights are approved.

## Blocked Visual Reference Inventory

Blocked:

- `docs/mvp-reference-images/source-01-northwest-corner.png`
- `docs/mvp-reference-images/source-03-northeast-corner.png`
- `docs/mvp-reference-images/source-04-southwest-corner.png`
- `docs/mvp-reference-images/source-05-southeast-corner.png`

Reason: prior project docs record these as appearing to be Google Maps / Google Street View captures. They may remain local historical evidence paths, but they must not be used as stored facade reference, extraction input, texture source, generation input, trace source, primary world art, or production visual evidence.

Also blocked:

- Google Maps, Google Street View, and Google 3D Tiles-derived imagery.
- LiveXYZ-derived facade/art use.
- Downloaded or copied imagery from business/location pages.
- The MVP-17 raster plate as factual Greenpoint facade evidence.

## Recognizable Representation Plan

| Place | What must be recognizable | What can be stylized | What must be generalized | What must be fictionalized | What must be omitted | Context-only use |
| --- | --- | --- | --- | --- | --- | --- |
| Greenpoint Deli | Local deli/bodega role, corner-scale storefront feel, and card identity after status/photo verification. | Hand-painted sign band, window rhythm, compact awning, sidewalk clutter from owned/approved reference. | Exact colors/materials until photos are approved. | Sign wording if business status remains uncertain. | Exact facade, exact entrance, exact frontage. | Can act as local flavor anchor if real representation remains blocked. |
| McDonald's | Name/card identity and quick-service corner role if retained. | Building mass, windows, and simplified food-service cues. | Brand color intensity, signage scale, facade detail. | Logos/trade dress if brand treatment is not approved. | Exact brand marks, exact signage, exact facade. | Can be context storefront if brand specificity weakens scene tone. |
| Dunkin' | Name/card identity and coffee/quick-service role if retained. | Sign band, counter-window rhythm, compact storefront proportions. | Chain-specific palette/trade dress. | Logos/trade dress if brand treatment is not approved. | Exact signage, exact facade, exact tenant bay. | Can be generic coffee context if storefront evidence remains incomplete. |
| Citizens Bank | Branch/card identity and bank/civic-service role if retained. | Larger corner-building mass and restrained storefront treatment. | Exact bank branding and facade detail. | Logos/trade dress if brand treatment is not approved. | Exact signage, exact entrance, exact facade. | Useful as a massing/context anchor if click value is weaker. |
| Greenpoint G subway | G subway presence and transit orientation cue. | Symbolic green G marker, subway globe, simplified railing/elevator cue. | Exact access geometry. | Not needed. | Exact stairs, elevator footprint, mezzanine/access layout. | Yes, symbolic transit anchor only. |

## Fictionalize / Generalize / Omit / Defer Plan

- Greenpoint Deli: defer real-facade translation until owned/field photo and current-status evidence exist; use fictional-safe deli language if needed before that.
- McDonald's: generalize or fictionalize visual treatment unless Batu approves real-brand handling and an allowed visual reference.
- Dunkin': generalize or fictionalize visual treatment unless Batu approves real-brand handling and an allowed visual reference.
- Citizens Bank: keep as context or generalized bank/service corner unless Batu wants it as a real card and approves reference evidence.
- Greenpoint G subway: keep symbolic; defer exact station geometry.

## First Real-Facade Translation Spike Recommendation

Recommended first target: northwest Greenpoint Deli corner at 903 Manhattan Ave.

Why:

- It is the most locally specific and worth-clicking candidate in the active set.
- It gives the MVP a neighborhood storefront anchor rather than leading with a national chain or generic bank.
- The lot/address structure is now plausible: NYC GeoSearch/PAD and MapPLUTO align on BBL `3025580051` / BIN `3064720`.
- Its weaknesses are concrete and fixable: current status, storefront frontage, entrance, signage, and facade cues need field/owned reference evidence.

Risk:

- It is not ready for immediate art translation because the business status and facade reference are not strong enough.
- Translating this corner from memory, Google/Street View, LiveXYZ, or the existing `docs/mvp-reference-images/` files would violate project governance.

Fallback if Batu prioritizes evidence confidence over local specificity:

- Southeast Citizens Bank at 896 Manhattan Ave has stronger official business evidence, but weaker first-click/local-neighborhood value.

## Proceed / Revise / Cut Verdict

Verdict: `revise`.

- Do not proceed directly into real-corner art translation.
- Do not cut the real-corner goal; the four-corner structure is now plausible enough to continue.
- Revise by acquiring one allowed real-facade reference set for the northwest Greenpoint Deli corner, then write a one-corner visual translation brief from that evidence.

## Next Task Recommendation

Recommended next task: `MVP-19 One-Corner Field Photo Supply Gate`.

Goal:

- Obtain or explicitly approve owned/non-Google field-reference photos for the northwest Greenpoint Deli / 903 Manhattan Ave corner.
- Confirm current business status, storefront frontage, entrance position, and any signage/facade cues visible in the owned/approved references.
- Decide whether the next task after that can be a one-corner real-facade art translation brief.

This is a supply/evidence gate, not implementation and not art translation.

## Stop Conditions

Visual translation remains blocked if:

- No owned, Batu-supplied, or explicitly approved non-Google facade reference exists for the selected corner.
- Greenpoint Deli current status cannot be verified enough for real representation.
- Storefront frontage/entrance cannot be separated from neighboring addresses without false adjacency risk.
- The visual plan would require Google/Street View/3D Tiles, LiveXYZ facade imagery, or existing blocked source screenshots.
- Batu does not approve the selected corner or chooses a lower-risk fallback.
- Branded-chain or bank treatment becomes the only viable path and Batu has not approved real-brand visual handling.

## Unresolved Decisions For Batu

- Approve, revise, or reject the MVP-18 `revise` verdict.
- Approve the full four-corner intersection as the evidence boundary.
- Approve, revise, or reject northwest Greenpoint Deli / 903 Manhattan Ave as the first corner for field-photo supply.
- Decide whether McDonald's, Dunkin', and Citizens Bank should remain real card candidates, context-only anchors, fictionalized storefronts, or cut/deferred targets.
- Decide whether the G subway remains symbolic only or later needs exact access-point verification.

## Sources Reviewed

Public / official sources:

- S1: NYC GeoSearch/PAD API documentation: `https://geosearch.planninglabs.nyc/docs/`
- S2: NYC Open Data MapPLUTO API resource: `https://data.cityofnewyork.us/resource/64uk-42ks.json`
- S3: Greenpoint Deli public directory/menu candidate: `https://www.menuwithprice.com/menu/greenpoint-deli/new-york/brooklyn/520383/`
- S4: McDonald's official location page: `https://www.mcdonalds.com/us/en-us/location/ny/brooklyn/904-manhattan-ave/2678.html`
- S5: Dunkin official location page: `https://locations.dunkindonuts.com/en/ny/brooklyn/893-manhattan-ave/355867`
- S6: Citizens official location page: `https://locations.citizensbank.com/ny/brooklyn/896-manhattan-avenue.html`
- S7: MTA Greenpoint Av accessibility notice: `https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible`
- S8: MTA G line map source retained in current data: `https://www.mta.info/maps/subway-line-maps/g-line`

Local evidence:

- L1: `src/mvpPlaceData.js`
- L2: `docs/mvp-review/mvp-05-source-of-truth-validation-spike/README.md`
- L3: `docs/mvp-review/mvp-07-reusable-place-evidence-pipeline/README.md`
- L4: `docs/mvp-review/mvp-08-place-evidence-packet-current-scene/README.md`
- L5: `docs/mvp-reference-images/` listed only as blocked historical/source-reference paths, not usable facade references.

Network/source-use note:

- NYC GeoSearch/PAD and MapPLUTO were queried manually for the four candidate addresses and BBLs.
- No Google/Street View/3D Tiles imagery was stored, copied, extracted, transformed, traced, or used as art input.
- No screenshots, visual assets, renderer work, scraping, live data pipeline, staging, or commit were performed.
