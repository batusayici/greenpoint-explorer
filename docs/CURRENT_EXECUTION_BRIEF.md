# Current Execution Brief - MVP-06 Corrective Scene Translation And Data Realignment

Status: Proposed next implementation brief; pending Batu/ChatGPT acceptance before execution.
Owner boundary: Codex may execute only the implementation scope below after this brief is accepted. This brief-writing batch does not execute MVP-06.

## Context

MVP-05 Source-Of-Truth Validation Spike is complete and accepted with verdict `revise`.

Corrected current scene/place set:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

LiveXYZ links are identity/presence evidence only. They are not approved facade/art references and do not approve exact address, storefront frontage, entrance geometry, active-status finality, production placement, or public card copy.

Google/Street View-style reference imagery remains blocked as facade evidence. Visual Polish / Optional Ambient remains blocked.

Current source read:

- `src/mvpPlaceData.js` still contains stale previous-scene active data for Peter Pan, Sweetgreen, and former Meserole Theater, plus deferred Captured, Polka Dot, Karczma, and Brouwerij Lane.
- `src/App.jsx` renders `mvpScene.targets` and card metadata directly.
- `src/PlaceholderWorld.jsx` renders target markers, labels, hover/click/tap, pan/zoom, and QA hotspot outlines from the supplied scene data.
- `src/placeholderScene.js` remains older fictional placeholder data and is not the active app import.

Active-scene guardrail:

- Before implementation, Codex must confirm the active scene/place set from current app/data files and list that set in the task output.
- Previous-scene entities are archival/reference-only unless this brief explicitly names them for removal.
- This brief explicitly identifies the current app/data disagreement and authorizes correcting it by replacing stale active UI/data with Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- If any additional disagreement appears among control docs, review artifacts, and app/data files, Codex must stop and report it before widening scope.

## Purpose

Align the review-only prototype with the corrected MVP-05 source boundary while preserving MVP-04 interaction behavior.

The implementation should make the prototype usable as a scaffold for review without implying real facade accuracy, production data approval, exact storefront placement, exact station geometry, or approved visual polish.

## Allowed Files For MVP-06 Implementation

Codex may modify only:

- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/`
- `docs/mvp-review/mvp-06-corrective-scene-translation-and-data-realignment/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Codex may read `src/placeholderScene.js`, but should not modify it unless the implementation discovers a direct active-app contradiction that cannot be resolved in the allowed active files.

## Required Implementation

1. Preserve MVP-04 interaction behavior:
   - Pan and zoom.
   - Hover/focus.
   - Click/tap selection.
   - Selected card behavior.
   - Target rail behavior.
   - QA hotspot outline toggle.
   - Basic mobile containment.

2. Update active displayed place/card data to the corrected current set:
   - Greenpoint Deli.
   - McDonald's.
   - Dunkin'.
   - Citizens Bank.
   - Greenpoint G subway.

3. Remove stale previous-scene businesses from active current-scene data/UI:
   - Peter Pan Donut & Pastry Shop.
   - Sweetgreen Greenpoint.
   - Former Meserole Theater.
   - Captured Record Shop.
   - Polka Dot.
   - Karczma.
   - Brouwerij Lane.

4. Keep LiveXYZ links as identity/presence source references only:
   - Greenpoint Deli: `https://embed.livexyz.com/venue/5526f8acd8ca7000030002e4`
   - McDonald's: `https://embed.livexyz.com/venue/5511c3063d42bd0003001146`
   - Dunkin': `https://embed.livexyz.com/venue/5b50eecca3e3ee0003e4e0db`
   - Citizens Bank: `https://embed.livexyz.com/venue/64893028145f5b00018b86a7`

5. Clearly distinguish evidence status in data and visible cards:
   - `identity/presence validated`
   - `facade/art reference insufficient`
   - `fictional-safe or placeholder treatment`

6. Prevent UI overclaiming:
   - Do not label any business card as exact, verified, production-ready, or facade-accurate.
   - Do not show exact storefront/frontage/order claims.
   - Do not imply Google/Street View-derived facade evidence.
   - Do not present LiveXYZ as facade/art reference.
   - Keep the scene plate described as a non-production scaffold, not facade evidence.

7. Keep the scene usable as a prototype scaffold:
   - Maintain five selectable targets.
   - Marker and bounds positions may be adjusted only enough to support interaction review.
   - Any position/bounds changes must be labeled authored scaffold positions, not exact placement.

8. Produce review screenshots after implementation:
   - Default overview.
   - Selected Greenpoint Deli card.
   - Selected Greenpoint G subway card or context card.
   - QA hotspot outline mode.
   - Mobile selected-card containment.

9. Produce a short self-audit:
   - Create `docs/mvp-review/mvp-06-corrective-scene-translation-and-data-realignment/README.md`.
   - Map each visible place/card to MVP-05 evidence status.
   - Confirm stale previous-scene businesses are no longer active in current-scene UI.
   - Confirm LiveXYZ is identity/presence only.
   - Confirm facade/art reference is insufficient for the four business candidates.
   - Confirm Visual Polish / Optional Ambient remains blocked.

## Forbidden

Do not add or modify:

- Visual polish.
- Optional ambient work.
- New facade art.
- New generated visual assets.
- New visual assets of any kind.
- Live scraping.
- Live data fetches.
- Automated refresh or broad imports.
- Google/Street View/Google Maps/Google 3D Tiles-derived facade references, extraction inputs, generation inputs, texture sources, or training inputs.
- Production asset pipeline work.
- Production/public-release claims.
- Broad map expansion.
- Backend/CMS/persistence/accounts/analytics.
- CI/deployment/package/config/tooling changes.
- Staging or commit.

## Public Interfaces / Module Boundaries

This MVP-06 implementation may adjust the local shape/content of `mvpScene` inside `src/mvpPlaceData.js` only as needed for the existing app to render corrected evidence status.

It must not create a production data contract, public module API, runtime schema, source-of-truth pipeline, renderer boundary, map system, routing system, or asset pipeline.

If additional fields are added, they must remain internal review/demo-safe fields and be documented in the MVP-06 self-audit.

## Verification Required

Run the fastest useful feedback loop:

- `npm run build`
- Browser smoke check of the local prototype.
- Click/tap or browser check for at least Greenpoint Deli and Greenpoint G subway selected states.
- QA hotspot outline check.
- Mobile selected-card containment check.
- `git diff --check`
- `git diff --stat`
- `git status --short`

## Acceptance Criteria

- Active UI shows the corrected current scene/place set.
- Stale previous-scene businesses are not visible as active current-scene targets, cards, source links, or target rail items.
- Cards visibly communicate identity/presence status and facade/art-reference insufficiency.
- The prototype does not imply real facade accuracy, exact storefront placement, exact station geometry, production data, or public release readiness.
- MVP-04 interaction behavior remains intact.
- Required screenshots exist under `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/`.
- MVP-06 self-audit exists and maps each visible place/card to MVP-05 evidence status.
- Plan, current brief, and ledger are reconciled after implementation.

## Decisions Still Reserved For Batu

- Whether any current business becomes a real card rather than scaffold/context/fictional-safe treatment.
- Whether branded chain identities should remain literal, be fictionalized, or be omitted.
- Whether any non-Google storefront-specific visual references are approved later.
- Any exact address, frontage/order, entrance, facade, or station geometry approval.
- Any visual polish, optional ambient, production asset, production data, public-interface, architecture, CI/deployment, or release decision.
