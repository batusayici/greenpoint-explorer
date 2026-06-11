# Phase 4M-R10G Franklin Corner Frontage Wrap Fix

Status: Ready for Batu visual review  
Date: 2026-06-11

## Scope

R10G is a QA-only corner-frontage wrap pass. It preserves the R10B/R10F target BIN mapping, the corrected R10E Franklin-local scene frame, source-footprint-based placement, normal-mode protection, and the GLB assessment block.

No R11, R12, Manhattan, production mode, GLB comparison, GLB tuning, new GLB ingestion, asset polish, production claim, exact storefront, exact entrance, exact signage, active-status, or public/product work is opened.

## Diagnosis

| Target | Expected Greenpoint frontage | Expected Franklin frontage | Expected corner condition | Current rendered mismatch | Root cause | Exact fix |
| --- | --- | --- | --- | --- | --- | --- |
| Sereneco / BIN `3337033` | North side of Greenpoint; south-facing low restaurant/cafe frontage. | West/across Franklin; east-facing active return where evidence supports it. | Low northwest restaurant corner, with the larger adjacent/background source mass visually separated from the active corner frontage. | R10F attached most detail to the Greenpoint edge and let the larger source footprint read as the main Sereneco body. | Building-level facade assignment selected only the nearest Greenpoint edge. | Add Greenpoint, Franklin, side-return, and corner-wrap segments; keep active corner frontage distinct from the muted source-footprint context body. |
| Premier / Franklin Organic / BIN `3322608` | South side of Greenpoint; north-facing grocery/storefront frontage. | West/across Franklin; east-facing retail return with upper brick/window rhythm. | Strong southwest retail corner wrapping from Greenpoint onto Franklin. | R10F made Greenpoint active but left Franklin-facing frontage too empty. | Side return was a small generic slab, not a street-facing frontage segment. | Render a full Franklin frontage segment and a corner retail wrap using the red-brick/grocery/cornice cue grammar. |
| Sonny's Corner / BIN `3064811` | South side of Greenpoint; north-facing dark storefront/bar base. | East/corridor side of Franklin; west-facing active return. | Southeast corridor-side corner with dark awning/base wrapping both streets. | R10F placed Sonny correctly but still read as a one-face Greenpoint module. | Facade assignment was building-level and Greenpoint-edge-only. | Render active Greenpoint and Franklin segments, continue upper window rhythm around the corner, and add a dark corner-wrap module. |

## Evidence Binding

| Target | Rendered cue | Greenpoint segment evidence | Franklin segment evidence | Corner-wrap evidence | Claim status |
| --- | --- | --- | --- | --- | --- |
| Sereneco | `p4e1-franklin-weathered-brick-glass-base` | `franklin-northwest1.jpeg`, `franklin-northwest2.jpeg` | `franklin-northwest1.jpeg` | `franklin-northwest1.jpeg`, `franklin-northwest2.jpeg` | QA-only, manual draft, evidence-informed, not exact. |
| Premier / Franklin Organic | `p4e1-franklin-red-brick-cornice-corner` | `franklin-southwest-wide.jpeg`, `franklin-southwest-zoom.jpeg` | `franklin-southwest-wide.jpeg`, `franklin-southwest-zoom.jpeg` | `franklin-southwest-wide.jpeg`, `franklin-southwest-zoom.jpeg` | QA-only, manual draft, evidence-informed, not exact. |
| Sonny's Corner | `p4e1-franklin-dark-brick-awned-base` | `franklin-southeast-wide.jpeg`, `franklin-southeast-zoom.jpeg` | `franklin-southeast-wide.jpeg`, `franklin-southeast-zoom.jpeg` | `franklin-southeast-wide.jpeg`, `franklin-southeast-zoom.jpeg` | QA-only, manual draft, evidence-informed, not exact. |

## Runtime Change

- Added `Franklin Wrap` / `franklin_rendered_wrap_truth` QA focus.
- Added source-footprint edge selection for `nearest_greenpoint_axis_edge` and `nearest_franklin_axis_edge`.
- Added active facade modules on both street-facing edges for each target.
- Added a physical `shared_greenpoint_franklin_corner` wrap module where the two frontage edges meet.
- Added separate frontage highlights for Greenpoint, Franklin, and corner-wrap conditions.
- Kept old stylized target bodies suppressed in this focus view.
- Kept the R10 GLB disabled in this proof path.
- Added a QA-only browser self-capture path: `r10gCapture=1` cycles the five R10G camera presets, reads the rendered WebGL canvas from inside the page, and posts PNG data to the dev-only `/__r10g-capture` Vite endpoint.
- Added a fallback capture tray with browser download links if the dev server has not been restarted with the capture endpoint.

## Screenshot Tooling Diagnosis

| Failure layer | Symptom | Root cause | Fix |
| --- | --- | --- | --- |
| Shell HTTP access | `curl` to `127.0.0.1:5190` fails with `Operation not permitted` even while `lsof` shows Vite listening. | Codex shell sandbox cannot connect to localhost. | Browser self-capture runs inside the already-open page and posts to same-origin Vite, so Codex shell networking is not required. |
| Headless browser launch | Playwright/Chromium exits with `MachPortRendezvousServer ... Permission denied`. | macOS sandbox blocks launching Chromium from this tool process. | No new browser process is required. |
| Desktop screenshot | `screencapture` fails with `could not create image from display 0`. | Display capture permission is unavailable to the tool process. | The page exports the WebGL canvas directly. |

Capture URL after restarting the dev server so the Vite endpoint is active:

`http://127.0.0.1:5190/?qa=1&qaLayerFocus=franklin_rendered_wrap_truth&r10HeroAsset=0&camera=franklinRenderedWrapTruthTopDown&r10gCapture=1&v=r10g-capture`

## Review Artifacts

Saved screenshot paths:

- `docs/review-screenshots/phase-4m-r10g-franklin-corner-frontage-wrap/franklin-rendered-wrap-truth-top-down-r10g.png`
- `docs/review-screenshots/phase-4m-r10g-franklin-corner-frontage-wrap/franklin-rendered-wrap-truth-oblique-r10g.png`
- `docs/review-screenshots/phase-4m-r10g-franklin-corner-frontage-wrap/franklin-rendered-wrap-truth-premier-r10g.png`
- `docs/review-screenshots/phase-4m-r10g-franklin-corner-frontage-wrap/franklin-rendered-wrap-truth-sonny-r10g.png`
- `docs/review-screenshots/phase-4m-r10g-franklin-corner-frontage-wrap/franklin-rendered-wrap-truth-sereneco-r10g.png`

Screenshot capture status: captured. Prior Codex-side Playwright/Chrome, localhost, and desktop capture attempts were blocked by sandbox/display permissions in this thread. R10G now includes a browser self-capture path plus dev-only save endpoint; the saved PNGs were generated in the browser and copied into the review-screenshot folder above.

## Visual Approval Readiness

The saved top-down screenshot establishes the Franklin x Greenpoint quadrant relationship and shows all three rendered bodies in the expected positions. Premier / Franklin Organic and Sonny's Corner read as active corner buildings with Greenpoint and Franklin frontage wraps. Sereneco remains the weakest review item: it is separated from the larger muted source-footprint context and has active Greenpoint/Franklin frontage segments, but the larger footprint mass still dominates the frame more than the low-rise restaurant frontage.

Artifact readiness passes for Batu review; visual approval remains Batu's decision.

## Remaining Gaps

- Batu visual review is required to decide whether the wrap mode now reads as real corner frontage.
- Sereneco's active corner frontage is visually present but less immediately legible than Premier and Sonny because the larger muted context footprint is still prominent.
- The Franklin Ave centerline/slab remains bounded review-only derived geometry because the current source packet lacks a Franklin Ave source centerline.
- GLB comparison/fidelity assessment remains blocked until R10G is visually approved.
