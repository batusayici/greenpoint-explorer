import React, { useMemo, useState, useCallback } from "react";
import seed from "../data/demand-test/july-2026-cards.json";
import { matchesFilter, isActiveOn } from "./filterCards.js";
import MapView from "./MapView.jsx";
import CardPanel from "./CardPanel.jsx";

// Track V — "July in Greenpoint + G-Train Support". Standalone 2D demand-test
// page; must never import the 3D runtime.
export default function JulyApp() {
  const [filter, setFilter] = useState("all");
  const [todayOnly, setTodayOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const visible = useMemo(() => {
    const now = new Date();
    return seed.cards
      .filter((c) => matchesFilter(c, filter))
      .filter((c) => !todayOnly || isActiveOn(c, now));
  }, [filter, todayOnly]);

  const onFilter = useCallback((id) => {
    setFilter(id);
    setSelectedId((sel) => {
      const still = seed.cards.find((c) => c.id === sel && matchesFilter(c, id));
      return still ? sel : null;
    });
  }, []);

  return (
    <div className="july-shell">
      <header className="july-header">
        <div className="july-header-text">
          <span className="july-kicker">Greenpoint Explorer</span>
          <h1>July in Greenpoint</h1>
          <p>New spots, what&rsquo;s on, and how to support local through the G-train closures &mdash; mapped.</p>
        </div>
      </header>
      <div className="july-gbanner" role="status">
        <span className="july-gbadge">G</span>
        <span>
          <strong>No G trains</strong> Fri Jul 10 9:45 PM &rarr; Mon Jul 13 5 AM, plus overnights Jul 13&ndash;17
          &middot; Greenpoint Av + Nassau Av &middot; free T403 shuttle
        </span>
      </div>
      <main className="july-main">
        <CardPanel
          cards={visible}
          filter={filter}
          onFilter={onFilter}
          todayOnly={todayOnly}
          onToday={setTodayOnly}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <MapView cards={visible} selectedId={selectedId} onSelect={setSelectedId} />
      </main>
    </div>
  );
}
