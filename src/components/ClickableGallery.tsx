"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

/* ─── Lightbox (shared) ────────────────────────────────────── */
function Lightbox({
  images,
  index,
  onClose,
}: {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length]
  );

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swiped.current = false;
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current || swiped.current) return;
      const dx = e.touches[0].clientX - touchStart.current.x;
      const dy = e.touches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        swiped.current = true;
        if (dx > 0) prev();
        else next();
      }
    },
    [prev, next]
  );

  const onTouchEnd = useCallback(() => {
    touchStart.current = null;
  }, []);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="absolute top-4 left-4 text-white/60 text-sm font-medium">
        {current + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 md:left-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Previous image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current].src}
        alt={images[current].alt}
        className="max-h-[85vh] max-w-[90vw] md:max-w-[80vw] object-contain rounded-lg select-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Next image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
}

/* ─── Clickable Image (single hero or inline image) ────────── */
export function ClickableImage({
  src,
  alt,
  className,
  allImages,
  index = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Pass all images if this is part of a set, for lightbox navigation */
  allImages?: { src: string; alt: string }[];
  /** Index of this image within allImages */
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const images = allImages || [{ src, alt }];

  return (
    <>
      <div className="cursor-pointer group relative" onClick={() => setOpen(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={className} />
        <div className="absolute bottom-2 right-2 w-7 h-7 rounded-md bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </div>
      </div>
      {open && (
        <Lightbox images={images} index={index} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

/* ─── Clickable Gallery Grid ───────────────────────────────── */
export function ClickableGalleryGrid({
  images,
  columns = 3,
}: {
  images: { src: string; alt: string }[];
  columns?: 2 | 3;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gridCols = columns === 2
    ? "grid md:grid-cols-2 gap-4"
    : "grid sm:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <>
      <div className={gridCols}>
        {images.map((img, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden cursor-pointer group relative"
            onClick={() => setLightboxIndex(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-md bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
