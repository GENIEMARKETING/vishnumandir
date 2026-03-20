/**
 * Strapi CMS API client utility.
 * Provides type-safe functions to fetch content from Strapi CMS.
 */

import type {
  StrapiCollectionResponse,
  StrapiResponse,
  StrapiEvent,
  StrapiPujaService,
  StrapiPriest,
  StrapiAnnouncement,
  StrapiNewsletter,
  StrapiPage,
  StrapiBoardMember,
} from "@/types/strapi";

/**
 * Get Strapi configuration (lazy initialization).
 * Reads environment variables when called, not at module load time.
 * This ensures env vars are available even if this module is imported early.
 */
function getStrapiConfig() {
  return {
    apiUrl: process.env.CMS_API_URL || "http://localhost:1337/api",
    apiToken: process.env.CMS_API_TOKEN || "",
  };
}

/**
 * Normalize Strapi v5 flat response to v4-like structure with attributes.
 * Strapi v5 returns: { id: 1, title: "Hello", ... }
 * Frontend expects: { id: 1, attributes: { title: "Hello", ... } }
 * 
 * CRITICAL: This function must preserve ALL fields correctly:
 * - id must stay at the top level
 * - attributes must contain all content fields and metadata
 * - Must handle both v4 (nested) and v5 (flat) structures
 * 
 * @param item - Single item from Strapi v5 API
 * @returns Normalized item with attributes wrapper
 */
function normalizeToV4<T extends { id: number; attributes: Record<string, unknown> }>(
  item: Record<string, unknown>
): T {
  // If already has attributes structure (v4 format), return as-is
  if (item.attributes && typeof item.attributes === "object" && !Array.isArray(item.attributes)) {
    return item as T;
  }

  // Convert v5 flat structure to v4-like structure
  // CRITICAL: Preserve id at top level, move everything else to attributes
  const { id, documentId, ...rest } = item;
  
  // Ensure id exists and is a number
  if (typeof id !== 'number' && typeof id !== 'string') {
    console.error('[normalizeToV4] Invalid id:', id, item);
    throw new Error('Item missing valid id field');
  }
  
  return {
    id: typeof id === 'number' ? id : parseInt(String(id), 10),
    attributes: rest as Record<string, unknown>,
  } as T;
}

/**
 * Normalize an array of Strapi v5 items to v4-like structure
 * @param items - Array of items from Strapi v5 API
 * @returns Normalized array with attributes wrappers
 */
function normalizeArrayToV4<T extends { id: number; attributes: Record<string, unknown> }>(
  items: Record<string, unknown>[]
): T[] {
  return items.map((item) => normalizeToV4<T>(item));
}

/**
 * Generic function to fetch content from Strapi API
 * @param endpoint - API endpoint (e.g., "events", "puja-services")
 * @param filters - Query parameters for filtering, sorting, etc.
 * @returns Promise with typed response
 */
async function fetchStrapiContent<T>(
  endpoint: string,
  filters?: Record<string, string | number | boolean | undefined>
): Promise<T | null> {
  try {
    const { apiUrl, apiToken } = getStrapiConfig();
    const url = new URL(`${apiUrl}/${endpoint}`);
    
    // Add query parameters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Add populate parameter to include related data and media
    url.searchParams.append("populate", "*");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (apiToken) {
      headers["Authorization"] = `Bearer ${apiToken}`;
    }

    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: 300 }, // Default ISR revalidation
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[strapi] Failed to fetch ${endpoint}:`,
        response.status,
        response.statusText,
        errorText.substring(0, 200)
      );
      return null;
    }

    const data = await response.json();
    
    // Debug logging for API responses
    if (process.env.NODE_ENV === "development") {
      console.log(`[strapi] Fetched ${endpoint}:`, {
        hasData: !!data?.data,
        dataCount: Array.isArray(data?.data) ? data.data.length : data?.data ? 1 : 0,
        hasError: !!data?.error,
        error: data?.error,
      });
    }
    
    return data as T;
  } catch (error) {
    console.error(`[strapi] Error fetching ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch events from Strapi
 * @param filters - Optional filters (category, publishedAt, etc.)
 * @returns Promise with array of events
 * 
 * Note: Category filtering is done client-side due to Strapi v5 API compatibility issues
 * with the $eq operator on enum fields. The API is called without category filter,
 * and results are filtered in JavaScript before returning.
 */
export async function fetchEvents(filters?: {
  category?: "Religious" | "Cultural" | "Educational" | "Festival";
  publishedAt?: boolean;
  sort?: string;
}): Promise<StrapiEvent[]> {
  const queryParams: Record<string, string> = {};

  // Category filter removed from API call - moved to client-side filtering below
  // (Strapi v5 API does not correctly handle filters[category][$eq])

  // Note: publishedAt filter removed due to Strapi v5 compatibility issue
  // The API only returns published items by default anyway
  // if (filters?.publishedAt !== false) {
  //   queryParams["filters[publishedAt][$notNull]"] = "true";
  // }

  if (filters?.sort) {
    queryParams["sort"] = filters.sort;
  } else {
    queryParams["sort"] = "date:asc";
  }

  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("events", queryParams);

  if (!response || !response.data) {
    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("[strapi] fetchEvents result:", {
        hasResponse: !!response,
        hasData: !!response?.data,
        filters,
      });
    }
    return [];
  }

  // Normalize Strapi v5 flat response to v4-like structure
  const normalizedEvents = normalizeArrayToV4<StrapiEvent>(response.data);

  // Client-side publishedAt filtering to ensure only published events are shown
  // This is a backup check in case Strapi API returns unpublished items
  let filteredEvents = normalizedEvents.filter((event) => {
    const isPublished = event?.attributes?.publishedAt !== null && event?.attributes?.publishedAt !== undefined;
    if (!isPublished && process.env.NODE_ENV === "development") {
      console.warn("[strapi] Filtered out unpublished event client-side:", {
        id: event.id,
        title: event?.attributes?.title,
        publishedAt: event?.attributes?.publishedAt,
      });
    }
    return isPublished;
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[strapi] publishedAt filter applied client-side:", {
      apiReturnedTotal: response.data.length,
      afterPublishedAtFilter: filteredEvents.length,
    });
  }

  // Client-side category filtering (Strapi v5 API workaround)
  if (filters?.category) {
    filteredEvents = filteredEvents.filter(
      (event) => event?.attributes?.category === filters.category
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[strapi] Category filter applied client-side:", {
        requestedCategory: filters.category,
        beforeCategoryFilter: normalizedEvents.filter((e) => e?.attributes?.publishedAt !== null && e?.attributes?.publishedAt !== undefined).length,
        afterCategoryFilter: filteredEvents.length,
      });
    }
  }

  // Debug logging for filtered results
  if (process.env.NODE_ENV === "development") {
    console.log("[strapi] fetchEvents filtered:", {
      totalEvents: filteredEvents.length,
      category: filters?.category,
      events: filteredEvents.map((e) => ({
        title: e.attributes.title,
        category: e.attributes.category,
        date: e.attributes.date,
        published: !!e.attributes.publishedAt,
      })),
    });
  }

  return filteredEvents;
}

/**
 * Fetch a single event by slug
 * @param slug - Event slug
 * @returns Promise with event or null
 */
export async function fetchEventBySlug(
  slug: string
): Promise<StrapiEvent | null> {
  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("events", {
    "filters[slug][$eq]": slug,
    // publishedAt filter removed due to Strapi v5 compatibility
  });

  if (!response || !response.data || response.data.length === 0) {
    return null;
  }

  // Normalize Strapi v5 flat response to v4-like structure
  return normalizeToV4<StrapiEvent>(response.data[0]);
}

/**
 * Fetch puja services from Strapi
 * @returns Promise with array of puja services
 */
export async function fetchPujaServices(): Promise<StrapiPujaService[]> {
  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("puja-services", {
    sort: "name:asc",
    // Filters removed due to Strapi v5 compatibility
  });

  if (!response || !response.data) {
    return [];
  }

  // Normalize Strapi v5 flat response to v4-like structure
  return normalizeArrayToV4<StrapiPujaService>(response.data);
}

/**
 * Fetch a single puja service by slug
 * @param slug - Puja service slug
 * @returns Promise with puja service or null
 */
export async function fetchPujaServiceBySlug(
  slug: string
): Promise<StrapiPujaService | null> {
  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("puja-services", {
    "filters[slug][$eq]": slug,
    // publishedAt filter removed due to Strapi v5 compatibility
  });

  if (!response || !response.data || response.data.length === 0) {
    return null;
  }

  // Normalize Strapi v5 flat response to v4-like structure
  return normalizeToV4<StrapiPujaService>(response.data[0]);
}

/**
 * Fetch priests from Strapi
 * @returns Promise with array of priests
 */
export async function fetchPriests(): Promise<StrapiPriest[]> {
  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("priests", {
    sort: "name:asc",
    // Filters removed due to Strapi v5 compatibility
  });

  if (!response || !response.data) {
    return [];
  }

  // Normalize Strapi v5 flat response to v4-like structure
  return normalizeArrayToV4<StrapiPriest>(response.data);
}

/**
 * Fetch announcements from Strapi
 * @param filters - Optional filters (displayUntil, level, includeExpired)
 * @returns Promise with array of announcements
 * 
 * Note: displayUntil filtering is done client-side due to Strapi v5 API limitations.
 * When includeExpired is false (default): Only announcements that haven't expired are returned.
 * When includeExpired is true: All announcements are returned (for announcements archive page).
 */
export async function fetchAnnouncements(filters?: {
  displayUntil?: Date;
  level?: "Info" | "High-Priority";
  includeExpired?: boolean;
}): Promise<StrapiAnnouncement[]> {
  const queryParams: Record<string, string> = {
    // Ensure only published announcements are returned
    "filters[publishedAt][$notNull]": "true",
    sort: "publishedAt:desc",
  };

  // Note: level filter removed from API call - using client-side filtering instead
  // (Strapi v5 API does not correctly handle filters[level][$eq])
  // if (filters?.level) {
  //   queryParams["filters[level][$eq]"] = filters.level;
  // }

  // Note: displayUntil filter logic moved to frontend filtering
  // if (filters?.displayUntil) {
  //   Only show announcements that haven't expired
  //   queryParams["filters[$or][0][displayUntil][$gte]"] =
  //     filters.displayUntil.toISOString();
  //   queryParams["filters[$or][1][displayUntil][$null]"] = "true";
  // }

  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("announcements", queryParams);

  if (!response || !response.data) {
    if (process.env.NODE_ENV === "development") {
      console.log("[strapi] fetchAnnouncements - No API response or empty data");
    }
    return [];
  }

  // Debug: Log raw API response count
  if (process.env.NODE_ENV === "development") {
    console.log("[strapi] fetchAnnouncements - Raw API response:", {
      count: Array.isArray(response.data) ? response.data.length : 1,
      sampleItem: Array.isArray(response.data) ? response.data[0] : response.data,
    });
  }

  // Normalize Strapi v5 flat response to v4-like structure
  let normalizedAnnouncements: StrapiAnnouncement[] = [];
  try {
    normalizedAnnouncements = normalizeArrayToV4<StrapiAnnouncement>(response.data);
    if (process.env.NODE_ENV === "development") {
      console.log("[strapi] fetchAnnouncements - After normalization:", {
        count: normalizedAnnouncements.length,
        sampleItem: normalizedAnnouncements[0],
      });
    }
  } catch (error) {
    console.error("[strapi] fetchAnnouncements - Normalization failed:", error);
    return [];
  }

  // Client-side filtering for announcements
  let filteredAnnouncements = normalizedAnnouncements;

  // Filter by publishedAt to ensure only published items (client-side backup)
  filteredAnnouncements = filteredAnnouncements.filter((announcement) => {
    return announcement?.attributes?.publishedAt !== null;
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[strapi] publishedAt filter applied client-side:", {
      beforeFilter: normalizedAnnouncements.length,
      afterFilter: filteredAnnouncements.length,
    });
  }

  // Filter by level if specified
  if (filters?.level) {
    filteredAnnouncements = filteredAnnouncements.filter(
      (announcement) => announcement?.attributes?.level === filters.level
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[strapi] Level filter applied client-side:", {
        requestedLevel: filters.level,
        beforeFilter: normalizedAnnouncements.length,
        afterFilter: filteredAnnouncements.length,
      });
    }
  }

  // Filter by displayUntil date (only show non-expired announcements)
  // Skip this filter if includeExpired is true (for announcements archive page)
  if (filters?.displayUntil && !filters?.includeExpired) {
    const now = filters.displayUntil;
    const beforeDisplayUntilFilter = filteredAnnouncements.length;
    
    filteredAnnouncements = filteredAnnouncements.filter((announcement) => {
      const displayUntil = announcement?.attributes?.displayUntil;
      // Show if no displayUntil set, or if displayUntil is in the future
      if (!displayUntil) {
        return true;
      }
      try {
        const expiryDate = new Date(displayUntil);
        const isValid = expiryDate > now;
        if (process.env.NODE_ENV === "development" && !isValid) {
          console.log("[strapi] Filtered out announcement - displayUntil in past:", {
            title: announcement?.attributes?.title,
            displayUntil,
            now,
          });
        }
        return isValid;
      } catch (error) {
        console.error("[strapi] Failed to parse displayUntil date:", displayUntil, error);
        return true; // If date parsing fails, include the announcement
      }
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[strapi] displayUntil filter applied client-side:", {
        filterDate: filters.displayUntil.toISOString(),
        beforeFilter: beforeDisplayUntilFilter,
        afterFilter: filteredAnnouncements.length,
      });
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[strapi] fetchAnnouncements - Final result:", {
      totalAnnouncements: filteredAnnouncements.length,
      level: filters?.level,
      displayUntilFilter: !!filters?.displayUntil && !filters?.includeExpired,
      includeExpired: !!filters?.includeExpired,
      announcements: filteredAnnouncements.map((a) => ({
        id: a.id,
        title: a.attributes?.title,
        publishedAt: a.attributes?.publishedAt,
        displayUntil: a.attributes?.displayUntil,
      })),
    });
  }

  return filteredAnnouncements;
}

/**
 * Fetch newsletters from Strapi
 * @returns Promise with array of newsletters
 */
export async function fetchNewsletters(): Promise<StrapiNewsletter[]> {
  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("newsletters", {
    sort: "publicationDate:desc",
    // Filters removed due to Strapi v5 compatibility
  });

  if (!response || !response.data) {
    return [];
  }

  // Normalize Strapi v5 flat response to v4-like structure
  return normalizeArrayToV4<StrapiNewsletter>(response.data);
}

/**
 * Fetch a page by slug from Strapi
 * @param slug - Page slug
 * @returns Promise with page or null
 */
export async function fetchPageBySlug(
  slug: string
): Promise<StrapiPage | null> {
  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("pages", {
    "filters[slug][$eq]": slug,
    // publishedAt filter removed due to Strapi v5 compatibility
  });

  if (!response || !response.data || response.data.length === 0) {
    return null;
  }

  // Normalize Strapi v5 flat response to v4-like structure
  return normalizeToV4<StrapiPage>(response.data[0]);
}

/**
 * Fetch board members from Strapi, sorted by tier then displayOrder.
 * Tier priority: President → Executive → Director
 * @returns Promise with array of StrapiBoardMember
 */
export async function fetchBoardMembers(): Promise<StrapiBoardMember[]> {
  const response = await fetchStrapiContent<
    StrapiCollectionResponse<Record<string, unknown>>
  >("board-members", {
    sort: "displayOrder:asc",
  });

  if (!response || !response.data) {
    return [];
  }

  return normalizeArrayToV4<StrapiBoardMember>(response.data);
}
