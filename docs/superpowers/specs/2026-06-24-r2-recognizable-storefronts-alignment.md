# R2 — Recognizable Storefronts: Phase 0 Alignment

Status: **Alignment (pre-build)** — decisions to lock with Batu before any code.
Date: 2026-06-24 (prepped the night Astral / R1 ships)
Track: R (Recognizability), PLAN.md:182. R1 (Astral) done; this is the next lever.

> Read this first thing tomorrow. It frames the decisions; it is **not** a build
> plan. No code until the three locks below are settled.

---

## Why R2 is the highest-leverage move left

The container is ~85% built; the move is *make the Franklin spine recognizable,
then give it a voice* (PLAN.md:167). R1 (Astral) made **one building**
unmistakable bespoke. R2 makes **the whole corridor's storefronts** read as
specific real shops with **zero per-building bespoke work** — the kit discipline.
Highest visible-value-per-hour because it generalizes across ~340 buildings.

## The tension the ground-truth pass surfaced (resolve this first)

"R2" as written in PLAN.md:184 bundles **two different levers** under one name.
They are not the same build, and we should pick deliberately:

**Lever A — the dormant "signature layer" contract (cornice / corner / color).**
- Defined-only. Validator `src/visualSystem/signatureContract.js` (`isValidSignature`)
  exists + is tested, but **nothing calls it**. Example data
  `src/data/facade-signatures/EXAMPLE.signature.v0.1.json` is a template, never loaded.
- Allowed keys are exactly three: `cornice` (named bespoke cornice id), `corner`
  (named corner condition), `color` (true hex, snapped to palette at apply time).
- **Note the mismatch:** these are *whole-building facade* signals, not
  *storefront* signals. Wiring this makes distinctive **buildings** silhouette
  correctly — it does little for "that's the deli on the corner."

**Lever B — storefront-specific recognizability (what the PLAN headline actually describes).**
- Today's storefront path has **no per-BIN distinctiveness**: every storefront is
  a category-label awning/band (`storefrontSigns.js` → `planStorefrontSigns`,
  rendered by `buildStorefrontAwnings` / `makeStorefrontValanceTexture` in
  SceneView.jsx). Food trades get a canopy+valance; others a flat strip. Real
  name only when `claimed && brandName`.
- "Specific real shop, unbranded" means varying the **silhouette + materials +
  awning profile + glazing rhythm + corner treatment** per BIN — not the cornice
  three blocks up.

**Recommendation:** R2's *stated intent* (PLAN.md:184 — "storefronts read as
specific real shops") is **Lever B**. Lever A is real, dormant, and cheap to wire,
but it answers a different question (distinctive building tops, not recognizable
shopfronts). Propose: **R2 = Lever B (storefront recognizability)**; fold Lever A
in opportunistically where a proof-set building has a signature cornice/corner,
since the contract + validator already exist. Confirm with Batu.

## The recognizability vocabulary already specified (don't reinvent)

The **facade-variation-layer** 6 notes (Batu's Gate-A feedback, 2026-06-20, in
`docs/reference/art/ASSET_KIT_LOG.md:140`) are the recognition vocabulary. Status:
- ✅ #1 Stoop-optional — partially built (`hasStoop` override consumed by kit)
- ✅ #6 Fire escapes — built in 8.0 (`fireEscapeGeometry.js`, per-BIN `fireEscape`)
- ☐ #2 Brick sub-types (2–3 wall variants)
- ☐ #3 Window AC units (~1 in 4 — a strong Greenpoint signal, cheap decal)
- ☐ #4 Dual-material facades (capability dormant — `groundFamily`/`groundTint`
  built + unit-tested, never verified in-engine; PLAN.md:238)
- ☐ #5 4–5 door + window TYPES per family (variation is load-bearing at block scale)

For **storefronts specifically**, the recognition signals are: awning profile +
tint, sign-band shape, glazing rhythm/proportion, base materials, roll-gate vs
open, and corner condition. These are not yet parametrized per BIN.

## Three locks — SETTLED (Batu, 2026-06-24)

1. **Lever choice — LOCKED: B over A.** R2 = storefront recognizability. Fold in
   Lever A (cornice/corner/color contract) opportunistically where a proof-set
   building carries one.
2. **Proof set — LOCKED:** Elder Greene · Dandelion Wine · Verge · Moonlight Mile.
   All have photos (Batu).
3. **Branding boundary — LOCKED: yes.** Recognition by form (silhouette +
   materials + awning/glazing), **never a real name** unless claimed.

### Proof-set status (prep pass, 2026-06-24)

| Shop | Category | Addr | In roster? | Source line |
|---|---|---|---|---|
| **Elder Greene** | restaurant | 160 Franklin St | ✅ yes | `block-franklin-milton-storefronts.v0.1.json:25` (note spelling: "Green**e**") |
| **Dandelion Wine** | alcohol/wine | point-only (no house #) | ✅ yes | `block-franklin-north-storefronts.v0.1.json:51` |
| **The Moonlight Mile** | bar | 200 Franklin St | ✅ yes | `block-franklin-north-storefronts.v0.1.json:103` |
| **Verge** | sushi restaurant | 159 Franklin St, 11222 | ❌ **not in any roster** | add record at 0.1 (address known) |

**Prep gaps to close at 0.1 tomorrow:**
- **Verge — record to add (address now known).** Sushi restaurant, **159 Franklin
  St** (odd side, ~across from Elder Greene at 160). Add a roster entry —
  `category: "restaurant"`, `houseNumber: "159"`, `addrStreet: "Franklin Street"`.
  Address-backed placement should slot it by house number along the Franklin-milton
  frontage (no point needed); confirm it lands + survives `dedupeByProximity`.
- **Photos exist but aren't tagged to businesses.** `docs/reference/asset-reference/
  storefront/` and `.../signs/` hold `IMG_*.jpeg` named by camera id, not by shop.
  Mapping which IMG → which of the four is a 0.1 step (Batu confirms the pairing) —
  signature accuracy is photo-gated, so this gate must close before we author each.

## Current-path facts (for whoever builds)

- Plan: `src/storefrontSigns.js` — `planStorefrontSigns({ bays, storeys })` :48,
  `resolveSignLabel` :39, category labels, `claimed/brandName` path.
- Source/dedup: `src/storefrontRoster.js` — `dedupeByProximity` :75.
- Render: `SceneView.jsx` — `buildBlockStorefronts` :1510 (gates out kit-routed
  buildings that self-draw via `decorateStorefront`), `buildStorefrontAwnings`
  :1135, `makeStorefrontValanceTexture` :3410.
- Overrides consumed today: `src/data/facade-overrides/greenpoint-corridor.v0.1.json`
  carries `family/tint/windowTint/.../hasStoop/storefrontAwning/fireEscape` —
  but **no** signature/silhouette fields. This is the file a per-BIN storefront
  signature would likely extend (edit-and-recheck loop, no asset regen).
- Dormant contract: `signatureContract.js` (validator only), `facade-signatures/`
  (example only), `COMPONENT_INVENTORY.md:66` ("BUILD is Phase 7+ work").

## Proposed shape once locked (sketch, not committed)

- Extend the per-BIN override file with a thin storefront-signature block
  (awning profile, base material, glazing rhythm, corner condition) — author-set,
  evidence-bound, falls through to category default when absent. Mirrors the
  signature contract's "present key wins, absent falls through" rule.
- Pure planner change first (TDD on `storefrontSigns.js`), then the renderer seam
  for one proof-set storefront end-to-end, verify four angles, then fan out.
- Interleave **P2 (texture caching)** when storefront variants start multiplying
  CanvasTextures across the corridor (PLAN.md:176) — the enabler that keeps the
  demo loadable.
