# Phase 4O-17 QA Scaffold Preview Legibility Report

Status: QA scaffold preview legibility pass complete; ready for Batu QA-only visual review, not ready for normal mode, public UI, production, source promotion, or claim promotion.

Browser inspection completed in QA mode and normal mode.

Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.

## Scope

4O-17 improves only the visible QA scaffold preview created in 4O-15. The preview remains driven by the 4O-14 adapter and still traces to the 4O-10 scaffold candidates.

Visual/readout changes:

- Added QA-only display labels for `4O container`, `4O ground`, and `4O height`.
- Added QA-only scaffold outline/tether roles so the six records are easier to separate from corridor facade cues.
- Increased scaffold placeholder opacity and contrast while keeping the forms generic.
- Added QA panel family counts: 2 container / 2 ground / 2 height.
- Added a QA-only inspector section for 4O scaffold preview records and selected-object traces.
- Added adapter legibility metadata for family chip, label visibility, outline visibility, and hover/readout behavior.

## Browser Inspection

QA mode:

- The six scaffold preview records are visible as labeled generic placeholders.
- Candidate grouping is clearer: `4O container`, `4O ground`, and `4O height` labels are visible in the scene.
- The QA panel reports `4O scaffold: 6 QA placeholders / 0 normal`.
- The QA panel reports `4O families: 2 container / 2 ground / 2 height`.

Normal mode:

- Normal mode remains protected.
- The QA button was off after inspection.
- The review panel reported `4O scaffold preview: QA off`.
- 4O scaffold labels/tethers/outlines were not visible in normal mode.

## Counts

| Metric | Count |
| --- | ---: |
| 4O-10 scaffold candidates | 6 |
| 4O-14 QA preview records | 6 |
| QA-visible scaffold labels | 6 |
| QA-visible scaffold outline/tether family | 1 |
| Building/container records | 2 |
| Grounding records | 2 |
| Height/massing records | 2 |
| Normal-mode scaffold records | 0 |
| Public interfaces | 0 |
| Module boundary changes | 0 |
| Source fetches | 0 |
| Source ingestions | 0 |
| Business links | 0 |
| Exact-claim records | 0 |
| Claim promotions | 0 |

## Preserved Blocks

No external data fetch, download, cache, ingestion, conversion, or render use occurred.

No dependencies, credentials, paid APIs, package/tooling changes, public interfaces, public UI, normal-mode exposure, renderer replacement, or new public module boundaries were added.

No business, tenant, storefront, frontage, facade, sign, entrance, exact address, exact height, exact roof, production, or public claims were added.

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

## Remaining Review Items

- Batu still owns whether the stronger QA labels/outlines are visually acceptable.
- The preview remains approximate and QA-only; it is not a source-backed scaffold.
- Grounding labels remain alignment placeholders, not sidewalk, curb, crosswalk, or pedestrian-realm claims.
- Height labels remain generic massing placeholders, not exact height, floor, roof, setback, or CityGML/3D model claims.
- Facade, storefront, frontage, entrance, sign, tenant, business, active-status, public, and production claims remain out of scope.

## Batu Review Gate

Stop here for Batu review. The recommended review question is whether the QA scaffold preview is now legible enough to judge spatial usefulness, or whether the next correction should focus on camera framing, record placement, or scaffold color hierarchy.
