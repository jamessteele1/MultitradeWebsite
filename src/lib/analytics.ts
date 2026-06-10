// Conversion tracking for GA4 + Google Ads.
//
// gtag.js is loaded once in the root layout (via @next/third-parties
// GoogleAnalytics for G-D5JK1BWGE8) and also `config`-ed for the Google Ads
// tag AW-869595025, so both fire off the same gtag/dataLayer.

/** Google Ads conversion label — "Gads | Submit Lead Form" (A$110, 45-day window). */
const ADS_SEND_TO = "AW-869595025/eRXZCPOl4scaEJHv054D";
const LEAD_VALUE = 110.0;
const LEAD_CURRENCY = "AUD";

/**
 * The lead/conversion forms on the site. Passed as `form_name`/`form_type` so
 * GA4 (and the GA4 custom dimension) can break the conversion down by source.
 */
export type LeadFormType =
  | "contact" // Contact page form
  | "quote" // /quote — Get a Quote (no cart items)
  | "quote_cart" // /quote — submitted with items in the quote cart
  | "site_planner" // /quote — submitted from the Site Planner layout
  | "proposal" // Buy project page — Request a Proposal
  | "buy_lead"; // Buy page — lead capture / proven-design proposal

interface LeadDetails {
  /** Used for Google Ads enhanced conversions (Google hashes it client-side). */
  email?: string;
  /** Used for enhanced conversions — normalised to E.164 before sending. */
  phone?: string;
}

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: GtagFn; dataLayer?: unknown[] };
  if (typeof w.gtag === "function") {
    w.gtag(...args);
  } else {
    (w.dataLayer = w.dataLayer || []).push(args);
  }
}

/** Best-effort AU phone → E.164 (+61…) for Google Ads enhanced conversions. */
function toE164AU(phone?: string): string | undefined {
  if (!phone) return undefined;
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return "+" + trimmed.slice(1).replace(/\D/g, "");
  const d = trimmed.replace(/\D/g, "");
  if (!d) return undefined;
  if (d.startsWith("0")) return "+61" + d.slice(1);
  if (d.startsWith("61")) return "+" + d;
  return "+61" + d;
}

/**
 * Fire conversion tracking on a SUCCESSFUL lead-form submission (only after the
 * request actually went through — never on a validation error or network
 * failure). Fires three things:
 *  - `user_data` for Google Ads enhanced conversions (when email/phone given)
 *  - GA4 `form_submission` (GA reporting + the imported "GA4 | form_submission"
 *    Google Ads action)
 *  - Google Ads `conversion` → "Gads | Submit Lead Form" (AW-869595025)
 *
 * In GA4, mark `form_submission` as a Key event to measure it as a conversion.
 */
export function trackLead(formType: LeadFormType, details: LeadDetails = {}): void {
  if (typeof window === "undefined") return;
  try {
    const email = details.email?.trim() || undefined;
    const phone = toE164AU(details.phone);
    // Enhanced conversions — set before the conversion event fires.
    if (email || phone) {
      gtag("set", "user_data", {
        ...(email ? { email } : {}),
        ...(phone ? { phone_number: phone } : {}),
      });
    }
    // GA4 event (also imported into Google Ads as "GA4 | form_submission").
    // form_type kept for the existing GA4 "Form Type" custom dimension.
    gtag("event", "form_submission", { form_name: formType, form_type: formType });
    // Native Google Ads conversion — "Gads | Submit Lead Form".
    gtag("event", "conversion", {
      send_to: ADS_SEND_TO,
      value: LEAD_VALUE,
      currency: LEAD_CURRENCY,
    });
  } catch {
    /* analytics must never break a form submission */
  }
}
