// src/inkedFacadeCompose.js
// Pure, Node-runnable facade composition for the inked component spike. No
// Three.js. Given a building's storey count and bay count, returns face-local
// rects (x0..x1, y0..y1 as 0..1 fractions of facade width/height) for the wall
// fill, a window grid (one per upper-storey bay), a cornice strip at the top,
// and a ground-floor band at the bottom. The renderer maps these to world geom.

export function composeInkedFacade({ storeys, bays, corniceFrac = 0.06, winWFrac = 0.5, winHFrac = 0.55 }) {
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

  return { wall, ground, cornice, windows };
}
