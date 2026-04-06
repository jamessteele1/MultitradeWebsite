/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // For production, add your CDN domain here:
    // { protocol: "https", hostname: "your-cdn.vercel-storage.com" },
  },
  async redirects() {
    return [
      // ============================================================
      // 301 Redirects: Old Wix site (multitrade.com.au) → New site
      // Preserves Google Ads quality scores & SEO authority
      // ============================================================

      // --- Category / listing pages ---
      { source: "/toilet", destination: "/hire/ablutions", permanent: true },
      { source: "/ablution", destination: "/hire/ablutions", permanent: true },
      { source: "/shower", destination: "/hire/ablutions", permanent: true },
      { source: "/chemical-toilet", destination: "/hire/ablutions/chemical-toilet", permanent: true },
      { source: "/solar-toilet", destination: "/hire/ablutions/solar-toilet", permanent: true },
      { source: "/office-room", destination: "/hire/site-offices", permanent: true },
      { source: "/supervisors-office", destination: "/hire/site-offices", permanent: true },
      { source: "/crib-room", destination: "/hire/crib-rooms", permanent: true },
      { source: "/self-contained-crib-room", destination: "/hire/crib-rooms", permanent: true },
      { source: "/mobile-crib-room", destination: "/hire/crib-rooms", permanent: true },
      { source: "/container", destination: "/hire/containers", permanent: true },
      { source: "/shipping-container", destination: "/hire/containers", permanent: true },
      { source: "/dangerous-goods-container", destination: "/hire/containers", permanent: true },
      { source: "/reefer-container", destination: "/hire/containers", permanent: true },
      { source: "/container-office", destination: "/hire/site-offices", permanent: true },
      { source: "/tanks-pumps", destination: "/hire/ancillary", permanent: true },
      { source: "/copy-of-tanks-pumps", destination: "/hire/ancillary", permanent: true },
      { source: "/accessories", destination: "/hire/ancillary", permanent: true },
      { source: "/decks", destination: "/hire/ancillary", permanent: true },
      { source: "/security-hut", destination: "/hire/ancillary", permanent: true },
      { source: "/custom-build", destination: "/hire/complexes", permanent: true },
      { source: "/40ft-flat-rack", destination: "/hire/containers/40ft-flat-rack", permanent: true },
      { source: "/facility-services", destination: "/hire", permanent: true },

      // --- Store category pages ---
      { source: "/category/lunch-rooms", destination: "/hire/crib-rooms", permanent: true },
      { source: "/category/offices", destination: "/hire/site-offices", permanent: true },
      { source: "/category/complexes", destination: "/hire/complexes", permanent: true },
      { source: "/category/shipping-containers", destination: "/hire/containers", permanent: true },
      { source: "/category/ancillary", destination: "/hire/ancillary", permanent: true },
      { source: "/category/toilets", destination: "/hire/ablutions", permanent: true },
      { source: "/category/all-products", destination: "/hire", permanent: true },

      // --- Product pages: Ablutions ---
      { source: "/product-page/6x3m-toilet", destination: "/hire/ablutions/6x3m-toilet-block", permanent: true },
      { source: "/product-page/3-6x2-4m-toilet", destination: "/hire/ablutions/3-6x2-4m-toilet", permanent: true },
      { source: "/product-page/4-2x3m-ablution", destination: "/hire/ablutions/4-2x3m-shower-block", permanent: true },
      { source: "/product-page/solar-toilet", destination: "/hire/ablutions/solar-toilet", permanent: true },
      { source: "/product-page/chemical-toilet", destination: "/hire/ablutions/chemical-toilet", permanent: true },
      { source: "/product-page/pwd-chemical-toilet", destination: "/hire/ablutions/pwd-chemical-toilet", permanent: true },

      // --- Product pages: Site Offices ---
      { source: "/product-page/6x3m-office", destination: "/hire/site-offices/6x3m-office", permanent: true },
      { source: "/product-page/12x3m-office", destination: "/hire/site-offices/12x3m-office", permanent: true },
      { source: "/product-page/3x3-office", destination: "/hire/site-offices/3x3m-office", permanent: true },
      { source: "/product-page/supervisor-office", destination: "/hire/site-offices/6x3m-supervisor-office", permanent: true },
      { source: "/product-page/20ft-container-office", destination: "/hire/site-offices/20ft-container-office", permanent: true },
      { source: "/product-page/gatehouse", destination: "/hire/site-offices/gatehouse", permanent: true },
      { source: "/multirade-building-hire-products/office", destination: "/hire/site-offices", permanent: true },

      // --- Product pages: Crib Rooms ---
      { source: "/product-page/6x3m-crib", destination: "/hire/crib-rooms/6x3m-crib-room", permanent: true },
      { source: "/product-page/12x3m-crib", destination: "/hire/crib-rooms/12x3m-crib-room", permanent: true },
      { source: "/product-page/12x3m-mobile-crib-room", destination: "/hire/crib-rooms/12x3m-mobile-crib", permanent: true },
      { source: "/product-page/6-6x3m-self-contained-crib", destination: "/hire/crib-rooms/6-6x3m-self-contained", permanent: true },
      { source: "/product-page/7-2x3m-self-contained-crib", destination: "/hire/crib-rooms/7-2x3m-self-contained", permanent: true },
      { source: "/product-page/9x3m-living-quarters", destination: "/hire/crib-rooms/9-6x3m-living-quarters", permanent: true },

      // --- Product pages: Containers ---
      { source: "/product-page/10ft-shipping-container", destination: "/hire/containers/10ft-container", permanent: true },
      { source: "/product-page/20ft-shipping-container-gp", destination: "/hire/containers/20ft-container", permanent: true },
      { source: "/product-page/20ft-high-cube-shipping-container", destination: "/hire/containers/20ft-high-cube-container", permanent: true },
      { source: "/product-page/40ft-shipping-container", destination: "/hire/containers/20ft-container", permanent: true },
      { source: "/product-page/10ft-dangerous-goods-container", destination: "/hire/containers/10ft-dg-container", permanent: true },
      { source: "/product-page/10ft-dangerous-goods-container-1", destination: "/hire/containers/10ft-dg-container", permanent: true },
      { source: "/product-page/20ft-dangerous-goods-container-side-open", destination: "/hire/containers/20ft-dg-container", permanent: true },
      { source: "/product-page/40ftflat-rack", destination: "/hire/containers/40ft-flat-rack", permanent: true },

      // --- Product pages: Ancillary ---
      { source: "/product-page/12x3m-covered-deck", destination: "/hire/ancillary/12x3m-covered-deck", permanent: true },
      { source: "/product-page/5000l-tank-pump-combo", destination: "/hire/ancillary/5000l-tank-pump", permanent: true },
      { source: "/product-page/6000l-waste-tank", destination: "/hire/ancillary/6000l-waste-tank", permanent: true },
      { source: "/product-page/4000l-waste-tank", destination: "/hire/ancillary/4000l-waste-tank", permanent: true },
      { source: "/product-page/stair-landing", destination: "/hire/ancillary/stair-landing", permanent: true },
      { source: "/product-page/dual-hand-wash-station", destination: "/hire/ancillary/dual-hand-wash-station", permanent: true },
      { source: "/product-page/wash-trough", destination: "/hire/ancillary/wash-trough", permanent: true },
      { source: "/product-page/road-barrier", destination: "/hire/ancillary", permanent: true },
      { source: "/product-page/solar-facility", destination: "/solar-facility", permanent: true },

      // --- Product pages: Complexes ---
      { source: "/product-page/12x6m-complex", destination: "/hire/complexes", permanent: true },
      { source: "/product-page/12x9m-complex", destination: "/hire/complexes", permanent: true },
      { source: "/product-page/12x12m-complex", destination: "/hire/complexes", permanent: true },

      // --- General pages ---
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/our-story", destination: "/about", permanent: true },
      { source: "/capabilities", destination: "/about", permanent: true },
      { source: "/hseq", destination: "/about", permanent: true },
      { source: "/faq", destination: "/about", permanent: true },
      { source: "/contactus", destination: "/contact", permanent: true },
      { source: "/quotes", destination: "/quote", permanent: true },
      { source: "/quote-review", destination: "/quote", permanent: true },
      { source: "/book-online", destination: "/quote", permanent: true },
      { source: "/copy-of-policies-procedure", destination: "/about", permanent: true },
      { source: "/members", destination: "/about", permanent: true },
      { source: "/transport-and-load-guide", destination: "/hire", permanent: true },
      { source: "/transport-guide", destination: "/hire", permanent: true },

      // --- Blog / news (no blog on new site yet) ---
      { source: "/blog", destination: "/", permanent: true },
      { source: "/news", destination: "/", permanent: true },
      { source: "/newsletters", destination: "/", permanent: true },
      { source: "/blog/categories/:slug", destination: "/", permanent: true },

      // --- Case study projects (old Wix naming) ---
      { source: "/project", destination: "/case-studies", permanent: true },
      { source: "/project-1", destination: "/case-studies", permanent: true },
      { source: "/project-2", destination: "/case-studies", permanent: true },
      { source: "/project-3", destination: "/case-studies", permanent: true },
      { source: "/project-4", destination: "/case-studies", permanent: true },
    ];
  },
};

module.exports = nextConfig;
