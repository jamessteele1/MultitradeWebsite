import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input");
  if (!input) {
    return NextResponse.json({ error: "input param required" }, { status: 400 });
  }
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    input,
    key: API_KEY,
    components: "country:au",
    types: "address",
    // Bias towards Gladstone QLD
    location: "-23.85,151.26",
    radius: "500000", // 500km radius bias
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`,
  );
  const data = await res.json();
  return NextResponse.json(data);
}
