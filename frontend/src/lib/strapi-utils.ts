/**
 * Utility functions for working with Strapi CMS data.
 * Handles image URL transformation, rich text rendering, etc.
 */

import type { StrapiMedia } from "@/types/strapi";

/**
 * Get Strapi configuration (lazy initialization).
 * Reads environment variables when called, not at module load time.
 */
function getStrapiConfig() {
  return {
    apiUrl: process.env.CMS_API_URL || "http://localhost:1337/api",
  };
}

/**
 * Get full URL for a Strapi media/image
 * Strapi returns relative URLs like "/uploads/image.jpg"
 * We need to prepend the CMS base URL (without /api)
 * 
 * Handles both Strapi v4 (nested: media.data.attributes.url) 
 * and v5 (flat: media.url) structures
 * 
 * @param media - Strapi media object
 * @returns Full URL string or null if no image
 */
export function getStrapiImageUrl(media: StrapiMedia | undefined): string | null {
  if (!media) {
    return null;
  }

  const { apiUrl } = getStrapiConfig();
  const baseUrl = apiUrl.replace("/api", "");

  // Strapi v5: flat structure with url directly accessible
  if ('url' in media && typeof media.url === 'string') {
    const imageUrl = media.url;
    
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    
    return `${baseUrl}${imageUrl}`;
  }

  // Strapi v4: nested structure with data.attributes.url
  if (media?.data?.attributes?.url) {
    const imageUrl = media.data.attributes.url;

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${baseUrl}${imageUrl}`;
  }

  return null;
}

/**
 * Get full URL for a Strapi file (PDF, etc.)
 * Handles both Strapi v4 (nested: file.data.attributes.url)
 * and v5 (flat: file.url) structures
 * @param file - Strapi file object (similar structure to media)
 * @returns Full URL string or null if no file
 */
export function getStrapiFileUrl(
  file: unknown
): string | null {
  if (!file || typeof file !== "object") {
    return null;
  }

  const { apiUrl } = getStrapiConfig();
  const baseUrl = apiUrl.replace("/api", "");

  const f = file as {
    url?: unknown;
    data?: { attributes?: { url?: unknown } };
  };

  // Strapi v5: flat structure with url directly accessible
  if (typeof f.url === "string") {
    const fileUrl = f.url;

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    return `${baseUrl}${fileUrl}`;
  }

  // Strapi v4: nested structure with data.attributes.url
  if (typeof f.data?.attributes?.url === "string") {
    const fileUrl = f.data.attributes.url;

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    return `${baseUrl}${fileUrl}`;
  }

  return null;
}

/**
 * Format date and time for display
 * @param date - ISO date string
 * @param time - Time string (HH:mm:ss)
 * @returns Formatted date/time string
 */
export function formatEventDateTime(date: string, time: string): string {
  try {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return `${date} at ${time}`;
  }
}

/**
 * Format date for display
 * @param date - ISO date string
 * @returns Formatted date string
 */
export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

/**
 * Format time for display
 * @param time - Time string (HH:mm:ss)
 * @returns Formatted time string (HH:mm AM/PM)
 */
export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
}

/**
 * Check if an event is in the future
 * Handles various date/time formats and provides better error handling
 * @param date - Date string (supports YYYY-MM-DD, YYYY/MM/DD, or ISO format)
 * @param time - Time string (supports HH:mm:ss, HH:mm, or other common formats)
 * @returns True if event is in the future, false otherwise
 */
export function isFutureEvent(date: string, time: string): boolean {
  try {
    // Normalize date format (convert YYYY/MM/DD to YYYY-MM-DD)
    const normalizedDate = date.replace(/\//g, "-");
    
    // Ensure time format is valid (pad with seconds if needed)
    let normalizedTime = time;
    const timeParts = time.split(":");
    if (timeParts.length === 2) {
      // HH:mm -> HH:mm:00
      normalizedTime = `${time}:00`;
    }
    
    // Create date object
    const eventDate = new Date(`${normalizedDate}T${normalizedTime}`);
    
    // Validate it's a valid date
    if (isNaN(eventDate.getTime())) {
      console.warn(`[isFutureEvent] Invalid date/time: "${date}T${time}"`, {
        normalizedDate,
        normalizedTime,
      });
      return false;
    }
    
    const now = new Date();
    return eventDate > now;
  } catch (error) {
    console.warn(`[isFutureEvent] Error parsing date/time: "${date}" "${time}"`, error);
    return false;
  }
}

/**
 * Render Strapi rich text to HTML string
 * This is a simple implementation that converts rich text JSON to HTML
 * For more complex rendering, consider using @strapi/richtext-react-renderer
 * @param richText - Rich text JSON from Strapi
 * @returns HTML string
 */
export function renderRichText(richText: string | undefined): string {
  if (!richText) {
    return "";
  }

  try {
    // If it's already HTML, return as-is
    if (typeof richText === "string" && richText.startsWith("<")) {
      return richText;
    }

    // If it's JSON, parse and convert to HTML
    const parsed = typeof richText === "string" ? JSON.parse(richText) : richText;

    if (Array.isArray(parsed)) {
      return parsed
        .map((node) => {
          if (node.type === "paragraph") {
            return `<p>${renderRichTextNode(node)}</p>`;
          }
          if (node.type === "heading") {
            const level = node.level || 2;
            return `<h${level}>${renderRichTextNode(node)}</h${level}>`;
          }
          if (node.type === "list") {
            const tag = node.format === "ordered" ? "ol" : "ul";
            const items = node.children
              .map((child: unknown) => `<li>${renderRichTextNode(child)}</li>`)
              .join("");
            return `<${tag}>${items}</${tag}>`;
          }
          return renderRichTextNode(node);
        })
        .join("");
    }

    return String(richText);
  } catch {
    // If parsing fails, return as plain text
    return String(richText);
  }
}

/**
 * Render a single rich text node
 * @param node - Rich text node
 * @returns HTML string for the node
 */
function renderRichTextNode(node: unknown): string {
  if (typeof node !== "object" || node === null) {
    return String(node);
  }

  const n = node as { type?: string; text?: string; children?: unknown[] };

  if (n.text) {
    let text = n.text;
    // Handle formatting (bold, italic, etc.)
    if (n.type === "text") {
      const format = (n as { bold?: boolean; italic?: boolean }).bold
        ? "strong"
        : (n as { italic?: boolean }).italic
          ? "em"
          : null;
      if (format) {
        text = `<${format}>${text}</${format}>`;
      }
    }
    return text;
  }

  if (Array.isArray(n.children)) {
    return n.children.map(renderRichTextNode).join("");
  }

  return "";
}

/**
 * Validate Strapi event data for required fields and proper formats.
 * Helps identify why events might not be displaying.
 * 
 * @param event - Strapi event object to validate
 * @returns Object with validation result and detailed error messages
 */
export function validateEventData(event: unknown): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  const e = event as { attributes?: Record<string, unknown> } | null | undefined;
  if (!e?.attributes) {
    errors.push("Event missing attributes object");
    return { valid: false, errors, warnings };
  }

  const { attributes } = e;
  const title = typeof attributes.title === "string" ? attributes.title : null;
  const date = typeof attributes.date === "string" ? attributes.date : null;
  const startTime = typeof attributes.startTime === "string" ? attributes.startTime : null;
  const publishedAt = typeof attributes.publishedAt === "string" ? attributes.publishedAt : null;
  const category = typeof attributes.category === "string" ? attributes.category : null;

  // Check required fields
  if (!title) {
    errors.push("Missing required field: title");
  }

  if (!date) {
    errors.push("Missing required field: date");
  } else {
    // Validate date format (should be YYYY-MM-DD or ISO)
    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    if (!dateRegex.test(date)) {
      errors.push(`Invalid date format: "${date}" (expected YYYY-MM-DD or ISO format)`);
    }
  }

  if (!startTime) {
    errors.push("Missing required field: startTime");
  } else {
    // Validate time format (should be HH:mm:ss or HH:mm)
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!timeRegex.test(startTime)) {
      errors.push(`Invalid time format: "${startTime}" (expected HH:mm or HH:mm:ss)`);
    }
  }

  // Check publishedAt status
  if (!publishedAt) {
    errors.push("Event not published: publishedAt is null or missing");
  }

  // Check category for Education page filtering
  if (!category) {
    warnings.push("Missing category field (won't appear on filtered event pages)");
  } else if (!["Religious", "Cultural", "Educational", "Festival"].includes(category)) {
    warnings.push(`Unknown category: "${category}" (expected: Religious, Cultural, Educational, or Festival)`);
  }

  // Check if event time is in the future
  if (date && startTime) {
    try {
      const eventDate = new Date(`${date}T${startTime.padEnd(8, ":00")}`);
      const now = new Date();
      if (eventDate <= now) {
        warnings.push(`Event date/time is in the past: ${date} ${startTime} (won't display on upcoming events pages)`);
      }
    } catch {
      warnings.push("Could not parse event date/time to check if it's in the future");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
