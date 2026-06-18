import * as THREE from "three";
import { openingProfile, springYOf } from "./facadeProfiles.js";
import { FACADE_RELIEF, DEBUG_PALETTE } from "./visualSystem/palette.js";

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
  top: FACADE_RELIEF.lintelShadow, // shadow under the lintel
  side: FACADE_RELIEF.jamb, // jamb
  bottom: FACADE_RELIEF.sillLit, // recess bottom / proud top — lit stone, never bright white
  soffit: FACADE_RELIEF.soffit, // underside of storefront/awning/cornice returns
};

// Reveals are textured by edge-stretching the wall artwork into the recess
// (see bridgeMesh) instead of flat tints, so a jamb/sill continues the brick
// rather than floating as a grey/tan bar. These multipliers darken that
// stretched texture per face to fake the cast light: a recess has a dark
// lintel, mid jambs, and a lit sill; a proud element catches light on top
// and throws its underside into soffit shadow.
const REVEAL_SHADE = {
  recess: { top: 0.32, bottom: 0.9, left: 0.55, right: 0.55 },
  proud: { top: 0.9, bottom: 0.34, left: 0.62, right: 0.62 },
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
        windowRects.push(lean({ x0: rect.x0, x1: rect.x1, y0: rect.y0, y1: rect.y1, shape: rect.shape, springY: rect.springY }));
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
    if (rect.shape && rect.shape !== "rect") {
      addShapedOpening(group, frame, rect, windowRecess, texture);
      continue;
    }
    group.add(rectMesh(frame, rect, -windowRecess, texturedMaterial(texture, 1)));
    addReveals(group, frame, rect, 0, -windowRecess, texture);
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
    // Wrap a corner end (cornerLeft/cornerRight): a recessed storefront turns a
    // convex corner where this face's recessed plane crosses the perpendicular
    // face's at the inner corner — a point that sits one recess-depth inboard
    // of the fold. Trim the glass to that crossing line so it doesn't overhang
    // past it as a fin; the perpendicular shopfront fills the corner mouth
    // behind. Also drop the corner-side reveal (a deep jamb that would smear).
    const ext = recess / faceWidth(frame);
    const glass = {
      ...storefront,
      x0: storefront.cornerLeft ? storefront.x0 + ext : storefront.x0,
      x1: storefront.cornerRight ? storefront.x1 - ext : storefront.x1,
    };
    // A storefront can belong to a different tenant than the building's primary
    // place (e.g. Azure Gourmet shares Sereneco's Franklin elevation). Tagging
    // its meshes' parent group with that placeId makes click-to-select resolve
    // this storefront to its own card — the handler walks up to the first
    // userData.placeId, which is this group, not the building's hero group.
    const target = storefront.placeId ? new THREE.Group() : group;
    target.add(rectMesh(frame, glass, -recess, texturedMaterial(texture, 0.97)));
    addReveals(target, frame, glass, 0, -recess, texture, {
      bottom: false,
      top: storefront.revealTop !== false,
      left: storefront.revealLeft !== false && !storefront.cornerLeft,
      right: storefront.revealRight !== false && !storefront.cornerRight,
    });
    if (storefront.placeId) {
      target.userData.placeId = storefront.placeId;
      group.add(target);
    }
  }

  // Sign bands: proud of the wall with thin returns.
  for (const band of signBands) {
    const proud = meters(band.projectionM ?? 0.08);
    group.add(rectMesh(frame, band, proud, texturedMaterial(texture, 1)));
    addReveals(group, frame, band, proud, 0, texture, { interior: false });
  }

  // Awnings: angled canopy from the wall attachment line outward and down,
  // a textured valance skirt at the outer edge, and closed side panels.
  for (const awning of awnings) {
    const projection = meters(awning.projectionM ?? 0.9);
    const yValance = awning.yValance ?? awning.yDrop;
    const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;

    // Wrap a folded-corner end (cornerLeft/cornerRight): the awning turns the
    // corner as one continuous box-canopy. Only the *outer* edges (at the
    // projection depth — the canopy's drop line and the whole valance) fan past
    // the corner to the outer miter point, where the perpendicular face's
    // awning meets them; the wall-attachment line stays pinned to the true
    // corner, since it sits on the brick that folds there. That differential
    // makes each canopy a miter trapezoid that shares the diagonal seam with
    // its neighbour, instead of two flat ends overlapping into stray flaps.
    // The miter sliver's UV is edge-clamped to this awning's own slice (ux0/
    // ux1) rather than fanned into the neighbour's: the canopy carries text
    // (the 347 phone, the 111 address banner) that sits right at the kink, so
    // sampling across the fold would repeat the banner on the return face. The
    // sliver instead stretches the corner column — uniform dark fabric — so the
    // fold reads clean. (Brick/dentil/storefront wraps still sample across,
    // where continuous artwork is exactly what's wanted.)
    const ext = projection / faceWidth(frame);
    const wx0 = awning.x0; // wall-attachment edge — pinned at the corner
    const wx1 = awning.x1;
    const dx0 = awning.cornerLeft ? awning.x0 - ext : awning.x0; // outer edge — fans to miter
    const dx1 = awning.cornerRight ? awning.x1 + ext : awning.x1;
    const ux0 = u(awning.x0); // own-slice UV bounds — clamp the miter sliver here
    const ux1 = u(awning.x1);

    // A `color` awning is a solid-fabric awning — for storefronts whose drawn
    // elevation has no awning art (e.g. Sonny's, where the band is just wall
    // and lintel). It renders as flat dark cloth, shaded by face (lit top,
    // shadowed front skirt) so it still reads 3D, instead of stretching the
    // brick/lintel behind it into a smear. Textured awnings (Premier) keep the
    // painted artwork.
    const tinted = (f) => tintMaterial(new THREE.Color(awning.color).multiplyScalar(f).getHex());
    const canopyMat = awning.color != null ? tinted(0.92) : texturedMaterial(texture, 1);
    const valanceMat = awning.color != null ? tinted(0.78) : texturedMaterial(texture, 1);

    // Canopy top: a flat-elevation has no art for the awning's upper surface,
    // and stretching the front band across the projection smears the text. So
    // the top samples a single dark row at the canopy/valance seam (yDrop) —
    // uniform dark fabric, grain intact, no smear. The front-facing art lives
    // entirely on the vertical valance below, where it reads undistorted.
    const canopy = quadGeometry(
      facePoint(frame, wx0, awning.yWall, 0),
      facePoint(frame, wx1, awning.yWall, 0),
      facePoint(frame, dx1, awning.yDrop, projection),
      facePoint(frame, dx0, awning.yDrop, projection),
      [ux0, awning.yDrop, ux1, awning.yDrop, ux1, awning.yDrop, ux0, awning.yDrop],
    );
    group.add(new THREE.Mesh(canopy, canopyMat));

    if (yValance < awning.yDrop) {
      const valance = quadGeometry(
        facePoint(frame, dx0, awning.yDrop, projection),
        facePoint(frame, dx1, awning.yDrop, projection),
        facePoint(frame, dx1, yValance, projection),
        facePoint(frame, dx0, yValance, projection),
        [ux0, awning.yDrop, ux1, awning.yDrop, ux1, yValance, ux0, yValance],
      );
      group.add(new THREE.Mesh(valance, valanceMat));
    }

    // Closed end panels — suppressed at a corner-wrapped end (cornerLeft/
    // cornerRight, the canopy turns the fold) or where capLeft/capRight: false
    // marks a mid-wall end that abuts a neighbouring awning.
    const ends = [
      [awning.x0, awning.capLeft !== false && !awning.cornerLeft],
      [awning.x1, awning.capRight !== false && !awning.cornerRight],
    ];
    for (const [xEnd, capped] of ends) {
      if (!capped) continue;
      const panel = quadGeometry(
        facePoint(frame, xEnd, awning.yWall, 0),
        facePoint(frame, xEnd, awning.yDrop, projection),
        facePoint(frame, xEnd, yValance, projection),
        facePoint(frame, xEnd, yValance, 0),
      );
      group.add(new THREE.Mesh(panel, awning.color != null ? tinted(0.6) : tintMaterial(FACADE_RELIEF.darkReturn)));
    }
  }

  // Doors: shallow recess with reveals, open at the threshold.
  for (const door of doors) {
    const recess = meters(door.recessM ?? 0.12);
    if (door.shape && door.shape !== "rect") {
      addShapedOpening(group, frame, door, recess, texture);
      continue;
    }
    group.add(rectMesh(frame, door, -recess, texturedMaterial(texture, 0.98)));
    addReveals(group, frame, door, 0, -recess, texture, { bottom: false });
  }

  // Boxes (AC units, utility): proud textured blocks.
  for (const box of boxes) {
    const proud = meters(box.projectionM ?? 0.3);
    group.add(rectMesh(frame, box, proud, texturedMaterial(texture, 1)));
    addReveals(group, frame, box, proud, 0, texture, { interior: false });
  }

  // Bay window: a real shallow volume — textured front, dark wood cheeks
  // matching the drawn bay's joinery, and a dark little roof (never a lit
  // cap: the bay tucks under the cornice shadow).
  if (bay) {
    const projection = meters(bay.projectionM ?? 0.5);
    if (bay.plan === "oriel3") {
      // Faceted oriel: angled returns carry the painted side windows.
      for (const mesh of oriel3Meshes(frame, bay, projection, texture)) group.add(mesh);
    } else {
      // Flat box: textured front, dark wood cheeks, dark roof under the cornice.
      group.add(rectMesh(frame, bay, projection, texturedMaterial(texture, 1)));
      group.add(bridgeMesh(frame, bay, projection, 0, "top", tintMaterial(FACADE_RELIEF.lintelShadow)));
      group.add(bridgeMesh(frame, bay, projection, 0, "bottom", tintMaterial(REVEAL.soffit)));
      group.add(bridgeMesh(frame, bay, projection, 0, "left", tintMaterial(FACADE_RELIEF.joineryCheek)));
      group.add(bridgeMesh(frame, bay, projection, 0, "right", tintMaterial(FACADE_RELIEF.joineryCheek)));
    }
  }

  // Cornice: the defining Brooklyn roofline — a crown that overhangs the wall
  // and rises above the roof. The painted artwork is a head-on elevation, so
  // it only ever depicts the cornice *face*; there is no painted data for the
  // molding's top or underside. Rather than stretch a sliver of texture over
  // those surfaces (which smears and artifacts), the full cornice rect is
  // rendered at its natural UVs on the projecting front face, and the rising
  // crown lip, top cap, and underside soffit are solid molding tints.
  if (spec.cornice) {
    const rect = { x0: 0, x1: 1, ...spec.cornice };
    const proj = meters(spec.cornice.projectionM ?? 0.5); // crown overhang
    const riseY = meters(spec.cornice.crownRiseM ?? 0.22) / frame.height; // lip above roof
    const yCap = rect.y1 + riseY;
    const CROWN = FACADE_RELIEF.darkReturn; // near-black painted crown lip (matches refs)

    // Corner wrap: at a folded corner (cornerLeft/cornerRight) the crown turns
    // 90° onto the perpendicular face. Rather than cap the end (a flat patch)
    // or leave it open (a notch), extend the crown past the corner edge by its
    // own overhang depth — the tangential reach that lands on the outer miter
    // point. The neighbour face does the same from its side, so the two crowns
    // meet there. Because the composite's two slices are adjacent at the kink,
    // pushing x past the end samples straight into the neighbour's artwork, so
    // the painted cornice carries continuously around the corner.
    const ext = proj / faceWidth(frame);
    const xL = spec.cornice.cornerLeft ? rect.x0 - ext : rect.x0;
    const xR = spec.cornice.cornerRight ? rect.x1 + ext : rect.x1;
    const span = { x0: xL, x1: xR };

    // Front face: the painted cornice pushed proud of the wall, at natural UVs.
    group.add(rectMesh(frame, { ...span, y0: rect.y0, y1: rect.y1 }, proj, texturedMaterial(texture, 1)));

    // Underside soffit: from the wall out to the projected front at the cornice
    // base, facing down — deep shadow.
    group.add(new THREE.Mesh(quadGeometry(
      facePoint(frame, xL, rect.y0, 0),
      facePoint(frame, xR, rect.y0, 0),
      facePoint(frame, xR, rect.y0, proj),
      facePoint(frame, xL, rect.y0, proj),
    ), tintMaterial(REVEAL.soffit)));

    // Crown lip: a solid dark strip rising above the roofline at the front of
    // the overhang — the bold dark edge of a Brooklyn cornice.
    group.add(new THREE.Mesh(quadGeometry(
      facePoint(frame, xL, rect.y1, proj),
      facePoint(frame, xR, rect.y1, proj),
      facePoint(frame, xR, yCap, proj),
      facePoint(frame, xL, yCap, proj),
    ), tintMaterial(CROWN)));

    // Top cap: horizontal plane sloping back to the roof, facing up. Painted
    // dark to match the crown lip (CROWN) — a Brooklyn cornice top is tar/metal,
    // not lit stone. The fixed NE camera only grazed it, but the multi-angle
    // rig looks down onto it, where a light tint read as a bright white band.
    group.add(new THREE.Mesh(quadGeometry(
      facePoint(frame, xL, yCap, proj),
      facePoint(frame, xR, yCap, proj),
      facePoint(frame, xR, rect.y1, 0),
      facePoint(frame, xL, rect.y1, 0),
    ), tintMaterial(CROWN)));

    // Free ends — a cornice that stops mid-wall — get a cut-stone grey return.
    // Folded-corner ends extend (above) instead; flat party-wall ends need
    // nothing (the neighbouring wall hides the seam).
    if (rect.x0 > 1e-4) group.add(returnEnd(frame, rect.x0, rect.y0, yCap, proj, REVEAL.side));
    if (rect.x1 < 1 - 1e-4) group.add(returnEnd(frame, rect.x1, rect.y0, yCap, proj, REVEAL.side));
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
    const material = new THREE.LineBasicMaterial({ color: DEBUG_PALETTE.rectOutline });
    for (const rect of debugRects) {
      const { outline } = openingProfile(rect);
      const points = outline.map((p) => new THREE.Vector3(...facePoint(frame, p.x, p.y, 0.03)));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.LineLoop(geometry, material));
    }
  }

  return group;
}

// --- geometry helpers -------------------------------------------------

// World width of the face along its elevation axis — used to convert a
// projection depth (units) into the face-x reach that lands on the corner
// miter point when a component wraps a folded corner.
function faceWidth(frame) {
  return Math.hypot(frame.right.x - frame.left.x, frame.right.z - frame.left.z);
}

// A vertical return panel closing a component's end (cornice free end, etc.).
function returnEnd(frame, x, y0, y1, proj, color) {
  return new THREE.Mesh(quadGeometry(
    facePoint(frame, x, y0, 0),
    facePoint(frame, x, y0, proj),
    facePoint(frame, x, y1, proj),
    facePoint(frame, x, y1, 0),
  ), tintMaterial(color));
}

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

// 3-facet oriel bay plan in face-coords. A trapezoid: wide at the wall
// (x0..x1 @ depth 0), narrowing to a center front facet (xc0..xc1 @ depth 1)
// flanked by two angled return facets. `centerFraction` is the center facet's
// share of the opening; clamped to keep the trapezoid from inverting. Each
// facet's `quad` is its two vertical edges as [x, depthMul] (0 = wall, 1 = front).
export function oriel3Plan(bay) {
  const cf = Math.min(0.9, Math.max(0.1, bay.centerFraction ?? 0.36));
  const side = (1 - cf) / 2;
  const span = bay.x1 - bay.x0;
  const xc0 = bay.x0 + side * span;
  const xc1 = bay.x1 - side * span;
  return {
    xc0,
    xc1,
    facets: [
      { id: "left", quad: [[bay.x0, 0], [xc0, 1]] },
      { id: "center", quad: [[xc0, 1], [xc1, 1]] },
      { id: "right", quad: [[xc1, 1], [bay.x1, 0]] },
    ],
  };
}

// Build the 3-facet oriel: 3 textured facet quads (returns + center, each
// sampling its own slice of the bay's texture strip so the painted side
// windows fold onto the angled returns) + 2 flat-tinted trapezoidal caps
// (top in cornice shadow, bottom soffit). `projection` is units along normal.
export function oriel3Meshes(frame, bay, projection, texture) {
  const plan = oriel3Plan(bay);
  const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;
  const depth = (mul) => mul * projection;
  const meshes = [];

  for (const facet of plan.facets) {
    const [a, b] = facet.quad; // [x, depthMul]
    const uv = texture
      ? [u(a[0]), bay.y0, u(b[0]), bay.y0, u(b[0]), bay.y1, u(a[0]), bay.y1]
      : undefined;
    const geometry = quadGeometry(
      facePoint(frame, a[0], bay.y0, depth(a[1])),
      facePoint(frame, b[0], bay.y0, depth(b[1])),
      facePoint(frame, b[0], bay.y1, depth(b[1])),
      facePoint(frame, a[0], bay.y1, depth(a[1])),
      uv,
    );
    meshes.push(new THREE.Mesh(geometry, texturedMaterial(texture, 1)));
  }

  // Trapezoidal caps close the plan at top (y1) and bottom (y0): wall corners
  // at depth 0, front corners at full projection. Flat-tinted, no texture.
  const cap = (y) => quadGeometry(
    facePoint(frame, bay.x0, y, 0),
    facePoint(frame, plan.xc0, y, projection),
    facePoint(frame, plan.xc1, y, projection),
    facePoint(frame, bay.x1, y, 0),
  );
  meshes.push(new THREE.Mesh(cap(bay.y1), tintMaterial(0x352c22)));     // top: under-cornice shadow
  meshes.push(new THREE.Mesh(cap(bay.y0), tintMaterial(REVEAL.soffit))); // bottom: soffit

  return meshes;
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

// Triangulate a convex/star-shaped face-coord polygon as a fan from points[0],
// at a constant normal offset, textured by each vertex's own (x,y) UV so the
// painted artwork registers. `points` are {x,y} in face-coords.
function fanGeometry(frame, points, offset, withUv) {
  const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;
  const position = [];
  const uv = [];
  for (const p of points) {
    position.push(...facePoint(frame, p.x, p.y, offset));
    if (withUv) uv.push(u(p.x), p.y);
  }
  const index = [];
  for (let i = 1; i < points.length - 1; i += 1) index.push(0, i, i + 1);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(position), 3));
  if (withUv) geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// A shaped opening (arch/circle): recessed silhouette pane + flush spandrel/
// corner fillers (textured wall, so the corners read flush) + reveals. Straight
// reveals on the arch's lower jambs/sill via addReveals; the curved edge (arch
// head / oculus ring) gets a textured edge-stretched reveal via addCurvedReveal
// so it reads as cut brick — the same treatment rectangular recesses get, not a
// grey seam at the recess depth.
function addShapedOpening(group, frame, rect, recess, texture) {
  const profile = openingProfile(rect);
  group.add(new THREE.Mesh(fanGeometry(frame, profile.outline, -recess, true), texturedMaterial(texture, 1)));
  for (const filler of profile.fillers) {
    group.add(new THREE.Mesh(fanGeometry(frame, filler, 0, true), texturedMaterial(texture, 1)));
  }
  if ((rect.shape ?? "rect") === "arch") {
    const lower = { x0: rect.x0, x1: rect.x1, y0: rect.y0, y1: springYOf(rect) };
    addReveals(group, frame, lower, 0, -recess, texture, { top: false });
  }
  if (profile.revealCurve) {
    addCurvedReveal(group, frame, profile.revealCurve, 0, -recess, texture);
  }
}

// Curved reveal: a tessellated ribbon bridging the wall plane (fromOffset) to
// the recessed plane (toOffset) along a curve, edge-stretching the wall artwork
// into the reveal (both depth ends sample the same edge point's UV) and
// darkening it per segment — the same treatment straight reveals (bridgeMesh)
// get, so an arch head / oculus ring continues the brick instead of leaving a
// grey seam. Per-segment shade blends the rectangular recess cardinals around
// the curve: dark lintel at the top, lit sill at the bottom, mid jambs at the
// sides.
function addCurvedReveal(group, frame, curve, fromOffset, toOffset, texture) {
  const { points, closed } = curve;
  const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;
  const shade = REVEAL_SHADE.recess;
  let cx = 0;
  let cy = 0;
  for (const p of points) { cx += p.x; cy += p.y; }
  cx /= points.length;
  cy /= points.length;
  const segments = closed ? points.length : points.length - 1;
  for (let i = 0; i < segments; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    // Outward direction of the segment midpoint → +1 top (lintel), −1 bottom
    // (sill), 0 sides (jambs). Blend the cardinal recess shades accordingly.
    const dx = (a.x + b.x) / 2 - cx;
    const dy = (a.y + b.y) / 2 - cy;
    const ny = dy / (Math.hypot(dx, dy) || 1);
    const s = ny >= 0 ? shade.left + (shade.top - shade.left) * ny : shade.left + (shade.bottom - shade.left) * -ny;
    const uv = [u(a.x), a.y, u(b.x), b.y, u(b.x), b.y, u(a.x), a.y];
    const geometry = quadGeometry(
      facePoint(frame, a.x, a.y, fromOffset),
      facePoint(frame, b.x, b.y, fromOffset),
      facePoint(frame, b.x, b.y, toOffset),
      facePoint(frame, a.x, a.y, toOffset),
      uv,
    );
    group.add(new THREE.Mesh(geometry, texturedMaterial(texture, s)));
  }
}

// A reveal bridges the wall plane and a recessed/proud plane along one rect
// edge. The bridge is textured with the wall artwork stretched off that edge
// (so it continues the brick), then darkened per face for cast light:
// `sides.interior` (default) reads as a recess (dark lintel, lit sill); proud
// elements catch light on top and fall into soffit shadow underneath.
function addReveals(group, frame, rect, fromOffset, toOffset, texture, sides = {}) {
  const shade = (sides.interior !== false) ? REVEAL_SHADE.recess : REVEAL_SHADE.proud;
  const edges = [
    ["top", sides.top !== false],
    ["bottom", sides.bottom !== false],
    ["left", sides.left !== false],
    ["right", sides.right !== false],
  ];
  for (const [edge, enabled] of edges) {
    if (!enabled) continue;
    group.add(bridgeMesh(frame, rect, fromOffset, toOffset, edge, texturedMaterial(texture, shade[edge])));
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
  // Edge-stretch UVs: both depth ends sample the same edge line in the
  // texture (the column at x for a jamb, the row at y for a sill/lintel), so
  // the wall artwork bleeds into the recess instead of a flat fill. Only set
  // when the material is textured — flat tints (e.g. bay cheeks) keep none.
  let uv;
  if (material.map) {
    const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;
    uv = [u(a[0]), a[1], u(b[0]), b[1], u(b[0]), b[1], u(a[0]), a[1]];
  }
  const geometry = quadGeometry(
    facePoint(frame, a[0], a[1], fromOffset),
    facePoint(frame, b[0], b[1], fromOffset),
    facePoint(frame, b[0], b[1], toOffset),
    facePoint(frame, a[0], a[1], toOffset),
    uv,
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
