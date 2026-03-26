"use client";

import { useState } from "react";

export default function CatalogueDownload() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = form.name.trim() && form.email.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    try {
      await fetch("/api/catalogue-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Graceful fallback
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Catalogue on its way</h3>
            <p className="text-gray-500 text-sm">
              We&apos;ll send the full product catalogue to <strong>{form.email}</strong> shortly.
              In the meantime, feel free to keep browsing or request a quote on any product.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden md:grid md:grid-cols-5">
          {/* Left: Info */}
          <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%)" }}>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-4 w-fit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              FREE DOWNLOAD
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">
              Full Product Catalogue
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Get our complete product catalogue with specifications, floorplans,
              and pricing for every building in our fleet — crib rooms, offices,
              ablutions, complexes, containers, and ancillary equipment.
            </p>
            <div className="space-y-2.5">
              {["35+ products with full specs", "Standard floorplans included", "Hire & purchase pricing guide"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white/70">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-3 p-6 md:p-8">
            <h4 className="font-bold text-gray-900 mb-1">Download the catalogue</h4>
            <p className="text-sm text-gray-500 mb-5">Enter your details and we&apos;ll send it straight to your inbox.</p>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    placeholder="Company name"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    placeholder="0400 000 000"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full py-3 rounded-lg text-sm font-bold text-white bg-gold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Send Me the Catalogue
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center">No spam. We&apos;ll only use your email to send the catalogue.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
