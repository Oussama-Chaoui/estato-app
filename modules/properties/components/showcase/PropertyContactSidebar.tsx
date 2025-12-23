"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/components/lib/utils/twMerge";
import { Property as PropertyType } from "@/modules/properties/defs/types";
import { Agent } from "@/modules/agents/defs/types";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import PropertyBookingModal from "./PropertyBookingModal";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { differenceInDays, format } from "date-fns";
import { Calendar, DollarSign, CalendarDays } from "lucide-react";
import { getPriceDisplay } from "@/modules/properties/utils/priceDisplay";
import { useTranslation } from "next-i18next";
import useUtils from "@/common/hooks/useUtils";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface PropertyContactSidebarProps {
  property: PropertyType;
  websiteFocus: WEBSITE_FOCUS;
}

const PropertyContactSidebar = ({ property, websiteFocus }: PropertyContactSidebarProps) => {
  const { t } = useTranslation(['properties', 'common']);
  const { getDateFnsLocale } = useUtils();
  const [selectedAgent, setSelectedAgent] = useState<Agent>();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Format date with proper locale
  const formatDate = (date: Date, formatString: string) => {
    return format(date, formatString, { locale: getDateFnsLocale() })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  // Calculate total price for daily renting
  const calculateTotalPrice = () => {
    if (!dateRange?.from || !dateRange?.to || !property.dailyPriceEnabled) {
      return null;
    }

    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    const totalPrice = days * property.dailyPrice;
    return { days, totalPrice };
  };

  const priceCalculation = calculateTotalPrice();

  return (
    <div
      className="space-y-8
         md:sticky md:top-24
         md:self-start
         h-max"
    >
      {/* Price Display */}
      <div className="bg-primary-500/90 text-white px-6 py-4 rounded-xl">
        <div className="text-sm font-medium opacity-90 mb-1">
          {(() => {
            switch (websiteFocus) {
              case WEBSITE_FOCUS.DAILY_RENT:
                return property.dailyPriceEnabled ? t('showcase.contact.nightly_rate') : t('showcase.contact.monthly_rate');
              case WEBSITE_FOCUS.RENT:
                return property.monthlyPriceEnabled ? t('showcase.contact.monthly_rate') : t('showcase.contact.nightly_rate');
              case WEBSITE_FOCUS.SELLING:
              case WEBSITE_FOCUS.ALL:
              default:
                return t('showcase.contact.sale_price');
            }
          })()}
        </div>
        <div className="text-2xl font-bold">
          {(() => {
            const priceData = getPriceDisplay({
              websiteFocus,
              salePrice: property.salePrice,
              monthlyPrice: property.monthlyPrice,
              dailyPrice: property.dailyPrice,
              monthlyPriceEnabled: property.monthlyPriceEnabled,
              dailyPriceEnabled: property.dailyPriceEnabled,
              currency: property.currency || 'MAD',
              t
            });

            return (
              <span>
                {priceData.price}
                {priceData.timeUnit && (
                  <span className="text-sm">{priceData.timeUnit}</span>
                )}
              </span>
            );
          })()}
        </div>
      </div>
      {websiteFocus === WEBSITE_FOCUS.DAILY_RENT ? (
        <div className="space-y-6">
          {/* Availability Section */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <CalendarDays className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{t('showcase.availability.select_stay')}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{t('showcase.availability.choose_dates')}</p>
              </div>
            </div>
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
              placeholder={t('showcase.availability.date_placeholder')}
              hideIcon={true}
              className="[&_button]:min-h-[48px] [&_button]:h-auto [&_button]:py-3 [&_button]:text-sm [&_button]:border-gray-300 [&_button]:bg-white [&_button]:hover:bg-gray-50 [&_button]:focus:bg-white [&_button]:focus:ring-2 [&_button]:focus:ring-primary-500/20 [&_button]:focus:border-primary-500 [&_button]:transition-all [&_button]:duration-200 [&_button]:break-words"
            />
          </div>

          {/* Price Calculation */}
          {priceCalculation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary-50 via-primary-100/80 to-primary-50 p-5 rounded-xl border border-primary-200/60 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-200 rounded-lg">
                  <DollarSign className="w-4 h-4 text-primary-700" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary-900">{t('showcase.contact.price_breakdown')}</h4>
                  <p className="text-xs text-primary-600 mt-0.5">{t('showcase.contact.stay_details')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 text-sm">
                  <span className="text-gray-600 break-words">
                    {formatDate(dateRange!.from!, "MMM dd")} - {formatDate(dateRange!.to!, "MMM dd, yyyy")}
                  </span>
                  <span className="text-gray-800 font-medium">{priceCalculation.days} {t('showcase.contact.nights')}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{t('showcase.contact.daily_rate')}</span>
                  <span className="text-gray-800 font-medium">
                    {property.dailyPrice.toLocaleString()} MAD {t('common:price.per_night')}
                  </span>
                </div>

                <div className="border-t border-primary-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-primary-800">{t('showcase.contact.total')}</span>
                    <span className="text-xl font-bold text-primary-600">
                      {priceCalculation.totalPrice.toLocaleString()} MAD
                    </span>
                  </div>
                  <p className="text-xs text-primary-600 mt-1">
                    {t('showcase.contact.includes_fees')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Book Now Button */}
          <PropertyBookingModal property={property}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary-500 text-white py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-lg"
            >
              {t('showcase.contact.book_now')}
            </motion.button>
          </PropertyBookingModal>
        </div>
      ) : (
        /* Regular Contact Form for Selling/Renting */
        <>
          {/* Agent Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {property.agents.map((agent) => (
              <motion.div
                key={agent.id}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "p-3 rounded-lg border-2 cursor-pointer transition-all",
                  selectedAgent?.id === agent.id
                    ? "border-primary-500 bg-white/80 shadow-sm"
                    : "border-gray-200 hover:border-primary-300"
                )}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={agent.user.photo ?? "/agent_placeholder.webp"}
                      alt={agent.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <h3 className={cn(poppins.className, "font-medium text-gray-800 text-sm")}>
                      {agent.user.name}
                    </h3>
                    <p className="text-xs text-primary-500">
                      {agent.experience} {t('showcase.contact.years_experience')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Combined Form */}
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
            >
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-800">
                  {t('showcase.contact.contact_agent')} {selectedAgent.user.name}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedAgent.agencyName && `${selectedAgent.agencyName} • `}
                  {t('showcase.contact.speaks')}: {selectedAgent.languages.map(l => l.name).join(', ')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('showcase.contact.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    placeholder={t('showcase.contact.name_placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('showcase.contact.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    placeholder={t('showcase.contact.email_placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('showcase.contact.message')} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                    placeholder={t('showcase.contact.message_placeholder')}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-lg"
                >
                  {formSubmitted ? t('showcase.contact.message_sent') : t('showcase.contact.send_message')}
                </motion.button>
              </form>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyContactSidebar; 