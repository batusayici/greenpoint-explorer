# Inked Component Kit — Scalability & Recognizability Validation Pathway

> Active track after the 2026-06-16 inked component-kit spike (conditional GO,
> DECISION_LOG 2026-06-16). This GATES writing the full component-kit spec: prove
> the workflow **scales** and produces **recognizable** facades on the cheapest
> possible tests, before building 4 material kits + the automated data pipeline.

## The two risks (and which is scarier)

1. **Scalability** (lower risk) — does typology-driven auto-composition stamp N
   facades correctly at density (occlusion, perf, variety, bay-derivation)? Mostly a
   loop + param derivation; if it works for a few it works for many.
2. **Recognizability** (the real risk) — even with right material/color/storeys, does
   a *kit-composed* facade make a real building read as *itself*, or does it produce
   generic "brick soup" where every block looks the same? If the latter, no data
   automation saves it; the kit needs more (e.g. real window placement).

Strategy: target recognizability; get scalability for free by testing across a block.
**Wizard-of-Oz the data layer** — hand-author real per-building params (no extraction
pipeline yet) so we test the *kit's* recognizability ceiling cheaply.

## Staged steps (each gates the next)

### Step 0 — Window v2 re-render — ✅ DONE (2026-06-16)
Windows must read before any recognizability judgment (v1 washed to white blocks).
Batu re-rendered `brick-window.v1` bolder/darker per
`docs/reference/art/prompts/inked-components-brick.v1.md` (dark charcoal glass, bold ink
outlines, flat ~245-luminance keyable bg — NOT "transparent"). Keyed in place with
`scripts/key_inked_alpha.py` (threshold 236): 46.1% of pixels cleared to alpha=0, corners
transparent, glass walled-off and retained opaque. **Verified in-engine** on the
block-stamped facades — windows now read as dark double-hung units at facade scale, no
white block. Commit `d756ad2`.

### Step 1 — Scalability (engineering) — ✅ DONE (2026-06-16)
Block-stamp harness (`INKED_FACADE_BLOCK` in `buildInkedFacadeTest`): auto-selected 8
brick-prewar buildings via `classifyBuilding`, derived bays from frontage, varied tint
per-BIN. **Result:** mechanism scales (auto-select + compose + vary + perf fine);
variety reads as a street, not copy-paste.
**Blocker found → architectural directive:** facades composited as scene-root floating
quads are occluded/mis-registered against the massing at density. The full kit MUST
route inked components through the existing **wall-mesh / `facadeAssembly`** path (like
`decorateTypologicalWall`, which parents decoration to the wall and inherits per-view
culling), not free quads.

### Step 2 — 2-building recognizability micro-test — after Step 0
The two current buildings, but with REAL sampled color + REAL bay count, side-by-side
with a photo of those actual buildings. Gate: if even one fails to read as itself,
stop and rethink the kit (don't scale).

### Step 3 — One-block Wizard-of-Oz — after Step 0 + Batu's photographed block
OWNER for ground truth: Batu (photograph one mostly-brick spine block). Hand-author
real params (material, sampled color→tint, storeys, bays, awning/stoop) for every
building; auto-compose in one pass via the block-stamp harness; compare to the photo.
Validates recognizability-at-scale + the scaling mechanism together.

## Gate to the full kit
Only after Step 3 reads as recognizable do we build: (a) the automated imagery→params
extraction (Tier B, see [[facade-truth-pipeline]] memory: Mapillary-primary, SV
extract-only, spine-first), and (b) the other 3 material kits (clapboard / brownstone /
modern). The block-stamp harness IS the Step-3 rig — swap placeholder per-BIN tints for
real sampled params.

## Explicitly NOT building during validation
The other 3 material kits; the automated extraction pipeline; the full component
library; the wall-mesh integration rebuild (that's the first kit-build task, informed
by Step 1's directive).
