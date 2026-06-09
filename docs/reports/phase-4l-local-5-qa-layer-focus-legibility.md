# Phase 4L-Local-5 QA Layer Focus + Label-Density Legibility

Status: complete; stop for Batu review.

## Goal

Make the existing 4L local evidence QA output easier to inspect by separating the 4L evidence layer from competing QA labels.

## What Changed

- Added an `All QA` / `4L Focus` control beside the existing QA toggle.
- In `4L Focus`, the runtime preserves the 4L local evidence cue layer and existing evidence facade context.
- In `4L Focus`, competing 4O scaffold, 4J frontage candidate, 4K recognizable anchor, corridor cue, synthetic grounding, and candidate POI QA overlays are suppressed.
- Normal mode remains unchanged.

## Visual Usefulness

The 4L endpoint evidence cues are now easier to inspect because the view no longer stacks 4O height labels, 4J candidate labels, and 4K cue labels over the same endpoint corners. This does not increase factual fidelity; it improves visual review fidelity for the existing QA evidence layer.

## Preserved Boundaries

- No evidence files were added.
- No external sources were accessed.
- No Mapillary/KartaView work was opened.
- No downloads, cache, ingestion, or conversion occurred.
- No business, tenant, sign, logo, POI, active-status, or source-record linkage was introduced.
- No QA cue was promoted to a factual, production, public, or normal-mode claim.
- No normal-mode exposure was added.

## Review Gate

Ready for Batu to review whether the 4L local evidence scene is legible enough for the next decision. The next step remains a Batu decision: either request more repo-local visual refinement, supply more repo-local mid-corridor evidence, or open a later source-use gate for external street-level imagery.
