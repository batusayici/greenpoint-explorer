import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import manifest from "./data/generated-scene-manifests/greenpoint-ave-manhattan-to-franklin.phase-4b-semantic-scene-manifest.v0.1.json";
import facadeCueFixture from "./data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4c-geometry-only-facade-cues.v0.1.json";
import qaFacadeSliceFixture from "./data/facade-cues/greenpoint-ave-franklin-end.phase-4c-qa-facade-slice.v0.1.json";
import evidenceFacadeCueFixture from "./data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json";
import corridorFacadeCueFixture from "./data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json";
import qaScaffoldPreviewSeedAdapter from "./data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-14-qa-preview-scaffold-adapter.v0.1.json";
import qaScaffoldPreviewExpansionFixture from "./data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.v0.1.json";
import qaFrontageCandidateFixture from "./data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4j-1-qa-frontage-candidates.v0.1.json";
import qaRecognizableAnchorCueFixture from "./data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json";
import localEvidenceCueEnrichmentFixture from "./data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1.json";
import geometryValidationReport from "./data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json";
import candidatePoiFixture from "./data/candidate-pois/greenpoint-ave-manhattan-to-franklin.phase-4d-candidate-pois.v0.1.json";
import cornerAnchorCandidateFixture from "./data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json";
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
  streetReview: {
    azimuth: -1.18,
    polar: 1.08,
    distance: 15.2,
    zoom: 1.02,
    target: new THREE.Vector3(-1.35, 0.78, 0.08),
  },
  manhattanFacadeReview: {
    azimuth: -1.08,
    polar: 0.98,
    distance: 9.8,
    zoom: 2.72,
    target: new THREE.Vector3(3.9, 0.78, 0.42),
  },
  franklinFacadeReview: {
    azimuth: -1.08,
    polar: 0.98,
    distance: 9.2,
    zoom: 3.0,
    target: new THREE.Vector3(-6.55, 0.78, 0.44),
  },
};

const CAMERA_LIMITS = {
  minPolar: 0.32,
  maxPolar: 1.28,
  minDistance: 9,
  maxDistance: 24,
  minZoom: 0.68,
  maxZoom: 3.1,
  panLimit: 9,
};

export default function Phase4BRuntimePreview() {
  const runtimeScene = useMemo(() => buildPhase4BRuntimeScene(manifest, geometryFixture), []);
  const facadeCueIndex = useMemo(() => buildFacadeCueIndex(facadeCueFixture), []);
  const qaFacadeSliceIndex = useMemo(() => buildQAFacadeSliceIndex(qaFacadeSliceFixture), []);
  const evidenceFacadeCueIndex = useMemo(() => buildEvidenceFacadeCueIndex(evidenceFacadeCueFixture), []);
  const corridorFacadeCueIndex = useMemo(() => buildCorridorFacadeCueIndex(corridorFacadeCueFixture), []);
  const qaScaffoldPreviewRecords = useMemo(() => (
    buildQAScaffoldPreviewRenderRecords(qaScaffoldPreviewExpansionFixture, qaScaffoldPreviewSeedAdapter)
  ), []);
  const qaFrontageCandidateRecords = useMemo(() => (
    buildQAFrontageCandidateRenderRecords(qaFrontageCandidateFixture, qaScaffoldPreviewExpansionFixture)
  ), []);
  const qaRecognizableAnchorCueRecords = useMemo(() => (
    buildQARecognizableAnchorCueRenderRecords(qaRecognizableAnchorCueFixture, qaScaffoldPreviewExpansionFixture, qaFrontageCandidateFixture)
  ), []);
  const localEvidenceCueRecords = useMemo(() => buildLocalEvidenceCueRenderRecords(localEvidenceCueEnrichmentFixture), []);
  const geometryValidationIndex = useMemo(() => buildGeometryValidationIndex(geometryValidationReport), []);
  const candidatePoiIndex = useMemo(() => buildCandidatePoiIndex(candidatePoiFixture), []);
  const cornerAnchorCandidateIndex = useMemo(() => buildCornerAnchorCandidateIndex(cornerAnchorCandidateFixture), []);
  const hostRef = useRef(null);
  const stateRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [qaEnabled, setQaEnabled] = useState(false);
  const [qaScaffoldFamilyVisibility, setQAScaffoldFamilyVisibility] = useState(() => ({
    ...qaScaffoldPreviewExpansionFixture.familyVisibilityDefaults,
  }));
  const [qaFrontageCandidateTypeVisibility, setQAFrontageCandidateTypeVisibility] = useState(() => (
    Object.fromEntries(qaFrontageCandidateFixture.candidateTypeAllowlist.map((type) => [type, true]))
  ));
  const [qaRecognizableCueCategoryVisibility, setQARecognizableCueCategoryVisibility] = useState(() => (
    Object.fromEntries(qaRecognizableAnchorCueFixture.cueCategoryAllowlist.map((category) => [category, true]))
  ));
  const visibleQAScaffoldPreviewRecords = useMemo(() => (
    filterQAScaffoldPreviewRecords(qaScaffoldPreviewRecords, qaScaffoldFamilyVisibility)
  ), [qaScaffoldPreviewRecords, qaScaffoldFamilyVisibility]);
  const visibleQAFrontageCandidateRecords = useMemo(() => (
    filterQAFrontageCandidateRecords(qaFrontageCandidateRecords, qaFrontageCandidateTypeVisibility)
  ), [qaFrontageCandidateRecords, qaFrontageCandidateTypeVisibility]);
  const visibleQARecognizableAnchorCueRecords = useMemo(() => (
    filterQARecognizableAnchorCueRecords(qaRecognizableAnchorCueRecords, qaRecognizableCueCategoryVisibility)
  ), [qaRecognizableAnchorCueRecords, qaRecognizableCueCategoryVisibility]);
  const qaScaffoldPreviewAdapter = useMemo(() => (
    buildQAScaffoldPreviewRuntimeAdapter(qaScaffoldPreviewExpansionFixture, visibleQAScaffoldPreviewRecords)
  ), [visibleQAScaffoldPreviewRecords]);
  const qaScaffoldPreviewIndex = useMemo(() => buildQAScaffoldPreviewIndex(qaScaffoldPreviewAdapter), [qaScaffoldPreviewAdapter]);
  const qaFrontageCandidateAdapter = useMemo(() => (
    buildQAFrontageCandidateRuntimeAdapter(qaFrontageCandidateFixture, visibleQAFrontageCandidateRecords)
  ), [visibleQAFrontageCandidateRecords]);
  const qaFrontageCandidateIndex = useMemo(() => buildQAFrontageCandidateIndex(qaFrontageCandidateAdapter), [qaFrontageCandidateAdapter]);
  const qaRecognizableAnchorCueAdapter = useMemo(() => (
    buildQARecognizableAnchorCueRuntimeAdapter(qaRecognizableAnchorCueFixture, visibleQARecognizableAnchorCueRecords)
  ), [visibleQARecognizableAnchorCueRecords]);
  const qaRecognizableAnchorCueIndex = useMemo(() => buildQARecognizableAnchorCueIndex(qaRecognizableAnchorCueAdapter), [qaRecognizableAnchorCueAdapter]);
  const localEvidenceCueAdapter = useMemo(() => (
    buildLocalEvidenceCueRuntimeAdapter(localEvidenceCueEnrichmentFixture, localEvidenceCueRecords)
  ), [localEvidenceCueRecords]);
  const localEvidenceCueIndex = useMemo(() => buildLocalEvidenceCueIndex(localEvidenceCueAdapter), [localEvidenceCueAdapter]);
  const inspectedId = selectedId ?? hoveredId;
  const inspectedObject = runtimeScene.objects.find((object) => object.id === inspectedId) ?? null;
  const inspectedCue = inspectedObject ? facadeCueIndex.get(inspectedObject.id) ?? null : null;
  const inspectedSliceFacade = inspectedObject ? qaFacadeSliceIndex.get(inspectedObject.id) ?? null : null;
  const inspectedEvidenceFacade = inspectedObject ? evidenceFacadeCueIndex.get(inspectedObject.id) ?? null : null;
  const inspectedCorridorFacadeCue = inspectedObject ? corridorFacadeCueIndex.get(inspectedObject.id) ?? null : null;
  const inspectedQAScaffoldPreviewRecords = inspectedObject ? qaScaffoldPreviewIndex.get(inspectedObject.id) ?? [] : [];
  const inspectedQAFrontageCandidateRecords = inspectedObject ? qaFrontageCandidateIndex.get(inspectedObject.id) ?? [] : [];
  const inspectedQARecognizableAnchorCueRecords = inspectedObject ? qaRecognizableAnchorCueIndex.get(inspectedObject.id) ?? [] : [];
  const inspectedLocalEvidenceCueRecords = inspectedObject ? localEvidenceCueIndex.get(inspectedObject.id) ?? [] : [];
  const inspectedValidation = inspectedObject ? geometryValidationIndex.get(inspectedObject.id) ?? null : null;
  const inspectedCandidatePois = inspectedObject ? candidatePoiIndex.get(inspectedObject.id) ?? [] : [];
  const inspectedCornerAnchorCandidates = inspectedObject ? cornerAnchorCandidateIndex.get(inspectedObject.id) ?? [] : [];
  const reviewTotals = useMemo(() => (
    buildReviewTotals(runtimeScene, facadeCueFixture, qaFacadeSliceFixture, evidenceFacadeCueFixture, corridorFacadeCueFixture, qaScaffoldPreviewAdapter, qaFrontageCandidateAdapter, qaRecognizableAnchorCueAdapter, localEvidenceCueAdapter, geometryValidationReport, candidatePoiFixture)
  ), [runtimeScene, qaScaffoldPreviewAdapter, qaFrontageCandidateAdapter, qaRecognizableAnchorCueAdapter, localEvidenceCueAdapter]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.autoClear = true;
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
    addRuntimeObjects(scene, runtimeScene, facadeCueIndex, qaFacadeSliceIndex, evidenceFacadeCueIndex, corridorFacadeCueIndex, qaScaffoldPreviewIndex, qaFrontageCandidateIndex, qaRecognizableAnchorCueIndex, localEvidenceCueIndex, pickTargets, visualObjects, pickObjects);
    addQAScaffoldGroundingPreview(scene, runtimeScene, qaScaffoldPreviewAdapter.renderRecords, visualObjects);
    addCandidatePoiMarkers(scene, runtimeScene, candidatePoiFixture, visualObjects);

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
  }, [runtimeScene, facadeCueIndex, qaFacadeSliceIndex, evidenceFacadeCueIndex, corridorFacadeCueIndex, qaScaffoldPreviewIndex, qaScaffoldPreviewAdapter, qaFrontageCandidateIndex, qaRecognizableAnchorCueIndex, localEvidenceCueIndex]);

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
          <p className="phase4b-kicker">Batch 4K-2 / QA recognizable anchor overlay</p>
          <h1>Greenpoint Ave corridor facade cue review</h1>
        </div>
        <p>
          QA-only 4I corridor cues, 4O scaffold previews with 4O-19 family controls, 4J frontage/bay candidate guides, and 4K recognizable anchor cues. Normal mode stays protected; QA guides are not business identity, exact storefront, exact frontage, facade, signage, entrance, active status, exact height, or production claims.
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
          inspectedEvidenceFacade={inspectedEvidenceFacade}
          inspectedCorridorFacadeCue={inspectedCorridorFacadeCue}
          inspectedLocalEvidenceCueRecords={inspectedLocalEvidenceCueRecords}
          qaEnabled={qaEnabled}
          inspectedValidation={qaEnabled ? inspectedValidation : null}
          storefrontAnchors={runtimeScene.storefrontAnchors}
        />

        {qaEnabled ? (
          <QADebugPanel
            inspectedObject={inspectedObject}
            inspectedCue={inspectedCue}
            inspectedValidation={inspectedValidation}
            inspectedSliceFacade={inspectedSliceFacade}
            inspectedEvidenceFacade={inspectedEvidenceFacade}
            inspectedCorridorFacadeCue={inspectedCorridorFacadeCue}
            facadeCueFixture={facadeCueFixture}
            qaFacadeSliceFixture={qaFacadeSliceFixture}
            evidenceFacadeCueFixture={evidenceFacadeCueFixture}
            corridorFacadeCueFixture={corridorFacadeCueFixture}
            qaScaffoldPreviewAdapter={qaScaffoldPreviewAdapter}
            qaScaffoldFamilyVisibility={qaScaffoldFamilyVisibility}
            onToggleQAScaffoldFamily={(family) => setQAScaffoldFamilyVisibility((visibility) => ({
              ...visibility,
              [family]: !visibility[family],
            }))}
            qaFrontageCandidateAdapter={qaFrontageCandidateAdapter}
            qaFrontageCandidateTypeVisibility={qaFrontageCandidateTypeVisibility}
            onToggleQAFrontageCandidateType={(candidateType) => setQAFrontageCandidateTypeVisibility((visibility) => ({
              ...visibility,
              [candidateType]: !visibility[candidateType],
            }))}
            qaRecognizableAnchorCueAdapter={qaRecognizableAnchorCueAdapter}
            qaRecognizableCueCategoryVisibility={qaRecognizableCueCategoryVisibility}
            onToggleQARecognizableCueCategory={(cueCategory) => setQARecognizableCueCategoryVisibility((visibility) => ({
              ...visibility,
              [cueCategory]: !visibility[cueCategory],
            }))}
            localEvidenceCueAdapter={localEvidenceCueAdapter}
            inspectedLocalEvidenceCueRecords={inspectedLocalEvidenceCueRecords}
            geometryValidationReport={geometryValidationReport}
            candidatePoiFixture={candidatePoiFixture}
            cornerAnchorCandidateFixture={cornerAnchorCandidateFixture}
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
          <button type="button" onClick={() => runCameraCommand("streetReview")} aria-label="Camera preset street review">
            Street
          </button>
          <button type="button" onClick={() => runCameraCommand("manhattanFacadeReview")} aria-label="Camera preset Manhattan facade review">
            Manhattan
          </button>
          <button type="button" onClick={() => runCameraCommand("franklinFacadeReview")} aria-label="Camera preset Franklin facade review">
            Franklin
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
          inspectedEvidenceFacade={inspectedEvidenceFacade}
          inspectedCorridorFacadeCue={inspectedCorridorFacadeCue}
          inspectedQAScaffoldPreviewRecords={qaEnabled ? inspectedQAScaffoldPreviewRecords : []}
          qaScaffoldPreviewAdapter={qaScaffoldPreviewAdapter}
          qaScaffoldFamilyVisibility={qaScaffoldFamilyVisibility}
          inspectedQAFrontageCandidateRecords={qaEnabled ? inspectedQAFrontageCandidateRecords : []}
          qaFrontageCandidateAdapter={qaFrontageCandidateAdapter}
          qaFrontageCandidateTypeVisibility={qaFrontageCandidateTypeVisibility}
          inspectedQARecognizableAnchorCueRecords={qaEnabled ? inspectedQARecognizableAnchorCueRecords : []}
          qaRecognizableAnchorCueAdapter={qaRecognizableAnchorCueAdapter}
          qaRecognizableCueCategoryVisibility={qaRecognizableCueCategoryVisibility}
          inspectedLocalEvidenceCueRecords={qaEnabled ? inspectedLocalEvidenceCueRecords : []}
          localEvidenceCueAdapter={localEvidenceCueAdapter}
          inspectedValidation={qaEnabled ? inspectedValidation : null}
          inspectedCandidatePois={qaEnabled ? inspectedCandidatePois : []}
          candidatePoiFixture={candidatePoiFixture}
          inspectedCornerAnchorCandidates={qaEnabled ? inspectedCornerAnchorCandidates : []}
          cornerAnchorCandidateFixture={cornerAnchorCandidateFixture}
          qaEnabled={qaEnabled}
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
        <li><span className="phase4b-swatch phase4b-swatch-qa-facade-slice" /> QA draft street-feel slice</li>
        <li><span className="phase4b-swatch phase4b-swatch-evidence-facade" /> QA evidence facade</li>
        <li><span className="phase4b-swatch phase4b-swatch-corridor-facade" /> QA corridor cue</li>
        <li><span className="phase4b-swatch phase4b-swatch-scaffold-preview" /> QA scaffold preview</li>
        <li><span className="phase4b-swatch phase4b-swatch-frontage-candidate" /> QA 4J candidate</li>
        <li><span className="phase4b-swatch phase4b-swatch-recognizable-anchor" /> QA 4K cue</li>
        <li><span className="phase4b-swatch phase4b-swatch-local-evidence" /> QA 4L local evidence</li>
        <li><span className="phase4b-swatch phase4b-swatch-candidate-poi" /> QA candidate POI</li>
        <li><span className="phase4b-swatch phase4b-swatch-centerline" /> Corridor line</li>
        <li><span className="phase4b-swatch phase4b-swatch-selected" /> Selected/hovered</li>
        <li><span className="phase4b-swatch phase4b-swatch-blocked" /> {anchorStatus}</li>
      </ul>
    </aside>
  );
}

function ReviewPanel({ totals, inspectedObject, inspectedCue, inspectedEvidenceFacade, inspectedCorridorFacadeCue, inspectedLocalEvidenceCueRecords, qaEnabled, inspectedValidation, storefrontAnchors }) {
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
          <dt>QA street-feel slice</dt>
          <dd>{totals.qaFacadeSliceBuildings}</dd>
        </div>
        <div>
          <dt>Evidence facades</dt>
          <dd>{qaEnabled ? totals.evidenceFacadeRecords : "QA off"}</dd>
        </div>
        <div>
          <dt>Corridor cues</dt>
          <dd>{qaEnabled ? `${totals.corridorFacadeRendered} shown / ${totals.corridorFacadeBlocked} blocked` : "QA off"}</dd>
        </div>
        <div>
          <dt>4O scaffold preview</dt>
          <dd>{qaEnabled ? `${totals.scaffoldPreviewVisible} visible / ${totals.scaffoldPreviewRendered} QA / ${totals.scaffoldPreviewNormalMode} normal` : "QA off"}</dd>
        </div>
        <div>
          <dt>4O scaffold families</dt>
          <dd>{qaEnabled ? `${totals.scaffoldPreviewVisibleContainers} / ${totals.scaffoldPreviewVisibleGrounding} / ${totals.scaffoldPreviewVisibleHeight}` : "QA off"}</dd>
        </div>
        <div>
          <dt>4J candidates</dt>
          <dd>{qaEnabled ? `${totals.frontageCandidateVisible} visible / ${totals.frontageCandidateRecords} QA / ${totals.frontageCandidateNormalMode} normal` : "QA off"}</dd>
        </div>
        <div>
          <dt>4K cues</dt>
          <dd>{qaEnabled ? `${totals.recognizableAnchorCueVisible} visible / ${totals.recognizableAnchorCueRecords} QA / ${totals.recognizableAnchorCueNormalMode} normal` : "QA off"}</dd>
        </div>
        <div>
          <dt>4L local cues</dt>
          <dd>{qaEnabled ? `${totals.localEvidenceCueVisible} visible / ${totals.localEvidenceCueRecords} QA / ${totals.localEvidenceCueNormalMode} normal` : "QA off"}</dd>
        </div>
        <div>
          <dt>Candidate POIs</dt>
          <dd>{qaEnabled ? totals.candidatePoiCount : "QA off"}</dd>
        </div>
        <div>
          <dt>4D safe / uncertain / blocked</dt>
          <dd>{qaEnabled ? `${totals.geometrySafe} / ${totals.geometryUncertain} / ${totals.geometryBlocked}` : "QA off"}</dd>
        </div>
        <div>
          <dt>Selected side</dt>
          <dd>{inspectedObject?.corridorSide ?? "none"}</dd>
        </div>
        <div>
          <dt>QA confidence</dt>
          <dd>{inspectedValidation?.geometryConfidence?.label ?? "QA off"}</dd>
        </div>
        <div>
          <dt>Selected tiers</dt>
          <dd>{formatCueTiers(inspectedCue)}</dd>
        </div>
        <div>
          <dt>Evidence facade</dt>
          <dd>{qaEnabled ? inspectedEvidenceFacade?.claimStatus ?? "none" : "QA off"}</dd>
        </div>
        <div>
          <dt>Corridor facade lane</dt>
          <dd>{qaEnabled ? inspectedCorridorFacadeCue?.recordLane ?? "none" : "QA off"}</dd>
        </div>
        <div>
          <dt>Local evidence</dt>
          <dd>{qaEnabled ? inspectedLocalEvidenceCueRecords?.[0]?.qaOnlyStatus ?? "none" : "QA off"}</dd>
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
  inspectedValidation,
  inspectedSliceFacade,
  inspectedEvidenceFacade,
  inspectedCorridorFacadeCue,
  facadeCueFixture,
  qaFacadeSliceFixture,
  evidenceFacadeCueFixture,
  corridorFacadeCueFixture,
  qaScaffoldPreviewAdapter,
  qaScaffoldFamilyVisibility,
  onToggleQAScaffoldFamily,
  qaFrontageCandidateAdapter,
  qaFrontageCandidateTypeVisibility,
  onToggleQAFrontageCandidateType,
  qaRecognizableAnchorCueAdapter,
  qaRecognizableCueCategoryVisibility,
  onToggleQARecognizableCueCategory,
  localEvidenceCueAdapter,
  inspectedLocalEvidenceCueRecords,
  geometryValidationReport,
  candidatePoiFixture,
  cornerAnchorCandidateFixture,
  storefrontAnchors,
}) {
  const confidence = inspectedValidation?.geometryConfidence?.label ?? "none";
  return (
    <aside className="phase4b-qa-panel" aria-label="QA debug overlay status">
      <p>QA facade status</p>
      <ul>
        <li><span className="phase4b-side-dot phase4b-side-evidence-facade" /> Evidence facades: {evidenceFacadeCueFixture.summary.renderedCueRecordCount}</li>
        <li><span className="phase4b-side-dot phase4b-side-center" /> Corridor cues: {corridorFacadeCueFixture.summary.renderedQaOnlyRecordCount} QA shown / {corridorFacadeCueFixture.summary.blockedNoEvidenceGapRecordCount} blocked gaps</li>
        <li><span className="phase4b-side-dot phase4b-side-evidence-facade" /> Unique visual slots: {evidenceFacadeCueFixture.summary.uniqueStreetwallSlotCount}</li>
        <li><span className="phase4b-side-dot phase4b-side-evidence-facade" /> Evidence labels: {evidenceFacadeCueFixture.statusLabels.join(" / ")}</li>
        <li><span className="phase4b-side-dot phase4b-side-center" /> 4O scaffold: {qaScaffoldPreviewAdapter.summary.visibleQaOnlyRecordCount} visible / {qaScaffoldPreviewAdapter.summary.renderedQaOnlyRecordCount} QA placeholders / {qaScaffoldPreviewAdapter.summary.normalModeRecordCount} normal</li>
        <li><span className="phase4b-side-dot phase4b-side-center" /> 4O families: {qaScaffoldPreviewAdapter.summary.visibleBuildingContainerPreviewCount} container / {qaScaffoldPreviewAdapter.summary.visibleGroundingPreviewCount} ground / {qaScaffoldPreviewAdapter.summary.visibleHeightMassingPreviewCount} height</li>
        <li><span className="phase4b-side-dot phase4b-side-center" /> 4J candidates: {qaFrontageCandidateAdapter.summary.visibleQaOnlyRecordCount} visible / {qaFrontageCandidateAdapter.summary.candidateRecordCount} QA / {qaFrontageCandidateAdapter.summary.normalModeRecordCount} normal</li>
        <li><span className="phase4b-side-dot phase4b-side-recognizable-anchor" /> 4K cues: {qaRecognizableAnchorCueAdapter.summary.visibleQaOnlyRecordCount} visible / {qaRecognizableAnchorCueAdapter.summary.cueRecordCount} QA / {qaRecognizableAnchorCueAdapter.summary.normalModeRecordCount} normal</li>
        <li><span className="phase4b-side-dot phase4b-side-local-evidence" /> 4L local cues: {localEvidenceCueAdapter.summary.visibleQaOnlyRecordCount} visible / {localEvidenceCueAdapter.summary.enrichedCueRecordCount} QA / {localEvidenceCueAdapter.summary.normalModeRecordCount} normal</li>
        <li><span className="phase4b-side-dot phase4b-side-local-evidence" /> Selected 4L: {inspectedLocalEvidenceCueRecords.length ? inspectedLocalEvidenceCueRecords.map((record) => record.qaOnlyStatus).join(" / ") : "none"}</li>
        <li><span className="phase4b-side-dot phase4b-side-evidence-facade" /> Business evidence not connected</li>
        <li><span className="phase4b-side-dot phase4b-side-blocked" /> Blocked claims remain blocked</li>
        <li><span className="phase4b-side-dot phase4b-side-center" /> Synthetic context: non-evidence placeholder</li>
      </ul>
      <div className="phase4b-qa-filter-row" aria-label="QA scaffold family filters">
        {["container", "grounding", "height"].map((family) => (
          <button
            key={family}
            type="button"
            aria-pressed={qaScaffoldFamilyVisibility[family] !== false}
            onClick={() => onToggleQAScaffoldFamily(family)}
          >
            {family}
          </button>
        ))}
      </div>
      <div className="phase4b-qa-filter-row" aria-label="QA frontage candidate type filters">
        {qaFrontageCandidateAdapter.candidateTypeAllowlist.map((candidateType) => (
          <button
            key={candidateType}
            type="button"
            aria-pressed={qaFrontageCandidateTypeVisibility[candidateType] !== false}
            onClick={() => onToggleQAFrontageCandidateType(candidateType)}
          >
            {formatCandidateTypeLabel(candidateType)}
          </button>
        ))}
      </div>
      <div className="phase4b-qa-filter-row" aria-label="QA recognizable anchor cue category filters">
        {qaRecognizableAnchorCueAdapter.cueCategoryAllowlist.map((cueCategory) => (
          <button
            key={cueCategory}
            type="button"
            aria-pressed={qaRecognizableCueCategoryVisibility[cueCategory] !== false}
            onClick={() => onToggleQARecognizableCueCategory(cueCategory)}
          >
            {formatCueCategoryLabel(cueCategory)}
          </button>
        ))}
      </div>
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
          <dt>Geometry confidence</dt>
          <dd>{confidence} / {geometryValidationReport.summary.confidenceCounts.safe} safe / {geometryValidationReport.summary.confidenceCounts.blocked} blocked</dd>
        </div>
        <div>
          <dt>Gap status</dt>
          <dd>{inspectedValidation?.gapAndBlockBreak?.status ?? "none"}</dd>
        </div>
        <div>
          <dt>POI eligibility</dt>
          <dd>{inspectedValidation?.poiMatchingEligibility?.status ?? "none"}</dd>
        </div>
        <div>
          <dt>Cue class</dt>
          <dd>{inspectedCue?.cueClass ?? "none"}</dd>
        </div>
        <div>
          <dt>Slice status</dt>
          <dd>{inspectedSliceFacade ? inspectedSliceFacade.statusLabels.join(" / ") : `${qaFacadeSliceFixture.facades.length} QA-only records`}</dd>
        </div>
        <div>
          <dt>Evidence facade</dt>
          <dd>{inspectedEvidenceFacade ? `${inspectedEvidenceFacade.qaComposition.streetwallSlot} / ${inspectedEvidenceFacade.statusLabels.join(" / ")}` : "none"}</dd>
        </div>
        <div>
          <dt>4I corridor lane</dt>
          <dd>{inspectedCorridorFacadeCue ? `${inspectedCorridorFacadeCue.recordLane} / ${inspectedCorridorFacadeCue.statusLabels.join(" / ")}` : "none"}</dd>
        </div>
        <div>
          <dt>Evidence palette</dt>
          <dd>{inspectedEvidenceFacade?.paletteFamily ?? "none"}</dd>
        </div>
        <div>
          <dt>Candidate POIs</dt>
          <dd>{candidatePoiFixture.summary.candidateCount} candidate-only / {cornerAnchorCandidateFixture.summary.anchorCandidateCount} anchor candidates / {storefrontAnchors?.anchors?.length ?? 0} existing anchors</dd>
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
  inspectedEvidenceFacade,
  inspectedCorridorFacadeCue,
  inspectedQAScaffoldPreviewRecords,
  qaScaffoldPreviewAdapter,
  qaScaffoldFamilyVisibility,
  inspectedQAFrontageCandidateRecords,
  qaFrontageCandidateAdapter,
  qaFrontageCandidateTypeVisibility,
  inspectedQARecognizableAnchorCueRecords,
  qaRecognizableAnchorCueAdapter,
  qaRecognizableCueCategoryVisibility,
  inspectedLocalEvidenceCueRecords,
  localEvidenceCueAdapter,
  inspectedValidation,
  inspectedCandidatePois,
  candidatePoiFixture,
  inspectedCornerAnchorCandidates,
  cornerAnchorCandidateFixture,
  qaEnabled,
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
          <dd>{reviewTotals.primitiveBuildings} buildings / {reviewTotals.geometryFacadeCues} cues / {reviewTotals.qaFacadeSliceBuildings} draft facades / {reviewTotals.evidenceFacadeRecords} evidence facades / {reviewTotals.corridorFacadeRendered} corridor QA cues</dd>
        </div>
        <div>
          <dt>Storefront anchors</dt>
          <dd>{anchorStatus}</dd>
        </div>
      </dl>

      <section>
        <h2>4D Geometry Validation</h2>
        {qaEnabled ? (
          <ul>
            <li>
              <span>Confidence</span>
              <small>{inspectedValidation?.geometryConfidence?.label ?? "none"}</small>
            </li>
            <li>
              <span>Reason</span>
              <small>{formatReasons(inspectedValidation?.geometryConfidence?.reasons)}</small>
            </li>
            <li>
              <span>Relative order</span>
              <small>{formatRelativeOrder(inspectedValidation?.relativeOrder)}</small>
            </li>
            <li>
              <span>Gap / break</span>
              <small>{inspectedValidation?.gapAndBlockBreak?.status ?? "none"}</small>
            </li>
            <li>
              <span>Address/building ambiguity</span>
              <small>{inspectedValidation?.addressBuildingAmbiguity?.status ?? "none"}</small>
            </li>
            <li>
              <span>POI matching</span>
              <small>{inspectedValidation?.poiMatchingEligibility?.status ?? "none"}</small>
            </li>
            <li>
              <span>Facade evidence target</span>
              <small>{inspectedValidation?.facadeEvidenceAnchorEligibility?.status ?? "none"}</small>
            </li>
          </ul>
        ) : (
          <p>QA mode required for 4D confidence labels.</p>
        )}
      </section>

      <section>
        <h2>4D Candidate POI QA</h2>
        {qaEnabled ? (
          <>
            <p>Not a storefront assignment.</p>
            <ul>
              <li>
                <span>Fixture source</span>
                <small>{candidatePoiFixture.sourceBoundary.sourceType}</small>
              </li>
              <li>
                <span>Cache / display</span>
                <small>{candidatePoiFixture.sourceBoundary.cachePermissionStatus} / {candidatePoiFixture.sourceBoundary.displayPermissionStatus}</small>
              </li>
              <li>
                <span>Selected candidates</span>
                <small>{inspectedCandidatePois.length}</small>
              </li>
              {(inspectedCandidatePois.length ? inspectedCandidatePois : candidatePoiFixture.candidates).map((candidate) => (
                <li key={candidate.id}>
                  <span>{candidate.displayLabel}</span>
                  <small>{candidate.claimState} / {candidate.candidateConfidence} / Not a storefront assignment.</small>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>QA mode required for candidate POI records.</p>
        )}
      </section>

      {qaEnabled ? (
        <section>
          <h2>4D Corner Anchor Candidates</h2>
          <p>Corner anchor candidate only. Not a storefront assignment.</p>
          <ul>
            <li>
              <span>Scope</span>
              <small>Manhattan corner / Franklin corner only; mid-corridor absent</small>
            </li>
            <li>
              <span>Linked / unresolved</span>
              <small>{cornerAnchorCandidateFixture.summary.linkedCandidateCount} / {cornerAnchorCandidateFixture.summary.unresolvedCandidateCount}</small>
            </li>
            <li>
              <span>Franklin status</span>
              <small>{cornerAnchorCandidateFixture.blockedCornerScopes[0]?.status ?? "none"}</small>
            </li>
            <li>
              <span>Selected candidates</span>
              <small>{inspectedCornerAnchorCandidates.length}</small>
            </li>
            {(inspectedCornerAnchorCandidates.length
              ? inspectedCornerAnchorCandidates
              : cornerAnchorCandidateFixture.anchorCandidates).map((candidate) => (
                <li key={candidate.anchorCandidateId}>
                  <span>{candidate.evidenceId}</span>
                  <small>
                    {candidate.cornerScope} / {candidate.candidateGeometryContainerId ?? "geometry unresolved"} / {candidate.associationConfidence} / {candidate.supportedClaimLevel} / blocked {candidate.blockedClaimLevels.join(", ")}
                  </small>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

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
        <h2>QA Street-Feel Slice</h2>
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
        <h2>4E Evidence Facade</h2>
        {qaEnabled ? (
          <ul>
            <li>
              <span>Status</span>
              <small>{inspectedEvidenceFacade ? inspectedEvidenceFacade.statusLabels.join(" / ") : "not targeted"}</small>
            </li>
            <li>
              <span>Slot</span>
              <small>{inspectedEvidenceFacade?.qaComposition?.streetwallSlot ?? "none"}</small>
            </li>
            <li>
              <span>Depth</span>
              <small>{inspectedEvidenceFacade?.qaComposition ? `${inspectedEvidenceFacade.qaComposition.footprintDepthUnits} footprint / ${inspectedEvidenceFacade.qaComposition.cornerReturnDepthUnits} return` : "none"}</small>
            </li>
            <li>
              <span>Palette</span>
              <small>{inspectedEvidenceFacade?.paletteFamily ?? "none"}</small>
            </li>
            <li>
              <span>Cues</span>
              <small>{formatEvidenceCueTypes(inspectedEvidenceFacade)}</small>
            </li>
            <li>
              <span>Use</span>
              <small>{inspectedEvidenceFacade?.allowedUse ?? "none"}</small>
            </li>
            <li>
              <span>Truth gate</span>
              <small>business evidence not connected; exact claims blocked</small>
            </li>
          </ul>
        ) : (
          <p>QA mode required for evidence-informed facade cues.</p>
        )}
      </section>

      <section>
        <h2>4O Scaffold Preview</h2>
        {qaEnabled ? (
          <ul>
            <li>
              <span>Rendered</span>
              <small>{qaScaffoldPreviewAdapter.summary.visibleQaOnlyRecordCount} visible / {qaScaffoldPreviewAdapter.summary.renderedQaOnlyRecordCount} QA / {qaScaffoldPreviewAdapter.summary.normalModeRecordCount} normal</small>
            </li>
            <li>
              <span>Families</span>
              <small>{qaScaffoldPreviewAdapter.summary.visibleBuildingContainerPreviewCount} container / {qaScaffoldPreviewAdapter.summary.visibleGroundingPreviewCount} ground / {qaScaffoldPreviewAdapter.summary.visibleHeightMassingPreviewCount} height</small>
            </li>
            <li>
              <span>Family filters</span>
              <small>{formatQAScaffoldFamilyVisibility(qaScaffoldFamilyVisibility)}</small>
            </li>
            <li>
              <span>Selected traces</span>
              <small>{inspectedQAScaffoldPreviewRecords.length ? inspectedQAScaffoldPreviewRecords.map((record) => record.legibility?.familyChip ?? record.visualRole).join(" / ") : "none"}</small>
            </li>
            {(inspectedQAScaffoldPreviewRecords.length ? inspectedQAScaffoldPreviewRecords : qaScaffoldPreviewAdapter.renderRecords).slice(0, 8).map((record) => (
              <li key={record.recordId}>
                <span>{record.displayLabel}</span>
                <small>{record.expansionTrace?.anchorId ?? record.expansionTrace?.guideId ?? record.derivedFromCandidateId} / {record.normalModeExposure}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>QA mode required for 4O scaffold preview records.</p>
        )}
      </section>

      <section>
        <h2>4J Frontage Candidates</h2>
        {qaEnabled ? (
          <ul>
            <li>
              <span>Rendered</span>
              <small>{qaFrontageCandidateAdapter.summary.visibleQaOnlyRecordCount} visible / {qaFrontageCandidateAdapter.summary.candidateRecordCount} QA / {qaFrontageCandidateAdapter.summary.normalModeRecordCount} normal</small>
            </li>
            <li>
              <span>Candidate types</span>
              <small>{formatQAFrontageCandidateTypeVisibility(qaFrontageCandidateTypeVisibility)}</small>
            </li>
            <li>
              <span>Selected records</span>
              <small>{inspectedQAFrontageCandidateRecords.length ? inspectedQAFrontageCandidateRecords.map((record) => formatCandidateTypeLabel(record.candidateType)).join(" / ") : "none"}</small>
            </li>
            {(inspectedQAFrontageCandidateRecords.length ? inspectedQAFrontageCandidateRecords : qaFrontageCandidateAdapter.renderRecords).slice(0, 8).map((record) => (
              <li key={record.candidateId}>
                <span>{formatCandidateTypeLabel(record.candidateType)}</span>
                <small>{record.linked4OScaffoldAnchorId} / {record.qaOnlyStatus} / blocked {record.blockedClaimCategories.slice(0, 4).join(", ")}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>QA mode required for 4J frontage candidate records.</p>
        )}
      </section>

      <section>
        <h2>4K Recognizable Anchor Cues</h2>
        {qaEnabled ? (
          <ul>
            <li>
              <span>Rendered</span>
              <small>{qaRecognizableAnchorCueAdapter.summary.visibleQaOnlyRecordCount} visible / {qaRecognizableAnchorCueAdapter.summary.cueRecordCount} QA / {qaRecognizableAnchorCueAdapter.summary.normalModeRecordCount} normal</small>
            </li>
            <li>
              <span>Cue categories</span>
              <small>{formatQARecognizableCueCategoryVisibility(qaRecognizableCueCategoryVisibility)}</small>
            </li>
            <li>
              <span>Selected records</span>
              <small>{inspectedQARecognizableAnchorCueRecords.length ? inspectedQARecognizableAnchorCueRecords.map((record) => formatCueCategoryLabel(record.cueCategory)).join(" / ") : "none"}</small>
            </li>
            {(inspectedQARecognizableAnchorCueRecords.length ? inspectedQARecognizableAnchorCueRecords : qaRecognizableAnchorCueAdapter.renderRecords).slice(0, 8).map((record) => (
              <li key={record.cueId}>
                <span>{formatCueCategoryLabel(record.cueCategory)}</span>
                <small>{record.linked4OScaffoldAnchorId} / {record.linked4JFrontageCandidateId} / {record.qaOnlyStatus} / blocked {record.blockedClaimCategories.slice(0, 4).join(", ")}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>QA mode required for 4K recognizable anchor cue records.</p>
        )}
      </section>

      <section>
        <h2>4L Local Evidence Cues</h2>
        {qaEnabled ? (
          <ul>
            <li>
              <span>Rendered</span>
              <small>{localEvidenceCueAdapter.summary.visibleQaOnlyRecordCount} visible / {localEvidenceCueAdapter.summary.enrichedCueRecordCount} QA / {localEvidenceCueAdapter.summary.normalModeRecordCount} normal</small>
            </li>
            <li>
              <span>Evidence refs</span>
              <small>{localEvidenceCueAdapter.summary.uniqueEvidenceIdCount} repo-local evidence IDs / blocked claims remain blocked</small>
            </li>
            <li>
              <span>Selected records</span>
              <small>{inspectedLocalEvidenceCueRecords.length ? inspectedLocalEvidenceCueRecords.map((record) => record.qaOnlyStatus).join(" / ") : "none"}</small>
            </li>
            {(inspectedLocalEvidenceCueRecords.length ? inspectedLocalEvidenceCueRecords : localEvidenceCueAdapter.renderRecords).slice(0, 6).map((record) => (
              <li key={record.enrichedCueId}>
                <span>{formatPaletteFamilyLabel(record.visualCueProfile.paletteFamily)}</span>
                <small>{record.cornerScope} / evidence {record.evidenceIds.length} / {record.qaOnlyStatus}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>QA mode required for 4L local evidence cues.</p>
        )}
      </section>

      <section>
        <h2>4I Corridor Facade Cue</h2>
        {qaEnabled ? (
          <ul>
            <li>
              <span>Lane</span>
              <small>{inspectedCorridorFacadeCue?.recordLane ?? "not targeted"}</small>
            </li>
            <li>
              <span>Status</span>
              <small>{inspectedCorridorFacadeCue ? inspectedCorridorFacadeCue.statusLabels.join(" / ") : "none"}</small>
            </li>
            <li>
              <span>Evidence</span>
              <small>{inspectedCorridorFacadeCue?.evidenceStatus ?? "none"}</small>
            </li>
            <li>
              <span>Render role</span>
              <small>{inspectedCorridorFacadeCue?.qaCueGeometry?.qaRenderRole ?? inspectedCorridorFacadeCue?.renderStatus ?? "none"}</small>
            </li>
            <li>
              <span>Fixture counts</span>
              <small>{reviewTotals.corridorFacadeMid} insufficient / {reviewTotals.corridorFacadeBlocked} blocked gaps</small>
            </li>
            <li>
              <span>Truth gate</span>
              <small>QA-only; no storefront, business, exact facade, normal-mode, or production claim</small>
            </li>
          </ul>
        ) : (
          <p>QA mode required for 4I corridor facade cue records.</p>
        )}
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

function buildReviewTotals(runtimeScene, cueFixture, qaFacadeSliceFixture, evidenceFacadeCueFixture, corridorFacadeCueFixture, qaScaffoldAdapter, qaFrontageCandidateAdapter, qaRecognizableAnchorCueAdapter, localEvidenceCueAdapter, validationReport, candidateFixture) {
  return {
    semanticObjects: runtimeScene.objects.length,
    primitiveBuildings: runtimeScene.buildings.length,
    geometryFacadeCues: cueFixture.cues.length,
    qaFacadeSliceBuildings: qaFacadeSliceFixture.facades.length,
    evidenceFacadeRecords: evidenceFacadeCueFixture.summary.renderedCueRecordCount,
    corridorFacadeRecords: corridorFacadeCueFixture.summary.totalRecordCount,
    corridorFacadeRendered: corridorFacadeCueFixture.summary.renderedQaOnlyRecordCount,
    corridorFacadeMid: corridorFacadeCueFixture.summary.midCorridorInsufficientEvidenceRecordCount,
    corridorFacadeBlocked: corridorFacadeCueFixture.summary.blockedNoEvidenceGapRecordCount,
    scaffoldPreviewRecords: qaScaffoldAdapter.summary.renderRecordCount,
    scaffoldPreviewRendered: qaScaffoldAdapter.summary.renderedQaOnlyRecordCount,
    scaffoldPreviewVisible: qaScaffoldAdapter.summary.visibleQaOnlyRecordCount ?? qaScaffoldAdapter.summary.renderedQaOnlyRecordCount,
    scaffoldPreviewContainers: qaScaffoldAdapter.summary.buildingContainerPreviewCount,
    scaffoldPreviewGrounding: qaScaffoldAdapter.summary.groundingPreviewCount,
    scaffoldPreviewHeight: qaScaffoldAdapter.summary.heightMassingPreviewCount,
    scaffoldPreviewVisibleContainers: qaScaffoldAdapter.summary.visibleBuildingContainerPreviewCount ?? qaScaffoldAdapter.summary.buildingContainerPreviewCount,
    scaffoldPreviewVisibleGrounding: qaScaffoldAdapter.summary.visibleGroundingPreviewCount ?? qaScaffoldAdapter.summary.groundingPreviewCount,
    scaffoldPreviewVisibleHeight: qaScaffoldAdapter.summary.visibleHeightMassingPreviewCount ?? qaScaffoldAdapter.summary.heightMassingPreviewCount,
    scaffoldPreviewNormalMode: qaScaffoldAdapter.summary.normalModeRecordCount,
    frontageCandidateRecords: qaFrontageCandidateAdapter.summary.candidateRecordCount,
    frontageCandidateVisible: qaFrontageCandidateAdapter.summary.visibleQaOnlyRecordCount,
    frontageCandidateNormalMode: qaFrontageCandidateAdapter.summary.normalModeRecordCount,
    recognizableAnchorCueRecords: qaRecognizableAnchorCueAdapter.summary.cueRecordCount,
    recognizableAnchorCueVisible: qaRecognizableAnchorCueAdapter.summary.visibleQaOnlyRecordCount,
    recognizableAnchorCueNormalMode: qaRecognizableAnchorCueAdapter.summary.normalModeRecordCount,
    localEvidenceCueRecords: localEvidenceCueAdapter.summary.enrichedCueRecordCount,
    localEvidenceCueVisible: localEvidenceCueAdapter.summary.visibleQaOnlyRecordCount,
    localEvidenceCueNormalMode: localEvidenceCueAdapter.summary.normalModeRecordCount,
    localEvidenceCueRefs: localEvidenceCueAdapter.summary.uniqueEvidenceIdCount,
    sourceBackedBuildings: runtimeScene.coverage?.sourceBackedBuildingCount ?? runtimeScene.buildings.length,
    leftBuildings: runtimeScene.coverage?.corridorSideCounts?.left
      ?? runtimeScene.buildings.filter((object) => object.corridorSide === "left").length,
    rightBuildings: runtimeScene.coverage?.corridorSideCounts?.right
      ?? runtimeScene.buildings.filter((object) => object.corridorSide === "right").length,
    geometrySafe: validationReport.summary.confidenceCounts.safe,
    geometryUncertain: validationReport.summary.confidenceCounts.uncertain,
    geometryBlocked: validationReport.summary.confidenceCounts.blocked,
    candidatePoiCount: candidateFixture.summary.candidateCount,
  };
}

function buildFacadeCueIndex(cueFixture) {
  return new Map(cueFixture.cues.map((cue) => [cue.targetSemanticId, cue]));
}

function buildQAFacadeSliceIndex(fixture) {
  return new Map(fixture.facades.map((facade) => [facade.targetSemanticId, facade]));
}

function buildEvidenceFacadeCueIndex(fixture) {
  return new Map(
    fixture.facadeCueRecords
      .filter((record) => record.renderStatus === "rendered_qa_only")
      .map((record) => [record.targetSemanticId, record]),
  );
}

function buildCorridorFacadeCueIndex(fixture) {
  return new Map(fixture.corridorCueRecords.map((record) => [record.targetSemanticId, record]));
}

function buildQAScaffoldPreviewIndex(fixture) {
  const index = new Map();
  for (const record of fixture.renderRecords ?? []) {
    const records = index.get(record.targetRenderedObjectId) ?? [];
    records.push(record);
    index.set(record.targetRenderedObjectId, records);
  }
  return index;
}

function buildQAFrontageCandidateIndex(fixture) {
  const index = new Map();
  for (const record of fixture.renderRecords ?? []) {
    const records = index.get(record.targetRenderedObjectId) ?? [];
    records.push(record);
    index.set(record.targetRenderedObjectId, records);
  }
  return index;
}

function buildQARecognizableAnchorCueIndex(fixture) {
  const index = new Map();
  for (const record of fixture.renderRecords ?? []) {
    const records = index.get(record.targetRenderedObjectId) ?? [];
    records.push(record);
    index.set(record.targetRenderedObjectId, records);
  }
  return index;
}

function buildLocalEvidenceCueRenderRecords(fixture) {
  return (fixture.enrichedCueRecords ?? []).map((record) => ({
    ...record,
    targetRenderedObjectId: record.targetSemanticId,
    displayLabel: "4L local evidence",
    renderStatus: "rendered_qa_only_local_evidence_cue",
    normalModeExposure: "blocked",
    visualRole: "repo_local_evidence_cue",
  }));
}

function buildLocalEvidenceCueIndex(fixture) {
  const index = new Map();
  for (const record of fixture.renderRecords ?? []) {
    const records = index.get(record.targetRenderedObjectId) ?? [];
    records.push(record);
    index.set(record.targetRenderedObjectId, records);
  }
  return index;
}

function buildQAFrontageCandidateRenderRecords(candidateFixture, scaffoldExpansionFixture) {
  const anchorById = new Map((scaffoldExpansionFixture.buildingAnchors ?? []).map((anchor) => [anchor.anchorId, anchor]));
  return (candidateFixture.candidateRecords ?? []).map((candidate) => {
    const anchor = anchorById.get(candidate.linked4OScaffoldAnchorId);
    return {
      ...candidate,
      targetRenderedObjectId: anchor?.targetRenderedObjectId ?? null,
      displayLabel: "4J candidate",
      renderStatus: "rendered_qa_only_candidate_guide",
      normalModeExposure: "blocked",
      visualRole: candidate.candidateType,
    };
  }).filter((record) => record.targetRenderedObjectId);
}

function buildQARecognizableAnchorCueRenderRecords(cueFixture, scaffoldExpansionFixture, candidateFixture) {
  const anchorById = new Map((scaffoldExpansionFixture.buildingAnchors ?? []).map((anchor) => [anchor.anchorId, anchor]));
  const candidateById = new Map((candidateFixture.candidateRecords ?? []).map((candidate) => [candidate.candidateId, candidate]));
  return (cueFixture.cueRecords ?? []).map((cue) => {
    const anchor = anchorById.get(cue.linked4OScaffoldAnchorId);
    const candidate = candidateById.get(cue.linked4JFrontageCandidateId);
    return {
      ...cue,
      targetRenderedObjectId: anchor?.targetRenderedObjectId ?? null,
      corridorSection: anchor?.corridorSection ?? null,
      corridorSide: anchor?.corridorSide ?? null,
      linkedCandidateType: candidate?.candidateType ?? null,
      displayLabel: "4K cue",
      renderStatus: "rendered_qa_only_recognizable_anchor_cue",
      normalModeExposure: "blocked",
      visualRole: cue.cueCategory,
    };
  }).filter((record) => record.targetRenderedObjectId);
}

function filterQAFrontageCandidateRecords(records, candidateTypeVisibility) {
  return records.filter((record) => candidateTypeVisibility[record.candidateType] !== false);
}

function filterQARecognizableAnchorCueRecords(records, cueCategoryVisibility) {
  return records.filter((record) => cueCategoryVisibility[record.cueCategory] !== false);
}

function buildQAFrontageCandidateRuntimeAdapter(candidateFixture, visibleRecords) {
  const visibleByType = countRecordsByCandidateType(visibleRecords);
  return {
    ...candidateFixture,
    renderRecordOrder: visibleRecords.map((record) => record.candidateId),
    renderRecords: visibleRecords,
    summary: {
      ...candidateFixture.summary,
      visibleQaOnlyRecordCount: visibleRecords.length,
      visibleFrontageBandCandidateCount: visibleByType.frontage_band_candidate ?? 0,
      visibleBayRhythmCandidateCount: visibleByType.bay_rhythm_candidate ?? 0,
      visibleCornerWrapCandidateCount: visibleByType.corner_wrap_candidate ?? 0,
      visibleSetbackDepthCandidateCount: visibleByType.setback_depth_candidate ?? 0,
    },
  };
}

function buildQARecognizableAnchorCueRuntimeAdapter(cueFixture, visibleRecords) {
  const visibleByCategory = countRecordsByCueCategory(visibleRecords);
  return {
    ...cueFixture,
    renderRecordOrder: visibleRecords.map((record) => record.cueId),
    renderRecords: visibleRecords,
    summary: {
      ...cueFixture.summary,
      visibleQaOnlyRecordCount: visibleRecords.length,
      visibleCornerCompositionCueCount: visibleByCategory.corner_composition_cue ?? 0,
      visibleSidewalkStreetCueCount: visibleByCategory.sidewalk_street_cue ?? 0,
      visibleSubwayOrStreetFurnitureCueCount: visibleByCategory.subway_or_street_furniture_cue ?? 0,
      visibleFacadeRhythmCueCount: visibleByCategory.facade_rhythm_cue ?? 0,
      visibleMaterialColorFamilyCueCount: visibleByCategory.material_color_family_cue ?? 0,
      visibleMassingSilhouetteCueCount: visibleByCategory.massing_silhouette_cue ?? 0,
      visibleFrontageDensityCueCount: visibleByCategory.frontage_density_cue ?? 0,
    },
  };
}

function buildLocalEvidenceCueRuntimeAdapter(fixture, visibleRecords) {
  return {
    ...fixture,
    renderRecordOrder: visibleRecords.map((record) => record.enrichedCueId),
    renderRecords: visibleRecords,
    summary: {
      ...fixture.summary,
      visibleQaOnlyRecordCount: visibleRecords.length,
      normalModeRecordCount: 0,
      evidenceBackedQaCueCount: visibleRecords.filter((record) => record.qaOnlyStatus === "evidence_backed_qa_visual_reference").length,
      unsupportedCueCount: visibleRecords.filter((record) => Object.values(record.visualCueProfile ?? {}).includes("unsupported")).length,
    },
  };
}

function countRecordsByCandidateType(records) {
  return records.reduce((counts, record) => {
    counts[record.candidateType] = (counts[record.candidateType] ?? 0) + 1;
    return counts;
  }, {});
}

function countRecordsByCueCategory(records) {
  return records.reduce((counts, record) => {
    counts[record.cueCategory] = (counts[record.cueCategory] ?? 0) + 1;
    return counts;
  }, {});
}

function buildQAScaffoldPreviewRenderRecords(expansionFixture, seedAdapter) {
  const seedById = new Map((seedAdapter.renderRecords ?? []).map((record) => [record.recordId, record]));
  const records = [];

  for (const anchor of expansionFixture.buildingAnchors ?? []) {
    const containerSeed = seedById.get(anchor.containerSeedRecordId);
    const heightSeed = seedById.get(anchor.heightSeedRecordId);
    const anchorSuffix = anchor.anchorId.replace("p4o18-anchor-", "");

    if (containerSeed) {
      records.push(buildExpandedQAScaffoldRecord({
        seed: containerSeed,
        recordId: `p4o18-qa-scaffold-container-${anchorSuffix}`,
        targetRenderedObjectId: anchor.targetRenderedObjectId,
        displayLabel: "4O container",
        visualRole: "building_container_shell",
        paletteToken: anchor.corridorSide === "left" ? "qa_scaffold_container_manhattan" : "qa_scaffold_container_mid_corridor",
        placement: {
          anchorMode: "existing_runtime_building_centroid",
          heightMode: "existing_runtime_height_scaled_placeholder",
          widthMultiplier: anchor.widthMultiplier,
          depthMultiplier: anchor.depthMultiplier,
          heightMultiplier: anchor.containerHeightMultiplier,
          zOffsetByCorridorSide: anchor.zOffsetByCorridorSide,
        },
        expansionTrace: {
          phase: expansionFixture.phase,
          anchorId: anchor.anchorId,
          corridorSection: anchor.corridorSection,
          corridorSide: anchor.corridorSide,
          seedRecordId: anchor.containerSeedRecordId,
          sourceAnchorPolicy: "existing_runtime_anchor_only_no_new_source_access",
        },
      }));
    }

    if (heightSeed) {
      records.push(buildExpandedQAScaffoldRecord({
        seed: heightSeed,
        recordId: `p4o18-qa-scaffold-height-${anchorSuffix}`,
        targetRenderedObjectId: anchor.targetRenderedObjectId,
        displayLabel: "4O height",
        visualRole: "height_massing_cap",
        paletteToken: anchor.corridorSide === "left" ? "qa_scaffold_height_manhattan" : "qa_scaffold_height_mid_corridor",
        placement: {
          anchorMode: "existing_runtime_building_centroid",
          heightMode: "existing_runtime_height_scaled_placeholder",
          widthMultiplier: Math.max(anchor.widthMultiplier - 0.12, 0.72),
          depthMultiplier: anchor.depthMultiplier + 0.08,
          heightMultiplier: anchor.heightMultiplier,
          capHeight: 0.1,
          zOffsetByCorridorSide: anchor.zOffsetByCorridorSide + 0.03,
        },
        expansionTrace: {
          phase: expansionFixture.phase,
          anchorId: anchor.anchorId,
          corridorSection: anchor.corridorSection,
          corridorSide: anchor.corridorSide,
          seedRecordId: anchor.heightSeedRecordId,
          sourceAnchorPolicy: "existing_runtime_anchor_only_no_new_source_access",
        },
      }));
    }
  }

  for (const guide of expansionFixture.groundingGuides ?? []) {
    const seed = seedById.get(guide.seedRecordId);
    if (!seed) continue;
    const guideSuffix = guide.guideId.replace("p4o18-ground-", "");
    records.push(buildExpandedQAScaffoldRecord({
      seed,
      recordId: `p4o18-qa-scaffold-ground-${guideSuffix}`,
      targetRenderedObjectId: guide.targetRenderedObjectId,
      displayLabel: "4O ground",
      visualRole: "grounding_alignment_band",
      paletteToken: guide.guideRole.includes("endpoint") ? "qa_scaffold_grounding_endpoint" : "qa_scaffold_grounding_sidewalk",
      placement: {
        anchorMode: "existing_runtime_guide",
        guideRole: guide.guideRole,
        guideIndex: guide.guideIndex,
        xSpan: guide.xSpan,
        zSpan: guide.zSpan,
        xCenter: guide.xCenter,
        y: guide.y,
      },
      expansionTrace: {
        phase: expansionFixture.phase,
        guideId: guide.guideId,
        seedRecordId: guide.seedRecordId,
        sourceAnchorPolicy: "existing_runtime_guide_only_no_new_source_access",
      },
    }));
  }

  return records;
}

function buildExpandedQAScaffoldRecord({
  seed,
  recordId,
  targetRenderedObjectId,
  displayLabel,
  visualRole,
  paletteToken,
  placement,
  expansionTrace,
}) {
  return {
    recordType: "qa_scaffold_preview_record",
    recordId,
    derivedFromCandidateId: seed.derivedFromCandidateId,
    derivedFromMappingId: seed.derivedFromMappingId,
    derivedFromSeedRecordId: seed.recordId,
    candidateFamily: seed.candidateFamily,
    sourceLane: seed.sourceLane,
    renderStatus: "rendered_qa_only_candidate_placeholder",
    visualRole,
    displayLabel,
    targetRenderedObjectId,
    placement,
    legibility: seed.legibility,
    paletteToken,
    claimStatusLabels: seed.claimStatusLabels,
    normalModeExposure: "blocked",
    blockedClaims: seed.blockedClaims,
    expansionTrace,
  };
}

function filterQAScaffoldPreviewRecords(records, familyVisibility) {
  return records.filter((record) => {
    const family = record.legibility?.familyChip;
    return familyVisibility[family] !== false;
  });
}

function buildQAScaffoldPreviewRuntimeAdapter(expansionFixture, visibleRecords) {
  const recordOrder = visibleRecords.map((record) => record.recordId);
  return {
    ...expansionFixture,
    renderRecordOrder: recordOrder,
    renderRecords: visibleRecords,
    summary: {
      ...expansionFixture.summary,
      visibleQaOnlyRecordCount: visibleRecords.length,
      visibleBuildingContainerPreviewCount: visibleRecords.filter((record) => record.candidateFamily === "scaffold_building_container_candidate").length,
      visibleGroundingPreviewCount: visibleRecords.filter((record) => record.candidateFamily === "scaffold_grounding_candidate").length,
      visibleHeightMassingPreviewCount: visibleRecords.filter((record) => record.candidateFamily === "scaffold_height_massing_candidate").length,
    },
  };
}

function buildGeometryValidationIndex(report) {
  return new Map(report.buildingRecords.map((record) => [record.renderedObjectId, record]));
}

function buildCandidatePoiIndex(fixture) {
  const index = new Map();
  for (const candidate of fixture.candidates) {
    const targetId = candidate.reviewPlacement.targetRenderedObjectId;
    const records = index.get(targetId) ?? [];
    records.push(candidate);
    index.set(targetId, records);
  }
  return index;
}

function buildCornerAnchorCandidateIndex(fixture) {
  const index = new Map();
  for (const candidate of fixture.anchorCandidates) {
    const targetId = candidate.candidateGeometryContainerId;
    if (!targetId) continue;
    const records = index.get(targetId) ?? [];
    records.push(candidate);
    index.set(targetId, records);
  }
  return index;
}

function formatCueTiers(cue) {
  if (!cue?.geometryDerived) return "none";
  const { widthTier, heightTier, depthTier } = cue.geometryDerived;
  return `${widthTier} / ${heightTier} / ${depthTier}`;
}

function formatQAScaffoldFamilyVisibility(visibility) {
  return ["container", "grounding", "height"]
    .map((family) => `${family}:${visibility?.[family] !== false ? "on" : "off"}`)
    .join(" / ");
}

function formatQAFrontageCandidateTypeVisibility(visibility) {
  return qaFrontageCandidateFixture.candidateTypeAllowlist
    .map((candidateType) => `${formatCandidateTypeLabel(candidateType)}:${visibility?.[candidateType] !== false ? "on" : "off"}`)
    .join(" / ");
}

function formatQARecognizableCueCategoryVisibility(visibility) {
  return qaRecognizableAnchorCueFixture.cueCategoryAllowlist
    .map((cueCategory) => `${formatCueCategoryLabel(cueCategory)}:${visibility?.[cueCategory] !== false ? "on" : "off"}`)
    .join(" / ");
}

function formatCandidateTypeLabel(candidateType) {
  return candidateType
    .replace("_candidate", "")
    .replaceAll("_", " ");
}

function formatCueCategoryLabel(cueCategory) {
  return cueCategory
    .replace("_cue", "")
    .replaceAll("_", " ");
}

function formatPaletteFamilyLabel(paletteFamily) {
  return String(paletteFamily ?? "unsupported")
    .replaceAll("_", " ");
}

function formatSliceModules(facade) {
  if (!facade?.modules) return "none";
  const modules = facade.modules;
  const awnings = modules.awningSegments ? `${modules.awningSegments} awning-like` : "no awning-like";
  return `${modules.storefrontCadence.length} base beats / ${modules.entryPlaceholders} entries / ${modules.glassPlaceholders} glass / ${awnings}`;
}

function formatEvidenceCueTypes(record) {
  if (!record?.cues?.length) return "none";
  return record.cues
    .map((cue) => cue.cueType)
    .filter((cueType) => cueType !== "blocked-claim-readout" && cueType !== "palette-family")
    .join(" / ");
}

function formatDimensions(object) {
  if (!object?.dimensions) return "not applicable";
  const { width, depth, height } = object.dimensions;
  return `${formatMeasure(width)}w / ${formatMeasure(depth)}d / ${formatMeasure(height)}h scene units`;
}

function formatReasons(reasons) {
  if (!Array.isArray(reasons) || !reasons.length) return "none";
  return reasons.slice(0, 3).join(" / ");
}

function formatRelativeOrder(relativeOrder) {
  if (!relativeOrder) return "none";
  return `${relativeOrder.side} ${relativeOrder.index} of ${relativeOrder.countOnSide}`;
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
  evidenceFacadeCueIndex,
  corridorFacadeCueIndex,
  qaScaffoldPreviewIndex,
  qaFrontageCandidateIndex,
  qaRecognizableAnchorCueIndex,
  localEvidenceCueIndex,
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
    const evidenceFacadeCue = evidenceFacadeCueIndex.get(object.id);
    const corridorFacadeCue = corridorFacadeCueIndex.get(object.id);
    const qaScaffoldPreviewRecords = qaScaffoldPreviewIndex.get(object.id) ?? [];
    const qaFrontageCandidateRecords = qaFrontageCandidateIndex.get(object.id) ?? [];
    const qaRecognizableAnchorCueRecords = qaRecognizableAnchorCueIndex.get(object.id) ?? [];
    const localEvidenceCueRecords = localEvidenceCueIndex.get(object.id) ?? [];
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
    visual.userData.hasEvidenceFacade = Boolean(evidenceFacadeCue);
    visual.userData.hasCorridorFacadeCue = Boolean(corridorFacadeCue);
    visual.userData.stateRole = "massing";

    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(visual.geometry),
      new THREE.LineBasicMaterial({ color: palette.outline, transparent: true, opacity: 0.58 }),
    );
    outline.userData.semanticId = object.id;
    outline.userData.baseColor = palette.outline;
    outline.userData.qaColor = qaPalette.outline;
    outline.userData.corridorSide = object.corridorSide;
    outline.userData.hasEvidenceFacade = Boolean(evidenceFacadeCue);
    outline.userData.hasCorridorFacadeCue = Boolean(corridorFacadeCue);
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
    footprint.userData.hasEvidenceFacade = Boolean(evidenceFacadeCue);
    footprint.userData.hasCorridorFacadeCue = Boolean(corridorFacadeCue);
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
    anchorMarker.userData.hasEvidenceFacade = Boolean(evidenceFacadeCue);
    anchorMarker.userData.hasCorridorFacadeCue = Boolean(corridorFacadeCue);
    anchorMarker.userData.stateRole = "anchor";

    const group = new THREE.Group();
    group.add(base, visual, outline, footprint, marker, anchorMarker);
    if (facadeCue) group.add(createFacadeCueMarker(object, facadeCue));
    if (facadeCue && qaFacadeSlice && !evidenceFacadeCue) group.add(createQAFacadeSliceLayer(object, facadeCue, qaFacadeSlice));
    if (facadeCue && evidenceFacadeCue) group.add(createEvidenceInformedFacadeLayer(object, facadeCue, evidenceFacadeCue));
    if (facadeCue && corridorFacadeCue && !evidenceFacadeCue) group.add(createCorridorFacadeCueLayer(object, facadeCue, corridorFacadeCue));
    if (qaScaffoldPreviewRecords.length) group.add(createQAScaffoldPreviewLayer(object, qaScaffoldPreviewRecords));
    if (qaFrontageCandidateRecords.length) group.add(createQAFrontageCandidateLayer(object, qaFrontageCandidateRecords));
    if (qaRecognizableAnchorCueRecords.length) group.add(createQARecognizableAnchorCueLayer(object, qaRecognizableAnchorCueRecords));
    if (localEvidenceCueRecords.length) group.add(createLocalEvidenceCueLayer(object, localEvidenceCueRecords));

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

function addCandidatePoiMarkers(scene, runtimeScene, fixture, visualObjects) {
  const buildingsById = new Map(runtimeScene.buildings.map((building) => [building.id, building]));
  for (const candidate of fixture.candidates) {
    const target = buildingsById.get(candidate.reviewPlacement.targetRenderedObjectId);
    if (!target) continue;
    const offset = candidate.reviewPlacement.offset ?? { x: 0, z: 0.3 };
    const group = createCandidatePoiMarker(candidate, target, offset);
    scene.add(group);
    visualObjects.set(candidate.id, group);
  }
}

function createCandidatePoiMarker(candidate, target, offset) {
  const color = getCandidatePoiColor(candidate.claimState);
  const x = target.centroid.x + offset.x;
  const z = target.centroid.z + offset.z;
  const y = Math.max(target.height + 0.2, 1.05);
  const group = new THREE.Group();
  group.visible = false;
  group.userData.stateRole = "candidatePoi";
  group.userData.semanticId = candidate.id;

  const pin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.12, 0.48, 16),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  pin.position.set(x, y, z);
  pin.userData.stateRole = "candidatePoi";
  pin.userData.qaOpacity = 0.9;
  pin.userData.qaColor = color;

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.18, 0.26, 24),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, y - 0.28, z);
  ring.userData.stateRole = "candidatePoi";
  ring.userData.qaOpacity = 0.76;
  ring.userData.qaColor = color;

  const tether = createPolyline([
    { x: target.centroid.x, z: target.centroid.z },
    { x, z },
  ], {
    color,
    opacity: 0,
    y: Math.max(target.height + 0.08, 0.9),
  });
  tether.userData.stateRole = "candidatePoi";
  tether.userData.qaOpacity = 0.45;
  tether.userData.qaColor = color;
  tether.visible = false;

  const label = createTextSprite(candidate.displayLabel);
  label.position.set(x, y + 0.42, z);
  label.userData.stateRole = "candidatePoiLabel";
  label.userData.qaOpacity = 0.86;
  label.userData.qaColor = color;
  label.visible = false;

  group.add(pin, ring, tether, label);
  return group;
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
  const palette = getStreetFeelPalette(modules.draftPalette, modules.groundBaseTone);
  const group = new THREE.Group();

  addQAFacadeBox(group, {
    color: palette.facade,
    opacity: 0.62,
    position: [centerX, height / 2, z],
    size: [length, height, depth],
  });

  const splitY = clamp(height * modules.lowerSplitRatio, 0.18, height - 0.12);
  addQAFacadeBox(group, {
    color: palette.groundBase,
    opacity: 0.88,
    position: [centerX, splitY / 2, z + sideOffset * 0.18],
    size: [length * 0.98, splitY * 0.92, depth * 1.7],
  });

  const signY = clamp(height * modules.signBandRatio, 0.16, Math.max(splitY - 0.05, 0.18));
  addSignBandPlaceholders(group, { modules, palette, length, plane, signY, z, sideOffset, depth });

  addStreetBaseCadence(group, {
    modules,
    palette,
    length,
    plane,
    height,
    splitY,
    z,
    sideOffset,
    depth,
  });
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
    palette,
  });
  addBrickLikeDraftBlocks(group, {
    modules,
    palette,
    length,
    plane,
    height,
    splitY,
    z,
    sideOffset,
    depth,
  });
  addParapetTiers(group, {
    length,
    centerX,
    height,
    z,
    sideOffset,
    parapetTiers: modules.parapetTiers,
    palette,
  });
  addEndpointEmphasis(group, {
    plane,
    height,
    z,
    sideOffset,
    endpointEmphasis: modules.endpointEmphasis,
    palette,
  });
  addHumanScaleStreetCues(group, {
    modules,
    palette,
    length,
    plane,
    z,
    sideOffset,
  });

  group.userData.semanticId = object.id;
  group.userData.stateRole = "qaFacadeSlice";
  group.visible = false;
  return group;
}

function createEvidenceInformedFacadeLayer(object, cue, facadeRecord) {
  const plane = cue.geometryDerived.streetFacingPlane;
  const composition = getEvidenceComposition(facadeRecord);
  const sourceLength = Math.max(plane.xMax - plane.xMin, 0.2);
  const length = Math.max(sourceLength * composition.widthScale, 0.16);
  const sourceCenterX = plane.xMin + sourceLength / 2;
  const centerX = sourceCenterX + composition.lateralOffsetUnits;
  const renderPlane = {
    ...plane,
    xMin: centerX - length / 2,
    xMax: centerX + length / 2,
  };
  const height = Math.max(object.height, 0.58);
  const sideOffset = object.corridorSide === "left" ? 0.12 : -0.12;
  const z = plane.z + sideOffset * (0.8 + composition.recordSeparationIndex * composition.slotGapUnits * 0.16);
  const depth = composition.facadeThicknessUnits;
  const palette = getEvidenceFacadePalette(facadeRecord.paletteFamily);
  const group = new THREE.Group();

  addEvidenceSyntheticGrounding(group, {
    composition,
    palette,
    length,
    plane: renderPlane,
    z,
    sideOffset,
  });
  addEvidenceLayeredFacadeShell(group, {
    composition,
    palette,
    length,
    centerX,
    plane: renderPlane,
    height,
    z,
    sideOffset,
    depth,
  });

  for (const cueRecord of facadeRecord.cues) {
    if (cueRecord.cueType === "facade-rhythm") {
      addEvidenceFacadeRhythm(group, { cueRecord, composition, palette, length, plane: renderPlane, height, z, sideOffset, depth });
    } else if (cueRecord.cueType === "sign-band-zone") {
      addEvidenceSignBandZone(group, { cueRecord, composition, palette, length, plane: renderPlane, height, z, sideOffset, depth });
    } else if (cueRecord.cueType === "awning-canopy") {
      addEvidenceAwningCanopy(group, { cueRecord, composition, palette, length, plane: renderPlane, height, z, sideOffset });
    } else if (cueRecord.cueType === "window-glass-rhythm") {
      addEvidenceWindowGlassRhythm(group, { cueRecord, composition, palette, length, plane: renderPlane, height, z, sideOffset, depth });
    } else if (cueRecord.cueType === "corner-emphasis") {
      addEvidenceCornerEmphasis(group, { cueRecord, composition, palette, plane: renderPlane, height, z, sideOffset });
    } else if (cueRecord.cueType === "street-transit-detail-cue") {
      addEvidenceStreetDetailCues(group, { cueRecord, palette, length, plane: renderPlane, z, sideOffset });
    }
  }

  group.userData.semanticId = object.id;
  group.userData.stateRole = "evidenceFacadeCue";
  group.visible = false;
  return group;
}

function createCorridorFacadeCueLayer(object, cue, corridorRecord) {
  const group = new THREE.Group();
  group.userData.semanticId = object.id;
  group.userData.stateRole = "corridorFacadeCue";
  group.visible = false;

  if (corridorRecord.recordLane !== "mid_corridor_insufficient_evidence") return group;
  if (corridorRecord.renderStatus !== "rendered_qa_only_candidate_placeholder") return group;

  const plane = cue.geometryDerived.streetFacingPlane;
  const sourceLength = Math.max(plane.xMax - plane.xMin, 0.2);
  const placeholderWidthScale = 0.52;
  const length = Math.max(Math.min(sourceLength * placeholderWidthScale, 0.86), 0.16);
  const centerX = plane.xMin + sourceLength / 2;
  const sideOffset = object.corridorSide === "left" ? 0.11 : -0.11;
  const orderHint = corridorRecord.corridorOrderHint ?? 0;
  const separationOffset = ((orderHint % 3) - 1) * 0.012;
  const z = plane.z + sideOffset * (0.98 + separationOffset);
  const height = Math.max(object.height * 0.52, 0.34);
  const baseHeight = clamp(height * 0.3, 0.12, 0.34);
  const upperHeight = Math.max(height - baseHeight, 0.18);
  const bayCount = clampInteger(corridorRecord.qaCueGeometry?.bayPlaceholderCount, 2, 3, 2);
  const palette = getCorridorFacadePalette(corridorRecord);

  addCorridorFacadeBox(group, {
    color: palette.shadow,
    opacity: 0.035,
    position: [centerX, 0.018, z - sideOffset * 0.12],
    size: [length * 0.94, 0.022, 0.2],
  });
  addCorridorFacadeBox(group, {
    color: palette.body,
    opacity: 0.075,
    position: [centerX, height / 2, z - sideOffset * 0.05],
    size: [length, height, 0.11],
  });
  addCorridorFacadeBox(group, {
    color: palette.base,
    opacity: 0.105,
    position: [centerX, baseHeight / 2, z + sideOffset * 0.035],
    size: [length * 0.9, baseHeight, 0.055],
  });
  addCorridorFacadeBox(group, {
    color: palette.signBand,
    opacity: 0.14,
    position: [centerX, baseHeight + 0.032, z + sideOffset * 0.075],
    size: [length * 0.74, 0.04, 0.06],
  });

  const bayWidth = length / bayCount;
  for (let index = 0; index < bayCount; index += 1) {
    const x = centerX - length / 2 + bayWidth * index + bayWidth / 2;
    addCorridorFacadeBox(group, {
      color: palette.bay,
      opacity: 0.11,
      position: [x, baseHeight * 0.48, z + sideOffset * 0.085],
      size: [Math.max(bayWidth * 0.34, 0.04), Math.max(baseHeight * 0.44, 0.06), 0.04],
    });
  }

  const rowCount = corridorRecord.geometryDerived.heightTier === "tall" ? 2 : 1;
  for (let row = 0; row < rowCount; row += 1) {
    const y = baseHeight + upperHeight * (row + 0.55) / (rowCount + 0.2);
    for (let index = 0; index < bayCount; index += 1) {
      const x = centerX - length / 2 + bayWidth * index + bayWidth / 2;
      addCorridorFacadeBox(group, {
        color: palette.window,
        opacity: 0.085,
        position: [x, y, z + sideOffset * 0.085],
        size: [Math.max(bayWidth * 0.28, 0.035), 0.045, 0.035],
      });
    }
  }

  group.userData.corridorFacadeLane = corridorRecord.recordLane;
  group.userData.corridorFacadeStatus = corridorRecord.evidenceStatus;
  return group;
}

function createQAScaffoldPreviewLayer(object, records) {
  const group = new THREE.Group();
  group.userData.semanticId = object.id;
  group.userData.stateRole = "qaScaffoldPreview";
  group.visible = false;

  for (const record of records) {
    const placement = record.placement ?? {};
    const palette = getQAScaffoldPreviewPalette(record.paletteToken);
    const sideOffset = object.corridorSide === "left"
      ? placement.zOffsetByCorridorSide ?? 0.08
      : -(placement.zOffsetByCorridorSide ?? 0.08);
    const width = Math.max(object.dimensions.width * (placement.widthMultiplier ?? 1), 0.24);
    const depth = Math.max(object.dimensions.depth * (placement.depthMultiplier ?? 1), 0.18);

    if (record.visualRole === "building_container_shell") {
      const height = Math.max(object.height * (placement.heightMultiplier ?? 0.75), 0.42);
      addQAScaffoldPreviewBox(group, {
        color: palette.body,
        opacity: 0.28,
        position: [object.centroid.x, height / 2 + 0.02, object.centroid.z + sideOffset],
        size: [width, height, depth],
        outlineColor: palette.edge,
        outlineOpacity: 0.72,
      });
      addQAScaffoldPreviewBox(group, {
        color: palette.edge,
        opacity: 0.58,
        position: [object.centroid.x, height + 0.055, object.centroid.z + sideOffset],
        size: [width * 1.02, 0.045, Math.max(depth * 1.05, 0.2)],
      });
      addQAScaffoldPreviewLabel(group, {
        label: record.displayLabel ?? "4O container",
        color: palette.label,
        position: [object.centroid.x, height + 0.62, object.centroid.z + sideOffset + Math.sign(sideOffset || 1) * 0.22],
        tetherStart: [object.centroid.x, height + 0.08, object.centroid.z + sideOffset],
      });
    } else if (record.visualRole === "height_massing_cap") {
      const capHeight = placement.capHeight ?? 0.1;
      const y = Math.max(object.height * (placement.heightMultiplier ?? 1), 0.5) + capHeight / 2;
      addQAScaffoldPreviewBox(group, {
        color: palette.cap,
        opacity: 0.66,
        position: [object.centroid.x, y, object.centroid.z + sideOffset],
        size: [width, capHeight, depth],
        outlineColor: palette.edge,
        outlineOpacity: 0.82,
      });
      addQAScaffoldPreviewBox(group, {
        color: palette.edge,
        opacity: 0.4,
        position: [object.centroid.x, Math.max(y - 0.22, 0.3), object.centroid.z + sideOffset],
        size: [Math.max(width * 0.18, 0.08), 0.42, Math.max(depth * 1.1, 0.2)],
      });
      addQAScaffoldPreviewLabel(group, {
        label: record.displayLabel ?? "4O height",
        color: palette.label,
        position: [object.centroid.x, y + 0.48, object.centroid.z + sideOffset + Math.sign(sideOffset || 1) * 0.28],
        tetherStart: [object.centroid.x, y, object.centroid.z + sideOffset],
      });
    }
  }

  return group;
}

function addQAScaffoldGroundingPreview(scene, runtimeScene, records, visualObjects) {
  const guide = runtimeScene.guide;
  if (!guide) return;

  for (const record of records ?? []) {
    if (record.placement?.anchorMode !== "existing_runtime_guide") continue;
    const group = createQAScaffoldGroundingPreview(record, guide);
    scene.add(group);
    visualObjects.set(record.recordId, group);
  }
}

function createQAScaffoldGroundingPreview(record, guide) {
  const group = new THREE.Group();
  const placement = record.placement ?? {};
  const palette = getQAScaffoldPreviewPalette(record.paletteToken);
  group.visible = false;
  group.userData.semanticId = record.recordId;
  group.userData.stateRole = "qaScaffoldPreview";

  if (placement.guideRole === "manhattan_endpoint_band" || placement.guideRole === "franklin_endpoint_band") {
    const endpointBand = guide.endpointBands?.[placement.guideIndex] ?? guide.endpointBands?.[1];
    const pointA = endpointBand?.[0] ?? { x: 0, z: -1 };
    const pointB = endpointBand?.[1] ?? { x: 0, z: 1 };
    const x = pointA.x;
    const z = (pointA.z + pointB.z) / 2;
    addQAScaffoldPreviewBox(group, {
      color: palette.body,
      opacity: 0.46,
      position: [x, placement.y ?? 0.12, z],
      size: [placement.xSpan ?? 0.18, 0.055, placement.zSpan ?? Math.abs(pointB.z - pointA.z)],
      outlineColor: palette.edge,
      outlineOpacity: 0.82,
    });
    addQAScaffoldPreviewBox(group, {
      color: palette.edge,
      opacity: 0.62,
      position: [x, (placement.y ?? 0.12) + 0.06, z],
      size: [Math.max((placement.xSpan ?? 0.18) * 1.8, 0.18), 0.04, 0.22],
    });
    addQAScaffoldPreviewLabel(group, {
      label: record.displayLabel ?? "4O ground",
      color: palette.label,
      position: [x + (placement.guideRole === "franklin_endpoint_band" ? -0.45 : 0.45), 0.72, z - 0.78],
      tetherStart: [x, placement.y ?? 0.12, z],
    });
  } else if (placement.guideRole === "south_sidewalk_band" || placement.guideRole === "north_sidewalk_band") {
    const band = guide.sidewalkBands?.[placement.guideIndex] ?? guide.sidewalkBands?.[0];
    const zValues = (band ?? []).map((point) => point.z);
    const z = zValues.length ? zValues.reduce((sum, value) => sum + value, 0) / zValues.length : 1.08;
    addQAScaffoldPreviewBox(group, {
      color: palette.body,
      opacity: 0.42,
      position: [placement.xCenter ?? 0, placement.y ?? 0.12, z],
      size: [placement.xSpan ?? 2.2, 0.05, placement.zSpan ?? 0.44],
      outlineColor: palette.edge,
      outlineOpacity: 0.78,
    });
    addQAScaffoldPreviewBox(group, {
      color: palette.edge,
      opacity: 0.54,
      position: [placement.xCenter ?? 0, (placement.y ?? 0.12) + 0.055, z],
      size: [0.16, 0.04, placement.zSpan ?? 0.44],
    });
    addQAScaffoldPreviewLabel(group, {
      label: record.displayLabel ?? "4O ground",
      color: palette.label,
      position: [(placement.xCenter ?? 0) + 0.52, 0.7, z + 0.42],
      tetherStart: [placement.xCenter ?? 0, placement.y ?? 0.12, z],
    });
  } else if (placement.guideRole === "centerline_path_band") {
    const band = guide.pathBand ?? guide.streetPolygon;
    const z = averageGuideValue(band, "z", 0);
    const x = placement.xCenter ?? averageGuideValue(band, "x", 0);
    addQAScaffoldPreviewBox(group, {
      color: palette.body,
      opacity: 0.34,
      position: [x, placement.y ?? 0.13, z],
      size: [placement.xSpan ?? 8, 0.045, placement.zSpan ?? 0.18],
      outlineColor: palette.edge,
      outlineOpacity: 0.72,
    });
    addQAScaffoldPreviewLabel(group, {
      label: record.displayLabel ?? "4O ground",
      color: palette.label,
      position: [x - 0.72, 0.68, z - 0.5],
      tetherStart: [x, placement.y ?? 0.13, z],
    });
  } else if (placement.guideRole === "rhythm_tick_band") {
    const ticks = guide.rhythmTicks ?? [];
    for (const tick of ticks.filter((_, index) => index % 8 === 0).slice(0, 8)) {
      const x = averageGuideValue(tick, "x", 0);
      const z = averageGuideValue(tick, "z", 0);
      addQAScaffoldPreviewBox(group, {
        color: palette.edge,
        opacity: 0.5,
        position: [x, placement.y ?? 0.14, z],
        size: [0.08, 0.05, 0.36],
      });
    }
    addQAScaffoldPreviewLabel(group, {
      label: record.displayLabel ?? "4O ground",
      color: palette.label,
      position: [placement.xCenter ?? 0, 0.78, -1.22],
      tetherStart: [placement.xCenter ?? 0, placement.y ?? 0.14, -0.72],
    });
  }

  return group;
}

function createQAFrontageCandidateLayer(object, records) {
  const group = new THREE.Group();
  group.userData.semanticId = object.id;
  group.userData.stateRole = "qaFrontageCandidate";
  group.visible = false;

  const palette = getQAFrontageCandidatePalette(object.corridorSide);
  const sideSign = object.corridorSide === "left" ? 1 : -1;
  const width = Math.max(object.dimensions.width * 0.94, 0.28);
  const depth = Math.max(object.dimensions.depth, 0.22);
  const frontZ = object.centroid.z + sideSign * (depth * 0.58 + 0.08);
  const y = 0.18;

  for (const [index, record] of records.entries()) {
    const yOffset = y + index * 0.018;
    if (record.candidateType === "frontage_band_candidate") {
      addQAFrontageCandidateBox(group, {
        color: palette.band,
        opacity: 0.58,
        position: [object.centroid.x, yOffset, frontZ],
        size: [width, 0.055, 0.09],
      });
    } else if (record.candidateType === "bay_rhythm_candidate") {
      const tickCount = 4;
      for (let tickIndex = 0; tickIndex < tickCount; tickIndex += 1) {
        const t = tickCount === 1 ? 0.5 : tickIndex / (tickCount - 1);
        addQAFrontageCandidateBox(group, {
          color: palette.tick,
          opacity: 0.62,
          position: [object.centroid.x - width * 0.42 + width * 0.84 * t, yOffset + 0.11, frontZ],
          size: [0.045, 0.22, 0.075],
        });
      }
    } else if (record.candidateType === "corner_wrap_candidate") {
      const edgeSign = record.corridorSection.includes("franklin") ? -1 : 1;
      addQAFrontageCandidateBox(group, {
        color: palette.corner,
        opacity: 0.6,
        position: [object.centroid.x, yOffset + 0.02, frontZ],
        size: [width * 0.48, 0.06, 0.1],
      });
      addQAFrontageCandidateBox(group, {
        color: palette.corner,
        opacity: 0.5,
        position: [object.centroid.x + edgeSign * width * 0.28, yOffset + 0.03, object.centroid.z + sideSign * depth * 0.24],
        size: [0.09, 0.06, Math.max(depth * 0.5, 0.18)],
      });
    } else if (record.candidateType === "setback_depth_candidate") {
      addQAFrontageCandidateBox(group, {
        color: palette.depth,
        opacity: 0.46,
        position: [object.centroid.x, yOffset, frontZ],
        size: [width * 0.72, 0.05, 0.07],
      });
      addQAFrontageCandidateBox(group, {
        color: palette.depth,
        opacity: 0.34,
        position: [object.centroid.x, yOffset + 0.015, object.centroid.z + sideSign * depth * 0.18],
        size: [width * 0.54, 0.045, 0.07],
      });
      addQAFrontageCandidateBox(group, {
        color: palette.depth,
        opacity: 0.34,
        position: [object.centroid.x, yOffset + 0.04, object.centroid.z + sideSign * depth * 0.38],
        size: [0.055, 0.12, Math.max(depth * 0.34, 0.12)],
      });
    }
  }

  addQAFrontageCandidateLabel(group, {
    label: "4J candidates",
    color: palette.label,
    position: [object.centroid.x, Math.max(object.height * 0.52, 0.72), frontZ + sideSign * 0.2],
    tetherStart: [object.centroid.x, y, frontZ],
  });

  return group;
}

function addQAFrontageCandidateBox(group, { color, opacity, position, size }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size[0], size[1], size[2]),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  mesh.position.set(position[0], position[1], position[2]);
  mesh.userData.stateRole = "qaFrontageCandidate";
  mesh.userData.qaColor = color;
  mesh.userData.qaOpacity = opacity;
  mesh.visible = false;
  group.add(mesh);
}

function addQAFrontageCandidateLabel(group, { label, color, position, tetherStart }) {
  const sprite = createTextSprite(label, { color, background: "rgba(13, 24, 23, 0.78)" });
  sprite.position.set(position[0], position[1], position[2]);
  sprite.userData.stateRole = "qaFrontageCandidateLabel";
  sprite.userData.qaOpacity = 0.9;
  group.add(sprite);

  const tether = createPolyline([
    { x: tetherStart[0], z: tetherStart[2] },
    { x: position[0], z: position[2] },
  ], {
    color,
    opacity: 0.48,
    y: Math.max(tetherStart[1], 0.16),
  });
  tether.userData.stateRole = "qaFrontageCandidate";
  tether.userData.qaColor = color;
  tether.userData.qaOpacity = 0.48;
  group.add(tether);
}

function createQARecognizableAnchorCueLayer(object, records) {
  const group = new THREE.Group();
  group.userData.semanticId = object.id;
  group.userData.stateRole = "qaRecognizableAnchorCue";
  group.visible = false;

  const palette = getQARecognizableAnchorCuePalette(object.corridorSide);
  const sideSign = object.corridorSide === "left" ? 1 : -1;
  const width = Math.max(object.dimensions.width * 0.94, 0.28);
  const depth = Math.max(object.dimensions.depth, 0.22);
  const frontZ = object.centroid.z + sideSign * (depth * 0.62 + 0.15);
  const topY = Math.max(object.height + 0.08, 0.62);

  for (const [index, record] of records.entries()) {
    const yOffset = 0.28 + index * 0.026;
    const color = palette[record.cueCategory] ?? palette.default;
    if (record.cueCategory === "material_color_family_cue") {
      addQARecognizableAnchorCueBox(group, {
        color,
        opacity: 0.34,
        position: [object.centroid.x, Math.max(object.height * 0.42, 0.55), frontZ],
        size: [width * 0.88, Math.max(object.height * 0.18, 0.22), 0.1],
      });
    } else if (record.cueCategory === "facade_rhythm_cue") {
      const tickCount = 5;
      for (let tickIndex = 0; tickIndex < tickCount; tickIndex += 1) {
        const t = tickCount === 1 ? 0.5 : tickIndex / (tickCount - 1);
        addQARecognizableAnchorCueBox(group, {
          color,
          opacity: 0.5,
          position: [object.centroid.x - width * 0.42 + width * 0.84 * t, Math.max(object.height * 0.5, 0.62), frontZ + sideSign * 0.025],
          size: [0.035, Math.max(object.height * 0.32, 0.32), 0.07],
        });
      }
    } else if (record.cueCategory === "corner_composition_cue") {
      const edgeSign = record.corridorSection?.includes("franklin") ? -1 : 1;
      addQARecognizableAnchorCueBox(group, {
        color,
        opacity: 0.46,
        position: [object.centroid.x + edgeSign * width * 0.3, Math.max(object.height * 0.55, 0.62), frontZ],
        size: [0.1, Math.max(object.height * 0.62, 0.45), 0.1],
      });
      addQARecognizableAnchorCueBox(group, {
        color,
        opacity: 0.32,
        position: [object.centroid.x + edgeSign * width * 0.26, Math.max(object.height * 0.34, 0.42), object.centroid.z + sideSign * depth * 0.24],
        size: [0.08, Math.max(object.height * 0.34, 0.28), Math.max(depth * 0.48, 0.18)],
      });
    } else if (record.cueCategory === "frontage_density_cue") {
      const dashCount = 6;
      for (let dashIndex = 0; dashIndex < dashCount; dashIndex += 1) {
        const t = dashCount === 1 ? 0.5 : dashIndex / (dashCount - 1);
        addQARecognizableAnchorCueBox(group, {
          color,
          opacity: 0.42,
          position: [object.centroid.x - width * 0.44 + width * 0.88 * t, yOffset, frontZ + sideSign * 0.05],
          size: [0.055, 0.1, 0.05],
        });
      }
    } else if (record.cueCategory === "massing_silhouette_cue") {
      addQARecognizableAnchorCueBox(group, {
        color,
        opacity: 0.38,
        position: [object.centroid.x, topY, object.centroid.z],
        size: [width * 0.86, 0.055, Math.max(depth * 0.42, 0.14)],
      });
    } else if (record.cueCategory === "sidewalk_street_cue") {
      addQARecognizableAnchorCueBox(group, {
        color,
        opacity: 0.36,
        position: [object.centroid.x, 0.075, frontZ + sideSign * 0.12],
        size: [width * 0.92, 0.035, 0.16],
      });
    } else if (record.cueCategory === "subway_or_street_furniture_cue") {
      addQARecognizableAnchorCuePost(group, {
        color,
        opacity: 0.5,
        position: [object.centroid.x + width * 0.32, 0.34, frontZ + sideSign * 0.16],
      });
    }
  }

  addQARecognizableAnchorCueLabel(group, {
    label: "4K cues",
    color: palette.label,
    position: [object.centroid.x, Math.max(object.height * 0.72, 0.92), frontZ + sideSign * 0.34],
    tetherStart: [object.centroid.x, 0.28, frontZ],
  });

  return group;
}

function addQARecognizableAnchorCueBox(group, { color, opacity, position, size }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size[0], size[1], size[2]),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
  mesh.position.set(position[0], position[1], position[2]);
  mesh.userData.stateRole = "qaRecognizableAnchorCue";
  mesh.userData.qaColor = color;
  mesh.userData.qaOpacity = opacity;
  group.add(mesh);
}

function addQARecognizableAnchorCuePost(group, { color, opacity, position }) {
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
  post.position.set(position[0], position[1], position[2]);
  post.userData.stateRole = "qaRecognizableAnchorCue";
  post.userData.qaColor = color;
  post.userData.qaOpacity = opacity;

  const cap = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.12, 16),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: Math.min(opacity + 0.1, 0.72),
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  cap.rotation.x = -Math.PI / 2;
  cap.position.set(position[0], position[1] + 0.26, position[2]);
  cap.userData.stateRole = "qaRecognizableAnchorCue";
  cap.userData.qaColor = color;
  cap.userData.qaOpacity = Math.min(opacity + 0.1, 0.72);

  group.add(post, cap);
}

function addQARecognizableAnchorCueLabel(group, { label, color, position, tetherStart }) {
  const sprite = createTextSprite(label, { color, background: "rgba(14, 18, 24, 0.78)" });
  sprite.position.set(position[0], position[1], position[2]);
  sprite.userData.stateRole = "qaRecognizableAnchorCueLabel";
  sprite.userData.qaOpacity = 0.9;
  group.add(sprite);

  const tether = createPolyline([
    { x: tetherStart[0], z: tetherStart[2] },
    { x: position[0], z: position[2] },
  ], {
    color,
    opacity: 0.42,
    y: Math.max(tetherStart[1], 0.16),
  });
  tether.userData.stateRole = "qaRecognizableAnchorCue";
  tether.userData.qaColor = color;
  tether.userData.qaOpacity = 0.42;
  group.add(tether);
}

function createLocalEvidenceCueLayer(object, records) {
  const group = new THREE.Group();
  group.userData.semanticId = object.id;
  group.userData.stateRole = "localEvidenceCue";
  group.visible = false;

  const record = records[0];
  const profile = record.visualCueProfile ?? {};
  const palette = getLocalEvidenceCuePalette(profile.paletteFamily);
  const sideSign = object.corridorSide === "left" ? 1 : -1;
  const width = Math.max(object.dimensions.width * 0.92, 0.34);
  const depth = Math.max(object.dimensions.depth, 0.24);
  const frontZ = object.centroid.z + sideSign * (depth * 0.68 + 0.2);
  const baseY = Math.max(object.height * 0.22, 0.28);
  const upperY = Math.max(object.height * 0.62, 0.68);
  const bayCount = parseCoarseCount(profile.storefrontBayRhythm, profile.facadeRhythm?.bayCount, 4);
  const rowCount = parseCoarseCount(profile.windowGlassRhythm, profile.facadeRhythm?.upperRows, 2);

  addLocalEvidenceCueBox(group, {
    color: palette.body,
    opacity: 0.52,
    position: [object.centroid.x, upperY, frontZ],
    size: [width * 0.9, Math.max(object.height * 0.42, 0.36), 0.11],
  });
  addLocalEvidenceCueBox(group, {
    color: palette.base,
    opacity: 0.64,
    position: [object.centroid.x, baseY, frontZ + sideSign * 0.02],
    size: [width * 0.92, Math.max(object.height * 0.22, 0.2), 0.13],
  });
  addLocalEvidenceCueBox(group, {
    color: palette.signBand,
    opacity: 0.74,
    position: [object.centroid.x, Math.max(object.height * 0.42, 0.48), frontZ + sideSign * 0.055],
    size: [width * 0.9, 0.08, 0.08],
  });

  for (let index = 0; index < bayCount; index += 1) {
    const t = bayCount === 1 ? 0.5 : index / (bayCount - 1);
    const x = object.centroid.x - width * 0.42 + width * 0.84 * t;
    addLocalEvidenceCueBox(group, {
      color: palette.bay,
      opacity: 0.72,
      position: [x, baseY + 0.02, frontZ + sideSign * 0.09],
      size: [0.045, Math.max(object.height * 0.26, 0.22), 0.075],
    });
  }

  for (let row = 0; row < rowCount; row += 1) {
    const y = Math.max(object.height * (0.54 + row * 0.16), 0.62 + row * 0.12);
    for (let index = 0; index < Math.min(bayCount, 5); index += 1) {
      const t = bayCount === 1 ? 0.5 : index / (bayCount - 1);
      const x = object.centroid.x - width * 0.38 + width * 0.76 * t;
      addLocalEvidenceCueBox(group, {
        color: palette.window,
        opacity: 0.68,
        position: [x, y, frontZ + sideSign * 0.1],
        size: [Math.max(width / Math.max(bayCount, 4) * 0.22, 0.045), 0.07, 0.045],
      });
    }
  }

  if (profile.cornerWrapSideReturn !== "unsupported") {
    const edgeSign = record.cornerScope === "franklin_greenpoint" ? -1 : 1;
    addLocalEvidenceCueBox(group, {
      color: palette.return,
      opacity: 0.56,
      position: [object.centroid.x + edgeSign * width * 0.44, Math.max(object.height * 0.5, 0.55), object.centroid.z + sideSign * depth * 0.2],
      size: [0.08, Math.max(object.height * 0.58, 0.42), Math.max(depth * 0.58, 0.18)],
    });
  }

  if (profile.setbackDepthCue !== "unsupported") {
    addLocalEvidenceCueBox(group, {
      color: palette.depth,
      opacity: 0.38,
      position: [object.centroid.x, 0.12, object.centroid.z + sideSign * depth * 0.28],
      size: [width * 0.72, 0.035, Math.max(depth * 0.48, 0.16)],
    });
  }

  addLocalEvidenceCueBox(group, {
    color: palette.ground,
    opacity: 0.5,
    position: [object.centroid.x, 0.08, frontZ + sideSign * 0.2],
    size: [width * 1.05, 0.035, 0.16],
  });

  addLocalEvidenceCueLabel(group, {
    label: "4L local evidence",
    color: palette.label,
    position: [object.centroid.x, Math.max(object.height * 0.88, 1.05), frontZ + sideSign * 0.34],
    tetherStart: [object.centroid.x, Math.max(object.height * 0.48, 0.5), frontZ],
  });

  group.userData.localEvidenceCueStatus = record.qaOnlyStatus;
  group.userData.localEvidenceCueRefs = record.evidenceIds?.length ?? 0;
  return group;
}

function addLocalEvidenceCueBox(group, { color, opacity, position, size }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size[0], size[1], size[2]),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
  mesh.position.set(position[0], position[1], position[2]);
  mesh.userData.stateRole = "localEvidenceCue";
  mesh.userData.qaColor = color;
  mesh.userData.qaOpacity = opacity;
  group.add(mesh);
}

function addLocalEvidenceCueLabel(group, { label, color, position, tetherStart }) {
  const sprite = createTextSprite(label, { color, background: "rgba(18, 23, 19, 0.82)" });
  sprite.position.set(position[0], position[1], position[2]);
  sprite.userData.stateRole = "localEvidenceCueLabel";
  sprite.userData.qaOpacity = 0.92;
  sprite.userData.qaColor = color;
  sprite.visible = false;
  group.add(sprite);

  const tether = createPolyline([
    { x: tetherStart[0], z: tetherStart[2] },
    { x: position[0], z: position[2] },
  ], {
    color,
    opacity: 0,
    y: Math.max(tetherStart[1], 0.2),
  });
  tether.userData.stateRole = "localEvidenceCue";
  tether.userData.qaColor = color;
  tether.userData.qaOpacity = 0.44;
  tether.visible = false;
  group.add(tether);
}

function parseCoarseCount(...values) {
  for (const value of values) {
    const match = String(value ?? "").match(/coarse_(\d+)/);
    if (match) return Number(match[1]);
  }
  return 4;
}

function averageGuideValue(points, key, fallback) {
  if (!Array.isArray(points) || !points.length) return fallback;
  return points.reduce((sum, point) => sum + (point[key] ?? 0), 0) / points.length;
}

function getCorridorFacadePalette(corridorRecord) {
  if (corridorRecord.corridorSide === "left") {
    return {
      shadow: 0x0b1211,
      body: 0x6f8f88,
      base: 0x31423f,
      signBand: 0x9fb7a9,
      bay: 0xc0cdbf,
      window: 0xd8e2d3,
    };
  }
  return {
    shadow: 0x0b1114,
    body: 0x7b829b,
    base: 0x333a51,
    signBand: 0xb8aa80,
    bay: 0xcfc4a0,
    window: 0xd9dfda,
  };
}

function getQAScaffoldPreviewPalette(token) {
  const palettes = {
    qa_scaffold_container_manhattan: {
      body: 0x2fc0ad,
      edge: 0xffd76f,
      cap: 0xf0c96a,
      label: 0xffd76f,
    },
    qa_scaffold_container_mid_corridor: {
      body: 0x6fa4ff,
      edge: 0xffd76f,
      cap: 0xd5bd76,
      label: 0xffd76f,
    },
    qa_scaffold_grounding_endpoint: {
      body: 0xffbd5f,
      edge: 0x88f0dd,
      cap: 0xc8a85a,
      label: 0x88f0dd,
    },
    qa_scaffold_grounding_sidewalk: {
      body: 0x88f0dd,
      edge: 0xffbd5f,
      cap: 0x7bd2bd,
      label: 0x88f0dd,
    },
    qa_scaffold_height_manhattan: {
      body: 0x4eb3a5,
      edge: 0xffee8a,
      cap: 0xffee8a,
      label: 0xffee8a,
    },
    qa_scaffold_height_mid_corridor: {
      body: 0x7193d1,
      edge: 0xffee8a,
      cap: 0xffee8a,
      label: 0xffee8a,
    },
  };
  return palettes[token] ?? palettes.qa_scaffold_container_mid_corridor;
}

function getQAFrontageCandidatePalette(corridorSide) {
  if (corridorSide === "left") {
    return {
      band: 0xff8f70,
      tick: 0xffd36f,
      corner: 0x91e4c3,
      depth: 0x9cc8ff,
      label: 0xffd36f,
    };
  }
  return {
    band: 0xe88fcf,
    tick: 0xffd36f,
    corner: 0x91e4c3,
    depth: 0x9cc8ff,
    label: 0xffd36f,
  };
}

function getQARecognizableAnchorCuePalette(corridorSide) {
  const shared = {
    corner_composition_cue: 0xffd36f,
    sidewalk_street_cue: 0x96c6b8,
    subway_or_street_furniture_cue: 0x86a8ff,
    facade_rhythm_cue: 0xf0a36e,
    material_color_family_cue: 0xc77565,
    massing_silhouette_cue: 0xd9c890,
    frontage_density_cue: 0xa7d879,
    label: 0xffd36f,
    default: 0xf0c96a,
  };
  if (corridorSide === "left") return shared;
  return {
    ...shared,
    material_color_family_cue: 0xd58fa8,
    frontage_density_cue: 0x84d3b0,
  };
}

function getLocalEvidenceCuePalette(paletteFamily) {
  const palettes = {
    warm_red_brick_dark_base: { body: 0xb75f4c, base: 0x2b2a28, signBand: 0xd6b57a, bay: 0xf0c27b, window: 0xded6c8, return: 0x8f4f42, depth: 0x73534b, ground: 0x8fb8a6, label: 0xffd98b },
    bright_panel_silver_gray: { body: 0xd8d2c3, base: 0x565d61, signBand: 0xe7c85f, bay: 0xcfd8d8, window: 0xf2efe5, return: 0xa9a796, depth: 0x7d8587, ground: 0x9fc0b3, label: 0xf3d36c },
    pale_stone_red_trim: { body: 0xd1c3a5, base: 0x73585c, signBand: 0xbf6e57, bay: 0xe2d6be, window: 0xf0efe5, return: 0xa27b68, depth: 0x8c7568, ground: 0x94b7a2, label: 0xf1c584 },
    weathered_brick_wood_green: { body: 0x8f6a52, base: 0x3f5d4d, signBand: 0x9a8058, bay: 0xbba06d, window: 0xd6d7c6, return: 0x6d5b48, depth: 0x5d5146, ground: 0x8cad9a, label: 0xd7c27f },
    dark_brick_black_base: { body: 0x5b3f3b, base: 0x181b1b, signBand: 0x5f705f, bay: 0xa49172, window: 0xc8cbc1, return: 0x4b3634, depth: 0x3a3330, ground: 0x89ab96, label: 0xd2c282 },
    red_brick_stone_cornice: { body: 0xa95543, base: 0x5a463f, signBand: 0xb99c75, bay: 0xd2b17b, window: 0xe4dfd1, return: 0x7d453b, depth: 0x5f4840, ground: 0x92b29f, label: 0xeacb88 },
  };
  return palettes[paletteFamily] ?? palettes.warm_red_brick_dark_base;
}

function getEvidenceComposition(facadeRecord) {
  const composition = facadeRecord.qaComposition ?? {};
  return {
    compositionStatus: composition.compositionStatus ?? "qa_only_composition_metadata",
    evidenceFacadeRole: composition.evidenceFacadeRole ?? "evidence-informed-qa-facade",
    syntheticContextRole: composition.syntheticContextRole ?? "non-evidence-placeholder-context",
    recordSeparationIndex: clampInteger(composition.recordSeparationIndex, 0, 8, 0),
    recordSeparationCount: clampInteger(composition.recordSeparationCount, 1, 8, 1),
    lateralOffsetUnits: clampNumber(composition.lateralOffsetUnits, -1.2, 1.2, 0),
    streetwallSlot: composition.streetwallSlot ?? "unassigned-slot",
    slotGapUnits: clampNumber(composition.slotGapUnits, 0.18, 1, 0.22),
    footprintDepthUnits: clampNumber(composition.footprintDepthUnits, 0.44, 2, 0.6),
    facadeThicknessUnits: clampNumber(composition.facadeThicknessUnits, 0.08, 0.4, 0.1),
    cornerReturnDepthUnits: clampNumber(composition.cornerReturnDepthUnits, 0.32, 2, 0.44),
    storefrontSetbackUnits: clampNumber(composition.storefrontSetbackUnits, 0.06, 0.32, 0.12),
    signBandDepthUnits: clampNumber(composition.signBandDepthUnits, 0.08, 0.36, 0.16),
    windowReliefDepthUnits: clampNumber(composition.windowReliefDepthUnits, 0.04, 0.22, 0.08),
    parapetDepthUnits: clampNumber(composition.parapetDepthUnits, 0.04, 0.24, 0.1),
    corniceProjectionUnits: clampNumber(composition.corniceProjectionUnits, 0.08, 0.32, 0.12),
    streetEdgeAlignment: composition.streetEdgeAlignment ?? "qa_streetwall",
    groundPlaneExtent: {
      sidewalkDepthUnits: clampNumber(composition.groundPlaneExtent?.sidewalkDepthUnits, 0.36, 1.2, 0.52),
      curbDepthUnits: clampNumber(composition.groundPlaneExtent?.curbDepthUnits, 0.04, 0.18, 0.08),
      streetDepthUnits: clampNumber(composition.groundPlaneExtent?.streetDepthUnits, 0.42, 1.4, 0.62),
    },
    contextVisibilityPolicy: composition.contextVisibilityPolicy ?? "synthetic_context_low_contrast_outline_only",
    widthScale: clampNumber(composition.widthScale, 0.45, 1.2, 0.82),
    depthProfile: composition.depthProfile ?? "layered-qa-facade",
    basePlaneRatio: clampNumber(composition.basePlaneRatio, 0.22, 0.5, 0.34),
    upperPlaneRatio: clampNumber(composition.upperPlaneRatio, 0.5, 0.78, 0.66),
    storefrontRecessDepth: clampNumber(composition.storefrontRecessDepth, 0, 0.2, 0.06),
    upperProjectionDepth: clampNumber(composition.upperProjectionDepth, 0, 0.16, 0.04),
    signBandProjectionDepth: clampNumber(composition.signBandProjectionDepth, 0.04, 0.22, 0.1),
    sideReturn: {
      enabled: composition.sideReturn?.enabled === true,
      edge: composition.sideReturn?.edge === "right" ? "right" : "left",
      depthUnits: clampNumber(composition.sideReturn?.depthUnits, 0, 0.7, 0.24),
      widthRatio: clampNumber(composition.sideReturn?.widthRatio, 0.05, 0.28, 0.12),
    },
    grounding: {
      sidewalk: composition.grounding?.sidewalk === true,
      curb: composition.grounding?.curb === true,
      crosswalk: composition.grounding?.crosswalk === true,
    },
    renderLegibility: {
      primaryMassOpacity: clampNumber(composition.renderLegibility?.primaryMassOpacity, 0.92, 1, 1),
      frontFaceOpacity: clampNumber(composition.renderLegibility?.frontFaceOpacity, 0.92, 1, 0.98),
      returnWallOpacity: clampNumber(composition.renderLegibility?.returnWallOpacity, 0.92, 1, 1),
      baseOpacity: clampNumber(composition.renderLegibility?.baseOpacity, 0.92, 1, 1),
      groundContactOpacity: clampNumber(composition.renderLegibility?.groundContactOpacity, 0.74, 1, 0.84),
      minimumRenderedGapUnits: clampNumber(composition.renderLegibility?.minimumRenderedGapUnits, 0.12, 1, 0.12),
      silhouetteHierarchy: Array.isArray(composition.renderLegibility?.silhouetteHierarchy)
        ? composition.renderLegibility.silhouetteHierarchy
        : [],
    },
  };
}

function addEvidenceLayeredFacadeShell(group, { composition, palette, length, centerX, plane, height, z, sideOffset, depth }) {
  const baseHeight = clamp(height * composition.basePlaneRatio, 0.18, height * 0.58);
  const upperHeight = Math.max(height - baseHeight, 0.18);
  const footprintDepth = composition.footprintDepthUnits;
  const wallThickness = composition.facadeThicknessUnits;
  const bodyZ = z - sideOffset * (footprintDepth / 2);
  const baseZ = z - sideOffset * composition.storefrontSetbackUnits;
  const upperZ = z - sideOffset * Math.max(composition.upperProjectionDepth, wallThickness * 0.25);

  addSyntheticContextBox(group, {
    color: 0x060707,
    opacity: 0.24,
    position: [centerX + 0.04, 0.01, bodyZ - sideOffset * 0.03],
    size: [length * 1.05, 0.018, footprintDepth * 1.04],
  });

  addEvidenceFacadeBox(group, {
    color: palette.body,
    opacity: composition.renderLegibility.primaryMassOpacity,
    position: [centerX, height / 2, bodyZ],
    size: [length, height, footprintDepth],
  });

  addEvidenceFacadeBox(group, {
    color: palette.base,
    opacity: composition.renderLegibility.baseOpacity,
    position: [centerX, baseHeight / 2, baseZ],
    size: [length * 0.9, baseHeight, wallThickness * 1.35],
  });
  addEvidenceFacadeBox(group, {
    color: palette.facade,
    opacity: composition.renderLegibility.frontFaceOpacity,
    position: [centerX, baseHeight + upperHeight / 2, upperZ],
    size: [length * 0.96, upperHeight, wallThickness * 1.15],
  });
  addEvidenceFacadeBox(group, {
    color: palette.trim,
    opacity: 0.96,
    position: [centerX, baseHeight + 0.018, z + sideOffset * (composition.signBandDepthUnits * 0.45)],
    size: [length * 1.02, 0.035, wallThickness + composition.signBandDepthUnits],
  });
  addEvidenceFacadeBox(group, {
    color: palette.cornice,
    opacity: 1,
    position: [centerX, height + composition.parapetDepthUnits * 0.55, z + sideOffset * composition.corniceProjectionUnits * 0.5],
    size: [length * 1.06, composition.parapetDepthUnits, wallThickness + composition.corniceProjectionUnits],
  });

  if (composition.sideReturn.enabled) {
    const returnDepth = composition.cornerReturnDepthUnits;
    const returnWidth = Math.max(length * composition.sideReturn.widthRatio, 0.05);
    const edgeX = composition.sideReturn.edge === "right" ? plane.xMax : plane.xMin;
    const returnX = edgeX + (composition.sideReturn.edge === "right" ? -returnWidth / 2 : returnWidth / 2);
    addEvidenceFacadeBox(group, {
      color: palette.returnWall,
      opacity: composition.renderLegibility.returnWallOpacity,
      position: [
        returnX,
        height / 2,
        z - sideOffset * (returnDepth / 2),
      ],
      size: [returnWidth, height * 0.96, returnDepth],
    });
    addEvidenceFacadeBox(group, {
      color: palette.corner,
      opacity: 1,
      position: [edgeX, height / 2, z - sideOffset * (returnDepth * 0.42)],
      size: [0.065, height + 0.12, returnDepth * 0.92],
    });
  }
}

function addEvidenceFacadeRhythm() {
  // 4E-5 suppresses fine facade rhythm so endpoint volumes stay visually clear.
}

function addEvidenceSignBandZone(group, { cueRecord, composition, palette, length, plane, height, z, sideOffset, depth }) {
  const y = clamp(height * cueRecord.heightRatio, 0.16, Math.max(height * 0.58, 0.22));
  const segmentCount = clampInteger(cueRecord.segmentCount, 1, 6, 2);
  const segmentWidth = length / segmentCount;
  for (let index = 0; index < segmentCount; index += 1) {
    const x = plane.xMin + segmentWidth * index + segmentWidth / 2;
    addEvidenceFacadeBox(group, {
      color: index % 2 ? palette.signAlt : palette.sign,
      opacity: 1,
      position: [x, y, z + sideOffset * (depth + composition.signBandDepthUnits * 0.65)],
      size: [Math.max(segmentWidth * 0.68, 0.08), 0.115, Math.max(composition.signBandDepthUnits * 0.7, 0.06)],
    });
  }

  if (cueRecord.wrapsCorner) {
    addEvidenceFacadeBox(group, {
      color: palette.sign,
      opacity: 1,
      position: [plane.xMin, y + 0.03, z + sideOffset * (depth + composition.signBandDepthUnits * 0.65)],
      size: [0.07, 0.18, Math.max(composition.signBandDepthUnits * 0.72, 0.06)],
    });
    addEvidenceFacadeBox(group, {
      color: palette.signAlt,
      opacity: 1,
      position: [plane.xMax, y + 0.03, z + sideOffset * (depth + composition.signBandDepthUnits * 0.65)],
      size: [0.07, 0.18, Math.max(composition.signBandDepthUnits * 0.72, 0.06)],
    });
  }
}

function addEvidenceAwningCanopy(group, { cueRecord, composition, palette, length, plane, height, z, sideOffset }) {
  const segmentCount = clampInteger(cueRecord.segmentCount, 1, 5, 2);
  const segmentWidth = length / segmentCount;
  const y = clamp(height * 0.22, 0.12, 0.42);
  for (let index = 0; index < segmentCount; index += 1) {
    const x = plane.xMin + segmentWidth * index + segmentWidth / 2;
    addEvidenceFacadeBox(group, {
      color: index % 2 ? palette.awningAlt : palette.awning,
      opacity: 1,
      position: [x, y, z + sideOffset * (composition.signBandDepthUnits + 0.08)],
      size: [Math.max(segmentWidth * 0.68, 0.08), 0.075, composition.signBandDepthUnits * 0.72],
    });
  }
}

function addEvidenceWindowGlassRhythm() {
  // 4E-5 prioritizes opaque architectural massing over opening rhythm fidelity.
}

function addEvidenceCornerEmphasis(group, { cueRecord, composition, palette, plane, height, z, sideOffset }) {
  const edge = cueRecord.edge === "right" ? plane.xMax : plane.xMin;
  const strength = cueRecord.strength === "strong" ? 1 : 0.72;
  addEvidenceFacadeBox(group, {
    color: palette.corner,
    opacity: 1,
    position: [edge, height / 2, z - sideOffset * composition.cornerReturnDepthUnits * 0.35],
    size: [0.09 * strength, height + 0.14, composition.cornerReturnDepthUnits * 0.72],
  });
  addEvidenceFacadeBox(group, {
    color: palette.cornice,
    opacity: 1,
    position: [edge, height + 0.12, z + sideOffset * composition.corniceProjectionUnits * 0.4],
    size: [0.18 * strength, 0.08, composition.corniceProjectionUnits + 0.08],
  });
}

function addEvidenceSyntheticGrounding(group, { composition, palette, length, plane, z, sideOffset }) {
  if (!composition.grounding.sidewalk && !composition.grounding.curb && !composition.grounding.crosswalk) return;
  const centerX = plane.xMin + length / 2;
  const sidewalkDepth = composition.groundPlaneExtent.sidewalkDepthUnits;
  const curbDepth = composition.groundPlaneExtent.curbDepthUnits;
  const streetDepth = composition.groundPlaneExtent.streetDepthUnits;
  const sidewalkZ = z + sideOffset * (sidewalkDepth / 2);
  if (composition.grounding.sidewalk) {
    addEvidenceFacadeBox(group, {
      color: 0x84918b,
      opacity: composition.renderLegibility.groundContactOpacity,
      position: [centerX, 0.012, sidewalkZ],
      size: [length * 1.28, 0.03, sidewalkDepth],
    });
  }
  if (composition.grounding.curb) {
    addEvidenceFacadeBox(group, {
      color: palette.crosswalk,
      opacity: 0.92,
      position: [centerX, 0.045, z + sideOffset * (sidewalkDepth + curbDepth / 2)],
      size: [length * 1.24, 0.04, curbDepth],
    });
    addEvidenceFacadeBox(group, {
      color: 0x202b2a,
      opacity: 0.86,
      position: [centerX, 0.006, z + sideOffset * (sidewalkDepth + curbDepth + streetDepth / 2)],
      size: [length * 1.34, 0.018, streetDepth],
    });
  }
  if (composition.grounding.crosswalk) {
    for (let index = 0; index < 4; index += 1) {
      addEvidenceFacadeBox(group, {
        color: palette.crosswalk,
        opacity: 0.9,
        position: [plane.xMin + length * (0.12 + index * 0.08), 0.038, z + sideOffset * (sidewalkDepth + curbDepth + 0.18 + index * 0.07)],
        size: [0.16, 0.026, 0.045],
      });
    }
  }
}

function addEvidenceStreetDetailCues() {
  // 4E-5 keeps small street fixtures out of the primary facade silhouette.
  return;
}

function addStreetBaseCadence(group, { modules, palette, length, plane, height, splitY, z, sideOffset, depth }) {
  const usableHeight = Math.max(splitY - 0.08, 0.18);
  const cadence = normalizeCadence(modules.storefrontCadence);
  let cursor = plane.xMin;
  for (let index = 0; index < cadence.length; index += 1) {
    const segmentWidth = length * cadence[index];
    const segmentCenterX = cursor + segmentWidth / 2;
    const isEntry = index < modules.entryPlaceholders || (index === cadence.length - 1 && modules.entryPlaceholders > 1);
    const glassHeight = isEntry ? usableHeight * 0.58 : usableHeight * 0.44;
    const glassY = isEntry ? usableHeight * 0.48 : usableHeight * 0.58;

    addQAFacadeBox(group, {
      color: palette.glass,
      opacity: isEntry ? 0.76 : 0.62,
      position: [segmentCenterX, glassY, z + sideOffset * 0.42],
      size: [Math.max(segmentWidth * 0.58, 0.045), glassHeight, depth * 1.9],
    });

    if (isEntry) {
      addQAFacadeBox(group, {
        color: palette.entry,
        opacity: 0.86,
        position: [segmentCenterX, usableHeight * 0.38, z + sideOffset * 0.55],
        size: [Math.max(segmentWidth * 0.32, 0.04), usableHeight * 0.72, depth * 2.2],
      });
    }

    cursor += segmentWidth;
    if (index < cadence.length - 1) {
      addQAFacadeBox(group, {
        color: palette.seam,
        opacity: 0.9,
        position: [cursor, usableHeight / 2, z + sideOffset * 0.62],
        size: [0.026, usableHeight * 0.96, depth * 2.25],
      });
    }
  }

  for (let index = 1; index < modules.bayCount; index += 1) {
    const x = plane.xMin + (length / modules.bayCount) * index;
    addQAFacadeBox(group, {
      color: palette.seam,
      opacity: 0.54,
      position: [x, usableHeight / 2, z + sideOffset * 0.24],
      size: [0.035, usableHeight, 0.055],
    });
  }

  addQAFacadeBox(group, {
    color: palette.seam,
    opacity: 0.7,
    position: [plane.xMin, height / 2, z + sideOffset * 0.24],
    size: [0.035, height * 0.92, 0.055],
  });
  addQAFacadeBox(group, {
    color: palette.seam,
    opacity: 0.7,
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
        color: 0xcbd8c4,
        opacity: 0.64,
        position: [x, y, z + sideOffset * 0.3],
        size: [windowWidth, 0.095, 0.052],
      });
    }
  }
}

function addSignBandPlaceholders(group, { modules, palette, length, plane, signY, z, sideOffset, depth }) {
  const widths = modules.signBandWidths.length ? modules.signBandWidths : [0.32, 0.24];
  const total = widths.reduce((sum, value) => sum + value, 0);
  const gutter = length * 0.035;
  let cursor = plane.xMin + gutter;
  for (let index = 0; index < widths.length; index += 1) {
    const rawWidth = length * (widths[index] / Math.max(total, 0.1)) * 0.82;
    const width = Math.max(rawWidth, 0.08);
    addQAFacadeBox(group, {
      color: index % 2 ? palette.signAlt : palette.sign,
      opacity: 0.76,
      position: [cursor + width / 2, signY, z + sideOffset * 0.7],
      size: [width, 0.1, depth * 2.4],
    });
    cursor += width + gutter;
    if (cursor > plane.xMax - gutter) break;
  }

  if (modules.wrappedSignBand) {
    const edgeX = modules.endpointEmphasis === "left-edge" ? plane.xMin : plane.xMax;
    addQAFacadeBox(group, {
      color: palette.sign,
      opacity: 0.82,
      position: [edgeX, signY + 0.03, z + sideOffset * 1.2],
      size: [0.08, 0.16, 0.24],
    });
  }
}

function addAwningPlaceholders(group, { length, plane, signY, z, sideOffset, awningSegments, palette }) {
  if (!awningSegments) return;
  const segmentWidth = length / awningSegments;
  const awningWidth = Math.max(segmentWidth * 0.72, 0.09);
  const y = Math.max(signY - 0.12, 0.1);

  for (let index = 0; index < awningSegments; index += 1) {
    const x = plane.xMin + segmentWidth * index + segmentWidth / 2;
    addQAFacadeBox(group, {
      color: index % 2 ? palette.awningAlt : palette.awning,
      opacity: 0.78,
      position: [x, y, z + sideOffset * 0.44],
      size: [awningWidth, 0.07, 0.09],
    });
  }
}

function addBrickLikeDraftBlocks(group, { modules, palette, length, plane, height, splitY, z, sideOffset, depth }) {
  if (!modules.brickBlockRows) return;
  const rowHeight = Math.min(Math.max((height - splitY) / (modules.brickBlockRows + 1), 0.07), 0.16);
  for (let row = 0; row < modules.brickBlockRows; row += 1) {
    const y = splitY + rowHeight * (row + 1);
    const blocks = 3 + (row % 3);
    const blockWidth = length / blocks;
    for (let block = 0; block < blocks; block += 1) {
      if ((row + block) % 2 && blocks > 3) continue;
      addQAFacadeBox(group, {
        color: row % 2 ? palette.brickAlt : palette.brick,
        opacity: 0.28,
        position: [plane.xMin + blockWidth * block + blockWidth / 2, y, z + sideOffset * 0.12],
        size: [Math.max(blockWidth * 0.72, 0.06), rowHeight * 0.42, depth * 1.25],
      });
    }
  }
}

function addParapetTiers(group, { length, centerX, height, z, sideOffset, parapetTiers, palette }) {
  for (let index = 0; index < parapetTiers; index += 1) {
    addQAFacadeBox(group, {
      color: palette.cornice,
      opacity: 0.76 - index * 0.12,
      position: [centerX, height + 0.04 + index * 0.075, z + sideOffset * 0.2],
      size: [length * (0.98 - index * 0.12), 0.045, 0.07],
    });
  }
}

function addEndpointEmphasis(group, { plane, height, z, sideOffset, endpointEmphasis, palette }) {
  if (endpointEmphasis === "none") return;
  const x = endpointEmphasis === "left-edge" ? plane.xMin : plane.xMax;
  addQAFacadeBox(group, {
    color: palette.corner,
    opacity: 0.9,
    position: [x, height / 2, z + sideOffset * 0.5],
    size: [0.08, height + 0.16, 0.095],
  });
}

function addHumanScaleStreetCues(group, { modules, palette, length, plane, z, sideOffset }) {
  const sidewalkZ = z + sideOffset * 1.55;
  const curbZ = z + sideOffset * 2.65;
  const cadence = normalizeCadence(modules.storefrontCadence);
  let cursor = plane.xMin;

  for (let index = 0; index < cadence.length; index += 1) {
    const segmentWidth = length * cadence[index];
    const x = cursor + segmentWidth / 2;
    if (index < modules.stoopStepHints) {
      addQAFacadeBox(group, {
        color: palette.step,
        opacity: 0.78,
        position: [x, 0.055, sidewalkZ],
        size: [Math.max(segmentWidth * 0.44, 0.06), 0.055, 0.13],
      });
    }
    if (index < modules.cellarGrateMarks) {
      addQAFacadeBox(group, {
        color: palette.grate,
        opacity: 0.82,
        position: [x, 0.035, curbZ - sideOffset * 0.15],
        size: [Math.max(segmentWidth * 0.52, 0.08), 0.025, 0.09],
      });
      addQAFacadeBox(group, {
        color: palette.grateLine,
        opacity: 0.68,
        position: [x, 0.052, curbZ - sideOffset * 0.15],
        size: [0.024, 0.018, 0.12],
      });
    }
    cursor += segmentWidth;
  }

  for (let index = 0; index < modules.curbRhythmTicks; index += 1) {
    const x = plane.xMin + (length / Math.max(modules.curbRhythmTicks, 1)) * (index + 0.5);
    addQAFacadeBox(group, {
      color: palette.curb,
      opacity: 0.7,
      position: [x, 0.04, curbZ],
      size: [0.04, 0.04, 0.18],
    });
  }

  for (let index = 0; index < modules.polePostPlaceholders; index += 1) {
    const x = plane.xMin + length * (index ? 0.78 : 0.18);
    addQAFacadeCylinder(group, {
      color: palette.post,
      opacity: 0.78,
      position: [x, 0.36, curbZ + sideOffset * 0.18],
      radius: 0.025,
      height: 0.72,
    });
  }

  if (modules.crosswalkCue) {
    for (let index = 0; index < 4; index += 1) {
      addQAFacadeBox(group, {
        color: palette.crosswalk,
        opacity: 0.62,
        position: [plane.xMin + length * 0.1 + index * 0.1, 0.03, curbZ + sideOffset * (0.22 + index * 0.12)],
        size: [0.18, 0.022, 0.045],
      });
    }
  }

  if (modules.cornerAnchorVolume) {
    const edgeX = modules.endpointEmphasis === "right-edge" ? plane.xMax : plane.xMin;
    addQAFacadeBox(group, {
      color: palette.corner,
      opacity: 0.84,
      position: [edgeX, 0.44, sidewalkZ + sideOffset * 0.05],
      size: [0.16, 0.88, 0.22],
    });
  }
}

function getStreetFeelPalette(draftPalette, groundBaseTone) {
  const facadePalettes = {
    "brickish-corner": { facade: 0x8f6752, brick: 0xb07b5b, brickAlt: 0x6f4f44 },
    "muted-brick": { facade: 0x76584b, brick: 0x9a6b55, brickAlt: 0x5d4840 },
    "light-brick": { facade: 0x9b8064, brick: 0xb8926c, brickAlt: 0x715b4d },
    "ochre-brick": { facade: 0x8c7450, brick: 0xa98752, brickAlt: 0x604f3d },
    "low-dark-storefront": { facade: 0x5b6656, brick: 0x77765d, brickAlt: 0x46524b },
    "narrow-brick": { facade: 0x7a5f52, brick: 0x9a735f, brickAlt: 0x554940 },
    "small-ochre": { facade: 0x806d4c, brick: 0x9b7e4c, brickAlt: 0x51483a },
    "tall-muted-brick": { facade: 0x7b5c52, brick: 0x98705f, brickAlt: 0x54453f },
  };
  const baseTones = {
    charcoal: 0x26302d,
    "dark-umber": 0x3b2f28,
    slate: 0x303b3d,
    "deep-green": 0x263b34,
  };
  const facade = facadePalettes[draftPalette] ?? facadePalettes["muted-brick"];
  return {
    ...facade,
    groundBase: baseTones[groundBaseTone] ?? baseTones.charcoal,
    glass: 0x8fa7a0,
    entry: 0x232a2a,
    seam: 0xd8c79f,
    sign: 0xd7b774,
    signAlt: 0xb99764,
    awning: 0x9f6759,
    awningAlt: 0x6f7d74,
    cornice: 0xd9c895,
    corner: 0xe0b45d,
    step: 0x90856e,
    grate: 0x202524,
    grateLine: 0xd3c7aa,
    curb: 0xd4c79e,
    post: 0xb8aa88,
    crosswalk: 0xe6dfc8,
  };
}

function getEvidenceFacadePalette(paletteFamily) {
  const palettes = {
    "warm-red-brick-dark-base": {
      body: 0x5f342f,
      side: 0x4c2d2a,
      returnWall: 0x6f3d36,
      facade: 0x8f4e42,
      base: 0x272727,
      baseAlt: 0x3c332e,
      trim: 0x2f2928,
      sign: 0xe2c37b,
      signAlt: 0x6e947d,
      glass: 0x87a39c,
      window: 0xb8c5bd,
      awning: 0x6e947d,
      awningAlt: 0x2b3a36,
      cornice: 0xd0b47b,
      corner: 0xefc165,
      post: 0xb9a879,
      streetSign: 0x4f9474,
      table: 0x8a7a5d,
      crosswalk: 0xe7dcc7,
    },
    "bright-panel-silver-gray": {
      body: 0x596460,
      side: 0x4a5552,
      returnWall: 0x6f7c77,
      facade: 0x87958f,
      base: 0x3e4542,
      baseAlt: 0x5b615e,
      trim: 0xd7d0bd,
      sign: 0xd0bd5e,
      signAlt: 0x5990a0,
      glass: 0xabc2bd,
      window: 0xcbd6d2,
      awning: 0xc6b558,
      awningAlt: 0x5a8173,
      cornice: 0xe0d8bd,
      corner: 0xd5b35c,
      post: 0x1d2425,
      streetSign: 0x4b8f72,
      table: 0x6f766f,
      crosswalk: 0xe8ddc8,
    },
    "pale-stone-red-trim": {
      body: 0x9e9585,
      side: 0x887f72,
      returnWall: 0xb7ad9a,
      facade: 0xc6bfb0,
      base: 0xeee8db,
      baseAlt: 0x7d5148,
      trim: 0x7d453d,
      sign: 0xa6b98c,
      signAlt: 0xf0e7d7,
      glass: 0xa2b7b3,
      window: 0xd8e0d8,
      awning: 0x5e7b68,
      awningAlt: 0x7d5148,
      cornice: 0xeee2c8,
      corner: 0x9d5b4f,
      post: 0x2d3330,
      streetSign: 0x4a9170,
      table: 0x8d8069,
      crosswalk: 0xe7dcc7,
    },
    "weathered-brick-wood-green": {
      body: 0x5f3e37,
      side: 0x4d352f,
      returnWall: 0x714b42,
      facade: 0x865448,
      base: 0xa68658,
      baseAlt: 0x4b5f52,
      trim: 0xd9c89f,
      sign: 0xc8a76f,
      signAlt: 0x6f8a68,
      glass: 0x92ada4,
      window: 0xc3d2ca,
      awning: 0x5f7c62,
      awningAlt: 0x405548,
      cornice: 0xd1ba86,
      corner: 0xd9b466,
      post: 0x222928,
      streetSign: 0x4e926f,
      table: 0x7d8d6f,
      crosswalk: 0xe6ddca,
    },
    "dark-brick-black-base": {
      body: 0x4f302f,
      side: 0x382625,
      returnWall: 0x603836,
      facade: 0x74423f,
      base: 0x202322,
      baseAlt: 0x3c2c29,
      trim: 0x1e2221,
      sign: 0xc09f67,
      signAlt: 0x454f4b,
      glass: 0x78918c,
      window: 0xbdc7bf,
      awning: 0x252a28,
      awningAlt: 0x5d6f62,
      cornice: 0xbfaa78,
      corner: 0xceaa5f,
      post: 0x232928,
      streetSign: 0x4e916f,
      table: 0x716a58,
      crosswalk: 0xe5ddcd,
    },
    "red-brick-stone-cornice": {
      body: 0x663a36,
      side: 0x4f302e,
      returnWall: 0x7a443f,
      facade: 0x8f4f41,
      base: 0x302a27,
      baseAlt: 0x5c4038,
      trim: 0xb9a278,
      sign: 0xd1ad6a,
      signAlt: 0x6f7b63,
      glass: 0x879f99,
      window: 0xc4d0c8,
      awning: 0x2d3431,
      awningAlt: 0x6a7767,
      cornice: 0xd8c08c,
      corner: 0xe0b661,
      post: 0x222827,
      streetSign: 0x4e9270,
      table: 0x82755f,
      crosswalk: 0xe6dece,
    },
  };
  return palettes[paletteFamily] ?? palettes["warm-red-brick-dark-base"];
}

function normalizeCadence(values) {
  const total = values.reduce((sum, value) => sum + value, 0) || 1;
  return values.map((value) => value / total);
}

function clampInteger(value, min, max, fallback) {
  const parsed = Number.isFinite(value) ? Math.round(value) : fallback;
  return clamp(parsed, min, max);
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

function addEvidenceFacadeBox(group, { color, opacity, position, size, opaque = true }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    new THREE.MeshBasicMaterial({
      color,
      transparent: !opaque,
      opacity: opaque ? 1 : 0,
      depthWrite: opaque,
    }),
  );
  mesh.position.set(...position);
  mesh.userData.stateRole = "evidenceFacadeCue";
  mesh.userData.qaOpacity = opacity;
  mesh.userData.qaColor = color;
  mesh.userData.qaOpaque = opaque;
  mesh.visible = false;
  group.add(mesh);
}

function addCorridorFacadeBox(group, { color, opacity, position, size }) {
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
  mesh.userData.stateRole = "corridorFacadeCue";
  mesh.userData.qaOpacity = opacity;
  mesh.userData.qaColor = color;
  mesh.visible = false;
  group.add(mesh);
}

function addQAScaffoldPreviewBox(group, { color, opacity, position, size, outlineColor = null, outlineOpacity = 0 }) {
  const geometry = new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  mesh.position.set(...position);
  mesh.userData.stateRole = "qaScaffoldPreview";
  mesh.userData.qaOpacity = opacity;
  mesh.userData.qaColor = color;
  mesh.visible = false;
  group.add(mesh);

  if (outlineColor && outlineOpacity > 0) {
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: outlineColor,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    outline.position.set(...position);
    outline.userData.stateRole = "qaScaffoldPreviewOutline";
    outline.userData.qaOpacity = outlineOpacity;
    outline.userData.qaColor = outlineColor;
    outline.visible = false;
    group.add(outline);
  }
}

function addQAScaffoldPreviewLabel(group, { label, color, position, tetherStart }) {
  const sprite = createTextSprite(label);
  sprite.position.set(...position);
  sprite.userData.stateRole = "qaScaffoldPreviewLabel";
  sprite.userData.qaOpacity = 0.92;
  sprite.userData.qaColor = color;
  sprite.visible = false;
  group.add(sprite);

  if (tetherStart) {
    const tether = createPolyline([
      { x: tetherStart[0], z: tetherStart[2] },
      { x: position[0], z: position[2] },
    ], {
      color,
      opacity: 0,
      y: Math.max(position[1] - 0.16, 0.24),
    });
    tether.userData.stateRole = "qaScaffoldPreviewOutline";
    tether.userData.qaOpacity = 0.48;
    tether.userData.qaColor = color;
    tether.visible = false;
    group.add(tether);
  }
}

function addSyntheticContextBox(group, { color, opacity, position, size }) {
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
  mesh.userData.stateRole = "syntheticQAGrounding";
  mesh.userData.qaOpacity = opacity;
  mesh.userData.qaColor = color;
  mesh.visible = false;
  group.add(mesh);
}

function addEvidenceFacadeCylinder(group, { color, opacity, position, radius, height, opaque = true }) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 8),
    new THREE.MeshBasicMaterial({
      color,
      transparent: !opaque,
      opacity: opaque ? 1 : 0,
      depthWrite: opaque,
    }),
  );
  mesh.position.set(...position);
  mesh.userData.stateRole = "evidenceFacadeCue";
  mesh.userData.qaOpacity = opacity;
  mesh.userData.qaColor = color;
  mesh.userData.qaOpaque = opaque;
  mesh.visible = false;
  group.add(mesh);
}

function addQAFacadeCylinder(group, { color, opacity, position, radius, height }) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 8),
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
      if (child.userData.pickTarget) return;
      if (!child.material) {
        if (
          child.userData.stateRole === "facadeCue"
          || child.userData.stateRole === "qaFacadeSlice"
          || child.userData.stateRole === "evidenceFacadeCue"
          || child.userData.stateRole === "corridorFacadeCue"
          || child.userData.stateRole === "qaScaffoldPreview"
          || child.userData.stateRole === "qaScaffoldPreviewOutline"
          || child.userData.stateRole === "qaScaffoldPreviewLabel"
          || child.userData.stateRole === "qaFrontageCandidate"
          || child.userData.stateRole === "qaFrontageCandidateLabel"
          || child.userData.stateRole === "qaRecognizableAnchorCue"
          || child.userData.stateRole === "qaRecognizableAnchorCueLabel"
          || child.userData.stateRole === "localEvidenceCue"
          || child.userData.stateRole === "localEvidenceCueLabel"
          || child.userData.stateRole === "syntheticQAGrounding"
          || child.userData.stateRole === "candidatePoi"
          || child.userData.stateRole === "candidatePoiLabel"
        ) {
          child.visible = child.userData.stateRole === "candidatePoiLabel" ? qaEnabled && (isSelected || isHovered) : qaEnabled;
        }
        return;
      }
      if (child.material.color) {
        const qaColor = child.userData.qaColor ?? child.userData.baseColor;
        const qaNeutralRoles = ["massing", "outline", "footprint", "base", "anchor"];
        const color = qaEnabled && qaNeutralRoles.includes(child.userData.stateRole)
          ? child.userData.baseColor
          : qaColor;
        child.material.color.set(isSelected ? 0xf0c96a : isHovered ? 0xb9cec7 : color ?? child.userData.baseColor ?? 0x88908d);
      }
      if (child.material.opacity !== undefined) {
        if (child.userData.stateRole === "outline" || child.userData.stateRole === "footprint") {
          child.material.opacity = isSelected
            ? 0.95
            : isHovered
              ? 0.78
              : qaEnabled
                ? child.userData.hasEvidenceFacade ? 0 : 0.002
                : 0.5;
        } else if (child.userData.stateRole === "base") {
          child.material.opacity = isSelected
            ? 0.72
            : isHovered
              ? 0.58
              : qaEnabled
                ? child.userData.hasEvidenceFacade ? 0 : 0.003
                : 0.4;
        } else if (child.userData.stateRole === "massing") {
          child.material.opacity = isSelected
            ? 0.86
            : isHovered
              ? 0.72
              : qaEnabled
                ? child.userData.hasEvidenceFacade ? 0 : 0.003
                : 0.94;
        } else if (child.userData.stateRole === "anchor") {
          child.material.opacity = isSelected ? 0.9 : isHovered ? 0.72 : qaEnabled ? 0.025 : 0.42;
        } else if (child.userData.stateRole === "line") {
          const isCenterline = child.userData.semanticType === "corridor-street-centerline";
          child.material.opacity = isSelected || isHovered
            ? 0.72
            : qaEnabled && isCenterline
              ? 0.08
              : qaEnabled
                ? 0.015
                : child.userData.baseOpacity ?? 0.35;
        } else if (child.userData.stateRole === "facadeCue") {
          child.visible = qaEnabled && (isSelected || isHovered);
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min(child.userData.qaOpacity + 0.18, 0.95)
              : isHovered
                ? Math.min(child.userData.qaOpacity + 0.1, 0.9)
                : 0
            : 0;
        } else if (child.userData.stateRole === "qaFacadeSlice") {
          child.visible = qaEnabled;
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min(child.userData.qaOpacity + 0.2, 0.96)
              : isHovered
                ? Math.min(child.userData.qaOpacity + 0.12, 0.92)
                : Math.min(child.userData.qaOpacity ?? 0.12, 0.12)
            : 0;
        } else if (child.userData.stateRole === "evidenceFacadeCue") {
          child.visible = qaEnabled;
          const isOpaqueEvidence = qaEnabled && child.userData.qaOpaque === true;
          const shouldBeTransparent = !isOpaqueEvidence;
          if (child.material.transparent !== shouldBeTransparent || child.material.depthWrite !== isOpaqueEvidence) {
            child.material.transparent = shouldBeTransparent;
            child.material.depthWrite = isOpaqueEvidence;
            child.material.needsUpdate = true;
          }
          child.material.opacity = qaEnabled
            ? isOpaqueEvidence
              ? 1
              : isSelected
                ? Math.min(child.userData.qaOpacity + 0.2, 0.98)
                : isHovered
                  ? Math.min(child.userData.qaOpacity + 0.14, 0.94)
                  : child.userData.qaOpacity
            : 0;
        } else if (child.userData.stateRole === "corridorFacadeCue") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          if (child.material.color && child.userData.qaColor) child.material.color.set(child.userData.qaColor);
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min((child.userData.qaOpacity ?? 0.08) + 0.12, 0.32)
              : isHovered
                ? Math.min((child.userData.qaOpacity ?? 0.08) + 0.08, 0.26)
                : child.userData.qaOpacity ?? 0.08
            : 0;
        } else if (child.userData.stateRole === "qaScaffoldPreview" || child.userData.stateRole === "qaScaffoldPreviewOutline") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          if (child.material.color && child.userData.qaColor) child.material.color.set(child.userData.qaColor);
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min((child.userData.qaOpacity ?? 0.22) + 0.16, 0.64)
              : isHovered
                ? Math.min((child.userData.qaOpacity ?? 0.22) + 0.1, 0.54)
                : child.userData.qaOpacity ?? 0.22
            : 0;
        } else if (child.userData.stateRole === "qaScaffoldPreviewLabel") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          child.material.opacity = qaEnabled
            ? isSelected || isHovered
              ? 1
              : child.userData.qaOpacity ?? 0.9
            : 0;
        } else if (child.userData.stateRole === "qaFrontageCandidate") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          if (child.material.color && child.userData.qaColor) child.material.color.set(child.userData.qaColor);
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min((child.userData.qaOpacity ?? 0.42) + 0.16, 0.74)
              : isHovered
                ? Math.min((child.userData.qaOpacity ?? 0.42) + 0.1, 0.66)
                : child.userData.qaOpacity ?? 0.42
            : 0;
        } else if (child.userData.stateRole === "qaFrontageCandidateLabel") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          child.material.opacity = qaEnabled
            ? isSelected || isHovered
              ? 1
              : child.userData.qaOpacity ?? 0.9
            : 0;
        } else if (child.userData.stateRole === "qaRecognizableAnchorCue") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          if (child.material.color && child.userData.qaColor) child.material.color.set(child.userData.qaColor);
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min((child.userData.qaOpacity ?? 0.34) + 0.18, 0.72)
              : isHovered
                ? Math.min((child.userData.qaOpacity ?? 0.34) + 0.1, 0.62)
                : child.userData.qaOpacity ?? 0.34
            : 0;
        } else if (child.userData.stateRole === "qaRecognizableAnchorCueLabel") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          child.material.opacity = qaEnabled
            ? isSelected || isHovered
              ? 1
              : child.userData.qaOpacity ?? 0.9
            : 0;
        } else if (child.userData.stateRole === "localEvidenceCue") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          if (child.material.color && child.userData.qaColor) child.material.color.set(child.userData.qaColor);
          child.material.opacity = qaEnabled
            ? isSelected
              ? Math.min((child.userData.qaOpacity ?? 0.5) + 0.16, 0.86)
              : isHovered
                ? Math.min((child.userData.qaOpacity ?? 0.5) + 0.1, 0.78)
                : child.userData.qaOpacity ?? 0.5
            : 0;
        } else if (child.userData.stateRole === "localEvidenceCueLabel") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          child.material.opacity = qaEnabled
            ? isSelected || isHovered
              ? 1
              : child.userData.qaOpacity ?? 0.92
            : 0;
        } else if (child.userData.stateRole === "syntheticQAGrounding") {
          child.visible = qaEnabled;
          child.material.transparent = true;
          child.material.depthWrite = false;
          if (child.material.color && child.userData.qaColor) child.material.color.set(child.userData.qaColor);
          child.material.opacity = qaEnabled
            ? isSelected || isHovered
              ? Math.min((child.userData.qaOpacity ?? 0.28) + 0.12, 0.64)
              : child.userData.qaOpacity ?? 0.28
            : 0;
        } else if (child.userData.stateRole === "candidatePoi") {
          child.visible = qaEnabled && (isSelected || isHovered);
          if (child.material.color && child.userData.qaColor) child.material.color.set(child.userData.qaColor);
          child.material.opacity = child.visible ? Math.min(child.userData.qaOpacity ?? 0.36, 0.36) : 0;
        } else if (child.userData.stateRole === "candidatePoiLabel") {
          child.visible = qaEnabled && (isSelected || isHovered);
          if (child.material.color && child.userData.qaColor) child.material.color.set(child.userData.qaColor);
          child.material.opacity = child.visible ? child.userData.qaOpacity ?? 0.75 : 0;
        }
      }
      if (child.userData.stateRole === "marker") {
        child.visible = isSelected || isHovered;
        child.material.opacity = isSelected ? 0.88 : isHovered ? 0.5 : 0;
      }
    });
  }
}

function getCandidatePoiColor(claimState) {
  if (claimState === "candidate_only") return 0x8cc5ff;
  if (claimState === "manual_review_required") return 0xd4b36f;
  return 0xb56d5e;
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
  state.renderer.clear(true, true, true);
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

function clampNumber(value, min, max, fallback) {
  return Number.isFinite(value) ? clamp(value, min, max) : fallback;
}
