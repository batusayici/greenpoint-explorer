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
    const view = { target: new THREE.Vector3(-0.7, 0, 0.9), frustumHeight: 3.4 };

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
  buildings.forEach((building, index) => {
    if (building.isHero && building.edges) {
      buildHeroBuilding(three, building, requestRender);
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
function buildHeroBuilding(three, building, requestRender) {
  const baseColor = II_PALETTE.heroes[building.placeId] ?? II_PALETTE.context[0];
  // Benchmark-style face shading: lit street faces, darker returns.
  const faceShade = { greenpoint: 1.0, franklin: 0.9, other: 0.78 };
  // The longest edge per street role carries the generated elevation.
  const textureEdge = {};
  for (const edge of building.edges) {
    if (edge.role === "other") continue;
    if (!textureEdge[edge.role] || edge.length > textureEdge[edge.role].length) {
      textureEdge[edge.role] = edge;
    }
  }

  for (const edge of building.edges) {
    const shade = faceShade[edge.role] ?? faceShade.other;
    const url =
      textureEdge[edge.role] === edge
        ? facadeTextureUrls[`../assets/textures/franklin/${building.placeId}--${edge.role}.png`]
        : undefined;

    const material = url
      ? new THREE.MeshBasicMaterial({ color: new THREE.Color(shade, shade, shade) })
      : new THREE.MeshBasicMaterial({ color: new THREE.Color(baseColor).multiplyScalar(shade) });
    if (url) {
      loadTrimmedTexture(url, (texture) => {
        material.map = texture;
        material.color.setScalar(shade);
        material.needsUpdate = true;
        requestRender?.();
      });
      // Until the texture decodes, hold the wall at the base tone.
      material.color.copy(new THREE.Color(baseColor).multiplyScalar(shade));
    }

    const wall = new THREE.Mesh(new THREE.PlaneGeometry(edge.length, building.height), material);
    wall.position.set(edge.midpoint.x, building.height / 2, edge.midpoint.z);
    wall.rotation.y = Math.atan2(edge.normal.x, edge.normal.z);
    wall.userData = { facadeSlot: `${building.placeId}--${edge.role}` };
    three.add(wall);
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

  // Parapet: a real cornice ring around the roofline — geometry, not paint,
  // so the silhouette reads as a built mass like the benchmark's cornice.
  const parapetHeight = 0.05;
  const parapetThickness = 0.024;
  const clean = building.polygon;
  for (let index = 0; index < clean.length; index += 1) {
    const start = clean[index];
    const end = clean[(index + 1) % clean.length];
    const length = Math.hypot(end.x - start.x, end.z - start.z);
    if (length < 1e-6) continue;
    const segment = new THREE.Mesh(
      new THREE.BoxGeometry(length + parapetThickness, parapetHeight, parapetThickness),
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
    const differs = (x, y) => {
      const at = (y * width + x) * 4;
      return (
        Math.abs(data[at] - border[0]) + Math.abs(data[at + 1] - border[1]) + Math.abs(data[at + 2] - border[2]) > 48
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
    texture.anisotropy = 4;
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

  // Parapet band + inked inner line at the roof edge.
  const band = size * 0.045;
  context.strokeStyle = "#a99c82";
  context.lineWidth = band;
  context.strokeRect(band / 2, band / 2, size - band, size - band);
  context.strokeStyle = "rgba(42, 36, 28, 0.85)";
  context.lineWidth = size * 0.008;
  context.strokeRect(band, band, size - band * 2, size - band * 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
