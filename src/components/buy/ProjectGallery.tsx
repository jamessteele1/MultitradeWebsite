"use client";

import { useState } from "react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Thumbnail strip */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {images.slice(0, 8).map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className="rounded-lg overflow-hidden bg-gray-100 aspect-square hover:ring-2 hover:ring-amber-400 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <img
              src={img}
              alt={`${title} - photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      {images.length > 0 && (
        <p className="text-xs text-gray-400 mt-1.5">
          Click any photo to enlarge
        </p>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt={title}
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Thumbnail nav */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(img);
                }}
                className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? "border-amber-400 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${title} - photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
