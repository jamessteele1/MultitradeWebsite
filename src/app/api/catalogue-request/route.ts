import { NextResponse } from "next/server";

const MONDAY_API_URL = "https://api.monday.com/v2";
const BOARD_ID = "8309336939";
const GROUP_ID = "topics";

export async function POST(req: Request) {
  try {
    const { name, company, email, phone } = await req.json();

    const apiKey = process.env.MONDAY_API_KEY;
    if (!apiKey) {
      console.error("MONDAY_API_KEY not configured — catalogue request from:", email);
      return NextResponse.json({ success: true });
    }

    const today = new Date().toISOString().split("T")[0];
    const [firstName, ...rest] = (name || "").split(" ");
    const lastName = rest.join(" ");

    const columnValues = JSON.stringify({
      date4: { date: today },
      status_mkmfbq7h: { label: "Catalogue Request" },
      text_mkmfhj9n: company || "",
      text_mkmfd638: firstName || "",
      text_mkmfywza: lastName || "",
      phone_mkmfgmqb: { phone: phone || "", countryShortName: "AU" },
      email_mkmfy27c: { email: email || "", text: email || "" },
      long_text_mkmf7ysr: { text: "Requested product catalogue download from website." },
    });

    const itemName = `${name || "Unknown"} — Catalogue Request`;

    const query = `mutation { create_item(board_id: ${BOARD_ID}, group_id: "${GROUP_ID}", item_name: "${itemName.replace(/"/g, '\\"')}", column_values: ${JSON.stringify(columnValues)}) { id } }`;

    await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ query }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Catalogue request error:", err);
    return NextResponse.json({ success: true });
  }
}
