"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface Product {
  name: string;
  desc: string;
  sizes: string;
  href: string;
  img: string;
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  const n = products.length;

  // fractional position — 0 = first card centered, 1.5 = halfway between 2nd and 3rd, etc.
  const [pos, setPos] = useState(0);
  const posRef = useRef(0); // non-state mirror for animation frame reads
  const velocityRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // touch tracking
  const dragRef = useRef<{
    startX: number;
    startY: number;
    lastX: number;
    lastT: number;
    locked: "h" | "v" | null; // axis lock
    dragging: boolean;
  } | null>(null);

  const PX_PER_CARD = 120; // how many px of drag = 1 card

  // sync posRef whenever pos state changes
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // wrap helper
  const wrap = useCallback((v: number) => ((v % n) + n) % n, [n]);

  // snap to nearest integer position with spring
  const snapTo = useCallback(
    (target: number) => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const animate = () => {
        const current = posRef.current;
        // find shortest path around the ring
        let diff = target - current;
        if (diff > n / 2) diff -= n;
        if (diff < -n / 2) diff += n;

        if (Math.abs(diff) < 0.005) {
          posRef.current = wrap(target);
          setPos(wrap(target));
          animRef.current = null;
          return;
        }
        // spring lerp
        const next = current + diff * 0.15;
        posRef.current = next;
        setPos(next);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    },
    [n, wrap],
  );

  // momentum coast then snap
  const coast = useCallback(
    (vel: number) => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      velocityRef.current = vel;
      const animate = () => {
        const v = velocityRef.current;
        if (Math.abs(v) < 0.01) {
          // snap to nearest
          snapTo(Math.round(posRef.current));
          return;
        }
        posRef.current += v;
        velocityRef.current *= 0.92; // friction
        setPos(posRef.current);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    },
    [snapTo],
  );

  // reset auto-advance timer
  const resetAuto = useCallback(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    autoRef.current = setTimeout(() => {
      snapTo(Math.round(posRef.current) + 1);
      // keep advancing
      const loop = () => {
        autoRef.current = setTimeout(() => {
          snapTo(Math.round(posRef.current) + 1);
          loop();
        }, 5000);
      };
      loop();
    }, 5000);
  }, [snapTo]);

  useEffect(() => {
    resetAuto();
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [resetAuto]);

  // --- touch handlers ---
  const onTouchStart = (e: React.TouchEvent) => {
    // stop any running animation
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    velocityRef.current = 0;
    const t = e.touches[0];
    dragRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      lastX: t.clientX,
      lastT: Date.now(),
      locked: null,
      dragging: false,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const drag = dragRef.current;
    if (!drag) return;

    const t = e.touches[0];
    const dx = t.clientX - drag.startX;
    const dy = t.clientY - drag.startY;

    // determine axis lock on first significant movement
    if (!drag.locked) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; // dead zone
      drag.locked = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
    }

    // if vertical, let the page scroll naturally
    if (drag.locked === "v") {
      dragRef.current = null;
      return;
    }

    // horizontal drag — prevent page scroll
    e.preventDefault();
    drag.dragging = true;

    const now = Date.now();
    const moveDx = t.clientX - drag.lastX;
    const dt = Math.max(now - drag.lastT, 1);

    // update velocity (cards per ms, smoothed)
    velocityRef.current = (-moveDx / PX_PER_CARD / dt) * 16; // normalise to ~per-frame

    drag.lastX = t.clientX;
    drag.lastT = now;

    // move position proportionally to drag
    posRef.current += -moveDx / PX_PER_CARD;
    setPos(posRef.current);
  };

  const onTouchEnd = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || !drag.dragging) return;

    resetAuto();

    const v = velocityRef.current;
    if (Math.abs(v) > 0.08) {
      // fling with momentum
      coast(v);
    } else {
      // just snap to nearest
      snapTo(Math.round(posRef.current));
    }
  };

  // active card index (nearest integer, wrapped)
  const activeIdx = ((Math.round(pos) % n) + n) % n;

  // compute card style from fractional position
  function cardStyle(i: number) {
    let offset = i - pos;
    // wrap around for ring
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;

    const absOff = Math.abs(offset);

    if (absOff > 2.5) {
      return {
        opacity: 0,
        transform: "scale(0.6) translateX(0px)",
        zIndex: 0,
        pointerEvents: "none" as const,
      };
    }

    const translateX = offset * 65;
    const scale = Math.max(1 - absOff * 0.14, 0.6);
    const rotateY = offset * -8;
    const zIndex = Math.round(10 - absOff);
    const opacity = Math.max(1 - absOff * 0.35, 0);

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      pointerEvents: (absOff < 0.5 ? "auto" : "none") as "auto" | "none",
    };
  }

  return (
    <div className="md:hidden">
      {/* carousel area */}
      <div
        ref={containerRef}
        className="relative mx-auto flex items-center justify-center overflow-hidden touch-pan-y"
        style={{ height: 320, perspective: 900 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {products.map((product, i) => (
          <div
            key={i}
            className="absolute will-change-transform"
            style={{
              width: 220,
              height: 290,
              transition: dragRef.current?.dragging ? "none" : "all 0.15s ease-out",
              ...cardStyle(i),
            }}
          >
            <Link
              href={product.href}
              className="relative block h-full w-full overflow-hidden rounded-2xl shadow-xl shadow-black/15"
              onClick={(e) => {
                // prevent navigation if we were dragging
                if (dragRef.current?.dragging) e.preventDefault();
              }}
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
          {products[activeIdx].desc}
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
            onClick={() => { snapTo(i); resetAuto(); }}
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
