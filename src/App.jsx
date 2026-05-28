import { useState } from "react";
import { placeholderScene } from "./placeholderScene.js";
import PlaceholderWorld from "./PlaceholderWorld.jsx";

export default function App() {
  const [hoveredTargetId, setHoveredTargetId] = useState(null);
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const target = placeholderScene.target;
  const isSelected = selectedTargetId === target.id;

  return (
    <main className="prototype-shell" aria-label="Greenpoint Explorer prototype shell">
      <section className="world-panel" aria-label="Placeholder authored scene">
        <div className="panel-topline">
          <div>
            <p className="kicker">Prototype scaffold</p>
            <h1>{placeholderScene.title}</h1>
          </div>
          <p className="placeholder-note">{placeholderScene.note}</p>
        </div>

        <div className="viewport-frame">
          <PlaceholderWorld
            scene={placeholderScene}
            selectedTargetId={selectedTargetId}
            hoveredTargetId={hoveredTargetId}
            onHoverTarget={setHoveredTargetId}
            onSelectTarget={setSelectedTargetId}
          />

          {isSelected ? (
            <aside className="selected-card" aria-live="polite">
              <button
                className="icon-button"
                type="button"
                aria-label="Close placeholder card"
                onClick={() => setSelectedTargetId(null)}
              >
                <span aria-hidden="true">x</span>
              </button>
              <p className="card-label">{target.label}</p>
              <h2>{target.title}</h2>
              <p className="card-category">{target.category}</p>
              <p>{target.description}</p>
            </aside>
          ) : null}
        </div>
      </section>
    </main>
  );
}
