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
  // Inline export dialog — keeping the snippet visible in a selectable
  // textarea is way more reliable than relying on alert() / clipboard
  // APIs (which the Claude preview webview, some iOS in-app browsers,
  // and a handful of other contexts block silently).
  const [exportSnippet, setExportSnippet] = useState<{ name: string; text: string } | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");

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

  /**
   * Generate a TS snippet of the layout suitable for pasting into
   * `lib/site-planner/builtinTemplates.ts`. Strips runtime IDs so the
   * source stays clean (the planner re-IDs on apply). Pops an inline
   * dialog with the snippet in a selectable textarea — that's way more
   * reliable than alert / window.prompt / navigator.clipboard, all of
   * which fail silently in restrictive webviews.
   */
  const handleExport = (layout: SavedLayout) => {
    const slug = layout.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "layout";
    const stripped = {
      id: `builtin-${slug}`,
      name: layout.name,
      description: "",
      buildings: layout.buildings.map((b) => ({
        typeId: b.typeId,
        x: b.x,
        y: b.y,
        rotation: b.rotation,
        label: b.label,
      })),
      drawings: layout.drawings.map((d) => ({
        points: d.points,
        color: d.color,
        thickness: d.thickness,
        dashed: d.dashed,
        closed: d.closed,
        ...(typeof d.opacity === "number" ? { opacity: d.opacity } : {}),
        ...(d.dimension ? { dimension: true } : {}),
        ...(d.dimensionFlip ? { dimensionFlip: true } : {}),
        ...(d.noLabel ? { noLabel: true } : {}),
      })),
      texts: layout.texts.map((t) => ({
        x: t.x,
        y: t.y,
        text: t.text,
        fontSize: t.fontSize,
        color: t.color,
        ...(typeof t.opacity === "number" ? { opacity: t.opacity } : {}),
      })),
    };
    const snippet = JSON.stringify(stripped, null, 2);
    // Indent every line by 2 spaces and add a trailing comma so it can
    // be pasted straight into the BUILTIN_TEMPLATES array.
    const formatted = `  ${snippet.replace(/\n/g, "\n  ")},\n`;
    setExportSnippet({ name: layout.name, text: formatted });
    setCopyState("idle");
  };

  /** Try to copy the visible snippet to the clipboard. Falls back to
      a select-all + execCommand path which works in older / restricted
      contexts where the Promise-based API is blocked. */
  const handleCopySnippet = async (text: string) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        setCopyState("ok");
        return;
      }
    } catch {
      /* fall through */
    }
    // Fallback: stuff the text into a hidden textarea, select it, exec
    // the legacy copy command. Works in most webviews that block the
    // modern Promise API.
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      setCopyState(ok ? "ok" : "fail");
    } catch {
      setCopyState("fail");
    }
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
                      onClick={() => handleExport(l)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-50"
                      aria-label={`Export ${l.name} as a built-in template snippet`}
                      title="Copy a TS snippet ready to paste into builtinTemplates.ts (so this template ships with the site)"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0018 9h-1.26a8 8 0 10-13.27 7.7" />
                      </svg>
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

        {/* Export-snippet sub-dialog. Renders inline (inside the same
            modal card) so the user always SEES the snippet — works even
            when alert() / clipboard / window.prompt are blocked by the
            host webview (Claude preview, in-app browsers, etc.). */}
        {exportSnippet && (
          <div
            className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col"
            role="dialog"
            aria-label="Export template snippet"
          >
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
              <div className="min-w-0 pr-3">
                <h3 className="text-sm font-bold text-gray-900 truncate">
                  Export template — {exportSnippet.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  Select all and copy this snippet. Paste it into{" "}
                  <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded">src/lib/site-planner/builtinTemplates.ts</code>{" "}
                  between the <code>[ ]</code> of <code>BUILTIN_TEMPLATES</code> and send the change to me to ship.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExportSnippet(null);
                  setCopyState("idle");
                }}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Close export"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <textarea
              readOnly
              value={exportSnippet.text}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              className="flex-1 m-3 p-3 rounded-lg border border-gray-200 bg-gray-50 text-[11px] font-mono text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              spellCheck={false}
            />

            <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-gray-100 bg-white">
              <span className={`text-[11px] font-bold ${
                copyState === "ok"
                  ? "text-emerald-700"
                  : copyState === "fail"
                    ? "text-amber-700"
                    : "text-gray-400"
              }`}>
                {copyState === "ok"
                  ? "✓ Copied to clipboard"
                  : copyState === "fail"
                    ? "Couldn't auto-copy — select all + copy manually"
                    : "Tap the textarea to select all"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopySnippet(exportSnippet.text)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 active:bg-emerald-700"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExportSnippet(null);
                    setCopyState("idle");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 border border-gray-200 hover:bg-gray-50"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
