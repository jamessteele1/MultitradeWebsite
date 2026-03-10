"use client";

import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import { useState } from "react";

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(212,168,67,.12) 0%,transparent 50%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Get a <span className="gold-text">Free Quote</span></h1>
          <p className="text-white/60 mt-4 serif">Tell us about your project. Our team responds within 2 business hours during business days.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 -mt-8">
        <div className="max-w-2xl mx-auto px-4">
          <FadeIn>
            <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-200 p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Received</h2>
                  <p className="text-gray-500 serif">Thank you! Our team will be in touch within 2 business hours.</p>
                  <p className="text-sm text-gray-400 mt-4">Need it sooner? Call us directly:</p>
                  <a href="tel:0749792333" className="text-lg font-bold gold-text hover:underline">(07) 4979 2333</a>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Your Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Company name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="email@company.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="04XX XXX XXX" />
                    </div>
                  </div>

                  <hr className="my-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Project Requirements</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What do you need? *</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                      <option value="">Select a product type...</option>
                      <option>Crib Room / Lunch Room</option>
                      <option>Site Office</option>
                      <option>Ablution / Toilet Block</option>
                      <option>Building Complex</option>
                      <option>Shipping Container</option>
                      <option>Solar Facility</option>
                      <option>Ancillary Equipment</option>
                      <option>Custom Build</option>
                      <option>Installation Services</option>
                      <option>Multiple Buildings / Full Camp Setup</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hire or Purchase?</label>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                        <option>Hire</option>
                        <option>Purchase</option>
                        <option>Not sure yet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Location</label>
                      <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="e.g. Moranbah, Gladstone..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Approx. Duration</label>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                        <option>Less than 1 month</option>
                        <option>1-3 months</option>
                        <option>3-6 months</option>
                        <option>6-12 months</option>
                        <option>12+ months</option>
                        <option>Ongoing / Permanent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">When do you need it?</label>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                        <option>ASAP</option>
                        <option>Within 1 week</option>
                        <option>Within 1 month</option>
                        <option>1-3 months</option>
                        <option>Just planning ahead</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" placeholder="Tell us about your project — site access requirements, crew size, special specifications, anything that helps us quote accurately..." />
                  </div>

                  <button
                    onClick={() => setSubmitted(true)}
                    className="w-full py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all text-base"
                  >
                    Submit Quote Request
                  </button>
                  <p className="text-xs text-gray-400 text-center">Or call us directly: <a href="tel:0749792333" className="font-semibold text-gray-600 hover:underline">(07) 4979 2333</a></p>
                </div>
              )}
            </div>
          </FadeIn>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { val: "2hr", label: "Response Time" },
              { val: "Free", label: "No Obligation" },
              { val: "45+", label: "Years Experience" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="text-xl font-extrabold text-gray-900">{s.val}</div>
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
