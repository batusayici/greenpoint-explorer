// Pure geometry for a small canopy over an entry door (non-storefront kit
// buildings). Face-local metres [u, v, w] like stoopGeometry/fireEscapeGeometry:
// u along the facade, v up, w out from the wall. The renderer tints + textures.
export function buildDoorAwningGeometry({
  frontM,
  heightM,                  // unused in layout but kept for call-site symmetry
  doorCenterM = frontM / 2,
  doorTopM = 2.2,           // ~door head height
  widthM = 1.6,
  projectionM = 0.8,
  dropM = 0.35,             // valance skirt height
}) {
  const uL = doorCenterM - widthM / 2;
  const uR = doorCenterM + widthM / 2;
  const yWall = doorTopM + 0.25;       // canopy springs just above the door head
  const yLip = doorTopM;               // sloped down to the projecting front lip
  const w = projectionM;
  const quads = [];
  // Sloped top: from the wall down to the projecting front lip.
  quads.push({ role: "top", corners: [
    [uL, yWall, 0], [uR, yWall, 0], [uR, yLip, w], [uL, yLip, w],
  ]});
  // Valance: vertical skirt at the front edge (street-facing, iso-legible).
  quads.push({ role: "valance", corners: [
    [uL, yLip, w], [uR, yLip, w], [uR, yLip - dropM, w], [uL, yLip - dropM, w],
  ]});
  // Side closers so it reads solid, not a floating flap.
  for (const su of [uL, uR]) {
    quads.push({ role: "side", corners: [
      [su, yWall, 0], [su, yLip, w], [su, yLip - dropM, w],
    ]});
  }
  return { quads };
}
