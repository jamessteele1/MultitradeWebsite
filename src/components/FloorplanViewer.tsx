"use client";

import { useState } from "react";

/* Map product IDs to floorplan preview images */
const FLOORPLAN_MAP: Record<string, string> = {
  // Crib Rooms
  "12x3m-crib-room": "/images/floorplans/previews/SQF-4392-01-A-12.0x3.0m-Crib-Room-Floor-Plan.jpg",
  "6x3m-crib-room": "/images/floorplans/previews/SQF-4026-01-A-6.0x3.0m-Crib-Room-Floor-Plan.jpg",
  "12x3m-mobile-crib": "/images/floorplans/previews/SQF-4491-01-A-12.5x3m-Mobile-Crib-Room.jpg",
  "7-2x3m-self-contained": "/images/floorplans/previews/SQF-3321-01-1-7.2x3m-Site-Crib-Room.jpg",
  "9-6x3m-living-quarters": "/images/floorplans/previews/SQF-1571-01-B-9.6x6.0m-Living-Quarters-Floor-Plan.jpg",

  // Site Offices
  "12x3m-office": "/images/floorplans/previews/SQF-4453-01-A-12.0x3.0m-Office-Floor-Plan.jpg",
  "6x3m-office": "/images/floorplans/previews/SQF-4370-01-A-6.0x3.0m-Office-Floor-Plan.jpg",
  "6x3m-supervisor-office": "/images/floorplans/previews/SQF-4370-01-A-6.0x3.0m-Office-Floor-Plan.jpg",
  "3x3m-office": "/images/floorplans/previews/SQF-4495-01-A-3.0x3.0m-Office-Floor-Plan.jpg",
  "gatehouse": "/images/floorplans/previews/PJF-764-1416-01-2-10.5x3.4m-Gatehouse-Floor-Plan.jpg",

  // Ablutions
  "6x3m-toilet-block": "/images/floorplans/previews/SQF-4381-02-A-6.0x3.0m-Male-Female-Toilet-Floor-Plan.jpg",
  "3-6x2-4m-toilet": "/images/floorplans/previews/SQF-4384-01-A-3.6x2.4m-Toilet-Floor-Plan.jpg",
  "solar-toilet": "/images/floorplans/previews/SQF-4525-01-A-5.45x2.4m-Solar-Toilet-Floor-Plan.jpg",
  "4-2x3m-shower-block": "/images/floorplans/previews/PJF-654-1106-01-4.2x3.0m-Ablution-Floor-Plan-V2.0.jpg",

  // Solar Facility
  "solar-facility-12x335": "/images/floorplans/previews/SQF-4586-01-A-12.0x3.35m-Solar-Facility-Floor-Plan.jpg",
  "solar-facility-9x335": "/images/floorplans/previews/SQF-4641-01-A-9.0x3.35m-Solar-Facility-Floor-Plan.jpg",
};

export default function FloorplanViewer({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const src = FLOORPLAN_MAP[productId];

  if (!src) return null;

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        {open ? "Hide Floor Plan" : "View Floor Plan"}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Floor Plan</span>
            <span className="text-xs text-gray-400">Preliminary drawing — final specs may vary</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Floor plan"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
