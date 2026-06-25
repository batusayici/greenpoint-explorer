# MVP-15B Perspective Scene Renderer Replacement

Status: Visually rejected as product-facing primary world art
Date: 2026-05-29
Implementation/source status: `interaction-shell salvage only`
Browser QA status: `reviewed from supplied screenshot`
Visual verdict: `rejected`

## Purpose

Replace the failed MVP-13 diagrammatic four-corner scene with a scene-native Inked Indie / Compact Corner perspective renderer.

This pass is review-only. It does not approve production assets, a production asset pipeline, real-place data acquisition, exact real facades, exact station geometry, package/config changes, deployment, staging, or commit.

## MVP-15C Visual Rejection

MVP-15B has now been visually reviewed from a supplied browser screenshot and is rejected as product-facing primary world art.

Rejected evidence:

- `docs/mvp-review/mvp-15c-visual-failure-freeze-raster-first-gate/rejected-evidence/mvp-15b-rejected-diagrammatic-perspective.png`

Observed failure:

- First read remains flat and diagrammatic.
- Large flat polygonal buildings and road planes dominate.
- Generic category signage such as `DELI`, `BITES`, `COFFEE`, and `SERVICE` remains the strongest storefront identity.
- Scene depends on labels, UI, and debug/review copy to explain itself.
- Greenpoint specificity is not visible before labels.
- The screenshot does not meet the approved raster fidelity bar.
- The result reads closer to generic vector-isometric / technical-art proof than Inked Indie / Compact Corner diorama.

Root cause:

- The failure is a medium mismatch.
- The code-native Pixi renderer used primitives as primary world art.
- The corpus gate measured inspection/citation, not material use.

Preserved value:

- Static target set.
- Cards.
- Target rail.
- Hover/select behavior.
- Pan/zoom paths.
- QA overlay logic.
- Truth-safety copy.

The code-native world renderer must not be used as the normal-mode visual basis for MVP-16. Further `perspective scene renderer` or `make the code geometry better` passes are blocked unless Batu explicitly requests a non-visual blockout.

## Active Scene

The active scene/place set remains:

- NW: Greenpoint Deli / deli / food retail.
- NE: McDonald's / quick-service category cue.
- SW: Dunkin' / coffee category cue.
- SE: Citizens Bank / service-bank category cue.
- Center/intersection context: Greenpoint G subway symbolic cue only.

## MVP-15A Compliance Table

The MVP-15A Approved Corpus Compliance Gate was completed before app/source edits.

| Reference used | Visible traits to preserve | Implementation implication | Risks/drift to avoid |
| --- | --- | --- | --- |
| ARC-023: `docs/archive/visual-artifacts/phase-4-fictional-safe-identity-ui-integration-proof/generated/fictional-safe-street-slice.png` | Oblique storefront-led street slice; volumetric brick facades; roof/parapet planes; dense but readable sidewalk props; fictional-safe glyph signage; crosswalk/street edge integrated into scene. | Build the scene as oblique/isometric world geometry with sidewalk, curb, street, building sides, roof planes, embedded storefronts, and fictional-safe category cues. | Do not create a top-down board, screenshot overlay, flat SVG storefront row, or label-first category boxes. |
| ARC-028: `docs/archive/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/mini-street-slice-scalability-proof.png` | Compact street-slice scalability; repeated family language with varied storefront widths, awnings, signs, and props; consistent but not identical buildings. | Use a shared drawing vocabulary while varying each corner's massing, sign band, awning/canopy, window rhythm, and prop clusters. | Avoid one identical rectangle/window/awning template across all four stores. |
| ARC-016: `docs/archive/visual-artifacts/phase-3-8-fidelity-recovery-multi-module-stress-test/generated/multi-module-finished-reads-board.png` | Storefront modules with depth, roof detail, side planes, facade texture, distinct module silhouettes, and map-mode readability. | Give each corner a different building silhouette and embedded storefront read instead of isolated storefront tiles. | Avoid flat module cards, front-only storefront stamps, and detached module-sheet composition. |
| ARC-026: `docs/archive/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/source-storefront-decomposition-board.png` | Rendered layer families: facade shell, sign band, awning, door/window pattern, prop clusters, posters/stickers, identity glyphs, selected outline, and card attachment zone. | Separate renderer concerns internally into world geometry and UI overlay while keeping storefront visual elements inside world geometry. | Do not let layer labels, proof panels, or decomposition diagrams become product UI. |
| ARC-024: `docs/archive/visual-artifacts/phase-4-fictional-safe-identity-ui-integration-proof/generated/integrated-hover-card-pressure.png` | Product-facing marker/card pressure with selected outline, tether, paper-card feel, and world-first composition. | Preserve existing cards and interactions while keeping markers/cards as overlay-only; selected/hover outlines may sit above world geometry. | Avoid beige QA harness styling, oversized debug labels, or cards swallowing the scene. |
| ARC-029: `docs/archive/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/selected-state-ui-attachment-proof.png` | Selected building outline, marker-to-card tether, compact card integration, and world/card attachment logic. | Selected and hover treatment should outline or focus world buildings without turning buildings into UI cards. | Avoid floating storefront tiles and card-like buildings. |
| ARC-015: `docs/archive/visual-artifacts/phase-3-7-storefront-layer-decomposition-proof/generated/technical-art-proof-comparison-board.png` | Caution: decomposition board exposes useful layers but reads as technical proof, not scene-native visual acceptance. | Use layer thinking only internally; final renderer must be an integrated street scene. | Avoid diagrammatic decomposition, proof labels, single-module repetition, and low-fidelity technical-art read. |
| ARC-031: `docs/archive/visual-artifacts/batch-14-production-scalability-spike/generated/*.svg` | Caution: SVG planning artifacts are useful for planning but failed the decision-grade raster fidelity bar. | Implementation may use code drawing for review-only source, but must aim at scene-native perspective and corpus traits, not SVG-grade planning sheets. | Avoid SVG-grade placeholder fidelity, detached icon sheets, low-fidelity wireframes, and treating build success as visual acceptance. |

## Cautionary Comparison

Against ARC-015, MVP-15B must not present decomposition as the final scene. The renderer can use layered construction internally, but the visible output must read as a compact street scene with integrated buildings, storefronts, sidewalks, curbs, and subway cue.

Against ARC-031, MVP-15B must not rely on SVG-grade planning language as visual proof. The code-native scene must avoid flat icon-sheet logic, repeated symbolic modules, and proof-board labels. Browser screenshots remain required before any visual verdict.

## Rejected Evidence Table

| Evidence | Failure documented | MVP-15B response |
| --- | --- | --- |
| `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/mvp-11-rejected-overlays.png` | Screenshot background with floating SVG-like storefront overlays. | Do not use screenshots as scene surfaces. Draw the world as native geometry and keep storefronts embedded in buildings. |
| `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/mvp-13-rejected-flat-storefronts.png` | Top-down board-game/grid intersection; flat generic storefront modules; label-driven category tiles; insufficient scene-native perspective; correct quadrant anchoring but failed art direction. | Use oblique/isometric street-scene geometry, varied building massing, and category cues through forms/props/materials before text. |
| `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/mvp-13-rejected-selected-card-flat-storefronts.png` | Selected-card state did not fix the underlying top-down board-game/grid and flat storefront read. | Preserve card behavior while the underlying world remains perspective, volumetric, and scene-native in selected and unselected states. |

## Four-Corner Source Extraction

The four source screenshots were inspected for broad, abstractable massing and orientation only. They are not exact facade, signage, storefront-width, texture, address, or station-geometry sources.

| Corner | Broad massing | Storefront orientation | Corner relationship | Safe abstractable cues | Blocked exact-copy details |
| --- | --- | --- | --- | --- | --- |
| NW: Greenpoint Deli / food retail, `docs/mvp-reference-images/source-01-northwest-corner.png` | Tall red-brick corner mass with stacked upper windows over an active ground-floor corner retail bay. | Storefront wraps the corner and faces both intersection edges. | Strong corner anchor, pedestrian activity, crosswalks, and traffic-light/curb context. | Tall brick volume, corner-store rhythm, awning/sign-band energy, sidewalk clutter, active threshold. | Exact signage, exact deli facade, address, window count, storefront width, product displays, people, and Street View imagery. |
| NE: McDonald's / quick service, `docs/mvp-reference-images/source-03-northeast-corner.png` | Large low-to-mid modern commercial box with broad facade planes and canopy/flag language. | Main frontage faces the intersection and street edge with a wide quick-service presence. | Dominant modern corner mass contrasting older masonry corners. | Broad low quick-service volume, canopy band, large glass rhythm, simplified commercial block. | Literal golden arches, brand trade dress, exact flags, exact facade panels, entrance placement, and signage. |
| SW: Dunkin' / coffee, `docs/mvp-reference-images/source-04-southwest-corner.png` | Two-story corner commercial mass with adjacent older masonry, strong sign band, and subway/street furniture nearby. | Coffee storefront faces the intersection with a visible corner-adjacent shopfront. | Sits near crosswalks and symbolic Greenpoint G subway context. | Coffee/quick-service cue through warm window, compact sign band, roll-gate/window rhythm, nearby subway globe/rail cue. | Literal Dunkin' signage/colors, exact subway entrance geometry, exact doors/windows, exact neighboring tenants, and storefront order claims. |
| SE: Citizens / service-bank, `docs/mvp-reference-images/source-05-southeast-corner.png` | Taller civic/service-bank corner building with heavier stone/brick presence, vertical windows, and corner entrance energy. | Service frontage addresses the corner with a more reserved bank/service threshold. | Visually heavier institutional anchor near crosswalk and subway context. | Taller service-bank massing, vertical facade rhythm, reserved entrance, stone/brick contrast, civic weight. | Literal Citizens signage, exact facade ornament, exact entrance/ATM placement, address, station geometry, and active-status claims. |

## Renderer Plan

MVP-15B should replace the diagram/board approach with a scene-native perspective renderer.

World geometry:

- Oblique/isometric road planes with receding street axes, not a top-down plus sign.
- Sidewalk slabs, curb edges, crosswalk bars, corner cuts, grates, and small street props.
- Four corner buildings with distinct volume, side planes, roof/parapet cues, facade planes, and embedded storefronts.
- Category cues through massing, sign-band shape, awning/canopy, window rhythm, props, and fictional-safe glyphs.
- Symbolic Greenpoint G subway cue integrated into the sidewalk/intersection context without exact station geometry.

UI overlay:

- Existing cards.
- Existing target rail.
- Existing controls.
- Existing pan/zoom paths.
- Hover/focus/selected outlines and target hit regions only.

Storefronts must live in world geometry, not in the UI overlay. Buildings must not become UI cards. Real business names remain limited to labels/cards/target rail/source metadata as identity/presence-only review data.

## Implementation Boundary

Allowed source scope:

- Current app/source scene files needed for renderer replacement.
- `src/mvpPlaceData.js` only if visual metadata is needed.

No package/config changes are required or allowed.

## QA Plan

- Run `npm run build`.
- Run `git diff --check`.
- Attempt screenshots only if the environment can render.
- Historical MVP-15B rule: if browser rendering was blocked during implementation, report implementation/source status as `complete pending visual QA` and browser QA status as `qa-blocked`.
- Do not assign a visual verdict of `proceed`, `revise`, or `revert` without screenshots.

## Implementation Result

Files changed in this implementation pass:

- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`
- `docs/mvp-review/mvp-15b-perspective-scene-renderer-replacement/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Source result:

- Replaced the active current-scene renderer with oblique street-scene world geometry.
- Kept storefronts embedded in building geometry instead of overlay storefront tiles.
- Added distinct corner massing, roof/parapet cues, side planes, facade rhythms, sidewalks, curbs, crosswalks, and props.
- Reduced the storefront text labels to secondary signs and added category cues through geometry/props/glyphs.
- Preserved existing cards, target rail, hover/select markers, QA outlines, pan/zoom paths, and truth-safety copy.

Verification:

- `npm run build` passed.
- `git diff --check` passed.

Browser QA:

- A supplied browser screenshot was reviewed in MVP-15C and copied as rejected evidence.
- Visual verdict is now `rejected` for product-facing primary world art.
- Local rendering in the Codex environment remained blocked during MVP-15B because the dev server failed with `listen EPERM` on `127.0.0.1:5173`.
