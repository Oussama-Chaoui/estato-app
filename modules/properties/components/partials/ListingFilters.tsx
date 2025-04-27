"use client";
import React from "react";
import { MapPin, Home, DollarSign, Ruler, Calendar, ChevronDown, Grid, List, Search, House } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

interface ListingFiltersProps {
  view: string;
  setView: (view: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  totalResults: number;
  propertyType: string;
  setPropertyType: (type: string) => void;
  propertyStatus: string;
  setPropertyStatus: (status: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  bedrooms: number;
  setBedrooms: (value: number) => void;
  bathrooms: number;
  setBathrooms: (value: number) => void;
  selectedAmenities: number[];
  setSelectedAmenities: (amenities: number[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // New filter states
  location: string;
  setLocation: (location: string) => void;
  propertySize: [number, number];
  setPropertySize: (size: [number, number]) => void;
  yearBuilt: number;
  setYearBuilt: (year: number) => void;
}

const ListingFilters = ({
  view, setView,
  itemsPerPage, setItemsPerPage,
  sortBy, setSortBy,
  totalResults,
  propertyType, setPropertyType,
  propertyStatus, setPropertyStatus,
  priceRange, setPriceRange,
  bedrooms, setBedrooms,
  bathrooms, setBathrooms,
  selectedAmenities, setSelectedAmenities,
  searchQuery, setSearchQuery,
  location, setLocation,
  propertySize, setPropertySize,
  yearBuilt, setYearBuilt,
}: ListingFiltersProps) => {
  const propertyTypeOptions = [
    "Apartment", "Villa", "House", "Studio", "Commercial"
  ];
  return (
    <div className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 shadow-lg mx-auto -mt-12 relative z-20">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="relative mb-8 max-w-7xl mx-auto">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="
              w-full 
              pl-14        
              pr-32         
              py-6 
              rounded-xl 
              border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-primarySite/50 
              text-sm 
              bg-white/80
            "
          />
          {/* left pin icon */}
          <House className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />

          {/* search button inside the input */}
          <button
            onClick={() => {
              /* trigger search */
            }}
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
        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Location Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-primarySite transition-colors">
                <MapPin className="w-5 h-5 text-gray-600 mt-1.5" />
                <div className="flex-1 text-left">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                    Location
                  </div>
                  <div className="text-sm font-normal text-gray-800">
                    {location || "Anywhere"}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4">
              <input
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primarySite/50"
              />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Property Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-primarySite transition-colors">
                <Home className="w-5 h-5 text-gray-600 mt-1.5" />
                <div className="flex-1 text-left">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Type</div>
                  <div className="text-sm font-normal text-gray-800">
                    {propertyType || "Any Type"}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2">
              {propertyTypeOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => setPropertyType(type)}
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

          {/* Price Range Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-primarySite transition-colors">
                <DollarSign className="w-5 h-5 text-gray-600 mt-1.5" />
                <div className="flex-1 text-left">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Price</div>
                  <div className="text-sm font-normal text-gray-800">
                    {priceRange[0] > 0 || priceRange[1] < 10000000
                      ? `${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} MAD`
                      : "Any Price"}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={0}
                max={10000000}
                step={100000}
              />
              <div className="flex justify-between text-sm mt-3">
                <span>{priceRange[0].toLocaleString()} MAD</span>
                <span>{priceRange[1].toLocaleString()} MAD</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Property Size Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-primarySite transition-colors">
                <Ruler className="w-5 h-5 text-gray-600 mt-1.5" />
                <div className="flex-1 text-left">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Size</div>
                  <div className="text-sm font-normal text-gray-800">
                    {propertySize[0] > 0 || propertySize[1] < 1000
                      ? `${propertySize[0]} - ${propertySize[1]} m²`
                      : "Any Size"}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4">
              <Slider
                value={propertySize}
                onValueChange={(value) => setPropertySize(value as [number, number])}
                min={0}
                max={1000}
                step={10}
              />
              <div className="flex justify-between text-sm mt-3">
                <span>{propertySize[0]} m²</span>
                <span>{propertySize[1]} m²</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Build Year Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-primarySite transition-colors">
                <Calendar className="w-5 h-5 text-gray-600 mt-1.5" />
                <div className="flex-1 text-left">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Year Built</div>
                  <div className="text-sm font-normal text-gray-800">
                    {yearBuilt || "Any Year"}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 ml-auto text-gray-500 mt-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4">
              <input
                type="number"
                placeholder="Enter build year"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primarySite/50"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ListingFilters;