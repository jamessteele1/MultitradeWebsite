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
 * Catalogue download lead capture. Treated as a PDF download against the
 * "Product Catalogue" instead of a specific floor plan.
 */
export async function POST(req: Request) {
  try {
    const { name = "", company = "", email = "", phone = "", sourcePage = "" } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    const board = BOARDS.pdfDownloads;
    const [firstName, ...rest] = String(name).split(" ");
    const lastName = rest.join(" ");
    const itemName = [name, company && `— ${company}`, "(Catalogue)"].filter(Boolean).join(" ").trim();

    const columnValues = clean({
      [board.columns.date]: { date: todayISO() },
      [board.columns.leadStatus]: { label: "New" },
      [board.columns.firstName]: firstName,
      [board.columns.lastName]: lastName,
      [board.columns.company]: company,
      [board.columns.email]: emailValue(email),
      [board.columns.phone]: phoneValue(phone),
      [board.columns.documentRequested]: "Product Catalogue",
      [board.columns.productSlug]: "catalogue",
      [board.columns.sourcePage]: linkValue(sourcePage, "View page"),
      [board.columns.visitorInfo]: longText(buildVisitorInfo(req)),
    });

    await createMondayItem(board.id, itemName, columnValues);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/catalogue-request] error:", err);
    return NextResponse.json({ success: true });
  }
}
