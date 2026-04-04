"use client";

import { useState } from "react";
import ProposalForm from "./ProposalForm";

interface ProposalCTAProps {
  headline?: string;
  body?: string;
  className?: string;
  /** Project context — when provided, the form carries this info through */
  projectTitle?: string;
  projectCategory?: string;
  projectDimensions?: string;
  projectSlug?: string;
}

export default function ProposalCTA({
  headline = "We've built this before. Let's build yours.",
  body = "Tell us about your project and we'll send a proposal based on this proven design, tailored to your site requirements.",
  className = "",
  projectTitle,
  projectCategory,
  projectDimensions,
  projectSlug,
}: ProposalCTAProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      className={`rounded-xl p-6 md:p-8 ${className}`}
      style={{ background: "#0f1216" }}
    >
      <p className="text-lg font-bold text-white mb-2">{headline}</p>
      <p className="text-sm text-white/60 mb-5 leading-relaxed">{body}</p>

      {showForm ? (
        <ProposalForm
          variant="dark"
          projectTitle={projectTitle}
          projectCategory={projectCategory}
          projectDimensions={projectDimensions}
          projectSlug={projectSlug}
        />
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gold hover:bg-amber-600 transition-colors"
          >
            Request a Proposal
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <a
            href="tel:0749786122"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            (07) 4978 6122
          </a>
        </div>
      )}
    </div>
  );
}
