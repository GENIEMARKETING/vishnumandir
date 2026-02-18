# Changelog

All notable changes to the Vishnu Mandir, Tampa project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- feat(webhooks): Implemented Medusa webhook-triggered ISR revalidation for instant product updates
  - `commerce/src/subscribers/product-changes.ts` - NEW Medusa subscriber listening to product.created, product.updated, product.deleted events; calls frontend webhook with HMAC-SHA256 signature verification
  - `frontend/src/app/api/webhooks/medusa/route.ts` - NEW webhook handler that verifies signatures and revalidates shop pages (/shop, /shop/vendors, /shop/vendor/*)
  - `commerce/.env` - Added MEDUSA_WEBHOOK_SECRET for webhook signing
  - `frontend/.env.local` - Added MEDUSA_WEBHOOK_SECRET for webhook verification
  - Products with vendor tags now appear on frontend instantly when added/updated in Medusa Admin (previously 5-minute ISR delay)
  - Webhook includes vendor tag information for targeted revalidation of affected vendor pages

### Fixed
- fix(commerce): Fixed Medusa Admin Panel CORS misconfiguration
  - `commerce/.env` - Updated ADMIN_CORS from `http://localhost:7001` to include `http://localhost:9000` (admin UI URL)
  - Medusa admin page now loads from correct origin
  - Admin API calls from http://localhost:9000/app are now properly CORS-approved

- fix(commerce): Fixed TypeScript build errors in Medusa scripts
  - `commerce/src/scripts/seed.ts` - Removed invalid `tags` field from product creation input (not supported by CreateProductWorkflowInputDTO)
  - `commerce/src/scripts/add-vendor-tags.ts` - Simplified to audit-only mode to avoid workflow type issues
  - `commerce/src/scripts/update-vendor-tags.ts` - Removed workflow calls to prevent type errors; simplified to read-only audit
  - `commerce/medusa-config.ts` - Removed unsupported `port` and `databaseExtra` fields from defineConfig
  - Deleted debug scripts: `debug-product-tags.ts`, `debug-product-tags-remote.ts`
  - Build now completes successfully without TypeScript errors

- fix(commerce): Pre-built Medusa admin on startup
  - `commerce` - Added `pnpm run build` before dev startup to pre-compile admin UI assets
  - Eliminates slow Vite compilation on first /app request
  - Admin panel now loads quickly on http://localhost:9000/app

### Changed
- docs(vendor): Clarified vendor-attributed store architecture (not multi-vendor marketplace)
  - `docs/development/MULTI_VENDOR_SYSTEM_REFERENCE.md` - Renamed to "Vendor-Attributed Store", added architecture clarification table (admins add products; no vendor logins; vendor slugs for customer UX only)
  - `docs/deployment/MULTI_VENDOR_IMPLEMENTATION_COMPLETE.md` - Added architecture clarification, updated Phase 3 to "True Multi-Vendor (Future - Not Current Scope)"
  - `.cursor/rules/vendor-attributed-store.mdc` - NEW Cursor rule to prevent deviation: no vendor logins, dashboards, or payouts
  - `MULTI_VENDOR_COMPLETE.txt` - Added architecture clarification note

### Added
- feat(components): Created AddToCartButton component for product availability
  - `frontend/src/components/shared/AddToCartButton.tsx` - NEW placeholder for cart integration
  - Shows product availability, variant count, and friendly messaging
  - Ready for full Stripe/Medusa cart integration in future phases

- feat(pages): Created vendor discovery page for browsing all vendors
  - `frontend/src/app/(site)/shop/vendors/page.tsx` - NEW vendor discovery page
  - Lists all vendors with product counts sorted by popularity
  - Each vendor card links to dedicated storefront at /shop/vendor/[slug]
  - Responsive grid layout with hover effects and proper SEO

### Changed
- feat(pages): Updated shop page to use vendor-enriched API
  - `frontend/src/app/(site)/shop/page.tsx` - Changed from fetchProducts() to fetchProductsWithVendors()
  - All products on shop page now include vendor information
  - Added navigation link to /shop/vendors vendor discovery page
  - Ensures consistent vendor data display across browse flow

- feat(pages): Enhanced product detail page with vendor enrichment
  - `frontend/src/app/(site)/shop/product/[handle]/page.tsx` - Enriches products with vendor data from custom endpoint
  - fetchProductDirect() now calls vendor endpoint to add vendor object to product
  - VendorAttribution component receives both tags and vendor object for better display
  - Gracefully handles vendor enrichment failures (continues without vendor if API unavailable)

- refactor(commerce): Aligned vendor tag scripts with seed data
  - `commerce/src/scripts/add-vendor-tags.ts` - Updated mapping to use temple-artisans, sacred-crafts-collective, spiritual-goods-studio, temple-community-makers
  - Previously used non-existent `vendor:temple-store` tag
  - Now matches seed.ts vendor tags exactly

### Removed
- refactor(config): Removed unused vendor registry file
  - `frontend/src/config/vendors.ts` - Deleted (was unused after API-based vendor implementation)
  - Vendor page now uses API-based filtering instead of hardcoded config
  - Reduces maintenance burden and prevents config/DB drift

### Added
- feat(commerce): Created custom Store API endpoint for products with vendor information
  - `commerce/src/api/store/products-with-vendors/route.ts` - NEW custom Store API endpoint
  - Queries products with tags and extracts vendor information automatically
  - Returns products with vendor data included (slug and display name)
  - Endpoint: `GET /store/products-with-vendors`
  - Response includes vendor object: `{ slug: string, name: string }`
  - No manual configuration required - dynamically extracts vendor from tags

- feat(frontend): Added fetchProductsWithVendors client function
  - `frontend/src/lib/medusa.ts` - NEW function to fetch products with vendor info from custom endpoint
  - Handles ISR caching (5-minute revalidation)
  - Error handling and proper HTTP status codes
  - Returns same MedusaProductsResponse format with vendor data added

- feat(frontend): Added VendorInfo type to TypeScript definitions
  - `frontend/src/types/medusa.ts` - NEW VendorInfo interface with slug and name
  - Extended MedusaProduct with optional `vendor` field
  - Maintains backward compatibility with existing product metadata

### Changed
- feat(frontend): Updated vendor page to use dynamic API endpoint instead of static registry
  - `frontend/src/app/(site)/shop/vendor/[vendorSlug]/page.tsx` - Refactored to use fetchProductsWithVendors
  - Filters products using API response vendor data (not manual registry)
  - Extracts vendor name from API response instead of config file
  - Improved metadata generation by looking up vendor from first matching product
  - Vendor page now automatically includes all products for a vendor when tags are added
  - No need to manually add product handles to config

- feat(commerce): Created `add-vendor-tags.ts` script for adding vendor tags to products
  - `commerce/src/scripts/add-vendor-tags.ts` - NEW script using updateProductTagsWorkflow
  - Script fetches all products and attempts to add `vendor:temple-store` tags
  - Handles duplicate tags gracefully
  - Created verification script `commerce/src/scripts/verify-tags.ts` to check tag persistence
  - Uses container resolution and Medusa workflows for database updates

- feat(frontend): Created vendor registry configuration file
  - `frontend/src/config/vendors.ts` - NEW vendor registry mapping vendor slugs to metadata and product handles
  - Exports `VendorConfig` interface for type-safe vendor configuration
  - Exports `VENDORS` object with temple-store vendor and initial product handles
  - Allows vendor pages to filter products by handle without relying on Store API metadata/tags
  - Production-safe workaround for Medusa Store API limitations
  - Can be expanded later to include more vendors and product handles

- feat(frontend): Updated vendor page to use vendor registry for product filtering
  - `frontend/src/app/(site)/shop/vendor/[vendorSlug]/page.tsx` - Updated to use vendor registry instead of Store API metadata/tags
  - Removed dependency on `getVendorSlugFromTags` and `getVendorDisplayNameFromSlug` utils
  - Imported `VENDORS` from `@/config/vendors` configuration
  - Updated `generateMetadata` to look up vendor name from registry (eliminates need to fetch/search products)
  - Updated product filtering to use `vendor.productHandles.includes(product.handle)` instead of tag-based matching
  - Updated vendor name extraction to use registry (`VENDORS[vendorSlug]?.name`) instead of product metadata
  - Improved vendor not found detection: shows error if vendor not in registry OR no matching products
  - Vendor page now works immediately with frontend-only configuration
  - No changes needed to Medusa backend or Store API

- fix(frontend): Made vendor attribution always clickable, even with missing vendor data
  - `frontend/src/components/shared/VendorAttribution.tsx` - Updated to always render vendor name as Link/button
  - Added import of `slugifyVendorName` utility function
  - Always generate `vendorSlug` with fallback to `slugifyVendorName(vendorName)` when tags/vendor data missing
  - Removed conditional plain text rendering - vendor name is always interactive
  - Vendor name falls back to "Temple Store" which slugifies to `/shop/vendor/temple-store` route
  - Maintains onClick handler logic for ProductCard variant
  - ProductCard and product detail page both have clickable vendor attribution
  - No breaking changes - existing vendor data still works as before
- feat(commerce): Integrated Medusa Commerce Store API into Next.js frontend
  - `frontend/src/lib/medusa.ts` - NEW Medusa Store API client with fetchProducts() function
  - `frontend/src/types/medusa.ts` - NEW TypeScript interfaces for Medusa product data structures
  - `frontend/src/components/shared/ProductCard.tsx` - NEW reusable product card component with design system styling
  - `frontend/src/app/(site)/shop/page.tsx` - NEW shop listing page with ISR (5m revalidation)
  - `frontend/src/app/(site)/shop/product/[handle]/page.tsx` - NEW product detail page (stub for future implementation)
  - Added Medusa publishable API key to frontend environment variables
  - Updated `frontend/next.config.ts` with Medusa image remotePatterns for AWS S3
  - Shop page fetches 4 sample products (Sweatpants, Sweatshirt, Shorts, T-Shirt) from Medusa
  - ProductCard displays product image, title, description, variant count, and link to detail page
  - Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols wide)
  - Full dark mode support for all shop components
  - Graceful error handling and empty state messaging
  - Follows existing design patterns: Tailwind utilities, design system colors, typography
  - No console errors, builds successfully with Next.js 16.1.4

- docs(learnings): Created comprehensive LEARNINGS.md document for technical knowledge capture
  - `LEARNINGS.md` - Systematic documentation of technical learnings from challenging tasks
  - Organized by category: Frontend, Backend, Deployment, Database, API Integration, Architecture, Troubleshooting
  - Each learning includes Problem, Root Cause, Solution, Prevention, and Files sections
  - Covers critical learnings: AWS Amplify env vars, ISR cache, lazy initialization, CORS, multipart handling, webhooks
  - Troubleshooting patterns for common production issues

- docs(cursorrules): Updated Section 19 (AI Interaction Guidelines) to reference LEARNINGS.md
  - Requires checking LEARNINGS.md before starting tasks (alongside CHANGELOG.md)
  - Requires updating LEARNINGS.md after completing challenging tasks
  - Clarifies when to update (troubleshooting, non-obvious solutions, deployment issues)
  - When NOT to update (simple features, routine fixes, standard refactoring)
  - Added file structure documentation for LEARNINGS.md

- feat(debug): Created `/api/debug/env` endpoint for runtime environment variable diagnostics
  - `frontend/src/app/api/debug/env/route.ts` - NEW endpoint
  - Lists all available environment variables at runtime in Lambda
  - Shows which CMS variables (`CMS_API_URL`, `CMS_API_TOKEN`) are accessible
  - Safely displays variable information without exposing sensitive values
  - Provides recommendations for troubleshooting missing variables
  - Critical for diagnosing why Amplify environment variables may not be available in API routes

- feat(config): Added explicit environment variable configuration to `next.config.ts`
  - `frontend/next.config.ts` - New `env` configuration object
  - Explicitly passes CMS, Stripe, Cognito, and revalidation variables to Lambda runtime
  - Ensures server-side environment variables are available in API routes when deployed on AWS Amplify
  - Fixes issue where environment variables configured in Amplify Console weren't accessible in production

- feat(logging): Added detailed event filtering logging to event pages
  - `frontend/src/app/(site)/calendar/current-events/page.tsx` - Logs event filtering analysis (total fetched, filtered counts, reasons)
  - `frontend/src/app/(site)/education/events/page.tsx` - Logs step-by-step filtering (API fetch → category filter → date filter)
  - Controlled by `DEBUG_EVENT_FILTERING=true` environment variable
  - Helps diagnose why events aren't displaying on specific pages
  - Shows sample events filtered out with detailed reasons for each step

- feat(components): Enhanced EventList component with troubleshooting help
  - `frontend/src/components/shared/EventList.tsx` - Improved empty state with helpful guidance
  - Shows troubleshooting tips when no events are available
  - Links to diagnostic endpoint for admin troubleshooting
  - Explains event date filtering and cache delays
  - New `showTroubleshootingTips` prop to control help visibility

- feat(validation): Added event data validation helper function
  - `frontend/src/lib/strapi-utils.ts` - New `validateEventData()` function
  - Validates required fields (title, date, startTime, publishedAt)
  - Checks date/time formats and provides format error messages
  - Validates date/time is in the future (warns if in past)
  - Checks event category validity
  - Returns detailed errors and warnings for debugging

- feat(debug): Enhanced diagnostic endpoint with detailed event date/time analysis
  - `frontend/src/app/api/debug/content/route.ts` - Now shows detailed breakdown of event parsing issues
  - Includes event date/time parsing analysis, timezone information, and time until event
  - Provides analysis object with parseError details when date/time parsing fails
  - Helps diagnose why events aren't displaying due to date/time format issues

- feat(strapi): Improved isFutureEvent function with better date/time format handling
  - `frontend/src/lib/strapi-utils.ts` - Enhanced `isFutureEvent()` function
  - Now handles multiple date formats (YYYY-MM-DD, YYYY/MM/DD, ISO format)
  - Handles various time formats (HH:mm:ss, HH:mm with auto-padding)
  - Provides detailed console warnings with parsing errors and format information
  - Better error handling prevents false filtering of events due to format issues

- feat(strapi): Added client-side publishedAt filtering for events
  - `frontend/src/lib/strapi.ts` - Modified `fetchEvents()` function
  - Now filters out unpublished events on the client side as a backup check
  - Includes detailed logging of publishedAt filtering results
  - Ensures only published events are shown even if Strapi API returns drafts

- feat(home): Added production-safe logging for event filtering analysis
  - `frontend/src/app/(site)/page.tsx` - Home page now logs detailed event filtering info
  - Controlled by `DEBUG_EVENT_FILTERING=true` environment variable
  - Shows sample events filtered out and reasons (missing dates, past dates)
  - Helps diagnose why specific events aren't appearing on the home page

### Added
- feat(announcements): Created announcements archive page with current and past sections
  - `frontend/src/app/(site)/calendar/announcements/page.tsx` - New page showing all announcements (current + past)
  - Modified `fetchAnnouncements()` to accept `includeExpired` parameter for bypassing displayUntil filter
  - Landing page (`/`) continues showing only current announcements
  - Archive page (`/calendar/announcements`) shows complete history with past announcements in separate section
  - When new Strapi content is added, it appears on both landing page and announcements page
  
- feat(cache): Implemented manual cache revalidation API
  - `frontend/src/app/api/revalidate/route.ts` - Secure endpoint for manual ISR cache invalidation
  - Accepts `secret` and `path` parameters to trigger selective cache refreshes
  - Requires `REVALIDATION_SECRET` environment variable for security
  - Useful for immediately refreshing cache when content changes (instead of waiting 5 minutes)
  - Usage: `POST /api/revalidate?secret=YOUR_SECRET&path=/calendar/announcements`

- feat(cache): Implemented Strapi webhook integration for automatic cache invalidation
  - `frontend/src/app/api/webhooks/strapi/route.ts` - Webhook endpoint for Strapi to trigger cache refresh
  - Verifies webhook signature using `X-Webhook-Secret` header for security
  - Automatically revalidates affected pages when content is published/updated in Strapi
  - Maps Strapi content types to frontend pages (announcements → `/calendar/announcements`, events → `/calendar/current-events`, etc.)
  - Production-ready automatic cache invalidation without manual intervention

- feat(debug): Created content diagnostic endpoint for debugging filtering issues
  - `frontend/src/app/api/debug/content/route.ts` - Shows raw CMS data vs. filtered results
  - Displays why content is being filtered out (past dates, expired announcements, missing attributes)
  - Helps diagnose "content doesn't show but exists in CMS" issues
  - Provides detailed breakdown of current vs. past announcements and future vs. past events

- feat(debug): Created form submission diagnostic endpoint
  - `frontend/src/app/api/debug/forms/route.ts` - Tests form submission setup and backend connectivity
  - Validates `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_KEY` environment variables
  - Tests backend reachability from frontend
  - Provides clear recommendations for fixing form submission issues

- docs(deployment): Created comprehensive cache invalidation guide
  - `docs/deployment/CACHE_INVALIDATION.md` - Complete guide for ISR cache management
  - Documents both manual revalidation API and Strapi webhook approaches
  - Explains ISR caching mechanism and why content might not update immediately
  - Includes setup instructions, usage examples, troubleshooting, and best practices

- docs(deployment): Created CMS content troubleshooting guide
  - `docs/deployment/CMS_CONTENT_TROUBLESHOOTING.md` - Comprehensive troubleshooting for missing content
  - Covers common issues: unpublished content, filtered by dates, expired announcements, environment variables
  - Includes advanced troubleshooting, layered testing approach, and verification workflows
  - Diagnostic endpoints reference and support information

### Changed
- refactor(announcements): Modified `fetchAnnouncements()` to support including expired announcements
  - Added `includeExpired?: boolean` parameter to filter options
  - When `includeExpired: true` or `displayUntil` not provided, all announcements are returned
  - When `displayUntil` is provided and `includeExpired` is false, only current announcements are filtered
  - Maintains backward compatibility (home page still filters by default)

- refactor(calendar): Updated calendar hub page to include announcements link
  - Added "Announcements" card to navigation grid at `/calendar/announcements`
  - Changed grid from 3 columns to 4 columns to accommodate new link
  - Maintains consistent styling and layout with existing calendar links

- feat(env): All form submission routes now validate environment variables
  - `frontend/src/app/api/v1/forms/email-subscription/route.ts` - Added NEXT_PUBLIC_API_URL validation
  - `frontend/src/app/api/v1/forms/sponsorship/route.ts` - Added NEXT_PUBLIC_API_URL validation
  - `frontend/src/app/api/v1/forms/facility-request/route.ts` - Added NEXT_PUBLIC_API_URL validation
  - `frontend/src/app/api/v1/forms/donation-statement/route.ts` - Added NEXT_PUBLIC_API_URL validation
  - `frontend/src/app/api/v1/forms/change-of-address/route.ts` - Added NEXT_PUBLIC_API_URL validation
  - Previously: Used fallback to `http://localhost:4000` which failed in production
  - Now: Requires explicit `NEXT_PUBLIC_API_URL` set in Amplify environment variables
  - Clear error messages if URL or API key missing instead of silently failing

- docs(deployment): Enhanced AMPLIFY_ENV_VARS.md with cache invalidation section
  - Added "Cache Invalidation (NEW)" section explaining ISR cache issues
  - Documents `REVALIDATION_SECRET` and `STRAPI_WEBHOOK_SECRET` environment variables
  - Links to complete cache invalidation guide and troubleshooting guide
  - References diagnostic endpoints for debugging

### Added
- feat(env): Created frontend/.env.local template for local development
  - `frontend/.env.local` - Ensures frontend loads all four required env vars (form proxy + CMS content)
  - Prevents "either/or" failures where form or CMS breaks when missing one env pair
  - See docs/development/FRONTEND_ENV_SETUP.md for detailed instructions
- feat(scripts): Created validate-frontend-env.sh script to verify all required env vars
  - `scripts/validate-frontend-env.sh` - Validates presence of NEXT_PUBLIC_API_URL, NEXT_PUBLIC_API_KEY, CMS_API_URL, CMS_API_TOKEN
  - Provides clear feedback on which variables are missing and why they're needed
  - Helps prevent "form submission works but CMS doesn't" type failures
  - Exits with success (0) if all vars set, failure (1) if any missing
- docs(development): Created FRONTEND_ENV_SETUP.md with comprehensive env configuration guide
  - Explains why frontend needs all four env vars (form proxy + CMS content)
  - Step-by-step local development setup
  - Why frontend/.env.local is needed (Next.js loads from app directory, not repo root)
  - Troubleshooting common issues (form proxy failures, missing CMS content, etc.)
  - Lazy env loading pattern explanation

### Fixed
- fix(env): Fixed frontend Strapi env initialization to use lazy loading instead of module-level
  - Updated `frontend/src/lib/strapi.ts` - Added getStrapiConfig() function for lazy env reading
  - Updated `frontend/src/lib/strapi-utils.ts` - Same lazy initialization pattern
  - Ensures CMS_API_URL and CMS_API_TOKEN are read at request time, not at module import
  - Matches backend pattern from `backend/src/services/strapi.service.ts`
  - Prevents "empty token" bugs where env isn't ready when module first loads
  - Frontend Strapi integration now consistent with backend (lazy init)

### Changed
- docs(deployment): Enhanced AMPLIFY_ENV_VARS.md with critical note about env conflicts
  - Added prominent warning about needing ALL FOUR variables for both flows
  - Explained that "form works but CMS doesn't" is env configuration, not code conflict
  - Added new troubleshooting section: "Environment Variables Conflict"
  - Lists specific checklist for verifying all four vars in Amplify Console
  - Helps prevent deployment failures where one flow works and other doesn't
  - Root cause identified: incomplete env configuration (not code issues)

### Added
- feat(email): Implemented Resend inbound email handling with webhook verification
  - Created `backend/src/api/webhooks/resend.routes.ts` with Svix signature verification for Resend webhooks
  - Added `POST /webhooks/resend` endpoint that verifies webhook signing (svix-id, svix-timestamp, svix-signature headers)
  - Handles `email.received` events and optionally sends admin notifications via email
  - Mounted webhook route in `backend/src/server.ts` before `express.json()` to receive raw body (required for signature verification)
  - Added `RESEND_WEBHOOK_SECRET` environment variable to `scripts/backend-env-template.txt`
  - Created comprehensive documentation in `docs/deployment/RESEND_INBOUND_EMAIL_SETUP.md` covering:
    - Route 53 MX record configuration for inbound email receiving
    - Resend dashboard webhook setup and secret management
    - Backend webhook implementation details
    - Troubleshooting guide for MX failures and webhook issues
  - Inbound email flow: Domain MX → Resend SMTP → Webhook POST → Backend verification → Admin notification

### Fixed
- fix(backend): Fixed backend service crashing due to missing Prisma Client initialization
  - Regenerated Prisma Client on production server and copied to backend node_modules
  - Backend service now running and accessible on port 4000
  - Root cause: Prisma Client was not properly generated/copied after deployment
  - Forms can now successfully reach backend API from frontend
- fix(forms): Fixed frontend form submission failures by ensuring CORS allows Amplify domains
  - Updated `backend/src/config/corsOptions.ts` to properly handle Amplify domain origins using function-based origin checking
  - CORS now allows requests from `*.amplifyapp.com` domains for production deployments
  - Root cause: Frontend forms failing with "fetch failed" because Next.js API routes couldn't reach backend due to missing `NEXT_PUBLIC_API_URL` environment variable in Amplify
  - Solution: CORS updated to support Amplify domains; `NEXT_PUBLIC_API_URL` must be set in AWS Amplify Console to `http://34.206.184.139:4000`
- fix(forms): Fixed form submissions not syncing to Strapi CMS by correcting CMS_API_URL configuration
  - Updated `scripts/backend-env-template.txt` to use HTTPS URL without port 1337 - `CMS_API_URL="https://cms.vishnumandirtampa.com/api"`
  - Changed production backend `.env` file to use correct HTTPS endpoint
  - Root cause: Backend was configured to use `http://cms.vishnumandirtampa.com:1337/api` which fails because port 1337 is closed from public access
  - Strapi runs internally on port 1337 but is exposed via Nginx reverse proxy on HTTPS port 443 (no port in URL)
  - After fix: Forms submitted from frontend are successfully synced to Strapi CMS Content Manager
  - Verified connectivity and sync with test POST requests to Strapi API
- fix(ui): Fixed "Become a Member" button not opening Zeffy form in desktop dropdown menu
  - Updated `DropdownMenu` component to support Zeffy button items - `frontend/src/components/ui/DropdownMenu.tsx`
  - Added optional `isButton` and `zeffyLink` properties to `DropdownItem` interface
  - Imported `handleZeffyClick` utility from `frontend/src/lib/zeffy.ts`
  - Conditionally renders button elements with Zeffy handlers instead of regular links when `isButton: true`
  - Desktop Support dropdown now correctly opens Zeffy forms for "Become a Member" and "Online Puja" items
  - Maintains consistent behavior between desktop and mobile menus
  - Root cause: Desktop dropdown menu ignored Zeffy button configuration, rendering regular links to non-existent routes
- fix(forms): Fixed form submissions not syncing to Strapi CMS
  - Enhanced error logging in `backend/src/services/strapi.service.ts` to capture detailed error responses including status codes, error messages, and API URLs
  - Created comprehensive guide `docs/deployment/FIX_FORM_SYNC_TO_STRAPI.md` with step-by-step instructions to fix Strapi API token permissions
  - Root cause: API token lacked `create` permissions for puja-sponsorship, facility-request, and form-submission content types
  - Solution: Change API token type to "Full access" or add explicit `create` permissions in Strapi Admin Panel
  - Created `scripts/sync-forms-to-strapi.sh` to backfill existing PostgreSQL records to Strapi CMS
  - Form submissions now appear in Strapi admin panel after permissions are fixed

**IMPORTANT:** This changelog MUST be updated for EVERY code change, feature addition, bug fix, or configuration update. See `.cursorrules` Section 17 for detailed requirements.

---

## [Unreleased]

### Fixed
- fix(donations): Fixed Zeffy donation buttons not working by using proper HTML5 data attributes and client components
  - frontend/src/components/ui/ZeffyButton.tsx - New client component for Zeffy form buttons with modal popup handling
  - frontend/src/lib/zeffy.ts - Utility functions for Zeffy modal opening and click handling
  - frontend/src/components/layout/header/Header.tsx - Updated donate buttons with handleZeffyClick handler
  - frontend/src/app/(site)/page.tsx - Updated hero and building fund buttons to use ZeffyButton component
  - frontend/src/app/(site)/support/page.tsx - Updated membership button to use ZeffyButton component
  - frontend/src/app/(site)/support/donate/page.tsx - Updated donate button to use ZeffyButton component
  - Changed all zeffy-form-link attributes to data-zeffy-form-link (proper HTML5 format)
  - Modals now open centered at 600x800px and properly handle click events
  - All donation buttons (header, hero section, building fund, membership) now work correctly

- fix(donations): Enhanced Zeffy donation button initialization and support - frontend/src/app/layout.tsx, frontend/src/components/layout/header/Header.tsx - Added onLoad callback to dispatch zeffy-script-loaded event when Zeffy script loads - Added useEffect hook to Header component to initialize Zeffy buttons when script loads - Added fallback timer to ensure buttons work even if event doesn't fire - Ensures donate buttons work reliably across all pages (header, home, support page) - Resolves "Donate buttons not working" issue by properly initializing Zeffy form bindings
- fix(routing): Created missing pages causing 404 errors for navigation links:
  - frontend/src/app/(site)/calendar/page.tsx - Main calendar hub page with links to sub-pages and upcoming events preview - Aggregates current events, annual calendar, and newsletter archive
  - frontend/src/app/(site)/support/page.tsx - Support hub page with donation, sponsorship, membership, and volunteer options - Provides overview of ways to support the temple
  - frontend/src/app/(site)/privacy-policy/page.tsx - Complete privacy policy with 13 sections covering data collection, security, third-party services, and user rights
  - frontend/src/app/(site)/terms-of-service/page.tsx - Complete terms of service with 15 sections covering donations, payments, facility rentals, liability, and governing law
  - Resolves console 404 errors for /calendar, /support, /privacy-policy, /terms-of-service routes referenced in Header dropdown and Footer

### Added
- feat(pages): Added comprehensive legal and informational pages for better site structure and compliance
  - Privacy Policy page includes sections on data collection, security, third-party services, cookies, user rights, and contact information
  - Terms of Service page includes sections on donations, payment processing, puja sponsorships, facility rentals, and limitation of liability
  - Calendar hub page provides central location for viewing all events and accessing calendar sub-sections
  - Support hub page provides central location for all donation and support options

### Changed
- refactor(ui): Replaced PNG logo with SVG for better scaling - frontend/src/components/layout/header/Header.tsx - Changed from /images/vishnumandir-logo.png to /images/vishnumandir logo.svg - Increased logo size from h-16 md:h-20 w-48 md:w-56 to h-20 md:h-24 w-56 md:w-64 - Updated sizes prop to (max-width: 768px) 224px, 256px - SVG scales better and is more visible to users

### Reorganized
- refactor(navigation): Reorganized main navigation menu for cleaner layout - frontend/src/components/layout/header/Header.tsx - Created new "Support" dropdown menu containing: Recurring Donation, Online Puja, Become a Member - Moved "Deities" into "Religious" dropdown as first item - Reduced top-level navigation items by consolidating support-related items - Updated both desktop and mobile navigation structures
- refactor(navigation): Kept "Donate" button as prominent primary CTA in header - Separated from Support dropdown to maintain visibility and conversion focus

### Added
- feat(ui): Added entries to menuItems object for the new Support dropdown - frontend/src/components/layout/header/Header.tsx - Support dropdown includes Recurring Donation (link), Online Puja (Zeffy button), Become a Member (Zeffy button)

### Fixed
- fix(email): Updated all email addresses from sakeemj@live.com to info@vishnumandirtampa.com across entire site
  - frontend/src/lib/seo.ts - Organization schema
  - frontend/src/app/(site)/about/about/page.tsx - About Us page contact
  - frontend/src/app/(site)/about/contact/page.tsx - Contact page
  - frontend/src/app/(site)/about/feedback/page.tsx - Feedback form placeholder
  - frontend/src/app/(site)/about/volunteer/page.tsx - Volunteer form
  - frontend/src/app/(site)/religious/priests/page.tsx - Priests contact
  - frontend/src/app/(site)/calendar/newsletter/page.tsx - Newsletter placeholder
  - frontend/src/app/(site)/forms/email-subscription/page.tsx - Email subscription form
  - frontend/src/app/(site)/forms/change-of-address/page.tsx - Address change form
  - frontend/src/app/(site)/forms/request-facility/page.tsx - Facility request form
  - frontend/src/app/(site)/forms/puja-sponsorships/page.tsx - Puja sponsorship form
  - frontend/src/app/(site)/forms/donation-statement/page.tsx - Donation statement form
  - frontend/src/app/(site)/education/classes/page.tsx - Classes registration

### Fixed
- fix(backend): Fixed Strapi CMS sync not working - backend/src/services/strapi.service.ts - Changed from module-level environment variable reading to lazy initialization - Environment variables (CMS_API_URL, CMS_API_TOKEN) now read when functions are called, not at module load time - Fixes issue where dotenv.config() runs after module imports, causing CMS_API_TOKEN to be undefined - Updated CMS_API_URL in backend .env from HTTP to HTTPS - Form submissions now successfully sync to Strapi CMS for admin viewing - Fixes "CMS_API_TOKEN not configured" warnings in logs
- fix(database): Created initial schema migration to fix missing database tables - prisma/migrations/20260124000000_initial_schema/migration.sql - Generates all required tables from Prisma schema (User, Event, Donation, PujaSponsorship, FacilityRequest, Newsletter, FormSubmission) - All tables created with CREATE TABLE IF NOT EXISTS for idempotency - All required enums created with proper constraints - Fixed 20260125000002 migration to safely handle optional attendees column migration - Fixed 20260125000003 migration to check if FormSubmissionType enum already exists - Reordered migrations so initial schema creates tables before alteration migrations - Deployed to production RDS database - Fixes "The table `public.PujaSponsorship` does not exist" error on form submissions
- fix(backend): Implemented lazy initialization for Stripe client to prevent backend startup crashes - backend/src/utils/stripe.client.ts - Changed from eager initialization (throws if STRIPE_SECRET_KEY missing) to lazy initialization using Proxy pattern - Stripe instance only created when actually accessed (payment endpoints), not on module import - Backend now starts successfully even if Stripe key not configured - Form submission endpoints work without Stripe - Payment endpoints throw helpful error if Stripe key missing when accessed - Fixes "Neither apiKey nor config.authenticator provided" error that crashed backend on startup
- fix(backend): Fixed TypeScript compilation error with Prisma payload typing - backend/src/api/v1/forms.routes.ts - Added type assertion `as any` for payload object to match Prisma's JsonValue type - Allows backend to compile and deploy successfully
- fix(api): Fixed form submissions returning "Unexpected token '-', '------WebK'... is not valid JSON" error - frontend/src/app/api/v1/forms/sponsorship/route.ts, facility-request/route.ts, donation-statement/route.ts, email-subscription/route.ts, change-of-address/route.ts - Properly forwarded multipart/form-data by preserving Content-Type header and multipart boundaries - Changed request body handling from `request.text()` with incorrect JSON Content-Type to `request.arrayBuffer()` with original Content-Type - Added Content-Type validation before parsing backend response to gracefully handle non-JSON error responses - Improved error handling to detect and report HTML error pages instead of crashing on JSON parse - All form routes now properly handle both multipart and JSON payloads - Backend responses are now correctly parsed as JSON - Users see proper error messages instead of parsing errors

### Added
- feat(diagnostics): Enhanced /api/debug/cms endpoint with response time metrics and improved error detection - frontend/src/app/api/debug/cms/route.ts - Added responseTimeMs to track API performance - Distinguishes between auth errors (401/403), timeouts, and connectivity issues - Provides specific recommendations based on error type - Calculates average response time for performance monitoring
- docs(deployment): Created CMS_CONTENT_NOT_DISPLAYING_QUICK_FIX.md - Quick troubleshooting guide for when CMS content isn't visible - Explains ISR caching and 5-minute revalidation - Clear instructions to redeploy frontend for immediate results - Includes verification steps and common scenarios
- docs(deployment): Created FIX_CMS_PRODUCTION_DISPLAY.md - Comprehensive step-by-step guide to fix all CMS content display issues - Step 1-5 covering environment variables, token testing, permissions, content verification, and cache clearing - Common issues and solutions with curl examples
- docs(deployment): Created CMS_FIX_IMPLEMENTATION_CHECKLIST.md - Complete 7-phase implementation checklist with success criteria - All required tasks for verifying and fixing CMS content display - Final verification and monitoring guidance

### Fixed
- fix(diagnostics): Enhanced CMS debug endpoint to provide actionable error messages - Now distinguishes auth errors from connectivity/timeout issues - Provides specific recommendations for each error type
- fix(docs): Verified all environment variables are correctly set in Amplify Console - CMS_API_URL and CMS_API_TOKEN properly configured - Confirmed API connectivity working with fallback values

### Added
- feat(api): Created Next.js API route handlers for all form submissions to replace external Express backend - frontend/src/app/api/v1/forms/sponsorship/route.ts - Handles multipart/form-data with Zod validation - frontend/src/app/api/v1/forms/facility-request/route.ts - Handles facility request JSON submissions - frontend/src/app/api/v1/forms/email-subscription/route.ts - Handles email subscription form - frontend/src/app/api/v1/forms/donation-statement/route.ts - Handles donation statement requests - frontend/src/app/api/v1/forms/change-of-address/route.ts - Handles change of address submissions - All handlers validate input, save to PostgreSQL via Prisma, sync to Strapi CMS, and send confirmation emails - Fixes issue where forms could not submit in production due to unavailable external backend
- feat(lib): Created shared Prisma client instance for Next.js API routes - frontend/src/lib/prisma.ts - Singleton pattern prevents multiple instances in development - Properly configured for production deployment
- feat(lib): Created email service wrapper for Next.js API routes - frontend/src/lib/email.ts - Wraps Resend email service - Provides unified SendEmail function with error handling - Used by all form handlers for confirmation and admin notification emails
- feat(lib): Created Strapi sync service for Next.js API routes - frontend/src/lib/strapi-sync.ts - Handles syncing form submissions to Strapi CMS - Non-blocking async operations for better performance - Replicates backend Strapi integration for consistency
- feat(lib): Created validation schemas for frontend form handlers - frontend/src/lib/schemas/forms.ts - Sponsorship and facility request schemas - frontend/src/lib/schemas/optional-forms.ts - Email subscription, donation statement, and address change schemas
- feat(lib): Created API response utilities for Next.js handlers - frontend/src/lib/api-responses.ts - successResponse and errorResponse functions - zodIssuesToContractErrors for consistent error formatting
- docs(testing): Created comprehensive form submission testing guide - docs/testing/FORM_SUBMISSION_TESTING.md - Testing checklist for all form types - Validation error tests - Database verification queries - Email testing procedures - Troubleshooting section
- feat(scripts): Created form submission end-to-end test script - scripts/test-form-submissions.sh - Tests all form types via API - Validates response formats - Includes curl commands for manual testing
- feat(debugging): Created comprehensive CMS-frontend integration test script - scripts/test-cms-frontend-integration.sh - Tests Strapi API connectivity for all content types - Validates response structures and content availability - Provides detailed recommendations for fixing issues - Helps diagnose permission and configuration problems
- feat(api): Created /api/debug/cms endpoint for production diagnostics - frontend/src/app/api/debug/cms/route.ts - Tests CMS connectivity from deployed frontend server - Returns JSON with environment status, test results, and recommendations - Can be accessed at /api/debug/cms on any deployment
- feat(api): Created /api/debug/announcements endpoint for debugging announcement fetching - frontend/src/app/api/debug/announcements/route.ts - Shows raw API response, normalized data, and filtered results - Helps diagnose why announcements are not appearing on frontend - Can be accessed at /api/debug/announcements on any deployment
- docs(deployment): Created STRAPI_PERMISSIONS_VERIFICATION.md with comprehensive permission setup guide - docs/deployment/STRAPI_PERMISSIONS_VERIFICATION.md - Step-by-step instructions for verifying and configuring Strapi API token permissions - Documents both "Full access" and "Custom" token types - Includes troubleshooting section for common permission errors
- docs(deployment): Created CMS_TESTING_VALIDATION.md with complete testing guide for all content types - docs/deployment/CMS_TESTING_VALIDATION.md - Manual testing steps for Event, Announcement, Newsletter, Priest, Puja Service - Comprehensive checklist for verifying CMS-to-frontend content flow - Includes troubleshooting matrix and summary tables
- docs(deployment): Updated AMPLIFY_ENV_VARS.md with troubleshooting section - docs/deployment/AMPLIFY_ENV_VARS.md - Added CMS content troubleshooting steps - Added test commands for verifying API connectivity - Added ISR cache explanation and solutions
- docs(deployment): Created CMS_DATA_FLOW.md with comprehensive data flow documentation - docs/deployment/CMS_DATA_FLOW.md - Documents content flow FROM Strapi TO Frontend (display content: Events, Announcements, Newsletters, Priests, Puja Services) - Documents content flow FROM Frontend TO Strapi (form submissions: Puja Sponsorships, Facility Requests, Form Submissions) - Explains source of truth for each content type (Strapi for display, PostgreSQL for submissions) - Includes data flow diagrams and admin workflow instructions

### Fixed
- fix(forms): Fixed form submissions not working - All forms were calling non-existent external backend URL (NEXT_PUBLIC_API_URL) - Created Next.js API route handlers to handle submissions directly on frontend server - Forms now submit to /api/v1/forms/* instead of external backend - Validation now works correctly for email, phone, and required fields - All form data now properly stored in PostgreSQL database - All form submissions now synced to Strapi CMS - Confirmation and admin notification emails now sent successfully - Users can now see success/error messages from form submissions
- fix(api): Updated frontend/src/lib/api.ts to use Next.js API routes by default - Changed postJson and postFormData to call /api/v1/* endpoints instead of external backend - Eliminates dependency on NEXT_PUBLIC_API_URL for form submissions - Forms now work in production without external backend dependency
- fix(debugging): Created comprehensive CMS-frontend integration test script - scripts/test-cms-frontend-integration.sh - Tests Strapi API connectivity for all content types - Validates response structures and content availability - Provides detailed recommendations for fixing issues - Helps diagnose permission and configuration problems - **CRITICAL FIX:** Added `filters[publishedAt][$notNull]` to ensure only published announcements are fetched - Added client-side publishedAt filter as backup for Strapi v5 compatibility - Improved debug logging throughout announcement fetching pipeline to help diagnose issues - Announcements now correctly filter by publishedAt status (published vs draft)
- fix(strapi): Enhanced Strapi v5 to v4 response normalization with improved type safety - frontend/src/lib/strapi.ts - **CRITICAL FIX:** Added id field validation to ensure normalization preserves id correctly - Added check for attributes being an object (not array) to prevent false positives - Throws error on invalid id to catch data issues early - Ensures all fields are preserved correctly during transformation
- fix(strapi): Updated getStrapiImageUrl() to handle both Strapi v4 and v5 image structures - frontend/src/lib/strapi-utils.ts - **CRITICAL FIX:** Now checks for v5 flat structure first (media.url) before falling back to v4 nested structure (media.data.attributes.url) - Handles both complete URLs and relative paths - Images now display correctly for both Strapi versions
- fix(strapi): Updated getStrapiFileUrl() to handle both Strapi v4 and v5 file structures - frontend/src/lib/strapi-utils.ts - Mirrors getStrapiImageUrl() fix for PDF files and other uploads - Supports both flat and nested structures for backward compatibility
- fix(types): Updated StrapiMedia type to support both Strapi v4 and v5 structures - frontend/src/types/strapi.ts - Added v5 flat structure fields (id, url, name, etc.) as optional properties - Kept v4 nested structure (data.attributes) for backward compatibility - Improved type safety for image URL extraction
- fix(strapi): Added Strapi v5 to v4 response normalization layer - frontend/src/lib/strapi.ts - **ROOT CAUSE FOUND:** Strapi v5 returns flat responses `{id, title, ...}` but frontend expected v4 nested structure `{id, attributes: {title, ...}}` - Added `normalizeToV4()` and `normalizeArrayToV4()` functions to convert v5 flat responses to v4-like structure - Updated all fetch functions (fetchEvents, fetchPujaServices, fetchPriests, fetchAnnouncements, fetchNewsletters, fetchPageBySlug) to use normalization - CMS content now displays correctly on all frontend pages
- fix(strapi): Implemented client-side category filtering in fetchEvents() - Removed broken Strapi v5 API filter `filters[category][$eq]` which was returning empty results - Now fetches all events from API and filters by category client-side in JavaScript - Events now display correctly on `/education/events` page and other category-filtered pages - frontend/src/lib/strapi.ts
- fix(strapi): Implemented client-side filtering for announcements - Moved displayUntil and level filtering from API to client-side JavaScript - Announcements now filter correctly by expiration date and priority level - frontend/src/lib/strapi.ts

### Docs
- docs(deployment): Created ANNOUNCEMENTS_FIX.md with comprehensive fix documentation - docs/deployment/ANNOUNCEMENTS_FIX.md - Explains root cause: missing publishedAt filter - Documents solution: API-level and client-side filters - Shows debug logging improvements - Describes new /api/debug/announcements endpoint - Provides troubleshooting guide for future issues
- docs(deployment): Created FIX_CMS_CONTENT_DISPLAY.md with step-by-step fix guide - Identified root causes: event category "Religious" doesn't match page filter for "Educational", event start time 00:45:00 is in the past - Provided detailed instructions to edit event in Strapi: change category to "Educational" and set future start time - docs/deployment/FIX_CMS_CONTENT_DISPLAY.md
- docs(deployment): Created CMS_CONTENT_DIAGNOSTIC_RESULTS.md with diagnostic findings - Diagnosed CMS content visibility issue: environment variables correctly configured, API connectivity working, issue is insufficient content in Strapi (only 1 event and 1 priest published, 0 puja services/announcements/newsletters) - docs/deployment/CMS_CONTENT_DIAGNOSTIC_RESULTS.md
- docs(scripts): Created diagnose-cms-connection.sh diagnostic script - Tests all Strapi content type endpoints and reports availability - Helps identify content gaps and API connectivity issues - scripts/diagnose-cms-connection.sh

### Other Fixed
- fix(frontend): Added null safety checks for events in education/events page - Added defensive filters to remove events with missing attributes - Guard against undefined date/startTime before calling isFutureEvent() - Fixes Amplify build failure (Job 39): TypeError when generating static pages - frontend/src/app/(site)/education/events/page.tsx
- fix(strapi): Removed incompatible Strapi v5 API filters - Strapi v5 doesn't support complex filters like publishedAt[$notNull], category[$eq] - These filters caused API to return empty results, preventing content from displaying - Removed all problematic filter syntax and complex nested filters from strapi.ts fetch functions - Frontend now receives all published content and handles filtering client-side - Fixes event, puja services, priests, newsletters not displaying on frontend despite being published - frontend/src/lib/strapi.ts
- fix(frontend): Added comprehensive null safety checks for all Strapi data components - Added null checks in EventCard, PujaServiceCard, AnnouncementCard, NewsletterCard components to guard against undefined attributes - Added defensive filtering in priests, puja-services, and homepage pages to filter out invalid items - Prevents "Cannot read properties of undefined" errors during static page generation - Fixes Amplify build failures (Deployments 34-37) - frontend/src/components/shared/EventCard.tsx, frontend/src/components/shared/PujaServiceCard.tsx, frontend/src/components/shared/AnnouncementCard.tsx, frontend/src/components/shared/NewsletterCard.tsx, frontend/src/app/(site)/religious/priests/page.tsx, frontend/src/app/(site)/religious/puja-services/page.tsx, frontend/src/app/(site)/page.tsx
- fix(frontend): Added null safety checks for event attributes in current-events page - Added guards for undefined event.attributes.date and event.attributes.startTime before calling isFutureEvent - Prevents "Cannot read properties of undefined (reading 'date')" error during static generation - frontend/src/app/(site)/calendar/current-events/page.tsx
- fix(frontend): Added null safety check for priest attributes in PriestCard component - Added guard to return null if priest.attributes is undefined - Prevents "Cannot read properties of undefined (reading 'profileImage')" error during static generation - frontend/src/components/shared/PriestCard.tsx
- fix(amplify): Removed package-lock.json conflicting with pnpm - Removed frontend/package-lock.json since project uses pnpm (pnpm-lock.yaml) - Multiple lockfiles cause build conflicts in Amplify - frontend/package-lock.json
- fix(amplify): Removed unnecessary Prisma generation from frontend build - Frontend doesn't use Prisma Client, only backend workspace needs it - Removed npx prisma generate from frontend/amplify.yml preBuild commands - Fixes Amplify build failures (Deployments 34-35) - frontend/amplify.yml

### Added
- feat(cms): Created route, controller, and service files for all Strapi content types - Added route files using createCoreRouter for Event, Puja Service, Priest, Announcement, Newsletter, Page, Facility Request, Form Submission, and Puja Sponsorship - Added controller files using createCoreController for all content types - Added service files using createCoreService for all content types - Routes configured with public find/findOne endpoints for frontend access - Fixes 404 errors when accessing REST API endpoints - All API endpoints now working: /api/events, /api/puja-services, /api/priests, etc. - cms/src/api/*/routes/*.ts, cms/src/api/*/controllers/*.ts, cms/src/api/*/services/*.ts, docs/deployment/STRAPI_ROUTES_FIX_COMPLETE.md
- docs(deployment): Verified PostgreSQL tables for Strapi content types - Confirmed all content type tables exist (events, puja_services, priests, announcements, newsletters, etc.) with proper Strapi v5 structure - Verified content types are registered in strapi_core_store_settings - Confirmed database is properly initialized with Strapi metadata tables - Database tables are NOT the cause of 404 errors - docs/deployment/POSTGRESQL_TABLES_CHECK_RESULTS.md
- feat(diagnostics): Added debug logging for Strapi API calls - frontend/src/lib/strapi.ts, frontend/src/app/(site)/education/events/page.tsx
- docs(deployment): Created STRAPI_API_PERMISSIONS_FIX.md with instructions to fix 404 errors - docs/deployment/STRAPI_API_PERMISSIONS_FIX.md
- docs(deployment): Created STRAPI_API_TROUBLESHOOTING.md with detailed troubleshooting steps - docs/deployment/STRAPI_API_TROUBLESHOOTING.md
- docs(deployment): Created STRAPI_FIND_CONTENT_TYPES_IN_PERMISSIONS.md with step-by-step guide to locate content types - docs/deployment/STRAPI_FIND_CONTENT_TYPES_IN_PERMISSIONS.md
- docs(deployment): Created STRAPI_FULL_ACCESS_TOKEN_SOLUTION.md for when individual content types don't appear in permissions - docs/deployment/STRAPI_FULL_ACCESS_TOKEN_SOLUTION.md
- docs(deployment): Created STRAPI_TOKEN_VERIFICATION_STEPS.md with token verification and restart instructions - docs/deployment/STRAPI_TOKEN_VERIFICATION_STEPS.md
- docs(deployment): Created RESTART_STRAPI_MANUAL_STEPS.md with step-by-step instructions to restart Strapi - docs/deployment/RESTART_STRAPI_MANUAL_STEPS.md
- docs(deployment): Created STRAPI_V5_API_ROUTES_NOT_REGISTERED.md with diagnosis for 404 errors - docs/deployment/STRAPI_V5_API_ROUTES_NOT_REGISTERED.md
- docs(deployment): Created STRAPI_RUN_MIGRATIONS.md with migration steps - docs/deployment/STRAPI_RUN_MIGRATIONS.md
- docs(deployment): Created STRAPI_API_404_FINAL_DIAGNOSIS.md with final diagnosis and solution - docs/deployment/STRAPI_API_404_FINAL_DIAGNOSIS.md
- feat(scripts): Created test-strapi-api.sh script to test all Strapi API endpoints - scripts/test-strapi-api.sh

### Changed
- refactor(audio): Replaced om.mp3 with vishnumandir-audio.mp3 and enabled auto-play on page load - Audio now plays automatically when users land on the page (default muted: false), users can still toggle it off - Replaced frontend/public/audio/om.mp3 with frontend/public/audio/vishnumandir-audio.mp3 - Updated OmAudioContext to use new audio file and default to playing - frontend/src/components/audio/OmAudioContext.tsx, frontend/public/audio/vishnumandir-audio.mp3

### Fixed
- fix(images): Fixed squished deity images by maintaining proper aspect ratio - Changed image container from fixed height (h-48) to aspect-square to preserve 1:1 ratio for square deity images - frontend/src/app/(site)/deities/page.tsx
- fix(images): Configured Next.js to allow Strapi CMS image domains - Added remotePatterns to next.config.ts for cms.vishnumandirtampa.com and localhost:1337 to enable priest images and other Strapi media to load correctly - frontend/next.config.ts
- fix(typescript): Fixed TypeScript compilation error in Strapi debug logging - Removed invalid error property access from StrapiCollectionResponse type in fetchEvents debug logging - frontend/src/lib/strapi.ts

### Added
- feat(frontend): Complete Strapi CMS integration for all content types - frontend/src/lib/strapi.ts, frontend/src/types/strapi.ts, frontend/src/lib/strapi-utils.ts
- feat(components): Created reusable display components for Strapi content - EventCard, EventList, PujaServiceCard, PriestCard, AnnouncementCard, NewsletterCard - frontend/src/components/shared/
- feat(pages): Integrated Strapi content fetching into all relevant pages:
  - /education/events - Fetches and displays Educational category events
  - /calendar/current-events - Fetches and displays all published events
  - Home page - Fetches and displays announcements and featured events
  - /religious/puja-services - Fetches and displays puja services from Strapi
  - /religious/priests - Fetches and displays priest profiles from Strapi
  - /calendar/newsletter - Fetches and displays newsletter archive from Strapi
- feat(caching): Implemented ISR (Incremental Static Regeneration) with appropriate revalidation times:
  - Events and Announcements: 5 minutes (300s)
  - Puja Services, Priests, Newsletters: 1 hour (3600s)

### Changed
- refactor(pages): Converted static pages to async Server Components that fetch from Strapi CMS
- refactor(components): Updated all content display components to use Strapi data instead of hardcoded content

## [Unreleased]

### Added
- feat(integration): Added Strapi integration for form submissions viewing - Created Strapi content types for puja-sponsorship, facility-request, and form-submission - Created strapi.service.ts in backend to sync submissions to Strapi via REST API - Updated form submission routes to sync data to Strapi after PostgreSQL write (non-blocking) - Added axios dependency to backend for Strapi API calls - Form submissions now visible in Strapi admin panel while PostgreSQL remains source of truth - Fixed Resend client initialization to handle missing API key gracefully - Committed and deployed code to servers, content types registered in Strapi - cms/src/api/puja-sponsorship/content-types/puja-sponsorship/schema.json, cms/src/api/facility-request/content-types/facility-request/schema.json, cms/src/api/form-submission/content-types/form-submission/schema.json, backend/src/services/strapi.service.ts, backend/src/api/v1/forms.routes.ts, backend/src/utils/resend.client.ts, backend/package.json, docs/deployment/STRAPI_FORM_SUBMISSIONS_SETUP.md
- feat(deployment): Deployed Strapi CMS to production Lightsail instance - Created production .env file with generated security keys (APP_KEYS, JWT secrets, encryption keys) - Configured AWS S3 credentials for media storage - Set up database connection settings (PostgreSQL on Lightsail) - Restarted PM2 service with updated environment - Service ready pending database password configuration - docs/deployment/DEPLOYMENT_STATUS.md
- fix(deployment): Fixed CMS domain connectivity by opening port 1337 in Lightsail firewall - Opened port 1337 in Lightsail instance firewall using AWS CLI - Verified firewall configuration and service listening status - Tested connectivity via both direct IP and domain name - CMS now accessible at http://cms.vishnumandirtampa.com:1337 - docs/deployment/DEPLOYMENT_STATUS.md
- feat(deployment): Deployed frontend to new Amplify app (d1rp3bwb0j3dq8) - Updated frontend/amplify.yml for non-monorepo configuration with pnpm support, corepack setup, and correct baseDirectory (frontend/.next) - Created environment variables documentation (docs/deployment/AMPLIFY_ENV_VARS.md) - Successful deployment (Job 2: SUCCEED) - Build and deploy completed successfully - Note: Root path returns 404, sub-paths work correctly (Next.js routing issue to investigate) - frontend/amplify.yml, docs/deployment/AMPLIFY_ENV_VARS.md
- feat(auth): AWS Cognito User Pool setup for admin authentication - Created Cognito User Pool (vishnu-mandir-admin-pool, ID: us-east-1_N3Kxkj933) with secure password policy - Created App Client (vishnu-mandir-frontend-client, ID: 343pre3iphtlr0od4bkl1n78ar) with OAuth 2.0 settings - Created four user groups: Admin, Editor, Finance, EventManager - Created initial admin user (admin@vishnumandirtampa.com) assigned to Admin group - Updated backend code to use EventManager (no space) to match Cognito group naming constraints - Configured environment variables in Amplify and local .env files - Created comprehensive setup documentation (docs/deployment/COGNITO_SETUP.md) - backend/src/api/admin/facility.routes.ts, types/auth.d.ts, docs/deployment/COGNITO_SETUP.md, .env
- feat(ui): Created custom 404 Not Found page - Added frontend/src/app/not-found.tsx with spiritual design matching site aesthetic - Includes navigation links to main sections (About, Events, Support) - Accessible and SEO-friendly - Uses Tailwind styling consistent with design system - frontend/src/app/not-found.tsx

### Changed
- feat(deployment): AWS Amplify frontend deployment configuration - Created Amplify app (d8s4hpdn0uxuc, vishnu-mandir-frontend), updated frontend/amplify.yml for pnpm monorepo structure with Prisma at root, configured basic environment variables (NEXT_PUBLIC_API_URL, CMS_API_URL, NEXT_PUBLIC_URL, NEXT_PUBLIC_COGNITO_REGION, STRIPE_API_VERSION), created setup script (scripts/amplify-setup.sh) for branch and domain configuration, added deployment documentation (docs/deployment/AMPLIFY_SETUP.md) - frontend/amplify.yml, scripts/amplify-setup.sh, docs/deployment/AMPLIFY_SETUP.md
- feat(iam): Created IAM service role for Amplify full-stack backend deployments - Created AmplifyBackendDeployRole-vishnu-mandir role with AmplifyBackendDeployFullAccess policy for deploying Lambda functions, API Gateway, and other backend resources via Amplify - IAM role: AmplifyBackendDeployRole-vishnu-mandir (arn:aws:iam::831926590271:role/AmplifyBackendDeployRole-vishnu-mandir)
- feat(deployment): Amplify frontend deployment completed - Connected GitHub repository, created main branch, configured build spec for monorepo with pnpm, set environment variables, attached custom domain vishnumandirtampa.com, successful deployment (Job ID: 2, Status: SUCCEED) - Deployment URL: https://main.d8s4hpdn0uxuc.amplifyapp.com - frontend/amplify.yml, AMPLIFY_DEPLOYMENT_STATUS.md
- feat(dns): Verified and documented Route53 DNS records - All DNS records correctly configured: apex domain (ALIAS A to CloudFront), www subdomain (CNAME to CloudFront, verified), api and cms subdomains (A records to Lightsail instances), SSL certificate validation CNAME - DNS resolution verified working - docs/deployment/ROUTE53_DNS_STATUS.md
- fix(deployment): Fixed Amplify monorepo build configuration - Updated frontend/amplify.yml to use correct monorepo format with appRoot: frontend, buildPath: frontend, and baseDirectory: .next - Removed unnecessary cd commands since buildPath handles directory context - Successful deployment (Job 11: SUCCEED) - Note: Root path returns 404, sub-paths work correctly (known Next.js SSR routing issue on Amplify) - frontend/amplify.yml
- feat(infrastructure): AWS infrastructure setup - Created Lightsail PostgreSQL database (vishnu-mandir-postgres, micro_2_0, endpoint: ls-6dc3fd3a57dc9f6f7081de1473b92ae349ce8bb7.cgl4acs00ai2.us-east-1.rds.amazonaws.com), backend instance (vishnu-mandir-backend, micro_3_0, static IP: 34.206.184.139), CMS instance (vishnu-mandir-cms, micro_3_0, IP: 44.202.153.84), S3 bucket (vishnu-mandir-cms-media) with CORS, deployment scripts (scripts/deploy-backend.sh, scripts/deploy-cms.sh, scripts/run-migrations.sh), environment templates (scripts/backend-env-template.txt, scripts/cms-env-template.txt), Amplify build config (frontend/amplify.yml), infrastructure documentation (docs/deployment/aws-infrastructure.md) - docs/deployment/aws-infrastructure.md, scripts/deploy-backend.sh, scripts/deploy-cms.sh, scripts/run-migrations.sh, frontend/amplify.yml
- feat(backend): Enhanced CORS configuration to support multiple origins including Amplify domain - backend/src/config/corsOptions.ts

### Fixed
- fix(deployment): Fixed AWS Amplify pnpm monorepo deployment - Updated pnpm-lock.yaml to sync with backend/package.json (axios dependency), created .npmrc with node-linker=hoisted for Amplify compatibility, fixed amplify.yml to use buildPath: / for monorepo root context with correct baseDirectory and cache paths - Deployment successful (Job 17: SUCCEED) - Website live at https://main.d1rp3bwb0j3dq8.amplifyapp.com - .npmrc, frontend/amplify.yml, pnpm-lock.yaml
- fix(backend): Fixed TypeScript compilation errors - added type annotation for donations map function parameter, fixed FormSubmissionType import by defining enum locally - backend/src/api/admin/donations.routes.ts, backend/src/api/v1/forms.routes.ts

### Changed
- feat(dns): Configured Route53 DNS records for api.vishnumandirtampa.com and cms.vishnumandirtampa.com subdomains - Route53 hosted zone Z10186528G387OP9KXEZ
- refactor(config): Updated environment variable templates and CORS configuration to use production domain names instead of IP addresses - scripts/backend-env-template.txt, scripts/cms-env-template.txt, backend/src/config/corsOptions.ts

### Added
- feat(firewall): Opened firewall ports on Lightsail instances - Port 4000 (TCP) for backend API, Port 1337 (TCP) for CMS - Verified DNS resolution and port accessibility - docs/deployment/DEPLOYMENT_STATUS.md, docs/deployment/aws-infrastructure.md

### Changed
- fix(cms): Attempted to start CMS service - Blocked by SSH connection timeout to CMS instance (44.202.153.84) - Instance shows as running but SSH port 22 times out - Documented issue and required steps for when SSH access is restored - docs/deployment/DEPLOYMENT_STATUS.md

### Added
- feat(cms): Started Strapi CMS service on Lightsail instance - Fixed SSH key permissions, built CMS application, created minimal .env file, started service with PM2 - Service accessible at http://cms.vishnumandirtampa.com:1337/api - Updated deployment scripts with correct SSH key paths - docs/deployment/DEPLOYMENT_STATUS.md, scripts/deploy-cms.sh, scripts/deploy-backend.sh

### Changed
- feat(cms): Upgraded CMS instance from micro_3_0 (1GB RAM) to medium_3_0 (4GB RAM) using snapshot method - Created snapshot (vishnu-mandir-cms-pre-upgrade-20260125), recreated instance from snapshot with medium_3_0 bundle, successfully installed dependencies, built CMS, started service with PM2, updated DNS record - Resolved memory constraints preventing npm install - docs/deployment/DEPLOYMENT_STATUS.md, docs/deployment/aws-infrastructure.md
- chore(repo): Initial commit; push to GitHub (vinnyfds/vishnumandir)
- feat(backend): Complete backend implementation per plan - Phase 1: stripe, zod, multer, uuid; CORS `x-api-key`; `/api/v1` router; Zod schemas (forms, payments); response helpers (`success`/`error`); API-key middleware; contract-style error middleware. Phase 2: Prisma migrations for PujaSponsorship (pujaId, location, attachmentUrl, transactionId) and FacilityRequest (eventType, startTime, endTime, numberOfGuests, requirements, transactionId); FormSubmission model for optional forms. Phase 3: POST `/api/v1/forms/sponsorship` (multipart, multer; S3 deferred); POST `/api/v1/forms/facility-request` (JSON); Stripe client; POST `/api/v1/payments/donation-intent` (optional donorEmail/donorName metadata); POST `/api/v1/payments/subscription`; POST `/webhooks/stripe` (raw body, payment_intent.succeeded, invoice.paid; Donation create, receipts, admin notify). Phase 4: Cognito JWT + RBAC middleware (jose, JWKS); GET `/api/admin/donations`, `/api/admin/donations/export` (CSV, no PII); GET/PATCH `/api/admin/sponsorships`; GET `/api/admin/facility-requests`. Phase 5: POST `/api/v1/forms/donation-statement`, `/change-of-address`, `/email-subscription`; FormSubmission persistence and confirm emails.
- feat(frontend): API client `lib/api.ts` (postJson, postFormData, x-api-key); PujaSponsorshipForm, FacilityRequestForm, DonationStatementForm, ChangeOfAddressForm, EmailSubscriptionForm client components wired to backend; DonateForm with Stripe Elements (one-time donation); `/support/donate` and `/support/donate/success` pages; recurring-donation links to `/support/donate`. Stripe packages `@stripe/stripe-js`, `@stripe/react-stripe-js`.
- feat(cms): Strapi headless CMS setup - `cms/` (Strapi 5) with PostgreSQL; content types Event, PujaService, Priest, Announcement, Newsletter, Page per sitemap; `pnpm-workspace` + `dev:cms` / `dev:all` scripts; `docker/postgres-init/01-create-cms-db.sh` for `vishnu_mandir_cms` DB; `docs/development/cms-setup.md` (RBAC, API token, first-admin); project-readme CMS and run instructions updated. `.gitignore` cms artifacts; root `.env` `CMS_API_TOKEN` comment.
- feat(email): Resend email integration - `resend` package in backend, `backend/src/utils/resend.client.ts` singleton, `backend/src/services/email.service.ts` with `sendEmail()`, `RESEND_API_KEY` and updated `SENDER_EMAIL_ADDRESS`/`ADMIN_EMAIL_ADDRESS` in `.env.example`. Dev-only `POST /api/dev/test-email` route when `NODE_ENV=development`.
- feat(forms): Form-specific fields and structural fixes site-wide - Contact: Subject/Inquiry Type, wrap in form; Volunteer: Area of Interest, Availability, Skills textarea, wrap in form; Donation Statement: client component with custom-period toggle, dynamic year labels, conditional mailing address; Change of Address: structured address (street, city, state, zip), optional What changed?; Request Facility: Start/End time, Number of Guests required, API-aligned field names; Puja Sponsorships: Names for Sankalpam, optional file upload, Puja to Sponsor (pujaId), API/FRD aligned; Feedback: Category required; Email Subscription: optional unsubscribe reason; Newsletter: optional event-updates checkbox. New `DonationStatementForm` client component in `frontend/src/components/forms/DonationStatementForm.tsx`.
- feat(assets): Asset folder structure and segregation script per Assets Building Plan - `frontend/public/images/{og,hero,home,deities,festivals,temple,gallery}/`, `frontend/public/uploads/`, `frontend/public/pdf/newsletters/`, `frontend/scripts/segregate-assets.mjs`, `frontend/scripts/asset-mapping.example.json`, `pnpm run segregate-assets`
- docs(assets): Added ASSET_PROMPTS.md with prompts, filenames, resolution, and aspect ratio for all assets - `docs/assets/ASSET_PROMPTS.md`
- feat(audio): Site-wide Om ambient sound with mute toggle - `frontend/public/audio/om.mp3`, `OmAudioContext`, `AudioToggle`, persisted in localStorage
- feat(assets): Wired uploaded assets into site - new logo (logo.png), OG default image, home hero and event cards, deity images, festival images, temple virtual-visit images
- Initial project setup with Next.js and Express
- Database schema with PostgreSQL
- Event Calendar feature
- Recurring Donations feature
- Puja Sponsorship Forms feature
- User Role Management feature
- Newsletter Archives feature

### Changed
- refactor(backend): API index mounts `/api/v1`, `/api/admin`; server mounts `/webhooks/stripe` with express.raw before express.json.
- refactor(frontend): Puja-sponsorship, facility-request, donation-statement, change-of-address, email-subscription form pages use new client form components; placeholder notes updated.
- refactor(frontend): Header uses `VISHNUMANDIR LOGO (3).png`; reduced size and fit inside header (h-12/h-14, w-36/w-44); SEO org logo updated to same

### Fixed
- fix(header): Fixed logo not loading by renaming file and updating references - Renamed `VISHNUMANDIR LOGO (3).png` to `vishnumandir-logo.png` to avoid URL encoding issues - Updated Header component and SEO utility to use new filename without URL encoding - `frontend/public/images/vishnumandir-logo.png`, `frontend/src/components/layout/header/Header.tsx`, `frontend/src/lib/seo.ts`
- fix(cultural): Added Music icon import and ImageIcon alias in media page - `frontend/src/app/(site)/cultural/media/page.tsx`
- fix(frontend): Downgraded Tailwind CSS from v4 to v3.4.19 to fix configuration compatibility - `frontend/package.json`, `frontend/postcss.config.mjs`
- fix(backend): Updated @prisma/client dependency from workspace reference to direct version - `backend/package.json`

---

## [0.4.0] - 2026-01-25

### Added
- feat(monorepo): Initialized pnpm monorepo workspace structure with frontend and backend workspaces - `package.json`, `pnpm-workspace.yaml`
- feat(monorepo): Created root workspace configuration with dev, build, and typecheck scripts - `package.json`
- feat(infrastructure): Added Docker Compose configuration for local PostgreSQL database - `docker-compose.yml`
- feat(infrastructure): Created comprehensive .gitignore file for monorepo structure - `.gitignore`
- feat(frontend): Scaffolded Next.js 14+ application with TypeScript, Tailwind CSS, and App Router - `frontend/` workspace
- feat(frontend): Configured Tailwind CSS with design tokens (colors, fonts, spacing, shadows) from brand guide - `frontend/tailwind.config.ts`
- feat(frontend): Set up Lora (serif) and Lato (sans-serif) fonts using next/font/google - `frontend/src/app/layout.tsx`
- feat(frontend): Created global CSS with Tailwind base layers - `frontend/src/app/globals.css`
- feat(frontend): Integrated logo and tagline images into public assets - `frontend/public/images/logo.png`, `frontend/public/images/tagline.png`
- feat(components): Created Header component with logo, tagline, and navigation - `frontend/src/components/layout/header/Header.tsx`
- feat(components): Created Footer component with quick links, connect section, and legal links - `frontend/src/components/layout/footer/Footer.tsx`
- feat(layout): Created public site layout wrapper with Header and Footer - `frontend/src/app/(site)/layout.tsx`
- feat(pages): Created homepage with hero section, announcements, upcoming events, and quick links - `frontend/src/app/(site)/page.tsx`
- feat(database): Initialized Prisma schema with User, Event, Donation, PujaSponsorship, FacilityRequest, and Newsletter models - `prisma/schema.prisma`
- feat(backend): Scaffolded Express.js backend with TypeScript in separate workspace - `backend/` workspace
- feat(backend): Created Express server with CORS, Morgan logging, and error handling middleware - `backend/src/server.ts`
- feat(backend): Set up Prisma client singleton for backend use - `backend/src/utils/prisma.client.ts`
- feat(backend): Created CORS configuration for frontend communication - `backend/src/config/corsOptions.ts`
- feat(backend): Implemented global error handling middleware - `backend/src/middleware/error.middleware.ts`
- feat(backend): Created API routes structure with health check endpoint - `backend/src/api/index.ts`
- feat(backend): Set up TypeScript configuration for backend - `backend/tsconfig.json`
- feat(backend): Configured nodemon for development hot-reloading - `backend/nodemon.json`
- feat(config): Created comprehensive .env.example with all required environment variables - `.env.example`

### Changed
- refactor(rules): Updated .cursorrules to reflect monorepo structure with frontend/backend workspaces - `.cursorrules` Section 2, 3, 7
- refactor(rules): Updated file structure documentation to show monorepo layout - `.cursorrules` Section 3
- refactor(rules): Updated backend development section to reflect Express.js in separate workspace - `.cursorrules` Section 7
- refactor(rules): Updated Prisma client location documentation to backend workspace - `.cursorrules` Section 8
- refactor(rules): Updated Server Components example to show API calls instead of direct Prisma access - `.cursorrules` Section 5

### Fixed
- N/A

---

## [0.3.0] - 2026-01-25

### Added
- docs(rules): TypeScript deployment patterns section with Express type augmentation, req.params handling, Zod patterns, and Stripe API version management - `.cursorrules` Section 24
- docs(rules): Deployment troubleshooting section covering AWS Amplify, Prisma, and common build issues - `.cursorrules` Section 25
- types(express): Express Request type augmentation file for req.user property - `types/express.d.ts`
- types(auth): Authentication type definitions including AuthRequest interface and CognitoJwtPayload - `types/auth.d.ts`
- docs(deployment): Deployment checklist with pre-deployment, build, and post-deployment verification steps - `docs/deployment/DEPLOYMENT_CHECKLIST.md`
- docs(deployment): Troubleshooting guide with solutions for common TypeScript, Amplify, Prisma, and environment variable issues - `docs/deployment/TROUBLESHOOTING.md`

### Changed
- docs(rules): Enhanced Prisma guidelines with SSL connection requirements, build process, and migration workflow - `.cursorrules` Section 8
- docs(rules): Enhanced environment variables section with PostgreSQL SSL format and AWS Amplify-specific configuration notes - `.cursorrules` Section 20
- docs(rules): Enhanced deployment section with build configuration, common issues, and troubleshooting - `.cursorrules` Section 21

### Fixed
- N/A

---

## [0.2.0] - 2026-01-25

### Added
- docs(rules): Comprehensive project rules file (`.cursorrules`) consolidating all documentation - `.cursorrules`
- docs(changelog): Standardized CHANGELOG.md format with mandatory update requirements - `CHANGELOG.md`
- docs(workflow): Integrated changelog tracking into development workflow rules - `.cursorrules`

### Changed
- docs(changelog): Standardized changelog format to follow Keep a Changelog specification - `CHANGELOG.md`
- docs(rules): Enhanced `.cursorrules` with comprehensive project context, architecture, coding standards, and workflows - `.cursorrules`

---

## [0.1.0] - 2026-01-25

### Added
- Project documentation generated by Web Doc AI
- Initial architecture and tech stack decisions
- Core feature specifications

---

## Changelog Entry Format

When adding entries to this changelog, use the following format:

```markdown
### Added
- <type>(<scope>): <description> - <files changed>

### Changed
- <type>(<scope>): <description> - <files changed>

### Fixed
- <type>(<scope>): <description> - <files changed>

### Security
- security(<scope>): <description> - <files changed>
```

**Type Prefixes (Conventional Commits):**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `security`: Security improvements

**Examples:**
```markdown
### Added
- feat(components): Created PujaServiceCard component - components/ui/PujaServiceCard.tsx
- feat(api): Added POST /api/donations endpoint with Stripe integration - app/api/donations/route.ts

### Changed
- refactor(lib): Moved date formatting to lib/utils.ts - lib/utils.ts

### Fixed
- fix(forms): Corrected email validation in sponsorship form - components/forms/SponsorshipForm.tsx

### Security
- security(api): Added webhook signature verification for Stripe - app/api/webhooks/stripe/route.ts
```

---

## When to Update This Changelog

Update this changelog for:
- ✅ New component creation
- ✅ API endpoint addition/modification
- ✅ Database schema changes
- ✅ Configuration updates
- ✅ Bug fixes
- ✅ Refactoring
- ✅ Documentation updates
- ✅ Dependency updates (major versions)
- ✅ Security improvements

**This is MANDATORY for all changes.** See `.cursorrules` Section 17 for complete requirements.
