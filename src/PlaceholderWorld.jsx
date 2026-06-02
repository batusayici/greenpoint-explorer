import { useEffect, useRef } from "react";
import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";

const CAMERA = {
  minScale: 0.36,
  maxScale: 1.65,
  desktopMaxOverviewScale: 0.86,
};

export default function PlaceholderWorld({
  scene,
  selectedTargetId,
  hoveredTargetId,
  reviewMode,
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
      stateRef.current.targetGraphics = drawTargets(world, scene.targets, reviewMode);

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
      renderTargetState(targetGraphic, target, isActive, selectedTargetId === target.id, reviewMode);
    }
  }, [hoveredTargetId, reviewMode, scene.targets, selectedTargetId]);

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

function drawTargets(world, targets, reviewMode) {
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

    container.eventMode = "none";
    markerLabel.resolution = 2;
    markerLabel.anchor.set(0.5);
    reviewLabel.resolution = 2;
    draftLabel.resolution = 2;
    container.addChild(shape, markerLabel, reviewLabel, draftLabel);
    world.addChild(container);
    renderTargetState({ shape, markerLabel, reviewLabel, draftLabel }, target, false, false, reviewMode);
    targetGraphics.set(target.id, { shape, markerLabel, reviewLabel, draftLabel });
  }
  return targetGraphics;
}

function renderTargetState(targetGraphic, target, isActive, isSelected, reviewMode) {
  const { x, y, width, height } = target.bounds;
  const { shape, markerLabel, reviewLabel, draftLabel } = targetGraphic;
  const markerX = target.marker?.x ?? x + width * 0.5;
  const markerY = target.marker?.y ?? y + height * 0.42;
  const tetherEnd = target.tetherEnd ?? {
    x: x + width * 0.5,
    y: y + height * 0.86,
  };
  const markerRadius = isSelected ? 16 : isActive ? 13 : 9;
  const markerColor = isSelected ? 0xf0bc45 : isActive ? 0xf7df9d : 0xf6ead2;
  const markerStroke = isSelected ? 0x1f2727 : 0x2b2a25;

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
      .circle(markerX, markerY, markerRadius + (isSelected ? 10 : 7))
      .fill({ color: 0xf0bc45, alpha: isSelected ? 0.12 : 0.08 });
  }

  shape
    .circle(markerX, markerY, markerRadius)
    .fill({ color: markerColor, alpha: isActive || isSelected ? 0.94 : 0.64 })
    .stroke({
      color: markerStroke,
      width: isSelected ? 3 : isActive ? 2.5 : 1.5,
      alpha: isActive || isSelected ? 0.9 : 0.5,
    });

  if (isSelected) {
    shape
      .circle(markerX, markerY, markerRadius + 6)
      .stroke({ color: 0xf6ead2, width: 1.5, alpha: 0.52 });
  }

  if (isActive || isSelected) {
    const traceColor = isSelected ? 0xf0bc45 : 0xf6ead2;
    const traceAlpha = isSelected ? 0.58 : 0.36;
    const traceWidth = isSelected ? 3 : 2;
    if (isSelected) {
      drawTargetOutline(shape, target, {
        fillColor: 0xf0bc45,
        fillAlpha: 0.035,
        strokeColor: 0xf0bc45,
        strokeAlpha: 0.16,
        strokeWidth: 8,
      });
    }
    drawTargetOutline(shape, target, {
      strokeColor: traceColor,
      strokeAlpha: traceAlpha,
      strokeWidth: traceWidth,
    });
  }

  if (reviewMode) {
    drawTargetOutline(shape, target, {
      fillColor: 0xf5e5c3,
      fillAlpha: 0.08,
      strokeColor: 0xe28e54,
      strokeAlpha: 0.78,
      strokeWidth: 3,
    });
  }

  markerLabel.visible = Boolean(target.marker?.label);
  markerLabel.text = target.marker?.label ?? "";
  markerLabel.style.fill = isSelected ? "#241f18" : "#28231f";
  markerLabel.style.fontSize = isSelected ? 15 : 13;
  markerLabel.x = markerX;
  markerLabel.y = markerY + 0.5;

  reviewLabel.visible = reviewMode;
  reviewLabel.text = target.rasterAnchorLabel ?? target.label ?? target.title;
  reviewLabel.style.fill = "#f8ecd4";
  reviewLabel.x = target.reviewLabelPosition?.x ?? x + 12;
  reviewLabel.y = target.reviewLabelPosition?.y ?? y + 12;

  if (reviewMode) {
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

  draftLabel.visible = Boolean(reviewMode && target.draftScene);
  if (draftLabel.visible) {
    const signText = target.draftScene.fields.signText;
    const facadeStyle = target.draftScene.fields.facadeStyle;
    const storefrontBay = target.draftScene.fields.storefrontBay;
    draftLabel.text = [
      `${signText.value} [${signText.status}]`,
      `${facadeStyle.status} facade`,
      `${storefrontBay.status} bay`,
    ].join("\n");
    draftLabel.x = target.draftLabelPosition?.x ?? target.reviewLabelPosition?.x ?? x + 12;
    draftLabel.y = target.draftLabelPosition?.y ?? (target.reviewLabelPosition?.y ?? y + 12) + 34;

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
  }
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
