import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://vishnumandirtampa.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Vishnu Mandir, Tampa - Hindu Temple & Community Center",
  description:
    "Welcome to Vishnu Mandir, Tampa. View puja schedules, events, and make donations.",
  openGraph: {
    images: [{ url: "/images/og/og-default.webp", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Avoid build-time Google Fonts downloads (next/font/google) so builds work in restricted CI/envs. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:wght@400;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased">
        {children}
        <Script
          src="https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js"
          strategy="afterInteractive"
        />
        {/* Initialize Zeffy buttons after script loads */}
        <Script
          id="zeffy-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const initZeffy = () => {
                  if (window.Zeffy) {
                    window.Zeffy.bind?.();
                    window.dispatchEvent(new Event('zeffy-script-loaded'));
                  }
                };
                
                // Try immediately
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initZeffy);
                } else {
                  setTimeout(initZeffy, 100);
                }
                
                // Also check periodically
                let attempts = 0;
                const checkInterval = setInterval(() => {
                  initZeffy();
                  attempts++;
                  if (attempts > 50) clearInterval(checkInterval);
                }, 100);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
