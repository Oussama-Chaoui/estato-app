import React, { useState, useMemo, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { Search, MapPin, ChevronDown, ChevronUp, Home, Bed, Bath, Star, Wallet, Car, Building2, Eye, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useLocations from "@/modules/locations/hooks/api/useLocations";
import useAmenities from "@/modules/amenities/hooks/api/useAmenities";
import useProperties from "@/modules/properties/hooks/api/useProperties";
import { Label } from "@/components/ui/label";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { useTranslation } from "next-i18next";
import { getTranslatedAmenityName } from "@/modules/properties/utils/amenities";
import { useTranslatedText } from "@/modules/properties/utils/translations";
import { transformLocationsToOptions } from "@/modules/locations/utils/locationUtils";
import { motion, AnimatePresence } from "framer-motion";

interface SalePropertiesFilterProps {
  onSearch: (params: {
    location?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    garages?: number;
    floors?: number;
    amenities?: string[];
    websiteFocus?: WEBSITE_FOCUS;
  }) => void;
  initialLocation?: string;
  initialPropertyType?: string;
  initialMinArea?: number;
  initialMaxArea?: number;
  websiteFocus?: WEBSITE_FOCUS;
}

const SalePropertiesFilter = forwardRef<any, SalePropertiesFilterProps>(({
  onSearch,
  initialLocation,
  initialPropertyType,
  initialMinArea,
  initialMaxArea,
  websiteFocus = WEBSITE_FOCUS.SELLING
}, ref) => {
  const { t } = useTranslation(['properties', 'amenities']);
  const [location, setLocation] = useState(initialLocation || "");
  const [propertyType, setPropertyType] = useState(initialPropertyType || "");

  // Set price range based on website focus
  const getPriceRange = () => {
    switch (websiteFocus) {
      case WEBSITE_FOCUS.DAILY_RENT:
        return [0, 1000];
      case WEBSITE_FOCUS.RENT:
        return [0, 20000];
      case WEBSITE_FOCUS.SELLING:
        return [0, 10000000];
      default:
        return [0, 10000000];
    }
  };

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [isMaxPriceActive, setIsMaxPriceActive] = useState(false);
  const [areaRange, setAreaRange] = useState([initialMinArea || 0, initialMaxArea || 1000]);
  const [bedrooms, setBedrooms] = useState<number>();
  const [bathrooms, setBathrooms] = useState<number>();
  const [garages, setGarages] = useState<number>();
  const [floors, setFloors] = useState<number>();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { items: locations } = useLocations({ fetchItems: true, pageSize: 'all' });
  const { items: amenities } = useAmenities({ fetchItems: true, pageSize: 8 });
  const filterRef = useRef<HTMLDivElement>(null);
  const getTranslatedText = useTranslatedText();

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    // Main filters (always applied immediately)
    if (location) count++;
    if (propertyType) count++;

    // Advanced filters (only counted when not in advanced panel)
    if (!showAdvancedFilters) {
      if (minPrice > 0) count++;
      if (isMaxPriceActive && maxPrice !== null) count++;
      const maxArea = 1000;
      if (areaRange[0] > 0 || areaRange[1] < maxArea) count++;
      if (bedrooms !== undefined) count++;
      if (bathrooms !== undefined) count++;
      if (garages !== undefined) count++;
      if (floors !== undefined) count++;
      // Count each selected amenity as a separate filter
      count += selectedAmenities.length;
    }

    return count;
  }, [location, propertyType, minPrice, isMaxPriceActive, maxPrice, areaRange, bedrooms, bathrooms, garages, floors, selectedAmenities, websiteFocus, showAdvancedFilters]);

  // Handle click outside to close advanced filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (filterRef.current && !filterRef.current.contains(target)) {
        setShowAdvancedFilters(false);
      }
    };
    if (showAdvancedFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdvancedFilters]);

  const handleClearFilters = () => {
    // Animate the clear action
    const clearButton = document.getElementById('filter-magic-wand');
    if (clearButton) {
      clearButton.style.transform = 'scale(0.8) rotate(180deg)';
      setTimeout(() => {
        clearButton.style.transform = 'scale(1) rotate(0deg)';
      }, 200);
    }

    // Clear all filters
    setLocation("");
    setPropertyType("");
    setMinPrice(0);
    setMaxPrice(null);
    setIsMaxPriceActive(false);
    setAreaRange([0, 1000]);
    setBedrooms(undefined);
    setBathrooms(undefined);
    setGarages(undefined);
    setFloors(undefined);
    setSelectedAmenities([]);
    setShowAdvancedFilters(false);

    // Update URL to remove query parameters
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());

    // Trigger search with cleared filters
    handleSearch();
  };

  useImperativeHandle(ref, () => ({
    clearFilters: handleClearFilters
  }));

  const locationOptions = useMemo(() => {
    return transformLocationsToOptions(locations, getTranslatedText);
  }, [locations, getTranslatedText]);

  const amenityOptions = useMemo(() => {
    if (!amenities) return [];

    return amenities.map((amenity) => ({
      value: amenity.id.toString(),
      label: getTranslatedAmenityName(amenity.name, t),
    })) as ComboboxOption[];
  }, [amenities, t]);

  const PROPERTY_TYPES = useMemo(() => [
    { value: 'HOUSE', label: t('filters.property_type.house') },
    { value: 'APARTMENT', label: t('filters.property_type.apartment') },
    { value: 'VILLA', label: t('filters.property_type.villa') },
    { value: 'STUDIO', label: t('filters.property_type.studio') },
    { value: 'MANSION', label: t('filters.property_type.mansion') },
    { value: 'LAND', label: t('filters.property_type.land') },
    { value: 'COMMERCIAL', label: t('filters.property_type.commercial') },
    { value: 'OFFICE', label: t('filters.property_type.office') },
    { value: 'GARAGE', label: t('filters.property_type.garage') },
  ] as ComboboxOption[], [t]);

  const handleSearch = () => {
    onSearch({
      location: location || undefined,
      propertyType: propertyType || undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: isMaxPriceActive && maxPrice !== null ? maxPrice : undefined,
      minArea: areaRange[0] > 0 ? areaRange[0] : undefined,
      maxArea: areaRange[1] > 0 ? areaRange[1] : undefined,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      garages: garages || undefined,
      floors: floors || undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      websiteFocus: websiteFocus,
    });
    // Close the advanced filters panel after search
    setShowAdvancedFilters(false);
  };

  // Auto-trigger search when main filters change
  React.useEffect(() => {
    if (!showAdvancedFilters) {
      handleSearch();
    }
  }, [location, propertyType]);

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Get active filter labels for display
  const getActiveFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (location) {
      const locationOption = locationOptions.find(opt => opt.value === location);
      labels.push(locationOption?.label || location);
    }
    if (propertyType) {
      const typeOption = PROPERTY_TYPES.find(opt => opt.value === propertyType);
      labels.push(typeOption?.label || propertyType);
    }
    if (minPrice > 0 || (isMaxPriceActive && maxPrice !== null)) {
      labels.push(t('filters.price_range.title'));
    }
    const maxArea = 1000;
    if (areaRange[0] > 0 || areaRange[1] < maxArea) {
      labels.push(t('filters.area_range.title'));
    }
    if (bedrooms !== undefined) {
      labels.push(`${bedrooms} ${t('filters.bedrooms.title')}`);
    }
    if (bathrooms !== undefined) {
      labels.push(`${bathrooms} ${t('filters.bathrooms.title')}`);
    }
    if (garages !== undefined) {
      labels.push(`${garages} ${t('filters.garages.title')}`);
    }
    if (floors !== undefined) {
      labels.push(`${floors} ${t('filters.floors.title')}`);
    }
    selectedAmenities.forEach(amenityId => {
      const amenityOption = amenityOptions.find(opt => opt.value === amenityId);
      if (amenityOption) {
        labels.push(amenityOption.label);
      }
    });
    return labels;
  }, [location, propertyType, minPrice, isMaxPriceActive, maxPrice, areaRange, bedrooms, bathrooms, garages, floors, selectedAmenities, locationOptions, PROPERTY_TYPES, amenityOptions, t, websiteFocus]);

  return (
    <div className="w-full px-3 space-y-0">
      {/* Filter Row */}
      <div className="max-w-7xl mx-auto relative" ref={filterRef}>
        {/* Filter Magic Wand - Floating Clear Button */}
        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute -top-[20px] -right-[18px] z-30"
            >
              <motion.button
                id="filter-magic-wand"
                onClick={handleClearFilters}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white"
                title={`Clear ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''}`}
              >
                <Eraser className="w-4 h-4" />

                {/* Filter count badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </motion.div>

                {/* Tooltip showing active filters */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Active Filters:</span>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {getActiveFilterLabels.slice(0, 5).map((label, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <div className="w-1 h-1 bg-primary-400 rounded-full"></div>
                        <span className="truncate">{label}</span>
                      </div>
                    ))}
                    {getActiveFilterLabels.length > 5 && (
                      <div className="text-gray-400 text-xs">
                        +{getActiveFilterLabels.length - 5} more
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-2 pt-2 border-t border-gray-700">
                    <span className="text-yellow-400 font-medium">Click to clear all</span>
                  </div>
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="bg-white/90 backdrop-blur-sm border border-t-0 border-gray-100 shadow-lg rounded-xl pt-6 pb-5 px-5">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Location Filter */}
            <Combobox
              options={locationOptions}
              value={location}
              onValueChange={setLocation}
              placeholder={t('filters.location.anywhere')}
              searchPlaceholder={t('filters.location.search_placeholder')}
              emptyText={t('filters.location.empty_text')}
              className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:border-primary-500 transition-colors text-xs h-12"
              variant="input"
              startIcon={<MapPin className="w-4 h-4 text-gray-500" />}
            />

            {/* Property Type Filter */}
            <Combobox
              options={PROPERTY_TYPES}
              value={propertyType}
              onValueChange={setPropertyType}
              placeholder={t('filters.property_type.any_type')}
              searchPlaceholder={t('filters.property_type.search_placeholder')}
              emptyText={t('filters.property_type.empty_text')}
              className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:border-primary-500 transition-colors text-xs h-12"
              variant="input"
              startIcon={<Home className="w-4 h-4 text-gray-500" />}
            />


          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-center mt-3">
            <Button
              variant="ghost"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 relative text-xs"
            >
              {showAdvancedFilters ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  {t('filters.advanced.hide')}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  {t('filters.advanced.show_more')}
                </>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAdvancedFilters
            ? "max-h-[2000px] opacity-100 mt-6 pt-6 border-t border-gray-100"
            : "max-h-0 opacity-0 mt-0 pt-0 border-t-0"
            }`}>
            <div className="space-y-6">
              {/* Price Range & Area Range */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary-500" />
                    {t('filters.price_range.title')} {t('filters.price_range.total')}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Min Price Input */}
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:border-primary-500 transition-colors h-12">
                      <span className="text-xs font-medium text-gray-600">{t('filters.price_range.min')}</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => {
                          const newMinPrice = parseInt(e.target.value) || 0;
                          setMinPrice(newMinPrice);
                          // Auto-adjust max price if it becomes less than min price
                          if (isMaxPriceActive && maxPrice !== null && maxPrice < newMinPrice) {
                            setMaxPrice(newMinPrice);
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                        className="flex-1 bg-transparent border-none shadow-none h-auto p-0 text-xs focus:ring-0 focus:border-none rounded-none"
                      />
                      <span className="text-xs font-medium text-gray-500">{t('filters.price_range.currency')}</span>
                    </div>

                    {/* Max Price Input */}
                    <div 
                      className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl transition-all h-12 cursor-pointer ${
                        isMaxPriceActive 
                          ? 'border-gray-200 bg-white hover:border-primary-500' 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        if (!isMaxPriceActive) {
                          setIsMaxPriceActive(true);
                          // Set smart default based on min price and website focus
                          const maxPriceLimit = getPriceRange()[1];
                          const smartDefault = Math.min(minPrice + 500000, maxPriceLimit);
                          setMaxPrice(smartDefault);
                        }
                      }}
                    >
                      <span className={`text-xs font-medium ${isMaxPriceActive ? 'text-gray-600' : 'text-gray-400'}`}>
                        {t('filters.price_range.max')}
                      </span>
                      {isMaxPriceActive ? (
                        <Input
                          type="number"
                          placeholder={getPriceRange()[1].toString()}
                          value={maxPrice || ''}
                          onChange={(e) => {
                            const newMaxPrice = parseInt(e.target.value);
                            if (newMaxPrice && newMaxPrice >= minPrice) {
                              setMaxPrice(newMaxPrice);
                            } else if (!e.target.value) {
                              setMaxPrice(null);
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          onBlur={(e) => {
                            if (!e.target.value || parseInt(e.target.value) < minPrice) {
                              setMaxPrice(null);
                              setIsMaxPriceActive(false);
                            }
                          }}
                          className="flex-1 bg-transparent border-none shadow-none h-auto p-0 text-xs focus:ring-0 focus:border-none rounded-none"
                        />
                      ) : (
                        <span className="flex-1 text-xs text-gray-400">
                          {t('filters.price_range.no_limit')}
                        </span>
                      )}
                      <span className={`text-xs font-medium ${isMaxPriceActive ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t('filters.price_range.currency')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Area Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-500" />
                    {t('filters.area_range.title')}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:border-primary-500 transition-colors h-12">
                      <span className="text-xs font-medium text-gray-600">{t('filters.area_range.min')}</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={areaRange[0]}
                        onChange={(e) => setAreaRange([parseInt(e.target.value) || 0, areaRange[1]])}
                        onFocus={(e) => e.target.select()}
                        className="flex-1 bg-transparent border-none shadow-none h-auto p-0 text-xs focus:ring-0 focus:border-none rounded-none"
                      />
                      <span className="text-xs font-medium text-gray-500">{t('filters.area_range.unit')}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:border-primary-500 transition-colors h-12">
                      <span className="text-xs font-medium text-gray-600">{t('filters.area_range.max')}</span>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={areaRange[1]}
                        onChange={(e) => setAreaRange([areaRange[0], parseInt(e.target.value) || 1000])}
                        onFocus={(e) => e.target.select()}
                        className="flex-1 bg-transparent border-none shadow-none h-auto p-0 text-xs focus:ring-0 focus:border-none rounded-none"
                      />
                      <span className="text-xs font-medium text-gray-500">{t('filters.area_range.unit')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bedrooms */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-primary-500" />
                    <Label className="text-sm font-semibold text-gray-900">{t('filters.bedrooms.title')}</Label>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, '5+'].map((num) => (
                      <Button
                        key={num}
                        variant={bedrooms === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBedrooms(bedrooms === num ? undefined : num as number)}
                        className={`flex-1 h-10 text-xs ${bedrooms === num
                          ? "bg-primary-500 text-white border-primary-500"
                          : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                          }`}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-primary-500" />
                    <Label className="text-sm font-semibold text-gray-900">{t('filters.bathrooms.title')}</Label>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, '4+'].map((num) => (
                      <Button
                        key={num}
                        variant={bathrooms === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBathrooms(bathrooms === num ? undefined : num as number)}
                        className={`flex-1 h-10 text-xs ${bathrooms === num
                          ? "bg-primary-500 text-white border-primary-500"
                          : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                          }`}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Garages & Floors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Garages */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary-500" />
                    <Label className="text-sm font-semibold text-gray-900">{t('filters.garages.title')}</Label>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2, '3+'].map((num) => (
                      <Button
                        key={num}
                        variant={garages === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGarages(garages === num ? undefined : num as number)}
                        className={`flex-1 h-10 text-xs ${garages === num
                          ? "bg-primary-500 text-white border-primary-500"
                          : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                          }`}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Floors */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-500" />
                    <Label className="text-sm font-semibold text-gray-900">{t('filters.floors.title')}</Label>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, '4+'].map((num) => (
                      <Button
                        key={num}
                        variant={floors === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFloors(floors === num ? undefined : num as number)}
                        className={`flex-1 h-10 text-xs ${floors === num
                          ? "bg-primary-500 text-white border-primary-500"
                          : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                          }`}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary-500" />
                  <Label className="text-sm font-semibold text-gray-900">{t('filters.amenities.title')}</Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {amenityOptions.slice(0, 8).map((amenity) => (
                    <label
                      key={amenity.value}
                      className={`bg-white flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAmenities.includes(amenity.value)
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                        }`}
                    >
                      <Checkbox
                        id={amenity.value}
                        checked={selectedAmenities.includes(amenity.value)}
                        onCheckedChange={() => handleAmenityToggle(amenity.value)}
                        className="bg-white data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {amenity.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search Button - Only show when advanced filters are open */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAdvancedFilters
            ? "max-h-16 opacity-100 mt-5"
            : "max-h-0 opacity-0 mt-0"
            }`}>
            <div className="flex justify-center">
              <Button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium text-xs"
              >
                <Search className="w-3 h-3 mr-2" />
                {t('filters.search.button')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SalePropertiesFilter;

