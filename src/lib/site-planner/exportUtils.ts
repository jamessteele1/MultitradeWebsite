import type Konva from "konva";
import type { PlacedBuilding } from "./usePlannerState";
import { getBuildingType } from "./buildings";

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

  // Canvas image
  const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
  const imgWidth = 390;
  const imgHeight = (stage.height() / stage.width()) * imgWidth;
  pdf.addImage(dataUrl, "PNG", 15, 36, imgWidth, Math.min(imgHeight, 210));

  // North compass — top right of the image area
  const compassX = 15 + imgWidth - 15; // right side
  const compassY = 50; // near top of image
  const compassR = 12; // radius in mm
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
  const legendY = 36 + Math.min(imgHeight, 210) + 10;
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

  // Scale bar on PDF — bottom right of image area
  const scaleBarY = 36 + Math.min(imgHeight, 210) - 5;
  const scaleMetres = 10; // 10m reference
  const pxPer1m = imgWidth / (stage.width() / 40); // 40 = PIXELS_PER_METRE in canvas
  const scaleBarW = scaleMetres * pxPer1m;
  const scaleBarX = 15 + imgWidth - scaleBarW - 10;

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
