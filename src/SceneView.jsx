import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { assembleFranklinScene } from "./sceneFrame.js";
import { buildFacadeAssembly } from "./facadeAssembly.js";
import { buildGroundLayer } from "./groundLayer.js";
import { buildStreetFurniture } from "./streetFurniture.js";
import premierFacadeSpec from "./data/facade-specs/premier-franklin-organic.v0.1.json";
import sonnysFacadeSpec from "./data/facade-specs/sonnys-corner.v0.1.json";
import serenecoFacadeSpec from "./data/facade-specs/sereneco.v0.1.json";
import franklin144FacadeSpec from "./data/facade-specs/144-franklin.v0.1.json";
import geometrySource from "./data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
import sceneGeometryFixture from "./data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json";
import wrapFixture from "./data/franklin-intersection/greenpoint-franklin.phase-4m-r10g-corner-frontage-wrap.v0.1.json";
import blockFranklinMilton from "./data/geometry-source/block-franklin-milton.nyc-open-geometry.v0.1.json";
import blockGreenpointEast from "./data/geometry-source/block-greenpoint-east.nyc-open-geometry.v0.1.json";
import { registerFacadeFace, clearFacadeFaces } from "./dev/facadeFaceRegistry.js";
import FacadeRecessEditor from "./components/dev/FacadeRecessEditor.jsx";
import PlaceCard from "./components/PlaceCard.jsx";
import { getPlaceByPlaceId, PLACE_DISCLAIMER } from "./placeData.js";
import { classifyBuilding } from "./buildingTypology.js";
import blockStorefronts from "./data/places/block-franklin-milton-storefronts.v0.1.json";
import blockGreenpointEastStorefronts from "./data/places/block-greenpoint-east-storefronts.v0.1.json";
import heroPlaces from "./data/places/franklin-greenpoint-heroes.v0.1.json";
import { assignStorefronts, dedupeByProximity } from "./storefrontRoster.js";
import { planStorefrontSigns } from "./storefrontSigns.js";
import { composeInkedFacade } from "./inkedFacadeCompose.js";
import { composeStorefront } from "./storefrontCompose.js";

// Scene mode: the product view. Fixed isometric camera, II-C paper-toned
// stage, real NYC footprints in the proven Franklin-local frame. Facade
// planes on the hero frontages are texture slots — drop generated II-style
// textures into assets/textures/franklin/ and they load by name:
//   <placeId>--greenpoint.png / <placeId>--franklin.png

const II_PALETTE = {
  paper: 0xeae1ce,
  street: 0xcabfa7,
  streetDerived: 0xc4b9a2,
  asphalt: 0x6f6a60,
  asphaltDerived: 0x6a655c,
  concrete: 0xb8ae99,
  concreteDerived: 0xb2a994,
  crosswalkPaint: 0xe7dcc2,
  curbStone: 0xcabfa7,
  scoreLine: 0x9b9079,
  signalPole: 0x2a241c,
  signalHead: 0x1d201e,
  signalRed: 0xb24a3a,
  signalAmber: 0xcc9a3b,
  signalGreen: 0x4f7d52,
  pedSignal: 0x26211a,
  ink: 0x2a241c,
  context: [0xd9cdb4, 0xcfc0a6, 0xd4c5ad, 0xc8bba4],
  heroes: {
    "premier-franklin-organic": 0xa04432, // red brick grocery corner
    "sonnys-corner": 0x4a4039, // dark brick / awned base
    sereneco: 0x9a7e58, // weathered brick, low restaurant corner
    "144-franklin": 0xa85a3c, // 1895 Romanesque Revival, terracotta/red brick
  },
};

// Material-family wall tones for data-differentiated typological infill (II-C muted).
const TYPOLOGY_PALETTE = {
  "typological.brick": 0xb89a7e,
  "typological.painted": 0xc8c2b2,
  "typological.commercial": 0xb4a890,
  "typological.warehouse": 0x968b78,
};
function resolveTypologyColor(typology) {
  return TYPOLOGY_PALETTE[typology?.palette] ?? II_PALETTE.context[0];
}

// Camera sits northeast of the intersection looking southwest, so the
// Greenpoint-facing (north) and Franklin-facing (east) hero frontages —
// Premier's and Sonny's storefronts — face the viewer, matching the
// benchmark composition.
const ISO_AZIMUTH = Math.PI * 0.75;
const ISO_ELEVATION = Math.atan(1 / Math.SQRT2); // true isometric, 35.264°

// Phase 3.2 — Scene mode rotates through four fixed iso steps (90° each).
// ISO_AZIMUTH is step 0 (the dialed-in NE composition). Rather than dropping
// back-facing hero walls at build time (which left holes once the camera could
// rotate behind them), every wall is built once and its visibility is toggled
// per current view via its outward normal. CULL_T matches the old fixed test.
const CULL_T = -0.3;
const ROTATE_MS = 440; // snap-tween duration between adjacent 90° steps

// Phase 3.3.2 — context buildings within this radius of the intersection get
// the typological brick/window treatment so the corner reads as a real block
// from every angle. Beyond it, buildings stay cheap graybox massing.
const CONTEXT_TREATMENT_RADIUS_UNITS = 0.075 * 48; // ~48 m at 0.075 units/m
const facingDot = (normal, azimuth) =>
  normal.x * Math.sin(azimuth) + normal.z * Math.cos(azimuth);

const rotateButtonStyle = {
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(217, 164, 59, 0.92)",
  color: "#241c10",
  border: "none",
  borderRadius: 6,
  fontSize: 16,
  lineHeight: 1,
  cursor: "pointer",
  fontFamily: "Georgia, serif",
};

const facadeTextureUrls = import.meta.glob("../assets/textures/franklin/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

export default function SceneView() {
  const mountRef = useRef(null);
  const [facadeEdit, setFacadeEdit] = useState(
    () => new URLSearchParams(window.location.search).get("facadeedit") === "1"
  );
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorFace, setEditorFace] = useState(null); // null = editor auto-picks first face
  const [selectedPlace, setSelectedPlace] = useState(null); // place record or null
  const [anchor, setAnchor] = useState(null); // {x, y} screen px of the pin, or null
  const [viewStep, setViewStep] = useState(0); // 0..3, which of the four iso angles
  const updateAnchorRef = useRef(() => {});
  const rotateRef = useRef(() => {}); // imperative rotate(dir) from the effect
  const selectedPlaceIdRef = useRef(null);
  // The main scene effect runs once ([] deps), so its pointer handler would
  // otherwise read the mount-time editor flags. Mirror them into refs so a
  // click resolves against the LIVE state (e.g. after Shift+E opens the editor).
  const facadeEditRef = useRef(facadeEdit);
  const editorOpenRef = useRef(editorOpen);
  useEffect(() => {
    facadeEditRef.current = facadeEdit;
    editorOpenRef.current = editorOpen;
  }, [facadeEdit, editorOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.shiftKey && e.key === "E") {
        setFacadeEdit(true);
        setEditorOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = assembleFranklinScene({
      geometrySource,
      sceneGeometryFixture,
      wrapFixture,
      facadeGroupBins: FACADE_GROUP_BINS,
      blockExtracts: BLOCK_EXTRACTS,
    });

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const three = new THREE.Scene();
    three.background = new THREE.Color(II_PALETTE.paper);

    three.add(new THREE.AmbientLight(0xfff6e8, 0.95));
    const sun = new THREE.DirectionalLight(0xffeed8, 0.65);
    sun.position.set(-6, 9, 4);
    three.add(sun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshLambertMaterial({ color: II_PALETTE.paper }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.002;
    three.add(ground);

    // The scene renders on demand (no animation loop). Textures decode async,
    // so re-render when each finishes loading.
    let renderScene = null;
    const requestRender = () => renderScene?.();

    // StrictMode double-mounts this effect, and facade textures load async.
    // `active` lets a disposed run's late texture callbacks bail out instead
    // of registering a rebuild closure that points at an orphaned scene.
    let active = true;
    const isActive = () => active;

    // Camera rotation state (Phase 3.2). `currentAzimuth` is the live (possibly
    // mid-tween) angle; `stepIndex` is unbounded so the snap always travels the
    // shortest 90°. Hero walls register here as cullables and have their
    // visibility recomputed for `currentAzimuth` on every frame of a snap.
    // Dev framing override: ?a=<0..3> sets the initial rotation step (for deterministic
    // screenshots). Defaults to 0.
    const __aParam = Number(new URLSearchParams(window.location.search).get("a"));
    const __initStep = Number.isInteger(__aParam) ? __aParam : 0;
    let currentAzimuth = ISO_AZIMUTH + __initStep * (Math.PI / 2);
    let targetAzimuth = currentAzimuth;
    let stepIndex = __initStep;
    let rotRaf = null;
    let animFromAz = ISO_AZIMUTH;
    let animStartMs = 0;
    const cullables = []; // [{ object, normal, refresh }] — object is mutable (wall → assembly)
    const addCullable = (object, normal) => {
      // `refresh` recomputes this record's visibility from the LIVE azimuth, so
      // a live rebuild (recess editor) can re-cull the freshly-built assembly
      // instead of inheriting a stale value. Closes over `record` so it works
      // regardless of call site.
      const record = { object, normal };
      record.refresh = () => {
        record.object.visible = facingDot(record.normal, currentAzimuth) >= CULL_T;
      };
      cullables.push(record);
      return record;
    };
    function applyCulling() {
      for (const c of cullables) c.refresh();
    }

    clearFacadeFaces();
    const groundData = buildGroundLayer({
      projection: scene.projection,
      greenpointAxis: scene.greenpointAxis,
      franklinAxis: scene.franklinAxis,
      geometrySource,
    });
    buildGround(three, groundData);
    const furniture = buildStreetFurniture({
      streets: groundData.streets,
      greenpointAxis: scene.greenpointAxis,
      franklinAxis: scene.franklinAxis,
    });
    buildFurniture(three, furniture);
    buildBuildings(three, scene, requestRender, isActive, addCullable);
    buildBlockStorefronts(three, scene);
    buildInkedFacadeTest(three, scene); // SPIKE 2026-06-16
    window.__three = three;
    window.__scene = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    // Dev framing override: ?t=x,y,z&f=frustumHeight
    const params = new URLSearchParams(window.location.search);
    const t = (params.get("t") ?? "").split(",").map(Number);
    const view = {
      target: new THREE.Vector3(
        Number.isFinite(t[0]) ? t[0] : -0.95,
        Number.isFinite(t[1]) ? t[1] : 0.4,
        Number.isFinite(t[2]) ? t[2] : 1.05,
      ),
      frustumHeight: Number(params.get("f")) || 2.8,
    };

    function applyCamera() {
      const aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      const halfH = view.frustumHeight / 2;
      camera.left = -halfH * aspect;
      camera.right = halfH * aspect;
      camera.top = halfH;
      camera.bottom = -halfH;
      const distance = 60;
      camera.position.set(
        view.target.x + distance * Math.cos(ISO_ELEVATION) * Math.sin(currentAzimuth),
        view.target.y + distance * Math.sin(ISO_ELEVATION),
        view.target.z + distance * Math.cos(ISO_ELEVATION) * Math.cos(currentAzimuth),
      );
      camera.lookAt(view.target);
      camera.updateProjectionMatrix();
      updateAnchorRef.current(selectedPlaceIdRef.current);
    }

    // Snap the iso view by ±1 quarter-turn. The tween eases `currentAzimuth`
    // toward the new step, re-culling and re-rendering each frame; pan and zoom
    // carry across steps untouched.
    function rotate(direction) {
      stepIndex += direction;
      targetAzimuth = ISO_AZIMUTH + stepIndex * (Math.PI / 2);
      animFromAz = currentAzimuth;
      animStartMs = performance.now();
      setViewStep(((stepIndex % 4) + 4) % 4);
      if (rotRaf == null) rotRaf = requestAnimationFrame(rotTick);
    }
    function rotTick(now) {
      const t = Math.min(1, (now - animStartMs) / ROTATE_MS);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad
      currentAzimuth = animFromAz + (targetAzimuth - animFromAz) * eased;
      applyCamera();
      applyCulling();
      render();
      if (t < 1) {
        rotRaf = requestAnimationFrame(rotTick);
      } else {
        rotRaf = null;
        currentAzimuth = targetAzimuth;
        applyCamera();
        applyCulling();
        render();
      }
    }
    rotateRef.current = rotate;

    const anchorWorld = new Map(
      scene.buildings
        .filter((b) => b.placeId)
        .map((b) => [b.placeId, new THREE.Vector3(b.centroid.x, Math.max(b.height * 0.22, 0.22), b.centroid.z)]),
    );
    // Azure Gourmet is a storefront tenant on the Sereneco building's Franklin
    // elevation, not its own footprint — anchor its pin to that shared building.
    const serenecoForAzure = scene.buildings.find((b) => b.placeId === "sereneco");
    if (serenecoForAzure) {
      anchorWorld.set(
        "azure-gourmet",
        new THREE.Vector3(serenecoForAzure.centroid.x, Math.max(serenecoForAzure.height * 0.22, 0.22), serenecoForAzure.centroid.z),
      );
    }

    function projectAnchor(placeId) {
      const w = anchorWorld.get(placeId);
      if (!w) return null;
      const v = w.clone().project(camera);
      return {
        x: (v.x * 0.5 + 0.5) * mount.clientWidth,
        y: (-v.y * 0.5 + 0.5) * mount.clientHeight,
      };
    }
    // Exposed so the imperative camera code can refresh the React pin position.
    updateAnchorRef.current = (placeId) => setAnchor(placeId ? projectAnchor(placeId) : null);

    function resize() {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      applyCamera();
      render();
    }

    function render() {
      renderer.render(three, camera);
    }
    renderScene = render;

    // Pan: drag moves the target in the ground plane along the camera's
    // screen axes. Zoom: wheel scales the orthographic frustum.
    const drag = { active: false, lastX: 0, lastY: 0 };

    // Click-to-edit: a no-drag click on a spec'd face opens the recess editor
    // for that face (edit mode only). Assembly groups carry userData.faceKey.
    const raycaster = new THREE.Raycaster();
    const down = { x: 0, y: 0, onCanvas: false };
    // Resolve the surface under a screen point. Returns the nearest *visible
    // mesh* the ray hits — skipping (1) NPR outline LineSegments (decoration,
    // not selectable; and with the default Line pick-threshold ≈ 1 unit ≈ 13 m
    // at this scene scale they get "hit" from a whole building away, so a click
    // anywhere lands on some distant building's edge lines first) and (2) meshes
    // hidden by per-view back-face culling (so selection follows what the
    // current angle actually shows, not a culled mesh nearer along the ray).
    function pickSurface(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      for (const hit of raycaster.intersectObjects(three.children, true)) {
        const object = hit.object;
        if (!object.isMesh) continue; // skip outline LineSegments / Points
        let node = object;
        let hidden = false;
        while (node) {
          if (!node.visible) { hidden = true; break; }
          node = node.parent;
        }
        if (hidden) continue; // skip culled back-faces
        return object;
      }
      return null;
    }

    function ancestorUserData(object, key) {
      let node = object;
      while (node) {
        if (node.userData?.[key] != null) return node.userData[key];
        node = node.parent;
      }
      return null;
    }

    function faceKeyAt(event) {
      const surface = pickSurface(event);
      return surface ? ancestorUserData(surface, "faceKey") : null;
    }

    function placeIdAt(event) {
      const surface = pickSurface(event);
      return surface ? ancestorUserData(surface, "placeId") : null;
    }

    function onPointerDown(event) {
      drag.active = true;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      down.x = event.clientX;
      down.y = event.clientY;
      down.onCanvas = true;
    }
    function onPointerMove(event) {
      if (!drag.active) return;
      // Pan axes follow the current view, so dragging always moves the scene
      // in screen space regardless of which of the four angles is active.
      const panRight = new THREE.Vector3(Math.cos(currentAzimuth), 0, -Math.sin(currentAzimuth));
      const panUp = new THREE.Vector3(-Math.sin(currentAzimuth), 0, -Math.cos(currentAzimuth));
      const unitsPerPixel = view.frustumHeight / Math.max(mount.clientHeight, 1);
      const dx = (event.clientX - drag.lastX) * unitsPerPixel;
      const dy = (event.clientY - drag.lastY) * unitsPerPixel;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      view.target.addScaledVector(panRight, -dx);
      view.target.addScaledVector(panUp, dy / Math.sin(ISO_ELEVATION));
      applyCamera();
      render();
    }
    function onPointerUp(event) {
      drag.active = false;
      const wasCanvas = down.onCanvas;
      down.onCanvas = false;
      if (!wasCanvas) return;
      const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
      if (moved > 4) return; // a pan, not a click

      // Click-to-edit: while the editor is open (or in ?facadeedit mode),
      // a click loads the hit face into the recess editor.
      if (facadeEditRef.current || editorOpenRef.current) {
        const faceKey = faceKeyAt(event);
        if (faceKey) {
          setEditorFace(faceKey);
          setEditorOpen(true);
        }
        return;
      }

      // Normal mode: click-to-select a hero place; click elsewhere deselects.
      const placeId = placeIdAt(event);
      const place = placeId ? getPlaceByPlaceId(placeId) : null;
      if (place) {
        selectedPlaceIdRef.current = place.placeId;
        setSelectedPlace(place);
        setAnchor(projectAnchor(place.placeId));
      } else {
        selectedPlaceIdRef.current = null;
        setSelectedPlace(null);
        setAnchor(null);
      }
    }
    function onWheel(event) {
      event.preventDefault();
      const factor = Math.exp(event.deltaY * 0.001);
      // Floor 0.85 ≈ a single storefront filling the frame (a ~14m hero is
      // ~1.05 units tall) — the reference's readable-signage detail level.
      // Ceiling 22 keeps the full three-corner intersection in view.
      view.frustumHeight = THREE.MathUtils.clamp(view.frustumHeight * factor, 0.85, 22);
      applyCamera();
      render();
    }

    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const k = event.key.toLowerCase();
      if (k === "e" || k === "]" || event.key === "ArrowRight") rotate(1);
      else if (k === "q" || k === "[" || event.key === "ArrowLeft") rotate(-1);
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", resize);
    applyCulling(); // hide back-facing hero walls for the initial NE view
    resize();

    return () => {
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", resize);
      if (rotRaf != null) cancelAnimationFrame(rotRaf);
      active = false;
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      clearFacadeFaces();
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          padding: "8px 12px",
          background: "rgba(42, 36, 28, 0.85)",
          color: "#eae1ce",
          fontFamily: "Georgia, serif",
          fontSize: 13,
          borderRadius: 4,
          lineHeight: 1.5,
        }}
      >
        <strong>Scene v0</strong> — Franklin x Greenpoint
        <br />
        <span style={{ opacity: 0.75 }}>drag to pan · wheel to zoom · Q/E to rotate</span>
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <button
            onClick={() => rotateRef.current(-1)}
            aria-label="Rotate view left"
            style={rotateButtonStyle}
          >
            ↺
          </button>
          <span style={{ opacity: 0.6, fontSize: 11, minWidth: 64, textAlign: "center" }}>
            angle {viewStep + 1} / 4
          </span>
          <button
            onClick={() => rotateRef.current(1)}
            aria-label="Rotate view right"
            style={rotateButtonStyle}
          >
            ↻
          </button>
        </div>
        <a href="?debug=1" style={{ color: "#d9a43b" }}>
          Debug runtime →
        </a>
      </div>
      {facadeEdit && !editorOpen && (
        <button
          onClick={() => setEditorOpen(true)}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "8px 14px",
            background: "#d9a43b",
            color: "#241c10",
            border: "none",
            borderRadius: 6,
            fontWeight: 700,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
          }}
        >
          ✎ Recess editor
        </button>
      )}
      {facadeEdit && editorOpen && (
        <FacadeRecessEditor
          faceKey={editorFace}
          onSelectFace={setEditorFace}
          onClose={() => setEditorOpen(false)}
        />
      )}
      {selectedPlace && (
        <>
          {anchor && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <line
                x1={anchor.x} y1={anchor.y}
                x2={typeof window !== "undefined" ? window.innerWidth - 340 : anchor.x}
                y2={Math.min(Math.max(anchor.y, 120), 360)}
                stroke="#2a241c" strokeWidth="1.5" strokeDasharray="3 3"
              />
            </svg>
          )}
          {anchor && (
            <div style={{
              position: "absolute", left: anchor.x - 7, top: anchor.y - 17,
              width: 14, height: 14, background: "#d9a43b",
              border: "1.5px solid #2a241c", borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)", pointerEvents: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }} />
          )}
          <div style={{ position: "absolute", top: 120, right: 24 }}>
            <PlaceCard
              place={selectedPlace}
              disclaimer={PLACE_DISCLAIMER}
              onClose={() => { selectedPlaceIdRef.current = null; setSelectedPlace(null); setAnchor(null); }}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Procedural inked ground: warm asphalt roadbeds, concrete sidewalks with
// score-lines, ivory crosswalk bars, raised curbs. Surfaces stack just above
// the paper ground plane (y=-0.002). Derived geometry (the Franklin gap) takes
// the muted "...Derived" tones.
const Y = { roadbed: 0.0008, sidewalk: 0.0018, crosswalk: 0.0028, score: 0.0024 };

function addGroundQuad(three, pts, y, color) {
  const v = new Float32Array([
    pts[0].x, y, pts[0].z, pts[1].x, y, pts[1].z, pts[2].x, y, pts[2].z,
    pts[0].x, y, pts[0].z, pts[2].x, y, pts[2].z, pts[3].x, y, pts[3].z,
  ]);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(v, 3));
  g.computeVertexNormals();
  three.add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color })));
}

function addCurbStone(three, line, color) {
  const [a, b] = line;
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  if (len < 1e-6) return;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(len, 0.05, 0.04),
    new THREE.MeshLambertMaterial({ color }),
  );
  box.position.set((a.x + b.x) / 2, 0.025, (a.z + b.z) / 2);
  box.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
  three.add(box);
}

// Subtle inked expansion joints across a sidewalk band, ~2.4m apart along its
// long edge. Kept flush and low-contrast (a hairline tone just off the concrete)
// so they read as joints, not raised ties.
function addSidewalkScoreLines(three, poly) {
  const edgeA = { x: poly[1].x - poly[0].x, z: poly[1].z - poly[0].z };
  const len = Math.hypot(edgeA.x, edgeA.z);
  const count = Math.max(1, Math.round(len / (2.4 * 0.075)));
  const across0 = { x: poly[3].x - poly[0].x, z: poly[3].z - poly[0].z };
  const acrossLen = Math.hypot(across0.x, across0.z);
  for (let i = 1; i < count; i += 1) {
    const t = i / count;
    const p0 = { x: poly[0].x + edgeA.x * t, z: poly[0].z + edgeA.z * t };
    const p1 = { x: p0.x + across0.x, z: p0.z + across0.z };
    const mid = { x: (p0.x + p1.x) / 2, z: (p0.z + p1.z) / 2 };
    const score = new THREE.Mesh(
      new THREE.BoxGeometry(0.009, 0.0008, acrossLen * 0.9),
      new THREE.MeshLambertMaterial({ color: II_PALETTE.scoreLine, transparent: true, opacity: 0.5 }),
    );
    score.position.set(mid.x, Y.score, mid.z);
    score.rotation.y = -Math.atan2(across0.z, across0.x) + Math.PI / 2;
    three.add(score);
  }
}

function buildGround(three, ground) {
  for (const road of ground.roadbeds) {
    // Derived (Franklin) roadbed sits a hair lower so the two coplanar roadbeds
    // don't z-fight where they overlap at the intersection square.
    const y = road.derived ? Y.roadbed - 0.0003 : Y.roadbed;
    addGroundQuad(three, road.polygon, y, road.derived ? II_PALETTE.asphaltDerived : II_PALETTE.asphalt);
  }
  for (const walk of ground.sidewalks) {
    for (const seg of walk.segments) {
      addGroundQuad(three, seg, Y.sidewalk, walk.derived ? II_PALETTE.concreteDerived : II_PALETTE.concrete);
      addSidewalkScoreLines(three, seg);
    }
  }
  for (const cw of ground.crosswalks) {
    for (const stripe of cw.stripes) addGroundQuad(three, stripe, Y.crosswalk, II_PALETTE.crosswalkPaint);
  }
  for (const curb of ground.curbs) {
    for (const seg of curb.segments) addCurbStone(three, seg, II_PALETTE.curbStone);
  }
}

// Restrained typological corner signals: a dark ink pole, a mast arm reaching
// over the roadway, a three-light head, and a small pedestrian-signal box. Sizes
// are in scene units (~0.075/m); a hero building is ~0.9 tall for reference.
const SIGNAL = { poleH: 0.4, poleR: 0.012, armLen: 0.34, armR: 0.009, head: 0.05, lamp: 0.013 };

function buildFurniture(three, furniture) {
  for (const sig of furniture.signals) {
    buildSignal(three, sig);
  }
}

function buildSignal(three, sig) {
  const { position, mastArmDir } = sig;
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(SIGNAL.poleR, SIGNAL.poleR, SIGNAL.poleH, 8),
    new THREE.MeshLambertMaterial({ color: II_PALETTE.signalPole }),
  );
  pole.position.set(position.x, SIGNAL.poleH / 2, position.z);
  group.add(pole);

  const armMid = {
    x: position.x + mastArmDir.x * (SIGNAL.armLen / 2),
    z: position.z + mastArmDir.z * (SIGNAL.armLen / 2),
  };
  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(SIGNAL.armLen, SIGNAL.armR * 2, SIGNAL.armR * 2),
    new THREE.MeshLambertMaterial({ color: II_PALETTE.signalPole }),
  );
  arm.position.set(armMid.x, SIGNAL.poleH - SIGNAL.armR, armMid.z);
  arm.rotation.y = -Math.atan2(mastArmDir.z, mastArmDir.x);
  group.add(arm);

  const headPos = {
    x: position.x + mastArmDir.x * SIGNAL.armLen,
    z: position.z + mastArmDir.z * SIGNAL.armLen,
  };
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(SIGNAL.head * 0.7, SIGNAL.head * 1.8, SIGNAL.head * 0.7),
    new THREE.MeshLambertMaterial({ color: II_PALETTE.signalHead }),
  );
  const headY = SIGNAL.poleH - SIGNAL.armR - SIGNAL.head * 0.9;
  head.position.set(headPos.x, headY, headPos.z);
  group.add(head);

  const faceX = -mastArmDir.x * SIGNAL.head * 0.4;
  const faceZ = -mastArmDir.z * SIGNAL.head * 0.4;
  const lampColors = [II_PALETTE.signalRed, II_PALETTE.signalAmber, II_PALETTE.signalGreen];
  lampColors.forEach((color, i) => {
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(SIGNAL.lamp, 8, 8),
      new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.35 }),
    );
    lamp.position.set(headPos.x + faceX, headY + SIGNAL.head * (0.55 - i * 0.55), headPos.z + faceZ);
    group.add(lamp);
  });

  const ped = new THREE.Mesh(
    new THREE.BoxGeometry(SIGNAL.head * 0.6, SIGNAL.head * 0.7, SIGNAL.head * 0.35),
    new THREE.MeshLambertMaterial({ color: II_PALETTE.pedSignal }),
  );
  ped.position.set(
    position.x + mastArmDir.x * 0.02,
    SIGNAL.poleH * 0.62,
    position.z + mastArmDir.z * 0.02,
  );
  ped.rotation.y = -Math.atan2(mastArmDir.z, mastArmDir.x);
  group.add(ped);

  three.add(group);
}

// Composite facade elevations: one head-on drawn image unwrapped across the
// street faces of a corner streetwall, possibly spanning multiple footprint
// components (facade group). `u` is the horizontal slice of the (trimmed)
// image per wall; `leftEnd` names the world end of the wall where the
// slice's left side sits. Corner/seam continuity is automatic because
// adjacent slices share their boundary coordinate.
//
// Premier v2 reads left-to-right: Franklin Pizza (far/south end of the
// Franklin St streetwall, on sister building 3322609) -> premier ORGANIC +
// corner storefront (Premier's Franklin face 3322608) -> the corner column at
// u=PREMIER_KINK -> Premier's long Greenpoint Ave face (premier script, bay
// window, fire escapes, residential windows) to u=1.
// 3322609's east edge is contiguous just south of 3322608's, so the two
// footprints share one continuous Franklin frontage.
const PREMIER_KINK = 0.478; // v4 measured drawn corner (contract-compliant render)
const PIZZA_SPLIT = 0.585; // BIN seam: sister east edge 8.6m of the 14.7m streetwall
// Sonny's unwrap reads Greenpoint (fire-escape face) then Franklin (ALTER
// return); fold measured on the drawn pier, matching the real 19.9m : 7.2m.
const SONNYS_KINK = 0.734;
// Sereneco unwrap reads Greenpoint then the Franklin return; fold sits on a
// drawn brick seam at the kit's 11.8m : ~12m ask. Only the franklin slice is
// mapped (the greenpoint face is back-facing to the fixed camera), and it
// covers just the corner-adjacent 12m of the 57m footprint edge (R10G).
const SERENECO_KINK = 0.496;
// 144 Franklin Ave (NE corner, BIN 3064675) — 1895 Romanesque Revival hero.
// One continuous head-on unwrap: the Franklin St return (west face) is the
// single giant-arch bay left of the corner pier; the long 5-bay run right of
// it is the Greenpoint Ave frontage (south face). The fold sits on the corner
// pier at u≈0.29 — the giant Franklin arch spans u0.03..0.28 (3rd-floor arch,
// 2nd-floor window, base door + arched window all end there), and 0.29 matches
// the true wall proportion (Franklin 10.5m : Greenpoint 25.3m). NOTE: an
// earlier pass used 0.155, which bisected the giant arch and pushed half the
// Franklin bay onto the Greenpoint slice — corrected per the Franklin-face
// reference photo (2026-06-15).
const FRANKLIN_144_KINK = 0.29;
const FACADE_COMPOSITES = {
  "premier-franklin-organic": {
    key: "../assets/textures/franklin/premier-franklin-organic--corner-v4.png",
    byBin: {
      "3322609": {
        franklin: { u0: 0, u1: PREMIER_KINK * PIZZA_SPLIT, leftEnd: "south" },
      },
      "3322608": {
        franklin: { u0: PREMIER_KINK * PIZZA_SPLIT, u1: PREMIER_KINK, leftEnd: "south" },
        greenpoint: { u0: PREMIER_KINK, u1: 1, leftEnd: "east" },
      },
    },
  },
  "sonnys-corner": {
    key: "../assets/textures/franklin/sonnys-corner--corner-v3.png",
    byBin: {
      "3064811": {
        greenpoint: { u0: 0, u1: SONNYS_KINK, leftEnd: "east" },
        franklin: { u0: SONNYS_KINK, u1: 1, leftEnd: "north" },
      },
    },
  },
  "144-franklin": {
    key: "../assets/textures/franklin/144-franklin-v2.png",
    byBin: {
      "3064675": {
        // Franklin return (west face): unwrap left edge is the north end of the
        // wall, reading south toward the corner pier at the kink.
        franklin: { u0: 0, u1: FRANKLIN_144_KINK, leftEnd: "north" },
        // Greenpoint frontage (south face): begins at the corner pier (west end)
        // and reads east along the long 5-bay run.
        greenpoint: { u0: FRANKLIN_144_KINK, u1: 1, leftEnd: "west" },
      },
    },
  },
  sereneco: {
    key: "../assets/textures/franklin/sereneco--corner.png",
    byBin: {
      "3337033": {
        franklin: { u0: SERENECO_KINK, u1: 1, leftEnd: "south", coverMeters: 12 },
        // Greenpoint Ave frontage (green "Dinner·Brunch·Bar" awning → black
        // door → WINE·BEER·COCKTAILS → BRUNCH·DINNER bays). v2 is a corner
        // UNWRAP and the fold sits at u≈0.585: left 0..0.585 is the Greenpoint
        // face; right of it is the Franklin return (Sereneco green-tile corner
        // ENTRANCE + wood door, then AZURE GOURMET). The Sereneco entrance/door
        // is on FRANKLIN, not Greenpoint — the franklin face (corner.png, u0
        // 0.496) already begins exactly at the green-tile entrance. Cut here so
        // the door + entrance don't duplicate onto this face. (Derived: bay
        // BRUNCH·DINNER ends u≈0.576, wood door u≈0.615–0.66 — past the cut.)
        greenpoint: { key: "../assets/textures/franklin/sereneco--corner-v2.png", u0: 0, u1: 0.585, leftEnd: "west" },
      },
    },
  },
};

// Registered blocks: add a block's footprint extract + storefront roster here to
// include it in the scene. (Adding a future block = pull data + append two entries.)
const BLOCK_EXTRACTS = [blockFranklinMilton, blockGreenpointEast];
const BLOCK_STOREFRONT_ROSTERS = [blockStorefronts, blockGreenpointEastStorefronts];

const FACADE_GROUP_BINS = {
  "3322609": "premier-franklin-organic",
  // 144 Franklin is a standalone hero with no entry in the R10G truth fixture;
  // registering its BIN here gives it a placeId + wall-by-wall hero treatment.
  // The vertex-snap flush in sceneFrame.js skips it (no same-placeId hero in
  // the wrap fixture), so it keeps its own classified edges.
  "3064675": "144-franklin",
};

// Structured facade specs, keyed "bin:face" — see facadeAssembly.js.
const FACADE_SPECS = {
  ...premierFacadeSpec.faces,
  ...sonnysFacadeSpec.faces,
  ...serenecoFacadeSpec.faces,
  ...franklin144FacadeSpec.faces,
};

// Maps each "BIN:role" face to the spec file it lives in, so the dev recess
// editor can write an edit back to the right JSON.
const SPEC_FILE_BY_FACE = {};
for (const [file, spec] of [
  ["premier-franklin-organic.v0.1.json", premierFacadeSpec],
  ["sonnys-corner.v0.1.json", sonnysFacadeSpec],
  ["sereneco.v0.1.json", serenecoFacadeSpec],
  ["144-franklin.v0.1.json", franklin144FacadeSpec],
]) {
  for (const key of Object.keys(spec.faces)) SPEC_FILE_BY_FACE[key] = file;
}

// Free geometry/materials of a discarded facade assembly (textures are shared
// and left intact) — keeps live editor rebuilds from leaking GPU memory.
function disposeGroup(group) {
  group.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) material.dispose();
    }
  });
}

// Render truthful storefront sign bands on block commercial frontages.
// Each storefront in the OSM roster that has a projected scenePoint is
// assigned to the nearest commercial block-extract building. Hero buildings
// (already getting full hero treatment) are excluded from assignment.
// No interactive card is wired — clicking does nothing for these meshes.
// Render planned storefront signs (enlarged category-label band) for one
// building's bays. `frame` carries the street face basis:
// { left, right, normal, height, point } where point(x, y, off) maps face-local
// coords to world (the same helper the bay loop already builds). Signs add to
// `three` and sit on the building's street face, inheriting per-view culling.
// (Projecting blade signs were trialled and dropped — they didn't read at the
// fixed iso angles; see docs/superpowers/specs/2026-06-16-storefront-sign-system-design.md.)
function buildStorefrontSigns(three, placements, frame) {
  const { point } = frame;
  for (const pl of placements) {
    if (pl.kind !== "band") continue;
    const positions = new Float32Array([
      ...point(pl.cx - pl.width / 2, pl.y0, pl.off),
      ...point(pl.cx + pl.width / 2, pl.y0, pl.off),
      ...point(pl.cx + pl.width / 2, pl.y1, pl.off),
      ...point(pl.cx - pl.width / 2, pl.y1, pl.off),
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    // U flipped so the label reads correctly from the street side (preserves
    // the 2026-06-15 mirror fix, commit 9f6ff2b).
    geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([1,0, 0,0, 0,1, 1,1]), 2));
    geo.setIndex([0,1,2, 0,2,3]);
    three.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      map: makeStorefrontSignTexture(pl.label),
      transparent: true,
      side: THREE.DoubleSide,
    })));
  }
}

// Category fabric tints for awnings (muted II-C tones). Shared by the flat
// strip and the projecting canopy/valance.
const AWNING_TINT = {
  restaurant: 0x6b3a2a,
  cafe:       0x4a3825,
  bar:        0x2e3b32,
  pub:        0x2e3b32,
  clothes:    0x3b4a5c,
  hairdresser:0x3d4030,
  convenience:0x4a4030,
  deli:       0x5c4030,
  interior_decoration: 0x4a3b4a,
};
const AWNING_SOFFIT = 0x2f2820; // dark underside/side closers

// Render planned awnings for one building's bays. `frame` is the same street-
// face basis used for signs, plus `scale` (scene units per metre) for canopy
// projection. Flat awnings are the legacy coplanar tint strip; canopy awnings
// project a sloped top + a vertical valance carrying the name (the iso-legible
// idiom — the valance is perpendicular to the wall band, so it reads front-on
// from whichever angle flattens the band). See PLAN 4.2a.
function buildStorefrontAwnings(three, placements, frame) {
  const { point, scale = 0.075 } = frame;
  for (const pl of placements) {
    if (pl.kind !== "awning") continue;
    const tint = AWNING_TINT[pl.category] ?? II_PALETTE.ink;
    const xl = pl.cx - pl.width / 2;
    const xr = pl.cx + pl.width / 2;

    if (pl.variant === "flat") {
      const off = pl.off ?? 0.025;
      const pos = new Float32Array([
        ...point(xl, pl.y0, off), ...point(xr, pl.y0, off),
        ...point(xr, pl.y1, off), ...point(xl, pl.y1, off),
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setIndex([0, 1, 2, 0, 2, 3]);
      three.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: tint, side: THREE.DoubleSide })));
      continue;
    }

    // Canopy: sloped top from the wall (yWall) out to a front lip (yDrop).
    const wallOff = 0.02;
    const projOff = Math.max(0.04, (pl.projectionM ?? 0.9) * scale);
    const topPos = new Float32Array([
      ...point(xl, pl.yWall, wallOff), ...point(xr, pl.yWall, wallOff),
      ...point(xr, pl.yDrop, projOff), ...point(xl, pl.yDrop, projOff),
    ]);
    const topGeo = new THREE.BufferGeometry();
    topGeo.setAttribute("position", new THREE.BufferAttribute(topPos, 3));
    topGeo.setIndex([0, 1, 2, 0, 2, 3]);
    three.add(new THREE.Mesh(topGeo, new THREE.MeshBasicMaterial({
      color: new THREE.Color(tint).multiplyScalar(0.92), side: THREE.DoubleSide,
    })));

    // Valance: vertical skirt at the front edge, faces the street → iso-legible.
    const valPos = new Float32Array([
      ...point(xl, pl.yDrop, projOff), ...point(xr, pl.yDrop, projOff),
      ...point(xr, pl.yValance, projOff), ...point(xl, pl.yValance, projOff),
    ]);
    const valGeo = new THREE.BufferGeometry();
    valGeo.setAttribute("position", new THREE.BufferAttribute(valPos, 3));
    // U flipped to read from the street side (mirror fix 9f6ff2b).
    valGeo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([1, 0, 0, 0, 0, 1, 1, 1]), 2));
    valGeo.setIndex([0, 1, 2, 0, 2, 3]);
    three.add(new THREE.Mesh(valGeo, new THREE.MeshBasicMaterial({
      map: makeStorefrontValanceTexture(pl.label, tint),
      transparent: true,
      side: THREE.DoubleSide,
    })));

    // Side closers so the canopy reads solid, not as a floating flap.
    for (const sx of [xl, xr]) {
      const sidePos = new Float32Array([
        ...point(sx, pl.yWall, wallOff),
        ...point(sx, pl.yDrop, projOff),
        ...point(sx, pl.yValance, projOff),
      ]);
      const sideGeo = new THREE.BufferGeometry();
      sideGeo.setAttribute("position", new THREE.BufferAttribute(sidePos, 3));
      sideGeo.setIndex([0, 1, 2]);
      three.add(new THREE.Mesh(sideGeo, new THREE.MeshBasicMaterial({ color: AWNING_SOFFIT, side: THREE.DoubleSide })));
    }
  }
}

// SPIKE (2026-06-16): floating-quad spike for the inked-component approach. Superseded
// by the wall-path integration (decorateInkedWall in buildBuildings) — disabled so it
// stops fighting the real block. Kept gated for reference. Empty/false = no-op.
const INKED_FACADE_TEST = [];

// STEP 3 (2026-06-16): the inked brick kit on the real mid-block of Franklin — the
// blockface SOUTH of Premier Organic (same row/face), per Batu's photo. Corners are
// bespoke heroes and excluded. BINs are the consecutive south run off Premier
// (3322608/9): 3064795→3064800, ordered Premier-adjacent → south. Batu confirmed the
// building next to Premier is Awoke Vintage (107), so the block runs 107→105→103→101→99→97.
// Params (tint/storeys/bays) read from the field photos in
// docs/mvp-reference-images/franklin-greenpoint-to-milton-block/. Consumed by buildBuildings
// → decorateInkedWall (wall-mesh path: registers + self-occludes like decorateTypologicalWall).
const INKED_FACADE_REAL = {
  enabled: true,
  // Tints spread for legible separation (alternating brighter warm-red / deep maroon /
  // muted), grounded in the two photo families. storeys/bays counted off the photos.
  // Tints spread for legible separation (alternating brighter warm-red / deep maroon /
  // muted), grounded in the two photo families. storeys/bays counted off the photos;
  // fireEscape flagged where the photos show one.
  buildings: {
    "3064795": { tint: 0xc4724a, storeys: 4, bays: 2, addr: "107 Awoke Vintage", fireEscape: true },
    "3064796": { tint: 0x86504a, storeys: 3, bays: 2, addr: "105 Broken Land" },
    "3064797": { tint: 0xb45e3c, storeys: 4, bays: 3, addr: "103", fireEscape: true },
    "3064798": { tint: 0x744336, storeys: 4, bays: 2, addr: "101" },
    "3064799": { tint: 0xb0644a, storeys: 5, bays: 2, addr: "99 Juice's", fireEscape: true },
    "3064800": { tint: 0x6d4038, storeys: 5, bays: 3, addr: "97 Deli/Compton's" },
  },
};

const INKED_FACADE_BLOCK = {
  enabled: false,
  radiusUnits: CONTEXT_TREATMENT_RADIUS_UNITS, // cluster around the Franklin corner
  minStoreys: 2,
  maxStoreys: 6,
  bayMeters: 3.6, // typical Greenpoint rowhouse bay width
  palette: [0xb5664a, 0x7d5a44, 0x9c5a3c, 0xa8704f, 0x6f4a39, 0xc07a55], // brick tones
};

function loadInkedComponent(file, { repeat, transparent } = {}, getTexture) {
  let tex;
  if (getTexture) {
    tex = getTexture(file, { repeat });
  } else {
    tex = new THREE.TextureLoader().load(
      new URL(`../assets/inked/${file}`, import.meta.url).href,
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    if (repeat) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat[0], repeat[1]);
    }
  }
  return new THREE.MeshBasicMaterial({
    map: tex,
    transparent: !!transparent,
    side: THREE.DoubleSide,
    // Decal bias: the facade sits ~coplanar with the host massing wall; nudge it
    // forward in the depth buffer so it wins over the flat massing without z-fight.
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
  });
}

function buildInkedFacadeTest(three, scene) {
  // INKED_FACADE_REAL is consumed by buildBuildings (wall path), not here.
  if (!INKED_FACADE_TEST.length && !INKED_FACADE_BLOCK.enabled) return;
  const byBin = new Map(scene.buildings.map((b) => [b.bin, b]));

  // Cache: keyed by filename → THREE.Texture. Each distinct file loads at most
  // once per invocation, so identical component PNGs aren't re-uploaded N times.
  const texCache = new Map();
  function cachedTexture(file, { repeat } = {}) {
    if (texCache.has(file)) return texCache.get(file);
    const tex = new THREE.TextureLoader().load(
      new URL(`../assets/inked/${file}`, import.meta.url).href,
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    if (repeat) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat[0], repeat[1]);
    }
    texCache.set(file, tex);
    return tex;
  }

  // Hand-built BufferGeometry has no reliable bounding sphere for frustum culling;
  // disable it so these (few, spike-only) meshes never get wrongly culled.
  function addInked(geo, mat) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    three.add(mesh);
  }

  // Compose + render one building's inked facade. `bays` null → derive from the
  // chosen frontage width. Shared by the explicit-BIN list and the block stamp.
  function stampInkedFacade(building, tint, bays, storeysOverride, faceDir) {
    if (!building || !building.polygon || !building.centroid) return;
    const typ = classifyBuilding({ sourceProperties: building.sourceProperties ?? {} });
    const storeys = storeysOverride ?? Math.max(2, typ.storeyCount ?? 4);

    const edges = footprintEdges(building.polygon, building.centroid);
    if (!edges.length) return;
    // SPIKE: pick the edge whose outward normal best faces a target direction,
    // weighted by width. Longest-edge alone lands the facade on an interior party
    // wall (occluded). Default target = the camera at ISO step 0 (visible faces point
    // toward (-x,+z), verified in-engine). A caller can pass `faceDir` to aim the
    // facade at the actual STREET instead (the block-stamp / Step-3 case, where the
    // street frontage is NOT the camera-facing edge). (proper face selection needs
    // per-building street-proximity geometry.)
    const dirX = faceDir ? faceDir.x : -Math.SQRT1_2;
    const dirZ = faceDir ? faceDir.z : Math.SQRT1_2;
    const faceScore = (e) => (e.normal.x * dirX + e.normal.z * dirZ) * e.length;
    const edge = edges.slice().sort((a, b) => faceScore(b) - faceScore(a))[0];

    // Derive bays from frontage width when not given.
    const frontageM = edge.length / scene.projection.scale;
    const resolvedBays = bays ?? Math.min(6, Math.max(2, Math.round(frontageM / INKED_FACADE_BLOCK.bayMeters)));

    const { left, right, normal } = faceFrame(edge, building.height, null, scene);
    const point = (x, y, off) => [
      left.x + (right.x - left.x) * x + normal.x * off,
      y * building.height,
      left.z + (right.z - left.z) * x + normal.z * off,
    ];
    const quad = (r, off, uvFlip = true) => {
      const positions = new Float32Array([
        ...point(r.x0, r.y0, off), ...point(r.x1, r.y0, off),
        ...point(r.x1, r.y1, off), ...point(r.x0, r.y1, off),
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const uv = uvFlip ? [1,0, 0,0, 0,1, 1,1] : [0,0, 1,0, 1,1, 0,1];
      geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
      geo.setIndex([0, 1, 2, 0, 2, 3]);
      return geo;
    };

    const f = composeInkedFacade({ storeys, bays: resolvedBays });

    // Wall (tiled brick), tinted.
    const wallMat = loadInkedComponent("brick-wall.v1.png", { repeat: [resolvedBays, storeys] }, cachedTexture);
    wallMat.color.setHex(tint);
    addInked(quad(f.wall, 0.02), wallMat);

    // Ground floor band (opaque), tinted.
    const groundMat = loadInkedComponent("brick-ground.v1.png", {}, cachedTexture);
    groundMat.color.setHex(tint);
    addInked(quad(f.ground, 0.03), groundMat);

    // Cornice strip (alpha), tinted.
    const corniceMat = loadInkedComponent("brick-cornice.v1.png", { transparent: true }, cachedTexture);
    corniceMat.color.setHex(tint);
    addInked(quad(f.cornice, 0.04), corniceMat);

    // Windows (alpha), NOT tinted. All windows share one material — same file,
    // same alpha config, no tint — so we build it once and reuse the instance.
    const winMat = new THREE.MeshBasicMaterial({
      map: cachedTexture("brick-window.v1.png"),
      transparent: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -6,
      polygonOffsetUnits: -6,
    });
    for (const w of f.windows) {
      addInked(quad(w, 0.035), winMat);
    }
  }

  // Throwaway floating-quad passes (superseded by decorateInkedWall in buildBuildings).
  const explicitBins = new Set();
  for (const { bin, tint } of INKED_FACADE_TEST) {
    explicitBins.add(bin);
    stampInkedFacade(byBin.get(bin), tint, 3);
  }
  if (INKED_FACADE_BLOCK.enabled) {
    for (const b of scene.buildings) {
      if (!b.fromBlockExtract || !b.sourceProperties || !b.polygon || !b.centroid) continue;
      if (explicitBins.has(b.bin)) continue;
      if (Math.hypot(b.centroid.x, b.centroid.z) > INKED_FACADE_BLOCK.radiusUnits) continue;
      const typ = classifyBuilding({ sourceProperties: b.sourceProperties });
      if (typ.materialFamily !== "brick-prewar") continue;
      if (typ.storeyCount < INKED_FACADE_BLOCK.minStoreys || typ.storeyCount > INKED_FACADE_BLOCK.maxStoreys) continue;
      let h = 0;
      for (const ch of b.bin) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      stampInkedFacade(b, INKED_FACADE_BLOCK.palette[h % INKED_FACADE_BLOCK.palette.length], null);
    }
  }
}

function buildBlockStorefronts(three, scene) {
  // Build a normalized set of hero business names sourced from the hero-places
  // file. heroPlaces is a top-level array; each record carries name at record.name
  // or record.business?.name. This keeps the exclusion set in sync with the file
  // automatically — no hardcoded literal array needed.
  const heroNameArr = Array.isArray(heroPlaces)
    ? heroPlaces
    : (heroPlaces.places ?? heroPlaces.records ?? heroPlaces.heroes ?? []);
  const heroNames = new Set(
    heroNameArr
      .map((r) => (r.name ?? r.business?.name ?? "").trim().toLowerCase())
      .filter(Boolean),
  );

  // Step 1: project roster points into scene units; drop any without a point.
  const allStorefronts = BLOCK_STOREFRONT_ROSTERS.flatMap((r) => r.storefronts);
  const projectedRaw = allStorefronts
    .map((s) => ({ ...s, scenePoint: s.point ? scene.projection.project(s.point) : null }))
    .filter((s) => s.scenePoint != null);

  // Step 1b: dedup-by-proximity — overlapping block bboxes surface the same
  // business twice ("Land of Barbers" / "The Land of Barbers") at near-identical
  // points; collapse those before assignment. ~4m in scene units (SCALING_LOG).
  const projected = dedupeByProximity(projectedRaw, 4 * scene.projection.scale);

  // Step 2a: hero-name guard — drop any storefront whose name is already
  // claimed by a hero business regardless of spatial proximity.
  const nonHeroByName = projected.filter(
    (s) => !heroNames.has(s.name.trim().toLowerCase()),
  );

  // Step 2b: hero-proximity guard — if the nearest building to a storefront
  // is a hero, the storefront belongs to that hero's treatment; drop it here.

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.z - b.z);
  }

  const survivors = nonHeroByName.filter((s) => {
    let nearest = null;
    let nearestDist = Infinity;
    for (const bldg of scene.buildings) {
      if (!bldg.centroid) continue;
      const d = dist(s.scenePoint, bldg.centroid);
      if (d < nearestDist) { nearestDist = d; nearest = bldg; }
    }
    // Drop if nearest building is a hero.
    return nearest ? !nearest.isHero : true;
  });

  // Step 3: build list of commercial block-extract buildings for the assigner.
  const blockCommercial = scene.buildings
    .filter((b) => b.fromBlockExtract && b.sourceProperties)
    .map((b) => ({ b, t: classifyBuilding({ sourceProperties: b.sourceProperties }) }))
    .filter((x) => x.t.groundFloorUse === "commercial")
    .map((x) => ({
      bin: x.b.bin,
      groundFloorUse: "commercial",
      frontage: { scenePoint: x.b.centroid },
    }));

  const byBin = new Map(scene.buildings.map((b) => [b.bin, b]));

  if (blockCommercial.length === 0 || survivors.length === 0) return;

  // Step 4: assign — force point-only path (houseNumber null for all survivors).
  const roster = survivors.map((s) => ({
    name: s.name,
    category: s.category,
    houseNumber: null,
    scenePoint: s.scenePoint,
    sourceId: s.sourceId,
    confidence: s.confidence,
    activeStatus: s.activeStatus,
  }));
  const bays = assignStorefronts(blockCommercial, roster, { axis: "x" });

  // Build a name→scenePoint lookup so each bay can recover the OSM point that
  // identifies which building edge faces the street. Names are unique enough
  // within the survivors list; first-match is fine.
  const pointByName = new Map(survivors.map((s) => [s.name, s.scenePoint]));

  // Step 5: group bays by bin so we know the per-building slot count for
  // horizontal offset calculation.
  const baysByBin = new Map();
  for (const bay of bays) {
    if (!baysByBin.has(bay.bin)) baysByBin.set(bay.bin, []);
    baysByBin.get(bay.bin).push(bay);
  }

  // Step 6: render sign + awning for each bay.
  for (const [bin, binBays] of baysByBin) {
    const building = byBin.get(bin);
    if (!building || !building.polygon || !building.centroid) continue;

    const typology = classifyBuilding({ sourceProperties: building.sourceProperties ?? {} });
    const storeys = Math.max(1, typology.storeyCount);

    // Street-frontage edge: the edge whose midpoint is nearest the storefront's
    // OSM scenePoint. That point sits at the real shop location on the street,
    // so the closest midpoint identifies the street face — not the longest edge,
    // which for a deep narrow rowhouse would be the party-wall side.
    const edges = footprintEdges(building.polygon, building.centroid);
    if (!edges.length) continue;

    // Collect the scenePoints of all bays assigned to this building so we can
    // pick the edge closest to the cluster of storefronts on the block.
    const bayScenePoints = binBays
      .map((bay) => pointByName.get(bay.name))
      .filter(Boolean);

    // Average the bay scenePoints to get a single representative street point.
    // Fallback: use building centroid (preserves longest-edge behaviour).
    const refPoint =
      bayScenePoints.length > 0
        ? {
            x: bayScenePoints.reduce((s, p) => s + p.x, 0) / bayScenePoints.length,
            z: bayScenePoints.reduce((s, p) => s + p.z, 0) / bayScenePoints.length,
          }
        : building.centroid;

    const MIN_EDGE_METERS = 3;
    const edge =
      edges
        .filter((e) => e.length / scene.projection.scale > MIN_EDGE_METERS)
        .sort((a, b) => dist(a.midpoint, refPoint) - dist(b.midpoint, refPoint))[0]
      ?? edges.sort((a, b) => b.length - a.length)[0]; // fallback: longest

    const { left, right, normal } = faceFrame(edge, building.height, null, scene);

    // Local point helper: face-unit coords → world coords.
    const point = (x, y, off) => [
      left.x + (right.x - left.x) * x + normal.x * off,
      y * building.height,
      left.z + (right.z - left.z) * x + normal.z * off,
    ];

    // Signs + awnings (category-label band, flat strip, or projecting canopy/
    // valance) come from the pure planner; the renderer maps the face-local
    // placements to world geometry on this building's street face. Labels are
    // category defaults (real branding only when a bay is claimed).
    const frame = { left, right, normal, height: building.height, point, scale: scene.projection.scale };
    const placements = planStorefrontSigns({ bays: binBays, storeys });
    buildStorefrontSigns(three, placements, frame);
    buildStorefrontAwnings(three, placements, frame);
  }
}

function buildBuildings(three, scene, requestRender, isActive = () => true, addCullable = () => ({})) {
  scene.buildings.forEach((building, index) => {
    if (building.isHero && building.edges) {
      buildHeroBuilding(three, building, scene, requestRender, isActive, addCullable);
      return;
    }
    const shape = footprintShape(building.polygon);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: building.height, bevelEnabled: false });
    // Block-extract buildings carry PLUTO sourceProperties — classify them for
    // data-differentiated wall tone and typological decoration. Non-block
    // context buildings keep the existing rotating palette.
    // Step-3 inked mid-block buildings: tint the massing to the building's brick
    // tone so any peek of the extrude (roof, party-wall sliver) matches the inked
    // facade that gets hung on it below.
    const inkedParams = INKED_FACADE_REAL.enabled
      ? INKED_FACADE_REAL.buildings[building.bin]
      : null;
    let typology = null;
    let color;
    if (inkedParams) {
      color = inkedParams.tint;
    } else if (building.fromBlockExtract && building.sourceProperties) {
      typology = classifyBuilding({ sourceProperties: building.sourceProperties });
      color = resolveTypologyColor(typology);
    } else {
      color = II_PALETTE.context[index % II_PALETTE.context.length];
    }
    // ExtrudeGeometry material slots: 0 = caps (roof), 1 = side walls.
    // Darker inked roof caps keep large masses from reading as flat slabs. Inked
    // buildings keep a neutral dark roof (the brick tint is for the walls only).
    const roof = inkedParams
      ? new THREE.Color(0x46443f)
      : new THREE.Color(color).multiplyScalar(0.5);
    const body = new THREE.Mesh(geometry, [
      new THREE.MeshLambertMaterial({ color: roof }),
      new THREE.MeshLambertMaterial({ color }),
    ]);
    body.rotation.x = -Math.PI / 2;
    body.userData = { bin: building.bin, placeId: building.placeId };
    three.add(body);

    // Block buildings always get typological decoration (storey lines + windows)
    // regardless of distance to intersection. Context buildings keep the existing
    // 48 m radius gate. The opaque extrude self-occludes its own back-wall
    // decoration, so no per-view culling is needed here.
    const dist = Math.hypot(building.centroid.x, building.centroid.z);
    if (inkedParams) {
      // Inked component kit on every edge; the opaque mass occludes back walls.
      const deco = new THREE.Group();
      for (const edge of footprintEdges(building.polygon, building.centroid)) {
        decorateInkedWall(deco, edge, building.height, inkedParams, scene);
      }
      three.add(deco);
    } else if (building.fromBlockExtract || dist <= CONTEXT_TREATMENT_RADIUS_UNITS) {
      const deco = new THREE.Group();
      for (const edge of footprintEdges(building.polygon, building.centroid)) {
        decorateTypologicalWall(deco, edge, building.height, color, scene, true, typology);
      }
      three.add(deco);
    }
  });
}

// Hero buildings are built wall-by-wall so generated II-style facade
// elevations map directly onto the real footprint edges, the two street
// faces share a crisp corner, the roof carries an inked parapet texture,
// and an II-C cast-shadow shape grounds the mass.
function buildHeroBuilding(three, building, scene, requestRender, isActive = () => true, addCullable = () => ({})) {
  // All of this hero's meshes go under one group tagged with its placeId, so a
  // click anywhere on the building (walls, storefront assembly, roof, parapet,
  // shadow) resolves to a selectable place. The group sits at identity/origin,
  // so geometry is unchanged. Raycasting recurses into it; faceKeyAt still
  // walks parents, so the recess editor keeps working one level deeper.
  const heroGroup = new THREE.Group();
  heroGroup.userData.placeId = building.placeId;
  const baseColor = II_PALETTE.heroes[building.placeId] ?? II_PALETTE.context[0];
  // Benchmark-style face shading: lit street faces, darker returns.
  const faceShade = { greenpoint: 1.0, franklin: 0.9, other: 0.78 };

  const composite = FACADE_COMPOSITES[building.placeId];
  // A face may override composite.key with its own texture (Sereneco's
  // greenpoint face uses the v2 re-render while franklin keeps the original
  // corner.png). Load each distinct texture once and fan it out to its faces.
  const faceTextureUrl = (face) =>
    composite ? facadeTextureUrls[face?.key ?? composite.key] : undefined;
  const textureCache = new Map(); // url -> { texture, waiters[] }
  const loadFaceTexture = (url, apply) => {
    if (!url) return;
    let entry = textureCache.get(url);
    if (!entry) {
      entry = { texture: null, waiters: [] };
      textureCache.set(url, entry);
      loadTrimmedTexture(url, (texture) => {
        // Bail if this effect run was torn down (StrictMode) before the
        // texture resolved — otherwise it registers a rebuild into a dead scene.
        if (!isActive()) return;
        entry.texture = texture;
        for (const w of entry.waiters) w(texture);
        requestRender?.();
      });
    }
    entry.waiters.push(apply);
    if (entry.texture) apply(entry.texture);
  };

  // The longest edge per street role carries the elevation slice.
  const textureEdge = {};
  for (const edge of building.edges) {
    if (edge.role === "other") continue;
    if (!textureEdge[edge.role] || edge.length > textureEdge[edge.role].length) {
      textureEdge[edge.role] = edge;
    }
  }

  // Multi-BIN composites (Premier + its Pizza sister) are facade flats whose
  // uncovered edges are interior party walls along the lot line. Single-BIN
  // composites (Sonny's, Sereneco) keep their uncovered edges — those are
  // real exterior walls (e.g. Sonny's camera-facing east wall).
  const isGroupComposite = Boolean(composite) && Object.keys(composite.byBin).length > 1;

  for (const edge of building.edges) {
    const face = composite?.byBin?.[building.bin]?.[edge.role];
    // In a facade group (Premier + its Pizza sister) the uncovered edges are
    // partly the shared interior lot-line wall between the two parcels and
    // partly real exterior rear/side wall of the whole mass. The interior runs
    // must stay dropped — under the rotating camera they'd read as a "floating
    // plane" inside the building — while the exposed runs must be rendered, or
    // the facade flat shows see-through holes the moment the camera rotates.
    // A whole edge can be both (different-width parcels), so clip to the
    // exposed sub-segments rather than keep/drop the edge on one sample.
    if (isGroupComposite && !face) {
      const siblings = scene.buildings.filter(
        (other) => other !== building && other.placeId === building.placeId,
      );
      const segments = exposedSegments(edge, siblings);
      if (!segments.length) continue; // fully interior — nothing exposed
      const segShade = faceShade.other;
      const segColor = new THREE.Color(baseColor)
        .lerp(new THREE.Color(0x6b5e52), 0.5)
        .multiplyScalar(segShade);
      for (const seg of segments) {
        const segEdge = {
          ...edge,
          start: seg.start,
          end: seg.end,
          length: seg.length,
          midpoint: { x: (seg.start.x + seg.end.x) / 2, z: (seg.start.z + seg.end.z) / 2 },
        };
        const segWall = new THREE.Mesh(
          wallQuad(segEdge, building.height, null, scene),
          new THREE.MeshBasicMaterial({ color: segColor, side: THREE.DoubleSide }),
        );
        segWall.userData = { facadeSlot: `${building.placeId}--${edge.role}` };
        heroGroup.add(segWall);
        addCullable(segWall, edge.normal);
        decorateTypologicalWall(segWall, segEdge, building.height, segColor.getHex(), scene);
      }
      continue;
    }
    // Every wall is built; back-facing returns are hidden per current view via
    // their outward normal (registered as a cullable below), not dropped here.
    // This is real back-face culling — needed because adjacent faces wind
    // oppositely (different `leftEnd`), so FrontSide culling is unreliable —
    // and it now follows the rotating camera instead of the old fixed azimuth.
    const isTextured = Boolean(face) && textureEdge[edge.role] === edge && Boolean(faceTextureUrl(face));
    const specFace = isTextured ? FACADE_SPECS[`${building.bin}:${edge.role}`] : null;
    // In a facade group, any face the composite doesn't cover is a party
    // wall (e.g. the sister's lot-line edges behind Premier) — muted, never
    // street-bright, even if it geometrically faces a street.
    const effectiveRole = isGroupComposite ? (face ? edge.role : "other") : edge.role;
    const shade = faceShade[effectiveRole] ?? faceShade.other;
    const wallColor =
      isGroupComposite && !face
        ? new THREE.Color(baseColor).lerp(new THREE.Color(0x6b5e52), 0.5).multiplyScalar(shade)
        : new THREE.Color(baseColor).multiplyScalar(shade);

    // A face with coverMeters maps its texture slice onto only the first N
    // meters of the wall from the slice's left end (Sereneco: the 12m
    // corner-adjacent return of a 57m footprint edge). The remainder renders
    // as a plain context-toned wall.
    let renderEdge = edge;
    if (isTextured && face.coverMeters) {
      const frame = faceFrame(edge, building.height, face, scene);
      const coverUnits = Math.min(face.coverMeters * scene.projection.scale, edge.length);
      const dx = (frame.right.x - frame.left.x) / edge.length;
      const dz = (frame.right.z - frame.left.z) / edge.length;
      const cut = { x: frame.left.x + dx * coverUnits, z: frame.left.z + dz * coverUnits };
      renderEdge = { ...edge, start: frame.left, end: cut, length: coverUnits };
      if (edge.length - coverUnits > 1e-6) {
        const rest = new THREE.Mesh(
          wallQuad({ ...edge, start: cut, end: frame.right, length: edge.length - coverUnits }, building.height, null, scene),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(baseColor).multiplyScalar(faceShade.other),
            side: THREE.DoubleSide,
          }),
        );
        heroGroup.add(rest);
        addCullable(rest, edge.normal);
      }
    }

    const material = new THREE.MeshBasicMaterial({
      color: wallColor,
      side: THREE.DoubleSide,
    });
    const wall = new THREE.Mesh(wallQuad(renderEdge, building.height, isTextured ? face : null, scene), material);
    wall.userData = { facadeSlot: `${building.placeId}--${edge.role}` };
    heroGroup.add(wall);
    const cull = addCullable(wall, edge.normal);

    // Exposed exterior non-street faces (rears/sides; interior party walls
    // already dropped at the group-composite guard) get a typological brick
    // back-wall treatment instead of staying a flat colored slab.
    if (!isTextured) {
      decorateTypologicalWall(wall, renderEdge, building.height, wallColor.getHex(), scene);
      continue;
    }
    const faceKey = `${building.bin}:${edge.role}`;
    const apply = specFace
      ? (texture) => {
          // Structured facade: swap the flat wall for the component assembly.
          // The build is wrapped in a rebuild closure so the dev recess editor
          // can re-snap this one face live (remove old group, build new).
          heroGroup.remove(wall);
          const frame = faceFrame(renderEdge, building.height, face, scene);
          const debug = new URLSearchParams(window.location.search).get("specdebug") === "1";
          const hexBase = new THREE.Color(baseColor).multiplyScalar(shade).getHex();
          let current = null;
          const rebuild = (specOverride) => {
            if (current) {
              heroGroup.remove(current);
              disposeGroup(current);
            }
            current = buildFacadeAssembly({ frame, spec: specOverride, texture, unitsPerMeter: scene.projection.scale, baseColor: hexBase, debug });
            current.userData.faceKey = faceKey;
            heroGroup.add(current);
            cull.object = current; // rotation re-culls the assembly, not the discarded wall
            cull.refresh(); // re-cull for the live azimuth — never inherit the
            // stale flat-wall visibility (frozen at load), which would hide any
            // face that wasn't camera-facing at first build on every live edit.
            requestRender?.();
          };
          rebuild(specFace);
          registerFacadeFace(faceKey, { rebuild, texture, u0: face.u0, u1: face.u1, flip: Boolean(face.flip), file: SPEC_FILE_BY_FACE[faceKey], faceSpec: specFace });
        }
      : (texture) => {
          material.map = texture;
          material.color.setScalar(shade);
          material.needsUpdate = true;
        };
    loadFaceTexture(faceTextureUrl(face), apply);
  }

  // Roof field: warm membrane tone with paper-grain speckle. The texture
  // transform maps the footprint bbox onto the canvas square (ShapeGeometry
  // UVs equal the shape coordinates).
  const shape = footprintShape(building.polygon);
  const roofGeometry = new THREE.ShapeGeometry(shape);
  const roofTexture = makeRoofTexture();
  const box = new THREE.Box2().setFromPoints(building.polygon.map((p) => new THREE.Vector2(p.x, -p.z)));
  roofTexture.repeat.set(1 / (box.max.x - box.min.x), 1 / (box.max.y - box.min.y));
  roofTexture.offset.set(-box.min.x * roofTexture.repeat.x, -box.min.y * roofTexture.repeat.y);
  const roofMesh = new THREE.Mesh(roofGeometry, new THREE.MeshBasicMaterial({ map: roofTexture }));
  roofMesh.rotation.x = -Math.PI / 2;
  roofMesh.position.y = building.height;
  heroGroup.add(roofMesh);

  // Parapet ring only on edges without a drawn cornice — spec'd street
  // faces carry their own cornice-to-roofline assembly, so a second
  // geometric parapet would double the roofline there.
  const parapetHeight = 0.05;
  const parapetThickness = 0.024;
  for (const edge of building.edges) {
    if (FACADE_SPECS[`${building.bin}:${edge.role}`]?.cornice) continue;
    const { start, end } = edge;
    const segment = new THREE.Mesh(
      new THREE.BoxGeometry(edge.length + parapetThickness, parapetHeight, parapetThickness),
      new THREE.MeshLambertMaterial({ color: 0xc7b896 }),
    );
    segment.position.set(
      (start.x + end.x) / 2,
      building.height + parapetHeight / 2,
      (start.z + end.z) / 2,
    );
    segment.rotation.y = -Math.atan2(end.z - start.z, end.x - start.x);
    heroGroup.add(segment);
    const edgeLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(segment.geometry),
      new THREE.LineBasicMaterial({ color: II_PALETTE.ink, transparent: true, opacity: 0.5 }),
    );
    edgeLines.position.copy(segment.position);
    edgeLines.rotation.copy(segment.rotation);
    heroGroup.add(edgeLines);
  }

  // (The corner storefronts now wrap the fold themselves — recessed glass,
  // awning, and cornice each extend past the corner edge to meet the
  // perpendicular face — so no corner pier is needed to mask a seam.)

  // Inked cast shadow (II-C shadow-shape language). Thrown toward the
  // east/Franklin side, which the fixed northeast camera can see — matching
  // where the benchmark pools its shading.
  const shadowMesh = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshBasicMaterial({ color: II_PALETTE.ink, transparent: true, opacity: 0.16, depthWrite: false }),
  );
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(building.height * 0.2, 0.004, building.height * 0.07);
  heroGroup.add(shadowMesh);

  three.add(heroGroup);
}

// World-space wall quad for one footprint edge. For textured faces the UV
// slice comes from the composite config, and the edge endpoints are ordered
// so the image slice's left side lands on the named world end (e.g. the
// drawn elevation reads west-to-east along Greenpoint, then wraps the
// corner and reads north-to-south down Franklin).
// The face frame fixes the drawn-elevation coordinate system on a wall:
// `left` is the world end carrying the image slice's left side, and u0/u1
// are the texture coordinates across the slice. Both the flat wall quad and
// the structured facade assembly build from it.
function faceFrame(edge, height, face, scene) {
  let left = edge.start;
  let right = edge.end;
  if (face) {
    // Axis chosen so the smaller dot product identifies the named end:
    // greenpointAxis points east, franklinAxis points south.
    const gp = scene.greenpointAxis;
    const fk = scene.franklinAxis;
    const axis = {
      west: gp,
      east: { x: -gp.x, z: -gp.z },
      north: fk,
      south: { x: -fk.x, z: -fk.z },
    }[face.leftEnd];
    const dotStart = edge.start.x * axis.x + edge.start.z * axis.z;
    const dotEnd = edge.end.x * axis.x + edge.end.z * axis.z;
    if (dotEnd < dotStart) {
      left = edge.end;
      right = edge.start;
    }
  }
  let u0 = face ? face.u0 : 0;
  let u1 = face ? face.u1 : 1;
  if (face?.flip) [u0, u1] = [u1, u0];
  return { left, right, normal: edge.normal, height, u0, u1 };
}

function wallQuad(edge, height, face, scene) {
  const { left, right, u0, u1 } = faceFrame(edge, height, face, scene);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array([
    left.x, 0, left.z,
    right.x, 0, right.z,
    right.x, height, right.z,
    left.x, height, left.z,
  ]);
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([u0, 0, u1, 0, u1, 1, u0, 1]), 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.computeVertexNormals();
  return geometry;
}

function sharedEndpoint(edgeA, edgeB) {
  for (const a of [edgeA.start, edgeA.end]) {
    for (const b of [edgeB.start, edgeB.end]) {
      if (Math.hypot(a.x - b.x, a.z - b.z) < 0.02) return a;
    }
  }
  return null;
}

function footprintShape(polygon) {
  const shape = new THREE.Shape();
  polygon.forEach((point, pointIndex) => {
    if (pointIndex === 0) shape.moveTo(point.x, -point.z);
    else shape.lineTo(point.x, -point.z);
  });
  return shape;
}

// World-space edges of a footprint with outward normals (away from centroid).
// Lighter-weight than the hero edge classification — context buildings don't
// need street-role tagging, just walls to hang the typological treatment on.
function footprintEdges(polygon, centroid) {
  const edges = [];
  const n = polygon.length;
  for (let i = 0; i < n; i += 1) {
    const start = polygon[i];
    const end = polygon[(i + 1) % n];
    const length = Math.hypot(end.x - start.x, end.z - start.z);
    if (length < 1e-6) continue;
    const dir = { x: (end.x - start.x) / length, z: (end.z - start.z) / length };
    let normal = { x: -dir.z, z: dir.x };
    const mid = { x: (start.x + end.x) / 2, z: (start.z + end.z) / 2 };
    if (normal.x * (centroid.x - mid.x) + normal.z * (centroid.z - mid.z) > 0) {
      normal = { x: -normal.x, z: -normal.z };
    }
    edges.push({ start, end, length, normal, midpoint: mid });
  }
  return edges;
}

// Typological back-wall treatment for a hero's exposed non-street faces:
// faint storey score-lines + a sparse grid of dark "punched" windows, drawn
// in the II-C flat-inked idiom (windows are dark shapes sitting a hair proud
// of the brick, not real recesses) so rotated views read as real building
// backs instead of flat colored slabs. The decoration meshes are parented
// under `wall`, so they inherit its per-view cull visibility for free.
function decorateTypologicalWall(target, edge, height, baseColorHex, scene, lit = false, typology = null) {
  const { left, right, normal } = faceFrame(edge, height, null, scene);
  const upm = scene.projection.scale;
  const lengthM = edge.length / upm;
  const heightM = height / upm;
  if (lengthM < 2 || heightM < 2) return; // too small to read; leave flat

  const point = (x, y, off) => [
    left.x + (right.x - left.x) * x + normal.x * off,
    y * height,
    left.z + (right.z - left.z) * x + normal.z * off,
  ];
  // `lit` matches the host surface's shading: hero walls are flat MeshBasic, so
  // their decoration is too; context masses are MeshLambert (sun-shaded), so
  // their decoration must be Lambert as well or a flat-bright window can end up
  // lighter than the shadowed wall it sits on.
  const quad = (x0, x1, y0, y1, off, color, opacity) => {
    const g = new THREE.BufferGeometry();
    const p = [point(x0, y0, off), point(x1, y0, off), point(x1, y1, off), point(x0, y1, off)];
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(p.flat()), 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    if (lit) g.computeVertexNormals();
    const Material = lit ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;
    const m = new Material({
      color,
      side: THREE.DoubleSide,
      transparent: opacity < 1,
      opacity,
    });
    return new THREE.Mesh(g, m);
  };

  const base = new THREE.Color(baseColorHex);
  const courseColor = base.clone().multiplyScalar(0.72);
  const windowColor = base.clone().multiplyScalar(0.34);
  const lintelColor = new THREE.Color(II_PALETTE.ink);

  // When typology is provided (block-extract buildings), use the real storey
  // count from PLUTO data instead of deriving it from the mesh height.
  const floors = typology
    ? Math.min(8, Math.max(1, typology.storeyCount))
    : Math.min(6, Math.max(2, Math.round(heightM / 3.5)));
  const cols = Math.min(6, Math.max(1, Math.floor(lengthM / 4.5)));

  // Faint horizontal storey lines (skip ground line and roofline).
  for (let f = 1; f < floors; f += 1) {
    const y = f / floors;
    target.add(quad(0.04, 0.96, y - 0.004, y + 0.004, 0.006, courseColor, 0.35));
  }

  // Commercial ground floor: a wide glazed shop base replaces the punched
  // window on floor 0, giving the building a distinct commercial reading.
  const isCommercial = typology && typology.groundFloorUse === "commercial";
  if (isCommercial) {
    // Wide dark glazing across the full ground-storey bay.
    const glassColor = base.clone().multiplyScalar(0.30);
    target.add(quad(0.06, 0.94, 0.06 / floors, 0.82 / floors, 0.004, glassColor, 1));
    // Thin lintel / sign-shelf line just above the glazing.
    target.add(quad(0.04, 0.96, 0.84 / floors, 0.9 / floors, 0.008, lintelColor, 0.4));
  }

  // Sparse window grid: one column band per `cols`, one row per storey, inset
  // from the edges and from each storey's floor/ceiling. For commercial
  // buildings the ground floor (f=0) is handled above; skip it here.
  const winW = Math.min(0.5 / cols, (1.1 * upm) / edge.length);
  const floorStart = isCommercial ? 1 : 0;
  for (let c = 0; c < cols; c += 1) {
    const cx = (c + 0.5) / cols;
    for (let f = floorStart; f < floors; f += 1) {
      const cyBottom = (f + 0.26) / floors;
      const cyTop = (f + 0.78) / floors;
      const x0 = cx - winW / 2;
      const x1 = cx + winW / 2;
      target.add(quad(x0, x1, cyBottom, cyTop, 0.004, windowColor, 1));
      // thin ink lintel shadow above the opening
      target.add(quad(x0, x1, cyTop, cyTop + 0.012, 0.008, lintelColor, 0.3));
    }
  }
}

// Module-memoized inked-component textures. Keyed by file (+ repeat) so each
// distinct (image, tiling) loads at most once. Repeat varies per building (bays ×
// storeys), so a handful of brick-wall variants is expected.
const __inkedTexCache = new Map();
let __glazingTex = null; // shared inked-glass texture (built once)
function inkedTexture(file, repeat) {
  const key = repeat ? `${file}@${repeat[0]}x${repeat[1]}` : file;
  if (__inkedTexCache.has(key)) return __inkedTexCache.get(key);
  const tex = new THREE.TextureLoader().load(new URL(`../assets/inked/${file}`, import.meta.url).href);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  __inkedTexCache.set(key, tex);
  return tex;
}

// Inked component-kit facade on one wall edge. Same registration model as
// decorateTypologicalWall: quads sit a hair proud of the wall (outward normal
// offset), parented under `target`, relying on the opaque massing to occlude
// back walls — so this works at block density where scene-root floating quads
// mis-register/bleed. Composes wall (tiled brick) + ground band + window grid +
// cornice from `params` (tint, storeys, bays); window/cornice are alpha-keyed.
function decorateInkedWall(target, edge, height, params, scene) {
  const { left, right, normal } = faceFrame(edge, height, null, scene);
  const upm = scene.projection.scale;
  if (edge.length / upm < 2 || height / upm < 2) return; // too small to read
  const point = (x, y, off) => [
    left.x + (right.x - left.x) * x + normal.x * off,
    y * height,
    left.z + (right.z - left.z) * x + normal.z * off,
  ];
  // tex null → solid-color quad (used for party-wall seams).
  const quad = (r, off, tex, { tint, transparent } = {}) => {
    const g = new THREE.BufferGeometry();
    const p = [point(r.x0, r.y0, off), point(r.x1, r.y0, off), point(r.x1, r.y1, off), point(r.x0, r.y1, off)];
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(p.flat()), 3));
    g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([1, 0, 0, 0, 0, 1, 1, 1]), 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    const m = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: !!transparent });
    if (tex) m.map = tex;
    if (tint != null) m.color.setHex(tint);
    target.add(new THREE.Mesh(g, m));
  };
  const darken = (hex, k) => new THREE.Color(hex).multiplyScalar(k).getHex();
  const f = composeInkedFacade({ storeys: params.storeys, bays: params.bays });
  quad(f.wall, 0.004, inkedTexture("brick-wall.v1.png", [params.bays, params.storeys]), { tint: params.tint });
  // Commercial BINs carry a `storefront` block → draw the inked storefront
  // vocabulary in the ground band. Everything else keeps the generic stoop.
  if (params.storefront) {
    decorateStorefront(quad, f.ground, params.storefront, params);
  } else {
    quad(f.ground, 0.006, inkedTexture("brick-ground.v1.png"), { tint: params.tint });
  }
  const winTex = inkedTexture("brick-window.v1.png");
  for (const w of f.windows) quad(w, 0.012, winTex, { transparent: true });
  // Darkened cornice so the crown reads as inked shadow rather than wall-color.
  quad(f.cornice, 0.014, inkedTexture("brick-cornice.v1.png"), { tint: darken(params.tint, 0.55), transparent: true });
  // Party-wall seams: thin dark verticals at both street-face edges so abutting
  // buildings read as distinct. Drawn on every edge; back ones are occluded.
  quad({ x0: 0, y0: 0, x1: 0.02, y1: 1 }, 0.02, null, { tint: 0x241a15 });
  quad({ x0: 0.98, y0: 0, x1: 1, y1: 1 }, 0.02, null, { tint: 0x241a15 });

  // Minimal inked fire escape (no new art): two dark rails + a platform bar per
  // upper storey, caged over the left bays. Sits proud of the windows it fronts.
  if (params.fireEscape) {
    const s = Math.max(2, params.storeys);
    const gf = 1 / s, top = 1 - 0.06, rail = 0x1c1512;
    const fx0 = 0.28, fx1 = 0.52;
    quad({ x0: fx0, y0: gf, x1: fx0 + 0.012, y1: top }, 0.03, null, { tint: rail });
    quad({ x0: fx1 - 0.012, y0: gf, x1: fx1, y1: top }, 0.03, null, { tint: rail });
    const rows = s - 1, rowH = (top - gf) / rows;
    for (let r = 0; r < rows; r += 1) {
      const y = gf + r * rowH + rowH * 0.12;
      quad({ x0: fx0, y0: y, x1: fx1, y1: y + 0.02 }, 0.032, null, { tint: rail });
    }
  }
}

// Draw the inked storefront vocabulary into the ground band of a commercial
// building. `quad` is decorateInkedWall's face-local quad helper; `band` is the
// face-local ground rect (f.ground). composeStorefront returns BAND-LOCAL rects,
// which we map into the band before drawing. Offsets stay just proud of the wall
// (0.006–0.011) except the awning, which projects forward (0.030).
function decorateStorefront(quad, band, storefront, params) {
  const s = composeStorefront(storefront);
  const bw = band.x1 - band.x0;
  const bh = band.y1 - band.y0;
  const map = (r) => ({
    x0: band.x0 + r.x0 * bw, x1: band.x0 + r.x1 * bw,
    y0: band.y0 + r.y0 * bh, y1: band.y0 + r.y1 * bh,
  });
  const dark = (hex, k) => new THREE.Color(hex).multiplyScalar(k).getHex();
  const tint = params.tint;
  const frameTint = storefront.frameTint ?? dark(tint, 0.45);

  // Masonry kickplate: tinted brick-ground, matches the building's brick tone.
  quad(map(s.bulkhead), 0.006, inkedTexture("brick-ground.v1.png"), { tint });
  // Display glass: shared inked-glazing texture (self-contained dark glass).
  const glazeTex = makeInkedGlazingTexture();
  for (const g of s.glazing) quad(map(g), 0.008, glazeTex, {});
  // Mullion, transom, door, frame: solid inked tints.
  quad(map(s.mullion), 0.009, null, { tint: frameTint });
  quad(map(s.transom), 0.009, null, { tint: 0xcdbfa6 });          // light transom band
  quad(map(s.door), 0.009, null, { tint: dark(frameTint, 0.7) }); // recessed entry, darker
  for (const fr of s.frame) quad(map(fr), 0.011, null, { tint: frameTint });
  // Category sign band: paper ground + uppercase serif label (no real names).
  quad(map(s.sign), 0.010, makeStorefrontSignTexture(storefront.label), {});
  // Awning: proud scalloped canopy in the category color.
  if (s.awning) {
    const aw = makeAwningTexture(storefront.awning.color ?? 0x2a2622);
    quad(map(s.awning), 0.030, aw, { transparent: true });
  }
}

// Even-odd ray cast in the scene's x/z plane. Used to tell an interior party
// wall (its outward side lands inside a sibling parcel of the same facade
// group) from a true exterior rear/side wall (its outward side is open air).
function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].x;
    const zi = polygon[i].z;
    const xj = polygon[j].x;
    const zj = polygon[j].z;
    const intersects =
      zi > point.z !== zj > point.z &&
      point.x < ((xj - xi) * (point.z - zi)) / (zj - zi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

// Split a footprint edge into the runs that are actually EXPOSED — i.e. whose
// outward side is open air, not inside a sibling parcel of the same facade
// group. A facade flat's shared seam can be partly interior and partly exposed
// when the two parcels are different widths (Premier: 3322609's 22.7m front is
// ~6/9 behind 3322608 and ~3/9 sticking out). A single midpoint test would
// drop the whole edge and leave the exposed third as a see-through hole, so
// clip to the exposed sub-segments and render walls only there.
function exposedSegments(edge, siblings) {
  if (!siblings.length) return [{ start: edge.start, end: edge.end, length: edge.length }];
  const lerp = (f) => ({
    x: edge.start.x + (edge.end.x - edge.start.x) * f,
    z: edge.start.z + (edge.end.z - edge.start.z) * f,
  });
  const n = Math.max(16, Math.min(96, Math.round(edge.length / 0.02))); // ~0.27 m samples
  const open = [];
  for (let i = 0; i < n; i += 1) {
    const c = lerp((i + 0.5) / n);
    const probe = { x: c.x + edge.normal.x * 1e-3, z: c.z + edge.normal.z * 1e-3 };
    open.push(!siblings.some((s) => pointInPolygon(probe, s.polygon)));
  }
  const segments = [];
  let i = 0;
  while (i < n) {
    if (!open[i]) { i += 1; continue; }
    let j = i;
    while (j < n && open[j]) j += 1;
    const start = lerp(i / n);
    const end = lerp(j / n);
    segments.push({ start, end, length: (edge.length * (j - i)) / n });
    i = j;
  }
  return segments;
}

// Generated elevations arrive with a paper margin around the artwork.
// Trim it automatically: sample the corner color, find the content
// bounding box, and crop via canvas before handing Three the texture.
function loadTrimmedTexture(url, onReady) {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);

    const border = [data[0], data[1], data[2]];
    // Threshold 80: paper margins carry grain/vignette up to ~55 against the
    // corner pixel; drawn artwork differs by hundreds.
    const differs = (x, y) => {
      const at = (y * width + x) * 4;
      return (
        Math.abs(data[at] - border[0]) + Math.abs(data[at + 1] - border[1]) + Math.abs(data[at + 2] - border[2]) > 80
      );
    };
    // Margins are paper-textured, not uniform, so a single differing pixel
    // is noise. Trim by content density: a row/column only counts as
    // artwork when a meaningful share of its pixels differ from the border.
    const densityThreshold = 0.085;
    const columnDensity = new Array(width).fill(0);
    const rowDensity = new Array(height).fill(0);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (!differs(x, y)) continue;
        columnDensity[x] += 1;
        rowDensity[y] += 1;
      }
    }
    const columnLimit = height * densityThreshold;
    const rowLimit = width * densityThreshold;
    let minX = 0;
    let maxX = width - 1;
    let minY = 0;
    let maxY = height - 1;
    while (minX < maxX && columnDensity[minX] <= columnLimit) minX += 1;
    while (maxX > minX && columnDensity[maxX] <= columnLimit) maxX -= 1;
    while (minY < maxY && rowDensity[minY] <= rowLimit) minY += 1;
    while (maxY > minY && rowDensity[maxY] <= rowLimit) maxY -= 1;
    if (maxX - minX < width * 0.3 || maxY - minY < height * 0.3) {
      minX = 0;
      minY = 0;
      maxX = width - 1;
      maxY = height - 1;
    }

    const cropped = document.createElement("canvas");
    cropped.width = maxX - minX + 1;
    cropped.height = maxY - minY + 1;
    cropped.getContext("2d").drawImage(canvas, minX, minY, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);

    const texture = new THREE.CanvasTexture(cropped);
    texture.colorSpace = THREE.SRGBColorSpace;
    // Max anisotropy (Three clamps to the GPU limit): keeps facade signage and
    // window detail crisp at the deep zoom and on the grazing Franklin returns.
    texture.anisotropy = 16;
    onReady(texture);
  };
  image.src = url;
}

// II-C sign band texture: inked border on paper-tone ground, uppercase serif name.
// Font size auto-shrinks until the label fits within the border inset.
function makeStorefrontSignTexture(name) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#efe7d6"; ctx.fillRect(0, 0, c.width, c.height);                 // II-C paper
  ctx.strokeStyle = "#23201c"; ctx.lineWidth = 7; ctx.strokeRect(10, 10, c.width - 20, c.height - 20);
  ctx.fillStyle = "#23201c"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  let fs = 58; ctx.font = `700 ${fs}px Georgia, serif`;
  const label = String(name).toUpperCase();
  while (ctx.measureText(label).width > c.width - 56 && fs > 22) { fs -= 4; ctx.font = `700 ${fs}px Georgia, serif`; }
  ctx.fillText(label, c.width / 2, c.height / 2);
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 8; tex.needsUpdate = true;
  return tex;
}

// II-C awning valance texture: the shop name in cream on the awning's own
// fabric tint, with a thin light hem line. Unlike the paper band, the valance
// reads as printed fabric — light type on colored ground. `tintHex` is the
// category fabric color so the canvas matches the canopy mesh.
function makeStorefrontValanceTexture(name, tintHex) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 96;
  const ctx = c.getContext("2d");
  const tint = new THREE.Color(tintHex);
  ctx.fillStyle = `#${tint.getHexString()}`; ctx.fillRect(0, 0, c.width, c.height);
  // hem lines top and bottom (where real valances are bound)
  ctx.strokeStyle = "rgba(239, 231, 214, 0.55)"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(c.width, 8);
  ctx.moveTo(0, c.height - 8); ctx.lineTo(c.width, c.height - 8); ctx.stroke();
  ctx.fillStyle = "#efe7d6"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  let fs = 48; ctx.font = `700 ${fs}px Georgia, serif`;
  const label = String(name).toUpperCase();
  while (ctx.measureText(label).width > c.width - 48 && fs > 18) { fs -= 4; ctx.font = `700 ${fs}px Georgia, serif`; }
  ctx.fillText(label, c.width / 2, c.height / 2 + 2);
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 8; tex.needsUpdate = true;
  return tex;
}

// Inked display glass: dark warm-grey pane with a few cream diagonal reflection
// strokes so the glazing reads as inked glass rather than flat black. Built once
// and shared across every storefront panel.
function makeInkedGlazingTexture() {
  if (__glazingTex) return __glazingTex;
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#2b2f31"; ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(239, 231, 214, 0.16)"; ctx.lineWidth = 10;
  for (let i = -1; i < 4; i += 1) {
    ctx.beginPath(); ctx.moveTo(i * 80, 256); ctx.lineTo(i * 80 + 170, 0); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  __glazingTex = tex;
  return tex;
}

// Inked awning: a solid-fabric canopy in the tenant's category color with a
// scalloped valance hem. Scallop gaps and the area below the hem are left
// transparent (alpha 0) so the canopy edge reads as rounded fabric, not a
// rectangle. `tintHex` is the category fabric color.
function makeAwningTexture(tintHex) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 128;
  const ctx = c.getContext("2d");
  const tint = new THREE.Color(tintHex);
  ctx.fillStyle = `#${tint.getHexString()}`;
  const hemY = 90;
  ctx.fillRect(0, 0, 256, hemY);               // canopy body
  const n = 8, w = 256 / n;
  for (let i = 0; i < n; i += 1) {              // scalloped valance (lower semicircles)
    ctx.beginPath(); ctx.arc(i * w + w / 2, hemY, w / 2, 0, Math.PI); ctx.fill();
  }
  ctx.strokeStyle = "rgba(239, 231, 214, 0.5)"; ctx.lineWidth = 4; // hem line
  ctx.beginPath(); ctx.moveTo(0, hemY); ctx.lineTo(256, hemY); ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// II-style flat roof: warm dark membrane, paper-grain speckle, and a
// parapet band tracing the roofline.
function makeRoofTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  context.fillStyle = "#57504a";
  context.fillRect(0, 0, size, size);

  for (let index = 0; index < 2600; index += 1) {
    const shade = Math.random() * 0.1;
    context.fillStyle = `rgba(0, 0, 0, ${shade.toFixed(3)})`;
    context.fillRect(Math.random() * size, Math.random() * size, 1.6, 1.6);
  }

  // Thin inked edge line only — the roofline itself comes from the drawn
  // cornice (spec'd faces) or the parapet ring (plain faces).
  context.strokeStyle = "rgba(42, 36, 28, 0.6)";
  context.lineWidth = size * 0.006;
  context.strokeRect(size * 0.01, size * 0.01, size * 0.98, size * 0.98);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
