import Link from "next/link";

/**
 * Home-page hero promotion for the Site Planner.
 *
 * The mock preview is composed like a real surveyor's site plan: building
 * cluster centred inside the panel, sun glyph deliberately placed top-right
 * with radial spokes, north compass top-right, scale bar bottom-left, and a
 * "SITE PLANNER" brand chip top-left so the tool identity is unmistakable.
 */
export default function SitePlannerCTA() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">
            Plan &amp; Quote Online
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Design Your <span className="gold-text">Site</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            Use our site planner to build your custom site layout and get a quote automatically.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-xl shadow-black/5 bg-white">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* ── Mock site plan (left) ── */}
            <div
              className="relative min-h-[360px] lg:min-h-[480px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1f2940 0%, #131a2c 100%)" }}
            >
              {/* Map grid background */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              {/* Top-left: Site Planner brand chip */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white text-gray-900 text-[11px] font-extrabold tracking-wider uppercase shadow-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <path d="M17.5 14v7M14 17.5h7" />
                </svg>
                Site Planner
              </div>

              {/* Just below brand chip: subtle address line */}
              <div className="absolute top-[52px] left-4 z-10 inline-flex items-center gap-1.5 text-[10px] font-medium text-white/55">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                12 Industrial Dr · Gladstone QLD
              </div>

              {/* Top-right: North compass */}
              <div className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/95 backdrop-blur shadow-lg flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 32 32">
                  <polygon points="16,4 20,18 16,15 12,18" fill="#EF4444" stroke="#DC2626" strokeWidth="0.6" />
                  <polygon points="16,28 12,18 16,21 20,18" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.6" />
                  <text x="16" y="3" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#EF4444">N</text>
                </svg>
              </div>

              {/* SVG site plan — building rectangles, sun, scale bar */}
              <svg
                viewBox="0 0 600 460"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Soft drop shadow under each building */}
                  <filter id="bldgshadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="3" dy="4" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.5" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Sun halo radial gradient */}
                  <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.7" />
                    <stop offset="40%" stopColor="#FBBF24" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* ── Sun: top-right of the panel ── */}
                <g transform="translate(490, 90)">
                  {/* Halo */}
                  <circle cx="0" cy="0" r="48" fill="url(#sunHalo)" />
                  {/* Body */}
                  <circle cx="0" cy="0" r="14" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
                  {/* Eight radial spokes */}
                  <g stroke="#FBBF24" strokeWidth="2.4" strokeLinecap="round">
                    <line x1="0" y1="-22" x2="0" y2="-30" />
                    <line x1="0" y1="22" x2="0" y2="30" />
                    <line x1="-22" y1="0" x2="-30" y2="0" />
                    <line x1="22" y1="0" x2="30" y2="0" />
                    <line x1="-15.5" y1="-15.5" x2="-21" y2="-21" />
                    <line x1="15.5" y1="-15.5" x2="21" y2="-21" />
                    <line x1="-15.5" y1="15.5" x2="-21" y2="21" />
                    <line x1="15.5" y1="15.5" x2="21" y2="21" />
                  </g>
                  {/* Sun label */}
                  <text x="0" y="50" textAnchor="middle" fontSize="9" fontWeight="700" fill="#FBBF24" fontFamily="system-ui, sans-serif" letterSpacing="0.06em">SUN</text>
                </g>

                {/* ── Building cluster: centred at viewBox midpoint (300, 235) ── */}
                {/* 12×3m Office (top, wide) */}
                <g filter="url(#bldgshadow)">
                  <rect x="170" y="155" width="200" height="56" rx="3"
                    fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.6" />
                  <text x="270" y="188" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1E3A8A" fontFamily="system-ui, sans-serif">
                    12×3m Office
                  </text>
                </g>

                {/* 6×3m Crib Room */}
                <g filter="url(#bldgshadow)">
                  <rect x="170" y="225" width="100" height="56" rx="3"
                    fill="#A7F3D0" stroke="#16A34A" strokeWidth="1.6" />
                  <text x="220" y="258" textAnchor="middle" fontSize="11" fontWeight="700" fill="#14532D" fontFamily="system-ui, sans-serif">
                    Crib Room
                  </text>
                </g>

                {/* Toilets */}
                <g filter="url(#bldgshadow)">
                  <rect x="285" y="228" width="85" height="50" rx="3"
                    fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.6" />
                  <text x="327.5" y="258" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4C1D95" fontFamily="system-ui, sans-serif">
                    Toilets
                  </text>
                </g>

                {/* Container (vertical) */}
                <g filter="url(#bldgshadow)">
                  <rect x="385" y="155" width="44" height="100" rx="3"
                    fill="#E5E7EB" stroke="#6B7280" strokeWidth="1.6" />
                  <text x="407" y="208" textAnchor="middle" fontSize="10" fontWeight="700" fill="#374151" fontFamily="system-ui, sans-serif"
                    transform="rotate(-90, 407, 208)">
                    Container
                  </text>
                </g>

                {/* Tank */}
                <g filter="url(#bldgshadow)">
                  <rect x="385" y="270" width="44" height="40" rx="3"
                    fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.6" />
                  <text x="407" y="295" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400E" fontFamily="system-ui, sans-serif">
                    Tank
                  </text>
                </g>

                {/* Covered Deck */}
                <g filter="url(#bldgshadow)">
                  <rect x="170" y="295" width="200" height="40" rx="3"
                    fill="#D2B48C" stroke="#8B4513" strokeWidth="1.6" />
                  <text x="270" y="320" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5C2E0A" fontFamily="system-ui, sans-serif">
                    Covered Deck
                  </text>
                </g>

                {/* Scale bar (bottom-left) */}
                <g transform="translate(40, 425)">
                  <line x1="0" y1="0" x2="120" y2="0" stroke="#fff" strokeWidth="2" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#fff" strokeWidth="2" />
                  <line x1="120" y1="-5" x2="120" y2="5" stroke="#fff" strokeWidth="2" />
                  <line x1="60" y1="-3" x2="60" y2="3" stroke="#fff" strokeWidth="1.4" opacity="0.8" />
                  <text x="60" y="-9" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">10 m</text>
                </g>

                {/* Hint text bottom-right: "Drag to move" */}
                <g transform="translate(560, 425)">
                  <text x="0" y="0" textAnchor="end" fontSize="10" fontWeight="500" fill="rgba(255,255,255,0.45)" fontFamily="system-ui, sans-serif" letterSpacing="0.05em">
                    DRAG · ROTATE · LABEL
                  </text>
                </g>
              </svg>
            </div>

            {/* ── Copy + CTA (right) ── */}
            <div className="p-7 md:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold tracking-wide self-start mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> NEW · INTERACTIVE
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Drop your address.<br />
                <span className="gold-text">Drag your buildings.</span><br />
                Get a quote.
              </h3>

              <p className="text-sm md:text-base text-gray-500 mt-4 leading-relaxed">
                Plan your site over real satellite imagery, snap buildings to scale, and check sun direction — then export a PDF or send straight to quote in one click.
              </p>

              <ul className="mt-5 space-y-2">
                {[
                  "Real satellite imagery for any Australian site",
                  "Drag-and-drop buildings, snap to grid, rotate & label",
                  "Sun direction & shadow preview for orientation",
                  "Scaled PDF export + instant online quote",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 flex-shrink-0">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Link
                  href="/site-planner"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
                >
                  Open Site Planner
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <div className="mt-3">
                  <Link
                    href="/scope-builder"
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Or try the guided Scope Builder
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>

              <p className="mt-5 text-[11px] text-gray-400">
                Free · No sign-up · ~5 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
