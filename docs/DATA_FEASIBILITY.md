# Data Feasibility

Status: Historical Phase 2 gate record / superseded for current MVP scope by MVP-29A and MVP-29B
Date: 2026-05-26
Creative direction owner: Batu
Implementation owner: Codex

## Current Four-Corner Supersession Note

This document preserves the earlier Phase 2 / Batch 8.5 feasibility record. It is not the active candidate set, current MVP completion target, or next gate.

The current MVP completion target is the full Manhattan Ave x Greenpoint Ave four-corner authored diorama recorded in `docs/MVP_SCOPE.md`, `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, and the MVP-29A/MVP-29B packets.

Current active candidate validation set:

- Grillpoint Deli at the NW candidate. `Greenpoint Deli` is historical / archival / prior conflicting candidate language only.
- McDonald's.
- Dunkin', with Batu's narrow MVP-only SW visual-reference exception for stylized, truth-safe, non-production review/demo-scale approximation while scaffolding blocks usable current field photos.
- Citizens Bank.
- Greenpoint G subway, with exact cue placement allowed only where supplied/approved reference photos clearly verify the cue's corner/orientation relationship; otherwise symbolic, context-only, omitted, or blocked.

The Dunkin exception does not approve a general Google/Street View/3D Tiles source-policy change, production use, texture extraction, tracing, stored facade asset reuse, training input, generation input, or exact trade-dress reproduction. MTA text can support Greenpoint Av station context but must not be used alone to infer exact station geometry.

Peter Pan, Sweetgreen, former Meserole Theater, Captured Record Shop, Polka Dot, Karczma, and Brouwerij Lane are historical/previous-slice candidates unless a later current brief explicitly reactivates them.

## Purpose

This document defines the Batch 8.5 feasibility gate for location data and representational truth.

The goal is to prove whether the first Manhattan Ave / Greenpoint Ave slice can support real businesses, buildings, addresses, and source-backed place cards before static style-frame approval, final visual direction approval, app implementation, production visual assets, or real-place card production.

Phase 2 did not try to finish production data. It enabled one Batu gate decision.

Selected outcome:

- Use a hybrid real-plus-placeholder composition.

Historical gate read:

- Proceed with the current slice as-is is not supported by the current evidence.
- The compact Peter Pan + G station composition may continue only as symbolic / placeholder visual exploration.
- Real-place cards and production placement remain blocked until source-backed placement, storefront relationships, and any manual corrections are approved by Batu.
- Peter Pan and the Greenpoint Av G station may continue as symbolic / exploratory anchors.
- Other businesses must be treated as placeholders, fictionalized storefronts, omitted, or unresolved until manual verification clears them.

## Why This Gate Exists

The current plan already requires source-backed real places, static local place data, `lastVerified` dates, source URLs, and an unofficial-map disclaimer.

The missing step is feasibility proof before visual production advances. A visual direction should not be approved around a fake or unsupported map substrate. If real places cannot be represented truthfully in the first slice, the project must decide whether to revise the slice, reduce the number of real places, or use placeholders.

## First-Slice Scope

Initial feasibility review is limited to the Manhattan Ave / Greenpoint Ave slice.

The review should evaluate 6-10 candidate places/buildings. Each candidate must include:

- Address.
- Source notes.
- Verification status.
- Placement confidence.
- Notes on whether the place can be represented without wrong-street placement or false adjacency.

No candidate should be treated as approved for production until Batu reviews the feasibility findings.

## Slice Selection Viability Outcomes

Batch 8.5 does not assume the Manhattan Ave / Greenpoint Ave slice is automatically viable.

The feasibility review produced this outcome:

- Use a hybrid real-plus-placeholder composition.

Revising the slice is not a failure. It is a valid preproduction outcome if the original slice cannot truthfully support the intended density or composition.

## Candidate Source Types

Likely source candidates include:

- NYC Open Data / MapPLUTO for lots, buildings, and address context.
- OpenStreetMap for street, building, and point-of-interest context.
- Map/business directory manual lookup for current business identity and status, as corroboration only.
- Business websites and public business profiles for factual business details.
- Street-level manual verification when needed.
- Batu manual review for uncertain placement, public representation, and authored approximations.

No scraping, live data integration, API client, data pipeline, or automated data refresh is part of the MVP.

## Structural Reference Handling

Cannoneyed Isometric NYC (`https://cannoneyed.com/projects/isometric-nyc`) must be reviewed during Batch 8.5 or the next visual-preproduction pass.

The project may learn from its handling of NYC density, authored isometric abstraction, block compression, and representational tradeoffs.

The project must not copy its visual style, assets, composition, or distinctive execution. Any takeaways should be recorded as structural lessons, not style approvals.

## Key Risks

- A real business may be visually placed on the wrong street.
- An authored isometric scene may imply false adjacency between places.
- A building may contain multiple businesses, but the visual may imply a single tenant.
- A business may be stale, closed, relocated, renamed, or unverifiable.
- Source records may conflict on address, lot, business name, or current status.
- A visual choice may make a placeholder look like a verified real place.
- AI/Codex may over-infer details that require manual approval.

## Feasibility Questions

- Can 4-6 real named places be represented in the slice without false geography?
- Which buildings, lots, addresses, and businesses can be source-backed enough for MVP cards?
- Which candidates need manual placement correction or Batu approval?
- Which candidates should be omitted or replaced with placeholders?
- What counts as spatially coherent for an authored isometric diorama?
- Which details may be approximate without misleading the viewer?
- Which details cannot be approximated because they would change public representation?

## Spatial Coherence Rules

Spatially coherent means the authored isometric scene may simplify geometry, scale, and detail while preserving public truth about street placement, building relationships, and adjacency.

Allowed approximations:

- Isometric projection and non-literal scale.
- Compressed sidewalk depth.
- Simplified facade details.
- Reduced block length if street/frontage truth remains intact.
- Symbolic or simplified street furniture.
- Generic placeholder storefronts when clearly labeled.
- Small authored spacing changes that do not alter public representation.

Not allowed without explicit Batu approval:

- Moving a real business to a different street.
- Moving a business to the wrong side of an intersection.
- Changing business-to-building relationship.
- Swapping storefront order when adjacency matters.
- Collapsing opposite corners into one frontage.
- Implying direct adjacency when a building, street, or corner separates places.
- Using a real business name on a placeholder facade.
- Making a closed or unknown-status business appear active.
- Writing card facts not supported by reviewed public sources.

Unresolved placement must remain unresolved. It should not be hidden by art direction, composition, crop, or card copy.

## Candidate Source Review - 2026-05-26

This is an initial manual source review, not final approval. It does not clear Batch 8.5 by itself because official parcel/building checks, street-level placement checks, and Batu approval are still required.

## Batch 8.5B Parcel / Storefront / Adjacency Verification - 2026-05-26

This pass focused on parcel/building evidence, storefront truth, adjacency risk, and G station access-point confidence for the current compact Peter Pan + G station slice. It used public, non-scraped source review. NYC Property Information Portal parcel URLs were attempted where BBLs were available, but the page text was not readable in this environment; public-record-backed property pages and NYC Department of Finance bill records are treated as partial parcel evidence, not final official clearance.

| Candidate | Address / parcel evidence | Street-level / storefront evidence | Adjacency / side confidence | G station confidence | Verification status | Production readiness | Manual review required | Status / unresolved risks |
|---|---|---|---|---|---|---|---|---|
| Greenpoint Av G station | MTA text map lists Greenpoint Av entrances at Manhattan Ave / India St and Manhattan Ave / Greenpoint Ave. MTA accessibility notice places a street-level elevator on the east side of Manhattan Ave between Greenpoint Ave and Kent St. | No business storefront. Station should be treated as a transit/map anchor, not a place card. | High for station as an intersection-level anchor; medium for exact stair placement; medium-high for elevator side/block segment. | Intersection anchor: high. Exact stair entrances: medium. Exact elevator placement: medium-high, pending neighborhood map or manual street-level confirmation. | source-reviewed anchor | Safe for symbolic/placeholder visual exploration; not ready for production access-point drawing. | Yes, before drawing exact stair/elevator geometry. | Exact stair corners and elevator footprint remain unresolved. |
| Peter Pan Donut & Pastry Shop | Official site gives 727 Manhattan Ave. PropertyShark lists 727 Manhattan Ave with block/lot 02619-0019, 25 ft x 100 ft lot, one building, one commercial unit. PincusCo search result also identifies BBL 3026190019. | Official site supports active business identity at 727 Manhattan Ave. Greenpointers reports Sweetgreen signage next to Peter Pan, supporting Peter Pan/Sweetgreen adjacency at a narrative level. | Same block-face relationship with Sweetgreen is supported by Greenpointers, but exact storefront width and side-of-street placement still need manual street-level review. | N/A | partial / source-reviewed candidate | Symbolic anchor only. Not ready for production facade, storefront width, or card placement. | Yes. | Address and active business are supported; exact facade geometry and side-of-street depiction remain unresolved. |
| Sweetgreen Greenpoint | Official Sweetgreen page gives 723 Manhattan Avenue. NYC Department of Finance statement confirms 723 Manhattan Ave at BBL 3-02619-0020. PincusCo lists parcel ID 3026190020 for 723 Manhattan Ave. CityRealty lists alternate addresses including 723-725 and 725 Manhattan Ave. | Official Sweetgreen page supports active location at 723 Manhattan Avenue. Brownstoner identifies 723 Manhattan Ave as former Meserole Theater; Greenpointers reports Sweetgreen in the former Rite Aid/Meserole Theater space next to Peter Pan. | Medium. Adjacency to Peter Pan is source-supported, but the 723-725 footprint is large and may visually swallow adjacent storefronts if simplified carelessly. | N/A | partial / active candidate | Symbolic anchor only. Not ready for production facade/card placement. | Yes. | Need manual storefront frontage, entrance, and 723/725 footprint review before real-place placement. |
| Former Meserole Theater / 723-725 Manhattan Ave | Brownstoner identifies the former Meserole Theater at 723 Manhattan Ave. NYC Department of Finance statement confirms 723 Manhattan Ave as BBL 3-02619-0020. CityRealty lists 723-725 and 725 Manhattan Ave as alternate addresses and describes 723 Manhattan Ave as a converted rental building. | Building may serve as a scene/massing anchor. It should not become a business card unless reviewed historical copy is separately approved. | High for building-address anchor; medium for footprint. Brownstoner notes a narrow Manhattan Ave frontage with a larger theater space extending beyond that frontage, so a simple storefront rectangle would be misleading. | N/A | partial / building candidate | Useful as a symbolic building mass only. Not ready for production footprint or historical card. | Yes. | Must avoid swallowing Peter Pan or implying a false multi-storefront order. Needs parcel map/manual footprint review. |
| Polka Dot / 726 Manhattan | PropertyShark and PincusCo list 726 Manhattan Ave as BBL 3026200046 / block-lot 02620-0046, one-story retail/store building with one commercial unit. PincusCo also lists recent 2025-2026 alteration/sale activity. | Source conflict: Cylex lists Polka Dot at 726 Manhattan with hours updated 2025-10-23; Corner marks Polka Dot permanently closed, updated 2025-12-15. | Low. 726 is in the even-numbered Manhattan Ave parcel sequence opposite the odd-numbered 723/727 block, but production depiction still needs manual map/street-level confirmation. | N/A | unresolved / blocked | Not ready. Do not use as active card. May be omitted, labeled unknown/closed, or used only as a clearly labeled placeholder after manual review. | Yes. | Business status conflict blocks active representation. Also needs side-of-street and frontage review before any visible real-name facade. |
| Captured Record Shop | Official site gives 718 Manhattan Ave. PropertyShark lists 718 Manhattan Ave with block/lot 02620-0043, 25 ft x 100 ft lot, one building, two commercial units, and alternate address 718 A Manhattan Ave. | Official site supports current business identity and address. Basement/storefront relationship is not resolved by the reviewed sources. | Medium-low. Address is on the even-numbered Manhattan Ave side near 726, but exact storefront, basement access, and adjacency cannot be inferred from address alone. | N/A | partial / active candidate | Not ready for production placement; possible symbolic candidate only if represented without storefront-specific claims. | Yes. | Need manual review of entrance/storefront/basement relationship before visual representation. |
| Karczma | Official site gives 136 Greenpoint Ave. Time Out places it between Franklin St and Manhattan Ave. Official parcel/BBL was not confirmed in this pass. | Official site supports active restaurant identity and address. | Low for compact Peter Pan + G frame. It sits westward along Greenpoint Ave and should not be compressed into direct adjacency with Peter Pan/Sweetgreen/G entrance. | N/A | partial / active candidate | Not ready for compact-frame inclusion. | Yes, if included. | Requires westward slice expansion or explicit slice-boundary decision. |
| Brouwerij Lane | Time Out lists 78 Greenpoint Ave with cross street at Franklin Ave. Public search result for Augrented indicates 78 Greenpoint Ave is included under a 109 Franklin Street building record, but this was not readable enough for official use in this pass. | Official contact page was not text-readable in this environment; Time Out and other public listings support address at 78 Greenpoint Ave. | Very low for compact Peter Pan + G frame; medium only for a revised Franklin/Greenpoint-focused slice. | N/A | alternate-slice candidate | Not ready for compact-frame inclusion. | Yes, if included. | Requires different or expanded slice. Including it in the compact frame risks false proximity. |

## Batch 8.5B Composition Viability Read

The compact Peter Pan + G station composition may continue only as symbolic/placeholder visual exploration. It should use clearly labeled placeholders, symbolic storefronts, and unresolved-geography notes. It must not claim production-accurate real-world placement yet.

It cannot yet support 4-6 production-ready real named places or real-place cards. Peter Pan, Sweetgreen, the former Meserole Theater building, and the Greenpoint Av G station are the strongest anchors, but each still has placement limits: Peter Pan and Sweetgreen need exact storefront/side-of-street review, Meserole needs footprint review, and the G station needs exact stair/elevator placement review.

Current anchor read:

- Safe as symbolic/source-reviewed anchors: Greenpoint Av G station intersection anchor, Peter Pan at 727 Manhattan Ave, Sweetgreen at 723 Manhattan Ave, and the former Meserole Theater / 723-725 Manhattan Ave as a building mass.
- Unsafe for production placement without manual review: exact G station stairs/elevator, Peter Pan/Sweetgreen storefront widths, 723-725 building footprint, Captured entrance/storefront/basement representation, and any Polka Dot active-status representation.
- Karczma requires a westward Greenpoint Ave slice expansion or a separate boundary decision before inclusion.
- Brouwerij Lane requires a different or expanded Greenpoint/Franklin slice before inclusion.
- Polka Dot should be omitted as an active business. It may only be represented as unknown/closed or as a clearly labeled placeholder after manual verification and Batu approval.

Blocking factual uncertainties:

- 718 Manhattan Ave / Captured Record Shop: official site and property evidence support the address, but reviewed sources do not clear entrance position, street-facing storefront, basement relationship, or adjacency. Do not draw it as a production storefront or card anchor without manual review.
- 723/725 Manhattan Ave / Sweetgreen and former Meserole Theater: address and building evidence are promising, but frontage, footprint, entrance relationship, and the risk of visually swallowing Peter Pan or adjacent storefronts remain unresolved. Do not simplify this into a generic single storefront without manual review.
- 726 Manhattan Ave / Polka Dot: public sources conflict on active versus closed status. Do not represent Polka Dot as active. Any use must be omitted, unknown/closed, or placeholder-only after Batu review. Side-of-street and storefront frontage also remain unresolved for production depiction.
- 727 Manhattan Ave / Peter Pan: address and active business identity are supported, but exact storefront width, side-of-street depiction, and production adjacency to Sweetgreen remain unresolved.
- Greenpoint Av G station: intersection-level transit-anchor use is supported, but exact stair corners and elevator footprint remain unresolved until MTA neighborhood-map or manual street-level review clears them.
- Peter Pan / Sweetgreen storefront order: same block-face relationship is source-supported at a narrative level, but production order, entrance positions, and frontage proportions are not cleared.
- Karczma / Brouwerij Lane: each requires a boundary decision before inclusion. Karczma needs westward Greenpoint Ave expansion or a separate boundary choice; Brouwerij Lane likely belongs to a different or expanded Franklin/Greenpoint-focused slice. Neither should be forced into the compact Peter Pan + G station frame.

Batu approval is still required for any manual corrections, placeholders, omissions, authored spatial compromises, or public real-place representation.

Reviewed source URLs:

- MTA G line text map: `https://www.mta.info/maps/subway-line-maps/g-line`
- MTA Greenpoint Av accessibility notice: `https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible`
- Peter Pan Donuts official site: `https://www.peterpandonuts.com/`
- Karczma official contact page: `https://karczmabrooklyn.com/en/contact/`
- Captured Record Shop official site: `https://www.capturedrecordshop.com/`
- Brouwerij Lane official contact page: `https://www.brouwerijlanenyc.com/contact`
- Sweetgreen Greenpoint official location page: `https://www.sweetgreen.com/locations/greenpoint/`
- Brownstoner former Meserole Theater note: `https://www.brownstoner.com/architecture/building-of-the-day-723-manhattan-avenue/`
- CityRealty 723 Manhattan Ave building page: `https://www.cityrealty.com/nyc/greenpoint/723-manhattan-avenue/180932`
- Greenpointers Sweetgreen / former Rite Aid-Meserole Theater note: `https://greenpointers.com/2024/07/18/sweetgreen-is-coming-to-greenpoint-and-taking-over-former-disco-ball-rite-aid-space/`
- Cylex Polka Dot listing: `https://www.cylex.us.com/company/polka-dot-28538533.html`
- Corner Polka Dot listing: `https://www.corner.inc/place/536750`
- PincusCo 726 Manhattan Ave property page: `https://www.pincusco.com/property/3026200046/`
- PincusCo 723 Manhattan Ave search result/property page: `https://www.pincusco.com/3026190020`
- PincusCo 727 Manhattan Ave search result/property page: `https://www.pincusco.com/property/727-manhattan-avenue/`
- NYC Department of Finance statement for 723 Manhattan Ave / BBL 3-02619-0020: `https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?bbl=3026190020&stmtDate=20250215&stmtType=SOA`
- NYC Property Information Portal 727 Manhattan Ave parcel URL attempted: `https://propertyinformationportal.nyc.gov/parcels/parcel/3026190019`
- NYC Property Information Portal 723 Manhattan Ave parcel URL attempted: `https://propertyinformationportal.nyc.gov/parcels/parcel/3026190020`
- NYC Property Information Portal 726 Manhattan Ave parcel URL attempted: `https://propertyinformationportal.nyc.gov/parcels/parcel/3026200046`
- PropertyShark 727 Manhattan Ave public-record-backed property page: `https://www.propertyshark.com/mason/Property/188733/727-Manhattan-Ave-Brooklyn-NY-11222/`
- PropertyShark 726 Manhattan Ave public-record-backed property page: `https://www.propertyshark.com/mason/Property/188798/726-Manhattan-Ave-Brooklyn-NY-11222/`
- PropertyShark 718 Manhattan Ave public-record-backed property page: `https://www.propertyshark.com/mason/Property/188795/718-Manhattan-Ave-Brooklyn-NY-11222/`
- Time Out Karczma listing: `https://www.timeout.com/newyork/restaurants/karczma`
- Time Out Brouwerij Lane listing: `https://www.timeout.com/newyork/bars/brouwerij-lane`

## Acceptance Criteria

Batch 8.5 is complete as a gate decision record when:

- 6-10 candidate places/buildings from the Manhattan Ave / Greenpoint Ave slice are evaluated.
- Each candidate has an address, source notes, verification status, and placement confidence.
- Any uncertain placement is marked as unresolved, not silently guessed.
- No business is placed on the wrong street.
- No false adjacency is introduced.
- Any manual correction path is documented.
- Batu has selected the hybrid real-plus-placeholder composition outcome.

## Stop Conditions

Stop and require Batu review if:

- Fewer than 4 real named places can be represented truthfully.
- A key visual anchor requires wrong-street placement.
- A composition depends on false adjacency between real places.
- Business status cannot be verified well enough for a card.
- Source conflicts cannot be resolved using the approved source policy.
- A manual correction changes public representation, product scope, or visual direction.
- The current slice cannot support the intended density without wrong-street placement, false adjacency, or unsupported real-place claims.

## Remaining Batu Review / Approval Items

- Confirm or revise the authoritative source hierarchy.
- Confirm or revise the address normalization format.
- Confirm or revise the business-to-building/storefront relationship model.
- Confirm or revise multi-tenant building handling.
- Confirm or revise source conflict resolution rules.
- Confirm or revise stale or closed business handling.
- Confirm or revise the `lastVerified` protocol.
- Confirm or revise spatial coherence acceptance criteria.
- Confirm or revise what may be approximate in an authored isometric diorama.
- Confirm or revise what cannot be approximated.
- Confirm or revise what requires Batu approval.
- Confirm or revise what must be labeled unknown, placeholder, or omitted.
