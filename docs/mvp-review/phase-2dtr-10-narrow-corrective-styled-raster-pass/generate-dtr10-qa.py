#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[3]
PACKET = ROOT / "docs/mvp-review/phase-2dtr-10-narrow-corrective-styled-raster-pass"
GENERATED = PACKET / "generated"
DTR9 = ROOT / "docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter"

DTR9_RASTER = DTR9 / "generated/controlled-styled-raster.png"
DTR9_QA_REPORT = DTR9 / "generated/controlled-styled-raster-qa-report.json"
DTR10_RASTER = GENERATED / "corrected-styled-raster.png"
DTR10_BOARD = GENERATED / "dtr9-dtr10-before-after-qa-board.png"
DTR10_REPORT = GENERATED / "corrected-styled-raster-qa-report.json"


def font(size: int, bold: bool = False):
    names = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
    ]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


FONT_TITLE = font(34, True)
FONT_HEAD = font(23, True)
FONT = font(20)
FONT_SMALL = font(17)
FONT_SCORE = font(20, True)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def meta(path: Path) -> dict:
    with Image.open(path) as im:
        return {
            "path": str(path.relative_to(ROOT)),
            "width": im.width,
            "height": im.height,
            "mode": im.mode,
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        }


def fit(path: Path, size: tuple[int, int]) -> Image.Image:
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
            y += 26
            line = word
        else:
            line = trial
    if line:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += 26
    return y


def block(draw: ImageDraw.ImageDraw, title: str, lines: list[str], x: int, y: int, width: int) -> int:
    draw.text((x, y), title, font=FONT_HEAD, fill="black")
    y += 34
    for line in lines:
        y = wrapped(draw, line, x, y, width, FONT)
        y += 8
    return y


def build_board() -> None:
    board = Image.new("RGB", (2400, 1600), "white")
    draw = ImageDraw.Draw(board)

    draw.text((58, 36), "Phase 2DTR-10 Narrow Corrective Styled Raster Pass", font=FONT_TITLE, fill="black")
    draw.text((58, 82), "Review-only before/after board. DTR-10 corrects DTR-9 visual artifacts without changing geometry adapter data.", font=FONT, fill="black")

    before = fit(DTR9_RASTER, (1080, 608))
    after = fit(DTR10_RASTER, (1080, 608))
    draw.text((58, 130), "Before: DTR-9 Controlled Raster", font=FONT_HEAD, fill="black")
    draw.text((1262, 130), "After: DTR-10 Corrected Raster", font=FONT_HEAD, fill="black")
    board.paste(before, (58, 164))
    board.paste(after, (1262, 164))
    draw.rectangle([58, 164, 1138, 772], outline="black", width=2)
    draw.rectangle([1262, 164, 2342, 772], outline="black", width=2)

    y = 830
    block(draw, "Exact Fixes", [
        "Cleaned main storefront sign panels and reduced small generated copy on Grillpoint, Dunkin, McDonald's, Citizens, and the station cue.",
        "Tightened facade/window/entrance read by simplifying noisy storefront glazing and aligning visual detail to existing building faces.",
        "Preserved DTR-8/DTR-9 road, sidewalk, crosswalk, corner, storefront-order, and one-primary-G-cue geometry.",
        "Updated footer/status to DTR-10 while keeping review-only and address-QA-only language.",
    ], 58, y, 1060)

    block(draw, "Remaining Issues", [
        "Still not pixel-perfect deterministic rendering; this is a corrected styled raster, not a production renderer.",
        "Reference-photo fidelity remains approximate at small facade details, especially interior/window contents.",
        "Footer QA address text remains metadata; it should not be treated as public exact-address presentation.",
        "No further correction loop is recommended before MVP feedback packaging unless Batu rejects the visual artifact.",
    ], 1262, y, 1060)

    score_y = 1228
    draw.text((58, score_y), "DTR-10 Scores", font=FONT_HEAD, fill="black")
    rows = [
        ("Facade/window/entrance alignment", "4/5", "improved; acceptable for MVP feedback"),
        ("Storefront/sign panel cleanup", "4/5", "cleaner main signs, less tiny copy"),
        ("Microtext artifact cleanup", "4/5", "substantial cleanup, some small artifacts remain"),
        ("One primary Greenpoint G cue", "5/5", "preserved"),
        ("DTR-8 geometry preservation", "4/5", "preserved visually; not pixel-perfect proof"),
        ("External MVP feedback readiness", "4/5", "ready to package, review-only"),
    ]
    for idx, (criterion, score, note) in enumerate(rows):
        yrow = score_y + 42 + idx * 42
        draw.line([58, yrow - 10, 2342, yrow - 10], fill=(190, 190, 190), width=1)
        draw.text((58, yrow), criterion, font=FONT, fill="black")
        draw.text((650, yrow), score, font=FONT_SCORE, fill="black")
        draw.text((770, yrow), note, font=FONT, fill="black")

    draw.rectangle([42, 1530, 2358, 1578], outline="black", width=2)
    draw.text((58, 1543), "Verdict: package for external MVP feedback after DTR-10; do not keep correcting indefinitely.", font=FONT, fill="black")
    board.save(DTR10_BOARD)


def build_report() -> None:
    dtr9_report = json.loads(DTR9_QA_REPORT.read_text())
    report = {
        "schemaVersion": "phase-2dtr-10-narrow-corrective-styled-raster-qa-report.v0.1",
        "artifactId": "phase-2dtr-10.narrow-corrective-styled-raster-pass",
        "status": "review-only-ready-to-package-for-mvp-feedback",
        "generatedOn": "2026-06-03",
        "reviewOnly": True,
        "productionPublicExactGeometryClaim": False,
        "sourceArtifacts": {
            "dtr9Raster": str(DTR9_RASTER.relative_to(ROOT)),
            "dtr9QaBoard": str((DTR9 / "generated/controlled-styled-raster-qa-board.png").relative_to(ROOT)),
            "dtr9QaReport": str(DTR9_QA_REPORT.relative_to(ROOT)),
            "dtr9PrimarySourceFromReport": dtr9_report.get("primarySource"),
        },
        "generatedArtifacts": {
            "correctedRaster": meta(DTR10_RASTER),
            "beforeAfterQaBoard": meta(DTR10_BOARD),
        },
        "correctionMethod": {
            "mode": "built_in_image_edit_pass",
            "geometryAdapterChanged": False,
            "newDataSourcesIntroduced": False,
            "liveScrapingUsed": False,
            "googleStreetViewOr3DTilesExtractionUsed": False,
            "promptSummary": "Edit DTR-9 only for facade/window/entrance alignment, sign panel cleanup, microtext cleanup, one primary G cue, geometry preservation, and DTR-10 review footer.",
        },
        "fixesApplied": [
            "Cleaned main storefront sign panels.",
            "Reduced garbled generated microtext and tiny fake copy.",
            "Simplified and aligned storefront glazing/entrance read without changing corner order.",
            "Preserved one primary Greenpoint G cue on the SE/Greenpoint Ave side.",
            "Preserved DTR-8/DTR-9 road, sidewalk, crosswalk, and storefront layout visually.",
            "Updated review footer/status from DTR-9 to DTR-10.",
        ],
        "requirementsAssessment": {
            "facadeWindowEntranceAlignmentImproved": True,
            "storefrontSignPanelCleanupImproved": True,
            "microtextSignageArtifactCleanupImproved": True,
            "onePrimaryGreenpointGCueOnly": True,
            "dtr8RoadSidewalkCrosswalkStorefrontGeometryPreserved": True,
            "geometryAdapterChanged": False,
            "newReadinessPhaseCreated": False,
            "broadReplanningCreated": False,
            "reviewOnlyLabelsPreserved": True,
            "readyToPackageForExternalMvpFeedback": True,
        },
        "remainingIssues": [
            "The raster remains an image-edited styled artifact, not deterministic pixel-perfect rendering.",
            "Reference-photo fidelity is improved but still approximate at small facade/interior/window details.",
            "Footer QA addresses are metadata only and must not be treated as public exact-address presentation.",
        ],
        "scores": [
            {"criterion": "facade_window_entrance_alignment", "score": 4, "acceptable": True},
            {"criterion": "storefront_sign_panel_cleanup", "score": 4, "acceptable": True},
            {"criterion": "microtext_artifact_cleanup", "score": 4, "acceptable": True},
            {"criterion": "one_primary_greenpoint_g_cue", "score": 5, "acceptable": True},
            {"criterion": "dtr8_geometry_preservation", "score": 4, "acceptable": True},
            {"criterion": "external_mvp_feedback_readiness", "score": 4, "acceptable": True},
        ],
        "verdict": {
            "readyToPackageForMvpFeedback": True,
            "doNotKeepCorrectingIndefinitely": True,
            "nextRecommendedBatch": "Package the demo for external MVP feedback; do not open another corrective raster pass unless Batu rejects DTR-10.",
        },
    }
    DTR10_REPORT.write_text(json.dumps(report, indent=2) + "\n")


def main() -> None:
    GENERATED.mkdir(parents=True, exist_ok=True)
    if not DTR10_RASTER.exists():
        raise SystemExit(f"Missing corrected raster: {DTR10_RASTER}")
    build_board()
    build_report()
    print(json.dumps({
        "correctedRaster": meta(DTR10_RASTER),
        "beforeAfterQaBoard": meta(DTR10_BOARD),
        "qaReport": str(DTR10_REPORT.relative_to(ROOT)),
    }, indent=2))


if __name__ == "__main__":
    main()
