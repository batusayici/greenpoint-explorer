# Visual Artifact Standards

Status: Active  
Date: 2026-05-28  
Creative direction owner: Batu  
Implementation owner: Codex

## Purpose

Visual artifacts exist to enable Batu's creative decisions, not to satisfy a deliverable checklist.

An artifact passes only when Batu can make the intended decision from the artifact itself without mentally imagining missing fidelity, storefront detail, UI detail, emotional tone, or composition consequences.

If an artifact does not meet that standard, Codex must revise it before reporting the batch complete.

## Visual Artifact Fidelity Gate

Codex must match artifact format to the decision stage.

SVG, ASCII, and markdown diagrams are acceptable for blockouts, composition planning, system diagrams, and governance review.

High-fidelity visual-direction decisions require raster PNG/JPG artifacts. SVG-only output is invalid for style frames, raster production proofs, final visual-direction candidates, or art-direction approval artifacts unless Batu explicitly requests SVG for that specific task.

Constraint checklist compliance is not enough if the artifact format is wrong.

## Current Evidence Stack

The approved visual direction is still anchored by the Phase 4 fictional-safe storefront identity + UI integration proof, supported by the Phase 4.5 reusable-system scalability proof:

- `docs/visual-artifacts/phase-4-fictional-safe-identity-ui-integration-proof/generated/fictional-safe-street-slice.png`
- `docs/visual-artifacts/phase-4-fictional-safe-identity-ui-integration-proof/generated/integrated-hover-card-pressure.png`
- `docs/visual-artifacts/phase-4-fictional-safe-identity-ui-integration-proof/generated/zoom-readability-identity-crop.png`
- `docs/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/source-storefront-decomposition-board.png`
- `docs/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/recombination-proof-board.png`
- `docs/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/mini-street-slice-scalability-proof.png`
- `docs/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/selected-state-ui-attachment-proof.png`
- `docs/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/zoom-readability-crop.png`

Current verdict:

- Visual direction is approved: Inked Indie / Compact Corner with fictional-safe storefront identity and integrated paper/card UI direction.
- Phase 4 is complete.
- Phase 4.5 makes the reusable storefront system appear promising at small proof scale.
- `docs/approved-reference-corpus/` is the active visual reference source for future visual, prototype, and assetization work.
- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/` is the active review-only repeatable assetization proof for reusable system logic.
- These proofs remain non-production and do not approve production assets, production asset direction, production asset pipeline, implementation, architecture, public interfaces, real-place cards, or production scalability/buildability.
- Main caveats: sign-band repetition, accidental brand-like glyphs, prop repetition, UI weight, generated micro-text, real-place truth, and production burden.

Hard rule:

Technical-art proofs fail if their visual fidelity drops below the latest approved/recovered raster reference for the decision being tested.

If forced to choose between clearer diagramming and maintaining the prior approved/recovered raster fidelity, preserve raster fidelity and communicate structure another way, such as rendered crops, contact sheets, restrained annotations, or companion Markdown. Clarity must not come from flattening the art below the current raster bar.

Prototype translation rule:

Future prototype work must use approved raster/reference assets or extracted/recombined Phase 6 asset-kit logic as its visual basis. SVG, CSS, DOM, canvas, or other code-drawn scene art may support overlays, hit regions, labels, cards, and interaction chrome only when the current brief allows it; it must not replace missing primary world evidence.

## Visual Fidelity Ladder

Use the lowest fidelity that still makes the intended decision visible, but never use a lower artifact class for a higher decision.

| Level | Artifact class | Purpose | Allowed formats | Can support | Cannot support |
| --- | --- | --- | --- | --- | --- |
| Level 0 | Text brief | Frame intent, constraints, unresolved questions, acceptance criteria, and decision options. | Markdown or plain text. | Scope, requirements, critique framing, governance alignment, and approval to make the next artifact. | Visual taste, art-direction approval, composition approval, style-frame approval, production asset approval. |
| Level 1 | Diagram/blockout | Show relationships, categories, rough composition, truth status, spatial logic, or review flow. | SVG, ASCII, markdown diagrams, rough PNG/JPG sketches. | Layout planning, composition discussion, truth/governance review, and choosing what to refine. | Final visual direction, emotional tone, storefront detail, UI styling, style-frame approval, production proof. |
| Level 2 | Style tile/component proof | Test visual ingredients such as palette, line, texture, signage, marker/card treatment, storefront module, or asset handling. | PNG/JPG required for high-fidelity visual proof; SVG allowed only for schematic component diagrams or if Batu explicitly requests SVG. | Narrow art-direction questions about a component, material treatment, or style ingredient. | Whole-scene approval, Phase 3 static style-frame exit, final visual direction, production implementation approval. |
| Level 3 | Static style frame | Prove the whole scene's visual language, emotional volume, storefront rhythm, UI/world integration, local specificity, and screenshot appeal. | High-fidelity raster PNG/JPG. SVG only if Batu explicitly requests SVG, and then it must be labeled as an exception. | Phase 3 visual review, art-direction comparison, and deciding whether the direction can proceed. | App implementation approval by itself, production asset approval, unresolved truth claims, public-interface approval. |
| Level 4 | Production asset/prototype asset | Provide final or near-final assets after visual direction, truth constraints, and implementation boundaries are approved. | PNG/JPG or implementation-native asset formats approved for the production path; SVG only when the approved production asset pipeline calls for it. | Production asset review, prototype asset integration, and implementation-ready visual QA. | Opening blocked gates that have not been separately approved, changing visual direction, or bypassing truth/source review. |

Every visual batch must state its intended fidelity level and required output format before generation. A lower-fidelity artifact may pass only for decisions appropriate to that level.

## Pass / Fail Standard

Pass:

- The artifact answers the review question visually.
- Batu can compare variants without inventing the missing storefront, UI, emotional, or composition details.
- The artifact includes enough fidelity for the decision being requested.
- Truth status, placeholders, symbolic elements, and unresolved geography are visible or clearly labeled.
- Variants test materially different choices, tradeoffs, or hypotheses.

Fail:

- The file exists but the intended decision still depends on imagination.
- Variants differ mainly by palette, labels, decoration, or small styling changes.
- The artifact hides weak composition behind prose explanation.
- Truth constraints are technically labeled but the visual still reads as generic, empty, or unresolved.
- Codex reports completion without self-auditing whether the artifact is decision-useful.

## Variant Rules

Variants must differ in at least one decision-relevant dimension:

- Composition or camera/framing.
- Storefront massing, density, rhythm, or local-detail strategy.
- UI marker/card hierarchy and prominence.
- Emotional volume, warmth, restraint, or playfulness.
- Truth-handling strategy, such as symbolic anchors versus fictionalized placeholders.

Variants should not be counted as meaningful if they only change colors, minor prop placement, labels, texture amount, or decorative accents while keeping the same underlying decision.

## Truth And Source Constraints

Truth/source constraints remain mandatory. They are never optional and must not be softened to make an artifact prettier.

Those constraints also must not become an excuse for generic visuals. If real details are unresolved, the artifact should still make a clear visual proposal using labeled placeholders, symbolic anchors, fictionalized storefronts, omission, or another approved truth-safe strategy.

## Self-Audit Template

Before delivery, Codex must answer:

- Intended decision: What decision should Batu be able to make from this artifact?
- Fidelity level: Level 0 text brief, Level 1 diagram/blockout, Level 2 style tile/component proof, Level 3 static style frame, or Level 4 production/prototype asset?
- Required output format: What format does the decision stage require?
- SVG status: Is SVG allowed or disallowed for this task, and why?
- Visual evidence: What can Batu see directly without imagining missing detail?
- Variant difference: What materially different choice does each variant test?
- Truth handling: What is verified, symbolic, placeholder, fictionalized, omitted, or unresolved?
- Missing fidelity: What would Batu still have to imagine?
- Pass/fail: Does the artifact pass the decision-usefulness standard?
- Revision needed: If it fails, what must be revised before reporting completion?

## Examples

Pass examples:

- A composition sketch that shows enough street massing, marker/card placement, and labeled truth status for Batu to choose which composition to refine.
- A style frame with visible storefront rhythm, signage treatment, UI-card treatment, emotional tone, and local specificity sufficient to judge whether the direction is worth continuing.
- Three variants where one changes storefront-led restraint, one changes balanced UI/world emphasis, and one changes community-forward emotional volume in visibly distinct ways.

Fail examples:

- Three variants that share the same composition and storefront treatment while changing only accent colors.
- A review package that says "warm community storefront energy" but shows generic boxes, placeholder signs, and no believable UI treatment.
- A truth-safe artifact that avoids false claims but leaves the scene too abstract for Batu to judge the intended visual direction.
