import type { PlacedBuilding } from "./usePlannerState";
import type { BuildingType } from "./buildings";
import { GRID_SIZE_M } from "./constants";

const SNAP_THRESHOLD_M = 1.5;
const ALIGN_THRESHOLD_M = 1.5;

function snap(v: number): number {
  return Math.round(v / GRID_SIZE_M) * GRID_SIZE_M;
}

/**
 * Get the effective footprint (bounding box) of a building on the grid,
 * accounting for rotation around center.
 */
export function getFootprint(b: PlacedBuilding, type: BuildingType) {
  const cx = b.x + type.widthM / 2;
  const cy = b.y + type.depthM / 2;
  const r = ((b.rotation % 360) + 360) % 360;
  const rotated = r === 90 || r === 270;
  const w = rotated ? type.depthM : type.widthM;
  const h = rotated ? type.widthM : type.depthM;
  return { left: cx - w / 2, right: cx + w / 2, top: cy - h / 2, bottom: cy + h / 2, w, h, cx, cy };
}

/**
 * Convert a footprint left/top position back to the building's state x,y,
 * accounting for rotation.
 */
function footprintToPos(left: number, top: number, type: BuildingType, rotation: number) {
  const r = ((rotation % 360) + 360) % 360;
  const rotated = r === 90 || r === 270;
  const effectiveW = rotated ? type.depthM : type.widthM;
  const effectiveH = rotated ? type.widthM : type.depthM;
  return {
    x: left + effectiveW / 2 - type.widthM / 2,
    y: top + effectiveH / 2 - type.depthM / 2,
  };
}

/**
 * Try to snap a deck to the nearest building edge.
 * Returns snapped position and parentId, or null if no snap.
 */
export function findDeckSnap(
  deck: PlacedBuilding,
  deckType: BuildingType,
  buildings: PlacedBuilding[],
  getType: (id: string) => BuildingType | undefined,
): { x: number; y: number; parentId: string } | null {
  const df = getFootprint(deck, deckType);

  let best: { left: number; top: number; parentId: string; dist: number } | null = null;

  for (const b of buildings) {
    if (b.instanceId === deck.instanceId) continue;
    const bType = getType(b.typeId);
    if (!bType) continue;
    // Only snap to non-utility, non-deck buildings
    if (bType.category === "utilities" || bType.category === "decks") continue;

    const bf = getFootprint(b, bType);

    // 4 possible edge snaps: deck left/right/top/bottom → building opposite edge
    const candidates = [
      // Deck to the RIGHT of building
      { edgeDist: Math.abs(df.left - bf.right), newLeft: bf.right, newTop: df.top, axis: "h" as const },
      // Deck to the LEFT of building
      { edgeDist: Math.abs(df.right - bf.left), newLeft: bf.left - df.w, newTop: df.top, axis: "h" as const },
      // Deck BELOW building
      { edgeDist: Math.abs(df.top - bf.bottom), newLeft: df.left, newTop: bf.bottom, axis: "v" as const },
      // Deck ABOVE building
      { edgeDist: Math.abs(df.bottom - bf.top), newLeft: df.left, newTop: bf.top - df.h, axis: "v" as const },
    ];

    for (const c of candidates) {
      if (c.edgeDist > SNAP_THRESHOLD_M) continue;

      // Check perpendicular overlap (buildings must be adjacent, not just co-linear)
      if (c.axis === "h") {
        const overlapV = Math.min(c.newTop + df.h, bf.bottom) - Math.max(c.newTop, bf.top);
        if (overlapV < -SNAP_THRESHOLD_M) continue;
      } else {
        const overlapH = Math.min(c.newLeft + df.w, bf.right) - Math.max(c.newLeft, bf.left);
        if (overlapH < -SNAP_THRESHOLD_M) continue;
      }

      // Align perpendicular axis to nearest nice position
      let alignedLeft = c.newLeft;
      let alignedTop = c.newTop;

      if (c.axis === "h") {
        // Align vertically: top-to-top, bottom-to-bottom, or center-to-center
        if (Math.abs(c.newTop - bf.top) < ALIGN_THRESHOLD_M) {
          alignedTop = bf.top;
        } else if (Math.abs((c.newTop + df.h) - bf.bottom) < ALIGN_THRESHOLD_M) {
          alignedTop = bf.bottom - df.h;
        } else if (Math.abs((c.newTop + df.h / 2) - bf.cy) < ALIGN_THRESHOLD_M) {
          alignedTop = bf.cy - df.h / 2;
        }
      } else {
        // Align horizontally: left-to-left, right-to-right, or center-to-center
        if (Math.abs(c.newLeft - bf.left) < ALIGN_THRESHOLD_M) {
          alignedLeft = bf.left;
        } else if (Math.abs((c.newLeft + df.w) - bf.right) < ALIGN_THRESHOLD_M) {
          alignedLeft = bf.right - df.w;
        } else if (Math.abs((c.newLeft + df.w / 2) - bf.cx) < ALIGN_THRESHOLD_M) {
          alignedLeft = bf.cx - df.w / 2;
        }
      }

      if (!best || c.edgeDist < best.dist) {
        best = { left: alignedLeft, top: alignedTop, parentId: b.instanceId, dist: c.edgeDist };
      }
    }
  }

  if (!best) return null;

  const pos = footprintToPos(best.left, best.top, deckType, deck.rotation);
  return { x: snap(pos.x), y: snap(pos.y), parentId: best.parentId };
}

/**
 * Rotate a child building's position around a parent's visual center by deltaDeg (CW on screen).
 */
export function rotateChildAroundParent(
  child: PlacedBuilding,
  childType: BuildingType,
  parentCenter: { cx: number; cy: number },
  deltaDeg: number,
): { x: number; y: number; rotation: number } {
  const ccx = child.x + childType.widthM / 2;
  const ccy = child.y + childType.depthM / 2;

  const relX = ccx - parentCenter.cx;
  const relY = ccy - parentCenter.cy;

  const rad = (deltaDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // CW rotation on screen: (x,y) -> (x*cos - y*sin, x*sin + y*cos)
  const newRelX = relX * cos - relY * sin;
  const newRelY = relX * sin + relY * cos;

  const newCcx = parentCenter.cx + newRelX;
  const newCcy = parentCenter.cy + newRelY;

  return {
    x: snap(newCcx - childType.widthM / 2),
    y: snap(newCcy - childType.depthM / 2),
    rotation: ((child.rotation + deltaDeg) % 360 + 360) % 360,
  };
}
