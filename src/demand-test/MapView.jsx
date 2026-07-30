import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildIIMapStyle, GREENPOINT_CENTER, GREENPOINT_MAX_BOUNDS } from "./iiMapStyle.js";
import { pinKind } from "./filterCards.js";
import { groupByLocation } from "./mapPins.js";
import { EVENTS, trackEvent } from "./trackEvents.js";

// Track V — the 2D II-C map. Thin component: style comes from iiMapStyle.js,
// pin classification from filterCards.js, stacking from mapPins.js; markers
// are DOM elements styled in july.css. No Three.js, no app state beyond props.

// A stack's pin takes the majority category so mixed venues (7 shows + the
// venue card) still read as what they mostly are; first-seen wins ties.
function stackKind(cards) {
  const tally = new Map();
  for (const c of cards) {
    const k = pinKind(c);
    tally.set(k, (tally.get(k) ?? 0) + 1);
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

// Tapping a multi-card pin focuses the FEED on that location (2026-07-23,
// Batu: the fan-out cluttered an already dense mobile map); onFocusLocation
// receives the group, or null when the bare map is tapped.
export default function MapView({ cards, selectedId, focusKey, onSelect, onFocusLocation }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  // The bare-map click handler is bound once at mount; the ref keeps it
  // pointed at the current callback.
  const onFocusLocationRef = useRef(onFocusLocation);
  useEffect(() => {
    onFocusLocationRef.current = onFocusLocation;
  });
  // Latest card set for framing (initial fit + refits on container resize) —
  // filter changes must not re-frame the camera, so fits read this ref
  // instead of depending on `cards`.
  const cardsRef = useRef(cards);
  useEffect(() => {
    cardsRef.current = cards;
  });
  // Once the reader takes the camera (drag/zoom, or a selection pan), resizes
  // stop re-framing — their view is theirs.
  const cameraTakenRef = useRef(false);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildIIMapStyle(),
      center: GREENPOINT_CENTER,
      zoom: 14.1,
      minZoom: 12.8,
      maxZoom: 17.5,
      maxBounds: GREENPOINT_MAX_BOUNDS,
      attributionControl: { compact: true },
      // cooperativeGestures tried (F2-A) and removed 2026-07-23: two-finger
      // pan broke thumb-only use, and the 25vh peek + page-flow layout
      // removed the swipe trap it existed to solve.
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // Compact attribution must stay collapsed (just the ⓘ): MapLibre re-opens
    // it whenever source attributions update — at load AND after camera moves
    // pull new tiles — covering the map's bottom edge (worst on the mobile
    // peek). A permanent observer closes every auto-open; a recent tap on the
    // control marks an open as user-intended and is left alone.
    const attribEl = () => containerRef.current?.querySelector(".maplibregl-ctrl-attrib");
    const collapseAttrib = () => {
      const attrib = attribEl();
      attrib?.classList.remove("maplibregl-compact-show");
      attrib?.removeAttribute("open");
    };
    let attribObserver;
    let userToggleUntil = 0;
    map.once("load", () => {
      collapseAttrib();
      const attrib = attribEl();
      if (attrib) {
        attrib.addEventListener("click", () => {
          userToggleUntil = Date.now() + 15000;
        });
        attribObserver = new MutationObserver(() => {
          if (Date.now() > userToggleUntil && attrib.classList.contains("maplibregl-compact-show")) {
            collapseAttrib();
          }
        });
        attribObserver.observe(attrib, { attributes: true, attributeFilter: ["class", "open"] });
      }
      // Insurance against init racing layout: twice in the 2026-07-22 UX eval
      // the canvas froze at its pre-layout size until a viewport resize.
      map.resize();
    });

    // Tapping bare map clears any location focus.
    map.on("click", () => onFocusLocationRef.current?.(null));

    // Open framed on the actual pin extent (not a fixed center), so the
    // neighborhood — not the river — fills the first view at any aspect.
    const fitToPins = () => {
      const pts = [];
      for (const card of cardsRef.current) {
        if (card.lat != null) pts.push([card.lng, card.lat]);
        for (const v of card.venues ?? []) if (v.lat != null) pts.push([v.lng, v.lat]);
      }
      if (pts.length === 0) return;
      const bounds = pts.reduce(
        (b, p) => b.extend(p),
        new maplibregl.LngLatBounds(pts[0], pts[0]),
      );
      // Padding scales with the container so the 203px mobile peek never gets
      // asked for 112px of vertical padding it doesn't have.
      const el = containerRef.current;
      const pad = Math.max(24, Math.min(56, Math.floor(Math.min(el.clientWidth, el.clientHeight) / 6)));
      map.fitBounds(bounds, { padding: pad, animate: false });
    };
    fitToPins();

    // Re-frame on container resize until the reader takes the camera (crit
    // round 2, #3): the mount-only fit left a rotated phone or resized window
    // holding the old framing — measured 5 of 53 pins offscreen after a
    // resize. A drag/zoom (or a selection pan, marked in the effect below)
    // makes the view theirs and resizes stop touching it.
    const markTaken = (e) => {
      if (e.originalEvent) cameraTakenRef.current = true;
    };
    map.on("dragstart", markTaken);
    map.on("zoomstart", markTaken);
    map.on("resize", () => {
      if (!cameraTakenRef.current) fitToPins();
    });

    // Far-zoom pin size (crit round 2, #4): below 14.2 the container carries
    // .july-map--far and pins render 14px — cluster discs stay readable.
    const applyZoomClass = () => {
      containerRef.current?.classList.toggle("july-map--far", map.getZoom() < 14.2);
    };
    map.on("zoom", applyZoomClass);
    map.on("resize", applyZoomClass);
    applyZoomClass();

    mapRef.current = map;
    if (import.meta.env.DEV) window.__iiMap = map; // debug handle, dev only
    return () => {
      attribObserver?.disconnect();
      map.remove();
    };
  }, []);

  // Sync markers with the filtered card set + selection + focus state.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    const addMarker = (lngLat, el) => {
      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat(lngLat)
        .addTo(map);
      markersRef.current.push(marker);
    };

    for (const card of cards) {
      for (const v of card.venues ?? []) {
        if (v.lat == null) continue; // unresolved venue: listed on the card, not mapped
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "ii-venue-dot";
        dot.setAttribute("aria-label", `${v.name} (${card.title})`);
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          trackEvent(EVENTS.PIN_TAP, { cardId: card.id, kind: "venue" });
          onSelect(card.id);
        });
        addMarker([v.lng, v.lat], dot);
      }
    }

    for (const group of groupByLocation(cards)) {
      const { key, lat, lng, cards: stack } = group;
      const single = stack.length === 1;
      const kind = single ? pinKind(stack[0]) : stackKind(stack);
      const active = stack.some((c) => c.id === selectedId) || key === focusKey;
      const el = document.createElement("button");
      el.type = "button";
      el.className = `ii-pin ii-pin--${kind}${active ? " is-selected" : ""}`;
      const name = stack[0].locationName;
      el.setAttribute(
        "aria-label",
        single
          ? name === stack[0].title
            ? stack[0].title
            : `${name} — ${stack[0].title}`
          : `${name} — show its ${stack.length} cards in the list`,
      );
      const label = document.createElement("span");
      label.className = "ii-pin-label";
      label.textContent = name;
      el.appendChild(label);
      // No count badge (2026-07-23, Batu: numbers on the map add cognitive
      // load, not value) — the aria-label still carries the count.
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        // Every pin tap focuses the feed on its location (2026-07-23, Batu's
        // #4): single-card pins also auto-open their card (JulyApp). Tapping
        // the focused pin again shows everything.
        trackEvent(
          EVENTS.PIN_TAP,
          single
            ? { cardId: stack[0].id, kind }
            : { cardId: stack[0].id, kind: "stack", count: stack.length },
        );
        onFocusLocation(key === focusKey ? null : group);
      });
      addMarker([lng, lat], el);
    }
  }, [cards, selectedId, focusKey, onSelect, onFocusLocation]);

  // Ease to the selected card — instantly under prefers-reduced-motion
  // (punch list P2 #10: this was the one unguarded animation).
  useEffect(() => {
    const card = cards.find((c) => c.id === selectedId);
    if (card?.lat != null) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      cameraTakenRef.current = true; // a centered card must survive a resize
      mapRef.current?.easeTo({ center: [card.lng, card.lat], duration: reduce ? 0 : 500 });
    }
  }, [selectedId, cards]);

  return <div ref={containerRef} className="july-map" aria-label="Map of Greenpoint" />;
}
