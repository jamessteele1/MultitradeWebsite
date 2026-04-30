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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName = "",
      lastName = "",
      company = "",
      email = "",
      phone = "",
      subject = "",
      preferredContact = "",
      message = "",
      sourcePage = "",
    } = body || {};

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const board = BOARDS.contactForm;
    const itemName = [
      `${firstName} ${lastName}`.trim(),
      company && `— ${company}`,
      subject && ` · ${subject}`,
    ]
      .filter(Boolean)
      .join(" ");

    // Inline preferred-contact preference into the message text so it shows
    // up regardless of whether the Monday status labels have been set up yet.
    const messageBody = preferredContact
      ? `Preferred contact: ${preferredContact}\n\n${message}`
      : message;

    const columnValues = clean({
      [board.columns.date]: { date: todayISO() },
      [board.columns.firstName]: firstName,
      [board.columns.lastName]: lastName,
      [board.columns.company]: company,
      [board.columns.email]: emailValue(email),
      [board.columns.phone]: phoneValue(phone),
      [board.columns.subject]: subject,
      [board.columns.message]: longText(messageBody),
      [board.columns.sourcePage]: linkValue(sourcePage, "View page"),
      [board.columns.visitorInfo]: longText(buildVisitorInfo(req)),
    });

    await createMondayItem(board.id, itemName || "Contact Form Submission", columnValues);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/contact] error:", err);
    return NextResponse.json({ success: true });
  }
}
