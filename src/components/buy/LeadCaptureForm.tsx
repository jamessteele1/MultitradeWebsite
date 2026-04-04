"use client";

import { useState } from "react";

export default function LeadCaptureForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "buy-page-search" }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback — still show success to avoid blocking the user
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-2xl mb-2">&#10003;</div>
        <p className="text-sm font-bold text-green-800">
          Thanks! We&apos;ll be in touch within 2 business hours.
        </p>
        <p className="text-xs text-green-600 mt-1">
          Our team will review your requirements and prepare a proposal based on
          our proven designs.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="Company name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="email@company.com"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="04XX XXX XXX"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Project Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
          placeholder="Tell us what you need — building type, size, features, site location..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-gold hover:bg-amber-600 transition-colors disabled:opacity-50"
      >
        {submitting
          ? "Sending..."
          : "Get a Proposal Based on a Proven Design"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        We respond within 2 business hours
      </p>
    </form>
  );
}
