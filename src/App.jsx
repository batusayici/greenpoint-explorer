import { useState } from "react";
import { mvpScene } from "./mvpPlaceData.js";
import grillpointPromotionReadiness from "./data/source-evidence/grillpoint.promotion-readiness.phase-2n.json";
import PlaceholderWorld from "./PlaceholderWorld.jsx";

export default function App() {
  const [hoveredTargetId, setHoveredTargetId] = useState(null);
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [cameraCommand, setCameraCommand] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const selectedTarget = mvpScene.targets.find((target) => target.id === selectedTargetId);
  const selectedSources = selectedTarget?.sourceRefs.map((sourceId) => mvpScene.sourceRefs[sourceId]).filter(Boolean) ?? [];
  const selectedEvidenceRows = selectedTarget?.evidenceStatus ?? [];
  const selectedQA = selectedTarget?.manifestQA;
  const selectedDraftScene = selectedTarget?.draftScene;
  const selectedPromotionReadinessReport = selectedTarget?.id === grillpointPromotionReadiness.targetId
    ? grillpointPromotionReadiness
    : null;

  function sendCameraCommand(type) {
    setCameraCommand({ type, nonce: Date.now() });
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
            Review-only
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
              className="review-toggle"
              aria-label={isReviewMode ? "Hide review hotspot outlines and manifest QA" : "Show review hotspot outlines and manifest QA"}
              aria-pressed={isReviewMode}
              onClick={() => setIsReviewMode((value) => !value)}
            >
              <span aria-hidden="true">QA</span>
            </button>
          </div>
          <PlaceholderWorld
            scene={mvpScene}
            selectedTargetId={selectedTargetId}
            hoveredTargetId={hoveredTargetId}
            reviewMode={isReviewMode}
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
              <p className="card-summary">{selectedTarget.summary}</p>
              <p>{selectedTarget.description}</p>
              {selectedEvidenceRows.length ? (
                <dl className="evidence-list" aria-label="Evidence status">
                  {selectedEvidenceRows.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {selectedQA ? (
                <ManifestQAInspector
                  qa={selectedQA}
                  isOpen={isReviewMode}
                  draftScene={selectedDraftScene}
                  promotionReadinessReport={selectedPromotionReadinessReport}
                />
              ) : null}
              {selectedTarget.address ? (
                <dl className="card-metadata" aria-label="Source and review metadata">
                  <div>
                    <dt>Address / anchor</dt>
                    <dd>{selectedTarget.address}</dd>
                  </div>
                  <div>
                    <dt>Last verified</dt>
                    <dd>{selectedTarget.lastVerified ?? "Not source-backed"}</dd>
                  </div>
                  <div>
                    <dt>Truth status</dt>
                    <dd>{selectedTarget.statusNote}</dd>
                  </div>
                </dl>
              ) : null}
              {selectedSources.length ? (
                <div className="source-list" aria-label="Reviewed sources">
                  <p>{mvpScene.sourceListLabel ?? "Reviewed sources"}</p>
                  {selectedSources.map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  ))}
                </div>
              ) : null}
              <p className="card-disclaimer">{selectedTarget.disclaimer ?? mvpScene.disclaimer}</p>
              <ul className="tag-list" aria-label="Place review tags">
                {selectedTarget.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function ManifestQAInspector({ qa, isOpen, draftScene, promotionReadinessReport }) {
  const primarySources = qa.sources.slice(0, 4);
  const sourceEvidence = qa.sourceEvidence ?? [];
  const missingData = qa.sceneQA.missingData.slice(0, 3);
  const ambiguity = qa.sceneQA.ambiguity.slice(0, 3);
  const blockedClaims = qa.sceneQA.blockedClaims.slice(0, 3);
  const evidenceQualityRecords = sourceEvidence.map((record) => ({
    id: record.id,
    evidenceStrength: record.evidenceStrength,
    claimReadiness: record.claimReadiness,
    promotionBlockers: getPromotionBlockers(record.promotionGates),
  }));

  return (
    <details className="qa-inspector" open={isOpen}>
      <summary>
        <span>Manifest QA</span>
        <small>{qa.place?.claimStatus ?? qa.object.claimStatus}</small>
      </summary>
      <div className="qa-grid" aria-label="Manifest QA details">
        <dl className="qa-facts">
          <div>
            <dt>Manifest object</dt>
            <dd>{qa.object.id}</dd>
          </div>
          <div>
            <dt>Scene status</dt>
            <dd>{qa.sceneAnchor?.claimStatus ?? qa.object.claimStatus}</dd>
          </div>
          <div>
            <dt>Place confidence</dt>
            <dd>{formatConfidence(qa.place?.confidence)}</dd>
          </div>
          {qa.business ? (
            <div>
              <dt>Business status</dt>
              <dd>{qa.business.status} / {formatConfidence(qa.business.statusConfidence)}</dd>
            </div>
          ) : null}
          <div>
            <dt>Scene point</dt>
            <dd>{formatScenePoint(qa.sceneAnchor?.scenePoint)}</dd>
          </div>
          <div>
            <dt>Corner / context</dt>
            <dd>{qa.sceneAnchor?.cornerLabel ?? "Unresolved"}</dd>
          </div>
        </dl>

        {qa.addresses.length ? (
          <section className="qa-section">
            <h3>Address / Geometry</h3>
            {qa.addresses.map((address) => (
              <p key={address.id}>
                {address.normalizedAddress}
                {" | "}
                WGS84 {address.hasWgs84 ? "present" : "missing"}
                {" | "}
                local point {address.hasLocalPoint ? "present" : "missing"}
              </p>
            ))}
          </section>
        ) : null}

        {qa.storefronts.length ? (
          <section className="qa-section">
            <h3>Storefront</h3>
            {qa.storefronts.map((storefront) => (
              <p key={storefront.id}>
                frontage {storefront.frontageStatus}; entrance {storefront.entranceStatus}. {storefront.notes}
              </p>
            ))}
          </section>
        ) : null}

        <section className="qa-section">
          <h3>Sources</h3>
          {primarySources.map((source) => (
            <p key={source.id}>
              <strong>{source.label}</strong>
              {" | "}
              {source.sourceType}
              {" | "}
              {source.usageStatus}
              {" | reviewed "}
              {source.reviewedOn}
            </p>
          ))}
        </section>

        {sourceEvidence.length ? (
          <section className="qa-section qa-evidence-section">
            <h3>Source Evidence Fixture</h3>
            {sourceEvidence.map((record) => (
              <article className="qa-evidence-record" key={record.id}>
                <p>
                  <strong>{record.sourceLabel}</strong>
                  {" | "}
                  {record.sourceType}
                  {" | "}
                  {record.usageStatus}
                  {" | reviewed "}
                  {record.reviewedOn}
                  {" | "}
                  {formatConfidence(record.confidence)}
                </p>
                <div className="qa-readiness-strip" aria-label="Source evidence readiness">
                  <span>{formatStatusLabel(record.evidenceStrength)}</span>
                  <span>{formatStatusLabel(record.claimReadiness)}</span>
                </div>
                <PromotionGateList gates={record.promotionGates} />
                {record.claimMappings.map((mapping) => (
                  <p key={mapping.claimId}>
                    {mapping.claimType}: {mapping.claimValue}
                    {" | "}
                    {mapping.supportLevel}
                    {" | confidence "}
                    {mapping.confidence}
                  </p>
                ))}
                {getPromotionBlockers(record.promotionGates).length ? (
                  <QAList items={getPromotionBlockers(record.promotionGates).map(formatPromotionBlocker)} />
                ) : null}
                {record.remainingGaps.length ? (
                  <QAList items={record.remainingGaps.slice(0, 2)} />
                ) : null}
              </article>
            ))}
          </section>
        ) : null}

        {draftScene ? (
          <DraftSceneInspector draftScene={draftScene} />
        ) : null}

        {evidenceQualityRecords.length ? (
          <section className="qa-section qa-evidence-section">
            <h3>Readiness Summary</h3>
            {evidenceQualityRecords.map((record) => (
              <p key={record.id}>
                {record.id}: {formatStatusLabel(record.evidenceStrength)} evidence; {formatStatusLabel(record.claimReadiness)} claims; {record.promotionBlockers.length} promotion blocker{record.promotionBlockers.length === 1 ? "" : "s"}
              </p>
            ))}
          </section>
        ) : null}

        {promotionReadinessReport ? (
          <section className="qa-section qa-warning">
            <h3>Grillpoint Missing Evidence Contract</h3>
            <p>
              {promotionReadinessReport.outcome}; product copy ready: {promotionReadinessReport.productCopyReady ? "yes" : "no"}.
            </p>
            <PromotionGateList gates={promotionReadinessReport.currentPromotionGates} />
            {Object.entries(promotionReadinessReport.missingEvidenceContract).map(([claim, contract]) => (
              <div className="qa-contract" key={claim}>
                <p>
                  <strong>{formatStatusLabel(claim)}</strong>
                  {" needs "}
                  {contract.requiredRawInputTypes.join(", ")}
                </p>
                <QAList items={contract.mustNotClaim.slice(0, 3).map((item) => `must not claim ${item}`)} />
              </div>
            ))}
          </section>
        ) : null}

        {qa.overrides.length ? (
          <section className="qa-section qa-warning">
            <h3>Manual Overrides</h3>
            {qa.overrides.map((override) => (
              <p key={override.id}>
                {override.category}: {override.reason}
              </p>
            ))}
          </section>
        ) : null}

        <section className="qa-section">
          <h3>Missing / Ambiguous</h3>
          <QAList items={missingData} />
          <QAList items={ambiguity} />
        </section>

        <section className="qa-section">
          <h3>Blocked Claims</h3>
          <QAList items={blockedClaims} />
          <p>
            unprovenanced claims {qa.sceneQA.unprovenancedRealWorldClaims}; hidden manual fixes {qa.sceneQA.hiddenManualFixes}; verdict {qa.sceneQA.verdict}
          </p>
        </section>
      </div>
    </details>
  );
}

function DraftSceneInspector({ draftScene }) {
  const fields = [
    ["name", "Name"],
    ["addressText", "Address"],
    ["category", "Category"],
    ["frontage", "Frontage / edge"],
    ["buildingFootprint", "Footprint"],
    ["storefrontBay", "Storefront bay"],
    ["signText", "Sign text"],
    ["signPlacement", "Sign placement"],
    ["facadeStyle", "Facade style"],
    ["doorWindowPlacement", "Door/window"],
    ["sceneAnchor", "Scene anchor"],
    ["stationIntersectionCues", "Station/intersection"],
  ];

  return (
    <section className="qa-section qa-draft-scene-section">
      <h3>Draft Scene Lane</h3>
      <p>
        {formatStatusLabel(draftScene.renderingUse.status)}: {draftScene.renderingUse.value}
      </p>
      <div className="qa-status-row" aria-label="Draft field status counts">
        {Object.entries(draftScene.statusCounts)
          .filter(([, count]) => count > 0)
          .map(([status, count]) => (
            <span key={status} data-status={status}>
              {formatStatusLabel(status)} {count}
            </span>
          ))}
      </div>
      {draftScene.generatedScene ? (
        <section className="qa-generated-scene" aria-label="Generated QA scene entities">
          <h4>Generated QA Scene</h4>
          <p>
            {formatStatusLabel(draftScene.generatedScene.status)}
            {" | "}
            {draftScene.generatedScene.generator}
            {" | "}
            {draftScene.generatedScene.entities.length} entities
          </p>
          <dl className="qa-generated-entity-list">
            {draftScene.generatedScene.entities.map((entity) => (
              <div key={entity.id} data-status={entity.status}>
                <dt>{formatStatusLabel(entity.type)}</dt>
                <dd>
                  <strong>{formatStatusLabel(entity.status)}</strong>
                  {" | "}
                  {formatGeneratedEntitySummary(entity)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      <dl className="qa-draft-field-list" aria-label="Draft scene field statuses">
        {fields.map(([fieldName, label]) => {
          const field = draftScene.fields[fieldName];
          if (!field) return null;
          return (
            <div key={fieldName} data-status={field.status}>
              <dt>{label}</dt>
              <dd>
                <strong>{formatStatusLabel(field.status)}</strong>
                {" | "}
                {formatDraftFieldValue(field.value)}
                <small>{field.notes}</small>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

function formatGeneratedEntitySummary(entity) {
  const field = entity.field ? `${formatStatusLabel(entity.field)} field` : "generated field";
  if (entity.type === "field-status-callout") {
    const secondary = entity.secondaryField
      ? `; ${formatStatusLabel(entity.secondaryField)} ${formatStatusLabel(entity.secondaryStatus)}`
      : "";
    return `${field}; visible QA callout "${entity.text}"${secondary}`;
  }
  if (entity.bounds) {
    return `${field}; ${entity.bounds.x},${entity.bounds.y} ${entity.bounds.width}x${entity.bounds.height}`;
  }
  if (entity.point) {
    return `${field}; point ${entity.point.x},${entity.point.y}`;
  }
  if (entity.center) {
    return `${field}; symbolic center ${entity.center.x},${entity.center.y}; ${entity.blockedLabel ?? entity.label}`;
  }
  if (entity.from && entity.to) {
    return `${field}; line ${entity.from.x},${entity.from.y} to ${entity.to.x},${entity.to.y}`;
  }
  return field;
}

function QAList({ items }) {
  return (
    <ul className="qa-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function PromotionGateList({ gates }) {
  return (
    <dl className="qa-gate-list" aria-label="Promotion gates">
      {Object.entries(gates).map(([claim, gate]) => (
        <div key={claim} data-status={gate.status}>
          <dt>{formatStatusLabel(claim)}</dt>
          <dd>
            <strong>{formatStatusLabel(gate.status)}</strong>
            {gate.neededEvidence ? `: ${gate.neededEvidence}` : ""}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function getPromotionBlockers(gates) {
  return Object.entries(gates)
    .filter(([, gate]) => gate.status !== "allowed")
    .map(([claim, gate]) => ({
      claim,
      status: gate.status,
      neededEvidence: gate.neededEvidence,
    }));
}

function formatPromotionBlocker(blocker) {
  return `${formatStatusLabel(blocker.claim)} ${formatStatusLabel(blocker.status)}: ${blocker.neededEvidence}`;
}

function formatStatusLabel(value) {
  return value.replaceAll("_", " ").replace(/([a-z])([A-Z])/g, "$1 $2");
}

function formatConfidence(confidence) {
  if (!confidence) return "unknown";
  return `${confidence.value}: ${confidence.rationale}`;
}

function formatScenePoint(point) {
  if (!point) return "unresolved";
  return `${point.x}, ${point.y} (${point.layer ?? "scene"})`;
}

function formatDraftFieldValue(value) {
  if (value === null || value === undefined) return "unknown";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value.sceneBounds) {
    const { x, y, width, height } = value.sceneBounds;
    return `${x}, ${y}, ${width}x${height}`;
  }
  if (value.marker) return `${value.cornerId}: ${value.marker.x}, ${value.marker.y}`;
  return JSON.stringify(value);
}
