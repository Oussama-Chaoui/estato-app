"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import Footer from "@/components/common/layout/footer";
import HeroHeader from "@/components/common/partials/HeroHeader";
import ListingFilters from "@/modules/properties/components/partials/ListingFilters";
import PropertyItemListing from "@/modules/properties/components/partials/PropertyItemListing";

import type { SortParam } from "@/common/hooks/useItems";
import useProperties from "@/modules/properties/hooks/api/useProperties";
import type { PaginationMeta } from "@/common/hooks/useItems";
import type { Property, PROPERTY_TYPE, PROPERTY_STATUS } from "@/modules/properties/defs/types";

const PropertiesListing = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState<"default" | "priceLowHigh" | "priceHighLow">("default");
  const [data, setData] = useState<Property[] | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);

  // New filter states
  const [propertyType, setPropertyType] = useState<PROPERTY_TYPE | "all">("all");
  const [propertyStatus, setPropertyStatus] = useState<PROPERTY_STATUS | "all">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000_000]);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<string>("");
  const [propertySize, setPropertySize] = useState<[number, number]>([0, 1000]);
  const [yearBuilt, setYearBuilt] = useState<number>(() => new Date().getFullYear());

  const { readAll } = useProperties();

  const sortParam = useMemo<SortParam | undefined>(() => {
    if (sortBy === "priceLowHigh") return { column: "salePrice", dir: "asc" };
    if (sortBy === "priceHighLow") return { column: "salePrice", dir: "desc" };
    return undefined;
  }, [sortBy]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await readAll(
        1,
        itemsPerPage,
        sortParam,
        undefined
      );

      if (response.data) {
        setData(response.data.items ?? []);
        setMeta(response.data.meta ?? null);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    itemsPerPage,
    sortParam,
    propertyType,
    propertyStatus,
    priceRange,
    bedrooms,
    bathrooms,
    selectedAmenities,
    searchQuery
  ]);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with spacing for floating filters */}
      <div className="relative pt-16 md:pt-[75px]">
        <HeroHeader
          title="Properties listing"
          image="/hero.jpg"
          className="pb-24"
        />

        {/* Floating Filters */}
        <div className="absolute bottom-[-65px] left-0 w-full transform translate-y-1/2 z-20">

          <ListingFilters
            view={view}
            setView={setView}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalResults={meta?.totalItems ?? 0}
            // New filter props
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            propertyStatus={propertyStatus}
            setPropertyStatus={setPropertyStatus}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            location={location}
            setLocation={setLocation}
            propertySize={propertySize}
            setPropertySize={setPropertySize}
            yearBuilt={yearBuilt}
            setYearBuilt={setYearBuilt}
          />
        </div>
      </div>

      <div className="relative z-10 bg-[#faf8f5] pt-48 pb-20"> {/* Add top padding */}
        {loading ? (
          <p className="text-center py-8">Loading properties…</p>
        ) : data && data.length > 0 ? (
          <div
            className={
              view === "grid"
                ? "max-w-screen-2xl mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "max-w-screen-2xl mx-auto px-6 py-4 flex flex-col gap-6"
            }
          >
            {data.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`}>
                <PropertyItemListing property={item} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-8">No properties found.</p>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default PropertiesListing;
