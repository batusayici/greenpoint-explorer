# Scene Manifest Schema

Status: v0.1 planning contract / not a runtime schema
Date: 2026-06-01
Creative/product/public-interface approval owner: Batu
Execution owner inside approved boundaries: Codex

Current note:
- This is Phase 2A-era planning background. Phase 2DTR work is controlled by `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, and `docs/MVP_SCOPE.md`; where this document conflicts with DTR scope, use the source-of-truth order in `AGENTS.md`.

## Purpose

This document defines the planned v0.1 scene manifest contract for Phase 2.

It is a docs-only contract. It does not create TypeScript files, runtime validation, app interfaces, source modules, generated scene data, mock data, package changes, or production architecture approval.

## Core Contract

```ts
type SceneManifest = {
  schemaVersion: "0.1";
  sceneId: string;
  blockId: string;
  generatedAt: string;

  sources: ProvenanceRecord[];

  geometry: {
    parcels: Parcel[];
    buildings: Building[];
    streets: StreetSegment[];
  };

  places: Place[];
  businesses: Business[];
  addresses: Address[];
  storefronts: Storefront[];

  scene: {
    transform: SceneTransform;
    anchors: SceneAnchor[];
    objects: SceneObject[];
    assets: SceneAsset[];
  };

  overrides: ManualOverride[];

  qa: QAReport;
};
```

## Global Rules

- Scene coordinates are not real-world truth.
- Real-world coordinates and stylized scene coordinates must be stored separately.
- WGS84, local projected geometry, and stylized scene coordinates must not be collapsed into one field.
- Every visible real-world claim needs provenance.
- Every image/evidence item needs usage/licensing status.
- Manual overrides must be auditable and reversible.
- Generated truth and manual overrides must remain separate.
- Unknown, ambiguous, symbolic, approximate, omitted, blocked, or manual-review-required values must be explicit.

## Shared Field Types

```ts
type Id = string;
type ISODate = string;

type CoordinateWGS84 = {
  lat: number;
  lng: number;
};

type LocalPoint = {
  x: number;
  y: number;
  units: "meters" | "feet" | "source-units" | "unknown";
};

type ScenePoint = {
  x: number;
  y: number;
  layer?: string;
};

type ClaimStatus =
  | "verified"
  | "approximate"
  | "symbolic"
  | "context-only"
  | "omitted"
  | "blocked"
  | "unknown"
  | "manual-review-required";

type UsageStatus =
  | "owned"
  | "approved-review-only"
  | "approved-production"
  | "public-data"
  | "attribution-required"
  | "restricted"
  | "blocked"
  | "unknown";
```

## Place

A `Place` is a public-facing point of interest, civic/transit anchor, business location, or placeholder candidate that may connect to a card or interaction target.

Minimal fields:

```ts
type Place = {
  id: Id;
  displayName: string;
  category: string;
  businessId?: Id;
  addressIds: Id[];
  storefrontIds: Id[];
  sceneAnchorIds: Id[];
  claimStatus: ClaimStatus;
  cardEligibility: "eligible" | "review-only" | "blocked" | "placeholder";
  sourceIds: Id[];
  confidence: ConfidenceScore;
  notes: string;
};
```

Rules:

- A place may be real, symbolic, context-only, omitted, blocked, or placeholder.
- A place does not prove exact storefront location by itself.
- Real place display names and card claims require provenance.

## Business

A `Business` describes business identity and current-status confidence separately from physical placement.

Minimal fields:

```ts
type Business = {
  id: Id;
  legalOrPublicName: string;
  aliases: string[];
  category: string;
  status: "active" | "closed" | "unknown" | "placeholder";
  statusConfidence: ConfidenceScore;
  officialSourceIds: Id[];
  secondarySourceIds: Id[];
  lastVerified: ISODate;
  notes: string;
};
```

Rules:

- Active status must not be inferred from weak or conflicting sources.
- Ratings, reviews, endorsement, partnership, open-now, and promotional claims remain out of scope unless later approved.

## Address

An `Address` preserves source-facing and normalized address records.

Minimal fields:

```ts
type Address = {
  id: Id;
  rawAddress: string;
  normalizedAddress: string;
  borough?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  wgs84?: CoordinateWGS84;
  localPoint?: LocalPoint;
  parcelId?: Id;
  buildingId?: Id;
  sourceIds: Id[];
  confidence: ConfidenceScore;
};
```

Rules:

- Normalization must not invent missing address details.
- Address confidence does not equal storefront/frontage confidence.

## Building

A `Building` represents a physical structure or address container.

Minimal fields:

```ts
type Building = {
  id: Id;
  parcelId?: Id;
  addressIds: Id[];
  footprint?: LocalPoint[];
  sourceGeometryId?: string;
  sourceIds: Id[];
  confidence: ConfidenceScore;
  notes: string;
};
```

Rules:

- Building footprints do not solve storefront segmentation.
- Multi-tenant building handling must preserve ambiguity.

## Parcel

A `Parcel` represents a lot/tax-lot/property container from source records.

Minimal fields:

```ts
type Parcel = {
  id: Id;
  sourceParcelId: string;
  bbl?: string;
  footprint?: LocalPoint[];
  addressIds: Id[];
  sourceIds: Id[];
  confidence: ConfidenceScore;
};
```

Rules:

- Parcel records may support building/address context but do not prove tenant placement.

## StreetSegment

A `StreetSegment` describes road, intersection, or sidewalk geometry relevant to the scene.

Minimal fields:

```ts
type StreetSegment = {
  id: Id;
  name: string;
  segmentType: "street" | "intersection" | "sidewalk" | "crosswalk" | "transit-context";
  geometry: LocalPoint[];
  sourceIds: Id[];
  confidence: ConfidenceScore;
};
```

Rules:

- Transit/station context must not imply exact entrance geometry unless verified and approved.

## Storefront

A `Storefront` represents tenant-facing frontage or an entrance relationship within a building.

Minimal fields:

```ts
type Storefront = {
  id: Id;
  buildingId?: Id;
  addressIds: Id[];
  placeIds: Id[];
  frontageStatus: ClaimStatus;
  entranceStatus: ClaimStatus;
  approximateLocalGeometry?: LocalPoint[];
  sourceIds: Id[];
  evidenceImageIds: Id[];
  confidence: ConfidenceScore;
  notes: string;
};
```

Rules:

- Storefronts must record when frontage/order/entrance placement is unknown.
- Storefront placement cannot be silently corrected for composition.

## SourceImage

A `SourceImage` describes visual evidence, not production art by default.

Minimal fields:

```ts
type SourceImage = {
  id: Id;
  title: string;
  pathOrUrl: string;
  ownerOrSource: string;
  capturedOrPublishedAt?: ISODate;
  reviewedAt: ISODate;
  usageStatus: UsageStatus;
  allowedUses: string[];
  blockedUses: string[];
  sourceIds: Id[];
  notes: string;
};
```

Rules:

- Image existence does not imply usage rights.
- Google/Street View/3D Tiles-derived material must remain restricted unless licensing is resolved or a narrow exception is explicitly recorded.

## SceneObject

A `SceneObject` is a visible or interactive authored object in the stylized scene.

Minimal fields:

```ts
type SceneObject = {
  id: Id;
  objectType: "storefront" | "building" | "street" | "crosswalk" | "marker" | "transit-cue" | "label" | "prop" | "qa-overlay";
  placeIds: Id[];
  anchorId?: Id;
  assetId?: Id;
  sceneGeometry: ScenePoint[];
  visibility: "product-facing" | "review-only" | "debug-only";
  claimStatus: ClaimStatus;
  sourceIds: Id[];
  overrideIds: Id[];
  notes: string;
};
```

Rules:

- Scene geometry must link to source and override context when it represents real-world claims.
- Product-facing real-world cues must not rely on unprovenanced claims.

## SceneAsset

A `SceneAsset` describes visual assets referenced by the scene.

Minimal fields:

```ts
type SceneAsset = {
  id: Id;
  path: string;
  assetType: "raster-plate" | "sprite" | "layer" | "icon" | "debug";
  productionStatus: "review-only" | "prototype-approved" | "production-approved" | "blocked";
  sourceImageIds: Id[];
  usageStatus: UsageStatus;
  notes: string;
};
```

Rules:

- Review-only assets are not production assets.
- Asset provenance must distinguish generated art, owned reference, approved reference, and restricted reference.

## SceneAnchor

A `SceneAnchor` links real-world records to stylized scene placement.

Minimal fields:

```ts
type SceneAnchor = {
  id: Id;
  label: string;
  anchorType: "place" | "building" | "storefront" | "intersection" | "transit" | "manual";
  linkedPlaceIds: Id[];
  linkedBuildingIds: Id[];
  linkedStorefrontIds: Id[];
  wgs84?: CoordinateWGS84;
  localPoint?: LocalPoint;
  scenePoint: ScenePoint;
  transformId: Id;
  claimStatus: ClaimStatus;
  overrideIds: Id[];
  confidence: ConfidenceScore;
};
```

Rules:

- A scene anchor is authored placement, not survey proof.
- Manual placement must be explicit and reversible.

## SceneTransform

A `SceneTransform` describes how source geometry maps into stylized scene space.

Minimal fields:

```ts
type SceneTransform = {
  id: Id;
  sourceCoordinateSystem: string;
  localCoordinateSystem: string;
  sceneCoordinateSystem: string;
  originWgs84?: CoordinateWGS84;
  scale: number;
  rotationDegrees: number;
  sceneOffset: ScenePoint;
  method: "manual" | "derived" | "hybrid";
  sourceIds: Id[];
  overrideIds: Id[];
  notes: string;
};
```

Rules:

- Transform logic must preserve the distinction between real geometry and authored composition.
- Hybrid transforms must identify the manual portion.

## ManualOverride

A `ManualOverride` records a human correction or authored decision.

Minimal fields:

```ts
type ManualOverride = {
  id: Id;
  category: "critical-data" | "scene-placement" | "visual" | "content";
  targetType: "source-record" | "place" | "business" | "address" | "building" | "parcel" | "storefront" | "scene-anchor" | "scene-object" | "asset" | "qa";
  targetId: Id;
  originalValue: unknown;
  overrideValue: unknown;
  reason: string;
  sourceIds: Id[];
  createdBy: string;
  createdAt: ISODate;
  reversible: boolean;
  approvalStatus: "proposed" | "approved" | "rejected" | "superseded";
};
```

Rules:

- Overrides must never overwrite generated truth in place.
- Overrides must be counted by category.
- Hidden manual fixes are not allowed.

## ProvenanceRecord

A `ProvenanceRecord` describes the source for a claim, image, or normalized record.

Minimal fields:

```ts
type ProvenanceRecord = {
  id: Id;
  sourceType: "livexyz" | "nyc-open-data" | "official-public-record" | "osm" | "business-official" | "manual-team-evidence" | "google-restricted" | "other";
  title: string;
  urlOrPath: string;
  retrievedOrReviewedAt: ISODate;
  claimTypes: string[];
  usageStatus: UsageStatus;
  attributionRequired: boolean;
  licenseNotes: string;
  supports: string[];
  doesNotSupport: string[];
};
```

Rules:

- Provenance must describe what a source supports and what it does not support.
- Source review date is not a guarantee of current business status after that date.

## ConfidenceScore

A `ConfidenceScore` describes strength and review state.

Minimal fields:

```ts
type ConfidenceScore = {
  level: "high" | "medium" | "low" | "unknown";
  score?: number;
  basis: string;
  reviewedBy?: string;
  reviewedAt?: ISODate;
  needsManualReview: boolean;
};
```

Rules:

- Numeric scores are optional; basis notes are required.
- Low or unknown confidence must stay visible in QA and review.

## QAReport

A `QAReport` summarizes manifest correctness and review readiness.

Minimal fields:

```ts
type QAReport = {
  generatedAt: ISODate;
  unprovenancedRealWorldClaims: number;
  hiddenManualFixes: number;
  overrideCounts: {
    criticalData: number;
    scenePlacement: number;
    visual: number;
    content: number;
  };
  missingData: string[];
  ambiguities: string[];
  blockedClaims: string[];
  screenshotRegressionStatus?: "not-run" | "passed" | "failed" | "blocked";
  humanApprovalChecklist: string[];
  verdict: "proceed" | "revise" | "blocked";
};
```

Rules:

- Phase 2 target for unprovenanced real-world claims is 0.
- Phase 2 target for hidden manual fixes is 0.
- QA must report unresolved ambiguity instead of hiding it behind scene composition.
