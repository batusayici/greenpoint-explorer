# Inked Components — Ground-Floor Regen (brick + brownstone) v1

Generation packet for the **Phase 8.0 craft follow-up** (`task_f39b0155`, DECISION_LOG
2026-06-21). Supersedes the **ground cells only** of `inked-components-brick.v1.md` (cell 4)
and `inked-components-brownstone.v1.md` (cell 6). All other cells in those packets stand.

## Why regen

Phase 8.0 added a real **3D stoop + door panel** as geometry in front of the street face
(`stoopGeometry.js` → `decorateInkedWall`). The stoop suppresses the legacy flat door-stoop
PNG, but families with a `ground` asset (brick, brownstone) still paint the old ground band —
which already depicts **painted stairs + an entry door** → the stoop and the painting double
up (visible double-stairs on brownstone). Batu's call (over "suppress the ground band" or
"clapboard-only"): **regenerate the two ground textures without painted stairs/door**, so the
painted parlor-floor wall and the 3D stoop coexist cleanly.

## Locked scope (Batu, 2026-06-21): MINIMAL NOW, defer Phase 8.5

The basement reference corpus (`docs/reference/asset-reference/basement/`, 11 photos) shows
the full Brooklyn base system — **high stoop + iron areaway fence + garden/basement door +
barred basement window**. That whole system stays **Phase 8.5** (its own ref-gated design).
This regen does NOT attempt it. Each ground texture is just:

- the parlor-floor **masonry wall** (brick coursing / brownstone rustication), and
- the parlor **window(s)** — kept because the window-decal grid covers **upper storeys only**
  (`composeInkedFacade`: windows start at `groundFrac`), so the ground floor's only window is
  the one painted in this texture. Drop it and the parlor floor is a blank band.

**Explicitly NOT in these textures:** stoop/steps, balustrade/cheek-walls, entry door,
transom, garden/basement door, basement window, areaway fence. The 3D geometry owns the
entry; Phase 8.5 will own the garden level.

### Entry zone must stay clear (coexistence rule)

The 3D entry is **centered on the bay** (`doorCenterM = frontM / 2`), ~1.3–1.6 m wide, and the
door panel sits at parlor level. So in the texture the **central third of the image width must
be plain wall** — no window, no opening, no painted door there. Place the parlor window(s) to
the **side(s)** of that central zone. The 3D stoop + door panel render proud, in front of this
plain central strip.

---

## Style anchors (attach to BOTH prompts)
`docs/reference/art/II-C-style-system-tile.png`,
`docs/reference/art/inked-indie-compact-corner-style-frame-revision-a.png`,
`docs/reference/art/II-assembled-mini-scene.png`.

## GLOBAL STYLE (paste at the very start of each prompt, replacing the leading `"...`)
"Hand-inked editorial illustration in the exact style of the attached reference boards:
confident dark ink outlines, hand-hatched shadow, visible paper grain, flat orthographic
elevation, no perspective. TINTABLE NEUTRAL: render in dark ink on a light warm-grey fill
(approximately #EDE8E0) ONLY — no saturated color (color is applied later in-engine). No sky,
no ground, no neighbors."

---

## 1. Brick ground — `assets/inked/brick-ground.v1.png`  (1774×887, 2:1, OPAQUE)
"...a residential parlor-floor wall panel for a brick rowhouse: running-bond brick coursing
with inked mortar lines and subtle hatched weathering, and ONE tall parlor window with a stone
lintel above and a stone sill below, placed toward one side. **Draw NO stoop, NO steps, NO
railing, NO entry door, NO transom, and NO basement window** — this panel is wall + one window
only. The **central third of the image width is plain brick wall** with nothing on it (a
separate 3D entry is placed there later). The window sill sits in the upper half of the panel;
brick fills everything else. Opaque, full bay width, edge to edge, fully opaque to the bottom
edge (the bottom edge is the ground line — no transparent or ragged area)."
Refs: brick material set + a parlor-window photo (`window/`, e.g. `IMG_0751`-class brick
window with stone lintel/sill). Do NOT attach stoop/door photos.

## 2. Brownstone ground — `assets/inked/brownstone-ground.v1.png`  (1774×887, 2:1, OPAQUE)
"...a parlor-floor wall panel for a brownstone rowhouse: a RUSTICATED dressed-sandstone base
(deep horizontal banding / ashlar coursing with fine inked joints and faint tooling), and ONE
tall parlor window with a carved hood/lintel and sill, placed toward one side. **Draw NO
stoop, NO steps, NO cheek-walls, NO newel posts, NO entry door, and NO garden-level / basement
door or window** — this panel is rusticated stone + one window only. The **central third of
the image width is plain rusticated stone** with nothing on it (a separate 3D entry is placed
there later). The window sill sits in the upper half of the panel; stone fills everything else.
Opaque, full bay width, edge to edge, fully opaque to the bottom edge (the bottom edge is the
ground line)."
Refs: `facade material/brownstone/` (rustication: `IMG_0819`, `IMG_0825`, `IMG_0864`,
`IMG_0865`) + a brownstone parlor-window photo (`window/` `IMG_0751` carved surround /
`IMG_0729` scrolled lintel). Do NOT attach stoop/door/areaway photos.

---

## Output / intake
- **Overwrite** the existing v1 files (the runtime resolves `kitFile(family,"ground")` →
  `${family}-ground.v1.png`; keep the filename so no wiring changes). Kit-coverage manifest
  unchanged.
- Raw drop: `.scratch/asset-kit-raw/{brick,brownstone}/ground.png` (gitignored).
- Before overwriting, the old painted-stairs files are backed up to
  `.scratch/asset-kit/{brick,brownstone}-ground.painted-stairs.png` for provenance.
- **Opaque tiles — no alpha key** (ground bands are full-opacity quads; `key_inked_alpha.py`
  is not run for these, unlike window/cornice/door-stoop).

## Post-generation QA (agent runs downstream)
1. **No entry artifacts:** confirm zero painted stairs / railing / door / transom / basement
   opening; central third is plain wall.
2. **Neutral fill:** sample several wall areas — must read warm grey ≈ #EDE8E0, no baked
   chroma; survives a color-multiply tint without hue shift.
3. **Mechanical gate:** `node scripts/verify-inked-component.mjs` → both cells OK
   (tintable-neutral + dims; opaque, so the alpha check is N/A for ground).
4. **Gate B scene proof:** drop in, compose in-engine, screenshot the pilot cluster (brick
   148 Franklin, brownstone 168 Franklin) — confirm the 3D stoop + door panel sit cleanly in
   front of plain wall, **no double-stairs**, parlor window reads beside the entry.
5. **Re-gate the 8.0 look** (the original blocker) once both land; then ledger + DECISION_LOG.
