"use client";

import { useState, useEffect, useRef } from "react";

const COOKIE_NAME = "mbh_lead_unlocked";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return m ? decodeURIComponent(m.split("=")[1]) : null;
}
function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 24 * 60 * 60}; path=/; SameSite=Lax`;
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** Generates the PDF on demand and returns a base64 dataURL. */
  generatePdf: () => Promise<string | null>;
  /** Fallback path when the user picks "Just open it" — opens the PDF blob in a new tab. */
  productName?: string;
  productSlug?: string;
};

/**
 * Mobile-friendly PDF delivery modal.
 *
 * Mobile browsers handle jsPDF.save() inconsistently — iOS Safari opens a new
 * tab, Android Chrome downloads, and in-app browsers often fail silently. We
 * sidestep that by giving the user two reliable paths:
 *
 *   1. **Email me the PDF** — generates the PDF, posts to /api/email-pdf,
 *      Resend ships it. Captures the lead in Monday at the same time.
 *   2. **Just open it** — generates the PDF as a blob URL and opens in a new
 *      tab so the user can use their device's native share sheet.
 */
export default function MobilePdfDeliveryModal({
  open,
  onClose,
  generatePdf,
  productName = "Site Layout",
  productSlug = "site-planner",
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prefill from cookie if user previously unlocked
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const company = String(fd.get("company") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();

    if (!firstName || !email) {
      setError("Please fill in your name and email.");
      setSubmitting(false);
      return;
    }

    const pdfBase64 = await generatePdf();
    if (!pdfBase64) {
      setError("Couldn't generate the PDF. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/email-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          company,
          email,
          phone,
          pdfBase64,
          productName,
          productSlug,
          sourcePage: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = await res.json();
      setCookie(COOKIE_NAME, "1", 30);
      setSuccess(data.message || `PDF sent to ${email}.`);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenInTab = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const pdfBase64 = await generatePdf();
      if (!pdfBase64) {
        setError("Couldn't generate the PDF. Please try again.");
        return;
      }
      // Convert dataURL → Blob → object URL → open in a new tab
      const byteString = atob(pdfBase64.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener");
      onClose();
    } catch (err) {
      setError("Couldn't open the PDF — try the email option instead.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="relative w-full sm:w-auto sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => !submitting && onClose()}
          className="absolute top-3 right-3 p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {success ? (
          <div className="px-6 pt-8 pb-7 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-lg font-extrabold text-gray-900">PDF on its way</h2>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{success}</p>
            <button
              onClick={onClose}
              className="mt-5 w-full px-4 py-3 rounded-lg text-sm font-bold text-gray-900 bg-gold hover:brightness-110 transition-all"
            >
              Back to Site Planner
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="text-lg font-extrabold text-gray-900">Email yourself the PDF</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Mobile browsers don&apos;t always handle PDF downloads cleanly — we&apos;ll email it to you so you have a permanent record you can share.
              </p>
            </div>

            <form onSubmit={handleEmail} className="px-6 pb-5 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-700 mb-1">First name *</span>
                  <input
                    ref={inputRef}
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-700 mb-1">Last name</span>
                  <input
                    name="lastName"
                    autoComplete="family-name"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-xs font-semibold text-gray-700 mb-1">Company</span>
                <input
                  name="company"
                  autoComplete="organization"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-semibold text-gray-700 mb-1">Email *</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone <span className="font-normal text-gray-400">(optional)</span>
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </label>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-3 rounded-lg text-sm font-bold text-gray-900 bg-gold hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Email me the PDF
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 my-1.5">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">or</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={handleOpenInTab}
                disabled={submitting}
                className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Just open it in my browser
              </button>

              <p className="text-[11px] text-gray-400 leading-relaxed text-center">
                We only use your details to send the PDF and follow up if you have a project.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
