# MVP-07 Reusable Place Evidence Pipeline Spike

Status: Complete for Batu/ChatGPT review
Date: 2026-05-29
Verdict: `revise`

## Purpose

This spike proposes a repeatable evidence pipeline for turning Greenpoint addresses and businesses into validated interactive scene data and approved art-reference inputs.

It is a review artifact only. It does not approve production data, automated imports, scraping, live refresh, production assets, exact facades, exact storefront order, exact station geometry, public card copy, app/source changes, screenshots, staging, or commit.

## Active Scene Under Test

Current app/data active set confirmed from `src/mvpPlaceData.js`:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

MVP-06 correctly aligned the prototype to this set, but facade/art accuracy remains unresolved. LiveXYZ links are identity/presence evidence only. Google/Street View-style imagery remains blocked as facade/art evidence.

## Recommended Source Hierarchy

Use the strongest source for each claim, and record what the source supports. One source can support identity without supporting address, facade, or placement.

### Address, Parcel, Building

1. NYC official records: NYC Property Information Portal, MapPLUTO, Department of Finance, or equivalent official city sources.
2. Other official public-agency records where relevant.
3. Public-record-backed property sources as cross-checks when official pages are unreadable or incomplete.
4. OpenStreetMap as a useful spatial cross-check, not sole authority for sensitive placement.
5. Manual field review or owned/reference photos.
6. Batu approval for authored approximations, unresolved conflicts, or public representation.

### Business Identity, Presence, Status

1. Business official website, official location page, or official social/public profile.
2. LiveXYZ-like local place pages for identity/presence only unless separately approved for additional claims.
3. Google Places or equivalent manual lookup for identity/status/address cross-check only; not facade/art evidence under the current block.
4. Secondary directories, press, or local listings as supporting evidence only.
5. Manual field review.
6. Batu approval when evidence is incomplete, conflicting, branded, or approximate.

### Facade / Art Reference

1. Batu-supplied or project-owned storefront photos with provenance, date, and allowed-use note.
2. Explicitly licensed or public-domain visual references with clear allowed use.
3. Approved non-Google field-reference photos from a trusted reviewer.
4. Approved reference corpus for style language only, not exact real storefronts.
5. Generic fictional-safe storefront rules when facade evidence is missing.

Blocked as facade/art reference unless a later legal/architecture gate changes the rule:

- Google Maps, Street View, Street View-style captures, and Google 3D Tiles.
- LiveXYZ-like pages unless Batu separately approves them for visual-reference use.
- Unproven screenshots, scraped imagery, AI guesses, memory, or prose descriptions.

## Evidence Status Taxonomy

Use independent status fields so a place can be strong on identity and weak on facade.

| Dimension | Status values | Meaning |
| --- | --- | --- |
| `identityStatus` | `verified`, `partial`, `unresolved`, `conflict`, `not-applicable` | Whether the named place exists as a candidate entity. |
| `businessStatus` | `active-verified`, `active-candidate`, `unknown`, `closed`, `relocated`, `not-applicable` | Whether it can be represented as currently active. |
| `addressStatus` | `verified`, `partial`, `unresolved`, `conflict`, `not-applicable` | Whether the address is source-backed enough for review. |
| `parcelStatus` | `verified`, `partial`, `unresolved`, `conflict`, `not-applicable` | Whether building/lot linkage is known. |
| `storefrontStatus` | `verified`, `partial`, `unresolved`, `conflict`, `not-applicable` | Whether the tenant-facing frontage/entrance relationship is known. |
| `placementStatus` | `exact-enough`, `authored-approximation`, `symbolic`, `placeholder`, `blocked` | Whether the scene may place it without false geography. |
| `facadeReferenceStatus` | `approved`, `style-only`, `generic-only`, `blocked`, `missing`, `not-applicable` | Whether visual detail may be based on real facade evidence. |
| `cardEligibility` | `real-card-ok`, `context-only`, `fictionalize`, `placeholder`, `omit`, `blocked` | Recommended representation outcome. |

Recommended summary confidence:

- `high`: identity, address, building/storefront, placement, and facade/reference requirements are all cleared for the intended use.
- `medium`: enough for symbolic/context or generic treatment, but not exact facade or placement claims.
- `low`: useful candidate, but real-card, facade, or placement use would overclaim.
- `blocked`: source conflict, prohibited visual evidence, wrong-geography risk, or missing approval blocks use.

## Place Record Schema Proposal

This is conceptual only. It is not an app/source interface.

```js
{
  id: "greenpoint-deli",
  displayName: "Greenpoint Deli",
  category: "Deli / food retail",
  entityType: "business | transit-anchor | building | placeholder",
  sourceClaimSet: {
    identity: [
      {
        sourceId: "greenpoint-deli-livexyz",
        label: "LiveXYZ Greenpoint Deli",
        url: "https://embed.livexyz.com/venue/5526f8acd8ca7000030002e4",
        reviewedOn: "2026-05-29",
        supports: ["identity", "presence-candidate"],
        doesNotSupport: ["facade", "frontage", "exact-address", "production-placement"]
      }
    ],
    address: [],
    parcel: [],
    storefront: [],
    facadeReference: []
  },
  evidenceStatus: {
    identityStatus: "partial",
    businessStatus: "active-candidate",
    addressStatus: "unresolved",
    parcelStatus: "unresolved",
    storefrontStatus: "unresolved",
    placementStatus: "authored-approximation",
    facadeReferenceStatus: "missing",
    cardEligibility: "fictionalize",
    confidence: "low"
  },
  spatialReview: {
    normalizedAddress: null,
    bbl: null,
    bin: null,
    sideOfStreet: null,
    storefrontOrder: null,
    entranceNotes: null,
    mapAnchorId: "authored-scaffold-only",
    falseAdjacencyRisks: []
  },
  visualReview: {
    allowedTreatment: "generic-fictional-safe",
    approvedReferenceIds: [],
    blockedReferenceNotes: ["Google/Street View-style imagery blocked"],
    brandTreatmentDecision: "reserved-for-batu"
  },
  publicCard: {
    cardTitle: "Greenpoint Deli",
    cardCopyStatus: "not-approved",
    disclaimerRequired: true,
    sourceUrlsToDisplay: []
  },
  review: {
    manualReviewRequired: true,
    unresolvedQuestions: [],
    decisionOwner: "Batu/ChatGPT",
    nextAction: "verify address, parcel, storefront, and approved visual reference"
  }
}
```

## Facade / Art-Reference Eligibility Rules

A place is eligible for real-inspired facade/art treatment only when all of the following are true:

- Identity/status evidence is sufficient for the intended representation.
- Address and building/parcel relationship are source-backed or explicitly approved as approximate.
- Storefront/frontage/entrance relationship is known enough to avoid false adjacency or wrong-side placement.
- Visual reference is owned, supplied, licensed, public-domain, or otherwise explicitly approved.
- The visual reference is not Google/Street View/3D Tiles-derived and not LiveXYZ-only.
- Branded signage treatment has a Batu decision, especially for chains.
- The card and scene labels can explain uncertainty without making the prototype feel like an official map.

If any requirement fails:

- Use `generic-only` visual treatment for local texture.
- Use `fictionalize` when a named real business would imply unsupported facade/status/brand claims.
- Use `context-only` for civic or transit anchors with unresolved exact geometry.
- Use `omit` when the place weakens the scene or cannot be represented truthfully.
- Use `blocked` when the only visual evidence is prohibited or the geography would be misleading.

## Manual vs Automated Steps

Automatable or semi-automatable after a later tooling gate:

- Normalize candidate names and addresses.
- Store source URLs, review dates, and claim types.
- Pull or ingest official parcel/address identifiers from approved static exports.
- Compare candidate addresses against official parcel/building records.
- Flag missing fields, stale verification dates, source conflicts, and blocked visual-reference provenance.
- Generate review tables from static records.

Manual and approval-owned:

- Confirm business status when sources conflict or are stale.
- Confirm storefront order, entrance position, side of street, and multi-tenant relationships.
- Decide whether a branded chain remains literal, is fictionalized, or is omitted.
- Approve any non-Google facade/art reference.
- Approve authored spatial approximations and symbolic treatment.
- Decide whether a place becomes a real card, context-only card, fictional-safe stand-in, placeholder, omitted item, or blocked item.

MVP constraint:

- For the MVP, the pipeline should remain a documented manual workflow using static review artifacts. Automated broad imports, scraping, live data, backend services, or refresh jobs remain blocked.

## Current Scene Pipeline Test

| Place | Identity/presence | Address/parcel/storefront | Facade/art reference | Recommended treatment | Pipeline verdict |
| --- | --- | --- | --- | --- | --- |
| Greenpoint Deli | Partial via user-provided LiveXYZ identity/presence link. | Missing in current project evidence. | Missing; Google/Street View-style imagery blocked; LiveXYZ not facade evidence. | Fictional-safe or generic placeholder until verified. | `revise` |
| McDonald's | Partial via user-provided LiveXYZ identity/presence link. | Missing in current project evidence. | Missing; branded facade/signage requires extra approval. | Fictionalize or context-only unless real-brand treatment is approved. | `revise` |
| Dunkin' | Partial via user-provided LiveXYZ identity/presence link. | Missing in current project evidence. | Missing; branded facade/signage requires extra approval. | Fictionalize or context-only unless real-brand treatment is approved. | `revise` |
| Citizens Bank | Partial via user-provided LiveXYZ identity/presence link. | Missing in current project evidence. | Missing; bank facade/signage requires approval and source evidence. | Context-only, fictionalized, or omitted pending Batu decision. | `revise` |
| Greenpoint G subway | Medium for station identity/context via MTA evidence recorded in current data. | Exact access-point geometry unresolved. | Style-only symbolic transit cues allowed; exact station geometry blocked. | Context-only symbolic transit anchor. | `revise` |

Result:

- The proposed pipeline classifies the current prototype state cleanly.
- It preserves the MVP-06 correction without overclaiming facade, address, frontage, or production placement.
- It does not yet unlock Visual Polish / Optional Ambient because the current businesses still lack approved address/parcel/storefront and facade/art-reference evidence.

## Scaling Risks

- Address records do not equal storefront records; multi-tenant buildings will need manual storefront review.
- Local businesses change faster than official parcel data; `lastVerified` freshness will decay.
- Chain-brand treatment may clash with the fictional-safe visual direction or require stricter approval.
- A broad Greenpoint pass can create false confidence if official parcels are matched to businesses without street-level frontage review.
- Visual-reference collection is likely the scaling bottleneck because Google/Street View-style imagery is blocked.
- Corridor expansion can imply false adjacency if block faces, opposite corners, and side streets are compressed too aggressively.
- Source conflicts will grow quickly unless each claim records what it supports and what it does not support.
- Automating too early would turn a review workflow into an unapproved data pipeline.

## Recommended Next Implementation Task

Do not proceed to Visual Polish / Optional Ambient yet.

Recommended next task:

- MVP-08 Place Evidence Packet For Current Scene, docs-only.
- Produce one evidence card per current active place using the MVP-07 taxonomy.
- For each place, fill identity, address, parcel/building, storefront/frontage, facade-reference provenance, recommended treatment, and unresolved questions.
- Use only approved/manual research methods and static review notes.
- Stop if approved facade/art-reference inputs are missing, and report the exact missing input paths or source categories.

## Final Verdict

Verdict: `revise`.

The pipeline itself is viable as a repeatable review workflow, but the current scene is not ready for real-inspired facade/art treatment or Visual Polish / Optional Ambient. The next useful move is a current-scene evidence packet that applies this taxonomy place by place and identifies which candidates can become real cards, context anchors, fictional-safe stand-ins, omitted items, or blocked items.
