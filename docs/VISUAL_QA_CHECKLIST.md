# Visual QA Checklist

Status: Proposed  
Date: 2026-05-26  
Creative direction owner: Batu  
Implementation owner: Codex

Use this checklist at each visual gate.

## Static Style Frame QA

Screenshot read:

- [ ] First screenshot reads as a distinctive Greenpoint-inspired isometric diorama without explanation.
- [ ] Scene feels like a handheld diorama, not a utility map.
- [ ] Scene feels authored, not generated or asset-pack assembled.
- [ ] Greenpoint specificity is visible before reading labels.

Composition:

- [ ] Scene is one compact intersection or storefront row.
- [ ] Composition does not imply false business adjacency.
- [ ] Businesses are not relocated onto incorrect streets.
- [ ] Map edges or framing feel intentional.

Architecture and place:

- [ ] Storefront rhythm feels Greenpoint-specific.
- [ ] Peter Pan Donuts is recognizable enough as an anchor without overclaiming exact reproduction.
- [ ] Karczma appears only if street logic is truthful.
- [ ] G station element feels like an orientation anchor, not a transit-map feature.
- [ ] Sidewalk texture includes local-feeling clutter without becoming noisy.

Visual language:

- [ ] Pixel-inspired HD style is clear.
- [ ] Art is not strict low-res pixel art.
- [ ] Art is not generic vector-isometric.
- [ ] Palette is not one-note beige, brown, slate, or purple-blue.
- [ ] Line weight feels confident and readable.
- [ ] Building proportions are slightly chunky but not toy-like.

UI layer:

- [ ] Any label/marker feels chunky, playful, and flyer-influenced.
- [ ] UI does not become a full game HUD.
- [ ] Interaction cues are visible but not screaming.
- [ ] Nothing implies quests, XP, inventory, or character simulation.

Guardrails:

- [ ] Not too cute.
- [ ] Not too generic.
- [ ] Not too gamey.
- [ ] Not too documentary.
- [ ] No fake endorsement.
- [ ] No fictional stories attached to real businesses.

## Interaction Prototype QA

Camera:

- [ ] Pan feels smooth.
- [ ] Zoom feels smooth.
- [ ] Bounds prevent losing the scene.
- [ ] Desktop/tablet composition remains polished.
- [ ] Mobile portrait remains contained, even if not primary.

Pointer/tap feedback:

- [ ] Desktop hover highlight is clear.
- [ ] Desktop click opens the correct card.
- [ ] Touch tap highlights and opens the correct card.
- [ ] No interaction depends on hover only.
- [ ] Hotspots align with visible art.

Place cards:

- [ ] Every card has name.
- [ ] Every card has category.
- [ ] Every card has address.
- [ ] Every card has source link.
- [ ] Every card has last verified date.
- [ ] Every card includes "Unofficial neighborhood map."
- [ ] Copy is factual and neutral.
- [ ] No ratings, reviews, or endorsement claims.

Ambient animation:

- [ ] Animation is visual-only.
- [ ] Animation does not imply gameplay systems.
- [ ] Animation does not interfere with clicks/taps.
- [ ] Animation does not cause layout shifts.
- [ ] Motion is restrained enough not to distract from exploration.

Documentation:

- [ ] `docs/DECISION_LOG.md` updated after the batch.
- [ ] Visual changes include before/after rationale when applicable.
- [ ] Open review items are documented.
- [ ] Phase-2 ideas stay in `docs/PHASE_2_BACKLOG.md`, not the MVP.

