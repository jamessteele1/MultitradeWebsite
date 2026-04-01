"use client";

import { useState } from "react";
import { BUILDING_TYPES, CATEGORY_LABELS, type BuildingType } from "@/lib/site-planner/buildings";

type Props = {
  className?: string;
  onAddCustom?: (widthM: number, depthM: number, label: string) => void;
};

const grouped = Object.entries(
  BUILDING_TYPES.reduce<Record<string, BuildingType[]>>((acc, bt) => {
    (acc[bt.category] ??= []).push(bt);
    return acc;
  }, {}),
);

export default function BuildingPalette({ className = "", onAddCustom }: Props) {
  const [customW, setCustomW] = useState(6);
  const [customD, setCustomD] = useState(3);
  const [customLabel, setCustomLabel] = useState("Custom");

  const handleDragStart = (e: React.DragEvent, bt: BuildingType) => {
    e.dataTransfer.setData("buildingTypeId", bt.id);
    e.dataTransfer.setData("buildingLabel", bt.shortLabel);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleCustomDragStart = (e: React.DragEvent) => {
    const w = Math.min(24, Math.max(1, customW));
    const h = Math.min(16, Math.max(1, customD));
    e.dataTransfer.setData("buildingTypeId", `custom-${w}x${h}`);
    e.dataTransfer.setData("buildingLabel", customLabel || `${w}×${h}m`);
    e.dataTransfer.setData("customWidth", String(w));
    e.dataTransfer.setData("customDepth", String(h));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className={`w-[260px] flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Buildings</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">Drag onto the canvas to place</p>
      </div>

      <div className="p-3 space-y-4">
        {grouped.map(([category, items]) => (
          <div key={category}>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {CATEGORY_LABELS[category] || category}
            </h4>
            <div className="space-y-1.5">
              {items.map((bt) => (
                <div
                  key={bt.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, bt)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors"
                >
                  {bt.category === "utilities" ? (
                    <div
                      className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: bt.color,
                        borderColor: bt.stroke,
                        fontSize: 14,
                      }}
                    >
                      {bt.icon}
                    </div>
                  ) : (
                    <div
                      className="flex-shrink-0 rounded-sm border"
                      style={{
                        width: Math.max(16, bt.widthM * 4),
                        height: Math.max(12, bt.depthM * 4),
                        backgroundColor: bt.color,
                        borderColor: bt.stroke,
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{bt.name}</p>
                    <p className="text-[10px] text-gray-500">{bt.widthM} × {bt.depthM}m</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Custom size building */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Custom Size
          </h4>
          <div className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={customW}
                onChange={(e) => setCustomW(Math.min(24, Math.max(1, parseFloat(e.target.value) || 1)))}
                className="w-14 px-1.5 py-1 text-xs text-center rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                min={1}
                max={24}
                step={0.5}
              />
              <span className="text-[10px] text-gray-400">×</span>
              <input
                type="number"
                value={customD}
                onChange={(e) => setCustomD(Math.min(16, Math.max(1, parseFloat(e.target.value) || 1)))}
                className="w-14 px-1.5 py-1 text-xs text-center rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                min={1}
                max={16}
                step={0.5}
              />
              <span className="text-[10px] text-gray-400">m</span>
            </div>
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Label..."
              className="w-full px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <div
              draggable
              onDragStart={handleCustomDragStart}
              className="flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50 cursor-grab active:cursor-grabbing transition-colors text-xs font-medium text-gray-600"
            >
              <div
                className="rounded-sm border border-gray-400 bg-gray-200"
                style={{
                  width: Math.max(16, Math.min(48, customW * 4)),
                  height: Math.max(12, Math.min(48, customD * 4)),
                }}
              />
              Drag to place
            </div>
            <p className="text-[9px] text-gray-400 text-center">Max 24 × 16m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
