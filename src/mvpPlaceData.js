// Review/demo-safe static MVP data. This is local prototype data, not a production data contract.
import rasterPlateSrc from "./assets/review-only/mvp-22-grillpoint-real-corner-slice.png";

export const mvpScene = {
  title: "MVP-22 Grillpoint raster-first vertical slice",
  note:
    "Explore the NW Grillpoint slice. Greenpoint Av G appears as nearby transit context only.",
  size: {
    width: 1672,
    height: 941,
  },
  reviewLabel: "REVIEW-ONLY / NON-PRODUCTION",
  sourceListLabel: "Reviewed Stage B sources",
  sceneFrame: {
    locationLabel: "MVP-22 NW real-corner vertical slice",
    intent:
      "Pan, zoom, and select one source-backed Grillpoint card on a raster-first corner plate.",
    treatment:
      "The world plate uses a non-readable deli sign cue while the factual card uses Grillpoint Deli. The Greenpoint Av G cue is adjacent transit context only, not exact station geometry or a direct in-front claim.",
    activeSceneSource: "MVP-22 Stage B Raster-First Real-Corner Vertical Slice",
    approvedRasterPath:
      "src/assets/review-only/mvp-22-grillpoint-real-corner-slice.png",
    approvedReferencePaths: [
      "docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg",
      "docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpeg",
      "docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpeg",
      "docs/mvp-reference-images/northwest-subwayA.jpeg",
      "docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-A-ui-world-integration.png",
      "docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-B-place-card-marker-hover-state.png",
    ],
  },
  disclaimer:
    "Unofficial authored prototype. This card is not an official map, directory, real-time business listing, or exact facade/address/station-geometry claim.",
  plate: {
    src: rasterPlateSrc,
    label:
      "MVP-22 review-only raster-first Grillpoint / Greenpoint Av G vertical slice. Non-production, art-directed, and not an exact facade, address, or station-geometry representation.",
    sourcePath:
      "docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/generated/mvp-22-grillpoint-real-corner-slice.png",
  },
  sourceRefs: {
    "restaurantji-grillpoint": {
      label: "Restaurantji Grillpoint Deli",
      url: "https://www.restaurantji.com/ny/brooklyn/grillpoint-deli-/",
      supports: "Grillpoint Deli name, deli category, and 903 Manhattan Ave address context.",
      sourceUse:
        "Secondary public directory source for review-only factual card copy; no reviews, ratings, hours, or promotional claims are used.",
      reviewedOn: "2026-05-30",
    },
    "mta-greenpoint-accessibility": {
      label: "MTA Greenpoint Av accessibility notice",
      url: "https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible",
      supports: "Greenpoint Av G station context on Manhattan Ave.",
      sourceUse:
        "Transit context only; not exact stair, entrance, elevator, station footprint, or Grillpoint-frontage geometry.",
      reviewedOn: "2026-05-30",
    },
    "mta-accessible-stations": {
      label: "MTA accessible stations",
      url: "https://www.mta.info/accessibility/stations",
      supports: "Greenpoint Av station accessibility context.",
      sourceUse:
        "Transit context only; not exact entrance placement or production station geometry.",
      reviewedOn: "2026-05-30",
    },
    "mvp-22-stage-a": {
      label: "MVP-22 Stage A evidence packet",
      url: "/docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md",
      supports:
        "Stage A approval-with-constraint for Grillpoint identity/address/sign planning and nearby/adjacent Greenpoint Av G context.",
      sourceUse:
        "Review gate only; does not approve production readiness, exact facade, exact address placement, or exact station geometry.",
      reviewedOn: "2026-05-30",
    },
    "mvp-22-stage-b-brief": {
      label: "MVP-22 Stage B implementation brief",
      url: "/docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/STAGE_B_IMPLEMENTATION_BRIEF.md",
      supports:
        "Allowed raster path, factual card copy, source URLs, sign-label treatment, file allowlist, and screenshot QA requirements.",
      sourceUse:
        "Review-only implementation boundary; not production asset, public-release, or final visual-fidelity approval.",
      reviewedOn: "2026-05-30",
    },
  },
  targets: [
    {
      id: "grillpoint-deli",
      kind: "real-corner-vertical-slice",
      title: "Grillpoint Deli",
      label: "Stage B review target",
      category: "Deli / food retail",
      address: "903 Manhattan Ave, Brooklyn, NY 11222",
      status: "review-only-source-backed",
      candidateOutcome: "mvp-22-stage-b-real-corner-slice",
      approvalStatus: "stage-b-review-only",
      verificationStatus: "source-backed planning",
      cardBadge: "Stage B",
      placementConfidence: "medium corner context / low exact geometry",
      lastVerified: "2026-05-30",
      manualReviewRequired: true,
      summary:
        "Deli at the northwest Manhattan Ave / Greenpoint Ave corner, shown in a review-only art-directed slice.",
      description:
        "Greenpoint Av G appears as nearby transit context. The scene is an authored diorama, not an exact facade, address-placement, storefront-order, or station-geometry claim.",
      statusNote:
        "Identity, address, and sign are supportable for this review slice; subway context is nearby/adjacent only.",
      sourceRefs: [
        "restaurantji-grillpoint",
        "mta-greenpoint-accessibility",
        "mta-accessible-stations",
        "mvp-22-stage-a",
        "mvp-22-stage-b-brief",
      ],
      evidenceStatus: [
        {
          label: "Business identity",
          value:
            "Grillpoint Deli identity is supportable for Stage B planning from reviewed public/source evidence and Batu-supplied NW field-reference context.",
        },
        {
          label: "Address",
          value:
            "Card may use 903 Manhattan Ave, Brooklyn, NY 11222 as factual copy; the raster does not show or claim exact address placement.",
        },
        {
          label: "Sign treatment",
          value:
            "World plate uses a non-readable deli sign cue. The factual card uses Grillpoint Deli; no exact sign, logo, texture, or facade reproduction is claimed.",
        },
        {
          label: "Transit context",
          value:
            "Greenpoint Ave G may appear as nearby/adjacent context only. The app must not claim the subway entrance is directly in front of Grillpoint without stronger evidence.",
        },
      ],
      truthConstraints: [
        "Do not claim exact facade, exact sign, exact address placement, storefront width/order, entrance position, or production placement.",
        "Do not claim the subway entrance is directly in front of Grillpoint unless stronger field/photo evidence supports that exact relationship and Batu approves it.",
        "Do not use NE, SE, or SW parked references for this slice.",
        "Do not use Google, Street View, 3D Tiles, LiveXYZ facade/art, copied web imagery, or blocked historical screenshots as facade/art material.",
        "Do not use ratings, reviews, hours, delivery, ownership, popularity, quality, or promotional claims.",
      ],
      tags: [
        "MVP-22",
        "NW corner only",
        "raster-first",
        "real-place card",
        "nearby transit context",
        "review-only",
      ],
      corner: "NW Grillpoint / Greenpoint Av G context",
      marker: {
        label: "1",
        x: 796,
        y: 536,
      },
      tetherEnd: {
        x: 792,
        y: 724,
      },
      bounds: {
        x: 254,
        y: 282,
        width: 944,
        height: 498,
      },
      rasterAnchorLabel: "MVP-22 Grillpoint slice",
    },
  ],
};
