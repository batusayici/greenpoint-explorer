# Asset Kit Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two human taste gates (contact-sheet board + composed-in-scene proof) and drive the clapboard component slice (wall, cornice, window, door-stoop, weathering) end-to-end through them, locking a reusable generation scaffold and ledger.

**Architecture:** Two new reusable review tools + one asset-production pass. Gate A is a Python/Pillow CLI that builds a per-family contact-sheet board (generated component beside the II-C reference tile + its real source photo). Gate B is a dev-only in-engine harness (mounted under a URL param, reusing `composeInkedFacade` + the existing inked-texture path) that composes + tints a family onto a test quad for a screenshot — **without touching production building selection** (Phase 8 boundary). Both gates are proven on the already-shipped brick assets before clapboard is generated. The signature-layer is defined as a contract only (doc + example JSON), not built.

**Tech Stack:** Python 3 + Pillow 11.3 (Gate A, matching `scripts/key_inked_alpha.py`); Node ESM `node --test` (pure helpers + signature contract check); React 19 + Three.js + Vite (Gate B harness, dev-only); GPT image generation + `scripts/key_inked_alpha.py` (clapboard assets); the existing mechanical gate `scripts/verify-inked-component.mjs`.

## Global Constraints

- **Palette is a no-miss.** Every scene color resolves to a token in `src/visualSystem/palette.js`; components ship tintable-neutral (dark ink on warm grey), no baked chroma. (`docs/ART_DIRECTION.md`.)
- **Photos are truth.** Clapboard components are generated from `docs/reference/asset-reference/` photos; never invent architecture in prose. (`docs/reference/art/GENERATION_KIT.md`.)
- **No selection/classifier wiring.** Do NOT modify `buildingTypology.js` classification, `selectTreatment`, or the production procedural-facade selection path in `SceneView.jsx`. Gate B mounts as an additive dev-only harness behind a URL param. (Spec §Scope boundary; Phase 8 holds.)
- **Signature layer is define-only.** Contract doc + example JSON + a parse check. No merge code, no per-building authoring, no renderer. (Spec decision 1 / §Scope.)
- **Asset path convention:** `assets/inked/<family>-<component>.v1.png`. Valid cells come from `src/materialFamilies.js` `validCells()`. Clapboard's valid cells: `wall, cornice, window, door-stoop, weathering`.
- **Mechanical gate is `node scripts/verify-inked-component.mjs`** — keyed (has transparency) + tintable-neutral (`meanChroma ≤ 28`). Every generated component must pass it before the human gates.
- **Frequent commits**; run `npm run verify` before declaring the deliverable done.

## File Structure

**New (tooling/code):**
- `scripts/asset_kit_board.py` — Gate A: per-family contact-sheet board generator (Pillow).
- `src/assetKitProof.js` — pure helper `assetKitComponentFiles(family)` → expected inked PNG filenames for a family's valid cells (drives Gate B).
- `src/assetKitProof.test.mjs` — unit test for the helper.
- `src/dev/AssetKitProof.js` — Gate B: dev-only in-engine harness that composes + tints a family onto a test quad (mounted under `?assetkit=<family>`).
- `src/visualSystem/signatureContract.js` — pure `isValidSignature(obj)` shape validator (the contract made checkable).
- `src/visualSystem/signatureContract.test.mjs` — validator tests.
- `src/data/facade-signatures/EXAMPLE.signature.v0.1.json` — the signature data-shape sketch (define-only).
- `docs/reference/art/ASSET_KIT_LOG.md` — the build ledger + locked shared scaffold recipe.

**Modified:**
- `src/SceneView.jsx` — mount the Gate B harness under `?assetkit=` (additive, dev-only; near the existing `?facadeedit` check ~line 93 and `buildInkedFacadeTest` ~line 212).
- `package.json` — add `board` convenience script.
- `docs/COMPONENT_INVENTORY.md` — clapboard component rows + color sources.
- `docs/PLAN.md`, `docs/DECISION_LOG.md` — close entry (Task 6).

**Generated assets (Task 5, procedure not literal):**
- `assets/inked/clapboard-{wall,cornice,window,door-stoop,weathering}.v1.png`.

---

## Task 1: Gate A — contact-sheet board generator

**Files:**
- Create: `scripts/asset_kit_board.py`
- Modify: `package.json` (add `board` script)

**Interfaces:**
- Produces: CLI `python3 scripts/asset_kit_board.py <family>` → writes `docs/visual-artifacts/asset-kit-boards/<family>-board.png`. For each existing `assets/inked/<family>-<component>.v1.png`, one row: the generated component (on the kit warm-grey) beside its real source photo, with the II-C system tile as a full-width header. Labels each row `<component> · <source filename>`. Missing source folder → row still shown, source cell labeled "no ref".
- Consumes: `assets/inked/`, `docs/reference/art/II-C-style-system-tile.png`, `docs/reference/asset-reference/` folders.
- **No node test** (Python asset tool, mirroring `scripts/key_inked_alpha.py`); verified by running against the shipped brick assets.

- [ ] **Step 1: Write the generator**

`scripts/asset_kit_board.py`:

```python
#!/usr/bin/env python3
"""Gate A — contact-sheet board for one material family.

Lays each generated inked component (assets/inked/<family>-<component>.v1.png)
beside its real reference photo, under the II-C system tile as the style anchor,
so style drift across a family is visible in one look. Output:
docs/visual-artifacts/asset-kit-boards/<family>-board.png

Usage: python3 scripts/asset_kit_board.py <family>
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
INKED = ROOT / "assets" / "inked"
TILE = ROOT / "docs" / "reference" / "art" / "II-C-style-system-tile.png"
REF = ROOT / "docs" / "reference" / "asset-reference"
OUT_DIR = ROOT / "docs" / "visual-artifacts" / "asset-kit-boards"

KIT_BG = (216, 210, 188)   # warm grey (II-C tintable-neutral ground)
INK = (40, 38, 34)
CELL = 320                 # component/source cell square (px)
PAD = 28
LABEL_H = 30

# family -> material-folder name under "facade material/"
FAMILY_FOLDER = {
    "brick": "brick",
    "clapboard": "clapboard (wood-frame)",
    "brownstone": "brownstone",
    "painted-masonry": "masonry",
    "modern-flat": "modern flat",
    "warehouse": "industrial:warehouse",
}
# component -> reference folder (relative to asset-reference root)
COMPONENT_FOLDER = {
    "cornice": "cornice",
    "window": "window",
    "door-stoop": "door:stoop",
    "weathering": "weathering",
    "bay-frame": "bay-frame",
    "awning": "awning",
    "roll-gate": "roll-gate",
}


def first_photo(folder: Path):
    if not folder.is_dir():
        return None
    for p in sorted(folder.iterdir()):
        if p.suffix.lower() in (".jpeg", ".jpg", ".png"):
            return p
    return None


def source_photo(family: str, component: str):
    if component == "wall":
        return first_photo(REF / "facade material" / FAMILY_FOLDER.get(family, ""))
    sub = COMPONENT_FOLDER.get(component)
    return first_photo(REF / sub) if sub else None


def fit(path: Path, size: int):
    """Load a photo/png, EXIF-correct, fit into a size×size cell on KIT_BG."""
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    im = ImageOps.contain(im, (size, size))
    cell = Image.new("RGB", (size, size), KIT_BG)
    cell.paste(im, ((size - im.width) // 2, (size - im.height) // 2))
    return cell


def component_cell(png: Path, size: int):
    """Composite an alpha-keyed inked PNG over KIT_BG, fit into a cell."""
    im = Image.open(png).convert("RGBA")
    bg = Image.new("RGBA", im.size, KIT_BG + (255,))
    flat = Image.alpha_composite(bg, im).convert("RGB")
    flat = ImageOps.contain(flat, (size, size))
    cell = Image.new("RGB", (size, size), KIT_BG)
    cell.paste(flat, ((size - flat.width) // 2, (size - flat.height) // 2))
    return cell


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/asset_kit_board.py <family>", file=sys.stderr)
        sys.exit(2)
    family = sys.argv[1]
    comps = sorted(p for p in INKED.glob(f"{family}-*.v1.png"))
    if not comps:
        print(f"No assets/inked/{family}-*.v1.png found", file=sys.stderr)
        sys.exit(1)

    header = ImageOps.contain(Image.open(TILE).convert("RGB"), (2 * CELL + PAD, CELL))
    rows = len(comps)
    W = 2 * CELL + 3 * PAD
    H = header.height + PAD + rows * (CELL + LABEL_H + PAD) + PAD
    board = Image.new("RGB", (W, H), KIT_BG)
    draw = ImageDraw.Draw(board)
    board.paste(header, ((W - header.width) // 2, PAD))

    y = header.height + 2 * PAD
    for png in comps:
        component = png.name[len(family) + 1: -len(".v1.png")]
        board.paste(component_cell(png, CELL), (PAD, y))
        src = source_photo(family, component)
        if src:
            board.paste(fit(src, CELL), (2 * PAD + CELL, y))
            src_label = src.name
        else:
            draw.rectangle([2 * PAD + CELL, y, 2 * PAD + 2 * CELL, y + CELL], outline=INK)
            draw.text((2 * PAD + CELL + 12, y + 12), "no ref", fill=INK)
            src_label = "no ref"
        draw.text((PAD, y + CELL + 8), f"{family}-{component}  |  src: {src_label}", fill=INK)
        y += CELL + LABEL_H + PAD

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{family}-board.png"
    board.save(out)
    print(f"wrote {out.relative_to(ROOT)}  ({rows} components)")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run it against the shipped brick assets**

Run: `python3 scripts/asset_kit_board.py brick`
Expected: prints `wrote docs/visual-artifacts/asset-kit-boards/brick-board.png  (4 components)`. Open the PNG: II-C tile header on top; four rows (cornice, ground, wall, window) each showing the inked component beside a real brick photo (ground → "no ref", since there is no `ground` reference folder). This proves the tool on known-good input.

- [ ] **Step 3: Add the convenience script**

In `package.json` scripts add:

```json
    "board": "python3 scripts/asset_kit_board.py",
```

- [ ] **Step 4: Commit**

```bash
git add scripts/asset_kit_board.py package.json
git commit -m "feat(gate-a): per-family contact-sheet board generator (proven on brick)"
```

---

## Task 2: Gate B — composed-in-scene proof harness (dev-only)

**Files:**
- Create: `src/assetKitProof.js`
- Test: `src/assetKitProof.test.mjs`
- Create: `src/dev/AssetKitProof.js`
- Modify: `src/SceneView.jsx` (additive mount under `?assetkit=<family>`)

**Interfaces:**
- Produces: `assetKitComponentFiles(family) -> string[]` — the inked PNG filenames for a family's valid cells, EXCLUDING `ground` (rendered as a band, not a wall layer) — e.g. `["clapboard-wall.v1.png", ...]`, sorted. Throws on unknown family.
- Produces: `mountAssetKitProof(three, scene, family)` — composes (via `composeInkedFacade`) + tints (via `MATERIAL_WALL_TONES`) the family's components onto a single test quad, returns nothing. Dev-only.
- Consumes: `validCells` (`src/materialFamilies.js`), `MATERIAL_WALL_TONES` (`src/visualSystem/palette.js`), `composeInkedFacade` (`src/inkedFacadeCompose.js`), and the existing inked-texture loader in `SceneView.jsx`.

- [ ] **Step 1: Write the failing test**

`src/assetKitProof.test.mjs`:

```js
// Run: node --test src/assetKitProof.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetKitComponentFiles } from "./assetKitProof.js";

test("clapboard yields its valid wall-layer components, ground excluded", () => {
  const files = assetKitComponentFiles("clapboard");
  assert.deepEqual(files, [
    "clapboard-cornice.v1.png",
    "clapboard-door-stoop.v1.png",
    "clapboard-wall.v1.png",
    "clapboard-weathering.v1.png",
    "clapboard-window.v1.png",
  ]);
});

test("brick excludes the ground band from the wall-layer list", () => {
  const files = assetKitComponentFiles("brick");
  assert.ok(!files.includes("brick-ground.v1.png"), "ground is a band, not a wall layer");
  assert.ok(files.includes("brick-wall.v1.png"));
});

test("throws on unknown family", () => {
  assert.throws(() => assetKitComponentFiles("nope"), /unknown family/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/assetKitProof.test.mjs`
Expected: FAIL — `Cannot find module './assetKitProof.js'`.

- [ ] **Step 3: Write the helper**

`src/assetKitProof.js`:

```js
// Gate B support — pure mapping from a material family to the inked component
// PNG filenames the in-scene proof should load. Excludes `ground` (drawn as a
// bottom band by the renderer, not a wall layer). Pure + Node-testable; the
// THREE harness (src/dev/AssetKitProof.js) consumes this.
import { validCells, familyList } from "./materialFamilies.js";

export function assetKitComponentFiles(family) {
  if (!familyList().includes(family)) throw new Error(`unknown family: ${family}`);
  return validCells()
    .filter((c) => c.family === family && c.component !== "ground")
    .map((c) => `${family}-${c.component}.v1.png`)
    .sort();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/assetKitProof.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the dev harness**

`src/dev/AssetKitProof.js`:

```js
// Gate B — dev-only composed-in-scene proof. Renders one material family's
// inked components, composed (composeInkedFacade) and tinted (MATERIAL_WALL_TONES),
// onto a single test quad so a component can be judged as it READS in-scene, not
// as a flat PNG. Mounted ONLY under ?assetkit=<family> (see SceneView). This does
// NOT touch production building selection — it is an additive review surface.
import { composeInkedFacade } from "../inkedFacadeCompose.js";
import { MATERIAL_WALL_TONES } from "../visualSystem/palette.js";
import { assetKitComponentFiles } from "../assetKitProof.js";

// `inkedTexture(file, repeat?)` is the existing memoized loader passed in from
// SceneView so this module stays free of asset-URL plumbing.
export function mountAssetKitProof(THREE, scene, family, inkedTexture) {
  const files = new Set(assetKitComponentFiles(family));
  const tint = MATERIAL_WALL_TONES[family]?.[0] ?? 0xffffff;
  const group = new THREE.Group();
  const W = 6, H = 8;

  const quad = (rect, z, file, { transparent = false, useTint = false } = {}) => {
    const g = new THREE.PlaneGeometry((rect.x1 - rect.x0) * W, (rect.y1 - rect.y0) * H);
    g.translate(((rect.x0 + rect.x1) / 2 - 0.5) * W, ((rect.y0 + rect.y1) / 2) * H, z);
    const m = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent });
    const tex = file && files.has(file) ? inkedTexture(file) : null;
    if (tex) m.map = tex;
    if (useTint) m.color.setHex(tint);
    group.add(new THREE.Mesh(g, m));
  };

  const f = composeInkedFacade({ storeys: 3, bays: 2 });
  quad(f.wall, 0.0, `${family}-wall.v1.png`, { useTint: true });
  quad(f.cornice, 0.02, `${family}-cornice.v1.png`, { transparent: true, useTint: true });
  for (const w of f.windows) quad(w, 0.03, `${family}-window.v1.png`, { transparent: true });
  // door-stoop centered on the ground band; weathering washes the whole wall.
  quad({ x0: 0.4, x1: 0.6, y0: 0, y1: f.ground.y1 }, 0.03, `${family}-door-stoop.v1.png`, { transparent: true });
  quad(f.wall, 0.05, `${family}-weathering.v1.png`, { transparent: true });

  scene.add(group);
  return group;
}
```

- [ ] **Step 6: Mount it dev-only in SceneView**

In `src/SceneView.jsx`, near the existing `?facadeedit` read (~line 93) add a family read, and where `buildInkedFacadeTest(three, scene)` is called (~line 212) gate the proof. Use the existing inked loader (`inkedTexture` / `loadInkedComponent` already in this file) as the `inkedTexture` arg.

```jsx
// near other URLSearchParams reads
const assetKitFamily = new URLSearchParams(window.location.search).get("assetkit");
```

```jsx
// where the scene is assembled (replace/guard the spike call site)
if (assetKitFamily) {
  import("./dev/AssetKitProof.js").then(({ mountAssetKitProof }) =>
    mountAssetKitProof(three, scene, assetKitFamily, inkedTexture)
  );
}
```

(If `inkedTexture` is not in scope at that exact line, pass the file-scoped memoized loader used by `buildProceduralFacade` — the one calling `new URL("../assets/inked/...")`. Do NOT add a new selection path.)

- [ ] **Step 7: Prove the harness on brick via the preview tooling**

Start the dev server, load `http://127.0.0.1:5173/?assetkit=brick`, and screenshot. Expected: a single tinted brick test facade (wall + cornice + windows) renders with no console errors. This proves Gate B on shipped assets before clapboard exists. (Clapboard will render partial until Task 5 generates it — expected.)

- [ ] **Step 8: Run tests + commit**

Run: `node --test src/assetKitProof.test.mjs` → PASS.

```bash
git add src/assetKitProof.js src/assetKitProof.test.mjs src/dev/AssetKitProof.js src/SceneView.jsx
git commit -m "feat(gate-b): dev-only composed-in-scene proof harness (?assetkit=, proven on brick)"
```

---

## Task 3: Signature-layer contract (define-only)

**Files:**
- Create: `src/visualSystem/signatureContract.js`
- Test: `src/visualSystem/signatureContract.test.mjs`
- Create: `src/data/facade-signatures/EXAMPLE.signature.v0.1.json`

**Interfaces:**
- Produces: `isValidSignature(obj) -> boolean` — true iff `obj` matches the per-BIN signature shape: `{ bin: string, signatures: object }` where `signatures` is a non-empty map of allowed signature keys (`cornice`, `corner`, `color`) to non-null values. This MAKES THE CONTRACT CHECKABLE; it is NOT a renderer and is NOT wired anywhere. The application rule ("signature wins over base where present") is documented, not coded.
- Consumes: nothing.

- [ ] **Step 1: Write the example signature shape**

`src/data/facade-signatures/EXAMPLE.signature.v0.1.json`:

```json
{
  "_doc": "Define-only signature shape (recognizable-silhouette layer). A per-BIN, evidence-bound override of a FEW typological signatures on top of the generic kit base. NOT authored for real buildings and NOT wired into any renderer in this phase. Application rule: a signature key, when present, WINS over the typological base for that one aspect; absent keys fall through to the base kit. Allowed keys: cornice (a named bespoke cornice asset/profile id), corner (a named corner condition), color (a true hex snapped via colorBinding.nearestPaletteToken at apply time).",
  "version": "0.1",
  "bin": "0000000",
  "signatures": {
    "cornice": "bracketed-dentil-deep",
    "corner": "chamfered-entry",
    "color": "0x8a5a3c"
  }
}
```

- [ ] **Step 2: Write the failing test**

`src/visualSystem/signatureContract.test.mjs`:

```js
// Run: node --test src/visualSystem/signatureContract.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { isValidSignature } from "./signatureContract.js";

const HERE = dirname(fileURLToPath(import.meta.url));

test("the committed example matches the contract shape", () => {
  const ex = JSON.parse(
    readFileSync(join(HERE, "../data/facade-signatures/EXAMPLE.signature.v0.1.json"), "utf8"),
  );
  assert.equal(isValidSignature(ex), true);
});

test("rejects missing bin or empty signatures", () => {
  assert.equal(isValidSignature({ signatures: { cornice: "x" } }), false);
  assert.equal(isValidSignature({ bin: "1", signatures: {} }), false);
});

test("rejects unknown signature keys", () => {
  assert.equal(isValidSignature({ bin: "1", signatures: { roofline: "x" } }), false);
});

test("rejects null signature values", () => {
  assert.equal(isValidSignature({ bin: "1", signatures: { color: null } }), false);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test src/visualSystem/signatureContract.test.mjs`
Expected: FAIL — `Cannot find module './signatureContract.js'`.

- [ ] **Step 4: Write the validator**

`src/visualSystem/signatureContract.js`:

```js
// Recognizable-silhouette SIGNATURE contract (define-only). A per-BIN, evidence-
// bound override of a few typological signatures on top of the generic kit base.
// This module only VALIDATES the data shape so the contract is checkable; it does
// NOT apply signatures and is NOT wired into any renderer (that is a later build
// pass). Application rule (documented, not coded here): a present signature key
// wins over the base for that aspect; absent keys fall through to the kit.
const ALLOWED_KEYS = new Set(["cornice", "corner", "color"]);

export function isValidSignature(obj) {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.bin !== "string" || obj.bin.length === 0) return false;
  const sig = obj.signatures;
  if (!sig || typeof sig !== "object") return false;
  const keys = Object.keys(sig);
  if (keys.length === 0) return false;
  return keys.every((k) => ALLOWED_KEYS.has(k) && sig[k] != null);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test src/visualSystem/signatureContract.test.mjs`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/visualSystem/signatureContract.js src/visualSystem/signatureContract.test.mjs src/data/facade-signatures/EXAMPLE.signature.v0.1.json
git commit -m "feat(signature): define-only recognizable-silhouette signature contract + example"
```

---

## Task 4: Lock the shared scaffold + open the build ledger

**Files:**
- Create: `docs/reference/art/ASSET_KIT_LOG.md`

**Interfaces:** none (doc). This is the consistency anchor: the ONE generation recipe every family reuses, plus the per-family ledger (mirrors `HERO_FACADE_LOG.md`).

- [ ] **Step 1: Write the ledger + scaffold recipe**

`docs/reference/art/ASSET_KIT_LOG.md`:

```markdown
# Asset Kit Build Log

Per-family ledger for the inked component kit (recognizable-silhouette model).
Doctrine (from `hero-facade-build-loop`): read this AND the spec before a family;
append an entry after. Each family makes the next cheaper.

## Shared reference scaffold (THE consistency anchor — reuse verbatim per family)

Every family is generated from this one recipe so style does not drift. Only the
material noun and the attached source photos change between families.

**Per component, generate tintable-neutral:**
> Redraw the [COMPONENT] of a Greenpoint [FAMILY] building in the attached
> hand-inked editorial illustration style (II-C system: confident 1–4px linework,
> controlled hatching for shadow, paper texture). Draw it in DARK INK ON WARM GREY
> ONLY — no baked color, no chroma; the color is applied later by tint. Isolated
> subject, centered, on a flat near-white keyable background, no scene, no
> neighbors, no sky. Copy the structure from the attached reference photos exactly
> — proportions, joinery, profile — do not invent or regularize.

Attach: (1) the II-C system tile `docs/reference/art/II-C-style-system-tile.png`,
(2) the component's reference photos from `docs/reference/asset-reference/`.

**Gate order per component:** mechanical (`verify-inked-component.mjs`) →
Gate A board → Gate B scene proof.

## Anchor family: clapboard

_(filled in Task 5)_
```

- [ ] **Step 2: Commit**

```bash
git add docs/reference/art/ASSET_KIT_LOG.md
git commit -m "docs(asset-kit): lock shared generation scaffold + open build ledger"
```

---

## Task 5: Generate the clapboard slice through all three gates

> ASSET-PRODUCTION task (GPT generation + alpha-keying), not a code TDD loop. Has two human-approval STOP checkpoints (Batu). Consumes Tasks 1, 2, 4.

**Files:**
- Create: `assets/inked/clapboard-{wall,cornice,window,door-stoop,weathering}.v1.png`
- Modify: `docs/COMPONENT_INVENTORY.md`, `docs/reference/art/ASSET_KIT_LOG.md`

**Interfaces:**
- Consumes: the shared scaffold (Task 4), `docs/reference/asset-reference/` clapboard photos, `scripts/key_inked_alpha.py`, `scripts/verify-inked-component.mjs`, `scripts/asset_kit_board.py` (Task 1), `?assetkit=clapboard` (Task 2).

- [ ] **Step 1: Confirm references present**

Run: `ls "docs/reference/asset-reference/facade material/clapboard (wood-frame)" docs/reference/asset-reference/window docs/reference/asset-reference/cornice "docs/reference/asset-reference/door:stoop" docs/reference/asset-reference/weathering`
Expected: each lists photos. (All five clapboard cells are covered per `MANIFEST.md`.)

- [ ] **Step 2: Generate each component tintable-neutral**

For each of `wall, cornice, window, door-stoop, weathering`: use the **shared scaffold** (Task 4) with `[FAMILY]=clapboard` and the matching reference photos. Window standout `0751`; door/stoop standout `0752`; cornice `0702/0703/0722/0723`; wall from the clapboard material folder; weathering `0705/0706/0738/0739`. Save raw GPT output to a scratch path OUTSIDE `assets/` (e.g. `/tmp/clapboard-<component>.raw.png`).

- [ ] **Step 3: Alpha-key each**

Run per file: `python3 scripts/key_inked_alpha.py /tmp/clapboard-<component>.raw.png assets/inked/clapboard-<component>.v1.png`
Expected: a clean alpha-keyed PNG. If background residue remains, pass a threshold arg (see the tool's docstring) and re-key.

- [ ] **Step 4: Mechanical gate**

Run: `node scripts/verify-inked-component.mjs`
Expected: the five `clapboard-*` cells move PENDING → OK. A `baked color` failure → regenerate that cell more neutral (Step 2). A `not alpha-keyed` failure → re-key (Step 3). Do not proceed until all five are OK.

- [ ] **Step 5: Gate A — contact-sheet board**

Run: `python3 scripts/asset_kit_board.py clapboard`
Expected: `docs/visual-artifacts/asset-kit-boards/clapboard-board.png` written with 5 rows. **STOP — send the board to Batu for approve/reject/annotate.** On any reject, regenerate the flagged component (Step 2) and re-board. Do not proceed until Batu approves the set.

- [ ] **Step 6: Gate B — composed-in-scene proof**

Start the dev server; load `http://127.0.0.1:5173/?assetkit=clapboard`; screenshot. Expected: the clapboard components compose + tint onto the test facade and read correctly beside a shipped hero. **STOP — send the scene proof to Batu.** On reject, regenerate/adjust and repeat from Step 2 for the flagged component. Do not proceed until Batu approves how it reads in-scene.

- [ ] **Step 7: Inventory + ledger**

Add the five clapboard rows to `docs/COMPONENT_INVENTORY.md` (color source: `MATERIAL_WALL_TONES.clapboard` for tinted layers; ink/grain only for weathering). Fill the "Anchor family: clapboard" section of `ASSET_KIT_LOG.md`: render versions, key thresholds used, structural quirks (board-and-batten vs shingle variants), iteration count per component, and the one-line lesson. Promote any durable lesson into the scaffold section.

- [ ] **Step 8: Full gate + commit**

Run: `npm run verify`
Expected: PASS — tests, conformance, visual baseline, components (clapboard now OK), stories.

```bash
git add assets/inked/clapboard-*.v1.png docs/COMPONENT_INVENTORY.md docs/reference/art/ASSET_KIT_LOG.md docs/visual-artifacts/asset-kit-boards/clapboard-board.png
git commit -m "feat(asset-kit): clapboard slice (wall/cornice/window/door-stoop/weathering) through both taste gates"
```

---

## Task 6: Close — plan/decision-log/inventory reconcile

**Files:**
- Modify: `docs/PLAN.md`, `docs/DECISION_LOG.md`, `docs/COMPONENT_INVENTORY.md`

**Interfaces:** none (docs).

- [ ] **Step 1: Record the decisions**

Add a newest-first `docs/DECISION_LOG.md` entry: recognizable-silhouette model (typological base + define-only signature layer), two human taste gates (board + scene proof) on top of the mechanical gate, vertical-slice method with clapboard as the consistency anchor.

- [ ] **Step 2: Update PLAN.md**

In `docs/PLAN.md`, record: Gate A + Gate B built; clapboard slice shipped; carryover = fan out remaining have-refs families (brownstone, painted-masonry, modern-flat, warehouse, brick's missing columns), gather-dependent columns (bay-frame/awning/roll-gate, pending photos), and BUILDING the signature layer — each its own pass. Phase 8 (classifier/selection/color authoring/spine re-render) unchanged.

- [ ] **Step 3: Reconcile inventory gaps**

In `docs/COMPONENT_INVENTORY.md`, move clapboard from gap → realized; note the two new gates as the standing taste pipeline for all future families.

- [ ] **Step 4: Final gate + commit**

Run: `npm run verify`
Expected: PASS.

```bash
git add docs/PLAN.md docs/DECISION_LOG.md docs/COMPONENT_INVENTORY.md
git commit -m "docs(asset-kit): close — gates built, clapboard anchor shipped, carryover recorded"
```

---

## Self-Review

**Spec coverage:**
- Recognizability model (base + signature layer) → Task 3 defines the signature contract; base is the generated grid (Task 5). ✓
- Gate A (contact-sheet board) → Task 1. ✓
- Gate B (composed-in-scene proof) → Task 2. ✓
- Both-gates done-line per component → Task 5 Steps 4–6. ✓
- Vertical-slice method + shared scaffold lock + ledger → Task 4 + Task 5 Step 7. ✓
- Clapboard pilot (5 cells, full ref coverage) → Task 5. ✓
- Signature layer DEFINE-ONLY (no build/wiring) → Task 3 (validator + example + documented rule; no renderer). ✓
- No selection/classifier wiring → Gate B is additive dev-only (`?assetkit=`); constraint restated; no production path edited. ✓
- Mechanical gate reused → Task 5 Step 4. ✓
- Follow-on passes deferred → Task 6 Step 2. ✓

**Placeholder scan:** No TBD/TODO. Code steps carry full code; asset-production steps name exact tools/commands and the scaffold doc (pixels can't be literal'd — procedure + gates are exact). The ASSET_KIT_LOG "anchor family" section is intentionally `_(filled in Task 5)_` — a doc template, filled by Task 5 Step 7. ✓

**Type consistency:** `assetKitComponentFiles(family)` defined/tested in Task 2, consumed by `mountAssetKitProof` (Task 2). `isValidSignature(obj)` defined/tested in Task 3 only. `MATERIAL_WALL_TONES`/`composeInkedFacade`/`validCells`/`familyList` consumed with their real existing signatures. Asset path `assets/inked/<family>-<component>.v1.png` consistent across Tasks 1, 2, 5. CLI `asset_kit_board.py <family>` consistent in Tasks 1 + 5. ✓
```
