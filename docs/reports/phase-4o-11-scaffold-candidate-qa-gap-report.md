# Phase 4O-11 Scaffold Candidate QA Gap Report

Status: QA-only non-rendering gap/coverage report complete; candidate set is not ready for QA-only preview or runtime rendering.
Date: 2026-06-08
Scope: Greenpoint Ave from Manhattan Ave to Franklin Ave

## Purpose

This report evaluates the 4O-10 scaffold-candidate records for coverage, missing fields, blocked claims, provenance continuity, and QA-preview readiness.

Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.

## Source Fixture

- Source fixture: `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json`
- Fixture ID: `p4o10-scaffold-candidates-greenpoint-ave-manhattan-to-franklin`
- Fixture status: `scaffold_candidate_records_test_only_no_source_access`
- Candidate readiness: `ready_for_qa_gap_report_not_ready_for_render`
- Runtime use: `blocked_no_runtime_consumer`
- Normal-mode exposure: `blocked`
- Production use: `blocked`
- Public interface policy: `blocked_no_public_interface`

## Candidate Counts By Family

| Candidate family | Count |
| --- | ---: |
| `scaffold_building_container_candidate` | 2 |
| `scaffold_grounding_candidate` | 2 |
| `scaffold_height_massing_candidate` | 2 |
| Total scaffold candidates | 6 |
| Runtime consumers | 0 |
| Public interfaces | 0 |
| Module boundary changes | 0 |
| Source fetches | 0 |
| Source ingestions | 0 |
| Claim promotions | 0 |
| Render integrations | 0 |

## Missing / Blocked Fields

| Area | Missing or blocked field | Status | Effect |
| --- | --- | --- | --- |
| Building/container candidates | coordinates / source geometry | `symbolic_no_coordinates` | Not ready for QA-only preview placement. |
| Building/container candidates | real source record | `offline_fixture_placeholder_no_source_record_loaded` | Source-lane provenance exists, but no source-backed geometry is loaded. |
| Grounding candidates | street/sidewalk/curb coordinates | `symbolic_no_coordinates` | Grounding cannot be aligned to the existing QA corridor render yet. |
| Grounding candidates | grounding alignment | `blocked_pending_future_render_reconnection_check` | Requires 4O-12 reconnection boundary before render integration. |
| Height/massing candidates | height value | `null` | Height interpretation is not preview-ready. |
| Height/massing candidates | floor-count fallback | `null` | Massing fallback is not preview-ready. |
| Height/massing candidates | roof status | `blocked_not_verified` | Roof interpretation remains blocked. |
| All candidates | render integration | `blocked_no_runtime_consumer` | No runtime rendering or public UI exists. |
| All candidates | exact business/sign/entrance/facade/frontage/address claims | blocked claims below | No claim promotion is allowed. |

## Claim Status Coverage

| Claim label | Candidate coverage |
| --- | ---: |
| `review_only` | 6 / 6 |
| `qa_only` | 6 / 6 |
| `offline_fixture_test_only` | 6 / 6 |
| `not_verified` | 6 / 6 |
| `not_source_accessed` | 6 / 6 |
| `candidate_only` | 6 / 6 |
| `no_claim_promotion` | 6 / 6 |

## Source-Lane / Provenance Coverage

| Source lane | Candidate count | 4O-8 derivation | 4O-7 provenance | 4O-6 provenance | Source records loaded |
| --- | ---: | ---: | ---: | ---: | ---: |
| `building_container` | 2 | 2 / 2 | 2 / 2 | 2 / 2 | 0 |
| `street_sidewalk_curb_grounding` | 2 | 2 / 2 | 2 / 2 | 2 / 2 | 0 |
| `height_massing` | 2 | 2 / 2 | 2 / 2 | 2 / 2 | 0 |
| Total | 6 | 6 / 6 | 6 / 6 | 6 / 6 | 0 |

## QA-Only Preview Readiness

Readiness: not ready for QA-only preview.

Reason:

- Candidate records are deterministic and reviewable, but they contain symbolic geometry only.
- Grounding alignment is blocked pending a reconnection boundary with the existing QA corridor render.
- Height/massing interpretation is blocked by null height/floor fields and unverified roof status.
- Every candidate remains `not_source_accessed`, `not_verified`, `candidate_only`, and `no_claim_promotion`.
- Runtime rendering, public UI, normal-mode exposure, and render integration remain blocked.

## Blocked Claim Boundary

- `no_business_claim`
- `no_tenant_claim`
- `no_storefront_claim`
- `no_frontage_promotion`
- `no_exact_facade_claim`
- `no_entrance_claim`
- `no_signage_claim`
- `no_active_status_claim`
- `no_exact_address_claim`
- `no_exact_height_claim`
- `no_exact_roof_claim`
- `no_production_claim`
- `no_public_claim`

## Boundary Confirmation

- No external data fetch, download, cache, ingestion, conversion, or render use.
- No runtime rendering, 3D rendering, public UI, runtime scene integration, or normal-mode exposure.
- No dependencies, credentials, paid APIs, package/tooling changes, public interfaces, or module-boundary changes.
- No businesses, signs, entrances, exact facades, tenant frontage, exact addresses, active status, production claims, public claims, or claim promotion.
- The report is QA-only and non-rendering; it is not a scaffold manifest and not a runtime/public interface.
