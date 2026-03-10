"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  {
    label: "Hire",
    href: "/hire",
    children: [
      { label: "Crib Rooms", href: "/hire/crib-rooms" },
      { label: "Site Offices", href: "/hire/site-offices" },
      { label: "Ablutions & Toilets", href: "/hire/ablutions" },
      { label: "Complexes", href: "/hire/complexes" },
      { label: "Containers", href: "/hire/containers" },
      { label: "Ancillary", href: "/hire/ancillary" },
    ],
  },
  { label: "Buy", href: "/buy" },
  { label: "Services", href: "/services" },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Mining & Resources", href: "/industries/mining" },
      { label: "Construction", href: "/industries/construction" },
      { label: "Oil & Gas", href: "/industries/oil-gas" },
      { label: "Civil Infrastructure", href: "/industries/civil" },
    ],
  },
  { label: "Solar Facility", href: "/solar-facility" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/images/logos/logo-color.png"
            alt="Multitrade Building Hire"
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={i}
              className="relative"
              onMouseEnter={() =>
                item.children && setActiveDropdown(i)
              }
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                {item.label}
                {item.children && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                )}
              </Link>
              {item.children && activeDropdown === i && (
                <div className="absolute top-full left-0 bg-white rounded-lg shadow-xl shadow-black/10 border border-gray-200 py-2 min-w-48 z-50">
                  {item.children.map((child, j) => (
                    <Link
                      key={j}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:0749792333"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            (07) 4979 2333
          </a>
          <Link
            href="/quote"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden p-2 text-gray-700"
        >
          {mobileMenu ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="p-4 space-y-1">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenu(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              <Link
                href="/quote"
                className="block w-full text-center px-5 py-3 rounded-lg text-sm font-semibold text-gray-900 bg-gold"
                onClick={() => setMobileMenu(false)}
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
