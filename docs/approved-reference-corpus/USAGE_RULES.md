# Approved Reference Corpus Usage Rules

Status: Active visual-reference rules  
Date: 2026-05-28

## Core Rule

Batch 12+ approved raster outputs are protected canonical references. They are not final production assets, but they are the source of truth for future visual alignment.

Future prompts, prototype reviews, UI refinements, and visual assetization briefs must reference this corpus instead of relying on memory, prose summaries, or scattered historical folders.

## What The Corpus Does Approve

- Inked Indie / Compact Corner as the approved visual direction.
- Fictional-safe storefront identity as the approved visual-direction approach.
- Integrated paper/card UI direction as an approved visual-direction approach.
- Phase 4.5 as supporting evidence that the direction appears promising as a small-scale reusable storefront system.

## What The Corpus Does Not Approve

- Production assets.
- Production asset direction.
- A production asset pipeline.
- Final UI implementation.
- App/source changes.
- Public interfaces or module boundaries.
- Real Greenpoint business data.
- Exact addresses.
- Exact facades.
- Exact station geometry.
- Factual place-card copy.
- Live data, backend services, CMS, persistence, analytics, routing, CI, deployment, or broad map coverage.

## Product-Facing UI Alignment

Future normal-mode UI, markers, cards, tethers, overlays, and place-index patterns should align with the canonical references unless a later explicit decision supersedes them.

Use Phase 4 and Phase 4.5 UI references for:

- Paper/card integration with the world.
- Selected marker hierarchy.
- Tether or connector behavior.
- Selected/hover building treatment.
- Compact product-facing controls and place-card rhythm.

Do not treat review labels, proof captions, QA notes, or placeholder card blocks as final product copy or public UI text.

## QA-Mode Separation

Phase 5.2 beige QA-harness styling is rejected as product-facing UI direction.

Review-only QA UI must remain visually separate from normal product-facing UI. QA overlays may help review hit regions, labels, debug state, or test paths, but they must not become the visual model for product-facing markers, cards, tethers, overlays, or place-index patterns.

## Drift Flags

Flag any future output that drifts toward:

- Generic beige paper UI.
- Phase 5.2 QA-harness styling as normal UI.
- SVG-grade diagrams or low-fidelity wireframes as visual proof.
- Flat vector icon sheets detached from the raster world.
- Generic cozy-game storefront art.
- Generic fantasy village or toy-town art.
- Real Greenpoint factual map claims without source verification.
- Prose-only planning when decision-grade raster evidence is required.

## Prompting Rule

Future visual prompts must cite specific corpus entries by path or canonical id.

Example:

> Use ARC-023, ARC-024, ARC-027, and ARC-029 as visual source-of-truth references. Preserve Inked Indie linework, controlled hatching, muted warm palette, fictional-safe abstract glyph signage, compact isometric map-mode composition, and integrated paper/card UI treatment. Do not drift toward Phase 5.2 beige QA styling or SVG-grade diagrams.

## Conflict Rule

If future work conflicts with this corpus, do not silently reinterpret the approved direction. Call out the conflict and preserve it as a Batu/ChatGPT review item.
