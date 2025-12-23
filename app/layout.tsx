import type { Metadata } from "next";
import { Montserrat, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/common/providers/AppProviders";
import LayoutContent from "./LayoutContent";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE, SEO_BRAND, SITE_NAME } from "@/common/seo/config";
import { SUPPORTED_LOCALES } from "@/common/seo/config";
import { getBaseUrl } from "@/common/seo/config";

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
  title: {
    template: "%s | " + SITE_NAME,
    default: SITE_NAME,
  },
  description: DEFAULT_DESCRIPTION,
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
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: getBaseUrl(),
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    images: [DEFAULT_TWITTER_IMAGE],
  },
  alternates: {
    canonical: getBaseUrl(),
    languages: SUPPORTED_LOCALES.reduce((acc, locale) => {
      acc[locale] = `${getBaseUrl()}/${locale}`;
      return acc;
    }, {} as Record<string, string>),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${montserrat.variable} ${notoKufiArabic.variable}`}>
      <body className="antialiased">
        <AppProviders>
          <LayoutContent>{children}</LayoutContent>
        </AppProviders>
      </body>
    </html>
  );
}
