"use client";

import { useState, useEffect, useCallback } from "react";

const COOKIE_NAME = "mbh_lead_unlocked";
const COOKIE_DAYS = 30;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 24 * 60 * 60}; path=/; SameSite=Lax`;
}

type Props = {
  /** Public URL of the PDF to download. */
  pdfUrl: string;
  /** Friendly product name shown in the modal and saved to CRM. */
  productName: string;
  /** Internal slug for analytics ("12x3m-crib-room"). */
  productSlug?: string;
  /** Optional className for the trigger button. */
  className?: string;
  /** Variant: "primary" (filled gold) or "ghost" (outlined). */
  variant?: "primary" | "ghost" | "subtle";
  /** Optional override of the trigger button label. */
  label?: string;
};

const triggerStyles: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all",
  ghost:
    "px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition-all",
  subtle:
    "px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors",
};

export default function PdfDownloadGate({
  pdfUrl,
  productName,
  productSlug,
  className,
  variant = "ghost",
  label = "Download Floor Plan (PDF)",
}: Props) {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUnlocked(!!readCookie(COOKIE_NAME));
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const triggerDownload = useCallback(() => {
    // Open in a new tab so the user keeps their place on the product page.
    window.open(pdfUrl, "_blank", "noopener");
  }, [pdfUrl]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (unlocked) {
      triggerDownload();
    } else {
      setOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      pdfUrl,
      productName,
      productSlug,
      sourcePage: typeof window !== "undefined" ? window.location.href : "",
    };

    if (!payload.firstName || !payload.email) {
      setError("Please fill in your name and email.");
      setSubmitting(false);
      return;
    }

    try {
      await fetch("/api/pdf-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Swallow — never block the user from their download.
    }

    setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
    setUnlocked(true);
    setOpen(false);
    setSubmitting(false);
    triggerDownload();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className || triggerStyles[variant]}
      >
        <span className="inline-flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          {label}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-gate-title"
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => !submitting && setOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="px-6 pt-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h2 id="pdf-gate-title" className="text-xl font-extrabold text-gray-900">
                Download the Floor Plan
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Just a few details so we can send you the right info and follow up with a quote.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {productName}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-700 mb-1">First name *</span>
                  <input
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-700 mb-1">Last name</span>
                  <input
                    name="lastName"
                    autoComplete="family-name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-xs font-semibold text-gray-700 mb-1">Company</span>
                <input
                  name="company"
                  autoComplete="organization"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-semibold text-gray-700 mb-1">Email *</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
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
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </label>

              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}

              <p className="text-[11px] text-gray-400 leading-relaxed">
                We&apos;ll only use this to send your PDF and follow up if you have a project. No spam — we hate it too.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-900 bg-gold hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Download PDF
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => !submitting && setOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
