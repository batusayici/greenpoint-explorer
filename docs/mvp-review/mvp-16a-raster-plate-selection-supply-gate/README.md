# MVP-16A Raster Plate Selection / Supply Gate

Status: Complete for Batu/ChatGPT review  
Date: 2026-05-29  
Scope: Docs-only raster source selection gate. No app/source implementation was run.

## Purpose

MVP-16A selects or blocks the raster-first primary world surface for the next prototype recovery pass.

MVP-15C closed the loophole that allowed code-native SVG/CSS/DOM/canvas/Pixi storefronts, roads, buildings, sidewalks, props, textures, and signs to become product-facing primary world art. MVP-16B may only proceed if it uses an approved raster/reference plate or approved raster sprite/asset-kit composition as the normal-mode world surface.

## Status

Selected for review:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`

This selection is review-only and non-production. It does not approve production assets, production asset direction, exact Greenpoint facades, exact addresses, exact station geometry, factual storefront placement, or broad map coverage.

## Candidate Table

| Candidate | Path | Exists / Inspectable | Fit | Decision |
| --- | --- | --- | --- | --- |
| ARC-023 primary scene/world reference | `docs/archive/visual-artifacts/phase-4-fictional-safe-identity-ui-integration-proof/generated/fictional-safe-street-slice.png` | Yes. PNG, 1672 x 941. | Strong approved Inked Indie / Compact Corner raster scene reference. Good storefront row fidelity, but less suitable as the MVP-16B plate because it has no explicit subway cue and fewer obvious current-target anchor zones. | Use as reference baseline, not selected as the primary plate. |
| ARC-028 compact street-slice scalability reference | `docs/archive/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/mini-street-slice-scalability-proof.png` | Yes. PNG, 1672 x 941. | Strong compact storefront rhythm and reusable-system proof. Less suitable as the active plate because it lacks an explicit subway cue and reads more like scalability proof than targetable MVP scene surface. | Use as reference baseline, not selected as the primary plate. |
| Phase 6 street-slice recombination | `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png` | Yes. PNG, 1672 x 941. | Best existing fit. It is raster-first, review-only, aligned to the approved corpus, uses multiple distinct storefront zones, and includes a symbolic G/subway cue without baking in UI cards or controls. | Selected for MVP-16B pending Batu/ChatGPT approval. |
| Phase 6 UI-integrated recombination | `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/ui-integrated-recombination-v1.png` | Yes. PNG, 1536 x 1024. | High-fidelity raster proof, but UI/card/control elements are baked into the image. This conflicts with MVP-16B preserving live cards, controls, target rail, hover, and selected overlays. | Do not use as primary world plate. Keep as UI integration reference only. |
| Phase 5.1 raster scene plate | `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/phase-5-1-raster-scene-plate-review-only.png` | Yes. PNG, 1672 x 941. | Raster-first and safer than code-native drawing, but weaker than Phase 6 because it lacks the later fictional identity density and symbolic subway cue. | Fallback only if Batu/ChatGPT rejects Phase 6 street-slice selection. |
| Current-scene source screenshots | `docs/mvp-reference-images/source-01-northwest-corner.png`, `docs/mvp-reference-images/source-03-northeast-corner.png`, `docs/mvp-reference-images/source-04-southwest-corner.png`, `docs/mvp-reference-images/source-05-southeast-corner.png` | Yes. | Useful for source extraction and truth review only. They are not approved Inked Indie / Compact Corner plates, and must not become primary world art, copied facade art, texture sources, generation inputs, or exact-scene backgrounds. | Blocked as primary world art. |

## Recommendation

Use `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png` as the MVP-16B normal-mode primary world surface.

Reasons:

- It is an existing inspectable raster PNG, not new generated art.
- It is a Phase 6 review-only assetization proof aligned to ARC-023 and ARC-028.
- It has the approved Inked Indie / Compact Corner look and feel that code-native MVP-15B could not reproduce.
- It includes enough storefront/cue zones to support the existing interaction shell.
- It keeps live UI separate because cards, controls, selected states, and target rail are not baked into the plate.
- It avoids the MVP-11 screenshot-background/overlay failure and the MVP-13/MVP-15B diagrammatic code-native world-art failure.

Limits:

- It is not an exact Manhattan Avenue / Greenpoint Avenue four-corner depiction.
- It does not depict real Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, or Greenpoint G subway facades.
- It must be labeled review-only, fictional-safe, and non-production.
- Business identity must remain in cards, target rail, accessible labels, and truth-safety copy only.
- Hotspots are interaction anchors on a fictional-safe plate, not claims about exact storefront order, frontage, address, facade, or placement.

## MVP-16B Interaction Anchor Stub

If Batu/ChatGPT approves this selection, MVP-16B should use the selected raster as the normal-mode primary world surface and attach transparent hit regions, markers, tethers, cards, controls, selected outlines, and target rail around it.

Recommended review-only anchor mapping:

| MVP target | Raster anchor | Claim boundary |
| --- | --- | --- |
| Greenpoint G subway | Left symbolic G/subway cue and stair-edge area. | Symbolic transit cue only; not exact station geometry. |
| Greenpoint Deli | Central wider retail/storefront zone with green awning/display read. | Food-retail interaction anchor only; no exact deli facade or placement claim. |
| McDonald's | Mid-right warm storefront zone with quick-service-compatible read. | Category/identity lives in card and target rail only; no exact brand facade. |
| Dunkin' | Far-right bakery/cafe-like storefront zone. | Coffee/category cue only; no exact Dunkin' facade or placement claim. |
| Citizens Bank | Narrow service-like storefront/module zone. | Service-bank card anchor only; no exact bank facade or placement claim. |

MVP-16B must keep source implementation status and visual QA status separate. Build success is not visual acceptance. Browser screenshots are required before any visual verdict such as proceed, revise, or revert.

## Minimum Requirements If Selection Is Rejected

If Batu/ChatGPT rejects the selected plate, MVP-16B must remain blocked until a replacement plate is supplied or approved with these minimum properties:

- Raster PNG or JPG primary world surface.
- Approximate 16:9 or app-compatible aspect ratio, with enough safe margins for live UI overlays.
- Inked Indie / Compact Corner visual fidelity comparable to ARC-023 and ARC-028.
- At least five targetable zones: four storefront/business anchors plus one symbolic subway cue.
- No baked production claims, exact real facades, exact addresses, exact station geometry, Google/Street View-derived surfaces, or unapproved brand/facade reproduction.
- No baked live cards, controls, target rail, or selected/hover states unless the implementation brief explicitly disables duplicate live UI.

## Verification

- Confirmed selected and fallback raster files exist on disk.
- Confirmed current-scene source screenshots exist and are blocked as primary world art.
- `npm run build` was not run because no app/source files changed.
