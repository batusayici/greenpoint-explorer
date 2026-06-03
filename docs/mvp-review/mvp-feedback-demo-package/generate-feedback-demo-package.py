#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[3]
PACKET = ROOT / "docs/mvp-review/mvp-feedback-demo-package"
GENERATED = PACKET / "generated"
DTR8 = ROOT / "docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness"
DTR10 = ROOT / "docs/mvp-review/phase-2dtr-10-narrow-corrective-styled-raster-pass"
DTR11 = ROOT / "docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass"

HERO_SOURCE = DTR11 / "generated/reference-facade-fidelity-raster.png"
FACADE_BOARD_SOURCE = DTR11 / "generated/dtr10-dtr11-before-after-facade-qa-board.png"
DTR8_ADAPTER = DTR8 / "generated/styled-raster-ready-geometry-adapter.json"
DTR8_BLUEPRINT = DTR8 / "generated/geometry-primitive-blueprint.svg"
DTR10_QA = DTR10 / "generated/corrected-styled-raster-qa-report.json"
DTR11_QA = DTR11 / "generated/reference-facade-fidelity-qa-report.json"
DTR11_SPECS = DTR11 / "generated/facade-extraction-specs.json"

HERO_OUT = GENERATED / "hero-reference-facade-fidelity-raster.png"
FACADE_BOARD_OUT = GENERATED / "facade-before-after-review-board.png"
PIPELINE_BOARD = GENERATED / "compact-pipeline-board.png"
MANIFEST = GENERATED / "demo-package-manifest.json"


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


FONT_TITLE = font(36, True)
FONT_HEAD = font(24, True)
FONT = font(19)
FONT_SMALL = font(16)
FONT_TINY = font(14)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def image_meta(path: Path) -> dict:
    with Image.open(path) as im:
        return {
            "path": str(path.relative_to(ROOT)),
            "width": im.width,
            "height": im.height,
            "mode": im.mode,
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        }


def file_meta(path: Path) -> dict:
    return {
        "path": str(path.relative_to(ROOT)),
        "exists": path.exists(),
        "bytes": path.stat().st_size if path.exists() else None,
        "sha256": sha256(path) if path.exists() else None,
    }


def fit_image(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as im:
        im = im.convert("RGB")
        im.thumbnail(size, Image.Resampling.LANCZOS)
        out = Image.new("RGB", size, "white")
        out.paste(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
        return out


def wrapped(draw: ImageDraw.ImageDraw, text: str, x: int, y: int, width: int, fnt=FONT, fill="black") -> int:
    words = text.split()
    line = ""
    for word in words:
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=fnt) > width and line:
            draw.text((x, y), line, font=fnt, fill=fill)
            y += 25
            line = word
        else:
            line = trial
    if line:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += 25
    return y


def draw_card(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, title: str, body: list[str]) -> None:
    draw.rectangle([x, y, x + w, y + h], outline="black", width=2, fill=(250, 250, 248))
    draw.text((x + 18, y + 18), title, font=FONT_HEAD, fill="black")
    ty = y + 58
    for line in body:
        ty = wrapped(draw, line, x + 18, ty, w - 36, FONT_SMALL)
        ty += 8


def build_pipeline_board() -> None:
    board = Image.new("RGB", (2400, 1400), "white")
    draw = ImageDraw.Draw(board)
    draw.text((56, 38), "Greenpoint Explorer MVP Feedback Demo Pipeline", font=FONT_TITLE, fill="black")
    draw.text((56, 84), "Review-only proof: source/reference data to structured geometry to styled scene to QA.", font=FONT, fill="black")

    hero = fit_image(HERO_OUT, (920, 520))
    facade = fit_image(FACADE_BOARD_OUT, (920, 520))
    board.paste(hero, (56, 140))
    board.paste(facade, (1424, 140))
    draw.rectangle([56, 140, 976, 660], outline="black", width=2)
    draw.rectangle([1424, 140, 2344, 660], outline="black", width=2)
    draw.text((56, 676), "Hero artifact: DTR-11 scene", font=FONT_SMALL, fill="black")
    draw.text((1424, 676), "QA artifact: DTR-10 to DTR-11 facade comparison", font=FONT_SMALL, fill="black")

    y = 760
    card_w = 420
    gap = 30
    cards = [
        (
            "1. Source / Reference",
            [
                "Batu-supplied facade photos and review-only source records.",
                "Used for local specificity, not production/public claims.",
            ],
        ),
        (
            "2. Structured Fixture",
            [
                "DTR-5 to DTR-8 fixtures encode target order, bounds, address policy, and subway cue policy.",
                "JSON geometry adapter remains the layout source of truth.",
            ],
        ),
        (
            "3. Blueprint / Adapter",
            [
                "DTR-7 and DTR-8 validate road bands, sidewalks, crosswalks, storefront bounds, and one primary G cue.",
                "SVG/JSON are supporting pipeline evidence.",
            ],
        ),
        (
            "4. Styled Scene",
            [
                "DTR-9 to DTR-11 produce a review-only isometric scene while preserving the geometry-first layout.",
                "DTR-11 is the current hero artifact.",
            ],
        ),
        (
            "5. QA / Feedback",
            [
                "Boards and reports show what improved, what remains approximate, and what to ask reviewers.",
                "Facade transfer is better, but not pixel-perfect.",
            ],
        ),
    ]
    for i, (title, body) in enumerate(cards):
        draw_card(draw, 56 + i * (card_w + gap), y, card_w, 310, title, body)
        if i < len(cards) - 1:
            ax = 56 + i * (card_w + gap) + card_w + 8
            ay = y + 155
            draw.line([ax, ay, ax + gap - 16, ay], fill="black", width=3)
            draw.polygon([(ax + gap - 16, ay), (ax + gap - 28, ay - 8), (ax + gap - 28, ay + 8)], fill="black")

    draw.rectangle([56, 1135, 2344, 1310], outline="black", width=2)
    draw.text((76, 1154), "Review Status", font=FONT_HEAD, fill="black")
    wrapped(draw, "Phase 2DTR is complete enough for MVP-feedback purposes. Do not reopen facade/raster correction unless external feedback shows facade fidelity is a decisive blocker.", 76, 1190, 2240, FONT)
    wrapped(draw, "Next step: interactive demo / MVP acceptance audit or external feedback sessions. No production/public exact-geometry or production asset claims.", 76, 1240, 2240, FONT)
    board.save(PIPELINE_BOARD)


def build_manifest() -> None:
    dtr10_qa = json.loads(DTR10_QA.read_text())
    dtr11_qa = json.loads(DTR11_QA.read_text())
    manifest = {
        "schemaVersion": "mvp-feedback-demo-package-manifest.v0.1",
        "artifactId": "mvp-feedback-demo-package",
        "status": "review-only-ready-for-external-feedback",
        "generatedOn": "2026-06-03",
        "phase2DtrStatus": "complete_for_mvp_feedback_purposes",
        "noDtr12": True,
        "doNotReopenFacadeRasterCorrectionUnless": "external feedback shows facade fidelity is a decisive blocker",
        "generatedArtifacts": {
            "heroRaster": image_meta(HERO_OUT),
            "facadeBeforeAfterBoard": image_meta(FACADE_BOARD_OUT),
            "compactPipelineBoard": image_meta(PIPELINE_BOARD),
        },
        "referencedEvidence": {
            "dtr8Blueprint": file_meta(DTR8_BLUEPRINT),
            "dtr8GeometryAdapter": file_meta(DTR8_ADAPTER),
            "dtr10QaReport": file_meta(DTR10_QA),
            "dtr11QaReport": file_meta(DTR11_QA),
            "dtr11FacadeSpecs": file_meta(DTR11_SPECS),
        },
        "sourceVerdicts": {
            "dtr10ReadyToPackage": dtr10_qa.get("verdict", {}).get("readyToPackageForMvpFeedback"),
            "dtr11ReferenceImagesImproveScene": dtr11_qa.get("verdict", {}).get("suppliedReferenceImagesMateriallyImproveScene"),
            "dtr11FacadeFidelitySufficientForMvpFeedback": dtr11_qa.get("verdict", {}).get("facadeFidelityNowSufficientForMvpFeedback"),
            "dtr11FullFidelityReproduction": dtr11_qa.get("requirementsAssessment", {}).get("fullFidelityFacadeReproductionProven"),
        },
        "carriedForwardDirtyState": [
            {"path": "AGENTS.md", "status": "pre-existing modified file; carried forward out of scope"},
            {"path": "research/", "status": "pre-existing untracked directory; carried forward out of scope"},
        ],
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")


def main() -> None:
    GENERATED.mkdir(parents=True, exist_ok=True)
    required = [HERO_SOURCE, FACADE_BOARD_SOURCE, DTR8_ADAPTER, DTR8_BLUEPRINT, DTR10_QA, DTR11_QA, DTR11_SPECS]
    missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
    if missing:
        raise SystemExit("Missing package source artifacts: " + ", ".join(missing))
    shutil.copy2(HERO_SOURCE, HERO_OUT)
    shutil.copy2(FACADE_BOARD_SOURCE, FACADE_BOARD_OUT)
    build_pipeline_board()
    build_manifest()
    print(json.dumps({
        "heroRaster": image_meta(HERO_OUT),
        "facadeBeforeAfterBoard": image_meta(FACADE_BOARD_OUT),
        "compactPipelineBoard": image_meta(PIPELINE_BOARD),
        "manifest": str(MANIFEST.relative_to(ROOT)),
    }, indent=2))


if __name__ == "__main__":
    main()
