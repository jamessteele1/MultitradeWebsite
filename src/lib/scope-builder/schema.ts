export type HireOrBuy = "hire" | "buy" | "unsure";
export type PowerAccess = "grid" | "generator" | "limited" | "unknown";

export type ScopeBuilderInput = {
  description: string;
  industry: string;
  projectType: string;
  hireOrBuy: HireOrBuy;
  headcount: number;
  location: string;
  duration: string;
  needsToilets: boolean;
  needsOffice: boolean;
  needsCrib: boolean;
  powerAccess: PowerAccess;
  siteConstraints: string;
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
  disclaimer: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function parseScopeBuilderInput(payload: unknown): ScopeBuilderInput {
  if (!isObject(payload)) {
    throw new Error("Invalid request body.");
  }

  const input: ScopeBuilderInput = {
    description: String(payload.description ?? "").trim(),
    industry: String(payload.industry ?? "").trim(),
    projectType: String(payload.projectType ?? "").trim(),
    hireOrBuy: (payload.hireOrBuy === "hire" || payload.hireOrBuy === "buy" || payload.hireOrBuy === "unsure"
      ? payload.hireOrBuy
      : "unsure") as HireOrBuy,
    headcount: Number(payload.headcount ?? 0),
    location: String(payload.location ?? "").trim(),
    duration: String(payload.duration ?? "").trim(),
    needsToilets: Boolean(payload.needsToilets),
    needsOffice: Boolean(payload.needsOffice),
    needsCrib: Boolean(payload.needsCrib),
    powerAccess: (payload.powerAccess === "grid" || payload.powerAccess === "generator" || payload.powerAccess === "limited" || payload.powerAccess === "unknown"
      ? payload.powerAccess
      : "unknown") as PowerAccess,
    siteConstraints: String(payload.siteConstraints ?? "").trim(),
  };

  if (!input.description || !input.projectType || !input.location || !input.duration) {
    throw new Error("Please complete all required fields.");
  }

  if (!Number.isFinite(input.headcount) || input.headcount < 1) {
    throw new Error("Headcount must be at least 1.");
  }

  return input;
}
