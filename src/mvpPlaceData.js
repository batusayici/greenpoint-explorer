// Review/demo-safe static MVP data. This is local prototype data, not a production data contract.
import rasterPlateSrc from "../docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png";

const sharedCandidateConstraints = [
  "LiveXYZ is identity/presence evidence only; it is not approved facade or art reference.",
  "Do not claim exact facade, storefront width, entrance position, frontage, address, or production placement.",
  "Google, Street View, and Street View-style imagery remain blocked as facade evidence.",
  "MVP-16B hotspot placement is temporary raster-first recovery scaffolding, not exact real-world placement.",
];

const candidateEvidenceRows = [
  {
    label: "Identity / presence",
    value: "LiveXYZ link retained as candidate identity/presence evidence only.",
  },
  {
    label: "Facade / art",
    value: "Approved recovery raster is fictional-safe review art only; no real facade, signage, frontage, or texture reference is approved.",
  },
  {
    label: "Scene placement",
    value: "Temporary transparent hotspot on the approved raster plate; not survey-accurate or address-accurate.",
  },
  {
    label: "Prototype treatment",
    value: "Card, rail, marker, and hotspot treatment only. Real identity is not baked into the raster artwork.",
  },
];

function makeCurrentCandidate({
  id,
  title,
  category,
  liveXyzSourceId,
  corner,
  marker,
  tetherEnd,
  bounds,
  summary,
  rasterAnchorLabel,
}) {
  return {
    id,
    kind: "current-scene-candidate",
    title,
    label: "Identity / presence only",
    category,
    address: "Address not approved in MVP-05 evidence",
    status: "identity-presence-only",
    candidateOutcome: "revise-evidence-incomplete",
    approvalStatus: "not-approved-for-facade-use",
    verificationStatus: "identity only",
    cardBadge: "identity only",
    placementConfidence: "low",
    lastVerified: "2026-05-29",
    manualReviewRequired: true,
    summary,
    description:
      "This card is connected to a temporary hotspot on the fictional-safe raster plate. It supports interaction review only and does not approve real facade accuracy, storefront order, address placement, signage, or production art use.",
    statusNote: "Current-scene identity/presence only; facade/art reference remains insufficient.",
    sourceRefs: [liveXyzSourceId],
    evidenceStatus: candidateEvidenceRows,
    truthConstraints: sharedCandidateConstraints,
    tags: ["current scene", `${corner} anchor`, "identity/presence only", "raster-first recovery", "temporary hotspot"],
    corner,
    marker,
    tetherEnd,
    bounds,
    rasterAnchorLabel,
  };
}

export const mvpScene = {
  title: "MVP-17 product-facing raster interaction polish",
  note:
    "Explore the recovered raster scene. Place identity stays in the interface, and every hotspot remains review-only.",
  size: {
    width: 1672,
    height: 941,
  },
  reviewLabel: "REVIEW-ONLY / NON-PRODUCTION",
  sourceListLabel: "Identity / presence evidence",
  sceneFrame: {
    locationLabel: "Raster-first Greenpoint explorer prototype",
    intent:
      "Pan, zoom, and select temporary place anchors on the approved raster plate.",
    treatment:
      "The raster is fictional-safe review art. It is not an exact Manhattan Avenue / Greenpoint Avenue scene and does not approve real facade, address, station-geometry, or storefront-order claims.",
    activeSceneSource: "MVP-17 product-facing raster interaction polish",
    approvedRasterPath:
      "docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png",
  },
  disclaimer:
    "Unofficial authored prototype. LiveXYZ and MTA links are treated as identity/presence or transit-context evidence only. The raster plate is review-only recovery art, not an official map, directory, real-time listing, facade reference, address system, or production placement.",
  plate: {
    src: rasterPlateSrc,
    label:
      "MVP-17 raster-first prototype scene. Review-only, fictional-safe, non-production, and not a factual Greenpoint representation.",
    sourcePath:
      "docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png",
  },
  sourceRefs: {
    "greenpoint-deli-livexyz": {
      label: "LiveXYZ Greenpoint Deli",
      url: "https://embed.livexyz.com/venue/5526f8acd8ca7000030002e4",
      supports: "Greenpoint Deli identity/presence candidate only.",
      sourceUse: "Identity/presence only; not facade, address, frontage, or art reference.",
      reviewedOn: "2026-05-29",
    },
    "mcdonalds-livexyz": {
      label: "LiveXYZ McDonald's",
      url: "https://embed.livexyz.com/venue/5511c3063d42bd0003001146",
      supports: "McDonald's identity/presence candidate only.",
      sourceUse: "Identity/presence only; not facade, address, frontage, or art reference.",
      reviewedOn: "2026-05-29",
    },
    "dunkin-livexyz": {
      label: "LiveXYZ Dunkin'",
      url: "https://embed.livexyz.com/venue/5b50eecca3e3ee0003e4e0db",
      supports: "Dunkin' identity/presence candidate only.",
      sourceUse: "Identity/presence only; not facade, address, frontage, or art reference.",
      reviewedOn: "2026-05-29",
    },
    "citizens-bank-livexyz": {
      label: "LiveXYZ Citizens Bank",
      url: "https://embed.livexyz.com/venue/64893028145f5b00018b86a7",
      supports: "Citizens Bank identity/presence candidate only.",
      sourceUse: "Identity/presence only; not facade, address, frontage, or art reference.",
      reviewedOn: "2026-05-29",
    },
    "mta-g-line": {
      label: "MTA G line map",
      url: "https://www.mta.info/maps/subway-line-maps/g-line",
      supports: "Greenpoint Av station as a G line stop.",
      sourceUse: "Transit identity/context only; not exact stair, entrance, elevator, or station geometry.",
      reviewedOn: "2026-05-29",
    },
    "mta-greenpoint-accessibility": {
      label: "MTA Greenpoint Av accessibility notice",
      url: "https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible",
      supports: "Greenpoint Av station accessibility context.",
      sourceUse: "Transit context only; not exact station geometry or production placement.",
      reviewedOn: "2026-05-29",
    },
  },
  targets: [
    makeCurrentCandidate({
      id: "greenpoint-deli",
      title: "Greenpoint Deli",
      category: "Deli / food retail",
      liveXyzSourceId: "greenpoint-deli-livexyz",
      corner: "left storefront",
      summary: "Current-scene deli card retained with identity/presence evidence only.",
      rasterAnchorLabel: "Temporary raster anchor 1",
      marker: {
        label: "1",
        x: 360,
        y: 454,
      },
      tetherEnd: {
        x: 356,
        y: 616,
      },
      bounds: {
        x: 214,
        y: 304,
        width: 276,
        height: 342,
      },
    }),
    makeCurrentCandidate({
      id: "mcdonalds",
      title: "McDonald's",
      category: "Fast food",
      liveXyzSourceId: "mcdonalds-livexyz",
      corner: "center-left storefront",
      summary: "Current-scene restaurant card retained with identity/presence evidence only.",
      rasterAnchorLabel: "Temporary raster anchor 2",
      marker: {
        label: "2",
        x: 788,
        y: 428,
      },
      tetherEnd: {
        x: 804,
        y: 640,
      },
      bounds: {
        x: 612,
        y: 220,
        width: 370,
        height: 452,
      },
    }),
    makeCurrentCandidate({
      id: "dunkin",
      title: "Dunkin'",
      category: "Coffee / quick service",
      liveXyzSourceId: "dunkin-livexyz",
      corner: "center storefront",
      summary: "Current-scene coffee card retained with identity/presence evidence only.",
      rasterAnchorLabel: "Temporary raster anchor 3",
      marker: {
        label: "3",
        x: 1112,
        y: 438,
      },
      tetherEnd: {
        x: 1128,
        y: 622,
      },
      bounds: {
        x: 990,
        y: 248,
        width: 260,
        height: 390,
      },
    }),
    makeCurrentCandidate({
      id: "citizens-bank",
      title: "Citizens Bank",
      category: "Bank",
      liveXyzSourceId: "citizens-bank-livexyz",
      corner: "center-right storefront",
      summary: "Current-scene bank card retained with identity/presence evidence only.",
      rasterAnchorLabel: "Temporary raster anchor 4",
      marker: {
        label: "4",
        x: 1378,
        y: 436,
      },
      tetherEnd: {
        x: 1374,
        y: 616,
      },
      bounds: {
        x: 1260,
        y: 236,
        width: 238,
        height: 410,
      },
    }),
    {
      id: "greenpoint-g-subway",
      kind: "symbolic-anchor",
      title: "Greenpoint G subway",
      label: "Symbolic transit anchor",
      category: "Subway anchor",
      address: "Greenpoint Av station area",
      status: "symbolic-transit-context",
      candidateOutcome: "context-allowed-geometry-unresolved",
      approvalStatus: "not-approved-for-exact-geometry",
      verificationStatus: "transit context",
      cardBadge: "symbolic",
      placementConfidence: "low",
      lastVerified: "2026-05-29",
      manualReviewRequired: true,
      summary: "Current-scene subway presence anchor with exact station geometry unresolved.",
      description:
        "MTA sources support Greenpoint Av as a G line station, so the prototype keeps a subway card and temporary hotspot. It does not approve exact entrance side, stair, elevator, access-point geometry, station footprint, or production placement.",
      statusNote: "Transit identity/context only; exact station geometry remains unresolved.",
      sourceRefs: ["mta-g-line", "mta-greenpoint-accessibility"],
      evidenceStatus: [
        {
          label: "Identity / presence",
          value: "MTA sources support the Greenpoint Avenue station context.",
        },
        {
          label: "Facade / art",
          value: "Not applicable as storefront art; the raster plate remains review-only and fictional-safe.",
        },
        {
          label: "Station geometry",
          value: "Insufficient. Exact stairs, elevators, access points, and station footprint are not approved.",
        },
        {
          label: "Prototype treatment",
          value: "Symbolic transit card and temporary hotspot only, not an exact map feature.",
        },
      ],
      truthConstraints: [
        "Do not imply exact stair, elevator, entrance-side, access-point, or station-footprint geometry.",
        "Do not treat the transit anchor as an ordinary business listing.",
        "Do not treat the raster plate subway cue as exact Greenpoint station geometry.",
      ],
      tags: ["current scene", "symbolic subway", "geometry unresolved", "raster-first recovery"],
      corner: "left transit anchor",
      marker: {
        label: "5",
        x: 177,
        y: 612,
      },
      tetherEnd: {
        x: 118,
        y: 540,
      },
      bounds: {
        x: 42,
        y: 386,
        width: 218,
        height: 292,
      },
      rasterAnchorLabel: "Temporary raster anchor 5",
    },
  ],
};
