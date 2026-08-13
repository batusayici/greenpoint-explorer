import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import React, { act } from "react";
import { createRoot } from "react-dom/client";

// The invariant, in one line: THE FEED SURVIVES THE MAP.
//
// 2026-08-13. A browser that couldn't give MapLibre a WebGL context took the
// whole product down — `new maplibregl.Map()` threw out of a mount effect, the
// only error boundary was app-wide, and the reader lost the feed, the filters,
// the banner and the footer over a map. Reported twice from a cloud browser
// with GPU rendering disabled, in two DIFFERENT failure shapes: a context that
// was absent, and a context that existed but was broken. The second one only
// surfaced because a console error got pasted into the thread — which is
// exactly why this file exists rather than a note in the decision log.
//
// These tests are the executable version of that rule. They are deliberately
// about CONTAINMENT and DEGRADATION, not about the map: nothing here asserts a
// pin renders. If the map subtree can fail without emptying the page, the rule
// holds.

let container;
let root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  // These paths log deliberately (console.error in the degradation handler,
  // console.warn for non-fatal map errors). Silence them so a passing run is
  // quiet and a real unexpected log still stands out.
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  // resetModules alone is not enough: doMock registrations outlive it, so a
  // stubbed MapView from one test would silently shadow the REAL MapView the
  // next test is trying to exercise — and those tests fail open (the stub just
  // never calls onUnavailable), which reads as a broken assertion rather than
  // a leaked mock.
  vi.doUnmock("./MapView.jsx");
  vi.doUnmock("maplibre-gl");
  vi.resetModules();
});

const render = async (element) => {
  await act(async () => {
    root.render(element);
  });
};

// Read the page the way a reader would: is the feed there, and does the page
// admit the map is gone?
const page = () => ({
  crashed: container.querySelectorAll(".july-crash").length > 0,
  mapZones: container.querySelectorAll(".july-mapzone").length,
  noMapLayout: container.querySelectorAll(".july-main--nomap").length > 0,
  notice: container.querySelector(".july-notice--quiet")?.textContent?.trim() ?? null,
  filterLabel: container.querySelector(".july-filters")?.getAttribute("aria-label") ?? null,
  cardRows: container.querySelectorAll(".july-card").length,
  chips: container.querySelectorAll(".july-chip").length,
});

describe("a failing map never empties the page", () => {
  test("map reports itself unavailable → feed intact, map zone gone, page says so", async () => {
    // Stands in for MapView's own try/catch around `new maplibregl.Map()`:
    // the caught, designed path where a missing map becomes a STATE.
    vi.doMock("./MapView.jsx", () => ({
      default: ({ onUnavailable }) => {
        React.useEffect(() => {
          onUnavailable(new Error("Failed to initialize WebGL"));
        }, [onUnavailable]);
        return null;
      },
    }));
    const { default: JulyApp } = await import("./JulyApp.jsx");
    await render(<JulyApp />);

    const p = page();
    expect(p.crashed).toBe(false);
    expect(p.cardRows).toBeGreaterThan(0);
    expect(p.chips).toBeGreaterThan(0);
    expect(p.mapZones).toBe(0);
    expect(p.noMapLayout).toBe(true);
    expect(p.notice).toBe("Map unavailable in this browser — the full list is still here.");
    // The chip bar filters both surfaces; with no map it must stop naming one.
    expect(p.filterLabel).toBe("Filter the list");
  });

  test("map THROWS mid-render → contained, and degrades identically", async () => {
    // The half a try/catch cannot reach: a failure after a successful init —
    // the marker-sync effect, the camera effect, MapLibre's own handlers.
    // Before FeatureBoundary this reached the app-wide boundary and blanked
    // everything. The reader must not be able to tell which layer caught it.
    vi.doMock("./MapView.jsx", () => ({
      default: () => {
        throw new Error("late map failure after a successful init");
      },
    }));
    const { default: JulyApp } = await import("./JulyApp.jsx");
    await render(<JulyApp />);

    const p = page();
    expect(p.crashed).toBe(false);
    expect(p.cardRows).toBeGreaterThan(0);
    expect(p.mapZones).toBe(0);
    expect(p.noMapLayout).toBe(true);
    expect(p.notice).toBe("Map unavailable in this browser — the full list is still here.");
  });

  test("healthy map → no notice, no degraded layout (the fallback must not misfire)", async () => {
    // Without this the suite would pass just as happily if the app ALWAYS
    // degraded — the expensive kind of green.
    vi.doMock("./MapView.jsx", () => ({ default: () => <div className="july-map" /> }));
    const { default: JulyApp } = await import("./JulyApp.jsx");
    await render(<JulyApp />);

    const p = page();
    expect(p.crashed).toBe(false);
    expect(p.mapZones).toBe(1);
    expect(p.noMapLayout).toBe(false);
    expect(p.notice).toBe(null);
    expect(p.filterLabel).toBe("Filter the map");
    expect(p.cardRows).toBeGreaterThan(0);
  });
});

describe("MapView survives what MapLibre throws at it", () => {
  // Both reported shapes, driven through the real MapView against a fake
  // maplibre-gl: the point is that MapView REPORTS instead of throwing, so the
  // failure arrives as a state change rather than as an exception in a mount
  // effect.
  const renderMapView = async (MapCtor) => {
    vi.doMock("maplibre-gl", () => ({
      default: {
        Map: MapCtor,
        NavigationControl: class {},
        Marker: class {
          setLngLat() { return this; }
          addTo() { return this; }
          remove() {}
        },
        LngLatBounds: class {
          extend() { return this; }
        },
      },
    }));
    const { default: MapView } = await import("./MapView.jsx");
    const onUnavailable = vi.fn();
    await render(
      <MapView cards={[]} selectedId={null} focusKey={null} onSelect={() => {}} onFocusLocation={() => {}} onUnavailable={onUnavailable} />,
    );
    return onUnavailable;
  };

  test("context absent — constructor throws 'Failed to initialize WebGL'", async () => {
    const onUnavailable = await renderMapView(class {
      constructor() {
        throw new Error("Failed to initialize WebGL");
      }
    });
    expect(onUnavailable).toHaveBeenCalledTimes(1);
    expect(onUnavailable.mock.calls[0][0].message).toBe("Failed to initialize WebGL");
  });

  test("context present but broken — constructor throws a TypeError deeper in", async () => {
    // The second shape, reported 2026-08-13 as "Cannot read properties of
    // undefined (reading 'S')": WebGL exists, so the guard that catches an
    // ABSENT context never fires, and MapLibre dies further in.
    const onUnavailable = await renderMapView(class {
      constructor() {
        throw new TypeError("t.bindBuffer is not a function");
      }
    });
    expect(onUnavailable).toHaveBeenCalledTimes(1);
    expect(onUnavailable.mock.calls[0][0]).toBeInstanceOf(TypeError);
  });

  test("style never loads — MapLibre's async error event, which no boundary can see", async () => {
    // Construction succeeds, so neither the try/catch nor FeatureBoundary ever
    // hears about it. Without the error listener the map would sit empty and
    // unexplained and map_unavailable would never fire.
    const onUnavailable = await renderMapView(fakeMap({ emitBeforeLoad: { error: new Error("style failed to parse") } }));
    expect(onUnavailable).toHaveBeenCalledTimes(1);
    expect(onUnavailable.mock.calls[0][0].message).toBe("style failed to parse");
  });

  test("one tile 404s during startup — NOT fatal, the map keeps its chance", async () => {
    // The regression this rule is shaped to avoid: condemning a whole map over
    // a single failed request. Source/tile errors carry sourceId.
    const onUnavailable = await renderMapView(
      fakeMap({ emitBeforeLoad: { error: new Error("404"), sourceId: "openmaptiles" } }),
    );
    expect(onUnavailable).not.toHaveBeenCalled();
  });

  test("source error AFTER load — not fatal, a working map is never torn down", async () => {
    const onUnavailable = await renderMapView(fakeMap({ emitAfterLoad: { error: new Error("tile gave up") } }));
    expect(onUnavailable).not.toHaveBeenCalled();
  });
});

// Minimal MapLibre stand-in: enough surface for MapView's mount effect, plus a
// hook to fire an error event before or after the map reports itself loaded.
function fakeMap({ emitBeforeLoad, emitAfterLoad } = {}) {
  return class FakeMap {
    constructor() {
      // Listeners are kept in ARRAYS. An earlier version stored one function
      // per event type, so a second on()/once() for the same type silently
      // replaced the first — the fake quietly dropped a listener the real
      // MapLibre would have kept, and the test failed for a reason that had
      // nothing to do with the product. A fake that loses listeners invents
      // bugs; keep this faithful.
      this.handlers = {};
      this.onceHandlers = {};
      queueMicrotask(() => {
        const fire = (list, arg) => (list ?? []).forEach((fn) => fn(arg));
        if (emitBeforeLoad) fire(this.handlers.error, emitBeforeLoad);
        fire(this.onceHandlers.load);
        if (emitAfterLoad) fire(this.handlers.error, emitAfterLoad);
      });
    }
    on(type, fn) { (this.handlers[type] ??= []).push(fn); }
    once(type, fn) { (this.onceHandlers[type] ??= []).push(fn); }
    addControl() {}
    getZoom() { return 14.1; }
    fitBounds() {}
    easeTo() {}
    resize() {}
    remove() {}
  };
}
