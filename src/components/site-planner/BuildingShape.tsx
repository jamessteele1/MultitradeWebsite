"use client";

import { Group, Rect, Text } from "react-konva";
import type { PlacedBuilding } from "@/lib/site-planner/usePlannerState";
import type { BuildingType } from "@/lib/site-planner/buildings";
import { PIXELS_PER_METRE } from "@/lib/site-planner/constants";

type Props = {
  building: PlacedBuilding;
  type: BuildingType;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
};

export default function BuildingShape({ building, type, isSelected, onSelect, onDragEnd }: Props) {
  const ppm = PIXELS_PER_METRE;
  const w = type.widthM * ppm;
  const h = type.depthM * ppm;

  // Font size scales with the smaller dimension, clamped
  const minDim = Math.min(w, h);
  const fontSize = Math.max(9, Math.min(14, minDim * 0.22));

  return (
    <Group
      x={building.x * ppm}
      y={building.y * ppm}
      rotation={building.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragStart={onSelect}
      onDragEnd={(e) => {
        const node = e.target;
        onDragEnd(node.x() / ppm, node.y() / ppm);
      }}
    >
      {/* Shadow when selected */}
      {isSelected && (
        <Rect
          x={-2}
          y={-2}
          width={w + 4}
          height={h + 4}
          fill="transparent"
          stroke="#2563EB"
          strokeWidth={2.5}
          cornerRadius={3}
          dash={[6, 3]}
        />
      )}

      {/* Building rectangle */}
      <Rect
        width={w}
        height={h}
        fill={type.color}
        stroke={type.stroke}
        strokeWidth={1.5}
        cornerRadius={2}
      />

      {/* Label */}
      <Text
        text={building.label}
        width={w}
        height={h}
        align="center"
        verticalAlign="middle"
        fontSize={fontSize}
        fontStyle="bold"
        fontFamily="system-ui, sans-serif"
        fill={type.stroke}
        listening={false}
        padding={2}
      />
    </Group>
  );
}
