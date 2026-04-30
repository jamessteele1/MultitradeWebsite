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
 * Quote requests from the website — Get a Quote form, Quote cart panel,
 * Site Planner "Get a Quote", Scope Builder. All flow into the new
 * Quote Inquiries board in the "Website — Lead Capture" folder.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName = "",
      lastName = "",
      company = "",
      jobTitle = "",
      email = "",
      phone = "",
      address = "",
      projectLocation = "",
      inquiryType = "",
      timeline = "",
      details = "",
      quoteSummary = "",
      sourcePage = "",
      source = "Quote Form",
    } = body || {};

    const board = BOARDS.quoteInquiries;
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    const itemName = [
      fullName || "Unknown",
      company && `— ${company}`,
    ]
      .filter(Boolean)
      .join(" ");

    // Status-column labels can't be created via the public API — they need
    // a one-time setup in the Monday UI. Until then we inline the inquiry
    // type into the additional-details so the sales team sees it.
    const detailsParts: string[] = [];
    if (inquiryType) detailsParts.push(`Inquiry type: ${inquiryType}`);
    if (details) detailsParts.push(details);
    const combinedDetails = detailsParts.join("\n\n");

    const columnValues = clean({
      [board.columns.date]: { date: todayISO() },
      [board.columns.firstName]: firstName,
      [board.columns.lastName]: lastName,
      [board.columns.company]: company,
      [board.columns.jobTitle]: jobTitle,
      [board.columns.email]: emailValue(email),
      [board.columns.phone]: phoneValue(phone),
      [board.columns.projectLocation]: projectLocation,
      [board.columns.businessAddress]: address,
      [board.columns.quoteSummary]: longText(quoteSummary),
      [board.columns.timeline]: timeline,
      [board.columns.additionalDetails]: longText(combinedDetails),
      [board.columns.source]: source,
      [board.columns.sourcePage]: linkValue(sourcePage, "View page"),
      [board.columns.visitorInfo]: longText(buildVisitorInfo(req)),
    });

    const result = await createMondayItem(board.id, itemName || "Quote Request", columnValues);

    // Always return success so the user sees their form go through.
    return NextResponse.json({
      success: true,
      itemId: result.itemId,
      fallback: !result.ok,
    });
  } catch (err) {
    console.error("[/api/quote] error:", err);
    return NextResponse.json({ success: true, fallback: true });
  }
}
