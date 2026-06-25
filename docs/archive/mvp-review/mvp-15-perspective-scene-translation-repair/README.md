# MVP-15 Perspective Scene Translation Repair

Status: Implemented in source; browser QA blocked
Date: 2026-05-29
Source status: `pending visual QA`
Implementation result: `ready-for-browser-review`
Browser QA status: `qa-blocked`

## Purpose

Repair the persistent MVP-13 visual failure. MVP-13 fixed the NW/NE/SW/SE assignment but still read as a top-down board-game diagram with repeated generic storefront tiles. MVP-15 translates the same fictional-safe four-corner logic into a stylized perspective street-scene composition.

## Active Scene Confirmation

The active place set remains:

- Northwest corner: Greenpoint Deli / food retail.
- Northeast corner: McDonald's / quick service.
- Southwest corner: Dunkin' / coffee.
- Southeast corner: Citizens Bank / service-bank.
- Intersection context: Greenpoint G subway symbolic cue.

## Source Reference Review

The four supplied corner screenshots were available and reviewed:

- `docs/mvp-reference-images/source-01-northwest-corner.png`
- `docs/mvp-reference-images/source-03-northeast-corner.png`
- `docs/mvp-reference-images/source-04-southwest-corner.png`
- `docs/mvp-reference-images/source-05-southeast-corner.png`

Use was limited to:

- Relative corner identity.
- Broad street/corner orientation.
- General massing and urban-feel cues.
- Category-safe placement logic.

Not used for:

- Exact facade copying.
- Exact signage.
- Exact storefront dimensions.
- Exact architectural reproduction.
- Texture, extraction, or production art reference.

## Implementation Summary

- Replaced the MVP-13 symmetrical four-corner diagram with a perspective street scene.
- Added receding road geometry, foreground crosswalk rhythm, sidewalk planes, and skyline/background massing.
- Replaced repeated storefront-template drawing with four distinct corner treatments:
  - NW deli: taller brick-like corner mass with embedded ground-floor deli storefront.
  - NE quick service: broad low modern volume with canopy/glass band and generic quick-service sign.
  - SW coffee: foreground mixed-use corner with warmer storefront, deeper roof plane, and coffee-category cues.
  - SE service-bank: taller civic/service mass with vertical window rhythm, heavier corner volume, and reserved service-bank storefront.
- Preserved real business names only in labels/cards/target rail/source metadata.
- Kept in-scene text generic: `DELI`, `BITES`, `COFFEE`, `SERVICE`, and `G`.
- Preserved the subway as a symbolic street-scene cue, not exact station geometry.

## Interaction And Data Boundary

Preserved:

- Hover target behavior.
- Select/card behavior.
- Target rail behavior.
- QA hotspot outline behavior.
- Pan/zoom code paths.
- Existing truth-safety card copy and source metadata.

Not changed:

- No package/config files.
- No new data acquisition.
- No new visual assets or image generation.
- No scraping.
- No production-accuracy claims.

## Self-Audit Against Recurring Failures

1. No screenshot overlay: Pass in source. The scene does not import or render the four reference screenshots as a surface.
2. No top-down diagram: Pass in source. Road, sidewalk, crosswalk, and building geometry use receding perspective planes.
3. No generic SVG storefront tiles: Pass in source. Each corner has a separate drawing path, massing, facade rhythm, and storefront treatment.
4. Correct four-corner anchoring: Pass in source. NW/NE/SW/SE assignments remain Greenpoint Deli, McDonald's, Dunkin', and Citizens Bank.
5. Scene-native storefront integration: Pass in source. Storefronts are embedded in corner building faces rather than floating over a board or screenshot.

## Browser QA

No screenshots were created in this environment.

Attempted:

- `npm run dev -- --port 5173`

Result:

- Failed with `listen EPERM` on `127.0.0.1:5173`.

This is recorded as `qa-blocked` only. It is not treated as a source implementation failure.

## Verification

- Source screenshots available and reviewed: yes.
- `npm run build`: passed.
- `git diff --check`: passed.

Build note:

- Vite still reports the existing large chunk warning. No package/config changes were made.

## Acceptance Status

Met in source:

- Scene is no longer authored as a top-down map.
- Storefronts are no longer one repeated rectangular tile template.
- Four distinct corner treatments exist.
- NW/NE/SW/SE assignments remain correct.
- Subway cue remains symbolic and generic.
- Existing app interaction paths are preserved in source.
- Build passes.

Not verified in this environment:

- Desktop browser rendering.
- Mobile browser containment.
- Hover/select/card/pan/zoom interaction smoke test.

## Recommended Next Task

Recommended next task: MVP-16 Perspective Scene Browser QA.

That task should capture desktop and mobile screenshots, smoke-check hover/select/card/pan/zoom behavior, and decide whether the MVP-15 source repair is visually acceptable. Visual Polish / Optional Ambient remains blocked until that review happens.
