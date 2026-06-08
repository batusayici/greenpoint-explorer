# Phase 4O-16 QA Scaffold Preview Report

Status: QA scaffold preview reconnection report complete; ready for Batu QA-only preview review, not ready for normal mode, public UI, production, source promotion, or claim promotion.

Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.

## Scope

4O-13 mapped every 4O-10 scaffold candidate to an existing QA render anchor. 4O-14 converted those mappings into QA-only adapter records. 4O-15 connected the adapter to `src/Phase4BRuntimePreview.jsx` as a generic QA scaffold preview layer.

The preview uses only existing runtime objects and guide geometry:

- Building/container candidates render as translucent container shells.
- Grounding/street/sidewalk/curb candidates render as low alignment bands on the existing runtime guide.
- Height/massing candidates render as generic cap markers on existing massing objects.

No external data fetch, download, cache, ingestion, conversion, or render use occurred. No dependencies, credentials, paid APIs, package/tooling changes, public interfaces, public UI, normal-mode exposure, or new public module boundaries were added.

## Counts

| Metric | Count |
| --- | ---: |
| 4O-10 scaffold candidates | 6 |
| 4O-13 mapped candidates | 6 |
| 4O-14 QA preview records | 6 |
| 4O-15 QA-rendered placeholders | 6 |
| Normal-mode records | 0 |
| Public interfaces | 0 |
| Module boundary changes | 0 |
| Source fetches | 0 |
| Source ingestions | 0 |
| Business links | 0 |
| Exact-claim records | 0 |
| Claim promotions | 0 |

## Family Coverage

| Candidate family | 4O-10 candidates | 4O-13 mappings | 4O-14 QA preview records |
| --- | ---: | ---: | ---: |
| `scaffold_building_container_candidate` | 2 | 2 | 2 |
| `scaffold_grounding_candidate` | 2 | 2 | 2 |
| `scaffold_height_massing_candidate` | 2 | 2 | 2 |

## Traceability

| 4O-10 candidate | 4O-13 mapping | 4O-14 preview record | Existing QA anchor |
| --- | --- | --- | --- |
| `p4o10-candidate-building-container-manhattan-corner-north` | `p4o13-map-building-container-manhattan-corner-north` | `p4o14-qa-scaffold-building-container-manhattan-corner-north` | `p4b-object-nyc-footprint-bin-3400032` |
| `p4o10-candidate-building-container-mid-corridor-south` | `p4o13-map-building-container-mid-corridor-south` | `p4o14-qa-scaffold-building-container-mid-corridor-south` | `p4b-object-nyc-footprint-bin-3393885` |
| `p4o10-candidate-grounding-manhattan-intersection` | `p4o13-map-grounding-manhattan-intersection` | `p4o14-qa-scaffold-grounding-manhattan-intersection` | `p4b-object-nyc-centerline-physicalid-47237` |
| `p4o10-candidate-grounding-mid-corridor-sidewalk-south` | `p4o13-map-grounding-mid-corridor-sidewalk-south` | `p4o14-qa-scaffold-grounding-mid-corridor-sidewalk-south` | `p4b-object-nyc-centerline-physicalid-47237` |
| `p4o10-candidate-height-massing-manhattan-corner-north` | `p4o13-map-height-massing-manhattan-corner-north` | `p4o14-qa-scaffold-height-massing-manhattan-corner-north` | `p4b-object-nyc-footprint-bin-3400032` |
| `p4o10-candidate-height-massing-mid-corridor-south` | `p4o13-map-height-massing-mid-corridor-south` | `p4o14-qa-scaffold-height-massing-mid-corridor-south` | `p4b-object-nyc-footprint-bin-3393885` |

## Readiness

Readiness: ready for QA-only preview review.

Not ready for normal mode, public UI, public claims, production claims, source-backed scaffold claims, exact geometry claims, exact height claims, exact roof claims, exact address claims, facade claims, storefront claims, frontage claims, entrance claims, signage claims, tenant claims, business claims, or active-status claims.

The QA-only preview is useful because it proves the 4O candidate path can reconnect to the existing QA corridor render without creating a parallel disconnected scaffold universe. It also makes the spatial scaffold candidates visible enough for Batu to judge whether the current container, grounding, and massing placeholders are worth advancing.

## Normal-Mode Isolation

The runtime import is `qaScaffoldPreviewAdapter`, and rendered records use the `qaScaffoldPreview` state role. Runtime visibility is gated by `qaEnabled`; normal mode keeps the layer invisible. The adapter summary reports `normalModeRecordCount: 0`.

## Preserved Blocks

The following remain blocked:

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

## Remaining Gaps

- Source records are still offline/test-only and not source-accessed.
- The preview uses existing normalized runtime scene units, not survey-grade or public geometry.
- Grounding bands are QA alignment placeholders, not sidewalk, curb, crosswalk, or pedestrian-realm claims.
- Height/massing caps are generic interpretation placeholders, not exact heights, floors, roofs, setbacks, or CityGML/3D model claims.
- Facade recognizability remains second-order; no facade, storefront, frontage, entrance, sign, tenant, business, or active-status evidence is connected.

## Batu Review Gate

Stop here for Batu review. The recommended next decision is whether to accept the QA-only scaffold preview reconnection and open a larger spatial recognizability packet, or request correction to the container, grounding, or height/massing placeholder behavior before any later scaffold expansion.
