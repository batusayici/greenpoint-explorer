// Pure per-bay storefront unit resolution. Precedence: per-storefront SIGNATURE
// (R2 recognizable layer) → per-BIN params → today's defaults (alternating door,
// awning on food trades). A present signature wins for the aspects it names;
// absent signature keys (and an absent signature) fall through, byte-stable.
import { isFoodTrade } from "./storefrontSigns.js";
import { tokenColor } from "./storefrontSignatures.js";

export function resolveStorefrontUnit({ bay, index, params = {}, count = 1, signature = null }) {
  let door = index % 2 === 0 ? "left" : "right";
  if (params.doorAlign === "left" || params.doorAlign === "right" || params.doorAlign === "center") door = params.doorAlign;

  let has = isFoodTrade(bay.category);
  let color;
  const sa = params.storefrontAwning;
  if (sa === false) has = false;
  else if (sa === true) has = true;
  else if (typeof sa === "number") { has = true; color = sa; }

  const unit = { door, widthFrac: 1 / count };

  // SIGNATURE overrides — highest precedence. A signed shop reads as itself by
  // FORM: navy awning, black frame, gold transom lettering. Each key is optional.
  if (signature && typeof signature === "object") {
    const sig = signature;
    if (sig.awning) {
      has = true;                                  // a signed awning is always on
      const c = tokenColor(sig.awning.tintToken);
      if (c != null) color = c;
      if (sig.awning.profile) unit.profile = sig.awning.profile;
      if (sig.awning.stripe) unit.stripe = sig.awning.stripe; // fabric style (e.g. "pinstripe")
      if (sig.awning.wrapCorner != null) unit.wrapCorner = sig.awning.wrapCorner;
    }
    if (sig.frame) {
      const fc = tokenColor(sig.frame.tintToken);
      if (fc != null) { unit.frameTint = fc; unit.signColor = fc; } // dark board == frame
    }
    if (sig.transom) {
      if (sig.transom.text) unit.label = sig.transom.text;
      const tc = tokenColor(sig.transom.tintToken);
      if (tc != null) unit.textHex = tc;            // gold lettering on the sign board
    }
  }

  unit.awning = color != null ? { has, color } : { has };
  if (unit.profile != null) unit.awning.profile = unit.profile;
  if (unit.stripe != null) unit.awning.stripe = unit.stripe;
  if (unit.wrapCorner != null) unit.awning.wrapCorner = unit.wrapCorner;
  delete unit.profile;
  delete unit.stripe;
  delete unit.wrapCorner;
  return unit;
}
