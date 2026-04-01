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

export async function downloadPDF(stage: Konva.Stage, buildings: PlacedBuilding[]) {
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

  // Canvas image
  const dataUrl = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
  const imgWidth = 390;
  const imgHeight = (stage.height() / stage.width()) * imgWidth;
  pdf.addImage(dataUrl, "PNG", 15, 36, imgWidth, Math.min(imgHeight, 210));

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
