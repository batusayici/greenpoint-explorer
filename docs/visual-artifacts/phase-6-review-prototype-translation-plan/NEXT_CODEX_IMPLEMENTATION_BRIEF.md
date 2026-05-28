# Next Codex Implementation Brief

Copy this prompt into the next Codex implementation batch only after Batu/ChatGPT approve it as the current execution brief.

```text
You are working in /Users/batusayici/Projects/Greenpoint Explorer.

Goal:
Execute Phase 6.1 Constrained Raster Prototype Integration.

Current authority:
- docs/CURRENT_EXECUTION_BRIEF.md defines the only executable task.
- docs/approved-reference-corpus/ is the active visual reference source.
- docs/visual-artifacts/phase-6-repeatable-assetization-proof/ is the active Phase 6 proof package.
- docs/visual-artifacts/phase-6-review-prototype-translation-plan/ defines the prototype translation plan.
- docs/archive/ is historical/reference-only and must not be treated as current execution authority.

Task:
Update the existing interactive prototype so its primary world surface uses one approved Phase 6 raster proof image, while preserving existing pan, zoom, hover, click, tap, selected-card, and mobile containment behavior.

Use this primary raster plate unless blocked:
- docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/ui-integrated-recombination-v1.png

Fallback only if the primary is too busy or cannot support alignment:
- docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png

Allowed source/app files to modify:
- src/App.jsx
- src/PlaceholderWorld.jsx
- src/placeholderScene.js
- src/styles.css

Allowed asset action:
- Copy exactly one Phase 6 generated PNG into src/assets/review-only/ if the app needs a served local raster asset.
- Do not move, overwrite, or edit the original Phase 6 generated image.
- Label the copied asset as review-only in implementation notes or nearby code comments if a comment is useful.

Do not modify:
- package files
- build/config/CI
- backend/CMS/persistence/analytics/deployment files
- docs/approved-reference-corpus/
- original Phase 6 proof files or generated images
- docs/archive/
- generated images or screenshots except for new review screenshots requested below

Implementation requirements:
- Use the raster as the primary world surface.
- Do not draw storefronts, facades, awnings, sign bands, props, sidewalk/curb texture, or primary world art with SVG, CSS, DOM, canvas, or primitive code shapes.
- Preserve existing pan/zoom and pointer/touch interaction behavior.
- Define 3-5 fictional-safe interactive targets aligned to visible storefront areas in the raster.
- Use fictional placeholder place labels only. No real businesses, no exact addresses, no factual place copy, no exact facades, no exact station geometry, no live data.
- Implement or preserve selected marker, selected building treatment, tether/card attachment, compact place card, compact controls, and optional compact place index using the approved corpus and Phase 6 rules.
- Keep product-facing UI aligned with ARC-002, ARC-003, ARC-024, and ARC-029.
- Keep world/raster alignment aligned with ARC-020, ARC-023, ARC-028, and the selected Phase 6 raster.
- Keep QA/review-only labels visually secondary and separate from normal UI.
- Do not create a production asset pipeline, public module/interface contract, real data system, new renderer, routing, backend, CMS, persistence, analytics, deployment, or broad map coverage.

Before coding, state:
- whether public interfaces or module boundaries will change; expected answer should be none
- files expected to be touched
- feedback loop and screenshot evidence to verify
- decisions still reserved for Batu

Verification:
- Start or use the existing local dev server if needed.
- Use the browser to capture review screenshots:
  - desktop default overview
  - desktop hover/focus state
  - desktop selected card state
  - mobile selected-state containment
  - pan/zoom stress view
- Save screenshots under:
  docs/review-screenshots/phase-6-1-constrained-raster-prototype-integration/
- Run the fastest available app check. If no formal test/lint command exists or dependencies are unavailable, report that clearly.
- Run git diff --stat.
- Run git status --short.

Stop conditions:
- The Phase 6 raster image cannot be found.
- The raster cannot be loaded without package/build changes.
- Existing interactions cannot be preserved within the allowed files.
- Alignment would require code-drawn storefronts or primary world art.
- A public-interface/module-boundary change appears necessary.
- The implementation would require package/build/config/CI changes, a new renderer, routing, live data, backend, CMS, persistence, analytics, deployment, real business data, exact addresses, factual card copy, exact facades, or exact station geometry.
- The normal UI would drift toward Phase 5.2 beige QA-harness styling.

Final response must include:
- files changed
- copied raster asset path, if any
- screenshots created
- verification performed
- confirmation that existing interactions were preserved
- confirmation that no source-of-truth docs, approved corpus files, original Phase 6 images, archived folders, package files, build/config/CI files, backend/CMS/persistence/analytics/deployment files were modified
- git diff --stat
- git status --short
- no commit
- do not stage
```
