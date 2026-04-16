/**
 * SEO utility functions for generating metadata and structured data (Schema.org JSON-LD)
 * @module lib/seo
 */

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://vishnumandirtampa.com";

/**
 * Temple organization information for structured data
 */
export const TEMPLE_ORG = {
  "@type": "Organization",
  name: "Vishnu Mandir, Tampa",
  url: BASE_URL,
  logo: `${BASE_URL}/images/vishnumandir-logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "5803 Lynn Road",
    addressLocality: "Tampa",
    addressRegion: "FL",
    postalCode: "33624",
    addressCountry: "US",
  },
  telephone: "+1-813-269-7262",
  email: "info@vishnumandirtampa.com",
  description:
    "Vishnu Mandir, Tampa is a Hindu temple serving the Tampa Bay area, offering puja services, festivals, and spiritual guidance to the Hindu community.",
  foundingDate: "2003",
  sameAs: [], // Add social media URLs when available
};

/**
 * Generate Organization schema for structured data
 * @returns {object} Organization JSON-LD schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    ...TEMPLE_ORG,
  };
}

/**
 * Generate WebPage schema for structured data
 * @param {object} params - WebPage parameters
 * @param {string} params.name - Page name/title
 * @param {string} params.description - Page description
 * @param {string} params.url - Full URL of the page
 * @param {string} [params.datePublished] - Publication date (ISO format)
 * @param {string} [params.dateModified] - Last modified date (ISO format)
 * @returns {object} WebPage JSON-LD schema
 */
export function generateWebPageSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
}: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: url.startsWith("http") ? url : `${BASE_URL}${url}`,
    publisher: TEMPLE_ORG,
  };

  if (datePublished) {
    schema.datePublished = datePublished;
  }
  if (dateModified) {
    schema.dateModified = dateModified;
  }

  return schema;
}

/**
 * Generate Event schema for structured data
 * @param {object} params - Event parameters
 * @param {string} params.name - Event name
 * @param {string} params.description - Event description
 * @param {string} params.startDate - Event start date (ISO format)
 * @param {string} [params.endDate] - Event end date (ISO format)
 * @param {string} [params.location] - Event location (defaults to temple address)
 * @returns {object} Event JSON-LD schema
 */
export function generateEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    endDate: endDate || startDate,
    location: location
      ? {
          "@type": "Place",
          name: location,
          address: TEMPLE_ORG.address,
        }
      : {
          "@type": "Place",
          name: "Vishnu Mandir, Tampa",
          address: TEMPLE_ORG.address,
        },
    organizer: TEMPLE_ORG,
  };
}

/**
 * Generate Service schema for structured data
 * @param {object} params - Service parameters
 * @param {string} params.serviceType - Type of service (e.g., "Puja Service")
 * @param {string} params.name - Service name
 * @param {string} params.description - Service description
 * @param {string} [params.areaServed] - Area served (defaults to "Tampa Bay Area")
 * @returns {object} Service JSON-LD schema
 */
export function generateServiceSchema({
  serviceType,
  name,
  description,
  areaServed = "Tampa Bay Area",
}: {
  serviceType: string;
  name: string;
  description: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    name,
    description,
    provider: TEMPLE_ORG,
    areaServed: {
      "@type": "City",
      name: areaServed,
    },
  };
}

/**
 * Generate Place schema for location pages
 * @returns {object} Place JSON-LD schema
 */
export function generatePlaceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "PlaceOfWorship",
    name: "Vishnu Mandir, Tampa",
    address: TEMPLE_ORG.address,
    telephone: TEMPLE_ORG.telephone,
    email: TEMPLE_ORG.email,
    url: TEMPLE_ORG.url,
    description: TEMPLE_ORG.description,
  };
}

type WebPageSchemaParams = Parameters<typeof generateWebPageSchema>[0];
type EventSchemaParams = Parameters<typeof generateEventSchema>[0];
type ServiceSchemaParams = Parameters<typeof generateServiceSchema>[0];

type StructuredDataParams =
  | { type: "Organization" }
  | { type: "Place" }
  | ({ type: "WebPage" } & WebPageSchemaParams)
  | ({ type: "Event" } & EventSchemaParams)
  | ({ type: "Service" } & ServiceSchemaParams);

/**
 * Helper to generate structured data based on type
 * @param {object} params - Parameters for structured data
 * @param {"Organization" | "WebPage" | "Event" | "Service" | "Place"} params.type - Schema type
 * @param {object} params.data - Additional data for the schema
 * @returns {object} JSON-LD structured data
 */
export function generateStructuredData(params: StructuredDataParams) {
  const { type, ...data } = params as Record<string, unknown> & { type: StructuredDataParams["type"] };
  switch (type) {
    case "Organization":
      return generateOrganizationSchema();
    case "WebPage":
      return generateWebPageSchema(data as WebPageSchemaParams);
    case "Event":
      return generateEventSchema(data as EventSchemaParams);
    case "Service":
      return generateServiceSchema(data as ServiceSchemaParams);
    case "Place":
      return generatePlaceSchema();
    default:
      return generateWebPageSchema(data as WebPageSchemaParams);
  }
}
