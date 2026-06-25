# MVP-10 Fictional-Safe Current Scene Art Translation Brief

Status: Complete for Batu/ChatGPT review
Date: 2026-05-29
Verdict: `proceed-to-mvp-11-boundary`

## Purpose

Translate the MVP-09 mixed-treatment decision into a precise boundary for the next implementation pass.

This brief is docs-only. It does not modify app/source files, visual assets, screenshots, package/config files, or production systems.

## Chosen Treatment Boundary

MVP-09 chose mixed treatment:

- Preserve current business identities in labels/cards as identity/presence-only review data.
- Use fictional-safe or generic visual treatments for Greenpoint Deli, McDonald's, Dunkin', and Citizens Bank.
- Use symbolic transit cue treatment for Greenpoint G subway.
- Keep exact real-inspired facade art and exact station geometry blocked until approved evidence exists.

## Allowed In MVP-11

MVP-11 may implement a review-only fictional-safe translation pass that:

- Keeps the current five interactable targets.
- Preserves existing pan/zoom, hover/focus, click/tap, selected-card, target rail, and QA hotspot behavior.
- Revises visible scene treatment so the four businesses read as fictional-safe/generic category cues, not exact real facades.
- Adds or adjusts symbolic Greenpoint G subway cue treatment without exact station geometry.
- Preserves identity/presence-only source metadata and visible truth-safety constraints.
- Updates review-only self-audit documentation.
- Produces review screenshots if the MVP-11 brief explicitly opens implementation.

Allowed MVP-11 file scope, if implementation is approved:

- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/mvp-review/mvp-11-current-scene-fictional-safe-translation-pass/README.md`
- `docs/review-screenshots/mvp-11-current-scene-fictional-safe-translation-pass/`
- Required control-doc reconciliation files.

## Still Blocked

MVP-11 must not introduce:

- Exact real-inspired facade art.
- Exact Greenpoint G subway station geometry.
- New real-place address, storefront order, frontage, entrance, or active-status claims.
- Google/Street View-style imagery as facade/art evidence.
- LiveXYZ as facade/art/address/frontage/placement evidence.
- Literal chain trade dress, brand marks, or exact real signage without Batu approval.
- Production assets, production asset pipeline, generated asset pipeline, or broad visual system.
- Live data, scraping, automated refresh, backend, CMS, CI, deployment, staging, or commit.
- Visual Polish / Optional Ambient work beyond the fictional-safe translation boundary.

## Eligible Scene Elements

Eligible for fictional-safe/generic translation:

- Greenpoint Deli: generic deli/corner-store cue.
- McDonald's: fictionalized quick-service cue, no literal brand marks or trade dress.
- Dunkin': fictionalized coffee/quick-service cue, no literal brand marks or trade dress.
- Citizens Bank: fictionalized bank/service cue or reduced context treatment.

Eligible for symbolic cue treatment:

- Greenpoint G subway: symbolic G subway anchor only.

Not eligible:

- Any exact facade, exact sign, exact entrance, exact frontage/order, exact address placement, exact station access point, or exact station footprint.

## Symbolic Subway Cue Constraints

MVP-11 may use:

- G-line color cue.
- Generic subway sign/globe/elevator/street-anchor language.
- Context-card language that says station identity/context only.

MVP-11 must not imply:

- Exact stair location.
- Exact elevator location.
- Exact entrance side.
- Exact station footprint.
- Official MTA map accuracy.

## Data And Card Copy Constraints

Cards and labels must:

- Keep LiveXYZ links as identity/presence evidence only for the four businesses.
- Keep MTA sources as transit identity/context only.
- Preserve or strengthen disclaimers that the scene is unofficial, authored, and non-production.
- Avoid exact address, facade, storefront order, entrance, frontage, active-status finality, production placement, or public-release claims.
- Avoid ratings, reviews, endorsements, partnership claims, promotional language, and fictional stories attached to real businesses.

## MVP-11 Acceptance Criteria

MVP-11 passes review only if:

- The active scene still contains Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- The four businesses use fictional-safe/generic category visuals only.
- The subway uses symbolic cue treatment only.
- No exact real facade, exact station geometry, or blocked source use is implied.
- Existing interaction behavior still works.
- Selected cards still show identity/presence-only and facade/art-insufficient constraints.
- Review screenshots and a self-audit exist if implementation is opened.
- `git diff --check` passes.

## Stop Conditions

Codex must stop and report instead of implementing if:

- The active scene/place set differs from the five-place set above.
- The implementation would require new visual assets, image generation, or production asset pipeline work.
- The implementation would use Google/Street View-style imagery as facade/art evidence.
- The implementation would treat LiveXYZ as facade/art/address/frontage evidence.
- A requested visual treatment depends on exact real-world facade, signage, entrance, frontage, or station geometry.
- Required file scope expands beyond the MVP-11 approved boundary.
- App/source changes are requested before MVP-11 explicitly opens implementation.

## Recommended Next Task

Recommended next task: MVP-11 Current Scene Fictional-Safe Translation Pass.

MVP-11 should be the first implementation pass after this boundary is accepted. It should translate the current scene to fictional-safe/generic business visuals plus symbolic subway cues, while preserving current interaction behavior and truth-safety language.
