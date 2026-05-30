# Place Schema

Status: Conceptual planning only / not implemented
Date: 2026-05-26
Creative direction owner: Batu
Implementation owner: Codex

## Purpose

This document defines the conceptual shape of static local place data for planning.

It preserves the planning intent of earlier place-data notes, but it does not depend on a current implementation plan and does not create TypeScript, runtime schemas, module boundaries, app code, or public interfaces.

## Principles

- Static local data only for MVP.
- Public factual information only.
- Source-backed real places only when spatially coherent.
- Uncertainty must be visible in the data model.
- Manual overrides must be explicit and approved.
- Multi-tenant buildings must not be flattened into misleading single-place assumptions.

## Place

A `Place` represents a real or placeholder business, civic feature, or named point of interest that may appear as a card or marker.

Conceptual fields:

- `id`: stable internal identifier.
- `name`: public display name or placeholder name.
- `category`: broad neutral category.
- `address`: source-facing address text.
- `normalizedAddress`: project-normalized address for comparison and review.
- `buildingId`: linked building when known.
- `storefrontId`: linked storefront when known.
- `lotOrParcelId`: optional official lot or parcel reference.
- `sourceUrls`: public URLs reviewed for this place.
- `sourceLabels`: human-readable source names.
- `sourceNotes`: concise notes about what each source supports.
- `lastVerified`: date sources were last reviewed.
- `verificationStatus`: `verified`, `partial`, `unresolved`, or `manual-review-required`.
- `placementConfidence`: `high`, `medium`, `low`, or `unresolved`.
- `mapPosition`: authored position in the isometric scene, only after approval.
- `spriteId`: visual asset reference, only after production asset approval.
- `cardTitle`: public card title.
- `cardDescription`: neutral factual card copy.
- `status`: `active`, `unknown`, `closed`, or `placeholder`.
- `manualOverrideRequired`: whether authored placement or public representation needs manual approval.
- `approvalStatus`: `unreviewed`, `proposed`, `approved`, or `rejected`.

## Building

A `Building` represents the physical structure or address container that may hold one or more storefronts or places.

Conceptual fields:

- `id`: stable internal identifier.
- `address`: source-facing address text.
- `normalizedAddress`: project-normalized address.
- `lotOrParcelId`: optional official lot or parcel reference.
- `sourceUrls`: public URLs reviewed for the building or lot.
- `sourceLabels`: human-readable source names.
- `sourceNotes`: notes about address, lot, footprint, or facade evidence.
- `lastVerified`: date sources were last reviewed.
- `verificationStatus`: `verified`, `partial`, `unresolved`, or `manual-review-required`.
- `mapAnchorId`: linked authored scene anchor when known.
- `approvalStatus`: `unreviewed`, `proposed`, `approved`, or `rejected`.

## Storefront

A `Storefront` represents a tenant-facing position within a building. It is needed when a building has multiple businesses or unclear entrances.

Conceptual fields:

- `id`: stable internal identifier.
- `buildingId`: parent building.
- `label`: optional internal label for review.
- `frontageNotes`: notes about street-facing position or entrance.
- `placeIds`: linked places, if known.
- `sourceUrls`: public URLs reviewed for storefront evidence.
- `sourceNotes`: notes supporting the storefront relationship.
- `placementConfidence`: `high`, `medium`, `low`, or `unresolved`.
- `manualOverrideRequired`: whether authored placement needs Batu approval.
- `approvalStatus`: `unreviewed`, `proposed`, `approved`, or `rejected`.

## MapAnchor

A `MapAnchor` represents an authored isometric placement point. It is not a claim that exact survey geometry has been reproduced.

Conceptual fields:

- `id`: stable internal identifier.
- `label`: internal review label.
- `approximationType`: `exact-enough`, `compressed`, `symbolic`, or `placeholder`.
- `truthConstraints`: notes on what cannot be changed without misrepresentation.
- `allowedApproximation`: notes on what can be simplified for the diorama.
- `mapPosition`: authored scene position.
- `linkedBuildingIds`: related buildings.
- `linkedPlaceIds`: related places.
- `manualOverrideRequired`: whether placement needs Batu approval.
- `approvalStatus`: `unreviewed`, `proposed`, `approved`, or `rejected`.

## Address Normalization

Address normalization should make source comparison easier without hiding uncertainty.

The project should preserve the original source-facing address and separately store a normalized address. Normalization may standardize casing, street suffixes, punctuation, and unit notation, but it must not invent missing address details or resolve conflicts without notes.

## Spatial Coherence

Spatially coherent means the authored scene can simplify geometry while preserving public truth.

May be approximate:

- Isometric projection and non-literal scale.
- Compressed sidewalk depth.
- Simplified facade details.
- Reduced block length if street/frontage truth remains intact.
- Symbolic or simplified street furniture.
- Generic placeholder storefronts when clearly labeled.
- Small authored spacing changes that do not alter public representation.
- Non-public decorative details.

Cannot be approximate without explicit Batu approval:

- Street assignment.
- Which side of an intersection a real place occupies.
- Business-to-building relationship.
- Storefront order when it affects adjacency.
- Direct adjacency when a building, street, or corner separates places.
- Active, closed, unknown, or placeholder status.
- Public-facing card facts.
- Use of a real business name on a placeholder facade.

Examples of not-spatially-coherent representation:

- Moving a real business to a different street for composition.
- Moving a business to the wrong side of an intersection.
- Collapsing opposite corners into one frontage.
- Swapping neighboring storefront order when the card or marker implies adjacency.
- Making a closed or unknown-status business appear active.
- Writing card facts that are not supported by reviewed public sources.

## Real-Corner Translation Use

For real-corner translation planning, `Place`, `Building`, `Storefront`, and `MapAnchor` relationships must be reconciled before assigning authored placement, visual asset references, or card treatment.

- `MapAnchor` remains authored placement for an isometric scene, not survey geometry.
- `mapPosition`, `spriteId`, and `cardDescription` remain blocked until the relevant evidence, reference, translation-boundary, and Batu approval statuses clear.
- This conceptual linkage supports review packets only. It does not create TypeScript/runtime schemas, app interfaces, source modules, or public contracts.

## Approval

Any real place with unresolved verification, low placement confidence, source conflict, or manual override requirement must remain blocked until Batu approves the representation or chooses to omit it.
