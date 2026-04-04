"use client";

import { useState } from "react";

interface ProposalFormProps {
  /** Pre-filled context from the project page */
  projectTitle?: string;
  projectCategory?: string;
  projectDimensions?: string;
  projectSlug?: string;
  /** Visual variant */
  variant?: "dark" | "light";
}

export default function ProposalForm({
  projectTitle,
  projectCategory,
  projectDimensions,
  projectSlug,
  variant = "light",
}: ProposalFormProps) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isDark = variant === "dark";
  const hasContext = !!(projectTitle || projectCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: projectSlug
            ? `project-page:${projectSlug}`
            : "buy-page-search",
          projectTitle: projectTitle || null,
          projectCategory: projectCategory || null,
          projectDimensions: projectDimensions || null,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={`rounded-xl border p-6 text-center ${
          isDark
            ? "border-green-500/30 bg-green-500/10"
            : "border-green-200 bg-green-50"
        }`}
      >
        <div className="text-2xl mb-2">&#10003;</div>
        <p
          className={`text-sm font-bold ${isDark ? "text-green-400" : "text-green-800"}`}
        >
          Thanks! We&apos;ll be in touch within 2 business hours.
        </p>
        <p
          className={`text-xs mt-1 ${isDark ? "text-green-400/70" : "text-green-600"}`}
        >
          {hasContext
            ? `Our team will prepare a proposal based on our ${projectCategory || "custom"} experience.`
            : "Our team will review your requirements and prepare a proposal based on our proven designs."}
        </p>
      </div>
    );
  }

  const inputClass = isDark
    ? "w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
    : "w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500";

  const labelClass = isDark
    ? "block text-xs font-semibold text-white/60 mb-1"
    : "block text-xs font-semibold text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {hasContext && (
        <div
          className={`rounded-lg px-3 py-2 text-xs ${
            isDark
              ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
              : "bg-amber-50 border border-amber-200 text-amber-800"
          }`}
        >
          Requesting proposal for:{" "}
          <span className="font-bold">
            {projectTitle || projectCategory}
          </span>
          {projectDimensions && ` (${projectDimensions})`}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className={labelClass}>Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
            placeholder="Company name"
          />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="email@company.com"
          />
        </div>
        <div>
          <label className={labelClass}>Phone *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            placeholder="04XX XXX XXX"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>
          {hasContext
            ? "Tell us about your project — site location, modifications, timeline..."
            : "Project Description"}
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder={
            hasContext
              ? `e.g. We need a similar ${projectCategory?.toLowerCase() || "building"} for our site in the Bowen Basin, with some layout changes...`
              : "Tell us what you need — building type, size, features, site location..."
          }
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-gold hover:bg-amber-600 transition-colors disabled:opacity-50"
      >
        {submitting
          ? "Sending..."
          : hasContext
            ? "Request a Proposal for This Design"
            : "Get a Proposal Based on a Proven Design"}
      </button>
      <p
        className={`text-xs text-center ${isDark ? "text-white/30" : "text-gray-400"}`}
      >
        We respond within 2 business hours
      </p>
    </form>
  );
}
