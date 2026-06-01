# Provenance And QA

Status: Docs-only QA/debug planning / not implementation approval
Date: 2026-06-01
Creative/product/public-interface approval owner: Batu
Execution owner inside approved boundaries: Codex

## Purpose

This document defines Phase 2 provenance, manual override, debug, and QA requirements.

It does not approve app implementation, debug UI implementation, ingestion scripts, generated scene data, mock data, package changes, screenshots, or production QA tooling.

## QA Principle

Phase 2 should make the data-to-scene pipeline inspectable before it tries to scale.

The key question is not whether the scene is pretty. The question is whether each real-world claim, coordinate transform, visual-reference decision, and manual correction can be traced, reviewed, reversed, and counted.

## Required Debug Capabilities

### Source-Data Inspector

Shows source records, original values, normalized values, source URLs/paths, reviewed dates, usage/licensing status, and source-specific notes.

Acceptance read:

- A reviewer can see where each claim came from.
- A reviewer can see what the source does and does not support.

### Geometry Overlay

Shows source geometry, local projected geometry, scene anchors, and stylized scene placement as separate layers.

Acceptance read:

- A reviewer can see where authored scene placement diverges from source geometry.
- Scene coordinates are not presented as real-world truth.

### Business / Address Match Confidence

Shows match status between business identity, address, building, parcel, storefront, and scene target.

Acceptance read:

- Low-confidence or conflicting matches are visible.
- A business is not treated as verified just because it appears near an address.

### Storefront Evidence Panel

Shows frontage, entrance, facade, sign, and visual-reference evidence with usage/licensing status.

Acceptance read:

- Storefront segmentation gaps are visible.
- Image/evidence usage limits are visible.

### Generated / Manual Diff

Shows generated source-derived values separately from manual overrides.

Acceptance read:

- Manual corrections are explicit.
- A reviewer can reverse or reject an override.

### Missing-Data Report

Lists required fields that are absent or unknown.

Acceptance read:

- Unknown values are not silently filled.
- Missing data can block claims or move them to symbolic/context-only treatment.

### Ambiguity Report

Lists source conflicts, low-confidence matches, stale records, uncertain placement, and unresolved usage rights.

Acceptance read:

- Ambiguity is reviewed as a first-class output.

### Override Count By Category

Reports manual overrides by category:

- `critical-data`
- `scene-placement`
- `visual`
- `content`

Acceptance read:

- Override burden can be measured before Phase 3 scale testing.

### Screenshot Regression Expectation

When app behavior is involved, the implementation brief should require screenshot or equivalent review evidence that the manifest path did not unintentionally change the visual output.

Acceptance read:

- Phase 2D can prove app manifest consumption without accidental visual regression.

### Human Approval Checklist

Lists claims or decisions that require Batu approval before use.

Acceptance read:

- Public representation decisions remain Batu-owned.
- Production/public claims remain blocked unless explicitly approved.

## Manual Override Categories

```text
critical-data
scene-placement
visual
content
```

### Critical Data

Use for corrections that affect identity, address, status, parcel/building link, source interpretation, or card eligibility.

Examples:

- Correcting a business-address match.
- Blocking an active-status claim.
- Resolving a source conflict after review.

### Scene Placement

Use for authored placement or transform corrections in stylized scene coordinates.

Examples:

- Moving a scene anchor for readability.
- Compressing a block segment.
- Marking a transit cue symbolic instead of exact.

### Visual

Use for visual-reference or asset-related review decisions.

Examples:

- Marking a facade cue review-only.
- Blocking an image from production use.
- Recording a non-production exception.

### Content

Use for card copy, labels, disclaimers, or visible text claims.

Examples:

- Replacing unsupported copy with neutral copy.
- Adding an unofficial-map disclaimer.
- Removing promotional wording.

## Phase 2 Target Thresholds

```text
critical data overrides: target <= 25%
scene placement overrides: target <= 40%
unprovenanced real-world claims: 0
hidden manual fixes: 0
```

These are review thresholds, not automatic pass/fail rules. If a threshold is exceeded, the Phase 2 report should explain why and recommend proceed, revise, or block before Phase 3.

## Provenance Requirements

Every real-world claim must identify:

- Claim id.
- Claim text or value.
- Claim type.
- Source id.
- Source type.
- Reviewed date.
- Confidence.
- Usage/licensing status, where relevant.
- Manual override id, if modified.
- Approval state.

Every image/evidence item must identify:

- Owner/source.
- URL or local path.
- Captured/published/reviewed date, if known.
- Usage/licensing status.
- Allowed uses.
- Blocked uses.
- Whether it is review-only, restricted, blocked, or production-approved.

## QA Report Requirements

Each manifest QA report should include:

- Unprovenanced real-world claims count.
- Hidden manual fixes count.
- Override counts by category.
- Missing-data list.
- Ambiguity list.
- Blocked claims list.
- Human approval checklist.
- Screenshot regression status where app behavior is involved.
- Proceed/revise/blocked verdict.

## Human Review Loop

1. Inspect source records.
2. Inspect normalized records.
3. Inspect geometry/place/business/storefront confidence.
4. Inspect scene anchors and stylized placement.
5. Inspect visual-reference evidence and usage status.
6. Inspect generated/manual diff.
7. Approve, reject, revise, omit, or downgrade claims.
8. Record override counts and unresolved ambiguity.
9. Produce proceed/revise/blocked verdict.

## Stop Conditions

Stop before implementation or scale testing if:

- Any visible real-world claim lacks provenance.
- Any manual fix is hidden.
- Restricted imagery is treated as production input.
- Generated records and manual overrides are collapsed.
- Scene coordinates are treated as real-world truth.
- Source conflicts are silently resolved.
- Critical-data or scene-placement override rates suggest the method cannot scale without a Batu review.
