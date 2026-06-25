# Asset Kit Generation — Design

Date: 2026-06-19
Owner: Batu (taste, approvals) / Agent (execution)
Status: Approved scope, pending spec review
Supersedes the generation sequencing of `2026-06-18-phase-7-asset-kit-completion-design.md`
(the taxonomy / contract / mechanical-gate scaffolding from that phase stands and is
reused; this spec reshapes *how the pixels get generated and approved*).
Refs: `docs/ART_DIRECTION.md` (II-C), `docs/reference/art/GENERATION_KIT.md` (hero
playbook), `docs/COMPONENT_INVENTORY.md`, `docs/reference/asset-reference/MANIFEST.md`,
memories `hero-facade-build-loop`, `facade-truth-pipeline`, `inked-component-kit-spike`.

## Purpose

Generate the inked component kit beyond the four shipped brick components, so the
neighborhood can be dressed in the approved II-C look — **without sacrificing local
recognizability or art consistency to a generic kit.** The work is taste-critical: the
devil is in the details. This spec defines the recognizability bar, the human taste
gates, and the generation method that holds consistency as the kit fans out across
material families.

## What already exists (do not rebuild)

Phase 7 Tasks 1–5 shipped the scaffolding:
- `src/data/materials/material-families.v0.1.json` — 6 families × 9 component layers,
  sparse valid-cell matrix; loader `src/materialFamilies.js`.
- `src/visualSystem/colorBinding.js` — `nearestPaletteToken(trueColor, family)`.
- `scripts/verify-inked-component.mjs` — **mechanical** gate (alpha-keyed + tintable-neutral
  + dims). Cannot see taste.
- `src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json` — photo intake.
- `assets/inked/brick-{wall,window,cornice,ground}.v1.png` — the only shipped pixels.

Reference repo exists at `docs/reference/asset-reference/` (56 sorted photos). Clapboard,
window, cornice, door/stoop, weathering are well covered; roll-gate, bay-frame, storefront
awnings, brownstone + warehouse materials are gaps (gather "as we go").

## Locked decisions (2026-06-19)

1. **Recognizability bar = "recognizable silhouette."** Two layers:
   - **Base layer — typological kit.** Generic tintable-neutral components (the 6×9 grid).
     A building reads as the correct Greenpoint *type*.
   - **Signature layer — thin, per-BIN, evidence-bound.** Distinctive buildings get a
     *few* authored signatures (notable cornice, corner condition, known color) on top of
     the base. Never full hero treatment. **Defined now as a contract; built after the
     base grid proves out.** This is the recognizability the generic kit alone can't give.
2. **Scrutiny = two human taste gates, both required**, in addition to the mechanical gate:
   - **Gate A — contact-sheet board:** each new component beside the II-C reference tile +
     its real-photo source, consistent scale, one board per family/column. Approve / reject
     / annotate the *set*. Catches drift across a family in one look.
   - **Gate B — composed-in-scene proof:** components composed + tinted onto a test
     building in-engine, beside a shipped hero. Judge how it *reads in the scene*.
   - Done-line per component: mechanical gate → Gate A → Gate B.
3. **Method = vertical slice, then fan out.** One family driven fully through both gates
   first to lock the shared reference scaffold and prove the gate tooling. Later families
   are generated from the same scaffold and judged against the pilot as the consistency
   anchor. Logged ledger (`hero-facade-build-loop` doctrine for the kit).
4. **Pilot family = clapboard.** Most visually distinct from the proven brick (hardest
   drift test = best anchor), "non-negotiable" in the taxonomy, and **fully covered by
   existing references** — the whole slice runs with zero new-photo waiting. Valid cells:
   `wall, cornice, window, door-stoop, weathering` (per the matrix).

## Scope boundary (the done-line)

**In scope (this spec's first deliverable):**
- Build **Gate A** (contact-sheet board generator) and **Gate B** (composed-in-scene
  proof harness) as reusable tools.
- Drive the **clapboard vertical slice** (5 components) end-to-end through all three gates.
- Lock the **shared reference scaffold** (the one generation recipe every family reuses).
- A **ledger** entry capturing the slice (versions, settings, drift lessons).
- Define the **signature-layer contract** (data shape + application rule) — define only.

**Out of scope (follow-on passes, each its own plan):**
- Fanning out the remaining have-refs families (brownstone, painted-masonry, modern-flat,
  warehouse, + brick's missing columns).
- Gather-dependent columns (bay-frame, awning, roll-gate) — blocked on supplied photos.
- *Building* the signature layer (authoring per-BIN signatures, the swap mechanism).
- Any classifier rewrite, selection/compose wiring, per-building color authoring, or spine
  re-render — these remain **Phase 8** (boundary from the prior spec holds; nothing here is
  wired into building selection).

## Architecture / components

Each unit has one purpose, a defined interface, and is testable in isolation.

### Gate A — contact-sheet board generator (new tool)
- **Does:** given a family + list of generated component PNGs, emits one review board
  image: each component tile beside the II-C reference tile (`docs/reference/art/`) and its
  source photo (`docs/reference/asset-reference/`), at consistent scale, labeled.
- **Interface:** CLI `node scripts/asset-board.mjs --family clapboard` → writes
  `docs/visual-artifacts/asset-kit-boards/<family>-board.png`.
- **Depends on:** the inked PNGs, the reference corpus, a minimal PNG compositor
  (dependency-free, matching repo conventions — see `verify-inked-component.mjs`'s PNG
  reader as the pattern).

### Gate B — composed-in-scene proof harness (new tool)
- **Does:** composes + tints the family's components onto a test building quad in-engine
  via `src/inkedFacadeCompose.js` / `src/SceneView.jsx`, renders beside a shipped hero, and
  captures a screenshot for review. Proves the component *reads* composed, not just as a
  flat PNG. (This realizes the "isolation-preview harness" the prior plan listed but never
  built.)
- **Interface:** a dev route / harness that the preview tooling can screenshot; output to
  `docs/visual-artifacts/asset-kit-boards/<family>-scene-proof.png`.
- **Depends on:** existing compose + SceneView paths (read-only use — **no selection
  wiring**), `colorBinding.js` / `MATERIAL_WALL_TONES` for the tint.

### Shared reference scaffold (the consistency anchor)
- **Does:** the one generation recipe — prompt scaffold + reference-tile attachments +
  tintable-neutral rule — reused for every family so drift is suppressed at the source.
- **Interface:** a documented recipe in the ledger / `GENERATION_KIT.md`, not code.
- **Depends on:** `II-C-style-system-tile.png` (style anchor), per-family source photos.

### Signature-layer contract (define-only here)
- **Does:** specifies how a distinctive building overrides the typological base with a few
  evidence-bound signatures, as a thin extension of the existing facade-spec data — not a
  new renderer. Names the data shape (per-BIN optional signature fields) and the
  application rule (signature wins over base where present).
- **Interface:** a spec section + a JSON shape sketch. No code, no authoring in this pass.

## Per-component generation pipeline (clapboard slice)

Per cell (`wall, cornice, window, door-stoop, weathering`):
1. **Generate** tintable-neutral (dark ink on warm grey, no baked chroma) from the
   clapboard `asset-reference/` photos using the shared scaffold. Photos are truth.
2. **Alpha-key:** `python scripts/key_inked_alpha.py <scratch>.png
   assets/inked/clapboard-<component>.v1.png`.
3. **Mechanical gate:** `node scripts/verify-inked-component.mjs` → cell OK (keyed +
   neutral). Regenerate/re-key on failure.
4. **Gate A:** add to the clapboard board; Batu approves/annotates the set.
5. **Gate B:** scene proof; Batu approves how it reads composed.
6. **Register:** row in `docs/COMPONENT_INVENTORY.md` (module + color source); ledger note.

## Risks / watchouts

- **Style drift across families** (the #1 risk): mitigated by the shared scaffold +
  clapboard as the judged anchor + Gate A per family.
- **Gates becoming a slog:** boards batch a whole family into one approval; Gate B runs once
  per family, not per component.
- **Weathering dirties the palette:** ink/grain only, low chroma — same mechanical check.
- **Signature-layer scope creep:** contract-only here; building it is a later plan.
- **Generic-kit recognizability gap:** explicitly accepted for the base layer and closed by
  the signature layer — the base is never the whole story for distinctive buildings.

## Open questions

None blocking. Signature-layer *authoring*, family fan-out, and gather-dependent columns
are each scheduled as their own follow-on passes after the clapboard slice validates the
gates.
