/**
 * TypeScript type definitions for Strapi CMS content types.
 * Strapi v5 returns data in { data: { id, attributes } } format.
 */

/**
 * Generic Strapi API response wrapper
 */
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Strapi collection response (array of items)
 */
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Strapi media/image type
 * Supports both Strapi v4 (nested structure) and v5 (flat structure)
 */
export interface StrapiMedia {
  // Strapi v5 flat structure
  id?: number;
  url?: string;
  name?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, unknown>;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  previewUrl?: string;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Strapi v4 nested structure (for backward compatibility)
  data?: {
    id: number;
    attributes: {
      name: string;
      alternativeText?: string;
      caption?: string;
      width?: number;
      height?: number;
      formats?: Record<string, unknown>;
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl?: string;
      provider: string;
      createdAt: string;
      updatedAt: string;
    };
  } | null;
}

/**
 * Event content type from Strapi
 */
export interface StrapiEvent {
  id: number;
  attributes: {
    title: string;
    slug: string;
    date: string; // ISO date string
    startTime: string; // Time string (HH:mm:ss)
    endTime?: string; // Time string (HH:mm:ss)
    category: "Religious" | "Cultural" | "Educational" | "Festival";
    description?: string; // Rich text (JSON)
    location?: string;
    registrationLink?: string;
    image?: StrapiMedia;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Puja Service content type from Strapi
 */
export interface StrapiPujaService {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description?: string; // Rich text (JSON)
    price: number; // Decimal
    location: "In Temple" | "Off-site";
    notes?: string;
    image?: StrapiMedia;
    relatedPriests?: {
      data: StrapiPriest[];
    };
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Priest content type from Strapi
 */
export interface StrapiPriest {
  id: number;
  attributes: {
    name: string;
    title?: string;
    bio?: string; // Rich text (JSON)
    profileImage?: StrapiMedia;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Announcement content type from Strapi
 */
export interface StrapiAnnouncement {
  id: number;
  attributes: {
    title: string;
    content: string; // Rich text (JSON)
    displayUntil?: string; // ISO date string
    level?: "Info" | "High-Priority";
    image?: StrapiMedia;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Newsletter content type from Strapi
 */
export interface StrapiNewsletter {
  id: number;
  attributes: {
    title: string;
    publicationDate: string; // ISO date string
    file: {
      data: {
        id: number;
        attributes: {
          name: string;
          alternativeText?: string;
          caption?: string;
          hash: string;
          ext: string;
          mime: string;
          size: number;
          url: string;
          previewUrl?: string;
          provider: string;
          createdAt: string;
          updatedAt: string;
        };
      } | null;
    };
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * BoardMember content type from Strapi
 */
export interface StrapiBoardMember {
  id: number;
  attributes: {
    name: string;
    role: string;
    tier: "President" | "Executive" | "Director";
    bio?: string;
    photo?: StrapiMedia;
    displayOrder?: number;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Page content type from Strapi
 */
export interface StrapiPage {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content?: string; // Rich text (JSON)
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
