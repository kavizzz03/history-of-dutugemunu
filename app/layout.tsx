import type { Metadata, Viewport } from "next";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/cinzel/900.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/noto-sans-sinhala/400.css";
import "@fontsource/noto-sans-sinhala/500.css";
import "@fontsource/noto-sans-sinhala/700.css";
import "@fontsource/noto-serif-sinhala/500.css";
import "@fontsource/noto-serif-sinhala/700.css";
import "@fontsource/noto-serif-sinhala/900.css";
import "./globals.css";
import { SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s · ${SITE.name} · ${SITE.nameSi}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: SITE.keywords,
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  publisher: SITE.author,
  category: "history",
  alternates: { canonical: "/" },
  // icons (app/icon.svg, app/favicon.ico, app/apple-icon.png), the web manifest and the share images
  // (app/opengraph-image.png, app/twitter-image.png) are picked up automatically from the app folder
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${SITE.name} · ${SITE.nameSi}`,
    title: SITE.title,
    description: SITE.description,
    locale: "en_US",
    alternateLocale: ["si_LK"],
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.shortDescription },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0907",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* structured data: tells search engines what the site is, who made it and which languages it is in */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.name,
      alternateName: [SITE.nameSi, "King Dutugemunu"],
      description: SITE.description,
      inLanguage: ["en", "si"],
      author: { "@id": `${SITE_URL}/#author` },
      publisher: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#author`,
      name: SITE.author,
    },
    {
      "@type": "CreativeWork",
      "@id": `${SITE_URL}/#work`,
      name: SITE.title,
      description: SITE.description,
      url: SITE_URL,
      inLanguage: ["en", "si"],
      about: [
        { "@type": "Person", name: "Dutugemunu", alternateName: SITE.nameSi, description: "King of Sri Lanka, 2nd century BCE" },
        { "@type": "Book", name: "Mahavamsa", alternateName: "මහාවංසය" },
        { "@type": "Place", name: "Anuradhapura" },
      ],
      genre: ["History", "Interactive story"],
      author: { "@id": `${SITE_URL}/#author` },
      copyrightHolder: { "@id": `${SITE_URL}/#author` },
      copyrightYear: 2026,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
