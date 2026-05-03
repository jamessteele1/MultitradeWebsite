"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  type SavedLayout,
  getSavedLayouts,
  deleteLayout,
} from "@/lib/site-planner/layoutStorage";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Save the current planner state under `name`. The parent owns the
      thumbnail generation + state snapshot, so we just hand it the
      details and let it persist. */
  onSave: (input: { name: string; isTemplate: boolean }) => Promise<void> | void;
  /** Replace the canvas with the given saved layout. Parent confirms
      with the user as needed. */
  onLoad: (layout: SavedLayout) => void;
  /** Whether the canvas currently has anything saveable. */
  hasContent: boolean;
};

const dateFmt = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "numeric",
});

export default function LayoutManagerModal({ open, onClose, onSave, onLoad, hasContent }: Props) {
  const [name, setName] = useState("");
  const [isTemplate, setIsTemplate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [layouts, setLayouts] = useState<SavedLayout[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Refresh the list whenever the modal opens — covers the case where
  // a save just happened and we want the new entry to appear.
  useEffect(() => {
    if (open) {
      setLayouts(getSavedLayouts());
      setError(null);
    } else {
      // Reset the form on close
      setName("");
      setIsTemplate(false);
    }
  }, [open]);

  const refresh = () => setLayouts(getSavedLayouts());

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give your layout a name first.");
      return;
    }
    if (!hasContent) {
      setError("There's nothing to save yet — drop some buildings or drawings first.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({ name: trimmed, isTemplate });
      setName("");
      setIsTemplate(false);
      refresh();
    } catch (err) {
      setError((err as Error)?.message || "Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (layout: SavedLayout) => {
    if (!confirm(`Delete "${layout.name}"? This can't be undone.`)) return;
    deleteLayout(layout.id);
    refresh();
  };

  const handleLoad = (layout: SavedLayout) => {
    if (hasContent) {
      if (!confirm(`Load "${layout.name}"? Your current layout will be replaced (you can ⌘Z to undo).`)) return;
    }
    onLoad(layout);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Saved layouts"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-hidden="true" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-[600px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ animation: "dialogSlideUp 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Saved Layouts</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Save the current canvas, load a previous one, or mark a layout as a template.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Save form */}
        <div className="px-5 py-4 border-b border-gray-100 bg-amber-50/40">
          <h3 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-2">Save current as…</h3>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 60))}
              onKeyDown={(e) => e.key === "Enter" && !saving && handleSave()}
              placeholder="e.g. Bowen Basin camp v2"
              className="flex-1 min-w-[200px] px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              maxLength={60}
              disabled={saving}
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold text-gray-900 text-sm font-extrabold hover:brightness-110 active:brightness-95 disabled:opacity-50 transition-all"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-gray-700/20 border-t-gray-800 rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save
                </>
              )}
            </button>
          </div>
          <label className="mt-2 inline-flex items-center gap-2 text-xs text-amber-900/80 cursor-pointer">
            <input
              type="checkbox"
              checked={isTemplate}
              onChange={(e) => setIsTemplate(e.target.checked)}
              className="w-3.5 h-3.5 accent-amber-500"
            />
            Also save as a <span className="font-bold">Template</span> (will appear in the Add Building popup)
          </label>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </div>

        {/* Saved layouts list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Your layouts ({layouts.length})
          </h3>
          {layouts.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-6 text-center">
              Nothing saved yet. Save the canvas above and it&apos;ll show up here.
            </p>
          ) : (
            <ul className="space-y-2">
              {layouts.map((l) => (
                <li
                  key={l.id}
                  className="flex items-stretch gap-3 p-2 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50/40 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-[88px] h-[60px] rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    {l.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-gray-900 truncate">{l.name}</span>
                      {l.isTemplate && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                          Template
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {l.buildings.length} buildings · {l.drawings.length} drawings · {l.texts.length} text
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Saved {dateFmt.format(new Date(l.savedAt))}
                      {l.siteAddress ? ` · ${l.siteAddress.split(",")[0]}` : ""}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-1 self-center">
                    <button
                      type="button"
                      onClick={() => handleLoad(l)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600 active:bg-amber-700 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(l)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                      aria-label={`Delete ${l.name}`}
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
