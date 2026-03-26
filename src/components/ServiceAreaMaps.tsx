"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── Location data ── */
const HIRE_LOCATIONS = [
  { name: "Gladstone", label: "Yard & HQ", lat: -23.8489, lng: 151.2686, primary: true },
  { name: "Emerald", label: "Yard", lat: -23.5275, lng: 148.1591, primary: true },
  { name: "Brisbane", label: "Factory", lat: -27.4698, lng: 153.0251, primary: true },
];

/* Core service area — west to QLD/NT border, north to just below Townsville, south to Newcastle NSW */
const CORE_AREA: [number, number][] = [
  [-19.5, 138.0],   // NW corner — QLD/NT border just south of Townsville latitude
  [-19.5, 146.5],   // North coast near Bowen
  [-19.8, 148.2],   // Coast south of Townsville
  [-20.8, 149.3],   // Mackay coast
  [-22.0, 150.0],   // Between Mackay and Rocky
  [-23.1, 150.8],   // Rocky coast
  [-23.8, 151.5],   // Gladstone coast
  [-24.8, 152.3],   // South of Gladstone
  [-26.5, 153.2],   // Sunshine Coast
  [-27.5, 153.4],   // Brisbane
  [-28.8, 153.6],   // Byron Bay / Gold Coast
  [-30.5, 153.2],   // Coffs Harbour
  [-32.0, 152.6],   // Port Macquarie
  [-32.9, 151.8],   // Newcastle
  [-32.9, 149.0],   // Inland NSW — west of Newcastle
  [-31.0, 146.0],   // Western NSW
  [-29.0, 141.0],   // Near QLD/SA/NSW corner
  [-26.0, 138.0],   // QLD/SA border
  [-19.5, 138.0],   // Close polygon — back to NW corner
];

/* Wider QLD + Northern NSW service area */
const WIDER_AREA: [number, number][] = [
  [-10.5, 142.0],   // Cape York tip
  [-10.5, 145.5],   // NE QLD coast
  [-16.9, 146.0],   // Cairns area
  [-19.3, 147.0],   // Townsville
  [-21.1, 149.2],   // Mackay coast
  [-23.4, 150.5],   // Rocky coast
  [-27.5, 153.5],   // Brisbane
  [-29.5, 153.5],   // Northern NSW coast (Coffs Harbour)
  [-30.5, 153.0],   // South boundary NSW
  [-30.5, 149.0],   // Inland NSW
  [-29.0, 148.0],   // Border region
  [-29.0, 141.0],   // Western NSW border
  [-26.0, 141.0],   // QLD/SA/NSW corner
  [-26.0, 138.0],   // Western QLD
  [-16.0, 138.0],   // NW QLD
  [-10.5, 142.0],   // Close polygon
];

const GOLD = "#D4A843";

function createIcon(primary: boolean) {
  const size = primary ? 28 : 18;
  const color = primary ? GOLD : "#6b7280";
  const border = primary ? "#fff" : "#fff";
  const strokeWidth = primary ? 3 : 2;

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${strokeWidth}px solid ${border};box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  });
}

function createFactoryIcon() {
  return L.divIcon({
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${GOLD};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M5 20V6a1 1 0 011-1h4a1 1 0 011 1v14"/><path d="M13 20V10a1 1 0 011-1h4a1 1 0 011 1v10"/></svg>
    </div>`,
  });
}

/* ── Hire Map ── */
function HireMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-23.5, 146.0],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 12,
      minZoom: 4,
    }).addTo(map);

    // Attribution in bottom-right
    L.control.attribution({ position: "bottomright", prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>')
      .addTo(map);

    // Wider QLD + Northern NSW area
    L.polygon(WIDER_AREA, {
      color: GOLD,
      weight: 1,
      opacity: 0.3,
      fillColor: GOLD,
      fillOpacity: 0.05,
      dashArray: "6 4",
    }).addTo(map);

    // Core service corridor
    L.polygon(CORE_AREA, {
      color: GOLD,
      weight: 2,
      opacity: 0.6,
      fillColor: GOLD,
      fillOpacity: 0.12,
    }).addTo(map);

    // "CORE HIRE SERVICE AREA" label in centre of gold zone
    L.marker([-26.0, 145.0], {
      icon: L.divIcon({
        className: "",
        iconSize: [140, 30],
        iconAnchor: [70, 15],
        html: `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:${GOLD};letter-spacing:2px;text-align:center;text-shadow:0 1px 3px rgba(255,255,255,0.8);">CORE HIRE SERVICE AREA</div>`,
      }),
      interactive: false,
    }).addTo(map);

    // Yard / HQ markers
    HIRE_LOCATIONS.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createIcon(loc.primary),
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;text-align:center;padding:4px 2px;">
          <div style="font-weight:700;font-size:14px;color:#1f2937;">${loc.name}</div>
          <div style="font-size:11px;color:${GOLD};font-weight:600;margin-top:2px;">${loc.label}</div>
        </div>`,
        { closeButton: false, className: "custom-popup" }
      );
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: "340px" }}
    />
  );
}

/* ── Sales Map ── */
function SalesMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-27, 134],
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 12,
      minZoom: 3,
    }).addTo(map);

    L.control.attribution({ position: "bottomright", prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>')
      .addTo(map);

    // Light gold fill over all of Australia
    const australiaOutline: [number, number][] = [
      [-10.5, 142.0], [-10.7, 143.5], [-12.5, 143.3], [-14.5, 143.8],
      [-16.0, 145.5], [-19.0, 146.5], [-21.0, 149.0], [-23.5, 150.5],
      [-27.5, 153.5], [-29.5, 153.5], [-33.8, 151.2], [-37.5, 150.0],
      [-38.0, 147.0], [-39.0, 146.5], [-38.5, 144.5], [-37.0, 142.0],
      [-34.5, 139.0], [-35.5, 137.0], [-34.0, 136.0], [-33.0, 134.0],
      [-32.0, 132.5], [-32.0, 131.0], [-34.0, 128.0], [-33.5, 122.0],
      [-34.5, 119.0], [-33.5, 116.0], [-31.5, 115.5], [-28.0, 114.0],
      [-25.5, 113.5], [-23.5, 113.8], [-21.5, 114.5], [-20.0, 118.5],
      [-17.5, 122.0], [-15.0, 124.0], [-14.5, 126.5], [-13.5, 129.5],
      [-12.0, 131.0], [-12.0, 133.5], [-11.0, 136.0], [-12.0, 137.5],
      [-10.5, 142.0],
    ];

    L.polygon(australiaOutline, {
      color: GOLD,
      weight: 1.5,
      opacity: 0.3,
      fillColor: GOLD,
      fillOpacity: 0.06,
    }).addTo(map);

    // Gladstone HQ marker
    const hq = L.marker([-23.8489, 151.2686], {
      icon: createIcon(true),
    }).addTo(map);

    hq.bindPopup(
      `<div style="font-family:Inter,sans-serif;text-align:center;padding:4px 2px;">
        <div style="font-weight:700;font-size:14px;color:#1f2937;">Gladstone</div>
        <div style="font-size:11px;color:${GOLD};font-weight:600;margin-top:2px;">HQ</div>
      </div>`,
      { closeButton: false, className: "custom-popup" }
    );

    // Brisbane Factory marker
    const factory = L.marker([-27.4698, 153.0251], {
      icon: createFactoryIcon(),
    }).addTo(map);

    factory.bindPopup(
      `<div style="font-family:Inter,sans-serif;text-align:center;padding:4px 2px;">
        <div style="font-weight:700;font-size:14px;color:#1f2937;">Brisbane</div>
        <div style="font-size:11px;color:${GOLD};font-weight:600;margin-top:2px;">FACTORY</div>
        <div style="font-size:11px;color:#6b7280;margin-top:4px;">We sell & deliver<br/>Australia-wide</div>
      </div>`,
      { closeButton: false, className: "custom-popup" }
    );

    // Major city reference dots (excluding Brisbane since it has its own marker)
    const cities = [
      { name: "Sydney", lat: -33.8688, lng: 151.2093 },
      { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
      { name: "Perth", lat: -31.9505, lng: 115.8605 },
      { name: "Adelaide", lat: -34.9285, lng: 138.6007 },
      { name: "Darwin", lat: -12.4634, lng: 130.8456 },
      { name: "Hobart", lat: -42.8821, lng: 147.3272 },
    ];

    cities.forEach((city) => {
      L.circleMarker([city.lat, city.lng], {
        radius: 4,
        fillColor: "#9ca3af",
        color: "#fff",
        weight: 1.5,
        fillOpacity: 0.6,
      })
        .bindTooltip(city.name, {
          permanent: true,
          direction: "right",
          offset: [6, 0],
          className: "city-label",
        })
        .addTo(map);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: "340px" }}
    />
  );
}

/* ── Exported wrapper with tabs ── */
export default function ServiceAreaMaps() {
  const [tab, setTab] = useState<"hire" | "sales">("hire");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("hire")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "hire"
              ? "bg-gold text-gray-900"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Hire Service Area
        </button>
        <button
          onClick={() => setTab("sales")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "sales"
              ? "bg-gold text-gray-900"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Sales — Australia-Wide
        </button>
      </div>

      {/* Map container */}
      {tab === "hire" && (
        <div>
          <HireMap />
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: GOLD, border: "2px solid #fff", boxShadow: "0 0 0 1px #d1d5db" }} />
              <span className="font-semibold text-gray-700">Yard / HQ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: `${GOLD}20`, border: `1.5px solid ${GOLD}99` }} />
              <span>Core service area</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: `${GOLD}0D`, border: `1px dashed ${GOLD}4D` }} />
              <span>QLD & Northern NSW</span>
            </div>
          </div>
        </div>
      )}

      {tab === "sales" && (
        <div>
          <SalesMap />
          <p className="mt-4 text-sm text-gray-500">
            New and refurbished portable buildings manufactured at our <span className="font-semibold text-gray-700">Brisbane factory</span>, managed from <span className="font-semibold text-gray-700">Gladstone HQ</span>, with delivery Australia-wide.
          </p>
        </div>
      )}
    </div>
  );
}
