"use client";

import { BUILDING_TYPES, CATEGORY_LABELS, type BuildingType } from "@/lib/site-planner/buildings";

type Props = {
  className?: string;
};

const grouped = Object.entries(
  BUILDING_TYPES.reduce<Record<string, BuildingType[]>>((acc, bt) => {
    (acc[bt.category] ??= []).push(bt);
    return acc;
  }, {}),
);

export default function BuildingPalette({ className = "" }: Props) {
  const handleDragStart = (e: React.DragEvent, bt: BuildingType) => {
    e.dataTransfer.setData("buildingTypeId", bt.id);
    e.dataTransfer.setData("buildingLabel", bt.shortLabel);
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
                  {/* Mini preview rectangle */}
                  <div
                    className="flex-shrink-0 rounded-sm border"
                    style={{
                      width: Math.max(16, bt.widthM * 4),
                      height: Math.max(12, bt.depthM * 4),
                      backgroundColor: bt.color,
                      borderColor: bt.stroke,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{bt.name}</p>
                    <p className="text-[10px] text-gray-500">{bt.widthM} × {bt.depthM}m</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
