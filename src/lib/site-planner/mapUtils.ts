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

/**
 * Convert a canvas-pixel point back to lat/lng using the current
 * satellite image as a geographic anchor. The image's centre is
 * assumed to be at `siteLat / siteLng` (the originally geocoded
 * address), which is true for the initial fetch — extends preserve
 * this by anchoring all tiles to the same site coordinates.
 */
export function canvasPointToLatLng(
  cx: number,
  cy: number,
  imageX: number,
  imageY: number,
  imageWidth: number,
  imageHeight: number,
  scale: number,
  siteLat: number,
  siteLng: number,
  pixelsPerMetre: number,
): { lat: number; lng: number } {
  const imageCenterX = imageX + (imageWidth * scale) / 2;
  const imageCenterY = imageY + (imageHeight * scale) / 2;
  const offsetXcanvas = cx - imageCenterX;
  const offsetYcanvas = cy - imageCenterY;
  // canvas px / pixelsPerMetre = metres on the ground
  const offsetXmetres = offsetXcanvas / pixelsPerMetre;
  const offsetYmetres = offsetYcanvas / pixelsPerMetre;
  const metresPerLatDeg = 111_000;
  const metresPerLngDeg = 111_000 * Math.cos((siteLat * Math.PI) / 180);
  return {
    // Canvas y increases downward; latitude increases upward — flip the sign.
    lat: siteLat - offsetYmetres / metresPerLatDeg,
    lng: siteLng + offsetXmetres / metresPerLngDeg,
  };
}

/**
 * Fetch a fresh patch of satellite tiles centred on (newCenterLat,
 * newCenterLng) and composite it onto the existing map image, growing
 * the image to cover both the old and new regions. Returns updated
 * MapData fields (image / x / y / scale).
 *
 * Uses the same zoom level as the existing image (re-derived from
 * its scale) so the resolution matches.
 */
export async function extendSatelliteImage(params: {
  currentImage: HTMLImageElement;
  currentX: number;
  currentY: number;
  scale: number;
  siteLat: number;
  siteLng: number;
  newCenterLat: number;
  newCenterLng: number;
  pixelsPerMetre: number;
}): Promise<{ image: HTMLImageElement; x: number; y: number; scale: number }> {
  const {
    currentImage,
    currentX,
    currentY,
    scale,
    siteLat,
    siteLng,
    newCenterLat,
    newCenterLng,
    pixelsPerMetre,
  } = params;

  // Derive the tile zoom from the current scale so the new patch matches
  // resolution. scale = pixelsPerMetre × metres-per-pixel-at-zoom; rearrange.
  const mpp = scale / pixelsPerMetre;
  const tileZoom = Math.round(
    Math.log2((156543.03392 * Math.cos((siteLat * Math.PI) / 180)) / mpp),
  );

  // Smallish grid for the extension patch — same order as the initial fetch.
  const grid = 9;

  // Try the configured providers in order, same as the initial fetch.
  const providers = [QLD_TILE_URL, ESRI_TILE_URL];
  let result: { image: HTMLImageElement; scale: number; coverageMetres: number } | null = null;
  for (const url of providers) {
    result = await fetchTilesAtZoom(newCenterLat, newCenterLng, pixelsPerMetre, tileZoom, grid, url);
    if (result) break;
  }
  if (!result) throw new Error("Couldn't load tiles for that area — try a different spot.");

  const newImage = result.image;
  const newScale = result.scale;

  // Where in canvas pixels does the new image's centre land?
  // Centre of the existing image = (siteLat, siteLng). The new patch is
  // centred at (newCenterLat, newCenterLng) — the offset in metres
  // converts to a canvas-pixel offset via pixelsPerMetre.
  const metresPerLatDeg = 111_000;
  const metresPerLngDeg = 111_000 * Math.cos((siteLat * Math.PI) / 180);
  const dxMetres = (newCenterLng - siteLng) * metresPerLngDeg;
  const dyMetres = (newCenterLat - siteLat) * metresPerLatDeg;
  const currentCenterCanvasX = currentX + (currentImage.width * scale) / 2;
  const currentCenterCanvasY = currentY + (currentImage.height * scale) / 2;
  const newCenterCanvasX = currentCenterCanvasX + dxMetres * pixelsPerMetre;
  const newCenterCanvasY = currentCenterCanvasY - dyMetres * pixelsPerMetre; // y-flip

  const newImageX = newCenterCanvasX - (newImage.width * newScale) / 2;
  const newImageY = newCenterCanvasY - (newImage.height * newScale) / 2;

  // Combined bounding box in canvas pixels.
  const bboxMinX = Math.min(currentX, newImageX);
  const bboxMinY = Math.min(currentY, newImageY);
  const bboxMaxX = Math.max(currentX + currentImage.width * scale, newImageX + newImage.width * newScale);
  const bboxMaxY = Math.max(currentY + currentImage.height * scale, newImageY + newImage.height * newScale);

  // The composite canvas is sized in SOURCE pixels so the image still
  // renders at the same `scale`. Source-px = canvas-px / scale.
  const combinedSourceW = Math.round((bboxMaxX - bboxMinX) / scale);
  const combinedSourceH = Math.round((bboxMaxY - bboxMinY) / scale);

  const canvas = document.createElement("canvas");
  canvas.width = combinedSourceW;
  canvas.height = combinedSourceH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't allocate a canvas for the extended map");

  // Place the existing image at its source-pixel offset within the combined canvas.
  const currentDestX = Math.round((currentX - bboxMinX) / scale);
  const currentDestY = Math.round((currentY - bboxMinY) / scale);
  ctx.drawImage(currentImage, currentDestX, currentDestY);

  const newDestX = Math.round((newImageX - bboxMinX) / scale);
  const newDestY = Math.round((newImageY - bboxMinY) / scale);
  ctx.drawImage(newImage, newDestX, newDestY);

  return new Promise((resolve, reject) => {
    const finalImg = new Image();
    finalImg.onload = () => resolve({
      image: finalImg,
      x: bboxMinX,
      y: bboxMinY,
      scale,
    });
    finalImg.onerror = () => reject(new Error("Failed to compose the extended map image"));
    finalImg.src = canvas.toDataURL("image/png");
  });
}
