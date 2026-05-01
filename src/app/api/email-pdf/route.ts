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

export const maxDuration = 30;
export const runtime = "nodejs";

/**
 * Email a generated site-planner PDF to the user's address. Also captures
 * the lead in the PDF Downloads Monday board so the sales team has a record.
 *
 * Triggered by mobile users tapping the PDF button — jsPDF.save() is
 * unreliable on mobile browsers (especially in-app browsers), so we go via
 * email which gives the user a permanent record + lets us capture the lead.
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
      pdfBase64 = "", // dataURL: "data:application/pdf;base64,..."
      productName = "Site Layout",
      productSlug = "site-planner",
      sourcePage = "",
    } = body || {};

    if (!firstName || !email) {
      return NextResponse.json(
        { success: false, error: "First name and email are required." },
        { status: 400 },
      );
    }

    // 1) Capture the lead in PDF Downloads — the sales team will see this
    //    even if Resend isn't configured yet.
    const board = BOARDS.pdfDownloads;
    const itemName = [
      `${firstName} ${lastName}`.trim(),
      company && `— ${company}`,
      ` (${productName})`,
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
      [board.columns.visitorInfo]: longText(
        buildVisitorInfo(req, { delivery: "email", productSlug }),
      ),
    });

    const result = await createMondayItem(board.id, itemName || "PDF Email Request", columnValues);

    // 2) Attach the PDF to the Monday item so the team can re-send it manually
    //    if needed. Fire-and-forget — don't block the user response.
    if (result.ok && result.itemId && pdfBase64) {
      uploadFileToColumn(
        result.itemId,
        board.columns.pdfAttachment,
        pdfBase64,
        "site-layout.pdf",
      ).catch((err) => console.error("[/api/email-pdf] file upload failed:", err));
    }

    // 3) Send the email via Resend (https://resend.com).
    const resendKey = process.env.RESEND_API_KEY;
    const fromAddr = process.env.RESEND_FROM || "Multitrade Building Hire <noreply@multitrade.com.au>";
    let emailSent = false;

    if (resendKey && pdfBase64) {
      const pdfContent = pdfBase64.replace(/^data:[^;]+;base64,/, "");
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromAddr,
            to: [email],
            subject: `Your ${productName} PDF — Multitrade Building Hire`,
            html: emailHtml({ firstName, productName }),
            attachments: [
              {
                filename: "site-layout.pdf",
                content: pdfContent,
              },
            ],
          }),
        });
        if (resendRes.ok) {
          emailSent = true;
        } else {
          const txt = await resendRes.text();
          console.error("[/api/email-pdf] Resend error:", resendRes.status, txt);
        }
      } catch (err) {
        console.error("[/api/email-pdf] Resend network error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent
        ? `PDF sent to ${email}. Check your inbox.`
        : "We've received your request — our team will email the PDF shortly.",
    });
  } catch (err) {
    console.error("[/api/email-pdf] error:", err);
    return NextResponse.json(
      { success: true, emailSent: false, message: "Request received — we'll be in touch shortly." },
    );
  }
}

function emailHtml({ firstName, productName }: { firstName: string; productName: string }) {
  const safeName = String(firstName).replace(/[<>]/g, "");
  const safeProduct = String(productName).replace(/[<>]/g, "");
  return `
<!doctype html>
<html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f8fafc;margin:0;padding:24px;color:#1f2937;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
    <tr>
      <td style="background:linear-gradient(135deg,#0F1F4D 0%,#1A2D6B 100%);padding:24px 28px;color:#ffffff;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#D4A843;">Multitrade Building Hire</div>
        <div style="font-size:22px;font-weight:800;margin-top:6px;">Your site layout, ready to share.</div>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        <p style="margin:0 0 14px 0;font-size:15px;line-height:1.55;">Hi ${safeName},</p>
        <p style="margin:0 0 14px 0;font-size:15px;line-height:1.55;">Your <strong>${safeProduct}</strong> PDF is attached. It includes the full layout to scale, building legend, and site information.</p>
        <p style="margin:0 0 14px 0;font-size:15px;line-height:1.55;">Want a formal quote? Reply to this email or call us on (07) 4979 2333 — we typically respond within 2 business hours.</p>
        <p style="margin:24px 0 0 0;font-size:14px;color:#6B7280;">— The Multitrade Team</p>
        <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="margin:0;font-size:11px;color:#9CA3AF;line-height:1.6;">
          Multitrade Building Hire · 6 South Trees Drive, Gladstone QLD 4680 · multitrade.com.au<br/>
          You're receiving this email because you requested a PDF download from our site planner.
        </p>
      </td>
    </tr>
  </table>
</body></html>`.trim();
}
