const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Compile the actual TS modules in an isolated context. All network calls are
// mocked; no runtime credentials, live services or new test dependency needed.
function harness({ fetch, mocks = {}, apiKey = "test-only" } = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(__dirname, "..", file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    const localRequire = (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name.startsWith("@/") || name.startsWith(".")) {
        const base = name.startsWith("@/") ? path.resolve(__dirname, "../src", name.slice(2)) : path.resolve(path.dirname(file), name);
        return load([base, `${base}.ts`, `${base}.tsx`].find((p) => fs.existsSync(p)));
      }
      return require(name);
    };
    vm.runInNewContext(code, {
      exports: module.exports, module, require: localRequire,
      fetch: fetch || (() => { throw new Error("Unexpected network call"); }),
      Request, Response, Headers, AbortSignal, Blob, FormData, atob,
      process: { env: { MONDAY_API_KEY: apiKey } },
      console: { error() {}, warn() {}, log() {} },
    }, { filename: file });
    return module.exports;
  }
  return load;
}

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const customer = { firstName: "Test", lastName: "Customer", company: "Fixture", email: "test@example.invalid", phone: "0400000000", inquiryType: "Hire", details: "Keep these details" };
const request = (extra = {}) => new Request("https://example.invalid/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...customer, ...extra }) });

test("confirmed creation preserves destination and payload and returns its ID", async () => {
  const calls = [];
  const load = harness({ fetch: async (url, options) => {
    calls.push({ url, options });
    return json({ data: { create_item: { id: "123456" } } });
  } });
  const response = await load("src/app/api/quote/route.ts").POST(request({ quoteSummary: "1x Test office" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, itemId: "123456" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.monday.com/v2");
  const query = JSON.parse(calls[0].options.body).query;
  assert.match(query, /board_id: 18411035983/);
  assert.match(query, /group_id: "topics"/);
  assert.match(query, /Test Customer — Fixture/);
  assert.match(query, /1x Test office/);
  assert.match(query, /Keep these details/);
});

for (const [name, reply] of [
  ["GraphQL error", () => json({ errors: [{ message: "Rejected" }] })],
  ["missing item ID", () => json({ data: { create_item: {} } })],
  ["invalid item ID", () => json({ data: { create_item: { id: "invalid" } } })],
  ["HTTP failure even with an ID in its body", () => json({ data: { create_item: { id: "123" } } }, 500)],
  ["network failure after sending", () => { throw new TypeError("Connection lost"); }],
  ["malformed upstream response", () => new Response("not JSON")],
]) {
  test(`${name}: no false success and no automatic retry`, async () => {
    let calls = 0;
    const load = harness({ fetch: async () => { calls++; return reply(); } });
    const response = await load("src/app/api/quote/route.ts").POST(request());
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { success: false, code: "quote_unconfirmed" });
    assert.equal(calls, 1);
  });
}

test("unconfigured integration returns unavailable without attempting delivery", async () => {
  let calls = 0;
  const load = harness({ apiKey: "", fetch: async () => { calls++; throw new Error("must not send"); } });
  const response = await load("src/app/api/quote/route.ts").POST(request());
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { success: false, code: "quote_unavailable" });
  assert.equal(calls, 0);
});

test("optional planner attachment failure does not undo confirmed enquiry", async () => {
  const calls = [];
  const load = harness({ fetch: async (url) => {
    calls.push(url);
    return url.endsWith("/file") ? json({ errors: [{ message: "Attachment failed" }] }) : json({ data: { create_item: { id: "123456" } } });
  } });
  const response = await load("src/app/api/quote/route.ts").POST(request({ siteLayoutPng: "data:image/png;base64,AA==", siteLayoutJson: "{}" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, itemId: "123456" });
  assert.deepEqual(calls, ["https://api.monday.com/v2", "https://api.monday.com/v2/file"]);
});

function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}

// Run the actual page component and submit handler with mocked hooks/cart.
// This verifies controlled values and confirmation/clear behavior, not browser layout.
function formHarness(reply) {
  let cursor = 0;
  const state = [];
  let cleared = 0, tracked = 0, sent = 0;
  const items = [{ id: "fixture", name: "Test Office", category: "site-offices", size: "6x3m", quantity: 2 }];
  const stub = { __esModule: true, default: () => null };
  const load = harness({
    fetch: async () => { sent++; return reply(); },
    mocks: {
      react: { useState(initial) { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], (next) => { state[i] = typeof next === "function" ? next(state[i]) : next; }]; }, useCallback: (fn) => fn },
      "@/components/Header": stub, "@/components/MobileCTA": stub,
      "@/components/FadeIn": { FadeIn: () => null }, "next/link": stub,
      "@/data/standardInclusions": { __esModule: true, default: {} },
      "@/lib/analytics": { trackLead() { tracked++; } },
      "@/context/QuoteCartContext": { useQuoteCart: () => ({ items, itemCount: 2, siteLayout: { png: "fixture", json: "{}" }, clearCart() { cleared++; }, removeItem() {}, updateQuantity() {} }) },
    },
  });
  const Page = load("src/app/quote/page.tsx").default;
  const render = () => { cursor = 0; return nodes(Page()); };
  for (const [field, value] of Object.entries(customer)) {
    render().find((n) => n.props?.id === `quote-${field}`).props.onChange({ target: { value } });
  }
  return {
    render,
    submit: () => render().find((n) => n.type === "form").props.onSubmit({ preventDefault() {} }),
    counts: () => ({ cleared, tracked, sent }),
    items,
  };
}

for (const [name, reply] of [
  ["API rejection", () => json({ success: false, code: "quote_unconfirmed" }, 502)],
  ["legacy fallback success without ID", () => json({ success: true, fallback: true })],
  ["invalid returned ID", () => json({ success: true, itemId: "bad" })],
  ["HTTP failure despite success body", () => json({ success: true, itemId: "123" }, 500)],
  ["browser network failure", () => { throw new TypeError("Connection lost"); }],
  ["invalid JSON response", () => new Response("not JSON")],
]) {
  test(`form retains customer details and basket on ${name}`, async () => {
    const form = formHarness(reply);
    await form.submit();
    assert.deepEqual(form.counts(), { cleared: 0, tracked: 0, sent: 1 });
    const tree = form.render();
    for (const [field, value] of Object.entries(customer)) {
      assert.equal(tree.find((n) => n.props?.id === `quote-${field}`).props.value, value);
    }
    assert.equal(form.items[0].quantity, 2);
    assert.match(tree.find((n) => n.props?.role === "alert").props.children, /call.*before trying again/);
    assert.equal(tree.find((n) => n.type === "button" && n.props?.type === "submit").props.disabled, false);
    assert.ok(!tree.some((n) => n.type === "h2" && n.props.children === "Quote Request Submitted"));
  });
}

test("form offers later retry for known unavailable service and retains basket", async () => {
  const form = formHarness(() => json({ success: false, code: "quote_unavailable" }, 503));
  await form.submit();
  assert.deepEqual(form.counts(), { cleared: 0, tracked: 0, sent: 1 });
  assert.match(form.render().find((n) => n.props?.role === "alert").props.children, /try again later/);
});

test("form clears basket and confirms only for a successful response with valid ID", async () => {
  const form = formHarness(() => json({ success: true, itemId: "123456" }));
  await form.submit();
  assert.deepEqual(form.counts(), { cleared: 1, tracked: 1, sent: 1 });
  assert.ok(form.render().some((n) => n.type === "h2" && n.props.children === "Quote Request Submitted"));
});
