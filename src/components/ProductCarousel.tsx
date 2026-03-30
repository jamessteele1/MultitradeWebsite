"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

interface Product {
  name: string;
  desc: string;
  sizes: string;
  href: string;
  img: string;
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const n = products.length;
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: 1 | -1) => setActive((p) => (p + dir + n) % n),
    [n],
  );

  /* auto-advance every 5s */
  useEffect(() => {
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [go, active]);

  /* swipe handler */
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
    };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    const dt = Date.now() - touchRef.current.t;
    // only register horizontal swipes
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) && dt < 400) {
      go(dx < 0 ? 1 : -1);
    }
    touchRef.current = null;
  };

  /* compute card position for the stacked fan effect */
  function cardStyle(i: number) {
    let offset = i - active;
    // wrap around for infinite feel
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;

    const absOff = Math.abs(offset);

    // only show 2 cards on each side + center
    if (absOff > 2) {
      return {
        opacity: 0,
        transform: "scale(0.7) translateX(0px)",
        zIndex: 0,
        pointerEvents: "none" as const,
      };
    }

    const translateX = offset * 65; // horizontal spread
    const scale = 1 - absOff * 0.14; // shrink flanking cards
    const rotateY = offset * -8; // slight 3D tilt
    const zIndex = 10 - absOff;
    const opacity = absOff === 0 ? 1 : absOff === 1 ? 0.85 : 0.5;

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      pointerEvents: (absOff === 0 ? "auto" : "none") as
        | "auto"
        | "none",
    };
  }

  return (
    <div className="md:hidden">
      {/* carousel area */}
      <div
        ref={containerRef}
        className="relative mx-auto flex items-center justify-center overflow-hidden"
        style={{ height: 320, perspective: 900 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {products.map((product, i) => (
          <div
            key={i}
            className="absolute transition-all duration-500 ease-out"
            style={{
              width: 220,
              height: 290,
              ...cardStyle(i),
            }}
          >
            <Link
              href={product.href}
              className="relative block h-full w-full overflow-hidden rounded-2xl shadow-xl shadow-black/15"
            >
              {/* image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.img}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* size badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-medium text-white bg-black/40 backdrop-blur-sm">
                {product.sizes}
              </div>
              {/* bottom text */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-base font-bold text-white">
                  {product.name}
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  View Range &rarr;
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* description below carousel */}
      <div className="mt-4 text-center px-6 min-h-[3rem]">
        <p className="text-sm text-gray-500 leading-relaxed transition-opacity duration-300">
          {products[active].desc}
        </p>
        <span className="text-xs font-semibold gold-text tracking-wide mt-1 inline-block">
          HIRE & SALE
        </span>
      </div>

      {/* dot indicators */}
      <div className="mt-4 flex justify-center gap-1.5">
        {products.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to ${products[i].name}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-5 bg-amber-600"
                : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
