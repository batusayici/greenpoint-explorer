import { useEffect, useRef } from "react";
import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";

const CAMERA = {
  minScale: 0.36,
  maxScale: 1.65,
  desktopMaxOverviewScale: 0.86,
};

const DEFAULT_QA_LAYERS = {
  realData: true,
  footprints: true,
  draft: false,
  labels: false,
};

export default function PlaceholderWorld({
  scene,
  selectedTargetId,
  hoveredTargetId,
  reviewMode,
  qaLayers = DEFAULT_QA_LAYERS,
  cameraCommand,
  onHoverTarget,
  onSelectTarget,
}) {
  const hostRef = useRef(null);
  const stateRef = useRef({
    app: null,
    world: null,
    targetGraphics: new Map(),
    camera: { x: 0, y: 0, scale: 0.72 },
    cameraInitialized: false,
    dragging: false,
    dragStart: null,
    moved: false,
  });

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;

    async function mountPixi() {
      const app = new Application();
      await app.init({
        antialias: true,
        autoDensity: true,
        backgroundAlpha: 0,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });

      const texture = scene.plate?.src ? await Assets.load(scene.plate.src) : null;

      if (cancelled || !host) {
        app.destroy(true);
        return;
      }

      host.appendChild(app.canvas);
      stateRef.current.app = app;

      const world = new Container();
      stateRef.current.world = world;
      app.stage.addChild(world);

      drawRasterPlate(world, scene, texture);
      stateRef.current.targetGraphics = drawTargets(world, scene.targets, reviewMode, qaLayers);

      const resizeObserver = new ResizeObserver(() => {
        resizeApp(host, app);
        clampAndApplyCamera(host, scene, stateRef.current);
      });
      resizeObserver.observe(host);
      resizeApp(host, app);
      clampAndApplyCamera(host, scene, stateRef.current);

      stateRef.current.resizeObserver = resizeObserver;
    }

    mountPixi();

    return () => {
      cancelled = true;
      const { app, resizeObserver } = stateRef.current;
      resizeObserver?.disconnect();
      app?.destroy(true);
      stateRef.current.app = null;
      stateRef.current.world = null;
      stateRef.current.targetGraphics = new Map();
      stateRef.current.cameraInitialized = false;
    };
  }, [scene]);

  useEffect(() => {
    const host = hostRef.current;
    const { targetGraphics } = stateRef.current;
    if (!host || !targetGraphics.size) return;

    for (const target of scene.targets) {
      const targetGraphic = targetGraphics.get(target.id);
      if (!targetGraphic) continue;
      const isActive = selectedTargetId === target.id || hoveredTargetId === target.id;
      renderTargetState(targetGraphic, target, isActive, selectedTargetId === target.id, reviewMode, qaLayers);
    }
  }, [hoveredTargetId, qaLayers, reviewMode, scene.targets, selectedTargetId]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !cameraCommand) return;

    const { camera } = stateRef.current;
    if (cameraCommand.type === "reset") {
      stateRef.current.cameraInitialized = false;
      clampAndApplyCamera(host, scene, stateRef.current);
      return;
    }

    if (cameraCommand.type === "zoom-in" || cameraCommand.type === "zoom-out") {
      const nextScale = clamp(
        camera.scale * (cameraCommand.type === "zoom-in" ? 1.18 : 0.84),
        CAMERA.minScale,
        CAMERA.maxScale,
      );
      const pointerX = host.clientWidth / 2;
      const pointerY = host.clientHeight / 2;
      const sceneX = (pointerX - camera.x) / camera.scale;
      const sceneY = (pointerY - camera.y) / camera.scale;
      updateCamera({
        scale: nextScale,
        x: pointerX - sceneX * nextScale,
        y: pointerY - sceneY * nextScale,
      });
      return;
    }

    if (cameraCommand.type === "pan-left" || cameraCommand.type === "pan-right") {
      updateCamera({
        ...camera,
        x: camera.x + (cameraCommand.type === "pan-left" ? 180 : -180),
      });
    }
  }, [cameraCommand, scene]);

  function updateCamera(nextCamera) {
    const host = hostRef.current;
    if (!host) return;
    stateRef.current.camera = nextCamera;
    clampAndApplyCamera(host, scene, stateRef.current);
  }

  function toScenePoint(event) {
    const host = hostRef.current;
    const { camera } = stateRef.current;
    const rect = host.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - camera.x) / camera.scale,
      y: (event.clientY - rect.top - camera.y) / camera.scale,
    };
  }

  function getTargetAtEvent(event) {
    const point = toScenePoint(event);
    const targetsBySmallestHitArea = [...scene.targets].sort(
      (a, b) => getHitAreaSize(a) - getHitAreaSize(b),
    );
    for (const target of targetsBySmallestHitArea) {
      if (isPointInHitAreas(point, target.hitAreas ?? [target.bounds])) {
        return target;
      }
    }
    return null;
  }

  function handlePointerDown(event) {
    const { camera } = stateRef.current;
    const target = getTargetAtEvent(event);
    stateRef.current.dragging = true;
    stateRef.current.moved = false;
    stateRef.current.dragStart = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      cameraX: camera.x,
      cameraY: camera.y,
      targetId: target?.id ?? null,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const dragStart = stateRef.current.dragStart;

    if (stateRef.current.dragging && dragStart) {
      const dx = event.clientX - dragStart.pointerX;
      const dy = event.clientY - dragStart.pointerY;
      if (Math.abs(dx) + Math.abs(dy) > 5) stateRef.current.moved = true;
      updateCamera({
        ...stateRef.current.camera,
        x: dragStart.cameraX + dx,
        y: dragStart.cameraY + dy,
      });
      return;
    }

    onHoverTarget(getTargetAtEvent(event)?.id ?? null);
  }

  function handlePointerUp(event) {
    const dragStart = stateRef.current.dragStart;
    const target = getTargetAtEvent(event);
    const didSelect =
      dragStart?.targetId && !stateRef.current.moved && target?.id === dragStart.targetId;

    stateRef.current.dragging = false;
    stateRef.current.dragStart = null;

    if (didSelect) {
      onSelectTarget(dragStart.targetId);
    }
  }

  function handleWheel(event) {
    event.preventDefault();
    const host = hostRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const { camera } = stateRef.current;
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const sceneX = (pointerX - camera.x) / camera.scale;
    const sceneY = (pointerY - camera.y) / camera.scale;
    const nextScale = clamp(
      camera.scale * (event.deltaY > 0 ? 0.9 : 1.1),
      CAMERA.minScale,
      CAMERA.maxScale,
    );

    updateCamera({
      scale: nextScale,
      x: pointerX - sceneX * nextScale,
      y: pointerY - sceneY * nextScale,
    });
  }

  return (
    <div
      ref={hostRef}
      className="pixi-host"
      role="img"
      aria-label={scene.plate.label}
      data-testid="pixi-host"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => onHoverTarget(null)}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onFocus={() => onHoverTarget(selectedTargetId ?? scene.targets[0]?.id ?? null)}
      onBlur={() => onHoverTarget(null)}
    />
  );
}

function resizeApp(host, app) {
  app.renderer.resize(host.clientWidth, host.clientHeight);
}

function clampAndApplyCamera(host, scene, state) {
  const { camera, world } = state;
  if (!world) return;

  if (!state.cameraInitialized) {
    const fitWidthScale = host.clientWidth / scene.size.width;
    const fitHeightScale = host.clientHeight / scene.size.height;
    const scale = host.clientWidth >= 760
      ? Math.min(fitWidthScale, fitHeightScale) * 0.98
      : Math.max(fitWidthScale, fitHeightScale) * 0.92;
    camera.scale = clamp(scale, CAMERA.minScale, CAMERA.desktopMaxOverviewScale);
    camera.x = (host.clientWidth - scene.size.width * camera.scale) / 2;
    camera.y = (host.clientHeight - scene.size.height * camera.scale) / 2;
    state.cameraInitialized = true;
  }

  const minX = host.clientWidth - scene.size.width * camera.scale - 44;
  const minY = host.clientHeight - scene.size.height * camera.scale - 44;
  const maxX = 44;
  const maxY = 44;

  camera.x = scene.size.width * camera.scale < host.clientWidth
    ? (host.clientWidth - scene.size.width * camera.scale) / 2
    : clamp(camera.x, minX, maxX);
  camera.y = scene.size.height * camera.scale < host.clientHeight
    ? (host.clientHeight - scene.size.height * camera.scale) / 2
    : clamp(camera.y, minY, maxY);

  world.position.set(camera.x, camera.y);
  world.scale.set(camera.scale);
}

function drawRasterPlate(world, scene, texture) {
  if (!texture) return;

  const plate = new Sprite(texture);
  plate.width = scene.size.width;
  plate.height = scene.size.height;
  plate.alpha = 1;
  world.addChild(plate);
}

function drawTargets(world, targets, reviewMode, qaLayers) {
  const targetGraphics = new Map();
  for (const target of targets) {
    const container = new Container();
    const shape = new Graphics();
    const markerLabel = new Text({
      text: target.marker?.label ?? "",
      style: {
        align: "center",
        fill: "#28231f",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 17,
        fontWeight: "900",
      },
    });
    const reviewLabel = new Text({
      text: target.rasterAnchorLabel ?? target.label ?? target.title,
      style: {
        fill: "#f8ecd4",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 18,
        fontWeight: "850",
      },
    });
    const draftLabel = new Text({
      text: "",
      style: {
        fill: "#251f18",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 13,
        fontWeight: "850",
        lineHeight: 16,
      },
    });
    const draftSignLabel = new Text({
      text: "",
      style: {
        align: "center",
        fill: "#211d18",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 13,
        fontWeight: "900",
      },
    });
    const draftStatusLabel = new Text({
      text: "",
      style: {
        fill: "#f8ecd4",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 11,
        fontWeight: "850",
        lineHeight: 15,
      },
    });
    const draftEntityLabelLayer = new Container();

    container.eventMode = "none";
    markerLabel.resolution = 2;
    markerLabel.anchor.set(0.5);
    reviewLabel.resolution = 2;
    draftLabel.resolution = 2;
    draftSignLabel.resolution = 2;
    draftSignLabel.anchor.set(0.5);
    draftStatusLabel.resolution = 2;
    container.addChild(shape, markerLabel, reviewLabel, draftLabel, draftSignLabel, draftStatusLabel, draftEntityLabelLayer);
    world.addChild(container);
    renderTargetState(
      { shape, markerLabel, reviewLabel, draftLabel, draftSignLabel, draftStatusLabel, draftEntityLabelLayer },
      target,
      false,
      false,
      reviewMode,
      qaLayers,
    );
    targetGraphics.set(target.id, {
      shape,
      markerLabel,
      reviewLabel,
      draftLabel,
      draftSignLabel,
      draftStatusLabel,
      draftEntityLabelLayer,
    });
  }
  return targetGraphics;
}

function renderTargetState(targetGraphic, target, isActive, isSelected, reviewMode, qaLayers = DEFAULT_QA_LAYERS) {
  const { x, y, width, height } = target.bounds;
  const {
    shape,
    markerLabel,
    reviewLabel,
    draftLabel,
    draftSignLabel,
    draftStatusLabel,
    draftEntityLabelLayer,
  } = targetGraphic;
  const markerX = target.marker?.x ?? x + width * 0.5;
  const markerY = target.marker?.y ?? y + height * 0.42;
  const tetherEnd = target.tetherEnd ?? {
    x: x + width * 0.5,
    y: y + height * 0.86,
  };
  const markerRadius = isSelected ? 16 : isActive ? 13 : 9;
  const markerColor = isSelected ? 0xf0bc45 : isActive ? 0xf7df9d : 0xf6ead2;
  const markerStroke = isSelected ? 0x1f2727 : 0x2b2a25;
  const showDetailedQaLabels = Boolean(reviewMode && qaLayers.labels && (isActive || isSelected));

  shape.clear();

  for (const hitArea of target.hitAreas ?? [target.bounds]) {
    shape
      .roundRect(hitArea.x, hitArea.y, hitArea.width, hitArea.height, 10)
      .fill({ color: 0xffffff, alpha: 0.001 });
  }

  shape
    .moveTo(markerX, markerY + markerRadius)
    .lineTo(tetherEnd.x, tetherEnd.y)
    .stroke({
      color: isSelected ? 0xf0bc45 : 0xf6ead2,
      width: isSelected ? 2.5 : 1.5,
      alpha: isActive || isSelected ? 0.54 : 0.18,
    });

  shape
    .circle(tetherEnd.x, tetherEnd.y, isSelected ? 5 : 3.5)
    .fill({ color: isSelected ? 0xf0bc45 : 0xf6ead2, alpha: isActive || isSelected ? 0.58 : 0.22 });

  if (isActive || isSelected) {
    shape
      .circle(markerX, markerY + markerRadius * 0.08, markerRadius + (isSelected ? 11 : 8))
      .fill({ color: 0xf0bc45, alpha: isSelected ? 0.12 : 0.08 });
  }

  drawMapPinMarker(shape, {
    x: markerX,
    y: markerY,
    radius: markerRadius,
    fillColor: markerColor,
    strokeColor: markerStroke,
    isActive,
    isSelected,
  });

  if (isSelected) {
    shape
      .ellipse(markerX, markerY + markerRadius * 1.38, markerRadius * 0.82, markerRadius * 0.22)
      .stroke({ color: 0xf6ead2, width: 1.5, alpha: 0.52 });
  }

  if (isActive || isSelected) {
    drawArtDirectedTargetContour(shape, target, isSelected);
  }

  if (reviewMode && qaLayers.draft) {
    drawTargetOutline(shape, target, {
      fillColor: 0xf5e5c3,
      fillAlpha: 0.08,
      strokeColor: 0xe28e54,
      strokeAlpha: 0.78,
      strokeWidth: 3,
    });
  }

  if (reviewMode) {
    drawDraftQaOverlay(shape, target, qaLayers);
  }

  markerLabel.visible = Boolean(target.marker?.label);
  markerLabel.text = target.marker?.label ?? "";
  markerLabel.style.fill = isSelected ? "#241f18" : "#28231f";
  markerLabel.style.fontSize = isSelected ? 15 : 13;
  markerLabel.x = markerX;
  markerLabel.y = markerY - markerRadius * 0.12;

  reviewLabel.visible = Boolean(reviewMode && !target.draftScene?.generatedScene);
  reviewLabel.text = target.rasterAnchorLabel ?? target.label ?? target.title;
  reviewLabel.style.fill = "#f8ecd4";
  reviewLabel.x = target.reviewLabelPosition?.x ?? x + 12;
  reviewLabel.y = target.reviewLabelPosition?.y ?? y + 12;

  if (reviewLabel.visible) {
    const labelPaddingX = 10;
    const labelPaddingY = 6;
    shape.roundRect(
      reviewLabel.x - labelPaddingX,
      reviewLabel.y - labelPaddingY,
      reviewLabel.width + labelPaddingX * 2,
      reviewLabel.height + labelPaddingY * 2,
      4,
    )
      .fill({ color: 0x202424, alpha: 0.88 })
      .stroke({ color: 0xf5e5c3, width: 2, alpha: 0.68 });
  }

  draftLabel.visible = Boolean(reviewMode && target.draftScene && qaLayers.draft && showDetailedQaLabels);
  draftSignLabel.visible = false;
  draftStatusLabel.visible = false;
  if (reviewMode && target.draftScene && qaLayers.draft) {
    const generatedScene = target.draftScene.generatedScene;
    const signEntity = getDraftEntity(generatedScene, "sign-band");
    const signText = target.draftScene.fields.signText;
    if (signEntity?.bounds) {
      const { bounds } = signEntity;
      draftSignLabel.visible = true;
      draftSignLabel.text = signEntity.text ?? String(signText.value);
      draftSignLabel.style.fontSize = draftSignLabel.text.length > 14 ? 11 : 13;
      draftSignLabel.x = bounds.x + bounds.width / 2;
      draftSignLabel.y = bounds.y + bounds.height / 2;
    }
  }
  if (draftLabel.visible) {
    const generatedScene = target.draftScene.generatedScene;
    const statusEntity = getDraftEntity(generatedScene, "status-badges");
    const labelEntity = getDraftEntity(generatedScene, "business-label");
    const facadeStyle = target.draftScene.fields.facadeStyle;
    const name = target.draftScene.fields.name;
    const address = target.draftScene.fields.addressText;
    const category = target.draftScene.fields.category;
    const anchor = target.draftScene.fields.sceneAnchor;
    const doorWindow = target.draftScene.fields.doorWindowPlacement;
    const statusChips = statusEntity?.chips ?? generatedScene?.statusChips ?? [
      { label: "name", status: name.status },
      { label: "facade", status: facadeStyle.status },
      { label: "anchor", status: anchor.status },
    ];

    draftLabel.text = statusChips
      .map((chip) => `${chip.label}: ${formatDraftStatus(chip.status)}`)
      .join("\n");
    draftLabel.x = statusEntity?.point?.x ?? target.draftLabelPosition?.x ?? target.reviewLabelPosition?.x ?? x + 12;
    draftLabel.y = statusEntity?.point?.y ?? (target.reviewLabelPosition?.y ?? y + 12) + 34;

    const labelPaddingX = 8;
    const labelPaddingY = 5;
    shape.roundRect(
      draftLabel.x - labelPaddingX,
      draftLabel.y - labelPaddingY,
      draftLabel.width + labelPaddingX * 2,
      draftLabel.height + labelPaddingY * 2,
      4,
    )
      .fill({ color: 0xf5e5c3, alpha: 0.9 })
      .stroke({ color: 0x2c2c26, width: 1.5, alpha: 0.7 });

    if (labelEntity?.point) {
      const statusParts = [
        `${labelEntity.text ?? name.value}`,
        `${formatDraftStatus(name.status)} name / ${formatDraftStatus(address.status)} address`,
        `${formatDraftStatus(category.status)} category / ${formatDraftStatus(doorWindow.status)} door-window`,
      ];
      draftStatusLabel.visible = true;
      draftStatusLabel.text = statusParts.join("\n");
      draftStatusLabel.x = labelEntity.point.x;
      draftStatusLabel.y = labelEntity.point.y;
      const statusPaddingX = 9;
      const statusPaddingY = 6;
      shape.roundRect(
        draftStatusLabel.x - statusPaddingX,
        draftStatusLabel.y - statusPaddingY,
        draftStatusLabel.width + statusPaddingX * 2,
        draftStatusLabel.height + statusPaddingY * 2,
        5,
      )
        .fill({ color: 0x202424, alpha: 0.9 })
        .stroke({ color: 0xf5e5c3, width: 1.5, alpha: 0.7 });
    }
  }

  syncDraftEntityLabelLayer(
    shape,
    draftEntityLabelLayer,
    target.draftScene?.generatedScene,
    reviewMode,
    showDetailedQaLabels,
    qaLayers,
  );
}

function drawDraftQaOverlay(graphics, target, qaLayers) {
  const generatedScene = target.draftScene?.generatedScene;
  if (generatedScene?.entities?.length) {
    for (const entity of generatedScene.entities) drawGeneratedDraftEntity(graphics, entity, qaLayers);
    return;
  }

  const overlay = target.draftScene?.qaOverlay;
  if (!overlay || !qaLayers.draft) return;

  drawOverlayRect(graphics, overlay.footprint, { fillAlpha: 0.035, strokeAlpha: 0.34, strokeWidth: 3 });
  drawOverlayRect(graphics, overlay.facadeBand, { fillAlpha: 0.11, strokeAlpha: 0.76, strokeWidth: 2 });
  drawOverlayRect(graphics, overlay.storefrontBay, { fillAlpha: 0.16, strokeAlpha: 0.92, strokeWidth: 2.5 });
  drawOverlayRect(graphics, overlay.signPanel, { fillAlpha: 0.9, strokeAlpha: 0.94, strokeWidth: 2, forceFillColor: 0xf5e5c3 });
  drawOverlayRect(graphics, overlay.doorCue, { fillAlpha: 0.5, strokeAlpha: 0.9, strokeWidth: 2 });
  for (const cue of overlay.windowCues ?? []) {
    drawOverlayRect(graphics, cue, { fillAlpha: 0.32, strokeAlpha: 0.78, strokeWidth: 1.5 });
  }
  if (overlay.anchorConnector) drawOverlayConnector(graphics, overlay.anchorConnector);
  if (overlay.symbolicCue) drawSymbolicCue(graphics, overlay.symbolicCue);
}

function drawGeneratedDraftEntity(graphics, entity, qaLayers) {
  if (entity.type === "field-status-callout" || entity.type === "real-data-field-status-callout") return;
  if (entity.type === "official-building-footprint-candidate") {
    if (qaLayers.footprints) drawSourceGeometryPolygon(graphics, entity.polygon, qaLayers.labels);
    return;
  }
  if (entity.type.startsWith("real-data-")) {
    if (!qaLayers.realData) return;
  } else if (!qaLayers.draft) {
    return;
  }
  if (entity.type === "real-data-building-sample") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.045, strokeAlpha: 0.52, strokeWidth: 3 });
    return;
  }
  if (entity.type === "real-data-generated-facade") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.12, strokeAlpha: 0.78, strokeWidth: 2.4 });
    return;
  }
  if (entity.type === "real-data-storefront-sample") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.2, strokeAlpha: 0.98, strokeWidth: 4 });
    return;
  }
  if (entity.type === "real-data-source-badge") {
    if (!qaLayers.labels) return;
    drawOverlayRect(graphics, entity, { fillAlpha: 0.88, strokeAlpha: 0.96, strokeWidth: 2, forceFillColor: 0x24453c });
    return;
  }
  if (entity.type === "real-data-frontage-segment") {
    drawOverlayConnector(graphics, entity, { alpha: 0.88, endpoint: false, width: 3.2 });
    return;
  }
  if (entity.type === "real-data-address-anchor") {
    drawPointCue(graphics, entity.point, entity.status, { radius: 7.5, cross: true });
    return;
  }
  if (entity.type === "real-data-blocked-entrance") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.18, strokeAlpha: 0.96, strokeWidth: 2.5 });
    drawBlockedBoundsCue(graphics, entity.bounds);
    return;
  }
  if (entity.type === "footprint") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.018, strokeAlpha: 0.3, strokeWidth: 2.5 });
    return;
  }
  if (entity.type === "facade-panel") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.08, strokeAlpha: 0.68, strokeWidth: 2.2 });
    return;
  }
  if (entity.type === "storefront-bay") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.13, strokeAlpha: 0.96, strokeWidth: 3.3 });
    return;
  }
  if (entity.type === "sign-band") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.82, strokeAlpha: 0.9, strokeWidth: 2.4, forceFillColor: 0xf5e5c3 });
    return;
  }
  if (entity.type === "door-cue") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.38, strokeAlpha: 0.86, strokeWidth: 2 });
    return;
  }
  if (entity.type === "window-cue") {
    drawOverlayRect(graphics, entity, { fillAlpha: 0.22, strokeAlpha: 0.74, strokeWidth: 1.5 });
    return;
  }
  if (entity.type === "bay-division") {
    drawOverlayConnector(graphics, entity, { alpha: 0.62, endpoint: false, width: 1.7 });
    return;
  }
  if (entity.type === "anchor-connector") {
    drawOverlayConnector(graphics, entity, { alpha: 0.42, endpoint: true, width: 1.6 });
    return;
  }
  if (entity.type === "symbolic-cue") {
    drawSymbolicCue(graphics, entity);
  }
}

function getDraftEntity(generatedScene, type) {
  return generatedScene?.entities?.find((entity) => entity.type === type);
}

function syncDraftEntityLabelLayer(graphics, layer, generatedScene, reviewMode, showDetailedLabels, qaLayers) {
  const removed = layer.removeChildren();
  for (const child of removed) child.destroy();

  layer.visible = Boolean(reviewMode && generatedScene?.entities?.length);
  if (!layer.visible) return;

  const sourceBadges = generatedScene.entities.filter((entity) => entity.type === "real-data-source-badge");
  for (const badge of sourceBadges) {
    if (!qaLayers.realData || !qaLayers.labels) continue;
    if (!badge.bounds) continue;
    const text = new Text({
      text: badge.text ?? badge.label,
      style: {
        fill: "#f8ecd4",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 9,
        fontWeight: "900",
        lineHeight: 11,
      },
    });
    text.resolution = 2;
    text.x = badge.bounds.x + 8;
    text.y = badge.bounds.y + 6;
    layer.addChild(text);
  }

  const officialFootprints = generatedScene.entities.filter((entity) => entity.type === "official-building-footprint-candidate");
  for (const footprint of officialFootprints) {
    if (!qaLayers.footprints || !showDetailedLabels || !footprint.polygon?.length) continue;
    const anchor = polygonCenter(footprint.polygon);
    const text = new Text({
      text: footprint.text ?? footprint.label,
      style: {
        fill: "#f8ecd4",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 9,
        fontWeight: "900",
        lineHeight: 11,
      },
    });
    text.resolution = 2;
    text.x = anchor.x + 8;
    text.y = anchor.y - 8;
    layer.addChild(text);
  }

  const callouts = generatedScene.entities.filter((entity) => (
    entity.type === "field-status-callout" ||
    entity.type === "real-data-field-status-callout"
  ));
  for (const callout of callouts) {
    const isRealDataCallout = callout.type === "real-data-field-status-callout";
    if (isRealDataCallout && !qaLayers.realData) continue;
    if (!isRealDataCallout && !qaLayers.draft) continue;
    if (!callout.point) continue;
    if (showDetailedLabels) drawCompactStatusPin(graphics, callout);
    if (!showDetailedLabels) continue;

    const text = new Text({
      text: callout.text,
      style: {
        fill: "#27221c",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 9,
        fontWeight: "900",
        lineHeight: 11,
      },
    });
    text.resolution = 2;
    text.x = callout.point.x;
    text.y = callout.point.y;

    const statusColor = getDraftStatusColor(callout.status);
    if (callout.from) {
      graphics
        .moveTo(callout.from.x, callout.from.y)
        .lineTo(callout.point.x, callout.point.y + 6)
        .stroke({ color: statusColor, width: 1.2, alpha: 0.34 });
    }

    const paddingX = 5;
    const paddingY = 3;
    graphics
      .roundRect(
        text.x - paddingX,
        text.y - paddingY,
        text.width + paddingX * 2,
        text.height + paddingY * 2,
        4,
      )
      .fill({ color: 0xfff2d1, alpha: 0.84 })
      .stroke({ color: statusColor, width: 1.2, alpha: 0.74 });
    graphics
      .rect(text.x - paddingX, text.y - paddingY, 4, text.height + paddingY * 2)
      .fill({ color: statusColor, alpha: 0.92 });

    layer.addChild(text);
  }
}

function drawSourceGeometryPolygon(graphics, polygon, showVertices = false) {
  if (!polygon?.length) return;
  graphics
    .moveTo(polygon[0].x, polygon[0].y);
  for (const point of polygon.slice(1)) {
    graphics.lineTo(point.x, point.y);
  }
  graphics
    .fill({ color: 0x7bc6a4, alpha: 0.035 })
    .stroke({ color: 0x7bc6a4, width: 2.4, alpha: 0.58 });

  if (!showVertices) return;
  for (const point of polygon.slice(0, -1)) {
    graphics.circle(point.x, point.y, 2.8).fill({ color: 0x203f35, alpha: 0.74 });
  }
}

function polygonCenter(polygon) {
  const points = polygon.slice(0, -1).length ? polygon.slice(0, -1) : polygon;
  const total = points.reduce((memo, point) => ({
    x: memo.x + point.x,
    y: memo.y + point.y,
  }), { x: 0, y: 0 });
  return {
    x: Math.round(total.x / points.length),
    y: Math.round(total.y / points.length),
  };
}

function drawCompactStatusPin(graphics, callout) {
  const point = callout.from ?? callout.point;
  if (!point) return;
  const statusColor = getDraftStatusColor(callout.status);
  graphics
    .circle(point.x, point.y, 5.3)
    .fill({ color: 0xfff2d1, alpha: 0.74 })
    .stroke({ color: statusColor, width: 1.4, alpha: 0.88 });
  graphics
    .circle(point.x, point.y, 2.5)
    .fill({ color: statusColor, alpha: 0.94 });
}

function drawOverlayRect(graphics, overlayRect, options) {
  if (!overlayRect?.bounds) return;
  const { bounds, status } = overlayRect;
  const color = options.forceFillColor ?? getDraftStatusColor(status);
  graphics
    .roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 6)
    .fill({ color, alpha: options.fillAlpha })
    .stroke({
      color: getDraftStatusColor(status),
      width: options.strokeWidth,
      alpha: options.strokeAlpha,
    });
}

function drawOverlayConnector(graphics, connector, options = {}) {
  const color = getDraftStatusColor(connector.status);
  const alpha = options.alpha ?? 0.72;
  const width = options.width ?? 2;
  graphics
    .moveTo(connector.from.x, connector.from.y)
    .lineTo(connector.to.x, connector.to.y)
    .stroke({ color, width, alpha });
  if (options.endpoint ?? true) {
    graphics
      .circle(connector.from.x, connector.from.y, 4)
      .fill({ color, alpha: Math.min(0.7, alpha + 0.14) });
  }
}

function drawPointCue(graphics, point, status, options = {}) {
  if (!point) return;
  const color = getDraftStatusColor(status);
  const radius = options.radius ?? 6;
  graphics
    .circle(point.x, point.y, radius)
    .fill({ color: 0xfff2d1, alpha: 0.68 })
    .stroke({ color, width: 2, alpha: 0.92 });
  graphics
    .circle(point.x, point.y, Math.max(2, radius * 0.38))
    .fill({ color, alpha: 0.96 });
  if (options.cross) {
    graphics
      .moveTo(point.x - radius - 4, point.y)
      .lineTo(point.x + radius + 4, point.y)
      .moveTo(point.x, point.y - radius - 4)
      .lineTo(point.x, point.y + radius + 4)
      .stroke({ color, width: 1.4, alpha: 0.7 });
  }
}

function drawBlockedBoundsCue(graphics, bounds) {
  if (!bounds) return;
  const color = getDraftStatusColor("blocked");
  graphics
    .moveTo(bounds.x + 5, bounds.y + 5)
    .lineTo(bounds.x + bounds.width - 5, bounds.y + bounds.height - 5)
    .moveTo(bounds.x + bounds.width - 5, bounds.y + 5)
    .lineTo(bounds.x + 5, bounds.y + bounds.height - 5)
    .stroke({ color, width: 2, alpha: 0.72 });
}

function drawSymbolicCue(graphics, cue) {
  const color = getDraftStatusColor(cue.status);
  graphics
    .circle(cue.center.x, cue.center.y, cue.radius)
    .fill({ color, alpha: 0.055 })
    .stroke({ color, width: 3, alpha: 0.78 });
  graphics
    .moveTo(cue.center.x - cue.radius * 0.72, cue.center.y - cue.radius * 0.72)
    .lineTo(cue.center.x + cue.radius * 0.72, cue.center.y + cue.radius * 0.72)
    .moveTo(cue.center.x + cue.radius * 0.72, cue.center.y - cue.radius * 0.72)
    .lineTo(cue.center.x - cue.radius * 0.72, cue.center.y + cue.radius * 0.72)
    .stroke({ color: getDraftStatusColor("blocked"), width: 2, alpha: 0.68 });
}

function getDraftStatusColor(status) {
  if (status === "sourced" || status === "verified") return 0x6fb08f;
  if (status === "source_backed") return 0x3aa37b;
  if (status === "human_prepared") return 0x4e9bd7;
  if (status === "estimated_from_source") return 0xe0a24d;
  if (status === "generated_placeholder") return 0xb2a26d;
  if (status === "inferred") return 0xe0a24d;
  if (status === "manual_draft") return 0xf0bc45;
  if (status === "symbolic") return 0x6f9ec9;
  if (status === "blocked" || status === "unknown") return 0xd66a4e;
  return 0xf5e5c3;
}

function formatDraftStatus(status) {
  return status.replaceAll("_", " ");
}

function drawTargetOutline(graphics, target, styles) {
  const { x, y, width, height } = target.bounds;
  const outlinePaths = target.outlinePaths ?? (target.outlinePoints ? [target.outlinePoints] : []);

  if (!outlinePaths.length) {
    const radius = styles.fillAlpha ? 14 : 10;
    const path = graphics.roundRect(x, y, width, height, radius);
    if (styles.fillColor && styles.fillAlpha) {
      path.fill({ color: styles.fillColor, alpha: styles.fillAlpha });
    }
    path.stroke({
      color: styles.strokeColor,
      width: styles.strokeWidth,
      alpha: styles.strokeAlpha,
    });
    return;
  }

  for (const outline of outlinePaths) {
    if (!drawOutlinePath(graphics, outline)) continue;
    if (styles.fillColor && styles.fillAlpha) {
      graphics.fill({ color: styles.fillColor, alpha: styles.fillAlpha });
    }
    graphics.stroke({
      color: styles.strokeColor,
      width: styles.strokeWidth,
      alpha: styles.strokeAlpha,
    });
  }
}

function drawArtDirectedTargetContour(graphics, target, isSelected) {
  const contourPaths = target.displayOutlinePaths
    ?? target.outlinePaths
    ?? (target.outlinePoints ? [target.outlinePoints] : []);
  if (!contourPaths.length) {
    drawTargetOutline(graphics, target, {
      fillColor: 0xf0bc45,
      fillAlpha: isSelected ? 0.045 : 0.024,
      strokeColor: 0xf9e8b7,
      strokeAlpha: isSelected ? 0.78 : 0.56,
      strokeWidth: isSelected ? 3.2 : 2.4,
    });
    return;
  }

  for (const contour of contourPaths) {
    if (!drawOutlinePath(graphics, contour)) continue;
    graphics.fill({ color: 0xf0bc45, alpha: isSelected ? 0.05 : 0.026 });
  }

  for (const contour of contourPaths) {
    if (!drawOutlinePath(graphics, contour)) continue;
    graphics.stroke({
      color: 0x171716,
      width: isSelected ? 7.4 : 5.8,
      alpha: isSelected ? 0.5 : 0.36,
    });
  }

  for (const contour of contourPaths) {
    if (!drawOutlinePath(graphics, contour)) continue;
    graphics.stroke({
      color: 0xf0bc45,
      width: isSelected ? 5.4 : 4.1,
      alpha: isSelected ? 0.52 : 0.34,
    });
  }

  for (const contour of contourPaths) {
    if (!drawOutlinePath(graphics, contour)) continue;
    graphics.stroke({
      color: 0xffedb7,
      width: isSelected ? 2.3 : 1.8,
      alpha: isSelected ? 0.88 : 0.66,
    });
  }
}

function drawMapPinMarker(graphics, options) {
  const {
    x,
    y,
    radius,
    fillColor,
    strokeColor,
    isActive,
    isSelected,
  } = options;
  const stem = radius * 1.26;
  const top = y - radius * 0.92;
  const bottom = y + stem;
  const side = radius * 1.02;

  graphics
    .moveTo(x, bottom)
    .bezierCurveTo(x - side, y + radius * 0.4, x - side, top + radius * 0.38, x, top)
    .bezierCurveTo(x + side, top + radius * 0.38, x + side, y + radius * 0.4, x, bottom)
    .fill({ color: fillColor, alpha: isActive || isSelected ? 0.96 : 0.68 })
    .stroke({
      color: strokeColor,
      width: isSelected ? 3 : isActive ? 2.4 : 1.5,
      alpha: isActive || isSelected ? 0.92 : 0.58,
    });

  graphics
    .ellipse(x, y + stem + radius * 0.24, radius * 0.68, radius * 0.18)
    .stroke({ color: 0xf6ead2, width: isSelected ? 2 : 1.2, alpha: isSelected ? 0.55 : 0.22 });
}

function drawOutlinePath(graphics, points) {
  if (!Array.isArray(points) || points.length < 3) return false;
  graphics.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    graphics.lineTo(points[index].x, points[index].y);
  }
  graphics.lineTo(points[0].x, points[0].y);
  return true;
}

function isPointInHitAreas(point, hitAreas) {
  return hitAreas.some((area) => (
    point.x >= area.x &&
    point.x <= area.x + area.width &&
    point.y >= area.y &&
    point.y <= area.y + area.height
  ));
}

function getHitAreaSize(target) {
  return (target.hitAreas ?? [target.bounds]).reduce(
    (total, area) => total + area.width * area.height,
    0,
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
