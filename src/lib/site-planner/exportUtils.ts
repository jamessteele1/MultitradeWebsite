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
 */
async function pngDataUrlToJpeg(pngDataUrl: string, quality = 0.85): Promise<string> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = pngDataUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function downloadPDF(
  stage: Konva.Stage,
  buildings: PlacedBuilding[],
  mapRotation = 0,
  siteAddress?: string,
  siteCoords?: { lat: number; lng: number },
) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });

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
  // Zoom in to the actual buildings (with padding) instead of exporting the
  // whole 60×40m grid. Falls back to full canvas if nothing has been placed.
  const ppm = PIXELS_PER_METRE;
  const fullW = CANVAS_WIDTH_M * ppm;
  const fullH = CANVAS_HEIGHT_M * ppm;
  const bbox = computeBuildingsBoundsPx(buildings);

  let cropX = 0, cropY = 0, cropW = fullW, cropH = fullH;
  if (bbox) {
    // Padding in metres around the buildings (also leaves room for the sun overlay)
    const padPx = 5 * ppm;
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

  // Render the crop to PNG (preserves transparency for compositing) then re-
  // encode as JPEG over a white background to keep the file under a few MB.
  //
  // Konva's layer canvases are sized to the *displayed* stage, so exporting
  // with the user's current zoom/pan would only capture the visible area and
  // leave the rest transparent. Temporarily reset the stage to a 1:1 transform
  // sized to the crop so every layer redraws at full resolution, then restore.
  const prev = {
    x: stage.x(),
    y: stage.y(),
    sx: stage.scaleX(),
    sy: stage.scaleY(),
    w: stage.width(),
    h: stage.height(),
  };
  stage.scale({ x: 1, y: 1 });
  stage.position({ x: -cropX, y: -cropY });
  stage.size({ width: cropW, height: cropH });
  stage.draw();

  let pngUrl = "";
  try {
    pngUrl = stage.toDataURL({
      pixelRatio: 1.5,
      mimeType: "image/png",
    });
  } finally {
    stage.scale({ x: prev.sx, y: prev.sy });
    stage.position({ x: prev.x, y: prev.y });
    stage.size({ width: prev.w, height: prev.h });
    stage.draw();
  }
  const jpegUrl = await pngDataUrlToJpeg(pngUrl, 0.82);

  // Fit the crop into the available space on the A3 page while preserving its
  // aspect ratio. A3 landscape = 420 × 297 mm; reserve room for header + legend.
  const maxImgW = 390;
  const maxImgH = 210;
  const aspect = cropW / cropH;
  let imgWidth = maxImgW;
  let imgHeight = imgWidth / aspect;
  if (imgHeight > maxImgH) {
    imgHeight = maxImgH;
    imgWidth = imgHeight * aspect;
  }
  const imgX = 15;
  const imgY = 36;
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

  pdf.save("site-layout.pdf");
}
