"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      subject: String(fd.get("subject") || "").trim(),
      preferredContact: String(fd.get("preferredContact") || "Either"),
      message: String(fd.get("message") || "").trim(),
      sourcePage: typeof window !== "undefined" ? window.location.href : "",
    };

    if (!payload.firstName || !payload.email || !payload.message) {
      setError("Please fill in your name, email, and message.");
      setSubmitting(false);
      return;
    }

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      // Always show success to the user — the form was submitted, we just may
      // need to recover the lead from logs if monday.com was down.
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-900">Thanks — message received.</h3>
        <p className="text-sm text-emerald-800 mt-1">
          We respond within 2 business hours during the working week.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-xs font-semibold text-gray-700 mb-1">First name *</span>
          <input
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      </div>

      <label className="block">
        <span className="block text-xs font-semibold text-gray-700 mb-1">Subject</span>
        <input
          name="subject"
          placeholder="e.g. Quote inquiry, Service question, Partnership"
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-semibold text-gray-700 mb-1">Preferred contact</span>
        <select
          name="preferredContact"
          defaultValue="Either"
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        >
          <option value="Either">Either email or phone</option>
          <option value="Email">Email</option>
          <option value="Phone">Phone</option>
        </select>
      </label>

      <label className="block">
        <span className="block text-xs font-semibold text-gray-700 mb-1">Message *</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about your project — location, timeline, crew size, anything else useful."
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-y"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 disabled:opacity-60 transition-all"
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </>
        )}
      </button>

      <p className="text-[11px] text-gray-400">
        We respond within 2 business hours. Your details only ever go to the Multitrade sales team.
      </p>
    </form>
  );
}
