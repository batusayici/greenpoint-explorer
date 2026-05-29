# Current Execution Brief - Post-MVP-07 Review State

Status: MVP-07 Reusable Place Evidence Pipeline Spike is complete for review; no active Codex implementation task is approved.
Owner boundary: Codex must not perform app/source, visual, polish, ambient, production, CI/deployment, staging, or commit work until Batu/ChatGPT accepts or revises MVP-07 and a later current brief explicitly opens the next scope.

## Current Next Task State

Recommended next step:

- Batu/ChatGPT review of `docs/mvp-review/mvp-07-reusable-place-evidence-pipeline/README.md`.

Next executable task status:

- Pending Batu/ChatGPT review and approval.
- Recommended next task is MVP-08 Place Evidence Packet For Current Scene, docs-only.
- Visual Polish / Optional Ambient remains blocked.
- No next implementation task is approved in this file.

## Context

MVP-06 corrected the active prototype scene to:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

MVP-07 proposes a repeatable evidence pipeline for converting Greenpoint addresses/businesses into validated interactive scene data and approved art-reference inputs. It tests the pipeline against the current MVP-06 active scene.

MVP-07 final verdict:

- `revise`.

Pipeline read:

- The pipeline is viable as a repeatable review workflow.
- The current scene still lacks enough approved address/parcel/storefront and facade/art-reference evidence to unlock real-inspired facade/art treatment.
- Visual Polish / Optional Ambient remains blocked.

LiveXYZ links remain identity/presence evidence only. They are not approved facade/art references and do not approve exact address, storefront frontage, entrance geometry, active-status finality, production placement, or public card copy.

Google/Street View-style reference imagery remains blocked as facade evidence.

## Recommended MVP-08 Scope, Pending Approval

If Batu/ChatGPT approve, the next proposed task is:

- Create `docs/mvp-review/mvp-08-current-scene-place-evidence-packet/README.md`.
- Produce one evidence card per current active place:
  - Greenpoint Deli.
  - McDonald's.
  - Dunkin'.
  - Citizens Bank.
  - Greenpoint G subway.
- Apply the MVP-07 taxonomy to each place:
  - Identity/presence.
  - Business status.
  - Address.
  - Parcel/building linkage.
  - Storefront/frontage/entrance evidence.
  - Facade/art-reference provenance.
  - Recommended treatment.
  - Unresolved questions.
- Use only approved/manual research methods and static review notes.
- Stop if approved facade/art-reference inputs are missing, and report the exact missing input paths or source categories.

The proposed MVP-08 task would remain docs-only unless a later brief explicitly authorizes source/app changes.

## Still Forbidden Unless A Later Brief Opens Scope

Do not add or modify:

- App/source files.
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

MVP-07 created a docs-only conceptual pipeline proposal. It did not create a production data contract, public module API, runtime schema, source-of-truth pipeline implementation, renderer boundary, map system, routing system, or asset pipeline.

## Decisions Still Reserved For Batu

- Whether to accept, revise, or reject the MVP-07 pipeline and `revise` verdict.
- Whether MVP-08 should proceed as the next docs-only current-scene evidence packet.
- Whether any current business becomes a real card, context-only card, fictionalized card, omitted item, or blocked item.
- Whether branded chain identities should remain literal, be fictionalized, or be omitted.
- Whether any non-Google storefront-specific visual references are approved later.
- Any exact address, frontage/order, entrance, facade, or station geometry approval.
- Any visual polish, optional ambient, production asset, production data, public-interface, architecture, CI/deployment, or release decision.
