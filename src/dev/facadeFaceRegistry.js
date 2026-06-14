// Runtime bridge between the live 3D scene and the recess editor.
//
// SceneView registers one entry per spec'd face once its texture has loaded;
// the editor reads entries to draw the texture slice and calls `rebuild` to
// re-snap the 3D face live while dragging. Dev-only — nothing registers unless
// the scene is built, and the editor only mounts under ?facadeedit=1.

const registry = new Map();
const subscribers = new Set();

// entry: { rebuild(faceSpec), texture, u0, u1, flip, file, faceSpec }
export function registerFacadeFace(faceKey, entry) {
  registry.set(faceKey, entry);
  notify();
}

export function getFacadeFace(faceKey) {
  return registry.get(faceKey);
}

export function facadeFaceKeys() {
  return [...registry.keys()];
}

export function clearFacadeFaces() {
  registry.clear();
  notify();
}

export function subscribeFacadeFaces(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function notify() {
  subscribers.forEach((fn) => fn());
}
