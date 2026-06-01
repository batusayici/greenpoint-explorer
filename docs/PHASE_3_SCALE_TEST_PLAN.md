# Phase 3 Scale Test Plan

Status: High-level future planning / not implementation approval
Date: 2026-06-01
Phase name: Neighborhood Scale Validation
Creative/product/public-interface approval owner: Batu
Execution owner inside approved boundaries: Codex

## Purpose

Phase 3 tests whether the Phase 2 manifest pipeline works across representative Greenpoint blocks.

Phase 3 is future-only. It does not open full Greenpoint coverage, app expansion, automated visual stylization, live refresh, CMS/admin tooling, deployment, monetization, or production data work.

## Goal

```text
test whether the Phase 2 manifest pipeline works across representative Greenpoint blocks
```

## Entry Criteria

Phase 3 should open only after Phase 2 demonstrates that the current MVP scene can be:

- Represented as a canonical manifest.
- Consumed by the app without unintended visual regression.
- Partially generated or updated from traceable source records.
- Reviewed through provenance/debug tooling.
- Corrected through explicit manual overrides.
- Measured against override and provenance thresholds.

## Representative Block Types

- Manhattan Ave retail corridor.
- Franklin Ave retail/creative corridor.
- Residential side street.
- Mixed industrial edge.
- Waterfront/new development edge.
- Transit-adjacent block.
- Dense storefront row.
- Sparse storefront block.
- Stale/changed-business block.
- Awkward geometry block.

## Metrics

- Match rate.
- Storefront confidence.
- Imagery/evidence coverage.
- Critical override rate.
- Review time per storefront.
- Regeneration stability.
- Cost per block.
- Visual consistency.
- QA burden.

## Suggested Scale-Test Shape

Phase 3 should remain a validation test, not a product expansion.

Possible bounded shape:

- Select 6-10 representative blocks.
- Generate or assemble manifest records for each block.
- Measure source coverage and confidence.
- Count manual overrides by category.
- Record review time and blocker types.
- Compare scene transform stability across block shapes.
- Identify which blocks are viable, expensive, ambiguous, or blocked.

## Explicit Deferrals

- Full Greenpoint coverage.
- Seamless tiling.
- Automated visual stylization.
- CMS/admin/business submissions.
- Live refresh/update infra.
- Monetization features.
- Production public map.
- Production asset pipeline.
- Business opt-in flow.
- User submissions.
- Deployment or analytics.

## Phase 3 Exit Read

Phase 3 should answer:

- Which block types can the Phase 2 manifest pipeline handle cleanly?
- Which block types require too much manual correction?
- Which source gaps dominate review time?
- Whether storefront segmentation is tractable.
- Whether visual consistency can be maintained without automated stylized generation.
- Whether the project should proceed to a production architecture gate, revise the data approach, or stay hand-authored for longer.

Phase 3 should not claim production readiness by default. It is a scale validation gate for Batu review.
