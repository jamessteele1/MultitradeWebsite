"use client";

import { useState } from "react";
import ProposalForm from "./ProposalForm";

interface SidebarProposalCardProps {
  projectTitle?: string;
  projectCategory?: string;
  projectDimensions?: string;
  projectSlug?: string;
}

export default function SidebarProposalCard({
  projectTitle,
  projectCategory,
  projectDimensions,
  projectSlug,
}: SidebarProposalCardProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="rounded-xl p-5 border border-amber-200 bg-amber-50">
      <h3 className="text-sm font-bold text-gray-900 mb-2">
        Need Something Similar?
      </h3>
      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
        We can build this design to your specifications — modified dimensions,
        different room layout, or custom features.
      </p>
      {showForm ? (
        <ProposalForm
          variant="light"
          projectTitle={projectTitle}
          projectCategory={projectCategory}
          projectDimensions={projectDimensions}
          projectSlug={projectSlug}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gold hover:bg-amber-600 transition-colors"
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
      )}
    </div>
  );
}
