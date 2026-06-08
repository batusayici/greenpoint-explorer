# Phase 4I-1 Corridor Facade Cue Expansion Plan

Status: Review-only implementation plan
Date: 2026-06-08
Scope: QA-only facade cue expansion for Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Purpose

4I expands the existing endpoint-only QA facade cue proof toward corridor coverage without promoting facade, storefront, frontage, entrance, signage, tenant, business, material, active-status, normal-mode, production, or source claims.

The packet uses only existing repo material: the 4E/4F endpoint evidence-informed fixture, the 4C geometry-only facade cue fixture, the 4B semantic scene manifest, and repo-local Batu-supplied evidence already indexed by prior approved fixtures.

## Public Interface And Module Boundary

4I-1 changes no public interfaces and no module boundaries.

4I-2 should add a separate QA-only fixture and verifier. It should not alter runtime behavior.

4I-3 may add an internal runtime import/consumer for the 4I-2 fixture inside the existing React + Vite + Three.js preview. This is a QA-only internal consumer, not a public interface or renderer change.

## Record Lanes

Endpoint evidence-backed records:

- Source from the existing 4E/4F evidence-informed endpoint records.
- Preserve `manual_draft`, `evidence_informed`, `qa_only`, and `not_verified` labels.
- Keep existing repo-local Batu-supplied evidence references.
- May render as the most legible QA facade volumes in 4I-3.
- Must not become authoritative geometry associations, storefront anchors, business links, exact frontage/entrance/signage/material claims, normal-mode records, or production assets.

Mid-corridor insufficient-evidence records:

- Source from existing 4C geometry-only cue records and 4B stable scene IDs only.
- Use statuses such as `insufficient_evidence`, `manual_draft`, `qa_only`, and `not_verified`.
- May show facade rhythm, massing, streetwall relation, depth/setback tier, bay-placeholder cadence, and evidence/provenance visibility as review scaffolding.
- Must not use photo-derived cues, external source data, business records, exact storefront/frontage/entrance/address/signage/tenant claims, or material/color truth.

Blocked/no-evidence gaps:

- Source from geometry cue records that are unsuitable for corridor facade placeholders because they are too narrow, blocked by geometry confidence, missing a usable street-facing plane, or outside the corridor rhythm selection.
- Use statuses such as `blocked_no_evidence` or `blocked_geometry_unsuitable`.
- Must remain visible in QA/review summaries so absence of evidence is not hidden.

## 4I-2 Fixture Boundary

4I-2 should create:

- `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json`
- `scripts/verify-phase-4i-corridor-facade-cues.mjs`
- `docs/phase-4i-corridor-facade-cue-expansion.md`

Fixture requirements:

- Top-level `reviewOnly: true`, `qaOnly: true`, `normalModeExposure: "blocked"`, and `productionUsePolicy: "blocked"`.
- Deterministic record IDs derived from target semantic IDs and lane/status.
- Stable target fields: `targetSemanticId`, `targetSourceRecordId`, `targetGeometryReferenceId`, and `targetGeometryContainerId`.
- Explicit source/provenance fields that reference existing fixture paths only.
- Separate `recordLane` values for `endpoint_evidence_backed`, `mid_corridor_insufficient_evidence`, and `blocked_no_evidence_gap`.
- Status labels that include `qa_only` and either `evidence_informed`, `manual_draft`, `insufficient_evidence`, or `blocked_no_evidence`.
- Allowed cue families limited to facade rhythm, massing, streetwall relation, depth/setback tiers, bay placeholders, corner returns, and blocked-claim readouts.
- Blocked claim lists preserving business identity, active status, storefront anchor, tenant frontage, exact frontage/order, exact entrance, exact address, exact signage, material/color truth, production, normal-mode, and public/product claims.
- Summary counts for endpoint evidence-backed, mid-corridor insufficient-evidence, blocked/no-evidence, normal-mode, production, business-linkage, exact-claim, and source-access records.

Verifier requirements:

- Fixture is review-only, QA-only, and blocked from normal/product mode.
- No external source URLs, image URLs, downloaded/cached imagery, textures, training inputs, source-derived render inputs, business fields, exact claim fields, or source promotion fields appear.
- Every rendered or candidate record resolves to the 4B manifest and 4C geometry cue fixture.
- Endpoint records preserve existing 4E/4F evidence refs and remain manual-draft/evidence-informed.
- Mid-corridor records have no source evidence refs beyond existing geometry cue/manifest paths and must be `insufficient_evidence` or `manual_draft`.
- Blocked/no-evidence gaps are counted and include block reasons.
- IDs are unique and deterministic.

## 4I-3 Runtime Boundary

4I-3 may touch:

- `src/Phase4BRuntimePreview.jsx`
- Styling only if needed in the existing runtime stylesheet.
- The 4I fixture/verifier and concise docs/control-doc reconciliation.

Runtime requirements:

- QA mode only.
- Normal mode visually and behaviorally unchanged.
- Endpoint evidence-backed cues remain more opaque and visually primary.
- Mid-corridor insufficient-evidence records render as subdued placeholders or low-confidence streetwall rhythm, not as factual facade evidence.
- Blocked/no-evidence gaps are visible in QA summaries/labels but should not create facade volume claims.
- Inspector/readout must expose lane, status, provenance path, and blocked claims.

## Verification Plan

4I-1:

- Run the 4I-1 plan verifier.
- Run relevant 4H/4G source-policy verifiers.
- Run `git diff --check`.

4I-2:

- Run the new 4I corridor fixture verifier.
- Run existing 4E/4F facade cue verifiers.
- Run relevant 4H/4G source-policy verifiers.
- Run `git diff --check`.

4I-3:

- Run the 4I corridor fixture verifier.
- Run existing 4E/4F facade cue verifiers.
- Run build.
- Run browser/screenshot QA if feasible.
- Run `git diff --check`.

## Reserved Decisions

Batu retains all decisions about source promotion, evidence approval, claim promotion, business linkage, exact storefront/frontage/entrance/address/signage/tenant claims, normal/product exposure, production assets, visual-system/art-direction translation, 4J/4K/4M opening, dependencies, APIs, credentials, renderer changes, and final 4I packet acceptance.
