"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import Routes from "@/modules/properties/defs/routes";
import { useTranslation } from "react-i18next";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface CategoriesBannerProps {
  websiteFocus: WEBSITE_FOCUS;
}

const CategoriesBanner = ({ websiteFocus }: CategoriesBannerProps) => {
  const router = useRouter();
  const { t } = useTranslation(['landing']);

  const propertyTypes = [
    {
      image: "/real-estate-villa.jpg",
      title: t('landing:categories.property_types.villas.title'),
      description: t('landing:categories.property_types.villas.description'),
      type: "VILLA",
    },
    {
      image: "/real-estate-apartment.jpg",
      title: t('landing:categories.property_types.apartments.title'),
      description: t('landing:categories.property_types.apartments.description'),
      type: "APARTMENT",
    },
    {
      image: "/real-estate-studio.jpg",
      title: t('landing:categories.property_types.studios.title'),
      description: t('landing:categories.property_types.studios.description'),
      type: "STUDIO",
    },
  ];

  const getListingRoute = () => {
    switch (websiteFocus) {
      case WEBSITE_FOCUS.DAILY_RENT:
        return Routes.DailyRent.ReadAll;
      case WEBSITE_FOCUS.RENT:
        return Routes.MonthlyRent.ReadAll;
      case WEBSITE_FOCUS.SELLING:
        return Routes.HomeSale.ReadAll;
      default:
        return Routes.DailyRent.ReadAll;
    }
  };

  const handlePropertyTypeClick = (propertyType: string) => {
    try {
      const baseRoute = getListingRoute();
      const params = new URLSearchParams();
      params.append('propertyType', propertyType);
      
      const listingUrl = `${baseRoute}?${params.toString()}`;
      router.push(listingUrl);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="w-full bg-white py-20">
      <div className="text-center max-w-2xl mx-auto px-4 mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(poppins.className, "md:text-5xl text-4xl font-bold text-primary-600")}
        >
          {t('landing:categories.title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={cn(poppins.className, "text-gray-600 mt-4 max-w-2xl mx-auto text-lg")}
        >
          {t('landing:categories.subtitle')}
        </motion.p>
      </div>

      {/* Property Cards Grid */}
      <div className="max-w-screen-xl mx-auto px-12 md:px-2 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-16">
        {propertyTypes.map((item, index) => (
          <div
            key={index}
            onClick={() => handlePropertyTypeClick(item.type)}
            className={cn(
              "group relative overflow-hidden rounded-xl shadow-lg cursor-pointer",
              "hover:shadow-2xl transition-all duration-300",
              "border border-white/10 hover:border-primarySite/20"
            )}
          >
            {/* Image */}
            <div className="relative h-[550px] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-sm h-32 flex flex-col justify-center">
              <h3
                className={cn(
                  poppins.className,
                  "text-2xl font-bold text-slate-900 mb-2"
                )}
              >
                {item.title}
              </h3>
              <p
                className={cn(
                  poppins.className,
                  "text-slate-600 text-sm leading-relaxed line-clamp-2"
                )}
              >
                {item.description}
              </p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesBanner;
