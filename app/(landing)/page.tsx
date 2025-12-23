import type { Metadata } from "next";
import LandingClient from "./LandingClient";
import { DEFAULT_DESCRIPTION } from "@/common/seo/config";
import { buildAlternates } from "@/common/seo/url";
import Routes from "@/common/defs/routes";
import { detectRequestLocale } from "@/common/seo/locale";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/common/seo/jsonld/builders";
import JsonLd from "@/common/seo/jsonld/components";

export const generateMetadata = async (): Promise<Metadata> => {
  // Static landing metadata for now; can be enhanced with server fetch of focus if needed
  const description = DEFAULT_DESCRIPTION;
  return {
    description,
    alternates: {
      languages: buildAlternates(Routes.Common.Home)
    }
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
