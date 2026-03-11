export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { buildDynamicFollowUps, extractSignalsFromDescription, helperAnswer } from "@/lib/scope-builder/ai";
import { buildScopeRecommendation } from "@/lib/scope-builder/rules";
import { defaultScopeInput, mergeScopeInput, parseFollowUpAnswers, parseScopeBuilderInput, type ScopeBuilderInput } from "@/lib/scope-builder/schema";

type Action = "interpret" | "recommend" | "helper";

type RouteBody = {
  action?: Action;
  description?: string;
  question?: string;
  input?: Partial<ScopeBuilderInput>;
  followUpAnswers?: Record<string, string>;
};

function applyFollowUpAnswers(input: ScopeBuilderInput, answers: Record<string, string>): ScopeBuilderInput {
  const next = { ...input };

  if (answers.services_available === "all") {
    next.powerAccess = next.powerAccess === "unknown" ? "grid" : next.powerAccess;
    next.waterAccess = "available";
    next.wasteAccess = "available";
  }

  if (answers.services_available === "none") {
    next.powerAccess = "limited";
    next.waterAccess = "unavailable";
    next.wasteAccess = "unavailable";
  }

  if (answers.power_strategy === "generator") {
    next.powerAccess = "generator";
  }

  if (answers.power_strategy === "solar") {
    next.powerAccess = "limited";
  }

  if (answers.transport_quote === "yes" || answers.transport_quote === "no" || answers.transport_quote === "unsure") {
    next.wantsTransportQuote = answers.transport_quote;
  }

  if (answers.site_access) {
    next.siteAccess = answers.site_access;
  }

  if (answers.duration_clarification && !next.duration) {
    next.duration = answers.duration_clarification;
  }

  if (answers.complex_preference === "include-complex") {
    next.prefersComplexOption = "yes";
  }

  if (answers.complex_preference === "single-first") {
    next.prefersComplexOption = "no";
  }

  if (answers.mine_location && !next.siteConstraints) {
    next.siteConstraints = `Mine reference: ${answers.mine_location}`;
  }

  return next;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RouteBody;

    if (body.action === "helper") {
      const question = String(body.question ?? "").trim();
      if (!question) {
        throw new Error("Please enter a helper question.");
      }

      const answer = await helperAnswer(question);
      return NextResponse.json(answer);
    }

    if (body.action === "interpret") {
      const description = String(body.description ?? body.input?.description ?? "").trim();
      if (!description) {
        throw new Error("Please provide a project description.");
      }

      const extracted = await extractSignalsFromDescription(description);
      const merged = mergeScopeInput(defaultScopeInput, {
        description,
        industry: extracted?.industry ?? "",
        projectType: extracted?.projectType ?? "Portable building scope",
        hireOrBuy: extracted?.hireOrBuy ?? "unsure",
        headcount: extracted?.headcount ?? defaultScopeInput.headcount,
        location: extracted?.location ?? "",
        duration: extracted?.duration ?? "",
        needsOffice: extracted?.needsOffice ?? true,
        needsCrib: extracted?.needsCrib ?? true,
        needsToilets: extracted?.needsToilets ?? true,
        powerAccess: extracted?.powerAccess ?? "unknown",
      });

      const followUps = buildDynamicFollowUps(merged);
      return NextResponse.json({ extracted, draftInput: merged, followUps });
    }

    const rawInput = body.input ?? body;
    const followUpAnswers = parseFollowUpAnswers(body);
    const parsed = parseScopeBuilderInput(rawInput);
    const enriched = applyFollowUpAnswers(parsed, followUpAnswers);
    const recommendation = buildScopeRecommendation(enriched);

    return NextResponse.json({ result: recommendation, updatedInput: enriched });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process scope builder request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
