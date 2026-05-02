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

/**
 * Geocode an address string via Google Geocoding API (proxied through our API route).
 */
export async function geocodeLocation(query: string): Promise<GeoResult | null> {
  try {
    const res = await fetch(
      `/api/geocode?address=${encodeURIComponent(query)}`,
    );
    const data = await res.json();
    if (data.results?.length) {
      const r = data.results[0];
      return {
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
        displayName: r.formatted_address,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Search for address suggestions as user types.
 * Uses Google Places Autocomplete (proxied through our API route).
 * Returns structured Australian address results.
 */
export async function searchSuggestions(query: string): Promise<GeoResult[]> {
  if (query.length < 3) return [];

  try {
    const res = await fetch(
      `/api/places-autocomplete?input=${encodeURIComponent(query)}`,
    );
    const data = await res.json();

    if (data.predictions?.length) {
      // Geocode each prediction to get lat/lng
      const results = await Promise.all(
        data.predictions.slice(0, 5).map(async (p: { description: string; place_id: string }) => {
          // Use the description to geocode (faster than Place Details API)
          const geoRes = await fetch(
            `/api/geocode?address=${encodeURIComponent(p.description)}`,
          );
          const geoData = await geoRes.json();
          if (geoData.results?.length) {
            const r = geoData.results[0];
            return {
              lat: r.geometry.location.lat,
              lng: r.geometry.location.lng,
              displayName: p.description,
            };
          }
          return null;
        }),
      );
      return results.filter((r): r is GeoResult => r !== null);
    }
    return [];
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
 * Tries QLD Government imagery first, falls back to Esri.
 */
export async function fetchSatelliteImage(
  lat: number,
  lng: number,
  pixelsPerMetre: number,
  gridSize = 9,
): Promise<{ image: HTMLImageElement; scale: number; coverageMetres: number }> {
  // Modest grids — the browser only opens ~6 concurrent connections per
  // origin, so a 21-tile (441) grid means the LAST tiles wait ages for a
  // socket and the per-tile timer fires before they even start. A 9-tile
  // (81) grid is plenty of coverage for a 60m × 40m planner canvas and
  // loads reliably on cellular.
  const providers: { url: string; zooms: number[]; grids: number[] }[] = [
    { url: QLD_TILE_URL, zooms: [20, 19, 18], grids: [9, 7, 7] },
    { url: ESRI_TILE_URL, zooms: [19, 18, 17], grids: [9, 7, 7] },
  ];

  // Overall watchdog so the spinner can never run forever — if the entire
  // ladder of providers/zooms hasn't produced an image in 90s, bail with a
  // clear error instead of leaving the user staring at the spinner.
  const watchdog = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Satellite imagery timed out — please check your connection and try again.")), 90000);
  });

  const work = (async () => {
    for (const provider of providers) {
      for (let i = 0; i < provider.zooms.length; i++) {
        const tileZoom = provider.zooms[i];
        const grid = provider.grids[i] || gridSize;
        const result = await fetchTilesAtZoom(lat, lng, pixelsPerMetre, tileZoom, grid, provider.url);
        if (result) return result;
      }
    }
    throw new Error("Failed to load satellite imagery — no tile provider returned enough coverage.");
  })();

  return Promise.race([work, watchdog]);
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
  const total = gridSize * gridSize;

  // Per-tile timeout — without this, a single slow / stalled tile fetch on
  // mobile can hang Promise.all forever (spinner that never resolves). 20s
  // is generous because browsers cap concurrent connections per origin to
  // 6, so the last few tiles in an 81-tile grid wait their turn.
  const TILE_TIMEOUT_MS = 20000;

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
          let settled = false;
          const settle = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve();
          };
          const timer = setTimeout(() => {
            // Force the image to abort by clearing its src — release memory
            // and let the slot resolve so Promise.all can move on.
            img.src = "";
            settle();
          }, TILE_TIMEOUT_MS);
          img.crossOrigin = "anonymous";
          img.onload = () => {
            if (!settled && img.naturalWidth === TILE_SIZE && img.naturalHeight === TILE_SIZE) {
              try {
                ctx.drawImage(img, px, py);
                loadedCount++;
              } catch {
                // CORS taint or out-of-memory — treat as load failure
              }
            }
            settle();
          };
          img.onerror = () => settle();
          img.src = `${tileBaseUrl}/${tileZoom}/${ty}/${tx}`;
        }),
      );
    }
  }

  await Promise.all(loads);

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
