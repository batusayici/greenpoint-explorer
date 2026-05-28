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
      summary: "Warm counter, morning queue, chalkboard menu.",
      description:
        "A compact fictional bakery stop for testing how a selected card can feel useful without claiming a real place.",
      tags: ["morning stop", "striped awning", "fictional"],
      disclaimer: "Non-production / review-only placeholder. Fictional name and copy.",
      marker: {
        x: 782,
        y: 248,
      },
      bounds: {
        x: 600,
        y: 208,
        width: 210,
        height: 284,
      },
    },
    {
      id: "mica-repair",
      title: "Mica Repair",
      label: "Review-only fictional storefront",
      category: "Repair shop",
      summary: "Blue sign, narrow bay, tool-drawer energy.",
      description:
        "A fictional repair bay that keeps the left edge of the scene browsable during hover, focus, and card switching.",
      tags: ["service bay", "blue sign", "fictional"],
      disclaimer: "Non-production / review-only placeholder. Not a real place.",
      marker: {
        x: 302,
        y: 300,
      },
      bounds: {
        x: 140,
        y: 312,
        width: 210,
        height: 300,
      },
    },
    {
      id: "lark-goods",
      title: "Lark Goods",
      label: "Review-only fictional storefront",
      category: "Home goods",
      summary: "Green awning, stacked planters, small shelf finds.",
      description:
        "A fictional home-goods stop that tests readable browsing across a dense center-left storefront.",
      tags: ["green awning", "plants", "review-only"],
      disclaimer: "Non-production / review-only placeholder. No factual place copy.",
      marker: {
        x: 548,
        y: 292,
      },
      bounds: {
        x: 372,
        y: 258,
        width: 210,
        height: 308,
      },
    },
    {
      id: "static-cycle",
      title: "Static Cycle",
      label: "Review-only fictional storefront",
      category: "Cycle shop",
      summary: "Dark storefront, roll gate, curbside bike pause.",
      description:
        "A fictional cycle-shop target for checking selected treatment over darker painted areas and busy sidewalk detail.",
      tags: ["dark facade", "bike stop", "placeholder"],
      disclaimer: "Non-production / review-only placeholder. Temporary local metadata.",
      marker: {
        x: 1086,
        y: 260,
      },
      bounds: {
        x: 890,
        y: 208,
        width: 230,
        height: 302,
      },
    },
    {
      id: "paper-vale",
      title: "Paper Vale",
      label: "Review-only fictional storefront",
      category: "Books and prints",
      summary: "Corner browsing, paper signs, window stacks.",
      description:
        "A fictional books-and-prints stop that keeps the far-right storefront usable on desktop and mobile.",
      tags: ["window stacks", "right edge", "temporary"],
      disclaimer: "Non-production / review-only placeholder. Not factual place information.",
      marker: {
        x: 1278,
        y: 258,
      },
      bounds: {
        x: 1128,
        y: 180,
        width: 208,
        height: 328,
      },
    },
  ],
};
