import { useEffect, useRef } from "react";
import * as THREE from "three";
import { assembleFranklinScene } from "./sceneFrame.js";
import geometrySource from "./data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
import sceneGeometryFixture from "./data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json";
import wrapFixture from "./data/franklin-intersection/greenpoint-franklin.phase-4m-r10g-corner-frontage-wrap.v0.1.json";

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

  useEffect(() => {
    const mount = mountRef.current;
    const scene = assembleFranklinScene({ geometrySource, sceneGeometryFixture, wrapFixture });

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

    buildStreets(three, scene.streets);
    buildBuildings(three, scene.buildings, requestRender);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    const view = { target: new THREE.Vector3(-0.3, 0, 0.4), frustumHeight: 5.5 };

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

    function onPointerDown(event) {
      drag.active = true;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
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
    function onPointerUp() {
      drag.active = false;
    }
    function onWheel(event) {
      event.preventDefault();
      const factor = Math.exp(event.deltaY * 0.001);
      view.frustumHeight = THREE.MathUtils.clamp(view.frustumHeight * factor, 2.2, 18);
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

function buildBuildings(three, buildings, requestRender) {
  const textureLoader = new THREE.TextureLoader();
  buildings.forEach((building, index) => {
    const shape = new THREE.Shape();
    building.polygon.forEach((point, pointIndex) => {
      if (pointIndex === 0) shape.moveTo(point.x, -point.z);
      else shape.lineTo(point.x, -point.z);
    });
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: building.height, bevelEnabled: false });
    const color = building.isHero
      ? II_PALETTE.heroes[building.placeId] ?? II_PALETTE.context[0]
      : II_PALETTE.context[index % II_PALETTE.context.length];
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

    if (building.isHero && building.frontages) {
      addFrontagePlane(three, textureLoader, building, "greenpoint", building.frontages.greenpoint, requestRender);
      addFrontagePlane(three, textureLoader, building, "franklin", building.frontages.franklin, requestRender);
    }
  });
}

// A frontage plane is the texture slot for a generated II-style facade.
// Until a texture exists it renders as a subtle placeholder tint so the
// slot is visible in review.
function addFrontagePlane(three, textureLoader, building, streetKey, edge, requestRender) {
  if (!edge) return;
  const key = `../assets/textures/franklin/${building.placeId}--${streetKey}.png`;
  const url = facadeTextureUrls[key];

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(edge.length, building.height),
    new THREE.MeshBasicMaterial(
      url
        ? {
            map: textureLoader.load(url, (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              requestRender?.();
            }),
            side: THREE.DoubleSide,
          }
        : { color: 0xffffff, opacity: 0.18, transparent: true, side: THREE.DoubleSide },
    ),
  );

  // Face outward: away from the footprint centroid.
  const normal = { x: -(edge.end.z - edge.start.z) / edge.length, z: (edge.end.x - edge.start.x) / edge.length };
  const toCentroid = {
    x: building.centroid.x - edge.midpoint.x,
    z: building.centroid.z - edge.midpoint.z,
  };
  const sign = normal.x * toCentroid.x + normal.z * toCentroid.z > 0 ? -1 : 1;
  const offset = 0.012;
  plane.position.set(
    edge.midpoint.x + normal.x * sign * offset,
    building.height / 2,
    edge.midpoint.z + normal.z * sign * offset,
  );
  plane.rotation.y = Math.atan2(normal.x * sign, normal.z * sign);
  plane.userData = { facadeSlot: `${building.placeId}--${streetKey}` };
  three.add(plane);
}
