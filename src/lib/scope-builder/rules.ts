import { MBH_PRODUCTS } from "@/lib/scope-builder/products";
import type { ScopeBuilderInput, ScopeBuilderResult } from "@/lib/scope-builder/schema";

const byId = (id: string) => MBH_PRODUCTS.find((item) => item.id === id)?.name;

export function buildScopeRecommendation(input: ScopeBuilderInput): ScopeBuilderResult {
  const recommendedProducts = new Set<string>();
  const suggestedAddOns = new Set<string>();
  const assumptions = new Set<string>();
  const questionsToConfirm = new Set<string>();
  const constraints = new Set<string>();

  if (input.needsOffice) {
    if (input.headcount <= 5) {
      recommendedProducts.add(byId("office-3x3") || "3.0m x 3.0m Site Office");
    } else if (input.headcount <= 20) {
      recommendedProducts.add(byId("office-6x3") || "6.0m x 3.0m Site Office");
    } else {
      recommendedProducts.add(byId("office-12x3") || "12.0m x 3.0m Site Office");
    }
  }

  if (input.needsCrib) {
    if (input.headcount <= 10) {
      recommendedProducts.add(byId("crib-6x3") || "6.0m x 3.0m Crib Room");
    } else if (input.headcount <= 25) {
      recommendedProducts.add(byId("crib-12x3") || "12.0m x 3.0m Crib Room");
    } else {
      recommendedProducts.add(byId("complex-12x6") || "12.0m x 6.0m Office/Crib Complex");
    }
  }

  if (input.needsToilets) {
    if (input.headcount <= 10) {
      recommendedProducts.add(byId("ablution-36x24") || "3.6m x 2.4m Toilet Block");
    } else {
      recommendedProducts.add(byId("ablution-42x3") || "4.2m x 3.0m Ablution Block");
    }

    suggestedAddOns.add(byId("waste-tank") || "Waste Tank (4000L-6000L)");
    questionsToConfirm.add("Is potable water available onsite, or should MBH include water storage and pumping?");
    questionsToConfirm.add("Is sewer connection available, or should waste tanking and pump-out servicing be included?");
  }

  if (input.powerAccess === "limited" || input.powerAccess === "unknown") {
    suggestedAddOns.add(byId("solar-facility") || "Solar Facility Unit");
    assumptions.add("Power availability is limited or uncertain, so off-grid support options are included.");
    questionsToConfirm.add("What power sources are available (grid, generator, or none)?");
  }

  if (input.projectType.toLowerCase().includes("storage") || input.description.toLowerCase().includes("storage")) {
    recommendedProducts.add(byId("container-20") || "20ft Container");
  }

  if (input.headcount > 25 && input.needsOffice && input.needsCrib) {
    recommendedProducts.add(byId("complex-12x6") || "12.0m x 6.0m Office/Crib Complex");
    suggestedAddOns.add(byId("covered-deck") || "Covered Deck Module");
  }

  suggestedAddOns.add(byId("stairs-landing") || "Stair & Landing Set");

  if (input.hireOrBuy === "unsure" || input.duration.toLowerCase().includes("month") || input.duration.toLowerCase().includes("week")) {
    assumptions.add("This recommendation currently favours hire configuration for speed and flexibility.");
  }

  assumptions.add("Recommendation is preliminary and subject to final MBH review, engineering checks, and availability.");
  assumptions.add("Final scope, logistics, and compliance suitability are to be confirmed by the MBH team.");

  questionsToConfirm.add("Are there crane lift limits, delivery access constraints, or set-down restrictions on site?");
  questionsToConfirm.add("What are the required mobilisation dates and whether staged delivery is acceptable?");

  if (input.siteConstraints) {
    constraints.add(input.siteConstraints);
  } else {
    constraints.add("No specific site constraints provided yet.");
  }

  const summaryForSales = `Prospect requires a ${input.projectType.toLowerCase()} setup in ${input.location} for approximately ${input.duration.toLowerCase()}, supporting around ${input.headcount} personnel. Initial recommendation includes ${Array.from(recommendedProducts).slice(0, 3).join(", ")}. Key confirmation points are utilities, access logistics, and final fit-for-purpose review.`;

  return {
    projectType: input.projectType,
    industry: input.industry || "Unspecified",
    hireOrBuy: input.hireOrBuy,
    headcount: input.headcount,
    location: input.location,
    duration: input.duration,
    recommendedProducts: Array.from(recommendedProducts),
    suggestedAddOns: Array.from(suggestedAddOns),
    assumptions: Array.from(assumptions),
    questionsToConfirm: Array.from(questionsToConfirm),
    siteConstraints: Array.from(constraints),
    summaryForSales,
    disclaimer:
      "Preliminary recommendation only. Subject to final review, engineering suitability, and product availability. Final scope to be confirmed by the MBH team.",
  };
}
