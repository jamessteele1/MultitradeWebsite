"use client";

import { useState, useEffect, useRef } from "react";

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1.5,
}: {
  value: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(prefix + "0" + suffix);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Extract numeric part from value like "45+" or "100s" or "0"
  const numericMatch = value.match(/^(\d+)/);
  const numericValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const textAfter = numericMatch ? value.slice(numericMatch[1].length) : value;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          if (numericValue === 0) {
            setDisplay(value);
            return;
          }

          const startTime = performance.now();
          const ms = duration * 1000;

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / ms, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericValue);
            setDisplay(prefix + current + textAfter);

            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasAnimated, numericValue, textAfter, prefix, value, duration]);

  return <span ref={ref}>{display}</span>;
}
