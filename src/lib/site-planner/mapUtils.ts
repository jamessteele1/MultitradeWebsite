const TILE_SIZE = 256;
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

/** Search for address suggestions as user types. */
export async function searchSuggestions(query: string): Promise<GeoResult[]> {
  if (query.length < 3) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=au`,
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
 * Fetch satellite imagery tiles from Esri and composite into a single image.
 * Tries zoom 19 first, falls back to 18 if tiles fail.
 */
export async function fetchSatelliteImage(
  lat: number,
  lng: number,
  pixelsPerMetre: number,
  gridSize = 5,
): Promise<{ image: HTMLImageElement; scale: number; coverageMetres: number }> {
  // Try zoom 19 first (good detail), fall back to 18 (wider coverage)
  for (const tileZoom of [19, 18]) {
    const result = await fetchTilesAtZoom(lat, lng, pixelsPerMetre, tileZoom, gridSize);
    if (result) return result;
  }
  // Last resort: zoom 17
  const fallback = await fetchTilesAtZoom(lat, lng, pixelsPerMetre, 17, gridSize);
  if (fallback) return fallback;
  throw new Error("Failed to load satellite imagery at any zoom level");
}

async function fetchTilesAtZoom(
  lat: number,
  lng: number,
  pixelsPerMetre: number,
  tileZoom: number,
  gridSize: number,
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
          img.src = `${ESRI_TILE_URL}/${tileZoom}/${ty}/${tx}`;
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
