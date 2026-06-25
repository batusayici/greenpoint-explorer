// src/inkedFacadeCompose.js
// Pure, Node-runnable facade composition for the inked component spike. No
// Three.js. Given a building's storey count and bay count, returns face-local
// rects (x0..x1, y0..y1 as 0..1 fractions of facade width/height) for the wall
// fill, a window grid (one per upper-storey bay), a cornice strip at the top,
// and a ground-floor band at the bottom. The renderer maps these to world geom.

export function composeInkedFacade({ storeys, bays, corniceFrac = 0.06, winWFrac = 0.5, winHFrac = 0.55, doorHFrac = 0.82 }) {
  const s = Math.max(2, storeys);
  const b = Math.max(1, bays);

  const groundFrac = 1 / s;          // ground floor = one storey tall
  const wall = { x0: 0, y0: 0, x1: 1, y1: 1 };
  const ground = { x0: 0, y0: 0, x1: 1, y1: groundFrac };
  const cornice = { x0: 0, y0: 1 - corniceFrac, x1: 1, y1: 1 };

  // Upper storeys occupy [groundFrac, 1 - corniceFrac]; split into (s-1) rows.
  const upperTop = 1 - corniceFrac;
  const upperBot = groundFrac;
  const rows = s - 1;
  const rowH = (upperTop - upperBot) / rows;

  // Window sizing: centered in each row/bay cell. winWFrac/winHFrac are the
  // window's share of its bay/row cell (caller passes hero-matched values).
  const cellW = 1 / b;
  const windows = [];
  for (let r = 0; r < rows; r += 1) {
    const cy0 = upperBot + r * rowH;
    for (let c = 0; c < b; c += 1) {
      const cx0 = c * cellW;
      const cxMid = cx0 + cellW / 2;
      const cyMid = cy0 + rowH / 2;
      windows.push({
        x0: cxMid - (cellW * winWFrac) / 2,
        x1: cxMid + (cellW * winWFrac) / 2,
        y0: cyMid - (rowH * winHFrac) / 2,
        y1: cyMid + (rowH * winHFrac) / 2,
      });
    }
  }

  // Ground-floor opening row: a window in each bay column (same rhythm as the
  // upper floors), except the door bay — the bay whose center is nearest the
  // horizontal center of the face (ties -> lower index) — which carries the
  // entry door. Door meets the sidewalk (y0 = 0); windows are centered in the
  // ground band.
  let doorBay = 0;
  let bestD = Infinity;
  for (let c = 0; c < b; c += 1) {
    const d = Math.abs((c + 0.5) / b - 0.5);
    if (d < bestD - 1e-9) { bestD = d; doorBay = c; } // strict < keeps the lower index on ties
  }
  const groundWindows = [];
  let door = null;
  const gMid = groundFrac / 2;
  for (let c = 0; c < b; c += 1) {
    const cxMid = c * cellW + cellW / 2;
    if (c === doorBay) {
      door = {
        x0: cxMid - (cellW * winWFrac) / 2,
        x1: cxMid + (cellW * winWFrac) / 2,
        y0: 0,
        y1: groundFrac * doorHFrac,
      };
    } else {
      groundWindows.push({
        x0: cxMid - (cellW * winWFrac) / 2,
        x1: cxMid + (cellW * winWFrac) / 2,
        y0: gMid - (groundFrac * winHFrac) / 2,
        y1: gMid + (groundFrac * winHFrac) / 2,
      });
    }
  }

  return { wall, ground, cornice, windows, groundWindows, door, doorBay };
}
