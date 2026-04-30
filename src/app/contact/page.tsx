import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import ContactForm from "@/components/ContactForm";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Multitrade Building Hire. Head office: 6 South Trees Drive, Gladstone QLD 4680. Phone (07) 4979 2333. Portable building enquiries welcome.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Get in <span className="gold-text">Touch</span></h1>
          <p className="text-white/60 mt-4 max-w-lg mx-auto">We take every inquiry seriously and are prepared to travel to your site however remote.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="text-2xl mb-2">📞</div>
              <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
              <a href="tel:0749792333" className="text-lg font-semibold gold-text hover:underline">(07) 4979 2333</a>
              <p className="text-sm text-gray-500 mt-1">Mon–Fri, 7am–5pm</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="text-2xl mb-2">✉️</div>
              <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
              <a href="mailto:multitrade@multitrade.com.au" className="text-sm font-semibold gold-text hover:underline">multitrade@multitrade.com.au</a>
              <p className="text-sm text-gray-500 mt-1">We respond within 2 business hours</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
              <p className="text-sm text-gray-700">6 South Trees Drive</p>
              <p className="text-sm text-gray-500">Gladstone QLD 4680</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <FadeIn>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-sm text-gray-500 mb-6">
                Fill in your details and we&apos;ll get back to you within 2 business hours.
              </p>
              <ContactForm />
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Our Locations</h2>
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900">Gladstone — Head Office</h3>
                  <p className="text-sm text-gray-600 mt-1">6 South Trees Drive, PO BOX 8005, Gladstone QLD 4680</p>
                  <p className="text-sm text-gray-500 mt-1">Headquarters, manufacturing, fleet yard, and compliance testing facility.</p>
                </div>
                <div className="p-5 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900">Emerald — Regional Depot</h3>
                  <p className="text-sm text-gray-600 mt-1">Industrial Drive, Emerald QLD</p>
                  <p className="text-sm text-gray-500 mt-1">Bowen Basin regional hub. Building storage, maintenance, and rapid deployment.</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 mb-2">Connect With Us</h3>
                <div className="flex gap-3">
                  {["Facebook", "Instagram", "LinkedIn", "YouTube"].map((s, i) => (
                    <a key={i} href="#" className="px-3 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">{s}</a>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <MobileCTA />
    </>
  );
}
