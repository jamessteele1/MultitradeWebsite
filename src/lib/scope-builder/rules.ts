import { PRODUCT_NAME_BY_ID } from "@/lib/scope-builder/products";
import { MBH_RULES, SCOPE_DISCLAIMER } from "@/lib/scope-builder/rules-data";
import type { ScopeBuilderInput, ScopeBuilderResult } from "@/lib/scope-builder/schema";

const productName = (id: string) => PRODUCT_NAME_BY_ID.get(id) ?? id;

function add(set: Set<string>, value?: string) {
  if (value) set.add(value);
}

export function buildScopeRecommendation(input: ScopeBuilderInput): ScopeBuilderResult {
  const recommendedProducts = new Set<string>();
  const suggestedAddOns = new Set<string>();
  const assumptions = new Set<string>();
  const questionsToConfirm = new Set<string>();
  const siteConstraints = new Set<string>();

  if (input.needsOffice) {
    if (input.headcount <= 1) {
      add(recommendedProducts, productName("office-3x3"));
      assumptions.add(MBH_RULES.officeCapacity.small);
    } else if (input.headcount <= 3) {
      add(recommendedProducts, productName("office-6x3"));
      assumptions.add(MBH_RULES.officeCapacity.medium);
    } else {
      add(recommendedProducts, productName("office-12x3"));
      assumptions.add(MBH_RULES.officeCapacity.large);
    }
  }

  if (input.needsCrib) {
    if (input.headcount <= 4) {
      add(recommendedProducts, productName("crib-3x3"));
    } else if (input.headcount <= 12) {
      add(recommendedProducts, productName("crib-6x3"));
    } else {
      add(recommendedProducts, productName("crib-12x3"));
    }
    assumptions.add(MBH_RULES.cribCapacity.selfContained);
    add(suggestedAddOns, productName("dual-hand-wash"));
  }

  if (input.needsToilets) {
    if (input.powerAccess === "limited") {
      add(recommendedProducts, productName("toilet-solar"));
    } else if (input.headcount <= 12) {
      add(recommendedProducts, productName("toilet-36x24"));
    } else {
      add(recommendedProducts, productName("toilet-6x3"));
    }

    questionsToConfirm.add("Do you already have services in the site area (power, water, waste)?");

    if (input.wasteAccess !== "available") {
      add(suggestedAddOns, productName("waste-tank-4000"));
      add(suggestedAddOns, productName("waste-tank-6000"));
      add(suggestedAddOns, productName("stair-landing"));
      assumptions.add(
        "Where toilets are set over waste tanks, tanks are generally set first and buildings are craned into place."
      );
    }

    if (input.waterAccess !== "available") {
      add(suggestedAddOns, productName("water-tank-5000-pump"));
    }
  }

  if (input.powerAccess === "limited" || input.powerAccess === "unknown") {
    add(recommendedProducts, productName("solar-facility"));
    assumptions.add(
      "Power constraints were identified, so solar/off-grid options are included for consideration."
    );
  }

  if (input.powerAccess === "generator") {
    assumptions.add(MBH_RULES.electrical.generatorPolicy);
    assumptions.add(MBH_RULES.electrical.plugUpgrade);
  }

  const exceedsSingleModule =
    input.headcount > MBH_RULES.thresholds.officeDesksSingleModuleMax ||
    input.headcount > MBH_RULES.thresholds.cribSeatsSingleModuleMax;

  if (exceedsSingleModule) {
    assumptions.add("Based on your team size, additional 12x3 single-floor modules are considered first.");
    questionsToConfirm.add(
      "Would you like MBH to include a complex option for integrated layout planning?"
    );

    if (input.prefersComplexOption === "yes") {
      add(suggestedAddOns, productName("complex-12x6"));
      assumptions.add(MBH_RULES.complexNote);
    }
  }

  if (
    input.projectType.toLowerCase().includes("storage") ||
    input.description.toLowerCase().includes("storage")
  ) {
    add(recommendedProducts, productName("container-20"));
  }

  if (input.industry.toLowerCase().includes("mining")) {
    questionsToConfirm.add("Do you require mine-spec electrical?");
    questionsToConfirm.add("Do you have a specific electrical or building standard?");
    questionsToConfirm.add("What is the mine name/location?");
  }

  if (
    input.projectType.toLowerCase().includes("shutdown") ||
    input.description.toLowerCase().includes("shutdown")
  ) {
    questionsToConfirm.add("How long is the shutdown hire?");
    questionsToConfirm.add("When does it start?");
  }

  questionsToConfirm.add("Would you like MBH to quote transport?");
  questionsToConfirm.add("What is the site access like for delivery and crane placement?");

  if (input.wantsTransportQuote === "yes") {
    assumptions.add("Transport pricing is requested in this preliminary scope.");
  }

  assumptions.add(MBH_RULES.electrical.standard15Amp);
  assumptions.add(MBH_RULES.electrical.largerBuilding);
  assumptions.add(MBH_RULES.logistics.craneMinimum);
  assumptions.add(MBH_RULES.logistics.craneByClient);
  assumptions.add(MBH_RULES.logistics.wastePumpOut);
  assumptions.add(SCOPE_DISCLAIMER);

  add(siteConstraints, input.siteAccess || undefined);
  add(siteConstraints, input.siteConstraints || undefined);

  if (!siteConstraints.size) {
    siteConstraints.add("Site access and constraints to be confirmed.");
  }

  const recommendedList = Array.from(recommendedProducts);
  const extrasList = Array.from(suggestedAddOns);
  const confirmList = Array.from(questionsToConfirm);
  const assumptionList = Array.from(assumptions);

  const summaryForSales = `Preliminary scope for ${input.projectType.toLowerCase()} in ${
    input.location
  } for approximately ${input.duration.toLowerCase()} with around ${
    input.headcount
  } personnel. Recommended setup includes ${
    recommendedList.join(", ") || "TBC"
  }, with confirmation required on site services, access, and final project requirements.`;

  const internalBrief = [
    `Industry: ${input.industry || "Unspecified"}`,
    `Project type: ${input.projectType}`,
    `Hire/buy: ${input.hireOrBuy}`,
    `Headcount: ${input.headcount}`,
    `Location: ${input.location}`,
    `Duration: ${input.duration}`,
    `Needs: office=${input.needsOffice}, crib=${input.needsCrib}, toilets=${input.needsToilets}`,
    `Services: power=${input.powerAccess}, water=${input.waterAccess}, waste=${input.wasteAccess}`,
    `Transport quote requested: ${input.wantsTransportQuote}`,
    `Site access: ${input.siteAccess || "Not provided"}`,
    `Site constraints: ${input.siteConstraints || "Not provided"}`,
  ].join("\n");

  return {
    projectType: input.projectType,
    industry: input.industry || "Unspecified",
    hireOrBuy: input.hireOrBuy,
    headcount: input.headcount,
    location: input.location,
    duration: input.duration,
    recommendedProducts: recommendedList,
    suggestedAddOns: extrasList,
    assumptions: assumptionList,
    questionsToConfirm: confirmList,
    siteConstraints: Array.from(siteConstraints),
    summaryForSales,
    customerView: {
      projectSummary: `Based on what you shared, we have prepared a preliminary setup for ${input.projectType.toLowerCase()} in ${input.location}.`,
      recommendedSetup: recommendedList,
      recommendedExtras: extrasList,
      detailsToConfirm: confirmList,
      preliminaryNotes: assumptionList,
      nextSteps: [
        "Review and edit your scope details below.",
        "Regenerate the recommendation if anything changes.",
        "Submit your enquiry and MBH will confirm the final scope.",
      ],
    },
    internalBrief,
    disclaimer: SCOPE_DISCLAIMER,
  };
}