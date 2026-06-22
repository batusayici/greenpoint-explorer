import { useEffect, useState } from "react";
import { familyList } from "../../materialFamilies.js";
import { getBuildingTruth, subscribeBuildingTruth } from "../../dev/facadeTruthRegistry.js";
import { nearestTrimToken, nearestPaletteToken } from "../../visualSystem/colorBinding.js";
import { TRIM_TONES, MATERIAL_WALL_TONES } from "../../visualSystem/palette.js";

const hex6 = (n) => "0x" + (n >>> 0).toString(16).padStart(6, "0").slice(-6);
const cssHex = (n) => "#" + (n >>> 0).toString(16).padStart(6, "0").slice(-6);

// After a Save, reload so the scene picks up the written override JSON — but carry
// the current camera framing through the existing ?t/?f/?a params (and ?truthbin to
// re-select the same building) so it visually re-renders in place instead of
// snapping home. window.__gpCamera is the dev getter exposed by SceneView.
function reloadPreservingView(bin) {
  const params = new URLSearchParams();
  params.set("facadeedit", "1");
  const cam = typeof window.__gpCamera === "function" ? window.__gpCamera() : null;
  if (cam) {
    params.set("t", cam.t.map((n) => n.toFixed(4)).join(","));
    params.set("f", cam.f.toFixed(4));
    params.set("a", String(cam.a));
  }
  if (bin) params.set("truthbin", String(bin));
  window.location.href = `${window.location.origin}/?${params.toString()}`;
}

// Dev-only (?facadeedit=1) per-BIN facade-truth panel. Click a building to load
// its BIN; eyedrop facade/window/door from Street View open beside the app;
// each sample snaps to a sanctioned palette token; Save merges the override JSON.
export default function FacadeTruthEditor({ bin }) {
  const [, force] = useState(0);
  useEffect(() => subscribeBuildingTruth(() => force((n) => n + 1)), []);

  const entry = bin ? getBuildingTruth(bin) : null;
  const [family, setFamily] = useState(null);
  const [wall, setWall] = useState(null);   // snapped hex number or null
  const [win, setWin] = useState(null);
  const [door, setDoor] = useState(null);
  const [cornice, setCornice] = useState(null);
  const [status, setStatus] = useState("");

  // Seed controls from the registered truth whenever the selected BIN changes —
  // and re-seed when the registry entry first appears. With ?truthbin the panel
  // mounts before the scene build registers the building, so the entry is null at
  // mount; depending on its fields re-runs this once the registry populates.
  useEffect(() => {
    setFamily(entry?.family ?? null);
    setWall(entry?.tint ?? null);
    setWin(entry?.windowTint ?? null);
    setDoor(entry?.doorTint ?? null);
    setCornice(entry?.corniceColor ?? null);
    setStatus("");
  }, [bin, entry?.family, entry?.tint, entry?.windowTint, entry?.doorTint, entry?.corniceColor]); // eslint-disable-line react-hooks/exhaustive-deps

  const eyedropper = typeof window !== "undefined" && "EyeDropper" in window;

  async function sample(kind) {
    if (!eyedropper) { setStatus("EyeDropper needs Chrome/Edge/Arc"); return; }
    try {
      const { sRGBHex } = await new window.EyeDropper().open(); // "#rrggbb"
      const raw = parseInt(sRGBHex.slice(1), 16);
      if (kind === "wall") setWall(nearestPaletteToken(raw, family ?? "brick"));
      else if (kind === "win") setWin(nearestTrimToken(raw));
      else if (kind === "cornice") setCornice(nearestTrimToken(raw));
      else setDoor(nearestTrimToken(raw));
      setStatus("sampled → snapped");
    } catch {
      setStatus("sample cancelled");
    }
  }

  async function save() {
    if (!bin) return;
    // Never persist an invalid family (e.g. null before the registry seeded the
    // panel). Fall back to the registered family; omit it if still unknown so the
    // building keeps its heuristic family rather than getting `family: null`.
    const fam = family ?? entry?.family ?? null;
    const override = {};
    if (fam != null) override.family = fam;
    if (wall != null) override.tint = hex6(wall);
    if (win != null) override.windowTint = hex6(win);
    if (door != null) override.doorTint = hex6(door);
    if (cornice != null) override.corniceTint = hex6(cornice);
    setStatus("saving…");
    try {
      const res = await fetch("/__facade-override", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bin, override }),
      });
      const json = await res.json();
      if (!json.ok) { setStatus(`error: ${json.error}`); return; }
      setStatus("saved ✓ — re-rendering…");
      reloadPreservingView(bin);
    } catch (error) {
      setStatus(`error: ${error.message}`);
    }
  }

  return (
    <div style={shell}>
      <strong>Facade truth</strong>
      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
        {bin ? `BIN ${bin}${entry?.addr ? ` · ${entry.addr}` : ""}` : "click a building to load it"}
      </div>
      {bin && (
        <>
          <Row label="material">
            <select value={family ?? ""} onChange={(e) => setFamily(e.target.value)} style={select}>
              {familyList().map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Row>
          <ColorRow label="facade" value={wall} onSample={() => sample("wall")} onPick={setWall} tokens={MATERIAL_WALL_TONES[family] ?? []} />
          <ColorRow label="window" value={win} onSample={() => sample("win")} onPick={setWin} tokens={TRIM_TONES} />
          <ColorRow label="door" value={door} onSample={() => sample("door")} onPick={setDoor} tokens={TRIM_TONES} />
          <ColorRow label="cornice" value={cornice} onSample={() => sample("cornice")} onPick={setCornice} tokens={TRIM_TONES} />
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <button onClick={save} style={button}>Save → JSON</button>
            <span style={{ fontSize: 11, opacity: 0.85 }}>{status}</span>
          </div>
          {!eyedropper && <div style={{ fontSize: 11, color: "#e0a", marginTop: 6 }}>EyeDropper unavailable — use Chrome/Edge/Arc.</div>}
        </>
      )}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8, fontSize: 11 }}>
      <span style={{ opacity: 0.85, minWidth: 56 }}>{label}</span>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onSample, onPick, tokens }) {
  return (
    <Row label={label}>
      <button onClick={onSample} style={button}>eyedrop</button>
      <span
        title={value != null ? "click to clear" : "no color set"}
        onClick={() => value != null && onPick(null)}
        style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid #5a4d3e", cursor: value != null ? "pointer" : "default",
          background: value != null ? cssHex(value) : "transparent" }}
      />
      <code style={{ fontSize: 11, opacity: 0.85, minWidth: 56 }}>{value != null ? hex6(value) : "—"}</code>
      <span style={{ display: "flex", flexWrap: "wrap", gap: 3, marginLeft: "auto", maxWidth: 132, justifyContent: "flex-end" }}>
        {tokens.map((t) => (
          <span
            key={t}
            title={hex6(t) + " — click to select"}
            onClick={() => onPick(t)}
            style={{ width: 14, height: 14, background: cssHex(t), borderRadius: 2, cursor: "pointer",
              outline: t === value ? "2px solid #ffcf3f" : "1px solid rgba(255,255,255,0.12)", outlineOffset: t === value ? 0 : -1 }}
          />
        ))}
      </span>
    </Row>
  );
}

const shell = {
  position: "absolute", top: 14, left: 14, width: 320, padding: 12,
  background: "rgba(28,24,18,0.94)", color: "#eae1ce",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12,
  borderRadius: 6, boxShadow: "0 6px 24px rgba(0,0,0,0.4)", zIndex: 50,
};
const select = { flex: 1, background: "#3a3228", color: "#eae1ce", border: "1px solid #5a4d3e", borderRadius: 4, padding: "3px 6px", fontFamily: "inherit", fontSize: 11 };
const button = { background: "#d9a43b", color: "#241c10", border: "none", borderRadius: 4, padding: "5px 9px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 11 };
