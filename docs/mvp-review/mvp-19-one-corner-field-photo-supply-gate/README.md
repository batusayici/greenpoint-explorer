# MVP-19 One-Corner Field Photo Supply Gate

Status: Complete for Batu review
Date: 2026-05-30
Artifact class: Level 0 text evidence packet
Scope: Reference + repeatability/scalability gate only; no implementation, visuals, screenshots, scraping, live data, assets, staging, or commit

## Executive Verdict

Verdict: `proceed-to-mvp-20`.

MVP-20 recommendation: recommended, pending Batu approval to open the docs-only translation boundary.

Reason: after the initial packet, Batu pointed Codex to newly supplied corner reference photos in `docs/mvp-reference-images/`. The northwest deli files have Apple iPhone 15 Pro metadata dated 2026-05-30 and show the storefront, facade, entrance zone, signage, adjacent storefronts, and subway entrance context. They are suitable for review-only MVP-20 translation-boundary planning if Batu confirms their ownership/use approval. The photos also reveal a business-identity correction: the visible storefront sign reads `GRILLPOINT DELI`, not `Greenpoint Deli`.

Scalability headline: official public building/lot/address evidence can scale, and supplied field photos can unlock one-corner recognition. But recognizable storefront translation at 20/100/500 storefront scale still depends on field photography, provenance tracking, manual review, and Batu judgment.

## Selected Target Summary

Target: NW Greenpoint Deli / 903 Manhattan Ave, Brooklyn, NY 11222.

Field-photo correction: the supplied northwest corner photos show visible signage reading `GRILLPOINT DELI`. MVP-20 must reconcile whether the active place label should change from Greenpoint Deli to Grillpoint Deli, whether the earlier label was shorthand/error, and what real-card or visual treatment is allowed.

Relationship to MVP-18:

- MVP-18 recommended the full four-corner Greenpoint Ave x Manhattan Ave evidence boundary and selected NW Greenpoint Deli / 903 Manhattan Ave as the first real-facade translation spike candidate.
- MVP-18 found plausible address/lot structure for 903 Manhattan Ave: BBL `3025580051`, BIN `3064720`, block `2558`, lot `51`.
- MVP-18 also found Greenpoint Deli status, storefront frontage, entrance position, signage, and facade cues unresolved.
- MVP-19 tests whether the selected corner now has supplied reference evidence and whether the evidence process can repeat at Greenpoint scale.

Target viability:

- Viable as a first target for a docs-only MVP-20 translation boundary, pending Batu confirmation that the supplied files are owned/non-Google and approved for review-only reference use.
- Not ready for implementation, raster integration, real-place production cards, public-release claims, or final factual card copy.

## Reference Inventory

The following newly supplied files are present in `docs/mvp-reference-images/`. Codex inspected the northwest deli reference set and did not use Google, Street View, 3D Tiles, LiveXYZ facade imagery, scraping, screenshots, or copied web imagery.

| Reference | Capture/source owner | Capture date | View direction / what it shows | Approved use | Limits / uncertainty | Supports facade/signage/frontage/entrance? |
| --- | --- | --- | --- | --- | --- | --- |
| `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpeg` | Batu-supplied repo file; exact photographer/rights note not recorded in repo metadata. | EXIF: Apple iPhone 15 Pro, 2026-05-30 16:43:26. | Wide NW corner context, deli storefront in building base, subway entrance context, adjacent storefronts, street corner. | Review-only evidence and MVP-20 translation-boundary planning if Batu confirms owned/non-Google approval. | File is HEIF image content with `.jpeg` extension; capture owner/permission should be recorded explicitly before implementation. | Yes: frontage/order context, corner massing, subway context, facade/signage overview. |
| `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg` | Batu-supplied repo file; exact photographer/rights note not recorded in repo metadata. | EXIF: Apple iPhone 15 Pro, 2026-05-30 16:43:29. | Clear storefront/facade view with visible `GRILLPOINT DELI` sign, `903` address, entrance zone, adjacent cleaner/storefront, subway entrance, upper-floor massing. | Review-only evidence and MVP-20 translation-boundary planning if Batu confirms owned/non-Google approval. | Supports visible current-condition evidence at capture time, not final public active-status guarantee. | Yes: facade cues, signage, frontage, entrance zone, adjacency, transit anchor. |
| `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpeg` | Batu-supplied repo file; exact photographer/rights note not recorded in repo metadata. | EXIF: Apple iPhone 15 Pro, 2026-05-30 16:45:38. | Facade-focused NW deli view. | Review-only evidence and MVP-20 translation-boundary planning if Batu confirms owned/non-Google approval. | File is HEIF image content with `.jpeg` extension; Codex verified metadata but local image viewer could not decode it directly without temp conversion. | Likely yes; use in MVP-20 after direct visual inspection or conversion workflow is documented. |
| `docs/mvp-reference-images/northwest-subwayA.jpeg` | Batu-supplied repo file; exact photographer/rights note not recorded in repo metadata. | EXIF: Apple iPhone 15 Pro, 2026-05-30 16:44:26. | NW subway/street context near the selected corner. | Review-only transit-anchor/context evidence if Batu confirms owned/non-Google approval. | File is HEIF image content with `.jpeg` extension; exact station geometry remains subject to MVP-20 review. | Supports symbolic/context transit placement; exact station geometry still deferred. |

Allowed context from prior packet:

- `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md` may be used for prior address/lot/status findings and blocked-reference policy.
- `docs/approved-reference-corpus/` may be used for style language only, not real-facade truth.
- The newly supplied northwest JPEG/HEIF files may become eligible real-corner references once Batu confirms their owned/non-Google approval and intended use.

Blocked references:

- The deleted historical files `docs/mvp-reference-images/source-01-northwest-corner.png`, `source-03-northeast-corner.png`, `source-04-southwest-corner.png`, and `source-05-southeast-corner.png` remain blocked as likely Google Maps / Street View-derived historical evidence.
- Google Maps, Google Street View, Google 3D Tiles, and derived screenshots remain blocked as stored imagery, trace source, extraction input, texture source, generation input, training input, or facade-reference use.
- LiveXYZ-derived facade/art use remains blocked.
- Copied web imagery, business-page photos, logos, promotional imagery, and the MVP-17 raster plate are not allowed as factual facade references for this target.

## Status / Frontage / Facade Findings

| Finding | Current result | Confidence | Notes |
| --- | --- | --- | --- |
| Business identity | Selected target was Greenpoint Deli, but supplied photos show `GRILLPOINT DELI` signage at `903`. | Medium-high for visible sign; medium-low for official business identity. | MVP-20 must reconcile the active label/name and any card treatment. |
| Current active status | Field-photo evidence shows the storefront present and apparently operating at capture time. | Medium | This supports current-condition review, not final public active-status copy without source/status policy review. |
| Storefront frontage | Corner storefront at building base, wrapping/meeting the corner, with neighboring storefront context visible. | Medium-high | Exact frontage width remains interpretive; MVP-20 should translate as approximate, not survey-accurate. |
| Entrance position | Entrance zone visible near/under `903` and corner signage. | Medium | Exact doorway/card anchor needs MVP-20 MapAnchor review. |
| Signage / awning / brand treatment | Visible `GRILLPOINT DELI` sign band with green circular `G` marks, dark awning/band, dense window/menu treatment. | Medium-high | Exact logo/trade-dress reproduction and sign wording need Batu treatment decision. |
| Facade cues | Salmon/pink corner building, four-story massing, black window trim, corner vertical edge, ground-floor deli clutter, adjacent green awning/cleaner storefront, subway entrance in front. | Medium-high | Use as stylized cues only; do not claim exact facade reproduction. |
| Visual-reference eligibility | Eligible for review-only MVP-20 planning if Batu confirms owned/non-Google approval. | Medium | Provenance/rights note should be explicitly recorded before any implementation brief. |
| Card copy eligibility | Not ready for final public copy. | Medium-low | Business name/status mismatch must be resolved before card-ready copy. |

Unresolved conflicts and required treatment:

- Active business identity should be treated as `manual-review-required` because supplied signage says `GRILLPOINT DELI` while project docs refer to Greenpoint Deli.
- Storefront frontage, entrance position, signage/awning treatment, and facade cues now have supplied photo evidence but still need MVP-20 translation decisions and Batu approval.
- The target can move into a docs-only MVP-20 translation-boundary review, but it must not move directly into implementation or production claims.
- Real-facade translation must not proceed from memory, Google/Street View/3D Tiles, LiveXYZ facade views, copied web imagery, or the blocked local source screenshot.

## Evidence Scalability Assessment

Classification categories:

- `automated/public-data repeatable`
- `manual desktop research repeatable`
- `field-photo required`
- `Batu judgment required`
- `blocked/not scalable`

| Evidence row | Source path used or required | Confidence | Manual effort required | Scalability category | 20-storefront read | 100-storefront read | 500-storefront read | Blocker or mitigation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Building footprint/massing | Prior MVP-18 official city evidence: NYC GeoSearch/PAD, MapPLUTO; future automated/public-data pull if approved later. | Medium for review-only massing. | Low per address after source path exists. | automated/public-data repeatable | Feasible with spot checks. | Feasible if schema and QA rules exist. | Needs pipeline/legal/QA gate; not MVP-approved. | Public data gives footprint/massing, not facade truth. |
| Lot/parcel/BBL | MVP-18: BBL `3025580051`, BIN `3064720`, block `2558`, lot `51`. | Medium-high for review evidence. | Low per address. | automated/public-data repeatable | Feasible. | Feasible. | Feasible technically, but broad import remains blocked. | Mitigate with official source hierarchy and conflict notes. |
| Address confirmation | MVP-18 official city records plus public business/directory candidate. | Medium. | Low to medium. | manual desktop research repeatable | Feasible with review. | Feasible but conflict handling grows. | Requires data workflow and QA policy beyond MVP. | Business-facing address may differ from tax-lot primary address. |
| Business identity | MVP-18 local/directory candidate plus supplied photos showing `GRILLPOINT DELI` at `903`; official business source still required. | Medium. | Medium. | manual desktop research repeatable | Feasible with source hierarchy. | Slower; many local businesses lack strong official pages. | Not reliable without a manual workflow and stale-source policy. | Mitigate with official business source, public profile, or field confirmation; MVP-20 must reconcile Greenpoint vs Grillpoint naming. |
| Business active status | Supplied field photos dated 2026-05-30 show the storefront present/apparently operating; official/current source still required for public copy. | Medium. | Medium to high. | manual desktop research repeatable | Feasible but needs freshness rules. | Hard; stale/conflicting sources likely. | Not scalable without licensed/current business data or field program. | Treat as field-observed current condition, not final public active-status guarantee. |
| Storefront frontage | Supplied northwest deli photos in `docs/mvp-reference-images/`. | Medium-high. | High. | field-photo required | Feasible with planned field capture. | Expensive but possible with organized route/photos. | Not scalable as ad hoc manual work. | Need capture protocol: full facade, neighboring bays, corner context, provenance record. |
| Storefront order/adjacency | Supplied northwest wide/closeup photos show adjacent cleaner/storefront and corner context. | Medium. | High. | field-photo required | Feasible with contact sheets and review notes. | Labor-heavy. | Not scalable without structured capture/review operations. | Must avoid false adjacency; use MapAnchor notes and Batu review. |
| Facade cues | Supplied northwest deli photos in `docs/mvp-reference-images/`. | Medium-high. | High. | field-photo required | Feasible for selected storefronts. | Labor-heavy but possible with photo standard. | Not scalable without production field-photo system. | Use only supplied/approved non-Google photos; do not use Google/Street View/LiveXYZ facade imagery. |
| Signage/awning/brand treatment | Supplied photos plus Batu treatment decision required. | Medium. | High. | Batu judgment required | Feasible for a curated slice. | Heavy due to brand/trade-dress decisions. | Not scalable without brand/legal/art policy. | Decide whether to use exact `GRILLPOINT DELI`, stylize, generalize, or fictionalize. |
| Subway entrance/transit anchor | MTA text sources for station context; owned field photo if exact access geometry is needed. | Medium for symbolic; low for exact geometry. | Low for symbolic, high for exact. | manual desktop research repeatable | Symbolic transit cue feasible. | Feasible for symbolic anchors. | Feasible for symbolic anchors; exact geometry needs fieldwork. | Keep Greenpoint G symbolic unless exact access evidence is approved. |
| Visual-reference eligibility | Supplied northwest field photos plus MVP-18 policy. | Medium-high pending explicit ownership/use note. | Medium. | Batu judgment required | Feasible if every reference has provenance. | Heavy but manageable with a strict intake form. | Not scalable without rights/provenance system. | Only owned/approved non-Google references can unlock facade use; these should be recorded as review-only until implementation is separately opened. |
| Card copy eligibility | Public factual source required; active status unresolved. | Low to medium. | Medium. | manual desktop research repeatable | Feasible for 4-6 MVP cards. | Heavy due to freshness and neutral-copy review. | Not scalable without editorial/data governance. | Keep copy neutral and source-backed; do not claim active status without evidence. |
| Isometric placement confidence | MVP-18 boundary plus future MapAnchor review and field evidence. | Low for exact selected-corner placement; medium for quadrant. | Medium to high. | Batu judgment required | Feasible for authored MVP slice. | Requires repeatable placement rules. | Not scalable without map/anchor methodology and QA. | Authored compression requires Batu approval; no exact placement claims. |

## Scale Readout

### One Corner

What can automate:

- Official lot, BBL/BIN, address-container, and coarse building facts can be gathered from public data paths already proven in MVP-18.

What can be desktop-researched:

- Candidate business identity, address cross-checks, transit context, and source/conflict notes.

What needs field photography:

- Storefront frontage, entrance position, signage/awning, facade cues, neighboring bay order, and visual-reference eligibility.

What needs Batu judgment:

- Whether uncertain Greenpoint Deli evidence is strong enough for representation.
- Whether to fictionalize/generalize the sign, facade, or card.
- Whether exactness risk is acceptable in an authored isometric translation.

What is not scalable yet:

- Broad real-facade translation beyond this corner; one-corner references now exist, but scalable photo provenance and treatment policy do not.

### 20 Storefronts

What can automate:

- Lot/address/building baseline can be collected for a small curated list if a later brief approves a static workflow.

What can be desktop-researched:

- Business identity and source status can be reviewed manually, with clear stale/uncertain labels.

What needs field photography:

- Any storefront intended to be visually recognizable, especially frontage, entrance, signage, and facade cues.

What needs Batu judgment:

- Which storefronts are worth field effort, which become context-only, and which are fictionalized.

What is not scalable yet:

- Ad hoc photo provenance, rights intake, and real-brand treatment decisions across all 20 without a formal template.

### 100 Storefronts

What can automate:

- Public lot/address/building lookup is plausible technically but not approved as an MVP pipeline.

What can be desktop-researched:

- Business identity and current status only with significant manual QA and freshness rules.

What needs field photography:

- Recognizable facade and frontage evidence for real storefronts.

What needs Batu judgment:

- Treatment grouping, brand simplification, omissions, and public representation risk.

What is not scalable yet:

- Manual storefront-by-storefront art eligibility and card readiness without a repeatable evidence intake system.

### 500 Storefronts

What can automate:

- Official public-data lot/address/building facts may scale technically after later architecture/legal approval.

What can be desktop-researched:

- Only sampled QA or high-priority storefronts; full manual status review is likely too expensive.

What needs field photography:

- Most real-facade visual specificity, unless the project shifts to generalized/fictional-safe storefronts.

What needs Batu judgment:

- Policy-level decisions: how much real specificity is worth preserving, where to generalize, and what to omit.

What is not scalable yet:

- Approved visual-reference acquisition, storefront frontage certainty, active-status freshness, exact adjacency, real-brand treatment, and card copy for broad coverage.

## MVP-20 Readiness Recommendation

Recommendation: `proceed-to-mvp-20`.

MVP-20 Real-Corner Translation Boundary is recommended, pending Batu approval to open it.

MVP-20 should be constrained to docs-only translation planning and must reconcile:

- Whether the place should remain labeled Greenpoint Deli or be corrected to `GRILLPOINT DELI`.
- Which supplied references are approved for review-only visual translation planning.
- Which facade, signage, awning, storefront, entrance, and subway-context cues may be represented recognizably.
- What must be stylized, generalized, fictionalized, omitted, or kept manual-review-required.
- How to map the selected corner into Place, Building, Storefront, and MapAnchor relationships without exact facade/address/station-geometry claims.

MVP-20 must not authorize raster integration, app/source edits, screenshots, production assets, production data, public-release card copy, exact facade claims, exact frontage/order claims, or exact station-geometry claims. It is a translation boundary only.

## Source And Scope Notes

- Required docs read: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/MVP_SCOPE.md`, `docs/PLACE_SCHEMA.md`, `docs/PLACE_SOURCE_POLICY.md`, and `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md`.
- No new public-source lookup, scraping, live data pipeline, browser screenshot, renderer work, visual generation, app/source implementation, asset creation, staging, or commit was performed.
- Local photo inspection was limited to the supplied repo files under `docs/mvp-reference-images/`; temporary conversion attempts for HEIF-with-`.jpeg` files were written only under `/private/tmp`.
- No Google/Street View/3D Tiles-derived image was stored, copied, traced, transformed, extracted, used as generation input, used as training input, or used as facade reference.
