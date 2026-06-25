# MVP-13 Four-Corner Scene Structure Repair

Status: Implemented, screenshot QA blocked
Date: 2026-05-29
Verdict: `revise`

## Purpose

Repair the failed MVP-11 visual approach by replacing the single-screenshot scene collapse and floating storefront overlays with a simplified four-corner intersection structure.

## Active Scene Confirmation

The active place set remains:

- Northwest corner: Greenpoint Deli.
- Northeast corner: McDonald's / quick service.
- Southwest corner: Dunkin' / coffee.
- Southeast corner: Citizens Bank / service-bank.
- Center/intersection context: Greenpoint G subway symbolic transit cue.

## Source Reference Availability

The four supplied corner screenshots are present in the repository:

- `docs/mvp-reference-images/source-01-northwest-corner.png`
- `docs/mvp-reference-images/source-03-northeast-corner.png`
- `docs/mvp-reference-images/source-04-southwest-corner.png`
- `docs/mvp-reference-images/source-05-southeast-corner.png`

MVP-13 uses these files only to confirm the four-corner assignment. They are not used as exact facade evidence, texture sources, signage sources, station-geometry evidence, or production art references.

## Implementation Summary

- Removed the current scene's dependency on a single southwest-corner raster as the primary scene surface.
- Replaced screenshot-backed composition with a code-native four-corner review scene.
- Added one integrated building/storefront zone per corner.
- Kept in-scene storefront signs generic: `DELI`, `BITES`, `COFFEE`, and `SERVICE`.
- Preserved real business identity only in target labels, cards, source metadata, and the target rail.
- Preserved the Greenpoint G subway as a symbolic intersection/transit cue, not exact station geometry.
- Preserved the existing hover, select, card, target rail, QA outline, pan, zoom, and responsive code paths.

## Per-Place Treatment

| Place | Corner | MVP-13 Treatment | Boundary |
| --- | --- | --- | --- |
| Greenpoint Deli | NW | Generic deli/corner-store mass with awning bays | Identity/presence only; no exact facade/signage/frontage claim |
| McDonald's | NE | Generic quick-service storefront mass | Identity/presence only; no exact brand signage or facade claim |
| Dunkin' | SW | Generic coffee storefront mass | Identity/presence only; no exact brand signage or facade claim |
| Citizens Bank | SE | Generic service-bank/storefront mass | Identity/presence only; no exact facade/signage/frontage claim |
| Greenpoint G subway | Center | Symbolic transit cue | Transit context only; no exact stair, entrance, elevator, or station geometry |

## Self-Audit Against MVP-11 Failures

1. No single-screenshot collapse: Pass in source. The active MVP-13 scene no longer imports or renders one corner screenshot as the primary scene surface.
2. No floating SVG storefront overlay: Pass in source. Storefront treatments are drawn as integrated corner building zones within the intersection composition, not as annotation icons pasted over a screenshot.
3. Correct NW/NE/SW/SE target anchoring: Pass in source. The four business targets are assigned to NW, NE, SW, and SE respectively.

## Screenshots

No screenshots were created in this environment.

Attempted:

- `npm run dev -- --port 5173`

Result:

- Failed with `listen EPERM` on `127.0.0.1:5173`.

MVP-12 already confirmed that in-app browser `file://` and `data:` preview routes are blocked by Browser URL policy, and elevated local-server execution is rejected by session approval policy. MVP-13 did not use a policy workaround.

## Verification

- Four source corner screenshots: present.
- `npm run build`: passed.
- `git diff --check`: passed.

Build note:

- Vite still reports the existing large chunk warning. No package/config changes were made.

## Acceptance Status

Met in source:

- Four-corner structure exists.
- Each business target is anchored to the requested corner.
- Storefront treatments are integrated into scene geometry.
- Card/source copy continues to communicate identity/presence-only and fictional-safe limitations.
- Symbolic subway cue remains generic.
- Build passed.

Not fully met in this environment:

- Desktop/mobile screenshot capture.
- Browser-based hover/select/card/pan/zoom verification.

## Recommended Next Task

Recommended next task: run MVP-14 Four-Corner Browser Screenshot QA in an environment where the local app can bind to localhost, or provide an approved app preview URL for the in-app browser.

Visual Polish / Optional Ambient remains blocked until the four-corner repair is visually reviewed.
