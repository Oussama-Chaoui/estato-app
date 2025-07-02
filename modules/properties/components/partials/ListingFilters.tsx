"use client";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MapPin, Home, DollarSign, Ruler, Calendar, ChevronDown, Grid, List, Search, House } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as SliderPrimitive from "@radix-ui/react-slider";
import useLocations from "@/modules/locations/hooks/api/useLocations";
import { PROPERTY_STATUS, PROPERTY_TYPE } from "../../defs/types";

export enum PROPERTY_OFFER_TYPE {
  All = 'all',
  Sale = 'sale',
  Monthly = 'monthly',
  Daily = 'daily',
}

interface ListingFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  propertyType: PROPERTY_TYPE | "All";
  setPropertyType: (type: PROPERTY_TYPE | "All") => void;
  propertyStatus: PROPERTY_OFFER_TYPE;
  setPropertyStatus: (status: PROPERTY_OFFER_TYPE) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: string;
  setLocation: (location: string) => void;
  propertySize: [number, number];
  setPropertySize: (size: [number, number]) => void;
}

const ListingFilters = ({
  sortBy, setSortBy,
  propertyType, setPropertyType,
  propertyStatus, setPropertyStatus,
  priceRange, setPriceRange,
  searchQuery, setSearchQuery,
  location, setLocation,
  propertySize, setPropertySize,
}: ListingFiltersProps) => {

  const { items: locations } = useLocations({ fetchItems: true, pageSize: 'all' });

  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);


  const [locationQuery, setLocationQuery] = useState("");

  const priceSliderMax = propertyStatus === "daily"
    ? 1500
    : propertyStatus === "monthly"
      ? 20000
      : 10000000;

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [isLocationOpen]);

  useEffect(() => {
    if (isLocationOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isLocationOpen]);

  useEffect(() => {
    setLocationQuery(location);
  }, [location]);

  useEffect(() => {
    setPriceRange([0, priceSliderMax]);
  }, [priceSliderMax, setPriceRange]);

  const sortedLocations = useMemo(() => {
    const seen = new Set<string>();
    return (locations ?? [])
      .filter(loc => !!loc.city?.trim())
      .sort((a, b) => a.city.localeCompare(b.city))
      .filter(loc => {
        if (seen.has(loc.city)) return false;
        seen.add(loc.city);
        return true;
      });
  }, [locations]);

  const filteredLocations = useMemo(
    () => sortedLocations.filter(loc =>
      loc.city.toLowerCase().includes(locationQuery.toLowerCase())
    ),
    [sortedLocations, locationQuery]
  );

  const propertyTypeOptions = Object
    .values(PROPERTY_TYPE)
    .map(type => (type.charAt(0).toUpperCase() + type.slice(1))) as PROPERTY_TYPE[];

  const priceModeOptions: { value: PROPERTY_OFFER_TYPE; label: string }[] = [
    { value: PROPERTY_OFFER_TYPE.Sale, label: "For Sale" },
    { value: PROPERTY_OFFER_TYPE.Monthly, label: "Monthly Rent" },
    { value: PROPERTY_OFFER_TYPE.Daily, label: "Daily Rent" },
  ];

  return (
    <div className="w-full px-4 space-y-0">
      {/* Search Bar Section */}
      <div className="max-w-[84rem] mx-auto">
        <div className="bg-white/50 backdrop-blur-sm border-gray-100 rounded-t-xl pt-6 pb-4 px-6">
          <div className="relative max-w-7xl mx-auto">
            <input
              type="text"
              placeholder="Search For A Property"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="
              w-full 
              pl-6        
              pr-32         
              py-6 
              rounded-xl 
              border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-primarySite/50 
              text-sm 
              bg-white/80
            "
            />
            <button
              onClick={() => {/* trigger search */ }}
              className="
              absolute right-3 top-1/2 transform -translate-y-1/2
              flex items-center gap-1
              px-3 py-3.5
              rounded-lg
              bg-primarySite/80 text-white
              hover:bg-primarySite/100
              transition
              text-xs font-semibold
            "
            >
              <Search className="w-5 h-5" />
              Find Property
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="max-w-[99rem] mx-auto">
        <div className="bg-white/50 backdrop-blur-sm border border-t-0 border-gray-100 shadow-lg rounded-b-xl pt-8 pb-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* Location Filter */}
            <DropdownMenu open={isLocationOpen}>
              <DropdownMenuTrigger asChild>
                <div
                  ref={triggerRef}
                  onPointerDown={(e) => {
                    if (!inputRef.current?.contains(e.target as Node)) {
                      setIsLocationOpen((prev) => !prev);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-primarySite transition-colors cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-gray-600" />

                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Anywhere"
                    value={locationQuery}
                    onFocus={() => setIsLocationOpen(true)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setLocationQuery(v);
                      if (v === "") setLocation("");
                      setIsLocationOpen(true);
                    }}
                    onMouseDownCapture={(e) => e.stopPropagation()}
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    onPointerUpCapture={(e) => e.stopPropagation()}
                    onClickCapture={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none"
                  />

                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="bottom"
                align="start"
                sideOffset={4}
                avoidCollisions={false}
                style={{ width: triggerWidth }}
                className="p-1 dropdown-content max-h-60 overflow-y-auto"
                onCloseAutoFocus={(e) => e.preventDefault()}
                onPointerDownOutside={() => setIsLocationOpen(false)}
              >
                {locationQuery && filteredLocations.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">No locations found</div>
                ) : (
                  (locationQuery ? filteredLocations : sortedLocations).map(loc => (
                    <DropdownMenuItem
                      key={loc.id}
                      onSelect={() => {
                        setLocation(loc.city);
                        setLocationQuery(loc.city);
                        setIsLocationOpen(false);
                        inputRef.current?.blur();
                      }}
                      className="px-3 py-2 hover:bg-gray-50 rounded-sm cursor-pointer"
                    >
                      {loc.city}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Property Type Filter */}
            <DropdownMenu
              open={isTypeOpen}
              onOpenChange={setIsTypeOpen}
            >
              <DropdownMenuTrigger asChild>
                <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-primarySite transition-colors">
                  <Home className="w-5 h-5 text-gray-600 mt-1.5" />
                  <div className="flex-1 text-left">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                      Type
                    </div>
                    <div className="text-sm font-normal text-gray-800">
                      {propertyType || "Any Type"}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-2" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <button
                  onClick={() => {
                    setPropertyType("All");
                    setIsTypeOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left rounded-lg hover:bg-gray-50",
                    propertyType === "All" && "bg-primarySite/10 text-primarySite"
                  )}
                >
                  Any Type
                </button>
                {propertyTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setPropertyType(type);
                      setIsTypeOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left rounded-lg hover:bg-gray-50",
                      propertyType === type && "bg-primarySite/10 text-primarySite"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Price Mode Filter */}
            <DropdownMenu
              open={isStatusOpen}
              onOpenChange={setIsStatusOpen}
            >
              <DropdownMenuTrigger asChild>
                <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-primarySite transition-colors">
                  <List className="w-5 h-5 text-gray-600 mt-1.5" />
                  <div className="flex-1 text-left">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                      Offer Type
                    </div>
                    <div className="text-sm font-normal text-gray-800">
                      {propertyStatus === PROPERTY_OFFER_TYPE.All
                        ? "Any"
                        : priceModeOptions.find(o => o.value === propertyStatus)?.label}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-2" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <button
                  onClick={() => { setPropertyStatus(PROPERTY_OFFER_TYPE.All); setIsStatusOpen(false); }}
                  className={cn(
                    "w-full px-4 py-2 text-left rounded-lg hover:bg-gray-50",
                    propertyStatus === PROPERTY_OFFER_TYPE.All && "bg-primarySite/10 text-primarySite"
                  )}
                >
                  Any
                </button>
                {priceModeOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => { setPropertyStatus(value); setIsStatusOpen(false); }}
                    className={cn(
                      "w-full px-4 py-2 text-left rounded-lg hover:bg-gray-50",
                      propertyStatus === value && "bg-primarySite/10 text-primarySite"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Price Range Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-primarySite transition-colors">
                  <DollarSign className="w-5 h-5 text-gray-600 mt-1.5" />
                  <div className="flex-1 text-left">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                      Price
                    </div>
                    <div className="text-sm font-normal text-gray-800">
                      {priceRange[0] > 0 || priceRange[1] < 10000000
                        ? `${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} MAD`
                        : "Any Price"}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-2" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4">
                <SliderPrimitive.Root
                  value={priceRange}
                  onValueChange={(val) => {
                    const [low, high] = val as [number, number];
                    const clampedHigh = Math.min(high, priceSliderMax);
                    setPriceRange([low, clampedHigh]);
                  }}
                  min={0}
                  max={priceSliderMax}
                  step={
                    propertyStatus === "daily" ? 50 :
                      propertyStatus === "monthly" ? 500 :
                        100_000
                  }
                  className="relative flex w-full touch-none select-none items-center"
                >
                  <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
                    <SliderPrimitive.Range className="absolute h-full bg-primarySite" />
                  </SliderPrimitive.Track>

                  {/* first thumb */}
                  <SliderPrimitive.Thumb asChild>
                    <div className="block h-4 w-4 rounded-full bg-white border-2 border-primarySite shadow-md focus:outline-none focus:ring-2 focus:ring-primarySite" />
                  </SliderPrimitive.Thumb>

                  {/* second thumb */}
                  <SliderPrimitive.Thumb asChild>
                    <div className="block h-4 w-4 rounded-full bg-white border-2 border-primarySite shadow-md focus:outline-none focus:ring-2 focus:ring-primarySite" />
                  </SliderPrimitive.Thumb>
                </SliderPrimitive.Root>

                <div className="flex justify-between text-sm mt-3">
                  <span>0 MAD</span>
                  <span>{priceSliderMax.toLocaleString()} MAD</span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Property Size Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-primarySite transition-colors">
                  <Ruler className="w-5 h-5 text-gray-600 mt-1.5" />
                  <div className="flex-1 text-left">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                      Size
                    </div>
                    <div className="text-sm font-normal text-gray-800">
                      {propertySize[0] > 0 || propertySize[1] < 1000
                        ? `${propertySize[0]} - ${propertySize[1]} m²`
                        : "Any Size"}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-2" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-4">
                <SliderPrimitive.Root
                  value={propertySize}
                  onValueChange={(val) => setPropertySize(val as [number, number])}
                  min={0}
                  max={1000}
                  step={10}
                  className="relative flex w-full touch-none select-none items-center"
                >
                  <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
                    <SliderPrimitive.Range className="absolute h-full bg-primarySite" />
                  </SliderPrimitive.Track>

                  <SliderPrimitive.Thumb asChild>
                    <div className="block h-4 w-4 rounded-full bg-white border-2 border-primarySite shadow-md focus:outline-none focus:ring-2 focus:ring-primarySite" />
                  </SliderPrimitive.Thumb>
                  <SliderPrimitive.Thumb asChild>
                    <div className="block h-4 w-4 rounded-full bg-white border-2 border-primarySite shadow-md focus:outline-none focus:ring-2 focus:ring-primarySite" />
                  </SliderPrimitive.Thumb>
                </SliderPrimitive.Root>

                <div className="flex justify-between text-sm mt-3">
                  <span>{propertySize[0]} m²</span>
                  <span>{propertySize[1]} m²</span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div >
      </div >
    </div >
  );
};

export default ListingFilters;