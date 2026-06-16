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
- **Sign prominence is low** at iso zoom: ground-floor name bands are small and often occluded by the iso angle / neighboring masses. Candidate polish: larger or projecting blade signs, or raised sign band. Deferred for Batu's taste direction.
- Material differentiation is subtle because 49/53 buildings classify brick-prewar (true to Franklin St's uniform rowhouse stock) — correct, but the block reads uniform; storefront signage is what carries recognizability.

**Infra finding**
- The preview MCP serves the **main checkout**, not the worktree. A `dev-wt` launch config (`npm --prefix <worktree> run dev` on port 5192) was added so the worktree could be visually verified. Remove it after merge.

**Replication hypothesis for Block B**: the only NEW artifacts should be a descriptor JSON, two committed data extracts, and ~1–3 registration lines in SceneView/sceneFrame. If Block B needs new module code, that's a recipe-generality gap to record here.
