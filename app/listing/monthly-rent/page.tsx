import type { Metadata } from "next";
import PropertiesListing from "@/modules/properties/components/partials/PropertiesListing";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { buildCanonical, buildAlternates } from "@/common/seo/url";
import AppRoutes from "@/common/defs/routes";
import { buildListingMetadata } from "@/common/seo/builders/listing";
import { fetchListings, type ListingFilterInputs } from "@/common/seo/fetchers";
import { detectRequestLocale } from "@/common/seo/locale";
import { extractAllowedParams, parsePageNumber, buildFiltersFromParams } from "@/common/seo/utils/search-params";
import { generateListingJsonLd } from "@/common/seo/utils/jsonld-helpers";
import JsonLd from "@/common/seo/jsonld/components";

const MONTHLY_RENT_PARAMS = ["location", "propertyType", "availableFrom", "furnishingStatus", "page"];

export const generateMetadata = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const qs = extractAllowedParams(searchParams, MONTHLY_RENT_PARAMS);
  const page = parsePageNumber(qs);
  const filters = buildFiltersFromParams(qs, WEBSITE_FOCUS.RENT);
  
  const result = await fetchListings(filters as ListingFilterInputs, page, 12, locale);
  
  const canonical = buildCanonical(AppRoutes.Properties.MonthlyRent.ReadAll, qs, MONTHLY_RENT_PARAMS);
  const listingMeta = buildListingMetadata({
    locale,
    focus: WEBSITE_FOCUS.RENT,
    filters: { 
      location: filters.location || null, 
      propertyType: filters.propertyType || null 
    },
    total: result?.meta?.total ?? null,
  });

  return {
    title: listingMeta.title,
    description: listingMeta.description,
    alternates: {
      canonical,
      languages: buildAlternates(AppRoutes.Properties.MonthlyRent.ReadAll),
    },
  };
};

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Fetch first 12 items for JSON-LD only
  const locale = detectRequestLocale();
  const qs = extractAllowedParams(searchParams, MONTHLY_RENT_PARAMS);
  const page = parsePageNumber(qs);
  const filters = buildFiltersFromParams(qs, WEBSITE_FOCUS.RENT);
  
  const result = await fetchListings(filters as ListingFilterInputs, page, 12, locale);
  const { itemListJsonLd, breadcrumbJsonLd, itemListId, breadcrumbId } = generateListingJsonLd(
    result?.items || [],
    WEBSITE_FOCUS.RENT,
    page,
    locale
  );

  return (
    <>
      {itemListJsonLd && <JsonLd id={itemListId} data={itemListJsonLd} />}
      <JsonLd id={breadcrumbId} data={breadcrumbJsonLd} />
      <PropertiesListing websiteFocus={WEBSITE_FOCUS.RENT} />
    </>
  );
}
