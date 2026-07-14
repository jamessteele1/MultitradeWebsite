"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "multitrade-planner-onboarding-dismissed";

type Props = {
  isMobile?: boolean;
};

/**
 * First-visit explainer for the site planner. A centred modal that
 * walks the user through the three-step flow on their first visit and
 * then disappears for good (gated on localStorage so it never shows
 * twice unless they clear site data).
 *
 * Earlier this lived as an inline banner above the toolbar — but on
 * mobile that's precious vertical real estate. The modal popup floats
 * over the page so the planner UI underneath is unaffected.
 */
export default function PlannerOnboarding({ isMobile }: Props) {
  // Start dismissed (= hidden) until we've checked localStorage on
  // mount. That way the modal doesn't briefly flash for users who've
  // already seen it.
  const [dismissed, setDismissed] = useState(true);
  // Prevent SSR / hydration mismatches when using portals.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const flag = localStorage.getItem(STORAGE_KEY);
    if (!flag) setDismissed(false);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore quota errors
    }
  };

  if (!mounted || dismissed) return null;

  const steps = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      title: "Add your buildings",
      desc: isMobile
        ? "Tap + Add Items and pick the buildings you need. Tap the canvas to drop them."
        : "Drag buildings from the left palette onto the grid — offices, crib rooms, toilets, decks, containers and more.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Design your site",
      desc: "Type your address to drop a satellite map. Drag / rotate / resize buildings. Use the drawing tools to mark out work areas, paths, and dimensions.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      title: "Get a formal quote",
      desc: "Happy with the layout? Tap the gold Quote button — your site plan goes straight to our team for pricing.",
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Site planner — quick start"
      onClick={(e) => {
        // Click on backdrop = dismiss; clicks on the card don't bubble.
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-hidden="true" />

      {/* Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-amber-200 w-full max-w-[560px] max-h-[90vh] overflow-y-auto"
        style={{ animation: "dialogSlideUp 0.25s ease-out" }}
      >
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-amber-50 transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-5 sm:px-7 pt-6 pb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-800 text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase">
            Quick Start
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2 leading-tight">
            Design your site in 3 steps
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Drag, draw, and drop your way to a professional site layout — then send it straight through for a quote.
          </p>
        </div>

        <ol className="px-5 sm:px-7 pb-5 space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/40 border border-amber-100">
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 border-amber-300 text-amber-700 text-xs font-extrabold">
                  {i + 1}
                </span>
                <span className="text-amber-700">{s.icon}</span>
              </div>
              <div className="min-w-0 pt-0.5">
                <div className="text-sm font-bold text-gray-900">{s.title}</div>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mt-0.5">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="px-5 sm:px-7 pb-6 pt-1">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-extrabold text-gray-900 bg-gold hover:brightness-110 active:brightness-95 transition-all shadow-sm"
          >
            Got it — start planning
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            We won&apos;t show this again on this device.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
