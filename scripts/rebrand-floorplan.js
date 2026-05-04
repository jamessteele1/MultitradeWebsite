/**
 * One-off PDF rebrand script for the floor-plan PDFs in
 * `public/images/floorplans/`.
 *
 * What it does, per PDF page:
 *   1. Stamps a faded Multitrade logo across the drawing in a diagonal
 *      grid — like the example PDF James shared.
 *   2. Masks the title-block "CLIENT" field with a white rectangle so
 *      old client names (BMA / Glencore / etc.) don't leak into the
 *      public-facing version.
 *
 * Output goes to `public/images/floorplans-rebranded/` so we can eyeball
 * it before replacing the originals.
 *
 * Usage:
 *   node scripts/rebrand-floorplan.js                  # processes the
 *                                                       # PILOT file
 *   node scripts/rebrand-floorplan.js --all            # processes every
 *                                                       # PDF in the dir
 *   node scripts/rebrand-floorplan.js "filename.pdf"   # processes one
 */

const { PDFDocument, degrees, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FLOORPLAN_DIR = path.join(ROOT, "public", "images", "floorplans");
const OUT_DIR = path.join(ROOT, "public", "images", "floorplans-rebranded");
const LOGO_PATH = path.join(ROOT, "public", "images", "logos", "Multitrade Logo.png");

// Pilot file — the 12x3m crib-room floor plan that the live site links
// to from /hire/crib-rooms/12x3m-crib-room.
const PILOT = "SQF-4392-01-A - 12.0x3.0m Crib Room - Floor Plan.pdf";

// ---- Tunables ----
// CLIENT-field mask. Coordinates are in PDF points (origin at the
// bottom-left of the page). Values are an OFFSET from the page's right
// and bottom edges so the script works on any A3 landscape regardless
// of exact page size.
//
// Title-block layout (bottom-right of an SQF title block) reading
// upwards from the page foot:
//   row 0: DRAWING NUMBER / REVISION / SHEET SIZE   (~y 35–62)
//   row 1: DESIGN WIND LOAD / DRAWN / CHECKED       (~y 62–95)
//   row 2: TITLE / SCALE                            (~y 95–130, taller)
//   row 3: CLIENT label + CLIENT value / DATE       (~y 130–160) ← target
//
// The CLIENT VALUE cell sits just right of the "CLIENT" label and just
// left of the "DATE" cell. We mask the value only — the "CLIENT" label
// stays so the title block reads naturally without anyone thinking the
// row is broken, and the DATE column on the right is preserved.
const CLIENT_MASK = {
  // Mask geometry derived from iteration on SQF-4392-01-A. The CLIENT
  // value cell on this drawing sits roughly between fromRight 265 and
  // fromRight 130 (≈ 135pt wide). The DATE column starts ~85pt from the
  // right edge, so we keep the right edge of the mask comfortably inside
  // that gap.
  //   - Iter 3 (fromRight 180, width 120): mask was too far right —
  //     covered just "NG" of the value + first half of the date.
  //   - Iter 4 (fromRight 230, width 155): better but left "XTREME E"
  //     visible and still nibbled the date.
  //   - Iter 5 (current): pushed the left edge well past the "CLIENT"
  //     label and pulled the right edge back inside the gap before
  //     "DATE", so the value is fully covered and the date is intact.
  fromRight: 310, // left edge sits just after the "CLIENT" label
  // The TITLE cell is double-height (e.g. "12.0x3.0m CRIB ROOM" wraps
  // onto a second line "- FLOOR PLAN"), so the CLIENT row above it
  // ends up around y = 160 rather than the y = 130 you'd guess from a
  // uniform row height. Height is sized to cover the value text only —
  // a taller rectangle nibbles the bottom of the "CLIENT" label that
  // sits at the top of the cell.
  fromBottom: 160,
  width: 215, // covers CLIENT value, leaves the DATE column intact
  height: 20,
};

// Watermark grid — diagonal repeats across each page.
const WATERMARK = {
  logoWidthPt: 220,
  rotateDeg: -28, // diagonal, falling left-to-right
  opacity: 0.07, // very faint so the drawing reads underneath
  cols: 5,
  rows: 4,
};

async function rebrand(inputPath, outputPath, logoBytes) {
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const logo = await pdfDoc.embedPng(logoBytes);
  const logoAspect = logo.height / logo.width;

  for (const page of pdfDoc.getPages()) {
    const { width, height } = page.getSize();

    // 1) Diagonal Multitrade watermark grid
    const logoW = WATERMARK.logoWidthPt;
    const logoH = logoW * logoAspect;
    const stepX = width / WATERMARK.cols;
    const stepY = height / WATERMARK.rows;
    for (let r = 0; r < WATERMARK.rows + 1; r++) {
      for (let c = 0; c < WATERMARK.cols + 1; c++) {
        // Offset every other row by half a step to break up the grid
        const x = c * stepX + (r % 2 === 0 ? 0 : stepX / 2);
        const y = r * stepY;
        page.drawImage(logo, {
          x: x - logoW / 2,
          y: y - logoH / 2,
          width: logoW,
          height: logoH,
          rotate: degrees(WATERMARK.rotateDeg),
          opacity: WATERMARK.opacity,
        });
      }
    }

    // 2) White mask over the CLIENT field. Drawn LAST so it sits on top
    //    of any watermark stamp that happens to fall over the title
    //    block — keeps the cell visually clean.
    page.drawRectangle({
      x: width - CLIENT_MASK.fromRight,
      y: CLIENT_MASK.fromBottom,
      width: CLIENT_MASK.width,
      height: CLIENT_MASK.height,
      color: rgb(1, 1, 1),
      opacity: 1,
    });
  }

  const out = await pdfDoc.save();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, out);
  return outputPath;
}

async function main() {
  const args = process.argv.slice(2);
  const wantsAll = args.includes("--all");
  const explicit = args.find((a) => a.endsWith(".pdf"));
  const targets = wantsAll
    ? fs.readdirSync(FLOORPLAN_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"))
    : [explicit ?? PILOT];

  if (!fs.existsSync(LOGO_PATH)) {
    console.error("Logo not found:", LOGO_PATH);
    process.exit(1);
  }
  const logoBytes = fs.readFileSync(LOGO_PATH);

  for (const fname of targets) {
    const inPath = path.join(FLOORPLAN_DIR, fname);
    if (!fs.existsSync(inPath)) {
      console.warn("Skipping (missing):", fname);
      continue;
    }
    const outPath = path.join(OUT_DIR, fname);
    try {
      await rebrand(inPath, outPath, logoBytes);
      console.log("✓", fname);
    } catch (err) {
      console.error("✗", fname, "—", err.message);
    }
  }
  console.log("\nOutput:", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
