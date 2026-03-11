export default function ScopeIntro() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
        Build a preliminary scope in under 3 minutes
      </h2>
      <p className="text-gray-600 mt-3 serif">
        Tell us what you need in plain English and we&apos;ll build a preliminary portable
        building recommendation. The flow is AI-assisted, grounded in MBH products and
        business rules, and designed to ask only the most relevant follow-up questions.
      </p>
      <div className="mt-4 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3 font-medium">
        Preliminary recommendation only. Final scope is subject to MBH review, site
        conditions, availability, and project requirements.
      </div>
    </div>
  );
}