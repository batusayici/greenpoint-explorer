# Phase 4O-12 Existing QA Render Reconnection Boundary

Status: Boundary contract complete; no runtime rendering, public UI, normal-mode exposure, or claim promotion.
Date: 2026-06-08
Scope: Greenpoint Ave from Manhattan Ave to Franklin Ave

## Purpose

This contract defines how the 4O scaffold-candidate path must later compare against or feed the existing QA corridor render without creating a parallel, disconnected scaffold universe.

Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.

## Existing Runtime Anchor

Future QA render integration must reconnect to the existing runtime/review surface:

- Runtime shell: `src/Phase4BRuntimePreview.jsx`
- Existing semantic scene manifest: `src/data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json`
- Existing QA corridor facade cue fixture: `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json`
- New scaffold candidate fixture: `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json`
- New scaffold candidate gap report: `docs/reports/phase-4o-11-scaffold-candidate-qa-gap-report.md`

The 4O path may later become a QA-only input to this existing review surface only after the checks below pass. It must not create a second route, second renderer, second camera model, separate object identity space, or disconnected corridor coordinate universe.

## Reconnection Rule

The 4O scaffold-candidate path must reconnect by comparison first, then optional QA-only feed later.

Required order:

1. Compare 4O candidates against the existing QA corridor render boundary.
2. Resolve coordinate, orientation, object ID, grounding, and height/massing compatibility gaps.
3. Preserve all blocked facade/business/frontage/sign/entrance claims.
4. Keep normal mode isolated.
5. Only then may a later Batu-approved batch consider QA-only runtime integration.

## Required Future Checks

| Check | Required before future QA render integration | Current 4O-12 status |
| --- | --- | --- |
| Coordinate/orientation compatibility | Confirm 4O candidate coordinates, axis orientation, side-of-street conventions, corridor direction, and Manhattan-to-Franklin / Franklin-to-Manhattan ordering match the existing QA corridor render. | `blocked_pending_future_check` |
| Camera/preset compatibility | Confirm 4O candidate extents work with existing camera presets, including Manhattan-to-Franklin, Franklin-to-Manhattan, overhead, street oblique, street review, Manhattan facade review, and Franklin facade review. | `blocked_pending_future_check` |
| Object ID mapping | Map every 4O candidate to an existing semantic object ID, approved generated-scene manifest object, or explicit unresolved mapping state. | `blocked_pending_future_check` |
| Grounding alignment | Verify street, sidewalk, curb, and candidate building bases align with the existing corridor ground plane and do not float, sink, or cross the wrong side of the street. | `blocked_pending_future_check` |
| Height/massing interpretation | Define how null height values, null floor-count fallbacks, blocked roof status, and symbolic massing convert into QA-only preview geometry without exact height or roof claims. | `blocked_pending_future_check` |
| Blocked facade/business/frontage/sign/entrance claims | Confirm no 4O candidate can create or imply business identity, storefront, frontage, facade, sign, entrance, active-status, tenant, exact-address, exact-height, exact-roof, production, or public claims. | `blocked_and_required` |
| Normal-mode isolation | Confirm any future 4O render feed is QA-only, hidden when QA mode is off, and has zero normal-mode records. | `blocked_and_required` |

## Non-Parallel Universe Guardrail

The 4O scaffold-candidate path must not:

- Add a new runtime renderer.
- Add a new public UI route.
- Add a new camera/preset system.
- Add a new object identity namespace disconnected from the existing semantic scene manifest.
- Add a new coordinate system that cannot be compared to the existing QA corridor render.
- Render outside QA mode.
- Bypass existing QA blocked-claim labels.
- Treat scaffold candidates as production, normal-mode, exact, public, or product-ready records.

If a future integration cannot satisfy these constraints, it must stop as a blocked reconnection rather than creating a separate scaffold universe.

## Future Integration Inputs

Future integration may consider only QA-labeled, status-labeled records from:

- `scaffold_building_container_candidate`
- `scaffold_grounding_candidate`
- `scaffold_height_massing_candidate`

Future integration must continue to treat current 4O candidate geometry as symbolic until a later approved batch supplies compatible coordinates, mappings, grounding, and height/massing interpretation.

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
- This contract is a QA-only reconnection boundary; it is not a scaffold manifest and not a runtime/public interface.
