# MVP-15C Visual Failure Freeze And Raster-First Gate

Status: Complete for Batu/ChatGPT review  
Date: 2026-05-29  
Task type: Docs/governance-only pre-task before MVP-16

No app/source implementation was performed. MVP-16 was not run. No new generated art, production assets, package/config changes, deployment work, staging, or commit work was performed.

## Verdict

MVP-15B is visually rejected as product-facing primary world art.

MVP-15B is technically salvageable only for interaction shell, static target set, cards, target rail, hover/select behavior, pan/zoom paths, QA overlay logic, and truth-safety copy.

The MVP-15B code-native Pixi world renderer must not be used as the normal-mode visual basis for MVP-16.

## Evidence

Rejected screenshot evidence:

- `docs/mvp-review/mvp-15c-visual-failure-freeze-raster-first-gate/rejected-evidence/mvp-15b-rejected-diagrammatic-perspective.png`

Observed failure modes:

- First read is still flat and diagrammatic.
- Large flat polygonal buildings and road planes dominate.
- Generic category signage such as `DELI`, `BITES`, `COFFEE`, and `SERVICE` remains the strongest storefront identity.
- Scene depends on labels, UI, and debug/review copy to explain itself.
- Greenpoint specificity is not visible before labels.
- The screenshot does not meet the approved raster fidelity bar.
- The result is closer to generic vector-isometric / technical-art proof than Inked Indie / Compact Corner diorama.

## Root Cause

The failure is a medium mismatch.

MVP-15B allowed code-native primitives to become primary world art. The approved direction depends on high-fidelity raster qualities: hand-inked linework, facade texture, worn surfaces, dense storefront detail, warm threshold depth, street-prop density, and integrated paper/card UI. Pixi primitives can help with interaction overlays, but they cannot substitute for that primary world surface.

The Approved Corpus Compliance Gate measured inspection and citation, not material use. Codex could cite ARC-023, ARC-028, ARC-024, and ARC-029 while still implementing a lower-fidelity code-drawn world.

The current brief accidentally reopened a path that the visual governance docs were trying to close.

## Preserved Value

The following MVP-15B work may be preserved or reused later around a raster-first primary world surface:

- Static target set.
- Cards.
- Target rail.
- Hover/select behavior.
- Pan/zoom paths.
- QA overlay logic.
- Truth-safety copy.

This preserved value does not rescue the code-native world renderer as product-facing primary scene art.

## Superseded Path

Further `perspective scene renderer` or `make the code geometry better` passes are blocked unless Batu explicitly requests a non-visual blockout.

A current brief may authorize code-native structure repair only when the result is explicitly labeled as a non-visual blockout and is not used as the product-facing normal-mode world surface.

The next visual recovery path must be raster-first.

## Gate Patch Summary

MVP-15C patches the governance loophole by converting future visual compliance from reference inspection to reference material use.

Future prototype work intended to represent the approved look and feel must use one of these as the normal-mode primary world surface:

- Approved raster/reference plate.
- Approved raster sprite/asset-kit composition.

Code-native SVG/CSS/DOM/canvas/Pixi graphics may be used only for hidden blockouts, hit regions, debug/QA overlays, markers, tethers, selected outlines, cards, controls, and temporary alignment guides.

Code-native storefronts, buildings, sidewalks, roads, props, textures, or signs are blocked as primary world art for any prototype being evaluated against the approved visual direction.

If no approved raster plate or approved raster sprite/asset kit is available, Codex must stop before source edits.

## Files Inspected

- `AGENTS.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/VISUAL_QA_CHECKLIST.md`
- `docs/reference/approved-reference-corpus/MANIFEST.md`
- `docs/reference/approved-reference-corpus/REFERENCE_INDEX.md`
- `docs/reference/approved-reference-corpus/USAGE_RULES.md`
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/mvp-review/mvp-15b-perspective-scene-renderer-replacement/README.md`
- `docs/visual-artifacts/phase-6-review-prototype-translation-plan/REUSABLE_ASSET_RULES.md`

## Patched Docs

- `docs/PLAN.md`: replaced the code-native repair escape hatch with the stricter primary-world-art rule.
- `docs/CURRENT_EXECUTION_BRIEF.md`: freezes MVP-15B as visually rejected and proposes MVP-16 Raster-First Prototype Recovery without running it.
- `docs/VISUAL_ARTIFACT_STANDARDS.md`: clarifies that current briefs cannot override the primary-world-art rule for visual acceptance work.
- `docs/reference/approved-reference-corpus/USAGE_RULES.md`: adds material-use gate language.
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`: updates the gate from inspection-only compliance to raster-first material-use compliance.
- `docs/mvp-review/mvp-15b-perspective-scene-renderer-replacement/README.md`: records the supplied screenshot rejection and freezes the code-native world renderer as failed visual evidence.
- `docs/MVP_EXECUTION_LEDGER.md`: records this batch.

`AGENTS.md` already contained the top-level visual asset responsibility rule, so it did not need a patch.

## Next Recommended Task

Proposed only:

- MVP-16 Raster-First Prototype Recovery.

Do not execute MVP-16 until Batu/ChatGPT approves a current brief and a suitable approved raster plate or approved raster sprite/asset-kit composition is available.
