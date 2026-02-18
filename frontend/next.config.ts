import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Explicit environment variable configuration for Lambda runtime
   * This ensures server-side variables are available in API routes when deployed on AWS Amplify
   * Variables without NEXT_PUBLIC_ prefix are server-side only and should be available in Lambda
   * 
   * Reference: https://nextjs.org/docs/app/api-reference/next-config-js/env
   */
  env: {
    // CMS configuration - CRITICAL for content fetching
    CMS_API_URL: process.env.CMS_API_URL,
    CMS_API_TOKEN: process.env.CMS_API_TOKEN,
    // Stripe configuration
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    // Cognito configuration
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    // Revalidation
    REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
    STRAPI_WEBHOOK_SECRET: process.env.STRAPI_WEBHOOK_SECRET,
    // Medusa Commerce configuration
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MEDUSA_API_URL: process.env.NEXT_PUBLIC_MEDUSA_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.vishnumandirtampa.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // Worship to Religious redirects
      {
        source: "/worship",
        destination: "/religious",
        permanent: true,
      },
      {
        source: "/worship/schedule",
        destination: "/religious/puja-schedule",
        permanent: true,
      },
      {
        source: "/worship/puja-services",
        destination: "/religious/puja-services",
        permanent: true,
      },
      {
        source: "/worship/festivals",
        destination: "/religious/festivals",
        permanent: true,
      },
      {
        source: "/worship/resources",
        destination: "/religious/prayer-books",
        permanent: true,
      },
      // Temple section redirects
      {
        source: "/temple/deities",
        destination: "/deities",
        permanent: true,
      },
      {
        source: "/temple/priests",
        destination: "/religious/priests",
        permanent: true,
      },
      {
        source: "/temple/about-us",
        destination: "/about/about",
        permanent: true,
      },
      {
        source: "/temple/contact",
        destination: "/about/contact",
        permanent: true,
      },
      // Community section redirects
      {
        source: "/community/education",
        destination: "/education/classes",
        permanent: true,
      },
      {
        source: "/community/volunteer",
        destination: "/about/volunteer",
        permanent: true,
      },
      {
        source: "/community/newsletter-archive",
        destination: "/calendar/newsletter",
        permanent: true,
      },
      // Support/Forms redirects
      {
        source: "/support/sponsor-a-puja",
        destination: "/forms/puja-sponsorships",
        permanent: true,
      },
      {
        source: "/support/facility-rental",
        destination: "/forms/request-facility",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
