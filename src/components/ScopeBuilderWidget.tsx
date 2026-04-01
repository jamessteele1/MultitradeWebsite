"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ScopeWizard = dynamic(() => import("@/components/scope-builder/ScopeWizard"), {
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  ),
});

export default function ScopeBuilderWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4">
        {!isOpen ? (
          /* ── Collapsed State ── */
          <div
            className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg shadow-black/5 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />

            <div className="relative z-10 px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
              {/* Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gold/15 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/25 transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <path d="M17.5 14v7M14 17.5h7" />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                  Not sure what you need? <span className="gold-text">Build your site setup.</span>
                </h2>
                <p className="text-white/50 mt-2 text-sm md:text-base max-w-lg">
                  Select your facilities, team size, and site conditions — we&apos;ll recommend the right buildings and equipment in under 2 minutes.
                </p>
              </div>

              {/* CTA */}
              <button className="px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all flex items-center gap-2 flex-shrink-0 group-hover:scale-[1.03]">
                Start Building
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* ── Expanded State ── */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Build Your <span className="gold-text">Site Setup</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select what you need and we&apos;ll recommend the right buildings and equipment.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
                aria-label="Close scope builder"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <ScopeWizard />
          </div>
        )}
      </div>
    </section>
  );
}
