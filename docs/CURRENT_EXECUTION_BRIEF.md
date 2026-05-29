# Current Execution Brief - Post-Governance-Reconciliation / Post-MVP-16B Review State

Status: Governance operating-model reconciliation is complete. MVP-16B Raster-First Prototype Recovery remains complete for Batu review, with ChatGPT support optional at critical review or gate-decision moments. No next implementation task is approved.

Owner boundary: Codex must not perform further app/source implementation, visual polish, ambient work, new art generation, production asset work, package/config/tooling/CI/deployment changes, staging, or commit work until Batu approves a later current brief or explicitly opens that scope.

## Current Next Task State

No next implementation task is approved.

Required review:

- Batu review of `docs/mvp-review/mvp-16b-raster-first-prototype-recovery/README.md`, with ChatGPT support optional for critical review or decision framing.
- Browser screenshot review of `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/`.

Proposed next state, pending Batu decision:

- Accept, revise, or reject MVP-16B as the raster-first recovery baseline.
- Write a later current brief for any approved raster-anchor revision, replacement raster plate, visual polish, optional ambient, or next MVP phase.

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
