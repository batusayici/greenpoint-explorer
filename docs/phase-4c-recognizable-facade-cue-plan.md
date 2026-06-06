# Phase 4C Recognizable Facade Cue Plan

Status: Batch 4C-1 planning output / Phase 4C geometry-only work-packet support
Date: 2026-06-06
Scope: Greenpoint Ave corridor from Manhattan Ave toward Franklin Ave
Creative/product/source approval owner: Batu
Execution owner inside approved boundaries: Codex

## Purpose

Define the smallest truth-safe path from the committed Phase 4B deterministic graybox corridor toward recognizable Greenpoint Ave corridor identity.

This plan does not authorize runtime code, source fixture expansion, manifest schema changes, camera tuning, source acquisition, external APIs, scraping, generated assets, art-direction work, business overlays, storefront anchors, production assets, or public factual claims.

Current execution authority lives in `docs/CURRENT_EXECUTION_BRIEF.md`. As of the bounded Phase 4C work-packet governance update, `Batch 4C-2: Geometry-only facade cue fixture and QA overlay` is executable, and `Batch 4C-3: Narrow geometry-only cue tuning pass` is conditionally pre-authorized only if 4C-2 verification passes and all work remains geometry-only, deterministic, and free of Batu product/visual/source-evidence decisions.

The operating principle:

```text
source-backed geometry may improve corridor structure
approved facade evidence may improve recognizable identity
missing evidence must remain visible as blocked, symbolic, context-only, or manual-review-required
```

## Current Starting Point

Phase 4B now proves:

- Deterministic source-backed/contextual building massing.
- Semantic object IDs and invisible pick targets.
- QA/provenance and blocked-claim visibility.
- Corridor side counts, endpoint cues, path hierarchy, and building rhythm cues.
- A React + Vite + Three.js runtime boundary for the current proof.

Phase 4B does not prove:

- Exact facade appearance.
- Storefront order, tenant frontage, or entrance placement.
- Signage, window, door, awning, material, or color truth.
- Exact address placement.
- Business identity, active-business status, or public card readiness.
- Production visual assets, production asset direction, or raster readiness.

## Cue Taxonomy

### A. Geometry-Only Cues

These cues may be represented deterministically from existing source-backed geometry only, if the future implementation labels them as source-backed geometry or QA/context cues rather than facade truth.

Allowed geometry-only cue classes:

- `street-facing-plane`: the side of a building mass that faces the corridor, derived from building geometry orientation and corridor side.
- `building-width-rhythm`: relative width, spacing, and separation between adjacent building masses, derived from footprint extents.
- `height-tier`: approximate low/mid/tall massing tier, only where existing source-backed height or generated primitive height already supports it.
- `corner-or-endpoint-role`: building or massing role near Manhattan Ave, Franklin Ave, or a block end, only where existing corridor/end geometry supports the relationship.
- `setback-or-depth-tier`: approximate shallow/deep massing relationship derived from footprint depth, not a facade or entrance claim.
- `block-break`: deterministic gap or seam between source-backed geometry objects, not a storefront seam unless separately evidenced.
- `side-of-corridor`: left/right corridor side assignment already visible in QA.
- `coverage-status`: source-backed/context-only/manual/blocked rendering state.

Geometry-only cues must not use real signs, real colors, real materials, tenant labels, window layouts, door positions, awnings, storefront bays, or brand-like marks.

### B. Human-Approved Evidence Cues

These cues require Batu-supplied or Batu-approved visual/evidence references with provenance, usage status, review date, and allowed-use notes before a later implementation can represent them.

Evidence-required cue classes:

- `facade-module-layout`: storefront bay grouping, vertical/horizontal facade rhythm, sign-band placement, or upper/lower facade split.
- `entrance-cue`: door or entry position, including corner-entry cues.
- `window-bay-cue`: approximate window rhythm or display-window placement.
- `sign-band-cue`: sign zone existence, size, or location.
- `awning-or-canopy-cue`: awning/canopy presence, rough placement, or color family.
- `material-or-color-note`: brick, tile, metal, painted facade, glass, roll gate, or major color family.
- `visible-prop-or-local-detail`: bike rack, planter, newspaper box, utility pole, poster surface, or other recognizable local detail tied to approved evidence.
- `transit-entrance-cue`: Greenpoint G station/stair/entrance cue, only where supplied/approved reference evidence supports corner/orientation relationship.
- `landmark-treatment`: any special visual treatment of a locally distinctive building or civic/transit feature beyond generic geometry cues.

Approved evidence cues may remain `manual_draft`, `sourced`, `verified`, `symbolic`, or `context-only`; the status must be visible in QA and preserved in source records.

### C. Forbidden Until Stronger Evidence Exists

These cues remain blocked unless a later brief supplies stronger evidence, approves the source policy, and opens the exact implementation boundary.

Forbidden cue classes:

- Exact facade reproduction.
- Exact storefront frontage, storefront order, tenant bay segmentation, or tenant adjacency.
- Exact entrance placement.
- Exact sign text, logo, trade dress, brand color, or promotional sign claims.
- Exact address placement on a facade or storefront.
- Active-business status, open-now status, or business identity tied to a specific frontage.
- Window, door, awning, material, prop, or color details inferred from geometry alone.
- Facade details from Google/Street View/3D Tiles extraction, scraping, texture reuse, training input, or unapproved third-party image collection.
- Production assets, production asset pipeline, public-release map claims, or public-ready real-place cards.

## Evidence Inputs

Allowed for geometry-only planning:

- Existing 4B source fixture records.
- Existing 4B generated semantic scene manifest.
- Existing Phase 3B NYC/Open geometry context fixture referenced by the 4B fixture/manifest.
- Existing runtime-derived review observations from 4B-6 and 4B-6R.

Allowed only after Batu approval for evidence-based cue planning or implementation:

- Batu-supplied current field photos.
- Project-owned photos with provenance and usage notes.
- Batu-approved non-Google public/open reference material with explicit usage status.
- Manual review notes tied to specific source/evidence records.
- Approved MVP-only exceptions already documented in `docs/MVP_SCOPE.md` or `docs/PLACE_SOURCE_POLICY.md`, limited to their stated scope.

Blocked inputs:

- New source fixture expansion during 4C-1.
- New external APIs, scraping, capture workflows, automated source acquisition, or live refresh.
- Google/Street View/3D Tiles extraction or visual-reference use outside documented exceptions.
- Unprovenanced images or generic web image collection.
- Generated assets or AI-created facade imagery as evidence.

## Fixture Requirements For A Later Batch

A later implementation batch should add a small cue fixture only if Batu approves that exact file/interface boundary. The cue fixture should be separate from business/storefront anchors until frontage evidence exists.

Minimum cue record shape:

```text
cueId
targetSemanticId
targetSourceRecordId
targetBuildingId or targetSideReference
cueClass
cueFamily: geometry-only | evidence-approved | symbolic | blocked
claimStatus: sourced | verified | inferred | manual_draft | symbolic | context-only | blocked | unknown | manual-review-required
evidenceIds
sourceIds
confidence
reviewer
reviewedAt
allowedUse
blockedClaims
notes
```

Minimum evidence record shape:

```text
evidenceId
evidenceType: geometry | field-photo | approved-reference | manual-note | review-observation
pathOrSourceRef
ownerOrSource
capturedOrPublishedAt
reviewedAt
usageStatus
allowedUses
blockedUses
supportsCueClasses
doesNotSupportClaims
notes
```

Verifier requirements:

- Fail if any cue lacks `targetSemanticId`, `cueClass`, `cueFamily`, `claimStatus`, `confidence`, `blockedClaims`, or provenance.
- Fail if an evidence-required cue is marked source-backed without approved evidence.
- Fail if geometry-only cues support facade, storefront, business, sign, material, entrance, or address claims.
- Fail if business/storefront anchors are created from cue records without a separately approved anchor boundary.
- Fail if blocked claims are omitted for any cue that could be visually misread as exact facade or storefront truth.
- Report counts by cue family, claim status, evidence type, and blocked-claim class.

## Landmark And Special-Treatment Buildings

Landmarks and special-treatment buildings need two levels:

- `geometry-special`: a massing is visually emphasized because existing source-backed geometry says it is corner-located, wider, taller, deeper, or important to corridor framing. This is allowed as a geometry-only cue if labeled.
- `identity-special`: a building receives real-world distinctive treatment because approved evidence identifies a facade, storefront, transit feature, or local landmark characteristic. This requires Batu-approved evidence and manual review.

Rules:

- Geometry may justify silhouette emphasis, not real-world identity.
- A large, corner, or unusual building must not be treated as a named landmark from geometry alone.
- Special treatment must carry `treatmentReason`, `evidenceIds`, `claimStatus`, `blockedClaims`, and `reviewer`.
- If evidence is missing, use generic geometry-special treatment or defer.
- Any branded or business-specific special treatment remains blocked until business/source, facade/frontage, and visual-reference gates all clear.

## Business And Storefront Anchor Dependency

Future business/storefront anchors must depend on facade/frontage evidence instead of facade cues depending on business guesses.

Dependency order:

1. Building/parcel/address context can identify candidate containers.
2. Facade/frontage evidence can identify possible tenant-facing zones.
3. Storefront anchors can be created only when frontage/entrance/order status is explicit.
4. Business links can attach to storefront anchors only when identity, address, status, and frontage evidence support the intended claim.
5. Cards or labels can render factual business content only after card-readiness and public-claim gates clear.

Blocked shortcut:

- Do not create a storefront anchor from business name, POI coordinate, address string, building footprint, sign-like visual cue, or geometry-only facade cue alone.

## Manual Review Gates

Gate 1: Cue fixture boundary approval.

- Batu approves whether a later batch may create a cue fixture and verifier.
- Public interface and module-boundary implications are reviewed before implementation.

Gate 2: Evidence packet approval.

- Batu approves the evidence categories, local files or source refs, usage status, and blocked uses.
- Missing evidence remains `blocked`, `unknown`, `symbolic`, or `manual-review-required`.

Gate 3: Cue classification review.

- Each cue is classified as `geometry-only`, `evidence-approved`, `symbolic`, or `blocked`.
- Reviewer can see what the cue supports and does not support.

Gate 4: Visual implementation review.

- A later runtime or visual batch may render only approved cue families.
- QA must expose cue status and blocked claims.
- Normal mode must not imply exact facade, storefront, business, sign, entrance, material, or address truth.

Gate 5: Storefront/business anchor review.

- Storefront or business anchors remain separate and blocked until frontage/entrance/order evidence and Batu approval exist.

## Acceptance Criteria For A Later Implementation Batch

The smallest safe implementation batch should be:

`Batch 4C-2: Geometry-only facade cue fixture and QA overlay`.

Recommended scope:

- Create one small cue fixture for existing 4B semantic building IDs using geometry-only cue classes.
- Add one verifier that checks cue provenance, claim status, blocked claims, and target ID resolution.
- Render only geometry-only cues in QA mode or a clearly status-labeled review layer.
- Preserve the existing runtime boundary, source fixture, generated manifest, package dependencies, and blocked business/storefront/facade claims.

Acceptance criteria:

- The corridor gains recognizable building rhythm, street-facing plane, height/width tier, corner/end role, and coverage-status cues.
- Every cue resolves to an existing semantic/source-backed target.
- QA exposes cue family, claim status, confidence, evidence/source refs, and blocked claims.
- Normal mode does not show real facade detail, signage, business labels, windows, doors, awnings, materials, exact entrances, exact addresses, or active-business claims.
- Verifier fails on unsupported promotion of facade, storefront, business, sign, material, entrance, or address claims.
- No source acquisition, APIs, scraping, generated assets, new dependencies, camera tuning, business overlay, storefront anchor implementation, or production/public claim occurs.

Stop condition:

- Stop after 4C-2 review if the next desired step is evidence-approved facade cues, landmark identity treatment, storefront anchors, business cards, source expansion, art direction, asset generation, or production/public claims.
- Under the bounded work packet, Codex may continue from 4C-2 into `Batch 4C-3: Narrow geometry-only cue tuning pass` only if 4C-2 verification passes, no source/evidence uncertainty appears, no product/visual Batu decision is needed, changes remain geometry-only and deterministic, docs are reconciled, and final 4C-3 scope is limited to small cue readability tuning.

## Deferred Work

Remain deferred until a later brief explicitly opens the scope:

- Evidence-approved facade cue implementation.
- Source fixture expansion beyond a narrow cue fixture.
- Manifest schema/public interface changes.
- Storefront-anchor or business-anchor implementation.
- Real-place overlays or cards.
- Exact facade/frontage/order/entrance/address claims.
- Landmark identity treatment.
- Camera tuning from the 4B-6R conditional follow-up.
- Art direction pass, generated assets, raster assets, GLB/glTF assets, or production visual assets.
- External APIs, scraping, capture workflows, automated extraction, or live data.
- New renderer, package dependencies, backend, CMS, persistence, analytics, routing, deployment, or broad map systems.
