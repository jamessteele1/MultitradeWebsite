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
  uploadFileToColumn,
} from "@/lib/monday";

/**
 * Quote requests from the website — Get a Quote form, Quote cart panel,
 * Site Planner "Get a Quote", Scope Builder. All flow into the new
 * Quote Inquiries board in the "Website — Lead Capture" folder.
 */
export const maxDuration = 30;
export const runtime = "nodejs";
// Allow large request bodies because Site Planner submissions include a
// base64-encoded PNG snapshot of the canvas (typically 200KB–1.5MB).
// Next 14 default body limit is 1MB; the route handler uses Node runtime
// so this directive bumps it.
export const dynamic = "force-dynamic";

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
      // Optional: site planner snapshot (only present when the user came via
      // the Site Planner). PNG dataURL gets attached to the file column,
      // JSON gets stored on the long-text column for re-import.
      siteLayoutPng = "",
      siteLayoutJson = "",
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
      // Layout JSON goes inline so the team can copy/paste it back into the
      // planner via the (future) re-import tool. PNG is uploaded separately
      // because file columns require a multipart upload.
      [board.columns.layoutData]: siteLayoutJson ? longText(siteLayoutJson) : null,
    });

    const result = await createMondayItem(board.id, itemName || "Quote Request", columnValues);

    // Attach the site-layout PNG as a file on the new item. Done after
    // create_item so we have an item_id. Fail-open — never block the user.
    if (result.ok && result.itemId && siteLayoutPng) {
      const filename = `site-layout-${result.itemId}.png`;
      uploadFileToColumn(result.itemId, board.columns.siteLayout, siteLayoutPng, filename).catch(
        (err) => console.error("[/api/quote] site layout upload failed:", err),
      );
    }

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
