"use client";

import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import { useQuoteCart, type CartItem } from "@/context/QuoteCartContext";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const CATEGORY_LABELS: Record<CartItem["category"], string> = {
  "crib-rooms": "Crib Room",
  "site-offices": "Site Office",
  ablutions: "Ablution",
  containers: "Container",
  complexes: "Complex",
  ancillary: "Ancillary",
};

const DURATION_LABELS: Record<CartItem["duration"], string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  purchase: "Purchase",
};

type FormData = {
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  projectLocation: string;
  inquiryType: "Hire" | "Sale" | "Both";
  timeline: string;
  details: string;
};

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  company: "",
  jobTitle: "",
  email: "",
  phone: "",
  address: "",
  projectLocation: "",
  inquiryType: "Hire",
  timeline: "",
  details: "",
};

export default function QuotePage() {
  const { items, removeItem, updateQuantity, updateDuration, clearCart, itemCount } = useQuoteCart();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const buildQuoteSummary = () => {
    return items
      .map(
        (item) =>
          `${item.quantity}x ${item.name} (${item.size}) — ${CATEGORY_LABELS[item.category]} — ${DURATION_LABELS[item.duration]}`
      )
      .join("\n");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.email || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quoteSummary: buildQuoteSummary(),
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            size: item.size,
            category: item.category,
            quantity: item.quantity,
            duration: item.duration,
          })),
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSubmitted(true);
      clearCart();
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent";
  const selectClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      <Header />
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%,rgba(212,168,67,.12) 0%,transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Review Your <span className="gold-text">Quote</span>
          </h1>
          <p className="text-white/60 mt-4">
            {items.length > 0
              ? `You have ${itemCount} item${itemCount !== 1 ? "s" : ""} in your quote. Review below and submit your request.`
              : "Add products to your quote, then fill in your details to get a free quote."}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 -mt-8">
        <div className="max-w-3xl mx-auto px-4">
          {submitted ? (
            <FadeIn>
              <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-200 p-8 md:p-12 text-center">
                <div
                  className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5"
                  style={{ animation: "successPulse 1.2s ease-out 0.3s" }}
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ animation: "checkPop 0.5s ease-out 0.2s both" }}
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quote Request Submitted
                </h2>
                <p className="text-gray-500">
                  Thank you! Our team will review your quote and be in touch
                  within 2 business hours.
                </p>
                <p className="text-sm text-gray-400 mt-6">
                  Need it sooner? Call us directly:
                </p>
                <a
                  href="tel:0749792333"
                  className="text-lg font-bold gold-text hover:underline"
                >
                  (07) 4979 2333
                </a>
                <div className="mt-8">
                  <Link
                    href="/hire"
                    className="inline-block px-6 py-3 rounded-lg text-sm font-semibold bg-gold text-gray-900 hover:brightness-110 transition-all"
                  >
                    Continue Browsing
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : (
            <>
              {/* ── Quote Items ── */}
              <FadeIn>
                <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      Quote Items
                      {itemCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gold/20 text-amber-800">
                          {itemCount}
                        </span>
                      )}
                    </h2>
                    {items.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9ca3af"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        No items in your quote yet
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Browse our products and add items to build your quote.
                      </p>
                      <Link
                        href="/hire"
                        className="inline-block mt-5 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gold text-gray-900 hover:brightness-110 transition-all"
                      >
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {items.map((item) => (
                        <div key={item.id} className="px-6 py-4">
                          <div className="flex gap-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="text-sm font-bold text-gray-900">
                                    {item.name}
                                  </h3>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {CATEGORY_LABELS[item.category]} &middot;{" "}
                                    {item.size}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-1.5 rounded hover:bg-gray-100 flex-shrink-0 transition-colors"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#9ca3af"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </div>

                              <div className="flex items-center gap-3 mt-3">
                                {/* Quantity */}
                                <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={item.quantity <= 1}
                                    className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                                  >
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                    >
                                      <line
                                        x1="5"
                                        y1="12"
                                        x2="19"
                                        y2="12"
                                      />
                                    </svg>
                                  </button>
                                  <span className="px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-[32px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                                  >
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                    >
                                      <line
                                        x1="12"
                                        y1="5"
                                        x2="12"
                                        y2="19"
                                      />
                                      <line
                                        x1="5"
                                        y1="12"
                                        x2="19"
                                        y2="12"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                {/* Duration */}
                                <select
                                  value={item.duration}
                                  onChange={(e) =>
                                    updateDuration(
                                      item.id,
                                      e.target.value as CartItem["duration"]
                                    )
                                  }
                                  className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gold"
                                >
                                  {Object.entries(DURATION_LABELS).map(
                                    ([val, label]) => (
                                      <option key={val} value={val}>
                                        {label}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* ── Customer Details Form ── */}
              <FadeIn delay={0.1}>
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-200 p-6 md:p-8"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-5">
                    Your Details
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>First Name *</label>
                        <input
                          type="text"
                          required
                          value={form.firstName}
                          onChange={(e) => set("firstName", e.target.value)}
                          className={inputClass}
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => set("lastName", e.target.value)}
                          className={inputClass}
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Company Name</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => set("company", e.target.value)}
                          className={inputClass}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Job Title</label>
                        <input
                          type="text"
                          value={form.jobTitle}
                          onChange={(e) => set("jobTitle", e.target.value)}
                          className={inputClass}
                          placeholder="e.g. Project Manager"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
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
                          onChange={(e) => set("phone", e.target.value)}
                          className={inputClass}
                          placeholder="04XX XXX XXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Business Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        className={inputClass}
                        placeholder="Street address, city, state"
                      />
                    </div>

                    <hr className="my-2" />
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      Project Info
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>
                          Type of Inquiry *
                        </label>
                        <select
                          value={form.inquiryType}
                          onChange={(e) =>
                            set(
                              "inquiryType",
                              e.target.value as FormData["inquiryType"]
                            )
                          }
                          className={selectClass}
                        >
                          <option value="Hire">Hire</option>
                          <option value="Sale">Purchase / Sale</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Project Location</label>
                        <input
                          type="text"
                          value={form.projectLocation}
                          onChange={(e) =>
                            set("projectLocation", e.target.value)
                          }
                          className={inputClass}
                          placeholder="e.g. Moranbah, Gladstone..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Timeline</label>
                      <select
                        value={form.timeline}
                        onChange={(e) => set("timeline", e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select timeline...</option>
                        <option>ASAP</option>
                        <option>Within 1 week</option>
                        <option>Within 1 month</option>
                        <option>1-3 months</option>
                        <option>3-6 months</option>
                        <option>Just planning ahead</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Additional Details
                      </label>
                      <textarea
                        rows={4}
                        value={form.details}
                        onChange={(e) => set("details", e.target.value)}
                        className={`${inputClass} resize-none`}
                        placeholder="Tell us about your project — site access requirements, crew size, special specifications..."
                      />
                    </div>

                    {error && (
                      <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Submit Quote Request"}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      We respond within 2 business hours. Or call us directly:{" "}
                      <a
                        href="tel:0749792333"
                        className="font-semibold text-gray-600 hover:underline"
                      >
                        (07) 4979 2333
                      </a>
                    </p>
                  </div>
                </form>
              </FadeIn>
            </>
          )}

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { val: "2hr", label: "Response Time" },
              { val: "Free", label: "No Obligation" },
              { val: "45+", label: "Years Experience" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200"
              >
                <div className="text-xl font-extrabold text-gray-900">
                  {s.val}
                </div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MobileCTA />
    </>
  );
}
