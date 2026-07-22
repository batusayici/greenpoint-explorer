import React, { useMemo, useState, useCallback, useEffect } from "react";
import seed from "../data/demand-test/july-2026-cards.json";
import { matchesFilter, isActiveOn, sortTodayFirst, isExpiredCard, groupByDay } from "./filterCards.js";
import { EVENTS, trackEvent, onEvent } from "./trackEvents.js";
import { GTRAIN_WINDOW, bannerPhase } from "./gtrainBanner.js";
import { createPostValueGate, POST_VALUE_DONE_KEY } from "./postValue.js";
import { cardIdFromPath, deepLinkUrl } from "./deepLink.js";
import MapView from "./MapView.jsx";
import CardPanel from "./CardPanel.jsx";

const CARDS_BY_ID = new Map(seed.cards.map((c) => [c.id, c]));

// Deep link (/e/<slug>): open that card on load if it's live; expired or
// unknown slugs fall back to the plain feed (the URL normalizes to / below).
function initialSelectedId() {
  const id = cardIdFromPath(window.location.pathname);
  const card = id != null ? CARDS_BY_ID.get(id) : undefined;
  return card && !isExpiredCard(card, new Date()) ? card.id : null;
}

// Track V — "July in Greenpoint + G-Train Support". Standalone 2D demand-test
// page; must never import the 3D runtime.
export default function JulyApp() {
  const [filter, setFilter] = useState("all");
  const [todayOnly, setTodayOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  // Keep the address bar on the card's shareable path (?src= rides along).
  // replaceState, not pushState: back should leave the page, not unwind taps.
  useEffect(() => {
    window.history.replaceState(null, "", deepLinkUrl(selectedId, window.location.search));
  }, [selectedId]);

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

  // Computed per render, not memoized — the banner must flip phase on the
  // day boundaries even in a long-lived tab.
  const gtrainPhase = bannerPhase(new Date());

  const { visible, groups } = useMemo(() => {
    const now = new Date();
    const shown = seed.cards
      .filter((c) => !isExpiredCard(c, now))
      .filter((c) => matchesFilter(c, filter))
      .filter((c) => !todayOnly || isActiveOn(c, now));
    // Map keeps the flat set; the list scans as a calendar (day groups).
    return { visible: sortTodayFirst(shown, now), groups: groupByDay(shown, now) };
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
          <h1>Greenpoint Life</h1>
          {/* Leads with time + action, not directory-speak (tester feedback
              2026-07-08: "what's different from Google Maps?") */}
          <p>
            What&rsquo;s happening near you this week &mdash; and how to support local through the
            G-train closures. Every business on this map is locally owned.
          </p>
        </div>
      </header>
      {gtrainPhase != null && (
        <div className="july-gbanner" role="status">
          <span className="july-gbadge">G</span>
          <span>
            <strong>{gtrainPhase === "active" ? "No G trains" : "Next G closure"}</strong>{" "}
            {GTRAIN_WINDOW.dates} &middot; {GTRAIN_WINDOW.stops} &middot; {GTRAIN_WINDOW.shuttle}
          </span>
        </div>
      )}
      <main className="july-main">
        <CardPanel
          groups={groups}
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
