import type { Metadata } from "next";
import LandingClient from "./LandingClient";
import { DEFAULT_DESCRIPTION } from "@/common/seo/config";
import { buildCanonical } from "@/common/seo/url";
import Routes from "@/common/defs/routes";
import { detectRequestLocale } from "@/common/seo/locale";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/common/seo/jsonld/builders";
import JsonLd from "@/common/seo/jsonld/components";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const titleByLocale = {
    fr: 'Accueil',
    en: 'Home',
    es: 'Inicio',
    ar: 'الرئيسية',
  };

  const title = titleByLocale[locale] || titleByLocale.fr;
  const description = DEFAULT_DESCRIPTION;
  const canonical = buildCanonical(Routes.Common.Home);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
    alternates: {
      canonical,
    },
  };
};

export default function Page() {
  const locale = detectRequestLocale();

  // Build JSON-LD structured data for landing page
  const organizationJsonLd = buildOrganizationJsonLd(locale);
  const websiteJsonLd = buildWebSiteJsonLd(locale);

  return (
    <>
      <JsonLd id="ld-organization" data={organizationJsonLd} />
      <JsonLd id="ld-website" data={websiteJsonLd} />
      <LandingClient />
    </>
  );
}
