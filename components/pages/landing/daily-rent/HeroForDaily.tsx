import React, { useState, useMemo } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Combobox } from "@/components/ui/combobox";
import useLocations from "@/modules/locations/hooks/api/useLocations";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTranslatedText } from "@/modules/properties/utils/translations";
import { transformLocationsToOptions } from "@/modules/locations/utils/locationUtils";

const HeroForDaily = () => {
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const router = useRouter();
  const { t } = useTranslation(['landing']);

  const { items: locations } = useLocations({ fetchItems: true, pageSize: 'all' });
  const getTranslatedText = useTranslatedText();

  const locationOptions = useMemo(() => {
    return transformLocationsToOptions(locations, getTranslatedText);
  }, [locations, getTranslatedText]);

  const handleSearch = async () => {
    try {
      // Build URL parameters
      const params = new URLSearchParams();

      if (location) {
        params.append('location', location);
      }

      if (dateRange?.from) {
        params.append('checkIn', dateRange.from.toISOString().split('T')[0]);
      }

      if (dateRange?.to) {
        params.append('checkOut', dateRange.to.toISOString().split('T')[0]);
      }

      // Navigate to listing page with parameters
      const listingUrl = `/listing/daily-rent${params.toString() ? `?${params.toString()}` : ''}`;
      router.push(listingUrl);

    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Enhanced Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden ">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8 md:px-4 py-20 ">
        <div className="mx-auto text-center w-full">
          {/* Hero Text */}
          <div className="mb-20 space-y-8">
            <div className="inline-flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <span className="text-xs text-white/90 font-medium">{t('landing:hero.daily_rent.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-relaxed">
              {t('landing:hero.daily_rent.title')}
              <span className="block bg-gradient-to-r from-primary-400 via-primary-300 to-primary-200 bg-clip-text text-transparent">
                {t('landing:hero.daily_rent.title_highlight')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              {t('landing:hero.daily_rent.subtitle')}
            </p>
          </div>

          {/* Enhanced Search Form */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-white/20 mx-auto w-full max-w-4xl">
            <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-2">

              {/* Location Combobox */}
              <div className="p-3">
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">{t('landing:hero.daily_rent.search.where_label')}</Label>
                <div className="relative">
                  <Combobox
                    options={locationOptions}
                    value={location}
                    onValueChange={setLocation}
                    placeholder={t('landing:hero.daily_rent.search.where_placeholder')}
                    searchPlaceholder={t('landing:hero.daily_rent.search.where_search_placeholder')}
                    emptyText={t('landing:hero.daily_rent.search.where_empty_text')}
                    variant="input"
                    className="h-10 text-sm border-0 bg-white/80 hover:bg-white focus:bg-white transition-all duration-300 rounded-xl shadow-sm text-gray-700"
                    startIcon={<MapPin className="w-4 h-4 text-gray-500" />}
                  />
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="p-3 min-w-0">
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">{t('landing:hero.daily_rent.search.when_label')}</Label>
                <div className="relative">
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={setDateRange}
                    placeholder={t('landing:hero.daily_rent.search.when_placeholder')}
                    className="h-10 text-sm border-0 bg-white/80 focus:bg-white transition-all duration-300 rounded-xl shadow-sm w-full"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="p-3 pt-1">
              <Button
                onClick={handleSearch}
                size="lg"
                className="w-full lg:w-auto h-12 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-10"
              >
                <Search className="w-4 h-4 mr-2" />
                {t('landing:hero.daily_rent.search.search_button')}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
            {[
              { number: "500+", label: t('landing:hero.daily_rent.stats.properties') },
              { number: "10K+", label: t('landing:hero.daily_rent.stats.happy_guests') },
              { number: "20+", label: t('landing:hero.daily_rent.stats.cities') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-white/70 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroForDaily;