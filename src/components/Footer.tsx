import Link from "next/link";

const HIRE_LINKS = [
  { label: "Crib Rooms", href: "/hire/crib-rooms" },
  { label: "Site Offices", href: "/hire/site-offices" },
  { label: "Ablutions & Toilets", href: "/hire/ablutions" },
  { label: "Building Complexes", href: "/hire/complexes" },
  { label: "Shipping Containers", href: "/hire/containers" },
  { label: "Ancillary Equipment", href: "/hire/ancillary" },
];

const INDUSTRY_LINKS = [
  { label: "Mining & Resources", href: "/industries/mining" },
  { label: "Construction", href: "/industries/construction" },
  { label: "Oil & Gas", href: "/industries/oil-gas" },
  { label: "Civil Infrastructure", href: "/industries/civil" },
];

const LOCATION_LINKS = [
  { label: "Gladstone", href: "/locations/gladstone" },
  { label: "Emerald", href: "/locations/emerald" },
  { label: "Rockhampton", href: "/locations/rockhampton" },
  { label: "Mackay", href: "/locations/mackay" },
  { label: "Bowen Basin", href: "/locations/bowen-basin" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Solar Facility", href: "/solar-facility" },
  { label: "Contact", href: "/contact" },
  { label: "Get a Quote", href: "/quote" },
];

export default function Footer() {
  return (
    <footer className="relative" style={{ background: "linear-gradient(180deg, var(--navy) 0%, #060d1f 100%)" }}>
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
        {/* Top section — CTA bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-10 mb-10 border-b border-white/10">
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">Ready to Get Started?</h3>
            <p className="text-white/40 text-sm mt-1">Queensland&apos;s largest privately owned portable building fleet.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/quote" className="px-7 py-3 rounded-lg font-semibold text-sm text-gray-900 bg-gold hover:brightness-110 transition-all text-center">
              Get a Free Quote
            </Link>
            <a href="tel:0749792333" className="px-7 py-3 rounded-lg font-semibold text-sm text-white border border-white/20 hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              (07) 4979 2333
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img
                src="/images/logos/logo-white.png"
                alt="Multitrade Building Hire"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/30 text-xs leading-relaxed mb-4 max-w-[200px]">
              Design · Manufacture · Hire · Install
            </p>
            <div className="space-y-1.5 text-xs text-white/40">
              <div>ABN 36 010 138 600</div>
              <div>Est. 1980 — Gladstone, QLD</div>
            </div>
          </div>

          {/* Hire */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">Hire</h4>
            <ul className="space-y-2.5">
              {HIRE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white/80 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">Industries</h4>
            <ul className="space-y-2.5">
              {INDUSTRY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white/80 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">Locations</h4>
            <ul className="space-y-2.5">
              {LOCATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white/80 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white/80 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6 border-t border-white/10 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              6 South Trees Drive, Gladstone QLD 4680
            </div>
            <a href="tel:0749792333" className="flex items-center gap-2 hover:text-white/70 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              (07) 4979 2333
            </a>
            <a href="mailto:multitrade@multitrade.com.au" className="flex items-center gap-2 hover:text-white/70 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              multitrade@multitrade.com.au
            </a>
          </div>
          <div className="text-sm text-white/30">
            Mon–Fri: 7:00am – 5:00pm
          </div>
        </div>

        {/* Certifications & Bottom bar */}
        <div className="pt-6 border-t border-white/5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { std: "ISO 9001:2015", label: "Quality Management" },
              { std: "ISO 14001:2015", label: "Environmental Management" },
              { std: "ISO 45001:2018", label: "Health & Safety Management" },
            ].map((c) => (
              <div key={c.std} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logos/iso-logo.png"
                  alt="ISO"
                  className="w-10 h-10 flex-shrink-0 brightness-0 invert opacity-50"
                />
                <div>
                  <div className="text-sm font-bold text-white/60">{c.std}</div>
                  <div className="text-xs text-white/30">{c.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-xs text-white/20">
              © {new Date().getFullYear()} Multitrade Building Hire Pty Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs text-white/20">
              <span>Part of the Multitrade Group</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">C-RES BMA Certified</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">0 LTIs in 5+ Years</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
