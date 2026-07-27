import React, { useMemo, useState, useCallback, useEffect } from "react";
import seed from "../data/demand-test/cards.json";
import { matchesFilter, sortTodayFirst, isExpiredCard, groupByDay, liveFilterCounts } from "./filterCards.js";
import { EVENTS, trackEvent, onEvent } from "./trackEvents.js";
import { GTRAIN_WINDOW, bannerPhase } from "./gtrainBanner.js";
import { activeCommunityAlert } from "./communityAlert.js";
import { bannerSlot } from "./bannerSlot.js";
import { createPostValueGate, POST_VALUE_DONE_KEY } from "./postValue.js";
import { resolveDeepLink, deepLinkUrl } from "./deepLink.js";
import { editionLabel } from "./eventWindow.js";
import MapView from "./MapView.jsx";
import CardPanel from "./CardPanel.jsx";

const CARDS_BY_ID = new Map(seed.cards.map((c) => [c.id, c]));

// Deep link (/e/<slug>): open that card on load if it's live. A dead link
// (expired or unknown) falls back to the plain feed WITH a notice — the
// person who clicked a friend's link must not wonder what happened (Q1-A).
function initialDeepLink() {
  return resolveDeepLink(window.location.pathname, CARDS_BY_ID, new Date());
}

// Track V — "July in Greenpoint + G-Train Support". Standalone 2D demand-test
// page; must never import the 3D runtime.
export default function JulyApp() {
  const [filter, setFilter] = useState("all");
  const [{ id: initialId, dead: deadLink }] = useState(initialDeepLink);
  const [selectedId, setSelectedId] = useState(initialId);
  const [showDeadLinkNotice, setShowDeadLinkNotice] = useState(deadLink);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  // Mobile map peek (UX eval F3, decision B): the list owns the first screen;
  // the map starts compact and grows on request. Desktop ignores this.
  const [mapExpanded, setMapExpanded] = useState(false);
  // Location focus (2026-07-23): tapping a multi-card pin filters the FEED to
  // that location — the fan-out it replaces cluttered the dense mobile map.
  // { key, name, count, ids:Set }
  const [pinFocus, setPinFocus] = useState(null);

  // Chip-fold input (F16-B): live counts per layer, fixed at mount — they only
  // drift at expiry boundaries, and the bar must not reshuffle mid-session.
  const [filterCounts] = useState(() => liveFilterCounts(seed.cards, new Date()));

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

  // Escape closes the open card (UX eval, F27).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Computed per render, not memoized — the banner must flip phase on the
  // day boundaries even in a long-lived tab.
  const gtrainPhase = bannerPhase(new Date());
  const communityAlert = activeCommunityAlert(new Date(), CARDS_BY_ID);
  // One banner at a time (2026-07-26): most consequential takes the slot.
  // The feed pin below stays tied to communityAlert, not the slot — the
  // campaign keeps its feed elevation even when a closure holds the banner.
  const slot = bannerSlot(gtrainPhase, communityAlert);

  const { visible, groups } = useMemo(() => {
    const now = new Date();
    const live = seed.cards.filter((c) => !isExpiredCard(c, now));
    const shown = live.filter((c) => matchesFilter(c, filter));
    // Map keeps the flat set (full context even while focused); the list
    // scans as a calendar (day groups), narrowed to the focused location.
    const feed = pinFocus ? live.filter((c) => pinFocus.ids.has(c.id)) : shown;
    return { visible: sortTodayFirst(shown, now), groups: groupByDay(feed, now, communityAlert?.cardId ?? null) };
  }, [filter, pinFocus, communityAlert?.cardId]);

  const onFilter = useCallback((id) => {
    setPinFocus(null); // any chip tap exits location focus
    setFilter(id);
    setSelectedId((sel) => {
      const still = seed.cards.find((c) => c.id === sel && matchesFilter(c, id));
      return still ? sel : null;
    });
  }, []);

  // Pin tap (from MapView): focus the feed on that location. The chip bar
  // resets to All so the bar never lies about what the feed shows — the
  // focus row in the panel announces the narrowing. A single-card location
  // also opens its card (a one-row feed of closed cards helps nobody).
  const onFocusLocation = useCallback((group) => {
    if (!group) {
      setPinFocus(null);
      return;
    }
    setFilter("all");
    setSelectedId(group.cards.length === 1 ? group.cards[0].id : null);
    setPinFocus({
      key: group.key,
      name: group.cards[0].locationName,
      count: group.cards.length,
      ids: new Set(group.cards.map((c) => c.id)),
    });
  }, []);

  // Reveal = land the card in the visible feed no matter the current lens:
  // exit location focus, widen the filter if it hides the target. Shared by
  // related-chip taps and the community-alert banner.
  const revealCard = useCallback(
    (cardId) => {
      const target = CARDS_BY_ID.get(cardId);
      if (!target) return;
      setPinFocus(null);
      if (!matchesFilter(target, filter)) setFilter("all");
      setSelectedId(cardId);
    },
    [filter],
  );

  // Place-graph traversal: tapping a related chip must always land somewhere
  // visible, so widen the lens if the target card is filtered out right now.
  const onRelated = useCallback(
    (fromCardId, toCardId) => {
      if (!CARDS_BY_ID.has(toCardId)) return;
      trackEvent(EVENTS.RELATED_TAP, { fromCardId, toCardId });
      revealCard(toCardId);
    },
    [revealCard],
  );

  const onAlertTap = useCallback(() => {
    trackEvent(EVENTS.ALERT_TAP, { cardId: communityAlert.cardId });
    revealCard(communityAlert.cardId);
  }, [communityAlert?.cardId, revealCard]);

  return (
    <div className="july-shell">
      <header className="july-header">
        <div className="july-header-text">
          {/* One brand only (Q4-B): the kicker slot carries the edition week —
              a freshness signal, computed per render like the banner phase. */}
          <span className="july-kicker">{editionLabel(new Date())}</span>
          <h1>Greenpoint Life</h1>
          {/* Names the content types + the verification stake (2026-07-26:
              de-centered from the G closures; max 2 lines on mobile). */}
          <p>Your week in Greenpoint, verified: events, openings, deals, and neighborhood news.</p>
        </div>
      </header>
      {/* ONE banner (bannerSlot precedence, 2026-07-26). G prominence still
          follows proximity (UX eval F24, decision A); the G status stays a
          plain status, not a control (2026-07-23). */}
      {slot?.kind === "gtrain" && slot.phase === "distant" && (
        <div className="july-gbanner july-gbanner--compact" role="status">
          <span className="july-gbadge">G</span>
          <span>
            <strong>G closure {GTRAIN_WINDOW.shortDates}</strong> &middot; {GTRAIN_WINDOW.shuttle}
          </span>
        </div>
      )}
      {slot?.kind === "gtrain" && (slot.phase === "near" || slot.phase === "active") && (
        <div className="july-gbanner" role="status">
          <span className="july-gbadge">G</span>
          <span>
            <strong>{slot.phase === "active" ? "No G trains" : "Next G closure"}</strong>{" "}
            {GTRAIN_WINDOW.dates} &middot; {GTRAIN_WINDOW.stops} &middot; {GTRAIN_WINDOW.shuttle}
          </span>
        </div>
      )}
      {/* Community alert (DECISION_LOG 2026-07-26): the slot's rare
          "neighborhood needs you" tier — sourced, time-bound, one at a time,
          and a control, not a status: it deep-opens the sourced card. */}
      {slot?.kind === "community" && (
        <button type="button" className="july-cbanner" onClick={onAlertTap}>
          <span className="july-gbadge july-cbadge">&hearts;</span>
          <span className="july-cbanner-text">
            <strong>{slot.alert.headline}</strong>
            <span className="july-cbanner-detail"> &middot; {slot.alert.detail}</span>
          </span>
          <span className="july-cbanner-cta">{slot.alert.cta} &rarr;</span>
        </button>
      )}
      <main className="july-main">
        <CardPanel
          groups={groups}
          cardsById={CARDS_BY_ID}
          deadLinkNotice={showDeadLinkNotice}
          onDismissDeadLink={() => setShowDeadLinkNotice(false)}
          filter={filter}
          onFilter={onFilter}
          filterCounts={filterCounts}
          focus={pinFocus}
          onClearFocus={() => setPinFocus(null)}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRelated={onRelated}
          showSignupPrompt={showSignupPrompt}
          onSignupPromptDone={onSignupPromptDone}
        />
        <div className={`july-mapzone${mapExpanded ? " is-expanded" : ""}`}>
          <MapView
            cards={visible}
            selectedId={selectedId}
            focusKey={pinFocus?.key ?? null}
            onSelect={setSelectedId}
            onFocusLocation={onFocusLocation}
          />
          <button
            type="button"
            className="july-mapexpand"
            aria-pressed={mapExpanded}
            aria-label={mapExpanded ? "Shrink map" : "Expand map"}
            onClick={() => setMapExpanded((x) => !x)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {mapExpanded ? (
                <path d="M6.5 2.5v4h-4M9.5 2.5v4h4M6.5 13.5v-4h-4M9.5 13.5v-4h4" />
              ) : (
                <path d="M2.5 6.5v-4h4M13.5 6.5v-4h-4M2.5 9.5v4h4M13.5 9.5v4h-4" />
              )}
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
