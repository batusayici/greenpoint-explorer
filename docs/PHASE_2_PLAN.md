# Phase 2 Plan

Status: Docs-only planning / not implementation approval
Date: 2026-06-01
Phase name: Data-Driven Scene MVP
Creative/product/public-interface approval owner: Batu
Execution owner inside approved boundaries: Codex

## Purpose

Phase 2 turns the mostly manually-authored MVP scene into the first data-driven product prototype.

Phase 2 is not a visual-generation phase. It is a data-to-scene architecture proof. It succeeds when the existing MVP scene can be represented and eventually regenerated from a traceable scene manifest.

## Goal

```text
existing manually-authored MVP scene
-> canonical scene manifest
-> app consumes manifest
-> open-data ingestion can later generate/update manifest
-> debug/provenance/override loop validates correctness
```

## Guardrails

- No automated stylized scene generation in Phase 2.
- No full-neighborhood expansion in Phase 2.
- No hidden manual corrections.
- No unprovenanced real-world claims.
- No production/public-release data claims.
- No raster or visual revisions unless a later brief explicitly opens that scope.
- No app/source refactor until a later Phase 2 implementation brief explicitly opens it.
- LiveXYZ is preferred pending access, but Phase 2 starts open-data-first.
- Generated truth and manual overrides must remain separate.

## Active Scene Baseline

The current durable active scene/place set remains:

- Grillpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

MVP-29E remains complete for Batu review and is not reopened by this Phase 2 planning packet.

## Task Sequence

### Phase 2A - Architecture / Source-Of-Truth Setup

Goal:

- Establish the docs-first architecture, manifest, source, provenance, QA, and Phase 3 scale-test planning packet.

Allowed inputs:

- Current governance docs.
- Existing MVP-29E review state.
- Existing architecture/data/source planning docs.
- Existing MVP scope and source-policy constraints.

Expected outputs:

- `docs/PHASE_2_PLAN.md`
- `docs/ARCHITECTURE.md`
- `docs/SCENE_MANIFEST_SCHEMA.md`
- `docs/DATA_SOURCES.md`
- `docs/PROVENANCE_AND_QA.md`
- `docs/PHASE_3_SCALE_TEST_PLAN.md`
- Reconciled control docs.

Acceptance criteria:

- Phase 2 direction, task sequence, non-goals, source hierarchy, manifest v0.1 contract, provenance rules, manual override rules, QA/debug expectations, and Phase 3 scale-test frame are documented.
- The packet does not edit app source, raster assets, generated images, screenshots, package files, lockfiles, ingestion scripts, generated data, or mock data.

Explicit non-goals:

- Implementing the manifest.
- Implementing source adapters.
- Refactoring the app.
- Producing visual assets.
- Reopening MVP-29E.

### Phase 2B - Canonical Scene Manifest v0.1

Goal:

- Turn the planning contract into one approved per-scene manifest boundary for the current MVP scene.

Allowed inputs:

- Phase 2A docs.
- MVP-29E app/data review state.
- Current truth-policy docs.
- Batu-approved field names, statuses, and source categories.

Expected outputs:

- A reviewed manifest v0.1 boundary.
- Required field list and validation expectations.
- Required source/provenance and override fields.
- Decision log or control-doc updates if Batu approves the boundary.

Acceptance criteria:

- The manifest can describe source truth, scene truth, visual-reference truth, manual overrides, and QA state separately.
- Every visible real-world claim has a required provenance path.
- Scene coordinates, local projected coordinates, and WGS84 coordinates remain separate.

Explicit non-goals:

- Creating generated scene data.
- Writing runtime schemas.
- Changing app code.
- Approving production public interfaces.

### Phase 2C - Current MVP Scene Represented As Manifest

Goal:

- Represent the existing MVP scene in a canonical manifest without changing the visual output.

Allowed inputs:

- Approved manifest v0.1 boundary.
- Current MVP-29E scene data and review packet.
- Existing source-backed place/card records.
- Manual notes for unresolved fields.

Expected outputs:

- One review-only current-scene manifest.
- Explicit manual overrides for any authored placement, visual, content, or critical-data correction.
- Missing-data and ambiguity reports.

Acceptance criteria:

- The active scene/place set is represented.
- The manifest preserves uncertainty instead of filling gaps silently.
- Manual corrections are categorized, reversible, counted, and source-linked.

Explicit non-goals:

- Source ingestion.
- App refactor.
- Visual change.
- Full Greenpoint or corridor coverage.

### Phase 2D - App Reads Manifest With Unchanged Visual Output

Goal:

- Make the existing app consume the manifest while preserving current MVP visual and interaction behavior.

Allowed inputs:

- Approved current-scene manifest.
- Approved implementation brief and file allowlist.
- Existing MVP app behavior and screenshots as regression references.

Expected outputs:

- App reads the manifest for scene/card/target data.
- Visual output remains unchanged unless Batu explicitly approves a difference.
- Basic regression evidence records no unintended behavior change.

Acceptance criteria:

- The existing scene loads.
- Cards, targets, hotspots, and truth labels match the manifest.
- No production data claims are introduced.
- Any runtime interface boundary is documented and approved before implementation.

Explicit non-goals:

- Renderer replacement.
- Raster revision.
- New visual generation.
- New ingestion scripts.
- Broad app architecture expansion.

### Phase 2E - Provenance / Debug Inspector

Goal:

- Make source truth, scene truth, and manual overrides inspectable enough for human review.

Allowed inputs:

- Manifest v0.1.
- Current-scene manifest.
- Provenance/QA requirements.
- Approved implementation brief.

Expected outputs:

- Review/debug view or equivalent artifact showing source data, geometry alignment, confidence, evidence, overrides, missing data, and ambiguity.
- Human approval checklist.

Acceptance criteria:

- A reviewer can identify why each real-world claim is shown.
- A reviewer can see which values are generated, manually overridden, missing, ambiguous, or blocked.
- Override counts by category are visible.

Explicit non-goals:

- Public admin/CMS.
- Business submissions.
- Live updates.
- Production moderation workflows.

### Phase 2F - Open-Data Ingestion Spike

Goal:

- Test whether open/public/manual sources can generate useful normalized records for the current scene.

Allowed inputs:

- NYC open data or official public records.
- OSM as supplemental context with attribution considerations.
- Manual/team evidence.
- LiveXYZ only if access and usage boundaries are approved.

Expected outputs:

- Review-only normalized records for the current scene.
- Source coverage report.
- Match/conflict report.
- Missing-data report.

Acceptance criteria:

- Source records are traceable to provenance.
- Generated records remain separate from manual overrides.
- Critical gaps and conflicts are visible.

Explicit non-goals:

- Full ingestion pipeline.
- Live refresh.
- Scraping.
- Production storefront-unit database.
- Public release.

### Phase 2G - Geometry Mapping Spike

Goal:

- Test mapping between real-world coordinates, local projected geometry, and stylized scene coordinates.

Allowed inputs:

- Normalized geometry records.
- Current MVP scene composition.
- Manual alignment notes.
- Approved transform rules.

Expected outputs:

- Scene transform notes.
- Geometry overlay/debug evidence.
- Manual scene-placement override list.
- Regeneration-stability notes.

Acceptance criteria:

- Coordinate layers remain separate.
- The transform explains how source geometry maps to stylized scene placement.
- Scene placement overrides are counted and reversible.

Explicit non-goals:

- Exact GIS map rendering.
- Exact storefront frontage/order claims.
- Exact station geometry claims.
- Automated stylized art generation.

### Phase 2H - Manual Override / QA Loop

Goal:

- Prove that human review can correct or block generated records without hiding the corrections.

Allowed inputs:

- Manifest.
- Generated source records.
- Manual review notes.
- Debug/provenance inspector.
- QA thresholds.

Expected outputs:

- Override workflow.
- Override counts by category.
- Human approval checklist.
- Screenshot regression expectation where app behavior is involved.
- Phase 2 proceed/revise/cut recommendation.

Acceptance criteria:

- Critical data overrides target is <= 25%.
- Scene placement overrides target is <= 40%.
- Unprovenanced real-world claims count is 0.
- Hidden manual fixes count is 0.
- Remaining ambiguity is reported, not buried.

Explicit non-goals:

- Production approval.
- Neighborhood expansion.
- CMS/admin/business submissions.
- Monetization or user-facing moderation.

## Phase 2 Exit Read

Phase 2 is successful if the current MVP scene can be:

- Expressed as a canonical manifest.
- Consumed by the app without unintended visual change.
- Partially generated or updated from traceable source records.
- Reviewed through debug/provenance tools.
- Corrected through explicit manual overrides.
- Measured well enough to decide whether Phase 3 scale validation is worth opening.

Phase 2 is not successful if the scene only works through hidden hand-edits, untraceable claims, collapsed coordinate systems, unreviewed imagery, or manual corrections that cannot be counted and reversed.
