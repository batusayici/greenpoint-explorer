# Phase 8.2 — PlaceStory Content Layer — Design

Date: 2026-06-19
Owner: Batu (taste, content, approvals) / Agent (execution)
Status: Approved scope, pending spec review
Plan refs: `docs/PLAN.md` Phase 8.2 + Track-B B1; schema origin
`docs/context/greenpoint-editorial-context.md:330`; truth conventions in
`src/data/places/franklin-greenpoint-heroes.v0.1.json`; card `src/components/PlaceCard.jsx`.

## Purpose

Add the **story / context layer** — the half of the platform that tests **H1 (stories
drive engagement vs. directory info)**. A `PlaceStory` is structured, source-backed
editorial content attached to a place and surfaced in the place card. Editorial truth is
kept **separate** from geometry and business truth (own files, own loader) and is **gated
exactly like business facts** (sources + verification + approval).

This phase builds the **mechanism** (schema, loader, truth-gating, card story section) and
wires **one real seed story** — the 137 Oak St "Haunted House" audio story — as the
end-to-end proof. It does not author a corpus of stories (that is 8.3).

## Decisions (locked 2026-06-19)

1. **Mechanism, not corpus.** Build schema + loader + card section + tests. The only shipped
   content is the single 137 Oak St seed story; all other tests use fixtures.
2. **Reconcile to truth conventions.** `PlaceStory` carries `sources: [{label,url}]`,
   `verificationStatus`, and `approvalStatus` — matching place records, not the looser
   `sourceUrls: string[]` in the design doc.
3. **One featured story per card.** Selection = explicit `featured` flag with a deterministic
   fallback. Multiple-stories-per-card is out of scope.
4. **A story is audio, image, and/or text.** All three media are first-class and optional.
5. **Card omits the section entirely** when a place has no surfacing story (no placeholder).
6. **Seed story ships unverified.** The 137 Oak St *story* is "locally known" lore. It ships
   `verificationStatus: "unverified"`, `approvalStatus: "proposed"` — visible in dev with the
   under-review badge, hidden in public mode until approved. It is the worked example of the
   truth gate.
7. **137 Oak St is a hero (promoted now, render deferred).** It was omitted earlier only for
   being off the Franklin/Greenpoint spine. It is promoted into the curated hero set as a
   record now; its bespoke geometry/facade render + map placement are deferred and tracked
   exactly like **Brouwerij Lane** (`buildStatus: "data-missing"`). The *building/place* and
   the *story* gate independently: the place record's verification tracks the real address;
   the story stays unverified lore.

## Schema — `PlaceStory`

New data file `src/data/stories/place-stories.v0.1.json` (an array; ships with the single
seed story). Each record:

```
id: string
placeId: string                 // FK to a place/landmark anchor
title: string
storyType:                      // history | lost_business | local_memory |
                                // industrial_history | polish_greenpoint |
                                // environmental_history | hidden_greenpoint |
                                // then_now | event_or_ritual | business_owner_story
summary: string                 // short card text (required)
body?: string                   // longer text (optional)
audioUrl?: string               // narration / on-location audio
imageUrls?: string[]            // image(s), incl. then/now
sources: [{ label, url }]       // gated like place records
verificationStatus:             // verified | proposed | unverified
approvalStatus:                 // approved | proposed   (public gate)
featured?: boolean              // selects the one card story
yearStart?: number, yearEnd?: number
locationConfidence?:            // exact | block | neighborhood
editorialTags: string[]
```

## Components

### Loader — `src/placeStories.js`
Pure, Node-importable, JSON-import pattern matching `placeData.js`.

- `getFeaturedStoryForPlace(placeId, { publicMode = false } = {}) -> PlaceStory | null`
  - Filters to the place's stories.
  - In `publicMode`, keeps only `approvalStatus === "approved"`; in dev keeps all.
  - Selects: first `featured === true`; tiebreak = first `verified` + `approved`; else
    first by array order. Deterministic.
  - Returns `null` when no story qualifies.
- `allStories() -> PlaceStory[]` (for verifiers / future use).

### 137 Oak St hero promotion (record now, render deferred)
137 Oak St becomes a curated hero, mirroring the Brouwerij Lane precedent:

- **Curation registry** — add an entry to `src/data/curation/building-tiers.v0.1.json`:
  `key/placeId: "137-oak-haunted-house"`, `name: "137 Oak Street"`, `address`,
  `visualTier: "hero"`, `landmarkTier` (tier per CURATION_TIERS — promoted off the hold set),
  `buildStatus: "data-missing"`, with a `note` that geometry/render lands later. This keeps
  the hero budget honest and records the promotion.
- **Hero place record** — heroes today live in `franklin-greenpoint-heroes.v0.1.json`, which
  is spine-specific. 137 Oak is off-spine, so add a new `src/data/places/landmark-heroes.v0.1.json`
  (same record shape: `id, placeId, name, category, address, status, verificationStatus,
  approvalStatus, sources, lastVerified`). `placeData.js` merges this file with the heroes
  file so `getPlaceByPlaceId` resolves it. The record's `verificationStatus`/`approvalStatus`
  reflect the real address's confirmation state (ships `proposed` until the address is
  cross-checked) — independent of the story's lore gate.
- **Deferred (tracked, not an oversight):** bespoke massing/facade render and clickable map
  placement. `buildStatus: "data-missing"` is the marker; the off-spine hero build is a later
  phase. The card resolves and renders the story from data without needing the geometry.

### Card — story section in `PlaceCard.jsx`
A new section below the description. Given a `story` prop (the featured story or null):

- null → render nothing.
- else → storyType badge → title → `summary` → optional `body` → optional first image →
  optional native `<audio controls>` player (when `audioUrl`).
- `verificationStatus !== "verified"` → the existing dashed "under review" marker, worded
  for lore ("Local lore — unverified.").

`PlaceCard` stays presentational: the parent resolves `getFeaturedStoryForPlace` and passes
the story in. (`publicMode` is decided by the caller; default dev shows proposed content.)

## Data flow

```
place selected (placeId)
  → getPlaceByPlaceId(placeId)                      [existing]
  → getFeaturedStoryForPlace(placeId, {publicMode}) [new]
  → <PlaceCard place={...} story={...} />            [card renders gated story section]
```

## Seed content — 137 Oak St "Haunted House"

- **Hero record:** registry entry + `landmark-heroes.v0.1.json` record,
  `placeId: "137-oak-haunted-house"`, name "137 Oak Street", category "Landmark",
  address "137 Oak St, Brooklyn, NY 11222", `verificationStatus: "proposed"`,
  `approvalStatus: "proposed"`, `buildStatus: "data-missing"` (registry).
- **Story:** `storyType: "local_memory"`, `featured: true`, `audioUrl` pointing at the
  supplied file, `verificationStatus: "unverified"`, `approvalStatus: "proposed"`,
  `editorialTags: ["hidden_greenpoint", "local_ritual"]`. Summary/body authored from what
  Batu provides; sources cite the audio + any provided origin.
- **Audio file — Batu supplies.** Drop the audio into `assets/audio/137-oak-haunted-house.*`
  (mp3/m4a). The story's `audioUrl` references it. Generation of the card is gated on the
  file existing, the same "you supply media, agent wires it" handoff used for references.

## Testing

- Loader (`src/placeStories.test.mjs`, fixtures): featured-flag selection; verified+approved
  tiebreak; `publicMode` filters out `proposed`; no-match → null; multiple stories → exactly
  one returned.
- Card section: renders text-only, +image, +audio variants; omits section when story null;
  shows lore badge when unverified. (Follows existing component test patterns.)
- Truth verifier: extend or add a check that every PlaceStory cites ≥1 source and that an
  `approved` story is also `verified` (no approved-but-unverified lore). Mirrors
  `verify-place-data.mjs`.
- `npm run verify` stays green.

## Out of scope (→ later phases)

- Authoring a story corpus (3–5+ real stories) — **8.3**.
- Multiple-stories-per-card UI; story browsing/index.
- **137 Oak St geometry/facade render + clickable map placement** (off-spine hero build;
  `buildStatus: "data-missing"`, mirrors Brouwerij Lane) — later phase.
- Instrumentation of story opens/dwell — **8.4**.
- Audio/image asset production (Batu supplies the seed audio).

## Risks / watchouts

- **Unverified lore leaking to public.** Mitigated by the `approvalStatus` gate + the
  verifier rule (approved ⇒ verified) + the dev-only default.
- **Hero record without geometry** could read as an oversight — mitigated by the
  `buildStatus: "data-missing"` marker (Brouwerij Lane precedent), which is the agreed
  tracking convention for a promoted-but-unbuilt hero.
- **Audio file absent** blocks only the seed card, not the mechanism/tests (fixtures cover
  the rest) — consistent with not letting media block progress.
