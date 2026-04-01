const TILE_SIZE = 256;

// QLD Government aerial imagery — high-res, free, no API key required
// CC BY 4.0 — attribution: State of Queensland (Dept of Natural Resources)
const QLD_TILE_URL =
  "https://spatial-img.information.qld.gov.au/arcgis/rest/services/Basemaps/LatestStateProgram_AllUsers/ImageServer/tile";

// Fallback for locations outside QLD
const ESRI_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile";

export type GeoResult = {
  lat: number;
  lng: number;
  displayName: string;
};

/** Geocode a location string via Nominatim (free, no key). */
export async function geocodeLocation(query: string): Promise<GeoResult | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=au`,
      { headers: { Accept: "application/json" } },
    );
    const data = await res.json();
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch {
    return null;
  }
}

/**
 * Search for address suggestions as user types.
 * Uses Photon (powered by OpenStreetMap/Nominatim data) which handles
 * partial/autocomplete queries much better than raw Nominatim.
 * Falls back to Nominatim if Photon fails.
 */
export async function searchSuggestions(query: string): Promise<GeoResult[]> {
  if (query.length < 3) return [];

  // Try Photon first — better autocomplete for partial addresses
  try {
    const photonParams = new URLSearchParams({
      q: query,
      limit: "6",
      lang: "en",
      lat: "-23.85",  // bias towards QLD
      lon: "151.26",
      zoom: "18",
    });
    const res = await fetch(
      `https://photon.komoot.io/api/?${photonParams}`,
      { headers: { Accept: "application/json" } },
    );
    const data = await res.json();
    if (data.features?.length) {
      return data.features
        .filter((f: { properties?: { country?: string } }) =>
          f.properties?.country === "Australia",
        )
        .map((f: {
          geometry: { coordinates: number[] };
          properties: { name?: string; street?: string; housenumber?: string; city?: string; state?: string; postcode?: string };
        }) => {
          const p = f.properties;
          const parts: string[] = [];
          if (p.housenumber && p.street) parts.push(`${p.housenumber} ${p.street}`);
          else if (p.street) parts.push(p.street);
          else if (p.name) parts.push(p.name);
          if (p.city) parts.push(p.city);
          if (p.state) parts.push(p.state);
          if (p.postcode) parts.push(p.postcode);
          return {
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            displayName: parts.join(", "),
          };
        });
    }
  } catch {
    // fall through to Nominatim
  }

  // Fallback: Nominatim
  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      limit: "6",
      countrycodes: "au",
      addressdetails: "1",
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { Accept: "application/json" } },
    );
    const data = await res.json();
    return data.map((item: { lat: string; lon: string; display_name: string }) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
    }));
  } catch {
    return [];
  }
}

/** Ground resolution in metres per pixel at a given latitude and tile zoom. */
export function getMetresPerPixel(lat: number, zoom: number): number {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
}

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return { x, y };
}

/**
 * Fetch satellite imagery tiles and composite into a single image.
 * Tries QLD Government imagery first (higher res for QLD), falls back to Esri.
 */
export async function fetchSatelliteImage(
  lat: number,
  lng: number,
  pixelsPerMetre: number,
  gridSize = 5,
): Promise<{ image: HTMLImageElement; scale: number; coverageMetres: number }> {
  // Try QLD Government tiles first (zoom 20→19→18), then Esri as fallback
  const providers: { url: string; zooms: number[] }[] = [
    { url: QLD_TILE_URL, zooms: [20, 19, 18] },
    { url: ESRI_TILE_URL, zooms: [19, 18, 17] },
  ];

  for (const provider of providers) {
    for (const tileZoom of provider.zooms) {
      const result = await fetchTilesAtZoom(lat, lng, pixelsPerMetre, tileZoom, gridSize, provider.url);
      if (result) return result;
    }
  }

  throw new Error("Failed to load satellite imagery at any zoom level");
}

async function fetchTilesAtZoom(
  lat: number,
  lng: number,
  pixelsPerMetre: number,
  tileZoom: number,
  gridSize: number,
  tileBaseUrl: string = QLD_TILE_URL,
): Promise<{ image: HTMLImageElement; scale: number; coverageMetres: number } | null> {
  const center = latLngToTile(lat, lng, tileZoom);
  const half = Math.floor(gridSize / 2);

  const canvas = document.createElement("canvas");
  canvas.width = gridSize * TILE_SIZE;
  canvas.height = gridSize * TILE_SIZE;
  const ctx = canvas.getContext("2d")!;

  let loadedCount = 0;
  let failedCount = 0;
  const total = gridSize * gridSize;

  const loads: Promise<void>[] = [];
  for (let dy = -half; dy <= half; dy++) {
    for (let dx = -half; dx <= half; dx++) {
      const tx = center.x + dx;
      const ty = center.y + dy;
      const px = (dx + half) * TILE_SIZE;
      const py = (dy + half) * TILE_SIZE;
      loads.push(
        new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            // Check if the tile is a valid satellite image (not a placeholder)
            // Esri returns 256x256 for valid tiles
            if (img.naturalWidth === TILE_SIZE && img.naturalHeight === TILE_SIZE) {
              ctx.drawImage(img, px, py);
              loadedCount++;
            } else {
              failedCount++;
            }
            resolve();
          };
          img.onerror = () => {
            failedCount++;
            resolve();
          };
          img.src = `${tileBaseUrl}/${tileZoom}/${ty}/${tx}`;
        }),
      );
    }
  }

  await Promise.all(loads);

  // If most tiles failed, try a lower zoom
  if (loadedCount < total * 0.5) return null;

  const mpp = getMetresPerPixel(lat, tileZoom);
  const scale = pixelsPerMetre * mpp;
  const coverageMetres = gridSize * TILE_SIZE * mpp;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ image: img, scale, coverageMetres });
    img.src = canvas.toDataURL();
  });
}
