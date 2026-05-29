// Review/demo-safe static MVP data. This is local prototype data, not a production data contract.
import scenePlateSrc from "../docs/mvp-reference-images/source-04-southwest-corner.png";

const sharedCandidateConstraints = [
  "LiveXYZ is identity/presence evidence only; it is not approved facade or art reference.",
  "Do not claim exact facade, storefront width, entrance position, frontage, address, or production placement.",
  "Google, Street View, and Street View-style imagery remain blocked as facade evidence.",
];

const candidateEvidenceRows = [
  {
    label: "Identity / presence",
    value: "LiveXYZ link retained as candidate identity/presence evidence only.",
  },
  {
    label: "Facade / art",
    value: "Insufficient. No approved facade, signage, frontage, or texture reference.",
  },
  {
    label: "Scene placement",
    value: "Authored scaffold anchor only; not survey-accurate or address-accurate.",
  },
  {
    label: "Prototype treatment",
    value: "Fictional-safe card and hotspot treatment until source review clears real-place use.",
  },
];

function makeCurrentCandidate({
  id,
  title,
  category,
  liveXyzSourceId,
  marker,
  bounds,
  summary,
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
      "MVP-06 keeps this current-scene place visible as a prototype card, but only as identity/presence evidence. The card does not approve real facade accuracy, storefront order, address placement, signage, or production art use.",
    statusNote: "Current-scene identity/presence only; facade/art reference remains insufficient.",
    sourceRefs: [liveXyzSourceId],
    evidenceStatus: candidateEvidenceRows,
    truthConstraints: sharedCandidateConstraints,
    tags: ["current scene", "identity/presence only", "facade blocked"],
    marker,
    bounds,
  };
}

export const mvpScene = {
  title: "MVP-06 corrected Manhattan Ave / Greenpoint Ave scaffold",
  note:
    "Corrective MVP-06 slice with current-scene identity/presence cards only. Facade art, exact storefronts, addresses, and production placement remain unapproved.",
  size: {
    width: 3024,
    height: 1964,
  },
  reviewLabel: "NON-PRODUCTION / CORRECTIVE REVIEW ONLY",
  sourceListLabel: "Identity / presence evidence",
  sceneFrame: {
    locationLabel: "Corrected active scene: Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, Greenpoint G subway",
    intent:
      "Correct the active prototype data to the MVP-05 current scene while keeping all real-place art and placement claims visibly provisional.",
    treatment:
      "Authored compact diorama anchors; not an exact map, facade, frontage, station-geometry, address-placement, or storefront-order claim.",
    activeSceneSource: "MVP-05 corrected source-of-truth validation spike",
    referenceImages: [
      "docs/mvp-reference-images/source-04-southwest-corner.png",
    ],
  },
  disclaimer:
    "Unofficial authored prototype. LiveXYZ links are treated as identity/presence evidence only. This is not an official map, directory, real-time listing, facade reference, address system, or production placement.",
  plate: {
    src: scenePlateSrc,
    alpha: 0.34,
    scaffoldWash: {
      color: 0x1f2727,
      alpha: 0.54,
    },
    label:
      "Dimmed non-production review raster retained as prototype scaffolding only; not approved facade evidence, exact storefront order, exact address placement, or production visual reference.",
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
      summary: "Current-scene deli card retained with identity/presence evidence only.",
      marker: {
        x: 720,
        y: 1248,
      },
      bounds: {
        x: 472,
        y: 1060,
        width: 360,
        height: 324,
      },
    }),
    makeCurrentCandidate({
      id: "mcdonalds",
      title: "McDonald's",
      category: "Fast food",
      liveXyzSourceId: "mcdonalds-livexyz",
      summary: "Current-scene restaurant card retained with identity/presence evidence only.",
      marker: {
        x: 1716,
        y: 1094,
      },
      bounds: {
        x: 1472,
        y: 910,
        width: 380,
        height: 334,
      },
    }),
    makeCurrentCandidate({
      id: "dunkin",
      title: "Dunkin'",
      category: "Coffee / quick service",
      liveXyzSourceId: "dunkin-livexyz",
      summary: "Current-scene coffee card retained with identity/presence evidence only.",
      marker: {
        x: 2046,
        y: 1208,
      },
      bounds: {
        x: 1820,
        y: 1042,
        width: 392,
        height: 326,
      },
    }),
    makeCurrentCandidate({
      id: "citizens-bank",
      title: "Citizens Bank",
      category: "Bank",
      liveXyzSourceId: "citizens-bank-livexyz",
      summary: "Current-scene bank card retained with identity/presence evidence only.",
      marker: {
        x: 526,
        y: 770,
      },
      bounds: {
        x: 332,
        y: 452,
        width: 500,
        height: 640,
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
        "MTA sources support Greenpoint Av as a G line station, so MVP-06 keeps a subway anchor in the prototype. It does not approve exact entrance side, stair, elevator, access-point geometry, station footprint, or production placement.",
      statusNote: "Transit identity/context only; exact station geometry remains unresolved.",
      sourceRefs: ["mta-g-line", "mta-greenpoint-accessibility"],
      evidenceStatus: [
        {
          label: "Identity / presence",
          value: "MTA sources support the Greenpoint Avenue station context.",
        },
        {
          label: "Facade / art",
          value: "Not applicable as storefront art; station iconography remains symbolic.",
        },
        {
          label: "Station geometry",
          value: "Insufficient. Exact stairs, elevators, access points, and station footprint are not approved.",
        },
        {
          label: "Prototype treatment",
          value: "Symbolic transit anchor only, not an exact map feature.",
        },
      ],
      truthConstraints: [
        "Do not imply exact stair, elevator, entrance-side, access-point, or station-footprint geometry.",
        "Do not treat the transit anchor as an ordinary business listing.",
      ],
      tags: ["current scene", "symbolic subway", "geometry unresolved"],
      marker: {
        x: 1210,
        y: 1254,
      },
      bounds: {
        x: 1044,
        y: 1112,
        width: 310,
        height: 284,
      },
    },
  ],
};
