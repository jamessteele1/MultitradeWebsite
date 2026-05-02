"use client";

import { Group, Rect, Text, Circle } from "react-konva";
import type { PlacedBuilding } from "@/lib/site-planner/usePlannerState";
import type { BuildingType } from "@/lib/site-planner/buildings";
import { PIXELS_PER_METRE } from "@/lib/site-planner/constants";

type Props = {
  building: PlacedBuilding;
  type: BuildingType;
  isSelected: boolean;
  isAttached: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number, dropClientPoint: { x: number; y: number } | null) => void;
  onDragStart?: () => void;
  onDragMove?: (clientPoint: { x: number; y: number }) => void;
  onDblClick?: () => void;
};

export default function BuildingShape({ building, type, isSelected, isAttached, onSelect, onDragEnd, onDragStart, onDragMove, onDblClick }: Props) {
  const ppm = PIXELS_PER_METRE;
  const w = type.widthM * ppm;
  const h = type.depthM * ppm;
  const isUtility = type.category === "utilities";

  // Font size scales with the smaller dimension, clamped
  const minDim = Math.min(w, h);
  const fontSize = isUtility ? 20 : Math.max(9, Math.min(14, minDim * 0.22));

  const setCursor = (cursor: string) => {
    const stage = document.querySelector("canvas");
    if (stage) stage.style.cursor = cursor;
  };

  const radius = isUtility ? ppm * 0.5 : 0;

  return (
    <Group
      x={building.x * ppm + w / 2}
      y={building.y * ppm + h / 2}
      offsetX={w / 2}
      offsetY={h / 2}
      rotation={building.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onDblClick}
      onDblTap={onDblClick}
      onDragStart={() => {
        setCursor("grabbing");
        onSelect();
        onDragStart?.();
      }}
      onDragMove={(e) => {
        const stage = e.target.getStage();
        const ptr = stage?.getPointerPosition();
        const container = stage?.container().getBoundingClientRect();
        if (ptr && container && onDragMove) {
          onDragMove({ x: container.left + ptr.x, y: container.top + ptr.y });
        }
      }}
      onDragEnd={(e) => {
        setCursor("grab");
        const node = e.target;
        const stage = node.getStage();
        const ptr = stage?.getPointerPosition();
        const container = stage?.container().getBoundingClientRect();
        const drop = ptr && container ? { x: container.left + ptr.x, y: container.top + ptr.y } : null;
        onDragEnd((node.x() - w / 2) / ppm, (node.y() - h / 2) / ppm, drop);
      }}
      onMouseEnter={() => setCursor("grab")}
      onMouseLeave={() => setCursor("default")}
    >
      {isUtility ? (
        <>
          {/* Selection ring */}
          {isSelected && (
            <Circle
              x={w / 2}
              y={h / 2}
              radius={radius + 4}
              fill="transparent"
              stroke="#2563EB"
              strokeWidth={2.5}
              dash={[6, 3]}
            />
          )}
          {/* Utility circle */}
          <Circle
            x={w / 2}
            y={h / 2}
            radius={radius}
            fill={type.color}
            stroke={type.stroke}
            strokeWidth={2}
          />
          {/* Icon */}
          <Text
            text={type.icon || "●"}
            x={0}
            y={0}
            width={w}
            height={h}
            align="center"
            verticalAlign="middle"
            fontSize={fontSize}
            listening={false}
          />
        </>
      ) : (
        <>
          {/* Attached indicator */}
          {isAttached && !isSelected && (
            <Rect
              x={-2}
              y={-2}
              width={w + 4}
              height={h + 4}
              fill="transparent"
              stroke="#16A34A"
              strokeWidth={2}
              cornerRadius={3}
              dash={[4, 3]}
            />
          )}
          {/* Selection border */}
          {isSelected && (
            <Rect
              x={-2}
              y={-2}
              width={w + 4}
              height={h + 4}
              fill="transparent"
              stroke={isAttached ? "#16A34A" : "#2563EB"}
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
        </>
      )}
    </Group>
  );
}
