#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const contractPath = "src/data/facade-evidence-intake/greenpoint-ave-manhattan-to-franklin.phase-4h-1-facade-evidence-intake-workflow-contract.v0.1.json";
const notePath = "docs/phase-4h-1-facade-evidence-intake-workflow-contract.md";

const requiredRecordFields = [
  "evidenceRecordId",
  "sourceCandidate",
  "sourceApprovalStatus",
  "termsReviewStatus",
  "usageRightsStatus",
  "provenance",
  "storageCachePolicy",
  "displayPolicy",
  "claimSupportAllowed",
  "claimSupportBlocked",
  "normalModeExposure",
  "productionUsePolicy",
];
const requiredProvenanceFields = [
  "sourceOwner",
  "sourceSupplier",
  "sourceRecordReference",
  "sourceRecordReferenceStoragePolicy",
  "attributionText",
  "licenseName",
  "accessWasPerformed",
  "imageryWasStored",
  "thumbnailWasStored",
  "fileUrlWasStored",
];
const requiredBlockedClaims = [
  "business_identity_from_imagery",
  "active_business_status",
  "tenant_frontage_assignment",
  "storefront_anchor_approval",
  "exact_frontage_width_or_order",
  "exact_entrance_ownership",
  "exact_sign_text_logo_trade_dress",
  "exact_address_placement",
  "production_asset_generation",
  "normal_mode_rendering",
  "public_product_claims",
];
const requiredReviewStatuses = [
  "source_terms_pending",
  "source_access_blocked",
  "candidate_review_only",
  "manual_review_required",
  "blocked_restricted_source_contamination",
  "eligible_for_batu_review",
  "approved_evidence_backed",
];
const requiredVerifierRequirements = [
  "required_record_fields_present",
  "required_provenance_fields_present",
  "external_storage_cache_display_flags_false_until_later_gate",
  "geometry_confidence_not_used_as_facade_evidence",
  "facade_evidence_not_used_as_business_identity_active_status_or_exact_truth",
  "normal_mode_and_production_blocked",
  "no_real_source_urls_file_urls_thumbnails_downloaded_imagery_cached_imagery_textures_or_training_inputs_in_4h_1",
];
const forbiddenContractPhrases = [
  "source is approved",
  "imagery intake is approved",
  "normal-mode rendering is approved",
  "production use is approved",
  "business linkage is approved",
  "exact storefront claim is approved",
  "real imagery ingested",
  "downloaded imagery is allowed",
  "cached imagery is allowed",
  "source-derived texture is allowed",
  "training input allowed",
];

async function main() {
  const failures = [];
  const contract = JSON.parse(await readFile(resolve(repoRoot, contractPath), "utf8"));
  const note = await readFile(resolve(repoRoot, notePath), "utf8");

  assertEqual(contract.workflowBatch, "4H-1", "workflowBatch", failures);
  assertEqual(contract.reviewOnly, true, "reviewOnly", failures);
  assertEqual(contract.qaOnly, true, "qaOnly", failures);
  assertEqual(contract.normalModeExposure, "blocked", "normalModeExposure", failures);
  assertEqual(contract.realImageryIntakeStatus, "blocked_none_ingested", "realImageryIntakeStatus", failures);
  assertEqual(contract.sourcePromotionStatus, "blocked_candidate_sources_not_approved", "sourcePromotionStatus", failures);

  for (const field of requiredRecordFields) {
    if (!contract.requiredRecordFields.includes(field)) failures.push(`Missing required record field: ${field}`);
  }

  for (const field of requiredProvenanceFields) {
    if (!contract.requiredProvenanceFields.includes(field)) failures.push(`Missing required provenance field: ${field}`);
  }

  for (const claim of requiredBlockedClaims) {
    if (!contract.blockedClaimLevels.includes(claim)) failures.push(`Missing blocked claim level: ${claim}`);
  }

  for (const status of requiredReviewStatuses) {
    if (!contract.allowedReviewStatuses.includes(status)) failures.push(`Missing review status: ${status}`);
  }

  if (!contract.batuOnlyStatuses.includes("approved_evidence_backed")) {
    failures.push("approved_evidence_backed must be Batu-only");
  }

  const externalPolicy = contract.sourcePolicies.find((policy) => policy.sourcePolicyId === "external_candidate_imagery_default");
  if (!externalPolicy) {
    failures.push("Missing external candidate imagery policy");
  } else {
    for (const flag of [
      "imageStorageAllowed",
      "thumbnailStorageAllowed",
      "fileUrlStorageAllowed",
      "metadataStorageAllowed",
      "renderUseAllowed",
      "textureUseAllowed",
      "trainingUseAllowed",
      "normalModeDisplayAllowed",
      "qaDisplayAllowed",
    ]) {
      assertEqual(externalPolicy[flag], false, `external policy ${flag}`, failures);
    }
    for (const blockedUse of ["imagery_access", "api_call", "image_download", "image_cache", "image_ingestion", "normal_mode_exposure", "production_use"]) {
      if (!externalPolicy.blockedUses.includes(blockedUse)) failures.push(`External policy missing blocked use: ${blockedUse}`);
    }
  }

  const template = contract.evidenceRecordTemplate;
  assertEqual(template.evidenceRecordId, "template_only_no_real_evidence", "template id", failures);
  assertEqual(template.sourceAccessStatus, "not_accessed", "template sourceAccessStatus", failures);
  assertEqual(template.provenance.accessWasPerformed, false, "template accessWasPerformed", failures);
  assertEqual(template.provenance.imageryWasStored, false, "template imageryWasStored", failures);
  assertEqual(template.provenance.thumbnailWasStored, false, "template thumbnailWasStored", failures);
  assertEqual(template.provenance.fileUrlWasStored, false, "template fileUrlWasStored", failures);
  assertEqual(template.normalModeExposure, "blocked", "template normalModeExposure", failures);
  assertEqual(template.productionUsePolicy, "blocked", "template productionUsePolicy", failures);

  for (const requirement of requiredVerifierRequirements) {
    if (!contract.verifierRequirements.includes(requirement)) failures.push(`Missing verifier requirement: ${requirement}`);
  }

  for (const snippet of [
    "This contract does not ingest real imagery",
    "External imagery defaults to no download, no cache, no thumbnail storage, no file URL storage, no render use, no extraction, no training, and no production use.",
    "Only Batu may set or authorize `approved_evidence_backed`, and only inside a later approved batch.",
    "4H-1 defines the intake workflow contract only. It does not ingest evidence.",
  ]) {
    if (!note.includes(snippet)) failures.push(`Missing workflow note snippet: ${snippet}`);
  }

  const combinedLower = `${JSON.stringify(contract)}\n${note}`.toLowerCase();
  for (const phrase of forbiddenContractPhrases) {
    if (combinedLower.includes(phrase)) failures.push(`Forbidden contract phrase appears: ${phrase}`);
  }

  if (failures.length > 0) {
    console.error(`4H-1 facade evidence intake workflow verification failed:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Verified ${contractPath}: 4H-1 intake workflow is review-only, source-safe, and non-promotional`);
}

function assertEqual(actual, expected, label, failures) {
  if (actual !== expected) failures.push(`${label} expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
