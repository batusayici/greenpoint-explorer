import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// The QA-only bay-window GLB review asset was removed (never loaded in
// production — heroAssetOptions defaults to { enabled: false } and nothing
// flips it on). Registry is intentionally empty; the binding functions below
// safely no-op until a real production asset is registered here.
const HERO_ASSET_REGISTRY = {};

const loader = new GLTFLoader();
const loadCache = new Map();

export function addFranklinHeroAssetBindings(group, options) {
  const bindings = options.facadeRecord?.detailModules?.heroAssetBindings?.bindings ?? [];
  if (!options.heroAssetOptions?.enabled || !bindings.length) return;

  for (const binding of bindings) {
    if (binding.enabled !== true || binding.qaOnly !== true) continue;
    if (binding.targetDetailModule !== "bayWindowProjection") continue;
    const registryEntry = HERO_ASSET_REGISTRY[binding.assetId];
    if (!registryEntry) continue;

    const placement = computeBayWindowAssetPlacement(binding, options);
    if (!placement) continue;

    loadHeroAsset(binding.assetId, registryEntry.url)
      .then((source) => {
        const asset = source.clone(true);
        asset.name = binding.assetId;
        asset.position.set(...placement.position);
        asset.rotation.set(...placement.rotation);
        asset.scale.set(...placement.scale);
        asset.traverse((child) => {
          child.userData.semanticId = options.facadeRecord.targetSemanticId;
          child.userData.stateRole = "franklinHeroAsset";
          child.userData.qaOnly = true;
          child.userData.assetId = binding.assetId;
          if (child.material) {
            child.material.depthTest = false;
            child.material.depthWrite = true;
            child.material.needsUpdate = true;
          }
        });
        asset.userData.semanticId = options.facadeRecord.targetSemanticId;
        asset.userData.stateRole = "franklinHeroAsset";
        asset.userData.qaOnly = true;
        asset.userData.assetId = binding.assetId;
        group.add(asset);
      })
      .catch((error) => {
        group.userData.r10HeroAssetLoadError = `${binding.assetId}: ${error.message}`;
      });
  }
}

export function isFranklinHeroAssetBindingEnabled(facadeRecord, moduleName, heroAssetOptions) {
  if (!heroAssetOptions?.enabled) return false;
  const bindings = facadeRecord?.detailModules?.heroAssetBindings?.bindings ?? [];
  return bindings.some((binding) => (
    binding.enabled === true &&
    binding.qaOnly === true &&
    binding.targetDetailModule === moduleName &&
    Boolean(HERO_ASSET_REGISTRY[binding.assetId])
  ));
}

function loadHeroAsset(assetId, url) {
  if (!loadCache.has(assetId)) {
    loadCache.set(assetId, new Promise((resolve, reject) => {
      loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
    }));
  }
  return loadCache.get(assetId);
}

function computeBayWindowAssetPlacement(binding, options) {
  const bayWindow = options.facadeRecord?.detailModules?.bayWindowProjection;
  if (!bayWindow || bayWindow.enabled === false) return null;

  const sideDepth = (options.heroOverride.sideReturn?.depthUnits ?? 0.9) * 1.12;
  const sideWallX = options.facadeXMax - 0.13;
  const depthRatio = clamp(Number(bayWindow.offsetAlongSideDepthRatio) || 0.6, 0.12, 0.88);
  const centerZ = options.recordFaceZ - options.sideOffset * sideDepth * depthRatio;
  const span = Array.isArray(bayWindow.verticalSpanRatio) ? bayWindow.verticalSpanRatio : [0.34, 0.82];
  const yMin = options.baseHeight + (options.height - options.baseHeight) * clamp(Number(span[0]) || 0.34, 0.12, 0.82);
  const yMax = options.baseHeight + (options.height - options.baseHeight) * clamp(Number(span[1]) || 0.82, 0.28, 0.96);
  const moduleHeight = Math.max(yMax - yMin, 0.32);
  const projectionDepth = clamp(Number(bayWindow.projectionDepth) || 0.26, 0.12, 0.48);
  const moduleWidth = clamp(Number(bayWindow.width) || 0.22, 0.12, 0.42);
  const sourceBoundsUnitSize = Number(binding.sourceBoundsUnitSize) || 2;
  const transform = binding.transform ?? {};
  const moduleX = sideWallX - projectionDepth * 0.5;

  return {
    position: [
      moduleX + (Number(transform.xOffset) || 0),
      yMin + moduleHeight * 0.5 + (Number(transform.yOffset) || 0),
      centerZ + (Number(transform.zOffset) || 0),
    ],
    rotation: [0, Number(transform.rotationYRadians) || 0, 0],
    scale: [
      projectionDepth * (Number(transform.xScaleMultiplier) || 1) / sourceBoundsUnitSize,
      moduleHeight * (Number(transform.yScaleMultiplier) || 1) / sourceBoundsUnitSize,
      moduleWidth * (Number(transform.zScaleMultiplier) || 1) / sourceBoundsUnitSize,
    ],
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
