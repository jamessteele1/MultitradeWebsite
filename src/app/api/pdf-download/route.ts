import { NextResponse } from "next/server";
import {
  BOARDS,
  buildVisitorInfo,
  clean,
  createMondayItem,
  emailValue,
  linkValue,
  longText,
  phoneValue,
  todayISO,
} from "@/lib/monday";

/**
 * Soft-gate handler for floor-plan / brochure PDF downloads.
 *
 * Always returns `{ success: true }` so the caller can proceed with the
 * download even if the CRM is having a bad day — losing a lead is better
 * than blocking the user from getting what they asked for.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName = "",
      lastName = "",
      company = "",
      email = "",
      phone = "",
      pdfUrl = "",
      productName = "",
      productSlug = "",
      sourcePage = "",
    } = body || {};

    if (!firstName || !email) {
      return NextResponse.json(
        { success: false, error: "First name and email are required." },
        { status: 400 },
      );
    }

    const board = BOARDS.pdfDownloads;
    const itemName = [
      `${firstName} ${lastName}`.trim(),
      company && `— ${company}`,
      productName && ` (${productName})`,
    ]
      .filter(Boolean)
      .join(" ");

    const columnValues = clean({
      [board.columns.date]: { date: todayISO() },
      [board.columns.leadStatus]: { label: "New" },
      [board.columns.firstName]: firstName,
      [board.columns.lastName]: lastName,
      [board.columns.company]: company,
      [board.columns.email]: emailValue(email),
      [board.columns.phone]: phoneValue(phone),
      [board.columns.documentRequested]: productName,
      [board.columns.productSlug]: productSlug,
      [board.columns.sourcePage]: linkValue(sourcePage, "View page"),
      [board.columns.pdfFile]: linkValue(pdfUrl, "Open PDF"),
      [board.columns.visitorInfo]: longText(buildVisitorInfo(req, { pdfUrl, productSlug })),
    });

    await createMondayItem(board.id, itemName || "PDF Download", columnValues);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/pdf-download] error:", err);
    // Fail open — never block the download because of CRM issues.
    return NextResponse.json({ success: true });
  }
}
