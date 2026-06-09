// QA-only Franklin hero kit extraction for Phase 4M-R7.
// Runtime supplies measured placement; this module owns Franklin visual fidelity authoring.

export function addFranklinHeroCorner(group, options) {
  const { heroOverride } = options;
  if (!heroOverride?.heroFidelityLayer && !heroOverride?.hybridHeroLayer) return;

  if (heroOverride.heroFidelityLayer) {
    addFranklinHeroFidelityLayer(group, options);
  }

  if (heroOverride.hybridHeroLayer) {
    addFranklinHybridHeroOverlay(group, options);
  }
}

function addFranklinHeroFidelityLayer(group, { heroOverride, materials, length, plane, height, baseHeight, z, sideOffset, depth, frontZ, baySpans, addBox, addCylinder }) {
  const upperHeight = Math.max(height - baseHeight, 0.18);
  const centerX = plane.xMin + length / 2;
  const hero = { addBox, addCylinder, opaque: true, depthTest: false, renderOrder: 12 };
  const soft = { addBox, addCylinder, opaque: false, depthTest: false, renderOrder: 11 };
  const masonryZ = frontZ + sideOffset * 0.22;

  addHeroFidelityBox(group, {
    color: 0x8f4538,
    opacity: 1,
    position: [centerX, baseHeight + upperHeight * 0.5, masonryZ],
    size: [length * 0.86, upperHeight * 0.92, 0.042],
    ...hero,
  });
  addHeroFidelityBox(group, {
    color: 0x643129,
    opacity: 1,
    position: [plane.xMin + length * 0.035, height * 0.49, masonryZ + sideOffset * 0.008],
    size: [length * 0.06, height * 0.9, 0.05],
    ...hero,
  });
  addHeroFidelityBox(group, {
    color: 0x6f332b,
    opacity: 1,
    position: [plane.xMax - length * 0.04, height * 0.52, masonryZ + sideOffset * 0.012],
    size: [length * 0.07, height * 0.96, 0.06],
    ...hero,
  });

  addHeroBrickRelief(group, { materials, length, plane, height, baseHeight, frontZ: masonryZ, sideOffset, layer: hero });
  addHeroCorniceModule(group, { materials, length, plane, height, frontZ: masonryZ, sideOffset, layer: hero });
  addHeroRoofInsetModule(group, { materials, length, plane, height, z, sideOffset, depth, layer: hero });

  const upper = heroOverride.upperWindows;
  const windowCenters = getRatioCenters(plane, length, normalizeCadence(upper.bayRatios)).slice(0, 6);
  const upperTop = height - Math.max(height * 0.18, 0.18);
  const upperBottom = baseHeight + Math.max(upperHeight * 0.18, 0.12);
  const rowGap = (upperTop - upperBottom) / 2;
  for (let row = 0; row < 3; row += 1) {
    const y = upperBottom + rowGap * row;
    for (let index = 0; index < windowCenters.length; index += 1) {
      const segment = windowCenters[index];
      addHeroWindowModule(group, {
        x: segment.center,
        y,
        z: masonryZ + sideOffset * 0.058,
        width: Math.max(Math.min(segment.width * 0.34, 0.13), 0.06),
        height: row === 2 ? 0.18 : 0.16,
        archTop: row === 2,
        ac: row === 0 && [1, 3, 5].includes(index),
        materials,
        sideOffset,
        layer: hero,
      });
    }
  }

  addHeroStorefrontModule(group, { materials, baySpans, baseHeight, frontZ, sideOffset, layer: hero });
  addHeroSideReturnModule(group, { heroOverride, materials, length, plane, height, baseHeight, z, sideOffset, frontZ, layer: hero });
  addHeroStreetGroundingModule(group, { materials, length, plane, z, sideOffset, frontZ, layer: hero, softLayer: soft });
}

function addHeroBrickRelief(group, { materials, length, plane, height, baseHeight, frontZ, sideOffset, layer }) {
  const rowCount = 18;
  for (let row = 0; row < rowCount; row += 1) {
    const y = baseHeight + (height - baseHeight) * (0.05 + row * 0.049);
    if (y > height * 0.94) break;
    addHeroFidelityBox(group, {
      color: row % 2 ? 0xad5a45 : materials.mortarLine,
      opacity: row % 2 ? 0.36 : 0.58,
      position: [plane.xMin + length / 2, y, frontZ + sideOffset * 0.02],
      size: [length * 0.78, 0.006, 0.022],
      ...layer,
    });
    const tickCount = 7;
    for (let tick = 0; tick < tickCount; tick += 1) {
      if ((tick + row) % 2) continue;
      addHeroFidelityBox(group, {
        color: 0x6d352e,
        opacity: 0.34,
        position: [plane.xMin + length * (0.17 + tick * 0.1), y + 0.018, frontZ + sideOffset * 0.027],
        size: [length * 0.018, 0.012, 0.018],
        ...layer,
      });
    }
  }
}

function addHeroCorniceModule(group, { materials, length, plane, height, frontZ, sideOffset, layer }) {
  const centerX = plane.xMin + length / 2;
  const bands = [
    { y: height + 0.005, h: 0.045, z: 0.045, w: 1.0, color: 0xb49c73 },
    { y: height + 0.07, h: 0.045, z: 0.08, w: 1.08, color: materials.stoneCornice },
    { y: height + 0.135, h: 0.042, z: 0.12, w: 1.0, color: 0xf0dda6 },
  ];
  for (const band of bands) {
    addHeroFidelityBox(group, {
      color: band.color,
      opacity: 1,
      position: [centerX, band.y, frontZ + sideOffset * band.z],
      size: [length * band.w, band.h, 0.07 + band.z],
      ...layer,
    });
  }
  const dentilCount = 18;
  for (let index = 0; index < dentilCount; index += 1) {
    if (index % 2) continue;
    addHeroFidelityBox(group, {
      color: 0x7d6a50,
      opacity: 1,
      position: [plane.xMin + length * (0.04 + index / dentilCount * 0.92), height + 0.038, frontZ + sideOffset * 0.17],
      size: [length * 0.025, 0.035, 0.045],
      ...layer,
    });
  }
}

function addHeroRoofInsetModule(group, { materials, length, plane, height, z, sideOffset, depth, layer }) {
  const centerX = plane.xMin + length / 2;
  addHeroFidelityBox(group, {
    color: materials.roof ?? 0x403d38,
    opacity: 1,
    position: [centerX, height + 0.09, z - sideOffset * depth * 0.18],
    size: [length * 0.72, 0.035, depth * 0.72],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x2c2b28,
    opacity: 1,
    position: [centerX, height + 0.125, z - sideOffset * depth * 0.18],
    size: [length * 0.55, 0.018, depth * 0.5],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x2e302d,
    opacity: 1,
    position: [centerX + length * 0.06, height + 0.17, z - sideOffset * depth * 0.11],
    size: [0.1, 0.055, 0.08],
    ...layer,
  });
}

function addHeroWindowModule(group, { x, y, z, width, height, archTop, ac, materials, sideOffset, layer }) {
  addHeroFidelityBox(group, {
    color: 0x251f1d,
    opacity: 1,
    position: [x, y, z],
    size: [width * 1.42, height * 1.48, 0.048],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.glass,
    opacity: 1,
    position: [x, y + height * 0.02, z + sideOffset * 0.027],
    size: [width, height * 1.02, 0.04],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x19201f,
    opacity: 1,
    position: [x, y + height * 0.02, z + sideOffset * 0.052],
    size: [width * 0.08, height * 0.94, 0.028],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.stoneCornice,
    opacity: 1,
    position: [x, y - height * 0.68, z + sideOffset * 0.058],
    size: [width * 1.45, 0.03, 0.052],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: archTop ? 0x744135 : materials.stoneCornice,
    opacity: 1,
    position: [x, y + height * 0.72, z + sideOffset * 0.056],
    size: [width * (archTop ? 1.2 : 1.42), archTop ? 0.05 : 0.03, 0.048],
    ...layer,
  });
  if (ac) {
    addHeroFidelityBox(group, {
      color: 0xd9d7cd,
      opacity: 1,
      position: [x + width * 0.42, y - height * 0.78, z + sideOffset * 0.09],
      size: [width * 0.55, 0.045, 0.055],
      ...layer,
    });
    addHeroFidelityBox(group, {
      color: 0x7f8580,
      opacity: 1,
      position: [x + width * 0.42, y - height * 0.78, z + sideOffset * 0.123],
      size: [width * 0.36, 0.018, 0.018],
      ...layer,
    });
  }
}

function addHeroStorefrontModule(group, { materials, baySpans, baseHeight, frontZ, sideOffset, layer }) {
  if (!baySpans.length) return;
  const xMin = baySpans[1]?.xMin ?? baySpans[0].xMin;
  const xMax = baySpans[5]?.xMax ?? baySpans[baySpans.length - 1].xMax;
  const centerX = (xMin + xMax) / 2;
  const width = xMax - xMin;
  const shopZ = frontZ + sideOffset * 0.34;

  addHeroFidelityBox(group, {
    color: 0x1a1d1c,
    opacity: 1,
    position: [centerX, baseHeight * 0.38, shopZ],
    size: [width * 0.98, baseHeight * 0.74, 0.08],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0xb98558,
    opacity: 1,
    position: [centerX, baseHeight * 1.02, shopZ + sideOffset * 0.03],
    size: [width * 0.96, baseHeight * 0.17, 0.095],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.greenSign,
    opacity: 1,
    position: [centerX - width * 0.03, baseHeight * 1.055, shopZ + sideOffset * 0.08],
    size: [width * 0.34, baseHeight * 0.09, 0.045],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.blackCanopy,
    opacity: 1,
    position: [centerX, baseHeight * 0.73, shopZ + sideOffset * 0.18],
    size: [width * 0.98, baseHeight * 0.11, 0.32],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x070808,
    opacity: 1,
    position: [centerX, baseHeight * 0.64, shopZ + sideOffset * 0.34],
    size: [width * 0.96, baseHeight * 0.035, 0.18],
    ...layer,
  });

  for (const bay of baySpans.slice(1, 6)) {
    const paneCount = Math.max(1, bay.glassBeats ?? 1);
    for (let pane = 0; pane < paneCount; pane += 1) {
      const paneWidth = bay.width * 0.62 / paneCount;
      const x = bay.center - bay.width * 0.25 + pane * paneWidth + paneWidth / 2;
      const isDoor = bay.door && (pane === paneCount - 1 || bay.door === "center");
      addHeroStorefrontPane(group, {
        x,
        y: isDoor ? baseHeight * 0.35 : baseHeight * 0.42,
        z: shopZ + sideOffset * 0.12,
        width: isDoor ? paneWidth * 0.7 : paneWidth * 0.78,
        height: isDoor ? baseHeight * 0.58 : baseHeight * 0.38,
        door: Boolean(isDoor),
        materials,
        sideOffset,
        layer,
      });
    }
    addHeroFidelityBox(group, {
      color: 0x101313,
      opacity: 1,
      position: [bay.xMin, baseHeight * 0.43, shopZ + sideOffset * 0.18],
      size: [0.026, baseHeight * 0.78, 0.08],
      ...layer,
    });
  }
}

function addHeroStorefrontPane(group, { x, y, z, width, height, door, materials, sideOffset, layer }) {
  addHeroFidelityBox(group, {
    color: 0x0b0d0d,
    opacity: 1,
    position: [x, y, z],
    size: [width * 1.22, height * 1.1, 0.05],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: door ? 0x141b1a : 0x8fb0a3,
    opacity: 1,
    position: [x, y, z + sideOffset * 0.035],
    size: [width, height, 0.04],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.trim,
    opacity: 1,
    position: [x, y, z + sideOffset * 0.065],
    size: [0.012, height * 0.9, 0.026],
    ...layer,
  });
  if (!door) {
    addHeroFidelityBox(group, {
      color: 0xdfe8d8,
      opacity: 0.76,
      position: [x - width * 0.18, y + height * 0.22, z + sideOffset * 0.078],
      size: [width * 0.22, height * 0.035, 0.018],
      ...layer,
    });
  }
}

function addHeroSideReturnModule(group, { heroOverride, materials, length, plane, height, baseHeight, z, sideOffset, frontZ, layer }) {
  const side = heroOverride.sideReturn;
  const sideWallX = plane.xMax - 0.085;
  const sideDepth = side.depthUnits * 0.9;
  const sideCenterZ = frontZ - sideOffset * sideDepth * 0.47;

  addHeroFidelityBox(group, {
    color: 0x6d322c,
    opacity: 1,
    position: [sideWallX, height * 0.53, sideCenterZ],
    size: [0.08, height * 0.92, sideDepth],
    ...layer,
  });
  for (let row = 0; row < 3; row += 1) {
    const y = baseHeight + (height - baseHeight) * (0.24 + row * 0.21);
    for (let col = 0; col < 4; col += 1) {
      const wz = frontZ - sideOffset * sideDepth * (0.18 + col * 0.17);
      addHeroSideWindow(group, {
        x: sideWallX - 0.05,
        y,
        z: wz,
        materials,
        sideOffset,
        ac: row === 0 && [0, 2].includes(col),
        layer,
      });
    }
  }
  addHeroFidelityBox(group, {
    color: materials.tanSign,
    opacity: 1,
    position: [sideWallX - 0.045, baseHeight * 0.96, frontZ - sideOffset * sideDepth * 0.23],
    size: [0.08, baseHeight * 0.14, sideDepth * 0.45],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.blackCanopy,
    opacity: 1,
    position: [sideWallX - 0.075, baseHeight * 0.72, frontZ - sideOffset * sideDepth * 0.23],
    size: [0.16, baseHeight * 0.09, sideDepth * 0.46],
    ...layer,
  });
  addHeroSideBayModule(group, { x: sideWallX - 0.16, y: height * 0.56, z: frontZ - sideOffset * sideDepth * 0.62, materials, sideOffset, layer });
  addHeroFireEscapeModule(group, { x: sideWallX - 0.22, baseHeight, height, z: frontZ - sideOffset * sideDepth * 0.76, materials, sideOffset, layer });
  addHeroFidelityBox(group, {
    color: materials.stoneCornice,
    opacity: 1,
    position: [sideWallX - 0.025, height + 0.09, sideCenterZ],
    size: [0.105, 0.06, sideDepth],
    ...layer,
  });
}

function addHeroSideWindow(group, { x, y, z, materials, sideOffset, ac, layer }) {
  addHeroFidelityBox(group, {
    color: 0x221f1d,
    opacity: 1,
    position: [x, y, z],
    size: [0.05, 0.16, 0.075],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.glass,
    opacity: 1,
    position: [x - 0.028, y, z],
    size: [0.036, 0.12, 0.055],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.stoneCornice,
    opacity: 1,
    position: [x - 0.035, y - 0.08, z],
    size: [0.028, 0.024, 0.085],
    ...layer,
  });
  if (ac) {
    addHeroFidelityBox(group, {
      color: 0xdcdad0,
      opacity: 1,
      position: [x - 0.06, y - 0.095, z + sideOffset * 0.008],
      size: [0.055, 0.042, 0.06],
      ...layer,
    });
  }
}

function addHeroSideBayModule(group, { x, y, z, materials, sideOffset, layer }) {
  addHeroFidelityBox(group, {
    color: materials.sideBay ?? 0x735b44,
    opacity: 1,
    position: [x, y, z],
    size: [0.22, 0.58, 0.24],
    ...layer,
  });
  for (let row = 0; row < 3; row += 1) {
    addHeroFidelityBox(group, {
      color: 0x1f2422,
      opacity: 1,
      position: [x - 0.09, y - 0.2 + row * 0.2, z + sideOffset * 0.055],
      size: [0.04, 0.13, 0.055],
      ...layer,
    });
    addHeroFidelityBox(group, {
      color: materials.glass,
      opacity: 1,
      position: [x - 0.118, y - 0.2 + row * 0.2, z + sideOffset * 0.06],
      size: [0.026, 0.1, 0.04],
      ...layer,
    });
  }
}

function addHeroFireEscapeModule(group, { x, baseHeight, height, z, materials, sideOffset, layer }) {
  const railColor = materials.fireEscape ?? 0x111414;
  for (let row = 0; row < 3; row += 1) {
    const y = baseHeight + (height - baseHeight) * (0.22 + row * 0.2);
    addHeroFidelityBox(group, {
      color: railColor,
      opacity: 1,
      position: [x, y - 0.05, z],
      size: [0.028, 0.022, 0.28],
      ...layer,
    });
    for (let post = 0; post < 3; post += 1) {
      addHeroFidelityBox(group, {
        color: railColor,
        opacity: 1,
        position: [x, y + 0.015, z - sideOffset * (0.1 - post * 0.1)],
        size: [0.02, 0.14, 0.016],
        ...layer,
      });
    }
  }
}

function addHeroStreetGroundingModule(group, { materials, length, plane, z, sideOffset, frontZ, layer, softLayer }) {
  const centerX = plane.xMin + length / 2;
  const sidewalkZ = z + sideOffset * 0.28;
  const curbZ = z + sideOffset * 0.68;
  const roadZ = z + sideOffset * 0.92;
  addHeroFidelityBox(group, {
    color: 0xa6ada5,
    opacity: 1,
    position: [centerX, 0.055, sidewalkZ],
    size: [length * 1.18, 0.035, 0.58],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.curb,
    opacity: 1,
    position: [centerX, 0.078, curbZ],
    size: [length * 1.2, 0.04, 0.08],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x181f1e,
    opacity: 0.88,
    position: [centerX, 0.018, roadZ],
    size: [length * 1.32, 0.022, 0.62],
    ...softLayer,
  });
  for (let index = 0; index < 8; index += 1) {
    addHeroFidelityBox(group, {
      color: 0x5e6661,
      opacity: 0.5,
      position: [plane.xMin + length * (0.08 + index * 0.12), 0.084, sidewalkZ],
      size: [0.01, 0.012, 0.5],
      ...layer,
    });
  }
  for (let index = 0; index < 7; index += 1) {
    addHeroFidelityBox(group, {
      color: materials.curb,
      opacity: 1,
      position: [plane.xMin + length * (0.1 + index * 0.08), 0.086, roadZ + sideOffset * (0.02 + index * 0.025)],
      size: [length * 0.06, 0.025, 0.15],
      ...layer,
    });
  }
  addHeroFidelityBox(group, {
    color: materials.tactilePaving ?? 0xb5554e,
    opacity: 1,
    position: [plane.xMax - length * 0.12, 0.096, curbZ - sideOffset * 0.1],
    size: [length * 0.11, 0.018, 0.09],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.objectGreen ?? 0x6f8c56,
    opacity: 1,
    position: [plane.xMax - length * 0.34, 0.23, frontZ + sideOffset * 0.3],
    size: [0.13, 0.32, 0.035],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.objectSticker ?? 0xd9d1b9,
    opacity: 1,
    position: [plane.xMax - length * 0.16, 0.18, frontZ + sideOffset * 0.36],
    size: [0.13, 0.25, 0.11],
    ...layer,
  });
  addHeroFidelityCylinder(group, {
    color: 0x151817,
    opacity: 1,
    position: [plane.xMin + length * 0.08, 0.52, frontZ + sideOffset * 0.48],
    radius: 0.018,
    height: 1.04,
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0xd1a13e,
    opacity: 1,
    position: [plane.xMin + length * 0.08, 0.86, frontZ + sideOffset * 0.52],
    size: [0.075, 0.15, 0.055],
    ...layer,
  });
  const bikeBaseX = plane.xMax + length * 0.02;
  const bikeZ = z - sideOffset * 0.44;
  for (let index = 0; index < 2; index += 1) {
    addHeroFidelityCylinder(group, {
      color: materials.trim,
      opacity: 1,
      position: [bikeBaseX + index * 0.11, 0.12, bikeZ - sideOffset * index * 0.05],
      radius: 0.042,
      height: 0.012,
      ...layer,
    });
    addHeroFidelityBox(group, {
      color: materials.trim,
      opacity: 1,
      position: [bikeBaseX + 0.05 + index * 0.11, 0.16, bikeZ - sideOffset * (0.02 + index * 0.05)],
      size: [0.11, 0.016, 0.02],
      ...layer,
    });
  }
}

function addFranklinHybridHeroOverlay(group, { heroOverride, materials, length, plane, height, baseHeight, z, sideOffset, depth, frontZ, baySpans, addBox, addCylinder }) {
  const shell = { addBox, addCylinder, opaque: false, depthTest: false, renderOrder: 16 };
  const hybrid = { addBox, addCylinder, opaque: false, depthTest: false, renderOrder: 22 };
  const soft = { addBox, addCylinder, opaque: false, depthTest: false, renderOrder: 17 };
  const upperHeight = Math.max(height - baseHeight, 0.18);
  const centerX = plane.xMin + length / 2;
  const faceZ = frontZ + sideOffset * 0.56;
  const side = heroOverride.sideReturn;
  const sideDepth = side.depthUnits * 1.02;
  const sideWallX = plane.xMax - length * 0.045;
  const sideCenterZ = frontZ - sideOffset * sideDepth * 0.43;

  addHybridFusedMassingShell(group, { materials, length, plane, height, baseHeight, upperHeight, centerX, faceZ, sideOffset, sideWallX, sideCenterZ, sideDepth, layer: shell });
  addHybridCorniceRoofBox(group, { materials, length, plane, height, centerX, z, depth, faceZ, sideOffset, sideWallX, sideCenterZ, sideDepth, layer: hybrid });
  addHybridBrickWindowStack(group, { materials, length, plane, height, baseHeight, upperHeight, faceZ, sideOffset, layer: hybrid });
  addHybridWrappedStorefront(group, { materials, baySpans, baseHeight, faceZ, sideOffset, sideWallX, sideCenterZ, sideDepth, layer: hybrid, softLayer: soft });
  addHybridSideReturnGrammar(group, { materials, height, baseHeight, sideOffset, sideWallX, sideCenterZ, sideDepth, frontZ, layer: hybrid });
  addHybridStreetGroundingKit(group, { materials, length, plane, z, frontZ, sideOffset, layer: hybrid, softLayer: soft });
}

function addHybridFusedMassingShell(group, { materials, length, plane, height, baseHeight, upperHeight, centerX, faceZ, sideOffset, sideWallX, sideCenterZ, sideDepth, layer }) {
  addHeroFidelityBox(group, {
    color: 0x944638,
    opacity: 1,
    position: [centerX, baseHeight + upperHeight * 0.49, faceZ],
    size: [length * 1.03, upperHeight * 0.98, 0.068],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x7a362e,
    opacity: 1,
    position: [sideWallX, height * 0.52, sideCenterZ],
    size: [0.11, height * 0.96, sideDepth],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x5f2c27,
    opacity: 1,
    position: [plane.xMin - length * 0.015, height * 0.5, faceZ + sideOffset * 0.018],
    size: [length * 0.055, height * 0.93, 0.07],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x6a3029,
    opacity: 1,
    position: [plane.xMax - length * 0.01, height * 0.51, faceZ + sideOffset * 0.02],
    size: [length * 0.06, height * 0.98, 0.075],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x3b2420,
    opacity: 1,
    position: [centerX, baseHeight - 0.025, faceZ + sideOffset * 0.035],
    size: [length * 1.02, 0.055, 0.085],
    ...layer,
  });
  for (let row = 0; row < 14; row += 1) {
    const y = baseHeight + upperHeight * (0.08 + row * 0.061);
    addHeroFidelityBox(group, {
      color: row % 3 === 0 ? 0xbf765d : materials.mortarLine,
      opacity: row % 3 === 0 ? 0.38 : 0.52,
      position: [centerX, y, faceZ + sideOffset * 0.044],
      size: [length * 0.9, 0.008, 0.028],
      ...layer,
    });
  }
}

function addHybridCorniceRoofBox(group, { materials, length, plane, height, centerX, z, depth, faceZ, sideOffset, sideWallX, sideCenterZ, sideDepth, layer }) {
  const bands = [
    { y: height + 0.015, h: 0.045, w: 1.12, d: 0.14, color: 0x6d6252 },
    { y: height + 0.075, h: 0.052, w: 1.18, d: 0.2, color: materials.stoneCornice },
    { y: height + 0.142, h: 0.045, w: 1.08, d: 0.24, color: 0xf0dfb1 },
    { y: height + 0.2, h: 0.038, w: 1.0, d: 0.18, color: 0xc8b27c },
  ];
  for (const band of bands) {
    addHeroFidelityBox(group, {
      color: band.color,
      opacity: 1,
      position: [centerX, band.y, faceZ + sideOffset * band.d],
      size: [length * band.w, band.h, 0.075 + band.d],
      ...layer,
    });
  }
  for (let index = 0; index < 20; index += 1) {
    if (index % 2) continue;
    addHeroFidelityBox(group, {
      color: 0x7a6b50,
      opacity: 1,
      position: [plane.xMin + length * (0.03 + index * 0.047), height + 0.055, faceZ + sideOffset * 0.265],
      size: [length * 0.026, 0.04, 0.055],
      ...layer,
    });
  }
  addHeroFidelityBox(group, {
    color: materials.roof ?? 0x3a3833,
    opacity: 1,
    position: [centerX, height + 0.16, z - sideOffset * depth * 0.26],
    size: [length * 0.88, 0.032, depth * 0.88],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x2b2c28,
    opacity: 1,
    position: [centerX, height + 0.205, z - sideOffset * depth * 0.18],
    size: [length * 0.62, 0.018, depth * 0.62],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.stoneCornice,
    opacity: 1,
    position: [sideWallX - length * 0.01, height + 0.115, sideCenterZ],
    size: [0.115, 0.06, sideDepth * 1.04],
    ...layer,
  });
}

function addHybridBrickWindowStack(group, { materials, length, plane, height, baseHeight, upperHeight, faceZ, sideOffset, layer }) {
  const columns = [0.12, 0.27, 0.42, 0.57, 0.72, 0.87];
  const rowYs = [
    baseHeight + upperHeight * 0.22,
    baseHeight + upperHeight * 0.51,
    baseHeight + upperHeight * 0.78,
  ];
  for (let row = 0; row < rowYs.length; row += 1) {
    for (let col = 0; col < columns.length; col += 1) {
      const x = plane.xMin + length * columns[col];
      const topRow = row === rowYs.length - 1;
      const width = length * (col === 0 || col === columns.length - 1 ? 0.058 : 0.062);
      const winHeight = topRow ? 0.21 : 0.185;
      addHybridWindow(group, {
        x,
        y: rowYs[row],
        z: faceZ + sideOffset * 0.092,
        width,
        height: winHeight,
        topRow,
        ac: row === 0 && [0, 2, 4].includes(col),
        materials,
        sideOffset,
        layer,
      });
    }
    addHeroFidelityBox(group, {
      color: 0x6b332c,
      opacity: 1,
      position: [plane.xMin + length * 0.5, rowYs[row] + 0.15, faceZ + sideOffset * 0.074],
      size: [length * 0.82, 0.026, 0.035],
      ...layer,
    });
    for (let panel = 0; panel < 8; panel += 1) {
      addHeroFidelityBox(group, {
        color: 0x9f5946,
        opacity: 0.82,
        position: [plane.xMin + length * (0.12 + panel * 0.1), rowYs[row] + 0.15, faceZ + sideOffset * 0.105],
        size: [length * 0.04, 0.034, 0.03],
        ...layer,
      });
    }
  }
}

function addHybridWindow(group, { x, y, z, width, height, topRow, ac, materials, sideOffset, layer }) {
  addHeroFidelityBox(group, {
    color: 0x251f1c,
    opacity: 1,
    position: [x, y, z],
    size: [width * 1.72, height * 1.42, 0.07],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x0f1515,
    opacity: 1,
    position: [x, y - height * 0.03, z + sideOffset * 0.043],
    size: [width * 1.08, height * 1.02, 0.052],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0xb9c5bd,
    opacity: 1,
    position: [x, y + height * 0.18, z + sideOffset * 0.068],
    size: [width * 0.78, height * 0.36, 0.035],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.stoneCornice,
    opacity: 1,
    position: [x, y - height * 0.74, z + sideOffset * 0.078],
    size: [width * 1.85, 0.036, 0.064],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: topRow ? 0x7a3f33 : materials.stoneCornice,
    opacity: 1,
    position: [x, y + height * 0.76, z + sideOffset * 0.08],
    size: [width * (topRow ? 1.42 : 1.78), topRow ? 0.07 : 0.04, 0.06],
    ...layer,
  });
  if (topRow) {
    addHeroFidelityBox(group, {
      color: 0x51261f,
      opacity: 1,
      position: [x, y + height * 0.96, z + sideOffset * 0.066],
      size: [width * 1.2, 0.024, 0.04],
      ...layer,
    });
  }
  if (ac) {
    addHeroFidelityBox(group, {
      color: 0xd6d4ca,
      opacity: 1,
      position: [x + width * 0.46, y - height * 0.84, z + sideOffset * 0.12],
      size: [width * 0.72, 0.052, 0.07],
      ...layer,
    });
    addHeroFidelityBox(group, {
      color: 0x737a75,
      opacity: 1,
      position: [x + width * 0.46, y - height * 0.84, z + sideOffset * 0.162],
      size: [width * 0.48, 0.02, 0.02],
      ...layer,
    });
  }
}

function addHybridWrappedStorefront(group, { materials, baySpans, baseHeight, faceZ, sideOffset, sideWallX, sideCenterZ, sideDepth, layer, softLayer }) {
  if (!baySpans.length) return;
  const xMin = baySpans[1]?.xMin ?? baySpans[0].xMin;
  const xMax = baySpans[5]?.xMax ?? baySpans[baySpans.length - 1].xMax;
  const centerX = (xMin + xMax) / 2;
  const width = xMax - xMin;
  const shopZ = faceZ + sideOffset * 0.22;

  addHeroFidelityBox(group, {
    color: 0x070908,
    opacity: 1,
    position: [centerX, baseHeight * 0.38, shopZ],
    size: [width * 1.02, baseHeight * 0.8, 0.115],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x1a100b,
    opacity: 0.55,
    position: [centerX, baseHeight * 0.18, shopZ + sideOffset * 0.09],
    size: [width, 0.035, 0.14],
    ...softLayer,
  });
  addHeroFidelityBox(group, {
    color: 0xb1845b,
    opacity: 1,
    position: [centerX, baseHeight * 1.08, shopZ + sideOffset * 0.035],
    size: [width * 1.04, baseHeight * 0.19, 0.115],
    ...layer,
  });
  for (let stripe = 0; stripe < 6; stripe += 1) {
    addHeroFidelityBox(group, {
      color: stripe % 2 ? 0xd0a06a : 0x8f603f,
      opacity: 0.9,
      position: [xMin + width * (0.08 + stripe * 0.16), baseHeight * 1.095, shopZ + sideOffset * 0.102],
      size: [width * 0.09, baseHeight * 0.018, 0.035],
      ...layer,
    });
  }
  addHeroFidelityBox(group, {
    color: materials.greenSign,
    opacity: 1,
    position: [centerX - width * 0.02, baseHeight * 1.105, shopZ + sideOffset * 0.14],
    size: [width * 0.32, baseHeight * 0.075, 0.055],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.blackCanopy,
    opacity: 1,
    position: [centerX, baseHeight * 0.76, shopZ + sideOffset * 0.24],
    size: [width * 1.06, baseHeight * 0.13, 0.42],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x050606,
    opacity: 1,
    position: [centerX, baseHeight * 0.66, shopZ + sideOffset * 0.47],
    size: [width * 1.02, baseHeight * 0.055, 0.22],
    ...layer,
  });

  const paneCount = 9;
  for (let index = 0; index < paneCount; index += 1) {
    const paneWidth = width * (index === 4 ? 0.072 : 0.058);
    const x = xMin + width * (0.075 + index * 0.105);
    const isDoor = index === 4 || index === 7;
    addHybridStorefrontPane(group, {
      x,
      y: isDoor ? baseHeight * 0.38 : baseHeight * 0.45,
      z: shopZ + sideOffset * 0.145,
      width: paneWidth,
      height: isDoor ? baseHeight * 0.64 : baseHeight * 0.43,
      isDoor,
      materials,
      sideOffset,
      layer,
    });
  }
  addHeroFidelityBox(group, {
    color: 0x0b0d0d,
    opacity: 1,
    position: [xMax - width * 0.03, baseHeight * 0.48, shopZ + sideOffset * 0.2],
    size: [width * 0.045, baseHeight * 0.83, 0.15],
    ...layer,
  });

  addHeroFidelityBox(group, {
    color: 0xb1845b,
    opacity: 1,
    position: [sideWallX - 0.07, baseHeight * 1.06, sideCenterZ + sideOffset * sideDepth * 0.17],
    size: [0.12, baseHeight * 0.18, sideDepth * 0.48],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.blackCanopy,
    opacity: 1,
    position: [sideWallX - 0.105, baseHeight * 0.76, sideCenterZ + sideOffset * sideDepth * 0.17],
    size: [0.19, baseHeight * 0.13, sideDepth * 0.5],
    ...layer,
  });
}

function addHybridStorefrontPane(group, { x, y, z, width, height, isDoor, materials, sideOffset, layer }) {
  addHeroFidelityBox(group, {
    color: 0x060808,
    opacity: 1,
    position: [x, y, z],
    size: [width * 1.32, height * 1.12, 0.064],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: isDoor ? 0x101615 : 0x5f7c73,
    opacity: 1,
    position: [x, y, z + sideOffset * 0.045],
    size: [width, height, 0.048],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0xd9e5da,
    opacity: 0.78,
    position: [x - width * 0.18, y + height * 0.22, z + sideOffset * 0.078],
    size: [width * 0.32, height * 0.03, 0.02],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.trim,
    opacity: 1,
    position: [x, y, z + sideOffset * 0.083],
    size: [0.012, height * 0.94, 0.03],
    ...layer,
  });
  if (!isDoor) {
    addHeroFidelityBox(group, {
      color: 0xe8eee4,
      opacity: 0.82,
      position: [x + width * 0.24, y - height * 0.18, z + sideOffset * 0.082],
      size: [width * 0.16, height * 0.18, 0.018],
      ...layer,
    });
  }
}

function addHybridSideReturnGrammar(group, { materials, height, baseHeight, sideOffset, sideWallX, sideCenterZ, sideDepth, frontZ, layer }) {
  const yRows = [
    baseHeight + (height - baseHeight) * 0.25,
    baseHeight + (height - baseHeight) * 0.5,
    baseHeight + (height - baseHeight) * 0.74,
  ];
  for (let row = 0; row < yRows.length; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const z = frontZ - sideOffset * sideDepth * (0.18 + col * 0.18);
      addHeroFidelityBox(group, {
        color: 0x211e1c,
        opacity: 1,
        position: [sideWallX - 0.068, yRows[row], z],
        size: [0.064, 0.18, 0.082],
        ...layer,
      });
      addHeroFidelityBox(group, {
        color: 0x9eaaa2,
        opacity: 1,
        position: [sideWallX - 0.105, yRows[row] + 0.015, z],
        size: [0.034, 0.12, 0.054],
        ...layer,
      });
      if (row === 0 && col % 2 === 0) {
        addHeroFidelityBox(group, {
          color: 0xd8d5ca,
          opacity: 1,
          position: [sideWallX - 0.13, yRows[row] - 0.09, z + sideOffset * 0.012],
          size: [0.055, 0.045, 0.065],
          ...layer,
        });
      }
    }
  }

  const bayX = sideWallX - 0.2;
  const bayZ = frontZ - sideOffset * sideDepth * 0.62;
  addHeroFidelityBox(group, {
    color: materials.sideBay ?? 0x735b44,
    opacity: 1,
    position: [bayX, height * 0.58, bayZ],
    size: [0.26, 0.68, 0.3],
    ...layer,
  });
  for (let row = 0; row < 3; row += 1) {
    addHeroFidelityBox(group, {
      color: 0x171b1a,
      opacity: 1,
      position: [bayX - 0.115, height * (0.4 + row * 0.13), bayZ + sideOffset * 0.075],
      size: [0.045, 0.13, 0.062],
      ...layer,
    });
  }

  const fireX = sideWallX - 0.27;
  const fireZ = frontZ - sideOffset * sideDepth * 0.78;
  for (let level = 0; level < 3; level += 1) {
    const y = baseHeight + (height - baseHeight) * (0.24 + level * 0.2);
    addHeroFidelityBox(group, {
      color: materials.fireEscape,
      opacity: 1,
      position: [fireX, y - 0.045, fireZ],
      size: [0.026, 0.025, 0.34],
      ...layer,
    });
    for (let rail = 0; rail < 4; rail += 1) {
      addHeroFidelityBox(group, {
        color: materials.fireEscape,
        opacity: 1,
        position: [fireX, y + 0.02, fireZ - sideOffset * (0.15 - rail * 0.1)],
        size: [0.018, 0.15, 0.014],
        ...layer,
      });
    }
    addHeroFidelityBox(group, {
      color: materials.fireEscape,
      opacity: 1,
      position: [fireX, y + 0.04, fireZ - sideOffset * 0.04],
      size: [0.018, 0.018, 0.38],
      ...layer,
    });
  }
}

function addHybridStreetGroundingKit(group, { materials, length, plane, z, frontZ, sideOffset, layer, softLayer }) {
  const centerX = plane.xMin + length / 2;
  const sidewalkZ = z + sideOffset * 0.34;
  const curbZ = z + sideOffset * 0.74;
  const roadZ = z + sideOffset * 1.02;
  addHeroFidelityBox(group, {
    color: 0xaab2aa,
    opacity: 1,
    position: [centerX, 0.065, sidewalkZ],
    size: [length * 1.38, 0.04, 0.72],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x838b85,
    opacity: 1,
    position: [plane.xMax + length * 0.05, 0.07, z - sideOffset * 0.04],
    size: [length * 0.28, 0.035, 0.58],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.curb,
    opacity: 1,
    position: [centerX, 0.095, curbZ],
    size: [length * 1.36, 0.045, 0.09],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0x171d1c,
    opacity: 0.92,
    position: [centerX, 0.022, roadZ],
    size: [length * 1.55, 0.025, 0.78],
    ...softLayer,
  });
  for (let stripe = 0; stripe < 8; stripe += 1) {
    addHeroFidelityBox(group, {
      color: 0xf0ead7,
      opacity: 0.88,
      position: [plane.xMin + length * (0.06 + stripe * 0.08), 0.105, roadZ + sideOffset * (0.04 + stripe * 0.022)],
      size: [length * 0.065, 0.026, 0.18],
      ...layer,
    });
  }
  for (const x of [plane.xMin + length * 0.16, plane.xMax - length * 0.13]) {
    addHeroFidelityBox(group, {
      color: materials.tactilePaving,
      opacity: 1,
      position: [x, 0.12, curbZ - sideOffset * 0.11],
      size: [length * 0.12, 0.02, 0.1],
      ...layer,
    });
  }
  addHeroFidelityBox(group, {
    color: 0x111514,
    opacity: 0.55,
    position: [centerX, 0.115, frontZ + sideOffset * 0.34],
    size: [length * 1.02, 0.018, 0.12],
    ...softLayer,
  });
  addHeroFidelityCylinder(group, {
    color: 0x111514,
    opacity: 1,
    position: [plane.xMin + length * 0.04, 0.62, frontZ + sideOffset * 0.56],
    radius: 0.021,
    height: 1.18,
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0xd2a33e,
    opacity: 1,
    position: [plane.xMin + length * 0.04, 0.88, frontZ + sideOffset * 0.61],
    size: [0.08, 0.18, 0.065],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0xdedbd0,
    opacity: 1,
    position: [plane.xMin + length * 0.04, 1.13, frontZ + sideOffset * 0.59],
    size: [0.12, 0.12, 0.026],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: materials.objectGreen,
    opacity: 1,
    position: [plane.xMax - length * 0.34, 0.25, frontZ + sideOffset * 0.44],
    size: [0.15, 0.35, 0.045],
    ...layer,
  });
  addHeroFidelityBox(group, {
    color: 0xd6d1bc,
    opacity: 1,
    position: [plane.xMax - length * 0.14, 0.18, frontZ + sideOffset * 0.48],
    size: [0.16, 0.26, 0.13],
    ...layer,
  });
  for (let index = 0; index < 3; index += 1) {
    addHeroFidelityCylinder(group, {
      color: materials.trim,
      opacity: 1,
      position: [plane.xMax + length * (0.02 + index * 0.055), 0.125, z - sideOffset * (0.42 + index * 0.035)],
      radius: 0.045,
      height: 0.012,
      ...layer,
    });
  }
}

function addHeroFidelityBox(group, options) {
  const { addBox, addCylinder: _addCylinder, ...drawOptions } = options;
  if (typeof addBox !== "function") return;

  addBox(group, {
    ...drawOptions,
    opaque: options.opaque ?? true,
    depthTest: options.depthTest ?? false,
    renderOrder: options.renderOrder ?? 12,
  });
}

function addHeroFidelityCylinder(group, options) {
  const { addCylinder, addBox: _addBox, ...drawOptions } = options;
  if (typeof addCylinder !== "function") return;

  addCylinder(group, {
    ...drawOptions,
    opaque: options.opaque ?? true,
    depthTest: options.depthTest ?? false,
    renderOrder: options.renderOrder ?? 12,
  });
}


function normalizeCadence(values) {
  const usable = Array.isArray(values) && values.length ? values : [1];
  const positive = usable.map((value) => Math.max(Number(value) || 0, 0));
  const total = positive.reduce((sum, value) => sum + value, 0);
  if (!total) {
    return usable.map(() => 1 / usable.length);
  }
  return positive.map((value) => value / total);
}

function getRatioCenters(plane, length, ratios) {
  const normalized = Array.isArray(ratios) && ratios.length ? normalizeCadence(ratios) : [];
  const centers = [];
  let cursor = plane.xMin;

  for (const ratio of normalized) {
    const width = length * ratio;
    centers.push({ center: cursor + width / 2, width, xMin: cursor, xMax: cursor + width });
    cursor += width;
  }

  return centers;
}
