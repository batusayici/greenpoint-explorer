# Next Batch Brief

Label: **development batch brief / not approval**
Date: 2026-05-26

## Batch Purpose

Develop only the survivor directions chosen by Batu.

Codex recommends developing:

1. Soft Pixel Neighborhood Sim.
2. Inked Indie Graphic Novel.

This should be a development batch, not another divergence batch. The goal is to test whether the survivors can become usable visual systems for the map-mode MVP.

## Batch Questions

The next batch should answer:

- How do UI overlays coexist with the world?
- Do markers, hover states, and place cards feel native rather than pasted on?
- Does the direction remain readable at map scale?
- Can the style become repeatable across many storefronts?
- Does local specificity survive without unsupported real-place claims?

## Scope

Docs and visual artifacts only.

No app code. No React, Vite, PixiJS, Three.js, package tooling, source folders, build configuration, public interfaces, or implementation scaffolding.

## Required Outputs Per Survivor

Each survivor direction should receive exactly four development artifacts:

1. UI/world integration frame.
2. Place-card / hover-state / marker integration frame.
3. Style tile or visual system tile.
4. Production viability notes.

The two survivor directions should remain separate. Do not create a merged hybrid direction unless Batu explicitly approves that scope change.

## Survivor 1: Soft Pixel Neighborhood Sim

### 1. UI / World Integration Frame

Show a browsable exterior Greenpoint storefront block at map scale with multiple markers, one selected storefront, and one active place card.

Test:

- Pixel-sticker or tactile marker language.
- Selected storefront highlight.
- Place-card hierarchy.
- Whether UI remains playful without becoming a game HUD.
- Whether storefronts remain the main event.

### 2. Place-Card / Hover-State / Marker Integration Frame

Create a closer crop of one selected storefront.

Test:

- Hover outline or facade highlight.
- Entrance-anchored marker.
- Place card with name, category, address/status row, close affordance, and short note.
- Text legibility against pixel texture.

### 3. Style Tile / Visual System Tile

Define the repeatable system:

- Brick, awning, glass, roll gate, sidewalk, curb, tree pit, pole, sticker, flyer, and signage treatments.
- Marker states: default, hover, selected, unavailable/unknown.
- Place-card material and hierarchy.
- Color and lighting constraints.
- Rules for how much pixel texture is enough.

### 4. Production Viability Notes

Answer:

- Which elements can be modular?
- Which elements require custom illustration?
- How does the style avoid generic retro game language?
- How does it distinguish itself from older Community Pixel work?
- What would be expensive or brittle at scale?

## Survivor 2: Inked Indie Graphic Novel

### 1. UI / World Integration Frame

Show a browsable exterior Greenpoint storefront block at map scale with multiple markers, one selected storefront, and one active place card.

Test:

- Inked callout markers.
- Selected storefront outline or wash.
- Caption-panel place card.
- Whether the linework supports click precision.
- Whether the frame remains a map rather than a narrative illustration.

### 2. Place-Card / Hover-State / Marker Integration Frame

Create a closer crop of one selected storefront.

Test:

- Marker attachment to a precise entrance.
- Hover bracket, outline, or translucent wash.
- Place card with strong hierarchy and restrained comic-panel influence.
- Legibility over dense hatching and facade detail.

### 3. Style Tile / Visual System Tile

Define the repeatable system:

- Line weight, hatching density, shadow shapes, paper texture, color restraint, signage, window detail, brick rhythm, sidewalk marks, poles, flyers, and bikes.
- Marker states: default, hover, selected, unavailable/unknown.
- Place-card framing and typography-like hierarchy.
- Rules for preventing noir overload, generic comic styling, or too much illustration noise.

### 4. Production Viability Notes

Answer:

- Can this style be modularized without losing authorship?
- What details must be handcrafted?
- How does it remain readable across zoom levels?
- What art-direction rules prevent inconsistent linework?
- Where would human visual design be most valuable?

## Shared Constraints

- Exterior map mode only.
- Storefront-first.
- No interiors.
- No avatar, NPC simulation, quests, events system, or fantasy game language.
- No unsupported real-place claims.
- Generated names, signs, and exact adjacencies remain fictionalized or symbolic unless separately verified.
- UI must be visible enough to judge, but not overbuilt.

## Acceptance Criteria

The next batch passes if Batu can decide:

- Whether Soft Pixel should continue, stop, or merge limited accents.
- Whether Inked Indie should continue, stop, or merge limited accents.
- Which direction has the stronger UI/world relationship.
- Which direction has better map-scale readability.
- Which direction is more production-survivable.

The next batch fails if Batu still has to imagine the UI, hover state, place card, repeatability, or map-scale readability.
