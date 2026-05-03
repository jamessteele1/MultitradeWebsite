import type Konva from "konva";
import type { PlacedBuilding } from "./usePlannerState";
import { getBuildingType } from "./buildings";
import { PIXELS_PER_METRE, CANVAS_WIDTH_M, CANVAS_HEIGHT_M } from "./constants";

export type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

/**
 * Axis-aligned bounding box of all placed buildings, in canvas pixels.
 * Returns null if no buildings (or none with known types).
 */
export function computeBuildingsBoundsPx(buildings: PlacedBuilding[]): Bounds | null {
  const ppm = PIXELS_PER_METRE;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const b of buildings) {
    const type = getBuildingType(b.typeId);
    if (!type) continue;
    const w = type.widthM * ppm;
    const h = type.depthM * ppm;
    const cx = b.x * ppm + w / 2;
    const cy = b.y * ppm + h / 2;
    const rad = (b.rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const halfW = (cos * w + sin * h) / 2;
    const halfH = (sin * w + cos * h) / 2;
    minX = Math.min(minX, cx - halfW);
    minY = Math.min(minY, cy - halfH);
    maxX = Math.max(maxX, cx + halfW);
    maxY = Math.max(maxY, cy + halfH);
  }
  if (!isFinite(minX)) return null;
  return { minX, minY, maxX, maxY };
}

export function exportToPNG(stage: Konva.Stage): string {
  return stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
}

export function downloadPNG(stage: Konva.Stage) {
  const dataUrl = exportToPNG(stage);
  const link = document.createElement("a");
  link.download = "site-layout.png";
  link.href = dataUrl;
  link.click();
}

/** Load an image as a data URL for embedding in PDF. */
async function loadImageAsDataUrl(src: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

/**
 * Render a transparent PNG data URL onto a white canvas and re-encode as JPEG.
 * Without this step, JPEG export fills transparent regions with black.
 *
 * Returns the original PNG data URL as a fallback if anything in the JPEG
 * re-encode step fails (e.g. mobile memory limits).
 */
async function pngDataUrlToJpeg(pngDataUrl: string, quality = 0.85): Promise<string> {
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = pngDataUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return pngDataUrl;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    // Mobile Safari occasionally throws here on big canvases. Falling back
    // to the PNG keeps the PDF readable, just slightly larger.
    return pngDataUrl;
  }
}

/**
 * Detect a "small device" we should be conservative on. Hard mobile-Safari
 * canvas-area limit is ~16M pixels (4096×4096); we stay well under to leave
 * headroom for the 2D context.
 */
function isSmallDevice(): boolean {
  if (typeof window === "undefined") return false;
  const vw = window.innerWidth;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return vw < 768 || (typeof memory === "number" && memory <= 4);
}

/**
 * Capture the stage to a PNG dataURL, with progressive fallback on failure.
 * Mobile browsers (especially iOS Safari) routinely fail at high pixelRatio
 * or large canvas sizes — drop down a step and retry rather than blowing up
 * the whole PDF.
 */
async function captureStageWithFallback(
  stage: Konva.Stage,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
): Promise<string> {
  const prev = {
    x: stage.x(),
    y: stage.y(),
    sx: stage.scaleX(),
    sy: stage.scaleY(),
    w: stage.width(),
    h: stage.height(),
  };

  // pixel-ratio ladder — quality high → low. Each step also caps the longer
  // edge so we never ask the browser for a > 4096px canvas.
  const MAX_EDGE = 3800;
  const baseLong = Math.max(cropW, cropH);
  const ratioCap = Math.max(0.5, MAX_EDGE / baseLong);
  const isSmall = isSmallDevice();
  const ladder = isSmall
    ? [Math.min(1, ratioCap), Math.min(0.75, ratioCap), Math.min(0.5, ratioCap)]
    : [Math.min(1.5, ratioCap), Math.min(1, ratioCap), Math.min(0.75, ratioCap)];

  let lastErr: unknown = null;
  for (const pixelRatio of ladder) {
    try {
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: -cropX, y: -cropY });
      stage.size({ width: cropW, height: cropH });
      stage.draw();
      const url = stage.toDataURL({ pixelRatio, mimeType: "image/png" });
      // Restore before returning
      stage.scale({ x: prev.sx, y: prev.sy });
      stage.position({ x: prev.x, y: prev.y });
      stage.size({ width: prev.w, height: prev.h });
      stage.draw();
      return url;
    } catch (err) {
      lastErr = err;
      // Loop and try a lower pixelRatio
    }
  }
  // Restore stage before re-throwing
  stage.scale({ x: prev.sx, y: prev.sy });
  stage.position({ x: prev.x, y: prev.y });
  stage.size({ width: prev.w, height: prev.h });
  stage.draw();
  throw lastErr instanceof Error ? lastErr : new Error("Stage capture failed");
}

/**
 * Compute the crop region (in canvas pixels) around the placed buildings,
 * with sensible padding + minimum-side enforcement. Returns the full canvas
 * if nothing's been placed yet.
 */
function computeCropRegion(buildings: PlacedBuilding[]) {
  const ppm = PIXELS_PER_METRE;
  const fullW = CANVAS_WIDTH_M * ppm;
  const fullH = CANVAS_HEIGHT_M * ppm;
  const bbox = computeBuildingsBoundsPx(buildings);

  let cropX = 0, cropY = 0, cropW = fullW, cropH = fullH;
  if (bbox) {
    // 8m of padding around the buildings — leaves room for the sun
    // overlay, dimension lines, and shows useful context of the
    // surrounding satellite imagery.
    const padPx = 8 * ppm;
    cropX = Math.max(0, bbox.minX - padPx);
    cropY = Math.max(0, bbox.minY - padPx);
    const cropMaxX = Math.min(fullW, bbox.maxX + padPx);
    const cropMaxY = Math.min(fullH, bbox.maxY + padPx);
    cropW = cropMaxX - cropX;
    cropH = cropMaxY - cropY;

    // Enforce a minimum visible area so a single building isn't comically zoomed
    const minSidePx = 20 * ppm;
    if (cropW < minSidePx) {
      const grow = (minSidePx - cropW) / 2;
      cropX = Math.max(0, cropX - grow);
      cropW = Math.min(fullW - cropX, minSidePx);
    }
    if (cropH < minSidePx) {
      const grow = (minSidePx - cropH) / 2;
      cropY = Math.max(0, cropY - grow);
      cropH = Math.min(fullH - cropY, minSidePx);
    }
  }
  return { cropX, cropY, cropW, cropH };
}

/**
 * Build the PDF and return both the jsPDF instance and a base64 dataURL.
 * `downloadPDF` triggers the browser save; `generatePDFBase64` is for when
 * we need the raw bytes (e.g. emailing the PDF on mobile).
 *
 * Orientation is decided from the layout's aspect ratio so the user gets
 * the maximum image size on the page — a tall-aspect site (e.g. a long
 * narrow driveway) renders portrait; a wide spread renders landscape.
 * Previously the PDF was always landscape, which made tall layouts
 * letterbox into a small square at the top of the page.
 */
async function buildPDF(
  stage: Konva.Stage,
  buildings: PlacedBuilding[],
  mapRotation = 0,
  siteAddress?: string,
  siteCoords?: { lat: number; lng: number },
) {
  const { jsPDF } = await import("jspdf");
  const crop = computeCropRegion(buildings);
  const aspect = crop.cropW / crop.cropH;
  // Crossover where portrait vs landscape yields the same image area on
  // an A3 page (with our 36mm header + 60mm legend reserve) is ≈ 1.328.
  // Below that, portrait wins — and the win is significant: at aspect
  // 1.0 (square layout) portrait gives 267×267 mm vs landscape's 201×201,
  // ≈ 75% more image area. This single tweak fixes the "lil square in
  // the middle of a big landscape page" problem.
  const orientation: "portrait" | "landscape" = aspect < 1.3 ? "portrait" : "landscape";
  const pdf = new jsPDF({ orientation, unit: "mm", format: "a3" });
  await populatePDF(pdf, stage, buildings, mapRotation, siteAddress, siteCoords, crop);
  return pdf;
}

/** Generate the PDF and return it as a `data:application/pdf;base64,…` URL. */
export async function generatePDFBase64(
  stage: Konva.Stage,
  buildings: PlacedBuilding[],
  mapRotation = 0,
  siteAddress?: string,
  siteCoords?: { lat: number; lng: number },
): Promise<string> {
  const pdf = await buildPDF(stage, buildings, mapRotation, siteAddress, siteCoords);
  return pdf.output("datauristring");
}

export async function downloadPDF(
  stage: Konva.Stage,
  buildings: PlacedBuilding[],
  mapRotation = 0,
  siteAddress?: string,
  siteCoords?: { lat: number; lng: number },
) {
  const pdf = await buildPDF(stage, buildings, mapRotation, siteAddress, siteCoords);
  pdf.save("site-layout.pdf");
}

// Internal: actual PDF assembly. Both generatePDFBase64 and downloadPDF use it.
async function populatePDF(
  pdf: import("jspdf").jsPDF,
  stage: Konva.Stage,
  buildings: PlacedBuilding[],
  mapRotation: number,
  siteAddress?: string,
  siteCoords?: { lat: number; lng: number },
  cropRegion?: { cropX: number; cropY: number; cropW: number; cropH: number },
) {
  // Page dimensions — we used to hard-code 420×297 (landscape A3) but
  // orientation is now dynamic, so pull the real numbers from the PDF
  // every time. All subsequent layout uses pageW / pageH.
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // Logo
  const logoDataUrl = await loadImageAsDataUrl("/images/logos/logo-color.png");
  const logoH = 12; // mm
  let textStartX = 15;
  if (logoDataUrl) {
    // Calculate width from aspect ratio (logo is roughly 3:1)
    const logoW = logoH * 3;
    pdf.addImage(logoDataUrl, "PNG", 15, 10, logoW, logoH);
    textStartX = 15 + logoW + 5;
  }

  // Header text beside logo
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Site Layout Plan", textStartX, 18);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(120, 120, 120);
  pdf.text("multitrade.com.au  |  (07) 4979 2333", textStartX, 24);
  pdf.text(new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }), textStartX, 29);

  // Site address and coordinates on same line
  if (siteAddress) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(60, 60, 60);
    const addrText = `Site: ${siteAddress}`;
    pdf.text(addrText, textStartX, 35);
    if (siteCoords) {
      const addrWidth = pdf.getTextWidth(addrText);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      pdf.text(`    GPS: ${siteCoords.lat.toFixed(6)}, ${siteCoords.lng.toFixed(6)}`, textStartX + addrWidth, 35);
    }
  }

  // --- Crop region ---
  // Use the crop computed by buildPDF (which used it to pick page
  // orientation), or compute it on the fly if called directly.
  const { cropX, cropY, cropW, cropH } = cropRegion ?? computeCropRegion(buildings);
  const ppm = PIXELS_PER_METRE;

  // Render the crop to PNG (preserves transparency for compositing) then re-
  // encode as JPEG over a white background to keep the file under a few MB.
  //
  // Konva's layer canvases are sized to the *displayed* stage, so exporting
  // with the user's current zoom/pan would only capture the visible area and
  // leave the rest transparent. captureStageWithFallback resets the stage to
  // a 1:1 transform sized to the crop, then restores it. It also walks down a
  // pixelRatio ladder if any step fails, so mobile Safari memory limits don't
  // kill the whole PDF.
  const pngUrl = await captureStageWithFallback(stage, cropX, cropY, cropW, cropH);
  const jpegUrl = await pngDataUrlToJpeg(pngUrl, 0.82);

  // Fit the crop into the available space on the page while preserving its
  // aspect ratio. Reserve room for header (top 36mm) + legend (bottom 60mm)
  // and 15mm side margins. Since the page orientation now matches the
  // layout aspect (landscape vs portrait), the image fills the available
  // area instead of letterboxing into a small square.
  const sideMargin = 15;
  const headerH = 36;
  const legendH = 60;
  const maxImgW = pageW - sideMargin * 2;
  const maxImgH = pageH - headerH - legendH;
  const aspect = cropW / cropH;
  let imgWidth = maxImgW;
  let imgHeight = imgWidth / aspect;
  if (imgHeight > maxImgH) {
    imgHeight = maxImgH;
    imgWidth = imgHeight * aspect;
  }
  // Centre horizontally on the page
  const imgX = (pageW - imgWidth) / 2;
  const imgY = headerH;
  pdf.addImage(jpegUrl, "JPEG", imgX, imgY, imgWidth, imgHeight);

  // North compass — top right of the image area
  const compassX = imgX + imgWidth - 15;
  const compassY = imgY + 14;
  const compassR = 12;
  const rotRad = (-mapRotation * Math.PI) / 180;

  // Compass circle
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.circle(compassX, compassY, compassR);

  // North arrow (red triangle pointing up, rotated by map rotation)
  const tipX = compassX + Math.sin(rotRad) * (compassR - 2);
  const tipY = compassY - Math.cos(rotRad) * (compassR - 2);
  const leftX = compassX + Math.sin(rotRad + 2.7) * (compassR - 3);
  const leftY = compassY - Math.cos(rotRad + 2.7) * (compassR - 3);
  const rightX = compassX + Math.sin(rotRad - 2.7) * (compassR - 3);
  const rightY = compassY - Math.cos(rotRad - 2.7) * (compassR - 3);

  pdf.setFillColor(239, 68, 68); // red
  pdf.triangle(tipX, tipY, leftX, leftY, rightX, rightY, "F");

  // South arrow (gray)
  const sTipX = compassX - Math.sin(rotRad) * (compassR - 2);
  const sTipY = compassY + Math.cos(rotRad) * (compassR - 2);
  pdf.setFillColor(180, 180, 180);
  pdf.triangle(sTipX, sTipY, leftX, leftY, rightX, rightY, "F");

  // "N" label
  const nLabelX = compassX + Math.sin(rotRad) * (compassR + 4);
  const nLabelY = compassY - Math.cos(rotRad) * (compassR + 4) + 1.5;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(239, 68, 68);
  pdf.text("N", nLabelX, nLabelY, { align: "center" });

  // Building legend with color swatches
  const legendY = imgY + imgHeight + 10;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Building Legend", 15, legendY);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");

  // Collect counts and colors per building type
  const legendItems: { name: string; count: number; color: string; stroke: string; dims: string }[] = [];
  const seen = new Map<string, number>();
  for (const b of buildings) {
    const type = getBuildingType(b.typeId);
    if (!type) continue;
    const idx = seen.get(type.id);
    if (idx !== undefined) {
      legendItems[idx].count++;
    } else {
      seen.set(type.id, legendItems.length);
      legendItems.push({
        name: type.name,
        count: 1,
        color: type.color,
        stroke: type.stroke,
        dims: `${type.widthM}×${type.depthM}m`,
      });
    }
  }

  let y = legendY + 6;
  for (const item of legendItems) {
    // Color swatch
    const hex = item.color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b2 = parseInt(hex.slice(5, 7), 16);
    pdf.setFillColor(r, g, b2);
    const sHex = item.stroke;
    const sr = parseInt(sHex.slice(1, 3), 16);
    const sg = parseInt(sHex.slice(3, 5), 16);
    const sb = parseInt(sHex.slice(5, 7), 16);
    pdf.setDrawColor(sr, sg, sb);
    pdf.setLineWidth(0.3);
    pdf.rect(18, y - 3, 5, 3.5, "FD");

    // Text
    pdf.setTextColor(40, 40, 40);
    pdf.text(`${item.count}×  ${item.name}  (${item.dims})`, 25, y);
    y += 5.5;
  }

  // Scale bar on PDF — bottom right of image area. Compute mm-per-metre from
  // the actual crop so the bar reflects the on-page scale, not the canvas one.
  const mmPerMetre = imgWidth / (cropW / ppm);
  // Pick a "nice" round number of metres that's roughly 25mm wide on the page.
  const niceMetres = [1, 2, 5, 10, 20, 50, 100];
  const targetMm = 25;
  let scaleMetres = niceMetres[0];
  for (const v of niceMetres) {
    if (v * mmPerMetre <= targetMm * 1.5) scaleMetres = v;
  }
  const scaleBarW = scaleMetres * mmPerMetre;
  const scaleBarY = imgY + imgHeight - 5;
  const scaleBarX = imgX + imgWidth - scaleBarW - 10;

  pdf.setDrawColor(40, 40, 40);
  pdf.setLineWidth(0.5);
  // Main line
  pdf.line(scaleBarX, scaleBarY, scaleBarX + scaleBarW, scaleBarY);
  // End ticks
  pdf.line(scaleBarX, scaleBarY - 2, scaleBarX, scaleBarY + 2);
  pdf.line(scaleBarX + scaleBarW, scaleBarY - 2, scaleBarX + scaleBarW, scaleBarY + 2);
  // Mid tick
  pdf.line(scaleBarX + scaleBarW / 2, scaleBarY - 1, scaleBarX + scaleBarW / 2, scaleBarY + 1);
  // Label
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(40, 40, 40);
  pdf.text(`${scaleMetres}m`, scaleBarX + scaleBarW + 2, scaleBarY + 1);
}
