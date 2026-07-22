import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildIIMapStyle, GREENPOINT_CENTER, GREENPOINT_MAX_BOUNDS } from "./iiMapStyle.js";
import { pinKind } from "./filterCards.js";
import { EVENTS, trackEvent } from "./trackEvents.js";

// Track V — the 2D II-C map. Thin component: style comes from iiMapStyle.js,
// pin classification from filterCards.js; markers are DOM elements styled in
// july.css. No Three.js, no app state beyond props.
export default function MapView({ cards, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
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
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // Compact attribution starts collapsed (just the ⓘ) — MapLibre auto-opens
    // it on load, which covers the map's bottom edge.
    map.once("load", () => {
      const attrib = containerRef.current?.querySelector(".maplibregl-ctrl-attrib");
      attrib?.classList.remove("maplibregl-compact-show");
      attrib?.removeAttribute("open");
      // Insurance against init racing layout: twice in the 2026-07-22 UX eval
      // the canvas froze at its pre-layout size until a viewport resize.
      map.resize();
    });

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

  // Sync markers with the filtered card set + selection.
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
      if (card.lat == null) continue;
      const el = document.createElement("button");
      el.type = "button";
      el.className = `ii-pin ii-pin--${pinKind(card)}${card.id === selectedId ? " is-selected" : ""}`;
      // Venue + card title, like the venue dots below — venue alone left screen
      // readers with seven identical "Troost" buttons (UX eval, F10).
      el.setAttribute(
        "aria-label",
        card.locationName === card.title ? card.title : `${card.locationName} — ${card.title}`,
      );
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        trackEvent(EVENTS.PIN_TAP, { cardId: card.id, kind: pinKind(card) });
        onSelect(card.id);
      });
      const label = document.createElement("span");
      label.className = "ii-pin-label";
      label.textContent = card.locationName;
      el.appendChild(label);
      addMarker([card.lng, card.lat], el);
    }
  }, [cards, selectedId, onSelect]);

  // Ease to the selected card.
  useEffect(() => {
    const card = cards.find((c) => c.id === selectedId);
    if (card?.lat != null) {
      mapRef.current?.easeTo({ center: [card.lng, card.lat], duration: 500 });
    }
  }, [selectedId, cards]);

  return <div ref={containerRef} className="july-map" aria-label="Map of Greenpoint" />;
}
