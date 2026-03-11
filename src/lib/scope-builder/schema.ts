export type HireOrBuy = "hire" | "buy" | "unsure";
export type PowerAccess = "grid" | "generator" | "limited" | "unknown";
export type ServiceAccess = "available" | "unavailable" | "unknown";

export type ScopeBuilderInput = {
  description: string;
  industry: string;
  projectType: string;
  hireOrBuy: HireOrBuy;
  headcount: number;
  location: string;
  duration: string;
  needsOffice: boolean;
  needsCrib: boolean;
  needsToilets: boolean;
  powerAccess: PowerAccess;
  waterAccess: ServiceAccess;
  wasteAccess: ServiceAccess;
  wantsTransportQuote: "yes" | "no" | "unsure";
  siteAccess: string;
  siteConstraints: string;
  prefersComplexOption: "yes" | "no" | "unsure";
};

export type ExtractedSignals = {
  industry?: string;
  projectType?: string;
  hireOrBuy?: HireOrBuy;
  headcount?: number;
  location?: string;
  duration?: string;
  needsOffice?: boolean;
  needsCrib?: boolean;
  needsToilets?: boolean;
  powerAccess?: PowerAccess;
  hints: string[];
  confidenceNote: string;
};

export type FollowUpQuestionId =
  | "services_available"
  | "power_strategy"
  | "mine_spec"
  | "mine_location"
  | "complex_preference"
  | "transport_quote"
  | "site_access"
  | "duration_clarification";

export type FollowUpQuestion = {
  id: FollowUpQuestionId;
  label: string;
  type: "select" | "text";
  options?: Array<{ value: string; label: string }>;
  required: boolean;
};

export type ScopeBuilderResult = {
  projectType: string;
  industry: string;
  hireOrBuy: HireOrBuy;
  headcount: number;
  location: string;
  duration: string;
  recommendedProducts: string[];
  suggestedAddOns: string[];
  assumptions: string[];
  questionsToConfirm: string[];
  siteConstraints: string[];
  summaryForSales: string;
  customerView: {
    projectSummary: string;
    recommendedSetup: string[];
    recommendedExtras: string[];
    detailsToConfirm: string[];
    preliminaryNotes: string[];
    nextSteps: string[];
  };
  internalBrief: string;
  disclaimer: string;
};

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

export const defaultScopeInput: ScopeBuilderInput = {
  description: "",
  industry: "",
  projectType: "",
  hireOrBuy: "unsure",
  headcount: 10,
  location: "",
  duration: "",
  needsOffice: true,
  needsCrib: true,
  needsToilets: true,
  powerAccess: "unknown",
  waterAccess: "unknown",
  wasteAccess: "unknown",
  wantsTransportQuote: "unsure",
  siteAccess: "",
  siteConstraints: "",
  prefersComplexOption: "unsure",
};

export function mergeScopeInput(base: ScopeBuilderInput, patch: Partial<ScopeBuilderInput>): ScopeBuilderInput {
  return {
    ...base,
    ...patch,
  };
}

export function parseScopeBuilderInput(payload: unknown): ScopeBuilderInput {
  if (!isObject(payload)) {
    throw new Error("Invalid request body.");
  }

  const input: ScopeBuilderInput = {
    description: String(payload.description ?? "").trim(),
    industry: String(payload.industry ?? "").trim(),
    projectType: String(payload.projectType ?? "").trim(),
    hireOrBuy: payload.hireOrBuy === "hire" || payload.hireOrBuy === "buy" || payload.hireOrBuy === "unsure" ? payload.hireOrBuy : "unsure",
    headcount: Number(payload.headcount ?? 0),
    location: String(payload.location ?? "").trim(),
    duration: String(payload.duration ?? "").trim(),
    needsOffice: Boolean(payload.needsOffice),
    needsCrib: Boolean(payload.needsCrib),
    needsToilets: Boolean(payload.needsToilets),
    powerAccess: payload.powerAccess === "grid" || payload.powerAccess === "generator" || payload.powerAccess === "limited" || payload.powerAccess === "unknown" ? payload.powerAccess : "unknown",
    waterAccess: payload.waterAccess === "available" || payload.waterAccess === "unavailable" || payload.waterAccess === "unknown" ? payload.waterAccess : "unknown",
    wasteAccess: payload.wasteAccess === "available" || payload.wasteAccess === "unavailable" || payload.wasteAccess === "unknown" ? payload.wasteAccess : "unknown",
    wantsTransportQuote: payload.wantsTransportQuote === "yes" || payload.wantsTransportQuote === "no" || payload.wantsTransportQuote === "unsure" ? payload.wantsTransportQuote : "unsure",
    siteAccess: String(payload.siteAccess ?? "").trim(),
    siteConstraints: String(payload.siteConstraints ?? "").trim(),
    prefersComplexOption: payload.prefersComplexOption === "yes" || payload.prefersComplexOption === "no" || payload.prefersComplexOption === "unsure" ? payload.prefersComplexOption : "unsure",
  };

  if (!input.description) {
    throw new Error("Please provide a project description.");
  }

  if (!input.projectType || !input.location || !input.duration) {
    throw new Error("Please complete project type, location, and duration.");
  }

  if (!Number.isFinite(input.headcount) || input.headcount < 1) {
    throw new Error("Headcount must be at least 1.");
  }

  return input;
}

export function parseFollowUpAnswers(payload: unknown): Record<string, string> {
  if (!isObject(payload) || !isObject(payload.followUpAnswers)) {
    return {};
  }

  return Object.entries(payload.followUpAnswers).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = String(value ?? "").trim();
    return acc;
  }, {});
}
