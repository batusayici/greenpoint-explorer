import { useEffect, useRef } from "react";
import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";

const CAMERA = {
  minScale: 0.5,
  maxScale: 1.55,
  desktopMaxOverviewScale: 0.82,
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
    camera: { x: 0, y: 0, scale: 0.58 },
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

      const texture = await Assets.load(scene.plate.src);

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
      stateRef.current.targetGraphics = drawTargets(world, scene.targets, false);

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
      (a, b) => a.bounds.width * a.bounds.height - b.bounds.width * b.bounds.height,
    );
    for (const target of targetsBySmallestHitArea) {
      const { bounds } = target;
      if (
        point.x >= bounds.x &&
        point.x <= bounds.x + bounds.width &&
        point.y >= bounds.y &&
        point.y <= bounds.y + bounds.height
      ) {
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
    const maxOverviewScale = host.clientWidth >= 760 ? CAMERA.desktopMaxOverviewScale : CAMERA.maxScale;
    camera.scale = clamp(Math.max(fitWidthScale, fitHeightScale) * 1.02, CAMERA.minScale, maxOverviewScale);
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
  const plate = new Sprite(texture);
  plate.width = scene.size.width;
  plate.height = scene.size.height;
  plate.alpha = scene.plate.alpha ?? 1;
  world.addChild(plate);

  if (scene.plate.scaffoldWash) {
    const wash = new Graphics()
      .rect(0, 0, scene.size.width, scene.size.height)
      .fill(scene.plate.scaffoldWash);
    world.addChild(wash);
  }
}

function drawTargets(world, targets, reviewMode) {
  const targetGraphics = new Map();
  for (const target of targets) {
    const container = new Container();
    const shape = new Graphics();
    const label = new Text({
      text: target.title,
      style: {
        fill: "#28231f",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 20,
        fontWeight: "800",
      },
    });
    container.eventMode = "none";
    label.resolution = 2;
    container.addChild(shape, label);
    world.addChild(container);
    renderTargetState({ shape, label }, target, false, false, reviewMode);
    targetGraphics.set(target.id, { shape, label });
  }
  return targetGraphics;
}

function renderTargetState(targetGraphic, target, isActive, isSelected, reviewMode) {
  const { x, y, width, height } = target.bounds;
  const { shape, label } = targetGraphic;
  const showReviewOverlay = reviewMode;
  const markerX = target.marker?.x ?? x + width - 28;
  const markerY = target.marker?.y ?? y + 30;
  const markerRadius = isSelected ? 19 : isActive ? 15 : 10;
  const markerColor = isSelected ? 0xf0bc45 : isActive ? 0xf7df9d : 0xf6ead2;
  const markerStroke = isSelected ? 0x1f2727 : 0x2b2a25;

  shape.clear();

  if (isActive || isSelected) {
    shape
      .circle(markerX, markerY, markerRadius + (isSelected ? 10 : 7))
      .fill({ color: 0xf0bc45, alpha: isSelected ? 0.16 : 0.1 });
  }

  shape
    .circle(markerX, markerY, markerRadius)
    .fill({ color: markerColor, alpha: isActive || isSelected ? 0.96 : 0.78 })
    .stroke({
      color: markerStroke,
      width: isSelected ? 4 : isActive ? 3 : 2,
      alpha: isActive || isSelected ? 0.95 : 0.62,
    });
  shape
    .circle(markerX, markerY, markerRadius * 0.36)
    .fill({ color: isSelected ? 0x9d4a32 : 0x243738, alpha: isSelected ? 0.9 : 0.76 });
  if (isSelected) {
    shape
      .circle(markerX, markerY, markerRadius + 7)
      .stroke({ color: 0xf6ead2, width: 2, alpha: 0.68 });
  }
  shape
    .moveTo(markerX, markerY + markerRadius)
    .lineTo(markerX, markerY + markerRadius + (isSelected ? 30 : 22))
    .stroke({
      color: isSelected ? 0xf0bc45 : 0xf6ead2,
      width: isSelected ? 3 : 2,
      alpha: isActive || isSelected ? 0.82 : 0.34,
    });
  shape
    .ellipse(markerX, markerY + markerRadius + (isSelected ? 32 : 24), isSelected ? 20 : 16, isSelected ? 7 : 5)
    .stroke({
      color: isSelected ? 0xf0bc45 : 0xf6ead2,
      width: isSelected ? 3 : 2,
      alpha: isActive || isSelected ? 0.78 : 0.28,
    });

  if (isActive || isSelected) {
    const corner = Math.min(68, width * 0.2, height * 0.2);
    const traceColor = isSelected ? 0xf0bc45 : 0xf6ead2;
    const traceAlpha = isSelected ? 0.78 : 0.5;
    const traceWidth = isSelected ? 4 : 3;
    if (isSelected) {
      shape.roundRect(x + 4, y + 4, width - 8, height - 8, 14)
        .fill({ color: 0xf0bc45, alpha: 0.06 });
    }
    shape.moveTo(x, y + corner).lineTo(x, y).lineTo(x + corner, y)
      .stroke({ color: traceColor, width: traceWidth, alpha: traceAlpha });
    shape.moveTo(x + width - corner, y).lineTo(x + width, y).lineTo(x + width, y + corner)
      .stroke({ color: traceColor, width: traceWidth, alpha: traceAlpha });
    shape.moveTo(x + width, y + height - corner).lineTo(x + width, y + height).lineTo(x + width - corner, y + height)
      .stroke({ color: traceColor, width: traceWidth, alpha: traceAlpha });
    shape.moveTo(x + corner, y + height).lineTo(x, y + height).lineTo(x, y + height - corner)
      .stroke({ color: traceColor, width: traceWidth, alpha: traceAlpha });
  }

  if (showReviewOverlay) {
    shape.roundRect(x, y, width, height, 10)
      .fill({ color: 0xf5e5c3, alpha: 0.08 })
      .stroke({ color: 0xe28e54, width: 3, alpha: 0.78 });
  }

  label.visible = showReviewOverlay;
  label.text = target.label ?? target.title;
  label.style.fill = "#f8ecd4";
  label.x = x + 14;
  label.y = y + 12;
  if (showReviewOverlay) {
    const labelPaddingX = 12;
    const labelPaddingY = 7;
    shape.roundRect(
      label.x - labelPaddingX,
      label.y - labelPaddingY,
      label.width + labelPaddingX * 2,
      label.height + labelPaddingY * 2,
      4,
    )
      .fill({ color: 0x202424, alpha: 0.88 })
      .stroke({ color: 0xf5e5c3, width: 2, alpha: 0.68 });
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
