import { sendGAEvent } from "@next/third-parties/google";

/**
 * The forms on the site that count as a lead/conversion. Passed as the
 * `form_type` parameter so GA4 can break the single `generate_lead`
 * conversion down by which form produced it.
 */
export type LeadFormType =
  | "contact" // Contact page form
  | "quote" // /quote — Get a Quote (no cart items)
  | "quote_cart" // /quote — submitted with items in the quote cart
  | "site_planner" // /quote — submitted from the Site Planner layout
  | "proposal" // Buy project page — Request a Proposal
  | "buy_lead"; // Buy page — lead capture / proven-design proposal

/**
 * Fire GA4's recommended `generate_lead` event on a SUCCESSFUL form
 * submission (i.e. only after the request actually went through — never on
 * a validation error or network failure).
 *
 * To measure conversions in GA4: Admin → Events → toggle `generate_lead`
 * on as a "Key event". Register `form_type` as a custom dimension to break
 * the conversion down by source form (contact vs quote vs proposal, etc.).
 */
export function trackLead(
  formType: LeadFormType,
  extra: Record<string, string | number> = {},
): void {
  if (typeof window === "undefined") return;
  try {
    sendGAEvent("event", "generate_lead", { form_type: formType, ...extra });
  } catch {
    /* analytics must never break a form submission */
  }
}
