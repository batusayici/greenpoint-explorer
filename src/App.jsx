import { useState } from "react";
import { mvpScene } from "./mvpPlaceData.js";
import PlaceholderWorld from "./PlaceholderWorld.jsx";

const DEFAULT_QA_LAYERS = {
  realData: true,
  footprints: true,
  draft: false,
  labels: false,
};

const QA_LAYER_OPTIONS = [
  {
    id: "realData",
    label: "Real data",
    description: "Source-backed or stronger review fields",
  },
  {
    id: "footprints",
    label: "Footprints",
    description: "NYC footprint candidates, not tenant frontage",
  },
  {
    id: "draft",
    label: "Draft",
    description: "Manual/authored scene geometry",
  },
  {
    id: "labels",
    label: "Labels",
    description: "Detailed QA text and callouts",
  },
];

export default function App() {
  const [hoveredTargetId, setHoveredTargetId] = useState(null);
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [cameraCommand, setCameraCommand] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [qaLayers, setQaLayers] = useState(DEFAULT_QA_LAYERS);
  const selectedTarget = mvpScene.targets.find((target) => target.id === selectedTargetId);

  function sendCameraCommand(type) {
    setCameraCommand({ type, nonce: Date.now() });
  }

  function toggleQaLayer(layerId) {
    setQaLayers((layers) => ({ ...layers, [layerId]: !layers[layerId] }));
  }

  return (
    <main className="prototype-shell" aria-label="Greenpoint Explorer prototype shell">
      <section className="world-panel" aria-label="Product-facing raster prototype scene">
        <div className="panel-topline">
          <div>
            <p className="kicker">Review prototype</p>
            <h1>Greenpoint Explorer</h1>
          </div>
          <p className="placeholder-note">{mvpScene.note}</p>
        </div>

        <div className="viewport-frame">
          <div className="review-ribbon" aria-hidden="true">
            {mvpScene.reviewLabel}
          </div>
          <div className="scene-frame-note" aria-label="Scene source frame">
            <strong>{mvpScene.sceneFrame.locationLabel}</strong>
            <span>{mvpScene.sceneFrame.intent}</span>
          </div>
          <div className="target-rail" aria-label="MVP place index">
            <p className="rail-label">Places</p>
            {mvpScene.targets.map((target) => {
              const isActive = hoveredTargetId === target.id || selectedTargetId === target.id;
              return (
                <button
                  key={target.id}
                  type="button"
                  className="target-pill"
                  aria-pressed={selectedTargetId === target.id}
                  data-active={isActive ? "true" : "false"}
                  onClick={() => setSelectedTargetId(target.id)}
                  onFocus={() => setHoveredTargetId(target.id)}
                  onBlur={() => setHoveredTargetId(null)}
                  onPointerEnter={() => setHoveredTargetId(target.id)}
                  onPointerLeave={() => setHoveredTargetId(null)}
                >
                  <span>{target.title}</span>
                  <small>{target.cardBadge ?? target.verificationStatus}</small>
                </button>
              );
            })}
          </div>
          <div className="view-controls" aria-label="Prototype view controls">
            <button type="button" aria-label="Pan view left" onClick={() => sendCameraCommand("pan-left")}>
              <span aria-hidden="true">&lt;</span>
            </button>
            <button type="button" aria-label="Pan view right" onClick={() => sendCameraCommand("pan-right")}>
              <span aria-hidden="true">&gt;</span>
            </button>
            <button type="button" aria-label="Zoom out" onClick={() => sendCameraCommand("zoom-out")}>
              <span aria-hidden="true">-</span>
            </button>
            <button type="button" aria-label="Zoom in" onClick={() => sendCameraCommand("zoom-in")}>
              <span aria-hidden="true">+</span>
            </button>
            <button type="button" aria-label="Reset view" onClick={() => sendCameraCommand("reset")}>
              <span aria-hidden="true">Reset</span>
            </button>
            <button
              type="button"
              className="fixed-view-control"
              aria-label="Fixed view angle; true rotation is deferred for this raster-first scene"
              title="Fixed view angle; true rotation is deferred for this raster-first scene"
              disabled
            >
              <span aria-hidden="true">Fixed</span>
            </button>
            <button
              type="button"
              className="review-toggle"
              aria-label={isReviewMode ? "Hide review hotspot outlines and manifest QA" : "Show review hotspot outlines and manifest QA"}
              aria-pressed={isReviewMode}
              onClick={() => setIsReviewMode((value) => !value)}
            >
              <span aria-hidden="true">QA</span>
            </button>
          </div>
          {isReviewMode ? (
            <div className="qa-layer-controls" aria-label="QA overlay layers">
              <p>QA layers</p>
              {QA_LAYER_OPTIONS.map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={qaLayers[layer.id]}
                  aria-label={`${qaLayers[layer.id] ? "Hide" : "Show"} ${layer.label}: ${layer.description}`}
                  title={layer.description}
                  onClick={() => toggleQaLayer(layer.id)}
                >
                  {layer.label}
                </button>
              ))}
              <span>Footprints are official building candidates only, not exact storefronts.</span>
            </div>
          ) : null}
          <PlaceholderWorld
            scene={mvpScene}
            selectedTargetId={selectedTargetId}
            hoveredTargetId={hoveredTargetId}
            reviewMode={isReviewMode}
            qaLayers={qaLayers}
            cameraCommand={cameraCommand}
            onHoverTarget={setHoveredTargetId}
            onSelectTarget={setSelectedTargetId}
          />

          {selectedTarget ? (
            <aside className="selected-card" aria-live="polite">
              <span className="card-attachment" aria-hidden="true" />
              <button
                className="icon-button"
                type="button"
                aria-label="Close selected card"
                onClick={() => setSelectedTargetId(null)}
              >
                <span aria-hidden="true">x</span>
              </button>
              <p className="card-label">{selectedTarget.label}</p>
              <h2>{selectedTarget.title}</h2>
              <p className="card-category">{selectedTarget.category}</p>
              <dl className="store-card-facts" aria-label="Store information">
                <div>
                  <dt>Address</dt>
                  <dd>{selectedTarget.address ?? "Manhattan Ave / Greenpoint Ave context"}</dd>
                </div>
              </dl>
              <p className="card-disclaimer">{getCompactDisclaimer(selectedTarget)}</p>
            </aside>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function getCompactDisclaimer(target) {
  if (target.id === "greenpoint-g-subway") {
    return "Review-only. Exact station entrance geometry is not claimed.";
  }
  return "Review-only. Address/category are source-backed where listed; exact facade or entrance geometry is not claimed.";
}
