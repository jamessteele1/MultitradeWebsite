"use client";

export default function MobileCTA() {
  return (
    <>
      <div id="mobile-cta" className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-2xl shadow-black/10">
        <div className="flex gap-2.5">
          <a
            href="tel:0749792333"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg border border-gray-300 text-gray-900 text-sm font-semibold min-h-[56px]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Call Now
          </a>
          <a
            href="/quote"
            className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-lg text-sm font-semibold text-gray-900 bg-gold min-h-[56px]"
          >
            Get a Quote
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
      <div className="h-20 md:hidden" />
    </>
  );
}
