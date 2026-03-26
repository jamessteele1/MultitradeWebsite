"use client";

import { useEffect, useRef, useCallback } from "react";

export function ParallaxVideo({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.bottom > 0 && rect.top < windowHeight) {
      const scrollProgress = -rect.top * 0.15;
      video.style.transform = `translate3d(0, ${scrollProgress}px, 0)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full"
        style={{
          willChange: "transform",
          top: "-15%",
          left: 0,
          width: "100%",
          height: "130%",
          objectFit: "cover",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
