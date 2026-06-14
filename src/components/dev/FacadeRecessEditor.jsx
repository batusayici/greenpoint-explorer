import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { facadeFaceKeys, getFacadeFace, subscribeFacadeFaces } from "../../dev/facadeFaceRegistry.js";
import { listEditableRecesses, patchRecess } from "../../dev/facadeSpecPatch.js";
import { faceRectToPanel, moveRect, panelDeltaToFace, panelPointToFace, resizeRect } from "../../dev/facadeCoords.js";

const MAX_W = 400;
const MAX_H = 540;
const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

// Dev-only (?facadeedit=1) panel: drag recess boxes over the flat texture to
// snap them onto the painted openings; the 3D scene re-snaps live, and Save
// writes the coords back to the spec JSON.
export default function FacadeRecessEditor() {
  const [keys, setKeys] = useState(facadeFaceKeys());
  const [faceKey, setFaceKey] = useState(null);
  const [spec, setSpec] = useState(null); // working copy of the face spec
  const [selected, setSelected] = useState(null); // recess item id
  const [status, setStatus] = useState("");

  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const rebuildRaf = useRef(0);
  const drag = useRef(null);

  // Track which faces the scene has registered (textures load async).
  useEffect(() => subscribeFacadeFaces(() => setKeys(facadeFaceKeys())), []);

  // Default to the first registered face once one appears.
  useEffect(() => {
    if (!faceKey && keys.length) loadFace(keys[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, faceKey]);

  const entry = faceKey ? getFacadeFace(faceKey) : null;

  const loadFace = useCallback((key) => {
    const e = getFacadeFace(key);
    if (!e) return;
    setFaceKey(key);
    setSpec(structuredClone(e.faceSpec));
    setSelected(null);
    setStatus("");
  }, []);

  // Preview size from the texture slice aspect, capped to MAX_W x MAX_H.
  const view = useMemo(() => {
    if (!entry?.texture?.image) return null;
    const img = entry.texture.image;
    const sliceW = (entry.u1 - entry.u0) * img.width;
    const aspect = sliceW / img.height;
    let width = MAX_W;
    let height = width / aspect;
    if (height > MAX_H) {
      height = MAX_H;
      width = height * aspect;
    }
    return { width, height, skewX: spec?.skewX ?? 0 };
  }, [entry, spec]);

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
    if (entry.flip) {
      ctx.translate(view.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(img, sx, 0, sw, img.height, 0, 0, view.width, view.height);
    ctx.restore();
  }, [entry, view]);

  // Push the working spec into the live 3D face, one rebuild per frame.
  const scheduleRebuild = useCallback(
    (nextSpec) => {
      if (!entry?.rebuild) return;
      cancelAnimationFrame(rebuildRaf.current);
      rebuildRaf.current = requestAnimationFrame(() => entry.rebuild(nextSpec));
    },
    [entry],
  );

  const updateSpec = useCallback(
    (nextSpec) => {
      setSpec(nextSpec);
      setStatus("unsaved");
      scheduleRebuild(nextSpec);
    },
    [scheduleRebuild],
  );

  const items = useMemo(() => listEditableRecesses(spec), [spec]);
  const selectedItem = items.find((it) => it.id === selected) || null;

  // --- drag plumbing --------------------------------------------------
  const panelPoint = (event) => {
    const rect = previewRef.current.getBoundingClientRect();
    return { px: event.clientX - rect.left, py: event.clientY - rect.top };
  };

  const onBoxPointerDown = (event, item) => {
    event.stopPropagation();
    setSelected(item.id);
    drag.current = { mode: "move", item, start: panelPoint(event), startRect: item.rect };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onHandlePointerDown = (event, item, handle) => {
    event.stopPropagation();
    setSelected(item.id);
    drag.current = { mode: "resize", item, handle };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = useCallback(
    (event) => {
      const d = drag.current;
      if (!d || !view) return;
      const item = items.find((it) => it.id === d.item.id);
      if (!item) return;
      let nextRect;
      if (d.mode === "move") {
        const p = panelPoint(event);
        const { dx, dy } = panelDeltaToFace(p.px - d.start.px, p.py - d.start.py, view);
        nextRect = moveRect(d.startRect, item.lockX ? 0 : dx, dy);
      } else {
        const p = panelPoint(event);
        const fp = panelPointToFace(p.px, p.py, view, item.rect);
        const handle = item.lockX ? d.handle.replace(/[ew]/g, "") || "n" : d.handle;
        nextRect = resizeRect(item.rect, handle, fp);
      }
      updateSpec(patchRecess(spec, item.path, nextRect));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, spec, view, updateSpec],
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  // Arrow-key nudge of the selected recess.
  useEffect(() => {
    if (!selectedItem) return undefined;
    const onKey = (event) => {
      const step = event.shiftKey ? 0.01 : 0.002;
      const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      const move = map[event.key];
      if (!move) return;
      event.preventDefault();
      const dx = selectedItem.lockX ? 0 : move[0];
      updateSpec(patchRecess(spec, selectedItem.path, moveRect(selectedItem.rect, dx, move[1])));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedItem, spec, updateSpec]);

  const save = async () => {
    if (!entry || !faceKey || !spec) return;
    setStatus("saving…");
    try {
      const res = await fetch("/__facade-spec", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ file: entry.file, faceKey, faceSpec: spec }),
      });
      const json = await res.json();
      setStatus(json.ok ? "saved ✓" : `error: ${json.error}`);
    } catch (error) {
      setStatus(`error: ${error.message}`);
    }
  };

  if (!keys.length) {
    return <Shell><div style={{ opacity: 0.7 }}>waiting for facade textures to load…</div></Shell>;
  }

  return (
    <Shell>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <strong>Recess editor</strong>
        <select value={faceKey ?? ""} onChange={(e) => loadFace(e.target.value)} style={selectStyle}>
          {keys.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      {view && (
        <div
          ref={previewRef}
          onPointerDown={() => setSelected(null)}
          style={{ position: "relative", width: view.width, height: view.height, cursor: "default", userSelect: "none", touchAction: "none" }}
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
                  left: box.left,
                  top: box.top,
                  width: box.width,
                  height: box.height,
                  border: `1.5px solid ${isSel ? "#ffcf3f" : kindColor(item.kind)}`,
                  background: isSel ? "rgba(255,207,63,0.16)" : "rgba(0,255,68,0.06)",
                  boxSizing: "border-box",
                  cursor: "move",
                }}
              >
                {isSel &&
                  HANDLES.filter((h) => !(item.lockX && /[ew]/.test(h))).map((h) => (
                    <div key={h} onPointerDown={(e) => onHandlePointerDown(e, item, h)} style={handleStyle(h)} />
                  ))}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5 }}>
        {selectedItem ? (
          <code style={{ color: "#ffcf3f" }}>
            {selectedItem.label}: {fmt(selectedItem.rect)}
          </code>
        ) : (
          <span style={{ opacity: 0.6 }}>click a box to select · drag to move · handles resize · arrows nudge (⇧ ×5)</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
        <button onClick={save} style={buttonStyle}>Save → JSON</button>
        <button onClick={() => loadFace(faceKey)} style={{ ...buttonStyle, background: "#3a3228" }}>Revert</button>
        <span style={{ fontSize: 11, opacity: 0.85 }}>{status}</span>
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        maxHeight: "calc(100vh - 28px)",
        overflow: "auto",
        padding: 12,
        background: "rgba(28, 24, 18, 0.94)",
        color: "#eae1ce",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 12,
        borderRadius: 6,
        boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
        zIndex: 50,
      }}
    >
      {children}
    </div>
  );
}

const kindColor = (kind) => ({ window: "#5fd0ff", storefront: "#9b8cff", door: "#ff9b6b", cornice: "#7CFC9A" }[kind] || "#00ff44");

function handleStyle(h) {
  const s = 9;
  const pos = { position: "absolute", width: s, height: s, background: "#ffcf3f", border: "1px solid #4a3a10", boxSizing: "border-box" };
  const c = -s / 2;
  const mid = `calc(50% - ${s / 2}px)`;
  const map = {
    n: { left: mid, top: c, cursor: "ns-resize" },
    s: { left: mid, bottom: c, cursor: "ns-resize" },
    e: { top: mid, right: c, cursor: "ew-resize" },
    w: { top: mid, left: c, cursor: "ew-resize" },
    ne: { right: c, top: c, cursor: "nesw-resize" },
    nw: { left: c, top: c, cursor: "nwse-resize" },
    se: { right: c, bottom: c, cursor: "nwse-resize" },
    sw: { left: c, bottom: c, cursor: "nesw-resize" },
  };
  return { ...pos, ...map[h] };
}

const fmt = (r) => `x0 ${r.x0.toFixed(3)} x1 ${r.x1.toFixed(3)} y0 ${r.y0.toFixed(3)} y1 ${r.y1.toFixed(3)}`;
const selectStyle = { background: "#3a3228", color: "#eae1ce", border: "1px solid #5a4d3e", borderRadius: 4, padding: "3px 6px", fontFamily: "inherit", fontSize: 11 };
const buttonStyle = { background: "#d9a43b", color: "#241c10", border: "none", borderRadius: 4, padding: "6px 10px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 12 };
