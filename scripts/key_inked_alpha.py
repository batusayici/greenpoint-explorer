#!/usr/bin/env python3
"""Key the near-white background of an inked component PNG to real alpha.

GPT-5.5 renders "transparent" components on a baked near-white (faint checker)
background with no alpha channel. This floods inward from the image border
through near-white pixels, stopping at the subject's dark ink outline, and sets
those reachable background pixels to alpha=0. Enclosed near-white regions (e.g.
window glass walled off by muntins) are NOT reached from the border, so they stay
opaque. Seeding from the whole border (only where the border pixel is itself
near-white) means a subject that touches an edge with a darker fill — like the
cornice band spanning left-to-right — is never seeded and never eaten.

Usage: python3 scripts/key_inked_alpha.py <in.png> <out.png> [threshold] [--preview out_preview.png]
"""
import sys
from collections import deque
from PIL import Image


def luminance(p):
    r, g, b = p[0], p[1], p[2]
    return 0.299 * r + 0.587 * g + 0.114 * b


def key_alpha(in_path, out_path, threshold=236, preview_path=None):
    im = Image.open(in_path).convert("RGBA")
    W, H = im.size
    px = im.load()

    def passable(x, y):
        return luminance(px[x, y]) >= threshold

    visited = bytearray(W * H)  # 0 = unvisited, 1 = background
    q = deque()

    def seed(x, y):
        i = y * W + x
        if not visited[i] and passable(x, y):
            visited[i] = 1
            q.append((x, y))

    for x in range(W):
        seed(x, 0)
        seed(x, H - 1)
    for y in range(H):
        seed(0, y)
        seed(W - 1, y)

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1),
                       (1, 1), (1, -1), (-1, 1), (-1, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H:
                i = ny * W + nx
                if not visited[i] and passable(nx, ny):
                    visited[i] = 1
                    q.append((nx, ny))

    cleared = 0
    for y in range(H):
        row = y * W
        for x in range(W):
            if visited[row + x]:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)
                cleared += 1

    im.save(out_path)
    pct = 100.0 * cleared / (W * H)
    print(f"{in_path} -> {out_path}: {W}x{H}, threshold={threshold}, "
          f"cleared {cleared} px ({pct:.1f}%) to alpha=0")

    if preview_path:
        bg = Image.new("RGBA", (W, H), (255, 0, 255, 255))  # magenta
        Image.alpha_composite(bg, im).convert("RGB").save(preview_path)
        print(f"  preview on magenta -> {preview_path}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    preview = None
    if "--preview" in sys.argv:
        preview = sys.argv[sys.argv.index("--preview") + 1]
        args = [a for a in args if a != preview]
    in_path, out_path = args[0], args[1]
    thr = int(args[2]) if len(args) > 2 else 236
    key_alpha(in_path, out_path, thr, preview)
