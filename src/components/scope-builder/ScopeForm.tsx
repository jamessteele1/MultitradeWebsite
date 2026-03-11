"use client";

import { useMemo, useState } from "react";
import ScopeQuestions from "@/components/scope-builder/ScopeQuestions";
import ScopeResult from "@/components/scope-builder/ScopeResult";
import {
  defaultScopeInput,
  type FollowUpQuestion,
  type ScopeBuilderInput,
  type ScopeBuilderResult,
} from "@/lib/scope-builder/schema";

type Mode = "ai" | "manual";

type InterpretResponse = {
  extracted: {
    confidenceNote?: string;
    hints?: string[];
  };
  draftInput: ScopeBuilderInput;
  followUps: FollowUpQuestion[];
};

export default function ScopeForm() {
  const [mode, setMode] = useState<Mode>("ai");
  const [values, setValues] = useState<ScopeBuilderInput>(defaultScopeInput);
  const [followUps, setFollowUps] = useState<FollowUpQuestion[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [helperQuestion, setHelperQuestion] = useState("");
  const [helperReply, setHelperReply] = useState<string | null>(null);
  const [understoodNote, setUnderstoodNote] = useState<string>("");
  const [result, setResult] = useState<ScopeBuilderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const updateField = (field: keyof ScopeBuilderInput, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const canInterpret = values.description.trim().length > 10;

  const onInterpret = async () => {
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/scope-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "interpret", description: values.description }),
      });

      const payload = (await response.json()) as InterpretResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Unable to interpret project details.");
      }

      setValues(payload.draftInput);
      setFollowUps(payload.followUps);
      setUnderstoodNote(
        payload.extracted.confidenceNote ||
          "Based on the information provided, these details may need confirmation."
      );
      setIsEditing(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to interpret project details."
      );
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/scope-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recommend", input: values, followUpAnswers }),
      });

      const payload = (await response.json()) as {
        result?: ScopeBuilderResult;
        updatedInput?: ScopeBuilderInput;
        error?: string;
      };

      if (!response.ok || !payload.result || !payload.updatedInput) {
        throw new Error(payload.error || "Unable to generate recommendation.");
      }

      setValues(payload.updatedInput);
      setResult(payload.result);
      setIsEditing(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate recommendation."
      );
    } finally {
      setLoading(false);
    }
  };

  const onAskHelper = async () => {
    setHelperReply(null);

    if (!helperQuestion.trim()) {
      setHelperReply("Please ask a short scope-related question.");
      return;
    }

    const response = await fetch("/api/scope-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "helper", question: helperQuestion }),
    });

    const payload = (await response.json()) as { answer?: string; error?: string };

    if (!response.ok) {
      setHelperReply(payload.error || "Unable to load helper response.");
      return;
    }

    setHelperReply(payload.answer || "No helper response available.");
  };

  const understoodItems = useMemo(
    () => [
      `Industry: ${values.industry || "To be confirmed"}`,
      `Project type: ${values.projectType || "To be confirmed"}`,
      `Headcount: ${values.headcount || "To be confirmed"}`,
      `Location: ${values.location || "To be confirmed"}`,
      `Duration: ${values.duration || "To be confirmed"}`,
      `Likely facilities: ${
        [values.needsOffice ? "Office" : null, values.needsCrib ? "Crib" : null, values.needsToilets ? "Toilets" : null]
          .filter(Boolean)
          .join(", ") || "To be confirmed"
      }`,
    ],
    [values]
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode("ai")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            mode === "ai" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Describe my project (AI-first)
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            mode === "manual" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Build manually
        </button>
      </div>

      {mode === "ai" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe Your Project
            </label>
            <textarea
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={5}
              placeholder="Need lunch room, office and toilets for 18 workers near Moranbah for 4 months. Limited site power."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onInterpret}
              disabled={!canInterpret || loading}
              className="px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Interpreting..." : "Interpret & Ask Follow-up Questions"}
            </button>
            <button
              onClick={onGenerate}
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Generate Recommendation Now
            </button>
          </div>

          {isEditing && (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900">What we&apos;ve understood so far</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
                  {understoodItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-3">{understoodNote}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Update Details</h3>
                <ScopeQuestions values={values} onChange={updateField} />
              </div>

              {followUps.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">Targeted Follow-up Questions</h3>
                  {followUps.map((question) => (
                    <div key={question.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {question.label}
                      </label>
                      {question.type === "select" ? (
                        <select
                          value={followUpAnswers[question.id] ?? ""}
                          onChange={(event) =>
                            setFollowUpAnswers((prev) => ({
                              ...prev,
                              [question.id]: event.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm"
                        >
                          <option value="">Select</option>
                          {question.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={followUpAnswers[question.id] ?? ""}
                          onChange={(event) =>
                            setFollowUpAnswers((prev) => ({
                              ...prev,
                              [question.id]: event.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={onGenerate}
                disabled={loading}
                className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-black disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Preliminary Recommendation"}
              </button>
            </>
          )}
        </div>
      )}

      {mode === "manual" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Description *
            </label>
            <textarea
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <ScopeQuestions values={values} onChange={updateField} />
          <button
            onClick={onGenerate}
            disabled={loading}
            className="px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Preliminary Recommendation"}
          </button>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-900">Quick scope helper</h3>
        <p className="text-sm text-gray-500">
          Ask a short project scoping question. This helper is constrained to MBH scope guidance.
        </p>
        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          <input
            value={helperQuestion}
            onChange={(event) => setHelperQuestion(event.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm"
            placeholder="Do I need a waste tank?"
          />
          <button
            onClick={onAskHelper}
            className="px-5 py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-black"
          >
            Ask
          </button>
        </div>
        {helperReply && (
          <p className="mt-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">
            {helperReply}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <ScopeResult
          result={result}
          onEditScope={() => {
            setIsEditing(true);
            setMode("ai");
          }}
          onRegenerate={onGenerate}
        />
      )}
    </div>
  );
}