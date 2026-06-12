import * as THREE from "three";

// Structured facade assembly: turns a flat elevation slice into a shallow
// relief. The facade spec names components in normalized face coordinates
// (x: 0..1 along the drawn elevation, y: 0..1 ground to roofline), so the
// same artwork that fed the flat wall provides every component's texture
// region — windows recess behind the wall plane, storefront glass steps
// back behind a soffit, sign bands and cornices sit proud, awnings project,
// and bay windows become real shallow volumes.
//
// Depth values are authored in meters and converted by the scene scale, so
// specs stay real-world readable. Reveals/jambs are tinted flats in the
// II-C drawn-shadow language (dark lintel, mid jambs, lit sill) rather than
// lit 3D — the artwork carries the light.

const REVEAL = {
  top: 0x352c22, // shadow under the lintel
  side: 0x5d4c3e, // jamb
  bottom: 0xcbbfa4, // sill catches light
  soffit: 0x2f2820, // underside of storefront/awning/cornice returns
};

export function buildFacadeAssembly({ frame, spec, texture, unitsPerMeter, baseColor }) {
  const group = new THREE.Group();
  const meters = (value) => value * unitsPerMeter;
  const openings = [];

  const windowRects = [];
  if (spec.windows) {
    for (const row of spec.windows.rows) {
      for (const col of spec.windows.cols) {
        windowRects.push({ x0: col.x0, x1: col.x1, y0: row.y0, y1: row.y1 });
      }
    }
  }
  openings.push(...windowRects);
  for (const storefront of spec.storefronts ?? []) openings.push(storefront);
  for (const band of spec.signBands ?? []) openings.push(band);
  for (const awning of spec.awnings ?? []) {
    openings.push({ x0: awning.x0, x1: awning.x1, y0: awning.yDrop, y1: awning.yWall });
  }
  if (spec.bay) openings.push(spec.bay);
  if (spec.cornice) openings.push({ x0: 0, x1: 1, ...spec.cornice });

  // Wall mask: cover everything that is not an opening, at the wall plane.
  for (const rect of complementRects(openings)) {
    group.add(rectMesh(frame, rect, 0, texturedMaterial(texture, 1)));
  }

  // Windows: recessed pane + tinted reveals + protruding sill.
  const windowRecess = meters(spec.windows?.recessM ?? 0.14);
  for (const rect of windowRects) {
    group.add(rectMesh(frame, rect, -windowRecess, texturedMaterial(texture, 1)));
    addReveals(group, frame, rect, 0, -windowRecess);
    if (spec.windows.sill !== false) {
      const sill = { x0: rect.x0 - 0.004, x1: rect.x1 + 0.004, y0: rect.y0 - 0.008, y1: rect.y0 };
      group.add(rectMesh(frame, sill, meters(0.05), tintMaterial(REVEAL.bottom)));
      group.add(bridgeMesh(frame, sill, meters(0.05), 0, "bottom", tintMaterial(REVEAL.soffit)));
      group.add(bridgeMesh(frame, sill, meters(0.05), 0, "top", tintMaterial(REVEAL.bottom)));
    }
  }

  // Storefront glass: deeper recess with a soffit and side reveals.
  for (const storefront of spec.storefronts ?? []) {
    const recess = meters(storefront.recessM ?? 0.45);
    group.add(rectMesh(frame, storefront, -recess, texturedMaterial(texture, 0.97)));
    addReveals(group, frame, storefront, 0, -recess, { bottom: false });
  }

  // Sign bands: proud of the wall with thin returns.
  for (const band of spec.signBands ?? []) {
    const proud = meters(band.projectionM ?? 0.08);
    group.add(rectMesh(frame, band, proud, texturedMaterial(texture, 1)));
    addReveals(group, frame, band, proud, 0, { interior: false });
  }

  // Awnings: angled canopy from the wall attachment line outward and down.
  for (const awning of spec.awnings ?? []) {
    const projection = meters(awning.projectionM ?? 0.9);
    const geometry = quadGeometry(
      facePoint(frame, awning.x0, awning.yWall, 0),
      facePoint(frame, awning.x1, awning.yWall, 0),
      facePoint(frame, awning.x1, awning.yDrop, projection),
      facePoint(frame, awning.x0, awning.yDrop, projection),
      rectUv(frame, { x0: awning.x0, x1: awning.x1, y0: awning.yDrop, y1: awning.yWall }),
    );
    group.add(new THREE.Mesh(geometry, texturedMaterial(texture, 1)));
    // Front valance: a short vertical lip at the outer edge.
    group.add(
      new THREE.Mesh(
        quadGeometry(
          facePoint(frame, awning.x0, awning.yDrop, projection),
          facePoint(frame, awning.x1, awning.yDrop, projection),
          facePoint(frame, awning.x1, awning.yDrop - 0.018, projection),
          facePoint(frame, awning.x0, awning.yDrop - 0.018, projection),
        ),
        tintMaterial(0x241f18),
      ),
    );
  }

  // Bay window: a real shallow volume — textured front, shadowed cheeks.
  if (spec.bay) {
    const projection = meters(spec.bay.projectionM ?? 0.5);
    group.add(rectMesh(frame, spec.bay, projection, texturedMaterial(texture, 1)));
    const cheek = new THREE.Color(baseColor).multiplyScalar(0.58).getHex();
    addReveals(group, frame, spec.bay, projection, 0, { interior: false, baseColor: cheek });
  }

  // Cornice: proud strip across the top with a shadowed soffit.
  if (spec.cornice) {
    const rect = { x0: 0, x1: 1, ...spec.cornice };
    const proud = meters(spec.cornice.projectionM ?? 0.18);
    group.add(rectMesh(frame, rect, proud, texturedMaterial(texture, 1)));
    addReveals(group, frame, rect, proud, 0, { interior: false });
  }

  return group;
}

// --- geometry helpers -------------------------------------------------

function facePoint(frame, x, y, offset) {
  return [
    frame.left.x + (frame.right.x - frame.left.x) * x + frame.normal.x * offset,
    y * frame.height,
    frame.left.z + (frame.right.z - frame.left.z) * x + frame.normal.z * offset,
  ];
}

function rectUv(frame, rect) {
  const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;
  return [u(rect.x0), rect.y0, u(rect.x1), rect.y0, u(rect.x1), rect.y1, u(rect.x0), rect.y1];
}

function rectMesh(frame, rect, offset, material) {
  const geometry = quadGeometry(
    facePoint(frame, rect.x0, rect.y0, offset),
    facePoint(frame, rect.x1, rect.y0, offset),
    facePoint(frame, rect.x1, rect.y1, offset),
    facePoint(frame, rect.x0, rect.y1, offset),
    material.map ? rectUv(frame, rect) : undefined,
  );
  return new THREE.Mesh(geometry, material);
}

// A reveal bridges the wall plane and a recessed/proud plane along one rect
// edge. `sides.interior` (default) tints for a recess (lintel dark, sill
// lit); proud elements get uniform soffit/return tones.
function addReveals(group, frame, rect, fromOffset, toOffset, sides = {}) {
  const recessLook = sides.interior !== false;
  // Recess: lintel in shadow, sill lit. Proud: top catches light, the
  // underside is the shadowed soffit.
  const tones = {
    top: recessLook ? REVEAL.top : REVEAL.bottom,
    bottom: recessLook ? REVEAL.bottom : REVEAL.soffit,
    left: recessLook ? REVEAL.side : (sides.baseColor ?? REVEAL.side),
    right: recessLook ? REVEAL.side : (sides.baseColor ?? REVEAL.side),
  };
  const edges = [
    ["top", sides.top !== false],
    ["bottom", sides.bottom !== false],
    ["left", sides.left !== false],
    ["right", sides.right !== false],
  ];
  for (const [edge, enabled] of edges) {
    if (!enabled) continue;
    group.add(bridgeMesh(frame, rect, fromOffset, toOffset, edge, tintMaterial(tones[edge])));
  }
}

function bridgeMesh(frame, rect, fromOffset, toOffset, edge, material) {
  let a;
  let b;
  if (edge === "top") {
    a = [rect.x0, rect.y1];
    b = [rect.x1, rect.y1];
  } else if (edge === "bottom") {
    a = [rect.x0, rect.y0];
    b = [rect.x1, rect.y0];
  } else if (edge === "left") {
    a = [rect.x0, rect.y0];
    b = [rect.x0, rect.y1];
  } else {
    a = [rect.x1, rect.y0];
    b = [rect.x1, rect.y1];
  }
  const geometry = quadGeometry(
    facePoint(frame, a[0], a[1], fromOffset),
    facePoint(frame, b[0], b[1], fromOffset),
    facePoint(frame, b[0], b[1], toOffset),
    facePoint(frame, a[0], a[1], toOffset),
  );
  return new THREE.Mesh(geometry, material);
}

function quadGeometry(p0, p1, p2, p3, uv) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([...p0, ...p1, ...p2, ...p3]), 3));
  if (uv) geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.computeVertexNormals();
  return geometry;
}

function texturedMaterial(texture, shade) {
  return new THREE.MeshBasicMaterial({
    map: texture,
    color: new THREE.Color(shade, shade, shade),
    side: THREE.DoubleSide,
  });
}

function tintMaterial(color) {
  return new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
}

// Subdivide the unit square into horizontal bands at every opening edge and
// emit the parts of each band not covered by an opening.
function complementRects(openings) {
  const cuts = new Set([0, 1]);
  for (const rect of openings) {
    cuts.add(clamp01(rect.y0));
    cuts.add(clamp01(rect.y1));
  }
  const ys = [...cuts].sort((a, b) => a - b);
  const rects = [];
  for (let index = 0; index < ys.length - 1; index += 1) {
    const y0 = ys[index];
    const y1 = ys[index + 1];
    if (y1 - y0 < 1e-5) continue;
    const yMid = (y0 + y1) / 2;
    const spans = openings
      .filter((rect) => rect.y0 < yMid && rect.y1 > yMid)
      .map((rect) => [clamp01(rect.x0), clamp01(rect.x1)])
      .sort((a, b) => a[0] - b[0]);
    let cursor = 0;
    for (const [x0, x1] of spans) {
      if (x0 - cursor > 1e-5) rects.push({ x0: cursor, x1: x0, y0, y1 });
      cursor = Math.max(cursor, x1);
    }
    if (1 - cursor > 1e-5) rects.push({ x0: cursor, x1: 1, y0, y1 });
  }
  return rects;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}
