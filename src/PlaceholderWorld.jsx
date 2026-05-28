import { useEffect, useRef } from "react";
import { Application, Container, Graphics, Text } from "pixi.js";

const CAMERA = {
  minScale: 0.62,
  maxScale: 1.65,
};

export default function PlaceholderWorld({
  scene,
  selectedTargetId,
  hoveredTargetId,
  onHoverTarget,
  onSelectTarget,
}) {
  const hostRef = useRef(null);
  const stateRef = useRef({
    app: null,
    world: null,
    targetGraphic: null,
    camera: { x: 0, y: 0, scale: 0.82 },
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

      if (cancelled || !host) {
        app.destroy(true);
        return;
      }

      host.appendChild(app.canvas);
      stateRef.current.app = app;

      const world = new Container();
      stateRef.current.world = world;
      app.stage.addChild(world);

      drawScene(world, scene);
      stateRef.current.targetGraphic = drawTarget(world, scene.target);

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
      stateRef.current.targetGraphic = null;
    };
  }, [scene]);

  useEffect(() => {
    const host = hostRef.current;
    const targetGraphic = stateRef.current.targetGraphic;
    if (!host || !targetGraphic) return;

    const isActive = selectedTargetId === scene.target.id || hoveredTargetId === scene.target.id;
    renderTargetState(targetGraphic, scene.target, isActive, selectedTargetId === scene.target.id);
  }, [hoveredTargetId, scene.target, selectedTargetId]);

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

  function isInsideTarget(event) {
    const point = toScenePoint(event);
    const { bounds } = scene.target;
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }

  function handlePointerDown(event) {
    const { camera } = stateRef.current;
    stateRef.current.dragging = true;
    stateRef.current.moved = false;
    stateRef.current.dragStart = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      cameraX: camera.x,
      cameraY: camera.y,
      startedOnTarget: isInsideTarget(event),
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

    onHoverTarget(isInsideTarget(event) ? scene.target.id : null);
  }

  function handlePointerUp(event) {
    const dragStart = stateRef.current.dragStart;
    const didSelect =
      dragStart?.startedOnTarget && !stateRef.current.moved && isInsideTarget(event);

    stateRef.current.dragging = false;
    stateRef.current.dragStart = null;

    if (didSelect) {
      onSelectTarget(scene.target.id);
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
      aria-label="Fictional placeholder isometric corner with one interactive target"
      data-testid="pixi-host"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => onHoverTarget(null)}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
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

function drawScene(world, scene) {
  const g = new Graphics();
  world.addChild(g);

  g.rect(0, 0, scene.size.width, scene.size.height).fill(0xf5ecd8);
  drawDiamond(g, 594, 494, 420, 214, 0xd8cba5, 0x433b31);
  drawDiamond(g, 365, 486, 282, 144, 0xc7d7d2, 0x433b31);
  drawDiamond(g, 822, 478, 300, 150, 0xe6d6b8, 0x433b31);

  drawBuilding(g, 302, 258, 250, 210, 0xd55f4d, 0xf2c46d);
  drawBuilding(g, 514, 206, 255, 252, 0x86a9a0, 0xf4e5bc);
  drawBuilding(g, 730, 260, 232, 198, 0x515d7d, 0xd7b574);

  drawAwning(g, 520, 350, 190, 52);
  drawPropCluster(g);

  const label = new Text({
    text: "fictional placeholder scene",
    style: {
      fill: 0x4c4035,
      fontFamily: "Arial",
      fontSize: 22,
      fontWeight: "700",
    },
  });
  label.position.set(64, 650);
  world.addChild(label);
}

function drawTarget(world, target) {
  const g = new Graphics();
  g.eventMode = "none";
  world.addChild(g);
  renderTargetState(g, target, false, false);
  return g;
}

function renderTargetState(g, target, isActive, isSelected) {
  const { x, y, width, height } = target.bounds;
  g.clear();
  g.roundRect(x, y, width, height, 16)
    .stroke({ color: isSelected ? 0x222222 : isActive ? 0x6c7c58 : 0x000000, width: isActive ? 8 : 0, alpha: isActive ? 0.78 : 0 });
  g.circle(x + width - 44, y + 58, isActive ? 20 : 14)
    .fill(isSelected ? 0x222222 : 0xf2cf68)
    .stroke({ color: 0x2f2b27, width: 4 });
}

function drawDiamond(g, x, y, width, height, fill, stroke) {
  g.poly([
    x,
    y - height / 2,
    x + width / 2,
    y,
    x,
    y + height / 2,
    x - width / 2,
    y,
  ])
    .fill(fill)
    .stroke({ color: stroke, width: 5 });
}

function drawBuilding(g, x, y, width, height, wall, roof) {
  g.roundRect(x, y, width, height, 10)
    .fill(wall)
    .stroke({ color: 0x3a332c, width: 5 });
  g.poly([x - 22, y, x + width / 2, y - 78, x + width + 22, y, x + width, y + 30, x, y + 30])
    .fill(roof)
    .stroke({ color: 0x3a332c, width: 5 });
  g.rect(x + 28, y + 94, 64, 92).fill(0xf8edcf).stroke({ color: 0x3a332c, width: 4 });
  g.rect(x + 118, y + 98, width - 154, 70).fill(0xf8edcf).stroke({ color: 0x3a332c, width: 4 });
}

function drawAwning(g, x, y, width, height) {
  g.roundRect(x, y, width, height, 10)
    .fill(0xf6cf6b)
    .stroke({ color: 0x3a332c, width: 4 });
  for (let i = 0; i < 6; i += 1) {
    g.rect(x + i * (width / 6), y, width / 12, height).fill(0xf2efe2);
  }
}

function drawPropCluster(g) {
  g.circle(320, 548, 28).fill(0x6e7f56).stroke({ color: 0x302b25, width: 4 });
  g.circle(902, 548, 24).fill(0x6e7f56).stroke({ color: 0x302b25, width: 4 });
  g.rect(292, 574, 56, 22).fill(0x7b5a41).stroke({ color: 0x302b25, width: 3 });
  g.rect(874, 570, 56, 22).fill(0x7b5a41).stroke({ color: 0x302b25, width: 3 });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
