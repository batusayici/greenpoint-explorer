# MVP-29A Four-Corner MVP Scope Reset

Status: Complete as docs-only scope reset  
Date: 2026-05-31  
Scope: Reframe MVP completion around the full Manhattan Ave x Greenpoint Ave four-corner intersection; no rendering, raster work, source edits, screenshots, app integration, QA/demo freeze, staging, or commit

## Decision Summary

Batu rejects the immediate `MVP-29 QA / Demo Freeze` path because it would continue the old one-corner MVP-22 completion track.

The MVP completion target is now the full Manhattan Ave x Greenpoint Ave four-corner authored diorama, not the accepted one-corner Grillpoint slice.

MVP-22 / MVP-22C remains accepted as a successful one-corner proof. It proves that one evidence-aware Grillpoint card can attach to a raster-first corner plate, but it is not sufficient for MVP completion under the revised four-corner target.

## Why The QA / Demo Freeze Plan Was Rejected

The proposed MVP-29 QA/demo freeze assumed the accepted MVP-22 Grillpoint slice could be evaluated as the MVP completion candidate. Batu changed the target before that QA batch executed.

Under the revised target, a QA/demo freeze before four-corner evidence, reference completeness, composition, raster production/integration boundary, app integration, and screenshot recovery would freeze the wrong shape of product.

## Revised MVP Acceptance Target

The MVP must be one authored, contained four-corner diorama of Manhattan Ave x Greenpoint Ave.

The target remains review/demo scale, not a broad map product, GIS tool, local guide platform, production data pipeline, or public-release build.

The scene must feel recognizable and truth-safe at review/demo scale. It does not need to be survey-perfect, but it must not imply false adjacency, exact frontage, exact facades, exact address placement, or exact station geometry unless evidence supports the claim and Batu approves it.

## Four-Corner Scene Requirements

- Include NW, NE, SW, and SE corner structure.
- Use the already identified active scene candidate set only after validation.
- Treat real storefronts, signs, facades, labels, and cards as evidence-gated.
- Use owned, approved, or non-Google visual references for true-to-life review/demo-scale storefront/sign/facade treatment.
- Place Greenpoint Ave G subway entrances and station cues only where verified.
- Use explicit truth statuses for uncertainty: `verified`, `approximate`, `symbolic`, `context-only`, `omitted`, or `blocked`.
- Preserve the approved Inked Indie / Compact Corner direction while avoiding production asset or exact-geometry claims.

## Required Active Candidate Validation Set

- Greenpoint Deli
- McDonald's
- Dunkin'
- Citizens Bank
- Greenpoint G subway

Real labels and real cards require source-backed validation before inclusion. Any candidate that lacks enough evidence must be treated as approximate, symbolic, context-only, omitted, or blocked rather than silently promoted to a real card or exact visual claim.

## Truth / Fidelity Standard

The four-corner scene should be true-to-life enough for review/demo evaluation: recognizable corner structure, validated real-business treatment where approved, and clear uncertainty handling.

The standard is not GIS/survey precision. The scene may simplify or compress for readability, but it must preserve truthful relationships and avoid unsupported exactness.

## Blocked Work

- Opening MVP-29 QA/demo freeze before the four-corner scene exists.
- Rendering, regenerating raster art, or creating visual assets.
- App source edits, `src/` changes, new targets, card-copy changes, hotspot changes, styling changes, or package/tooling changes.
- Production assets, production asset direction, production asset pipeline, public-release claims, or production readiness claims.
- Live data, scraping, backend, CMS, analytics, deployment, CI, broad map coverage, accounts, persistence, or routing.
- Google/Street View/3D Tiles-derived stored imagery, extraction, tracing, texture reuse, training input, generation input, or facade-reference use.
- Exact facade, exact address placement, exact storefront frontage/order, exact station geometry, or exact subway entrance placement unless evidence supports it and Batu approves.

## Next Phase Sequence

1. `MVP-29B Four-Corner Evidence + Business Validation Packet`
2. `MVP-29C Four-Corner Visual Reference Completeness Gate`
3. `MVP-29D Four-Corner Translation / Composition Brief`
4. `MVP-29E Four-Corner Raster Scene Production / Integration Boundary`
5. `MVP-29F Four-Corner App Integration + Interaction Alignment`
6. `MVP-29G Four-Corner Screenshot QA Recovery`
7. `MVP-30 MVP QA / Demo Freeze`
8. `MVP-31 MVP Completion / Post-MVP Parking`

## Stop Conditions Before Any Implementation

Stop before implementation if the next task would require:

- Source, app, asset, renderer, package, or tooling changes before a later implementation brief opens them.
- New visual production before evidence and reference completeness gates are reviewed.
- Real labels, real cards, storefront/sign/facade treatment, or subway placement without source-backed validation.
- Google/Street View/3D Tiles-derived stored imagery, extraction, tracing, texture reuse, training input, generation input, or facade-reference use.
- Treating MVP-22/MVP-22C as final MVP completion rather than accepted one-corner proof evidence.
- Moving into QA/demo freeze before the full four-corner scene exists.
