# Scaling Log

Per-block scorecard for the procedural block recipe (`docs/superpowers/specs/2026-06-16-procedural-block-scaling-design.md`).
The key signal is **new code for block N+1**: a later block should need near-zero new module code —
only a descriptor + data extracts + a registration line. That delta is the experiment's result.

---

## Block A — Franklin → Milton  (the recipe build)

## Block: franklin-milton  (delta since block-a-start)

- Buildings: 53 (storey source-backed: 53/53, 100%)
- materialFamily: {"brick-prewar":49,"warehouse":3,"painted-masonry":1}
- groundFloorUse: {"commercial":26,"residential":27}
- Storefronts (OSM): 12 (address-backed: 4)
- src code files changed: 5 -> src/SceneView.jsx, src/buildingTypology.js, src/groundLayer.js, src/sceneFrame.js, src/storefrontRoster.js
- diff: 13 files changed, 4521 insertions(+), 12 deletions(-)

**What the recipe produced**
- 7-stage pipeline: descriptor → footprint+PLUTO pull → typology classify → OSM storefront pull → assign → typology-aware walls + truthful signage → ground extend.
- 6 truthful storefront signs rendered on commercial block frontages (Elder Greene, Vamos al Tequila, Seven Wonders Collective, Maman, Land of Barbers, Big Night). Verified in-engine via the worktree preview (window-probe of sign world positions; all on correct buildings, street-facing).

**Manual interventions / what the discovery forced (these are the "learn" findings)**
1. **Data was already there, just hidden + thin.** The pre-existing 291-record set already contained all 53 Franklin→Milton BINs — they were dropped by the 130 m origin radius cull, and lacked PLUTO fields. So the block extract had to *override* the plain non-hero versions (richer PLUTO) rather than only add net-new ones. The "crossAxisOffset≈0 ⇒ no Franklin data" assumption in the plan was wrong.
2. **Hero overlap in the storefront roster.** OSM returns hero businesses (Sereneco, Azure Gourmet) inside the block bbox; their points can land nearer a neighbor block building than their own hero footprint. Fixed with a hero-name exclusion set (from the hero place file) + a hero-proximity guard.
3. **Sign facing.** "Longest edge" placed signs on party-wall sides; switched to "edge nearest the storefront's OSM point" so signs face the street.

**Open craft / polish items (taste calls — not blockers)**
- **Sign prominence is low** at iso zoom: ground-floor name bands are small and often occluded by the iso angle / neighboring masses. **Partly addressed (2026-06-16, `feat/storefront-sign-system`):** new `storefrontSigns.js` system enlarged the band and switched sign text to **category labels** for unclaimed shops ("Bar", "Deli", "Barbershop"), with real branding only when `claimed` (the monetization experiment). **Projecting blade signs were trialled and dropped** — they didn't read at the fixed iso angles (Batu call). The band is still coplanar, so iso occlusion isn't fully solved; the designed **awning-valance name** idiom (the valance faces down/out toward the camera) is the candidate next pass. See `docs/superpowers/plans/2026-06-16-storefront-sign-system.md`.
- Material differentiation is subtle because 49/53 buildings classify brick-prewar (true to Franklin St's uniform rowhouse stock) — correct, but the block reads uniform; storefront signage is what carries recognizability.

**Infra finding**
- The preview MCP serves the **main checkout**, not the worktree. A `dev-wt` launch config (`npm --prefix <worktree> run dev` on port 5192) was added so the worktree could be visually verified. Remove it after merge.

**Replication hypothesis for Block B**: the only NEW artifacts should be a descriptor JSON, two committed data extracts, and ~1–3 registration lines in SceneView/sceneFrame. If Block B needs new module code, that's a recipe-generality gap to record here.

---

## Block B — east-Greenpoint  (the replication test)

## Block: greenpoint-east  (delta since block-a-done)

- Buildings: 39 (storey source-backed: 38/39, 97%)
- materialFamily: {"brick-prewar":37,"painted-masonry":2}
- groundFloorUse: {"commercial":18,"residential":21}
- Storefronts (OSM): 6 (address-backed: 2)
- src code files changed: 1 -> src/SceneView.jsx
- diff: 4 files changed, 2023 insertions(+), 2 deletions(-)

**Replication result:** Block B required **no new modules and no script edits** — only data (a descriptor + two committed extracts) plus ~6 net-new lines in one existing file (`src/SceneView.jsx`): two imports, a 2-entry block registry, one assemble argument, and one `flatMap`. Both pull scripts and every pure module (`buildingTypology`, `storefrontRoster`, the `sceneFrame` block loop, `groundLayer`) ran **unchanged**. The registry refactor is a one-time generalization; a third block is now pure data + two array entries.

**What generalized cleanly**
- Footprint+PLUTO pull, OSM storefront pull — descriptor-driven, zero edits.
- Typology classify, storefront assignment, typology-aware walls, truthful signage, ground run — all reused as-is.
- Hero protection (name + proximity guards) carried over without change.

**Findings carried / new**
- ~~**OSM roster overlap:**~~ **Resolved (2026-06-16).** The two block bboxes overlap near the shared corner, so businesses appear in both rosters. `dedupeByProximity()` (`storefrontRoster.js`) now collapses records within ~4m whose names are similar (equal-after-normalization or length-guarded containment), keeping the higher-ranked one. In practice it merged the two exact-point cross-roster duplicates — `Land of Barbers` (hairdresser) and `Big Night` (deli) — while correctly keeping `The Land of Barbers` (~37m away) distinct. Distinct name strings are no longer a problem because matching is point-proximity-gated, not string-exact.
- ~~**Sign prominence** (from Block A) still applies block-wide.~~ Resolved block-wide by the `storefrontSigns.js` system (band + category-gated blade, category-label default) — see the Block A note above.
- **Material uniformity:** both blocks classify mostly brick-prewar — true to Greenpoint stock; storefront signage carries recognizability.

**Verdict:** The recipe scales. The marginal cost of a new typological+truthful block is now **data acquisition (two scripted pulls) + ~4 lines of registration**, not engineering. Remaining work to make it production-grade is polish (sign craft) — the dedup pass is now done — not architecture.

---

## Block C — franklin-north  (the kit-flip test: does the inked craft travel?)

## Block: franklin-north  (delta since the 8.1a flip)

- Buildings: 160 (storey source-backed: 159/160, 99%)
- materialFamily: {"brick-prewar":138,"painted-masonry":18,"commercial-storefront":2,"warehouse":2}
- Kit routing: **140 → inked kit** (138 brick-prewar + 2 commercial-storefront → brick) / **20 → cheap typological** (18 painted-masonry + 2 warehouse, no kit assets — left as-is per the Phase-8.1 "covered residential families" rule)
- groundFloorUse: {"residential":125,"commercial":35}
- Storefronts (OSM): 26 (address-backed: 15)
- src code files changed: **1** -> src/SceneView.jsx (2 imports + 2 array entries)

**Why this block mattered:** it was the first real test of whether the 8.0
structural-depth craft (recesses, sills, stoops, fire escapes, cornices,
per-family material) **travels** to brand-new buildings or has to be hand-tuned
per BIN. It travels. After the 8.1a flip (`KIT_PILOT_BINS = {}`), all 140
kit-eligible buildings rendered through `decorateInkedWall` with material/recess/
street-face resolved entirely from PLUTO + family/storey gates — **zero
per-building overrides added**. Verified in-engine across all four angles: inked
front craft on street faces, plain typological backs on rears/party walls.

**Findings carried / new**
- **bbox is the only real tuning knob.** The first pull used a wide rectangle and
  caught 388 buildings across ~3 parallel streets (Franklin runs ~N–S here, so a
  wide axis-aligned box over-reaches into West St + the Manhattan-Ave side).
  Tightening lon to Franklin's own band (−73.9586…−73.9568, ~141m deep — same
  depth character as franklin-milton) brought it to 160 along one corridor. A
  diagonal street would need either segmented boxes or a centerline-distance
  filter; Franklin's near-N–S run made a single box workable.
- **Density is a curation dial, not an engineering limit.** 160 (Greenpoint Ave →
  Huron, ~4 blocks, both sides + ~2 lots deep) is the honest corridor count at the
  existing blocks' depth. Trimming to Franklin frontage-only (~1 lot deep) would
  roughly halve it — a "spine vs. coverage" call for Batu, not a recipe change.
- **Material uniformity holds** — 138/160 brick-prewar, true to Franklin's
  rowhouse stock; the painted-masonry/warehouse minority correctly degrades.
- **Heroes-pending:** Brouwerij Lane / Eberhard Faber building / Astral fall in
  this corridor and render typological for now (no field photos); hero promotion
  is a later, photo-gated cycle. Their `building-tiers` hero flag is intact.

**Verdict:** The kit travels. Marginal cost of extending the *crafted* spine is now
the same as the old typological recipe — **data (two scripted pulls, one bbox
iteration) + ~4 lines of registration** — with the full inked treatment applied
automatically. The traveling-learnings requirement (Batu, 2026-06-21) is met.
