# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-06-08
Creative/product/public-interface approval owner: Batu
Critical review/decision-support/brief-authoring support: ChatGPT
Execution owner inside approved boundaries: Codex

## Purpose

This file is the stable roadmap through MVP completion and the Phase 3 to Phase 4 transition. It should stay short: current phase, next task, remaining path, blockers, pending decisions, and delegated-doc pointers.

Use `docs/DOCS_INDEX.md` to route the docs tree. Use `docs/phase-4-execution-roadmap.md` as the primary Phase 4 control surface. Use `docs/MVP_SCOPE.md` for detailed MVP boundaries. Use `docs/MVP_EXECUTION_LEDGER.md` for batch records. Use `docs/CURRENT_EXECUTION_BRIEF.md` for the next Codex task only.

## Source-Of-Truth Order

Use these in order when documents conflict:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md` for Codex's next executable task only
3. `docs/PLAN.md`
4. `docs/MVP_EXECUTION_LEDGER.md`
5. Topic-specific docs when the task touches their area

`docs/archive/governance/TASKS.md` is deprecated and must not be used as an active source of truth unless `docs/CURRENT_EXECUTION_BRIEF.md` or this plan explicitly revives it.

## Current State

- Current phase: `Batch 4O-12: Existing QA Render Reconnection Boundary` is complete and verified at the Batu review gate.
- Docs authority routing: `docs/DOCS_INDEX.md`.
- Current Phase 4 control surface: `docs/phase-4-execution-roadmap.md`.
- Current next task: none; pending Batu review of the completed 4O-10 -> 4O-12 scaffold-candidate/reconnection packet.
- Pre-authorized queue: none.
- Hard stop gate: stop after 4O-12 for Batu review. Do not implement real source access, source download/cache/ingestion/conversion/render use, runtime rendering, procedural scaffold rendering, open 4J, 4K, 4L, 4M, 4N, source promotion, real imagery intake, business linkage, exact storefront/frontage/entrance/address/signage/tenant/material/active-status claims, normal-mode exposure, production use, new dependencies, credentials, paid APIs, renderer changes, architecture changes, public interfaces, module boundaries, or public/product claims without Batu approval and an updated current brief/queue.
- Updated high-level roadmap posture: Batu accepted the 4G-A/4G-B/4H-1 packet and opened a bounded Phase 4I packet for 4I-1, 4I-2, and 4I-3 only. 4I-1 defined the implementation plan. 4I-2 added a QA-only corridor facade cue fixture/verifier with 6 endpoint evidence-backed records, 36 mid-corridor insufficient-evidence records, and 100 blocked/no-evidence gaps. 4I-3 added QA-only runtime legibility for the 4I fixture while preserving normal mode. Batu then opened the narrow 4I-4 corrective batch to update stale runtime labels and reduce mid-corridor placeholder visual noise before 4J review. 4O-1 defined the first truth-first source-to-scaffold data contract for Greenpoint Ave from Manhattan Ave to Franklin Ave. 4O-2 added a planning-safe fixture-ready stub for that contract. 4O-3 defined the first deterministic scaffold-generation contract. 4O-4 added a minimal placeholder scaffold manifest. 4O-5 defined the source-adapter / fixture-ingestion boundary for future real corridor scaffold data. 4O-6 added a deterministic offline source-adapter fixture skeleton. 4O-7 normalized those offline rows into scaffold-input candidate shapes. 4O-8 added a deterministic scaffold-input fixture. 4O-9 added a QA-only non-rendering scaffold-input inspector. 4O-10 added deterministic scaffold-candidate records for building/container, grounding, and height/massing families. 4O-11 added a QA-only scaffold candidate gap/coverage report and marked the candidate set not ready for QA-only preview. 4O-12 defined the reconnection boundary for comparing or later feeding the existing QA corridor render without creating a parallel scaffold universe. Real source access/ingestion, runtime rendering, 4J storefront bay/frontage candidates, 4K business/source linkage, 4L evidence-backed QA corridor render, 4M asset registry / visual system / art-direction translation, and 4N normal-mode promotion + recognition QA remain deferred until later Batu gates.
- Truth-first hybrid priority: spatial truth first; facade recognizability second; art direction third. The 4O-1 contract preserves the future pipeline as GIS footprints/streets/heights -> procedural 3D corridor scaffold -> facade evidence/classification -> modular/manual detail overrides -> optional Blender/GLB overrides. Inked Indie / Compact Corner remains the approved visual direction, but art-direction translation is deferred until spatial recognizability is proven. Blender remains valuable as an optional enhancement/override layer, not the immediate primary production path.
- 4G-A found NYC 3D / CityGML / 3DCityDB plausible for future review-only geometry-confidence work, with source access/download/cache/ingestion/conversion/render/use still blocked behind later Batu approval. 4G-B found Mapillary/KartaView plausible for future facade evidence lane feasibility, with Mapillary authenticated API/terms review still unresolved and all real imagery access/download/cache/ingestion/render/extraction/training/use blocked. 4H-1 defined the intake workflow contract only; no real imagery intake occurred. For 4O planning, NYC Building Footprints, NYC 3-D Building Model / CityGML-style massing, CSCL, sidewalk/curb/planimetric datasets, and PLUTO/MapPLUTO are elevated as candidate spatial-truth lanes; user-supplied facade photos remain evidence-backed manual override material; Mapillary/street-level metadata remains experimental only; POI/business sources remain separate from geometry truth.
- Phase 4 execution gate: agents may execute only the current batch named in `docs/CURRENT_EXECUTION_BRIEF.md` or the next batch already named in that brief's pre-authorized queue, must use `docs/phase-4-execution-roadmap.md` as the operating plan, and must stop at hard Batu review gates instead of inventing, skipping, or opening unqueued batches.
- Phase 4O-1 has a planning/implementation note and verifier: `docs/phase-4o-1-truth-first-corridor-data-contract.md` and `scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`. It defines planning-only / fixture-ready record shapes for building footprints, street/sidewalk/curb grounding, height/massing fallback, frontage/corner classification, and manual override slots. Phase 4O-2 adds `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-2-truth-first-corridor-fixture-stub.v0.1.json` and `scripts/verify-phase-4o-2-corridor-fixture-stub.mjs` as a planning-safe source-reference-only fixture stub. Phase 4O-3 adds `docs/phase-4o-3-deterministic-scaffold-generation-contract.md` and `scripts/verify-phase-4o-3-scaffold-generation-contract.mjs` as the internal contract for deriving a placeholder scaffold manifest. Phase 4O-4 adds `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json` and `scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`. Phase 4O-5 adds `docs/phase-4o-5-source-adapter-fixture-ingestion-boundary.md` and `scripts/verify-phase-4o-5-source-adapter-boundary.mjs`. Phase 4O-6 adds `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-6-offline-source-adapter-fixture.v0.1.json` and `scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`. Phase 4O-7 adds `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-7-offline-adapter-normalization.v0.1.json` and `scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`. Phase 4O-8 adds `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-8-deterministic-scaffold-input-fixture.v0.1.json` and `scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`. Phase 4O-9 adds `docs/reports/phase-4o-9-qa-only-scaffold-input-inspector.md` and `scripts/verify-phase-4o-9-scaffold-input-inspector.mjs`. Phase 4O-10 adds `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json` and `scripts/verify-phase-4o-10-scaffold-candidates.mjs`. It does not download data, access sources, create runtime rendering, implement rendered scaffold generation, add Blender/GLB assets, add Mapillary automation, or promote claims.
- Phase 3 is closed for planning purposes after the Phase 3D corridor style matte review package.
- Phase 3D preserved review evidence remains review-only/non-production: matte asset, app surface, screenshot evidence, reference inventory, self-audit, and evidence inventory.
- Phase 4A remains a decision workflow, not a production system.
- Phase 4B now has lean planning contracts, one minimal source fixture/verifier proof, one deterministic primitive compiler/generated semantic scene manifest, one deterministic interactive 3D graybox/isometric runtime preview, one Batu-approved runtime legibility revision, one Batu-accepted source-backed context building coverage expansion, one Batu-reviewed graybox recognizability QA pass with Partial pass result, and one Batu-reviewed 4B-6R corridor frame correction with CONDITIONAL PASS.
- Phase 4C now has a docs-only recognizable facade cue plan, a completed 4C-2 geometry-only cue fixture/verifier/runtime QA overlay proof, a completed 4C-4 QA-mode/manual-draft/non-factual recognizable facade slice, and a completed 4C-5 street-feel tuning pass committed at `eaf3418`. This proves the QA-only fictional facade lane, but that lane is now closed for generic tuning.
- Phase 4D now has a completed 4D-1 review-only geometry validation/gap report and QA-mode inspector confidence visibility. It classifies the 142 rendered buildings as 126 `safe`, 14 `uncertain`, and 2 `blocked`, without attaching POIs, facade evidence, storefront anchors, source expansion, new dependencies, or production claims.
- Phase 4D now also has a completed 4D-2 claim ladder/matching contract in `docs/phase-4d-claim-ladder-matching-contract.md`, defining claim levels, evidence rules, matching rules, blocked states, and promotion gates before POIs, facade imagery, storefront anchors, or asset registry work.
- Phase 4D now also has a completed 4D-3 synthetic candidate POI QA fixture and overlay in `src/data/candidate-pois/greenpoint-ave-manhattan-to-franklin.phase-4d-candidate-pois.v0.1.json`, with QA-only runtime markers and inspector labels. It uses synthetic placeholders only and does not add real POIs, businesses, active-status truth, storefront assignments, facade imagery, source expansion, or production cards.
- Phase 4D now also has a completed 4D-4 Batu-supplied facade evidence packet in `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json`, with verifier coverage and usage/claim boundaries. It indexes 11 eligible repo-local Batu-supplied/project-owned field-photo references as review-only evidence and does not create storefront anchors, tenant frontage assignments, geometry-container associations, exact facade/signage/entrance/material/color claims, active-status claims, normal runtime rendering, production assets, asset-generation input, source expansion, scraping, live APIs, or visual-system work.
- Phase 4D now also has a completed 4D-5 corner evidence-to-geometry anchor-candidate layer in `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json`. 4D-6 reconciled moved evidence folders and added Batu-supplied Franklin evidence: 11 Manhattan evidence records, 11 Franklin evidence records, 22 QA-only unresolved anchor candidates, 0 linked candidates, 0 blocked corner scopes, and 0 mid-corridor candidates. 4D-7 added a QA-only manual association review fixture with 22 provisional records and 8 possible deterministic corner containers per corner scope. 4D-8 added a QA-only provisional shortlist with three primary provisional endpoint geometry candidates and five deferred possible containers per evidence record, while preserving 0 selected/approved/linked/authoritative associations. It does not create authoritative storefront anchors, tenant frontage assignments, exact facade/signage/entrance/material/color claims, active-status claims, production cards, normal runtime rendering, new imagery, source expansion, visual-system work, or evidence-to-geometry links.
- Phase 4E now has completed 4E-1 evidence-informed QA facade scene proof, completed 4E-2 QA facade legibility pass, completed 4E-3 endpoint corner facade composition pass, completed 4E-4 endpoint facade record separation + architectural depth correction, and completed 4E-5 opaque volumetric legibility pass in `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`, with verifier coverage and generic Three.js QA runtime rendering. 4E-5 makes the six QA-only endpoint records more opaque, enforces computed rendered gaps and opacity/hierarchy checks, hides evidence-target graybox underlays, and recaptures endpoint review screenshots while preserving evidence/synthetic-context separation. Normal mode remains unchanged; business identity, exact frontage, storefront anchors, exact facade/signage/entrance/material/color/address claims, active-status claims, production assets, public/product claims, automated image analysis, photo textures, tracing, logos, exact sign text, and source expansion remain blocked.
- Phase 4F now has completed and Batu-approved 4F-1 facade cue model hardening in the existing QA-only 4E fixture. It adds a `facadeCueModelPolicy`, stable unique facade plane IDs, streetwall slot/layout contracts, side-return/corner-wrap contracts, depth/setback/ground-contact contracts, non-claim storefront bay placeholders, status/confidence states, and verifier guardrails for slot extents, minimum rendered gaps, required evidence references, QA-only exposure, no business linkage, and no exact frontage/entrance claims. Normal mode, Mapillary/KartaView access, source expansion, business linkage, storefront anchors, exact storefront/frontage/entrance claims, production assets, public/product claims, and art-direction translation remain blocked.
- Phase 4 operating model is clarified: Batu approves packet boundaries; Codex executes inside approved boundaries without re-asking for every valid small step; Codex stops at truth gates, packet boundaries, verification failures, dirty-tree issues, unresolved ambiguity, or final review gates.
- Phase 4B visual-proof path is clarified: after an approved primitive compiler, the first visual proof must be a deterministic interactive 3D graybox/isometric corridor scene, not a static/raster/2D/manual/manifest-only substitute.

## Completed Work Pointers

- Detailed batch records: `docs/MVP_EXECUTION_LEDGER.md`
- Older batch history: `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- Detailed MVP scope and non-goals: `docs/MVP_SCOPE.md`
- Docs authority index: `docs/DOCS_INDEX.md`
- Phase 4 execution roadmap: `docs/phase-4-execution-roadmap.md`
- Phase 4O-1 truth-first corridor data contract: `docs/phase-4o-1-truth-first-corridor-data-contract.md`
- Phase 4O-2 truth-first corridor fixture stub: `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-2-truth-first-corridor-fixture-stub.v0.1.json`
- Phase 4O-3 deterministic scaffold generation contract: `docs/phase-4o-3-deterministic-scaffold-generation-contract.md`
- Phase 4O-4 placeholder scaffold manifest: `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json`
- Phase 4O-5 source-adapter / fixture-ingestion boundary: `docs/phase-4o-5-source-adapter-fixture-ingestion-boundary.md`
- Phase 4O-6 offline source-adapter fixture: `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-6-offline-source-adapter-fixture.v0.1.json`
- Phase 4O-7 offline adapter normalization: `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-7-offline-adapter-normalization.v0.1.json`
- Phase 4O-8 deterministic scaffold-input fixture: `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-8-deterministic-scaffold-input-fixture.v0.1.json`
- Phase 4O-9 QA-only scaffold-input inspector: `docs/reports/phase-4o-9-qa-only-scaffold-input-inspector.md`
- Phase 4O-10 scaffold candidates: `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-10-scaffold-candidates.v0.1.json`
- Phase 4C recognizable facade cue plan: `docs/phase-4c-recognizable-facade-cue-plan.md`
- Phase 4D claim ladder/matching contract: `docs/phase-4d-claim-ladder-matching-contract.md`
- Phase 4D candidate POI QA fixture note: `docs/phase-4d-candidate-poi-qa-fixture.md`
- Phase 4D Batu-supplied facade evidence packet note: `docs/phase-4d-batu-supplied-facade-evidence-packet.md`
- Phase 4D corner anchor-candidate note: `docs/phase-4d-corner-anchor-candidates.md`
- Phase 4D corner evidence folder reconciliation note: `docs/phase-4d-corner-evidence-folder-reconciliation.md`
- Phase 4D manual corner association review note: `docs/phase-4d-manual-corner-association-review.md`
- Phase 4D provisional corner association shortlist note: `docs/phase-4d-provisional-corner-association-shortlist.md`
- Phase 4A supporting docs: `docs/phase-4a-workflow-spike-plan.md`, `docs/phase-4a-workflow-spike-decision-matrix.md`
- Phase 4B supporting docs: `docs/phase-4b-data-to-scene-workflow.md`, `docs/phase-4b-implementation-plan.md`
- Phase 3 closeout: `docs/archive/phase-3/phase-3-closeout.md`
- Phase 3D review package: `docs/mvp-review/phase-3d-corridor-style-matte-review/`
- Phase 3 real corridor evidence inventory: `docs/phase-3-real-corridor-evidence-inventory.md`
- Phase 3 POI/business source ADR: `docs/reference/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- Brouwerij Lane source-retrieval blocker record: `docs/phase-3-brouwerij-source-retrieval-spike.md`
- Foursquare Brouwerij one-target adapter contract: `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`
- Foursquare Brouwerij credential/source blocker report: `docs/phase-3-brouwerij-foursquare-credential-blocker.md`

## Roadmap

1. Phase 3 closeout. Complete for planning purposes.
2. Phase 4 roadmap consolidation. Complete pending review.
3. Batch 4A-1: Workflow spike setup. Complete; Batu approved opening 4A-2.
4. Batch 4A-2: Deterministic compiler lane assessment. Complete; Batu approved opening 4A-3.
5. Batch 4A-3: 3D map/export shortcut assessment. Complete; Batu approved opening 4A-4.
6. Batch 4A-4: Reality-capture/reference lane assessment. Complete; Batu approved opening 4A-5.
7. Batch 4A-5: Decision gate. Complete; Batu approved opening 4B-1.
8. Batch 4B-1: Contract foundation. Complete; Batu approved opening 4B-2.
9. Batch 4B-2: Minimal source fixture + verifier. Complete; Batu approved opening 4B-3.
10. Batch 4B-3: Primitive compiler. Reviewed, approved, and closed.
11. Batch 4B-4: Runtime manifest preview. Technically complete as a runtime foundation; Batu requested a legibility revision before accepting it as a corridor-validation scene.
12. Batch 4B-4R: Runtime preview legibility pass. Batu-reviewed and approved as complete pending final repo verification.
13. Batch 4B-5: Context building coverage expansion. Batu-reviewed and accepted for purposes of opening 4B-6.
14. Batch 4B-6: Graybox corridor recognizability QA. Batu-reviewed with result: Partial pass.
15. Batch 4B-6R: Corridor frame and endpoint cue correction. Batu-reviewed with result: CONDITIONAL PASS.
16. Batch 4C-1: Recognizable facade cue planning. Complete as docs-only planning.
17. Batch 4C-2: Geometry-only facade cue fixture and QA overlay. Complete.
18. Batch 4C-4: QA-mode recognizable facade slice. Complete.
19. Batch 4C-5: QA-mode street-feel facade tuning pass. Complete and committed as `eaf3418`; no next implementation batch is open or queued.
20. Batch 4D-1: Geometry validation and gap audit. Complete and Batu-approved for purposes of opening 4D-2.
21. Batch 4D-2: Claim ladder / matching contract. Complete and Batu-approved for purposes of opening 4D-3.
22. Batch 4D-3: Candidate POI QA fixture and overlay. Complete and Batu-approved for purposes of opening 4D-4.
23. Batch 4D-4: Batu-supplied facade evidence packet. Complete and Batu-approved for purposes of opening 4D-5.
24. Batch 4D-5: Corner evidence-to-geometry anchor candidates. Complete and Batu-approved for purposes of opening 4D-6.
25. Batch 4D-6: Corner evidence folder reconciliation + Franklin evidence intake. Complete and Batu-approved for purposes of opening 4D-7.
26. Batch 4D-7: Manual corner evidence-to-geometry association review. Complete and Batu-approved for purposes of opening 4D-8.
27. Batch 4D-8: Provisional corner geometry association shortlist. Complete pending Batu review.
28. Batch 4E-1: Evidence-informed QA facade scene proof. Complete.
29. Batch 4E-2: QA facade legibility pass. Complete.
30. Batch 4E-3: Endpoint corner facade composition pass. Complete; Batu approved opening 4E-4 only.
31. Batch 4E-4: Endpoint facade record separation + architectural depth correction. Conditional pass; superseded by 4E-5 correction.
32. Batch 4E-5: Opaque volumetric legibility pass. Complete; Batu visual review PASS.
33. 4E gate: endpoint facade visual review. Cleared by Batu.
34. Batch 4F-1: Facade cue model hardening. Complete; Batu approved opening 4G.
35. 4F gate: facade cue model hardening review. Cleared by Batu.
36. 4G: External source policy and coverage audit contract. Accepted by Batu as complete.
37. 4G-A: Geometry source audit for NYC 3D / CityGML / 3DCityDB. Complete and verified; candidate geometry-confidence support only, not facade/storefront/business evidence.
38. 4G-B: Facade evidence source audit for Mapillary/KartaView. Complete and verified; candidate facade/storefront evidence only, no imagery ingestion/cache/download/render/training/production.
39. 4H-1: Facade evidence intake workflow contract. Complete and verified; workflow contract only, no real imagery intake.
40. 4I-1: Corridor facade cue expansion plan. Complete and verified.
41. 4I-2: Corridor facade cue fixture expansion. Complete and verified.
42. 4I-3: QA corridor facade render legibility pass. Complete and verified; superseded by 4I-4 corrective legibility pass.
43. 4I-4: QA corridor cue legibility correction. Complete and verified; pending Batu visual review.
44. 4O: Truth-First Procedural Corridor Scaffold. Proposed overall direction.
45. 4O-1: Truth-First Corridor Data Contract. Complete, verified, and accepted by Batu.
46. 4O-2: Truth-First Corridor Fixture Stub. Complete, verified, and accepted by Batu.
47. 4O-3: First Deterministic Scaffold Generation Contract. Complete and verified.
48. 4O-4: Minimal Placeholder Scaffold Manifest. Complete and verified.
49. 4O-5: Source Adapter And Fixture Ingestion Boundary. Complete and verified.
50. 4O-6: Offline Source Adapter Skeleton. Complete, verified, and accepted by Batu for purposes of opening the 4O-7 -> 4O-9 packet.
51. 4O-7: Offline Adapter Normalization. Complete and verified.
52. 4O-8: Deterministic Scaffold Input Fixture. Complete and verified.
53. 4O-9: QA-Only Scaffold Input Inspector. Complete, verified, and accepted by Batu for purposes of opening the 4O-10 -> 4O-12 packet.
54. 4O-10: Scaffold Candidate Generation. Complete and verified.
55. 4O-11: Scaffold Candidate QA Gap Report. Complete and verified.
56. 4O-12: Existing QA Render Reconnection Boundary. Complete and verified; stop at Batu review gate.
57. 4J: Storefront bay/frontage candidate layer. Deferred; candidate-only and QA-only until later approval after spatial scaffold review.
58. 4K: Business/source linkage. Deferred until storefront/frontage candidates and business source policy are approved.
59. 4L: Evidence-backed QA corridor render. Deferred until evidence and linkage gates support a truthful QA render.
60. 4M: Asset registry / visual system / art-direction translation. Deferred until spatial recognizability is proven and evidence/override models are defined; Qwen/Oxen may be evaluated here only as a source-safe visual-system accelerator.
61. 4N: Normal-mode promotion + recognition QA. Deferred until QA render, spatial scaffold acceptance, provenance, optional asset/art translation, and Batu promotion gates clear.

## Active Blockers

- Storefront anchoring and business-to-storefront matching are framed by 4B-1 planning contracts and enforced as blocked/no-candidate claims in the 4B-2 source fixture; they remain unresolved first-class implementation problems until approved evidence exists.
- Source/API strategy is no longer the main blocker; source access/material is. Brouwerij Lane cannot become a real corridor target until Batu supplies or approves deterministic source access/material and a later brief authorizes the evidence packet.
- Foursquare remains optional future enrichment and blocked by missing credential plus repo-recorded terms/cache/display approval.
- Mid-corridor and Franklin have sourced/contextual NYC/Open street/building geometry, but sidewalk surfaces, stylized scene projection, real storefronts, exact frontage/order, entrances, facades, address placement, business identity, active status, and raster readiness remain blocked/manual as labeled.
- 4O-10 is a QA-only scaffold-candidate fixture only. NYC Building Footprints, NYC 3-D Building Model / CityGML-style massing, CSCL, sidewalk/curb/planimetric datasets, and PLUTO/MapPLUTO remain candidate planning lanes only until Batu approves source access, download/cache/conversion, render use, dependencies, and architecture boundaries.
- "Correct geometry" is framed as confidence-labeled review of stylized/normalized geometry, not survey-grade correctness. 4D-1 made every rendered building inspectable as safe, uncertain, or blocked for later POI/facade matching.
- The 4D-2 claim ladder now defines that geometry containers, address candidates, parcel/building associations, POI candidates, tenant-at-address claims, storefront/frontage claims, entrance claims, facade/signage claims, and landmark/special-treatment claims require separate evidence and promotion gates.
- The 4D-3 candidate layer is synthetic/manual placeholder QA only. It does not prove real business identity, tenant-at-address, storefront/frontage, entrance, facade, signage, active status, or production card claims.
- The 4D-4 facade evidence packet is review-only provenance/evidence indexing only. It does not prove or create geometry-container association, storefront/frontage, entrance, facade/signage promotion, material/color, active status, tenant frontage, production assets, normal runtime rendering, or visual-system readiness.
- The 4D-8 provisional corner association shortlist is QA-only and unresolved. It prioritizes three primary provisional geometry candidates per Manhattan and Franklin evidence record, with five deferred possible containers preserved per record, but does not select, approve, link, or make any association authoritative, create storefront anchors, assign tenants/frontages, or promote any facade/signage/entrance/business/active-status/production claim.
- The 4E/4F evidence-informed facade cue layer is QA-only and manual-draft. 4E-1 proves structured endpoint evidence can alter the Three.js QA render from data, 4E-2 improves its visual legibility for review, 4E-3 composes the endpoint records into layered corner architecture, 4E-4 corrects record separation and architectural depth, 4E-5 makes the endpoint volumes more opaque and verifier-checked for rendered gaps, side returns, hierarchy, and grounding, and 4F-1 hardens the QA-only facade cue model around stable facade planes, streetwall slots, depth/setback/ground-contact contracts, and non-claim bay placeholders. It does not connect business evidence, select authoritative geometry associations, create storefront anchors, assign tenants/frontages, promote exact facade/signage/entrance/material/color/address/active-status claims, expose normal-mode rendering, create production assets, or make public/product claims.
- POI/business sources may support identity, address, category, coordinates, and possibly freshness/status, but they do not by themselves support facade, storefront/frontage/order, entrance, exact geometry, or raster readiness.
- Foursquare and local directories remain future candidate business enrichment sources only; they must not be treated as authoritative storefront assignment.
- NYC/Open geometry sources may support building/parcel/geometry context, but they do not by themselves prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, or exact address placement.
- NYC 3D / CityGML / 3DCityDB is a future geometry-confidence candidate for building heights, massing, roof volumes, block gaps, and better review-only geometry containers. It is not facade evidence and must not prove storefront frontage, entrances, tenants, signage, facade appearance, or business assignment.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material; POI data cannot infer it.
- Google/Street View must not become a default stored or derived source-of-truth asset pipeline without a separate terms/source-policy gate.
- Google 3D Tiles/Street View may be considered only as benchmark-only or narrow-exception material if a later source-policy gate allows it; it remains blocked as source-of-truth, stored facade reference, extracted geometry, texture source, training input, and production visual pipeline.
- Mapillary/KartaView are preferred external candidate imagery lanes pending source-policy approval. They are not approved primary production sources, and no imagery access, ingestion, caching, rendering, extraction, derivative use, or production use is open.
- Batu-supplied or project-owned storefront imagery remains the controlled fallback and adjudication source for Mapillary/KartaView gaps, ambiguity, or unsupported claims.
- Qwen/Oxen is deferred to the asset registry / visual-system phase as a possible accelerator trained only from owned/approved references, deterministic cue blueprints, and Batu-approved style targets; it is not an evidence source.
- Blender/GLB assets are deferred optional enhancement/override layers after the truth-first scaffold; they are not discarded, but they are no longer the immediate production bottleneck or primary scaffold source.
- Geometry-only facade/corridor cues may improve review recognizability only as status-labeled review affordances; they do not prove facade, storefront, entrance, sign, material, address, business, or landmark identity.
- Production visual assets, production asset pipeline, production architecture, public interfaces, production/public claims, broad live data, scraping, Google/Street View/3D Tiles extraction, full-neighborhood scope, dynamic spatial streaming, and deployment remain blocked.
- New packets, new phases, new claim classes, source expansion, and claim-level escalation remain Batu approval gates even though execution gates inside approved packets should be lightweight.

## Pending Decisions

- Batu visual/review gate for the completed 4I-4 correction.
- Batu review decision after the completed 4O-10 -> 4O-12 scaffold-candidate/reconnection packet.
- Batu decision on whether to open first real source fixture ingestion, request a corrective 4O boundary pass, or pause 4O.
- Batu decision on 4O source access, download/cache/conversion/render-use boundaries, source fixtures, dependencies/tooling, architecture boundaries, and spatial recognizability acceptance criteria.
- Future approved packets should state allowed scope, stop conditions, truth gates, verification expectations, commit behavior, and final review gate so Codex can self-advance only inside those boundaries.
- Conditional follow-up from 4B-6R: M-to-F and F-to-M cameras remain somewhat compressed and should be tuned in a later narrow batch only if Batu opens that scope.
- Any scope change beyond completed 4E-3, including selecting, approving, linking, or making provisional shortlist candidates authoritative, business-evidence connection, source expansion beyond what existing manifest/geometry supports, generated manifest changes, renderer expansion beyond minimal Three.js inside the existing React + Vite shell, package dependencies without explicit authorization, screenshot tooling expansion, public/runtime interface expansion, production visual assets, business verification, new APIs/scraping, real-source POI overlays, facade imagery generation, authoritative anchor/facade/storefront semantics, art direction, 4B-7 camera tuning, later 4C/4E tuning, asset registry, visual-system work, or self-advancing beyond the current review gate.
- Future Batu decision on whether any audited source should be promoted from candidate/audit status to an approved evidence or geometry-confidence source.
- Future Batu decision on whether any real source data access, download, cache, ingestion, conversion, display, render use, derivative use, extraction, training use, production use, credential, or paid API work may open.
- Future decision on whether Google 3D Tiles/Street View may be used only as benchmark-only or narrow-exception material, while preserving blocks on source-of-truth, stored facade reference, extracted geometry, texture source, training input, and production visual pipeline uses.
- Future decision on whether Qwen/Oxen belongs in 4M as a visual-system accelerator after source-safe evidence, anchors, style targets, and training/reference boundaries exist.
- Batu supply/approval of accurate facade imagery for Greenpoint Ave between Manhattan Ave and Franklin Ave where Mapillary/KartaView coverage is missing, ambiguous, unsupported, terms-blocked, or insufficient for the claim being reviewed.
- Batu approval/supply of LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, another local-directory/community source access/export, Foursquare credential/export path, or another deterministic Brouwerij POI source packet if Brouwerij is reactivated later.

## Delegated Docs

- `docs/CURRENT_EXECUTION_BRIEF.md`: next executable Codex task and operational handoff.
- `docs/phase-4-execution-roadmap.md`: primary Phase 4 operational roadmap.
- `docs/phase-4c-recognizable-facade-cue-plan.md`: Phase 4C cue taxonomy, evidence thresholds, fixture requirements, and manual review gates.
- `docs/phase-4d-claim-ladder-matching-contract.md`: Phase 4D claim ladder, evidence rules, matching rules, blocked states, and promotion gates.
- `docs/phase-4d-candidate-poi-qa-fixture.md`: Phase 4D synthetic candidate POI QA fixture shape, source/cache/display boundaries, QA behavior, and blocked claims.
- `docs/phase-4d-batu-supplied-facade-evidence-packet.md`: Phase 4D review-only facade evidence packet shape, provenance/usage boundaries, indexed repo-local evidence, and blocked claims.
- `docs/phase-4d-corner-anchor-candidates.md`: Phase 4D QA-only corner anchor-candidate shape, corner scope correction, geometry coverage, unresolved/blocked counts, and blocked claims.
- `docs/phase-4d-corner-evidence-folder-reconciliation.md`: Phase 4D-6 evidence folder reconciliation, Franklin intake, stale-path result, and deferred geometry-linking boundary.
- `docs/phase-4d-manual-corner-association-review.md`: Phase 4D-7 QA-only manual association review shape, possible corner geometry container sets, unresolved status, and blocked claims.
- `docs/phase-4d-provisional-corner-association-shortlist.md`: Phase 4D-8 QA-only provisional shortlist shape, primary candidate ranking method, unresolved status, and blocked claims.
- `docs/phase-4e-evidence-informed-qa-facade-scene-proof.md`: Phase 4E QA-only evidence-informed facade cue shape, 4E-2 legibility pass, 4E-3 endpoint corner composition pass, runtime render boundary, blocked claims, and review gate.
- `docs/phase-4f-facade-cue-model-hardening.md`: Phase 4F-1 QA-only facade cue model hardening shape, facade plane/streetwall/depth/placeholder-bay contracts, blocked claims, and review gate.
- `docs/phase-4g-external-source-policy-coverage-audit-contract.md`: Phase 4G source-lane roles, allowed/prohibited uses, review-only audit fields, acceptance criteria, and non-authorization gates for future 4G-A/4G-B work.
- `docs/MVP_SCOPE.md`: detailed MVP boundaries and non-goals.
- `docs/MVP_EXECUTION_LEDGER.md`: current ledger entries plus archived-history pointer.
- `docs/DECISION_LOG.md`: durable decision history and rationale.
- `docs/reference/DATA_SOURCES.md`, `docs/reference/PLACE_SOURCE_POLICY.md`, `docs/reference/ARCHITECTURE.md`, `docs/reference/SCENE_MANIFEST_SCHEMA.md`, and `docs/reference/PROVENANCE_AND_QA.md`: source/architecture background, subordinate to current execution controls.
- `docs/reference/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`: strategic context only; not execution authorization.
- `docs/archive/phase-2/PHASE_2_PLAN.md`, `docs/archive/governance/AGENT_HANDOFF.md`, and `docs/archive/phase-3/PHASE_3_SCALE_TEST_PLAN.md`: historical/background only.
