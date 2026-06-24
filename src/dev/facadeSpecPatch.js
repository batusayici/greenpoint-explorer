// Immutable spec helpers for the facade recess editor.
//
// An editable "component" is one rect inside a face spec. Recessed kinds
// (windows, storefronts, doors, cornice) step behind the wall; proud kinds
// (boxes/AC units, sign bands, bay) project in front of it. Each item also
// carries a `depth` descriptor so the editor can tune how far it sits in or
// out — the one dimension the flat 2D texture preview can't show.

const round = (v) => Math.round(v * 1000) / 1000; // match spec precision (3dp)

// Per-kind depth metadata: which spec key holds the offset, its default
// (mirrors facadeAssembly.js fallbacks), and which way it points. `sign` is
// +1 proud / -1 recessed; `max` bounds the slider (meters).
const DEPTH = {
  window:     { key: "recessM",     def: 0.14, sign: -1, max: 1.0 },
  storefront: { key: "recessM",     def: 0.45, sign: -1, max: 1.2 },
  door:       { key: "recessM",     def: 0.12, sign: -1, max: 1.0 },
  box:        { key: "projectionM", def: 0.3,  sign: 1,  max: 1.5 },
  signBand:   { key: "projectionM", def: 0.08, sign: 1,  max: 0.8 },
  bay:        { key: "projectionM", def: 0.5,  sign: 1,  max: 1.5 },
};

// Flatten a face spec into editable component items, each carrying a `path`
// back to its home in the spec tree, its current rect in face coords, and
// (where applicable) a `depth` descriptor pointing at its offset key.
export function listEditableRecesses(faceSpec) {
  if (!faceSpec) return [];
  const items = [];

  const rects = faceSpec.windows?.rects ?? [];
  rects.forEach((r, i) =>
    items.push(mk(`window-${i}`, `window ${i + 1}`, "window", ["windows", "rects", i], rectOf(r), {
      // windows share one recessM; depth edits the whole set.
      key: "recessM", path: ["windows", "recessM"], value: faceSpec.windows?.recessM,
    }, false, r)),
  );
  (faceSpec.storefronts ?? []).forEach((r, i) =>
    items.push(mk(`storefront-${i}`, `storefront ${i + 1}`, "storefront", ["storefronts", i], rectOf(r), depthAt(r, "storefront", ["storefronts", i]))),
  );
  (faceSpec.doors ?? []).forEach((r, i) =>
    items.push(mk(`door-${i}`, `door ${i + 1}`, "door", ["doors", i], rectOf(r), depthAt(r, "door", ["doors", i]), false, r)),
  );
  (faceSpec.boxes ?? []).forEach((r, i) =>
    items.push(mk(`box-${i}`, `box ${i + 1}`, "box", ["boxes", i], rectOf(r), depthAt(r, "box", ["boxes", i]))),
  );
  (faceSpec.signBands ?? []).forEach((r, i) =>
    items.push(mk(`signBand-${i}`, `sign band ${i + 1}`, "signBand", ["signBands", i], rectOf(r), depthAt(r, "signBand", ["signBands", i]))),
  );
  if (faceSpec.bay) {
    items.push(mk("bay", "bay", "bay", ["bay"], rectOf(faceSpec.bay), depthAt(faceSpec.bay, "bay", ["bay"])));
  }
  // `bays` (array) carries the multi-oriel faces (Astral frontage/java/india).
  // Each gets its own draggable box; patchRecess writes x/y back while keeping
  // plan/centerFraction/projectionM, so drag-snapping the box registers the
  // oriel to the painted bay without re-authoring the fold params.
  (faceSpec.bays ?? []).forEach((r, i) =>
    items.push(mk(`bay-${i}`, `bay ${i + 1}`, "bay", ["bays", i], rectOf(r), depthAt(r, "bay", ["bays", i]))),
  );
  if (faceSpec.cornice) {
    items.push(mk("cornice", "cornice", "cornice", ["cornice"], { x0: 0, x1: 1, y0: faceSpec.cornice.y0, y1: faceSpec.cornice.y1 }, null, true));
  }
  return items;
}

function mk(id, label, kind, path, rect, depthOverride, lockX = false, src = null) {
  const meta = DEPTH[kind];
  let depth = null;
  if (depthOverride) {
    depth = {
      key: depthOverride.key,
      path: depthOverride.path,
      sign: meta.sign,
      min: 0,
      max: meta.max,
      value: depthOverride.value ?? meta.def,
    };
  }
  const shapeMeta = src ? { shape: src.shape ?? "rect", springY: src.springY } : {};
  return { id, label, kind, path, rect, depth, ...shapeMeta, ...(lockX ? { lockX: true } : {}) };
}

// Depth descriptor for a per-item component (offset key lives on the rect).
function depthAt(node, kind, path) {
  const meta = DEPTH[kind];
  return { key: meta.key, path: [...path, meta.key], value: node[meta.key] };
}

function rectOf(r) {
  return { x0: r.x0, x1: r.x1, y0: r.y0, y1: r.y1 };
}

// Return a new face spec with the recess at `path` replaced by `nextRect`.
// Non-coordinate keys (recessM, revealRight, projectionM, ...) are preserved.
// Cornice only ever writes y0/y1 (it is implicitly full width).
export function patchRecess(faceSpec, path, nextRect) {
  const clone = structuredClone(faceSpec);
  if (path[0] === "cornice") {
    clone.cornice = { ...clone.cornice, y0: round(nextRect.y0), y1: round(nextRect.y1) };
    return clone;
  }
  let node = clone;
  for (let k = 0; k < path.length - 1; k += 1) node = node[path[k]];
  const i = path[path.length - 1];
  node[i] = {
    ...node[i],
    x0: round(nextRect.x0),
    x1: round(nextRect.x1),
    y0: round(nextRect.y0),
    y1: round(nextRect.y1),
  };
  return clone;
}

// Return a new face spec with the depth key at `depthPath` set to `value`
// (meters, rounded to spec precision). Used by the depth slider.
export function patchDepth(faceSpec, depthPath, value) {
  const clone = structuredClone(faceSpec);
  let node = clone;
  for (let k = 0; k < depthPath.length - 1; k += 1) {
    if (node[depthPath[k]] == null) node[depthPath[k]] = {};
    node = node[depthPath[k]];
  }
  node[depthPath[depthPath.length - 1]] = round(value);
  return clone;
}

// Set the opening shape at `path`. Switching to "arch" seeds springY at the
// box midpoint if absent; switching back to "rect" strips shape/springY so
// the saved spec stays clean.
export function patchShape(faceSpec, path, shape) {
  const clone = structuredClone(faceSpec);
  let node = clone;
  for (let k = 0; k < path.length - 1; k += 1) node = node[path[k]];
  const i = path[path.length - 1];
  const rect = node[i];
  if (shape === "rect") {
    const { shape: _s, springY: _y, ...rest } = rect;
    node[i] = rest;
  } else if (shape === "arch") {
    node[i] = { ...rect, shape, springY: rect.springY ?? round((rect.y0 + rect.y1) / 2) };
  } else {
    const { springY: _y, ...rest } = rect;
    node[i] = { ...rest, shape };
  }
  return clone;
}

// Default rects for newly-added openings (face coords). Window sits mid-wall;
// door is grounded (y0 = 0) and carries its own recess.
const NEW_WINDOW = { x0: 0.45, x1: 0.55, y0: 0.4, y1: 0.6 };
const NEW_DOOR = { x0: 0.45, x1: 0.55, y0: 0, y1: 0.3, recessM: 0.12 };
const DEFAULT_WINDOW_RECESS = 0.14;

// Append a new opening of `kind` ("window" | "door") to the face spec.
// Windows share one `windows.recessM` (seeded when the set is created fresh);
// doors carry per-item recess. Returns the new spec plus the `id` the editor
// uses to auto-select the freshly-added box (matches listEditableRecesses).
export function addRecess(faceSpec, kind) {
  const clone = structuredClone(faceSpec ?? {});
  if (kind === "window") {
    if (!clone.windows) clone.windows = { recessM: DEFAULT_WINDOW_RECESS, rects: [] };
    if (!clone.windows.rects) clone.windows.rects = [];
    clone.windows.rects.push({ ...NEW_WINDOW });
    return { spec: clone, id: `window-${clone.windows.rects.length - 1}` };
  }
  if (kind === "door") {
    if (!clone.doors) clone.doors = [];
    clone.doors.push({ ...NEW_DOOR });
    return { spec: clone, id: `door-${clone.doors.length - 1}` };
  }
  return { spec: clone, id: null };
}

// Remove the array-backed opening at `path` (e.g. ["windows","rects",i] or
// ["doors",i]). Singleton paths (cornice/bay) are left untouched — a defensive
// no-op so a stray Delete can't destroy them.
export function deleteRecess(faceSpec, path) {
  const clone = structuredClone(faceSpec);
  const i = path[path.length - 1];
  if (typeof i !== "number") return clone;
  let parent = clone;
  for (let k = 0; k < path.length - 1; k += 1) parent = parent[path[k]];
  if (!Array.isArray(parent)) return clone;
  parent.splice(i, 1);
  return clone;
}

// Set springY (arch spring line) at `path`, rounded to spec precision.
export function patchSpring(faceSpec, path, value) {
  const clone = structuredClone(faceSpec);
  let node = clone;
  for (let k = 0; k < path.length - 1; k += 1) node = node[path[k]];
  const i = path[path.length - 1];
  node[i] = { ...node[i], springY: round(value) };
  return clone;
}
