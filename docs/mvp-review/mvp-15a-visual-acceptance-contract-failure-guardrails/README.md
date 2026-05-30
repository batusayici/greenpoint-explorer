# MVP-15A Visual Acceptance Contract / Failure Guardrails

Status: Complete for Batu/ChatGPT review
Date: 2026-05-29
Verdict: `guardrails-required-before-next-visual-implementation`

## Purpose

Stop the recurring visual failure pattern before another implementation pass.

This is a docs-only contract. It introduces no new art, assets, scraping, image generation, source-code changes, renderer implementation, production asset direction, or visual approval.

## Evidence Read

Reviewed:

- `docs/mvp-review/mvp-13-four-corner-scene-structure-repair/README.md`
- `docs/mvp-review/mvp-12-screenshot-visual-qa-recovery-review/README.md`
- `docs/mvp-review/mvp-10-fictional-safe-current-scene-art-translation-brief/README.md`
- `docs/ART_DIRECTION.md`
- `docs/approved-reference-corpus/README.md`
- `docs/approved-reference-corpus/USAGE_RULES.md`
- `docs/approved-reference-corpus/REFERENCE_INDEX.md`
- `docs/approved-reference-corpus/MANIFEST.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## Rejected Screenshot Evidence

Rejected MVP-11 and MVP-13 screenshots are now present in the repository and are explicit anti-reference evidence for future implementation and review.

Evidence location:

- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/`

| Screenshot | Failure documented |
| --- | --- |
| `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/mvp-11-rejected-overlays.png` | MVP-11 screenshot-background scene with floating SVG-like storefront overlays; storefronts sit as misplaced overlay elements rather than scene-native geometry. |
| `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/mvp-13-rejected-flat-storefronts.png` | MVP-13 top-down board-game/grid intersection, flat generic storefront modules, label-driven category tiles, insufficient scene-native perspective, and correct quadrant anchoring with failed art direction. |
| `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/mvp-13-rejected-selected-card-flat-storefronts.png` | MVP-13 selected-card state still preserves the top-down board-game/grid intersection, flat generic storefront modules, label-driven category tiles, insufficient scene-native perspective, and correct quadrant anchoring with failed art direction. |

Future visual implementation must use these screenshots as concrete anti-references, not as style targets.

The four source corner screenshots are present at:

- `docs/mvp-reference-images/source-01-northwest-corner.png`
- `docs/mvp-reference-images/source-03-northeast-corner.png`
- `docs/mvp-reference-images/source-04-southwest-corner.png`
- `docs/mvp-reference-images/source-05-southeast-corner.png`

## Failure Diagnosis

MVP-11 failed because it collapsed the scene into a screenshot-backed surface with misplaced floating SVG-like storefront overlays.

MVP-13 fixed the NW/NE/SW/SE anchoring but failed visually because it became a top-down schematic map with generic SVG-like storefront tiles.

The core problem is not only target placement. It is visual scene-language failure: the composition must read as a stylized oblique/isometric street scene, not as UI, a diagram, a board, or pasted annotations.

## Approved Corpus Compliance And Material-Use Gate

Every future visual implementation pass must align to the approved Inked Indie / Compact Corner corpus before code changes. Avoiding MVP-11 and MVP-13 failure modes is not enough. Inspecting and citing the corpus is also not enough.

No visual implementation pass is valid unless it cites exact ARC IDs and source paths from `docs/approved-reference-corpus/MANIFEST.md`.

For any prototype intended to represent the approved look and feel, the normal-mode primary world surface must materially use an approved raster/reference plate or an approved raster sprite/asset-kit composition. Code-native SVG/CSS/DOM/canvas/Pixi graphics may support hidden blockouts, hit regions, debug/QA overlays, markers, tethers, selected outlines, cards, controls, and temporary alignment guides only.

A current brief may not authorize code-native storefronts, buildings, sidewalks, roads, props, textures, or signs as the primary world art for a prototype being evaluated against the approved visual direction. If no approved raster plate or approved raster sprite/asset kit is available, Codex must stop before source edits.

Required references before code changes:

| Required use | Required ARC citation |
| --- | --- |
| Primary scene/world reference | ARC-023 with the current source path from `docs/approved-reference-corpus/MANIFEST.md`. |
| Compact street-slice scalability reference | ARC-028 with the current source path from `docs/approved-reference-corpus/MANIFEST.md`. |
| Storefront module fidelity/decomposition reference | ARC-016 or ARC-026 with the current source path from `docs/approved-reference-corpus/MANIFEST.md`. |
| UI/card/marker/selected-state integration reference | ARC-024 and ARC-029 with current source paths from `docs/approved-reference-corpus/MANIFEST.md`. |
| Cautionary anti-references | ARC-015 and ARC-031 with current source paths from `docs/approved-reference-corpus/MANIFEST.md`. |

Before implementation, Codex must inspect the required references and produce a pre-code visual target table with:

| Required column | Purpose |
| --- | --- |
| reference used | Exact ARC ID and path. |
| visible traits to preserve | Observable linework, massing, storefront, street, density, UI, marker, card, or selected-state traits. |
| implementation implication | What the renderer, scene geometry, storefront treatment, or UI overlay must do because of the reference. |
| risks/drift to avoid | How the implementation could drift into top-down maps, SVG-grade diagrams, generic storefronts, beige QA UI, label-led reads, or other anti-patterns. |

Codex must explicitly compare the proposed implementation against ARC-015 and ARC-031 before code changes. The comparison must explain how the pass avoids diagrammatic decomposition, SVG-grade placeholder fidelity, detached module sheets, and proof labels becoming product UI.

The pre-code target table must also identify the actual primary world material to be used: raster plate path or approved raster sprite/asset-kit path. If the table only lists traits to imitate in code, the gate is not complete.

If any required reference image is unavailable, has a path conflict, or cannot be visually inspected, Codex must stop and report the missing or conflicting reference before implementation.

Build success is not visual acceptance. Source implementation status and visual QA status must remain separate. A code-native world renderer may be valid only as a non-visual blockout when explicitly labeled as such; it must not be accepted as product-facing primary world art.

## Banned Visual Patterns

The next implementation must not:

- create a top-down map
- create a board-game/grid diagram
- create floating storefront tiles
- use identical rectangle-window-awning templates across all four stores
- rely on storefront text labels as the main category cue
- treat buildings as UI cards
- place storefronts in an overlay layer
- collapse four source references into one screenshot
- use unapproved screenshot/photo backgrounds as the scene

## Required Visual Patterns

The next implementation must:

- use a stylized oblique/isometric street-scene composition
- show buildings with volume, sides, depth, roof/parapet cues, and facade planes
- embed storefronts into building geometry
- give each corner distinct massing/proportion
- use sidewalks, crosswalks, curb geometry, and road perspective to support the scene
- keep the subway cue symbolic but scene-native
- preserve the correct four-corner assignment:
  - NW = deli / food retail
  - NE = quick service / McDonald's category cue
  - SW = coffee / Dunkin' category cue
  - SE = service-bank / Citizens category cue

## Required Pre-Code Visual Extraction

Before the next implementation pass, Codex must inspect the four source corner screenshots and produce corner-by-corner notes covering:

- broad massing
- storefront orientation
- corner relationship
- safe abstractable cues
- blocked exact-copy details

If the four screenshots cannot be visually inspected, Codex must stop and report that it cannot implement the next visual pass safely.

The extraction must not authorize exact facade copying, exact signage, exact storefront dimensions, exact station geometry, texture reuse, or production art claims.

## Renderer Architecture Requirement

The next implementation must not replace the placeholder/diagram approach with a code-native primary world renderer for visual acceptance. The visual recovery path must be raster-first.

It should clearly separate:

- primary world surface: approved raster/reference plate or approved raster sprite/asset-kit composition
- UI overlay: cards, target rail, controls, selected/hover outlines only

Storefronts, buildings, sidewalks, roads, props, textures, and signs must live in the approved raster/reference world surface or approved raster sprite/asset-kit composition, not in UI overlays or code-native primitive drawing.

## QA Rule

Browser QA and visual acceptance require screenshots from a local browser, deploy preview, or CI.

If localhost/browser rendering is blocked, status must be:

- implementation/source status: `pending visual QA`
- browser QA status: `qa-blocked`

Do not mark a visual verdict as `proceed`, `revise`, or `revert` without screenshots. Source status and browser QA status must remain separate.

## Next Recommended Task

Recommended next task superseded by MVP-15C: MVP-16 Raster-First Prototype Recovery.

MVP-16 must begin with the material-use gate above, then implement only inside an approved current brief. It must not add image generation, scraping, production claims, or source expansion beyond the approved scope. If a suitable approved raster plate or approved raster sprite/asset-kit composition is not available, Codex must stop before source edits.
