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


def family_photos(family: str):
    """Filenames present in the family's material folder."""
    folder = REF / "facade material" / FAMILY_FOLDER.get(family, "")
    if not folder.is_dir():
        return {}
    return {p.name: p for p in folder.iterdir()
            if p.suffix.lower() in (".jpeg", ".jpg", ".png", ".webp")}


def source_photo(family: str, component: str):
    """Prefer a FAMILY-MATCHED reference: a photo cross-filed in both the
    component folder and the family's material folder (the corpus dual-files by
    component + material). Fall back to the component folder's first photo.
    wall/ground come straight from the material folder."""
    mats = family_photos(family)
    if component.endswith("wall") or component == "ground":
        if component == "shingle-wall":  # prefer an actual shingle photo
            for name, p in sorted(mats.items()):
                if "shingle" in name.lower():
                    return p
        return first_photo(REF / "facade material" / FAMILY_FOLDER.get(family, ""))
    sub = COMPONENT_FOLDER.get(component)
    if not sub:
        return None
    comp_folder = REF / sub
    if comp_folder.is_dir() and mats:  # family-matched cross-file
        for p in sorted(comp_folder.iterdir()):
            if p.name in mats:
                return p
    return first_photo(comp_folder)


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
