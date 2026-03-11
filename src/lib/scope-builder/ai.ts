import { helperFallback, MBH_HELPER_KNOWLEDGE } from "@/lib/scope-builder/knowledge";
import type { ExtractedSignals, FollowUpQuestion, ScopeBuilderInput } from "@/lib/scope-builder/schema";

type AiMessage = { role: "system" | "user"; content: string };

const model = process.env.SCOPE_BUILDER_AI_MODEL ?? "gpt-4o-mini";
const apiKey = process.env.SCOPE_BUILDER_AI_API_KEY;
const apiBaseUrl = process.env.SCOPE_BUILDER_AI_BASE_URL ?? "https://api.openai.com/v1";

async function runJson<T>(messages: AiMessage[]): Promise<T | null> {
  if (!apiKey) return null;

  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = payload.choices?.[0]?.message?.content;
  if (!text) return null;

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  return JSON.parse(match[0]) as T;
}

export async function extractSignalsFromDescription(description: string): Promise<ExtractedSignals | null> {
  const aiResult = await runJson<ExtractedSignals>([
    {
      role: "system",
      content:
        "Extract MBH scope signals from user text. Return JSON only. Be conservative, no invented details, uncertainty in confidenceNote, and include hints array.",
    },
    {
      role: "user",
      content: `Description: ${description}`,
    },
  ]);

  if (aiResult) return aiResult;

  const lower = description.toLowerCase();
  const inferredHeadcountMatch = lower.match(/(\d{1,3})\s*(workers|people|staff|person)/);
  const inferredDurationMatch = lower.match(/(\d+\s*(week|weeks|month|months|year|years))/);

  return {
    industry: lower.includes("mining") ? "Mining" : lower.includes("civil") ? "Civil" : undefined,
    projectType: lower.includes("shutdown") ? "Shutdown facilities" : lower.includes("office") ? "Site office setup" : "Portable building scope",
    headcount: inferredHeadcountMatch ? Number(inferredHeadcountMatch[1]) : undefined,
    duration: inferredDurationMatch ? inferredDurationMatch[1] : undefined,
    needsOffice: lower.includes("office"),
    needsCrib: lower.includes("crib") || lower.includes("lunch"),
    needsToilets: lower.includes("toilet") || lower.includes("ablution"),
    powerAccess: lower.includes("limited power") || lower.includes("no power") ? "limited" : undefined,
    location: lower.includes("moranbah") ? "Moranbah" : lower.includes("gladstone") ? "Gladstone" : undefined,
    hints: ["Deterministic extraction fallback used."],
    confidenceNote: "Based on the description provided, inferred values may need confirmation.",
  };
}

export function buildDynamicFollowUps(input: ScopeBuilderInput): FollowUpQuestion[] {
  const questions: FollowUpQuestion[] = [];

  if (input.needsToilets) {
    questions.push({
      id: "services_available",
      label: "Do you already have site services available (power, water, waste)?",
      type: "select",
      options: [
        { value: "all", label: "All services available" },
        { value: "partial", label: "Some services available" },
        { value: "none", label: "No services available" },
        { value: "unknown", label: "Not sure yet" },
      ],
      required: true,
    });
  }

  if (input.powerAccess === "limited" || input.powerAccess === "unknown") {
    questions.push({
      id: "power_strategy",
      label: "Would you like MBH to scope generator-compatible options, solar/off-grid options, or both?",
      type: "select",
      options: [
        { value: "generator", label: "Generator-compatible" },
        { value: "solar", label: "Solar/off-grid" },
        { value: "both", label: "Show both" },
      ],
      required: true,
    });
  }

  if (input.industry.toLowerCase().includes("mining")) {
    questions.push({ id: "mine_spec", label: "Do you require mine-spec electrical for this project?", type: "select", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }], required: true });
    questions.push({ id: "mine_location", label: "What is the mine name/location?", type: "text", required: false });
  }

  if (input.headcount > 24 || input.headcount > 6) {
    questions.push({
      id: "complex_preference",
      label: "Would you like MBH to include a complex option, or focus on additional single-floor modules first?",
      type: "select",
      options: [
        { value: "single-first", label: "Single modules first" },
        { value: "include-complex", label: "Include complex option" },
      ],
      required: true,
    });
  }

  if (!input.duration) {
    questions.push({ id: "duration_clarification", label: "When does the hire start and how long is it needed?", type: "text", required: true });
  }

  questions.push({ id: "transport_quote", label: "Would you like MBH to include transport pricing?", type: "select", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }], required: true });
  questions.push({ id: "site_access", label: "What is site access like for delivery and crane positioning?", type: "text", required: true });

  return questions.slice(0, 6);
}

export async function helperAnswer(question: string): Promise<{ answer: string; isOutOfScope: boolean }> {
  const ai = await runJson<{ answer?: string; isOutOfScope?: boolean }>([
    {
      role: "system",
      content:
        "You are MBH Scope Helper. Keep answers short, practical, MBH-specific. No product invention. If out of scope, set isOutOfScope true and redirect to MBH contact. Return JSON only with answer and isOutOfScope.",
    },
    {
      role: "user",
      content: `Question: ${question}\nKnowledge: ${MBH_HELPER_KNOWLEDGE.snippets.join(" ")}\nOutOfScope: ${MBH_HELPER_KNOWLEDGE.outOfScope}`,
    },
  ]);

  if (ai?.answer) {
    return { answer: ai.answer, isOutOfScope: Boolean(ai.isOutOfScope) };
  }

  return helperFallback(question);
}
