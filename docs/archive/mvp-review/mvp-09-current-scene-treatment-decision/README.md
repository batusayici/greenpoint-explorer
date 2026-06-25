# MVP-09 Current Scene Treatment Decision Brief

Status: Complete for Batu/ChatGPT review
Date: 2026-05-29
Verdict: `proceed`

## Purpose

This decision brief chooses the treatment path for the current interactable Greenpoint Ave / Manhattan Ave scene before any art translation or visual polish.

It is a docs-only decision brief. It does not modify app/source files, create visual assets, create screenshots, approve exact real-inspired facade art, approve production assets, approve public-release real-place data, or authorize Google/Street View-style imagery as facade evidence.

## Active Scene Confirmation

Current active scene/place set confirmed from `src/mvpPlaceData.js`:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

No mismatch was found between the active source data, MVP-06 correction, MVP-08 evidence packet, MVP scope, plan, and current brief.

## MVP-08 Constraint Summary

MVP-08 returned verdict `revise`.

Key constraint:

- No current business is eligible for real-inspired facade art translation yet.
- Greenpoint G subway is eligible only for symbolic transit cue treatment, not exact real-inspired station geometry.
- LiveXYZ remains identity/presence evidence only.
- Google/Street View-style imagery remains blocked as facade/art evidence.
- The current scene can move forward only if visual treatment stays fictional-safe, generic, placeholder, or context-only unless additional evidence is approved.

## Treatment Options Considered

### A. Evidence Acquisition First

Pause implementation until approved facade references, address/parcel/building evidence, storefront/frontage verification, and branded-treatment decisions are collected.

Pros:

- Safest path for future real-inspired facade accuracy.
- Reduces rework if exact real-place representation becomes the goal.

Cons:

- Slows the MVP's core goal of testing an interactable Greenpoint-feeling scene.
- Current visual polish remains blocked indefinitely if approved facade references are slow to gather.
- Treats exact real-place fidelity as a prerequisite even though the approved visual direction is fictional-safe.

Decision:

- Do not choose as the immediate MVP path.
- Keep as a later upgrade lane for any place Batu wants to make more real-inspired.

### B. Fictional-Safe / Generic Translation Now

Preserve correct business identity/cards, but use non-exact generic storefront art treatments where facade evidence is insufficient.

Pros:

- Fastest honest path toward an interactable scene.
- Preserves current place identity without pretending facade accuracy.
- Matches the approved fictional-safe visual direction.

Cons:

- Requires careful UI copy so names/cards do not imply exact facade, frontage, address, or station geometry.
- Branded-chain visuals must avoid literal trade dress unless Batu later approves it.

Decision:

- Use this for the four business visual treatments.

### C. Cut / Omit Real Businesses

Remove business identities until evidence is stronger.

Pros:

- Lowest risk of unsupported real-place representation.
- Simplifies art direction.

Cons:

- Weakens local specificity and first-click interest.
- Throws away the MVP-06 correction and current-scene identity work.
- Overcorrects when identity/presence can be retained with clear constraints.

Decision:

- Do not choose as the main path.
- Keep omission available for any individual place that crowds the scene or fails Batu review.

### D. Mixed Treatment

Preserve correct business identity/cards, use fictional-safe or generic visual treatments for businesses, use symbolic cue treatment for Greenpoint G subway, and reserve real-inspired upgrades for later approved evidence.

Pros:

- Fastest honest path.
- Keeps the current interactable place set.
- Avoids exact facade, exact address, storefront order, and station-geometry claims.
- Allows later evidence-backed upgrades without blocking the MVP.

Cons:

- Requires strong review labeling and card copy constraints.
- Some real-brand expectations may need fictionalization, especially McDonald's and Dunkin'.

Decision:

- Chosen path.

## Chosen Treatment Path

Chosen path: D. Mixed treatment.

Implementation meaning for the next approved batch:

- Preserve current place identities in labels/cards as identity/presence-only review data.
- Use fictional-safe or generic storefront visuals for Greenpoint Deli, McDonald's, Dunkin', and Citizens Bank.
- Avoid literal real-world facade replication, exact signage, exact materials, exact brand trade dress, exact address placement, exact storefront order, and exact frontage claims.
- Use symbolic transit cue treatment for Greenpoint G subway.
- Reserve real-inspired upgrades for later only after approved non-Google facade/art references and location evidence exist.

This path is a `proceed` verdict for fictional-safe/generic translation only. It is not a proceed verdict for exact real-inspired facade art.

## Per-Place Treatment Decision

### Greenpoint Deli

Treatment decision:

- Preserve as a current-scene identity/card label.
- Use fictional-safe generic deli/corner-store visual treatment.

Allowed:

- Generic deli cues such as a compact storefront, neutral awning-like rhythm, small non-literal sign panel, and authored card/hotspot treatment.
- Identity/presence-only card language with source constraints visible.

Blocked:

- Exact Greenpoint Deli facade, exact sign, exact colors/materials, exact entrance, exact frontage/order, exact address placement, or production-ready real card copy.

MVP-10 implementation note:

- Translate as an authored fictional-safe deli marker/storefront, not a real facade.

### McDonald's

Treatment decision:

- Preserve as a current-scene identity/card label.
- Use fictionalized quick-service storefront treatment.

Allowed:

- Generic quick-service cues that support category readability.
- Non-literal sign geometry and non-branded storefront rhythm.
- Identity/presence-only card language with source constraints visible.

Blocked:

- Literal arches, real trade dress, exact McDonald's facade, exact signage, exact colors/materials, exact entrance, exact frontage/order, exact address placement, or production-ready real card copy.

MVP-10 implementation note:

- Translate as a fictionalized quick-service storefront. Do not draw a real McDonald's facade.

### Dunkin'

Treatment decision:

- Preserve as a current-scene identity/card label.
- Use fictionalized coffee/quick-service storefront treatment.

Allowed:

- Generic coffee-shop/quick-service cues.
- Non-literal sign panel, simple window/door rhythm, and category-safe detail.
- Identity/presence-only card language with source constraints visible.

Blocked:

- Literal Dunkin' trade dress, exact colors, exact sign, exact facade, exact entrance, exact frontage/order, exact address placement, or production-ready real card copy.

MVP-10 implementation note:

- Translate as a fictionalized coffee storefront. Do not draw a real Dunkin' facade.

### Citizens Bank

Treatment decision:

- Preserve as a current-scene identity/card label if it supports the interaction set.
- Use fictionalized bank/corner-service visual treatment or context-only treatment.

Allowed:

- Generic civic/commercial corner massing.
- Non-literal bank/service cues such as reserved windows, neutral sign panel, or context storefront presence.
- Identity/presence-only card language with source constraints visible.

Blocked:

- Literal Citizens Bank signage, exact facade massing, exact corner placement, exact entrance, exact frontage/order, exact address placement, or production-ready real card copy.

MVP-10 implementation note:

- Translate as a fictionalized bank/service storefront only if it helps scene balance; otherwise keep as a context card/marker without visual emphasis.

### Greenpoint G Subway

Treatment decision:

- Preserve as a symbolic transit anchor.
- Use symbolic G subway cue treatment only.

Allowed:

- G-line green identity cue.
- Generic subway sign/globe/elevator/street-anchor language if clearly symbolic.
- Context card or anchor language that avoids exact mapping.

Blocked:

- Exact stair placement, exact elevator placement, exact access-point geometry, exact station footprint, exact corner placement, or official-map implications.
- Google/Street View-style imagery as station geometry or visual reference.

MVP-10 implementation note:

- Translate as a symbolic transit anchor integrated with the scene. Do not draw exact station infrastructure.

## Explicitly Blocked

MVP-09 does not authorize:

- Exact real-inspired facade art for Greenpoint Deli, McDonald's, Dunkin', or Citizens Bank.
- Exact Greenpoint G subway station geometry.
- Google/Street View-style imagery as facade, station, extraction, texture, generation, or training evidence.
- LiveXYZ as facade, address, frontage, entrance, exact placement, or art evidence.
- Literal chain trade dress or brand marks without Batu approval.
- Exact addresses, exact storefront order, exact frontage, exact entrances, exact materials, or exact colors.
- Public-release real-place cards or final factual card copy.
- New production assets, production asset pipeline, source-of-truth pipeline, live data, scraping, backend, CMS, CI, deployment, staging, or commit.

## What MVP-10 Should Implement

Recommended MVP-10 task: Fictional-Safe Current Scene Art Translation Brief / Implementation Boundary.

MVP-10 should define and, only if explicitly approved, implement the next review-only prototype batch:

- Keep the current five interactable targets.
- Preserve current identity/presence-only card constraints and source metadata.
- Replace or revise the scaffold visual treatment with fictional-safe/generic storefront treatment for the four businesses.
- Add symbolic Greenpoint G subway cue treatment without exact station geometry.
- Maintain or improve existing hover/click/tap/card behavior.
- Keep visible truth-safety language that prevents facade/address/station overclaiming.
- Produce review screenshots and a self-audit if implementation is opened.

MVP-10 must not:

- Create exact real-inspired facades.
- Use Google/Street View-style imagery as facade evidence.
- Treat LiveXYZ as visual evidence.
- Add visual polish or ambient loops beyond the explicitly approved translation scope.

## Final Verdict

Verdict: `proceed`.

Proceed with mixed treatment for the next approved batch:

- Businesses: fictional-safe/generic visual translation with identity/presence-only cards.
- Greenpoint G subway: symbolic transit cue treatment only.
- Real-inspired exact facade/station upgrades: blocked until approved evidence exists.

## Recommended Next Task

Recommended next task: MVP-10 Fictional-Safe Current Scene Art Translation Brief / Implementation Boundary.

The next brief should specify allowed files, public-interface/module-boundary status, visual artifact class, required output format, review screenshots, self-audit criteria, and the exact guardrails that prevent generic storefront visuals from being mistaken for real facade evidence.
