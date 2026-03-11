"use client";

import { useState } from "react";
import ScopeQuestions from "@/components/scope-builder/ScopeQuestions";
import ScopeResult from "@/components/scope-builder/ScopeResult";
import type { ScopeBuilderInput, ScopeBuilderResult } from "@/lib/scope-builder/schema";

const initialState: ScopeBuilderInput = {
  description: "",
  industry: "",
  projectType: "",
  hireOrBuy: "hire",
  headcount: 10,
  location: "",
  duration: "",
  needsToilets: true,
  needsOffice: true,
  needsCrib: true,
  powerAccess: "unknown",
  siteConstraints: "",
};

export default function ScopeForm() {
  const [values, setValues] = useState<ScopeBuilderInput>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScopeBuilderResult | null>(null);

  const updateField = (field: keyof ScopeBuilderInput, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/scope-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to generate scope.");
      }

      setResult(payload as ScopeBuilderResult);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate scope.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Project Inputs</h2>
      <p className="text-sm text-gray-500 mb-5">Share your project details and we will generate a structured preliminary scope.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
          <textarea
            value={values.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            placeholder="Example: We need a temporary office + crib + toilets for a 16-person civil crew near Moranbah for 4 months."
          />
        </div>

        <ScopeQuestions values={values} onChange={updateField} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Known Site Constraints</label>
          <input
            value={values.siteConstraints}
            onChange={(e) => updateField("siteConstraints", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Access width, crane constraints, set-down limits, terrain, etc."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button onClick={onGenerate} disabled={loading} className="px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? "Generating preliminary scope..." : "Generate Preliminary Scope"}
        </button>
        <button
          onClick={() => {
            setValues(initialState);
            setResult(null);
            setError(null);
          }}
          className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {loading && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600">
          Interpreting your requirements and applying MBH scope rules...
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6">
          <ScopeResult result={result} />
        </div>
      )}
    </div>
  );
}
