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
