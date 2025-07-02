"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import Footer from "@/components/common/layout/footer";
import HeroHeader from "@/components/common/partials/HeroHeader";
import ListingFilters, { PROPERTY_OFFER_TYPE } from "@/modules/properties/components/partials/ListingFilters";
import PropertyItemListing from "@/modules/properties/components/partials/PropertyItemListing";

import { type SortParam, type FilterParam, type GridFilterItem, GridLinkOperator } from "@/common/hooks/useItems";
import useProperties from "@/modules/properties/hooks/api/useProperties";
import type { PaginationMeta } from "@/common/hooks/useItems";
import type { Property, PROPERTY_TYPE } from "@/modules/properties/defs/types";
import { Grid, Home } from "lucide-react";
import Routes from "@/common/defs/routes";

const PropertiesListing = () => {
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState<"default" | "priceLowHigh" | "priceHighLow">("default");
  const [data, setData] = useState<Property[] | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [propertyType, setPropertyType] = useState<PROPERTY_TYPE | "All">("All");
  const [propertyStatus, setPropertyStatus] = useState<PROPERTY_OFFER_TYPE>(PROPERTY_OFFER_TYPE.All);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000_000]);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<string>("");
  const [propertySize, setPropertySize] = useState<[number, number]>([0, 1000]);

  const { readAll } = useProperties();

  const sortParam = useMemo<SortParam | undefined>(() => {
    if (sortBy === "priceLowHigh") return { column: "sale_price", dir: "asc" };
    if (sortBy === "priceHighLow") return { column: "sale_price", dir: "desc" };
    return undefined;
  }, [sortBy]);

  const buildFilter = (): FilterParam | undefined => {
    try {
      const items: GridFilterItem[] = [];

      if (propertyType !== "All") {
        items.push({
          columnField: "type",
          operatorValue: "equals",
          value: propertyType,
        });
      }

      if (searchQuery.trim()) {
        items.push({
          columnField: "title",
          operatorValue: "contains",
          value: searchQuery.trim(),
        });
      }

      if (location) {
        items.push({
          columnField: "location.city",
          operatorValue: "equals",
          value: location,
        });
      }

      if (items.length === 0) return undefined;

      return {
        items,
        linkOperator: GridLinkOperator.And,
      };

    } catch (e) {
      console.error("🚨 buildFilter threw:", e);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const filter = buildFilter();

      const response = await readAll(
        1,
        itemsPerPage,
        sortParam,
        filter
      );

      if (response.data) {
        setData(response.data.items ?? []);
        setMeta(response.data.meta ?? null);
      }
    } catch (e) {
      console.error("Error fetching properties:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchProperties()
  }, [
    itemsPerPage,
    sortParam,
    propertyType,
    propertyStatus,
    priceRange,
    searchQuery,
    location,
    propertySize,
  ]);

  return (
    <div className="min-h-screen w-full">
      {/* Hero + floating filters */}
      <div className="relative pt-16 md:pt-[75px]">
        <HeroHeader
          title="Properties listing"
          image="/Properties_hero.jpg"
          className="pb-24"
        />

        <div className="absolute bottom-[-20px] left-0 w-full transform translate-y-1/2 z-20">
          <ListingFilters
            sortBy={sortBy}
            setSortBy={setSortBy}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            propertyStatus={propertyStatus}
            setPropertyStatus={setPropertyStatus}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            location={location}
            setLocation={setLocation}
            propertySize={propertySize}
            setPropertySize={setPropertySize}
          />
        </div>
      </div>

      {/* Results */}
      <div className="relative z-10 bg-[#faf8f5] pt-48 pb-20">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primarySite border-t-transparent" />
            <h3 className="text-xl font-semibold text-gray-700">
              Finding Perfect Properties
            </h3>
          </div>
        ) : data && data.length > 0 ? (
          <div className="max-w-screen-2xl mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((item) => (
              <Link key={item.id} href={Routes.Properties.ReadOne.replace("{id}", item.id.toString())}>
                <PropertyItemListing property={item} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
            <div className="bg-primarySite/10 p-6 rounded-full">
              <Home className="w-16 h-16 text-primarySite" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">No Properties Found</h3>
            <p className="text-gray-600 max-w-md">
              We couldn't find any properties matching your criteria. Try adjusting
              your filters or search terms.
            </p>
            <button
              onClick={() => {
                // clear everything
                setPropertyType("All");
                setPropertyStatus(PROPERTY_OFFER_TYPE.All);
                setPriceRange([0, 10_000_000]);
                setBedrooms(0);
                setBathrooms(0);
                setSearchQuery("");
                setLocation("");
                setPropertySize([0, 1000]);
              }}
              className="mt-4 px-6 py-3 bg-primarySite text-white rounded-lg hover:bg-primarySite/90 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesListing;
