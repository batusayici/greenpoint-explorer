# MVP-05 Source-Of-Truth Validation Spike

Status: Corrected for Batu/ChatGPT review
Date: 2026-05-29
Scope: Docs/data-only review artifact for the current Manhattan Ave / Greenpoint Ave corner/place set

## Purpose

This packet tests whether the current source-of-truth approach can support the MVP block face before any Visual Polish / Optional Ambient work.

Approach under test:

- Public/open address-building evidence already recorded in project docs.
- User-provided current-scene place links.
- Owned or approved visual references.
- Human QA and Batu approval for unresolved public representation.

This is review-only evidence. It does not approve production data, production assets, exact facades, exact storefront widths, exact frontage/order, exact station geometry, exact addresses in visual placement, public card copy, app/source changes, live data, scraping, backend services, CI, deployment, staging, or commit.

## Correction Note

This correction replaces stale previous-scene pending-review businesses with the actual current corner/place set.

Previous-scene / stale references, not current pending-review businesses:

- Sweetgreen Greenpoint.
- Captured Record Shop.
- Karczma.
- Polka Dot / 726 Manhattan Ave.
- Peter Pan Donut & Pastry Shop and former Meserole Theater are also previous-scene references for this corrected MVP-05 packet.

Those older candidates may remain historical evidence in earlier MVP-02/MVP-03 docs, but they are not the current MVP-05 validation set.

## Current Scene Place Set

The corrected current set is:

- Greenpoint Deli: `https://embed.livexyz.com/venue/5526f8acd8ca7000030002e4`
- McDonald's: `https://embed.livexyz.com/venue/5511c3063d42bd0003001146`
- Dunkin': `https://embed.livexyz.com/venue/5b50eecca3e3ee0003e4e0db`
- Citizens Bank: `https://embed.livexyz.com/venue/64893028145f5b00018b86a7`
- Greenpoint G subway.

LiveXYZ links are treated here as user-provided place identity/presence evidence only. They were not fetched, scraped, or treated as approved facade/art references. They do not by themselves approve exact address, storefront frontage, facade cues, entrance geometry, active-status finality, production placement, or card copy.

## Evidence Base

Reviewed existing project evidence:

- `docs/reference/PLACE_SOURCE_POLICY.md`
- `docs/reference/PLACE_SCHEMA.md`
- `docs/MVP_SCOPE.md`
- `docs/reference/approved-reference-corpus/REFERENCE_INDEX.md`
- `docs/reference/approved-reference-corpus/MANIFEST.md`
- `docs/reference/approved-reference-corpus/USAGE_RULES.md`
- `src/mvpPlaceData.js` only to confirm that app/source implementation remains stale relative to this corrected current scene set.

No new web lookup, scraping, live data fetch, screenshot generation, visual generation, app/source edit, package/config/build/CI/deployment edit, staging, or commit was performed.

Important visual-reference note:

- The current `docs/mvp-reference-images/` files are project-supplied, but they visibly appear to be Google Maps / Google Street View captures. Under project governance, they are `blocked` as stored visual references, extraction inputs, texture sources, or facade data.
- The approved reference corpus supports Inked Indie / Compact Corner visual style only. It does not approve exact real storefronts, exact facades, exact addresses, exact station geometry, or production visual assets.

## Storefront Evidence Cards

### 1. Greenpoint Deli

- Candidate storefront/place: Greenpoint Deli.
- Candidate address: `missing`.
- Building/tax-lot linkage: `missing`.
- Candidate business/status/category: candidate business; deli / food retail; status not final.
- Source/provenance notes: User-provided LiveXYZ link supports current-scene identity/presence for review: `https://embed.livexyz.com/venue/5526f8acd8ca7000030002e4`. The link was not fetched in this correction and is not treated as final address, status, facade, or placement proof.
- Visual-reference provenance: `blocked` for exact facade because current scene reference images appear to be Google/Street View captures; LiveXYZ is not justified here as an approved facade/art reference.
- Facade cues useful for stylization: `missing` for exact sign, awning, color/material, entrance/window rhythm, and distinctive details. Use only generic fictional-safe deli/storefront cues until approved non-Google visual reference or manual field evidence exists.
- Confidence: low.
- Manual-review flags: confirm address; confirm current status; confirm building/tax-lot linkage; confirm storefront frontage/entrance; obtain owned/approved non-Google visual reference if any real-place styling is desired.
- Recommended treatment: needs Batu decision.

### 2. McDonald's

- Candidate storefront/place: McDonald's.
- Candidate address: `missing`.
- Building/tax-lot linkage: `missing`.
- Candidate business/status/category: candidate business; fast-food restaurant; status not final.
- Source/provenance notes: User-provided LiveXYZ link supports current-scene identity/presence for review: `https://embed.livexyz.com/venue/5511c3063d42bd0003001146`. The link was not fetched in this correction and is not treated as final address, status, facade, or placement proof.
- Visual-reference provenance: `blocked` for exact facade because current scene reference images appear to be Google/Street View captures; LiveXYZ is not justified here as an approved facade/art reference.
- Facade cues useful for stylization: `missing` for exact sign, awning, color/material, entrance/window rhythm, and distinctive details. Branded facade/signage treatment needs extra caution and Batu approval before any public-facing real-place representation.
- Confidence: low.
- Manual-review flags: confirm address; confirm current status; confirm building/tax-lot linkage; confirm storefront frontage/entrance; decide whether branded chain signage is appropriate for the MVP's fictional-safe visual direction.
- Recommended treatment: needs Batu decision.

### 3. Dunkin'

- Candidate storefront/place: Dunkin'.
- Candidate address: `missing`.
- Building/tax-lot linkage: `missing`.
- Candidate business/status/category: candidate business; coffee / quick-service restaurant; status not final.
- Source/provenance notes: User-provided LiveXYZ link supports current-scene identity/presence for review: `https://embed.livexyz.com/venue/5b50eecca3e3ee0003e4e0db`. The link was not fetched in this correction and is not treated as final address, status, facade, or placement proof.
- Visual-reference provenance: `blocked` for exact facade because current scene reference images appear to be Google/Street View captures; LiveXYZ is not justified here as an approved facade/art reference.
- Facade cues useful for stylization: `missing` for exact sign, awning, color/material, entrance/window rhythm, and distinctive details. Branded chain treatment should stay generic/fictionalized unless Batu approves real-brand treatment and source evidence.
- Confidence: low.
- Manual-review flags: confirm address; confirm current status; confirm building/tax-lot linkage; confirm storefront frontage/entrance; decide whether to fictionalize or omit branded-chain identity.
- Recommended treatment: needs Batu decision.

### 4. Citizens Bank

- Candidate storefront/place: Citizens Bank.
- Candidate address: `missing`.
- Building/tax-lot linkage: `missing`.
- Candidate business/status/category: candidate business; bank / financial services; status not final.
- Source/provenance notes: User-provided LiveXYZ link supports current-scene identity/presence for review: `https://embed.livexyz.com/venue/64893028145f5b00018b86a7`. The link was not fetched in this correction and is not treated as final address, status, facade, or placement proof.
- Visual-reference provenance: `blocked` for exact facade because current scene reference images appear to be Google/Street View captures; LiveXYZ is not justified here as an approved facade/art reference.
- Facade cues useful for stylization: `missing` for exact sign, awning, color/material, entrance/window rhythm, and distinctive details. Bank-corner massing may be useful as context only after approved source evidence.
- Confidence: low.
- Manual-review flags: confirm address; confirm current status; confirm building/tax-lot linkage; confirm frontage/entrance; decide whether bank use supports the MVP's desired first-click local specificity.
- Recommended treatment: needs Batu decision.

### 5. Greenpoint G Subway

- Candidate storefront/place: Greenpoint G subway.
- Candidate address: Greenpoint Av station area at Manhattan Ave / Greenpoint Ave.
- Building/tax-lot linkage: `missing`.
- Candidate business/status/category: symbolic transit anchor; not an ordinary business.
- Source/provenance notes: Existing project evidence cites MTA sources for Greenpoint Av as a G line station and accessibility context. Exact stair/elevator/access-point geometry remains unresolved.
- Visual-reference provenance: `blocked` for exact station geometry because current scene reference images appear to be Google/Street View captures; `approved` style-only corpus exists for symbolic transit treatment.
- Facade cues useful for stylization: G-line green identity, transit sign/globe/elevator language, and compact civic-street anchor are allowable only as symbolic cues; exact stair, elevator, entrance side, and corner placement are blocked.
- Confidence: medium.
- Manual-review flags: exact access-point geometry; whether the station receives card treatment; how symbolic transit cues attach to the authored scene.
- Recommended treatment: use as context only.

## Previous-Scene References Removed From Current Pending Review

The following candidates are not current MVP-05 pending-review businesses:

| Previous-scene reference | Current correction |
| --- | --- |
| Sweetgreen Greenpoint | Stale previous-scene candidate; removed from current MVP-05 evidence cards. |
| Captured Record Shop | Stale previous-scene candidate; removed from current MVP-05 evidence cards. |
| Karczma | Stale previous-scene candidate; removed from current MVP-05 evidence cards. |
| Polka Dot / 726 Manhattan Ave | Stale previous-scene candidate; removed from current MVP-05 evidence cards. |
| Peter Pan Donut & Pastry Shop | Stale previous-scene candidate for this corrected packet; not part of current set. |
| Former Meserole Theater / 723-725 Manhattan Ave | Stale previous-scene/context candidate for this corrected packet; not part of current set. |

## Scale-Readiness Verdict

Verdict: `revise`.

The verdict did not change, but the grounding changed. The earlier packet was too attached to a stale previous-scene candidate set. This corrected packet now bases the `revise` verdict on the actual current corner/place set.

What automated cleanly:

- The current place list can be represented as a compact five-item review set.
- User-provided LiveXYZ links give a starting identity/presence source for Greenpoint Deli, McDonald's, Dunkin', and Citizens Bank.
- Existing MTA-backed project evidence still supports Greenpoint G subway as a symbolic transit anchor.

What required manual review:

- Addresses, current status, building/tax-lot linkage, storefront frontage, storefront order, entrance positions, and adjacency for Greenpoint Deli, McDonald's, Dunkin', and Citizens Bank.
- Exact station stair/elevator/access-point geometry for Greenpoint G subway.
- Whether branded chain businesses should be shown as real cards, fictionalized, context-only, or omitted inside the approved fictional-safe visual direction.
- Which non-Google, owned, or explicitly approved storefront-specific visual references may be used for any corrective scene/data work.

What blocked confidence:

- LiveXYZ links were not fetched or cross-checked in this correction and are not enough by themselves for final address, facade, or production-placement claims.
- No building/tax-lot linkage is recorded in current project evidence for the four business candidates.
- The current project-supplied corner images appear to be Google Maps / Google Street View captures, so they are blocked as facade evidence.
- No owned or explicitly approved storefront-specific visual-reference set exists for the current real candidates.

Recommended path before Visual Polish / Optional Ambient:

- Revise real-place usage before polish.
- Treat Greenpoint G subway as symbolic/context only unless exact access geometry is manually verified and approved.
- Treat Greenpoint Deli, McDonald's, Dunkin', and Citizens Bank as current-scene candidates needing Batu decision, source verification, and approved visual-reference evidence before real-card or facade-specific treatment.
- Consider fictionalizing branded storefront identities if real-brand use weakens the approved fictional-safe visual direction or cannot be source-backed safely.
- Do not begin Visual Polish / Optional Ambient until Batu/ChatGPT review this corrected packet and approve a corrective scene translation/data realignment boundary with allowed visual-reference assets.

## Acceptance Status

MVP-05 is corrected as a docs/data-only source-of-truth validation spike for the actual current corner/place set.

It recommends `revise`, not `proceed` and not full `cut`, because the source-of-truth workflow is still useful but current-scene evidence is incomplete for confident real-place usage before the MVP polish pass.
