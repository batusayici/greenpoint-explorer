import React, { useMemo, useState, useCallback, useEffect } from "react";
import seed from "../data/demand-test/july-2026-cards.json";
import { matchesFilter, isActiveOn, sortTodayFirst, isExpiredDeal } from "./filterCards.js";
import { EVENTS, trackEvent, onEvent } from "./trackEvents.js";
import { createPostValueGate, POST_VALUE_DONE_KEY } from "./postValue.js";
import MapView from "./MapView.jsx";
import CardPanel from "./CardPanel.jsx";

const CARDS_BY_ID = new Map(seed.cards.map((c) => [c.id, c]));

// Track V — "July in Greenpoint + G-Train Support". Standalone 2D demand-test
// page; must never import the 3D runtime.
export default function JulyApp() {
  const [filter, setFilter] = useState("all");
  const [todayOnly, setTodayOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  // Post-value email prompt (limited launch): observe the tap stream and offer
  // the weekly signup once, only after value is demonstrated (2nd card open or
  // 1st action tap). localStorage makes "once" mean once per browser, not per
  // load — signing up or dismissing both spend it.
  useEffect(() => {
    let done = false;
    try {
      done = localStorage.getItem(POST_VALUE_DONE_KEY) != null;
    } catch {
      /* storage blocked: prompt at most once per load */
    }
    const gate = createPostValueGate({ done });
    return onEvent((name) => {
      if (gate.record(name)) setShowSignupPrompt(true);
    });
  }, []);

  const onSignupPromptDone = useCallback(() => {
    setShowSignupPrompt(false);
    try {
      localStorage.setItem(POST_VALUE_DONE_KEY, new Date().toISOString());
    } catch {
      /* storage blocked */
    }
  }, []);

  const visible = useMemo(() => {
    const now = new Date();
    const shown = seed.cards
      .filter((c) => !isExpiredDeal(c, now))
      .filter((c) => matchesFilter(c, filter))
      .filter((c) => !todayOnly || isActiveOn(c, now));
    return sortTodayFirst(shown, now);
  }, [filter, todayOnly]);

  const onFilter = useCallback((id) => {
    setFilter(id);
    setSelectedId((sel) => {
      const still = seed.cards.find((c) => c.id === sel && matchesFilter(c, id));
      return still ? sel : null;
    });
  }, []);

  // Place-graph traversal: tapping a related chip must always land somewhere
  // visible, so widen the lens if the target card is filtered out right now.
  const onRelated = useCallback(
    (fromCardId, toCardId) => {
      const target = CARDS_BY_ID.get(toCardId);
      if (!target) return;
      trackEvent(EVENTS.RELATED_TAP, { fromCardId, toCardId });
      if (!matchesFilter(target, filter)) setFilter("all");
      if (todayOnly && !isActiveOn(target, new Date())) setTodayOnly(false);
      setSelectedId(toCardId);
    },
    [filter, todayOnly],
  );

  return (
    <div className="july-shell">
      <header className="july-header">
        <div className="july-header-text">
          <span className="july-kicker">Greenpoint Explorer</span>
          <h1>July in Greenpoint</h1>
          {/* Leads with time + action, not directory-speak (tester feedback
              2026-07-08: "what's different from Google Maps?") */}
          <p>
            What&rsquo;s happening near you this week &mdash; and how to support local through the
            G-train closures. Every business on this map is locally owned.
          </p>
        </div>
      </header>
      <div className="july-gbanner" role="status">
        <span className="july-gbadge">G</span>
        <span>
          <strong>No G trains overnight</strong> 9:45 PM&ndash;5 AM through Fri Jul 17
          &middot; Greenpoint Av + Nassau Av &middot; free T403 shuttle
        </span>
      </div>
      <main className="july-main">
        <CardPanel
          cards={visible}
          cardsById={CARDS_BY_ID}
          filter={filter}
          onFilter={onFilter}
          todayOnly={todayOnly}
          onToday={setTodayOnly}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRelated={onRelated}
          showSignupPrompt={showSignupPrompt}
          onSignupPromptDone={onSignupPromptDone}
        />
        <MapView cards={visible} selectedId={selectedId} onSelect={setSelectedId} />
      </main>
    </div>
  );
}
