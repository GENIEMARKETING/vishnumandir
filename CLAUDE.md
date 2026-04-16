# Project: Vishnu Mandir Tampa Website

## Goal & Scope
A full-stack temple website for Vishnu Mandir, Tampa (vishnumandirtampa.com) serving devotees with puja schedules, event calendars, cultural programs, donation/sponsorship flows, and facility requests. Admins manage all content through a Strapi CMS (cms.vishnumandirtampa.com). The site must handle traffic spikes during festivals and protect donor/PII data.

## Architecture Overview

```
frontend/       → Next.js 14 (App Router) — deployed on AWS Amplify
cms/            → Strapi v5 — deployed at cms.vishnumandirtampa.com (self-hosted)
backend/        → Express API — Node.js (legacy, form submissions now bypass this)
commerce/       → Medusa.js — e-commerce/shop layer
prisma/         → Shared Prisma schema (PostgreSQL via Supabase)
```

**Form submission flow (current):** Frontend Next.js API route → `strapi-submit.ts` → Strapi CMS REST API → stores in Supabase PostgreSQL via Strapi

**Content flow:** Strapi CMS REST API → Next.js server components (via `CMS_API_URL` + `CMS_API_TOKEN`)

## Key Decisions & Rules

- Form submissions go directly from Next.js API routes to Strapi (NOT through the Express backend). The `strapi-submit.ts` helper handles all CMS writes.
- All form API routes live at `frontend/src/app/api/v1/forms/` — one file per form type.
- CMS content types live in `cms/src/api/` — each has schema, controller, routes, and services folders.
- Strapi CMS uses Supabase PostgreSQL: `db.trxnmngubrguwyppmoow.supabase.co` (see `cms/.env`)
- The Express backend (`backend/`) is largely legacy — do not add new form logic there.
- Email notifications use Resend (API key in `.env.local` and `cms/.env`).
- Authentication: Strapi admin panel uses Strapi's built-in user management. Frontend admin portal uses Cognito (pool: `us-east-1_N3Kxkj933`).
- Styling: Tailwind CSS only — no inline styles.
- Color palette: Primary `#d97706` (amber), Secondary `#3b82f6` (blue), Accent `#facc15`, BG `#fefce8`, Text `#1f2937`.

## ⚠️ Active Issues (as of 2026-04-16)

### Issue 1: Form Submissions Failing in Production
**Error:** "Unable to submit request. Please call (813) 269-7262."
**Root cause:** `frontend/src/lib/strapi-submit.ts` reads `CMS_API_URL` from environment variables. In `.env.local` this is set to `http://localhost:1337/api`. In the AWS Amplify production deployment, **`CMS_API_URL` is NOT set** (or is still pointing to localhost), so form POSTs fail — Strapi is unreachable.

**Fix required:**
In AWS Amplify Console → App settings → Environment variables, add/update:
```
CMS_API_URL = https://cms.vishnumandirtampa.com/api
CMS_API_TOKEN = <valid full-access API token from production Strapi admin>
CMS_WRITE_TOKEN = <optional dedicated write token>
```
Then redeploy. `strapi-submit.ts` falls back to `CMS_WRITE_TOKEN` then `CMS_API_TOKEN`.

### Issue 2: Frontend Registrations Not Appearing in Strapi CMS
**Root cause:** Same as Issue 1. Form POSTs never reach Strapi because the API URL points to localhost. No data is being written to `cms.vishnumandirtampa.com`.

### Issue 3: CMS Login / Credentials Confusion
- **CMS admin login:** `ram@fatdogspirits.com` at `cms.vishnumandirtampa.com/admin`
- **`cms/.env`** uses dev placeholder keys (`APP_KEYS="devKey1,devKey2"`, `ADMIN_JWT_SECRET=devAdminJwtSecret`) — **these MUST be rotated to secure random values in production.**
- The `CMS_API_TOKEN` in `frontend/.env.local` was generated against a local Strapi instance and will NOT work against the production CMS. A new token must be generated from the production Strapi admin panel (Settings → API Tokens → Create new token).

## Environment Variables Reference

### frontend/.env.local (local dev)
| Variable | Purpose | Local Value |
|---|---|---|
| `CMS_API_URL` | Strapi REST API base URL | `http://localhost:1337/api` |
| `CMS_API_TOKEN` | Strapi auth token (server-side only) | long token string |
| `NEXT_PUBLIC_API_URL` | Express backend URL | `http://localhost:4000` |
| `NEXT_PUBLIC_API_KEY` | Public API key for form routes | matches `API_KEY` |
| `RESEND_API_KEY` | Resend email service | `re_QQZowkLr_...` |
| `ADMIN_EMAIL` | Frontend admin portal login | `vishnumandirtampa@gmail.com` |

### AWS Amplify Production (must match — currently MISSING CMS vars)
Same variables as above but with production values:
- `CMS_API_URL` → `https://cms.vishnumandirtampa.com/api`
- `CMS_API_TOKEN` → generated from production Strapi
- `NEXT_PUBLIC_API_URL` → production backend URL

### cms/.env (Strapi server)
| Variable | Purpose |
|---|---|
| `DATABASE_HOST` | `db.trxnmngubrguwyppmoow.supabase.co` (Supabase) |
| `DATABASE_PASSWORD` | `Vishnumandir2026@` |
| `RESEND_API_KEY` | Email for lifecycle hooks |
| `APP_KEYS`, `JWT_SECRET`, etc. | **MUST be real random values in production** |

## CMS Content Types (Strapi)
- `facility-request` — facility rental submissions
- `puja-sponsorship` — puja sponsorship forms
- `form-submission` — generic form catch-all
- `event` — temple events
- `announcement` — homepage announcements
- `newsletter` — newsletter archives
- `puja-service` — puja catalog (with pricing)
- `priest` — priest profiles
- `board-member` — board member profiles
- `page` — generic CMS pages

## Preferred Tools & Style
- **Stack:** TypeScript + Next.js 14 (App Router) + Tailwind CSS + Strapi v5 + Prisma + PostgreSQL (Supabase)
- **Package manager:** pnpm (workspace monorepo)
- **Email:** Resend (NOT SendGrid, NOT Nodemailer)
- **Payments:** Stripe (test keys currently; publishable `pk_test_51SsAfr...`)
- **Form validation:** Zod (preferred) — validate server-side in API route before calling `strapiCreate()`
- **Code style:** TypeScript strict, named exports, 2-space indent
- **CMS writes:** Always use `strapiCreate()` from `@/lib/strapi-submit` — never fetch Strapi directly from components
- **CMS reads:** Use `@/lib/strapi.ts` or `@/lib/strapi-utils.ts` server-side helpers

## Progress & Next Steps

### Completed
- Full Next.js frontend with all major pages (Home, Religious, Cultural, Education, Calendar, Forms, Shop)
- Strapi CMS set up with all content types defined
- Form API routes: facility-request, puja-sponsorship
- Email confirmation flow (Resend)
- Stripe integration (test mode)
- Medusa commerce layer
- AWS Amplify deployment pipeline

### Next Steps (Priority Order)
1. **URGENT: Fix production Amplify env vars** — add `CMS_API_URL` and `CMS_API_TOKEN` pointing to `cms.vishnumandirtampa.com`
2. **URGENT: Rotate CMS production secrets** — replace dev placeholder keys in `cms/.env` on server
3. **Generate a new Strapi API token** from production Strapi admin (Settings → API Tokens) and update Amplify env vars
4. Test all form submissions end-to-end in production after env fix
5. Verify email confirmations fire after successful Strapi write
6. Set up role-based access in Strapi (Admin, Editor, Finance, Event Manager)
7. Switch Stripe from test to live keys when ready for production payments
