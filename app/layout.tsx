import type { Metadata } from "next";
import { Montserrat, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/common/providers/AppProviders";
import LayoutContent from "./LayoutContent";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_IMAGE,
  SEO_BRAND,
  SITE_NAME,
  getBaseUrl,
} from "@/common/seo/config";
import FaviconSwitcher from "@/components/common/FaviconSwitcher";

const baseUrl = getBaseUrl();
const ogImageUrl = DEFAULT_OG_IMAGE.startsWith('http')
  ? DEFAULT_OG_IMAGE
  : `${baseUrl}${DEFAULT_OG_IMAGE.startsWith('/') ? '' : '/'}${DEFAULT_OG_IMAGE}`;
const twitterImageUrl = DEFAULT_TWITTER_IMAGE.startsWith('http')
  ? DEFAULT_TWITTER_IMAGE
  : `${baseUrl}${DEFAULT_TWITTER_IMAGE.startsWith('/') ? '' : '/'}${DEFAULT_TWITTER_IMAGE}`;

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kufi-arabic",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | " + SITE_NAME,
    default: SITE_NAME,
  },
  applicationName: SITE_NAME,
  description: DEFAULT_DESCRIPTION,

  icons: {
    icon: [
      { url: "/favicon-dark.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-light.ico", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-dark.ico" },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "MA",
    "geo.placename": "Martil, Morocco",
    "geo.position": "35.6167;-5.2752",
    ICBM: "35.6167, -5.2752",
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: baseUrl,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SEO_BRAND.twitterHandle,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [twitterImageUrl],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${montserrat.variable} ${notoKufiArabic.variable}`}>
      <body className="antialiased">
        <FaviconSwitcher />
        <AppProviders>
          <LayoutContent>{children}</LayoutContent>
        </AppProviders>
      </body>
    </html>
  );
}
