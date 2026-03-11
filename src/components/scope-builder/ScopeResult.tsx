"use client";

import Link from "next/link";
import type { ScopeBuilderResult } from "@/lib/scope-builder/schema";

type Props = {
  result: ScopeBuilderResult;
  onEditScope: () => void;
  onRegenerate: () => void;
};

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
        {items.map((item) => (
          <li key={`${title}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ScopeResult({ result, onEditScope, onRegenerate }: Props) {
  const mailBody = encodeURIComponent([
    "Scope Builder Preliminary Recommendation",
    "",
    `Customer-facing summary: ${result.customerView.projectSummary}`,
    "",
    "Recommended setup:",
    ...result.recommendedProducts.map((item) => `- ${item}`),
    "",
    "Suggested extras:",
    ...result.suggestedAddOns.map((item) => `- ${item}`),
    "",
    "Internal brief:",
    result.internalBrief,
    "",
    `Disclaimer: ${result.disclaimer}`,
  ].join("\n"));

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900 font-medium">
        {result.disclaimer}
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900">Your Project Summary</h2>
        <p className="text-sm text-gray-700 mt-2">{result.customerView.projectSummary}</p>
        <p className="text-sm text-gray-700 mt-2">{result.summaryForSales}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Recommended Building Setup" items={result.customerView.recommendedSetup} />
        <Section title="Recommended Extras" items={result.customerView.recommendedExtras} />
        <Section title="A Few Details to Confirm" items={result.customerView.detailsToConfirm} />
        <Section title="Preliminary Scope Notes" items={result.customerView.preliminaryNotes} />
      </div>

      <Section title="Next Steps" items={result.customerView.nextSteps} />

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Internal-ready brief (included in submission)</h3>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{result.internalBrief}</pre>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onEditScope} className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-800 hover:bg-gray-50">
          Edit Scope
        </button>
        <button onClick={onRegenerate} className="px-6 py-3 rounded-lg font-semibold bg-gray-900 text-white hover:bg-black">
          Regenerate Recommendation
        </button>
        <Link href="/quote" className="px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 text-center">
          Submit Enquiry
        </Link>
        <a href={`mailto:james@multitrade.com.au?subject=Scope%20Builder%20Preliminary%20Recommendation&body=${mailBody}`} className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-black text-center">
          Submit by Email
        </a>
      </div>
    </div>
  );
}
