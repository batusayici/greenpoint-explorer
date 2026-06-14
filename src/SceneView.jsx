import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { assembleFranklinScene } from "./sceneFrame.js";
import { buildFacadeAssembly } from "./facadeAssembly.js";
import premierFacadeSpec from "./data/facade-specs/premier-franklin-organic.v0.1.json";
import sonnysFacadeSpec from "./data/facade-specs/sonnys-corner.v0.1.json";
import serenecoFacadeSpec from "./data/facade-specs/sereneco.v0.1.json";
import geometrySource from "./data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
import sceneGeometryFixture from "./data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json";
import wrapFixture from "./data/franklin-intersection/greenpoint-franklin.phase-4m-r10g-corner-frontage-wrap.v0.1.json";
import { registerFacadeFace, clearFacadeFaces } from "./dev/facadeFaceRegistry.js";
import FacadeRecessEditor from "./components/dev/FacadeRecessEditor.jsx";

// Scene mode: the product view. Fixed isometric camera, II-C paper-toned
// stage, real NYC footprints in the proven Franklin-local frame. Facade
// planes on the hero frontages are texture slots — drop generated II-style
// textures into assets/textures/franklin/ and they load by name:
//   <placeId>--greenpoint.png / <placeId>--franklin.png

const II_PALETTE = {
  paper: 0xeae1ce,
  street: 0xcabfa7,
  streetDerived: 0xc4b9a2,
  ink: 0x2a241c,
  context: [0xd9cdb4, 0xcfc0a6, 0xd4c5ad, 0xc8bba4],
  heroes: {
    "premier-franklin-organic": 0xa04432, // red brick grocery corner
    "sonnys-corner": 0x4a4039, // dark brick / awned base
    sereneco: 0x9a7e58, // weathered brick, low restaurant corner
  },
};

// Camera sits northeast of the intersection looking southwest, so the
// Greenpoint-facing (north) and Franklin-facing (east) hero frontages —
// Premier's and Sonny's storefronts — face the viewer, matching the
// benchmark composition.
const ISO_AZIMUTH = Math.PI * 0.75;
const ISO_ELEVATION = Math.atan(1 / Math.SQRT2); // true isometric, 35.264°

const facadeTextureUrls = import.meta.glob("../assets/textures/franklin/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

export default function SceneView() {
  const mountRef = useRef(null);
  const facadeEdit = new URLSearchParams(window.location.search).get("facadeedit") === "1";
  const [editorOpen, setEditorOpen] = useState(facadeEdit);
  const [editorFace, setEditorFace] = useState(null); // null = editor auto-picks first face

  useEffect(() => {
    const mount = mountRef.current;
    const scene = assembleFranklinScene({
      geometrySource,
      sceneGeometryFixture,
      wrapFixture,
      facadeGroupBins: FACADE_GROUP_BINS,
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

    clearFacadeFaces();
    buildStreets(three, scene.streets);
    buildBuildings(three, scene, requestRender);
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
        view.target.x + distance * Math.cos(ISO_ELEVATION) * Math.sin(ISO_AZIMUTH),
        view.target.y + distance * Math.sin(ISO_ELEVATION),
        view.target.z + distance * Math.cos(ISO_ELEVATION) * Math.cos(ISO_AZIMUTH),
      );
      camera.lookAt(view.target);
      camera.updateProjectionMatrix();
    }

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
    const panRight = new THREE.Vector3(Math.cos(ISO_AZIMUTH), 0, -Math.sin(ISO_AZIMUTH));
    const panUp = new THREE.Vector3(-Math.sin(ISO_AZIMUTH), 0, -Math.cos(ISO_AZIMUTH));

    // Click-to-edit: a no-drag click on a spec'd face opens the recess editor
    // for that face (edit mode only). Assembly groups carry userData.faceKey.
    const raycaster = new THREE.Raycaster();
    const down = { x: 0, y: 0, onCanvas: false };
    function faceKeyAt(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      for (const hit of raycaster.intersectObjects(three.children, true)) {
        let object = hit.object;
        while (object) {
          if (object.userData?.faceKey) return object.userData.faceKey;
          object = object.parent;
        }
      }
      return null;
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
      if (!facadeEdit || !wasCanvas) return;
      const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
      if (moved > 4) return; // a pan, not a click
      const faceKey = faceKeyAt(event);
      if (faceKey) {
        setEditorFace(faceKey);
        setEditorOpen(true);
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

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resize);
    resize();

    return () => {
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", resize);
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
        <span style={{ opacity: 0.75 }}>drag to pan · wheel to zoom</span>
        <br />
        <a href="?debug=1" style={{ color: "#d9a43b" }}>
          Debug runtime →
        </a>
      </div>
      {facadeEdit && editorOpen && (
        <FacadeRecessEditor
          faceKey={editorFace}
          onSelectFace={setEditorFace}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
}

function buildStreets(three, streets) {
  for (const street of streets) {
    for (let index = 0; index < street.line.length - 1; index += 1) {
      const start = street.line[index];
      const end = street.line[index + 1];
      const length = Math.hypot(end.x - start.x, end.z - start.z);
      if (length < 1e-6) continue;
      const slab = new THREE.Mesh(
        new THREE.PlaneGeometry(length, street.widthUnits),
        new THREE.MeshLambertMaterial({
          color: street.derived ? II_PALETTE.streetDerived : II_PALETTE.street,
        }),
      );
      slab.rotation.x = -Math.PI / 2;
      slab.rotation.z = -Math.atan2(end.z - start.z, end.x - start.x);
      slab.position.set((start.x + end.x) / 2, 0.001, (start.z + end.z) / 2);
      three.add(slab);
    }
  }
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
  sereneco: {
    key: "../assets/textures/franklin/sereneco--corner.png",
    byBin: {
      "3337033": {
        franklin: { u0: SERENECO_KINK, u1: 1, leftEnd: "south", coverMeters: 12 },
      },
    },
  },
};

const FACADE_GROUP_BINS = { "3322609": "premier-franklin-organic" };

// Structured facade specs, keyed "bin:face" — see facadeAssembly.js.
const FACADE_SPECS = {
  ...premierFacadeSpec.faces,
  ...sonnysFacadeSpec.faces,
  ...serenecoFacadeSpec.faces,
};

// Maps each "BIN:role" face to the spec file it lives in, so the dev recess
// editor can write an edit back to the right JSON.
const SPEC_FILE_BY_FACE = {};
for (const [file, spec] of [
  ["premier-franklin-organic.v0.1.json", premierFacadeSpec],
  ["sonnys-corner.v0.1.json", sonnysFacadeSpec],
  ["sereneco.v0.1.json", serenecoFacadeSpec],
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

function buildBuildings(three, scene, requestRender) {
  scene.buildings.forEach((building, index) => {
    if (building.isHero && building.edges) {
      buildHeroBuilding(three, building, scene, requestRender);
      return;
    }
    const shape = footprintShape(building.polygon);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: building.height, bevelEnabled: false });
    const color = II_PALETTE.context[index % II_PALETTE.context.length];
    // ExtrudeGeometry material slots: 0 = caps (roof), 1 = side walls.
    // Darker inked roof caps keep large masses from reading as flat slabs.
    const roof = new THREE.Color(color).multiplyScalar(0.5);
    const body = new THREE.Mesh(geometry, [
      new THREE.MeshLambertMaterial({ color: roof }),
      new THREE.MeshLambertMaterial({ color }),
    ]);
    body.rotation.x = -Math.PI / 2;
    body.userData = { bin: building.bin, placeId: building.placeId };
    three.add(body);
  });
}

// Hero buildings are built wall-by-wall so generated II-style facade
// elevations map directly onto the real footprint edges, the two street
// faces share a crisp corner, the roof carries an inked parapet texture,
// and an II-C cast-shadow shape grounds the mass.
function buildHeroBuilding(three, building, scene, requestRender) {
  const baseColor = II_PALETTE.heroes[building.placeId] ?? II_PALETTE.context[0];
  // Benchmark-style face shading: lit street faces, darker returns.
  const faceShade = { greenpoint: 1.0, franklin: 0.9, other: 0.78 };

  const composite = FACADE_COMPOSITES[building.placeId];
  const compositeWaiters = [];
  let compositeTexture = null;
  if (composite && facadeTextureUrls[composite.key]) {
    loadTrimmedTexture(facadeTextureUrls[composite.key], (texture) => {
      compositeTexture = texture;
      for (const apply of compositeWaiters) apply(texture);
      requestRender?.();
    });
  }

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
    // Group-composite party walls, seen nearly edge-on from the fixed iso
    // camera, read as a thin "floating plane" in front of the recessed
    // storefront. The camera only ever sees the street faces, so drop them.
    if (isGroupComposite && !face) continue;
    // Skip walls the fixed NE camera can never see — a back-facing return
    // (e.g. Sonny's west-facing Franklin wall) would otherwise show its
    // mirrored dark texture as a wedge poking past the corner. FrontSide
    // culling is unreliable here because adjacent faces wind oppositely
    // (different `leftEnd`), so test the real outward normal against the
    // camera direction instead.
    const facing = edge.normal.x * Math.sin(ISO_AZIMUTH) + edge.normal.z * Math.cos(ISO_AZIMUTH);
    if (facing < -0.3) continue;
    const isTextured = Boolean(face) && textureEdge[edge.role] === edge && facadeTextureUrls[composite.key];
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
        three.add(rest);
      }
    }

    const material = new THREE.MeshBasicMaterial({
      color: wallColor,
      side: THREE.DoubleSide,
    });
    const wall = new THREE.Mesh(wallQuad(renderEdge, building.height, isTextured ? face : null, scene), material);
    wall.userData = { facadeSlot: `${building.placeId}--${edge.role}` };
    three.add(wall);

    if (!isTextured) continue;
    const faceKey = `${building.bin}:${edge.role}`;
    const apply = specFace
      ? (texture) => {
          // Structured facade: swap the flat wall for the component assembly.
          // The build is wrapped in a rebuild closure so the dev recess editor
          // can re-snap this one face live (remove old group, build new).
          three.remove(wall);
          const frame = faceFrame(renderEdge, building.height, face, scene);
          const debug = new URLSearchParams(window.location.search).get("specdebug") === "1";
          const hexBase = new THREE.Color(baseColor).multiplyScalar(shade).getHex();
          let current = null;
          const rebuild = (specOverride) => {
            if (current) {
              three.remove(current);
              disposeGroup(current);
            }
            current = buildFacadeAssembly({ frame, spec: specOverride, texture, unitsPerMeter: scene.projection.scale, baseColor: hexBase, debug });
            current.userData.faceKey = faceKey;
            three.add(current);
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
    compositeWaiters.push(apply);
    if (compositeTexture) apply(compositeTexture);
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
  three.add(roofMesh);

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
    three.add(segment);
    const edgeLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(segment.geometry),
      new THREE.LineBasicMaterial({ color: II_PALETTE.ink, transparent: true, opacity: 0.5 }),
    );
    edgeLines.position.copy(segment.position);
    edgeLines.rotation.copy(segment.rotation);
    three.add(edgeLines);
  }

  // Corner post: where two spec'd storefront faces meet, a slim pier closes
  // the recess slit at the corner entrance.
  const gpSpec = FACADE_SPECS[`${building.bin}:greenpoint`];
  const fkSpec = FACADE_SPECS[`${building.bin}:franklin`];
  if (gpSpec && fkSpec && textureEdge.greenpoint && textureEdge.franklin) {
    const corner = sharedEndpoint(textureEdge.greenpoint, textureEdge.franklin);
    if (corner) {
      const size = scene.projection.scale * 0.35;
      const postHeight = building.height * 0.245;
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(size, postHeight, size),
        new THREE.MeshBasicMaterial({ color: 0x241f18 }),
      );
      post.position.set(corner.x, postHeight / 2, corner.z);
      three.add(post);
    }
  }

  // Inked cast shadow (II-C shadow-shape language). Thrown toward the
  // east/Franklin side, which the fixed northeast camera can see — matching
  // where the benchmark pools its shading.
  const shadowMesh = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshBasicMaterial({ color: II_PALETTE.ink, transparent: true, opacity: 0.16, depthWrite: false }),
  );
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(building.height * 0.2, 0.004, building.height * 0.07);
  three.add(shadowMesh);
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
