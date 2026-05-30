# Current Execution Brief - Pending Next Batu Approval

Status: MVP-17 Product-Facing Raster Interaction Polish is accepted by Batu as the product-facing raster interaction polish baseline. The supplied screenshot set is partial, and Batu explicitly accepted the missing mobile selected-state containment screenshot evidence gap on 2026-05-30.

Owner boundary: No new implementation task is currently approved. Codex must not perform further source implementation, create new primary world art, generate visual assets, change package/config/tooling/CI/deployment, stage, or commit except for the one-time `MVP-17 Hold-State Reconciliation Commit` task authorized below. Batu retains approval over product direction, scope changes, production claims, real-place representation, public interfaces, and any next phase.

## Current Next Task State

Approved next task:

- `MVP-17 Hold-State Reconciliation Commit` only.

Approved next-task type:

- One-time commit-only reconciliation task.
- This task may stage and commit only already-existing accepted MVP workstream paths needed to preserve the MVP-17 accepted raster interaction prototype and its historical review/evidence trail.
- It must not edit implementation or docs, create screenshots, create or modify assets, run QA recovery, open a new MVP batch, change package/config/tooling/CI/deployment, or make production/public-release claims.
- After the commit, the repo remains in the same MVP-17 hold state and no further task is approved.

Approved reconciliation commit scope:

- Include active accepted prototype source paths: `src/App.jsx`, `src/PlaceholderWorld.jsx`, `src/mvpPlaceData.js`, and `src/styles.css`.
- Include MVP-17 control/review paths: `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, and `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/`.
- Include MVP-17 accepted screenshot evidence: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/`.
- Include historical MVP workstream review/evidence folders already documented in the ledger and needed to preserve the trail to MVP-17, including older `docs/mvp-review/mvp-08-place-evidence-packet-current-scene/` through `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/`.
- Include older review screenshot evidence relevant to the accepted path: `docs/review-screenshots/mvp-04-interaction-integration/`, `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/`, and `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/`.
- Include `docs/mvp-reference-images/` as historical/source-reference evidence for the reviewed MVP workstream only, not as approved production assets or facade/art sources.
- Include approved-reference-corpus documentation changes: `docs/approved-reference-corpus/MANIFEST.md`, `docs/approved-reference-corpus/README.md`, `docs/approved-reference-corpus/REFERENCE_INDEX.md`, and `docs/approved-reference-corpus/USAGE_RULES.md`.
- Include `docs/VISUAL_ARTIFACT_STANDARDS.md` as part of the documented raster-first/visual-evidence governance trail.
- Include `docs/VISUAL_INTEGRATION_PROTOTYPE_PLANNING_BRIEF.md` as historical planning context only if it already exists in the dirty tree at commit time; it is not revived as active task authority.

Explicit exclusions from the reconciliation commit:

- Exclude `dist/`, `node_modules/`, logs, caches, environment files, package/config/tooling/CI/deployment changes, and any newly generated files not already present in the dirty tree before the reconciliation commit task begins.
- Exclude any new implementation, docs expansion, screenshot capture, visual asset generation/modification, QA recovery, or new MVP batch work.

Batch name:

- Product-Facing Raster Interaction Polish.

Goal:

- Hold after MVP-17 acceptance until Batu opens the next implementation, QA, or documentation batch.
- Allow one future commit-only reconciliation task to preserve the accepted MVP-17 dirty working tree and its documented historical evidence trail, then return to hold.

Source implementation already completed:

- Reduced visual weight of review chrome, top copy, target rail, controls, markers, tethers, outlines, and selected card treatment.
- Preserved the approved raster plate as the normal-mode primary world surface.
- Preserved existing pan/zoom, hover/select, target rail, cards, and mobile containment behavior in source.
- Kept business identity in cards, labels, accessible text, and UI copy only.
- Did not add optional ambient motion.

Current evidence status:

- Present: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-default-overview.png`
- Present: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-hover-focus-state.png`
- Present: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-store-card.png`
- Present: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-zoom-view.png`
- Missing but accepted as an evidence gap: mobile selected-state containment screenshot.

Remaining scope:

- Only the one-time `MVP-17 Hold-State Reconciliation Commit` is authorized. All other future work requires a new explicit current brief.

Allowed edits:

- None. The future `MVP-17 Hold-State Reconciliation Commit` may stage and commit the approved reconciliation scope above, but must not edit files.

Forbidden:

- No code-drawn storefronts, buildings, roads, sidewalks, props, textures, or signs.
- No new primary world art.
- No new generated visual assets.
- No replacement raster plate unless explicitly supplied and approved.
- No real business identity baked into artwork.
- No exact real facade, exact address, or exact station-geometry claims.
- No package/config/tooling/CI/deployment changes.
- No production asset, production pipeline, production scalability, or public-release claims.
- No unrelated implementation, broad feature work, map/data expansion, backend, persistence, analytics, or live data.
- No staging or commit except the one-time `MVP-17 Hold-State Reconciliation Commit` task authorized above.

Acceptance outcome:

- MVP-17 accepted by Batu on 2026-05-30.
- MVP-16B's raster-first world surface remains primary.
- Interaction polish is accepted as the product-facing raster interaction polish baseline.
- The missing mobile selected-state containment screenshot is accepted as an evidence gap.
- No production asset, production pipeline, exact-real-place, public-interface, architecture, deployment, or next-phase approval is implied.

Verification recorded:

- Run `npm run build`.
- Run `git diff --check`.
- Verify supplied review screenshots for desktop overview, hover/focus, selected card, mobile selected containment, and pan/zoom stress.
- Report changed files, verification results, screenshot paths, and compromises.

Stop conditions:

- Stop if polish requires changing, repainting, regenerating, replacing, or visually restyling the raster plate.
- Stop if the work would require code-drawn storefronts, buildings, roads, sidewalks, props, textures, signs, or any new primary world art.
- Stop if the work would require exact real address, facade, storefront-order, or station-geometry claims.
- Stop if the plan/current brief/ledger cannot be reconciled without widening scope.

Implementation preflight required before source edits:

- State whether public interfaces/module boundaries change or remain unchanged.
- State expected files to touch.
- State feedback loop.
- State decisions still reserved for Batu.

## MVP-16B Outcome

Approved raster plate used:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`

Decision:

- MVP-16A is approved for recovery use only.
- This is not final production art approval.

Implementation summary:

- The approved raster plate is now the active primary world surface.
- The previous code-drawn perspective street/building/storefront renderer was removed from the active world component.
- Five transparent hit regions are mapped onto the raster and attached to the existing target rail/card flow.
- Markers, tethers, hover outlines, selected outlines, and QA hotspot labels are overlay-only treatments.
- Real business identity remains in structured data, cards, rail labels, source links, and UI copy only.
- Existing cards, target rail, hover/select behavior, pan/zoom behavior, and mobile containment were preserved as much as possible.

MVP-16B packet:

- `docs/mvp-review/mvp-16b-raster-first-prototype-recovery/README.md`

Screenshot evidence:

- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-default-overview.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-hover-focus-state.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-selected-card-state.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/mobile-selected-state-containment.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/pan-zoom-stress-view.png`

Hard blocks remain:

- No code-drawn storefronts.
- No code-drawn buildings.
- No code-drawn roads or sidewalks.
- No new Pixi/SVG/CSS/canvas world-art renderer pass.
- No real business identity baked into artwork.
- No production asset approval claims.
- No broad map/data scaling work.
- No commit unless explicitly asked.

## MVP-16A Outcome

MVP-16A evaluated available raster candidates and selected the Phase 6 street-slice recombination plate for review:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`

Why it was selected:

- It is an existing inspectable raster PNG.
- It is a Phase 6 review-only assetization proof aligned to the approved Inked Indie / Compact Corner corpus.
- It uses raster scene material rather than code-native primitive world art.
- It contains multiple distinct storefront/cue zones and a symbolic G/subway cue.
- It does not bake in live cards, target rail, controls, selected states, or hover states.

Limitations:

- It is not an exact Manhattan Avenue / Greenpoint Avenue four-corner scene.
- It does not depict exact Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, or Greenpoint G subway facades.
- It must remain review-only, fictional-safe, and non-production.
- Business identity must remain in cards, target rail, accessible labels, and truth-safety copy only.
- Hotspots are interaction anchors on a fictional-safe plate, not claims about exact storefront order, frontage, address, facade, or placement.

MVP-16A packet:

- `docs/mvp-review/mvp-16a-raster-plate-selection-supply-gate/README.md`

## Rejected / Non-Selected Candidates

- ARC-023 remains the primary scene/world reference baseline but was not selected as the active MVP-16B plate because it has no explicit subway cue and fewer obvious current-target anchor zones.
- ARC-028 remains the compact street-slice scalability reference but was not selected as the active MVP-16B plate because it has no explicit subway cue.
- Phase 6 UI-integrated recombination was not selected because UI/cards/controls are baked into the image.
- Phase 5.1 raster scene plate remains fallback only because it lacks later identity density and symbolic subway cue.
- Current-scene source screenshots remain blocked as primary world art. They are source/truth review inputs only, not Inked Indie / Compact Corner plates, copied facades, texture sources, generation inputs, or screenshot backgrounds.

## Primary-World-Art Rule

For any prototype intended to represent the approved look and feel, the normal-mode world surface must be an approved raster/reference plate or an approved raster sprite/asset-kit composition.

Code-native SVG/CSS/DOM/canvas/Pixi graphics may be used only for:

- Hidden blockouts.
- Hit regions.
- Debug/QA overlays.
- Markers.
- Tethers.
- Selected outlines.
- Cards.
- Controls.
- Temporary alignment guides.

A current brief may authorize code-native structure repair only when the result is explicitly labeled as a non-visual blockout and is not used as the product-facing normal-mode world surface.

A current brief may not authorize code-native storefronts, buildings, sidewalks, roads, props, textures, or signs as the primary world art for a prototype being evaluated against the approved visual direction.

## Still Forbidden Unless A Later Brief Opens Scope

Do not add or modify:

- App/source implementation unless a later current brief explicitly opens it.
- Visual polish.
- Optional ambient work.
- Exact real-inspired facade art.
- Exact Greenpoint G subway station geometry.
- New generated visual assets or new visual assets except a supplied approved raster plate explicitly allowed by a later brief.
- Live scraping.
- Live data fetches.
- Automated refresh or broad imports.
- Google/Street View/Google Maps/Google 3D Tiles-derived facade references, extraction inputs, generation inputs, texture sources, or training inputs.
- LiveXYZ-derived facade/art use.
- Production asset pipeline work.
- Production/public-release claims.
- Broad map expansion.
- Backend/CMS/persistence/accounts/analytics.
- CI/deployment/package/config/tooling changes.
- Staging or commit.

## Public Interfaces / Module Boundaries

MVP-16B worked inside the existing prototype shell only:

- No package/config changes.
- No new framework, renderer, routing system, map system, public module, public interface, or production data contract.
- No production asset direction or production asset pipeline.

## Decisions Still Reserved For Batu

- Whether to accept, revise, or reject MVP-16B as the raster-first recovery baseline.
- Whether any current business remains literal in labels/cards, becomes fictionalized, becomes context-only, is omitted, or is blocked.
- Any visual verdict after MVP-16B browser screenshots.
- Any visual polish, optional ambient, production asset, production data, public-interface, architecture, CI/deployment, or release decision.
