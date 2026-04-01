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

  // Site address and coordinates
  if (siteAddress) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Site: ${siteAddress}`, textStartX, 35);
    if (siteCoords) {
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Coordinates: ${siteCoords.lat.toFixed(6)}, ${siteCoords.lng.toFixed(6)}`, textStartX, 40);
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

  // Building legend
  const legendY = 36 + Math.min(imgHeight, 210) + 10;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Building Legend", 15, legendY);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");

  const counts: Record<string, number> = {};
  for (const b of buildings) {
    const type = getBuildingType(b.typeId);
    if (type) counts[type.name] = (counts[type.name] || 0) + 1;
  }

  let y = legendY + 6;
  for (const [name, count] of Object.entries(counts)) {
    pdf.text(`${count}×  ${name}`, 18, y);
    y += 5;
  }

  pdf.save("site-layout.pdf");
}
