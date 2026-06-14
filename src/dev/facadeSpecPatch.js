// Immutable spec helpers for the facade recess editor.
//
// A "recess" is one opening rect inside a face spec. v1 edits the flat-rect
// kinds only: window rects, storefronts, doors, and the cornice band.

const round = (v) => Math.round(v * 1000) / 1000; // match spec precision (3dp)

// Flatten a face spec into the editable recess items, each carrying a `path`
// back to its home in the spec tree and its current rect in face coords.
export function listEditableRecesses(faceSpec) {
  if (!faceSpec) return [];
  const items = [];
  const rects = faceSpec.windows?.rects ?? [];
  rects.forEach((r, i) =>
    items.push({ id: `window-${i}`, label: `window ${i + 1}`, kind: "window", path: ["windows", "rects", i], rect: rectOf(r) }),
  );
  (faceSpec.storefronts ?? []).forEach((r, i) =>
    items.push({ id: `storefront-${i}`, label: `storefront ${i + 1}`, kind: "storefront", path: ["storefronts", i], rect: rectOf(r) }),
  );
  (faceSpec.doors ?? []).forEach((r, i) =>
    items.push({ id: `door-${i}`, label: `door ${i + 1}`, kind: "door", path: ["doors", i], rect: rectOf(r) }),
  );
  if (faceSpec.cornice) {
    items.push({
      id: "cornice",
      label: "cornice",
      kind: "cornice",
      path: ["cornice"],
      lockX: true, // full-width band; only the top/bottom edges move
      rect: { x0: 0, x1: 1, y0: faceSpec.cornice.y0, y1: faceSpec.cornice.y1 },
    });
  }
  return items;
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
