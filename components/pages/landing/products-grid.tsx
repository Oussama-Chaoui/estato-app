"use client";
import { cn } from "@/components/lib/utils/twMerge";
import PropertyItemListing from "@/modules/properties/components/partials/PropertyItemListing";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { Property } from "@/modules/properties/defs/types";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import PropertyRoutes from "@/modules/properties/defs/routes";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface ProductsGridProps {
  properties: Property[];
  websiteFocus?: WEBSITE_FOCUS;
}

const ProductsGrid = ({ properties, websiteFocus }: ProductsGridProps) => {
  const { t } = useTranslation('landing');

  // Get the correct route based on website focus
  const getPropertyRoute = (propertyId: number) => {
    switch (websiteFocus) {
      case WEBSITE_FOCUS.DAILY_RENT:
        return PropertyRoutes.DailyRent.ReadOne.replace('{id}', propertyId.toString());
      case WEBSITE_FOCUS.RENT:
        return PropertyRoutes.MonthlyRent.ReadOne.replace('{id}', propertyId.toString());
      case WEBSITE_FOCUS.SELLING:
        return PropertyRoutes.HomeSale.ReadOne.replace('{id}', propertyId.toString());
      default:
        return PropertyRoutes.DailyRent.ReadOne.replace('{id}', propertyId.toString());
    }
  };

  // Get the correct listing route based on website focus
  const getListingRoute = () => {
    switch (websiteFocus) {
      case WEBSITE_FOCUS.DAILY_RENT:
        return PropertyRoutes.DailyRent.ReadAll;
      case WEBSITE_FOCUS.RENT:
        return PropertyRoutes.MonthlyRent.ReadAll;
      case WEBSITE_FOCUS.SELLING:
        return PropertyRoutes.HomeSale.ReadAll;
      case WEBSITE_FOCUS.ALL:
        return PropertyRoutes.DailyRent.ReadAll;
      default:
        return PropertyRoutes.DailyRent.ReadAll;
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center md:px-16 px-10 py-12 w-full bg-white">
      <div className="text-center text-black flex flex-col">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(poppins.className, "md:text-5xl text-4xl font-bold text-primary-600")}
        >
          {t('products_grid.title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={cn(poppins.className, "text-gray-600 mt-4 max-w-2xl mx-auto text-lg")}
        >
          {t('products_grid.subtitle')}
        </motion.p>
      </div>
      <div className="w-full flex flex-wrap gap-10 justify-center max-w-screen-xl">
        {properties.map((property, index) => (
          <Link
            key={property.id || index}
            href={getPropertyRoute(property.id)}
            className="block w-full sm:max-w-[320px]"
          >
            <PropertyItemListing property={property} websiteFocus={websiteFocus} />
          </Link>
        ))}
      </div>
      <Link
        href={getListingRoute()}
        className={cn(
          poppins.className,
          "w-[245px] h-[48px] mt-16 bg-white flex items-center justify-center focus:outline-none text-primary-500 font-semibold border-[2px] border-primary-500 hover:bg-primary-50 transition-colors"
        )}
      >
        {t('products_grid.view_more')}
      </Link>
    </div>
  );
};

export default ProductsGrid;
