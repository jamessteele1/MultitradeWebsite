## Project overview

This repository is the new Multitrade Building Hire website, built with Next.js / React and deployed on Vercel.

The website is being progressively rebuilt from the existing multitrade.com.au site into a cleaner, more modern, higher-conversion experience focused on portable buildings, modular buildings, solar facilities, project capability, and enquiry generation.

The current priority feature is a new **Scope Builder** tool.

## Current feature to build

Build an MVP for a new route:

`/scope-builder`

Purpose:
Turn rough portable building enquiries into a structured, quote-ready preliminary scope.

The Scope Builder should help a prospect or project manager describe what they need in plain English, answer a few guided questions, and receive:

- a recommended building mix
- suggested add-ons
- assumptions
- questions to confirm
- a short sales summary
- a clear enquiry submission path

This is **not** a final quoting engine and must not present itself as one.

## Product intent

The Scope Builder should make the website feel like a digital sales engineer, not just a contact form.

It should:
- improve enquiry quality
- reduce back-and-forth
- feel practical and industrial, not gimmicky
- fit the MBH brand and current design language
- be commercially useful from version one

## User experience requirements

The MVP should include:

1. A landing/introduction section
2. A free-text project description field
3. A short guided question flow
4. A loading/generation state
5. A structured result screen
6. A submit enquiry action

Keep the total flow quick and practical.
Target completion time should be under 3 minutes.

## Important commercial constraints

The Scope Builder must:
- be framed as a **preliminary recommendation only**
- avoid promising final pricing, availability, compliance, or engineering suitability
- avoid hallucinating products
- avoid generic chatbot fluff
- feel grounded in real MBH operations

Use wording such as:
- preliminary recommendation
- subject to final review
- subject to availability
- final scope to be confirmed by the MBH team

## Implementation approach

Do **not** build this as an open-ended chatbot.

Build it as:
- a guided UI
- a structured API request
- a controlled output schema
- MBH business rules + product catalogue
- AI used for interpretation and summary, not invention

## Technical preferences

Prefer:
- Next.js App Router
- React
- TypeScript
- server route handlers for AI/API logic
- small, readable components
- reusable UI where practical
- Zod for validation if needed
- minimal dependencies unless clearly justified

Before adding a new dependency:
- check whether the existing project already has a suitable pattern or library
- prefer native/browser/Next.js solutions where reasonable

## File structure guidance

If creating the Scope Builder, prefer a structure like:

- `app/scope-builder/page.tsx`
- `app/api/scope-builder/route.ts`
- `components/scope-builder/ScopeIntro.tsx`
- `components/scope-builder/ScopeForm.tsx`
- `components/scope-builder/ScopeQuestions.tsx`
- `components/scope-builder/ScopeResult.tsx`
- `lib/scope-builder/schema.ts`
- `lib/scope-builder/products.ts`
- `lib/scope-builder/rules.ts`

Adapt this if the repository already has stronger conventions.

## Scope Builder output requirements

The backend should return structured data, not loose prose.

Expected shape should include fields like:
- `projectType`
- `industry`
- `hireOrBuy`
- `headcount`
- `location`
- `duration`
- `recommendedProducts`
- `suggestedAddOns`
- `assumptions`
- `questionsToConfirm`
- `siteConstraints`
- `summaryForSales`

Recommended products must come only from a controlled MBH catalogue or mocked internal list defined in the codebase.

## Product logic expectations

Include practical rules such as:
- smaller setups for smaller headcounts
- prompt for water/waste if toilets or ablutions are involved
- surface solar/off-grid considerations if power is limited
- prompt for access/crane/site constraints where relevant
- bias toward hire logic for temporary projects
- keep recommendations conservative and practical

Do not invent capabilities that MBH may not actually offer.

## UI / design direction

The visual style should:
- match the existing modern MBH Vercel site
- feel industrial, clean, and credible
- prioritise clarity over decoration
- use strong hierarchy and obvious CTAs
- look good on desktop and mobile

Avoid:
- overly playful UI
- gimmicky AI styling
- chat bubbles unless clearly justified
- unnecessary animation

## Coding standards

- Keep code clean and readable
- Prefer small composable components
- Avoid large monolithic files where possible
- Comment only where helpful
- Preserve existing conventions in the repo
- Do not refactor unrelated parts of the codebase unless necessary

## Working style

When working on a task:
1. Inspect the current repo structure first
2. Reuse existing patterns before introducing new ones
3. Make the smallest sensible set of changes
4. Ensure the feature is usable end-to-end
5. Summarise what was changed and any assumptions made

## Testing and validation

Before finishing:
- run the project checks that already exist in the repo
- at minimum, ensure the new route builds cleanly
- verify there are no obvious TypeScript errors
- confirm the new route renders and the submit/generate flow works logically

If tests are missing, say so clearly rather than pretending they were run.

## If AI integration is not yet wired up

If environment variables or model integration are not ready:
- scaffold the feature cleanly
- use mocked structured output with a clear TODO
- keep the architecture ready for live AI integration
- do not block the entire feature on production AI credentials

## Deliverable expectations

For each task, provide:
- a summary of files changed
- key implementation notes
- any required environment variables
- any follow-up items for production readiness

## Business context

Multitrade Building Hire serves mining, industrial, civil, and commercial sectors in Queensland.
The website should reflect:
- practical project capability
- credibility
- regional servicing strength
- portable/modular building expertise
- strong enquiry conversion focus

Keep this context in mind when making content or UX decisions.
