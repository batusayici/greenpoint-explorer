# Current Execution Brief - MVP-22 Closed

Status: `MVP-22 Grillpoint / Greenpoint Ave G Real Corner Vertical Slice` is accepted as complete and closed. MVP-22C polish and screenshot QA are complete.

Owner boundary: Batu accepted MVP-22C as complete on 2026-05-31. Batu owns whether and when to open MVP-29 QA/demo freeze from a later current brief.

Codex must not proceed into MVP-29 QA/demo freeze, another renderer pass, raster regeneration, visual production expansion, exact facade reproduction, NE/SE/SW corners, production asset work, staging, or another commit unless Batu opens a later current brief.

## Closed Outcome

Completed sequence:

- `MVP-22 Grillpoint / Greenpoint Ave G Real Corner Vertical Slice`
- `MVP-22 Stage B Raster-First Vertical Slice`
- `MVP-22C Stage B Acceptance Polish + Screenshot QA Recovery`

Artifacts:

- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/STAGE_B_IMPLEMENTATION_BRIEF.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/generated/mvp-22-grillpoint-real-corner-slice.png`
- `src/assets/review-only/mvp-22-grillpoint-real-corner-slice.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/desktop-overview.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/desktop-selected-grillpoint-card.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/desktop-hover-focus.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/qa-outline-hotspot.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/mobile-selected-card-containment.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/pan-zoom-stress.png`

Summary:

- MVP-22C is accepted as complete.
- The final MVP-22 raster-first real-corner slice is preserved.
- The raster was not regenerated during MVP-22C.
- Earlier readable-sign candidates remain unused because their generated text was malformed.
- The app card label remains `Grillpoint Deli`.
- Visible factual card copy is tightened for product readability while staying truth-safe.
- Greenpoint Av G remains nearby/adjacent transit context only.
- The active data set has one factual Grillpoint card for this slice.
- The hotspot/QA outline is narrowed to the storefront/corner slice.
- Required MVP-22 screenshot evidence was captured without changing app code, raster art, card copy, hotspot data, styling, dependencies, or product scope.

## Screenshot QA Status

Screenshot QA is complete for MVP-22 review.

Captured screenshots:

- `desktop-overview.png`
- `desktop-selected-grillpoint-card.png`
- `desktop-hover-focus.png`
- `qa-outline-hotspot.png`
- `mobile-selected-card-containment.png`
- `pan-zoom-stress.png`

Environment notes:

- Local Vite ran on `http://127.0.0.1:5174/` because `5173` was already in use, and `curl -I` returned HTTP 200.
- `npm run build` passes.
- Local Playwright and Puppeteer are not installed, and no package installation was performed.
- Direct Chrome headless still failed before producing a PNG in this environment, including with safe launch flags and an explicit temp user-data directory.
- Direct Firefox headless was also unavailable for screenshot output in this sandboxed command path.
- The reliable capture route was the Codex in-app browser connected to the local Vite server.

## Active Scene / Evidence State

Active scene/place set:

- `Grillpoint Deli` only as the MVP-22C real-corner card.

MVP-22 selected slice:

- One corner only: NW 903 Manhattan Ave / Grillpoint Deli candidate.
- Factual card label: `Grillpoint Deli`.
- Address copy: `903 Manhattan Ave, Brooklyn, NY 11222`.
- Category: `Deli / food retail`.
- Source URL for factual card copy: `https://www.restaurantji.com/ny/brooklyn/grillpoint-deli-/`.
- Supporting transit source URLs:
  - `https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible`
  - `https://www.mta.info/accessibility/stations`
- Last verified date: `2026-05-30`.
- Subway treatment: Greenpoint Ave G as nearby/adjacent transit context only.

## Next Eligible State

Next recommended action:

- Prepare `MVP-29 QA / Demo Freeze` as the next proposed current brief.

MVP-29 may verify:

- QA checklist only.
- Demo-readiness notes.
- Accepted limitations.
- Screenshot review references.
- Truth-safety review.
- Interaction smoke-check review.

MVP-29 must not include:

- New visual production.
- New corners.
- Raster regeneration.
- Code-native storefront/sign/facade art.
- Live data, scraping, backend, CMS, analytics, deployment, CI, or broad map systems.
- Production or public-release claims.

MVP-29 is not implemented by this closed brief.

## Still Forbidden Unless A Later Brief Opens Scope

- MVP-29 QA/demo freeze implementation.
- Raster regeneration.
- Earlier readable-sign candidate use.
- Another renderer pass.
- Visual production expansion.
- NE / SE / SW corner additions or parked NE/SE/SW reference use.
- Four-corner integration.
- Code-native storefront, building, road, sign, facade, prop, or texture art as a primary world surface.
- New framework, renderer, package, build tooling, routing system, map system, architecture boundary, or public module/interface.
- Production visual assets, production asset direction, or production asset pipeline.
- Production real-place cards.
- Exact facade, exact address placement, exact storefront frontage/order, exact station geometry, final factual card copy beyond this review slice, or public-release claims.
- A claim that the subway entrance is directly in front of Grillpoint without stronger evidence and Batu approval.
- Scraping, live data pipeline, backend, CMS, analytics, deployment, CI, persistence, or broad data pipeline.
- Google/Street View/3D Tiles-derived stored imagery, extraction, tracing, texture reuse, training input, generation input, or facade-reference use.
- LiveXYZ-derived facade/art use.

## Decisions Reserved For Batu

- Decide whether to open MVP-29 QA/demo freeze after this MVP-22 closeout commit.
- Decide whether stronger evidence later supports any exact `in front of Grillpoint` station relationship.
