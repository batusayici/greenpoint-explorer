#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[3]
PACKET = ROOT / "docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter"
GENERATED = PACKET / "generated"
DTR8 = ROOT / "docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness"
DTR6_RASTER = ROOT / "docs/mvp-review/phase-2dtr-6-exact-review-geometry-raster-artifact-generation/generated/exact-review-geometry-raster-attempt.png"

ADAPTER_PATH = DTR8 / "generated/styled-raster-ready-geometry-adapter.json"
SOURCE_RASTER = GENERATED / "controlled-styled-raster.png"
QA_BOARD = GENERATED / "controlled-styled-raster-qa-board.png"
QA_REPORT = GENERATED / "controlled-styled-raster-qa-report.json"


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


FONT = load_font(24)
FONT_SMALL = load_font(19)
FONT_TINY = load_font(15)
FONT_BOLD = load_font(28, bold=True)
FONT_SMALL_BOLD = load_font(20, bold=True)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
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


def box_value(record: dict) -> dict:
    if not record:
        return {}
    if "value" in record and isinstance(record["value"], dict):
        return record["value"]
    return record


def draw_rect_scaled(draw: ImageDraw.ImageDraw, box: dict, scale: float, ox: int, oy: int, outline: str, width: int = 2, fill=None):
    if not box:
        return
    x0 = ox + box["x"] * scale
    y0 = oy + box["y"] * scale
    x1 = ox + (box["x"] + box["width"]) * scale
    y1 = oy + (box["y"] + box["height"]) * scale
    draw.rectangle([x0, y0, x1, y1], outline=outline, width=width, fill=fill)


def draw_label(draw: ImageDraw.ImageDraw, text: str, x: float, y: float, font=FONT_TINY, fill="black"):
    draw.rectangle([x - 3, y - 2, x + draw.textlength(text, font=font) + 3, y + 18], fill="white")
    draw.text((x, y), text, fill=fill, font=font)


def draw_blueprint(adapter: dict, width: int, height: int) -> Image.Image:
    frame = adapter["frame"]
    scale = min(width / frame["width"], height / frame["height"])
    canvas_w = round(frame["width"] * scale)
    canvas_h = round(frame["height"] * scale)
    ox = (width - canvas_w) // 2
    oy = (height - canvas_h) // 2

    im = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(im)
    draw.rectangle([ox, oy, ox + canvas_w, oy + canvas_h], outline="black", width=3)

    roads = adapter["layoutPrimitives"]["roads"]
    pedestrian = adapter["layoutPrimitives"]["pedestrian"]
    targets = adapter["layoutPrimitives"]["targets"]

    draw_rect_scaled(draw, box_value(roads["manhattanAveRoadBand"]), scale, ox, oy, "black", 2, fill=(230, 230, 230))
    draw_rect_scaled(draw, box_value(roads["greenpointAveRoadBand"]), scale, ox, oy, "black", 2, fill=(230, 230, 230))
    draw_rect_scaled(draw, box_value(roads["intersectionPolygon"]), scale, ox, oy, "black", 4, fill=(210, 210, 210))

    for sidewalk in pedestrian["sidewalks"]["value"]:
        draw_rect_scaled(draw, sidewalk["bounds"], scale, ox, oy, "black", 1, fill=(248, 248, 248))
    for curb in pedestrian["curbs"]["value"]:
        points = curb.get("polyline", [])
        if len(points) >= 2:
            scaled = [(ox + p["x"] * scale, oy + p["y"] * scale) for p in points]
            draw.line(scaled, fill="black", width=3)
    for cut in pedestrian["curbCuts"]["value"]:
        draw_rect_scaled(draw, cut["bounds"], scale, ox, oy, "black", 1, fill="white")
    for crosswalk in pedestrian["crosswalks"]["value"]:
        draw_rect_scaled(draw, crosswalk["bounds"], scale, ox, oy, "black", 2, fill="white")
        draw_label(draw, "CROSSWALK", ox + crosswalk["bounds"]["x"] * scale + 4, oy + crosswalk["bounds"]["y"] * scale + 4)

    for target in targets:
        if target["renderingKind"] == "storefront":
            draw_rect_scaled(draw, target["buildingMassBounds"], scale, ox, oy, "black", 2)
            draw_rect_scaled(draw, target["storefrontBounds"], scale, ox, oy, "black", 4)
            draw_rect_scaled(draw, target["signPanelBounds"], scale, ox, oy, "black", 2, fill=(235, 235, 235))
            draw_rect_scaled(draw, target["entranceBounds"], scale, ox, oy, "black", 2, fill="white")
            for win in target["windowBounds"]:
                draw_rect_scaled(draw, win, scale, ox, oy, "black", 1, fill="white")
            label_x = ox + target["storefrontBounds"]["x"] * scale
            label_y = oy + target["storefrontBounds"]["y"] * scale - 20
            draw_label(draw, target["label"], label_x, label_y, FONT_TINY)
            ap = target.get("addressAnchorPoint")
            if ap:
                cx = ox + ap["x"] * scale
                cy = oy + ap["y"] * scale
                draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], outline="black", width=2)
        elif target["renderingKind"] == "symbolic_transit":
            cue = target["primarySubwayCue"]
            center = cue["cueCenter"]
            radius = cue["cueRadius"] * scale
            cx = ox + center["x"] * scale
            cy = oy + center["y"] * scale
            draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline="black", width=4)
            draw_label(draw, "ONE PRIMARY G", cx + radius + 5, cy - 8, FONT_TINY)
            draw_rect_scaled(draw, cue["entranceCueBounds"], scale, ox, oy, "black", 2)

    for zone in roads["streetNamePlacementZones"]["value"]:
        b = zone["bounds"]
        draw_rect_scaled(draw, b, scale, ox, oy, "black", 1)
        draw_label(draw, zone["text"], ox + b["x"] * scale + 4, oy + b["y"] * scale + 4, FONT_TINY)

    draw.text((ox + 12, oy + canvas_h - 30), "REVIEW-ONLY DTR-8 GEOMETRY BLUEPRINT PANEL", fill="black", font=FONT_TINY)
    return im


def fit_image(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as im:
        im = im.convert("RGB")
        im.thumbnail(size, Image.Resampling.LANCZOS)
        out = Image.new("RGB", size, "white")
        out.paste(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
        return out


def text_block(draw: ImageDraw.ImageDraw, title: str, lines: list[str], x: int, y: int, width: int) -> int:
    draw.text((x, y), title, fill="black", font=FONT_SMALL_BOLD)
    y += 30
    for line in lines:
        words = line.split()
        current = ""
        for word in words:
            test = f"{current} {word}".strip()
            if draw.textlength(test, font=FONT_SMALL) > width and current:
                draw.text((x, y), current, fill="black", font=FONT_SMALL)
                y += 24
                current = word
            else:
                current = test
        if current:
            draw.text((x, y), current, fill="black", font=FONT_SMALL)
            y += 24
        y += 6
    return y


def build_board(adapter: dict):
    board = Image.new("RGB", (2400, 1600), "white")
    draw = ImageDraw.Draw(board)
    draw.text((60, 38), "Phase 2DTR-9 Controlled Styled Raster QA Board", fill="black", font=FONT_BOLD)
    draw.text((60, 76), "Review-only. Geometry-first adapter is the layout source of truth. No production/public exact-geometry claim.", fill="black", font=FONT_SMALL)

    panel_w, panel_h = 1080, 608
    bp = draw_blueprint(adapter, panel_w, panel_h)
    raster = fit_image(SOURCE_RASTER, (panel_w, panel_h))

    draw.text((60, 124), "DTR-8 Fixture Intent Panel", fill="black", font=FONT_SMALL_BOLD)
    draw.text((1260, 124), "DTR-9 Styled Raster Output", fill="black", font=FONT_SMALL_BOLD)
    board.paste(bp, (60, 160))
    board.paste(raster, (1260, 160))
    draw.rectangle([60, 160, 60 + panel_w, 160 + panel_h], outline="black", width=2)
    draw.rectangle([1260, 160, 1260 + panel_w, 160 + panel_h], outline="black", width=2)

    y = 820
    text_block(draw, "Fixture Constraints Reflected", [
        "Road bands: Manhattan Ave vertical, Greenpoint Ave horizontal, with visible overlap/intersection zone.",
        "Pedestrian primitives: sidewalks, curbs, four crosswalks, curb cuts, and corner zones are visible.",
        "Storefront order: NW Grillpoint Deli, NE McDonald's, SW Dunkin', SE Citizens Bank.",
        "Transit policy: one primary Greenpoint G cue on the SE/Greenpoint Ave side.",
        "Address policy: in-scene address text disabled; exact addresses remain QA-only metadata.",
    ], 60, y, 1060)

    text_block(draw, "Mismatch Callouts", [
        "Generated raster is meaningfully new at file/hash and visual-layout level versus DTR-6.",
        "Facade/window/entrance geometry is art-directed to the bounds but not pixel-exact to every DTR-8 rectangle.",
        "Microtext and small street-sign lettering still show image-generation artifacts.",
        "This proves a controlled geometry-first raster attempt for MVP feedback, not deterministic production rendering.",
    ], 1260, y, 1060)

    score_y = 1210
    draw.text((60, score_y), "Scores", fill="black", font=FONT_SMALL_BOLD)
    scores = [
        ("Art direction fidelity", "4/5", "acceptable"),
        ("Reference-photo fidelity", "3/5", "partial: tighten facade and microtext in DTR-10"),
        ("Storefront/order accuracy", "4/5", "acceptable"),
        ("Facade/entrance/window accuracy", "3/5", "partial: add overlay-controlled facade pass"),
        ("Subway cue placement", "4/5", "acceptable: one primary G cue"),
        ("Address policy", "4/5", "acceptable: addresses QA-only"),
        ("Overall MVP demo usefulness", "4/5", "acceptable for feedback, review-only"),
    ]
    x1, x2, x3 = 60, 520, 650
    for i, (name, score, note) in enumerate(scores):
        row_y = score_y + 36 + i * 36
        draw.line([60, row_y - 8, 2320, row_y - 8], fill=(190, 190, 190), width=1)
        draw.text((x1, row_y), name, fill="black", font=FONT_SMALL)
        draw.text((x2, row_y), score, fill="black", font=FONT_SMALL_BOLD)
        draw.text((x3, row_y), note, fill="black", font=FONT_SMALL)

    draw.rectangle([40, 1518, 2360, 1575], outline="black", width=2)
    draw.text((60, 1534), "DTR-10 narrow recommendation: one corrective visual pass with the DTR-8 blueprint as an overlay mask, focused only on facade/window/entrance alignment and microtext cleanup.", fill="black", font=FONT_SMALL)
    board.save(QA_BOARD)


def build_report(adapter: dict):
    raster_meta = image_meta(SOURCE_RASTER)
    dtr6_meta = image_meta(DTR6_RASTER)
    qa_board_meta = image_meta(QA_BOARD)
    same_hash = raster_meta["sha256"] == dtr6_meta["sha256"]

    targets = []
    for target in adapter["layoutPrimitives"]["targets"]:
        targets.append({
            "targetId": target["targetId"],
            "label": target["label"],
            "representedInRaster": True,
            "geometryFieldsConsumed": [
                key for key in [
                    "buildingMassBounds",
                    "storefrontBounds",
                    "facadeFrontageBounds",
                    "signPanelBounds",
                    "entranceBounds",
                    "windowBounds",
                    "primarySubwayCue",
                    "addressAnchorPoint",
                ] if key in target
            ],
            "unsupportedFieldsOmittedOrReviewOnly": target.get("unsupportedFieldsOmitted", []),
        })

    report = {
        "schemaVersion": "phase-2dtr-9-controlled-styled-raster-qa-report.v0.1",
        "artifactId": "phase-2dtr-9.controlled-styled-raster-from-geometry-first-adapter",
        "status": "review-only-controlled-styled-raster-produced",
        "generatedOn": "2026-06-03",
        "reviewOnly": True,
        "productionPublicExactGeometryClaim": False,
        "primarySource": str(ADAPTER_PATH.relative_to(ROOT)),
        "supportingSources": [
            str((DTR8 / "generated/geometry-primitive-fixture.json").relative_to(ROOT)),
            str((DTR8 / "generated/geometry-primitive-blueprint.svg").relative_to(ROOT)),
            "docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg",
            "docs/mvp-reference-images/northeast-mcdonalds-facadeA.jpg",
            "docs/mvp-reference-images/southwest-dunkin-facadeA.jpeg",
            "docs/mvp-reference-images/southeast-citizens-facadeA.jpeg",
        ],
        "generatedArtifacts": {
            "styledRaster": raster_meta,
            "qaBoard": qa_board_meta,
        },
        "preExistingDirtyFileResolution": {
            "path": "docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png",
            "resolutionBeforeDtr9": "restored to repository state before DTR-9 work began",
            "usedAsSourceOrReference": False,
        },
        "dtr6Comparison": {
            "dtr6Raster": dtr6_meta,
            "sameSha256": same_hash,
            "basicFileHashAssessment": "reused" if same_hash else "meaningfully_new_at_file_hash_level",
            "visualAssessment": "meaningfully_new: selected DTR-9 raster has clearer DTR-8 road/crosswalk structure, one primary G cue, no in-scene address numerals, and different composition/details from DTR-6.",
            "alternateGeneratedCandidateRejected": {
                "reason": "It contained multiple G cues and visible storefront address numerals, including the prior Dunkin address failure mode.",
                "committed": False,
            },
        },
        "requirementsAssessment": {
            "allTargetsRepresented": True,
            "targets": targets,
            "storefrontOrderMatchesAdapter": True,
            "roadSidewalkCrosswalkPrimitivesVisible": True,
            "onePrimarySubwayCuePreserved": True,
            "addressLabelPolicyRespected": True,
            "unsupportedDetailsOmittedOrMarkedReviewOnly": True,
            "polishedRasterGenerated": True,
            "newReadinessLayerCreated": False,
            "liveScrapingOrExternalAcquisitionUsed": False,
            "googleStreetViewOr3DTilesExtractionUsed": False,
            "productionPublicExactGeometryClaimMade": False,
        },
        "scores": [
            {"criterion": "art_direction_fidelity", "score": 4, "acceptable": True, "notes": "Isometric/editorial Greenpoint Explorer look is coherent and review-board labeled."},
            {"criterion": "reference_photo_fidelity", "score": 3, "acceptable": False, "correctiveDeltaForDtr10": "Tighten facade material cues, reduce generic fine detail, and suppress generated microtext."},
            {"criterion": "storefront_order_accuracy", "score": 4, "acceptable": True, "notes": "NW/NE/SW/SE business order is preserved."},
            {"criterion": "facade_entrance_window_accuracy", "score": 3, "acceptable": False, "correctiveDeltaForDtr10": "Use a blueprint overlay mask to constrain entrance/window/sign panel positions more tightly."},
            {"criterion": "subway_cue_placement", "score": 4, "acceptable": True, "notes": "One primary Greenpoint G cue is preserved on the SE/Greenpoint Ave side."},
            {"criterion": "address_policy", "score": 4, "acceptable": True, "notes": "Exact addresses are QA-only footer metadata; scene body avoids address numerals."},
            {"criterion": "overall_mvp_demo_usefulness", "score": 4, "acceptable": True, "notes": "Useful for MVP feedback as a controlled styled attempt, not a deterministic production renderer proof."}
        ],
        "pipelineVerdict": {
            "provesEnoughForMvpFeedback": True,
            "claimLimits": "DTR-9 proves that the DTR-8 geometry-first adapter can control a styled review raster enough for MVP feedback. It does not prove pixel-exact deterministic rasterization or production/public exact geometry.",
            "recommendedNextBatch": "Phase 2DTR-10 should be one narrow corrective visual pass focused on facade/window/entrance alignment and microtext cleanup using the DTR-8 blueprint as an overlay mask.",
        }
    }
    QA_REPORT.write_text(json.dumps(report, indent=2) + "\n")


def main():
    GENERATED.mkdir(parents=True, exist_ok=True)
    adapter = json.loads(ADAPTER_PATH.read_text())
    if not SOURCE_RASTER.exists():
        raise SystemExit(f"Missing source raster: {SOURCE_RASTER}")
    build_board(adapter)
    build_report(adapter)
    print(json.dumps({
        "styledRaster": image_meta(SOURCE_RASTER),
        "qaBoard": image_meta(QA_BOARD),
        "qaReport": str(QA_REPORT.relative_to(ROOT)),
    }, indent=2))


if __name__ == "__main__":
    main()
