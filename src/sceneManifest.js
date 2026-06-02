const REQUIRED_MANIFEST_VERSION = "0.1";
const REQUIRED_EVIDENCE_SCHEMA_VERSION = "source-evidence-fixture.v0.1";
const REQUIRED_DRAFT_SCENE_SCHEMA_VERSION = "draft-scene-fixture.v0.1";
const LEGACY_JPEG_EXTENSION = "." + "jpeg";
const EVIDENCE_STRENGTH_VALUES = new Set([
  "reviewed",
  "official_location_only",
  "manifest_context_only",
  "blocked",
]);
const CLAIM_READINESS_VALUES = new Set([
  "product_copy_ready",
  "review_only",
  "blocked",
]);
const PROMOTION_CLAIM_KEYS = [
  "identityName",
  "categoryBusinessType",
  "addressLocation",
  "storefrontFacade",
  "entranceFrontageGeometry",
];
const PROMOTION_GATE_STATUS_VALUES = new Set([
  "allowed",
  "review_only",
  "blocked",
]);
const DRAFT_SCENE_STATUS_VALUES = new Set([
  "verified",
  "sourced",
  "inferred",
  "manual_draft",
  "symbolic",
  "unknown",
  "blocked",
]);
const REQUIRED_DRAFT_SCENE_FIELDS = [
  "name",
  "addressText",
  "category",
  "frontage",
  "buildingFootprint",
  "storefrontBay",
  "signText",
  "signPlacement",
  "facadeStyle",
  "doorWindowPlacement",
  "sceneAnchor",
  "stationIntersectionCues",
];

export function loadMvpSceneFromManifest(
  manifest,
  assetSrcById,
  sourceEvidenceFixture = null,
  draftSceneFixture = null,
) {
  const validatedManifest = validateSceneManifest(manifest);
  const manifestIndexes = buildManifestIndexes(validatedManifest);
  const validatedEvidenceFixture = sourceEvidenceFixture
    ? validateSourceEvidenceFixture(sourceEvidenceFixture, validatedManifest, manifestIndexes)
    : null;
  const validatedDraftSceneFixture = draftSceneFixture
    ? validateDraftSceneFixture(draftSceneFixture, validatedManifest, manifestIndexes)
    : null;
  const sourceEvidenceIndex = buildSourceEvidenceIndex(validatedEvidenceFixture);
  const draftSceneIndex = buildDraftSceneIndex(validatedDraftSceneFixture);
  const primaryAsset = validatedManifest.scene.assets.find(
    (asset) => asset.role === "primary-raster-plate",
  );

  if (!primaryAsset) {
    throw new Error("Scene manifest is missing a primary raster plate asset.");
  }

  const sourceRefs = Object.fromEntries(
    validatedManifest.sources.map((source) => [
      source.id,
      {
        label: source.label,
        url: source.url,
        supports: source.confidenceNotes,
        sourceUse: source.conflictNotes,
        reviewedOn: source.reviewedOn,
      },
    ]),
  );

  return {
    manifestId: validatedManifest.sceneId,
    manifestVersion: validatedManifest.schemaVersion,
    title: validatedManifest.app.title,
    note: validatedManifest.app.note,
    size: validatedManifest.scene.transform.sceneSize,
    reviewLabel: validatedManifest.app.reviewLabel,
    sourceListLabel: validatedManifest.app.sourceListLabel,
    sceneFrame: validatedManifest.app.sceneFrame,
    disclaimer: validatedManifest.app.disclaimer,
    plate: {
      src: assetSrcById[primaryAsset.id],
      label: primaryAsset.label,
      sourcePath: primaryAsset.sourcePath,
    },
    sourceRefs,
    manifestQA: buildSceneQA(validatedManifest, validatedEvidenceFixture, validatedDraftSceneFixture),
    targets: validatedManifest.scene.objects.map((object) => {
      const draftScene = buildAppDraftSceneRecord(draftSceneIndex.recordsByTargetId.get(object.appTarget.id));
      return {
        ...buildDraftAwareAppTarget(object.appTarget, draftScene),
        manifestObjectId: object.id,
        manifestPlaceId: object.placeId,
        manifestAnchorId: object.anchorId,
        claimStatus: object.claimStatus,
        draftScene,
        manifestQA: buildTargetQA(
          object,
          validatedManifest,
          manifestIndexes,
          sourceEvidenceIndex,
          draftScene,
        ),
      };
    }),
  };
}

function buildManifestIndexes(manifest) {
  return {
    sourcesById: indexById(manifest.sources),
    placesById: indexById(manifest.places),
    businessesById: indexById(manifest.businesses),
    addressesById: indexById(manifest.addresses),
    storefrontsById: indexById(manifest.storefronts),
    anchorsById: indexById(manifest.scene.anchors),
    cornersById: indexById(manifest.corners ?? manifest.scene.corners ?? []),
  };
}

function buildSceneQA(manifest, evidenceFixture, draftSceneFixture) {
  return {
    manifestId: manifest.sceneId,
    blockId: manifest.blockId,
    status: manifest.status,
    generatedAt: manifest.generatedAt,
    transform: manifest.scene.transform,
    qa: manifest.qa,
    overrideCount: manifest.overrides.length,
    sourceEvidence: evidenceFixture ? {
      fixtureId: evidenceFixture.fixtureId,
      status: evidenceFixture.status,
      reviewedOn: evidenceFixture.reviewedOn,
      recordCount: evidenceFixture.records.length,
    } : null,
    draftScene: draftSceneFixture ? {
      fixtureId: draftSceneFixture.fixtureId,
      status: draftSceneFixture.status,
      reviewedOn: draftSceneFixture.reviewedOn,
      lane: draftSceneFixture.lane,
      recordCount: draftSceneFixture.records.length,
    } : null,
  };
}

function buildTargetQA(object, manifest, indexes, evidenceIndex, draftScene) {
  const place = indexes.placesById.get(object.placeId);
  const business = place?.businessId ? indexes.businessesById.get(place.businessId) : null;
  const addressRecords = (place?.addressIds ?? [])
    .map((id) => indexes.addressesById.get(id))
    .filter(Boolean);
  const storefrontRecords = (place?.storefrontIds ?? [])
    .map((id) => indexes.storefrontsById.get(id))
    .filter(Boolean);
  const anchor = indexes.anchorsById.get(object.anchorId);
  const corner = anchor?.cornerId ? indexes.cornersById.get(anchor.cornerId) : null;
  const relatedIds = new Set([
    object.id,
    object.placeId,
    object.anchorId,
    place?.businessId,
    ...(place?.addressIds ?? []),
    ...(place?.storefrontIds ?? []),
  ].filter(Boolean));
  const relatedOverrides = manifest.overrides.filter((override) => (
    override.affectedIds.some((id) => relatedIds.has(id))
  ));
  const sourceIds = new Set([
    ...(object.sourceIds ?? []),
    ...(place?.sourceIds ?? []),
    ...(business?.officialSourceIds ?? []),
    ...(business?.secondarySourceIds ?? []),
    ...(anchor?.sourceIds ?? []),
    ...addressRecords.flatMap((record) => record.sourceIds ?? []),
    ...storefrontRecords.flatMap((record) => record.sourceIds ?? []),
  ]);
  const sources = [...sourceIds].map((id) => indexes.sourcesById.get(id)).filter(Boolean);
  const sourceEvidence = collectTargetEvidence(object, place, evidenceIndex);

  return {
    object: {
      id: object.id,
      type: object.objectType,
      claimStatus: object.claimStatus,
    },
    place: place ? {
      id: place.id,
      claimStatus: place.claimStatus,
      cardEligibility: place.cardEligibility,
      confidence: place.confidence,
      notes: place.notes,
    } : null,
    business: business ? {
      id: business.id,
      status: business.status,
      statusConfidence: business.statusConfidence,
      lastVerified: business.lastVerified,
      notes: business.notes,
    } : null,
    addresses: addressRecords.map((address) => ({
      id: address.id,
      normalizedAddress: address.normalizedAddress,
      confidence: address.confidence,
      hasWgs84: Boolean(address.wgs84),
      hasLocalPoint: Boolean(address.localPoint),
    })),
    storefronts: storefrontRecords.map((storefront) => ({
      id: storefront.id,
      frontageStatus: storefront.frontageStatus,
      entranceStatus: storefront.entranceStatus,
      confidence: storefront.confidence,
      notes: storefront.notes,
    })),
    sceneAnchor: anchor ? {
      id: anchor.id,
      cornerId: anchor.cornerId,
      cornerLabel: corner?.label ?? anchor.cornerId,
      claimStatus: anchor.claimStatus,
      confidence: anchor.confidence,
      scenePoint: anchor.scenePoint,
      notes: anchor.notes,
    } : null,
    sources: sources.map((source) => ({
      id: source.id,
      label: source.label,
      sourceType: source.sourceType,
      usageStatus: source.usageStatus,
      reviewedOn: source.reviewedOn,
      supported: source.claimTypesSupported,
      notSupported: source.claimTypesNotSupported,
      confidenceNotes: source.confidenceNotes,
    })),
    sourceEvidence: sourceEvidence.map((record) => ({
      id: record.id,
      sourceType: record.sourceType,
      sourceLabel: record.sourceLabel,
      sourceUrl: record.sourceUrl,
      capturedOn: record.capturedOn,
      reviewedOn: record.reviewedOn,
      usageStatus: record.usageStatus,
      evidenceStrength: record.evidenceStrength,
      claimReadiness: record.claimReadiness,
      promotionGates: record.promotionGates,
      confidence: record.confidence,
      sourceRecordIds: record.sourceRecordIds,
      claimMappings: record.claimMappings,
      qaNotes: record.qaNotes,
      remainingGaps: record.remainingGaps,
    })),
    draftScene,
    overrides: relatedOverrides.map((override) => ({
      id: override.id,
      category: override.category,
      reason: override.reason,
      reversible: override.reversible,
      affectedIds: override.affectedIds,
    })),
    sceneQA: {
      overrideCountsByCategory: manifest.qa.overrideCountsByCategory,
      missingData: manifest.qa.missingData,
      ambiguity: manifest.qa.ambiguity,
      blockedClaims: manifest.qa.blockedClaims,
      verdict: manifest.qa.verdict,
      unprovenancedRealWorldClaims: manifest.qa.unprovenancedRealWorldClaims,
      hiddenManualFixes: manifest.qa.hiddenManualFixes,
    },
  };
}

function buildDraftAwareAppTarget(target, draftScene) {
  if (!draftScene) return target;

  const fields = draftScene.fields;
  return {
    ...target,
    title: fields.name.value ?? target.title,
    category: fields.category.value ?? target.category,
    address: fields.addressText.value ?? target.address,
    rasterAnchorLabel: fields.signText.value ?? target.rasterAnchorLabel,
    draftStatusSummary: summarizeDraftStatuses(draftScene),
  };
}

function buildDraftSceneIndex(fixture) {
  const index = {
    recordsByTargetId: new Map(),
  };
  if (!fixture) return index;

  for (const record of fixture.records) {
    index.recordsByTargetId.set(record.targetId, record);
  }

  return index;
}

function buildAppDraftSceneRecord(record) {
  if (!record) return null;
  const generatedScene = generateDraftQaScene(record);

  return {
    id: record.id,
    status: record.renderingUse.status,
    renderingUse: record.renderingUse,
    sourceEvidenceRecordIds: record.sourceEvidenceRecordIds,
    fields: Object.fromEntries(
      Object.entries(record.fields).map(([fieldName, field]) => [
        fieldName,
        {
          value: field.value,
          status: field.status,
          sourceIds: field.sourceIds,
          notes: field.notes,
        },
      ]),
    ),
    qaOverlay: record.qaOverlay ?? null,
    generatedScene,
    statusCounts: summarizeDraftStatuses(record),
  };
}

function summarizeDraftStatuses(record) {
  const counts = Object.fromEntries([...DRAFT_SCENE_STATUS_VALUES].map((status) => [status, 0]));
  for (const field of Object.values(record.fields)) counts[field.status] += 1;
  return counts;
}

function generateDraftQaScene(record) {
  const { fields } = record;
  const overlay = record.qaOverlay ?? {};
  const symbolicOnly = !fields.storefrontBay.value?.sceneBounds && (
    fields.storefrontBay.status === "symbolic" ||
    fields.category.status === "symbolic"
  );
  const footprintBounds = symbolicOnly
    ? null
    : fields.buildingFootprint.value?.sceneBounds ?? overlay.footprint?.bounds ?? null;
  const storefrontBounds = symbolicOnly
    ? null
    : fields.storefrontBay.value?.sceneBounds ?? overlay.storefrontBay?.bounds ?? null;
  const anchorPoint = fields.sceneAnchor.value?.marker ?? overlay.anchorConnector?.from ?? null;
  const labelPosition = overlay.labelPosition ?? anchorPoint ?? null;
  const statusSummaryPosition = overlay.statusSummaryPosition ?? offsetPoint(labelPosition, 0, 46);
  const entities = [];

  if (footprintBounds) {
    entities.push(buildGeneratedRectEntity(record, "footprint", "buildingFootprint", fields.buildingFootprint.status, footprintBounds, {
      label: "Approx footprint",
    }));
  }

  if (storefrontBounds) {
    const facadeBounds = deriveFacadeBounds(storefrontBounds, fields.signPlacement.value);
    const signBounds = deriveSignBounds(storefrontBounds, fields.signPlacement.value);
    const doorBounds = deriveDoorBounds(storefrontBounds, fields.doorWindowPlacement.value);
    const windowBounds = deriveWindowBounds(storefrontBounds, doorBounds, fields.doorWindowPlacement.value, fields.storefrontBay.value);

    entities.push(buildGeneratedRectEntity(record, "facade-panel", "facadeStyle", fields.facadeStyle.status, facadeBounds, {
      label: String(fields.facadeStyle.value?.description ?? fields.facadeStyle.value),
    }));
    entities.push(buildGeneratedRectEntity(record, "storefront-bay", "storefrontBay", fields.storefrontBay.status, storefrontBounds, {
      label: fields.storefrontBay.value?.bayRole ?? "Approx storefront bay",
    }));
    entities.push(buildGeneratedRectEntity(record, "sign-band", "signPlacement", fields.signPlacement.status, signBounds, {
      text: String(fields.signText.value),
      label: "Generated sign band",
      textStatus: fields.signText.status,
    }));
    entities.push(buildGeneratedRectEntity(record, "door-cue", "doorWindowPlacement", fields.doorWindowPlacement.status, doorBounds, {
      label: "Generated door cue",
    }));

    for (const [index, bounds] of windowBounds.entries()) {
      entities.push(buildGeneratedRectEntity(record, "window-cue", "doorWindowPlacement", fields.doorWindowPlacement.status, bounds, {
        label: `Generated window cue ${index + 1}`,
      }));
    }

    for (const [index, line] of deriveBayDivisionLines(storefrontBounds, fields.storefrontBay.value).entries()) {
      entities.push({
        id: `${record.id}:bay-division-${index + 1}`,
        type: "bay-division",
        field: "storefrontBay",
        status: fields.storefrontBay.status,
        from: line.from,
        to: line.to,
        label: `Generated bay division ${index + 1}`,
        generatedFrom: ["fields.storefrontBay.value.sceneBounds", "fields.storefrontBay.value.bayCount"],
      });
    }

    if (anchorPoint) {
      entities.push({
        id: `${record.id}:anchor-connector`,
        type: "anchor-connector",
        field: "sceneAnchor",
        status: fields.sceneAnchor.status,
        from: anchorPoint,
        to: centerOf(storefrontBounds),
        label: "Generated anchor connector",
        generatedFrom: ["fields.sceneAnchor.value.marker", "fields.storefrontBay.value.sceneBounds"],
      });
    }
  } else {
    const symbolicCue = overlay.symbolicCue ?? deriveSymbolicCue(anchorPoint, fields.signText.value);
    if (symbolicCue) {
      entities.push({
        id: `${record.id}:symbolic-cue`,
        type: "symbolic-cue",
        field: "stationIntersectionCues",
        status: symbolicCue.status ?? fields.stationIntersectionCues.status,
        center: symbolicCue.center,
        radius: symbolicCue.radius,
        label: symbolicCue.blockedLabel ?? "Symbolic / blocked station geometry",
        blockedLabel: symbolicCue.blockedLabel ?? "blocked exact station geometry",
        generatedFrom: ["fields.sceneAnchor.value.marker", "fields.stationIntersectionCues"],
      });
      const signBounds = overlay.signPanel?.bounds ?? {
        x: symbolicCue.center.x - 38,
        y: symbolicCue.center.y - symbolicCue.radius - 28,
        width: 76,
        height: 42,
      };
      entities.push(buildGeneratedRectEntity(record, "sign-band", "signPlacement", fields.signPlacement.status, signBounds, {
        text: String(fields.signText.value),
        label: "Generated symbolic sign band",
        textStatus: fields.signText.status,
      }));
      if (overlay.doorCue?.bounds) {
        entities.push(buildGeneratedRectEntity(
          record,
          "door-cue",
          "doorWindowPlacement",
          fields.doorWindowPlacement.status,
          overlay.doorCue.bounds,
          { label: "Generated blocked entrance cue" },
        ));
      }
      if (anchorPoint) {
        entities.push({
          id: `${record.id}:anchor-connector`,
          type: "anchor-connector",
          field: "sceneAnchor",
          status: fields.sceneAnchor.status,
          from: anchorPoint,
          to: symbolicCue.center,
          label: "Generated symbolic anchor connector",
          generatedFrom: ["fields.sceneAnchor.value.marker", "symbolic cue center"],
        });
      }
    }
  }

  entities.push(...buildFieldStatusCallouts(record, entities, overlay));

  entities.push({
    id: `${record.id}:business-label`,
    type: "business-label",
    field: "name",
    status: fields.name.status,
    point: labelPosition,
    text: String(fields.name.value),
    label: "Generated business label",
    generatedFrom: ["fields.name.value", "qaOverlay.labelPosition"],
  });

  const statusChips = buildDraftStatusChips(record, overlay);
  entities.push({
    id: `${record.id}:status-badges`,
    type: "status-badges",
    field: "renderingUse",
    status: record.renderingUse.status,
    point: statusSummaryPosition,
    chips: statusChips,
    label: "Generated visible status badges",
    generatedFrom: ["fields.*.status", "qaOverlay.statusSummaryPosition"],
  });

  return {
    id: `${record.id}:generated-qa-scene`,
    status: "qa_mode_only_generated",
    generator: "deterministic-draft-fixture-adapter",
    generatedFrom: [
      "draftScene.fields",
      "draftScene.qaOverlay alignment hints",
    ],
    entities,
    statusChips,
  };
}

function buildFieldStatusCallouts(record, entities, overlay) {
  const plan = overlay.fieldStatusCallouts ?? getDefaultFieldStatusCalloutPlan(record);
  const callouts = [];

  for (const [index, item] of plan.entries()) {
    const sourceEntity = entities.find((entity) => entity.type === item.entityType);
    const fieldName = item.field ?? sourceEntity?.field;
    const field = fieldName ? record.fields[fieldName] : null;
    if (!sourceEntity || !field) continue;

    const from = getGeneratedEntityAnchor(sourceEntity);
    if (!from) continue;

    const point = item.point ?? offsetPoint(
      from,
      item.offset?.x ?? getDefaultCalloutOffset(sourceEntity.type).x,
      item.offset?.y ?? getDefaultCalloutOffset(sourceEntity.type).y,
    );
    const secondaryField = item.secondaryField ? record.fields[item.secondaryField] : null;
    const primaryText = `${item.label ?? fieldName}: ${formatDraftStatusForLabel(field.status)}`;
    const secondaryText = secondaryField
      ? ` / ${formatDraftStatusForLabel(secondaryField.status)} ${formatDraftFieldName(item.secondaryField)}`
      : "";

    callouts.push({
      id: `${record.id}:field-status-callout-${index + 1}`,
      type: "field-status-callout",
      field: fieldName,
      status: field.status,
      point,
      from,
      text: `${primaryText}${secondaryText}`,
      label: item.label ?? formatDraftFieldName(fieldName),
      targetEntityId: sourceEntity.id,
      secondaryField: item.secondaryField ?? null,
      secondaryStatus: secondaryField?.status ?? null,
      generatedFrom: [
        `fields.${fieldName}.status`,
        "qaOverlay.fieldStatusCallouts",
        sourceEntity.id,
      ],
    });
  }

  return callouts;
}

function getDefaultFieldStatusCalloutPlan(record) {
  if (record.fields.storefrontBay.status === "symbolic") {
    return [
      { entityType: "symbolic-cue", field: "stationIntersectionCues", label: "station cue" },
      { entityType: "door-cue", field: "doorWindowPlacement", label: "entrance" },
      { entityType: "anchor-connector", field: "sceneAnchor", label: "anchor" },
    ];
  }

  return [
    { entityType: "sign-band", field: "signText", secondaryField: "signPlacement", label: "sign" },
    { entityType: "facade-panel", field: "facadeStyle", label: "facade" },
    { entityType: "storefront-bay", field: "storefrontBay", label: "bay" },
    { entityType: "door-cue", field: "doorWindowPlacement", label: "door/window" },
    { entityType: "anchor-connector", field: "sceneAnchor", label: "anchor" },
  ];
}

function getGeneratedEntityAnchor(entity) {
  if (entity.bounds) return centerOf(entity.bounds);
  if (entity.center) return entity.center;
  if (entity.point) return entity.point;
  if (entity.from && entity.to) {
    return {
      x: Math.round((entity.from.x + entity.to.x) / 2),
      y: Math.round((entity.from.y + entity.to.y) / 2),
    };
  }
  return null;
}

function getDefaultCalloutOffset(entityType) {
  if (entityType === "sign-band") return { x: 18, y: -24 };
  if (entityType === "facade-panel") return { x: -82, y: -18 };
  if (entityType === "storefront-bay") return { x: 26, y: 16 };
  if (entityType === "door-cue") return { x: 18, y: 38 };
  if (entityType === "symbolic-cue") return { x: 50, y: -46 };
  return { x: 24, y: -22 };
}

function formatDraftStatusForLabel(status) {
  return status.replaceAll("_", " ");
}

function formatDraftFieldName(fieldName) {
  return fieldName.replaceAll("_", " ").replace(/([a-z])([A-Z])/g, "$1 $2");
}

function buildGeneratedRectEntity(record, type, field, status, bounds, extra = {}) {
  return {
    id: `${record.id}:${type}`,
    type,
    field,
    status,
    bounds: roundBounds(bounds),
    generatedFrom: [`fields.${field}.value`, "deterministic geometry rules"],
    ...extra,
  };
}

function buildDraftStatusChips(record, overlay) {
  return overlay.statusChips ?? [
    { label: "name", status: record.fields.name.status },
    { label: "address", status: record.fields.addressText.status },
    { label: "frontage", status: record.fields.frontage.status },
    { label: "bay", status: record.fields.storefrontBay.status },
    { label: "door/window", status: record.fields.doorWindowPlacement.status },
  ];
}

function deriveFacadeBounds(bay, signPlacement = {}) {
  const widthPad = Math.round(bay.width * 0.1);
  const height = signPlacement.facadeHeight ?? Math.max(54, Math.round(bay.height * 0.58));
  const yOffset = signPlacement.facadeOffsetY ?? Math.round(bay.height * -0.08);
  return roundBounds({
    x: bay.x - widthPad,
    y: bay.y + yOffset,
    width: bay.width + widthPad * 2,
    height,
  });
}

function deriveSignBounds(bay, signPlacement = {}) {
  const insetX = signPlacement.insetX ?? Math.round(bay.width * 0.12);
  const height = signPlacement.height ?? 28;
  const offsetY = signPlacement.offsetY ?? 6;
  return roundBounds({
    x: bay.x + insetX,
    y: bay.y + offsetY,
    width: Math.max(54, bay.width - insetX * 2),
    height,
  });
}

function deriveDoorBounds(bay, doorWindowPlacement = {}) {
  const doorWidth = doorWindowPlacement.doorWidth ?? Math.max(30, Math.round(bay.width * 0.17));
  const doorHeight = doorWindowPlacement.doorHeight ?? Math.max(38, Math.round(bay.height * 0.38));
  const doorY = doorWindowPlacement.doorY ?? bay.y + Math.round(bay.height * 0.48);
  const position = doorWindowPlacement.doorPosition ?? "center";
  const doorX = position === "right"
    ? bay.x + bay.width - doorWidth - Math.round(bay.width * 0.18)
    : position === "left"
      ? bay.x + Math.round(bay.width * 0.18)
      : bay.x + Math.round((bay.width - doorWidth) / 2);

  return roundBounds({
    x: doorX,
    y: doorY,
    width: doorWidth,
    height: doorHeight,
  });
}

function deriveWindowBounds(bay, door, doorWindowPlacement = {}, storefrontBay = {}) {
  const count = doorWindowPlacement.windowCount ?? Math.max(0, (storefrontBay.bayCount ?? 3) - 1);
  if (!count) return [];

  const width = doorWindowPlacement.windowWidth ?? Math.max(34, Math.round(bay.width * 0.2));
  const height = doorWindowPlacement.windowHeight ?? Math.max(24, Math.round(bay.height * 0.23));
  const y = doorWindowPlacement.windowY ?? door.y;
  const leftX = bay.x + Math.round(bay.width * 0.14);
  const rightX = bay.x + bay.width - width - Math.round(bay.width * 0.14);

  if (count === 1) {
    const side = door.x < bay.x + bay.width / 2 ? rightX : leftX;
    return [roundBounds({ x: side, y, width, height })];
  }

  return [
    roundBounds({ x: leftX, y, width, height }),
    roundBounds({ x: rightX, y, width, height }),
  ].slice(0, count);
}

function deriveBayDivisionLines(bay, storefrontBay = {}) {
  const bayCount = storefrontBay.bayCount ?? 1;
  if (bayCount < 2) return [];

  return Array.from({ length: bayCount - 1 }, (_, index) => {
    const x = bay.x + Math.round((bay.width / bayCount) * (index + 1));
    return {
      from: { x, y: bay.y + Math.round(bay.height * 0.32) },
      to: { x, y: bay.y + Math.round(bay.height * 0.92) },
    };
  });
}

function deriveSymbolicCue(anchorPoint, signText) {
  if (!anchorPoint) return null;
  return {
    center: anchorPoint,
    radius: String(signText).length <= 1 ? 34 : 42,
    status: "blocked",
    blockedLabel: "symbolic transit cue; exact geometry blocked",
  };
}

function centerOf(bounds) {
  return {
    x: Math.round(bounds.x + bounds.width / 2),
    y: Math.round(bounds.y + bounds.height / 2),
  };
}

function offsetPoint(point, dx, dy) {
  if (!point) return null;
  return { x: point.x + dx, y: point.y + dy };
}

function roundBounds(bounds) {
  return {
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height),
  };
}

function buildSourceEvidenceIndex(fixture) {
  const index = {
    recordsById: new Map(),
    recordsByPlaceId: new Map(),
    recordsByTargetId: new Map(),
  };
  if (!fixture) return index;

  for (const record of fixture.records) {
    index.recordsById.set(record.id, record);
    for (const placeId of record.placeIds) appendIndexedRecord(index.recordsByPlaceId, placeId, record);
    for (const targetId of record.targetIds) appendIndexedRecord(index.recordsByTargetId, targetId, record);
  }

  return index;
}

function appendIndexedRecord(index, id, record) {
  if (!index.has(id)) index.set(id, []);
  index.get(id).push(record);
}

function collectTargetEvidence(object, place, evidenceIndex) {
  const records = [
    ...(evidenceIndex.recordsByTargetId.get(object.appTarget.id) ?? []),
    ...(evidenceIndex.recordsByPlaceId.get(object.placeId) ?? []),
    ...((place?.sourceEvidenceIds ?? [])
      .map((id) => evidenceIndex.recordsById.get(id))
      .filter(Boolean)),
  ];
  return [...new Map(records.map((record) => [record.id, record])).values()];
}

function indexById(records) {
  return new Map(records.map((record) => [record.id, record]));
}

export function validateSceneManifest(manifest) {
  assertObject(manifest, "Scene manifest");
  assertEqual(manifest.schemaVersion, REQUIRED_MANIFEST_VERSION, "manifest.schemaVersion");
  assertString(manifest.sceneId, "manifest.sceneId");
  assertString(manifest.blockId, "manifest.blockId");
  assertString(manifest.generatedAt, "manifest.generatedAt");

  const sourceIds = collectIds(manifest.sources, "manifest.sources");
  const placeIds = collectIds(manifest.places, "manifest.places");
  const businessIds = collectIds(manifest.businesses, "manifest.businesses");
  const addressIds = collectIds(manifest.addresses, "manifest.addresses");
  const storefrontIds = collectIds(manifest.storefronts, "manifest.storefronts");
  const assetIds = collectIds(manifest.scene?.assets, "manifest.scene.assets");
  const anchorIds = collectIds(manifest.scene?.anchors, "manifest.scene.anchors");

  assertObject(manifest.geometry, "manifest.geometry");
  assertArray(manifest.geometry.parcels, "manifest.geometry.parcels");
  assertArray(manifest.geometry.buildings, "manifest.geometry.buildings");
  assertArray(manifest.geometry.streets, "manifest.geometry.streets");
  assertObject(manifest.scene?.transform, "manifest.scene.transform");
  assertObject(manifest.scene.transform.sceneSize, "manifest.scene.transform.sceneSize");
  assertNumber(manifest.scene.transform.sceneSize.width, "manifest.scene.transform.sceneSize.width");
  assertNumber(manifest.scene.transform.sceneSize.height, "manifest.scene.transform.sceneSize.height");
  assertArray(manifest.scene?.objects, "manifest.scene.objects");
  assertArray(manifest.overrides, "manifest.overrides");
  assertObject(manifest.qa, "manifest.qa");
  assertObject(manifest.app, "manifest.app");
  assertObject(manifest.app.sceneFrame, "manifest.app.sceneFrame");

  for (const source of manifest.sources) {
    assertString(source.label, `source ${source.id}.label`);
    assertString(source.reviewedOn, `source ${source.id}.reviewedOn`);
    assertArray(source.claimTypesSupported, `source ${source.id}.claimTypesSupported`);
    assertString(source.usageStatus, `source ${source.id}.usageStatus`);
  }

  for (const place of manifest.places) {
    assertReferences(place.sourceIds, sourceIds, `place ${place.id}.sourceIds`);
    assertReferences(place.addressIds, addressIds, `place ${place.id}.addressIds`);
    assertReferences(place.storefrontIds, storefrontIds, `place ${place.id}.storefrontIds`);
    assertReferences(place.sceneAnchorIds, anchorIds, `place ${place.id}.sceneAnchorIds`);
    if (place.businessId) assertReference(place.businessId, businessIds, `place ${place.id}.businessId`);
  }

  for (const object of manifest.scene.objects) {
    assertReference(object.placeId, placeIds, `scene object ${object.id}.placeId`);
    assertReference(object.anchorId, anchorIds, `scene object ${object.id}.anchorId`);
    assertReferences(object.assetIds, assetIds, `scene object ${object.id}.assetIds`);
    assertReferences(object.sourceIds, sourceIds, `scene object ${object.id}.sourceIds`);
    validateAppTarget(object.appTarget, object.id, sourceIds);
  }

  for (const asset of manifest.scene.assets) {
    assertReferences(asset.sourceIds, sourceIds, `scene asset ${asset.id}.sourceIds`);
  }

  for (const override of manifest.overrides) {
    assertReferences(override.sourceIds, sourceIds, `override ${override.id}.sourceIds`);
  }

  assertNoLegacyJpegReferences(manifest);

  return manifest;
}

export function validateSourceEvidenceFixture(fixture, manifest, indexes = buildManifestIndexes(manifest)) {
  assertObject(fixture, "Source evidence fixture");
  assertEqual(fixture.schemaVersion, REQUIRED_EVIDENCE_SCHEMA_VERSION, "sourceEvidence.schemaVersion");
  assertString(fixture.fixtureId, "sourceEvidence.fixtureId");
  assertString(fixture.status, "sourceEvidence.status");
  assertString(fixture.reviewedOn, "sourceEvidence.reviewedOn");

  const evidenceIds = collectIds(fixture.records, "sourceEvidence.records");
  const targetIds = new Set(manifest.scene.objects.map((object) => object.appTarget.id));
  const sourceIds = indexes.sourcesById;

  for (const record of fixture.records) {
    assertArray(record.targetIds, `source evidence ${record.id}.targetIds`);
    assertReferences(record.targetIds, targetIds, `source evidence ${record.id}.targetIds`);
    assertReferences(record.placeIds, indexes.placesById, `source evidence ${record.id}.placeIds`);
    assertReferences(record.sourceRecordIds, sourceIds, `source evidence ${record.id}.sourceRecordIds`);
    assertString(record.sourceType, `source evidence ${record.id}.sourceType`);
    assertString(record.sourceLabel, `source evidence ${record.id}.sourceLabel`);
    assertString(record.sourceUrl, `source evidence ${record.id}.sourceUrl`);
    assertString(record.capturedOn, `source evidence ${record.id}.capturedOn`);
    assertString(record.reviewedOn, `source evidence ${record.id}.reviewedOn`);
    assertString(record.usageStatus, `source evidence ${record.id}.usageStatus`);
    assertOneOf(record.evidenceStrength, EVIDENCE_STRENGTH_VALUES, `source evidence ${record.id}.evidenceStrength`);
    assertOneOf(record.claimReadiness, CLAIM_READINESS_VALUES, `source evidence ${record.id}.claimReadiness`);
    validatePromotionGates(record.promotionGates, `source evidence ${record.id}.promotionGates`);
    validateProductCopyPromotion(record, `source evidence ${record.id}`);
    assertObject(record.confidence, `source evidence ${record.id}.confidence`);
    assertString(record.confidence.value, `source evidence ${record.id}.confidence.value`);
    assertString(record.confidence.rationale, `source evidence ${record.id}.confidence.rationale`);
    assertArray(record.claimMappings, `source evidence ${record.id}.claimMappings`);
    assertArray(record.qaNotes, `source evidence ${record.id}.qaNotes`);
    assertArray(record.remainingGaps, `source evidence ${record.id}.remainingGaps`);

    for (const mapping of record.claimMappings) {
      assertObject(mapping, `source evidence ${record.id}.claimMappings item`);
      assertString(mapping.claimId, `source evidence ${record.id}.claimMappings.claimId`);
      assertString(mapping.manifestPath, `source evidence ${record.id}.claimMappings.manifestPath`);
      assertString(mapping.claimType, `source evidence ${record.id}.claimMappings.claimType`);
      assertString(mapping.claimValue, `source evidence ${record.id}.claimMappings.claimValue`);
      assertString(mapping.supportLevel, `source evidence ${record.id}.claimMappings.supportLevel`);
      assertString(mapping.confidence, `source evidence ${record.id}.claimMappings.confidence`);
      assertString(mapping.notes, `source evidence ${record.id}.claimMappings.notes`);
    }
  }

  for (const place of manifest.places) {
    if (place.sourceEvidenceIds) {
      assertReferences(place.sourceEvidenceIds, evidenceIds, `place ${place.id}.sourceEvidenceIds`);
    }
  }

  assertNoLegacyJpegReferences(fixture, "Source evidence fixture");

  return fixture;
}

export function validateDraftSceneFixture(fixture, manifest, indexes = buildManifestIndexes(manifest)) {
  assertObject(fixture, "Draft scene fixture");
  assertEqual(fixture.schemaVersion, REQUIRED_DRAFT_SCENE_SCHEMA_VERSION, "draftScene.schemaVersion");
  assertString(fixture.fixtureId, "draftScene.fixtureId");
  assertEqual(fixture.sceneId, manifest.sceneId, "draftScene.sceneId");
  assertString(fixture.status, "draftScene.status");
  assertString(fixture.reviewedOn, "draftScene.reviewedOn");
  assertString(fixture.lane, "draftScene.lane");
  assertArray(fixture.notes, "draftScene.notes");
  assertObject(fixture.statusValues, "draftScene.statusValues");
  assertArray(fixture.records, "draftScene.records");

  for (const status of DRAFT_SCENE_STATUS_VALUES) {
    assertString(fixture.statusValues[status], `draftScene.statusValues.${status}`);
  }

  const draftRecordIds = new Set();
  const targetIds = new Set(manifest.scene.objects.map((object) => object.appTarget.id));
  for (const record of fixture.records) {
    assertObject(record, "draftScene.records item");
    assertString(record.id, "draftScene.records item.id");
    if (draftRecordIds.has(record.id)) throw new Error(`draftScene.records has duplicate id "${record.id}".`);
    draftRecordIds.add(record.id);

    assertReference(record.targetId, targetIds, `draftScene record ${record.id}.targetId`);
    assertReference(record.placeId, indexes.placesById, `draftScene record ${record.id}.placeId`);
    assertArray(record.sourceEvidenceRecordIds, `draftScene record ${record.id}.sourceEvidenceRecordIds`);
    for (const id of record.sourceEvidenceRecordIds) {
      assertString(id, `draftScene record ${record.id}.sourceEvidenceRecordIds item`);
    }
    validateDraftSceneStatusField(record.renderingUse, `draftScene record ${record.id}.renderingUse`, {
      requireSourceIds: false,
    });
    assertObject(record.fields, `draftScene record ${record.id}.fields`);

    for (const fieldName of REQUIRED_DRAFT_SCENE_FIELDS) {
      validateDraftSceneStatusField(record.fields[fieldName], `draftScene record ${record.id}.fields.${fieldName}`);
    }

    if (record.qaOverlay) validateDraftSceneQaOverlay(record.qaOverlay, `draftScene record ${record.id}.qaOverlay`);
  }

  assertNoLegacyJpegReferences(fixture, "Draft scene fixture");

  return fixture;
}

function validateDraftSceneStatusField(field, label, options = {}) {
  const requireSourceIds = options.requireSourceIds ?? true;
  assertObject(field, label);
  if (!Object.hasOwn(field, "value")) throw new Error(`${label}.value must be present.`);
  assertOneOf(field.status, DRAFT_SCENE_STATUS_VALUES, `${label}.status`);
  if (requireSourceIds) assertArray(field.sourceIds, `${label}.sourceIds`);
  assertString(field.notes, `${label}.notes`);
}

function validateDraftSceneQaOverlay(overlay, label) {
  assertObject(overlay, label);
  validateScenePointLike(overlay.labelPosition, `${label}.labelPosition`);
  validateScenePointLike(overlay.statusSummaryPosition, `${label}.statusSummaryPosition`);
  validateOverlayRect(overlay.footprint, `${label}.footprint`);
  validateOverlayRect(overlay.facadeBand, `${label}.facadeBand`);
  validateOverlayRect(overlay.storefrontBay, `${label}.storefrontBay`);
  validateOverlayRect(overlay.signPanel, `${label}.signPanel`);
  assertString(overlay.signPanel.text, `${label}.signPanel.text`);
  validateOverlayRect(overlay.doorCue, `${label}.doorCue`);
  assertArray(overlay.windowCues, `${label}.windowCues`);
  for (const [index, cue] of overlay.windowCues.entries()) {
    validateOverlayRect(cue, `${label}.windowCues[${index}]`);
  }
  validateOverlayConnector(overlay.anchorConnector, `${label}.anchorConnector`);
  if (overlay.symbolicCue) validateSymbolicCue(overlay.symbolicCue, `${label}.symbolicCue`);
  assertArray(overlay.statusChips, `${label}.statusChips`);
  for (const [index, chip] of overlay.statusChips.entries()) {
    assertString(chip.label, `${label}.statusChips[${index}].label`);
    assertOneOf(chip.status, DRAFT_SCENE_STATUS_VALUES, `${label}.statusChips[${index}].status`);
  }
  if (overlay.fieldStatusCallouts) {
    assertArray(overlay.fieldStatusCallouts, `${label}.fieldStatusCallouts`);
    for (const [index, callout] of overlay.fieldStatusCallouts.entries()) {
      assertString(callout.entityType, `${label}.fieldStatusCallouts[${index}].entityType`);
      assertString(callout.field, `${label}.fieldStatusCallouts[${index}].field`);
      assertString(callout.label, `${label}.fieldStatusCallouts[${index}].label`);
      if (callout.secondaryField) {
        assertString(callout.secondaryField, `${label}.fieldStatusCallouts[${index}].secondaryField`);
      }
      if (callout.offset) {
        assertObject(callout.offset, `${label}.fieldStatusCallouts[${index}].offset`);
        assertNumber(callout.offset.x, `${label}.fieldStatusCallouts[${index}].offset.x`);
        assertNumber(callout.offset.y, `${label}.fieldStatusCallouts[${index}].offset.y`);
      }
      if (callout.point) validateScenePointLike(callout.point, `${label}.fieldStatusCallouts[${index}].point`);
    }
  }
}

function validateOverlayRect(rect, label) {
  assertObject(rect, label);
  assertString(rect.field, `${label}.field`);
  assertOneOf(rect.status, DRAFT_SCENE_STATUS_VALUES, `${label}.status`);
  assertObject(rect.bounds, `${label}.bounds`);
  assertNumber(rect.bounds.x, `${label}.bounds.x`);
  assertNumber(rect.bounds.y, `${label}.bounds.y`);
  assertNumber(rect.bounds.width, `${label}.bounds.width`);
  assertNumber(rect.bounds.height, `${label}.bounds.height`);
}

function validateOverlayConnector(connector, label) {
  assertObject(connector, label);
  assertString(connector.field, `${label}.field`);
  assertOneOf(connector.status, DRAFT_SCENE_STATUS_VALUES, `${label}.status`);
  validateScenePointLike(connector.from, `${label}.from`);
  validateScenePointLike(connector.to, `${label}.to`);
}

function validateSymbolicCue(cue, label) {
  assertObject(cue, label);
  assertString(cue.field, `${label}.field`);
  assertOneOf(cue.status, DRAFT_SCENE_STATUS_VALUES, `${label}.status`);
  validateScenePointLike(cue.center, `${label}.center`);
  assertNumber(cue.radius, `${label}.radius`);
  assertString(cue.blockedLabel, `${label}.blockedLabel`);
}

function validateScenePointLike(point, label) {
  assertObject(point, label);
  assertNumber(point.x, `${label}.x`);
  assertNumber(point.y, `${label}.y`);
}

function validatePromotionGates(gates, label) {
  assertObject(gates, label);
  for (const key of PROMOTION_CLAIM_KEYS) {
    const gate = gates[key];
    const gateLabel = `${label}.${key}`;
    assertObject(gate, gateLabel);
    assertOneOf(gate.status, PROMOTION_GATE_STATUS_VALUES, `${gateLabel}.status`);
    assertString(gate.rationale, `${gateLabel}.rationale`);
    if (gate.status !== "allowed") assertString(gate.neededEvidence, `${gateLabel}.neededEvidence`);
    assertArray(gate.claimIds, `${gateLabel}.claimIds`);
    for (const claimId of gate.claimIds) assertString(claimId, `${gateLabel}.claimIds item`);
  }
}

function validateProductCopyPromotion(record, label) {
  if (record.claimReadiness !== "product_copy_ready") return;
  const failures = PROMOTION_CLAIM_KEYS
    .filter((key) => record.promotionGates[key].status !== "allowed")
    .map((key) => `${key}=${record.promotionGates[key].status}`);
  if (failures.length) {
    throw new Error(`${label}.claimReadiness cannot be product_copy_ready until all promotion gates are allowed; failing gates: ${failures.join(", ")}.`);
  }
}

function validateAppTarget(target, objectId, sourceIds) {
  assertObject(target, `scene object ${objectId}.appTarget`);
  assertString(target.id, `scene object ${objectId}.appTarget.id`);
  assertString(target.title, `target ${target.id}.title`);
  assertString(target.category, `target ${target.id}.category`);
  assertString(target.summary, `target ${target.id}.summary`);
  assertString(target.description, `target ${target.id}.description`);
  assertObject(target.marker, `target ${target.id}.marker`);
  assertNumber(target.marker.x, `target ${target.id}.marker.x`);
  assertNumber(target.marker.y, `target ${target.id}.marker.y`);
  assertObject(target.bounds, `target ${target.id}.bounds`);
  assertNumber(target.bounds.x, `target ${target.id}.bounds.x`);
  assertNumber(target.bounds.y, `target ${target.id}.bounds.y`);
  assertNumber(target.bounds.width, `target ${target.id}.bounds.width`);
  assertNumber(target.bounds.height, `target ${target.id}.bounds.height`);
  assertReferences(target.sourceRefs, sourceIds, `target ${target.id}.sourceRefs`);
  assertArray(target.tags, `target ${target.id}.tags`);
}

function collectIds(records, label) {
  assertArray(records, label);
  const ids = new Set();
  for (const record of records) {
    assertObject(record, `${label} item`);
    assertString(record.id, `${label} item.id`);
    if (ids.has(record.id)) throw new Error(`${label} has duplicate id "${record.id}".`);
    ids.add(record.id);
  }
  return ids;
}

function assertNoLegacyJpegReferences(value) {
  const legacyReference = findLegacyJpegReference(value);
  if (legacyReference) {
    throw new Error(`Scene manifest contains stale legacy JPEG reference: ${legacyReference}`);
  }
}

function findLegacyJpegReference(value) {
  if (typeof value === "string") return value.includes(LEGACY_JPEG_EXTENSION) ? value : null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findLegacyJpegReference(item);
      if (match) return match;
    }
    return null;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      const match = findLegacyJpegReference(item);
      if (match) return match;
    }
  }
  return null;
}

function assertReferences(values, knownIds, label) {
  assertArray(values, label);
  for (const value of values) assertReference(value, knownIds, label);
}

function assertReference(value, knownIds, label) {
  assertString(value, label);
  if (!knownIds.has(value)) throw new Error(`${label} references missing id "${value}".`);
}

function assertEqual(value, expected, label) {
  if (value !== expected) throw new Error(`${label} must be "${expected}".`);
}

function assertArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || !value) throw new Error(`${label} must be a string.`);
}

function assertOneOf(value, values, label) {
  assertString(value, label);
  if (!values.has(value)) {
    throw new Error(`${label} must be one of: ${[...values].join(", ")}.`);
  }
}

function assertNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}
