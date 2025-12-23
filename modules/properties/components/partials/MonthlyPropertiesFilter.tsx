import React, { useState, useMemo, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, ChevronDown, ChevronUp, Home, Bed, Bath, Star, Wallet, Sofa, ChevronsUpDown, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useLocations from "@/modules/locations/hooks/api/useLocations";
import useAmenities from "@/modules/amenities/hooks/api/useAmenities";
import useProperties from "@/modules/properties/hooks/api/useProperties";
import { Label } from "@/components/ui/label";
import { FURNISHING_STATUS } from "../../defs/types";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { useTranslation } from "next-i18next";
import { getTranslatedAmenityName } from "@/modules/properties/utils/amenities";
import { useTranslatedText } from "@/modules/properties/utils/translations";
import { transformLocationsToOptions } from "@/modules/locations/utils/locationUtils";
import { motion, AnimatePresence } from "framer-motion";

interface MonthlyPropertiesFilterProps {
  onSearch: (params: {
    location?: string;
    availableFrom?: Date;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    furnishingStatus?: FURNISHING_STATUS;
    websiteFocus?: WEBSITE_FOCUS;
  }) => void;
  initialLocation?: string;
  initialAvailableFrom?: string;
  initialPropertyType?: string;
  initialFurnishingStatus?: FURNISHING_STATUS;
  websiteFocus?: WEBSITE_FOCUS;
}

const MonthlyPropertiesFilter = forwardRef<any, MonthlyPropertiesFilterProps>(({
  onSearch,
  initialLocation,
  initialAvailableFrom,
  initialPropertyType,
  initialFurnishingStatus,
  websiteFocus = WEBSITE_FOCUS.RENT
}, ref) => {
  const { t } = useTranslation(['properties', 'amenities']);
  const [location, setLocation] = useState(initialLocation || "");
  const [availableFrom, setAvailableFrom] = useState<Date | undefined>(
    initialAvailableFrom ? new Date(initialAvailableFrom) : undefined
  );
  const [propertyType, setPropertyType] = useState(initialPropertyType || "");
  const [furnishingStatus, setFurnishingStatus] = useState<FURNISHING_STATUS | undefined>(initialFurnishingStatus);

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
        return [0, 20000];
    }
  };

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [isMaxPriceActive, setIsMaxPriceActive] = useState(false);
  const [bedrooms, setBedrooms] = useState<number>();
  const [bathrooms, setBathrooms] = useState<number>();
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
    if (availableFrom) count++;
    if (propertyType) count++;

    // Advanced filters (only counted when not in advanced panel)
    if (!showAdvancedFilters) {
      if (furnishingStatus) count++;
      if (minPrice > 0) count++;
      if (isMaxPriceActive && maxPrice !== null) count++;
      if (bedrooms !== undefined) count++;
      if (bathrooms !== undefined) count++;
      // Count each selected amenity as a separate filter
      count += selectedAmenities.length;
    }

    return count;
  }, [location, availableFrom, propertyType, furnishingStatus, minPrice, isMaxPriceActive, maxPrice, bedrooms, bathrooms, selectedAmenities, websiteFocus, showAdvancedFilters]);

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
    { value: 'COMMERCIAL', label: t('filters.property_type.commercial') },
    { value: 'OFFICE', label: t('filters.property_type.office') },
    { value: 'GARAGE', label: t('filters.property_type.garage') },
  ] as ComboboxOption[], [t]);

  const FURNISHING_OPTIONS = useMemo(() => [
    { value: FURNISHING_STATUS.FURNISHED, label: t('filters.furnishing_status.furnished') },
    { value: FURNISHING_STATUS.SEMI_FURNISHED, label: t('filters.furnishing_status.semi_furnished') },
    { value: FURNISHING_STATUS.UNFURNISHED, label: t('filters.furnishing_status.unfurnished') },
  ] as ComboboxOption[], [t]);

  // Get active filter labels for display
  const getActiveFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (location) {
      const locationOption = locationOptions.find(opt => opt.value === location);
      labels.push(locationOption?.label || location);
    }
    if (availableFrom) {
      labels.push(t('filters.dates.available_from'));
    }
    if (propertyType) {
      const typeOption = PROPERTY_TYPES.find(opt => opt.value === propertyType);
      labels.push(typeOption?.label || propertyType);
    }
    if (furnishingStatus) {
      const furnishingOption = FURNISHING_OPTIONS.find(opt => opt.value === furnishingStatus);
      labels.push(furnishingOption?.label || furnishingStatus);
    }
    if (minPrice > 0 || (isMaxPriceActive && maxPrice !== null)) {
      labels.push(t('filters.price_range.title'));
    }
    if (bedrooms !== undefined) {
      labels.push(`${bedrooms} ${t('filters.bedrooms.title')}`);
    }
    if (bathrooms !== undefined) {
      labels.push(`${bathrooms} ${t('filters.bathrooms.title')}`);
    }
    selectedAmenities.forEach(amenityId => {
      const amenityOption = amenityOptions.find(opt => opt.value === amenityId);
      if (amenityOption) {
        labels.push(amenityOption.label);
      }
    });
    return labels;
  }, [location, availableFrom, propertyType, furnishingStatus, minPrice, isMaxPriceActive, maxPrice, bedrooms, bathrooms, selectedAmenities, locationOptions, PROPERTY_TYPES, FURNISHING_OPTIONS, amenityOptions, t, websiteFocus]);

  const handleSearch = () => {
    onSearch({
      location: location || undefined,
      availableFrom: availableFrom || undefined,
      propertyType: propertyType || undefined,
      furnishingStatus: furnishingStatus || undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: isMaxPriceActive && maxPrice !== null ? maxPrice : undefined,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
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
  }, [location, availableFrom, propertyType, furnishingStatus]);

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

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
    setAvailableFrom(undefined);
    setPropertyType("");
    setFurnishingStatus(undefined);
    setMinPrice(0);
    setMaxPrice(null);
    setIsMaxPriceActive(false);
    setBedrooms(undefined);
    setBathrooms(undefined);
    setSelectedAmenities([]);
    setShowAdvancedFilters(false);

    // Update URL to remove query parameters
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());

    // Trigger search with cleared filters
    handleSearch();
  };

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


          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Location Filter */}
            <Combobox
              options={locationOptions}
              value={location}
              onValueChange={setLocation}
              placeholder={t('filters.location.placeholder')}
              searchPlaceholder={t('filters.location.search_placeholder')}
              emptyText={t('filters.location.empty_text')}
              className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:border-primary-500 transition-colors text-xs h-12"
              variant="input"
              startIcon={<MapPin className="w-4 h-4 text-gray-500" />}
              endIcon={<ChevronsUpDown className="w-4 h-4 text-gray-500" />}
            />

            {/* Available From Date Filter */}
            <div className="relative">
              <DatePicker
                date={availableFrom}
                onDateChange={setAvailableFrom}
                placeholder={t('filters.dates.available_from')}
                className="w-full h-12 px-3 py-2.5 border border-gray-200 rounded-xl bg-white/50 hover:bg-white hover:border-primary-500 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 [&>button]:bg-transparent [&>button]:border-none [&>button]:shadow-none [&>button]:p-0 [&>button]:text-xs [&>button]:justify-start [&>button]:hover:bg-transparent [&>button]:focus:bg-transparent [&>button]:w-full [&>button]:h-full [&>button]:text-gray-900 [&>button]:hover:text-gray-900 [&>button]:focus:text-gray-900 [&>button_svg]:text-gray-500 [&>button:hover_svg]:text-gray-500 [&>button:focus_svg]:text-gray-500"
              />
            </div>

            {/* Property Type Filter */}
            <Combobox
              options={PROPERTY_TYPES}
              value={propertyType}
              onValueChange={setPropertyType}
              placeholder={t('filters.property_type.placeholder')}
              searchPlaceholder={t('filters.property_type.search_placeholder')}
              emptyText={t('filters.property_type.empty_text')}
              className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:border-primary-500 transition-colors text-xs h-12"
              variant="input"
              startIcon={<Home className="w-4 h-4 text-gray-500" />}
              endIcon={<ChevronsUpDown className="w-4 h-4 text-gray-500" />}
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
              {/* Furnishing Status & Price Range */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Furnishing Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sofa className="w-4 h-4 text-primary-500" />
                    <Label className="text-sm font-semibold text-gray-900">{t('filters.furnishing_status.title')}</Label>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {FURNISHING_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant={furnishingStatus === option.value ? "default" : "outline"}
                        onClick={() => setFurnishingStatus(furnishingStatus === option.value ? undefined : option.value as FURNISHING_STATUS)}
                        className={`justify-start h-10 text-xs ${furnishingStatus === option.value
                          ? "bg-primary-500 text-white border-primary-500"
                          : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                          }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary-500" />
                    {t('filters.price_range.title')} {t('filters.price_range.per_month')}
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
                          const smartDefault = Math.min(minPrice + 5000, maxPriceLimit);
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

export default MonthlyPropertiesFilter;




