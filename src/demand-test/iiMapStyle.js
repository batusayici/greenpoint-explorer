// Track V — II-C MapLibre style. Pure module (Node-importable, no maplibre
// import): builds the style JSON from MAP_PALETTE tokens so the 2D real map
// carries the inked identity. Tiles: OpenFreeMap (OpenMapTiles schema, no key).
import { MAP_PALETTE } from "../visualSystem/palette.js";

export const cssHex = (token) => `#${token.toString(16).padStart(6, "0")}`;

export const GREENPOINT_CENTER = [-73.9538, 40.7295];
// Hard pan limit: Greenpoint + a comfortable margin (never lets the tester get lost).
export const GREENPOINT_MAX_BOUNDS = [
  [-74.005, 40.705],
  [-73.905, 40.755],
];

const c = Object.fromEntries(
  Object.entries(MAP_PALETTE).map(([k, v]) => [k, cssHex(v)]),
);

export function buildIIMapStyle() {
  return {
    version: 8,
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    sources: {
      openfreemap: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": c.land } },
      {
        id: "park",
        type: "fill",
        source: "openfreemap",
        "source-layer": "landcover",
        filter: ["in", ["get", "class"], ["literal", ["grass", "wood", "park", "recreation_ground"]]],
        paint: { "fill-color": c.park },
      },
      {
        id: "landuse-park",
        type: "fill",
        source: "openfreemap",
        "source-layer": "landuse",
        filter: ["in", ["get", "class"], ["literal", ["park", "cemetery", "pitch", "playground", "stadium"]]],
        paint: { "fill-color": c.park },
      },
      {
        id: "water",
        type: "fill",
        source: "openfreemap",
        "source-layer": "water",
        paint: { "fill-color": c.water },
      },
      {
        id: "road-casing",
        type: "line",
        source: "openfreemap",
        "source-layer": "transportation",
        filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary", "tertiary", "minor", "service"]]],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.roadCasing,
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            12, 1.2,
            15, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 9, ["secondary", "tertiary"], 7, 4.5],
            17, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 22, ["secondary", "tertiary"], 17, 11],
          ],
        },
      },
      {
        id: "road",
        type: "line",
        source: "openfreemap",
        "source-layer": "transportation",
        filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary", "tertiary", "minor", "service"]]],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary"], c.roadMajor, c.roadMinor],
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            12, 0.8,
            15, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 7, ["secondary", "tertiary"], 5.4, 3.2],
            17, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 18, ["secondary", "tertiary"], 14, 8.5],
          ],
        },
      },
      {
        id: "building",
        type: "fill",
        source: "openfreemap",
        "source-layer": "building",
        minzoom: 13.5,
        paint: {
          "fill-color": c.building,
          "fill-outline-color": c.buildingLine,
          "fill-opacity": ["interpolate", ["linear"], ["zoom"], 13.5, 0, 14.2, 1],
        },
      },
      {
        id: "road-label",
        type: "symbol",
        source: "openfreemap",
        "source-layer": "transportation_name",
        layout: {
          "symbol-placement": "line",
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 13, 10, 17, 14],
          "text-letter-spacing": 0.08,
          "text-transform": "uppercase",
        },
        paint: {
          "text-color": c.label,
          "text-halo-color": c.labelHalo,
          "text-halo-width": 1.4,
        },
      },
      {
        id: "place-label",
        type: "symbol",
        source: "openfreemap",
        "source-layer": "place",
        filter: ["in", ["get", "class"], ["literal", ["suburb", "neighbourhood", "quarter"]]],
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 13,
          "text-letter-spacing": 0.22,
          "text-transform": "uppercase",
        },
        paint: {
          "text-color": c.label,
          "text-halo-color": c.labelHalo,
          "text-halo-width": 1.6,
        },
      },
    ],
  };
}
