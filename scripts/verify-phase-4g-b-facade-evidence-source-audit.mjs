#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const auditPath = "src/data/source-audits/greenpoint-ave-manhattan-to-franklin.phase-4g-b-facade-evidence-source-audit.v0.1.json";
const notePath = "docs/phase-4g-b-facade-evidence-source-audit.md";

const requiredSources = new Set(["Mapillary", "KartaView"]);
const requiredAllowedClaims = [
  "facade_plane_visibility_review",
  "storefront_bay_visibility_review",
  "entrance_cue_visibility_review",
  "sign_band_visibility_review",
  "window_door_rhythm_visibility_review",
  "corner_wrap_visibility_review",
];
const requiredBlockedClaims = [
  "business_identity",
  "active_status",
  "tenant_frontage_assignment",
  "storefront_anchor_approval",
  "exact_frontage_width_or_order",
  "exact_entrance_ownership",
  "exact_sign_text_logo_trade_dress",
  "material_or_color_truth",
  "exact_address_placement",
  "production_asset_readiness",
  "normal_mode_rendering",
  "public_product_exactness",
];
const requiredBlockedUses = [
  "imagery_access",
  "api_call",
  "image_download",
  "image_cache",
  "image_ingestion",
  "thumbnail_storage",
  "file_url_storage",
  "image_render_use",
  "source_derived_textures",
  "automated_image_extraction",
  "model_training",
  "normal_mode_exposure",
  "production_use",
  "business_linkage",
  "exact_storefront_frontage_entrance_claim",
];
const requiredPacketBlocks = [
  "no_production_use",
  "no_normal_mode_exposure",
  "no_business_linkage",
  "no_exact_storefront_frontage_entrance_address_signage_tenant_claims",
  "no_imagery_access_download_cache_ingestion_render_extraction",
];
const forbiddenPromotionPhrases = [
  "are approved evidence sources",
  "are approved production sources",
  "are business evidence sources",
  "are normal-mode inputs",
  "is a source of exact storefront",
  "are sources of exact storefront",
  "imagery was accessed",
  "imagery was downloaded",
  "imagery was cached",
  "imagery was ingested",
  "imagery was rendered",
];

async function main() {
  const failures = [];
  const audit = JSON.parse(await readFile(resolve(repoRoot, auditPath), "utf8"));
  const note = await readFile(resolve(repoRoot, notePath), "utf8");

  assertEqual(audit.auditBatch, "4G-B", "auditBatch", failures);
  assertEqual(audit.sourceLane, "facade_evidence", "sourceLane", failures);
  assertEqual(audit.reviewOnly, true, "reviewOnly", failures);
  assertEqual(audit.qaOnly, true, "qaOnly", failures);
  assertEqual(audit.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertIncludes(audit.sourceAccessSummary, "No imagery or image-derived data was accessed, downloaded, cached, ingested, rendered, extracted", "sourceAccessSummary block", failures);

  if (!Array.isArray(audit.candidateSources) || audit.candidateSources.length !== 2) {
    failures.push("Expected exactly two candidate source records");
  }

  const seenSources = new Set();
  for (const record of audit.candidateSources ?? []) {
    seenSources.add(record.candidateSource);
    assertEqual(record.geometryConfidenceSupport, "blocked_not_geometry_confidence_source", `${record.candidateSource} geometryConfidenceSupport`, failures);
    assertEqual(record.businessIdentitySupport, "blocked_not_business_identity_source", `${record.candidateSource} businessIdentitySupport`, failures);
    assertEqual(record.imageStorageAllowed, "blocked", `${record.candidateSource} imageStorageAllowed`, failures);
    assertEqual(record.imageDownloadAllowed, "blocked", `${record.candidateSource} imageDownloadAllowed`, failures);
    assertEqual(record.imageCacheAllowed, "blocked", `${record.candidateSource} imageCacheAllowed`, failures);
    assertEqual(record.imageExtractionAllowed, "blocked", `${record.candidateSource} imageExtractionAllowed`, failures);
    assertEqual(record.renderUsePolicy, "blocked", `${record.candidateSource} renderUsePolicy`, failures);
    assertEqual(record.trainingUsePolicy, "blocked", `${record.candidateSource} trainingUsePolicy`, failures);
    assertEqual(record.productionUsePolicy, "blocked", `${record.candidateSource} productionUsePolicy`, failures);

    for (const field of [
      "auditRecordId",
      "sourceAccessStatus",
      "termsReviewStatus",
      "reviewedPublicUrls",
      "metadataFieldsObserved",
      "coverageAvailabilityPotential",
      "imageryCoverageStatus",
      "facadePlaneVisibility",
      "storefrontBayVisibility",
      "entranceCueVisibility",
      "signBandVisibility",
      "windowDoorRhythmVisibility",
      "cornerWrapVisibility",
      "occlusionStatus",
      "recencyStatus",
      "angleSufficiencyStatus",
      "attributionRequirement",
      "displayPolicy",
      "storageCachePolicy",
      "allowedUses",
      "blockedUses",
      "claimSupportAllowed",
      "claimSupportBlocked",
      "batuDecisionRequired",
      "unresolvedQuestions",
    ]) {
      if (record[field] === undefined) failures.push(`${record.candidateSource} missing ${field}`);
    }

    if (!String(record.sourceAccessStatus).includes("no_imagery_accessed_no_api_call")) {
      failures.push(`${record.candidateSource} must explicitly avoid imagery access and API calls`);
    }

    for (const claim of requiredAllowedClaims) {
      if (!record.claimSupportAllowed.includes(claim)) {
        failures.push(`${record.candidateSource} missing allowed review claim: ${claim}`);
      }
    }

    for (const claim of requiredBlockedClaims) {
      if (!record.claimSupportBlocked.includes(claim)) {
        failures.push(`${record.candidateSource} missing blocked claim: ${claim}`);
      }
    }

    for (const blockedUse of requiredBlockedUses) {
      if (!record.blockedUses.includes(blockedUse)) {
        failures.push(`${record.candidateSource} missing blocked use: ${blockedUse}`);
      }
    }
  }

  for (const source of requiredSources) {
    if (!seenSources.has(source)) failures.push(`Missing candidate source: ${source}`);
  }

  for (const block of requiredPacketBlocks) {
    if (!audit.packetBlocksPreserved.includes(block)) failures.push(`Missing packet block: ${block}`);
  }

  for (const snippet of [
    "This audit does not access imagery, download imagery, cache imagery, ingest imagery, render imagery, texture from imagery, extract features from imagery, train on imagery, or productionize imagery.",
    "4G-B result: pass for review-only facade evidence lane feasibility",
    "This is not source approval.",
    "They are not business evidence sources, production sources, normal-mode inputs, approved imagery stores, or sources of exact storefront/frontage/entrance truth.",
  ]) {
    if (!note.includes(snippet)) failures.push(`Missing review note snippet: ${snippet}`);
  }

  const lowerCombinedText = `${JSON.stringify(audit)}\n${note}`.toLowerCase();
  for (const phrase of forbiddenPromotionPhrases) {
    if (lowerCombinedText.includes(phrase)) {
      failures.push(`Forbidden promotion/access phrase appears: ${phrase}`);
    }
  }

  if (failures.length > 0) {
    console.error(`4G-B facade evidence source audit verification failed:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${auditPath}: 4G-B facade lane is review-only, non-ingesting, and non-promotional`);
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label} expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
}

function assertIncludes(text, snippet, label, failures) {
  if (!String(text).includes(snippet)) failures.push(`${label} missing ${snippet}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
