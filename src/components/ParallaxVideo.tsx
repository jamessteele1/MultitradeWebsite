"use client";

import { useEffect, useRef, useState } from "react";

export function ParallaxVideo({ src, className = "" }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px)");
    const updateMotion = () => {
      if (motion.matches || !desktop.matches) {
        video.pause();
        video.style.transform = "none";
      } else {
        void video.play().catch(() => setPlaying(false));
      }
    };
    const onScroll = () => {
      if (motion.matches || video.paused || !wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        video.style.transform = `translate3d(0, ${-rect.top * 0.15}px, 0)`;
      }
    };
    updateMotion();
    motion.addEventListener("change", updateMotion);
    desktop.addEventListener("change", updateMotion);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      motion.removeEventListener("change", updateMotion);
      desktop.removeEventListener("change", updateMotion);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <video
        ref={videoRef}
        loop muted playsInline
        poster="/images/buildings-web/_CWM6261-Edit.jpg"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-hidden="true"
        className="absolute w-full"
        style={{ top: "-15%", left: 0, width: "100%", height: "130%", objectFit: "cover" }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          if (video.paused) void video.play().catch(() => setPlaying(false));
          else video.pause();
        }}
        className="absolute right-5 bottom-5 z-20 pointer-events-auto px-3 py-2 rounded-lg bg-black/60 text-white text-sm border border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        {playing ? "Pause background video" : "Play background video"}
      </button>
    </div>
  );
}
