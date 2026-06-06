import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import manifest from "./data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";
import facadeCueFixture from "./data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json";
import qaFacadeSliceFixture from "./data/facade-cues/greenpoint-ave-franklin-end.phase-4c-qa-facade-slice.v0.1.json";
import geometryFixture from "./data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
import { buildPhase4BRuntimeScene } from "./phase4bRuntimeScene.js";

const HOME_CAMERA = {
  azimuth: -0.68,
  polar: 0.88,
  distance: 18.5,
  zoom: 0.82,
  target: new THREE.Vector3(0, 0.75, 0.18),
};

const CAMERA_PRESETS = {
  home: HOME_CAMERA,
  manhattanToFranklin: {
    azimuth: 0.22,
    polar: 0.96,
    distance: 22,
    zoom: 0.74,
    target: new THREE.Vector3(0, 0.82, -0.35),
  },
  franklinToManhattan: {
    azimuth: Math.PI + 0.22,
    polar: 0.96,
    distance: 22,
    zoom: 0.74,
    target: new THREE.Vector3(0, 0.82, 0.35),
  },
  overhead: {
    azimuth: -0.68,
    polar: 0.3,
    distance: 22,
    zoom: 0.76,
    target: new THREE.Vector3(0, 0.55, 0),
  },
  streetOblique: {
    azimuth: -0.48,
    polar: 1.02,
    distance: 20,
    zoom: 0.86,
    target: new THREE.Vector3(0, 0.95, 0.15),
  },
};

const CAMERA_LIMITS = {
  minPolar: 0.32,
  maxPolar: 1.28,
  minDistance: 9,
  maxDistance: 24,
  minZoom: 0.68,
  maxZoom: 1.8,
  panLimit: 9,
};

export default function Phase4BRuntimePreview() {
  const runtimeScene = useMemo(() => buildPhase4BRuntimeScene(manifest, geometryFixture), []);
  const facadeCueIndex = useMemo(() => buildFacadeCueIndex(facadeCueFixture), []);
  const qaFacadeSliceIndex = useMemo(() => buildQAFacadeSliceIndex(qaFacadeSliceFixture), []);
  const hostRef = useRef(null);
  const stateRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [qaEnabled, setQaEnabled] = useState(false);
  const inspectedId = selectedId ?? hoveredId;
  const inspectedObject = runtimeScene.objects.find((object) => object.id === inspectedId) ?? null;
  const inspectedCue = inspectedObject ? facadeCueIndex.get(inspectedObject.id) ?? null : null;
  const inspectedSliceFacade = inspectedObject ? qaFacadeSliceIndex.get(inspectedObject.id) ?? null : null;
  const reviewTotals = useMemo(() => (
    buildReviewTotals(runtimeScene, facadeCueFixture, qaFacadeSliceFixture)
  ), [runtimeScene]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x101414, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = "phase4b-canvas";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111616);

    const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const cameraState = cloneCameraState(HOME_CAMERA);
    const pickTargets = [];
    const visualObjects = new Map();
    const pickObjects = new Map();

    addLights(scene);
    addGround(scene, runtimeScene);
    addRuntimeObjects(scene, runtimeScene, facadeCueIndex, qaFacadeSliceIndex, pickTargets, visualObjects, pickObjects);

    stateRef.current = {
      camera,
      cameraState,
      dragging: false,
      dragMode: "orbit",
      dragStart: null,
      moved: false,
      host,
      pickObjects,
      pickTargets,
      pointer,
      raycaster,
      renderer,
      runtimeScene,
      scene,
      visualObjects,
    };

    function resize() {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      const aspect = width / height;
      camera.left = -10 * aspect;
      camera.right = 10 * aspect;
      camera.top = 10;
      camera.bottom = -10;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      updateCamera(stateRef.current);
      renderFrame(stateRef.current);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    renderer.setAnimationLoop(() => {
      renderFrame(stateRef.current);
    });

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      host.removeChild(renderer.domElement);
      disposeScene(scene);
      renderer.dispose();
      stateRef.current = null;
    };
  }, [runtimeScene, facadeCueIndex, qaFacadeSliceIndex]);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    updateObjectStates(state, hoveredId, selectedId, qaEnabled);
    renderFrame(state);
  }, [hoveredId, selectedId, qaEnabled]);

  function handlePointerDown(event) {
    const state = stateRef.current;
    if (!state) return;
    const hit = getHitFromEvent(state, event);
    state.dragging = true;
    state.moved = false;
    state.dragMode = event.shiftKey || event.button === 1 || event.button === 2 ? "pan" : "orbit";
    state.dragStart = {
      x: event.clientX,
      y: event.clientY,
      azimuth: state.cameraState.azimuth,
      polar: state.cameraState.polar,
      target: state.cameraState.target.clone(),
      hitId: hit?.userData.semanticId ?? null,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const state = stateRef.current;
    if (!state) return;

    if (state.dragging && state.dragStart) {
      const dx = event.clientX - state.dragStart.x;
      const dy = event.clientY - state.dragStart.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) state.moved = true;

      if (state.dragMode === "pan") {
        panCamera(state, -dx * 0.018, dy * 0.018, state.dragStart.target);
      } else {
        state.cameraState.azimuth = state.dragStart.azimuth - dx * 0.006;
        state.cameraState.polar = clamp(
          state.dragStart.polar + dy * 0.004,
          CAMERA_LIMITS.minPolar,
          CAMERA_LIMITS.maxPolar,
        );
      }
      updateCamera(state);
      renderFrame(state);
      return;
    }

    const hit = getHitFromEvent(state, event);
    setHoveredId(hit?.userData.semanticId ?? null);
  }

  function handlePointerUp(event) {
    const state = stateRef.current;
    if (!state) return;
    const hit = getHitFromEvent(state, event);
    const clickedId =
      !state.moved && state.dragStart?.hitId && state.dragStart.hitId === hit?.userData.semanticId
        ? state.dragStart.hitId
        : null;

    state.dragging = false;
    state.dragStart = null;
    if (clickedId) setSelectedId(clickedId);
  }

  function handlePointerLeave() {
    const state = stateRef.current;
    if (!state) return;
    state.dragging = false;
    state.dragStart = null;
    setHoveredId(null);
  }

  function handleWheel(event) {
    event.preventDefault();
    const state = stateRef.current;
    if (!state) return;
    state.cameraState.zoom = clamp(
      state.cameraState.zoom * (event.deltaY > 0 ? 0.92 : 1.08),
      CAMERA_LIMITS.minZoom,
      CAMERA_LIMITS.maxZoom,
    );
    updateCamera(state);
    renderFrame(state);
  }

  function runCameraCommand(command) {
    const state = stateRef.current;
    if (!state) return;

    if (CAMERA_PRESETS[command]) {
      state.cameraState = cloneCameraState(CAMERA_PRESETS[command]);
    } else if (command === "zoom-in") {
      state.cameraState.zoom = clamp(state.cameraState.zoom * 1.12, CAMERA_LIMITS.minZoom, CAMERA_LIMITS.maxZoom);
    } else if (command === "zoom-out") {
      state.cameraState.zoom = clamp(state.cameraState.zoom * 0.88, CAMERA_LIMITS.minZoom, CAMERA_LIMITS.maxZoom);
    } else if (command === "orbit-left") {
      state.cameraState.azimuth -= 0.16;
    } else if (command === "orbit-right") {
      state.cameraState.azimuth += 0.16;
    } else if (command === "pan-left") {
      panCamera(state, -0.55, 0);
    } else if (command === "pan-right") {
      panCamera(state, 0.55, 0);
    } else if (command === "pan-up") {
      panCamera(state, 0, -0.42);
    } else if (command === "pan-down") {
      panCamera(state, 0, 0.42);
    }

    updateCamera(state);
    renderFrame(state);
  }

  return (
    <main className="phase4b-shell" aria-label="Greenpoint Explorer Phase 4B runtime proof">
      <section className="phase4b-topline" aria-label="Runtime proof status">
        <div>
          <p className="phase4b-kicker">Batch 4C-4 / QA facade slice</p>
          <h1>Greenpoint Ave QA corridor</h1>
        </div>
        <p>
          Deterministic 3D proof from approved manifest and geometry fixture. QA facade slice is manual_draft / fictional_safe / not_verified. Non-factual QA rhythm only; hidden in normal mode.
        </p>
      </section>

      <section className={`phase4b-runtime${qaEnabled ? " phase4b-runtime-qa" : ""}`} aria-label="Interactive 3D graybox corridor runtime">
        <div
          ref={hostRef}
          className="phase4b-viewport"
          data-testid="phase4b-viewport"
          onContextMenu={(event) => event.preventDefault()}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
        />

        <div className="phase4b-ribbon">review-only graybox</div>
        <RuntimeLegend
          anchorStatus={runtimeScene.storefrontAnchors?.status ?? "unknown"}
        />
        <ReviewPanel
          totals={reviewTotals}
          inspectedObject={inspectedObject}
          inspectedCue={inspectedCue}
          storefrontAnchors={runtimeScene.storefrontAnchors}
        />

        {qaEnabled ? (
          <QADebugPanel
            inspectedObject={inspectedObject}
            inspectedCue={inspectedCue}
            inspectedSliceFacade={inspectedSliceFacade}
            facadeCueFixture={facadeCueFixture}
            qaFacadeSliceFixture={qaFacadeSliceFixture}
            storefrontAnchors={runtimeScene.storefrontAnchors}
          />
        ) : null}

        <div className="phase4b-controls" aria-label="Constrained camera controls">
          <button
            type="button"
            aria-pressed={qaEnabled}
            onClick={() => setQaEnabled((value) => !value)}
            aria-label="Toggle QA debug overlay"
          >
            QA
          </button>
          <button type="button" onClick={() => runCameraCommand("manhattanToFranklin")} aria-label="Camera preset Manhattan to Franklin">
            M to F
          </button>
          <button type="button" onClick={() => runCameraCommand("franklinToManhattan")} aria-label="Camera preset Franklin to Manhattan">
            F to M
          </button>
          <button type="button" onClick={() => runCameraCommand("overhead")} aria-label="Camera preset overhead">
            Overhead
          </button>
          <button type="button" onClick={() => runCameraCommand("streetOblique")} aria-label="Camera preset street-level oblique">
            Oblique
          </button>
          <button type="button" onClick={() => runCameraCommand("orbit-left")} aria-label="Rotate view left">
            Rotate -
          </button>
          <button type="button" onClick={() => runCameraCommand("orbit-right")} aria-label="Rotate view right">
            Rotate +
          </button>
          <button type="button" onClick={() => runCameraCommand("pan-left")} aria-label="Pan view left">
            Left
          </button>
          <button type="button" onClick={() => runCameraCommand("pan-right")} aria-label="Pan view right">
            Right
          </button>
          <button type="button" onClick={() => runCameraCommand("pan-up")} aria-label="Pan view up">
            Up
          </button>
          <button type="button" onClick={() => runCameraCommand("pan-down")} aria-label="Pan view down">
            Down
          </button>
          <button type="button" onClick={() => runCameraCommand("zoom-out")} aria-label="Zoom out">
            -
          </button>
          <button type="button" onClick={() => runCameraCommand("zoom-in")} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => runCameraCommand("home")} aria-label="Reset view home">
            Home
          </button>
        </div>

        <InspectorPanel
          runtimeScene={runtimeScene}
          inspectedObject={inspectedObject}
          hoveredId={hoveredId}
          selectedId={selectedId}
          onSelect={setSelectedId}
          reviewTotals={reviewTotals}
          inspectedCue={inspectedCue}
          inspectedSliceFacade={inspectedSliceFacade}
        />
      </section>
    </main>
  );
}

function RuntimeLegend({ anchorStatus }) {
  return (
    <aside className="phase4b-legend" aria-label="Runtime preview legend">
      <p>Legend</p>
      <ul>
        <li><span className="phase4b-swatch phase4b-swatch-building" /> Source-backed massing</li>
        <li><span className="phase4b-swatch phase4b-swatch-street" /> Street QA guide</li>
        <li><span className="phase4b-swatch phase4b-swatch-path" /> Walk path cue</li>
        <li><span className="phase4b-swatch phase4b-swatch-endpoint" /> Endpoint cue</li>
        <li><span className="phase4b-swatch phase4b-swatch-facade-cue" /> QA facade cue</li>
        <li><span className="phase4b-swatch phase4b-swatch-qa-facade-slice" /> QA draft facade slice</li>
        <li><span className="phase4b-swatch phase4b-swatch-centerline" /> Corridor line</li>
        <li><span className="phase4b-swatch phase4b-swatch-selected" /> Selected/hovered</li>
        <li><span className="phase4b-swatch phase4b-swatch-blocked" /> {anchorStatus}</li>
      </ul>
    </aside>
  );
}

function ReviewPanel({ totals, inspectedObject, inspectedCue, storefrontAnchors }) {
  return (
    <aside className="phase4b-review" aria-label="Graybox recognizability review panel">
      <p>Review counts</p>
      <dl>
        <div>
          <dt>Semantic objects</dt>
          <dd>{totals.semanticObjects}</dd>
        </div>
        <div>
          <dt>Primitive buildings</dt>
          <dd>{totals.primitiveBuildings}</dd>
        </div>
        <div>
          <dt>Source-backed</dt>
          <dd>{totals.sourceBackedBuildings}</dd>
        </div>
        <div>
          <dt>Left / Right</dt>
          <dd>{totals.leftBuildings} / {totals.rightBuildings}</dd>
        </div>
        <div>
          <dt>Geometry cues</dt>
          <dd>{totals.geometryFacadeCues}</dd>
        </div>
        <div>
          <dt>QA facade slice</dt>
          <dd>{totals.qaFacadeSliceBuildings}</dd>
        </div>
        <div>
          <dt>Selected side</dt>
          <dd>{inspectedObject?.corridorSide ?? "none"}</dd>
        </div>
        <div>
          <dt>Selected tiers</dt>
          <dd>{formatCueTiers(inspectedCue)}</dd>
        </div>
        <div>
          <dt>Anchor status</dt>
          <dd>{storefrontAnchors?.status ?? "unknown"}</dd>
        </div>
      </dl>
    </aside>
  );
}

function QADebugPanel({
  inspectedObject,
  inspectedCue,
  inspectedSliceFacade,
  facadeCueFixture,
  qaFacadeSliceFixture,
  storefrontAnchors,
}) {
  return (
    <aside className="phase4b-qa-panel" aria-label="QA debug overlay status">
      <p>QA overlay</p>
      <ul>
        <li><span className="phase4b-side-dot phase4b-side-qa-facade-slice" /> QA facade slice: {qaFacadeSliceFixture.facades.length}</li>
        <li><span className="phase4b-side-dot phase4b-side-qa-facade-slice" /> Slice labels: {qaFacadeSliceFixture.statusLabels.join(" / ")}</li>
        <li><span className="phase4b-side-dot phase4b-side-qa-facade-slice" /> Non-factual QA rhythm only</li>
        <li><span className="phase4b-side-dot phase4b-side-left" /> Left-side massing</li>
        <li><span className="phase4b-side-dot phase4b-side-right" /> Right-side massing</li>
        <li><span className="phase4b-side-dot phase4b-side-center" /> Corridor path + ticks</li>
        <li><span className="phase4b-side-dot phase4b-side-endpoint" /> Manhattan / Franklin cues</li>
        <li><span className="phase4b-side-dot phase4b-side-facade" /> Geometry-only facade cues: {facadeCueFixture.cues.length}</li>
        <li><span className="phase4b-side-dot phase4b-side-anchor" /> Existing anchors: {storefrontAnchors?.anchors?.length ?? 0}</li>
      </ul>
      <dl>
        <div>
          <dt>Hover/click ID</dt>
          <dd>{inspectedObject?.id ?? "none"}</dd>
        </div>
        <div>
          <dt>Source record</dt>
          <dd>{inspectedObject?.sourceRecordId ?? "none"}</dd>
        </div>
        <div>
          <dt>Cue status</dt>
          <dd>{inspectedCue?.claimStatus ?? "none"}</dd>
        </div>
        <div>
          <dt>Cue class</dt>
          <dd>{inspectedCue?.cueClass ?? "none"}</dd>
        </div>
        <div>
          <dt>Slice status</dt>
          <dd>{inspectedSliceFacade ? inspectedSliceFacade.statusLabels.join(" / ") : "none"}</dd>
        </div>
      </dl>
    </aside>
  );
}

function InspectorPanel({
  runtimeScene,
  inspectedObject,
  hoveredId,
  selectedId,
  onSelect,
  reviewTotals,
  inspectedCue,
  inspectedSliceFacade,
}) {
  const inspectorRef = useRef(null);
  const object = inspectedObject ?? runtimeScene.objects[0];
  const anchorStatus = runtimeScene.storefrontAnchors?.status ?? "unknown";
  const isSelected = object?.id === selectedId;
  const isHovered = object?.id === hoveredId;
  const dimensions = formatDimensions(object);

  useEffect(() => {
    if (selectedId) inspectorRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);

  return (
    <aside ref={inspectorRef} className="phase4b-inspector" aria-live="polite" aria-label="Semantic QA and provenance panel">
      <div className="phase4b-inspector-heading">
        <p>Semantic inspection</p>
        <strong>{isSelected ? "Selected" : isHovered ? "Hovered" : "Default"}</strong>
      </div>

      <section className={`phase4b-selected-summary${isSelected ? " phase4b-selected-summary-active" : ""}`}>
        <p>{isSelected ? "Selected object" : isHovered ? "Hovered object" : "Default object"}</p>
        <strong>{object?.id ?? "none"}</strong>
        <dl>
          <div>
            <dt>Source</dt>
            <dd>{object?.sourceRecordId ?? "none"}</dd>
          </div>
          <div>
            <dt>Side</dt>
            <dd>{object?.corridorSide ?? "unknown"}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{object?.semanticRole ?? "none"}</dd>
          </div>
          <div>
            <dt>Dims</dt>
            <dd>{dimensions}</dd>
          </div>
        </dl>
      </section>

      <dl>
        <div>
          <dt>Semantic ID</dt>
          <dd>{object?.id ?? "none"}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{object?.semanticType ?? "none"}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{object?.semanticRole ?? "none"}</dd>
        </div>
        <div>
          <dt>Source record</dt>
          <dd>{object?.sourceRecordId ?? "none"}</dd>
        </div>
        <div>
          <dt>Geometry ref</dt>
          <dd>{object?.geometryReferenceId ?? "none"}</dd>
        </div>
        <div>
          <dt>Coverage</dt>
          <dd>{object?.contextCoverageStatus ?? runtimeScene.coverage?.status ?? "unknown"}</dd>
        </div>
        <div>
          <dt>Corridor side</dt>
          <dd>{object?.corridorSide ?? "unknown"}</dd>
        </div>
        <div>
          <dt>Approx dims</dt>
          <dd>{dimensions}</dd>
        </div>
        <div>
          <dt>Review totals</dt>
          <dd>{reviewTotals.primitiveBuildings} buildings / {reviewTotals.geometryFacadeCues} cues / {reviewTotals.qaFacadeSliceBuildings} draft facades</dd>
        </div>
        <div>
          <dt>Storefront anchors</dt>
          <dd>{anchorStatus}</dd>
        </div>
      </dl>

      <section>
        <h2>Geometry-Only Facade Cue</h2>
        <ul>
          <li>
            <span>Class</span>
            <small>{inspectedCue?.cueClass ?? "none"}</small>
          </li>
          <li>
            <span>Use</span>
            <small>{inspectedCue?.allowedUse ?? "none"}</small>
          </li>
          <li>
            <span>Width / Height / Depth</span>
            <small>{formatCueTiers(inspectedCue)}</small>
          </li>
          <li>
            <span>Role</span>
            <small>{inspectedCue?.geometryDerived?.cornerOrEndpointRole ?? "none"}</small>
          </li>
        </ul>
      </section>

      <section>
        <h2>QA Facade Slice</h2>
        <ul>
          <li>
            <span>Status</span>
            <small>{inspectedSliceFacade ? inspectedSliceFacade.statusLabels.join(" / ") : "not in slice"}</small>
          </li>
          <li>
            <span>Modules</span>
            <small>{formatSliceModules(inspectedSliceFacade)}</small>
          </li>
          <li>
            <span>Use</span>
            <small>{inspectedSliceFacade?.allowedUse ?? "none"}</small>
          </li>
          <li>
            <span>Truth gate</span>
            <small>non-factual QA rhythm only</small>
          </li>
        </ul>
      </section>

      <section>
        <h2>Allowed Claims</h2>
        <ul>
          {(object?.allowedClaims ?? []).map((claim) => (
            <li key={`${object.id}-${claim.claimClass}`}>
              <span>{claim.claimClass}</span>
              <small>{claim.status}</small>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Blocked Claims</h2>
        <ul>
          {(object?.blockedClaimClasses ?? []).slice(0, 8).map((claimClass) => (
            <li key={`${object.id}-${claimClass}`}>
              <span>{claimClass}</span>
              <small>blocked</small>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Provenance</h2>
        <p>{object?.provenance?.sourceLabel ?? "No selected source."}</p>
        <p>{object?.provenance?.usageStatus ?? runtimeScene.corridor?.claimLimit}</p>
      </section>

      <div className="phase4b-object-list" aria-label="Semantic object list">
        {runtimeScene.objects.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selectedId === item.id}
            onClick={() => onSelect(item.id)}
          >
            <span>{compactObjectLabel(item)}</span>
            <small>{item.kind}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}

function buildReviewTotals(runtimeScene, cueFixture, qaFacadeSliceFixture) {
  return {
    semanticObjects: runtimeScene.objects.length,
    primitiveBuildings: runtimeScene.buildings.length,
    geometryFacadeCues: cueFixture.cues.length,
    qaFacadeSliceBuildings: qaFacadeSliceFixture.facades.length,
    sourceBackedBuildings: runtimeScene.coverage?.sourceBackedBuildingCount ?? runtimeScene.buildings.length,
    leftBuildings: runtimeScene.coverage?.corridorSideCounts?.left
      ?? runtimeScene.buildings.filter((object) => object.corridorSide === "left").length,
    rightBuildings: runtimeScene.coverage?.corridorSideCounts?.right
      ?? runtimeScene.buildings.filter((object) => object.corridorSide === "right").length,
  };
}

function buildFacadeCueIndex(cueFixture) {
  return new Map(cueFixture.cues.map((cue) => [cue.targetSemanticId, cue]));
}

function buildQAFacadeSliceIndex(fixture) {
  return new Map(fixture.facades.map((facade) => [facade.targetSemanticId, facade]));
}

function formatCueTiers(cue) {
  if (!cue?.geometryDerived) return "none";
  const { widthTier, heightTier, depthTier } = cue.geometryDerived;
  return `${widthTier} / ${heightTier} / ${depthTier}`;
}

function formatSliceModules(facade) {
  if (!facade?.modules) return "none";
  const modules = facade.modules;
  const awnings = modules.awningSegments ? `${modules.awningSegments} awning-like` : "no awning-like";
  return `${modules.bayCount} bays / ${modules.upperRows} rows / ${awnings}`;
}

function formatDimensions(object) {
  if (!object?.dimensions) return "not applicable";
  const { width, depth, height } = object.dimensions;
  return `${formatMeasure(width)}w / ${formatMeasure(depth)}d / ${formatMeasure(height)}h scene units`;
}

function formatMeasure(value) {
  if (!Number.isFinite(value)) return "0.00";
  return value.toFixed(2);
}

function addLights(scene) {
  scene.add(new THREE.HemisphereLight(0xf6ead2, 0x1d2b2b, 2.4));
  const key = new THREE.DirectionalLight(0xfff1d1, 2.6);
  key.position.set(-5, 9, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9fc1bd, 1.1);
  fill.position.set(6, 6, -7);
  scene.add(fill);
}

function addGround(scene, runtimeScene) {
  addGuideGeometry(scene, runtimeScene);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 12),
    new THREE.MeshBasicMaterial({ color: 0x182020 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.06;
  scene.add(ground);

  const axis = new THREE.GridHelper(28, 28, 0x42504d, 0x26312f);
  axis.position.y = -0.04;
  axis.material.transparent = true;
  axis.material.opacity = 0.13;
  scene.add(axis);
}

function addGuideGeometry(scene, runtimeScene) {
  const guide = runtimeScene.guide;
  if (!guide) return;

  const street = createFlatPolygonMesh(guide.streetPolygon, {
    color: 0x263633,
    opacity: 0.48,
    y: -0.025,
  });
  street.userData.qaGuide = true;
  scene.add(street);

  const path = createFlatPolygonMesh(guide.pathBand, {
    color: 0xdbe4d5,
    opacity: 0.42,
    y: 0.005,
  });
  path.userData.qaGuide = true;
  scene.add(path);

  for (const band of guide.sidewalkBands) {
    const sidewalk = createFlatPolygonMesh(band, {
      color: 0x33382f,
      opacity: 0.28,
      y: -0.018,
    });
    sidewalk.userData.qaGuide = true;
    scene.add(sidewalk);
  }

  for (const endpointBand of guide.endpointBands) {
    const endpointLine = createPolyline(endpointBand, {
      color: 0xf0c96a,
      opacity: 0.82,
      y: 0.08,
    });
    endpointLine.userData.qaGuide = true;
    scene.add(endpointLine);
  }

  for (const tick of guide.rhythmTicks) {
    const rhythm = createPolyline(tick, {
      color: 0xe6dcc8,
      opacity: 0.28,
      y: 0.055,
    });
    rhythm.userData.qaGuide = true;
    scene.add(rhythm);
  }

  for (const curb of guide.curbLines) {
    const line = createPolyline(curb, {
      color: 0xd0b36b,
      opacity: 0.52,
      y: 0.07,
    });
    line.userData.qaGuide = true;
    scene.add(line);
  }

  const labelOffset = Math.max(...guide.sidewalkBands.flatMap((band) => band.map((point) => Math.abs(point.z)))) + 0.35;
  for (const endpoint of guide.endpointMarkers) {
    const point = endpoint.point;
    const labelZ = point.z + (point.x < 0 ? -labelOffset : labelOffset);
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.12, 18),
      new THREE.MeshBasicMaterial({ color: 0xf0c96a, transparent: true, opacity: 0.9 }),
    );
    marker.position.set(point.x, 0.04, point.z);
    marker.userData.qaGuide = true;

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 1.05, 8),
      new THREE.MeshBasicMaterial({ color: 0xf0c96a, transparent: true, opacity: 0.74 }),
    );
    post.position.set(point.x, 0.56, point.z);
    post.userData.qaGuide = true;

    const label = createTextSprite(endpoint.label);
    label.position.set(point.x, 1.28, labelZ);
    label.userData.qaGuide = true;

    const tether = createPolyline([
      { x: point.x, z: point.z },
      { x: point.x, z: labelZ },
    ], {
      color: 0xf0c96a,
      opacity: 0.54,
      y: 0.1,
    });
    tether.userData.qaGuide = true;

    const group = new THREE.Group();
    group.add(marker, post, label, tether);
    group.userData.qaGuide = true;
    scene.add(group);
  }
}

function addRuntimeObjects(
  scene,
  runtimeScene,
  facadeCueIndex,
  qaFacadeSliceIndex,
  pickTargets,
  visualObjects,
  pickObjects,
) {
  for (const object of runtimeScene.lines) {
    const visual = createLineTube(object, {
      color: object.semanticType === "corridor-street-centerline" ? 0xb2c9c1 : 0xc7a767,
      opacity: object.semanticType === "corridor-street-centerline" ? 0.28 : 0.2,
      radius: object.semanticType === "corridor-street-centerline" ? 0.022 : 0.014,
    });
    const pick = createLinePickTarget(object);
    scene.add(visual, pick);
    pickTargets.push(pick);
    visualObjects.set(object.id, visual);
    pickObjects.set(object.id, pick);
  }

  for (const object of runtimeScene.buildings) {
    const facadeCue = facadeCueIndex.get(object.id);
    const qaFacadeSlice = qaFacadeSliceIndex.get(object.id);
    const palette = getBuildingPalette(object);
    const qaPalette = getQASidePalette(object);
    const base = createFlatPolygonMesh(object.points, {
      color: palette.base,
      opacity: 0.52,
      y: 0.018,
    });
    base.userData.semanticId = object.id;
    base.userData.baseColor = palette.base;
    base.userData.qaColor = qaPalette.base;
    base.userData.corridorSide = object.corridorSide;
    base.userData.stateRole = "base";

    const visual = new THREE.Mesh(
      createPrismGeometry(object.points, object.height),
      new THREE.MeshStandardMaterial({
        color: palette.massing,
        roughness: 0.82,
        metalness: 0.02,
        transparent: true,
        opacity: 0.94,
      }),
    );
    visual.userData.semanticId = object.id;
    visual.userData.baseColor = palette.massing;
    visual.userData.qaColor = qaPalette.massing;
    visual.userData.corridorSide = object.corridorSide;
    visual.userData.stateRole = "massing";

    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(visual.geometry),
      new THREE.LineBasicMaterial({ color: palette.outline, transparent: true, opacity: 0.58 }),
    );
    outline.userData.semanticId = object.id;
    outline.userData.baseColor = palette.outline;
    outline.userData.qaColor = qaPalette.outline;
    outline.userData.corridorSide = object.corridorSide;
    outline.userData.stateRole = "outline";

    const footprint = createPolyline(removeClosingPoint(object.points), {
      color: palette.footprint,
      opacity: 0.5,
      y: 0.055,
      closed: true,
    });
    footprint.userData.semanticId = object.id;
    footprint.userData.baseColor = palette.footprint;
    footprint.userData.qaColor = qaPalette.footprint;
    footprint.userData.corridorSide = object.corridorSide;
    footprint.userData.stateRole = "footprint";

    const marker = new THREE.Mesh(
      new THREE.RingGeometry(0.28, 0.4, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf0c96a,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    marker.rotation.x = -Math.PI / 2;
    marker.position.set(object.centroid.x, 0.075, object.centroid.z);
    marker.visible = false;
    marker.userData.semanticId = object.id;
    marker.userData.stateRole = "marker";

    const anchorMarker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.04, 6),
      new THREE.MeshBasicMaterial({
        color: 0x8d7245,
        transparent: true,
        opacity: 0.42,
      }),
    );
    anchorMarker.position.set(object.centroid.x, object.height + 0.06, object.centroid.z);
    anchorMarker.userData.semanticId = object.id;
    anchorMarker.userData.baseColor = 0x8d7245;
    anchorMarker.userData.qaColor = qaPalette.anchor;
    anchorMarker.userData.corridorSide = object.corridorSide;
    anchorMarker.userData.stateRole = "anchor";

    const group = new THREE.Group();
    group.add(base, visual, outline, footprint, marker, anchorMarker);
    if (facadeCue) group.add(createFacadeCueMarker(object, facadeCue));
    if (facadeCue && qaFacadeSlice) group.add(createQAFacadeSliceLayer(object, facadeCue, qaFacadeSlice));

    const pick = new THREE.Mesh(
      createPrismGeometry(object.points, object.height + 0.35),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    pick.userData.semanticId = object.id;
    pick.userData.pickTarget = true;

    scene.add(group, pick);
    pickTargets.push(pick);
    visualObjects.set(object.id, group);
    pickObjects.set(object.id, pick);
  }
}

function createFacadeCueMarker(object, cue) {
  const plane = cue.geometryDerived.streetFacingPlane;
  const length = Math.max(plane.xMax - plane.xMin, 0.12);
  const centerX = plane.xMin + length / 2;
  const height = Math.max(object.height, 0.18);
  const color = getFacadeCueColor(cue);

  const planeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(length, height, 0.035),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  planeMesh.position.set(centerX, height / 2, plane.z);
  planeMesh.userData.semanticId = object.id;
  planeMesh.userData.stateRole = "facadeCue";
  planeMesh.userData.qaOpacity = 0.22;
  planeMesh.userData.qaColor = color;
  planeMesh.visible = false;

  const topRail = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.055, 0.065),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  topRail.position.set(centerX, height + 0.08, plane.z);
  topRail.userData.semanticId = object.id;
  topRail.userData.stateRole = "facadeCue";
  topRail.userData.qaOpacity = 0.78;
  topRail.userData.qaColor = color;
  topRail.visible = false;

  const group = new THREE.Group();
  group.add(planeMesh, topRail);
  group.userData.semanticId = object.id;
  group.userData.stateRole = "facadeCue";
  return group;
}

function createQAFacadeSliceLayer(object, cue, facadeRecord) {
  const plane = cue.geometryDerived.streetFacingPlane;
  const modules = facadeRecord.modules;
  const length = Math.max(plane.xMax - plane.xMin, 0.2);
  const centerX = plane.xMin + length / 2;
  const height = Math.max(object.height, 0.55);
  const sideOffset = object.corridorSide === "left" ? 0.072 : -0.072;
  const z = plane.z + sideOffset;
  const depth = 0.045;
  const group = new THREE.Group();

  addQAFacadeBox(group, {
    color: 0x253c3a,
    opacity: 0.32,
    position: [centerX, height / 2, z],
    size: [length, height, depth],
  });

  const splitY = clamp(height * modules.lowerSplitRatio, 0.18, height - 0.12);
  addQAFacadeBox(group, {
    color: 0xf2d08a,
    opacity: 0.74,
    position: [centerX, splitY, z + sideOffset * 0.12],
    size: [length * 0.94, 0.045, depth * 1.4],
  });

  const signY = clamp(height * modules.signBandRatio, 0.16, Math.max(splitY - 0.05, 0.18));
  addQAFacadeBox(group, {
    color: 0xd79b62,
    opacity: 0.6,
    position: [centerX, signY, z + sideOffset * 0.18],
    size: [length * 0.86, 0.11, depth * 1.6],
  });

  addBayDivisions(group, { length, plane, height, splitY, z, sideOffset, bayCount: modules.bayCount });
  addUpperWindowPlaceholders(group, {
    length,
    plane,
    height,
    splitY,
    z,
    sideOffset,
    bayCount: modules.bayCount,
    upperRows: modules.upperRows,
  });
  addAwningPlaceholders(group, {
    length,
    plane,
    signY,
    z,
    sideOffset,
    awningSegments: modules.awningSegments,
  });
  addParapetTiers(group, {
    length,
    centerX,
    height,
    z,
    sideOffset,
    parapetTiers: modules.parapetTiers,
  });
  addEndpointEmphasis(group, {
    plane,
    height,
    z,
    sideOffset,
    endpointEmphasis: modules.endpointEmphasis,
  });

  group.userData.semanticId = object.id;
  group.userData.stateRole = "qaFacadeSlice";
  group.visible = false;
  return group;
}

function addBayDivisions(group, { length, plane, height, splitY, z, sideOffset, bayCount }) {
  const usableHeight = Math.max(splitY - 0.08, 0.18);
  for (let index = 1; index < bayCount; index += 1) {
    const x = plane.xMin + (length / bayCount) * index;
    addQAFacadeBox(group, {
      color: 0x9be1d8,
      opacity: 0.68,
      position: [x, usableHeight / 2, z + sideOffset * 0.24],
      size: [0.035, usableHeight, 0.055],
    });
  }

  addQAFacadeBox(group, {
    color: 0x9be1d8,
    opacity: 0.48,
    position: [plane.xMin, height / 2, z + sideOffset * 0.24],
    size: [0.035, height * 0.92, 0.055],
  });
  addQAFacadeBox(group, {
    color: 0x9be1d8,
    opacity: 0.48,
    position: [plane.xMax, height / 2, z + sideOffset * 0.24],
    size: [0.035, height * 0.92, 0.055],
  });
}

function addUpperWindowPlaceholders(group, { length, plane, height, splitY, z, sideOffset, bayCount, upperRows }) {
  if (!upperRows) return;
  const upperHeight = Math.max(height - splitY - 0.16, 0.16);
  const rowGap = upperHeight / (upperRows + 1);
  const bayWidth = length / bayCount;
  const windowWidth = Math.max(Math.min(bayWidth * 0.46, 0.14), 0.045);

  for (let row = 0; row < upperRows; row += 1) {
    const y = splitY + rowGap * (row + 1);
    for (let bay = 0; bay < bayCount; bay += 1) {
      const x = plane.xMin + bayWidth * bay + bayWidth / 2;
      addQAFacadeBox(group, {
        color: 0xd9efe6,
        opacity: 0.58,
        position: [x, y, z + sideOffset * 0.3],
        size: [windowWidth, 0.095, 0.052],
      });
    }
  }
}

function addAwningPlaceholders(group, { length, plane, signY, z, sideOffset, awningSegments }) {
  if (!awningSegments) return;
  const segmentWidth = length / awningSegments;
  const awningWidth = Math.max(segmentWidth * 0.72, 0.09);
  const y = Math.max(signY - 0.12, 0.1);

  for (let index = 0; index < awningSegments; index += 1) {
    const x = plane.xMin + segmentWidth * index + segmentWidth / 2;
    addQAFacadeBox(group, {
      color: 0xe8795f,
      opacity: 0.66,
      position: [x, y, z + sideOffset * 0.44],
      size: [awningWidth, 0.07, 0.09],
    });
  }
}

function addParapetTiers(group, { length, centerX, height, z, sideOffset, parapetTiers }) {
  for (let index = 0; index < parapetTiers; index += 1) {
    addQAFacadeBox(group, {
      color: 0xffdf7f,
      opacity: 0.7 - index * 0.12,
      position: [centerX, height + 0.04 + index * 0.075, z + sideOffset * 0.2],
      size: [length * (0.98 - index * 0.12), 0.045, 0.07],
    });
  }
}

function addEndpointEmphasis(group, { plane, height, z, sideOffset, endpointEmphasis }) {
  if (endpointEmphasis === "none") return;
  const x = endpointEmphasis === "left-edge" ? plane.xMin : plane.xMax;
  addQAFacadeBox(group, {
    color: 0xf0c96a,
    opacity: 0.84,
    position: [x, height / 2, z + sideOffset * 0.5],
    size: [0.08, height + 0.16, 0.095],
  });
}

function addQAFacadeBox(group, { color, opacity, position, size }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  mesh.position.set(...position);
  mesh.userData.stateRole = "qaFacadeSlice";
  mesh.userData.qaOpacity = opacity;
  mesh.userData.qaColor = color;
  mesh.visible = false;
  group.add(mesh);
}

function createPrismGeometry(points, height) {
  const clean = removeClosingPoint(points);
  const vertices = [];
  for (const point of clean) vertices.push(point.x, 0, point.z);
  for (const point of clean) vertices.push(point.x, height, point.z);

  const shapePoints = clean.map((point) => new THREE.Vector2(point.x, point.z));
  const topTriangles = THREE.ShapeUtils.triangulateShape(shapePoints, []);
  const indices = [];
  for (const triangle of topTriangles) {
    indices.push(triangle[2], triangle[1], triangle[0]);
    indices.push(triangle[0] + clean.length, triangle[1] + clean.length, triangle[2] + clean.length);
  }

  for (let index = 0; index < clean.length; index += 1) {
    const next = (index + 1) % clean.length;
    indices.push(index, next, next + clean.length);
    indices.push(index, next + clean.length, index + clean.length);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createLineTube(object, { color, opacity, radius }) {
  const curve = new THREE.CatmullRomCurve3(object.points.map((point) => new THREE.Vector3(point.x, 0.08, point.z)));
  const geometry = new THREE.TubeGeometry(curve, 16, radius, 8, false);
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.semanticId = object.id;
  mesh.userData.semanticType = object.semanticType;
  mesh.userData.baseColor = color;
  mesh.userData.qaColor = object.semanticType === "corridor-street-centerline" ? 0xe5fff6 : color;
  mesh.userData.baseOpacity = opacity;
  mesh.userData.stateRole = "line";
  return mesh;
}

function createLinePickTarget(object) {
  const start = object.points[0];
  const end = object.points[object.points.length - 1];
  const startVector = new THREE.Vector3(start.x, 0.18, start.z);
  const endVector = new THREE.Vector3(end.x, 0.18, end.z);
  const direction = new THREE.Vector3().subVectors(endVector, startVector);
  const length = Math.max(direction.length(), 0.1);
  const geometry = new THREE.CylinderGeometry(0.32, 0.32, length, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  const midpointOffset = direction.clone().multiplyScalar(0.5);
  mesh.position.copy(startVector).add(midpointOffset);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  mesh.userData.semanticId = object.id;
  mesh.userData.pickTarget = true;
  return mesh;
}

function getHitFromEvent(state, event) {
  const rect = state.renderer.domElement.getBoundingClientRect();
  state.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  state.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  state.raycaster.setFromCamera(state.pointer, state.camera);
  return state.raycaster.intersectObjects(state.pickTargets, false)[0]?.object ?? null;
}

function updateObjectStates(state, hoveredId, selectedId, qaEnabled) {
  for (const [id, visual] of state.visualObjects) {
    const isSelected = id === selectedId;
    const isHovered = id === hoveredId;
    visual.traverse((child) => {
      if (!child.material || child.userData.pickTarget) return;
      if (child.material.color) {
        const qaColor = child.userData.qaColor ?? child.userData.baseColor;
        child.material.color.set(isSelected ? 0xf0c96a : isHovered ? 0xb9cec7 : qaEnabled ? qaColor : child.userData.baseColor ?? 0x88908d);
      }
      if (child.material.opacity !== undefined) {
        if (child.userData.stateRole === "outline" || child.userData.stateRole === "footprint") {
          child.material.opacity = isSelected ? 0.95 : isHovered ? 0.78 : qaEnabled ? 0.72 : 0.5;
        } else if (child.userData.stateRole === "base") {
          child.material.opacity = isSelected ? 0.72 : isHovered ? 0.58 : qaEnabled ? 0.54 : 0.4;
        } else if (child.userData.stateRole === "massing") {
          child.material.opacity = isSelected ? 1 : isHovered ? 0.97 : 0.94;
        } else if (child.userData.stateRole === "anchor") {
          child.material.opacity = isSelected ? 0.9 : isHovered ? 0.72 : qaEnabled ? 0.62 : 0.42;
        } else if (child.userData.stateRole === "line") {
          const isCenterline = child.userData.semanticType === "corridor-street-centerline";
          child.material.opacity = isSelected || isHovered
            ? 0.72
            : qaEnabled && isCenterline
              ? 0.82
              : qaEnabled
                ? 0.36
                : child.userData.baseOpacity ?? 0.35;
        } else if (child.userData.stateRole === "facadeCue") {
          child.visible = qaEnabled;
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min(child.userData.qaOpacity + 0.18, 0.95)
              : isHovered
                ? Math.min(child.userData.qaOpacity + 0.1, 0.9)
                : child.userData.qaOpacity
            : 0;
        } else if (child.userData.stateRole === "qaFacadeSlice") {
          child.visible = qaEnabled;
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min(child.userData.qaOpacity + 0.2, 0.96)
              : isHovered
                ? Math.min(child.userData.qaOpacity + 0.12, 0.92)
                : child.userData.qaOpacity
            : 0;
        }
      }
      if (child.userData.stateRole === "facadeCue" && !child.material) {
        child.visible = qaEnabled;
      }
      if (child.userData.stateRole === "qaFacadeSlice" && !child.material) {
        child.visible = qaEnabled;
      }
      if (child.userData.stateRole === "marker") {
        child.visible = isSelected || isHovered;
        child.material.opacity = isSelected ? 0.88 : isHovered ? 0.5 : 0;
      }
    });
  }
}

function getBuildingPalette(object) {
  if (object.contextCoverageStatus === "source-backed" || object.contextCoverageStatus === "source-backed-minimal-fixture-record") {
    return {
      base: 0x879083,
      massing: 0xb8baaa,
      outline: 0xe6dcc8,
      footprint: 0xf1dfb9,
    };
  }

  return {
    base: 0x55504a,
    massing: 0x756f66,
    outline: 0xb5aa94,
    footprint: 0xb5aa94,
  };
}

function getQASidePalette(object) {
  if (object.corridorSide === "left") {
    return {
      base: 0x2d5f5c,
      massing: 0x6fb8af,
      outline: 0xb8ece5,
      footprint: 0xd4fff8,
      anchor: 0x9fe1dc,
    };
  }

  if (object.corridorSide === "right") {
    return {
      base: 0x6c5130,
      massing: 0xd0a05b,
      outline: 0xf1d3a2,
      footprint: 0xffe7b6,
      anchor: 0xe4bd75,
    };
  }

  return {
    base: 0x575a62,
    massing: 0x8b8e96,
    outline: 0xd5d6dc,
    footprint: 0xd5d6dc,
    anchor: 0xb8bac2,
  };
}

function getFacadeCueColor(cue) {
  const heightTier = cue.geometryDerived?.heightTier;
  if (heightTier === "tall") return 0xffdf7f;
  if (heightTier === "mid") return 0x91d5cb;
  return 0xc8d9a1;
}

function createFlatPolygonMesh(points, { color, opacity, y }) {
  const clean = removeClosingPoint(points);
  const vertices = [];
  for (const point of clean) vertices.push(point.x, y, point.z);
  const shapePoints = clean.map((point) => new THREE.Vector2(point.x, point.z));
  const triangles = THREE.ShapeUtils.triangulateShape(shapePoints, []);
  const indices = triangles.flatMap((triangle) => [triangle[0], triangle[1], triangle[2]]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
}

function createPolyline(points, { color, opacity, y, closed = false }) {
  const linePoints = closed ? [...points, points[0]] : points;
  const vertices = linePoints.flatMap((point) => [point.x, y, point.z]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geometry, material);
}

function createTextSprite(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(16, 20, 20, 0.84)";
  context.strokeStyle = "rgba(240, 201, 106, 0.88)";
  context.lineWidth = 4;
  context.roundRect(8, 12, 368, 72, 10);
  context.fill();
  context.stroke();
  context.fillStyle = "rgba(255, 240, 210, 0.96)";
  context.font = "700 34px Inter, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 192, 49);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    }),
  );
  sprite.scale.set(2.35, 0.58, 1);
  return sprite;
}

function updateCamera(state) {
  const { camera, cameraState } = state;
  const sinPolar = Math.sin(cameraState.polar);
  camera.position.set(
    cameraState.target.x + cameraState.distance * sinPolar * Math.cos(cameraState.azimuth),
    cameraState.target.y + cameraState.distance * Math.cos(cameraState.polar),
    cameraState.target.z + cameraState.distance * sinPolar * Math.sin(cameraState.azimuth),
  );
  camera.zoom = cameraState.zoom;
  camera.lookAt(cameraState.target);
  camera.updateProjectionMatrix();
}

function panCamera(state, dx, dz, startTarget = state.cameraState.target) {
  const right = new THREE.Vector3();
  state.camera.getWorldDirection(right);
  right.cross(state.camera.up).normalize();
  const forward = new THREE.Vector3(right.z, 0, -right.x).normalize();
  state.cameraState.target.copy(startTarget)
    .addScaledVector(right, dx)
    .addScaledVector(forward, dz);
  state.cameraState.target.x = clamp(state.cameraState.target.x, -CAMERA_LIMITS.panLimit, CAMERA_LIMITS.panLimit);
  state.cameraState.target.z = clamp(state.cameraState.target.z, -CAMERA_LIMITS.panLimit, CAMERA_LIMITS.panLimit);
}

function renderFrame(state) {
  if (!state) return;
  state.renderer.render(state.scene, state.camera);
}

function disposeScene(scene) {
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    if (Array.isArray(object.material)) {
      for (const material of object.material) {
        material.map?.dispose?.();
        material.dispose?.();
      }
    } else {
      object.material?.map?.dispose?.();
      object.material?.dispose?.();
    }
  });
}

function cloneCameraState(value) {
  return {
    azimuth: value.azimuth,
    polar: value.polar,
    distance: value.distance,
    zoom: value.zoom,
    target: value.target.clone(),
  };
}

function removeClosingPoint(points) {
  if (points.length < 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  if (first.x === last.x && first.z === last.z) return points.slice(0, -1);
  return points;
}

function compactObjectLabel(object) {
  if (object.semanticType === "primitive-building-massing") return object.geometryReferenceId.replace("nyc-footprint-", "");
  if (object.semanticType === "corridor-street-centerline") return "corridor centerline";
  return "context line";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
