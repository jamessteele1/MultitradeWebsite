/**
 * Shared helpers for posting leads to monday.com.
 *
 * The website talks to multiple boards inside the "Website — Lead Capture"
 * folder of the MBH CRM workspace. Each board has its own column IDs, defined
 * in BOARDS below.
 *
 * All endpoints follow the same pattern: validate input, build a column-value
 * payload, post to monday.com via GraphQL, and *always* return success to the
 * caller — we never want a CRM hiccup to look like a broken form.
 */

const MONDAY_API_URL = "https://api.monday.com/v2";

export const BOARDS = {
  /** PDF Download Requests — soft gate when downloading a floor plan / brochure */
  pdfDownloads: {
    id: "18411035953",
    columns: {
      date: "date_mm2x95ws",
      leadStatus: "color_mm2x9wk9",
      firstName: "text_mm2xvz4y",
      lastName: "text_mm2xkwp2",
      company: "text_mm2x9er7",
      email: "email_mm2xpvcv",
      phone: "phone_mm2xgmxr",
      documentRequested: "text_mm2x3hzr",
      productSlug: "text_mm2xb866",
      sourcePage: "link_mm2xqhe0",
      pdfFile: "link_mm2xfwm7",
      visitorInfo: "long_text_mm2xdjpa",
    },
  },
  /** Quote Inquiries — Get a Quote, Quote cart, Scope Builder, Site Planner */
  quoteInquiries: {
    id: "18411035983",
    columns: {
      date: "date_mm2xx14f",
      leadStatus: "color_mm2x42mp",
      typeOfInquiry: "color_mm2x9vn7",
      firstName: "text_mm2xc469",
      lastName: "text_mm2x57xq",
      company: "text_mm2x34n5",
      jobTitle: "text_mm2x27ys",
      email: "email_mm2xjk92",
      phone: "phone_mm2xebkg",
      projectLocation: "text_mm2x48v0",
      businessAddress: "text_mm2xfjgc",
      quoteSummary: "long_text_mm2xfsfq",
      timeline: "text_mm2xek6g",
      additionalDetails: "long_text_mm2xqv53",
      source: "text_mm2xb4y6",
      sourcePage: "link_mm2xvkeh",
      visitorInfo: "long_text_mm2x8j5",
      // Site planner snapshot — set when the lead came via the planner
      siteLayout: "file_mm2y85mc",
      layoutData: "long_text_mm2ys3ng",
    },
  },
  /** Contact Form Submissions — general /contact page enquiries */
  contactForm: {
    id: "18411036006",
    columns: {
      date: "date_mm2xch8x",
      leadStatus: "color_mm2x15n3",
      firstName: "text_mm2xyrcd",
      lastName: "text_mm2xvf4d",
      company: "text_mm2x1396",
      email: "email_mm2xkxvj",
      phone: "phone_mm2x129n",
      subject: "text_mm2xm5vx",
      preferredContact: "color_mm2xqqtp",
      message: "long_text_mm2xtg5j",
      sourcePage: "link_mm2xz901",
      visitorInfo: "long_text_mm2x6mvd",
    },
  },
} as const;

export const todayISO = () => new Date().toISOString().split("T")[0];

/** Build a phone column value (defaults to AU). */
export const phoneValue = (phone?: string | null) =>
  phone ? { phone, countryShortName: "AU" } : null;

/** Build an email column value. */
export const emailValue = (email?: string | null) =>
  email ? { email, text: email } : null;

/** Build a long_text column value. */
export const longText = (text?: string | null) =>
  text ? { text } : null;

/** Build a link column value with optional display text. */
export const linkValue = (url?: string | null, label?: string | null) =>
  url ? { url, text: label || url } : null;

/** Visitor info string built from request headers — useful for spam filtering. */
export function buildVisitorInfo(req: Request, extra?: Record<string, unknown>) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  const referer = req.headers.get("referer") || "";
  const lines = [`IP: ${ip}`, `User-Agent: ${ua}`];
  if (referer) lines.push(`Referer: ${referer}`);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined && v !== null && v !== "") {
        lines.push(`${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`);
      }
    }
  }
  return lines.join("\n");
}

/** Strip null/undefined entries from a column-values object. */
export function clean<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out as T;
}

/**
 * Create an item in a monday.com board. Always returns `{ ok: boolean }` —
 * never throws — so callers can fail open: the user keeps moving forward
 * even when the CRM call hiccups.
 */
export async function createMondayItem(
  boardId: string,
  itemName: string,
  columnValues: Record<string, unknown>,
  groupId = "topics",
): Promise<{ ok: boolean; itemId?: string; error?: string }> {
  const apiKey = process.env.MONDAY_API_KEY;
  if (!apiKey) {
    console.warn("[monday] MONDAY_API_KEY not set — skipping CRM push.");
    console.log("[monday] Lead intended for board", boardId, ":", { itemName, columnValues });
    return { ok: false, error: "no_api_key" };
  }

  const mutation = `mutation {
    create_item(
      board_id: ${boardId},
      group_id: ${JSON.stringify(groupId)},
      item_name: ${JSON.stringify(itemName)},
      column_values: ${JSON.stringify(JSON.stringify(columnValues))}
    ) { id }
  }`;

  try {
    const res = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: apiKey },
      body: JSON.stringify({ query: mutation }),
    });
    const data = await res.json();
    if (data.errors) {
      console.error("[monday] API error:", data.errors);
      return { ok: false, error: "monday_error" };
    }
    return { ok: true, itemId: data.data?.create_item?.id };
  } catch (err) {
    console.error("[monday] network error:", err);
    return { ok: false, error: "network" };
  }
}

/**
 * Convert a base64 dataURL into a Buffer-like object suitable for FormData.
 */
function dataUrlToBlob(dataUrl: string): { buffer: Buffer; mime: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], buffer: Buffer.from(match[2], "base64") };
}

/**
 * Upload a base64-encoded image to a file column on a monday.com item.
 * Uses the file-upload variant of the GraphQL endpoint (multipart/form-data).
 * Always fail-open — caller doesn't need to await this for success.
 */
export async function uploadFileToColumn(
  itemId: string,
  columnId: string,
  dataUrl: string,
  filename = "site-layout.png",
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.MONDAY_API_KEY;
  if (!apiKey) {
    console.warn("[monday] MONDAY_API_KEY not set — skipping file upload.");
    return { ok: false, error: "no_api_key" };
  }

  const blob = dataUrlToBlob(dataUrl);
  if (!blob) {
    console.warn("[monday] Bad dataURL — skipping file upload.");
    return { ok: false, error: "bad_data_url" };
  }

  try {
    // Monday's file upload uses a GraphQL multipart spec
    // (https://github.com/jaydenseric/graphql-multipart-request-spec)
    const form = new FormData();
    form.append(
      "query",
      `mutation ($file: File!) { add_file_to_column(item_id: ${itemId}, column_id: ${JSON.stringify(columnId)}, file: $file) { id } }`,
    );
    form.append("map", '{"image":"variables.file"}');
    form.append("variables[file]", "");
    form.append(
      "image",
      new Blob([blob.buffer], { type: blob.mime }),
      filename,
    );

    const res = await fetch("https://api.monday.com/v2/file", {
      method: "POST",
      headers: { Authorization: apiKey },
      body: form,
    });
    const data = await res.json();
    if (data.errors) {
      console.error("[monday] file upload error:", data.errors);
      return { ok: false, error: "monday_error" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[monday] file upload network error:", err);
    return { ok: false, error: "network" };
  }
}
