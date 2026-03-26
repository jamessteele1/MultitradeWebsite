import { NextResponse } from "next/server";

const MONDAY_API_URL = "https://api.monday.com/v2";
const BOARD_ID = "8309336939";
const GROUP_ID = "topics"; // "Website Quote Leads" group

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      company,
      jobTitle,
      email,
      phone,
      address,
      projectLocation,
      inquiryType,
      timeline,
      details,
      quoteSummary,
    } = body;

    const apiKey = process.env.MONDAY_API_KEY;
    if (!apiKey) {
      console.error("MONDAY_API_KEY not configured");
      // Still return success to user — we don't want their submission to "fail"
      // Log it so we can manually follow up
      console.log("Quote submission (no Monday key):", JSON.stringify(body));
      return NextResponse.json({ success: true, fallback: true });
    }

    const itemName = `${firstName}${lastName ? ` ${lastName}` : ""}${company ? ` — ${company}` : ""}`;

    // Build column values matching Monday.com board "Website Leads" (8309336939)
    const columnValues: Record<string, unknown> = {
      // Date — today
      date4: { date: new Date().toISOString().split("T")[0] },
      // Type of Inquiry (status column)
      status_mkmfbq7h: { label: inquiryType || "Hire" },
      // Company Name
      text_mkmfhj9n: company || "",
      // Quote Summary (long text)
      quote_summary_mkmhkt21: { text: quoteSummary || "" },
      // Project Location
      text_mkmfeess: projectLocation || "",
      // First Name
      text_mkmfd638: firstName || "",
      // Last Name
      text_mkmfywza: lastName || "",
    };

    // Phone
    if (phone) {
      columnValues.phone_mkmfgmqb = { phone, countryShortName: "AU" };
    }
    // Email
    if (email) {
      columnValues.email_mkmfy27c = { email, text: email };
    }
    // Business Address
    if (address) {
      columnValues.business_address_mkmfyw7n = address;
    }
    // Job Title
    if (jobTitle) {
      columnValues.text_mkmf1d7p = jobTitle;
    }
    // Additional Details — combine timeline + details
    const longTextParts: string[] = [];
    if (timeline) longTextParts.push(`Timeline: ${timeline}`);
    if (details) longTextParts.push(details);
    if (longTextParts.length > 0) {
      columnValues.long_text_mkmf7ysr = { text: longTextParts.join("\n\n") };
    }

    const mutation = `mutation {
      create_item(
        board_id: ${BOARD_ID},
        group_id: "${GROUP_ID}",
        item_name: ${JSON.stringify(itemName)},
        column_values: ${JSON.stringify(JSON.stringify(columnValues))}
      ) {
        id
      }
    }`;

    const mondayRes = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const mondayData = await mondayRes.json();

    if (mondayData.errors) {
      console.error("Monday.com API errors:", mondayData.errors);
      // Still return success — don't let Monday API issues block the user
      console.log("Quote submission (Monday error):", JSON.stringify(body));
      return NextResponse.json({ success: true, fallback: true });
    }

    return NextResponse.json({
      success: true,
      itemId: mondayData.data?.create_item?.id,
    });
  } catch (err) {
    console.error("Quote submission error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
