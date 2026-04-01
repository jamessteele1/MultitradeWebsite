"use client";

import { useState } from "react";

type Props = {
  selectedId: string | null;
  canUndo: boolean;
  buildingCount: number;
  onRotate: () => void;
  onDelete: () => void;
  onLabel: (label: string) => void;
  onUndo: () => void;
  onClear: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  currentLabel?: string;
};

export default function PlannerToolbar({
  selectedId,
  canUndo,
  buildingCount,
  onRotate,
  onDelete,
  onLabel,
  onUndo,
  onClear,
  onExportPNG,
  onExportPDF,
  currentLabel,
}: Props) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelText, setLabelText] = useState("");
  const hasSelection = selectedId !== null;

  const startLabelEdit = () => {
    setLabelText(currentLabel || "");
    setEditingLabel(true);
  };

  const confirmLabel = () => {
    if (labelText.trim()) onLabel(labelText.trim());
    setEditingLabel(false);
  };

  const btnBase = "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors";
  const btnActive = `${btnBase} border border-gray-200 text-gray-700 hover:bg-gray-100`;
  const btnDisabled = `${btnBase} border border-gray-100 text-gray-300 cursor-not-allowed`;

  return (
    <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-gray-200 px-4 py-2.5">
      {/* Selection actions */}
      <div className="flex items-center gap-1.5">
        <button onClick={onRotate} disabled={!hasSelection} className={hasSelection ? btnActive : btnDisabled} title="Rotate 90°">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6" /><path d="M21.34 13.5A10 10 0 115.5 3.36L21.5 8" /></svg>
          Rotate
        </button>

        {editingLabel ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmLabel()}
              className="w-28 px-2 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Building label..."
            />
            <button onClick={confirmLabel} className={`${btnBase} bg-amber-100 text-amber-800 border border-amber-200`}>
              Save
            </button>
            <button onClick={() => setEditingLabel(false)} className={`${btnBase} text-gray-500`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ) : (
          <button onClick={startLabelEdit} disabled={!hasSelection} className={hasSelection ? btnActive : btnDisabled} title="Rename">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
            Label
          </button>
        )}

        <button onClick={onDelete} disabled={!hasSelection} className={hasSelection ? `${btnBase} border border-red-200 text-red-600 hover:bg-red-50` : btnDisabled} title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          Delete
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* General actions */}
      <div className="flex items-center gap-1.5">
        <button onClick={onUndo} disabled={!canUndo} className={canUndo ? btnActive : btnDisabled} title="Undo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M3 13a9 9 0 0115.36-6.36L21 9" /></svg>
          Undo
        </button>

        <button onClick={onClear} disabled={buildingCount === 0} className={buildingCount > 0 ? btnActive : btnDisabled} title="Clear all">
          Clear
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Export */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-gray-400 mr-1">{buildingCount} building{buildingCount !== 1 ? "s" : ""}</span>
        <button onClick={onExportPNG} disabled={buildingCount === 0} className={buildingCount > 0 ? `${btnBase} border border-gray-200 text-gray-700 hover:bg-gray-100` : btnDisabled}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          PNG
        </button>
        <button onClick={onExportPDF} disabled={buildingCount === 0} className={buildingCount > 0 ? `${btnBase} bg-gold text-gray-900 hover:brightness-110` : btnDisabled}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          Export PDF
        </button>
      </div>
    </div>
  );
}
