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
 * Buy-page lead capture form. Pushes into the Quote Inquiries board with a
 * source flag so the sales team can tell where the lead originated.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name = "",
      company = "",
      email = "",
      phone = "",
      description = "",
      sourcePage = "",
      source = "Buy page",
    } = body || {};

    if (!email && !name) {
      return NextResponse.json({ success: false, error: "Name or email required." }, { status: 400 });
    }

    const board = BOARDS.quoteInquiries;
    const [firstName, ...rest] = String(name).split(" ");
    const lastName = rest.join(" ");
    const itemName = [name, company && `— ${company}`].filter(Boolean).join(" ").trim() || "Buy Page Lead";

    const columnValues = clean({
      [board.columns.date]: { date: todayISO() },
      [board.columns.leadStatus]: { label: "New" },
      [board.columns.firstName]: firstName,
      [board.columns.lastName]: lastName,
      [board.columns.company]: company,
      [board.columns.email]: emailValue(email),
      [board.columns.phone]: phoneValue(phone),
      [board.columns.additionalDetails]: longText(description),
      [board.columns.source]: source,
      [board.columns.sourcePage]: linkValue(sourcePage, "View page"),
      [board.columns.visitorInfo]: longText(buildVisitorInfo(req)),
    });

    await createMondayItem(board.id, itemName, columnValues);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/lead] error:", err);
    return NextResponse.json({ success: true });
  }
}
