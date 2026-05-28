// Review-only Phase 6 raster copy; source proof remains unchanged in docs/.
import scenePlateSrc from "./assets/review-only/phase-6-1-ui-integrated-recombination-review-only.png";

export const placeholderScene = {
  title: "Review-only raster exploration slice",
  note: "Review-only local prototype using a Phase 6 raster proof plate. Fictional targets, placeholder data, no real businesses, addresses, or factual place copy.",
  size: {
    width: 1536,
    height: 1024,
  },
  reviewLabel: "NON-PRODUCTION / REVIEW ONLY",
  plate: {
    src: scenePlateSrc,
    label: "Phase 6 review-only raster proof. Non-production and not factual Greenpoint representation.",
  },
  targets: [
    {
      id: "dawn-loaf",
      title: "Dawn Loaf",
      label: "Review-only fictional storefront",
      category: "Bakery",
      description:
        "A fictional storefront target used to test browsing, selected cards, and target-to-scene attachment on the Phase 6 raster plate.",
      tags: ["storefront", "awning", "fictional"],
      disclaimer: "Non-production / review-only placeholder. Fictional name and copy.",
      bounds: {
        x: 592,
        y: 236,
        width: 214,
        height: 258,
      },
    },
    {
      id: "mica-repair",
      title: "Mica Repair",
      label: "Review-only fictional storefront",
      category: "Repair shop",
      description:
        "A fictional left storefront target for checking hover, focus, and card switching across the raster scene.",
      tags: ["left bay", "repair", "fictional"],
      disclaimer: "Non-production / review-only placeholder. Not a real place.",
      bounds: {
        x: 128,
        y: 348,
        width: 210,
        height: 262,
      },
    },
    {
      id: "lark-goods",
      title: "Lark Goods",
      label: "Review-only fictional storefront",
      category: "Home goods",
      description:
        "A fictional awning storefront target mapped to a center-left building zone for multi-target exploration review.",
      tags: ["green awning", "browse target", "review-only"],
      disclaimer: "Non-production / review-only placeholder. No factual place copy.",
      bounds: {
        x: 362,
        y: 298,
        width: 208,
        height: 284,
      },
    },
    {
      id: "static-cycle",
      title: "Static Cycle",
      label: "Review-only fictional storefront",
      category: "Cycle shop",
      description:
        "A fictional roll-gate storefront target used to test selected treatment over darker painted facade areas.",
      tags: ["roll gate", "right bay", "placeholder"],
      disclaimer: "Non-production / review-only placeholder. Temporary local metadata.",
      bounds: {
        x: 882,
        y: 246,
        width: 228,
        height: 266,
      },
    },
    {
      id: "paper-vale",
      title: "Paper Vale",
      label: "Review-only fictional storefront",
      category: "Books and prints",
      description:
        "A fictional right storefront target used to check compact place browsing near the edge of the raster composition.",
      tags: ["storefront", "right edge", "temporary"],
      disclaimer: "Non-production / review-only placeholder. Not factual place information.",
      bounds: {
        x: 1130,
        y: 216,
        width: 176,
        height: 292,
      },
    },
  ],
};
