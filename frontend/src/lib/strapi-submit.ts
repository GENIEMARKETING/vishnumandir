/**
 * Strapi direct submission helper.
 * Used by Next.js API routes to save form data directly to Strapi CMS.
 * Replaces the old proxy-to-Express-backend approach.
 */

function getStrapiConfig() {
  const rawApiUrl = process.env.CMS_API_URL || "http://localhost:1337/api";
  return {
    // Allow CMS_API_URL to be provided as either ".../api" or base host; normalize to ".../api".
    apiUrl: rawApiUrl.replace(/\/$/, "").endsWith("/api")
      ? rawApiUrl.replace(/\/$/, "")
      : `${rawApiUrl.replace(/\/$/, "")}/api`,
    // Use dedicated write token if available, fall back to general CMS token
    apiToken: process.env.CMS_WRITE_TOKEN || process.env.CMS_API_TOKEN || "",
  };
}

/**
 * POST data to a Strapi collection endpoint.
 * Wraps payload in { data: payload } as Strapi v4/v5 expects.
 */
export async function strapiCreate<T = Record<string, unknown>>(
  collection: string,
  payload: T
): Promise<
  | { ok: true; id: number | string }
  | { ok: false; error: string; status?: number }
> {
  const { apiUrl, apiToken } = getStrapiConfig();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  } else {
    console.error("[strapi-submit] Missing CMS_WRITE_TOKEN/CMS_API_TOKEN");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${apiUrl}/${collection}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ data: payload }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        json?.error?.message ||
        json?.message ||
        `Strapi returned ${res.status}`;
      console.error(`[strapi-submit] POST /${collection} failed:`, {
        status: res.status,
        msg,
      });
      return { ok: false, error: msg, status: res.status };
    }

    const id = json?.data?.id ?? json?.id ?? "unknown";
    return { ok: true, id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.error(`[strapi-submit] POST /${collection} exception:`, msg);
    return { ok: false, error: msg };
  }
}

/** Generate a short unique transaction ID */
export function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
