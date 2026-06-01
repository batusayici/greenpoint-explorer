const REQUIRED_MANIFEST_VERSION = "0.1";
const LEGACY_JPEG_EXTENSION = "." + "jpeg";

export function loadMvpSceneFromManifest(manifest, assetSrcById) {
  const validatedManifest = validateSceneManifest(manifest);
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
  const manifestIndexes = buildManifestIndexes(validatedManifest);

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
    manifestQA: buildSceneQA(validatedManifest),
    targets: validatedManifest.scene.objects.map((object) => ({
      ...object.appTarget,
      manifestObjectId: object.id,
      manifestPlaceId: object.placeId,
      manifestAnchorId: object.anchorId,
      claimStatus: object.claimStatus,
      manifestQA: buildTargetQA(object, validatedManifest, manifestIndexes),
    })),
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

function buildSceneQA(manifest) {
  return {
    manifestId: manifest.sceneId,
    blockId: manifest.blockId,
    status: manifest.status,
    generatedAt: manifest.generatedAt,
    transform: manifest.scene.transform,
    qa: manifest.qa,
    overrideCount: manifest.overrides.length,
  };
}

function buildTargetQA(object, manifest, indexes) {
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

function assertNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}
