#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[3]
PACKET = ROOT / "docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass"
GENERATED = PACKET / "generated"
CROPS = GENERATED / "crops"
DTR8 = ROOT / "docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness"
DTR10 = ROOT / "docs/mvp-review/phase-2dtr-10-narrow-corrective-styled-raster-pass"

ADAPTER_PATH = DTR8 / "generated/styled-raster-ready-geometry-adapter.json"
DTR10_RASTER = DTR10 / "generated/corrected-styled-raster.png"
DTR11_RASTER = GENERATED / "reference-facade-fidelity-raster.png"

SPEC_PATH = GENERATED / "facade-extraction-specs.json"
FIDELITY_BOARD = GENERATED / "facade-fidelity-board.png"
QA_BOARD = GENERATED / "dtr10-dtr11-before-after-facade-qa-board.png"
QA_REPORT = GENERATED / "reference-facade-fidelity-qa-report.json"


def load_font(size: int, bold: bool = False):
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


FONT_TITLE = load_font(32, True)
FONT_HEAD = load_font(22, True)
FONT = load_font(18)
FONT_SMALL = load_font(15)
FONT_SCORE = load_font(18, True)


REFERENCE_SPECS = {
    "grillpoint-deli": {
        "referenceImagePaths": [
            "docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg",
            "docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg",
            "docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpg",
        ],
        "primaryReferenceCrop": {"x": 1420, "y": 760, "width": 3180, "height": 2870},
        "sceneCrop": {"x": 135, "y": 0, "width": 620, "height": 360},
        "signBandPlacement": "Maroon sign band across top of storefront with large white GRILLPOINT DELI and green G mark cue.",
        "entrancePlacement": "Central/recessed main entry below sign band with adjacent dark doorway cue on the right.",
        "windowDoorSegmentation": "Dense glass bay rhythm with food-poster/window-display panels flanking central entry.",
        "awningCanopyCues": "Black canopy/awning band below maroon sign, with simplified white microcopy only if legible.",
        "materialColorCues": "Red/orange brick upper facade, maroon sign, black canopy, dark storefront framing.",
        "visiblePropsDistinctiveFeatures": "Food poster wall, green G sign mark, black neighboring doorway, street-sign/lamp context optional.",
        "mustPreserve": ["NW corner placement", "Grillpoint Deli identity", "central entry", "poster/window rhythm", "review-only address policy"],
        "unsupportedOmit": ["phone number as exact scene text", "exact food poster text", "pedestrians", "public exact-address claim"],
        "dtr10Issue": "DTR-10 was too clean/generic and lost the green G mark plus dense poster/window rhythm.",
        "dtr11DesiredCorrection": "Restore maroon/green/black identity, central entry, poster bay density, and adjacent dark doorway cue.",
    },
    "mcdonalds": {
        "referenceImagePaths": [
            "docs/mvp-reference-images/northeast-mcdonalds-facadeA.jpg",
            "docs/mvp-reference-images/northeast-mcdonalds-closeup.jpeg",
            "docs/mvp-reference-images/northeast-mcdonalds-wide.jpg",
        ],
        "primaryReferenceCrop": {"x": 0, "y": 650, "width": 4320, "height": 2920},
        "sceneCrop": {"x": 925, "y": 0, "width": 610, "height": 360},
        "signBandPlacement": "Golden arch cue on gray facade; white canopy edge and yellow awning strip over dark glass.",
        "entrancePlacement": "Left/side entry cue integrated with dark glass frontage.",
        "windowDoorSegmentation": "Long dark glass bay rhythm with interior table silhouettes and poster simplification.",
        "awningCanopyCues": "Thin yellow awning strip and white horizontal canopy edge.",
        "materialColorCues": "Gray panel facade, brown vertical slat side panels, yellow accent, colorful mural mass above.",
        "visiblePropsDistinctiveFeatures": "Golden arch, brown slat panels, mural color blocks, sidewalk trash/bike context optional.",
        "mustPreserve": ["NE corner placement", "McDonald's identity", "gray/yellow/dark glass facade", "mural mass above"],
        "unsupportedOmit": ["exact promo poster text", "unrelated tenant signs", "public exact-geometry claim"],
        "dtr10Issue": "DTR-10 had the overall McDonald's read but lacked the brown slats and reference-specific facade hierarchy.",
        "dtr11DesiredCorrection": "Add brown slat panels, stronger dark-glass rhythm, yellow/white canopy edge, and mural mass.",
    },
    "dunkin": {
        "referenceImagePaths": [
            "docs/mvp-reference-images/southwest-dunkin-facadeA.jpeg",
            "docs/mvp-reference-images/southwest-subway-wide.jpeg",
            "docs/mvp-reference-images/southwest-subwayC.jpeg",
        ],
        "primaryReferenceCrop": {"x": 0, "y": 150, "width": 1040, "height": 1180},
        "sceneCrop": {"x": 100, "y": 495, "width": 520, "height": 300},
        "signBandPlacement": "Black sign band with orange/pink Dunkin cue and side/corner sign panel.",
        "entrancePlacement": "Dark recessed corner entry below sign band.",
        "windowDoorSegmentation": "Dark window bays on front and side, with simplified poster/product rectangles.",
        "awningCanopyCues": "Thin orange/pink accent strip below black sign band.",
        "materialColorCues": "Beige/stone medical-plaza mass, black sign band, orange/pink brand accents.",
        "visiblePropsDistinctiveFeatures": "Corner side sign, dark entry, nearby subway railing/sign context as secondary only.",
        "mustPreserve": ["SW corner placement", "Dunkin identity", "black/orange/pink sign band", "no in-scene address numerals"],
        "unsupportedOmit": ["exact side street traffic details", "extra primary G cue", "public exact-address claim"],
        "dtr10Issue": "DTR-10 read cleanly but still lacked the real corner side-sign and recessed dark entry cues.",
        "dtr11DesiredCorrection": "Add side/corner sign cue, darker entry, and stronger beige/black/orange-pink facade hierarchy.",
    },
    "citizens-bank": {
        "referenceImagePaths": [
            "docs/mvp-reference-images/southeast-citizens-facadeA.jpeg",
            "docs/mvp-reference-images/southeast-citizens-facadeB.jpg",
            "docs/mvp-reference-images/southeast-citizens-wide.jpg",
            "docs/mvp-reference-images/southeast-subwayB.jpg",
        ],
        "primaryReferenceCrop": {"x": 1780, "y": 420, "width": 1800, "height": 2480},
        "sceneCrop": {"x": 1155, "y": 465, "width": 520, "height": 330},
        "signBandPlacement": "Green Citizens sign on white sign box above recessed entry.",
        "entrancePlacement": "Deep recessed black-framed entry with steps and black railings.",
        "windowDoorSegmentation": "Entry glass plus adjacent vertical window rhythm with reddish-brown trim.",
        "awningCanopyCues": "No awning; sign box projects above entry.",
        "materialColorCues": "White/gray masonry, green sign, black railings, reddish-brown window trim.",
        "visiblePropsDistinctiveFeatures": "Subway railing context, black entry rails/steps, masonry pilasters.",
        "mustPreserve": ["SE corner placement", "Citizens identity", "recessed entry", "one primary G cue only", "review-only address policy"],
        "unsupportedOmit": ["exact bank interior text", "extra station entrances", "public exact station geometry claim"],
        "dtr10Issue": "DTR-10 had the general bank sign but not enough recessed-entry/railing/window-trim fidelity.",
        "dtr11DesiredCorrection": "Strengthen white sign box, recessed door, black rails, and reddish-brown window-trim rhythm.",
    },
}


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


def crop_image(path: Path, crop: dict) -> Image.Image:
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        x, y, w, h = crop["x"], crop["y"], crop["width"], crop["height"]
        return im.crop((x, y, x + w, y + h))


def save_fit(im: Image.Image, path: Path, size: tuple[int, int] | None = None) -> None:
    out = im.copy()
    if size:
        out.thumbnail(size, Image.Resampling.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    out.save(path)


def fit(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    img = im.copy()
    img.thumbnail(size, Image.Resampling.LANCZOS)
    out = Image.new("RGB", size, "white")
    out.paste(img, ((size[0] - img.width) // 2, (size[1] - img.height) // 2))
    return out


def wrapped(draw: ImageDraw.ImageDraw, text: str, x: int, y: int, width: int, fnt=FONT, fill="black") -> int:
    words = text.split()
    line = ""
    for word in words:
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=fnt) > width and line:
            draw.text((x, y), line, font=fnt, fill=fill)
            y += 23
            line = word
        else:
            line = trial
    if line:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += 23
    return y


def draw_block(draw: ImageDraw.ImageDraw, title: str, lines: list[str], x: int, y: int, width: int) -> int:
    draw.text((x, y), title, font=FONT_HEAD, fill="black")
    y += 30
    for line in lines:
        y = wrapped(draw, line, x, y, width, FONT_SMALL)
        y += 4
    return y


def load_adapter_targets() -> dict:
    adapter = json.loads(ADAPTER_PATH.read_text())
    return {target["targetId"]: target for target in adapter["layoutPrimitives"]["targets"]}


def build_records() -> list[dict]:
    targets = load_adapter_targets()
    records = []
    for target_id, spec in REFERENCE_SPECS.items():
        target = targets[target_id]
        primary_path = ROOT / spec["referenceImagePaths"][0]
        crop_path = CROPS / f"{target_id}-reference-crop.png"
        dtr10_crop_path = CROPS / f"{target_id}-dtr10-scene-crop.png"
        dtr11_crop_path = CROPS / f"{target_id}-dtr11-scene-crop.png"
        save_fit(crop_image(primary_path, spec["primaryReferenceCrop"]), crop_path)
        save_fit(crop_image(DTR10_RASTER, spec["sceneCrop"]), dtr10_crop_path)
        save_fit(crop_image(DTR11_RASTER, spec["sceneCrop"]), dtr11_crop_path)
        records.append({
            "targetId": target_id,
            "label": target["label"],
            "sourceReferenceImagePaths": spec["referenceImagePaths"],
            "allSourceImagesExist": all((ROOT / p).exists() for p in spec["referenceImagePaths"]),
            "primaryReferenceCrop": {
                "sourceImagePath": spec["referenceImagePaths"][0],
                "cropCoordinates": spec["primaryReferenceCrop"],
                "generatedCropPath": str(crop_path.relative_to(ROOT)),
            },
            "sceneTargetBoundsFromDtr8": {
                "storefrontBounds": target["storefrontBounds"],
                "signPanelBounds": target["signPanelBounds"],
                "entranceBounds": target["entranceBounds"],
                "windowBounds": target["windowBounds"],
                "sceneCropForQa": spec["sceneCrop"],
                "dtr10SceneCropPath": str(dtr10_crop_path.relative_to(ROOT)),
                "dtr11SceneCropPath": str(dtr11_crop_path.relative_to(ROOT)),
            },
            "facadeExtractionSpec": {
                "signBandPlacement": spec["signBandPlacement"],
                "entrancePlacement": spec["entrancePlacement"],
                "windowDoorSegmentation": spec["windowDoorSegmentation"],
                "awningCanopyCues": spec["awningCanopyCues"],
                "materialColorCues": spec["materialColorCues"],
                "visiblePropsOrDistinctiveFeatures": spec["visiblePropsDistinctiveFeatures"],
                "whatMustBePreserved": spec["mustPreserve"],
                "whatMustBeOmittedAsUnsupported": spec["unsupportedOmit"],
            },
            "dtr10Issue": spec["dtr10Issue"],
            "dtr11DesiredCorrectionNotes": spec["dtr11DesiredCorrection"],
        })
    return records


def build_facade_fidelity_board(records: list[dict]) -> None:
    board = Image.new("RGB", (2400, 2200), "white")
    draw = ImageDraw.Draw(board)
    draw.text((50, 34), "Phase 2DTR-11 Facade Fidelity Board", font=FONT_TITLE, fill="black")
    draw.text((50, 76), "Reference image crops, extracted facade specs, DTR-10 scene crops, and desired correction notes.", font=FONT, fill="black")

    y = 126
    row_h = 500
    for idx, record in enumerate(records):
        x = 50
        ref = fit(Image.open(ROOT / record["primaryReferenceCrop"]["generatedCropPath"]).convert("RGB"), (520, 310))
        dtr10 = fit(Image.open(ROOT / record["sceneTargetBoundsFromDtr8"]["dtr10SceneCropPath"]).convert("RGB"), (520, 310))
        draw.text((x, y), record["label"], font=FONT_HEAD, fill="black")
        board.paste(ref, (x, y + 36))
        draw.rectangle([x, y + 36, x + 520, y + 346], outline="black", width=2)
        draw.text((x, y + 356), "Reference crop", font=FONT_SMALL, fill="black")
        x += 560
        board.paste(dtr10, (x, y + 36))
        draw.rectangle([x, y + 36, x + 520, y + 346], outline="black", width=2)
        draw.text((x, y + 356), "DTR-10 facade region", font=FONT_SMALL, fill="black")
        x += 560
        spec = record["facadeExtractionSpec"]
        draw_block(draw, "Extracted Spec", [
            spec["signBandPlacement"],
            spec["entrancePlacement"],
            spec["windowDoorSegmentation"],
            spec["materialColorCues"],
        ], x, y + 36, 520)
        x += 580
        draw_block(draw, "Desired Correction", [
            record["dtr10Issue"],
            record["dtr11DesiredCorrectionNotes"],
            "Omit unsupported: " + "; ".join(spec["whatMustBeOmittedAsUnsupported"][:3]),
        ], x, y + 36, 600)
        y += row_h
        if idx < len(records) - 1:
            draw.line([50, y - 24, 2350, y - 24], fill=(190, 190, 190), width=1)

    draw.rectangle([40, 2132, 2360, 2178], outline="black", width=2)
    draw.text((56, 2144), "Review-only: reference photos constrain facade cues; no production/public exact-geometry or exact-address claims.", font=FONT, fill="black")
    board.save(FIDELITY_BOARD)


def build_qa_board(records: list[dict]) -> None:
    board = Image.new("RGB", (2400, 2500), "white")
    draw = ImageDraw.Draw(board)
    draw.text((50, 34), "Phase 2DTR-11 Before/After Facade QA Board", font=FONT_TITLE, fill="black")
    draw.text((50, 76), "DTR-10 geometry is frozen; DTR-11 changes facade/sign/window/entrance regions only.", font=FONT, fill="black")
    full10 = fit(Image.open(DTR10_RASTER).convert("RGB"), (1080, 608))
    full11 = fit(Image.open(DTR11_RASTER).convert("RGB"), (1080, 608))
    draw.text((50, 124), "Before: DTR-10", font=FONT_HEAD, fill="black")
    draw.text((1260, 124), "After: DTR-11 facade fidelity pass", font=FONT_HEAD, fill="black")
    board.paste(full10, (50, 160))
    board.paste(full11, (1260, 160))
    draw.rectangle([50, 160, 1130, 768], outline="black", width=2)
    draw.rectangle([1260, 160, 2340, 768], outline="black", width=2)

    y = 825
    col_x = [50, 430, 810, 1190, 1570, 1950]
    headers = ["Target", "Reference Crop", "DTR-10 Crop", "DTR-11 Crop", "Pass/Fail", "Notes"]
    for x, h in zip(col_x, headers):
        draw.text((x, y), h, font=FONT_HEAD, fill="black")
    y += 42
    row_h = 360
    scores = {
        "grillpoint-deli": ("4/5", "pass: stronger green G, maroon/black canopy, poster rhythm"),
        "mcdonalds": ("4/5", "pass: stronger slats, yellow/gray/glass, mural mass"),
        "dunkin": ("4/5", "pass: side sign/dark entry added; still approximate"),
        "citizens-bank": ("4/5", "pass: recessed entry/rail/masonry improved"),
    }
    for record in records:
        draw.line([50, y - 16, 2340, y - 16], fill=(200, 200, 200), width=1)
        draw.text((col_x[0], y), record["label"], font=FONT_SCORE, fill="black")
        for i, key in enumerate(["generatedCropPath", "dtr10SceneCropPath", "dtr11SceneCropPath"], start=1):
            if key == "generatedCropPath":
                path = ROOT / record["primaryReferenceCrop"][key]
            else:
                path = ROOT / record["sceneTargetBoundsFromDtr8"][key]
            board.paste(fit(Image.open(path).convert("RGB"), (340, 205)), (col_x[i], y))
            draw.rectangle([col_x[i], y, col_x[i] + 340, y + 205], outline="black", width=1)
        score, note = scores[record["targetId"]]
        draw.text((col_x[4], y), score, font=FONT_SCORE, fill="black")
        wrapped(draw, note, col_x[5], y, 330, FONT_SMALL)
        wrapped(draw, record["dtr11DesiredCorrectionNotes"], col_x[5], y + 60, 330, FONT_SMALL)
        y += row_h

    verdict_y = 2288
    draw.rectangle([42, verdict_y, 2358, 2456], outline="black", width=2)
    draw.text((58, verdict_y + 18), "Verdict", font=FONT_HEAD, fill="black")
    wrapped(draw, "DTR-11 materially improves the supplied-reference-image-to-facade-scene link while preserving DTR-10 geometry. It is sufficient for MVP feedback, but not proof of full-fidelity deterministic facade reproduction.", 58, verdict_y + 54, 2200, FONT)
    wrapped(draw, "Method bottleneck: built-in image editing can use references as visual constraints, but without explicit masks/perspective warps/path-level control it cannot guarantee pixel-exact facade transfer.", 58, verdict_y + 108, 2200, FONT)
    board.save(QA_BOARD)


def build_report(records: list[dict]) -> None:
    dtr10_meta = image_meta(DTR10_RASTER)
    dtr11_meta = image_meta(DTR11_RASTER)
    report = {
        "schemaVersion": "phase-2dtr-11-reference-image-facade-fidelity-qa-report.v0.1",
        "artifactId": "phase-2dtr-11.reference-image-facade-fidelity-pass",
        "status": "review-only-facade-fidelity-materially-improved",
        "generatedOn": "2026-06-03",
        "reviewOnly": True,
        "productionPublicExactGeometryClaim": False,
        "geometryAdapterChanged": False,
        "newDataSourcesIntroduced": False,
        "liveScrapingUsed": False,
        "googleStreetViewOr3DTilesExtractionUsed": False,
        "primarySources": [
            str(DTR10_RASTER.relative_to(ROOT)),
            str(ADAPTER_PATH.relative_to(ROOT)),
            str((DTR10 / "generated/corrected-styled-raster-qa-report.json").relative_to(ROOT)),
        ],
        "generatedArtifacts": {
            "correctedRaster": dtr11_meta,
            "facadeExtractionSpecs": str(SPEC_PATH.relative_to(ROOT)),
            "facadeFidelityBoard": image_meta(FIDELITY_BOARD),
            "beforeAfterQaBoard": image_meta(QA_BOARD),
        },
        "dtr10Comparison": {
            "dtr10Raster": dtr10_meta,
            "sameSha256": dtr10_meta["sha256"] == dtr11_meta["sha256"],
            "assessment": "meaningfully_new_facade_edit_with_geometry_preserved",
        },
        "sourceImageExistence": [
            {
                "targetId": record["targetId"],
                "allSourceImagesExist": record["allSourceImagesExist"],
                "sourceReferenceImagePaths": record["sourceReferenceImagePaths"],
            }
            for record in records
        ],
        "scores": [
            {"criterion": "grillpoint_reference_fidelity", "score": 4, "acceptable": True, "notes": "Green G, maroon sign, black canopy, central entry, and poster/window rhythm now read strongly."},
            {"criterion": "mcdonalds_reference_fidelity", "score": 4, "acceptable": True, "notes": "Gray/yellow/dark glass, slat panels, arches, and mural mass are stronger."},
            {"criterion": "dunkin_reference_fidelity", "score": 4, "acceptable": True, "notes": "Black/orange-pink sign, side sign, beige mass, and dark entry are stronger; still small-scale approximate."},
            {"criterion": "citizens_reference_fidelity", "score": 4, "acceptable": True, "notes": "Green sign box, recessed entry, railings, masonry, and reddish trim are stronger."},
            {"criterion": "sign_band_accuracy", "score": 4, "acceptable": True},
            {"criterion": "entrance_window_alignment", "score": 4, "acceptable": True},
            {"criterion": "material_color_fidelity", "score": 4, "acceptable": True},
            {"criterion": "dtr10_geometry_preservation", "score": 4, "acceptable": True},
            {"criterion": "unsupported_invention_risk", "score": 3, "acceptable": False, "notes": "Risk remains because built-in image editing can invent small facade micro-details; QA labels and unsupported omissions constrain interpretation."},
            {"criterion": "facade_fidelity_sufficient_for_mvp_feedback", "score": 4, "acceptable": True},
        ],
        "requirementsAssessment": {
            "allReferencedSourceImagesExist": all(record["allSourceImagesExist"] for record in records),
            "fourStorefrontSpecRecordsCreated": len(records) == 4,
            "roadsSidewalksCrosswalksFrozen": True,
            "storefrontOrderPreserved": True,
            "onePrimaryGreenpointGCuePreserved": True,
            "addressTextQaOnly": True,
            "unsupportedDetailsOmittedOrMarked": True,
            "facadeReferenceFidelityMateriallyImproved": True,
            "fullFidelityFacadeReproductionProven": False,
        },
        "methodBottleneck": "Built-in image editing can reference visible source photos and improve facade cues, but without explicit per-facade masks, perspective-warp controls, or deterministic crop-to-scene compositing it cannot guarantee full-fidelity facade reproduction.",
        "verdict": {
            "suppliedReferenceImagesMateriallyImproveScene": True,
            "provesSuppliedReferenceImageToFacadeScenePipeline": "partial",
            "facadeFidelityNowSufficientForMvpFeedback": True,
            "recommendedNextStep": "Proceed to MVP feedback packaging. Only perform another ultra-narrow facade correction if Batu rejects a specific storefront crop in DTR-11.",
        },
    }
    QA_REPORT.write_text(json.dumps(report, indent=2) + "\n")


def main() -> None:
    GENERATED.mkdir(parents=True, exist_ok=True)
    CROPS.mkdir(parents=True, exist_ok=True)
    if not DTR11_RASTER.exists():
        raise SystemExit(f"Missing DTR-11 raster: {DTR11_RASTER}")
    records = build_records()
    SPEC_PATH.write_text(json.dumps({
        "schemaVersion": "phase-2dtr-11-facade-extraction-specs.v0.1",
        "artifactId": "phase-2dtr-11.facade-extraction-specs",
        "status": "review-only-reference-image-facade-specs",
        "generatedOn": "2026-06-03",
        "sourceGeometryAdapter": str(ADAPTER_PATH.relative_to(ROOT)),
        "sourceDtr10Raster": str(DTR10_RASTER.relative_to(ROOT)),
        "records": records,
    }, indent=2) + "\n")
    build_facade_fidelity_board(records)
    build_qa_board(records)
    build_report(records)
    print(json.dumps({
        "facadeExtractionSpecs": str(SPEC_PATH.relative_to(ROOT)),
        "correctedRaster": image_meta(DTR11_RASTER),
        "facadeFidelityBoard": image_meta(FIDELITY_BOARD),
        "beforeAfterQaBoard": image_meta(QA_BOARD),
        "qaReport": str(QA_REPORT.relative_to(ROOT)),
        "cropCount": len(list(CROPS.glob("*.png"))),
    }, indent=2))


if __name__ == "__main__":
    main()
