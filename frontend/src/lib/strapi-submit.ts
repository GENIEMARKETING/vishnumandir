/**
 * Strapi direct submission helper.
 * Used by Next.js API routes to save form data directly to Strapi CMS.
 * Replaces the old proxy-to-Express-backend approach.
 */

function getStrapiConfig() {
  return {
    apiUrl: process.env.CMS_API_URL || "http://localhost:1337/api",
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
): Promise<{ ok: true; id: number | string } | { ok: false; error: string }> {
  const { apiUrl, apiToken } = getStrapiConfig();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (apiToken) headers["Authorization"] = `Bearer ${apiToken}`;

  try {
    const res = await fetch(`${apiUrl}/${collection}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ data: payload }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        json?.error?.message ||
        json?.message ||
        `Strapi returned ${res.status}`;
      console.error(`[strapi-submit] POST /${collection} failed:`, msg);
      return { ok: false, error: msg };
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
