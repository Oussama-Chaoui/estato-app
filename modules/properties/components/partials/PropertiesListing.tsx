"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import Footer from "@/components/common/layout/footer";
import HeroHeader from "@/components/common/partials/HeroHeader";
import PropertyItemListing from "@/modules/properties/components/partials/PropertyItemListing";
import PropertyItemSkeleton from "@/modules/properties/components/partials/PropertyItemSkeleton";
import DailyPropertiesFilter from "@/modules/properties/components/partials/DailyPropertiesFilter";
import MonthlyPropertiesFilter from "@/modules/properties/components/partials/MonthlyPropertiesFilter";
import SalePropertiesFilter from "@/modules/properties/components/partials/SalePropertiesFilter";
import Pagination from "@/components/ui/pagination";

import useProperties from "@/modules/properties/hooks/api/useProperties";
import type { PaginationMeta } from "@/common/hooks/useItems";
import type { Property, FURNISHING_STATUS } from "@/modules/properties/defs/types";
import { Home } from "lucide-react";
import Routes from "@/common/defs/routes";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { useTranslation } from "next-i18next";

interface PropertiesListingProps {
  websiteFocus: WEBSITE_FOCUS;
  initialData?: {
    items: Property[];
    meta: PaginationMeta | null;
    page: number;
    pageSize: number;
  };
}

const PropertiesListing = ({ websiteFocus, initialData }: PropertiesListingProps) => {
  const { t } = useTranslation('properties');
  const [data, setData] = useState<Property[] | null>(initialData?.items ?? null);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialData?.meta ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [currentPage, setCurrentPage] = useState(initialData?.page ?? 1);
  const [pageSize] = useState(initialData?.pageSize ?? 12);

  const { searchPropertiesByfilters } = useProperties();
  const filterRef = useRef<any>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (initialData) {
      // Skip initial fetch; already hydrated from server
      console.log('initialData with filter', initialData);
      return;
    }
    const urlLocation = searchParams.get('location');
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    const urlPropertyType = searchParams.get('propertyType');

    setCurrentPage(1);

    if (urlLocation || urlCheckIn || urlCheckOut || urlPropertyType) {
      handleSearch({
        location: urlLocation || undefined,
        checkIn: urlCheckIn ? new Date(urlCheckIn) : undefined,
        checkOut: urlCheckOut ? new Date(urlCheckOut) : undefined,
        propertyType: urlPropertyType || undefined,
        websiteFocus: websiteFocus,
      });
    } else {
      handleSearch({
        websiteFocus: websiteFocus,
      });
    }
  }, [searchParams, websiteFocus, initialData]);

  useEffect(() => {
    if (initialData) {
      return;
    }
    const urlLocation = searchParams.get('location');
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    const urlPropertyType = searchParams.get('propertyType');

    if (urlLocation || urlCheckIn || urlCheckOut || urlPropertyType) {
      handleSearch({
        location: urlLocation || undefined,
        checkIn: urlCheckIn ? new Date(urlCheckIn) : undefined,
        checkOut: urlCheckOut ? new Date(urlCheckOut) : undefined,
        propertyType: urlPropertyType || undefined,
        websiteFocus: websiteFocus,
      });
    } else {
      handleSearch({
        websiteFocus: websiteFocus,
      });
    }
  }, [currentPage, initialData]);

  const getReadOneRoute = (propertyId: string | number) => {
    if (pathname.includes('/daily-rent')) {
      return Routes.Properties.DailyRent.ReadOne.replace("{id}", propertyId.toString());
    } else if (pathname.includes('/monthly-rent')) {
      return Routes.Properties.MonthlyRent.ReadOne.replace("{id}", propertyId.toString());
    } else if (pathname.includes('/home-sale')) {
      return Routes.Properties.HomeSale.ReadOne.replace("{id}", propertyId.toString());
    }
    return Routes.Properties.DailyRent.ReadOne.replace("{id}", propertyId.toString());
  };

  const handleSearch = async (inputs: {
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    availableFrom?: Date;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    furnishingStatus?: FURNISHING_STATUS;
    websiteFocus?: WEBSITE_FOCUS;
  }) => {
    setLoading(true);
    try {
      const response = await searchPropertiesByfilters(inputs, currentPage, pageSize);

      if (response.success && response.data) {
        setData(response.data.items);
        setMeta({
          currentPage: response.data.meta.currentPage,
          lastPage: response.data.meta.lastPage,
          totalItems: response.data.meta.total,
        });
      } else {
        setData([]);
        setMeta(null);
      }
    } catch (error) {
      setData([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="min-h-screen w-full">
      {/* Hero + floating filters */}
      <div className="relative pt-16 md:pt-[75px]">
        <HeroHeader
          title={t('listing.title')}
          image="/Properties_hero.jpg"
          className="pb-24"
        />

        <div className="absolute top-[78%] md:top-[90%] left-0 w-full z-20">
          {websiteFocus === WEBSITE_FOCUS.RENT ? (
            <MonthlyPropertiesFilter
              ref={filterRef}
              onSearch={handleSearch}
              initialLocation={searchParams.get('location') || undefined}
              initialAvailableFrom={searchParams.get('availableFrom') || undefined}
              initialPropertyType={searchParams.get('propertyType') || undefined}
              initialFurnishingStatus={searchParams.get('furnishingStatus') as FURNISHING_STATUS || undefined}
              websiteFocus={websiteFocus}
            />
          ) : websiteFocus === WEBSITE_FOCUS.SELLING ? (
            <SalePropertiesFilter
              ref={filterRef}
              onSearch={handleSearch}
              initialLocation={searchParams.get('location') || undefined}
              initialPropertyType={searchParams.get('propertyType') || undefined}
              initialMinArea={searchParams.get('minArea') ? parseInt(searchParams.get('minArea')!) : undefined}
              initialMaxArea={searchParams.get('maxArea') ? parseInt(searchParams.get('maxArea')!) : undefined}
              websiteFocus={websiteFocus}
            />
          ) : (
            <DailyPropertiesFilter
              ref={filterRef}
              onSearch={handleSearch}
              initialLocation={searchParams.get('location') || undefined}
              initialCheckIn={searchParams.get('checkIn') || undefined}
              initialCheckOut={searchParams.get('checkOut') || undefined}
              initialPropertyType={searchParams.get('propertyType') || undefined}
              websiteFocus={websiteFocus}
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="relative z-10 bg-gradient-to-br from-primary-200/50 via-white to-primary-200/30 pt-32 pb-20">
        {loading ? (
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-full max-w-sm sm:max-w-none">
                <PropertyItemSkeleton />
              </div>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {data.map((item) => (
                <Link key={item.id} href={getReadOneRoute(item.id)} className="w-full max-w-sm sm:max-w-none">
                  <PropertyItemListing property={item} websiteFocus={websiteFocus} />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta && data && data.length > 0 && (
              <div className="max-w-screen-5xl mx-auto px-4 sm:px-6 pt-20">
                <Pagination
                  currentPage={meta.currentPage}
                  totalPages={meta.lastPage}
                  onPageChange={handlePageChange}
                  className="py-4"
                />
              </div>
            )}
          </>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
            <div className="bg-primary-100 p-6 rounded-full">
              <Home className="w-16 h-16 text-primary-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">{t('listing.empty_state.title')}</h3>
            <p className="text-gray-600 max-w-md">
              {t('listing.empty_state.description')}
            </p>
            <button
              onClick={() => { filterRef.current.clearFilters(); }}
              className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              {t('listing.empty_state.clear_filters')}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesListing;
