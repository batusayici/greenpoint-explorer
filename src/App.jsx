import { useState } from "react";
import { mvpScene } from "./mvpPlaceData.js";
import PlaceholderWorld from "./PlaceholderWorld.jsx";

const DEFAULT_QA_LAYERS = {
  scaffold: true,
  realData: true,
  footprints: true,
  draft: false,
  labels: false,
};

const QA_LAYER_OPTIONS = [
  {
    id: "scaffold",
    label: "Scaffold",
    description: "Block, tile, layer, and status boundaries",
  },
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
              <span>Scaffold status is review-only; coordinates are not exact real-world geometry.</span>
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
              <p className="card-label">{getCardLabel(selectedTarget)}</p>
              <h2>{selectedTarget.title}</h2>
              <p className="card-category">{selectedTarget.category}</p>
              {selectedTarget.summary ? (
                <p className="card-summary">{selectedTarget.summary}</p>
              ) : null}
              <dl className="store-card-facts" aria-label="Store information">
                <div>
                  <dt>Address</dt>
                  <dd>{selectedTarget.address ?? "Manhattan Ave / Greenpoint Ave context"}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{selectedTarget.verificationStatus ?? selectedTarget.status ?? "review-only"}</dd>
                </div>
              </dl>
              {selectedTarget.sourceSummary ? (
                <p className="source-summary">{selectedTarget.sourceSummary}</p>
              ) : null}
              {selectedTarget.spatialGrounding ? (
                <section className="spatial-grounding" aria-label="Spatial grounding status">
                  <h3>Spatial Grounding</h3>
                  <p>{selectedTarget.spatialGrounding.usageLimit}</p>
                  <ul>
                    <li data-status={selectedTarget.spatialGrounding.status}>
                      <strong>{selectedTarget.spatialGrounding.label}</strong>
                      <small>{formatStatusLabel(selectedTarget.spatialGrounding.status)}</small>
                      <span>{selectedTarget.spatialGrounding.sourceBasis?.join("; ")}</span>
                    </li>
                    {selectedTarget.spatialGrounding.transitCues?.map((cue) => (
                      <li key={`${selectedTarget.id}-${cue.id}`} data-status={cue.status}>
                        <strong>{cue.label}</strong>
                        <small>{formatStatusLabel(cue.status)}</small>
                        <span>{cue.notes}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {selectedTarget.fieldStatuses?.length ? (
                <section className="target-status-summary" aria-label="Target field status summary">
                  <h3>Target Status</h3>
                  <dl>
                    {selectedTarget.fieldStatuses.map((fieldStatus) => (
                      <div
                        key={`${selectedTarget.id}-${fieldStatus.field}`}
                        data-status={fieldStatus.status}
                      >
                        <dt>{fieldStatus.label}</dt>
                        <dd>
                          <strong>{formatStatusLabel(fieldStatus.status)}</strong>
                          <span>{fieldStatus.notes}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}
              {selectedTarget.evidenceLanes?.length ? (
                <section className="evidence-lanes" aria-label="Evidence lane status">
                  <h3>Evidence Lanes</h3>
                  <ul>
                    {selectedTarget.evidenceLanes.map((lane) => (
                      <li key={`${selectedTarget.id}-${lane.id}`} data-status={lane.status}>
                        <strong>{lane.label}</strong>
                        <small>{formatStatusLabel(lane.status)}</small>
                        <span>{lane.supports}</span>
                        <em>{lane.doesNotSupport}</em>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {selectedTarget.geometryContext ? (
                <section className="geometry-context" aria-label="Geometry context evidence">
                  <h3>Geometry Context</h3>
                  <p>{selectedTarget.geometryContext.usageLimit}</p>
                  <ul>
                    {selectedTarget.geometryContext.records?.map((record) => (
                      <li key={`${selectedTarget.id}-${record.id}`} data-status={record.status}>
                        <strong>{record.label}</strong>
                        <small>{formatStatusLabel(record.status)}</small>
                        <span>{`BIN ${record.bin}; ${record.lastStatusType}; ${record.geomSource}`}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {selectedTarget.facadeEvidence ? (
                <section className="facade-evidence" aria-label="Facade reference evidence">
                  <h3>Facade Evidence</h3>
                  <p>{selectedTarget.facadeEvidence.usageLimit}</p>
                  <ul>
                    {selectedTarget.facadeEvidence.records?.map((record) => (
                      <li key={`${selectedTarget.id}-${record.targetId}`} data-status={record.status}>
                        <strong>{record.label}</strong>
                        <small>{formatStatusLabel(record.status)}</small>
                        <span>{record.keyCues}</span>
                        <em>{record.blockedClaims}</em>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {selectedTarget.candidateTargets?.length ? (
                <section className="candidate-targets" aria-label="Candidate target records">
                  <h3>Candidate Records</h3>
                  <ul>
                    {selectedTarget.candidateTargets.map((candidate) => (
                      <li key={`${selectedTarget.id}-${candidate.id}`}>
                        <strong>{candidate.label}</strong>
                        <small>{formatStatusLabel(candidate.status)}</small>
                        <span>{candidate.notes}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {selectedTarget.realPlaces?.length ? (
                <section className="corridor-realness" aria-label="Existing real place context">
                  <h3>Existing MVP Context</h3>
                  <ul>
                    {selectedTarget.realPlaces.map((place) => (
                      <li key={`${selectedTarget.id}-${place.name}`}>
                        <strong>{place.name}</strong>
                        <span>{place.category}</span>
                        <small>{place.status}</small>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {selectedTarget.sourceReferences?.length ? (
                <section className="local-source-references" aria-label="Local source references">
                  <h3>Local Evidence Pointers</h3>
                  <ul>
                    {selectedTarget.sourceReferences.map((source) => (
                      <li key={`${selectedTarget.id}-${source.id}`}>
                        <strong>{source.label}</strong>
                        <small>{formatStatusLabel(source.status)}</small>
                        <span>{source.path}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              <p className="card-disclaimer">{selectedTarget.disclaimer ?? getCompactDisclaimer(selectedTarget)}</p>
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

function getCardLabel(target) {
  if (target.id === "greenpoint-g-subway") return "Transit context";
  if (target.cardBadge === "candidate") return "Source candidate";
  return "Selected place";
}

function formatStatusLabel(status) {
  return String(status).replaceAll("_", " ");
}
