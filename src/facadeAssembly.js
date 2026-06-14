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
  bottom: 0xa6987c, // recess bottom / proud top — lit stone, never bright white
  soffit: 0x2f2820, // underside of storefront/awning/cornice returns
};

export function buildFacadeAssembly({ frame, spec, texture, unitsPerMeter, baseColor, debug = false }) {
  const group = new THREE.Group();
  const meters = (value) => value * unitsPerMeter;
  const openings = [];
  const debugRects = [];

  // The v2 elevation is a flattened 3/4 view: drawn content leans right as
  // it rises (ground floor true, upper floors shifted). `skewX` compensates
  // linearly — a rect at height y shifts by skewX * y — so component
  // geometry lands on the drawn feature. A true orthographic re-render sets
  // skewX back to 0.
  const skew = spec.skewX ?? 0;
  const lean = (rect) => {
    if (!skew) return rect;
    const shift = skew * ((rect.y0 + rect.y1) / 2);
    return { ...rect, x0: rect.x0 + shift, x1: rect.x1 + shift };
  };

  const windowRects = [];
  if (spec.windows) {
    if (spec.windows.rects) {
      // Explicit per-window rects: each opening is registered directly to the
      // drawn elevation, so irregular facades (missing bays, mixed floor
      // counts) recess exactly on their painted windows. Preferred over the
      // rows×cols product, which manufactures windows at empty grid cells.
      for (const rect of spec.windows.rects) {
        windowRects.push(lean({ x0: rect.x0, x1: rect.x1, y0: rect.y0, y1: rect.y1 }));
      }
    } else if (spec.windows.rows && spec.windows.cols) {
      for (const row of spec.windows.rows) {
        for (const col of spec.windows.cols) {
          windowRects.push(lean({ x0: col.x0, x1: col.x1, y0: row.y0, y1: row.y1 }));
        }
      }
    }
  }
  const storefronts = (spec.storefronts ?? []).map(lean);
  const signBands = (spec.signBands ?? []).map(lean);
  const doors = (spec.doors ?? []).map(lean);
  const boxes = (spec.boxes ?? []).map(lean);
  const awnings = (spec.awnings ?? []).map((awning) => {
    const yMid = ((awning.yValance ?? awning.yDrop) + awning.yWall) / 2;
    const shift = skew * yMid;
    return { ...awning, x0: awning.x0 + shift, x1: awning.x1 + shift };
  });
  const bay = spec.bay ? lean(spec.bay) : null;

  openings.push(...windowRects, ...storefronts, ...signBands, ...doors, ...boxes);
  for (const awning of awnings) {
    openings.push({ x0: awning.x0, x1: awning.x1, y0: awning.yValance ?? awning.yDrop, y1: awning.yWall });
  }
  if (bay) openings.push(bay);
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
    // Geometric sills only on request — the drawn elevations carry their
    // own stone sills, and duplicating them reads as floating white bars.
    if (spec.windows.sill === true) {
      const sill = { x0: rect.x0 - 0.004, x1: rect.x1 + 0.004, y0: rect.y0 - 0.008, y1: rect.y0 };
      group.add(rectMesh(frame, sill, meters(0.05), tintMaterial(REVEAL.bottom)));
      group.add(bridgeMesh(frame, sill, meters(0.05), 0, "bottom", tintMaterial(REVEAL.soffit)));
      group.add(bridgeMesh(frame, sill, meters(0.05), 0, "top", tintMaterial(REVEAL.bottom)));
    }
  }

  // Storefront glass: deeper recess with a soffit and side reveals.
  // A side reveal can be suppressed (revealLeft/revealRight: false) where the
  // storefront edge falls on a footprint bin seam that the drawn artwork
  // crosses with continuous glass — otherwise the jamb floats in front of the
  // painted window (e.g. the Premier/Pizza seam at u≈0.28).
  for (const storefront of storefronts) {
    const recess = meters(storefront.recessM ?? 0.45);
    group.add(rectMesh(frame, storefront, -recess, texturedMaterial(texture, 0.97)));
    addReveals(group, frame, storefront, 0, -recess, {
      bottom: false,
      top: storefront.revealTop !== false,
      left: storefront.revealLeft !== false,
      right: storefront.revealRight !== false,
    });
  }

  // Sign bands: proud of the wall with thin returns.
  for (const band of signBands) {
    const proud = meters(band.projectionM ?? 0.08);
    group.add(rectMesh(frame, band, proud, texturedMaterial(texture, 1)));
    addReveals(group, frame, band, proud, 0, { interior: false });
  }

  // Awnings: angled canopy from the wall attachment line outward and down,
  // a textured valance skirt at the outer edge, and closed side panels.
  for (const awning of awnings) {
    const projection = meters(awning.projectionM ?? 0.9);
    const yValance = awning.yValance ?? awning.yDrop;
    const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;

    const canopy = quadGeometry(
      facePoint(frame, awning.x0, awning.yWall, 0),
      facePoint(frame, awning.x1, awning.yWall, 0),
      facePoint(frame, awning.x1, awning.yDrop, projection),
      facePoint(frame, awning.x0, awning.yDrop, projection),
      [u(awning.x0), awning.yWall, u(awning.x1), awning.yWall, u(awning.x1), awning.yDrop, u(awning.x0), awning.yDrop],
    );
    group.add(new THREE.Mesh(canopy, texturedMaterial(texture, 1)));

    if (yValance < awning.yDrop) {
      const valance = quadGeometry(
        facePoint(frame, awning.x0, awning.yDrop, projection),
        facePoint(frame, awning.x1, awning.yDrop, projection),
        facePoint(frame, awning.x1, yValance, projection),
        facePoint(frame, awning.x0, yValance, projection),
        [u(awning.x0), awning.yDrop, u(awning.x1), awning.yDrop, u(awning.x1), yValance, u(awning.x0), yValance],
      );
      group.add(new THREE.Mesh(valance, texturedMaterial(texture, 1)));
    }

    // Closed end panels — but suppress an end that meets the building corner
    // (capLeft/capRight: false), where the awning wraps onto the return face
    // rather than terminating, so no dark side panel juts into the corner.
    const ends = [
      [awning.x0, awning.capLeft !== false],
      [awning.x1, awning.capRight !== false],
    ];
    for (const [xEnd, capped] of ends) {
      if (!capped) continue;
      const panel = quadGeometry(
        facePoint(frame, xEnd, awning.yWall, 0),
        facePoint(frame, xEnd, awning.yDrop, projection),
        facePoint(frame, xEnd, yValance, projection),
        facePoint(frame, xEnd, yValance, 0),
      );
      group.add(new THREE.Mesh(panel, tintMaterial(0x241f18)));
    }
  }

  // Doors: shallow recess with reveals, open at the threshold.
  for (const door of doors) {
    const recess = meters(door.recessM ?? 0.12);
    group.add(rectMesh(frame, door, -recess, texturedMaterial(texture, 0.98)));
    addReveals(group, frame, door, 0, -recess, { bottom: false });
  }

  // Boxes (AC units, utility): proud textured blocks.
  for (const box of boxes) {
    const proud = meters(box.projectionM ?? 0.3);
    group.add(rectMesh(frame, box, proud, texturedMaterial(texture, 1)));
    addReveals(group, frame, box, proud, 0, { interior: false });
  }

  // Bay window: a real shallow volume — textured front, dark wood cheeks
  // matching the drawn bay's joinery, and a dark little roof (never a lit
  // cap: the bay tucks under the cornice shadow).
  if (bay) {
    const projection = meters(bay.projectionM ?? 0.5);
    group.add(rectMesh(frame, bay, projection, texturedMaterial(texture, 1)));
    group.add(bridgeMesh(frame, bay, projection, 0, "top", tintMaterial(0x352c22)));
    group.add(bridgeMesh(frame, bay, projection, 0, "bottom", tintMaterial(REVEAL.soffit)));
    group.add(bridgeMesh(frame, bay, projection, 0, "left", tintMaterial(0x4a3a2c)));
    group.add(bridgeMesh(frame, bay, projection, 0, "right", tintMaterial(0x4a3a2c)));
  }

  // Cornice: proud strip across the top with a shadowed soffit.
  if (spec.cornice) {
    const rect = { x0: 0, x1: 1, ...spec.cornice };
    const proud = meters(spec.cornice.projectionM ?? 0.18);
    group.add(rectMesh(frame, rect, proud, texturedMaterial(texture, 1)));
    addReveals(group, frame, rect, proud, 0, { interior: false });
  }

  // Spec-debug: outline every component rect directly on the wall so
  // alignment against the drawn artwork is checkable in 3D (?specdebug=1).
  if (debug) {
    debugRects.push(...windowRects);
    if (bay) debugRects.push(bay);
    for (const list of [storefronts, signBands, doors, boxes]) {
      debugRects.push(...list);
    }
    for (const awning of awnings) {
      debugRects.push({ x0: awning.x0, x1: awning.x1, y0: awning.yValance ?? awning.yDrop, y1: awning.yWall });
    }
    if (spec.cornice) debugRects.push({ x0: 0, x1: 1, ...spec.cornice });
    const material = new THREE.LineBasicMaterial({ color: 0x00ff44 });
    for (const rect of debugRects) {
      const points = [
        facePoint(frame, rect.x0, rect.y0, 0.03),
        facePoint(frame, rect.x1, rect.y0, 0.03),
        facePoint(frame, rect.x1, rect.y1, 0.03),
        facePoint(frame, rect.x0, rect.y1, 0.03),
      ].map((p) => new THREE.Vector3(...p));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.LineLoop(geometry, material));
    }
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
