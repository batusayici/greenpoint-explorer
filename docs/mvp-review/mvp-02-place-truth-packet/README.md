# MVP-02 Place Truth Packet

Status: Complete for Batu/ChatGPT review
Date: 2026-05-29
Scope: Docs-only place-truth packet for the MVP scene

## Purpose

This packet identifies candidate real places for the MVP scene, summarizes the repository's existing source evidence, records spatial coherence risks, and recommends approve/defer/omit/fictionalize outcomes for Batu/ChatGPT review.

These are recommendations, not final Batu decisions. This packet does not approve production real-place representation, public card copy, app/source implementation, public interfaces, architecture, production assets, live data, scraping, backend/CMS/persistence, deployment, or broad map coverage.

## Evidence Base

This packet uses existing repo documentation only:

- `docs/DATA_FEASIBILITY.md`
- `docs/PLACE_SOURCE_POLICY.md`
- `docs/PLACE_SCHEMA.md`
- `docs/MVP_SCOPE.md`
- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`

No new web lookup, scraping, visual generation, source/app edits, or asset work was performed.

Existing source review date in the repo evidence: 2026-05-26.

## Scene Boundary Assumption

The review target remains one compact Manhattan Ave / Greenpoint Ave authored diorama.

The diorama may compress geometry for readability, but it must not:

- move a real place to the wrong street;
- imply false direct adjacency;
- swap storefront order when adjacency matters;
- make an unknown, closed, relocated, or conflicting-status business appear active;
- draw exact storefront, facade, entrance, stair, elevator, frontage, or parcel claims without manual verification and Batu approval.

## Candidate Recommendations

| Candidate | Evidence status from repo docs | Spatial coherence read | MVP-02 recommendation | Manual verification before MVP use |
| --- | --- | --- | --- | --- |
| Greenpoint Av G station | Source-reviewed transit anchor. MTA sources support Greenpoint Av station as an intersection-level anchor; exact stair/elevator geometry remains unresolved. | Spatially coherent as an intersection/transit anchor. Exact access points are not cleared. | Recommend approve for symbolic transit-anchor treatment only. Defer exact stair/elevator drawing and exact access-point claims. Avoid treating it as an ordinary business card unless Batu explicitly approves a transit-card approach. | Yes, before exact stair/elevator placement, entrance-side claims, or public-facing access-point copy. |
| Peter Pan Donut & Pastry Shop, 727 Manhattan Ave | Partial / source-reviewed candidate. Official site supports active identity and address; property evidence supports 727 Manhattan Ave. | Strong compact-scene anchor. Exact storefront width, side-of-street depiction, and production adjacency to Sweetgreen remain unresolved. | Recommend keep as a primary real-place candidate for MVP-03 data-contract review. Do not approve final placement, facade, or card copy yet. | Yes, for storefront width, entrance, side-of-street depiction, and Peter Pan/Sweetgreen relationship. |
| Sweetgreen Greenpoint, 723 Manhattan Ave | Partial / active candidate. Official Sweetgreen location page and property/address evidence support 723 Manhattan Ave; narrative evidence supports proximity to Peter Pan. | Likely spatially coherent near Peter Pan, but the 723/725 footprint may be visually misleading if simplified. | Recommend keep as a conditional real-place candidate if manual frontage/entrance review clears it. Otherwise fictionalize or omit from the compact MVP scene. | Yes, for 723/725 footprint, entrance, frontage, and adjacency implications. |
| Former Meserole Theater / 723-725 Manhattan Ave | Partial / building candidate. Building/history sources support the address context; footprint is complex. | Coherent as a building mass or context anchor, not as a simple storefront rectangle. | Recommend treat as symbolic building context only. Defer any historical card, exact footprint, or facade claim. | Yes, for footprint, frontage, and any historical/card copy. |
| Captured Record Shop, 718 Manhattan Ave | Partial / active candidate. Official site and property evidence support address; storefront/basement relationship is unresolved. | Possibly coherent if the compact frame includes the even-numbered Manhattan Ave side, but exact entrance and adjacency are not cleared. | Recommend defer from MVP real-place card list unless manual street-level review clears storefront/entrance representation. Could remain a future candidate or be replaced by a fictional placeholder. | Yes, for entrance, basement/storefront relationship, side-of-street placement, and adjacency. |
| Polka Dot / 726 Manhattan Ave | Unresolved / blocked. Property evidence supports 726 Manhattan Ave, but public business-status sources conflict. | Structurally near the compact slice, but active representation is unsafe. | Recommend omit as an active real business. If Batu wants visual density here, use a clearly fictional placeholder or, after manual review, an unknown/closed treatment. | Yes, before any real-name display, status label, card, or storefront claim. |
| Karczma, 136 Greenpoint Ave | Partial / active candidate. Official site supports active identity and address; Time Out places it between Franklin St and Manhattan Ave. | Not coherent for the tight Peter Pan + G station frame unless the scene expands west along Greenpoint Ave. | Recommend defer unless Batu approves a westward Greenpoint Ave slice expansion. Do not compress it into direct adjacency with Peter Pan/Sweetgreen/G station. | Yes, if included; also requires explicit scene-boundary decision. |
| Brouwerij Lane, 78 Greenpoint Ave | Alternate-slice candidate. Public listings support Greenpoint Ave address near Franklin; official source was not text-readable in the existing pass. | Very low coherence for compact Manhattan/Greenpoint frame. Better suited to a different or expanded Franklin/Greenpoint slice. | Recommend omit from the MVP compact scene. Park as possible later-slice research. | Yes, if reactivated for a different slice. |

## In-Scope Candidate Set For Review

The MVP-02 review set is:

- Greenpoint Av G station.
- Peter Pan Donut & Pastry Shop.
- Sweetgreen Greenpoint.
- Former Meserole Theater / 723-725 Manhattan Ave.
- Captured Record Shop.
- Polka Dot / 726 Manhattan Ave.
- Karczma.
- Brouwerij Lane.

For the compact MVP scene, the strongest review candidates are Greenpoint Av G station, Peter Pan, Sweetgreen, and the former Meserole Theater building mass. Captured Record Shop remains a possible fifth candidate only after manual verification. Polka Dot should not be represented as active. Karczma and Brouwerij Lane should not be forced into the compact frame.

## Spatial Coherence Summary

Spatially coherent for the compact Manhattan Ave / Greenpoint Ave scene, with limits:

- Greenpoint Av G station as symbolic/intersection-level anchor.
- Peter Pan as a primary candidate at 727 Manhattan Ave.
- Sweetgreen as a conditional nearby candidate at 723 Manhattan Ave.
- Former Meserole Theater / 723-725 Manhattan Ave as contextual building mass.

Possibly coherent but blocked by manual verification:

- Captured Record Shop, if the scene includes the even-numbered Manhattan Ave side and avoids unsupported entrance/storefront claims.
- Polka Dot building position, only as unknown/closed or fictionalized density after manual review; not as an active business.

Not spatially coherent for the compact frame without a boundary change:

- Karczma, unless the scene expands west along Greenpoint Ave.
- Brouwerij Lane, unless a different Franklin/Greenpoint-oriented slice is approved.

## Minimum Static Fields For Later Approved Places

These are conceptual recommendations for MVP-03 Static MVP Data Contract approval. They do not create an implementation interface in this batch.

Minimum fields for any real place or transit anchor should include:

- Stable internal identifier.
- Public display name.
- Broad neutral category.
- Source-facing address or anchor description.
- Source URL list.
- Human-readable source labels.
- Source notes describing what each source supports.
- Last verified date.
- Verification status.
- Placement confidence.
- Public status: active, unknown, closed, placeholder, or symbolic anchor.
- Spatial notes / truth constraints.
- Manual verification required flag.
- Approval status.
- Card title.
- Neutral card description, if a card is approved.
- Unofficial-map disclaimer text or shared disclaimer reference.

For buildings or complex multi-tenant locations, the later contract should separately preserve building/storefront context instead of flattening a building into one misleading place.

## Copy Constraints

Real-place copy must remain neutral and source-backed.

Allowed:

- Name.
- Address.
- Broad category.
- One small factual description grounded in cited sources.
- Source URL or source label.
- Last verified date.
- Unofficial-map disclaimer.

Blocked without explicit Batu approval:

- Ratings, reviews, quality claims, popularity claims, endorsements, partnership claims, cultural-importance claims, ownership speculation, neighborhood significance claims, or AI-invented descriptive facts.
- Exact facade, entrance, stair, elevator, address, frontage, or adjacency claims not cleared by source evidence and manual verification.
- Active-business language where status is unknown, conflicting, stale, closed, relocated, or unresolved.

Recommended baseline disclaimer:

> Unofficial authored prototype. Not an official map, directory, or real-time business listing. Details were manually source-reviewed on the listed date and may have changed.

Final disclaimer wording remains reserved for Batu/ChatGPT review.

## Candidate Outcome Labels

Recommended labels for review:

- `symbolic-anchor`: Greenpoint Av G station until exact access-point geometry is approved.
- `candidate-manual-review-required`: Peter Pan, Sweetgreen, Captured Record Shop.
- `context-building-only`: Former Meserole Theater / 723-725 Manhattan Ave.
- `omit-active-business`: Polka Dot unless status is resolved.
- `defer-boundary-change-required`: Karczma.
- `omit-alternate-slice`: Brouwerij Lane.

These labels are planning recommendations only. MVP-03 may rename or formalize them if Batu/ChatGPT approve a static data contract.

## Source URLs From Existing Repo Evidence

- MTA G line text map: `https://www.mta.info/maps/subway-line-maps/g-line`
- MTA Greenpoint Av accessibility notice: `https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible`
- Peter Pan Donuts official site: `https://www.peterpandonuts.com/`
- Sweetgreen Greenpoint official location page: `https://www.sweetgreen.com/locations/greenpoint/`
- Brownstoner former Meserole Theater note: `https://www.brownstoner.com/architecture/building-of-the-day-723-manhattan-avenue/`
- CityRealty 723 Manhattan Ave building page: `https://www.cityrealty.com/nyc/greenpoint/723-manhattan-avenue/180932`
- Greenpointers Sweetgreen / former Rite Aid-Meserole Theater note: `https://greenpointers.com/2024/07/18/sweetgreen-is-coming-to-greenpoint-and-taking-over-former-disco-ball-rite-aid-space/`
- Captured Record Shop official site: `https://www.capturedrecordshop.com/`
- Karczma official contact page: `https://karczmabrooklyn.com/en/contact/`
- Brouwerij Lane official contact page: `https://www.brouwerijlanenyc.com/contact`
- Cylex Polka Dot listing: `https://www.cylex.us.com/company/polka-dot-28538533.html`
- Corner Polka Dot listing: `https://www.corner.inc/place/536750`
- PincusCo 726 Manhattan Ave property page: `https://www.pincusco.com/property/3026200046/`
- PincusCo 723 Manhattan Ave property page: `https://www.pincusco.com/3026190020`
- PincusCo 727 Manhattan Ave property page: `https://www.pincusco.com/property/727-manhattan-avenue/`
- NYC Department of Finance statement for 723 Manhattan Ave / BBL 3-02619-0020: `https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?bbl=3026190020&stmtDate=20250215&stmtType=SOA`
- NYC Property Information Portal 727 Manhattan Ave parcel URL attempted: `https://propertyinformationportal.nyc.gov/parcels/parcel/3026190019`
- NYC Property Information Portal 723 Manhattan Ave parcel URL attempted: `https://propertyinformationportal.nyc.gov/parcels/parcel/3026190020`
- NYC Property Information Portal 726 Manhattan Ave parcel URL attempted: `https://propertyinformationportal.nyc.gov/parcels/parcel/3026200046`
- PropertyShark 727 Manhattan Ave public-record-backed property page: `https://www.propertyshark.com/mason/Property/188733/727-Manhattan-Ave-Brooklyn-NY-11222/`
- PropertyShark 726 Manhattan Ave public-record-backed property page: `https://www.propertyshark.com/mason/Property/188798/726-Manhattan-Ave-Brooklyn-NY-11222/`
- PropertyShark 718 Manhattan Ave public-record-backed property page: `https://www.propertyshark.com/mason/Property/188795/718-Manhattan-Ave-Brooklyn-NY-11222/`
- Time Out Karczma listing: `https://www.timeout.com/newyork/restaurants/karczma`
- Time Out Brouwerij Lane listing: `https://www.timeout.com/newyork/bars/brouwerij-lane`

## Decisions Reserved For Batu

Batu must decide:

- Whether these recommendations are accepted, revised, or rejected.
- Whether the compact scene should include only Peter Pan / Sweetgreen / G station / Meserole context, or whether a fifth or sixth real candidate is worth manual verification.
- Whether Karczma requires a westward boundary expansion or should remain deferred.
- Whether Captured Record Shop should receive manual verification for MVP inclusion.
- Whether Polka Dot is omitted, fictionalized, or represented only as unknown/closed after manual review.
- Whether the G station appears only as symbolic transit context or receives a card.
- Final disclaimer wording.
- Any public-facing place copy.
- Any authored spatial compromise, manual override, or approximation that affects public representation.
- Any static data contract, public interface, module boundary, source-file boundary, or implementation gate in MVP-03 or later.

## Recommended Next Task

Recommended next task:

> MVP-03 Static MVP Data Contract

Purpose:

Define a docs-only static data contract or approved source-file boundary for the MVP place data, using this truth packet as input. MVP-03 should preserve source metadata, verification status, spatial uncertainty, disclaimer requirements, and Batu approval status without opening live data, scraping, backend/CMS, production assets, or app/source implementation unless explicitly approved in the next current brief.

## Acceptance Status

MVP-02 is complete as a docs-only truth packet for Batu/ChatGPT review.

It does not approve real-place production use, final public representation, static data implementation, exact geometry, exact addresses in visual placement, public interfaces, architecture, production assets, production asset pipeline, or MVP completion.
