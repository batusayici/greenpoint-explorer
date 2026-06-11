import SceneView from "./SceneView.jsx";
import Phase4BRuntimePreview from "./Phase4BRuntimePreview.jsx";

// Scene mode (the product) is the default. The legacy QA runtime survives
// as Debug mode behind ?debug=1 — truth overlays, footprint IDs, QA layers.
export default function App() {
  const debug = new URLSearchParams(window.location.search).get("debug") === "1";
  return debug ? <Phase4BRuntimePreview /> : <SceneView />;
}
