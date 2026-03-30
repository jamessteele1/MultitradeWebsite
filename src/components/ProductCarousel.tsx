"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  name: string;
  desc: string;
  sizes: string;
  href: string;
  img: string;
}

const CARD_W = 260; // width of each invisible snap target in px

export default function ProductCarousel({ products }: { products: Product[] }) {
  const n = products.length;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const siRef = useRef(0); // current scroll index (fractional)
  const cardsRef = useRef<HTMLDivElement>(null);

  // We triple the items so the user can scroll "infinitely" in both directions.
  // Layout: [copy2: 0..n-1] [original: 0..n-1] [copy3: 0..n-1]
  // The scroll starts at the middle set.
  const tripled = [...products, ...products, ...products];

  // The centering offset: snap-center aligns the card's center to the container's center.
  // scrollLeft when card i is centered = i * CARD_W - (containerWidth - CARD_W) / 2
  const centerOffset = useRef(0);

  // On mount, jump to the middle set (no smooth scroll)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    centerOffset.current = (el.clientWidth - CARD_W) / 2;
    el.scrollLeft = n * CARD_W - centerOffset.current;
  }, [n]);

  // Scroll listener: update CSS custom property --si for card transforms
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    centerOffset.current = (el.clientWidth - CARD_W) / 2;
    let raf: number | null = null;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const si = (el.scrollLeft + centerOffset.current) / CARD_W;
        siRef.current = si;

        // Update CSS custom property on the cards container
        if (cardsRef.current) {
          cardsRef.current.style.setProperty("--si", String(si));
        }

        // Determine active index (relative to original set)
        const raw = Math.round(si) % n;
        const idx = ((raw % n) + n) % n;
        setActiveIdx(idx);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  // When scroll ends, silently reset to the middle set if we've scrolled into a copy
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScrollEnd = () => {
      const co = centerOffset.current;
      const si = Math.round((el.scrollLeft + co) / CARD_W);
      if (si < n || si >= 2 * n) {
        // Jump to the equivalent position in the middle set
        const equiv = ((si % n) + n) % n;
        el.style.scrollBehavior = "auto";
        el.scrollLeft = (n + equiv) * CARD_W - co;
        el.style.scrollBehavior = "";
        // Update CSS var immediately
        if (cardsRef.current) {
          cardsRef.current.style.setProperty("--si", String(n + equiv));
        }
      }
    };

    // scrollend is the ideal event; fall back to a debounced scroll for older Safari
    const supportsScrollEnd = "onscrollend" in window;
    let timer: ReturnType<typeof setTimeout>;

    if (supportsScrollEnd) {
      el.addEventListener("scrollend", onScrollEnd);
    } else {
      const debounced = () => {
        clearTimeout(timer);
        timer = setTimeout(onScrollEnd, 150);
      };
      el.addEventListener("scroll", debounced, { passive: true });
    }

    return () => {
      if (supportsScrollEnd) {
        el.removeEventListener("scrollend", onScrollEnd);
      }
      clearTimeout(timer);
    };
  }, [n]);

  // Auto-advance
  const resetAuto = useCallback(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    const advance = () => {
      autoRef.current = setTimeout(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollBy({ left: CARD_W, behavior: "smooth" });
        }
        advance();
      }, 5000);
    };
    advance();
  }, []);

  useEffect(() => {
    resetAuto();
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [resetAuto]);

  const router = useRouter();
  const didDrag = useRef(false);
  const touchStartX = useRef(0);

  // Pause auto-advance on touch, track drag
  const onTouchStart = (e: React.TouchEvent) => {
    if (autoRef.current) clearTimeout(autoRef.current);
    didDrag.current = false;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientX - touchStartX.current) > 8) {
      didDrag.current = true;
    }
  };
  const onTouchEnd = () => {
    resetAuto();
  };

  // Tap on scroll layer → navigate to active card
  const onClick = () => {
    if (didDrag.current) return;
    router.push(products[activeIdx].href);
  };

  // Dot click: scroll to that card in the middle set
  const goTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: (n + idx) * CARD_W - centerOffset.current, behavior: "smooth" });
    resetAuto();
  };

  return (
    <div className="md:hidden overflow-hidden">
      <div className="relative mx-auto" style={{ height: 380 }}>
        {/* Visible 3D cards — absolutely positioned, driven by --si */}
        <div
          ref={cardsRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: 900, "--si": String(n), "--n": String(tripled.length) } as React.CSSProperties}
        >
          {tripled.map((product, i) => (
            <CarouselCard key={i} product={product} index={i} total={tripled.length} />
          ))}
        </div>

        {/* Invisible scroll layer — this captures native touch/swipe */}
        <div
          ref={scrollRef}
          className="absolute inset-0 z-[35] flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", touchAction: "pan-x pan-y" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={onClick}
        >
          {tripled.map((_, i) => (
            <div
              key={i}
              className="shrink-0 snap-center"
              style={{ width: CARD_W, height: "100%" }}
            />
          ))}
        </div>
      </div>

      {/* Description below carousel */}
      <div className="mt-4 text-center px-6 min-h-[3rem]">
        <p className="text-sm text-gray-500 leading-relaxed transition-opacity duration-300">
          {products[activeIdx].desc}
        </p>
        <span className="text-xs font-semibold gold-text tracking-wide mt-1 inline-block">
          HIRE & SALE
        </span>
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex justify-center gap-1.5">
        {products.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to ${products[i].name}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIdx
                ? "w-5 bg-amber-600"
                : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Each card computes its own transform from CSS custom properties.
 * --si is the fractional scroll index, --i is this card's index.
 * All math runs in CSS calc() so there's no per-frame React re-render.
 */
function CarouselCard({ product, index, total }: { product: Product; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // We need JS to compute the transform because CSS calc() can't do abs() and sign()
  // reliably across all browsers. We use a lightweight approach: observe --si changes
  // via a MutationObserver on the parent's style attribute.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const parent = card.parentElement;
    if (!parent) return;

    const update = () => {
      const si = parseFloat(parent.style.getPropertyValue("--si") || "0");
      const raw = index - si;

      // Wrap for infinite feel (not needed with tripled items, but clamp far cards)
      const abs = Math.abs(raw);

      if (abs > 3) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.transform = "scale(0.5)";
        card.style.zIndex = "0";
        return;
      }

      const sgn = Math.sign(raw);
      const scale = Math.max(1 - abs * 0.18, 0.55);
      const tx = sgn * Math.min(abs * 240, 80 + abs * 160);
      const ry = sgn * -Math.min(abs * 12, 25);
      const tz = -abs * 80; // push side cards back in Z space
      const opacity = Math.max(1 - abs * 0.4, 0);
      const z = Math.round(30 - abs * 10);

      card.style.transform = `translateX(${tx}px) translateZ(${tz}px) scale(${scale}) rotateY(${ry}deg)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(z);
      card.style.pointerEvents = abs < 0.6 ? "auto" : "none";
    };

    // Initial update
    update();

    // Watch for --si changes via MutationObserver on parent style
    const observer = new MutationObserver(update);
    observer.observe(parent, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, [index, total]);

  return (
    <div
      ref={cardRef}
      className="absolute will-change-transform"
      style={{
        width: 264,
        height: 348,
        backfaceVisibility: "hidden",
        transition: "none",
      }}
    >
      <Link
        href={product.href}
        className="relative block h-full w-full overflow-hidden rounded-2xl shadow-xl shadow-black/15"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-medium text-white bg-black/40 backdrop-blur-sm">
          {product.sizes}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-base font-bold text-white">{product.name}</h3>
          <p className="text-xs text-white/60 mt-0.5">View Range &rarr;</p>
        </div>
      </Link>
    </div>
  );
}
