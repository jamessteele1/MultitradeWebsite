import Link from "next/link";
import type { ScopeBuilderResult } from "@/lib/scope-builder/schema";

type Props = {
  result: ScopeBuilderResult;
};

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
        {items.map((item) => (
          <li key={`${title}-${item}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ScopeResult({ result }: Props) {
  const enquiryBody = encodeURIComponent(`Scope Builder Summary\n\n${result.summaryForSales}\n\nRecommended Products:\n- ${result.recommendedProducts.join("\n- ")}\n\nQuestions to Confirm:\n- ${result.questionsToConfirm.join("\n- ")}`);

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-lg text-sm">
        Scope generated. This is a preliminary recommendation only and final scope is subject to MBH review.
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900">Sales Summary</h2>
        <p className="text-gray-700 mt-2 serif">{result.summaryForSales}</p>
        <p className="text-xs text-gray-500 mt-3">{result.disclaimer}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultList title="Recommended Building Mix" items={result.recommendedProducts} />
        <ResultList title="Suggested Add-ons" items={result.suggestedAddOns} />
        <ResultList title="Assumptions" items={result.assumptions} />
        <ResultList title="Questions to Confirm" items={result.questionsToConfirm} />
      </div>

      <ResultList title="Site Constraints" items={result.siteConstraints} />

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/quote" className="px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all text-center">
          Submit Enquiry
        </Link>
        <a
          href={`mailto:sales@multitrade.com.au?subject=Scope%20Builder%20Preliminary%20Scope&body=${enquiryBody}`}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-black transition-all text-center"
        >
          Email This Scope
        </a>
      </div>
    </div>
  );
}
