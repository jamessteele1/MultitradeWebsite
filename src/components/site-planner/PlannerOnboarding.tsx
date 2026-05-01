"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "multitrade-planner-onboarding-dismissed";

type Props = {
  isMobile?: boolean;
};

/**
 * First-visit explainer for the site planner. Walks the user through the
 * three-step flow: add buildings → arrange → quote.
 *
 * Dismissed-state is persisted to localStorage so the banner only shows
 * until the user understands the tool.
 */
export default function PlannerOnboarding({ isMobile }: Props) {
  const [dismissed, setDismissed] = useState(true); // start hidden until we read storage

  useEffect(() => {
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

  if (dismissed) return null;

  const steps = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      title: "Add your buildings",
      desc: isMobile
        ? "Tap “Add” and pick the buildings you need. Tap on the canvas to drop them."
        : "Drag buildings from the left palette onto the grid — offices, crib rooms, toilets, decks, containers and more.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Design your site",
      desc: "Drag, rotate, and label buildings. Add a satellite map, mark out your work area, and check sun direction.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      title: "Get a formal quote",
      desc: "Happy with the layout? Tap the gold Quote button — your site plan goes straight to our team for pricing.",
    },
  ];

  return (
    <div
      className="relative rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-4 py-3 md:px-5 md:py-4 shadow-sm"
      role="dialog"
      aria-label="Site planner — quick start"
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-amber-100 transition-colors"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-3">
        <div className="flex-shrink-0">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-800 text-[11px] font-extrabold tracking-wider uppercase">
            Quick Start
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          <p className="text-sm md:text-base font-bold text-gray-900 mt-1.5 leading-tight">
            Design your site in 3 steps
          </p>
        </div>

        <ol className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 md:gap-3 md:flex-col md:items-start">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-amber-300 text-amber-700 text-[11px] font-extrabold">
                  {i + 1}
                </span>
                <span className="text-amber-700 md:hidden">{s.icon}</span>
              </div>
              <div className="min-w-0">
                <div className="hidden md:flex items-center gap-2 mb-1 text-amber-700">
                  {s.icon}
                  <span className="text-sm font-bold text-gray-900">{s.title}</span>
                </div>
                <span className="md:hidden text-sm font-bold text-gray-900 block">{s.title}</span>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={handleDismiss}
          className="md:flex-shrink-0 self-start md:self-center mt-1 md:mt-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
