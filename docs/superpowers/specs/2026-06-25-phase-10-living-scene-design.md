# Phase 10 — Living Scene: Dynamism & Light (design)

Scoped 2026-06-25 (Batu). Status: **planned**, sequenced behind Track R. Roadmap entry: `docs/PLAN.md`.

Makes the scene "come alive" in a second sense — *animated* and *time-aware* — distinct from the 2026-06-23 reprioritization where "alive" meant recognizable + voiced (stories). Approach is **Road B: illustrated dynamism, not photoreal.** Engine cost is trivial (Three.js); the real cost is art-production (every dynamic element must be drawn in the II-C idiom) and one foundational architecture change.

## Governing constraint (from the pipeline as built)

- Hero facades are unlit `MeshBasicMaterial` — lighting is baked into the inked texture.
- Context massing is `MeshLambert` (sun-shaded).
- No shadow maps; the render loop is static (`setAnimationLoop` only re-renders, no clock).

**Therefore:** global light changes must flow through **uniforms / palette grading**, NOT scene lights. A moving real sun would light the Lambert context while the Basic heroes sat frozen, visibly splitting the scene. This phase **completes the dormant Phase 3.4** (lighting/shadow/composition) rather than being net-new.

## Sequencing (Batu, 2026-06-25)

Sits **behind Track R** (recognizability). The lightweight Track P pass (texture caching + `?perf=1` budget harness) is enough to start on; full P1 merge/instancing is **not** a hard gate — but Phase 10 adds draw load, so watch the P4 budget harness as motion lands and pull P1 forward if numbers degrade. Rationale: the differentiator is hyperlocal *content*, not motion, so recognizability + first stories come first.

## Scope

- **10-INFO — Informational dynamism (the moat half) → folds into Track B / events (B5), ships sooner than the visual work.** Time-of-day wired to **real local Greenpoint time**; business sign lit when open per real hours; events/markets that appear when live; story-pins that pulse. Dynamism a 3D world model *cannot* fake — the hyperlocal-truth thesis expressed as motion. Stays on the verified-truth side of the existing gates.
- **10.1 — Animation foundation.** Add a clock + update system to the render loop. Prerequisite for everything below.
- **10.2 — Time-of-day as authored palette grades.** ~4–5 curated moods (dawn/day/dusk/night) as bundles of uniforms (paper tint, ink warmth, fog, atmospheric wash, light colors) cross-faded — not a continuous physical sun. Plus **night window glow** (flip a curated subset of existing window meshes to `emissive` at dusk) — highest alive-per-dollar signal. Drawn/illustrated shadow shapes (baked blob/hatch from a fixed, step-rotated sun), never shadow maps.
- **10.3 — Ambient micro-motion.** Awnings/signs stirring, vent steam, flags, water shimmer — looped vertex/shader wiggle. Cheap, large payoff; the inked style wants a little hand-drawn jitter.
- **10.4 — Inked sprite agents.** 2D inked sprites / flat cutouts (NOT skinned 3D models — off-brand + costly) walking the **existing street/sidewalk graph** (LION centerlines + sidewalk strips already built). Curated density of a few dozen pooled/instanced agents in the visible iso frame, not crowd/traffic simulation.
- **10.5 — Weather mood states** (reuses 10.2 machinery): rain hatch, snow, fog density. Pairs with hyperlocal ("Greenpoint in the snow").

## Limits / watchouts

- Texture memory is the perf ceiling (sprite atlases must be tight; ref the LFS size history).
- The II-C idiom is the gating art cost.
- Informational dynamism must not cross the truth wall.
