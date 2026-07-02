# Greenpoint Explorer — Plan

Status: Active roadmap · Reset 2026-06-11 · Owner: Batu (taste/product/approvals), Agent (execution)

> **Roadmap only — milestone granularity.** Detail lives where it belongs: decisions & rationale → `docs/DECISION_LOG.md` · per-task designs → `docs/superpowers/specs/` · scaling scorecards → `docs/SCALING_LOG.md` · hero/landmark list → `docs/CURATION_TIERS.md` · kit inventory → `docs/COMPONENT_INVENTORY.md` · look → `docs/ART_DIRECTION.md` · strategy → `docs/context/`. Completed-work specifics (commits, files, tests) live in git history, not here.

## Product Goal

**Greenpoint Explorer is a neighborhood exploration platform** — it helps people discover Greenpoint through stories, landmarks, events, history, and curated routes, not through search. The lifelike, hand-inked 3D map is the **recognition layer / container**; the location-linked context attached to places is the product. (People don't travel to browse listings — they travel to discover places; businesses benefit when discovery happens.)

The container: a 3D, isometric, interactive, explorable, browser-based Greenpoint that is lifelike — every building and business where it is in real life and recognizably itself. Art-directed and stylized, not hyperrealistic. The recognition bar ("yes, that's *my* neighborhood") is load-bearing but serves the platform; it is not the end in itself.

- **Multi-angle (firm):** viewable from all four orthogonal iso angles (90° steps) + pan/zoom. A single angle structurally hides ~half of all frontages and their businesses; four rotations reveal every frontage. Scene completeness is judged from all four angles. (Not free-cam, which stays debug-only.)
- **Look:** II-C Inked Indie Visual System. Fallback: GPT-5.5 photo-render fidelity. See `docs/ART_DIRECTION.md`.
- **Truth:** geometry = NYC Open Data (footprints, BINs); likeness = field photos in `src/data/facade-evidence/`.

## Strategy (in brief — full frame in `docs/context/`)

- **Platform, not directory.** Six content layers: Places · Stories · History · Events · Curated Routes · Neighborhood Layers.
- **Use order:** Stories → Local knowledge → Exploration → Events → History → Businesses. Stories attract; events create urgency; businesses monetize discovery.
- **North-Star — Verified Local Exploration:** journeys with meaningful engagement (route starts, story listens, event saves, multi-stop, signups).
- **Defensibility:** a neighborhood knowledge graph — *why* places matter, not just where.
- **Landmark strategy:** curated density, not coverage — ~10–15 story-rich anchors on the Franklin/Greenpoint spine; each a tappable story object, not a POI.
- **Hypotheses to validate:** H1 stories drive engagement · H2 routes drive exploration · H3 events drive acquisition · H4 businesses pay after attention · H5 model repeats to other neighborhoods.

## Locked constraints (`DECISION_LOG.md`, 2026-06-11)

Audience: public community demo (real names in dev, factual review at publish) · Likeness: heroes exact, infill typological · Production: procedural/parametric kit + AI asset generation · Camera: iso + pan/zoom, four fixed 90° steps (firm), free-cam debug-only · Real-faithful supersedes fictional-safe identity.

## Architecture spine

```
NYC footprints (BIN-mapped, WGS84)
  → local scene frame projection      [proven: R10E/R10G]
  → extruded massing + facade planes
  → II-style facade textures          [AI image-to-image; heroes bespoke, infill from kit]
  → II prop/ground layer              [sidewalks, crosswalks, street furniture]
  → NPR post pass                     [outline, paper grain, palette grade]
  → DOM paper-card UI                 [II-C marker states + place cards]
```

Stack: React + Three.js + Vite. No renderer replacement.

## Where we are (2026-07-02)

The **container** (Track A — geometry, inked look, facades, ground, multi-angle camera, place cards, block scaling) is ~85% built and polished along the Franklin spine. The **content/product layers** (Track B — stories, events, routes, history, instrumentation) are ~5% built. The map reads as real but is largely **mute**. Milestone trail: `DECISION_LOG.md`.

**As of 2026-07-02 the near-term priority is Track V (below), not Track R.** Two strategy inputs (the *Unmet Needs & Opportunity Context* and the *Shop Small Greenpoint* July newsletter) say: validate that the spatial layer pulls real demand — cheaply, off the 3D runtime — before more container polish. Track R (`feat/r2-recognizable-storefronts`) is **paused, backed up to origin**, and resumes only if the demand test earns it.

## Active sequencing — validate demand, then make the spine alive (Batu, 2026-07-02)

0. **Track V — Spatial Demand Test (NOW).** A standalone, independently deployable **2D real-map** page in the II-C inked identity — "July in Greenpoint + G-Train Support" — that amplifies SSG's July content and the live G-train disruption with ~15 static seed cards (discovery + events + a G-train support layer, filters, signup/submission CTAs). Zero Three.js; own shareable URL. SSG is a **source we amplify**, not a partner-dependency. Card schema is throwaway JSON shaped to graduate later (`PlaceStory`/`Landmark` reconciliation deferred). Go/no-go on Doc 1's thresholds **+ does SSG want it** — Perri (WonderMart / SSG) is a named tester. Hook: the Jul 10–13 (+ overnights Jul 13–17) G closures through Greenpoint; recurring, so hook-not-hard-gate — aim the Perri-ready cut at an early recurring window. Spec: `docs/superpowers/specs/2026-07-02-spatial-demand-test-design.md`.

**If Track V validates → resume the container work below. If it pauses/reframes → revisit the wedge before more 3D craft.**

1. **Track R — Recognizability (PAUSED — resumes after Track V validates).**
   - **R1 — Astral Apartments (184 Franklin)** as the proof anchor, built bespoke like the Franklin heroes, then generalize.
   - **R2 — Recognizable storefronts:** wire the dormant signature layer so storefronts read as *specific real shops* (silhouette + category, unbranded per the claim model). Corners carry recognition. Specs: `docs/superpowers/specs/2026-06-24-r2-*`, `…elder-greene-signature-design.md`.
   - **R3 — Eberhard Faber building, Brouwerij Lane, Oak St haunted house** — remaining anchors, photo-gated.
2. **Stories + signal (right behind R).** Attach 3–5 real stories (H1), seed events (H3), lightweight instrumentation, a shareable demo URL for resident testing.
3. **Phase 10 — Living Scene (behind R).** Dynamism + light, as *illustrated* (Road B), not photoreal. Design: `docs/superpowers/specs/2026-06-25-phase-10-living-scene-design.md`. The informational half (real-time lighting, open/closed, live events) folds in earlier with Track B events.

**Track P — Performance** runs as-needed: lightweight pass done (shared texture caches + `?perf=1` budget harness); P1 merge/instancing + P3 async build still open — pulled forward if the budget degrades. Not a hard gate on the above.

**Deferred (coverage/polish — wait until the loop is proven alive):** street-network paving (8.1c, designed — spec in `superpowers/specs/`), further block/neighborhood expansion, roof/pavement detail, business-claim monetization (H4), basement/areaway (Phase 8.5, photo-gated), second neighborhood (H5).

## Roadmap at a glance

- **Done:** Reset baseline · style spike + look gate · Franklin corner vertical slice (facades, ground, corner signals, place cards, multi-angle camera) · MVP scene + procedural block scaling · curation + visual-system contract (Phase 6) · asset kit clapboard slice + roof tones (Phase 7, fan-out pending) · structural depth (8.0) · spine expansion — full kit flip + Franklin-north corridor (8.1) · `PlaceStory` schema (8.2).
- **Now:** Track V — Spatial Demand Test (2D SSG/G-train validation map, off the 3D runtime).
- **Next (gated on Track V validating):** Track R recognizability → stories / events / instrumentation.
- **Then:** Phase 10 — Living Scene.
- **Later (Phase 9 — Validate & Scale):** landmark-set completion, curated routes (H2), events at scale (H3), North-Star instrumentation, monetization (H4), roof/pavement detail, pre-launch truth pass, public demo, repeatability (H5).

## Open items & known gaps

- **Track V follow-ups (post-validation):** reconcile the demand-test card schema with `PlaceStory`/`Landmark` into one canonical content model; fold change/civic layers + the recognizable-container fusion in as v2; refresh seed from the ~Aug 5 SSG issue. (Spec: `2026-07-02-spatial-demand-test-design.md`.)
- **Signature layer** defined in the 8.0 contract but not yet wired into the renderer — that's R2. (`COMPONENT_INVENTORY.md`)
- **Asset-kit fan-out** — brownstone / modern-flat / warehouse families + gather-dependent columns (bay-frame / awning / roll-gate) pending; clapboard is the proven anchor. (`COMPONENT_INVENTORY.md`)
- **Dual-material kit capability** built + unit-tested but dormant, unverified in-engine — available when a real dual-material building is evidence-confirmed.
- **Franklin Ave centerline** missing from the source packet; roadbed is derived (real width, derived extent) — 8.1c may close it via a LION pull.
- **Footprint confidence:** 126 safe / 14 uncertain / 2 blocked across the 142 corridor buildings.
