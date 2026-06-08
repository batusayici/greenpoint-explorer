#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const auditPath = "src/data/source-audits/greenpoint-ave-manhattan-to-franklin.phase-4g-a-geometry-source-audit.v0.1.json";
const notePath = "docs/phase-4g-a-geometry-source-audit.md";

const requiredSources = new Set(["NYC 3D Building Model", "CityGML", "3DCityDB"]);
const requiredAllowedClaims = [
  "building_height_confidence",
  "massing_confidence",
  "roof_volume_confidence",
  "geometry_container_review",
];
const requiredBlockedClaims = [
  "storefront_frontage",
  "storefront_order",
  "facade_appearance",
  "entrance_location",
  "tenant_assignment",
  "business_identity",
  "active_status",
  "signage",
  "exact_address_placement",
  "production_asset_readiness",
  "public_product_exactness",
];
const requiredPacketBlocks = [
  "no_production_use",
  "no_normal_mode_exposure",
  "no_business_linkage",
  "no_exact_storefront_frontage_entrance_address_signage_tenant_claims",
  "no_source_data_download_cache_ingestion_conversion_render_extraction",
];
const forbiddenPromotionPhrases = [
  "approved geometry-source-of-truth",
  "approved evidence source",
  "approved production source",
  "normal-mode source",
  "business evidence source",
  "facade evidence source",
  "storefront evidence source",
  "source data was downloaded",
  "source data was cached",
  "source data was ingested",
  "source data was converted",
  "source data was rendered",
];

async function main() {
  const failures = [];
  const audit = JSON.parse(await readFile(resolve(repoRoot, auditPath), "utf8"));
  const note = await readFile(resolve(repoRoot, notePath), "utf8");

  assertEqual(audit.auditBatch, "4G-A", "auditBatch", failures);
  assertEqual(audit.sourceLane, "geometry_confidence", "sourceLane", failures);
  assertEqual(audit.reviewOnly, true, "reviewOnly", failures);
  assertEqual(audit.qaOnly, true, "qaOnly", failures);
  assertEqual(audit.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertIncludes(audit.sourceAccessSummary, "No source data was downloaded, cached, ingested, converted, rendered, extracted", "sourceAccessSummary block", failures);

  if (!Array.isArray(audit.candidateSources) || audit.candidateSources.length !== 3) {
    failures.push("Expected exactly three candidate source records");
  }

  const seenSources = new Set();
  for (const record of audit.candidateSources ?? []) {
    seenSources.add(record.candidateSource);
    assertEqual(record.facadeEvidenceSupport, "blocked_not_facade_evidence", `${record.candidateSource} facadeEvidenceSupport`, failures);
    assertEqual(record.businessStorefrontSupport, "blocked_not_business_or_storefront_evidence", `${record.candidateSource} businessStorefrontSupport`, failures);

    for (const field of [
      "auditRecordId",
      "sourceAccessStatus",
      "termsReviewStatus",
      "reviewedPublicUrls",
      "allowedUses",
      "blockedUses",
      "attributionRequirement",
      "storageCachePolicy",
      "derivativeUsePolicy",
      "renderUsePolicy",
      "trainingUsePolicy",
      "claimSupportAllowed",
      "claimSupportBlocked",
      "geometryCoverageStatus",
      "heightConfidencePotential",
      "massingConfidencePotential",
      "roofVolumeConfidencePotential",
      "blockGapConfidencePotential",
      "containerAssociationPotential",
      "geometryDiscrepancyNotes",
      "batuDecisionRequired",
      "unresolvedQuestions",
    ]) {
      if (record[field] === undefined) failures.push(`${record.candidateSource} missing ${field}`);
    }

    if (!String(record.sourceAccessStatus).includes("no_data_downloaded") && !String(record.sourceAccessStatus).includes("no_installation")) {
      failures.push(`${record.candidateSource} must explicitly avoid data download/install use`);
    }

    for (const claim of requiredAllowedClaims) {
      if (!record.claimSupportAllowed.some((value) => value.includes(claim))) {
        failures.push(`${record.candidateSource} missing allowed geometry claim: ${claim}`);
      }
    }

    for (const claim of requiredBlockedClaims) {
      if (!record.claimSupportBlocked.includes(claim)) {
        failures.push(`${record.candidateSource} missing blocked claim: ${claim}`);
      }
    }

    for (const blockedUse of ["normal_mode_exposure", "production_use", "business_linkage", "source_derived_textures", "model_training"]) {
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
    "This audit does not access, download, cache, ingest, convert, render, extract, or productionize any source data.",
    "4G-A result: pass for review-only geometry-confidence audit feasibility.",
    "This is not source approval.",
    "They are not facade evidence, storefront evidence, business evidence, production assets, normal-mode inputs, or authoritative geometry truth.",
  ]) {
    if (!note.includes(snippet)) failures.push(`Missing review note snippet: ${snippet}`);
  }

  const lowerCombinedText = `${JSON.stringify(audit)}\n${note}`.toLowerCase();
  for (const phrase of forbiddenPromotionPhrases) {
    if (lowerCombinedText.includes(phrase) && !phrase.startsWith("source data was")) {
      failures.push(`Forbidden promotion phrase appears: ${phrase}`);
    }
  }

  if (failures.length > 0) {
    console.error(`4G-A geometry source audit verification failed:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${auditPath}: 4G-A geometry lane is review-only, geometry-only, and non-promotional`);
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
