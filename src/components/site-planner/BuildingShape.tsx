"use client";

import { Group, Rect, Text, Circle, Path, Line } from "react-konva";
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
  const isCircular = !isUtility && type.shape === "circle";
  const isContainerShelter = type.shape === "container-shelter";

  // Font size scales with the smaller dimension, clamped. Utility icons
  // scale with the (oversized) marker radius so the emoji fills the
  // white inner plate without clipping.
  const minDim = Math.min(w, h);
  const fontSize = isUtility ? Math.round(ppm * 0.65 * 0.95) : Math.max(9, Math.min(14, minDim * 0.22));
  // Half the smaller dimension is the natural radius for a circular
  // building (e.g. the 5000L Grey Water tank, 2m diameter).
  const circleRadius = isCircular ? Math.min(w, h) / 2 : 0;

  const setCursor = (cursor: string) => {
    const stage = document.querySelector("canvas");
    if (stage) stage.style.cursor = cursor;
  };

  // Utility markers slightly oversized vs their nominal 1m bounds so
  // they read clearly against the satellite at typical zooms. The
  // emoji icon and white inner plate scale with the radius.
  const radius = isUtility ? ppm * 0.65 : 0;

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
          {/* Utility marker — saturated coloured ring around a white inner
              plate. Native emoji icons (⚡ yellow, 💧 blue, 🔵 blue) sit
              on the white plate with full contrast; the coloured ring
              still hints at the utility type from a distance. The pale
              type.color was the wrong layer for the emoji to live on
              (yellow ⚡ on cream-pink read as "yellow on yellow"). */}
          <Circle
            x={w / 2}
            y={h / 2}
            radius={radius}
            fill={type.stroke}
            shadowColor="rgba(0,0,0,0.35)"
            shadowBlur={4}
            shadowOpacity={0.6}
          />
          <Circle
            x={w / 2}
            y={h / 2}
            radius={radius * 0.78}
            fill="#FFFFFF"
          />
          {/* Icon — emojis pick their own colours, but plain unicode
              glyphs (e.g. "●" for grey-water) honour type.iconColor so we
              can render a coloured dot on the white plate. */}
          <Text
            text={type.icon || "●"}
            x={0}
            y={0}
            width={w}
            height={h}
            align="center"
            verticalAlign="middle"
            fontSize={fontSize}
            fill={type.iconColor || "#111827"}
            listening={false}
          />
        </>
      ) : isCircular ? (
        <>
          {/* Selection ring around the circle */}
          {isSelected && (
            <Circle
              x={w / 2}
              y={h / 2}
              radius={circleRadius + 3}
              fill="transparent"
              stroke="#2563EB"
              strokeWidth={2.5}
              dash={[6, 3]}
            />
          )}
          {/* Building disc — flat fill + stroke, the same look-and-feel
              as the rectangular buildings but circular (e.g. 5000L Grey
              Water tank, 2m diameter cylindrical tank) */}
          <Circle
            x={w / 2}
            y={h / 2}
            radius={circleRadius}
            fill={type.color}
            stroke={type.stroke}
            strokeWidth={1.5}
          />
          <Text
            text={building.label}
            x={0}
            y={0}
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
      ) : isContainerShelter ? (
        (() => {
          const cLen = type.containerLengthM ?? 6;
          const sDepth = type.shelterDepthM ?? 6;
          const containerH = 2.4 * ppm;
          const shelterH = sDepth * ppm;
          const fullW = cLen * ppm;
          const shelterTop = containerH;
          const shelterBottom = containerH + shelterH;
          // Container colour scheme — distinct from the shelter so the
          // composite reads as "containers + dome".
          const containerFill = "#E5E7EB";
          const containerStroke = "#4B5563";
          // Dome ribs — 5 evenly spaced curved arcs across the shelter,
          // peaking toward the centre so the user instantly reads
          // "fabric dome" rather than "flat slab".
          const ribCount = Math.max(4, Math.round(sDepth / 1.5));
          const ribs: { d: string }[] = [];
          for (let i = 1; i < ribCount; i++) {
            const t = i / ribCount;
            const y = shelterTop + t * shelterH;
            // Apex offset peaks at the middle of the shelter span
            const peak = Math.sin(t * Math.PI) * (containerH * 0.18);
            ribs.push({
              d: `M 0 ${y} Q ${fullW / 2} ${y - peak} ${fullW} ${y}`,
            });
          }
          return (
            <>
              {/* Selection border around the whole composite */}
              {isSelected && (
                <Rect
                  x={-3}
                  y={-3}
                  width={w + 6}
                  height={h + 6}
                  fill="transparent"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  cornerRadius={3}
                  dash={[6, 3]}
                />
              )}
              {/* End container 1 (top of footprint) */}
              <Rect
                x={0}
                y={0}
                width={fullW}
                height={containerH}
                fill={containerFill}
                stroke={containerStroke}
                strokeWidth={1.5}
                cornerRadius={1}
              />
              {/* Container corrugation hint — three short interior strokes */}
              <Line points={[fullW * 0.25, 0, fullW * 0.25, containerH]} stroke={containerStroke} strokeWidth={0.6} opacity={0.5} listening={false} />
              <Line points={[fullW * 0.5,  0, fullW * 0.5,  containerH]} stroke={containerStroke} strokeWidth={0.6} opacity={0.5} listening={false} />
              <Line points={[fullW * 0.75, 0, fullW * 0.75, containerH]} stroke={containerStroke} strokeWidth={0.6} opacity={0.5} listening={false} />

              {/* Shelter — sandy fabric tone with a dashed outline.
                  Dashed reads as "tent / fabric" vs solid "wall". */}
              <Rect
                x={0}
                y={shelterTop}
                width={fullW}
                height={shelterH}
                fill={type.color}
                stroke={type.stroke}
                strokeWidth={2}
                dash={[5, 3]}
                cornerRadius={2}
              />
              {/* Dome ribs — curved arcs across the shelter span */}
              {ribs.map((rib, i) => (
                <Path
                  key={`rib-${i}`}
                  data={rib.d}
                  stroke={type.stroke}
                  strokeWidth={1}
                  opacity={0.55}
                  listening={false}
                />
              ))}

              {/* "SHELTER" label centred in the shelter portion */}
              <Text
                text={`SHELTER\n${cLen}×${sDepth}m`}
                x={0}
                y={shelterTop + shelterH / 2 - fontSize}
                width={fullW}
                align="center"
                fontSize={Math.max(10, Math.min(16, sDepth * 1.2))}
                fontStyle="bold"
                fontFamily="system-ui, sans-serif"
                fill={type.stroke}
                listening={false}
                padding={2}
              />

              {/* End container 2 (bottom of footprint) */}
              <Rect
                x={0}
                y={shelterBottom}
                width={fullW}
                height={containerH}
                fill={containerFill}
                stroke={containerStroke}
                strokeWidth={1.5}
                cornerRadius={1}
              />
              <Line points={[fullW * 0.25, shelterBottom, fullW * 0.25, shelterBottom + containerH]} stroke={containerStroke} strokeWidth={0.6} opacity={0.5} listening={false} />
              <Line points={[fullW * 0.5,  shelterBottom, fullW * 0.5,  shelterBottom + containerH]} stroke={containerStroke} strokeWidth={0.6} opacity={0.5} listening={false} />
              <Line points={[fullW * 0.75, shelterBottom, fullW * 0.75, shelterBottom + containerH]} stroke={containerStroke} strokeWidth={0.6} opacity={0.5} listening={false} />

              {/* User-supplied label sits below the bottom container so
                  it doesn't obscure the SHELTER text inside. Konva.Text
                  inside the bounds will overflow the building if the
                  label is long, but rotation is fine. */}
              <Text
                text={building.label}
                x={0}
                y={shelterBottom + containerH + 4}
                width={fullW}
                align="center"
                fontSize={Math.max(9, Math.min(12, fullW * 0.04))}
                fontStyle="bold"
                fontFamily="system-ui, sans-serif"
                fill={containerStroke}
                listening={false}
              />
            </>
          );
        })()
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
