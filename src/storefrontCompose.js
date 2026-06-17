// src/storefrontCompose.js
// Pure, Node-runnable storefront composition for the inked kit. No Three.js.
// Given a tenant's storefront params, returns BAND-LOCAL rects (x0..x1, y0..y1
// as 0..1 fractions of the ground band) for each inked sub-element. The renderer
// maps these into face-local coords and assigns materials. Geometry only —
// colors/labels live in the params and are applied at draw time.

const BULKHEAD_TOP = 0.18; // masonry kickplate height (band fraction)
const GLAZE_TOP = 0.74;    // top of the display glass
const TRANSOM_TOP = 0.84;  // top of the light transom band; sign = [TRANSOM_TOP, 1]
const DOOR_W = 0.18;       // recessed entry column width
const MULLION_W = 0.02;    // divider between the two glazing panels
const FRAME_W = 0.015;     // thin storefront frame border

export function composeStorefront({ door = "left", awning } = {}) {
  if (door !== "left" && door !== "right") {
    throw new RangeError(`composeStorefront: door must be "left" or "right", got ${JSON.stringify(door)}`);
  }
  const hasAwning = !!(awning && awning.has);
  const doorLeft = door === "left";

  // Horizontal: entry column on `door` side; glazing fills the remainder.
  const glazeX0 = doorLeft ? DOOR_W : 0;
  const glazeX1 = doorLeft ? 1 : 1 - DOOR_W;
  const doorRect = doorLeft
    ? { x0: 0, y0: 0, x1: DOOR_W, y1: TRANSOM_TOP }
    : { x0: 1 - DOOR_W, y0: 0, x1: 1, y1: TRANSOM_TOP };

  const glazeMid = (glazeX0 + glazeX1) / 2;
  const glazing = [
    { x0: glazeX0, y0: BULKHEAD_TOP, x1: glazeMid - MULLION_W / 2, y1: GLAZE_TOP },
    { x0: glazeMid + MULLION_W / 2, y0: BULKHEAD_TOP, x1: glazeX1, y1: GLAZE_TOP },
  ];
  const mullion = { x0: glazeMid - MULLION_W / 2, y0: BULKHEAD_TOP, x1: glazeMid + MULLION_W / 2, y1: GLAZE_TOP };

  const bulkhead = { x0: 0, y0: 0, x1: 1, y1: BULKHEAD_TOP };
  const transom = { x0: glazeX0, y0: GLAZE_TOP, x1: glazeX1, y1: TRANSOM_TOP };
  const sign = { x0: 0, y0: TRANSOM_TOP, x1: 1, y1: 1 };

  // Thin border around the glazing+transom opening (door-side seam, outer
  // jamb, head, sill). Reads as the storefront frame.
  const frame = [
    { x0: glazeX0, y0: BULKHEAD_TOP, x1: glazeX0 + FRAME_W, y1: TRANSOM_TOP },   // vertical at the glazing's door-side edge
    { x0: glazeX1 - FRAME_W, y0: BULKHEAD_TOP, x1: glazeX1, y1: TRANSOM_TOP },   // outer vertical
    { x0: glazeX0, y0: TRANSOM_TOP - FRAME_W, x1: glazeX1, y1: TRANSOM_TOP },    // head
    { x0: glazeX0, y0: BULKHEAD_TOP, x1: glazeX1, y1: BULKHEAD_TOP + FRAME_W },  // sill
  ];

  // Awning: proud canopy over the transom zone (just below the sign band, no
  // overlap). Drawn forward of the wall by the renderer. Null when none.
  const awningRect = hasAwning ? { x0: 0, y0: GLAZE_TOP, x1: 1, y1: TRANSOM_TOP } : null;

  return { bulkhead, glazing, mullion, transom, door: doorRect, sign, frame, awning: awningRect };
}

