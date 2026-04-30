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

    // Map free-text inquiry type to one of the configured Monday labels.
    const validInquiryLabels = ["Hire", "Sale", "Both", "Catalogue", "Custom"];
    const normalisedInquiry = validInquiryLabels.find(
      (l) => l.toLowerCase() === String(inquiryType).toLowerCase().trim(),
    );

    const columnValues = clean({
      [board.columns.date]: { date: todayISO() },
      [board.columns.leadStatus]: { label: "New" },
      [board.columns.typeOfInquiry]: normalisedInquiry ? { label: normalisedInquiry } : null,
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
      [board.columns.additionalDetails]: longText(details),
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
