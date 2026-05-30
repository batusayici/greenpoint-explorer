# Visual Integration Prototype Planning Brief

Status: Draft planning brief for Batu/ChatGPT review  
Date: 2026-05-28  
Scope: Documentation-only planning for a future visual-integration implementation batch

## Purpose

Define the next visual-integration implementation batch that raises the existing in-app prototype from schematic placeholder fidelity toward the approved Phase 4 Inked Indie / Compact Corner direction.

This brief plans a future batch only. It does not authorize implementation changes, app architecture changes, asset creation, image generation, production assets, real-place cards, factual copy, live data, CI, deployment, or public-interface design.

## Decision Recorded

The narrow placeholder prototype scaffold is approved only as an interaction scaffold.

This approval covers:

- Minimal React + Vite + PixiJS/canvas scaffold as an interaction proof.
- Placeholder authored scene as schematic plumbing only.
- Bounded pan/zoom, hover/click/tap selected-state card, and basic mobile containment as smoke-test interaction evidence.

This approval does not cover:

- Visual-direction-in-app approval.
- Art-direction validation from placeholder screenshots.
- Production assets or production asset direction.
- Production asset pipeline.
- Real-place cards, factual copy, exact facades, exact addresses, exact station geometry, live data, final public interfaces, CI, deployment, or production scalability/buildability.

## Visual Evidence Boundary

Screenshots from the narrow placeholder prototype setup batch are smoke-test evidence only. They may show that the local scaffold runs and that basic interactions work, but they must not be used to claim that the approved Phase 4 Inked Indie / Compact Corner direction is working in the app.

Future screenshots from the visual-integration batch may support Batu/ChatGPT review of whether the approved visual direction is beginning to survive inside the actual app surface. They still must not be framed as final art-direction validation, production asset approval, or proof of production buildability.

## Temporary Asset Allowance

A later implementation brief may authorize temporary visual-integration materials only if they remain clearly non-production and review-only.

Acceptable temporary categories for later approval may include:

- Hand-authored rough raster or canvas-drawn storefront pieces.
- Simplified ink-line, shadow, facade, awning, sign-shape, prop, texture, and paper/card UI treatments.
- Fictional-safe storefront identities using invented names or non-word marks, only if the later implementation brief explicitly allows readable placeholder text.
- Local-only placeholder data.

Temporary visual-integration materials must not include:

- Real business names.
- Exact addresses.
- Factual claims.
- Exact real facades.
- Exact station geometry.
- Active-business copy.
- Live data.

Temporary visual-integration assets are not production assets, not production asset direction approval, and not proof of production scalability or buildability.

## Review-Image Reference Rule

Phase 4 and Phase 4.5 review images may be referenced visually for comparison during planning and review.

They may not be imported into the app as production or prototype assets unless a later current execution brief explicitly approves a non-production reference workflow. If such a workflow is later approved, the images must be labeled as review-only references and must not become source assets, production assets, or production asset direction by implication.

## Screenshot And Artifact Location

Future visual-integration screenshots should be saved under:

```text
docs/review-screenshots/visual-integration-prototype/
```

The future implementation batch should capture, at minimum:

- Desktop selected-state view.
- Desktop hover or focus affordance view.
- Mobile selected-state containment view.
- One pan/zoom stress view if relevant to the batch.

This docs-only planning batch does not create the screenshot folder, screenshots, visual assets, or generated images.

## Non-Production Labeling Rule

All temporary assets, screenshots, and review notes from the future visual-integration batch must be labeled clearly as:

- Non-production.
- Review-only.
- Temporary integration material.
- Not final art.
- Not production asset direction.

Screenshot filenames or adjacent notes should include `non-production` or `review-only` so the boundary remains visible outside this document.

## Future Screenshot Fidelity Bar

The next in-app screenshots must show an app-surface step toward Inked Indie / Compact Corner rather than a schematic blockout.

The visual evidence should make these elements decision-relevant:

- Storefront massing.
- Inked outlines.
- Color relationships.
- Paper/card UI integration.
- Prop density.
- Selected-state treatment.
- Fictional-safe identity handling.

The scene may remain temporary and fictional-safe, but Batu should be able to judge from the screenshots whether the approved Phase 4 direction can begin to survive inside the actual app surface without mentally filling in missing storefront detail, UI detail, or emotional tone.

The output must not claim final art-direction validation, production asset approval, public-interface approval, production scalability, or production buildability.

## Interaction Preservation Rule

The future visual-integration implementation batch must preserve:

- Existing local app run path.
- Placeholder/static/local data only.
- Desktop hover affordance on one target.
- Desktop click selection.
- Touch/tap selection on a mobile-sized viewport.
- One selected-state card that opens from the target.
- Close or deselect behavior.
- Bounded pan.
- Bounded zoom.
- Basic mobile containment.
- No blocking console/runtime errors.

## Blocked Scope

The following remain blocked unless a later current execution brief explicitly opens them:

- Production assets.
- Production asset direction.
- Production asset pipeline.
- Real-place cards.
- Factual copy.
- Exact real facades.
- Exact addresses.
- Exact station geometry.
- Live data.
- Final public interfaces.
- Formal schemas.
- Broad architecture layers.
- Speculative abstractions.
- Routing.
- Avatars, NPCs, interiors, or quests.
- CMS.
- Persistence.
- Accounts.
- User submissions.
- Broad map coverage.
- Backend services.
- CI.
- Deployment.
- Analytics.
- Production scalability/buildability claims.
- Visual-direction-in-app approval claims.
- Public-interface approval claims.

## Future Implementation Batch Acceptance Criteria

The future visual-integration implementation batch should be accepted only if:

- It uses only temporary, non-production, review-only visual-integration materials explicitly allowed by the current execution brief for that batch.
- It does not import Phase 4 or Phase 4.5 review images into the app unless that brief explicitly approves a non-production reference workflow.
- It preserves the required scaffold interactions.
- It keeps all data placeholder/static/local.
- It produces durable screenshots in `docs/review-screenshots/visual-integration-prototype/`.
- The screenshots meet the future fidelity bar defined above.
- All temporary materials and screenshots are clearly labeled non-production and review-only.
- No production assets, production pipeline, real-place cards, factual copy, live data, CI, deployment, or final public interfaces are created.
- Verification reports no blocking console/runtime errors.

## Exact Current Next Action

Batu should review this planning brief with ChatGPT. ChatGPT should critique it, support Batu's decision, and write or update `docs/CURRENT_EXECUTION_BRIEF.md` with the next executable task if Batu approves a future visual-integration implementation batch.
