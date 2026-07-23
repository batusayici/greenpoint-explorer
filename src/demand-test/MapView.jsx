import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildIIMapStyle, GREENPOINT_CENTER, GREENPOINT_MAX_BOUNDS } from "./iiMapStyle.js";
import { pinKind } from "./filterCards.js";
import { groupByLocation, fanOffsets } from "./mapPins.js";
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

export default function MapView({ cards, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  // Fan-out (UX eval F1-A): the location key whose stack is spread open.
  const [expandedKey, setExpandedKey] = useState(null);
  // Snapshot of the mount-time card set for the initial fitBounds only —
  // later filter changes must not re-frame the camera.
  const initialCardsRef = useRef(cards);

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
      // On phones the map led the page and ate every one-finger swipe (UX
      // eval F2, decision A): one finger scrolls the page, two pan the map.
      cooperativeGestures: window.matchMedia("(max-width: 760px)").matches,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // Compact attribution starts collapsed (just the ⓘ) — MapLibre auto-opens
    // it on load, which covers the map's bottom edge. The auto-open can land
    // after "load" (seen expanded over the mobile peek), so collapse again on
    // the first "idle".
    const collapseAttrib = () => {
      const attrib = containerRef.current?.querySelector(".maplibregl-ctrl-attrib");
      attrib?.classList.remove("maplibregl-compact-show");
      attrib?.removeAttribute("open");
    };
    map.once("load", () => {
      collapseAttrib();
      // Insurance against init racing layout: twice in the 2026-07-22 UX eval
      // the canvas froze at its pre-layout size until a viewport resize.
      map.resize();
    });
    map.once("idle", collapseAttrib);

    // Tapping bare map closes any open fan.
    map.on("click", () => setExpandedKey(null));

    // Open framed on the actual pin extent (not a fixed center), so the
    // neighborhood — not the river — fills the first view at any aspect.
    const pts = [];
    for (const card of initialCardsRef.current) {
      if (card.lat != null) pts.push([card.lng, card.lat]);
      for (const v of card.venues ?? []) if (v.lat != null) pts.push([v.lng, v.lat]);
    }
    if (pts.length > 0) {
      const bounds = pts.reduce(
        (b, p) => b.extend(p),
        new maplibregl.LngLatBounds(pts[0], pts[0]),
      );
      map.fitBounds(bounds, { padding: 56, animate: false });
    }

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // A filter change rebuilds the pin set — any open fan closes with it.
  useEffect(() => {
    setExpandedKey(null);
  }, [cards]);

  // Sync markers with the filtered card set + selection + fan state.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    const addMarker = (lngLat, el, offset = [0, 0]) => {
      const marker = new maplibregl.Marker({ element: el, anchor: "center", offset })
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
      const hasSelected = stack.some((c) => c.id === selectedId);
      const el = document.createElement("button");
      el.type = "button";
      el.className = `ii-pin ii-pin--${kind}${hasSelected ? " is-selected" : ""}`;
      const name = stack[0].locationName;
      el.setAttribute(
        "aria-label",
        single
          ? name === stack[0].title
            ? stack[0].title
            : `${name} — ${stack[0].title}`
          : `${name} — ${stack.length} cards, tap to spread them`,
      );
      const label = document.createElement("span");
      label.className = "ii-pin-label";
      label.textContent = name;
      el.appendChild(label);
      if (!single) {
        const count = document.createElement("span");
        count.className = "ii-pin-count";
        count.textContent = String(stack.length);
        el.appendChild(count);
      }
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (single) {
          trackEvent(EVENTS.PIN_TAP, { cardId: stack[0].id, kind });
          onSelect(stack[0].id);
        } else {
          trackEvent(EVENTS.PIN_TAP, { cardId: stack[0].id, kind: "stack", count: stack.length });
          setExpandedKey((k) => (k === key ? null : key));
        }
      });
      addMarker([lng, lat], el);

      // Fan-out: each card in the open stack gets its own tappable satellite,
      // as a MapLibre pixel offset so everything stays geo-anchored.
      if (!single && expandedKey === key) {
        const offs = fanOffsets(stack.length);
        stack.forEach((c, i) => {
          const sat = document.createElement("button");
          sat.type = "button";
          sat.className = `ii-pin ii-pin--sat ii-pin--${pinKind(c)}${c.id === selectedId ? " is-selected" : ""}`;
          sat.setAttribute("aria-label", c.title);
          const satLabel = document.createElement("span");
          satLabel.className = "ii-pin-label";
          satLabel.textContent = c.title;
          sat.appendChild(satLabel);
          sat.addEventListener("click", (e) => {
            e.stopPropagation();
            trackEvent(EVENTS.PIN_TAP, { cardId: c.id, kind: pinKind(c) });
            onSelect(c.id);
          });
          addMarker([lng, lat], sat, offs[i]);
        });
      }
    }
  }, [cards, selectedId, onSelect, expandedKey]);

  // Ease to the selected card.
  useEffect(() => {
    const card = cards.find((c) => c.id === selectedId);
    if (card?.lat != null) {
      mapRef.current?.easeTo({ center: [card.lng, card.lat], duration: 500 });
    }
  }, [selectedId, cards]);

  return <div ref={containerRef} className="july-map" aria-label="Map of Greenpoint" />;
}
