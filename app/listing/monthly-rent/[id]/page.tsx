import type { Metadata } from "next";
import PropertyShowcase from "@/modules/properties/components/partials/PropertyShowcase";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { buildCanonical } from "@/common/seo/url";
import AppRoutes from "@/common/defs/routes";
import { buildPropertyMetadata } from "@/common/seo/builders/property";
import { fetchProperty } from "@/common/seo/fetchers";
import { detectRequestLocale } from "@/common/seo/locale";
import { generatePropertyJsonLd } from "@/common/seo/utils/property-helpers";
import JsonLd from "@/common/seo/jsonld/components";

export const revalidate = 300;

type Params = { params: { id: string } };

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const property = await fetchProperty(params.id, locale);
  const meta = buildPropertyMetadata(property, WEBSITE_FOCUS.RENT, locale);

  const canonical = buildCanonical(AppRoutes.Properties.MonthlyRent.ReadOne.replace('{id}', params.id));

  return {
    title: meta.title,
    description: meta.description,
    openGraph: meta.openGraph,
    twitter: meta.twitter,
    alternates: {
      canonical,
    },
  };
};

export default async function Page({ params }: Params) {
  // Fetch property for JSON-LD only
  const locale = detectRequestLocale();
  const property = await fetchProperty(params.id, locale);
  const { propertyJsonLd, breadcrumbJsonLd, propertyId, breadcrumbId } = generatePropertyJsonLd(
    property,
    params.id,
    WEBSITE_FOCUS.RENT,
    locale
  );
  
  return (
    <>
      {propertyJsonLd && <JsonLd id={propertyId} data={propertyJsonLd} />}
      <JsonLd id={breadcrumbId} data={breadcrumbJsonLd} />
      <PropertyShowcase websiteFocus={WEBSITE_FOCUS.RENT} />
    </>
  );
}
