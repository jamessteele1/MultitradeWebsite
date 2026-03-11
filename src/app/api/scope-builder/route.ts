import { NextResponse } from "next/server";
import { buildScopeRecommendation } from "@/lib/scope-builder/rules";
import { parseScopeBuilderInput } from "@/lib/scope-builder/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseScopeBuilderInput(body);
    const recommendation = buildScopeRecommendation(input);

    return NextResponse.json(recommendation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate scope.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
