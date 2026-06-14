import { useEffect, useMemo, useRef, useState } from "react";
import { facadeFaceKeys, getFacadeFace, subscribeFacadeFaces, updateFacadeFaceSpec } from "../../dev/facadeFaceRegistry.js";
import { listEditableRecesses, patchRecess } from "../../dev/facadeSpecPatch.js";
import { faceRectToPanel, moveRect, panelDeltaToFace, panelPointToFace, resizeRect } from "../../dev/facadeCoords.js";

const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const MIN_W = 280;
const MAX_W = 1100;

// Dev-only (?facadeedit=1) panel. Drag recess boxes over the flat texture to
// snap them onto the painted openings; the 3D scene re-snaps live, Save writes
// the coords back to the spec JSON. `faceKey` is controlled by SceneView so a
// building click can drive which face is shown; onClose hides the panel.
export default function FacadeRecessEditor({ faceKey, onSelectFace, onClose }) {
  const [keys, setKeys] = useState(facadeFaceKeys());
  const [spec, setSpec] = useState(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [previewW, setPreviewW] = useState(400);

  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const rebuildRaf = useRef(0);
  const drag = useRef(null);

  // Refs the drag/key handlers read fresh — no stale closure.
  const specRef = useRef(spec);
  const entryRef = useRef(null);
  const viewRef = useRef(null);
  const itemsRef = useRef([]);

  const entry = faceKey ? getFacadeFace(faceKey) : null;
  specRef.current = spec;
  entryRef.current = entry;

  // Track which faces the scene has registered (textures load async).
  useEffect(() => subscribeFacadeFaces(() => setKeys(facadeFaceKeys())), []);

  // Auto-pick the first face when none is selected yet.
  useEffect(() => {
    if (!faceKey && keys.length) onSelectFace(keys[0]);
  }, [keys, faceKey, onSelectFace]);

  // Load the working spec whenever the controlled face changes.
  useEffect(() => {
    if (!faceKey) return;
    const e = getFacadeFace(faceKey);
    if (!e) return;
    setSpec(structuredClone(e.faceSpec));
    setSelected(null);
    setStatus("");
  }, [faceKey]);

  // Preview size: user-controlled width, height locked to slice aspect.
  const view = useMemo(() => {
    if (!entry?.texture?.image) return null;
    const img = entry.texture.image;
    const aspect = ((entry.u1 - entry.u0) * img.width) / img.height;
    return { width: previewW, height: previewW / aspect, skewX: spec?.skewX ?? 0 };
  }, [entry, spec, previewW]);
  viewRef.current = view;

  // Draw the texture slice (mirrored if the face is flipped).
  useEffect(() => {
    if (!entry?.texture?.image || !view) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = entry.texture.image;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(view.width * dpr);
    canvas.height = Math.round(view.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, view.width, view.height);
    const sx = entry.u0 * img.width;
    const sw = (entry.u1 - entry.u0) * img.width;
    ctx.save();
    if (entry.flip) { ctx.translate(view.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(img, sx, 0, sw, img.height, 0, 0, view.width, view.height);
    ctx.restore();
  }, [entry, view]);

  function scheduleRebuild(nextSpec) {
    const e = entryRef.current;
    if (!e?.rebuild) return;
    cancelAnimationFrame(rebuildRaf.current);
    rebuildRaf.current = requestAnimationFrame(() => e.rebuild(nextSpec));
  }

  function updateSpec(nextSpec) {
    setSpec(nextSpec);
    specRef.current = nextSpec;
    setStatus("unsaved");
    scheduleRebuild(nextSpec);
  }

  const items = useMemo(() => listEditableRecesses(spec), [spec]);
  itemsRef.current = items;
  const selectedItem = items.find((it) => it.id === selected) || null;

  // --- recess drag ----------------------------------------------------
  function panelPoint(event) {
    const r = previewRef.current.getBoundingClientRect();
    return { px: event.clientX - r.left, py: event.clientY - r.top };
  }

  function onPointerMove(event) {
    const d = drag.current;
    const v = viewRef.current;
    const currentSpec = specRef.current;
    if (!d || !v || !currentSpec) return;
    const item = itemsRef.current.find((it) => it.id === d.item.id);
    if (!item) return;
    let nextRect;
    if (d.mode === "move") {
      const p = panelPoint(event);
      const { dx, dy } = panelDeltaToFace(p.px - d.start.px, p.py - d.start.py, v);
      nextRect = moveRect(d.startRect, item.lockX ? 0 : dx, dy);
    } else {
      const p = panelPoint(event);
      const fp = panelPointToFace(p.px, p.py, v, item.rect);
      const handle = item.lockX ? d.handle.replace(/[ew]/g, "") || "n" : d.handle;
      nextRect = resizeRect(item.rect, handle, fp);
    }
    updateSpec(patchRecess(currentSpec, item.path, nextRect));
  }
  function beginDrag(d) {
    drag.current = d;
    const mv = (e) => onPointerMove(e);
    const up = () => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
      drag.current = null;
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  }

  function onBoxPointerDown(event, item) {
    event.stopPropagation();
    setSelected(item.id);
    beginDrag({ mode: "move", item, start: panelPoint(event), startRect: item.rect });
  }

  function onHandlePointerDown(event, item, handle) {
    event.stopPropagation();
    setSelected(item.id);
    beginDrag({ mode: "resize", item, handle });
  }

  useEffect(() => () => cancelAnimationFrame(rebuildRaf.current), []);

  // Arrow-key nudge.
  useEffect(() => {
    if (!selected) return;
    function onKey(event) {
      const step = event.shiftKey ? 0.01 : 0.002;
      const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      const move = map[event.key];
      if (!move) return;
      event.preventDefault();
      const item = itemsRef.current.find((it) => it.id === selected);
      if (!item) return;
      updateSpec(patchRecess(specRef.current, item.path, moveRect(item.rect, item.lockX ? 0 : move[0], move[1])));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- panel resize grip ---------------------------------------------
  function onGripPointerDown(event) {
    event.stopPropagation();
    event.preventDefault();
    const startX = event.clientX;
    const startW = previewW;
    function mv(e) {
      // panel is top-right anchored, so dragging left grows it
      setPreviewW(Math.max(MIN_W, Math.min(MAX_W, startW + (startX - e.clientX))));
    }
    function up() {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  }

  async function save() {
    if (!entry || !faceKey || !spec) return;
    setStatus("saving…");
    try {
      const res = await fetch("/__facade-spec", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ file: entry.file, faceKey, faceSpec: spec }),
      });
      const json = await res.json();
      if (json.ok) {
        updateFacadeFaceSpec(faceKey, structuredClone(spec));
        setStatus("saved ✓");
      } else {
        setStatus(`error: ${json.error}`);
      }
    } catch (error) {
      setStatus(`error: ${error.message}`);
    }
  }

  function revert() {
    const e = getFacadeFace(faceKey);
    if (!e) return;
    const restored = structuredClone(e.faceSpec);
    setSpec(restored);
    setSelected(null);
    setStatus("");
    scheduleRebuild(restored);
  }

  return (
    <Shell onGripPointerDown={onGripPointerDown}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <strong>Recess editor</strong>
        <select value={faceKey ?? ""} onChange={(e) => onSelectFace(e.target.value)} style={selectStyle}>
          {keys.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <button onClick={onClose} title="close" style={closeStyle}>✕</button>
      </div>

      {!keys.length && <div style={{ opacity: 0.7 }}>waiting for facade textures to load…</div>}

      {view && (
        <div
          ref={previewRef}
          onPointerDown={() => setSelected(null)}
          style={{ position: "relative", width: view.width, height: view.height, userSelect: "none", touchAction: "none" }}
        >
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: view.width, height: view.height, outline: "1px solid rgba(0,0,0,0.4)" }} />
          {items.map((item) => {
            const box = faceRectToPanel(item.rect, view);
            const isSel = item.id === selected;
            return (
              <div
                key={item.id}
                onPointerDown={(e) => onBoxPointerDown(e, item)}
                title={item.label}
                style={{
                  position: "absolute",
                  left: box.left, top: box.top, width: box.width, height: box.height,
                  border: `1.5px solid ${isSel ? "#ffcf3f" : kindColor(item.kind)}`,
                  background: isSel ? "rgba(255,207,63,0.16)" : "rgba(0,255,68,0.06)",
                  boxSizing: "border-box", cursor: "move",
                }}
              >
                {isSel && HANDLES.filter((h) => !(item.lockX && /[ew]/.test(h))).map((h) => (
                  <div key={h} onPointerDown={(e) => onHandlePointerDown(e, item, h)} style={handleStyle(h)} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5 }}>
        {selectedItem ? (
          <code style={{ color: "#ffcf3f" }}>{selectedItem.label}: {fmt(selectedItem.rect)}</code>
        ) : (
          <span style={{ opacity: 0.6 }}>click a building to load it · drag boxes to move · handles resize · arrows nudge (⇧ ×5)</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
        <button onClick={save} style={buttonStyle}>Save → JSON</button>
        <button onClick={revert} style={{ ...buttonStyle, background: "#3a3228", color: "#eae1ce" }}>Revert</button>
        <span style={{ fontSize: 11, opacity: 0.85 }}>{status}</span>
      </div>
    </Shell>
  );
}

function Shell({ children, onGripPointerDown }) {
  return (
    <div style={{
      position: "absolute", top: 14, right: 14,
      maxHeight: "calc(100vh - 28px)", overflow: "auto",
      padding: 12, paddingBottom: 16,
      background: "rgba(28, 24, 18, 0.94)", color: "#eae1ce",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12,
      borderRadius: 6, boxShadow: "0 6px 24px rgba(0,0,0,0.4)", zIndex: 50,
    }}>
      {children}
      <div
        onPointerDown={onGripPointerDown}
        title="drag to resize"
        style={{
          position: "absolute", left: 0, bottom: 0, width: 16, height: 16,
          cursor: "nesw-resize",
          background: "linear-gradient(45deg, transparent 50%, #d9a43b 50%, #d9a43b 65%, transparent 65%, transparent 78%, #d9a43b 78%, #d9a43b 93%, transparent 93%)",
          opacity: 0.8,
        }}
      />
    </div>
  );
}

const kindColor = (kind) => ({ window: "#5fd0ff", storefront: "#9b8cff", door: "#ff9b6b", cornice: "#7CFC9A" }[kind] || "#00ff44");

function handleStyle(h) {
  const s = 9, c = -s / 2, mid = `calc(50% - ${s / 2}px)`;
  const pos = { position: "absolute", width: s, height: s, background: "#ffcf3f", border: "1px solid #4a3a10", boxSizing: "border-box" };
  const map = {
    n:  { left: mid,  top: c,    cursor: "ns-resize"   },
    s:  { left: mid,  bottom: c, cursor: "ns-resize"   },
    e:  { top: mid,   right: c,  cursor: "ew-resize"   },
    w:  { top: mid,   left: c,   cursor: "ew-resize"   },
    ne: { right: c,   top: c,    cursor: "nesw-resize" },
    nw: { left: c,    top: c,    cursor: "nwse-resize" },
    se: { right: c,   bottom: c, cursor: "nwse-resize" },
    sw: { left: c,    bottom: c, cursor: "nesw-resize" },
  };
  return { ...pos, ...map[h] };
}

const fmt = (r) => `x0 ${r.x0.toFixed(3)} x1 ${r.x1.toFixed(3)} y0 ${r.y0.toFixed(3)} y1 ${r.y1.toFixed(3)}`;
const selectStyle = { background: "#3a3228", color: "#eae1ce", border: "1px solid #5a4d3e", borderRadius: 4, padding: "3px 6px", fontFamily: "inherit", fontSize: 11, flex: 1, minWidth: 0 };
const buttonStyle = { background: "#d9a43b", color: "#241c10", border: "none", borderRadius: 4, padding: "6px 10px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 12 };
const closeStyle = { background: "transparent", color: "#eae1ce", border: "1px solid #5a4d3e", borderRadius: 4, padding: "2px 7px", cursor: "pointer", fontFamily: "inherit", fontSize: 12, lineHeight: 1 };
