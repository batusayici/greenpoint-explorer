// Pure per-bay storefront unit resolution. Precedence: per-BIN params →
// today's defaults (alternating door, awning on food trades). `composeStorefront`
// supports door "left"|"right" only — "center" is clamped here until Task 6.
import { isFoodTrade } from "./storefrontSigns.js";

export function resolveStorefrontUnit({ bay, index, params = {}, count = 1 }) {
  let door = index % 2 === 0 ? "left" : "right";
  if (params.doorAlign === "left" || params.doorAlign === "right") door = params.doorAlign;
  else if (params.doorAlign === "center") door = "left"; // clamp until Task 6

  let has = isFoodTrade(bay.category);
  let color;
  const sa = params.storefrontAwning;
  if (sa === false) has = false;
  else if (sa === true) has = true;
  else if (typeof sa === "number") { has = true; color = sa; }

  const awning = color != null ? { has, color } : { has };
  return { door, awning, widthFrac: 1 / count };
}
