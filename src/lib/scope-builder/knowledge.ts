export const MBH_HELPER_KNOWLEDGE = {
  snippets: [
    "If toilets are paired with waste tanks, the waste tank is set first and the building is craned on top.",
    "For single smaller buildings (often under 7.2m) with no accessories, tilt tray or super tilt delivery may be possible.",
    "Where tanks or accessories are involved, client crane is typically required.",
    "For mining projects, confirm mine-spec electrical requirement and mine name/location before final scope.",
    "Solar Toilet and Solar Facility are relevant where site power is limited or off-grid.",
  ],
  outOfScope:
    "That may be outside this Scope Builder's scope. I can help with portable building scoping and site setup requirements. For broader enquiries, contact MBH on 07 4979 2333 or james@multitrade.com.au.",
};

export function helperFallback(question: string): { answer: string; isOutOfScope: boolean } {
  const lower = question.toLowerCase();

  if (lower.includes("waste tank")) {
    return {
      answer:
        "If toilet facilities are being scoped and waste services are unavailable, a 4000L or 6000L waste tank is typically recommended. Stair & Landing is also a strong paired recommendation when toilets are on tanks.",
      isOutOfScope: false,
    };
  }

  if (lower.includes("no mains power") || lower.includes("off grid") || lower.includes("off-grid")) {
    return {
      answer:
        "For limited or no mains power, MBH may recommend Solar Toilet and/or Solar Facility depending on your setup. Generator supply can also be used, but generator hire and leads are by client/provider.",
      isOutOfScope: false,
    };
  }

  if (lower.includes("12 workers")) {
    return {
      answer:
        "For around 12 workers, a 6x3m or 12x3m crib option and a 6x3m office are common planning starting points, then refined against shift patterns, amenities, and site services.",
      isOutOfScope: false,
    };
  }

  if (lower.includes("mine") || lower.includes("mining")) {
    return {
      answer:
        "Yes, MBH can support mining projects. We typically confirm mine-spec electrical requirements, project standards, and mine name/location during scope qualification.",
      isOutOfScope: false,
    };
  }

  return { answer: MBH_HELPER_KNOWLEDGE.outOfScope, isOutOfScope: true };
}
